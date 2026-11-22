import { activeTasks, mappedProject, sortPlans, taskCounts } from "../domain/planning.ts";
import type {
  PlanningPlan, PlanningPlanSummary, PlanningTask, PlanningTaskSummary,
} from "../domain/planning.ts";
import type {
  PlanningClock, PlanningError, PlanningPreferences, PlanningReader, PlanningResult, PlanningState,
  PlanningWorkflow,
} from "./ports/planning.ts";

/** Carries a read failure to `readOverview()` as a real Error. */
class PlanningReadFailure extends Error {
  constructor(readonly failure: PlanningError) { super(failure.message); }
}

function throwIfCancelled(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new PlanningReadFailure({ kind: "cancelled", message: "Planning read cancelled" });
  }
}

function connectionAvailability(
  enabled: boolean, ready: boolean,
): PlanningState["availability"] {
  if (!enabled) return "off";
  return ready ? "idle" : "not-ready";
}

function failureAvailability(kind: PlanningError["kind"]): PlanningState["availability"] {
  return kind === "denied" || kind === "unavailable" ? kind : "error";
}

/** Plan fields to clear when the project, capability or mapping no longer has plans. */
function noPlanData(): Partial<PlanningState> {
  return { plans: [], planTasks: {}, selectedPlanId: undefined, selectedTaskId: undefined,
    planDetail: undefined, taskDetail: undefined, detailError: undefined,
    inspectingTask: false, lastRefresh: undefined, stale: false };
}

/** The plan fields that one overview read publishes together. Every key is always set. */
interface Overview {
  plans: PlanningPlanSummary[];
  planTasks: PlanningState["planTasks"];
  selectedPlanId: number | undefined;
  selectedTaskId: number | undefined;
  inspectingTask: boolean;
  planDetail: PlanningPlan | undefined;
  taskDetail: PlanningTask | undefined;
  detailError: PlanningError | undefined;
}

/** Drops a plan that is no longer active, with its selection and details. */
function removePlan(overview: Overview, planId: number): void {
  overview.plans = overview.plans.filter((plan) => plan.id !== planId);
  delete overview.planTasks[planId];
  Object.assign(overview, { selectedPlanId: undefined, selectedTaskId: undefined,
    inspectingTask: false, planDetail: undefined, taskDetail: undefined });
}

export interface PlanningControllerOptions {
  reader: PlanningReader;
  preferences: PlanningPreferences;
  clock: PlanningClock;
  repoName?: string;
  enabled: boolean;
  ready: boolean;
  initialPreference: boolean;
}

/** Human-facing read workflow. It has no model, Pi or concrete transport dependency. */
export class PlanningController implements PlanningWorkflow {
  private current: PlanningState;
  private readonly listeners = new Set<(state: PlanningState) => void>();
  private pending?: AbortController;
  private active?: { generation: number; promise: Promise<void> };
  private generation = 0;
  private disposed = false;
  private capabilityChecked = false;
  private retryBlocked = false;
  private failures = 0;
  private browserProjectId?: number;
  private cancelTimer?: () => void;
  private preferenceWrite: Promise<void> = Promise.resolve();

  constructor(private readonly options: PlanningControllerOptions) {
    this.current = {
      panelEnabled: options.initialPreference, panelVisible: false, detailsOpen: false,
      inspectingTask: false, enabled: options.enabled, ready: options.ready,
      capability: "unknown",
      availability: connectionAvailability(options.enabled, options.ready), loading: false,
      projects: [], plans: [], planTasks: {}, stale: false,
    };
  }

  get state(): PlanningState { return this.current; }

  subscribe(listener: (state: PlanningState) => void): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private publish(update: Partial<PlanningState>): void {
    this.current = { ...this.current, ...update };
    if (!this.disposed) for (const listener of this.listeners) listener(this.current);
  }

  private visible(): boolean {
    return !this.disposed && this.current.enabled && this.current.ready &&
      (this.current.detailsOpen || (this.current.panelEnabled && this.current.panelVisible));
  }

  private invalidate(): void {
    this.generation++;
    this.cancelTimer?.();
    this.cancelTimer = undefined;
    this.pending?.abort();
    this.publish({ loading: false,
      availability: this.current.availability === "loading" ? "idle" : this.current.availability });
  }

  async openDetails(): Promise<void> {
    if (this.disposed || !this.current.enabled) return;
    if (this.current.detailsOpen) return this.startRefresh(false);
    this.invalidate();
    this.browserProjectId = undefined;
    this.publish({ detailsOpen: true });
    await this.startRefresh(false);
  }

