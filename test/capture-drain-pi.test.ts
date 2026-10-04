import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

function gate() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => { release = resolve; });
  return { promise, release };
}

async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean,
  description: string, timeout = 5_000): Promise<T> {
  const deadline = Date.now() + timeout;
  let value: T;
  do {
    value = await read();
    if (accept(value)) return value;
    await new Promise((resolve) => setTimeout(resolve, 20));
  } while (Date.now() < deadline);
  assert.fail(`${description}\nLast observation: ${JSON.stringify(value, (key, item) =>
    ["snapshot", "binding", "dedupeKey"].includes(key) ? undefined : item)}`);
}

async function bounded<T>(promise: Promise<T>, description: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(description)), 2_000);
    })]);
  } finally { clearTimeout(timer); }
}

/** Script the external provider; Pi lifecycle, session history and disk queue remain real. */
async function startPi(t: TestContext, logging = false) {
  const root = await mkdtemp(join(tmpdir(), "pi-capture-drain-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const git = promisify(execFile);
  await git("git", ["init", "--quiet", root]);
  await git("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/capture-drain.git"]);
  const discovery = gate();
  const held: ServerResponse[] = [];
  let ready = false;
  const projects = { projects: [{ id: 7, name: "Capture drain",
    repo_name: "test/capture-drain" }], total: 1 };
  const server = createServer((request, response) => {
    assert.equal(new URL(request.url!, "http://localhost").pathname, "/api/v1/projects");
    response.setHeader("content-type", "application/json");
    if (ready) response.end(JSON.stringify(projects));
    else { held.push(response); discovery.release(); }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "drain-test/memory",
    capture_mode: "auto", timeout_ms: 60_000, recall_model_timeout_ms: 60_000,
    logging: logging ? "debug" : "off",
  }));
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  const calls: { name: string; input: Record<string, any> }[] = [];
  let mainCalls = 0;
  let failSession: string | undefined;
  let holdFrom = Infinity;
  const provider = gate();
  runtime.registerProvider("drain-test", {
    api: "faux", apiKey: "unused-test-key", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({
      id, name: id, reasoning: false, input: ["text"], contextWindow: 128_000,
      maxTokens: 2048, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    })),
    streamSimple(model, context, options) {
      const name = model.id === "memory" ? providerTools(context)[0]?.name : undefined;
      const input = name ? decodeProviderContext(context).input : undefined;
      if (name) calls.push({ name, input: input! });
      else mainCalls++;
      const failed = name === "submit_capture_candidates" &&
        input?.context?.sessionId === failSession;
      const message: AssistantMessage = {
        role: "assistant", api: "faux", provider: "drain-test", model: model.id,
        content: name ? [{ type: "toolCall", id: `submission-${calls.length}`, name,
          arguments: name === "submit_recall_plan"
            ? { search: false, queries: [], queryIntent: "", entities: [] }
            : { candidates: failed ? "invalid controlled submission" : [] } }]
          : [{ type: "text", text: "Decision noted." }],
        stopReason: name ? "toolUse" : "stop", timestamp: Date.now(),
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      };
      const stream = createAssistantMessageEventStream();
      void (async () => {
        if (name === "submit_capture_candidates" && calls.length >= holdFrom) {
          await new Promise<void>((resolve) => {
            const done = () => {
              options?.signal?.removeEventListener("abort", done);
              resolve();
            };
            if (options?.signal?.aborted) done();
            else options?.signal?.addEventListener("abort", done, { once: true });
            void provider.promise.then(done);
          });
        }
        if (options?.signal?.aborted) {
          message.stopReason = "aborted";
          stream.push({ type: "error", reason: "aborted", error: message });
        } else stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
        stream.end(message);
      })();
      return stream;
    },
  });
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
  const notifications: string[] = [];
  const observedUis = new WeakSet<object>();
  const loader = new DefaultResourceLoader({
    cwd: root, agentDir, settingsManager: settings, noSkills: true,
    noPromptTemplates: true, noThemes: true, noContextFiles: true,
    extensionFactories: [(pi) => {
      // Observe Pi's supported notification boundary without replacing lifecycle behavior.
      pi.on("session_start", (_event, ctx) => {
        if (observedUis.has(ctx.ui)) return;
        observedUis.add(ctx.ui);
        const notify = ctx.ui.notify.bind(ctx.ui);
        ctx.ui.notify = (message, type) => {
          notifications.push(message);
          notify(message, type);
        };
      });
      return createForgetfulExtension({ agentDir })(pi);
    }],
  });
  await loader.reload();
  const { session } = await createAgentSession({
    cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("drain-test", "main"),
    settingsManager: settings, sessionManager: SessionManager.create(root, join(root, "sessions")),
    resourceLoader: loader, noTools: "builtin",
  });
  const shutdown = () => session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
  t.after(async () => {
    provider.release();
    for (const response of held) {
      if (!response.writableEnded) response.end(JSON.stringify(projects));
    }
    await shutdown();
    session.dispose();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  await bounded(session.bindExtensions({}), "Pi startup waited for project discovery");
  await bounded(discovery.promise, "Background discovery did not start");
  return {
    session, calls, shutdown, notifications,
    async diagnostics() {
      const directory = join(root, ".pi", "forgetful", "logs");
      const files = await readdir(directory);
      return (await Promise.all(files.map((file) =>
        readFile(join(directory, file), "utf8")))).join("\n");
    },
    async removeSnapshot(jobId: string) {
      const queue = await this.queue();
      // Fixture damage only: use the stored reference to remove exactly one original source.
      const stored = JSON.parse(await readFile(queue.filePath, "utf8"));
      const job = stored.jobs.find((job: { id: string }) => job.id === jobId);
      assert.ok(job?.snapshotDigest);
      const directory = dirname(queue.filePath);
      const files = await readdir(directory);
      const name = files.find((file) => file.endsWith(`${job.snapshotDigest}.json`));
      assert.ok(name, "The fixture must contain the source snapshot before it is damaged");
      await rm(join(directory, name));
      return name;
    },
    get mainCalls() { return mainCalls; },
    async newSession() {
      await bounded(shutdown(), "Session change waited for discovery");
      session.sessionManager.newSession();
      session.refreshContext();
      await bounded(session.bindExtensions({}), "Session replacement waited for discovery");
    },
    async restart() {
      await bounded(shutdown(), "Shutdown waited for held discovery");
      this.ready();
      await bounded(session.bindExtensions({}), "Restart waited for queued capture");
    },
    failSession(id: string) { failSession = id; },
    holdProviderFrom(index: number) { holdFrom = index; },
    ready() {
      ready = true;
      for (const response of held) {
        if (!response.writableEnded) response.end(JSON.stringify(projects));
      }
    },
    async queue() {
      const queues = join(agentDir, "forgetful", "queues");
      const directories = await readdir(queues);
      assert.equal(directories.length, 1);
      return new DurableQueueStore({ directory: join(queues, directories[0]!) });
    },
    async earlyTurns(count: number, existing = 0) {
      for (let index = 0; index < count; index++) {
        await bounded(session.prompt(`Use SQLite; repository decision ${index + 1}.`),
          "Foreground prompt waited for discovery");
      }
      const queue = await this.queue();
      await until(() => queue.listJobs(), (jobs) => jobs.length === existing + count,
        "All settled turns must be durably queued before discovery is released");
      assert.equal(calls.length, 0, "Discovery must precede private capture/recall");
      return queue;
    },
  };
}

test("Pi automatically captures the entire healthy backlog beyond one batch", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: ten actual settled Pi turns, persisted while discovery is held.
  const pi = await startPi(t);
  const queue = await pi.earlyTurns(10);

  // Act: restart the lifecycle, then recover without another prompt or memory command.
  await pi.restart();

  // Assert: model submissions and durable completion cover all ten original jobs.
  const jobs = await until(() => queue.listJobs(),
    (jobs) => jobs.length === 10 && jobs.every((job) => job.status === "complete"),
    "Pi must drain all ten queued captures automatically, beyond the first eight");
  assert.equal(pi.calls.filter((call) => call.name === "submit_capture_candidates").length, 10);
  assert.equal(pi.mainCalls, 10);
  assert.ok(jobs.every((job) => job.attempts === 1));
});

