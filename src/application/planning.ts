import { activeTasks, mappedProject, sortPlans, taskCounts } from "../domain/planning.ts";
import type {
  PlanningClock, PlanningError, PlanningPreferences, PlanningReader, PlanningResult, PlanningState,
  PlanningWorkflow,
} from "./ports/planning.ts";

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
      capability: "unknown", availability: !options.enabled ? "off" :
        !options.ready ? "not-ready" : "idle", loading: false,
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
      inspectingTask: false, availability: !input.enabled ? "off" :
        !input.ready ? "not-ready" : "idle" });
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

  private accept<T>(result: PlanningResult<T>, signal: AbortSignal): T {
    if (signal.aborted) throw { kind: "cancelled", message: "Planning read cancelled" };
    if (!result.ok) throw result.error;
    return result.value;
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
    const reader = this.options.reader;
    this.publish({ loading: true, availability: "loading", error: undefined });
    try {
      if (recheck || !this.capabilityChecked) {
        this.capabilityChecked = false;
        const capability = this.accept(await reader.capabilities(signal), signal);
        this.capabilityChecked = true;
        this.publish({ capability });
      }
      if (this.current.capability === "disabled") {
        this.publish({ availability: "disabled", plans: [], planTasks: {},
          planDetail: undefined, taskDetail: undefined, detailError: undefined,
          selectedPlanId: undefined, selectedTaskId: undefined, inspectingTask: false,
          lastRefresh: undefined, stale: false });
        return;
      }
      const projects = this.accept(await reader.projects(signal), signal);
      const selectedProjectId = this.current.detailsOpen && this.browserProjectId !== undefined ?
        projects.find((project) => project.id === this.browserProjectId)?.id :
        mappedProject(projects, this.options.repoName);
      if (selectedProjectId !== this.current.selectedProjectId) this.publish({
        plans: [], planTasks: {}, selectedPlanId: undefined, selectedTaskId: undefined,
        planDetail: undefined, taskDetail: undefined, detailError: undefined,
        inspectingTask: false, lastRefresh: undefined, stale: false,
      });
      this.publish({ projects, selectedProjectId,
        mappedProjectId: mappedProject(projects, this.options.repoName) });
      if (selectedProjectId === undefined) {
        this.publish({ availability: "no-project", plans: [], planTasks: {},
          selectedPlanId: undefined, selectedTaskId: undefined, planDetail: undefined,
          taskDetail: undefined, detailError: undefined, inspectingTask: false,
          lastRefresh: undefined, stale: false });
        return;
      }
      let plans = sortPlans(this.accept(await reader.plans(selectedProjectId, signal), signal));
      let selectedPlanId: number | undefined =
        plans.find((plan) => plan.id === this.current.selectedPlanId)?.id ?? plans[0]?.id;
      const planTasks: PlanningState["planTasks"] = {};
      const displayed = this.current.detailsOpen ?
        plans.filter((plan) => plan.id === selectedPlanId) : plans.slice(0, 2);
      for (const plan of displayed) {
        const result = await reader.tasks(plan.id, signal);
        if (signal.aborted) return;
        if (!result.ok) {
          if (result.error.kind === "denied") throw result.error;
          const previous = this.current.planTasks[plan.id];
          planTasks[plan.id] = { ...previous, tasks: previous?.tasks ?? [],
            activeTasks: previous?.activeTasks ?? [], error: result.error };
          continue;
        }
        const tasks = result.value;
        planTasks[plan.id] = { tasks, counts: taskCounts(tasks), activeTasks: activeTasks(tasks),
          lastRefresh: this.options.clock.now() };
      }
      const tasks = planTasks[selectedPlanId!]?.tasks ?? [];
      const oldTaskId = this.current.selectedTaskId;
      let selectedTaskId: number | undefined =
        tasks.find((task) => task.id === oldTaskId)?.id ?? tasks[0]?.id;
      let inspectingTask = this.current.inspectingTask && selectedTaskId === oldTaskId &&
        selectedTaskId !== undefined;
      let planDetail = this.current.planDetail?.id === selectedPlanId ?
        this.current.planDetail : undefined;
      let taskDetail = inspectingTask ? this.current.taskDetail : undefined;
      let detailError: PlanningError | undefined;
      if (this.current.detailsOpen && selectedPlanId !== undefined) {
        const result = await reader.plan(selectedPlanId, selectedProjectId, signal);
        if (signal.aborted) return;
        if (result.ok) {
          planDetail = result.value;
          if (planDetail.status !== "active") {
            plans = plans.filter((plan) => plan.id !== selectedPlanId);
            delete planTasks[selectedPlanId];
            selectedPlanId = undefined;
            selectedTaskId = undefined;
            inspectingTask = false;
            planDetail = undefined;
            taskDetail = undefined;
          }
        } else {
          if (result.error.kind === "denied") throw result.error;
          detailError = result.error;
          if (result.error.kind === "missing") {
            plans = plans.filter((plan) => plan.id !== selectedPlanId);
            delete planTasks[selectedPlanId];
            selectedPlanId = undefined;
            selectedTaskId = undefined;
            inspectingTask = false;
            planDetail = undefined;
            taskDetail = undefined;
          }
        }
        // Cursor movement needs no read and may happen while the plan detail read is pending.
        if (!this.current.inspectingTask && selectedPlanId !== undefined) {
          selectedTaskId = tasks.find((task) => task.id === this.current.selectedTaskId)?.id ??
            tasks[0]?.id;
        }
        if (inspectingTask && selectedTaskId !== undefined && selectedPlanId !== undefined) {
          const result = await reader.task(selectedTaskId, selectedPlanId, signal);
          if (signal.aborted) return;
          if (result.ok) taskDetail = result.value;
          else {
            if (result.error.kind === "denied") throw result.error;
            detailError = result.error;
            if (result.error.kind === "missing") {
              taskDetail = undefined;
              inspectingTask = false;
              selectedTaskId = undefined;
            }
          }
        }
      }
      const partial = !!detailError || Object.values(planTasks).some((item) => item.error);
      this.publish({ plans, planTasks, selectedPlanId, selectedTaskId, inspectingTask,
        planDetail, taskDetail, detailError, capability: "enabled", availability: "ready",
        lastRefresh: partial ? this.current.lastRefresh : this.options.clock.now(),
        stale: partial });
    } catch (error) {
      if (signal.aborted) return;
      const failure = error as PlanningError;
      if (failure.kind === "denied") this.publish({
        projects: [], plans: [], planTasks: {}, planDetail: undefined, taskDetail: undefined,
        selectedProjectId: undefined, mappedProjectId: undefined, selectedPlanId: undefined,
        selectedTaskId: undefined,
        lastRefresh: undefined, detailError: undefined, inspectingTask: false,
      });
      this.publish({ error: failure, availability: failure.kind === "denied" ? "denied" :
        failure.kind === "unavailable" ? "unavailable" : "error",
        stale: this.current.lastRefresh !== undefined || this.current.plans.length > 0 });
    } finally {
      if (generation === this.generation) {
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
    }
  }

  dispose(): void {
    this.disposed = true;
    this.invalidate();
    this.listeners.clear();
  }
}
