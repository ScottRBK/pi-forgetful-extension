import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** Public-UI coexistence fixture; no providers or credentials, and no model prompts. */
export default function planningUiDriver(pi: ExtensionAPI): void {
  let starts = 0;
  let ends = 0;
  pi.on("ui_prompt_start", (_event, ctx) => {
    starts += 1;
    ctx.ui.setStatus("planning-test-prompts", `Prompt events ${starts}/${ends}`);
  });
  pi.on("ui_prompt_end", (_event, ctx) => {
    ends += 1;
    ctx.ui.setStatus("planning-test-prompts", `Prompt events ${starts}/${ends}`);
  });
  pi.on("session_start", (_event, ctx) => {
    ctx.ui.setWidget("other-extension", ["Other extension widget"]);
    ctx.ui.setStatus("planning-test-prompts", `Prompt events ${starts}/${ends}`);
  });
  pi.registerShortcut("ctrl+alt+y", {
    description: "Add UI-only transcript space without a model call",
    handler: (ctx) => ctx.ui.notify(Array.from({ length: 25 }, (_, i) =>
      `Planning layout fixture line ${i + 1}`).join("\n"), "info"),
  });
  pi.registerCommand("planning-test-prompt", {
    description: "Open an unrelated public Pi prompt",
    async handler(_args, ctx) {
      await ctx.ui.select("Unrelated prompt", ["Keep typing", "Cancel"]);
      ctx.ui.notify("Unrelated prompt closed", "info");
    },
  });
  pi.on("input", (_event, ctx) => {
    ctx.ui.notify("Test fixture: no model request", "info");
    return { action: "handled" };
  });
}
