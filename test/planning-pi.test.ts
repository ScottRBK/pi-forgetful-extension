import assert from "node:assert/strict";
import {
  createAssistantMessageEventStream, type AssistantMessage,
} from "@earendil-works/pi-ai";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";

// Exercise the real extension runner: hasUI alone must not enable terminal overlays or reads.
test("Pi SDK keeps a saved planning panel out of headless traffic and conversation", async (t) => {
  // Arrange: isolated real SDK, explicit local extension, no model or credentials.
  const root = await mkdtemp(join(tmpdir(), "forgetful-planning-sdk-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const requests: string[] = [];
  const server = createServer((request, response) => {
    requests.push(`${request.method} ${request.url}`);
    response.end(JSON.stringify({ projects: [], total: 0 }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const settingsPath = join(agentDir, "forgetful/settings.json");
  await writeFile(settingsPath, JSON.stringify({ planning_panel: true, capture_mode: "off",
    base_url: `http://127.0.0.1:${address.port}/api/v1` }));
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
    noSkills: true, noContextFiles: true, noThemes: true, noPromptTemplates: true,
    additionalExtensionPaths: [resolve("index.ts")] });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
    settingsManager: settings, sessionManager: SessionManager.inMemory(root),
    resourceLoader: loader, noTools: "builtin" });
  t.after(async () => {
    await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
    session.dispose();
    await new Promise<void>((done) => {
      server.close(() => done()); server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  const notices: string[] = [];
  const widgets: string[] = [];
  await session.bindExtensions({ uiContext: {
    notify: (message: string) => notices.push(message),
    setWidget: (key: string) => widgets.push(key),
  } as never });

  // Act: commands are intercepted by Pi, rather than forwarded to a provider.
  await session.prompt("/forgetful plans");
  await session.prompt("/forgetful plans off");

  // Assert: no views, tools, transcript content, traffic or changed saved preference.
  assert.deepEqual(loader.getExtensions().errors, []);
  assert.ok(notices.some((notice) => notice.includes("interactive terminal")));
  assert.deepEqual(widgets, []);
  assert.deepEqual(requests, []);
  assert.deepEqual(session.getActiveToolNames(), ["forgetful_recall_wait"]);
  assert.deepEqual(session.messages, []);
  assert.equal(JSON.parse(await readFile(settingsPath, "utf8")).planning_panel, true);
});

test("Pi 1.3 custom-message runs do not start a new user recall", async (t) => {
  // Arrange: real Pi runner and external-only provider double; no paid model calls.
  const root = await mkdtemp(join(tmpdir(), "forgetful-planning-sdk-trigger-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const server = createServer((_request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ projects: [], total: 0 }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    model: "compat/memory", capture_mode: "off",
    base_url: `http://127.0.0.1:${address.port}/api/v1`,
  }));
  const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  const calls: string[] = [];
  runtime.registerProvider("compat", {
    api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
      input: ["text"], contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
    streamSimple(model) {
      calls.push(model.id);
      const message: AssistantMessage = { role: "assistant", api: "faux", provider: "compat",
        model: model.id, content: [{ type: "text", text: "Custom message handled" }],
        stopReason: "stop", timestamp: Date.now(), usage: {
          input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: "stop", message });
      stream.end(message);
      return stream;
    },
  });
  let settled!: () => void;
  const done = new Promise<void>((resolve) => { settled = resolve; });
  const driver = (pi: ExtensionAPI) => {
    pi.on("agent_settled", () => settled());
    pi.registerCommand("custom-trigger", { description: "SDK compatibility fixture",
      handler: async () => {
        pi.sendMessage({ customType: "fixture_continuation", content: "Continue fixture",
          display: false }, { triggerTurn: true });
      } });
  };
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
    noSkills: true, noContextFiles: true, noThemes: true, noPromptTemplates: true,
    additionalExtensionPaths: [resolve("index.ts")], extensionFactories: [driver] });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
    model: runtime.getModel("compat", "main"), settingsManager: settings,
    sessionManager: SessionManager.inMemory(root), resourceLoader: loader, noTools: "builtin" });
  t.after(async () => {
    await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
    session.dispose();
    await new Promise<void>((resolve) => {
      server.close(() => resolve()); server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  await session.bindExtensions({});
  await session.prompt("/forgetful status");

  // Act: a non-user continuation uses the changed 1.3 before_agent_start event shape.
  await session.prompt("/custom-trigger");
  await done;

  // Assert: only the main model continues; neither recall nor its pending marker is created.
  assert.deepEqual(calls, ["main"]);
  assert.ok(!JSON.stringify(session.messages).includes("forgetful_recall_async"));
});