test("Pi defers a failed branch once per drain cycle while healthy batches finish", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: a failed first branch followed by ten healthy jobs on a new branch.
  const pi = await startPi(t);
  const queue = await pi.earlyTurns(1);
  const failingSession = pi.session.sessionManager.getSessionId();
  pi.failSession(failingSession);
  await pi.newSession();
  await pi.earlyTurns(10, 1);

  // Act: recovery tries the failed first branch, then the healthy backlog.
  await pi.restart();
  const jobs = await until(() => queue.listJobs(), (jobs) =>
    jobs.filter((job) => job.status === "complete").length === 10,
  "One failed branch must not strand healthy work beyond the first batch");
  await bounded(pi.shutdown(), "Shutdown did not settle the drain cycle");

  // Assert: three correction submissions are one attempt, with original evidence retained.
  assert.equal(pi.calls[0]!.input.context.sessionId, failingSession);
  const failed = jobs.find((job) => job.snapshot.context.sessionId === failingSession)!;
  assert.equal(failed.status, "pending");
  assert.equal(failed.attempts, 1);
  assert.match(JSON.stringify(failed.snapshot.entries), /Use SQLite/);
  assert.equal(pi.calls.filter((call) =>
    call.input.context?.sessionId === failingSession).length, 3);
  assert.equal(pi.mainCalls, 11);
});

