import { stripVTControlCharacters } from "node:util";
import type { ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import {
  Container, Key, matchesKey, truncateToWidth, visibleWidth, wrapTextWithAnsi,
  type Component, type OverlayHandle, type TUI,
} from "@earendil-works/pi-tui";
import type { PlanningState, PlanningWorkflow } from "../../application/ports/planning.ts";
import type { PlanningTaskSummary } from "../../domain/planning.ts";
import { sanitizeText } from "../../privacy.ts";

/** Reader text is already redacted; also protect alternate readers and UI diagnostics. */
function text(value: string | null | undefined): string {
  return sanitizeText(stripVTControlCharacters(value ?? "")
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, " "));
}

function box(lines: string[], width: number, theme: Theme): string[] {
  if (width < 4) return lines.map((line) => truncateToWidth(line, Math.max(0, width)));
  const inner = width - 4;
  const edge = (value: string) => theme.fg("borderMuted", value);
  return [edge("┌" + "─".repeat(width - 2) + "┐"), ...lines.map((line) => {
    const clipped = truncateToWidth(line, inner);
    return edge("│") + " " + clipped + " ".repeat(inner - visibleWidth(clipped)) + " " + edge("│");
  }), edge("└" + "─".repeat(width - 2) + "┘")];
}

function timestamp(value?: number): string {
  return value === undefined ? "never" : new Date(value).toISOString().replace("T", " ")
    .replace(/\.\d+Z$/, " UTC");
}

function availability(state: PlanningState): string {
  const label: Record<PlanningState["availability"], string> = {
    idle: "Waiting for planning", off: "Forgetful is off", "not-ready": "Connection not configured",
    loading: "Loading plans…", ready: "", "no-project": "No unique project mapping · Tab to choose",
    disabled: "Planning disabled on server", unavailable: "Planning unavailable",
    denied: "Planning access denied", error: "Planning read failed",
  };
  if (state.stale) return `Stale · last success ${timestamp(state.lastRefresh)}`;
  return state.loading ? "Loading plans…" : label[state.availability];
}

function taskLabel(task: PlanningTaskSummary): string {
  return `${text(task.state)}${task.blocked ? " · blocked" : ""}`;
}

function counts(state: PlanningState, id: number): string {
  const value = state.planTasks[id]?.counts;
  return value ? `${value.done}/${value.total} done · ${value.cancelled} cancelled` :
    "Counts unknown";
}

/** Public rendering seam: business selection/counts arrive from the application unchanged. */
export function renderPlanningPanel(state: PlanningState, width: number, theme: Theme): string[] {
  const project = state.projects.find((item) => item.id === state.selectedProjectId);
  const status = availability(state);
  const known = state.plans.length > 0 || state.availability === "ready" ||
    state.lastRefresh !== undefined;
  const label = known ? `${state.plans.length} active plans` : "Plans";
  const lines = [theme.bold(theme.fg("accent", `Forgetful · ${label}`)),
    theme.fg("muted", text(project?.name) || "Current project")];
  if (status) lines.push(theme.fg(state.stale ? "warning" : "muted", status));
  if (state.error) lines.push(theme.fg("error", text(state.error.message)));
  let shown = 0;
  for (const plan of state.plans.slice(0, 2)) {
    const data = state.planTasks[plan.id];
    const more = Math.max(0, (data?.activeTasks.length ?? 0) - 2);
    const suffix = more ? ` · +${more} more task${more === 1 ? "" : "s"}` : "";
    const title = truncateToWidth(text(plan.title), Math.max(1, width - 4 - suffix.length));
    const block = [theme.bold(title + suffix), theme.fg("dim", counts(state, plan.id))];
    if (data?.error) block.push(theme.fg("warning", `Partial: ${text(data.error.message)}`));
    else if (!data?.counts) block.push(theme.fg("muted", "Loading tasks…"));
    else if (!data.activeTasks.length) block.push(theme.fg("muted", "No doing or blocked tasks"));
    else for (const task of data.activeTasks.slice(0, 2)) {
      block.push(theme.fg(task.blocked ? "warning" : "accent",
        `${taskLabel(task)} · ${text(task.title)}`));
    }
    if (lines.length + block.length > 11) break;
    lines.push(...block);
    shown++;
  }
  if (!state.plans.length && state.availability === "ready") lines.push("No active plans");
  const extra = Math.max(0, state.plans.length - shown);
  const overflow = extra ? `+${extra} more plan${extra === 1 ? "" : "s"} · ` : "";
  const hint = `${overflow}Ctrl+Alt+P details`;
  // Status/diagnostics take priority during outages; the browser retains full data.
  return box([...lines, theme.fg("dim", hint)], width, theme);
}

