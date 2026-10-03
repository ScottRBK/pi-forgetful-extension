import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test, { type TestContext } from "node:test";
import {
  createAgentSession,
  DefaultResourceLoader,
  ModelRuntime,
  SessionManager,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream,
  type AssistantMessage,
  type Context,
  type JsonObject,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";

const RESULT_TYPE = "forgetful_recall_result";
const SQLITE_FACT = "SQLite was chosen for durable state";
const QUEUED_FACT = "Queued topic fact";

interface Gate {
  readonly started: Promise<void>;
  readonly release: Promise<void>;
  start(): void;
  finish(): void;
}

function gate(): Gate {
  let start!: () => void;
  let finish!: () => void;
  return {
    started: new Promise<void>((resolve) => { start = resolve; }),
    release: new Promise<void>((resolve) => { finish = resolve; }),
    start: () => start(),
    finish: () => finish(),
  };
}

function message(
  model: string,
  content: AssistantMessage["content"],
  stopReason: "stop" | "toolUse" = "stop",
): AssistantMessage {
  return {
    role: "assistant",
    api: "faux",
    provider: "test",
    model,
    content,
    stopReason,
    timestamp: Date.now(),
    usage: {
      input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
  };
}

function lastText(context: Context): string {
  const raw = context.messages.at(-1)?.content;
  if (typeof raw === "string") return raw;
  if (!Array.isArray(raw)) return "";
  return raw.map((part) => (part.type === "text" ? part.text : "")).join("\n");
}

async function waitFor(condition: () => boolean, description: string): Promise<void> {
  const deadline = Date.now() + 3_000;
  while (!condition() && Date.now() < deadline)
    await new Promise((resolve) => setTimeout(resolve, 10));
  assert.ok(condition(), description);
}

function occurrences(value: unknown, needle: string): number {
  return JSON.stringify(value).split(needle).length - 1;
}

interface Harness {
  session: Awaited<ReturnType<typeof createAgentSession>>["session"];
  sessionManager: SessionManager;
  mainContexts: Context[];
  mainHistory: unknown[][];
  baseUrl: string;
  control: {
    fact: string;
    reviewCalls: number;
    plannerGate: Gate;
    plannerMode: "gate" | "no-context" | "failure";
    mainMode: "text" | "wait-first" | "held-first";
    mainHold: Gate;
    mainCalls: number;
  };
  resultEntries(): Array<{ id: string; content: unknown; details?: Record<string, unknown> }>;
}

async function openHarness(
  t: TestContext, root: string, sessionFile?: string, existingBaseUrl?: string,
): Promise<Harness> {
  const agentDir = join(root, "agent");
  const sessionDir = join(root, "sessions");
  const memory = {
    id: 42, title: "Database", content: "The project uses SQLite for durable state.",
    context: "Approved decision", keywords: ["database"], tags: ["decision"], importance: 8,
    project_ids: [7], is_obsolete: false, linked_memory_ids: [],
  };
  const server = createServer(async (request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.url?.startsWith("/api/v1/projects")) {
      response.end(JSON.stringify({
        projects: [{ id: 7, name: "Persist extension", repo_name: "test/persist-extension" }],
        total: 1,
      }));
      return;
    }
    if (request.url === "/api/v1/memories/search") {
      for await (const _chunk of request) void _chunk;
      response.end(JSON.stringify({ primary_memories: [memory], linked_memories: [] }));
      return;
    }
    response.statusCode = 404;
    response.end("{}");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = existingBaseUrl ?? `http://127.0.0.1:${address.port}/api/v1`;
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: baseUrl,
    model: "test/memory",
    capture_mode: "off",
    verbosity: "warning",
    timeout_ms: 2_000,
  }));

  const control: Harness["control"] = {
    fact: SQLITE_FACT, reviewCalls: 0,
    plannerGate: gate(), plannerMode: "gate", mainMode: "text", mainHold: gate(), mainCalls: 0,
  };
  const mainContexts: Context[] = [];
  const mainHistory: unknown[][] = [];
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  runtime.registerProvider("test", {
    api: "faux",
    apiKey: "test-only-key",
    baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({
      id, name: id, reasoning: false, input: ["text"], contextWindow: 32_000, maxTokens: 2_048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    })),
    streamSimple(model, context) {
      const stream = createAssistantMessageEventStream();
      const emit = (result: AssistantMessage) => {
        stream.push({
          type: "done", reason: result.stopReason === "toolUse" ? "toolUse" : "stop",
          message: result,
        });
        stream.end(result);
      };
      const toolCall = (id: string, name: string, args: JsonObject) =>
        message("memory", [{ type: "toolCall", id, name, arguments: args }], "toolUse");
      if (model.id === "memory") {
        const input = JSON.parse(lastText(context)) as Record<string, unknown>;
        if (input.availableSources) {
          control.reviewCalls += 1;
          const queued = (input.work as { prompt?: string } | undefined)?.prompt ===
            "queued request";
          queueMicrotask(() => emit(toolCall("review", "submit_recall_review", {
            summary: queued ? `${QUEUED_FACT}.` : `${control.fact}.`,
            memoryIds: [42],
            reason: "The stored decision answers the request.",
          })));
          return stream;
        }
        control.plannerGate.start();
        const plan = (noContext: boolean) => toolCall("plan", "submit_recall_plan", {
          search: !noContext,
          queries: noContext ? [] : ["database decision"],
          queryIntent: noContext ? "" : "Recall database decisions",
          entities: [],
        });
        void control.plannerGate.release.then(() => {
          if (control.plannerMode === "failure")
            emit(message("memory", [{ type: "text", text: "invalid planner output" }]));
          else emit(plan(control.plannerMode === "no-context"));
        });
        if (control.plannerMode !== "gate") control.plannerGate.finish();
        return stream;
      }
      mainContexts.push(JSON.parse(JSON.stringify(context)) as Context);
      mainHistory.push(sessionManager.buildSessionContext().messages);
      control.mainCalls += 1;
      const text = () => message("main", [{ type: "text", text: "Working on it." }]);
      if (control.mainMode === "wait-first" && control.mainCalls === 1) {
        queueMicrotask(() => emit(message("main", [{
          type: "toolCall", id: "wait-1", name: "forgetful_recall_wait", arguments: {},
        }], "toolUse")));
      } else if (control.mainMode === "held-first" && control.mainCalls === 1) {
        control.mainHold.start();
        void control.mainHold.release.then(() => emit(text()));
      } else queueMicrotask(() => emit(text()));
      return stream;
    },
  });

  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
  const loader = new DefaultResourceLoader({
    cwd: root, agentDir, settingsManager: settings, noSkills: true, noPromptTemplates: true,
    noContextFiles: true, noThemes: true,
    extensionFactories: [(pi) => createForgetfulExtension({ agentDir })(pi)],
  });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const sessionManager = sessionFile
    ? SessionManager.open(sessionFile, sessionDir)
    : SessionManager.create(root, sessionDir);
  const { session } = await createAgentSession({
    cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
    settingsManager: settings, sessionManager, resourceLoader: loader, noTools: "builtin",
  });
  t.after(() => session.dispose());
  await session.bindExtensions({});
  return {
    session, sessionManager, mainContexts, mainHistory, control, baseUrl,
    resultEntries: () => sessionManager.getEntries().flatMap((entry) =>
      entry.type === "custom_message" && entry.customType === RESULT_TYPE
        ? [{ id: entry.id, content: entry.content,
          details: entry.details as Record<string, unknown> }]
        : []),
  };
}

