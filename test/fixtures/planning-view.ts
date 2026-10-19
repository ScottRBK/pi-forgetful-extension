import type { TUI } from "@earendil-works/pi-tui";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { PlanningState } from "../../src/application/ports/planning.ts";
import { renderPlanningPanel } from "../../src/adapters/pi/planning.ts";

const task = (id: number, title: string) => ({ id, title, plan_id: 1,
  state: "doing" as const, priority: "P1" as const, assigned_agent: null,
  version: 1, criteria_met: 0, criteria_total: 1, blocked: id === 1 });
const tasks = [task(1, "DOING_BLOCKED"), task(2, "NEXT_TASK"), task(3, "OVERFLOW_TASK")];
const state: PlanningState = {
  panelEnabled: true, panelVisible: true, detailsOpen: false, inspectingTask: false,
  enabled: true, ready: true, capability: "enabled", availability: "ready", loading: false,
  projects: [{ id: 1, name: "VIEW_PROJECT", repo_name: null }], selectedProjectId: 1,
  plans: [1, 2, 3].map((id) => ({ id, title: `PLAN_${id}`, project_id: 1,
    status: "active", task_count: 99 })),
  planTasks: {
    1: { tasks, activeTasks: tasks, counts: { done: 4, total: 9, cancelled: 2 } },
    2: { tasks: [], activeTasks: [], error: { kind: "transient", message: "PARTIAL_FAILURE" } },
  },
  stale: false,
};

export default function fixture(pi: ExtensionAPI) {
  let current = state;
  let terminal: TUI;
  pi.registerCommand("view-state", { description: "Select rendering fixture",
    handler: async (arg) => {
    current = { ...state, plans: [], planTasks: {} };
    if (arg === "empty") current.availability = "ready";
    else if (arg === "stale") current = { ...state, stale: true,
      lastRefresh: 1700000000000, error: { kind: "transient", message: "OUTAGE" },
      planTasks: { 1: state.planTasks[1], 2: state.planTasks[1] } };
    else if (arg === "unsafe") current = { ...state, plans: [],
      projects: [{ id: 1, repo_name: null, name: "SAFE\x1b[2J\x1b]52;c;INJECTED\x07" }],
      error: { kind: "invalid", message: "password=SECRET_VALUE\nBAD\rTEXT" } };
    else current.availability = arg as PlanningState["availability"];
    terminal.requestRender();
  } });
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;
    ctx.ui.setWidget("fixture-host", (tui, theme) => {
      terminal = tui;
      const handle = tui.showOverlay({ invalidate() {},
        render: (width) => renderPlanningPanel(current, width, theme),
      }, { width: 48, maxHeight: 14, anchor: "top-right", margin: { top: 1, right: 2 },
        nonCapturing: true, visible: (width, height) => width >= 100 && height >= 26 });
      return { invalidate() {}, render: () => [], dispose: () => handle.hide() };
    });
  });
}