/** Keyboard and scroll state only; all record selection belongs to the workflow. */
class PlanBrowser implements Component {
  private picker = false;
  private projectId?: number;
  private planText = false;
  private scroll = 0;
  private maxScroll = 0;
  private pageSize = 1;
  private identity = "";

  constructor(private readonly tui: TUI, private readonly theme: Theme,
    private readonly controller: PlanningWorkflow, private readonly close: () => void,
    private readonly run: (work: Promise<void>) => void) {}

  invalidate(): void {}

  handleInput(data: string): void {
    const state = this.controller.state;
    if (matchesKey(data, Key.ctrlAlt("p")) || matchesKey(data, Key.ctrl("c"))) {
      this.close();
      return;
    }
    if (matchesKey(data, Key.escape)) {
      if (this.picker) this.picker = false;
      else if (this.planText) this.planText = false;
      else if (state.inspectingTask) this.run(this.controller.closeTask());
      else this.close();
      this.scroll = 0;
    } else if (data === "r") this.run(this.controller.refresh());
    else if (matchesKey(data, Key.tab)) {
      this.picker = !this.picker;
      this.projectId = state.selectedProjectId ?? state.projects[0]?.id;
      this.scroll = 0;
    } else if (this.picker) this.pickerInput(data, state);
    else if (this.planText || state.inspectingTask) this.scrollInput(data);
    else this.listInput(data, state);
    this.tui.requestRender();
  }

  private pickerInput(data: string, state: PlanningState): void {
    const index = Math.max(0, state.projects.findIndex((item) => item.id === this.projectId));
    const step = matchesKey(data, Key.down) || data === "j" ? 1 :
      matchesKey(data, Key.up) || data === "k" ? -1 : 0;
    this.projectId = state.projects[Math.max(0, Math.min(state.projects.length - 1,
      index + step))]?.id;
    if (matchesKey(data, Key.enter) && this.projectId !== undefined) {
      this.picker = false;
      this.planText = false;
      this.run(this.controller.selectProject(this.projectId));
    }
  }

  private scrollInput(data: string): void {
    if (matchesKey(data, Key.down) || data === "j") this.scroll += 1;
    else if (matchesKey(data, Key.up) || data === "k") this.scroll -= 1;
    else if (matchesKey(data, Key.pageDown)) this.scroll += this.pageSize;
    else if (matchesKey(data, Key.pageUp)) this.scroll -= this.pageSize;
    else if (matchesKey(data, Key.home)) this.scroll = 0;
    else if (matchesKey(data, Key.end)) this.scroll = this.maxScroll;
    this.scroll = Math.max(0, Math.min(this.maxScroll, this.scroll));
  }

  private listInput(data: string, state: PlanningState): void {
    const planIndex = Math.max(0, state.plans.findIndex((plan) =>
      plan.id === state.selectedPlanId));
    const tasks = state.planTasks[state.selectedPlanId ?? -1]?.tasks ?? [];
    const taskIndex = Math.max(0, tasks.findIndex((task) => task.id === state.selectedTaskId));
    if (matchesKey(data, Key.left) || data === "h" ||
        matchesKey(data, Key.right) || data === "l") {
      const step = matchesKey(data, Key.left) || data === "h" ? -1 : 1;
      const plan = state.plans[(planIndex + step + state.plans.length) % state.plans.length];
      if (plan) this.run(this.controller.selectPlan(plan.id));
    } else if (matchesKey(data, Key.up) || data === "k" ||
        matchesKey(data, Key.down) || data === "j") {
      const step = matchesKey(data, Key.up) || data === "k" ? -1 : 1;
      const task = tasks[Math.max(0, Math.min(tasks.length - 1, taskIndex + step))];
      if (task) this.run(this.controller.selectTask(task.id));
    } else if (matchesKey(data, Key.enter) && state.selectedTaskId !== undefined) {
      this.scroll = 0;
      this.run(this.controller.inspectTask());
    } else if (data === "g" && state.selectedPlanId !== undefined) {
      this.planText = true;
      this.scroll = 0;
    }
  }