for (const cancel of [false, true]) {
  test(`Pi ${cancel ? "cancels" : "rechecks"} a busy branch without stealing its live lock`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: an older branch owned by another real worker, then a healthy branch.
    const pi = await startPi(t);
    const queue = await pi.earlyTurns(1);
    await pi.newSession();
    await pi.earlyTurns(1, 1);
    await bounded(pi.shutdown(), "Shutdown waited for held discovery");
    const jobs = await queue.listJobs();
    const blocked = jobs[0]!;
    const acquired = gate();
    const owner = gate();
    const lock = queue.withWorkerLock(blocked.binding, blocked.snapshot.context, async () => {
      acquired.release();
      await owner.promise;
      return "owner retained lock";
    });
    t.after(async () => { owner.release(); await lock; });
    await bounded(acquired.promise, "The simulated worker did not acquire its branch lock");

    // Act: discovery recovery must skip the owned branch and finish the other branch first.
    pi.ready();
    await pi.session.bindExtensions({});
    await until(() => queue.listJobs(), (jobs) =>
      jobs.some((job) => job.id !== blocked.id && job.status === "complete"),
    "A live lock must not prevent a different branch from completing");

    // Assert: another public lock acquisition fails while the live worker owns it.
    assert.equal(await queue.withWorkerLock(blocked.binding, blocked.snapshot.context,
      async () => "stolen"), undefined);
    assert.equal(pi.calls.length, 1);
    if (cancel) {
      await bounded(pi.shutdown(), "Shutdown waited for the delayed busy recheck");
      const retained = await queue.getJob(blocked.id);
      assert.equal(retained?.status, "pending");
      assert.equal(retained?.attempts, 0);
      assert.match(JSON.stringify(retained?.snapshot.entries), /Use SQLite/);
    }
    owner.release();
    assert.equal(await lock, "owner retained lock");
    if (cancel) await pi.session.bindExtensions({});
    await until(() => queue.listJobs(), (jobs) => jobs.every((job) => job.status === "complete"),
      "Releasing a busy branch must resume capture automatically without another turn");
    assert.equal(pi.calls.length, 2);
    assert.equal(pi.mainCalls, 2);
  });
}

