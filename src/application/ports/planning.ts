import type {
  PlanningCapability, PlanningCounts, PlanningPlan, PlanningPlanSummary,
  PlanningProject, PlanningTask, PlanningTaskSummary,
} from "../../domain/planning.ts";

export interface PlanningError {
  kind: "denied" | "unavailable" | "transient" | "missing" | "invalid" | "cancelled";
  message: string;
  status?: number;
  responseBody?: string;
}

export type PlanningResult<T> = { ok: true; value: T } | { ok: false; error: PlanningError };

/** All returned text and diagnostics must be safe for terminal display. */
export interface PlanningReader {
  capabilities(signal?: AbortSignal): Promise<PlanningResult<PlanningCapability>>;
  projects(signal?: AbortSignal): Promise<PlanningResult<PlanningProject[]>>;
  plans(projectId: number, signal?: AbortSignal): Promise<PlanningResult<PlanningPlanSummary[]>>;
  plan(
    planId: number, projectId: number, signal?: AbortSignal,
  ): Promise<PlanningResult<PlanningPlan>>;
  task(taskId: number, planId: number, signal?: AbortSignal): Promise<PlanningResult<PlanningTask>>;
  tasks(planId: number, signal?: AbortSignal): Promise<PlanningResult<PlanningTaskSummary[]>>;
}

export interface PlanningPreferences {
  read(): Promise<boolean>;
  write(enabled: boolean): Promise<void>;
}

export interface PlanningClock {
  now(): number;
  schedule(callback: () => void, delayMs: number): () => void;
}

export interface PlanningPlanTasks {
  tasks: PlanningTaskSummary[];
  activeTasks: PlanningTaskSummary[];
  counts?: PlanningCounts;
  error?: PlanningError;
  lastRefresh?: number;
}

export interface PlanningState {
  panelEnabled: boolean;
  panelVisible: boolean;
  detailsOpen: boolean;
  inspectingTask: boolean;
  enabled: boolean;
  ready: boolean;
  capability: PlanningCapability;
  availability: "idle" | "off" | "not-ready" | "loading" | "ready" | "no-project" |
    "disabled" | "unavailable" | "denied" | "error";
  loading: boolean;
  error?: PlanningError;
  projects: PlanningProject[];
  selectedProjectId?: number;
  mappedProjectId?: number;
  selectedPlanId?: number;
  selectedTaskId?: number;
  plans: PlanningPlanSummary[];
  planTasks: Record<number, PlanningPlanTasks>;
  planDetail?: PlanningPlan;
  taskDetail?: PlanningTask;
  detailError?: PlanningError;
  lastRefresh?: number;
  stale: boolean;
}

/** Public application boundary consumed by the host's view and lifecycle wiring. */
export interface PlanningWorkflow {
  readonly state: PlanningState;
  subscribe(listener: (state: PlanningState) => void): () => void;
  openDetails(): Promise<void>;
  closeDetails(): Promise<void>;
  setPanel(enabled: boolean): Promise<void>;
  togglePanel(): Promise<void>;
  setPanelVisible(visible: boolean): Promise<void>;
  selectProject(id: number): Promise<void>;
  selectPlan(id: number): Promise<void>;
  selectTask(id: number): Promise<void>;
  inspectTask(): Promise<void>;
  closeTask(): Promise<void>;
  refresh(): Promise<void>;
  setConnection(input: { enabled: boolean; ready: boolean; repoName?: string }): Promise<void>;
  dispose(): void;
}
