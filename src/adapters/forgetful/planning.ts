import { stripVTControlCharacters } from "node:util";
import { errorMessage, sanitizeText } from "../../privacy.ts";
import {
  ForgetfulHttpTransport, ForgetfulHttpError, ForgetfulSchemaError,
  type ApiForgetfulClientOptions,
} from "../../http.ts";
import type { PlanningError, PlanningReader, PlanningResult } from
  "../../application/ports/planning.ts";
import type {
  PlanningCapability, PlanningPlan, PlanningPlanSummary, PlanningProject, PlanningTask,
  PlanningTaskRecord, PlanningTaskSummary,
} from "../../domain/planning.ts";

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid(field, "an object");
  return value as Record<string, unknown>;
}
function invalid(field: string, expected: string): never {
  throw new ForgetfulSchemaError(`Forgetful response field ${field} must be ${expected}`);
}
function integer(value: unknown, field: string, min = 1): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min)
    invalid(field, `an integer >= ${min}`);
  return value as number;
}
function string(value: unknown, field: string): string {
  if (typeof value !== "string") invalid(field, "a string");
  return value as string;
}
function nullableString(value: unknown, field: string): string | null {
  return value === null ? null : string(value, field);
}
function boolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") invalid(field, "a boolean");
  return value as boolean;
}
function choice<T extends string>(value: unknown, field: string, values: readonly T[]): T {
  if (!values.includes(value as T)) invalid(field, values.join(" | "));
  return value as T;
}
function parent(value: unknown, field: string, expected: number): number {
  if (integer(value, field) !== expected) invalid(field, `the requested ID ${expected}`);
  return expected;
}
function list<T extends { id: number }>(
  payload: unknown, key: string, parse: (value: unknown) => T,
): T[] {
  const data = object(payload, key);
  if (!Array.isArray(data[key])) invalid(key, "an array");
  const items = (data[key] as unknown[]).map(parse);
  if (integer(data.total, "total", 0) !== items.length) invalid("total", "the full list length");
  if (new Set(items.map((item) => item.id)).size !== items.length) invalid(key, "unique IDs");
  return items;
}

function taskRecord(data: Record<string, unknown>, planId: number): PlanningTaskRecord {
  return {
    id: integer(data.id, "task.id"), title: string(data.title, "task.title"),
    plan_id: parent(data.plan_id, "task.plan_id", planId),
    state: choice(data.state, "task.state", ["todo", "doing", "waiting", "done", "cancelled"]),
    priority: choice(data.priority, "task.priority", ["P0", "P1", "P2", "P3"]),
    assigned_agent: nullableString(data.assigned_agent, "task.assigned_agent"),
    version: integer(data.version, "task.version"),
  };
}

export class ApiPlanningReader implements PlanningReader {
  private readonly transport: ForgetfulHttpTransport;
  constructor(private readonly options: ApiForgetfulClientOptions & { secrets?: string[] }) {
    this.transport = new ForgetfulHttpTransport(options);
  }