test("Pi cancels a held follow-on provider and recovers its evidence on restart", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: the ninth capture request is held after the first complete batch.
  const pi = await startPi(t);
  const queue = await pi.earlyTurns(10);
  pi.holdProviderFrom(9);
  await pi.restart();
  await until(async () => pi.calls.length, (count) => count === 9,
    "Automatic follow-on capture must reach the held ninth provider request");

  // Act: lifecycle shutdown must cancel the provider rather than await its response.
  await bounded(pi.shutdown(), "Shutdown waited for the held follow-on provider");

  // Assert: eight completions survive; interrupted source evidence costs no failure attempt.
  const jobs = await queue.listJobs();
  assert.equal(jobs.filter((job) => job.status === "complete").length, 8);
  const unfinished = jobs.filter((job) => job.status !== "complete");
  assert.equal(unfinished.length, 2);
  assert.deepEqual(unfinished.map(({ status, attempts }) => ({ status, attempts })),
    [{ status: "paused", attempts: 0 }, { status: "pending", attempts: 0 }]);
  assert.ok(unfinished.every((job) => JSON.stringify(job.snapshot.entries).includes("Use SQLite")));
  pi.holdProviderFrom(Infinity);
  await pi.session.bindExtensions({});
  await until(() => queue.listJobs(), (jobs) => jobs.every((job) => job.status === "complete"),
    "Restart must recover the cancelled follow-on evidence without another prompt");
  assert.equal(pi.mainCalls, 10);
  assert.equal(pi.calls.length, 11);
  assert.ok((await queue.listJobs()).every((job) => job.attempts === 1));
});

test("Pi exposes an unclaimed missing source while the healthy backlog drains", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: damage one original source, retaining ten healthy jobs on another real branch.
  const pi = await startPi(t, true);
  const queue = await pi.earlyTurns(1);
  const [damaged] = await queue.listJobMetadata();
  await pi.newSession();
  await pi.earlyTurns(10, 1);
  const missing = await pi.removeSnapshot(damaged!.id);

  // Act: recover automatically, then shut down to flush the existing diagnostic logger.
  await pi.restart();
  const jobs = await until(() => queue.listJobMetadata(), (jobs) =>
    jobs.filter((job) => job.status === "complete").length === 10,
  "An unclaimed source error must not strand another branch's follow-on batches");
  await bounded(pi.shutdown(), "Shutdown did not finish or flush capture diagnostics");

  // Assert: the failed claim spends no attempt; Pi exposes the actual original-source error.
  assert.equal(jobs.find((job) => job.id === damaged!.id)?.attempts, 0);
  assert.equal(pi.calls.length, 10);
  const observed = [...pi.notifications, await pi.diagnostics()].join("\n");
  assert.ok(observed.includes("ENOENT") && observed.includes(missing),
    "Pi notifications or diagnostic logs must expose ENOENT and the missing source filename");
});

test("settled callbacks waiting on discovery share failure deferrals until a fresh turn", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: all three triggers exist before discovery; none is a later retry request.
  const pi = await startPi(t, true);
  const queue = await pi.earlyTurns(3);
  const original = (await queue.listJobMetadata())[0]!;
  pi.failSession(pi.session.sessionManager.getSessionId());
  const completedPasses = async () => (await pi.diagnostics()).trim().split("\n")
    .map((line) => JSON.parse(line)).filter((event) => event.event === "capture.batch_completed");

  // Act: recovery and the two not-yet-claimed turns finish their scheduled callbacks.
  pi.ready();
  await until(completedPasses, (passes) => passes.length === 3,
    "Recovery and both remaining settled callbacks must report their completed passes");

  // Assert: observing all callbacks finish is the barrier, not a timed absence of model calls.
  const deferred = await queue.getJob(original.id);
  assert.equal(deferred?.status, "pending", "Earlier triggers must not exhaust and discard work");
  assert.equal(deferred.attempts, 1);
  assert.equal(pi.calls.filter((call) => call.name === "submit_capture_candidates").length, 3);
  assert.match(JSON.stringify(deferred.snapshot.entries), /Use SQLite/);

  // Act: a genuinely new settled turn permits a later retry.
  await pi.session.prompt("Use SQLite; a new repository decision after the failed drain.");
  await until(completedPasses, (passes) => passes.length === 4,
    "A fresh user turn must schedule a new retry opportunity");
  assert.equal((await queue.getJob(original.id))?.attempts, 2);
  assert.equal(pi.calls.filter((call) => call.name === "submit_capture_candidates").length, 6);
});
