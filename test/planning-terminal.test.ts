import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";

const exec = promisify(execFile);
const enabled = process.env.FORGETFUL_TEST_TMUX === "1";
const quote = (s: string) => `'${s.replaceAll("'", "'\\''")}'`;
const timestamp = "2026-01-01T00:00:00Z";
const plan = { id: 11, title: "Visible delivery plan", project_id: 7, status: "active",
  task_count: 3, created_at: timestamp, updated_at: timestamp };
const tasks = [
  { id: 21, title: "Build floating view", state: "doing", blocked: false },
  { id: 22, title: "Waiting for view", state: "todo", blocked: true },
  { id: 23, title: "Completed research", state: "done", blocked: false },
].map((task) => ({ ...task, plan_id: 11, priority: "P1", assigned_agent: "Fixture agent",
  version: 1, criteria_met: 0, criteria_total: 1, created_at: timestamp, updated_at: timestamp }));

async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean,
  description: string, timeout = 8_000): Promise<T> {
  const deadline = Date.now() + timeout;
  let value: T;
  do {
    value = await read();
    if (accept(value)) return value;
    await new Promise((done) => setTimeout(done, 50));
  } while (Date.now() < deadline);
  assert.fail(`${description}\nLast observation: ${JSON.stringify(value)}`);
}

