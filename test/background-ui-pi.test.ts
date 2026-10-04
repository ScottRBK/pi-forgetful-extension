import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { DurableQueueStore } from "../src/queue.ts";

const exec = promisify(execFile);
const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Opt in: FORGETFUL_TEST_TMUX=1 node --import tsx --test test/background-ui-pi.test.ts
// Also set FORGETFUL_TEST_HIDE_TOOLS=/absolute/path/index.ts to load Hide Tools.
const enabled = process.env.FORGETFUL_TEST_TMUX === "1";
const hideTools = process.env.FORGETFUL_TEST_HIDE_TOOLS;
const quote = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`;

async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean,
  description: string, timeout = 5_000): Promise<T> {
  const deadline = Date.now() + timeout;
  let value: T;
  do {
    value = await read();
    if (accept(value)) return value;
    // Poll a condition, never use elapsed time as evidence that an operation completed.
    await new Promise((resolve) => setTimeout(resolve, 40));
  } while (Date.now() < deadline);
  assert.fail(`${description}\nLast observation: ${JSON.stringify(value)}`);
}

interface Request {
  method: string;
  path: string;
  body: {
    model?: string;
    tools?: { name: string }[];
    messages?: { role: string; content?: string | { type: string; text?: string }[] }[];
  };
  response: ServerResponse;
}

const progress = new RegExp([
  "starting…", "resuming \\d+ queued tasks?…",
  "processing queued work · \\d+ remaining…", "saving work locally…",
  "finding relevant memories…", "reviewing session…", "saving to Forgetful…",
  "checking previous save…",
].join("|"));
const noRecall = { search: false, queries: [], queryIntent: "", entities: [] };

/** Every request is held until the test replies, except deterministic main-model answers. */
async function startTerminal(t: TestContext, mapped = true) {
  const root = await mkdtemp(join(tmpdir(), "pi-smoke-background-ui-"));
  const socket = join(root, "tmux.sock");
  const session = `pi-smoke-${process.pid}`;
  const agentDir = join(root, "agent");
  const sessionFile = join(root, "session.jsonl");
  let panePid: number | undefined;
  const processExists = () => {
    if (!panePid) return false;
    try { process.kill(panePid, 0); return true; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
      throw error;
    }
  };
  const tmux = async (...args: string[]) => (await exec("tmux", ["-S", socket, ...args],
    { timeout: 3_000 })).stdout;
  const pane = () => tmux("capture-pane", "-p", "-t", session);
  const requests: Request[] = [];
  let mainCalls = 0;
  let projectsReady = false;
  const projects = { projects: mapped ? [{ id: 7, name: "UI test",
    repo_name: "test/background-ui" }] : [], total: mapped ? 1 : 0 };
  let failNextProjectLookup = false;
  let rejectedCapturesRemaining = 0;
  const invalidCapture = { content: [{ type: "toolCall", id: "invalid-capture",
    name: "submit_capture_candidates", arguments: { candidates: "not an array" } }],
    stopReason: "toolUse" };
  const json = (response: ServerResponse, value: unknown) => {
    assert.equal(response.writableEnded, false, "A gate must only be released once");
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(value));
  };
  const server = createServer(async (request, response) => {
    try {
      let body = "";
      for await (const chunk of request) body += chunk;
      const input = body ? JSON.parse(body) : {};
      const path = new URL(request.url!, "http://localhost").pathname;
      requests.push({ method: request.method!, path, body: input, response });
      if (path === "/api/v1/projects") {
        if (failNextProjectLookup) {
          failNextProjectLookup = false;
          response.writeHead(503).end("Controlled status lookup failure");
        } else if (projectsReady) json(response, projects);
      } else if (path === "/provider" && input.model === "main") {
        json(response, { content: [{ type: "text", text: `PI_SMOKE_MAIN_OK_${++mainCalls}` }],
          stopReason: "stop" });
      } else if (path === "/provider" && rejectedCapturesRemaining > 0 &&
          input.tools?.some((tool: { name: string }) =>
            tool.name === "submit_capture_candidates")) {
        rejectedCapturesRemaining -= 1;
        json(response, invalidCapture);
      } else if (!["/provider", "/api/v1/memories/search", "/api/v1/memories"].includes(path)) {
        response.writeHead(500).end(`Unexpected test request: ${path}`);
      }
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });
  const evidence = async (stage: string) => {
    const screen = await pane();
    t.diagnostic(`Terminal: ${stage} (${hideTools ? "with Hide Tools" : "Pi only"})`);
    screen.split("\n").forEach((line, index) => {
      if (line.trim()) t.diagnostic(`${String(index + 1).padStart(2)} | ${line}`);
    });
    return screen;
  };
  t.after(async () => {
    try {
      await evidence("cleanup").catch(() => t.diagnostic("No live pane"));
      t.diagnostic("External requests: " + requests.map(({ path, body }) =>
        body.model ? `${body.model}:${body.tools?.find((tool) =>
          tool.name.startsWith("submit_"))?.name ?? "answer"}` : path).join(", "));
      await tmux("kill-server").catch(() => undefined);
      if (processExists()) process.kill(panePid!, "SIGKILL");
    } finally {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    }
  });
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await exec("git", ["init", "--quiet", root]);
  await exec("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/background-ui.git"]);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  await writeFile(join(agentDir, "settings.json"), JSON.stringify({
    packages: [], defaultProvider: "ui-test", defaultModel: "main",
    quietStartup: true, retry: { enabled: false }, compaction: { enabled: false },
  }));
  if (hideTools) await writeFile(join(agentDir, "pi-hide-tools.json"),
    JSON.stringify({ hidden: true, hideFailures: true }));
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `${base}/api/v1`, model: "ui-test/memory", capture_mode: "auto",
    timeout_ms: 60_000, recall_model_timeout_ms: 60_000,
  }));
  const command = ["env", "-i", `PATH=${process.env.PATH}`, "TERM=xterm-256color",
    "LANG=C.UTF-8", "PI_OFFLINE=1", "PI_TELEMETRY=0", `PI_CODING_AGENT_DIR=${agentDir}`,
    `FORGETFUL_TEST_PROVIDER_URL=${base}/provider`, process.execPath,
    process.env.FORGETFUL_TEST_PI_CLI ??
      join(repository, "node_modules/@earendil-works/pi-coding-agent/dist/cli.js"),
    "--no-extensions", "--extension", join(repository, "index.ts"),
    "--extension", join(repository, "test/fixtures/background-ui-provider.ts"),
    ...(hideTools ? ["--extension", resolve(hideTools)] : []),
    "--no-skills", "--no-prompt-templates", "--no-themes", "--no-tools",
    "--provider", "ui-test", "--model", "main", "--session", sessionFile];
  await tmux("-f", "/dev/null", "new-session", "-d", "-s", session,
    "-x", "100", "-y", "45", "-c", root, command.map(quote).join(" "));
  await tmux("set-option", "-t", session, "remain-on-exit", "on");
  panePid = Number((await tmux("display-message", "-p", "-t", session, "#{pane_pid}")).trim());
  assert.ok(Number.isSafeInteger(panePid) && panePid > 1);
  await until(async () => requests.filter((request) => request.path === "/api/v1/projects"),
    (held) => held.length === 1,
    "CLI must start project discovery", 10_000);
  return {
    pane, requests, evidence,
    async queue() {
      const queues = join(agentDir, "forgetful", "queues");
      const directories = await readdir(queues);
      assert.equal(directories.length, 1);
      return new DurableQueueStore({ directory: join(queues, directories[0]!) });
    },
    failNextProjectLookup() { failNextProjectLookup = true; },
    rejectCaptureSubmissions() {
      rejectedCapturesRemaining = 3;
      for (const request of requests) {
        if (rejectedCapturesRemaining > 0 &&
            request.body.tools?.some((tool) => tool.name === "submit_capture_candidates") &&
            !request.response.writableEnded && !request.response.destroyed) {
          rejectedCapturesRemaining -= 1;
          json(request.response, invalidCapture);
        }
      }
    },
    async damageQueue() {
      const queues = join(agentDir, "forgetful", "queues");
      const backups = new Map<string, string | undefined>();
      for (const name of await readdir(queues)) {
        const path = join(queues, name, "queue.json");
        backups.set(path, await readFile(path, "utf8").catch(() => undefined));
        await writeFile(path, "{");
      }
      return async () => {
        for (const [path, content] of backups) {
          if (content === undefined) await rm(path, { force: true });
          else await writeFile(path, content);
        }
      };
    },
    async restart() {
      await tmux("respawn-pane", "-k", "-t", session, "-c", root, command.map(quote).join(" "));
      panePid = Number((await tmux("display-message", "-p", "-t", session, "#{pane_pid}")).trim());
    },
    history: () => readFile(sessionFile, "utf8"),
    async command(text: string) {
      await tmux("send-keys", "-t", session, "-l", text);
      await tmux("send-keys", "-t", session, "Enter");
    },
    async prompt(text: string, count: number) {
      await tmux("send-keys", "-t", session, "-l", text);
      await tmux("send-keys", "-t", session, "Enter");
      return until(pane, (screen) => screen.includes(`PI_SMOKE_MAIN_OK_${count}`),
        "Main model must answer without waiting for background work");
    },
    failDiscovery() {
      const pending = requests.find((request) => request.path === "/api/v1/projects");
      assert.ok(pending);
      pending.response.writeHead(503).end("Controlled service outage");
    },
    ready() {
      projectsReady = true;
      for (const request of requests.filter((request) => request.path === "/api/v1/projects")) {
        if (!request.response.writableEnded && !request.response.destroyed)
          json(request.response, projects);
      }
    },
    async submission(name: string, index = 0) {
      const matches = await until(async () => requests.filter((request) =>
        request.body.model === "memory" && request.body.tools?.some((tool) => tool.name === name)),
      (found) => found.length > index, `Private provider must receive ${name}`);
      const request = matches[index]!;
      return {
        response: request.response,
        body: request.body,
        reply(args: Record<string, unknown>) {
          json(request.response, { content: [{ type: "toolCall", id: `${name}-${index}`, name,
            arguments: args }], stopReason: "toolUse" });
        },
      };
    },
    async rest(method: string, path: string) {
      const matches = await until(async () => requests.filter((request) =>
        request.method === method && request.path === path), (found) => found.length === 1,
      `Forgetful must receive ${method} ${path}`);
      return { response: matches[0]!.response,
        reply: (body: unknown) => json(matches[0]!.response, body) };
    },
    async exit() {
      await evidence("before Ctrl+D");
      await tmux("send-keys", "-t", session, "C-d");
      await until(() => tmux("display-message", "-p", "-t", session, "#{pane_dead}"),
        (value) => value.trim() === "1", "Ctrl+D must close the terminal");
      // tmux can leave pane_dead_status empty. Verify the owned process really exited too.
      await until(async () => {
        if (!processExists()) return "exited";
        try {
          return (await exec("ps", ["-p", String(panePid), "-o", "stat="])).stdout.trim();
        } catch (error) {
          if (!processExists()) return "exited";
          throw error;
        }
      }, (state) => state === "exited" || state.startsWith("Z"),
        "Ctrl+D must exit the process while the model gate remains held");
    },
  };
}

function widgetText(screen: string): string {
  const lines = screen.split("\n");
  const start = lines.findIndex((line) => line.includes("Forgetful ·"));
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && /^[─━]{10}/.test(line));
  assert.ok(end > start, "The activity widget must remain directly above the editor");
  return lines.slice(start, end).map((line) => line.trim()).join(" ");
}

function assertWidget(screen: string, labels: string[]): void {
  const lines = screen.split("\n");
  const rows = lines.map((line, index) => ({ line, index }))
    .filter(({ line }) => line.includes("Forgetful ·"));
  assert.equal(rows.length, 1, "Background work must share one transient widget");
  const row = rows[0]!;
  const text = widgetText(screen);
  for (const label of labels) assert.ok(text.includes(label), `Missing phase: ${label}`);
  assert.match(row.line, /[\u2800-\u28ff]/, "The widget must contain a spinner");
  assert.match(text, /\d+(?:\.\d+)?s|\d+:\d{2}/, "The widget must show elapsed time");
  assert.ok(lines.slice(row.index + 1, row.index + 4).some((line) => /^[─━]{10}/.test(line)),
    "The widget belongs just above the editor");
}

test("terminal startup stays visible and responsive while project discovery is held", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: isolated real CLI, settings, Git repository, session and tmux server.
  const terminal = await startTerminal(t);

  // Act: type and finish a main-model turn while the REST response remains held.
  await terminal.prompt("Use SQLite for this repository.", 1);
  await until(terminal.pane, (screen) => /Forgetful · starting…/.test(screen),
    "Project discovery must show a startup widget");
  const screen = await terminal.evidence("first answer with discovery still held");
  const spinner = (text: string) => text.match(/[\u2800-\u28ff]/)?.[0];
  const elapsed = (text: string) => text.split("\n").find((line) => progress.test(line))
    ?.match(/\d+(?:\.\d+)?s|\d+:\d{2}/)?.[0];
  await until(terminal.pane, (text) => Boolean(spinner(text)) && spinner(text) !== spinner(screen),
    "The startup spinner must animate while discovery is held");
  await until(terminal.pane, (text) => Boolean(elapsed(text)) && elapsed(text) !== elapsed(screen),
    "The startup elapsed time must advance while discovery is held");
  await terminal.exit();

  // Assert: the startup widget is transient, and early work bypasses private recall.
  assert.equal(terminal.requests[0]!.response.writableEnded, false);
  assert.deepEqual(terminal.requests.filter(({ body }) => body.model).map(({ body }) => body.model),
    ["main"]);
  assert.match(screen, /Forgetful · starting…/);
  assert.match(screen, /· \d+s total/, "Elapsed time describes the whole background period");
  assertWidget(screen, ["starting…"]);
  assert.doesNotMatch(await terminal.history(), progress);
});

test("terminal combines concurrent recall and capture, then clears when idle", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: early work is queued during discovery, then resumed by the real extension.
  const terminal = await startTerminal(t);
  await terminal.prompt("Use SQLite for this repository.", 1);
  terminal.ready();
  const capture = await terminal.submission("submit_capture_candidates");
  await until(terminal.pane, (screen) => screen.includes("processing queued work · 1 remaining…") &&
    screen.includes("reviewing session…"), "Recovered work must show its queue count and phase");
  const resuming = await terminal.evidence("capture provider held after readiness");

  // Act: keep capture held while another prompt starts background recall and answers normally.
  await terminal.prompt("What storage should this repository use?", 2);
  const recall = await terminal.submission("submit_recall_plan");
  await until(terminal.pane, (screen) =>
    widgetText(screen).includes("finding relevant memories…") &&
      widgetText(screen).includes("reviewing session…"),
  "Both held operations must be visible together");
  const concurrent = await terminal.evidence("recall and capture providers both held");
  recall.reply(noRecall);
  capture.reply({ candidates: [] });
  const nextCapture = await terminal.submission("submit_capture_candidates", 1);
  nextCapture.reply({ candidates: [] });
  await until(terminal.pane, (screen) => !/Forgetful[ ·:]/.test(screen),
    "The widget must disappear once all background work completes");
  const idle = await terminal.evidence("all gates released; idle");
  await terminal.exit();

  // Assert: concurrent phases use one editor widget; completed progress never becomes chat.
  assertWidget(resuming, ["processing queued work · 1 remaining…", "reviewing session…"]);
  assertWidget(concurrent, ["finding relevant memories…", "reviewing session…"]);
  assert.doesNotMatch(idle, progress);
  assert.doesNotMatch(await terminal.history(), progress);
});

test("Ctrl+D exits without waiting for a held capture model", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: complete foreground work, then leave the external capture provider unanswered.
  const terminal = await startTerminal(t);
  await terminal.prompt("Use SQLite for this repository.", 1);
  terminal.ready();
  const capture = await terminal.submission("submit_capture_candidates");

  // Act: exercise the actual terminal key binding, without releasing the model response.
  await terminal.exit();

  // Assert: the real process exited while its model request was still held.
  assert.equal(capture.response.writableEnded, false);
  assert.doesNotMatch(await terminal.history(), progress);
});

test("terminal shows reviewing and saving phases at the held Forgetful HTTP boundary", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: return an evidenced candidate through the external provider submission contract.
  const terminal = await startTerminal(t);
  await terminal.prompt("Use SQLite for this repository.", 1);
  terminal.ready();
  const capture = await terminal.submission("submit_capture_candidates");
  const inputText = capture.body.messages?.filter((message) => message.role === "user")
    .map(({ content }) => typeof content === "string" ? content :
      content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join(""))
    .find((text) => text?.trimStart().startsWith("{"));
  assert.ok(inputText, "The external capture request must include its task input");
  const input = JSON.parse(inputText) as {
    eligibleEvidence: { id: string; role: string }[];
  };
  const source = input.eligibleEvidence.find((entry) => entry.role === "user");
  assert.ok(source, "Capture must provide the original user's evidence");
  capture.reply({ candidates: [{ id: "storage", title: "Repository storage",
    content: "Use SQLite for this repository.", context: "Explicit user decision.",
    keywords: ["storage"], tags: ["decision"], importance: 8,
    sourceEntryIds: [source.id], evidenceType: "userDecision" }] });

  // Act: independently hold the overlap search and the subsequent remote write.
  const search = await terminal.rest("POST", "/api/v1/memories/search");
  await until(terminal.pane, (screen) => screen.includes("reviewing session…"),
    "Reviewing overlaps must not be described as checking an uncertain save");
  const checking = await terminal.evidence("overlap search response held");
  search.reply({ primary_memories: [], linked_memories: [] });
  const decision = await terminal.submission("submit_capture_decision");
  decision.reply({ action: "create", reason: "No previous storage decision exists." });
  const save = await terminal.rest("POST", "/api/v1/memories");
  await until(terminal.pane, (screen) => screen.includes("saving to Forgetful…"),
    "The held remote write must have a visible phase");
  const saving = await terminal.evidence("remote write response held");
  await terminal.exit();

  // Assert: real transport phases render transiently, and quitting does not await remote I/O.
  assertWidget(checking, ["reviewing session…"]);
  assertWidget(saving, ["saving to Forgetful…"]);
  assert.equal(save.response.writableEnded, false);
  assert.doesNotMatch(await terminal.history(), progress);

  // Reopen the same real session/queue: an unknown accepted write must not disappear or repeat.
  await terminal.restart();
  await until(terminal.pane, (screen) => screen.includes("previous save needs checking"),
    "Unacknowledged writes must remain visible after restarting Pi");
  const pending = await terminal.evidence("reopened with an uncertain save");
  assert.equal(terminal.requests.filter((request) =>
    request.method === "POST" && request.path === "/api/v1/memories").length, 1);
  assert.doesNotMatch(pending.split("\n").find((line) =>
    line.includes("previous save needs checking")) ?? "", /[\u2800-\u28ff]/);
  assert.doesNotMatch(await terminal.history(), /previous save needs checking/);
  await terminal.command("/forgetful status");
  await until(terminal.pane, (screen) => screen.includes("uncertain saves 1"),
    "The suggested status command must identify the retained uncertain work");
  await terminal.exit();
});

for (const recovery of ["project init", "status"]) {
test(`failed discovery recovers through ${recovery} without stale progress`, {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: the first turn completes while the external service remains held.
  const terminal = await startTerminal(t);
  await terminal.prompt("Use SQLite for this repository.", 1);
  // Act: fail discovery only after Pi has had work to persist.
  terminal.failDiscovery();
  const screen = await until(terminal.pane, (text) =>
    text.includes("unavailable — queued work kept locally"),
  "Discovery failure must explain the durable pending work");
  // Assert: a quiet, non-spinning notice replaces progress and Pi can still exit.
  assert.doesNotMatch(screen.split("\n").find((line) =>
    line.includes("unavailable — queued work kept locally")) ?? "", /[\u2800-\u28ff]/);
  assert.doesNotMatch(await terminal.history(), /unavailable — queued work kept locally/);

  // Project setup can recover a failed lookup without restarting Pi or stranding early work.
  terminal.ready();
  await terminal.command(`/forgetful ${recovery}`);
  await until(terminal.pane, (text) => text.includes(recovery === "status"
    ? "project UI test" : "linked to test/background-ui") &&
      !text.includes("unavailable — queued work kept locally"),
    "A successful lookup must replace the stale unavailable notice");
  await terminal.prompt("Keep the SQLite decision.", 2);
  const recall = await terminal.submission("submit_recall_plan");
  recall.reply(noRecall);
  const recovered = await terminal.submission("submit_capture_candidates");
  recovered.reply({ candidates: [] });
  await terminal.exit();
});
}

for (const reset of ["scope global", "off and on", "model ui-test/memory"]) {
  test(`the next prompt recalls after runtime reset: ${reset}`, {
    skip: !enabled, timeout: 30_000,
  }, async (t) => {
    // Arrange: a ready, idle runtime with no held work.
    const terminal = await startTerminal(t);
    terminal.ready();
    await until(terminal.pane, (text) => !text.includes("Forgetful ·"), "Startup must settle");
    const lookups = terminal.requests.filter((request) => request.path === "/api/v1/projects");
    // Act: configuration resets must warm the new runtime before the next prompt arrives.
    if (reset === "off and on") {
      await terminal.command("/forgetful off");
      await until(terminal.pane, (text) => text.includes("Forgetful off."), "Turn memory off");
      await terminal.command("/forgetful on");
    } else await terminal.command(`/forgetful ${reset}`);
    await until(async () => terminal.requests.filter((request) =>
      request.path === "/api/v1/projects").length, (count) => count > lookups.length,
    "A reset must start discovery without waiting for a user prompt");
    await until(terminal.pane, (text) => !text.includes("Forgetful ·"), "Discovery must settle");
    await terminal.prompt("Recall the storage decision.", 1);
    const recall = await terminal.submission("submit_recall_plan");
    // Assert: the first prompt uses the ready runtime, rather than always skipping recall.
    recall.reply(noRecall);
    await terminal.exit();
  });
}

test("a failed status lookup does not invalidate successful startup discovery", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: a successful lookup with no default project still permits evidenced capture.
  const terminal = await startTerminal(t, false);
  terminal.ready();
  await until(terminal.pane, (text) => !text.includes("Forgetful ·"), "Startup must settle");
  // Act: only the explicit status lookup fails; it must not change capture readiness.
  terminal.failNextProjectLookup();
  await terminal.command("/forgetful status");
  await until(terminal.pane, (text) => text.includes("project unresolved"), "Status must return");
  await terminal.prompt("Use SQLite for this repository.", 1);
  const recall = await terminal.submission("submit_recall_plan");
  recall.reply(noRecall);
  const capture = await terminal.submission("submit_capture_candidates");
  // Assert: durable discovery state is not poisoned by a diagnostic command failure.
  capture.reply({ candidates: [] });
  await terminal.exit();
});

test("an unreadable progress queue cannot turn successful project setup into failure", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: real index damage fails the optional queue/status read. No capture is running.
  const terminal = await startTerminal(t);
  terminal.ready();
  await until(terminal.pane, (text) => !text.includes("Forgetful ·"), "Startup must settle");
  const restore = await terminal.damageQueue();
  try {
    // Act: the remote service still confirms the correct repository project.
    await terminal.command("/forgetful project init");
    const screen = await until(terminal.pane,
      (text) => text.includes("linked to test/background-ui"),
      "A cosmetic progress read must not change the project setup result");
    // Assert: preserve the successful command result despite a failed progress refresh.
    assert.doesNotMatch(screen, /project init failed|EACCES|capture enqueue failed/i);
    await terminal.command("/forgetful status");
    await until(terminal.pane, (text) => text.includes("Forgetful on;") &&
      text.includes("uncertain saves unavailable"),
    "Status must remain usable even when queue diagnostics cannot be read");
  } finally { await restore(); }
  await terminal.exit();
});

test("closing a superseded, unused activity cannot erase the current terminal widget", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: actual Pi UI, with no production activity still using the shared widget slot.
  const terminal = await startTerminal(t);
  terminal.ready();
  await until(terminal.pane, (text) => !text.includes("Forgetful ·"), "Startup must settle");
  // Act: the controlled driver closes an unused controller after a newer one starts.
  await terminal.command("/ui-test-stale-activity");
  const screen = await until(terminal.pane, (text) => text.includes("Forgetful · starting…"),
    "A controller that never displayed a widget must not remove another controller's widget");
  // Assert: the current activity remains visible and its timers still shut down normally.
  assertWidget(screen, ["starting…"]);
  await terminal.exit();
});

test("capture failure shows durable pending work and a final outcome after real failures", {
  skip: !enabled, timeout: 30_000,
}, async (t) => {
  // Arrange: one durable turn, with controlled provider failures rather than cancellation.
  const terminal = await startTerminal(t);
  await terminal.prompt("Use SQLite for this repository.", 1);
  terminal.ready();
  await terminal.submission("submit_capture_candidates");
  terminal.rejectCaptureSubmissions();
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await terminal.restart();
      terminal.rejectCaptureSubmissions();
    }
    // Act: reject all three bounded submissions; queue/source storage remains available.
    await until(async () => terminal.requests.filter((request) => request.body.tools?.some(
      (tool) => tool.name === "submit_capture_candidates")).length,
    (count) => count >= (attempt + 1) * 3, "All bounded submissions must run");
    // Assert: local retention is visible until genuine failures exhaust the existing allowance.
    await until(terminal.pane, (screen) => screen.includes(attempt < 2
      ? "capture retry pending — work kept locally" : "capture discarded 1 task"),
    "Capture failures must not silently look like successful idle completion");
    await terminal.exit();
    assert.equal(terminal.requests.filter((request) => request.body.tools?.some(
      (tool) => tool.name === "submit_capture_candidates")).length, (attempt + 1) * 3,
    "Startup recovery and early settlement must not retry the same turn twice");
  }
});

test("terminal updates the remaining backlog across automatic follow-on capture batches", {
  skip: !enabled, timeout: 45_000,
}, async (t) => {
  // Arrange: ten settled turns while discovery is held, then reopen the real persisted session.
  const terminal = await startTerminal(t);
  for (let index = 1; index <= 10; index++) {
    await terminal.prompt(`Use SQLite; repository decision ${index}.`, index);
  }
  const queue = await terminal.queue();
  await until(() => queue.listJobMetadata(), (jobs) => jobs.length === 10 &&
    jobs.every((job) => job.status === "pending"), "All ten turns must be durable before exit");
  await terminal.exit();
  terminal.ready();
  await terminal.restart();
  const first = await terminal.submission("submit_capture_candidates");
  await until(terminal.pane, (screen) =>
    screen.includes("processing queued work · 10 remaining…"),
  "The widget must include the running job in the unfinished backlog count");
  const initial = await terminal.evidence("ten queued jobs; first provider held");
  assertWidget(initial, ["processing queued work · 10 remaining…", "reviewing session…"]);

  // Act: release the first batch; no new prompt triggers the ninth provider request.
  first.reply({ candidates: [] });
  for (let index = 1; index < 8; index++) {
    const capture = await terminal.submission("submit_capture_candidates", index);
    capture.reply({ candidates: [] });
  }
  const ninth = await terminal.submission("submit_capture_candidates", 8);

  // Assert: the widget reflects real queue progress while follow-on work is still running.
  await until(() => queue.listJobMetadata(), (jobs) =>
    jobs.filter((job) => job.status === "complete").length === 8,
  "The first batch must finish before observing follow-on progress");
  await until(terminal.pane, (screen) =>
    screen.includes("processing queued work · 2 remaining…"),
  "The widget must replace the initial count when the next batch starts");
  const following = await terminal.evidence("eight complete; ninth provider held");
  assertWidget(following, ["processing queued work · 2 remaining…", "reviewing session…"]);
  ninth.reply({ candidates: [] });
  const tenth = await terminal.submission("submit_capture_candidates", 9);
  tenth.reply({ candidates: [] });
  await until(() => queue.listJobMetadata(), (jobs) => jobs.length === 10 &&
    jobs.every((job) => job.status === "complete"), "All ten jobs must finish automatically");
  await until(terminal.pane, (screen) => !/Forgetful[ ·:]/.test(screen),
    "Finished backlog must clear its activity widget");
  const idle = await terminal.evidence("all ten complete without another prompt");
  assert.doesNotMatch(idle, progress);
  assert.equal(terminal.requests.filter(({ body }) => body.model === "main").length, 10);
  assert.doesNotMatch(await terminal.history(), progress);
  await terminal.exit();
});
