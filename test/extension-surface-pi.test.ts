import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { createAssistantMessageEventStream, type AssistantMessage } from "@earendil-works/pi-ai";

test("Pi keeps independent skills and human controls without bundled workflows", async (t) => {
  // Arrange: the packaged extension, real Pi resource loading, and isolated external services.
  const root = await mkdtemp(join(tmpdir(), "forgetful-surface-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const home = process.env.HOME;
  process.env.HOME = root;
  t.after(() => {
    if (home === undefined) delete process.env.HOME;
    else process.env.HOME = home;
  });
  const server = createServer((_request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ projects: [] }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((done) => server.close(() => done())));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}`, enabled: true, capture_mode: "off",
  }));
  const skillDirectory = join(agentDir, "skills/forgetful-independent");
  await mkdir(skillDirectory, { recursive: true });
  await writeFile(join(skillDirectory, "SKILL.md"), [
    "---", "name: forgetful-independent", "description: Independently supplied memory workflow.",
    "---", "Use the separately configured memory client.",
  ].join("\n"));
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  let modelCalls = 0;
  runtime.registerProvider("surface", {
    api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
    models: [{ id: "main", name: "main", reasoning: false, input: ["text"],
      contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
    streamSimple(model) {
      modelCalls += 1;
      const message: AssistantMessage = {
        role: "assistant", api: "faux", provider: "surface", model: model.id,
        content: [{ type: "text", text: "No manual memory workflow should have started." }],
        stopReason: "stop", timestamp: Date.now(),
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      };
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: "stop", message });
      stream.end(message);
      return stream;
    },
  });
  const loader = new DefaultResourceLoader({
    cwd: root, agentDir, settingsManager: settings, noPromptTemplates: true,
    noContextFiles: true, noThemes: true, additionalExtensionPaths: [resolve("index.ts")],
  });
  await loader.reload();
  const { session } = await createAgentSession({
    cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("surface", "main"),
    settingsManager: settings, sessionManager: SessionManager.inMemory(root),
    resourceLoader: loader, noTools: "builtin",
  });
  t.after(async () => {
    try { await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" }); }
    finally { session.dispose(); }
  });
  const notices: string[] = [];
  await session.bindExtensions({ uiContext: {
    notify: (message: string) => notices.push(message),
  } as never });

  // Act: load resources through Pi, then exercise retained and removed commands.
  const skills = loader.getSkills().skills.map((skill) => skill.name);
  await session.prompt("/forgetful status");
  await session.prompt("/forgetful capture observe");
  await session.prompt("/forgetful capture off");
  await session.prompt("/forgetful encode");

  // Assert: removing our workflows does not remove independently installed memory skills.
  assert.deepEqual(loader.getExtensions().errors, []);
  assert.deepEqual(session.getActiveToolNames(), ["forgetful_recall_wait"]);
  assert.deepEqual(skills, ["forgetful-independent"]);
  assert.ok(notices.includes("Forgetful capture set to observe."));
  assert.ok(notices.includes("Forgetful capture set to off."));
  assert.ok(notices.some((text) => text.startsWith("Usage: /forgetful")));
  assert.equal(modelCalls, 0, "removed encode must not start a main-model workflow");
});