async function launch(t: TestContext, mode: "regular" | "fullscreen") {
  const root = await mkdtemp(join(tmpdir(), "pi-smoke-planning-"));
  const socket = join(root, "tmux.sock");
  const session = `pi-smoke-planning-${process.pid}`;
  const agentDir = join(root, "agent");
  const settingsPath = join(agentDir, "forgetful/settings.json");
  const historyPath = join(root, "session.jsonl");
  const requests: string[] = [];
  const tmux = async (...args: string[]) => (await exec("tmux", ["-S", socket, ...args],
    { timeout: 3_000 })).stdout;
  const pane = () => tmux("capture-pane", "-p", "-t", session);
  const server = createServer((request, response) => {
    const url = new URL(request.url!, "http://localhost");
    requests.push(`${request.method} ${request.url}`);
    response.setHeader("content-type", "application/json");
    if (request.method !== "GET") {
      response.writeHead(405).end(JSON.stringify({ error: "Viewer must be read-only" }));
      return;
    }
    let body: unknown;
    switch (url.pathname) {
      case "/.well-known": body = { schema_version: 1, capabilities: { planning: true } }; break;
      case "/api/v1/projects": body = { projects: [
        { id: 7, name: "Panel project", repo_name: "test/planning-ui" },
        { id: 8, name: "Other project", repo_name: "test/other" },
      ], total: 2 }; break;
      case "/api/v1/plans": body = { plans: url.searchParams.get("project_id") === "7"
        ? [plan] : [], total: url.searchParams.get("project_id") === "7" ? 1 : 0 }; break;
      case "/api/v1/tasks": body = { tasks, total: tasks.length }; break;
      case "/api/v1/plans/11": body = { ...plan, goal: "Keep work visible",
        context: "Planning is human-facing only" }; break;
      case "/api/v1/tasks/21": body = { ...tasks[0], description: "Inspect this real REST detail",
        dependency_ids: [23], criteria: [{ id: 31, task_id: 21,
          description: "Keyboard remains usable", met: false, met_at: null,
          created_at: timestamp, updated_at: timestamp }] }; break;
      default: response.writeHead(404).end(JSON.stringify({ error: "Not Found" })); return;
    }
    response.end(JSON.stringify(body));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  t.after(async () => {
    const screen = await pane().catch(() => "No live pane");
    t.diagnostic(screen);
    await tmux("kill-server").catch(() => undefined);
    await new Promise<void>((done) => {
      server.close(() => done());
      server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await exec("git", ["init", "--quiet", root]);
  await exec("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/planning-ui.git"]);
  await writeFile(join(agentDir, "settings.json"), JSON.stringify({ packages: [],
    quietStartup: true, retry: { enabled: false }, compaction: { enabled: false } }));
  await writeFile(settingsPath, JSON.stringify({ base_url:
    `http://127.0.0.1:${address.port}/api/v1`, capture_mode: "off", planning_panel: true }));
  const command = ["env", "-i", `PATH=${process.env.PATH}`, "TERM=xterm-256color", "LANG=C.UTF-8",
    "PI_OFFLINE=1", "PI_TELEMETRY=0", `PI_CODING_AGENT_DIR=${agentDir}`, process.execPath,
    resolve("node_modules/@earendil-works/pi-coding-agent/dist/cli.js"),
    "--offline", "--session", historyPath, "--no-extensions", "--no-mcp", "--no-skills",
    "--no-context-files", "--no-prompt-templates", "--no-themes", "--no-tools", "--approve",
    "--tui-mode", mode, "--extension", resolve("index.ts"), "--extension",
    resolve("test/fixtures/planning-ui-driver.ts")];
  await tmux("-f", "/dev/null", "new-session", "-d", "-s", session,
    "-x", "140", "-y", "45", "-c", root, command.map(quote).join(" "));
  await tmux("set-option", "-t", session, "remain-on-exit", "on");
  return { pane, requests, settingsPath, historyPath,
    key: (...keys: string[]) => tmux("send-keys", "-t", session, ...keys),
    type: (text: string) => tmux("send-keys", "-t", session, "-l", text),
    resize: (width: number, height: number) => tmux("resize-window", "-t", session,
      "-x", String(width), "-y", String(height)),
    async command(text: string) {
      await tmux("send-keys", "-t", session, "-l", text);
      await tmux("send-keys", "-t", session, "Enter");
    },
  };
}

for (const mode of ["regular", "fullscreen"] as const) {
  test(`planning panel coexists with typing and real prompts (${mode})`, {
    skip: !enabled, timeout: 45_000,
  }, async (t) => {
    // Arrange: actual Pi and HTTP, no model configured, unrelated editor widget installed.
    const terminal = await launch(t, mode);
    if (mode === "regular") {
      await until(terminal.pane, (screen) => screen.includes("Other extension widget"),
        "Short regular transcript ready");
      const longDraft = "0123456789".repeat(11);
      await terminal.type(longDraft);
      const short = await until(terminal.pane, (screen) => screen.includes(longDraft),
        "Insufficient chat space must not obscure a full-width draft");
      assert.doesNotMatch(short, /Build floating view/);
      assert.equal(terminal.requests.length, 0, "Panel without space must not read REST");
      await terminal.key("C-u", "C-M-y");
    }

    // Act: open a persistent panel once there is room, then type without focusing it.
    const initial = await until(terminal.pane, (screen) => screen.includes("Build floating view"),
      "Saved preference must display real active tasks without a memory model");
    await terminal.type("draft survives overlays");
    const draft = await until(terminal.pane, (screen) => screen.includes("draft survives overlays"),
      "Passive panel must leave editor focus alone");

    // Assert: top-right panel, separate widget and no long-lived blocking UI prompt.
    assert.match(initial, /Waiting for view/);
    assert.match(initial, /Other extension widget/);
    assert.match(initial, /Prompt events 0\/0/);
    const panelRow = initial.split("\n").findIndex((row) => row.includes("Build floating view"));
    const widgetRow = draft.split("\n").findIndex((row) => row.includes("Other extension widget"));
    assert.ok(panelRow >= 0 && panelRow < widgetRow);
    assert.ok(initial.split("\n")[panelRow]!.indexOf("Build floating view") > 60);
    const panelBottom = draft.split("\n").findIndex((row) => row.includes("└"));
    assert.ok(panelBottom < widgetRow, "Panel must not cover another widget or the editor");
    assert.ok(terminal.requests.every((request) => request.startsWith("GET ")));
  });
}

test("real planning controls preserve drafts, preferences, prompt events and hidden traffic", {
  skip: !enabled, timeout: 60_000,
}, async (t) => {
  // Arrange: real extension plus an unrelated widget/prompt; saved panel initially enabled.
  const terminal = await launch(t, "fullscreen");
  await until(terminal.pane, (screen) => screen.includes("Build floating view"), "Panel ready");
  const before = await terminal.pane();
  const widgetRow = before.split("\n").findIndex((row) => row.includes("Other extension widget"));
  await terminal.type("draft preserved across detail browsing");

  // Act: shortcut, full task inspection, project picker and close without submitting the draft.
  await terminal.key("C-M-p");
  await until(terminal.pane, (screen) => screen.includes("Forgetful / Plans") &&
    screen.includes("Visible delivery plan"), "Browser reads the selected plan");
  await terminal.key("g");
  await until(terminal.pane, (screen) => screen.includes("Keep work visible"),
    "Plan goal/context is available");
  await terminal.key("Escape");
  await until(terminal.pane, (screen) => screen.includes("Enter task"), "Back to task list");
  await terminal.key("Enter");
  await until(terminal.pane, (screen) => screen.includes("Inspect this real REST detail") &&
    screen.includes("Keyboard remains usable") && screen.includes("Completed research"),
  "Task inspection reads criteria and resolves dependency summaries");
  await terminal.key("Escape");
  await until(terminal.pane, (screen) => screen.includes("Enter task"), "Close task inspection");
  await terminal.key("Tab");
  await until(terminal.pane, (screen) => screen.includes("Other project"), "All-project picker");
  await terminal.key("Escape");
  await until(terminal.pane, (screen) => screen.includes("Enter task"), "Close project picker");
  await terminal.key("C-M-p");
  await until(terminal.pane, (screen) =>
    screen.includes("draft preserved across detail browsing") &&
    !screen.includes("Forgetful / Plans") && screen.includes("Prompt events 1/1"),
  "Closing details balances prompt events and restores the draft");

  // Act: an unrelated prompt must still get its own lifecycle and suppress the panel.
  await terminal.key("C-u");
  await terminal.command("/planning-test-prompt");
  await until(terminal.pane, (screen) => screen.includes("Unrelated prompt") &&
    screen.includes("Prompt events 2/1") && !screen.includes("Build floating view"),
  "Other extension's prompt owns focus while planning is hidden");
  await terminal.key("Escape");
  await until(terminal.pane, (screen) => screen.includes("Prompt events 2/2") &&
    screen.includes("Build floating view"), "Normal prompt lifecycle restores panel");

  // Act: toggle saves preference without adding an editor/widget row.
  await terminal.key("C-M-w");
  await until(async () => JSON.parse(await readFile(terminal.settingsPath, "utf8")),
    (settings) => settings.planning_panel === false, "Panel preference persisted");
  const hidden = await until(terminal.pane, (screen) => !screen.includes("Build floating view"),
    "Panel hidden");
  assert.equal(hidden.split("\n").findIndex((row) => row.includes("Other extension widget")),
    widgetRow, "Zero-row host must not move the editor's other widgets");
  const requestCount = terminal.requests.length;
  await new Promise((done) => setTimeout(done, 10_300));
  assert.equal(terminal.requests.length, requestCount, "Hidden views must not poll");

  // Act: re-enable, then use a narrow terminal and restore enough room.
  await terminal.command("/forgetful plans on");
  await until(terminal.pane, (screen) => screen.includes("Build floating view"), "Panel restored");
  await terminal.resize(80, 24);
  await until(terminal.pane, (screen) => !screen.includes("Build floating view"),
    "Narrow view hidden");
  await terminal.resize(140, 45);
  await until(terminal.pane, (screen) => screen.includes("Build floating view"),
    "Wide view refreshed");
  await terminal.command("/forgetful off");
  await until(terminal.pane, (screen) => screen.includes("Forgetful off.") &&
    !screen.includes("Build floating view"), "Master switch hides planning");
  assert.equal(JSON.parse(await readFile(terminal.settingsPath, "utf8")).planning_panel, true);
  await terminal.command("/forgetful on");
  await until(terminal.pane, (screen) => screen.includes("Build floating view"),
    "Master enablement restores the saved preference");
  await terminal.command("/reload");
  await until(terminal.pane, (screen) => screen.includes("Reloaded") &&
    screen.includes("Build floating view"), "Reload replaces owned panel and controller");

  // Assert: all external calls were reads; rendered knowledge never entered saved conversation.
  assert.ok(terminal.requests.every((request) => request.startsWith("GET ")));
  const history = await readFile(terminal.historyPath, "utf8").catch(() => "");
  assert.doesNotMatch(history, /Visible delivery plan|Build floating view|Keyboard remains usable/);
});
