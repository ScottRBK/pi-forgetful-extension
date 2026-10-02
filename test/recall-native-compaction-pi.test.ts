import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import {
  createAgentSession,
  DefaultResourceLoader,
  ModelRuntime,
  SessionManager,
  SettingsManager,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream,
  type AssistantMessage,
  type Context,
  type JsonObject,
  type Model,
} from "@earendil-works/pi-ai";
import { stream as streamCodex } from "@earendil-works/pi-ai/api/openai-codex-responses";
import { createForgetfulExtension } from "../src/extension.ts";

// Optional local source checkout, not an installed test dependency.
const pluginPath = process.env.FORGETFUL_TEST_CODEX_COMPACTION;
const checkpointKind = "openai-codex-native-compaction";
const oldText = "OLD_COMPACTED_RECORD_MUST_NOT_BE_REPLAYED";
const fact = "SQLite was chosen for durable state.";
const stoppedBeforeTransport = "Test stopped before provider transport.";
const bridgeMarker = /\[codex-native-checkpoint:[^:\]]+:[0-9a-f-]{36}\]/;

function gate() {
  let start!: () => void;
  let release!: () => void;
  return {
    started: new Promise<void>((resolve) => { start = resolve; }),
    released: new Promise<void>((resolve) => { release = resolve; }),
    start: () => start(),
    release: () => release(),
  };
}

