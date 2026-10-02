import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { providerSystemPrompt, providerTools } from "./provider-context.ts";

async function eventually(check: () => Promise<void>): Promise<void> {
  const deadline = Date.now() + 5000;
  for (;;) {
    try {
      await check();
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await delay(10);
    }
  }
}

function assistant(text: string, timestamp = Date.now()): AssistantMessage {
  return {
    role: "assistant",
    api: "faux",
    provider: "restart-history",
    model: "main",
    content: [{ type: "text", text }],
    stopReason: "stop",
    timestamp,
    usage: {
      input: 1,
      output: 1,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
  };
}

function includes(value: Context, pattern: string): boolean {
  return JSON.stringify(value.messages).includes(pattern);
}

test("real Pi restart reuses same-path capture summary branch", { timeout: 25_000 },
  async (t) => {
    // Arrange: real Pi session file, lifecycle and queue; only REST/model replies stubbed.
    const root = await mkdtemp(join(tmpdir(), "pi-capture-history-restart-"));
    let closeSession: (() => Promise<void>) | undefined;
    let closeServer: (() => Promise<void>) | undefined;
    t.after(async () => {
      try {
        await closeSession?.();
      } finally {
        try {
          await closeServer?.();
        } finally {
          await rm(root, { recursive: true, force: true });
        }
      }
    });
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin",
      "https://github.com/test/restart-history.git"]);
    const server = createServer((request, response) => {
      response.setHeader("content-type", "application/json");
      if (request.method === "GET" && request.url?.startsWith("/api/v1/projects")) {
        response.end(JSON.stringify({ projects: [
          { id: 11, name: "Restart history", repo_name: "test/restart-history" },
        ], total: 1 }));
        return;
      }
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
      base_url: `http://127.0.0.1:${address.port}/api/v1`,
      model: "restart-history/memory",
      capture_mode: "observe",
      enabled: true,
      logging: "debug",
      // Still forces old-history compaction, with room for the new planner tool protocol.
      context_limit_tokens: 10_000,
      timeout_ms: 2000,
    }));
    await writeFile(join(agentDir, "settings.json"), JSON.stringify({
      retry: { enabled: false },
      compaction: { enabled: true, reserveTokens: 1200, keepRecentTokens: 1200 },
    }));

    let sessionFile: string | undefined;
    let summaryCalls = 0;
    const captureRequests: Context[] = [];
    const compactionRequests: Context[] = [];
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"),
      modelsPath: null,
      refreshOnCreate: false,
    });
    runtime.registerProvider("restart-history", {
      api: "faux",
      apiKey: "fixture-only",
      baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id,
        name: id,
        reasoning: false,
        input: ["text"],
        contextWindow: id === "memory" ? 64_000 : 32_000,
        maxTokens: id === "memory" ? 2048 : 1024,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context) {
        const toolName = providerTools(context)[0]?.name;
        const policy = providerSystemPrompt(context);
        const capture = model.id === "memory" && toolName === "submit_capture_candidates";
        const compacting = model.id === "memory" && !capture &&
          policy.includes("context summarization assistant");
        const plan = model.id === "memory" && !compacting &&
          toolName === "submit_recall_plan";
        if (capture) captureRequests.push(structuredClone(context));
        if (compacting) {
          summaryCalls += 1;
          compactionRequests.push(structuredClone(context));
        }
        const message: AssistantMessage = {
          ...assistant(model.id === "main" ? "Acknowledged." : "No recall required."),
          provider: "restart-history",
          model: model.id,
          content: capture ? [{ type: "toolCall", id: `capture-${captureRequests.length}`,
            name: toolName!, arguments: { candidates: [] } }]
            : plan ? [{ type: "toolCall", id: "recall-plan", name: toolName!,
              arguments: { search: false, queries: [], queryIntent: "", entities: [] } }]
            : [{ type: "text", text: model.id === "main" ? "Acknowledged." : compacting
              ? "RESTART_SUMMARY: older captured planning history."
              : "No recall required." }],
          stopReason: capture || plan ? "toolUse" : "stop",
        };
        const stream = createAssistantMessageEventStream();
        stream.push({ type: "done", reason: message.stopReason as "stop" | "toolUse", message });
        stream.end(message);
        return stream;
      },
    });

    const startSession = async () => {
      const settings = SettingsManager.create(root, agentDir);
      settings.setProjectTrusted(true);
      const manager = sessionFile ? SessionManager.open(sessionFile)
        : SessionManager.create(root, join(root, "sessions"));
      const loader = new DefaultResourceLoader({
        cwd: root,
        agentDir,
        settingsManager: settings,
        noSkills: true,
        noPromptTemplates: true,
        noThemes: true,
        noContextFiles: true,
        extensionFactories: [createForgetfulExtension({ agentDir })],
      });
      await loader.reload();
      assert.deepEqual(loader.getExtensions().errors, []);
      const { session } = await createAgentSession({
        cwd: root,
        agentDir,
        modelRuntime: runtime,
        model: runtime.getModel("restart-history", "main"),
        settingsManager: settings,
        sessionManager: manager,
        resourceLoader: loader,
        noTools: "builtin",
      });
      closeSession = async () => {
        try {
          await session.abort();
          await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
        } finally {
          session.dispose();
        }
      };
      await session.bindExtensions({});
      sessionFile = manager.getSessionFile();
      assert.ok(sessionFile);
      return { session, manager };
    };
    const queue = async () => {
      const directories = await readdir(join(agentDir, "forgetful", "queues"));
      assert.equal(directories.length, 1);
      return new DurableQueueStore({ directory: join(agentDir, "forgetful", "queues",
        directories[0]!) });
    };

    const first = await startSession();
    for (let index = 0; index < 35; index++) {
      first.manager.appendMessage({ role: "user", timestamp: 1,
        content: `OLD_HISTORY_START ${index}: ${"restart planning ".repeat(100)}` });
      first.manager.appendMessage(assistant("Historical detail recorded.", 2));
    }
    await first.session.prompt("Capture the restart history branch.");
    let firstBranchId = "";
    let firstFinalEntryId = "";
    await eventually(async () => {
      const jobs = await (await queue()).listJobs();
      assert.equal(jobs.length, 1);
      assert.equal(jobs[0]!.status, "complete");
      assert.equal(jobs[0]!.snapshot.conversationCoverage, "summarized");
      firstBranchId = jobs[0]!.snapshot.context.branchId;
      firstFinalEntryId = jobs[0]!.snapshot.finalEntryId;
    });
    assert.ok(summaryCalls > 0, "the first capture must save a reusable history summary");
    const callsAfterFirst = summaryCalls;
    const firstWatermark = await (await queue()).getWatermark(
      first.manager.getSessionId(),
      firstBranchId,
    );
    assert.equal(firstWatermark.lastEntryId, firstFinalEntryId);
    assert.ok(firstWatermark.historyDigest);
    await closeSession!();
    closeSession = undefined;

    // Act: Pi's persisted active leaf moves forward on the same path before extension restart.
    const resumedBeforeRestart = SessionManager.open(sessionFile!);
    resumedBeforeRestart.appendMessage({ role: "user", timestamp: 3,
      content: "RESTART_BASELINE: same-path work already in the session file." });
    resumedBeforeRestart.appendMessage(assistant("Baseline restart entry recorded.", 4));
    const restarted = await startSession();
    assert.notEqual(restarted.manager.getLeafId(), firstFinalEntryId,
      "the regression needs Pi's current leaf to differ from the stored branch boundary");
    await restarted.session.prompt("NEW_RESTART_WORK: capture only the fresh restart decision.");
    let secondBranchId = "";
    let secondFinalEntryId = "";
    await eventually(async () => {
      const jobs = await (await queue()).listJobs();
      assert.equal(jobs.length, 2);
      assert.equal(jobs[1]!.status, "complete");
      secondBranchId = jobs[1]!.snapshot.context.branchId;
      secondFinalEntryId = jobs[1]!.snapshot.finalEntryId;
    });

    // Assert: the same-path restart keeps the old branch and reuses the old summary.
    assert.equal(secondBranchId, firstBranchId);
    assert.notEqual(secondFinalEntryId, firstFinalEntryId);
    const restartCompactions = compactionRequests.slice(callsAfterFirst);
    const resummarizedOldHistory = restartCompactions.some((request) =>
      includes(request, "OLD_HISTORY_START"));
    assert.equal(resummarizedOldHistory, false,
      "restart continuation must not resummarize old captured messages");
    const secondRequest = captureRequests.at(-1);
    assert.ok(secondRequest);
    assert.ok(includes(secondRequest, "RESTART_SUMMARY"));
    assert.ok(includes(secondRequest, "NEW_RESTART_WORK"));
    assert.equal(includes(secondRequest, "OLD_HISTORY_START"), false);

    // Act again: a sibling restart lacks the old branch's latest boundary on its active path.
    await closeSession!();
    closeSession = undefined;
    const siblingBeforeRestart = SessionManager.open(sessionFile!);
    siblingBeforeRestart.branch(firstFinalEntryId);
    siblingBeforeRestart.appendMessage({ role: "user", timestamp: 5,
      content: "SIBLING_BASELINE: diverged before the same-path restart work." });
    siblingBeforeRestart.appendMessage(assistant("Sibling restart entry recorded.", 6));
    const sibling = await startSession();
    await sibling.session.prompt("SIBLING_RESTART_WORK: capture the divergent restart branch.");
    let siblingBranchId = "";
    await eventually(async () => {
      const jobs = await (await queue()).listJobs();
      assert.equal(jobs.length, 3);
      assert.equal(jobs[2]!.status, "complete");
      siblingBranchId = jobs[2]!.snapshot.context.branchId;
    });

    // Assert: the divergent path gets a fresh branch instead of the old summary branch.
    assert.notEqual(siblingBranchId, firstBranchId);

    // Act once more: a different Pi session in the same repo has the same queue directory.
    await closeSession!();
    closeSession = undefined;
    sessionFile = undefined;
    const isolated = await startSession();
    assert.notEqual(isolated.manager.getSessionId(), first.manager.getSessionId());
    await isolated.session.prompt("NEW_SESSION_WORK: capture a different session.");
    let isolatedBranchId = "";
    await eventually(async () => {
      const jobs = await (await queue()).listJobs();
      assert.equal(jobs.length, 4);
      assert.equal(jobs[3]!.status, "complete");
      isolatedBranchId = jobs[3]!.snapshot.context.branchId;
    });

    // Assert: session isolation prevents reuse of the prior session's persisted branch.
    assert.notEqual(isolatedBranchId, firstBranchId);
  });