  private taskText(state: PlanningState, width: number): string[] {
    const task = state.taskDetail;
    if (!task || task.id !== state.selectedTaskId) return ["Loading task details…"];
    const summaries = Object.values(state.planTasks).flatMap((item) => item.tasks);
    const summary = summaries.find((item) => item.id === task.id);
    const lines = [this.theme.bold(`#${task.id} ${text(task.title)}`),
      `${summary ? taskLabel(summary) : text(task.state)} · ${text(task.priority)} · ` +
        (text(task.assigned_agent) || "unassigned"), "", text(task.description) || "No description",
      "", this.theme.bold("Dependencies"),
      ...(task.dependency_ids.length ? task.dependency_ids.map((id) => {
        const dependency = summaries.find((item) => item.id === id);
        return dependency ? `#${id} ${text(dependency.title)} · ${taskLabel(dependency)}` :
          `#${id} Unknown task · state unknown`;
      }) : ["None"]), "", this.theme.bold("Acceptance criteria"),
      ...(task.criteria.length ? task.criteria.map((item) =>
        `${item.met ? "[x]" : "[ ]"} ${text(item.description)}`) : ["None"]),
      "", "Recorded status; not a live agent heartbeat."];
    return lines.flatMap((line) => wrapTextWithAnsi(line, width));
  }

  private planLines(state: PlanningState, width: number): string[] {
    const plan = state.planDetail;
    if (!plan || plan.id !== state.selectedPlanId) return ["Loading plan details…"];
    return [this.theme.bold(text(plan.title)), "", this.theme.bold("Goal"),
      text(plan.goal) || "No goal", "", this.theme.bold("Context"),
      text(plan.context) || "No context"]
      .flatMap((line) => wrapTextWithAnsi(line, width));
  }

  render(width: number): string[] {
    const state = this.controller.state;
    const inner = Math.max(1, width - 4);
    const height = Math.max(1, Math.min(30, this.tui.terminal.rows - 2));
    const room = Math.max(1, height - 2);
    const identity = `${state.selectedProjectId}/${state.selectedPlanId}/` +
      `${state.selectedTaskId}/${state.inspectingTask}/${this.planText}/${this.picker}`;
    if (identity !== this.identity) { this.identity = identity; this.scroll = 0; }
    if (!state.selectedPlanId) this.planText = false;
    const project = state.projects.find((item) => item.id === state.selectedProjectId);
    const heading = this.theme.bold(this.theme.fg("accent", "Forgetful / Plans · read-only"));
    const top = [heading, this.theme.fg("muted", text(project?.name) || "No project selected")];
    const status = availability(state);
    if (status) top.push(this.theme.fg(state.stale ? "warning" : "muted", status));
    if (state.error) top.push(this.theme.fg("error", text(state.error.message)));
    if (state.detailError) top.push(this.theme.fg("warning",
      `Details unavailable: ${text(state.detailError.message)}`));
    let body: string[];
    let footer: string;
    this.pageSize = Math.max(1, room - top.length - 2);
    if (this.picker) {
      top.push(this.theme.bold(`Choose project · ${state.projects.length} available`));
      this.pageSize = Math.max(1, room - top.length - 2);
      const index = Math.max(0, state.projects.findIndex((item) => item.id === this.projectId));
      const start = Math.max(0, index - this.pageSize + 1);
      body = state.projects.slice(start, start + this.pageSize).map((item) =>
        `${item.id === this.projectId ? "›" : " "} ${text(item.name)} · #${item.id}`);
      if (!body.length) body = [state.loading ? "Loading projects…" : "No accessible projects"];
      footer = `↑↓ choose · Enter select · Esc back · ${index + 1}/${state.projects.length}`;
    } else if (state.inspectingTask || this.planText) {
      const lines = state.inspectingTask ? this.taskText(state, inner) :
        this.planLines(state, inner);
      this.maxScroll = Math.max(0, lines.length - this.pageSize);
      this.scroll = Math.min(this.scroll, this.maxScroll);
      body = lines.slice(this.scroll, this.scroll + this.pageSize);
      footer = `↑↓/PgUp/PgDn scroll · Esc back · ${this.scroll + 1}/${lines.length}`;
    } else {
      const plan = state.plans.find((item) => item.id === state.selectedPlanId);
      const group = plan ? state.planTasks[plan.id] : undefined;
      const tasks = group?.tasks ?? [];
      if (plan) {
        top.push(this.theme.bold(text(plan.title)), this.theme.fg("dim", counts(state, plan.id)));
        if (group?.error) top.push(this.theme.fg("warning",
          `Partial: ${text(group.error.message)}`));
      }
      this.pageSize = Math.max(1, room - top.length - 3);
      const index = Math.max(0, tasks.findIndex((task) => task.id === state.selectedTaskId));
      const start = Math.max(0, index - this.pageSize + 1);
      body = tasks.slice(start, start + this.pageSize).map((task) => {
        const line = `${task.id === state.selectedTaskId ? "›" : " "} ` +
          `${taskLabel(task)} · ${text(task.priority)} · #${task.id} ${text(task.title)}`;
        return task.id === state.selectedTaskId ? this.theme.bold(line) : line;
      });
      if (!body.length) body = [!plan ? state.availability === "ready" ? "No active plans" : "" :
        group?.error ? "Task data unavailable" : group?.counts ? "No tasks" : "Loading tasks…"];
      if (plan && group?.counts) body.push(this.theme.fg("dim",
        `Plan ${state.plans.indexOf(plan) + 1}/` +
        `${state.plans.length} · Task ${tasks.length ? index + 1 : 0}/${tasks.length}`));
      footer = "←→ plans · ↑↓ tasks · Enter task · g goal/context · " +
        "Tab project · r refresh · Esc close";
    }
    const footerLines = wrapTextWithAnsi(this.theme.fg("muted", footer), inner);
    const budget = Math.max(0, room - Math.min(2, footerLines.length));
    return box([...top, ...body].slice(0, budget).concat(footerLines.slice(0, room - budget)),
      width, this.theme).slice(0, height);
  }
}