  async closeDetails(): Promise<void> {
    this.invalidate();
    this.browserProjectId = undefined;
    this.publish({ detailsOpen: false, inspectingTask: false, taskDetail: undefined,
      planDetail: undefined, detailError: undefined, selectedPlanId: undefined,
      selectedTaskId: undefined, selectedProjectId: undefined, plans: [], planTasks: {},
      lastRefresh: undefined, stale: false });
    await this.startRefresh(false);
  }

  setPanel(enabled: boolean): Promise<void> { return this.changePanel(() => enabled); }

  togglePanel(): Promise<void> { return this.changePanel(() => !this.current.panelEnabled); }

  private changePanel(value: () => boolean): Promise<void> {
    const operation = this.preferenceWrite.catch(() => {}).then(async () => {
      if (this.disposed) return;
      const enabled = value();
      await this.options.preferences.write(enabled);
      if (this.disposed) return;
      this.publish({ panelEnabled: enabled });
      this.invalidate();
    });
    // Serialize settings writes only: turning off must never wait behind a slow read.
    this.preferenceWrite = operation;
    return operation.then(() => this.startRefresh(this.current.panelEnabled));
  }

  async setPanelVisible(visible: boolean): Promise<void> {
    if (visible === this.current.panelVisible || this.disposed) return;
    this.publish({ panelVisible: visible });
    if (this.current.detailsOpen) return;
    this.invalidate();
    await this.startRefresh(false);
  }

  async setConnection(
    input: { enabled: boolean; ready: boolean; repoName?: string },
  ): Promise<void> {
    if (this.disposed) return;
    this.invalidate();
    this.options.repoName = input.repoName;
    this.browserProjectId = undefined;
    this.capabilityChecked = false;
    this.publish({ enabled: input.enabled, ready: input.ready, capability: "unknown",
      projects: [], plans: [], planTasks: {}, selectedProjectId: undefined,
      mappedProjectId: undefined,
      selectedPlanId: undefined, selectedTaskId: undefined, taskDetail: undefined,
      planDetail: undefined, detailError: undefined, lastRefresh: undefined,
      error: undefined, stale: false,
      detailsOpen: input.enabled && this.current.detailsOpen,
      inspectingTask: false, availability: connectionAvailability(input.enabled, input.ready) });
    await this.startRefresh(true);
  }

  async selectProject(id: number): Promise<void> {
    if (!this.current.detailsOpen || !this.current.projects.some((project) => project.id === id))
      return;
    this.invalidate();
    this.browserProjectId = id;
    this.publish({ selectedProjectId: id, selectedPlanId: undefined, selectedTaskId: undefined,
      plans: [], planTasks: {}, planDetail: undefined, taskDetail: undefined,
      detailError: undefined,
      inspectingTask: false, stale: false, lastRefresh: undefined });
    await this.startRefresh(false);
  }

  async selectPlan(id: number): Promise<void> {
    if (!this.current.detailsOpen || !this.current.plans.some((plan) => plan.id === id)) return;
    if (id === this.current.selectedPlanId) return;
    this.invalidate();
    this.publish({ selectedPlanId: id, selectedTaskId: undefined, planTasks: {},
      planDetail: undefined, taskDetail: undefined, detailError: undefined,
      inspectingTask: false });
    await this.startRefresh(false);
  }

  async selectTask(id: number): Promise<void> {
    const tasks = this.current.planTasks[this.current.selectedPlanId!]?.tasks ?? [];
    if (!this.current.detailsOpen || !tasks.some((task) => task.id === id)) return;
    if (id === this.current.selectedTaskId) return;
    if (!this.current.inspectingTask) {
      this.publish({ selectedTaskId: id, taskDetail: undefined, detailError: undefined });
      return;
    }
    this.invalidate();
    this.publish({ selectedTaskId: id, taskDetail: undefined, detailError: undefined });
    await this.startRefresh(false);
  }

  async inspectTask(): Promise<void> {
    if (!this.current.detailsOpen || this.current.selectedTaskId === undefined) return;
    this.invalidate();
    this.publish({ inspectingTask: true, taskDetail: undefined, detailError: undefined });
    await this.startRefresh(false);
  }

  async closeTask(): Promise<void> {
    this.invalidate();
    this.publish({ inspectingTask: false, taskDetail: undefined, detailError: undefined });
    await this.startRefresh(false);
  }