  /** Redact both known patterns and configured literal secrets, then remove terminal controls. */
  sanitize(text: string): string {
    let value = text;
    for (const secret of [this.options.token, ...(this.options.secrets ?? [])]) {
      if (secret) value = value.split(secret).join("[redacted]");
    }
    value = stripVTControlCharacters(value).replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, "");
    for (const secret of [this.options.token, ...(this.options.secrets ?? [])]) {
      if (secret) value = value.split(secret).join("[redacted]");
    }
    return sanitizeText(value);
  }

  private clean<T>(value: T): T {
    if (typeof value === "string") return this.sanitize(value) as T;
    if (Array.isArray(value)) return value.map((item) => this.clean(item)) as T;
    if (value && typeof value === "object") return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, this.clean(item)]),
    ) as T;
    return value;
  }

  private async read<T>(
    action: () => Promise<T>, missing: "missing" | "unavailable" = "unavailable",
  ): Promise<PlanningResult<T>> {
    try { return { ok: true, value: this.clean(await action()) }; }
    catch (error) {
      const status = error instanceof ForgetfulHttpError ? error.status : undefined;
      let kind: PlanningError["kind"] = "transient";
      if (error instanceof ForgetfulSchemaError) kind = "invalid";
      else if (error instanceof Error && error.name === "AbortError") kind = "cancelled";
      else if (status === 401 || status === 403) kind = "denied";
      else if (status === 404 || status === 405) kind = missing;
      else if (status !== undefined && status < 500 && status !== 429) kind = "invalid";
      return { ok: false, error: this.clean({
        kind, message: errorMessage(error), status,
        responseBody: error instanceof ForgetfulHttpError ? error.responseBody : undefined,
      }) };
    }
  }

  capabilities(signal?: AbortSignal): Promise<PlanningResult<PlanningCapability>> {
    return this.read(async () => {
      let payload: unknown;
      try { payload = await this.transport.getDeployment("/.well-known", signal); }
      catch (error) {
        if (error instanceof ForgetfulHttpError && [404, 405].includes(error.status!))
          return "unknown";
        throw error;
      }
      const data = object(payload, "capabilities document");
      if (data.schema_version !== 1) return "unknown";
      if (data.capabilities === undefined) return "unknown";
      const capabilities = object(data.capabilities, "capabilities");
      if (capabilities.planning === undefined) return "unknown";
      return boolean(capabilities.planning, "capabilities.planning") ? "enabled" : "disabled";
    });
  }

  projects(signal?: AbortSignal): Promise<PlanningResult<PlanningProject[]>> {
    return this.read(async () => list(await this.transport.getJson("/projects", signal),
      "projects", (value) => {
        const data = object(value, "project");
        const repoName = nullableString(data.repo_name, "project.repo_name");
        // Sanitizing display text must never manufacture an exact repository match.
        const repo_name = repoName !== null && this.sanitize(repoName) !== repoName ?
          null : repoName;
        return { id: integer(data.id, "project.id"), name: string(data.name, "project.name"),
          repo_name };
      }));
  }

  plans(projectId: number, signal?: AbortSignal): Promise<PlanningResult<PlanningPlanSummary[]>> {
    return this.read(async () => list(await this.transport.getJson(
      `/plans?project_id=${integer(projectId, "projectId")}&status=active`, signal,
    ), "plans", (value) => {
      const data = object(value, "plan");
      return {
        id: integer(data.id, "plan.id"), title: string(data.title, "plan.title"),
        project_id: parent(data.project_id, "plan.project_id", projectId),
        status: choice(data.status, "plan.status", ["active"]),
        task_count: integer(data.task_count, "plan.task_count", 0),
      };
    }));
  }

  tasks(planId: number, signal?: AbortSignal): Promise<PlanningResult<PlanningTaskSummary[]>> {
    return this.read(async () => list(await this.transport.getJson(
      `/tasks?plan_id=${integer(planId, "planId")}`, signal,
    ), "tasks", (value) => {
      const data = object(value, "task");
      const criteria_met = integer(data.criteria_met, "task.criteria_met", 0);
      const criteria_total = integer(data.criteria_total, "task.criteria_total", 0);
      if (criteria_met > criteria_total) invalid("task.criteria_met", "<= criteria_total");
      return {
        ...taskRecord(data, planId), criteria_met, criteria_total,
        blocked: boolean(data.blocked, "task.blocked"),
      };
    }));
  }

  plan(
    planId: number, projectId: number, signal?: AbortSignal,
  ): Promise<PlanningResult<PlanningPlan>> {
    return this.read(async () => {
      const data = object(await this.transport.getJson(
        `/plans/${integer(planId, "planId")}`, signal,
      ), "plan");
      return {
        id: parent(data.id, "plan.id", planId), title: string(data.title, "plan.title"),
        project_id: parent(data.project_id, "plan.project_id", projectId),
        status: choice(data.status, "plan.status", ["draft", "active", "completed", "archived"]),
        task_count: integer(data.task_count, "plan.task_count", 0),
        goal: nullableString(data.goal, "plan.goal"),
        context: nullableString(data.context, "plan.context"),
      };
    }, "missing");
  }

  task(
    taskId: number, planId: number, signal?: AbortSignal,
  ): Promise<PlanningResult<PlanningTask>> {
    return this.read(async () => {
      const data = object(await this.transport.getJson(
        `/tasks/${integer(taskId, "taskId")}`, signal,
      ), "task");
      parent(data.id, "task.id", taskId);
      if (!Array.isArray(data.criteria)) invalid("task.criteria", "an array");
      const criteria = (data.criteria as unknown[]).map((value) => {
        const criterion = object(value, "criterion");
        return {
          id: integer(criterion.id, "criterion.id"),
          task_id: parent(criterion.task_id, "criterion.task_id", taskId),
          description: string(criterion.description, "criterion.description"),
          met: boolean(criterion.met, "criterion.met"),
          met_at: nullableString(criterion.met_at, "criterion.met_at"),
        };
      });
      if (new Set(criteria.map((item) => item.id)).size !== criteria.length)
        invalid("task.criteria", "unique IDs");
      if (!Array.isArray(data.dependency_ids)) invalid("task.dependency_ids", "an array");
      const dependency_ids = (data.dependency_ids as unknown[])
        .map((id) => integer(id, "task.dependency_ids"));
      if (new Set(dependency_ids).size !== dependency_ids.length || dependency_ids.includes(taskId))
        invalid("task.dependency_ids", "unique other task IDs");
      return { ...taskRecord(data, planId), description: nullableString(data.description,
        "task.description"), criteria, dependency_ids };
    }, "missing");
  }
}
