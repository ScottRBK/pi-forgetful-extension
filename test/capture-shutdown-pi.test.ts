import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { decodeProviderContext } from "./provider-context.ts";

test("public Pi shutdown drains capture before the queue directory can be removed",
  { timeout: 15_000 }, async (t) => {
    // Arrange: real Pi and disk queue; only the external REST/model services are scripted.
    const root = await mkdtemp(join(tmpdir(), "pi-capture-shutdown-"));
    let closeSession: (() => Promise<void>) | undefined;
    let closeServer: (() => Promise<void>) | undefined;
    let releaseCapture: (() => void) | undefined;
    t.after(async () => {
      try {
        releaseCapture?.();
        await closeSession?.();
      } finally {
        try { await closeServer?.(); }
        finally { await rm(root, { recursive: true, force: true }); }
      }
    });
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin",
      "https://github.com/test/capture-shutdown.git"]);
    const server = createServer((request, response) => {
      response.setHeader("content-type", "application/json");
      if (request.url?.startsWith("/api/v1/projects")) {
        response.end(JSON.stringify({ projects: [
          { id: 7, name: "Shutdown test", repo_name: "test/capture-shutdown" },
        ], total: 1 }));
      } else {
        response.statusCode = 404;
        response.end("{}");
      }
    });
    closeServer = () => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
      base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "test/memory",
      capture_mode: "auto", timeout_ms: 2000,
    }));
    let captureStarted!: () => void;
    const held = new Promise<void>((resolve) => { captureStarted = resolve; });
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
    });
    runtime.registerProvider("test", {
      api: "faux", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id, name: id, reasoning: false, input: ["text"], contextWindow: 32_000,
        maxTokens: 2048, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context) {
        const submission = context.tools?.[0]?.name;
        const capture = model.id === "memory" && submission === "submit_capture_candidates";
        const input = capture ? decodeProviderContext(context).input : {};
        const evidence = input.eligibleEvidence?.find(
          (entry: { role: string }) => entry.role === "user");
        const message: AssistantMessage = {
          role: "assistant", api: "faux", provider: "test", model: model.id,
          content: capture ? [{ type: "toolCall", id: "capture-1", name: submission!,
            arguments: { candidates: [{
              id: "storage", title: "Use local storage",
              content: "Use local storage for this repo.",
              context: "Explicit user decision.", keywords: ["storage"], tags: ["decision"],
              sourceEntryIds: [evidence.id], evidenceType: "userDecision",
            }] } }]
            : [{ type: "text", text: model.id === "main" ? "Decision noted." : JSON.stringify({
              search: false, queries: [], queryIntent: "No recall needed", entities: [],
            }) }],
          stopReason: capture ? "toolUse" : "stop", timestamp: Date.now(),
          usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        };
        const stream = createAssistantMessageEventStream();
        const emit = () => {
          stream.push({ type: "done", reason: capture ? "toolUse" : "stop", message });
          stream.end(message);
        };
        if (capture) {
          releaseCapture = emit;
          captureStarted();
        } else queueMicrotask(emit);
        return stream;
      },
    });
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const loader = new DefaultResourceLoader({
      cwd: root, agentDir, settingsManager: settings, noSkills: true,
      noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
      settingsManager: settings, sessionManager: SessionManager.inMemory(root),
      resourceLoader: loader, noTools: "builtin",
    });
    const extensionErrors: unknown[] = [];
    session.extensionRunner.onError((error) => extensionErrors.push(error));
    let shutdown: Promise<void> | undefined;
    closeSession = async () => {
      try {
        await session.abort();
        await (shutdown ?? session.extensionRunner.emit({
          type: "session_shutdown", reason: "quit",
        }));
      } finally { session.dispose(); }
    };
    await session.bindExtensions({});
    const prompt = session.prompt("We decided to use local storage for this repo.");
    await held;
    await prompt;
    const queues = join(agentDir, "forgetful/queues");
    const [directory] = await readdir(queues);
    const queueFile = join(queues, directory!, "queue.json");

    // Act: invoke the public lifecycle while the external capture response is still held.
    await session.abort();
    let shutdownReturned = false;
    shutdown = session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" })
      .then(() => { shutdownReturned = true; });
    await session.extensionRunner.emit({ type: "agent_settled" });
    // Real disk I/O gives the shutdown handler a turn without a timing-based sleep.
    const activeQueue = JSON.parse(await readFile(queueFile, "utf8"));
    assert.equal(activeQueue.jobs[0].status, "running");
    try {
      assert.equal(shutdownReturned, false, "shutdown must wait for the held capture worker");
    } finally { releaseCapture?.(); }
    await shutdown;

    // Assert: the queue is settled and no worker locks survive the awaited shutdown.
    const settledQueue = JSON.parse(await readFile(queueFile, "utf8"));
    assert.equal(settledQueue.jobs[0].status, "paused");
    assert.deepEqual((await readdir(join(queues, directory!)))
      .filter((name) => !name.startsWith("snapshot-")), ["queue.json"]);
    assert.deepEqual(extensionErrors, []);
    await closeSession();
    closeSession = undefined;
    await rm(root, { recursive: true, force: true });
    await assert.rejects(readdir(root), { code: "ENOENT" });
  });

