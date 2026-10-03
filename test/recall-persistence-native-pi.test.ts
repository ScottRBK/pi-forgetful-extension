import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { existsSync, statSync } from "node:fs";
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

// Opt-in: point at the installed, untouched native Codex compaction plugin (its index.ts or its
// directory). The plugin rebuilds each provider payload from durable session entries, so a
// recall fact that is only injected transiently into the model context never reaches the wire.
const PLUGIN_ENV = "FORGETFUL_TEST_CODEX_COMPACTION";
const pluginInput = process.env[PLUGIN_ENV];
const pluginPath = pluginInput && existsSync(pluginInput)
  ? (statSync(pluginInput).isDirectory() ? join(pluginInput, "index.ts") : pluginInput)
  : undefined;
const skip = pluginPath && existsSync(pluginPath)
  ? false
  : `set ${PLUGIN_ENV} to the installed pi-codex-compaction plugin`;

const RESULT_TYPE = "forgetful_recall_result";
const SQLITE_FACT = "SQLite was chosen for durable state";
const QUEUED_FACT = "Queued topic fact";
const CHECKPOINT_BLOB = "test-encrypted-checkpoint";

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
  provider = "openai-codex",
  api = "openai-codex-responses",
): AssistantMessage {
  return {
    role: "assistant",
    api,
    provider,
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

function compactionItems(payload: JsonObject): number {
  const input = payload.input;
  return Array.isArray(input)
    ? input.filter((item) => (item as { type?: string }).type === "compaction").length
    : 0;
}

interface Harness {
  session: Awaited<ReturnType<typeof createAgentSession>>["session"];
  sessionManager: SessionManager;
  /** Payloads exactly as the (fake) network would have received them, after all extensions. */
  payloads: JsonObject[];
  control: {
    plannerCalls: number;
    plannerGate: Gate;
    reviews: number;
    mainMode: "text" | "wait-first" | "held-first";
    mainHold: Gate;
    mainCalls: number;
  };
  resultEntries(): Array<{ id: string; content: unknown; details?: Record<string, unknown> }>;
}

async function openHarness(t: TestContext, root: string): Promise<Harness> {
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
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}/api/v1`,
    model: "test/memory",
    capture_mode: "off",
    verbosity: "warning",
    timeout_ms: 2_000,
  }));

  const control: Harness["control"] = {
    plannerCalls: 0, plannerGate: gate(), reviews: 0,
    mainMode: "text", mainHold: gate(), mainCalls: 0,
  };
  const payloads: JsonObject[] = [];
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  const models = (ids: string[]) => ids.map((id) => ({
    id, name: id, reasoning: false, input: ["text"] as ["text"],
    contextWindow: 32_000, maxTokens: 2_048,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  }));
  // Fake network only: the main provider asks Pi for its payload (running every
  // before_provider_request extension, including the real plugin) and records the result.
  const streamSimple: Parameters<typeof runtime.registerProvider>[1]["streamSimple"] = (
    model, context, options,
  ) => {
    const stream = createAssistantMessageEventStream();
    const emit = (result: AssistantMessage) => {
      stream.push({
        type: "done", reason: result.stopReason === "toolUse" ? "toolUse" : "stop", message: result,
      });
      stream.end(result);
    };
    const toolCall = (id: string, name: string, args: JsonObject) =>
      message(
        "memory", [{ type: "toolCall", id, name, arguments: args }], "toolUse", "test", "faux",
      );
    if (model.id === "memory") {
      const input = JSON.parse(lastText(context)) as Record<string, unknown>;
      if (input.availableSources) {
        const queued = (input.work as { prompt?: string } | undefined)?.prompt === "queued request";
        control.reviews += 1;
        queueMicrotask(() => emit(toolCall("review", "submit_recall_review", {
          summary: queued ? `${QUEUED_FACT}.` : `${SQLITE_FACT}.`,
          memoryIds: [42],
          reason: "The stored decision answers the request.",
        })));
        return stream;
      }
      // First planner call (the original request) finds nothing; the next one is held.
      control.plannerCalls += 1;
      const noContext = control.plannerCalls === 1 && control.mainMode !== "wait-first";
      if (!noContext) control.plannerGate.start();
      const plan = () => toolCall("plan", "submit_recall_plan", {
        search: !noContext,
        queries: noContext ? [] : ["database decision"],
        queryIntent: noContext ? "" : "Recall database decisions",
        entities: [],
      });
      if (noContext) queueMicrotask(() => emit(plan()));
      else void control.plannerGate.release.then(() => emit(plan()));
      return stream;
    }
    control.mainCalls += 1;
    const call = control.mainCalls;
    const text = () => message("main", [{ type: "text", text: "Working on it." }]);
    void (async () => {
      const original: JsonObject = {
        model: model.id, stream: true, store: false, instructions: "test",
        input: [{ role: "user", content: [{ type: "input_text", text: "unconverted" }] }],
      };
      const sent = (await options?.onPayload?.(original, model)) ?? original;
      payloads.push(JSON.parse(JSON.stringify(sent)) as JsonObject);
      if (control.mainMode === "wait-first" && call === 1) {
        emit(message("main", [{
          type: "toolCall", id: "wait-1", name: "forgetful_recall_wait", arguments: {},
        }], "toolUse"));
      } else if (control.mainMode === "held-first" && call === 1) {
        control.mainHold.start();
        await control.mainHold.release;
        emit(text());
      } else emit(text());
    })();
    return stream;
  };
  runtime.registerProvider("test", {
    api: "faux", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
    models: models(["memory"]), streamSimple,
  });
  runtime.registerProvider("openai-codex", {
    api: "openai-codex-responses", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
    models: models(["main"]), streamSimple,
  });

  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
  const loader = new DefaultResourceLoader({
    cwd: root, agentDir, settingsManager: settings, noSkills: true, noPromptTemplates: true,
    noContextFiles: true, noThemes: true,
    additionalExtensionPaths: [pluginPath!],
    extensionFactories: [(pi) => createForgetfulExtension({ agentDir })(pi)],
  });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  assert.equal(loader.getExtensions().extensions.length, 2, "plugin and Forgetful both loaded");

  // Seed a valid native checkpoint, as a long Codex session would already have.
  const sessionManager = SessionManager.create(root, sessionDir);
  sessionManager.appendMessage({ role: "user", content: "Earlier work.", timestamp: Date.now() });
  const kept = sessionManager.appendMessage(message("main", [{ type: "text", text: "Done." }]));
  sessionManager.appendCompaction("OpenAI Codex native compaction checkpoint (test).", kept, 100, {
    kind: "openai-codex-native-compaction",
    version: 1,
    modelKey: "openai-codex:openai-codex-responses:main",
    replacementHistory: [{ type: "compaction", encrypted_content: CHECKPOINT_BLOB }],
  });

  const { session } = await createAgentSession({
    cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("openai-codex", "main"),
    settingsManager: settings, sessionManager, resourceLoader: loader, noTools: "builtin",
  });
  t.after(() => session.dispose());
  await session.bindExtensions({});
  return {
    session, sessionManager, payloads, control,
    resultEntries: () => sessionManager.getEntries().flatMap((entry) =>
      entry.type === "custom_message" && entry.customType === RESULT_TYPE
        ? [{
          id: entry.id, content: entry.content, details: entry.details as Record<string, unknown>,
        }]
        : []),
  };
}

async function makeRoot(t: TestContext): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "pi-forgetful-native-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "agent", "forgetful", "prompts"), { recursive: true });
  await promisify(execFile)("git", ["init", "--quiet", root]);
  await promisify(execFile)("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/persist-extension.git"]);
  return root;
}

function assertSingleCheckpoint(payload: JsonObject): void {
  assert.equal(compactionItems(payload), 1, "exactly one compaction item");
  assert.equal(occurrences(payload, CHECKPOINT_BLOB), 1);
}

test("a queued result that finishes during the prior model call reaches the wire payload",
  { timeout: 20_000, skip }, async (t) => {
    // Arrange: the first request is held in its model call; a queued request starts recall.
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);
    harness.control.mainMode = "held-first";
    const running = harness.session.prompt("Keep working.");
    await harness.control.mainHold.started;
    await harness.session.prompt("queued request", { streamingBehavior: "followUp" });
    await harness.control.plannerGate.started;

    // Act: the queued recall completes while the prior model call is still running.
    harness.control.plannerGate.finish();
    await waitFor(() => harness.control.reviews >= 1, "queued recall reviewed");
    await new Promise((resolve) => setTimeout(resolve, 50));
    harness.control.mainHold.finish();
    await running;
    await harness.session.waitForIdle();

    // Assert: the result itself triggers a safe continuation before this run settles;
    // no later, unrelated request is needed to deliver the fact.
    const saved = harness.resultEntries();
    assert.equal(saved.length, 1, JSON.stringify(saved));
    assert.equal(occurrences(saved[0]!.content, QUEUED_FACT), 1);
    const withFact = harness.payloads.findIndex((payload) => occurrences(payload, QUEUED_FACT) > 0);
    assert.notEqual(
      withFact, -1, `fact never reached the wire: ${JSON.stringify(harness.payloads)}`,
    );
    const queuedCall = harness.payloads.findIndex((payload) =>
      occurrences(payload, "queued request") > 0);
    assert.notEqual(queuedCall, -1);
    assert.equal(withFact, queuedCall + 1,
      "the safe continuation receives the saved fact immediately after the arriving boundary");
    for (const payload of harness.payloads.slice(withFact)) {
      assert.equal(occurrences(payload, QUEUED_FACT), 1, "one copy per payload");
      assertSingleCheckpoint(payload);
    }
    const final = harness.payloads.at(-1)!;
    assert.equal(occurrences(final, "queued request"), 1);
    assert.equal(occurrences(final, QUEUED_FACT), 1);

    // Act: an unrelated request later in the same session.
    harness.control.plannerCalls = 0; // next planner finds nothing
    harness.control.mainMode = "text";
    await harness.session.prompt("Unrelated question.");
    await harness.session.waitForIdle();

    // Assert: still one fact, one checkpoint, and no background wake instructions left behind.
    const unrelated = harness.payloads.at(-1)!;
    assert.equal(occurrences(unrelated, "Unrelated question."), 1);
    assert.equal(occurrences(unrelated, QUEUED_FACT), 1);
    assertSingleCheckpoint(unrelated);
    assert.doesNotMatch(JSON.stringify(unrelated), /background continuation|Resume unfinished/i);
    assert.equal(harness.resultEntries().length, 1);
  });

test("a result found during a wait reaches the wire payload once with one checkpoint",
  { timeout: 20_000, skip }, async (t) => {
    // Arrange
    const root = await makeRoot(t);
    const harness = await openHarness(t, root);
    harness.control.mainMode = "wait-first";

    // Act: the model waits, then the held planner finishes.
    const prompt = harness.session.prompt("Which database did we choose?");
    await harness.control.plannerGate.started;
    harness.control.plannerGate.finish();
    await prompt;
    await harness.session.waitForIdle();

    // Assert
    assert.equal(harness.resultEntries().length, 1);
    assert.ok(harness.payloads.length >= 2);
    const final = harness.payloads.at(-1)!;
    assert.equal(occurrences(final, SQLITE_FACT), 1);
    assertSingleCheckpoint(final);
  });
