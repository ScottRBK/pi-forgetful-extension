import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";

const exec = promisify(execFile);
const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
const enabled = process.env.FORGETFUL_TEST_TMUX === "1";

async function terminal(t: TestContext, fixture: string, fullscreen = false) {
  const root = await mkdtemp(join(tmpdir(), "pi-smoke-planning-view-"));
  const socket = join(root, "tmux.sock");
  const session = `pi-smoke-planning-${process.pid}`;
  const tmux = async (...args: string[]) => (await exec("tmux", ["-S", socket, ...args],
    { timeout: 5000 })).stdout;
  const pane = () => tmux("capture-pane", "-p", "-t", session);
  t.after(async () => {
    await tmux("kill-server").catch(() => undefined);
    await rm(root, { recursive: true, force: true });
  });
  const agent = join(root, "agent");
  await mkdir(agent);
  await writeFile(join(agent, "settings.json"), JSON.stringify({
    packages: [], quietStartup: true, tuiMode: fullscreen ? "fullscreen" : "regular",
  }));
  await writeFile(join(root, "tmux.conf"), "set-option -g remain-on-exit on\n");
  const command = ["env", "-i", `PATH=${process.env.PATH}`, "TERM=xterm-256color",
    "LANG=C.UTF-8", "PI_OFFLINE=1", "PI_TELEMETRY=0", `PI_CODING_AGENT_DIR=${agent}`,
    process.execPath, resolve("node_modules/@earendil-works/pi-coding-agent/dist/cli.js"),
    "--offline", "--no-session", "--no-extensions", "--no-mcp",
    "--no-context-files", "--no-tools", "--approve", "--no-skills", "--no-prompt-templates",
    "--extension", resolve(fixture)]
    .map(quote).join(" ");
  await tmux("-f", join(root, "tmux.conf"), "new-session", "-d", "-s", session,
    "-x", "120", "-y", "36", "-c", root,
    "-e", `PI_CODING_AGENT_DIR=${agent}`, command);
  const until = async (pattern: RegExp, present = true) => {
    const deadline = Date.now() + 10000;
    let screen = "";
    while (Date.now() < deadline) {
      screen = await pane();
      if (pattern.test(screen) === present) return screen;
      await new Promise((done) => setTimeout(done, 40));
    }
    assert.fail(`Expected ${pattern} ${present ? "present" : "absent"}\n${screen}`);
  };
  return {
    pane, until,
    keys: (...keys: string[]) => tmux("send-keys", "-t", session, ...keys),
    text: (value: string) => tmux("send-keys", "-t", session, "-l", value),
    resize: (width: number, height: number) => tmux("resize-window", "-t", session,
      "-x", String(width), "-y", String(height)),
  };
}

test("public zero-row widget host keeps native Pi prompt events and editor focus",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-mount-probe.ts");
    await ui.until(/PASSIVE_PLANNING_PANEL/);
    await ui.text("KEEP_THIS_DRAFT");
    await ui.until(/KEEP_THIS_DRAFT/);
    await ui.keys("C-M-y");
    await ui.until(/NATIVE_PROMPT/);
    await ui.until(/PROMPTS 1\/0/);
    await ui.until(/PASSIVE_PLANNING_PANEL/, false);
    await ui.keys("Escape");
    await ui.until(/PROMPTS 1\/1/);
    await ui.until(/PASSIVE_PLANNING_PANEL/);
    assert.match(await ui.pane(), /KEEP_THIS_DRAFT/);
  });

test("compact view bounds rows, uses supplied counts and exposes partial data",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-view.ts");
    const screen = await ui.until(/VIEW_PROJECT/);
    assert.match(screen, /3 active plans/);
    assert.match(screen, /4\/9 done.*2 cancelled/);
    assert.match(screen, /doing.*blocked.*DOING_BLOCKED/);
    assert.match(screen, /\+1 more task/);
    assert.match(screen, /\+1 more plan/);
    assert.match(screen, /PARTIAL_FAILURE/);
    assert.doesNotMatch(screen, /OVERFLOW_TASK|PLAN_3|0\/0 done/);
    const lines = screen.split("\n");
    const first = lines.findIndex((line) => line.includes("┌"));
    const last = lines.findIndex((line) => line.includes("└"));
    assert.ok(last - first + 1 <= 14);
    const border = lines[first].slice(lines[first].indexOf("┌"), lines[first].indexOf("┐") + 1);
    assert.equal(border.length, 48);
  });