const HOST = "forgetful-planning-host";

/** Owns only its widget and overlay handles. It never writes to the editor or session history. */
export class PiPlanningView {
  private ctx?: ExtensionContext;
  private tui?: TUI;
  private panel?: OverlayHandle;
  private panelComponent?: Component;
  private unsubscribe?: () => void;
  private promptActive = false;
  private browserOpen = false;
  private browser?: Promise<void>;
  private finishBrowser?: () => void;
  private disposed = false;
  private visibility?: boolean;
  private host?: Component;
  private measuring = false;

  constructor(private readonly controller: PlanningWorkflow) {}

  mount(ctx: ExtensionContext): void {
    if (this.disposed || ctx.mode !== "tui") return;
    if (this.ctx) return;
    this.ctx = ctx;
    this.unsubscribe = this.controller.subscribe(() => this.sync());
  }

  private mountHost(): void {
    if (this.host || !this.ctx) return;
    this.ctx.ui.setWidget(HOST, (tui, theme) => {
      this.tui = tui;
      this.panelComponent = { invalidate() {},
        render: (width) => renderPlanningPanel(this.controller.state, width, theme),
      };
      const host = {
        invalidate() {},
        render: () => {
          if (!this.measuring) { this.syncVisibility(); this.syncPanel(); }
          return [];
        },
        dispose: () => { this.panel?.hide(); this.panel = undefined; },
      };
      this.host = host;
      return host;
    });
  }

  private releaseHost(): void {
    if (!this.host) return;
    this.ctx?.ui.setWidget(HOST, undefined);
    this.host = undefined;
    this.panelComponent = undefined;
  }

  private run(work: Promise<void>): void {
    void work.catch((error: unknown) => {
      if (!this.disposed) this.ctx?.ui.notify(text(error instanceof Error ? error.message :
        String(error)), "warning");
    });
  }

  private hasPanelSpace(): boolean {
    const tui = this.tui;
    const host = this.host;
    if (!tui || !host || tui.terminal.columns < 100 || tui.terminal.rows < 26) return false;
    const contains = (component: Component): boolean => component === host ||
      (component instanceof Container && component.children.some(contains));
    const boundary = tui.children.findIndex(contains);
    // Public composition only: protect the entire root containing our widget and everything
    // below it. Unknown layouts fail closed. Never inspect Pi's editor or private renderer state.
    if (boundary < 0) return false;
    this.measuring = true;
    try {
      const heights = tui.children.map((component) =>
        component.render(tui.terminal.columns).length);
      const before = heights.slice(0, boundary).reduce((sum, height) => sum + height, 0);
      const after = heights.slice(boundary).reduce((sum, height) => sum + height, 0);
      const available = tui.mode === "fullscreen" ? tui.terminal.rows - after :
        Math.min(before, tui.terminal.rows - after);
      return available >= 15; // One top margin plus the bounded 14-row panel.
    } finally { this.measuring = false; }
  }

  private syncVisibility(): void {
    if (this.measuring) return;
    const visible = !this.promptActive && !this.disposed && this.hasPanelSpace() &&
      (this.panel !== undefined || !this.tui?.hasOverlay());
    if (visible === this.visibility) return;
    this.visibility = visible;
    this.run(this.controller.setPanelVisible(visible));
  }

