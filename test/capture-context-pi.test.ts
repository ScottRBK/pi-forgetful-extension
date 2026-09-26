import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

for (const scenario of ["skip", "queued skip", "branched skip", "pinned settlement"] as const) {
  test(`Pi whole-context capture respects ${scenario}`, realOptions, async (t) => {
    // Arrange: real Pi, its command lifecycle, capture worker and isolated REST project lookup.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    await client.createProject({ name: "Workshop", description: "Capture context controls",
      repo_name: "test/workshop" });
    const root = await mkdtemp(join(tmpdir(), "pi-capture-context-controls-"));
    let closeSession: (() => Promise<void>) | undefined;
    t.after(async () => {
      try { await closeSession?.(); }
      finally { await rm(root, { recursive: true, force: true }); }
    });
    const git = promisify(execFile);
    await git("git", ["init", "-q", root]);
    await git("git", ["-C", root, "remote", "add", "origin",
      "https://github.com/test/workshop.git"]);
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
      base_url: baseUrl, model: "context-test/memory", capture_mode: "observe", enabled: true,
    }));
    await writeFile(join(agentDir, "settings.json"), JSON.stringify({
      compaction: { enabled: false }, retry: { enabled: false },
    }));
    const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    let receive!: (context: Context) => void;
    const captured = new Promise<Context>((resolve) => { receive = resolve; });
    runtime.registerProvider("context-test", {
      api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
        input: ["text"], contextWindow: 64_000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
      streamSimple(model, context) {
        const capture = context.tools?.[0]?.name === "submit_capture_candidates";
        if (capture) receive(structuredClone(context));
        const message: AssistantMessage = {
          role: "assistant", api: "faux", provider: "context-test", model: model.id,
          content: capture ? [{ type: "toolCall", id: "capture", name: "submit_capture_candidates",
            arguments: { candidates: [] } }] : [{ type: "text", text: model.id === "main"
            ? "Acknowledged." : JSON.stringify({ search: false, queries: [], entities: [],
              queryIntent: "No history required" }) }],
          stopReason: capture ? "toolUse" : "stop", timestamp: Date.now(),
          usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        };
        const stream = createAssistantMessageEventStream();
        stream.push({ type: "done", reason: message.stopReason as "stop" | "toolUse", message });
        stream.end(message);
        return stream;
      },
    });
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    const manager = SessionManager.inMemory(root);
    const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
      noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })] });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
      model: runtime.getModel("context-test", "main"), settingsManager: settings,
      sessionManager: manager, resourceLoader: loader, noTools: "builtin" });
    closeSession = async () => {
      try {
        await session.abort();
        await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      } finally { session.dispose(); }
    };
    await session.bindExtensions({});

    if (scenario === "pinned settlement") {
      // Act: a later journal append happens while the settled callback is scheduling work.
      manager.appendMessage({ role: "user", content: "PINNED_WORK: use the east entrance.",
        timestamp: 1 });
      const reply: AssistantMessage = { role: "assistant", api: "faux", provider: "context-test",
        model: "main", content: [{ type: "text", text: "This turn is settled." }],
        stopReason: "stop", timestamp: 2,
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      const settledId = manager.appendMessage(reply);
      const settling = session.extensionRunner.emit({ type: "agent_settled" });
      manager.appendMessage({ role: "user", content: "LATER_WORK: unrelated future entry.",
        timestamp: 3 });
      manager.appendMessage({ ...reply, timestamp: 4 });
      await settling;
      const context = await captured;

      // Assert: the original settled snapshot cannot drift to a later leaf during awaited work.
      assert.match(JSON.stringify(context.messages), /PINNED_WORK/);
      assert.match(JSON.stringify(context.messages), new RegExp(settledId));
      assert.doesNotMatch(JSON.stringify(context.messages), /LATER_WORK/);
      return;
    }

    // Act: opt out one turn, then settle a later turn in the same conversation.
    await session.prompt("/forgetful capture skip");
    if (scenario === "queued skip") {
      const reply: AssistantMessage = { role: "assistant", api: "faux", provider: "context-test",
        model: "main", content: [{ type: "text", text: "This turn is settled." }],
        stopReason: "stop", timestamp: 2,
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      manager.appendMessage({ role: "user", content: "SKIPPED_WORK: provisional seating idea.",
        timestamp: 1 });
      manager.appendMessage(reply);
      const first = session.extensionRunner.emit({ type: "agent_settled" });
      manager.appendMessage({ role: "user", content: "NEW_WORK: confirm the workshop date.",
        timestamp: 3 });
      manager.appendMessage({ ...reply, timestamp: 4 });
      const second = session.extensionRunner.emit({ type: "agent_settled" });
      await Promise.all([first, second]);
    } else {
      await session.prompt("SKIPPED_WORK: provisional workshop seating idea.");
      if (scenario === "branched skip") {
        const finalAssistant = manager.getBranch().findLast((entry) =>
          entry.type === "message" && entry.message.role === "assistant");
        assert.ok(finalAssistant);
        assert.ok(manager.getBranch().some((entry) => entry.type === "custom" &&
          entry.customType === "forgetful_capture_excluded"));
        manager.appendMessage({ role: "user", timestamp: 3,
          content: "SIBLING_ONLY: unrelated plans on the abandoned branch." });
        await session.navigateTree(finalAssistant.id, { summarize: false });
      }
      await session.prompt("NEW_WORK: confirm the workshop date with the venue.");
    }
    const skipped = manager.getBranch().find((entry) => entry.type === "message" &&
      entry.message.role === "user" && JSON.stringify(entry.message).includes("SKIPPED_WORK"));
    assert.ok(skipped);
    const context = await captured;

    // Assert: the model sees context, but cannot cite an explicit capture opt-out as new evidence.
    assert.match(JSON.stringify(context.messages), /SKIPPED_WORK/);
    assert.match(JSON.stringify(context.messages), /NEW_WORK/);
    assert.doesNotMatch(JSON.stringify(context.messages), /SIBLING_ONLY/);
    const task = context.messages.filter((message) => message.role === "user")
      .map((message) => message.content).find((content) =>
        typeof content === "string" && content.startsWith("{"));
    assert.equal(typeof task, "string");
    const metadata = JSON.parse(task as string);
    assert.ok(!metadata.eligibleEvidence.some((entry: { id: string }) => entry.id === skipped.id));
    assert.equal(metadata.conversationCoverage, "complete");
  });
}