async function makeRoot(t: TestContext): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "pi-forgetful-persist-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "agent", "forgetful", "prompts"), { recursive: true });
  await promisify(execFile)("git", ["init", "--quiet", root]);
  await promisify(execFile)("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/persist-extension.git"]);
  return root;
}

test("a useful result found during a wait is saved once and survives a reopened session",
  { timeout: 20_000 }, async (t) => {
    // Arrange
    const root = await makeRoot(t);
    const first = await openHarness(t, root);
    first.control.mainMode = "wait-first";

    // Act: the model waits, then the held planner finishes.
    const prompt = first.session.prompt("Which database did we choose?");
    await first.control.plannerGate.started;
    first.control.plannerGate.finish();
    await prompt;
    await first.session.waitForIdle();

    // Assert: one durable, bounded, untrusted-framed fact with provenance.
    const saved = first.resultEntries();
    assert.equal(saved.length, 1, JSON.stringify(first.sessionManager.getEntries()));
    assert.equal(occurrences(saved[0]!.content, SQLITE_FACT), 1);
    assert.match(JSON.stringify(saved[0]!.content), /untrusted/i);
    assert.equal(saved[0]!.details?.status, "context");
    assert.deepEqual(saved[0]!.details?.memoryIds, [42]);
    assert.equal(typeof saved[0]!.details?.jobId, "string");
    for (const context of first.mainContexts.slice(1))
      assert.equal(occurrences(context, SQLITE_FACT), 1, "durable fact is not duplicated");

    // Act: reopen the saved session and send an ordinary new prompt.
    const file = first.sessionManager.getSessionFile();
    assert.ok(file);
    await first.session.dispose();
    const reopened = await openHarness(t, root, file, first.baseUrl);
    reopened.control.plannerMode = "no-context";
    await reopened.session.prompt("Thanks, continue.");
    await reopened.session.waitForIdle();

    // Assert: the rebuilt history still carries the fact exactly once, no new copy is written.
    assert.equal(
      occurrences(reopened.sessionManager.buildSessionContext().messages, SQLITE_FACT), 1,
    );
    assert.equal(reopened.resultEntries().length, 1);
    assert.equal(occurrences(reopened.mainContexts[0], SQLITE_FACT), 1);
  });

