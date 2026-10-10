import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

// This exercises the actual Pi write tool and reload, not the model's setup judgement.
test("Pi hands setup to the agent and reloads its written connection and skills",
  { timeout: 15_000 }, async (t) => {
    // Arrange: real Pi and a local REST service; only the external model is scripted.
    const root = await mkdtemp(join(tmpdir(), "forgetful-setup-pi-"));
    let closeSession: (() => Promise<void>) | undefined;
    let closeServer: (() => Promise<void>) | undefined;
    t.after(async () => {
      try { await closeSession?.(); }
      finally {
        try { await closeServer?.(); }
        finally { await rm(root, { recursive: true, force: true }); }
      }
    });
    const home = process.env.HOME;
    process.env.HOME = root;
    t.after(() => {
      if (home === undefined) delete process.env.HOME;
      else process.env.HOME = home;
    });
    const tokenEnv = "FORGETFUL_SETUP_RELOAD_TEST_TOKEN";
    const oldToken = process.env[tokenEnv];
    process.env[tokenEnv] = "reload-test-secret";
    t.after(() => {
      if (oldToken === undefined) delete process.env[tokenEnv];
      else process.env[tokenEnv] = oldToken;
    });
    const requests: Array<{ path: string; auth?: string }> = [];
    const server = createServer((request, response) => {
      requests.push({ path: request.url!, auth: request.headers.authorization });
      response.setHeader("content-type", "application/json");
      const updated = request.url?.startsWith("/new/");
      response.end(JSON.stringify({ projects: [{
        id: updated ? 8 : 7, name: updated ? "Updated setup" : "Original setup",
        repo_name: "test/setup",
      }] }));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    closeServer = () => new Promise<void>((done) => {
      server.close(() => done());
      server.closeAllConnections();
    });
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const origin = `http://127.0.0.1:${address.port}`;
    const agentDir = join(root, "custom-agent");
    const settingsPath = join(agentDir, "forgetful/settings.json");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    const original = { base_url: `${origin}/old/api/v1`, capture_mode: "off",
      custom_setting: "keep" };
    await writeFile(settingsPath, JSON.stringify(original));
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin", "https://github.com/test/setup.git"]);
    const updated = { ...original, base_url: `${origin}/new/api/v1`, token_env: tokenEnv };
    const skillPath = join(agentDir, "skills/forgetful-setup-fixture/SKILL.md");
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
    });
    let modelCalls = 0;
    let handoff = "";
    let markAgentStarted!: () => void;
    const agentStarted = new Promise<void>((resolve) => { markAgentStarted = resolve; });
    runtime.registerProvider("setup-test", {
      api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
      models: [{ id: "main", name: "main", reasoning: false, input: ["text"],
        contextWindow: 64_000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
      streamSimple(model, context) {
        modelCalls += 1;
        if (modelCalls === 1) {
          handoff = JSON.stringify(context.messages);
          markAgentStarted();
        }
        const writing = modelCalls === 1;
        const message: AssistantMessage = {
          role: "assistant", api: "faux", provider: "setup-test", model: model.id,
          content: writing ? [
            { type: "toolCall", id: "settings", name: "write",
              arguments: { path: settingsPath, content: JSON.stringify(updated) } },
            { type: "toolCall", id: "skill", name: "write", arguments: { path: skillPath,
              content: "---\nname: forgetful-setup-fixture\ndescription: Setup reload test.\n" +
                "---\nUse the independent memory client.\n" } },
          ] : [{ type: "text", text: "Settings saved. Run /reload, not /forgetful setup." }],
          stopReason: writing ? "toolUse" : "stop", timestamp: Date.now(),
          usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        };
        const stream = createAssistantMessageEventStream();
        stream.push({ type: "done", reason: writing ? "toolUse" : "stop", message });
        stream.end(message);
        return stream;
      },
    });
    const loader = new DefaultResourceLoader({
      cwd: root, agentDir, settingsManager: settings,
      noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    const { session } = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("setup-test", "main"),
      settingsManager: settings, sessionManager: SessionManager.inMemory(root),
      resourceLoader: loader,
    });
    closeSession = async () => {
      try {
        await session.abort();
        await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      } finally { session.dispose(); }
    };
    const errors: string[] = [];
    const notices: string[] = [];
    const selections = ["No, I already have an instance", "Yes, help me configure Pi access",
      "CLI + skills"];
    await session.bindExtensions({
      onError: (error) => errors.push(error.error),
      uiContext: {
        notify: (message: string) => notices.push(message),
        setWidget: () => undefined,
        select: async (_title: string, choices: string[]) => {
          const selection = selections.shift();
          assert.ok(selection && choices.includes(selection));
          return selection;
        },
        input: async () => assert.fail("Agent help must not ask for REST connection inputs"),
      } as never,
    });
    await session.prompt("/forgetful status");
    assert.match(notices.join("\n"), /Original setup/);

    // Act: the wizard starts the agent, whose real write calls persist connection and skills.
    await session.prompt("/forgetful setup");
    await agentStarted;
    await session.waitForIdle();

    // Assert: real agent handoff, no secrets, and existing runtime still uses the old connection.
    assert.match(handoff, /forgetful-cli-setup/);
    assert.doesNotMatch(handoff, /reload-test-secret/);
    assert.equal(modelCalls, 2);
    assert.deepEqual(JSON.parse(await readFile(settingsPath, "utf8")), updated);
    assert.deepEqual(selections, []);
    assert.ok(session.messages.filter((message) => message.role === "toolResult")
      .every((message) => !message.isError));
    notices.length = 0;
    await session.prompt("/forgetful status");
    assert.match(notices.join("\n"), /Original setup/);
    assert.equal(requests.some(({ path }) => path.startsWith("/new/")), false);

    // Act: use the same SDK reload entry point as Pi's /reload, without another setup command.
    requests.length = 0;
    notices.length = 0;
    await session.reload();
    await session.prompt("/forgetful status");

    // Assert: both connection and skill changed, with no extra agent/setup turn.
    assert.match(notices.join("\n"), /Updated setup/);
    assert.ok(requests.length > 0);
    assert.ok(requests.every(({ path, auth }) => path.startsWith("/new/api/v1/projects") &&
      auth === "Bearer reload-test-secret"));
    assert.ok(loader.getSkills().skills.some((skill) => skill.name === "forgetful-setup-fixture"));
    assert.deepEqual(loader.getExtensions().errors, []);
    assert.deepEqual(errors, []);
    assert.equal(modelCalls, 2);
  });
