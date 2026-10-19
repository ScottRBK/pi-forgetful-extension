import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { OverlayHandle } from "@earendil-works/pi-tui";

/** Isolated public-SDK mount probe; no provider or extension runtime. */
export default function probe(pi: ExtensionAPI) {
  let handle: OverlayHandle | undefined;
  let context: ExtensionContext;
  let starts = 0;
  let ends = 0;
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;
    context = ctx;
    ctx.ui.setWidget("planning-probe-host", (tui) => {
      handle = tui.showOverlay({
        invalidate() {},
        render: () => ["PASSIVE_PLANNING_PANEL"],
      }, { nonCapturing: true, width: 48, anchor: "top-right" });
      return { invalidate() {}, render: () => [], dispose: () => handle?.hide() };
    });
  });
  pi.on("ui_prompt_start", (_event, ctx) => {
    starts += 1;
    handle?.setHidden(true);
    ctx.ui.setStatus("probe", `PROMPTS ${starts}/${ends}`);
  });
  pi.on("ui_prompt_end", (_event, ctx) => {
    ends += 1;
    handle?.setHidden(false);
    ctx.ui.setStatus("probe", `PROMPTS ${starts}/${ends}`);
  });
  pi.registerShortcut("ctrl+alt+y", {
    description: "Probe native prompt", handler: async () => {
      await context.ui.confirm("NATIVE_PROMPT", "Continue?");
    },
  });
}