test("a result that arrives after the answer settles is saved once and used by the follow-up",
  { timeout: 20_000 }, async (t) => {
    // Arrange
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);

    // Act: answer settles while the planner is held, then the planner finishes.
    await harness.session.prompt("What database decision should I document?");
    await harness.control.plannerGate.started;
    harness.control.plannerGate.finish();
    await waitFor(() => harness.mainContexts.length >= 2, "late completion wakes one follow-up");
    await harness.session.waitForIdle();
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Assert
    assert.equal(harness.resultEntries().length, 1);
    assert.equal(harness.mainContexts.length, 2);
    assert.equal(occurrences(harness.mainContexts[1], SQLITE_FACT), 1);
    const file = harness.sessionManager.getSessionFile();
    assert.ok(file);
    assert.equal(
      occurrences(SessionManager.open(file).buildSessionContext().messages, SQLITE_FACT), 1,
    );
  });

test("each queued request saves only its own result at its own boundary",
  { timeout: 20_000 }, async (t) => {
    // Arrange: the first request is held while a queued request starts its own recall.
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);
    harness.control.mainMode = "held-first";
    const running = harness.session.prompt("Keep working.");
    await harness.control.plannerGate.started;
    await harness.control.mainHold.started;
    const queued = harness.session.prompt("queued request", { streamingBehavior: "followUp" });
    await queued;

    // Act
    harness.control.plannerGate.finish();
    await waitFor(() => harness.control.reviewCalls === 2,
      "both recalls finish before their matching model boundaries");
    assert.deepEqual(harness.resultEntries(), [], "nothing lands mid-turn");
    harness.control.mainHold.finish();
    await running;
    await harness.session.waitForIdle();

    // Assert: distinct jobs, one entry each, no cross-contamination.
    const saved = harness.resultEntries();
    assert.equal(saved.length, 2, JSON.stringify(saved));
    assert.equal(new Set(saved.map((entry) => entry.details?.jobId)).size, 2);
    assert.equal(saved.filter((e) => JSON.stringify(e.content).includes(QUEUED_FACT)).length, 1);
    assert.equal(saved.filter((e) => JSON.stringify(e.content).includes(SQLITE_FACT)).length, 1);
    assert.ok(harness.mainHistory.some((history) => occurrences(history, QUEUED_FACT) === 1),
      "a provider request must run after the queued fact is in saved history");
    const queuedContext = harness.mainContexts.findLast((context) =>
      JSON.stringify(context.messages.findLast((item) => item.role === "user" &&
        !JSON.stringify(item.content).includes("[Forgetful "))?.content)
        .includes("queued request"));
    assert.ok(queuedContext);
    assert.equal(occurrences(queuedContext, QUEUED_FACT), 1);
  });

test("no-context and failed recalls are not saved to the conversation",
  { timeout: 20_000 }, async (t) => {
    // Arrange
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);

    // Act
    for (const mode of ["no-context", "failure"] as const) {
      harness.control.plannerMode = mode;
      await harness.session.prompt(`Question under ${mode}.`);
      await harness.session.waitForIdle();
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Assert
    assert.deepEqual(harness.resultEntries(), []);
  });