  /** Returns a required read's value. Any throw after abort is ignored by `readOverview()`. */
  private accept<T>(result: PlanningResult<T>, signal: AbortSignal): T {
    throwIfCancelled(signal);
    if (!result.ok) throw new PlanningReadFailure(result.error);
    return result.value;
  }

  /** Returns an optional read's result; only denial stops the whole overview. */
  private partial<T>(result: PlanningResult<T>, signal: AbortSignal): PlanningResult<T> {
    throwIfCancelled(signal);
    if (!result.ok && result.error.kind === "denied") throw new PlanningReadFailure(result.error);
    return result;
  }

  refresh(): Promise<void> { return this.startRefresh(true); }

  private startRefresh(recheck: boolean): Promise<void> {
    // Keep explicit retry intent even when a resize/prompt currently hides the view.
    if (recheck) { this.capabilityChecked = false; this.retryBlocked = false; }
    if (!this.visible() || this.retryBlocked) return Promise.resolve();
    if (this.active?.generation === this.generation) return this.active.promise;
    const previous = this.active?.promise;
    const generation = this.generation;
    const promise = (async () => {
      await previous;
      if (generation !== this.generation || !this.visible()) return;
      this.cancelTimer?.();
      this.cancelTimer = undefined;
      await this.readOverview(recheck, generation);
    })();
    this.active = { generation, promise };
    void promise.finally(() => { if (this.active?.promise === promise) this.active = undefined; });
    return promise;
  }

  private async readOverview(recheck: boolean, generation: number): Promise<void> {
    const pending = new AbortController();
    this.pending = pending;
    const signal = pending.signal;
    this.publish({ loading: true, availability: "loading", error: undefined });
    try {
      if (await this.readCapability(recheck, signal)) {
        const projectId = await this.readProject(signal);
        if (projectId !== undefined) await this.readPlans(projectId, signal);
      }
    } catch (error) {
      if (!signal.aborted) this.publishFailure(error);
    } finally {
      if (generation === this.generation) this.settle();
    }
  }

  /** Returns false, after clearing plan data, when the server disables planning. */
  private async readCapability(recheck: boolean, signal: AbortSignal): Promise<boolean> {
    if (recheck || !this.capabilityChecked) {
      this.capabilityChecked = false;
      const capability = this.accept(await this.options.reader.capabilities(signal), signal);
      this.capabilityChecked = true;
      this.publish({ capability });
    }
    if (this.current.capability !== "disabled") return true;
    this.publish({ availability: "disabled", ...noPlanData() });
    return false;
  }

  /** Selects the browsed project in details, otherwise the uniquely mapped project. */
  private async readProject(signal: AbortSignal): Promise<number | undefined> {
    const projects = this.accept(await this.options.reader.projects(signal), signal);
    const mappedProjectId = mappedProject(projects, this.options.repoName);
    const selectedProjectId = this.current.detailsOpen && this.browserProjectId !== undefined ?
      projects.find((project) => project.id === this.browserProjectId)?.id : mappedProjectId;
    if (selectedProjectId !== this.current.selectedProjectId) this.publish(noPlanData());
    this.publish({ projects, selectedProjectId, mappedProjectId });
    if (selectedProjectId === undefined) {
      this.publish({ availability: "no-project", ...noPlanData() });
    }
    return selectedProjectId;
  }

  private async readPlans(projectId: number, signal: AbortSignal): Promise<void> {
    const plans = sortPlans(this.accept(await this.options.reader.plans(projectId, signal),
      signal));
    const selectedPlanId = plans.find((plan) => plan.id === this.current.selectedPlanId)?.id ??
      plans[0]?.id;
    const displayed = this.current.detailsOpen ?
      plans.filter((plan) => plan.id === selectedPlanId) : plans.slice(0, 2);
    const planTasks = await this.readPlanTasks(displayed, signal);
    const tasks = selectedPlanId === undefined ? [] : planTasks[selectedPlanId]?.tasks ?? [];
    const oldTaskId = this.current.selectedTaskId;
    const selectedTaskId = tasks.find((task) => task.id === oldTaskId)?.id ?? tasks[0]?.id;
    const inspectingTask = this.current.inspectingTask && selectedTaskId === oldTaskId &&
      selectedTaskId !== undefined;
    const overview: Overview = { plans, planTasks, selectedPlanId, selectedTaskId,
      inspectingTask, detailError: undefined,
      planDetail: this.current.planDetail?.id === selectedPlanId ?
        this.current.planDetail : undefined,
      taskDetail: inspectingTask ? this.current.taskDetail : undefined };
    if (this.current.detailsOpen && selectedPlanId !== undefined) {
      await this.readDetails(overview, selectedPlanId, projectId, tasks, signal);
    }
    const partial = !!overview.detailError ||
      Object.values(planTasks).some((item) => item.error);
    this.publish({ ...overview, capability: "enabled", availability: "ready",
      lastRefresh: partial ? this.current.lastRefresh : this.options.clock.now(),
      stale: partial });
  }

