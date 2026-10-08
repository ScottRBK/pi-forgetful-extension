import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
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
import { decodeProviderContext, providerTools } from "./provider-context.ts";

async function within<T>(promise: Promise<T>, description: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(description)), 2_000);
    })]);
  } finally { clearTimeout(timer); }
}

for (const mapped of [true, false]) {
for (const navigation of [false, true]) {
test(`Pi preserves early capture (mapped: ${mapped}, after navigation: ${navigation})`,
  { timeout: 15_000 }, async (t) => {
    // Arrange: real Pi, local queue and HTTP; hold only the external discovery response.
    const root = await mkdtemp(join(tmpdir(), "pi-background-startup-"));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin",
      "https://github.com/test/background-startup.git"]);
    const held: ServerResponse[] = [];
    const requests: string[] = [];
    let holdDiscovery = true;
    let discoveryStarted!: () => void;
    const discovery = new Promise<void>((resolve) => { discoveryStarted = resolve; });
    const server = createServer((request, response) => {
      requests.push(`${request.method} ${request.url}`);
      if (holdDiscovery) {
        held.push(response);
        discoveryStarted();
      } else {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify({ projects: mapped ? [{ id: 7, name: "Background startup",
          repo_name: "test/background-startup" }] : [], total: mapped ? 1 : 0 }));
      }
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
      base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "test/memory",
      capture_mode: "auto", timeout_ms: 60_000,
    }));
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
    });
    const modelCalls: string[] = [];
    let captureInput: Record<string, unknown> | undefined;
    let captureConversation: unknown;
    let captureStarted!: () => void;
    const capture = new Promise<void>((resolve) => { captureStarted = resolve; });
    runtime.registerProvider("test", {
      api: "faux", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id, name: id, reasoning: false, input: ["text"], contextWindow: 32_000,
        maxTokens: 2048, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context) {
        modelCalls.push(model.id);
        if (model.id === "main") {
          assert.deepEqual(providerTools(context).map(tool => tool.name),
            ["forgetful_recall_wait"]);
        }
        const name = model.id === "memory" ? providerTools(context)[0]?.name
          : undefined;
        if (name === "submit_capture_candidates") {
          const decoded = decodeProviderContext(context);
          captureInput = decoded.input;
          captureConversation = decoded.conversation;
          captureStarted();
        }
        const message: AssistantMessage = {
          role: "assistant", api: "faux", provider: "test", model: model.id,
          content: name ? [{ type: "toolCall", id: "capture", name,
            arguments: { candidates: [] } }] : [{ type: "text", text: "Decision noted." }],
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
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    const { session } = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
      settingsManager: settings,
      sessionManager: SessionManager.create(root, join(root, "sessions")),
      resourceLoader: loader, noTools: "builtin",
    });
    t.after(async () => {
      for (const response of held) response.end(JSON.stringify({ projects: [], total: 0 }));
      await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      session.dispose();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    });

    // Act: neither session load nor the first turn depends on the held server response.
    await within(session.bindExtensions({}), "session load waited for project discovery");
    assert.deepEqual(session.getActiveToolNames(), ["forgetful_recall_wait"]);
    await within(discovery, "project discovery did not start in the background");
    if (navigation) {
      await within(session.extensionRunner.emit({ type: "session_tree",
        oldLeafId: null, newLeafId: null }), "navigation waited for project discovery");
    }
    await within(session.prompt("Use SQLite for this repository."),
      "the first prompt waited for project discovery");
    await within(session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" }),
      "shutdown waited for project discovery");

    // Assert: no untrusted capture/recall ran; early work is durable, not just buffered in RAM.
    assert.deepEqual(modelCalls, ["main"]);
    assert.equal(requests.length, navigation ? 2 : 1,
      "cancelled discovery must not dispatch a fallback request");
    const queues = join(agentDir, "forgetful", "queues");
    const [directory] = await readdir(queues);
    const queueDirectory = join(queues, directory!);
    const queue = JSON.parse(await readFile(join(queueDirectory, "queue.json"), "utf8"));
    assert.equal(queue.jobs.length, 1);
    assert.equal(queue.jobs[0].attempts, 0);
    const snapshots = (await readdir(queueDirectory))
      .filter((name) => name.startsWith("snapshot-"));
    assert.equal(snapshots.length, 1);
    assert.match(await readFile(join(queueDirectory, snapshots[0]!), "utf8"), /Use SQLite/);
    assert.ok(!session.messages.some((message) => JSON.stringify(message).includes("starting…")),
      "progress must not enter conversation history");

    // Act: reopen without adding a turn. The same queue is recovered after discovery succeeds.
    holdDiscovery = false;
    await session.bindExtensions({});
    await within(capture, "early capture did not resume after discovery succeeded");

    // Assert: capture sees the verified project and original evidence, never a guessed target.
    assert.deepEqual((captureInput?.context as { project?: unknown })?.project,
      mapped ? { id: 7, name: "Background startup", repo_name: "test/background-startup" }
        : undefined);
    assert.match(JSON.stringify(captureConversation), /Use SQLite/);
  });
}
}