function reply(
  model: string,
  content: AssistantMessage["content"],
  stopReason: "stop" | "toolUse" = "stop",
): AssistantMessage {
  return {
    role: "assistant",
    provider: model === "memory" ? "test" : "openai-codex",
    api: model === "memory" ? "faux" : "openai-codex-responses",
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
  const content = context.messages.at(-1)?.content;
  if (typeof content === "string") return content;
  return content?.flatMap((part) => part.type === "text" ? [part.text] : []).join("\n") ?? "";
}

async function waitFor(condition: () => boolean, description: string): Promise<void> {
  const deadline = Date.now() + 4_000;
  while (!condition() && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.ok(condition(), description);
}

for (const scenario of ["checkpoint-first", "checkpoint-last", "no-checkpoint"] as const) {
  test(`recall reaches final Codex payload: ${scenario}`, {
    skip: !pluginPath,
    timeout: 20_000,
  }, async (t) => {
    // Arrange: real Pi lifecycle, both extensions, real Codex wire conversion. Only the
    // external memory service and model responses are scripted; transport is never reached.
    const plugin = await import(pathToFileURL(resolve(pluginPath!)).href) as {
      registerCodexCompactionExtension(pi: ExtensionAPI): void;
    };
    const root = await mkdtemp(join(tmpdir(), "pi-forgetful-native-recall-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    const server = createServer(async (request, response) => {
      response.setHeader("content-type", "application/json");
      if (request.url === "/api/v1/memories/search") {
        for await (const _chunk of request) { /* Consume the external request body. */ }
        response.end(JSON.stringify({ primary_memories: [{
          id: 42,
          title: "Database",
          content: fact,
          context: "Approved decision",
          keywords: ["database"],
          tags: ["decision"],
          importance: 8,
          project_ids: [],
          is_obsolete: false,
          linked_memory_ids: [],
        }], linked_memories: [] }));
      } else if (request.url?.startsWith("/api/v1/projects")) {
        response.end(JSON.stringify({ projects: [], total: 0 }));
      } else {
        response.statusCode = 404;
        response.end("{}");
      }
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
      timeout_ms: 3_000,
    }));

    let planner = gate();
    let mode: "wait" | "late" | "no-context" = "wait";
    let mainCalls = 0;
    const payloads: JsonObject[] = [];
    const failures: unknown[] = [];
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
    });
    const modelDefinition = {
      name: "test", reasoning: false, input: ["text"] as ["text"],
      contextWindow: 100_000, maxTokens: 2_048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    };
    runtime.registerProvider("test", {
      api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
      models: [{ ...modelDefinition, id: "memory" }],
      streamSimple(_model, context) {
        const stream = createAssistantMessageEventStream();
        const emit = (result: AssistantMessage) => {
          stream.push({ type: "done", reason: "toolUse", message: result });
          stream.end(result);
        };
        const input = JSON.parse(lastText(context)) as Record<string, unknown>;
        if (input.availableSources) {
          queueMicrotask(() => emit(reply("memory", [{
            type: "toolCall", id: "review-1", name: "submit_recall_review",
            arguments: { summary: fact, memoryIds: [42], reason: "The fact answers the request." },
          }], "toolUse")));
        } else {
          planner.start();
          void planner.released.then(() => emit(reply("memory", [{
            type: "toolCall", id: "plan-1", name: "submit_recall_plan",
            arguments: {
              search: mode !== "no-context",
              queries: mode === "no-context" ? [] : ["database decision"],
              queryIntent: mode === "no-context" ? "" : "Recall the database decision",
              entities: [],
            },
          }], "toolUse")));
        }
        return stream;
      },
    });
    // A dummy JWT satisfies Codex's local account-ID check. It is never sent anywhere.
    const token = Buffer.from(JSON.stringify({
      "https://api.openai.com/auth": { chatgpt_account_id: "isolated-test-account" },
    })).toString("base64url");
    runtime.registerProvider("openai-codex", {
      api: "openai-codex-responses", apiKey: `header.${token}.signature`,
      baseUrl: "http://127.0.0.1/unused",
      models: [{ ...modelDefinition, id: "main" }],
      streamSimple(model, context, options) {
        const stream = createAssistantMessageEventStream();
        void (async () => {
          const call = ++mainCalls;
          const converted = await streamCodex(
            model as Model<"openai-codex-responses">,
            context,
            {
              ...options,
              onPayload: async (payload, requestModel) => {
                // Invoke Pi's real hook runner, then inspect the FINAL wire payload.
                const changed = await options?.onPayload?.(payload, requestModel);
                payloads.push(structuredClone(changed ?? payload) as JsonObject);
                throw new Error(stoppedBeforeTransport);
              },
            },
          ).result();
          assert.equal(converted.errorMessage, stoppedBeforeTransport);
          const result = mode === "wait" && call === 1
            ? reply("main", [{
              type: "toolCall", id: "wait-1", name: "forgetful_recall_wait", arguments: {},
            }], "toolUse")
            : reply("main", [{ type: "text", text: "Independent work is complete." }]);
          stream.push({
            type: "done", reason: result.stopReason === "toolUse" ? "toolUse" : "stop",
            message: result,
          });
          stream.end(result);
        })().catch((error: unknown) => {
          failures.push(error);
          const result = { ...reply("main", []), stopReason: "error" as const,
            errorMessage: String(error) };
          stream.push({ type: "error", reason: "error", error: result });
          stream.end(result);
        });
        return stream;
      },
    });

    const manager = SessionManager.inMemory(root);
    const checkpoint = scenario !== "no-checkpoint";
    const historyText = checkpoint ? oldText
      : `${oldText}. What does the [codex-native-checkpoint: prefix mean?`;
    const oldEntry = manager.appendMessage({ role: "user", content: historyText, timestamp: 1 });
    if (!checkpoint) {
      manager.appendMessage(reply("main", [{
        type: "text", text: "[codex-native-checkpoint: is the plugin's marker prefix.",
      }]));
    }
    const forkPoint = checkpoint ? manager.appendCompaction(
      "Native checkpoint summary must not be replayed.", oldEntry, 40_000, {
        kind: checkpointKind, version: 1,
        modelKey: "openai-codex:openai-codex-responses:main",
        replacementHistory: [{ type: "compaction", encrypted_content: "isolated-checkpoint" }],
      }, true,
    ) : oldEntry;
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const forgetful = createForgetfulExtension({ agentDir });
    const codex = plugin.registerCodexCompactionExtension;
    const loader = new DefaultResourceLoader({
      cwd: root, agentDir, settingsManager: settings,
      noSkills: true, noPromptTemplates: true, noContextFiles: true, noThemes: true,
      extensionFactories: scenario === "checkpoint-last" ? [forgetful, codex] : [codex, forgetful],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime,
      model: runtime.getModel("openai-codex", "main"),
      settingsManager: settings, sessionManager: manager, resourceLoader: loader,
      noTools: "builtin",
    });
    t.after(() => session.dispose());
    await session.bindExtensions({});

    const assertDelivered = (payload: JsonObject) => {
      const wire = JSON.stringify(payload.input);
      assert.match(wire, /SQLite was chosen for durable state/);
      assert.doesNotMatch(wire, /memory-decision-pending/);
      assert.doesNotMatch(wire, bridgeMarker);
      if (checkpoint) {
        assert.doesNotMatch(wire, /OLD_COMPACTED_RECORD_MUST_NOT_BE_REPLAYED/);
        assert.doesNotMatch(wire, /Native checkpoint summary must not be replayed/);
        assert.equal((payload.input as JsonObject[]).filter(
          (item) => item.type === "compaction",
        ).length, 1);
      } else {
        assert.match(wire, /OLD_COMPACTED_RECORD_MUST_NOT_BE_REPLAYED/);
      }
    };

    // Act/Assert: a successful bounded wait delivers facts to the final provider request.
    const waiting = session.prompt("Which database did we choose?");
    await planner.started;
    await waitFor(() => payloads.length === 1, "initial request reaches the wire boundary");
    planner.release();
    await waiting;
    await session.waitForIdle();
    assert.deepEqual(failures, []);
    assert.equal(payloads.length, 2);
    assertDelivered(payloads[1]!);
    const outputs = (payloads[1]!.input as JsonObject[]).filter(
      (item) => item.type === "function_call_output",
    );
    assert.equal(outputs.length, 1, "the wait's tool result is not lost or duplicated");
    assert.ok((payloads[1]!.input as JsonObject[]).some(
      (item) => item.type === "function_call" && item.call_id === outputs[0]!.call_id,
    ), "tool call and result stay paired");

    // Act/Assert: recall finishing after the main turn produces a useful automatic follow-up.
    mode = "late";
    mainCalls = 0;
    planner = gate();
    const late = session.prompt("What database decision should I document?");
    await planner.started;
    await late;
    assert.equal(payloads.length, 3, "main work settles while private planning is held");
    planner.release();
    await waitFor(() => payloads.length === 4, "late recall starts one provider follow-up");
    await session.waitForIdle();
    assertDelivered(payloads[3]!);
    assert.deepEqual(failures, []);
    assert.equal(payloads.length, 4);
    const savedEntries = JSON.stringify(manager.getEntries());
    assert.doesNotMatch(savedEntries, /SQLite was chosen for durable state/,
      "recalled facts stay transient");
    assert.doesNotMatch(savedEntries, bridgeMarker,
      "the checkpoint bridge marker stays transient");

    // Act/Assert: a tree move cannot carry the former branch's recalled fact into a new request.
    const moved = await session.navigateTree(forkPoint, { summarize: false });
    assert.equal(moved.cancelled, false);
    mode = "no-context";
    planner = gate();
    mainCalls = 0;
    const sibling = session.prompt("Continue on a different branch without prior facts.");
    await planner.started;
    planner.release();
    await sibling;
    await session.waitForIdle();
    assert.deepEqual(failures, []);
    const siblingWire = JSON.stringify(payloads.at(-1)!.input);
    assert.doesNotMatch(siblingWire, /SQLite was chosen for durable state/);
    assert.doesNotMatch(siblingWire, /What database decision should I document/);
  });
}
