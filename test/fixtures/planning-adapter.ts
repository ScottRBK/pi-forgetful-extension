import { matchesKey, Key } from "@earendil-works/pi-tui";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { PlanningController } from "../../src/application/planning.ts";
import type { PlanningReader } from "../../src/application/ports/planning.ts";
import type { PlanningTaskSummary } from "../../src/domain/planning.ts";
import { PiPlanningView } from "../../src/adapters/pi/planning.ts";

const ok = <T>(value: T) => Promise.resolve({ ok: true as const, value });
const projects = [{ id: 7, name: "ADAPTER_PROJECT", repo_name: "test/view" },
  { id: 8, name: "OTHER_PROJECT", repo_name: null }];
const plans = [1, 2, 3].map((id) => ({ id, title: `PLAN_${id}`, project_id: 7,
  status: "active" as const, task_count: 4 }));
const tasks = (plan: number): PlanningTaskSummary[] => [1, 2, 3, 4].map((id) => ({
  id: plan * 10 + id, title: `TASK_${plan}_${id}`, plan_id: plan,
  state: id === 4 ? "done" : "doing", blocked: id === 1, priority: "P1", version: 1,
  assigned_agent: "Worker", criteria_met: 1, criteria_total: 12,
}));
let partialFailure = false;
const reader: PlanningReader = {
  capabilities: () => ok("enabled"), projects: () => ok(projects),
  plans: (id) => ok(id === 7 ? plans : [{ ...plans[0], id: 4, project_id: 8,
    title: "OTHER_PLAN" }]),
  tasks: (id) => partialFailure && id === 1 ? Promise.resolve({ ok: false,
    error: { kind: "transient", message: "FIXTURE_TASK_READ_FAILED" } }) : ok(tasks(id)),
  plan: (id, project) => ok({ ...plans[0], id, project_id: project,
    title: `PLAN_${id}`, goal: "GOAL_START " + "Goal details. ".repeat(50) + " GOAL_END",
    context: "CONTEXT_START " + "Context details. ".repeat(150) + " CONTEXT_END" }),
  task: (id, plan) => ok({ ...tasks(plan).find((task) => task.id === id)!,
    description: "TASK_DESCRIPTION", dependency_ids: [plan * 10 + 4, 999],
    criteria: Array.from({ length: 12 }, (_, index) => ({
      id: index + 1, task_id: id, description: `CRITERION_${index + 1}`, met: index === 0,
      met_at: null,
    })),
  }),
};

export default function fixture(pi: ExtensionAPI, padded = true, panelEnabled = true) {
  let ctx: ExtensionContext;
  const controller = new PlanningController({ reader,
    preferences: { read: async () => true, write: async () => {} },
    clock: { now: () => 1700000000000, schedule: () => () => {} },
    enabled: true, ready: true, initialPreference: panelEnabled, repoName: "test/view",
  });
  const view = new PiPlanningView(controller);
  pi.on("session_start", (_event, context) => {
    ctx = context;
    if (padded) ctx.ui.notify("Conversation line\n".repeat(25), "info");
    view.mount(context);
    ctx.ui.setStatus("fixture", "VIEW_READY");
    ctx.ui.onTerminalInput((data) => {
      if (matchesKey(data, Key.ctrlAlt("o"))) {
        void ctx.ui.custom<void>((_tui, _theme, _keys, done) => ({
          invalidate() {}, render: () => ["OTHER_OVERLAY"],
          handleInput: (input) => { if (matchesKey(input, Key.escape)) done(); },
        }), { overlay: true, overlayOptions: { width: 30 } });
        return { consume: true };
      }
      if (matchesKey(data, Key.ctrlAlt("d"))) {
        view.dispose();
        view.dispose();
        ctx.ui.setStatus("fixture", "VIEW_DISPOSED");
        return { consume: true };
      }
      return undefined;
    });
  });
  pi.on("session_shutdown", () => { view.dispose(); controller.dispose(); });
  pi.on("ui_prompt_start", () => view.setPromptActive(true));
  pi.on("ui_prompt_end", () => view.setPromptActive(false));
  pi.registerShortcut("ctrl+alt+p", { description: "Details", handler: () => view.toggle() });
  pi.registerShortcut("ctrl+alt+w", { description: "Panel",
    handler: () => view.command("toggle") });
  pi.registerShortcut("ctrl+alt+y", { description: "Prompt", handler: async () => {
    await ctx.ui.confirm("ADAPTER_NATIVE_PROMPT", "Continue?");
  } });
  pi.registerShortcut("ctrl+alt+l", { description: "Add transcript", handler: async () => {
    ctx.ui.notify("Conversation line\n".repeat(25), "info");
  } });
  pi.registerCommand("view-error", { description: "Fail task summaries", handler: async () => {
    partialFailure = true;
    await controller.refresh();
  } });
  pi.registerCommand("view-status", { description: "Status", handler: async () => {
    ctx.ui.notify(view.status(), "info");
  } });
  pi.registerCommand("view", { description: "Planning view test", handler: (arg) =>
    view.command(arg) });
}
