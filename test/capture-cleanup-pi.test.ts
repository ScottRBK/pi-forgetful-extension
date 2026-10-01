import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { createAssistantMessageEventStream, type AssistantMessage } from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { providerTools } from "./provider-context.ts";

async function eventually(check: () => Promise<void>): Promise<void> {
  const deadline = Date.now() + 5000;
  for (;;) {
    try { await check(); return; }
    catch (error) {
      if (Date.now() >= deadline) throw error;
      await delay(10);
    }
  }
}

for (const failure of ["provider", "submission"] as const) {
  test(`real Pi discards capture after three ${failure} failures without replaying settlement`,
    { timeout: 20_000 }, async (t) => {
      // Arrange: real Pi sessions, extension, REST adapter and durable queue.
      // Only external REST and model responses are scripted; no paid model or remote network.
      const root = await mkdtemp(join(tmpdir(), "pi-capture-cleanup-"));
      let closeSession: (() => Promise<void>) | undefined;
      let closeServer: (() => Promise<void>) | undefined;
      t.after(async () => {
        try { await closeSession?.(); }
        finally {
          try { await closeServer?.(); }
          finally { await rm(root, { recursive: true, force: true }); }
        }
      });
      const agentDir = join(root, "agent");
      await mkdir(join(agentDir, "forgetful"), { recursive: true });
      const git = promisify(execFile);
      await git("git", ["init", "--quiet", root]);
      await git("git", ["-C", root, "remote", "add", "origin",
        "https://github.com/test/capture-cleanup.git"]);
      const unexpectedRequests: string[] = [];
      const server = createServer((request, response) => {
        response.setHeader("content-type", "application/json");
        if (request.method === "GET" && request.url?.startsWith("/api/v1/projects")) {
          response.end(JSON.stringify({ projects: [
            { id: 7, name: "Cleanup test", repo_name: "test/capture-cleanup" },
          ], total: 1 }));
        } else {
          unexpectedRequests.push(`${request.method} ${request.url}`);
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
        capture_mode: "auto", logging: "debug", timeout_ms: 2000,
      }));
      await writeFile(join(agentDir, "settings.json"), JSON.stringify({
        retry: { enabled: false }, compaction: { enabled: false },
      }));
      let captureCalls = 0;
      const memoryReplyAllowances: Array<number | undefined> = [];
      const runtime = await ModelRuntime.create({
        authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
      });
      runtime.registerProvider("test", {
        api: "faux", apiKey: "test-only-key", baseUrl: "http://127.0.0.1/unused",
        models: ["main", "memory"].map((id) => ({
          id, name: id, reasoning: false, input: ["text"],
          contextWindow: id === "memory" ? 1_000_000 : 32_000,
          maxTokens: id === "memory" ? 384_000 : 2048,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        })),
        streamSimple(model, context, options) {
          if (model.id === "memory") memoryReplyAllowances.push(options?.maxTokens);
          const name = providerTools(context)[0]?.name;
          const capture = model.id === "memory" && name === "submit_capture_candidates";
          if (capture) captureCalls++;
          const providerFailure = capture && failure === "provider";
          const message: AssistantMessage = {
            role: "assistant", api: "faux", provider: "test", model: model.id,
            content: capture ? [{ type: "toolCall", id: `capture-${captureCalls}`, name: name!,
              arguments: { candidates: "invalid submission" } }]
              : [{ type: "text", text: model.id === "main" ? "Decision noted."
                : JSON.stringify({ search: false, queries: [], entities: [],
                  queryIntent: "No recall needed" }) }],
            stopReason: providerFailure ? "error" : capture ? "toolUse" : "stop",
            ...(providerFailure ? { errorMessage: "Scripted capture provider failure" } : {}),
            timestamp: Date.now(),
            usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          };
          const stream = createAssistantMessageEventStream();
          queueMicrotask(() => {
            if (providerFailure) stream.push({ type: "error", reason: "error", error: message });
            else stream.push({ type: "done", reason: capture ? "toolUse" : "stop", message });
            stream.end(message);
          });
          return stream;
        },
      });
      const extensionErrors: unknown[] = [];
      let sessionFile: string | undefined;
      const startSession = async () => {
        const settings = SettingsManager.create(root, agentDir);
        settings.setProjectTrusted(true);
        const manager = sessionFile ? SessionManager.open(sessionFile)
          : SessionManager.create(root, join(root, "sessions"));
        const loader = new DefaultResourceLoader({
          cwd: root, agentDir, settingsManager: settings, noSkills: true,
          noPromptTemplates: true, noThemes: true, noContextFiles: true,
          extensionFactories: [createForgetfulExtension({ agentDir })],
        });
        await loader.reload();
        assert.deepEqual(loader.getExtensions().errors, []);
        const { session } = await createAgentSession({
          cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
          settingsManager: settings, sessionManager: manager,
          resourceLoader: loader, noTools: "builtin",
        });
        session.extensionRunner.onError((error) => extensionErrors.push(error));
        closeSession = async () => {
          try {
            await session.abort();
            await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
          } finally { session.dispose(); }
        };
        await session.bindExtensions({});
        sessionFile = manager.getSessionFile();
        assert.ok(sessionFile, "recovery must reopen the persisted Pi session");
        return session;
      };

      // Act: a successful main-agent settlement fails only in background capture.
      const session = await startSession();
      await session.prompt("We decided to use local storage for this repo.");
      const queues = join(agentDir, "forgetful/queues");
      let directory = "";
      await eventually(async () => {
        const directories = await readdir(queues);
        assert.equal(directories.length, 1);
        directory = join(queues, directories[0]!);
      });
      const readQueue = async () => JSON.parse(await readFile(join(directory, "queue.json"),
        "utf8")) as { jobs: Array<{ id: string; attempts: number; status: string }>;
          conflicts: Array<{ id: string }> };
      let previousCaptureCalls = 0;
      const waitForAttempt = async (attempt: number) => {
        await eventually(async () => {
          const { jobs } = await readQueue();
          if (attempt === 3 && jobs.length === 0) return;
          assert.equal(jobs[0]?.attempts, attempt);
          assert.ok(["pending", "failed"].includes(jobs[0]!.status));
        });
        // Await the public drain before examining persistence or starting another checkpoint.
        await closeSession!();
        closeSession = undefined;
        assert.ok(captureCalls > previousCaptureCalls,
          "each attempt must reach the scripted capture provider");
        previousCaptureCalls = captureCalls;
      };
      await waitForAttempt(1);
      const queue = new DurableQueueStore({ directory });
      const [job] = await queue.listJobs();
      assert.ok(job);
      const originalSnapshot = job.snapshot;
      // Seed associated artifacts through the approved public queue seam between workers.
      await queue.checkpoint(job.id, { inspectionEntries: [{ id: "inspection:cleanup",
        role: "toolResult", toolName: "read", text: "Stored source inspection evidence." }] });
      await queue.addConflict({ id: "cleanup-conflict", jobId: job.id, candidateId: "storage",
        binding: job.binding, sessionId: job.snapshot.context.sessionId,
        branchId: job.snapshot.context.branchId, destinationProjectId: 7,
        candidate: { id: "storage" }, sourceEntryIds: [], evidence: [],
        reason: "Seeded pending conflict belonging to the failed capture", status: "pending",
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      const snapshots = (await readdir(directory)).filter((name) => name.startsWith("snapshot-"));
      assert.equal(snapshots.length, 2, "conversation and inspection snapshots must exist");

      // Assert: both retryable attempts preserve the same work and its evidence on disk.
      for (const attempt of [1, 2]) {
        if (attempt === 2) { await startSession(); await waitForAttempt(2); }
        const saved = await readQueue();
        assert.equal(saved.jobs.length, 1);
        assert.equal(saved.jobs[0]!.id, job.id);
        assert.equal(saved.jobs[0]!.status, "pending");
        assert.equal(saved.jobs[0]!.attempts, attempt);
        assert.deepEqual(saved.conflicts.map((conflict) => conflict.id), ["cleanup-conflict"]);
        for (const name of snapshots) assert.ok((await readFile(join(directory, name))).length);
      }
      await startSession();
      await waitForAttempt(3);
      const exhausted = await readQueue();
      assert.equal(exhausted.jobs.length, 0, "third failure must permanently delete the job");
      assert.deepEqual(exhausted.conflicts, [], "associated conflicts must also be deleted");
      assert.deepEqual(await readdir(directory), ["queue.json"],
        "no conversation/inspection snapshot or worker lock may survive exhaustion");

      // A fresh queue and Pi runtime must remember settlement even after the job is deleted.
      const reopened = new DurableQueueStore({ directory });
      assert.equal((await reopened.enqueue(originalSnapshot)).queued, false,
        "the same settlement must stay deduplicated after permanent deletion");
      const callsBeforeRestart = captureCalls;
      const restarted = await startSession();
      await restarted.extensionRunner.emit({ type: "agent_settled" });
      await closeSession!();
      closeSession = undefined;
      assert.equal(captureCalls, callsBeforeRestart, "restart must not replay exhausted work");
      assert.deepEqual((await readQueue()).jobs, []);
      assert.deepEqual(await readdir(directory), ["queue.json"]);
      const logDir = join(root, ".pi/forgetful/logs");
      const events = (await Promise.all((await readdir(logDir)).map(async (name) =>
        (await readFile(join(logDir, name), "utf8")).trim().split("\n").map((line) =>
          JSON.parse(line))))).flat();
      const attempts = events.filter((event) =>
        event.event === "capture.started" || event.event === "capture.retry");
      assert.deepEqual(attempts.map((event) => event.data.attempt).sort(), [1, 2, 3]);
      assert.equal(events.filter((event) => event.event === "capture.error").length, 3);
      if (failure === "submission") assert.ok(events.some((event) =>
        event.event === "model.submission_rejected"), "invalid submissions must be validated");
      assert.deepEqual(extensionErrors, []);
      assert.ok(memoryReplyAllowances.length > 0);
      assert.ok(memoryReplyAllowances.every((allowance) => allowance === 16_384),
        "real Pi must cap large-catalog output limits before sending private provider requests");
      assert.deepEqual(unexpectedRequests, [], "failed extraction must not write to Forgetful");
    });
}