test("a stale completion cannot save a result onto a branch the user left",
  { timeout: 20_000 }, async (t) => {
    // Arrange: a recall is still planning when the user navigates away.
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);
    await harness.session.prompt("Which database did we choose?");
    await harness.control.plannerGate.started;
    const userEntry = harness.sessionManager.getEntries()
      .find((entry) => entry.type === "message" && entry.message.role === "user");
    assert.ok(userEntry);
    await harness.session.navigateTree(userEntry.id);
    const callsBefore = harness.mainContexts.length;

    // Act
    harness.control.plannerGate.finish();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert
    assert.deepEqual(harness.resultEntries(), []);
    assert.equal(harness.mainContexts.length, callsBefore, "no wake turn on the new branch");
  });

test("a reopened session with the same Forgetful instance delivers a distinct new result",
  { timeout: 20_000 }, async (t) => {
    // Arrange: keep the service URL stable, as it is in real installations.
    const root = await makeRoot(t);
    const first = await openHarness(t, root);
    first.control.mainMode = "wait-first";
    const initial = first.session.prompt("Which database did we choose?");
    await first.control.plannerGate.started;
    first.control.plannerGate.finish();
    await initial;
    await first.session.waitForIdle();
    const file = first.sessionManager.getSessionFile();
    assert.ok(file);
    await first.session.dispose();
    const reopened = await openHarness(t, root, file, first.baseUrl);
    reopened.control.fact = "PostgreSQL replaced the original storage choice";
    reopened.control.mainMode = "wait-first";

    // Act: perform another useful recall after reopening the same branch.
    const next = reopened.session.prompt("What changed about storage?");
    await reopened.control.plannerGate.started;
    reopened.control.plannerGate.finish();
    await next;
    await reopened.session.waitForIdle();

    // Assert: the prior job must not stand in for the new job.
    const saved = reopened.resultEntries();
    assert.equal(saved.length, 2);
    assert.equal(new Set(saved.map((entry) => entry.details?.jobId)).size, 2);
    assert.ok(reopened.mainContexts.slice(1).some((context) =>
      occurrences(context, reopened.control.fact) === 1));
  });

test("saved facts exclude the policy overlay while the current request still receives it",
  { timeout: 20_000 }, async (t) => {
    // Arrange: policy instructions are not historical facts to save on every recall.
    const root = await makeRoot(t);
    const policy = `${"Handle evidence carefully. ".repeat(300)} RECALL_POLICY_END`;
    await writeFile(join(root, "agent/forgetful/prompts/recall.md"), policy);
    const harness = await openHarness(t, root);
    harness.control.mainMode = "wait-first";

    // Act
    const prompt = harness.session.prompt("Which database did we choose?");
    await harness.control.plannerGate.started;
    harness.control.plannerGate.finish();
    await prompt;
    await harness.session.waitForIdle();

    // Assert: only the bounded reviewed facts and source references become history.
    const saved = harness.resultEntries();
    assert.equal(saved.length, 1);
    assert.equal(occurrences(saved[0]!.content, SQLITE_FACT), 1);
    assert.doesNotMatch(JSON.stringify(saved[0]!.content), /RECALL_POLICY_END/);
    assert.ok(harness.mainContexts.slice(1).some((context) =>
      JSON.stringify(context).includes("RECALL_POLICY_END")));
  });

test("an old completion cannot publish into a replacement session",
  { timeout: 20_000 }, async (t) => {
    // Arrange: the main turn settles while its recall remains held.
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);
    await harness.session.prompt("Which database did we choose?");
    await harness.control.plannerGate.started;
    const oldId = harness.sessionManager.getSessionId();

    // Act: replace the real session tree and bind fresh extension context before completing recall.
    harness.sessionManager.newSession();
    harness.session.refreshContext();
    await harness.session.bindExtensions({});
    const callsBefore = harness.mainContexts.length;
    harness.control.plannerGate.finish();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert
    assert.notEqual(harness.sessionManager.getSessionId(), oldId);
    assert.deepEqual(harness.resultEntries(), []);
    assert.equal(harness.mainContexts.length, callsBefore);
  });
