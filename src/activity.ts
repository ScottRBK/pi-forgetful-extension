import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Loader, type TUI } from "@earendil-works/pi-tui";

const WIDGET = "forgetful-activity";

class ActivityLoader extends Loader {
  private readonly started = Date.now();
  private readonly elapsedTimer: ReturnType<typeof setInterval>;

  constructor(tui: TUI, spinnerColor: (text: string) => string,
    messageColor: (text: string) => string, private label: string) {
    super(tui, spinnerColor, messageColor, label);
    this.elapsedTimer = setInterval(() => this.refresh(), 1_000);
    this.elapsedTimer.unref?.();
    this.refresh();
  }

  setLabel(label: string): void {
    this.label = label;
    this.refresh();
  }

  private refresh(): void {
    const seconds = Math.floor((Date.now() - this.started) / 1_000);
    this.setMessage(`Forgetful · ${this.label} · ${seconds}s total`);
  }

  dispose(): void {
    clearInterval(this.elapsedTimer);
    this.stop();
  }
}

/** One transient Pi widget. It never appends messages or modifies conversation context. */
export class ForgetfulActivity {
  private readonly stages = new Map<string, string>();
  private loader?: ActivityLoader;
  private closed = false;
  private idleNotice?: string;

  constructor(private readonly ctx: ExtensionContext) {}

  set(key: string, label?: string): void {
    if (this.closed || this.ctx.mode !== "tui") return;
    if (label) this.stages.set(key, label);
    else this.stages.delete(key);
    this.refresh();
  }

  notice(message?: string): void {
    if (this.closed || this.ctx.mode !== "tui") return;
    this.idleNotice = message;
    this.refresh();
  }

  private refresh(): void {
    const message = [...new Set(this.stages.values())].join(" + ");
    if (!message) {
      this.loader?.dispose();
      this.loader = undefined;
      this.ctx.ui.setWidget(WIDGET, this.idleNotice
        ? [`Forgetful · ${this.idleNotice}`] : undefined);
    } else if (this.loader) {
      this.loader.setLabel(message);
    } else {
      this.ctx.ui.setWidget(WIDGET, (tui, theme) => {
        this.loader = new ActivityLoader(tui, (text) => theme.fg("accent", text),
          (text) => theme.fg("muted", text), message);
        return this.loader;
      }, { placement: "aboveEditor" });
    }
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.stages.clear();
    const ownsWidget = Boolean(this.loader || this.idleNotice);
    this.loader?.dispose();
    this.loader = undefined;
    if (ownsWidget && this.ctx.mode === "tui") this.ctx.ui.setWidget(WIDGET, undefined);
  }
}