for (const fullscreen of [false, true]) {
  test(`adapter mounts synchronously and preserves typing through details (${fullscreen})`,
    { skip: !enabled }, async (t) => {
      const ui = await terminal(t, "test/fixtures/planning-adapter.ts", fullscreen);
      await ui.until(/ADAPTER_PROJECT/);
      await ui.text("DRAFT_STAYS");
      await ui.keys("C-M-p");
      await ui.until(/Forgetful \/ Plans/);
      await ui.until(/TASK_1_1/);
      await ui.keys("Down", "Enter");
      await ui.until(/TASK_DESCRIPTION/);
      await ui.keys("End");
      await ui.until(/CRITERION_12/);
      await ui.keys("Home");
      await ui.until(/#999.*Unknown/);
      await ui.keys("Escape");
      await ui.until(/Enter task/);
      await ui.keys("Right");
      await ui.until(/TASK_2_1/);
      await ui.keys("g");
      await ui.until(/GOAL_START/);
      await ui.keys("End");
      await ui.until(/CONTEXT_END/);
      await ui.keys("Escape");
      await ui.until(/Enter task/);
      await ui.keys("Tab");
      await ui.until(/Choose project/);
      await ui.keys("Down", "Enter");
      await ui.until(/OTHER_PLAN/);
      await ui.keys("Escape");
      await ui.until(/Forgetful \/ Plans/, false);
      await ui.until(/ADAPTER_PROJECT/);
      await ui.text("_CONTINUES");
      await ui.until(/DRAFT_STAYS_CONTINUES/);
      await ui.keys("C-M-y");
      await ui.until(/ADAPTER_NATIVE_PROMPT/);
      await ui.until(/ADAPTER_PROJECT/, false);
      await ui.keys("Escape");
      await ui.until(/ADAPTER_PROJECT/);
      await ui.resize(80, 24);
      await ui.until(/ADAPTER_PROJECT/, false);
      await ui.keys("C-M-p");
      await ui.until(/Forgetful \/ Plans/);
      await ui.keys("Escape");
      await ui.until(/Forgetful \/ Plans/, false);
      await ui.resize(120, 36);
      await ui.until(/ADAPTER_PROJECT/);
      assert.match(await ui.pane(), /DRAFT_STAYS_CONTINUES/);
    });
}

test("rendering separates availability, empty, stale and sanitized error states",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-view.ts");
    await ui.until(/VIEW_PROJECT/);
    for (const [state, expected] of [
      ["loading", "Loading plans"], ["no-project", "No unique project mapping"],
      ["disabled", "Planning disabled on server"], ["unavailable", "Planning unavailable"],
      ["denied", "Planning access denied"], ["error", "Planning read failed"],
      ["not-ready", "Connection not configured"], ["empty", "No active plans"],
    ]) {
      await ui.text(`/view-state ${state}`);
      await ui.keys("Enter");
      const screen = await ui.until(new RegExp(expected));
      if (state !== "empty") assert.doesNotMatch(screen, /No active plans|0 active plans/);
    }
    await ui.text("/view-state stale");
    await ui.keys("Enter");
    const stale = await ui.until(/Stale.*2023-11-14/);
    assert.match(stale, /OUTAGE/);
    assert.match(stale, /\+2 more plans/);
    assert.doesNotMatch(stale, /PLAN_2/);
    await ui.text("/view-state unsafe");
    await ui.keys("Enter");
    const safe = await ui.until(/\[redacted\]/);
    assert.match(safe, /SAFE/);
    assert.doesNotMatch(safe, /SECRET_VALUE|INJECTED/);
  });

