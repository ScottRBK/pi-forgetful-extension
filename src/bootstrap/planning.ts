import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { PlanningController } from "../application/planning.ts";
import { ApiPlanningReader } from "../adapters/forgetful/planning.ts";
import { LocalPlanningPreferences } from "../adapters/local/planning-settings.ts";
import { PiPlanningView } from "../adapters/pi/planning.ts";
import type { ForgetfulConfig } from "../config.ts";

/** Composition only: the viewer has its own readiness, not capture's discovery state. */
export function createPlanningRuntime(
  ctx: ExtensionContext,
  config: ForgetfulConfig,
  discoverRepository: () => Promise<string | undefined>,
) {
  const controller = new PlanningController({
    reader: new ApiPlanningReader(config.instance),
    preferences: new LocalPlanningPreferences(config.paths.userSettings),
    clock: {
      now: () => Date.now(),
      schedule(callback, delayMs) {
        const timer = setTimeout(callback, delayMs);
        timer.unref();
        return () => clearTimeout(timer);
      },
    },
    enabled: config.enabled,
    ready: false,
    initialPreference: config.planningPanel ?? false,
  });
  const view = new PiPlanningView(controller);
  try { view.mount(ctx); }
  catch (error) {
    // A partially mounted optional view must not leave a polling controller behind.
    try { view.dispose(); } catch { /* Preserve the original mounting failure. */ }
    controller.dispose();
    throw error;
  }
  let disposed = false;
  // Only local Git discovery. Remote lookup is owned by the workflow and visibility-gated.
  void discoverRepository().then((repoName) => {
    if (!disposed) return controller.setConnection({
      enabled: config.enabled, ready: true, repoName,
    });
  }).catch(() => {
    if (!disposed) return controller.setConnection({ enabled: config.enabled, ready: true });
  });
  return {
    command: (action: string) => view.command(action),
    toggleDetails: () => view.toggle(),
    setPromptActive: (active: boolean) => view.setPromptActive(active),
    status: () => view.status(),
    dispose() {
      if (disposed) return;
      disposed = true;
      try { view.dispose(); }
      finally { controller.dispose(); }
    },
  };
}

export type PlanningRuntime = ReturnType<typeof createPlanningRuntime>;