  private syncPanel(): void {
    const state = this.controller.state;
    const show = !this.disposed && state.enabled && state.panelEnabled &&
      !state.detailsOpen && !this.browserOpen && !this.promptActive && this.visibility;
    if (!show) {
      this.panel?.hide();
      this.panel = undefined;
    } else if (!this.panel && this.tui && this.panelComponent && !this.tui.hasOverlay()) {
      // Pi cannot change terminal mode while even a hidden overlay entry exists. Release
      // inactive panels completely, and never remount above another extension's popup.
      this.panel = this.tui.showOverlay(this.panelComponent, {
        width: 48, maxHeight: 14, anchor: "top-right", margin: { top: 1, right: 2 },
        nonCapturing: true, visible: () => this.visibility === true,
      });
    }
  }

  private sync(): void {
    const state = this.controller.state;
    if (!state.enabled && this.browserOpen) this.close();
    if (!this.disposed && state.enabled && state.panelEnabled) this.mountHost();
    else this.releaseHost();
    this.syncVisibility();
    this.syncPanel();
    this.tui?.requestRender();
  }

  setPromptActive(active: boolean): void {
    if (this.disposed) return;
    this.promptActive = active;
    this.sync();
  }

  async command(action: string): Promise<void> {
    if (this.disposed) return;
    switch (action.trim()) {
      case "": case "open": await this.open(); break;
      case "on": await this.controller.setPanel(true); break;
      case "off": await this.controller.setPanel(false); break;
      case "toggle": await this.controller.togglePanel(); break;
      case "refresh": await this.controller.refresh(); break;
      case "close": this.close(); break;
      default: this.ctx?.ui.notify("/forgetful plans [on|off|toggle|refresh]", "info");
    }
  }

  async toggle(): Promise<void> {
    if (this.browserOpen) this.close();
    else await this.open();
  }

  async open(): Promise<void> {
    if (this.disposed || this.ctx?.mode !== "tui") return;
    if (this.browserOpen) return this.browser;
    // Do not replace another native prompt. This also avoids a nested prompt swallowing its end.
    if (this.promptActive) return;
    if (!this.controller.state.enabled) {
      this.ctx.ui.notify("Forgetful is off. Use /forgetful on first.", "info");
      return;
    }
    this.browserOpen = true;
    this.run(this.controller.openDetails());
    this.sync();
    const interaction = this.ctx.ui.custom<void>((tui, theme, _keys, done) => {
      this.tui = tui;
      this.finishBrowser = () => done();
      return new PlanBrowser(tui, theme, this.controller, () => this.close(),
        (work) => this.run(work));
    }, { overlay: true, overlayOptions: { width: 100, maxHeight: "100%", margin: 1 },
      onHandle: () => { if (this.disposed || !this.browserOpen) this.finishBrowser?.(); } });
    this.browser = interaction.catch((error: unknown) => {
      if (!this.disposed) this.ctx?.ui.notify(`Planning view: ${text(String(error))}`, "warning");
    }).finally(() => {
      this.finishBrowser = undefined;
      this.browser = undefined;
      this.browserOpen = false;
      if (!this.disposed) { this.run(this.controller.closeDetails()); this.sync(); }
    });
    return this.browser;
  }

  private close(): void {
    this.finishBrowser?.();
  }

  status(): string {
    const state = this.controller.state;
    const project = state.projects.find((item) => item.id === state.selectedProjectId);
    const errors = [state.error, state.detailError,
      ...Object.values(state.planTasks).map((group) => group.error)]
      .flatMap((error) => error ? [text(error.message)] : []);
    const display = this.browserOpen ? "details" : state.panelEnabled && this.visibility &&
      state.enabled ? "visible" : "hidden";
    return `Planning panel: ${state.panelEnabled ? "on" : "off"}; ${state.availability}` +
      `${state.stale ? " (stale)" : ""}; view: ${display}; ` +
      `project: ${text(project?.name) || "none"}; ` +
      `last success: ${timestamp(state.lastRefresh)}` +
      (errors.length ? `; ${[...new Set(errors)].join(" | ")}` : "");
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribe?.();
    this.finishBrowser?.();
    this.panel?.hide();
    this.panel = undefined;
    this.releaseHost();
    this.run(this.controller.setPanelVisible(false));
    this.run(this.controller.closeDetails());
    this.tui = undefined;
  }
}