for (const outcome of ["shutdown", "navigation", "validation"] as const) {
  test(`real Pi resolution retains its receipt and service diagnostics during ${outcome}`,
    { timeout: 15_000 }, async (t) => {
      const root = await mkdtemp(join(tmpdir(), "pi-resolution-shutdown-"));
      let closeSession: (() => Promise<void>) | undefined;
      let closeServer: (() => Promise<void>) | undefined;
      let releaseWrite: (() => void) | undefined;
      t.after(async () => {
        try {
          releaseWrite?.();
          await closeSession?.();
        } finally {
          try { await closeServer?.(); }
          finally { await rm(root, { recursive: true, force: true }); }
        }
      });
      const agentDir = join(root, "agent");
      await mkdir(join(agentDir, "forgetful"), { recursive: true });
      const git = promisify(execFile);
      await git("git", ["init", "--quiet", root]);
      await git("git", ["-C", root, "remote", "add", "origin",
        "https://github.com/test/resolution-shutdown.git"]);
      const oldMemory = { id: 42, title: "Storage", content: "Use SQLite for this repo.",
        context: "Previous decision.", keywords: ["storage"], tags: [], importance: 7,
        project_ids: [7], is_obsolete: false, linked_memory_ids: [] };
      const stored = new Map<number, Record<string, unknown>>([[42, oldMemory]]);
      const mutations: string[] = [];
      const validationBody = JSON.stringify({ detail: [{ loc: ["body", "content"],
        msg: "service validation details ".repeat(200) + "RAW_VALIDATION_TAIL" }] });
      let writeStarted!: () => void;
      const heldWrite = new Promise<void>((resolve) => { writeStarted = resolve; });
      const server = createServer(async (request, response) => {
        response.setHeader("content-type", "application/json");
        const path = request.url ?? "";
        if (path.startsWith("/api/v1/projects")) {
          response.end(JSON.stringify({ projects: [{ id: 7, name: "Resolution test",
            repo_name: "test/resolution-shutdown" }], total: 1 }));
          return;
        }
        if (path === "/api/v1/memories/search") {
          response.end(JSON.stringify({ primary_memories: [oldMemory], linked_memories: [] }));
          return;
        }
        if (path === "/api/v1/graph/memory/42?depth=1") {
          response.end(JSON.stringify({ center_memory_id: 42, edges: [] }));
          return;
        }
        if (path === "/api/v1/memories" && request.method === "POST") {
          let body = "";
          for await (const chunk of request) body += chunk;
          mutations.push("create");
          const input = JSON.parse(body);
          releaseWrite = () => {
            releaseWrite = undefined;
            if (outcome === "validation") {
              response.statusCode = 422;
              response.end(validationBody);
            } else {
              stored.set(99, { ...input, id: 99, is_obsolete: false, linked_memory_ids: [] });
              response.statusCode = 201;
              response.end(JSON.stringify({ id: 99 }));
            }
          };
          writeStarted();
          return;
        }
        const memoryId = path.match(/^\/api\/v1\/memories\/(\d+)$/)?.[1];
        if (memoryId && request.method === "GET" && stored.has(Number(memoryId))) {
          response.end(JSON.stringify(stored.get(Number(memoryId))));
          return;
        }
        if (request.method !== "GET") mutations.push(`${request.method} ${path}`);
        response.statusCode = 404;
        response.end("{}");
      });
      closeServer = () => new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
      });
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
        base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "test/memory",
        capture_mode: "auto", timeout_ms: 2000,
      }));
      const runtime = await ModelRuntime.create({
        authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
      });
      let conflictId: string | undefined;
      let handoffReady!: () => void;
      const handoff = new Promise<void>((resolve) => { handoffReady = resolve; });
      let resolveOnNextMain = false;
      runtime.registerProvider("test", {
        api: "faux", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
        models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
          input: ["text"], contextWindow: 32_000, maxTokens: 2048,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
        streamSimple(model, context) {
          let name = model.id === "memory" ? context.tools?.[0]?.name : undefined;
          const input = model.id === "memory" ? decodeProviderContext(context).input : {};
          let decision: Record<string, unknown> = {
            search: false, queries: [], queryIntent: "No recall needed", entities: [],
          };
          if (name === "submit_capture_candidates") {
            const user = input.eligibleEvidence.find(
              (entry: { role: string }) => entry.role === "user");
            decision = { candidates: user && !conflictId ? [{ id: "storage",
              title: "Local storage", content: "Use local storage for this repo.",
              context: "Explicit user decision.", keywords: ["storage"], tags: [],
              sourceEntryIds: [user.id], evidenceType: "userDecision" }] : [] };
          } else if (name === "submit_capture_decision") {
            decision = { action: "escalate", conflictingMemoryId: 42,
              oldClaim: oldMemory.content, newClaim: input.candidate.content,
              reason: "Confirm this change.", sourceEntryIds: input.candidate.sourceEntryIds };
          } else if (name === "submit_memory_revision") {
            decision = { title: "Local storage", content: "Use local storage for this repo.",
              context: "Confirmed change.", keywords: ["storage"], tags: [], importance: 7,
              sourceEntryIds: input.evidenceEntryIds, documentIds: [], codeArtifactIds: [],
              entityIds: [], memoryIds: [], fileIds: [], sourceFiles: [] };
          } else if (model.id === "main" && resolveOnNextMain) {
            resolveOnNextMain = false;
            name = "forgetful_resolve";
            decision = { conflict_id: conflictId, action: "supersede", reason: "Confirmed change" };
          }
          const message: AssistantMessage = {
            role: "assistant", api: "faux", provider: "test", model: model.id,
            content: name ? [{ type: "toolCall", id: `${name}-1`, name, arguments: decision }]
              : [{ type: "text", text: model.id === "main" ? "Decision noted."
                : JSON.stringify(decision) }],
            stopReason: name ? "toolUse" : "stop", timestamp: Date.now(),
            usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          };
          const stream = createAssistantMessageEventStream();
          queueMicrotask(() => {
            stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
            stream.end(message);
          });
          return stream;
        },
      });
      const settings = SettingsManager.create(root, agentDir);
      settings.setProjectTrusted(true);
      settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
      const loader = new DefaultResourceLoader({
        cwd: root, agentDir, settingsManager: settings, noSkills: true,
        noPromptTemplates: true, noThemes: true, noContextFiles: true,
        extensionFactories: [(pi) => {
          const sendMessage = pi.sendMessage.bind(pi);
          pi.sendMessage = (message, options) => {
            const details = message.details as { conflictIds?: string[] } | undefined;
            if (details?.conflictIds?.[0]) {
              conflictId = details.conflictIds[0];
              handoffReady();
            }
            sendMessage(message, options);
          };
          return createForgetfulExtension({ agentDir })(pi);
        }],
      });
      await loader.reload();
      assert.deepEqual(loader.getExtensions().errors, []);
      const { session } = await createAgentSession({
        cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
        settingsManager: settings, sessionManager: SessionManager.inMemory(root),
        resourceLoader: loader, noTools: "builtin",
      });
      let navigation: Promise<unknown> | undefined;
      let resolving: Promise<void> | undefined;
      closeSession = async () => {
        try {
          await resolving;
          await navigation;
          await session.abort();
          await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
        } finally { session.dispose(); }
      };
      await session.bindExtensions({});
      await session.prompt("We decided to use local storage for this repo.");
      await handoff;
      resolveOnNextMain = true;
      resolving = session.prompt("Yes, replace SQLite with local storage for this repo.");
      void resolving.catch(() => undefined);
      await heldWrite;
      const queues = join(agentDir, "forgetful/queues");
      const [directory] = await readdir(queues);
      const queueFile = join(queues, directory!, "queue.json");

      // Act: stop the runtime with an accepted REST write still awaiting its response.
      let navigationReturned = false;
      if (outcome !== "validation") {
        navigation = session.extensionRunner.emit(outcome === "shutdown"
          ? { type: "session_shutdown", reason: "quit" }
          : { type: "session_tree", oldLeafId: null, newLeafId: null })
          .then(() => { navigationReturned = true; });
        void navigation.catch(() => undefined);
      }
      try {
        const pending = JSON.parse(await readFile(queueFile, "utf8"));
        assert.equal(pending.conflicts[0].replacement.creationAttempted, true);
        if (outcome !== "validation") assert.equal(navigationReturned, false,
          "teardown must await an accepted resolution and its durable receipt");
      } finally { releaseWrite?.(); }
      await navigation;
      // Inspect disk immediately at the lifecycle boundary, before awaiting the main agent.
      const saved = JSON.parse(await readFile(queueFile, "utf8"));
      if (outcome !== "validation") {
        assert.equal(saved.conflicts[0].replacementId, 99);
        assert.equal(saved.conflicts[0].replacement.memoryId, 99);
        assert.equal(saved.conflicts[0].status, "pending");
        assert.deepEqual((await readdir(join(queues, directory!)))
      .filter((name) => !name.startsWith("snapshot-")), ["queue.json"]);
      }
      await resolving;
      assert.deepEqual(mutations, ["create"], "stopped resolution must not dispatch supersession");
      if (outcome === "validation") {
        const result = session.messages.find((message) =>
          message.role === "toolResult" && message.toolName === "forgetful_resolve");
        assert.ok(result && result.role === "toolResult" && result.isError);
        const text = result.content.filter((part) => part.type === "text")
          .map((part) => part.type === "text" ? part.text : "").join("\n");
        assert.ok(text.includes(validationBody), "the main model must receive the complete body");
        assert.doesNotMatch(text, /Forgetful conflict could not be resolved:/);
      }
    });
}