test("regular-mode panel waits for enough chat space to leave widgets and editor uncovered",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-adapter-short.ts");
    const short = await ui.until(/VIEW_READY/);
    assert.doesNotMatch(short, /Forgetful ·/);
    const draft = "DRAFT_START_" + "x".repeat(90) + "_DRAFT_END";
    await ui.text(draft);
    assert.match(await ui.until(/DRAFT_END/), new RegExp(draft));
    await ui.keys("C-M-l");
    const long = await ui.until(/ADAPTER_PROJECT/);
    assert.match(long, new RegExp(draft));
    const lines = long.split("\n");
    assert.ok(lines.findIndex((line) => line.includes("└")) <
      lines.findIndex((line) => line.includes("DRAFT_START")));
  });

for (const fullscreen of [false, true]) {
  test(`disposing details removes only its own overlay (${fullscreen})`,
    { skip: !enabled }, async (t) => {
      const ui = await terminal(t, "test/fixtures/planning-adapter.ts", fullscreen);
      await ui.until(/ADAPTER_PROJECT/);
      await ui.text("DRAFT_AFTER_DISPOSE");
      await ui.keys("C-M-p");
      await ui.until(/Forgetful \/ Plans/);
      await ui.keys("C-M-o");
      await ui.until(/OTHER_OVERLAY/);
      await ui.keys("C-M-d");
      await ui.until(/VIEW_DISPOSED/);
      const screen = await ui.until(/Forgetful \/ Plans/, false);
      assert.match(screen, /OTHER_OVERLAY/);
      await ui.keys("Escape");
      await ui.until(/OTHER_OVERLAY/, false);
      await ui.text("_OK");
      await ui.until(/DRAFT_AFTER_DISPOSE_OK/);
      assert.doesNotMatch(await ui.pane(), /Forgetful ·|ADAPTER_PROJECT/);
    });
}

test("status exposes partial errors while the panel is hidden",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-adapter.ts");
    await ui.until(/ADAPTER_PROJECT/);
    await ui.text("/view-error");
    await ui.keys("Enter");
    await ui.until(/Partial.*FIXTURE_TASK_READ_FAILED/);
    await ui.text("/view off");
    await ui.keys("Enter");
    await ui.until(/Forgetful ·/, false);
    await ui.text("/view-status");
    await ui.keys("Enter");
    const screen = await ui.until(/Planning panel: off/);
    assert.match(screen, /FIXTURE_TASK_READ_FAILED/);
    assert.match(screen, /last success: 2023-11-14/);
  });

test("panel off releases its overlay so Pi can change terminal mode",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-adapter.ts");
    await ui.until(/ADAPTER_PROJECT/);
    await ui.text("/view off");
    await ui.keys("Enter");
    await ui.until(/Forgetful ·/, false);
    await ui.text("/settings");
    await ui.keys("Enter");
    await ui.text("tui mode");
    await ui.until(/TUI mode.*regular/);
    await ui.keys("Enter");
    await ui.until(/TUI mode.*fullscreen/);
    await ui.keys("Escape");
    await ui.until(/Type to search/, false);
    await ui.text("/view on");
    await ui.keys("Enter");
    await ui.until(/ADAPTER_PROJECT/);
  });

test("details work independently of the initial off preference",
  { skip: !enabled }, async (t) => {
    const ui = await terminal(t, "test/fixtures/planning-adapter-off.ts");
    const initial = await ui.until(/VIEW_READY/);
    assert.doesNotMatch(initial, /Forgetful ·/);
    await ui.text("OFF_DRAFT");
    await ui.keys("C-M-p");
    await ui.until(/TASK_1_1/);
    await ui.keys("Enter");
    await ui.until(/TASK_DESCRIPTION/);
    await ui.keys("Escape");
    await ui.until(/Enter task/);
    await ui.keys("Escape");
    await ui.until(/Forgetful \/ Plans/, false);
    await ui.text("_CONTINUES");
    assert.doesNotMatch(await ui.until(/OFF_DRAFT_CONTINUES/), /Forgetful ·/);
    await ui.keys("C-M-w");
    await ui.until(/ADAPTER_PROJECT/);
  });
