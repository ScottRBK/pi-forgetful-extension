export type PlanningCapability = "unknown" | "enabled" | "disabled";
export type PlanStatus = "draft" | "active" | "completed" | "archived";
export type TaskState = "todo" | "doing" | "waiting" | "done" | "cancelled";
export type TaskPriority = "P0" | "P1" | "P2" | "P3";

export interface PlanningProject {
  id: number;
  name: string;
  repo_name: string | null;
}

export interface PlanningPlanSummary {
  id: number;
  title: string;
  project_id: number;
  status: PlanStatus;
  task_count: number;
}

export interface PlanningPlan extends PlanningPlanSummary {
  goal: string | null;
  context: string | null;
}

export interface PlanningTaskRecord {
  id: number;
  title: string;
  plan_id: number;
  state: TaskState;
  priority: TaskPriority;
  assigned_agent: string | null;
  version: number;
}

export interface PlanningTaskSummary extends PlanningTaskRecord {
  criteria_met: number;
  criteria_total: number;
  blocked: boolean;
}

export interface PlanningCriterion {
  id: number;
  task_id: number;
  description: string;
  met: boolean;
  met_at: string | null;
}

export interface PlanningTask extends PlanningTaskRecord {
  description: string | null;
  criteria: PlanningCriterion[];
  dependency_ids: number[];
}

export interface PlanningCounts { done: number; cancelled: number; total: number }

export function taskCounts(tasks: PlanningTaskSummary[]): PlanningCounts {
  return {
    total: tasks.length,
    done: tasks.filter((task) => task.state === "done").length,
    cancelled: tasks.filter((task) => task.state === "cancelled").length,
  };
}

export function activeTasks(tasks: PlanningTaskSummary[]): PlanningTaskSummary[] {
  return tasks.filter((task) => task.state !== "done" && task.state !== "cancelled" &&
    (task.state === "doing" || task.blocked)).sort((a, b) =>
    Number(b.state === "doing") - Number(a.state === "doing") ||
    a.priority.localeCompare(b.priority) || a.id - b.id);
}

export function sortPlans(plans: PlanningPlanSummary[]): PlanningPlanSummary[] {
  return [...plans].sort((a, b) => a.title.localeCompare(b.title) || a.id - b.id);
}

/** Never turn absent or ambiguous repository mapping into a global selection. */
export function mappedProject(projects: PlanningProject[], repoName?: string): number | undefined {
  if (!repoName) return undefined;
  const matches = projects.filter((project) => project.repo_name === repoName);
  return matches.length === 1 ? matches[0].id : undefined;
}