  /** A failed plan keeps its previous tasks and marks them partial; denial stops the read. */
  private async readPlanTasks(
    plans: PlanningPlanSummary[], signal: AbortSignal,
  ): Promise<PlanningState["planTasks"]> {
    const planTasks: PlanningState["planTasks"] = {};
    for (const plan of plans) {
      const result = this.partial(await this.options.reader.tasks(plan.id, signal), signal);
      if (result.ok) {
        const tasks = result.value;
        planTasks[plan.id] = { tasks, counts: taskCounts(tasks),
          activeTasks: activeTasks(tasks), lastRefresh: this.options.clock.now() };
      } else {
        const previous = this.current.planTasks[plan.id];
        planTasks[plan.id] = { ...previous, tasks: previous?.tasks ?? [],
          activeTasks: previous?.activeTasks ?? [], error: result.error };
      }
    }
    return planTasks;
  }

  /** Reads the selected plan and any inspected task into the overview being built. */
  private async readDetails(overview: Overview, planId: number, projectId: number,
    tasks: PlanningTaskSummary[], signal: AbortSignal): Promise<void> {
    const result = this.partial(await this.options.reader.plan(planId, projectId, signal),
      signal);
    if (result.ok) overview.planDetail = result.value;
    else overview.detailError = result.error;
    if (result.ok ? result.value.status !== "active" : result.error.kind === "missing") {
      removePlan(overview, planId);
    }
    // Cursor movement needs no read and may happen while the plan detail read is pending.
    if (!this.current.inspectingTask && overview.selectedPlanId !== undefined) {
      overview.selectedTaskId = tasks.find((task) => task.id === this.current.selectedTaskId)
        ?.id ?? tasks[0]?.id;
    }
    const { selectedTaskId, selectedPlanId } = overview;
    if (!overview.inspectingTask || selectedTaskId === undefined || selectedPlanId === undefined)
      return;
    const task = this.partial(await this.options.reader.task(selectedTaskId, selectedPlanId,
      signal), signal);
    if (task.ok) {
      overview.taskDetail = task.value;
      return;
    }
    overview.detailError = task.error;
    if (task.error.kind === "missing") {
      Object.assign(overview, { taskDetail: undefined, inspectingTask: false,
        selectedTaskId: undefined });
    }
  }

  private publishFailure(error: unknown): void {
    const failure = error instanceof PlanningReadFailure ? error.failure : error as PlanningError;
    if (failure.kind === "denied") this.publish({
      projects: [], plans: [], planTasks: {}, planDetail: undefined, taskDetail: undefined,
      selectedProjectId: undefined, mappedProjectId: undefined, selectedPlanId: undefined,
      selectedTaskId: undefined,
      lastRefresh: undefined, detailError: undefined, inspectingTask: false,
    });
    this.publish({ error: failure, availability: failureAvailability(failure.kind),
      stale: this.current.lastRefresh !== undefined || this.current.plans.length > 0 });
  }

  /** Ends the current read, then schedules a poll or a bounded transient retry. */
  private settle(): void {
    this.pending = undefined;
    this.active = undefined;
    this.publish({ loading: false });
    const errors = [this.current.error, this.current.detailError,
      ...Object.values(this.current.planTasks).map((item) => item.error)]
      .filter((error): error is PlanningError => !!error && error.kind !== "missing");
    const retryable = errors.length > 0 && errors.every((error) => error.kind === "transient");
    this.retryBlocked = this.current.availability === "disabled" ||
      errors.some((error) => error.kind !== "transient");
    this.failures = retryable ? this.failures + 1 : 0;
    const settled = ["ready", "no-project"].includes(this.current.availability);
    if (this.visible() && (retryable || (settled && errors.length === 0))) {
      const delay = retryable ? Math.min(60_000, 10_000 * 2 ** (this.failures - 1)) : 10_000;
      this.cancelTimer = this.options.clock.schedule(() => {
        void this.startRefresh(false);
      }, delay);
    }
  }

  dispose(): void {
    this.disposed = true;
    this.invalidate();
    this.listeners.clear();
  }
}
