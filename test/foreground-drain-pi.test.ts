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

for (const outcome of ["shutdown", "navigation"] as const) {
  test(`real Pi refuses a late foreground update during ${outcome} drain`,
    { timeout: 15_000 }, async (t) => {
      // Arrange: real Pi and disk queue; only the external REST/model services are scripted.
      const root = await mkdtemp(join(tmpdir(), "pi-capture-shutdown-"));
      let closeSession: (() => Promise<void>) | undefined;
      let closeServer: (() => Promise<void>) | undefined;
      let releaseCapture: (() => void) | undefined;
      let releaseAuthorization: (() => void) | undefined;
      let writing: Promise<void> | undefined;
      let navigation: Promise<unknown> | undefined;
      t.after(async () => {
        try {
          releaseAuthorization?.();
          releaseCapture?.();
          try {
            await writing;
            await navigation;
          } finally { await closeSession?.(); }
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
      let storedMemory = { id: 42, title: "Storage", content: "Use SQLite for this repo.",
        context: "Previous decision.", keywords: ["storage"], tags: [], importance: 7,
        project_ids: [7], is_obsolete: false, linked_memory_ids: [] };
      const mutations: string[] = [];
      let authorizationStarted!: () => void;
      const heldAuthorization = new Promise<void>((resolve) => { authorizationStarted = resolve; });
      const server = createServer(async (request, response) => {
        response.setHeader("content-type", "application/json");
        if (request.url?.startsWith("/api/v1/projects")) {
          response.end(JSON.stringify({ projects: [
            { id: 7, name: "Shutdown test", repo_name: "test/capture-shutdown" },
          ], total: 1 }));
        } else if (request.url === "/api/v1/memories/42" && request.method === "GET") {
          releaseAuthorization = () => {
            releaseAuthorization = undefined;
            response.end(JSON.stringify(storedMemory));
          };
          authorizationStarted();
        } else if (request.url === "/api/v1/memories/42" && request.method === "PUT") {
          let body = "";
          for await (const chunk of request) body += chunk;
          mutations.push(`${request.method} ${request.url}`);
          storedMemory = { ...storedMemory, ...JSON.parse(body) };
          response.end(JSON.stringify(storedMemory));
        } else {
          if (request.method !== "GET") mutations.push(`${request.method} ${request.url}`);
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
      let writeOnNextMain = false;
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
          const write = model.id === "main" && writeOnNextMain;
          if (write) writeOnNextMain = false;
          const message: AssistantMessage = {
            role: "assistant", api: "faux", provider: "test", model: model.id,
            content: write ? [{ type: "toolCall", id: "write-1",
              name: "forgetful_knowledge_write", arguments: {
                operation: "update_memory", memory_id: 42, content: "Use local storage instead.",
              } }] : capture ? [{ type: "toolCall", id: "capture-1", name: submission!,
              arguments: { candidates: [{
                id: "storage", title: "Use local storage",
                content: "Use local storage for this repo.",
                context: "Explicit user decision.", keywords: ["storage"], tags: ["decision"],
                sourceEntryIds: [evidence.id], evidenceType: "userDecision",
              }] } }]
              : [{ type: "text", text: model.id === "main" ? "Decision noted." : JSON.stringify({
                search: false, queries: [], queryIntent: "No recall needed", entities: [],
              }) }],
            stopReason: (capture || write) ? "toolUse" : "stop", timestamp: Date.now(),
            usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          };
          const stream = createAssistantMessageEventStream();
          const emit = () => {
            stream.push({ type: "done", reason: (capture || write) ? "toolUse" : "stop", message });
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
      closeSession = async () => {
        try {
          await session.abort();
          await session.extensionRunner.emit({
            type: "session_shutdown", reason: "quit",
          });
        } finally { session.dispose(); }
      };
      await session.bindExtensions({});
      const prompt = session.prompt("We decided to use local storage for this repo.");
      await held;
      await prompt;
      const queues = join(agentDir, "forgetful/queues");
      const [directory] = await readdir(queues);
      const queueFile = join(queues, directory!, "queue.json");

      // The authorization GET is the last asynchronous lookup before update_memory's guard.
      writeOnNextMain = true;
      writing = session.prompt("Update the storage memory to say use local storage instead.");
      void writing.catch(() => undefined);
      await heldAuthorization;
      let navigationReturned = false;
      navigation = session.extensionRunner.emit(outcome === "shutdown"
        ? { type: "session_shutdown", reason: "quit" }
        : { type: "session_tree", oldLeafId: null, newLeafId: null })
        .then(() => { navigationReturned = true; });
      void navigation.catch(() => undefined);
      // Public queue disk I/O lets the lifecycle handler enter its capture drain.
      const activeQueue = JSON.parse(await readFile(queueFile, "utf8"));
      assert.equal(activeQueue.jobs[0].status, "running");
      assert.equal(navigationReturned, false, "held capture must keep lifecycle drain pending");
      releaseAuthorization?.();
      await writing;
      assert.equal(navigationReturned, false, "capture must still hold the lifecycle drain");
      assert.deepEqual(mutations, [], "stopped runtime must not dispatch a foreground update");
      assert.equal(storedMemory.content, "Use SQLite for this repo.");
      const result = session.messages.find((message) =>
        message.role === "toolResult" && message.toolName === "forgetful_knowledge_write");
      assert.ok(result && result.role === "toolResult" && result.isError);
    });
}
