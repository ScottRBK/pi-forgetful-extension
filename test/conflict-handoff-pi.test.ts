import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
  type AgentSession,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context, type JsonObject,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

async function eventually(check: () => Promise<void>) {
  const deadline = Date.now() + 5_000;
  for (;;) {
    try { await check(); return; }
    catch (error) {
      if (Date.now() >= deadline) throw error;
      await new Promise((done) => setTimeout(done, 10));
    }
  }
}

function reply(model = "main"): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "handoff", model,
    content: [{ type: "text", text: "Acknowledged." }], stopReason: "stop", timestamp: Date.now(),
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

async function fixture(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), "pi-conflict-handoff-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const git = promisify(execFile);
  await git("git", ["init", "--quiet", root]);
  await git("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/conflict-handoff.git"]);
  const old = { id: 42, title: "Storage", content: "Use SQLite for durable state.",
    context: "Previous decision", keywords: ["storage"], tags: [], importance: 7,
    project_ids: [7], is_obsolete: false, linked_memory_ids: [] };
  const writes: string[] = [];
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.method === "GET" && request.url?.startsWith("/api/v1/projects")) {
      response.end(JSON.stringify({ projects: [
        { id: 7, name: "Handoff", repo_name: "test/conflict-handoff" },
      ], total: 1 }));
    } else if (request.method === "POST" && request.url === "/api/v1/memories/search") {
      response.end(JSON.stringify({ primary_memories: [old], linked_memories: [] }));
    } else if (request.method === "GET" && request.url === "/api/v1/memories/42") {
      response.end(JSON.stringify(old));
    } else if (request.method === "GET" && request.url?.startsWith("/api/v1/graph/memory/42")) {
      response.end(JSON.stringify({ center_memory_id: 42, edges: [] }));
    } else {
      if (request.method !== "GET") writes.push(`${request.method} ${request.url}`);
      response.statusCode = 404;
      response.end("{}");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "handoff/memory",
    enabled: true, capture_mode: "auto", timeout_ms: 3_000,
  }));
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  let extracted = false;
  let sourceId: string | undefined;
  const mainContexts: Context[] = [];
  runtime.registerProvider("handoff", {
    api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false, input: ["text"],
      contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
    streamSimple(model, context) {
      const message = reply(model.id);
      if (model.id === "main") mainContexts.push(structuredClone(context));
      else {
        const name = providerTools(context)[0]?.name;
        let args: JsonObject;
        if (name === "submit_recall_plan") {
          args = { search: false, queries: [], queryIntent: "", entities: [] };
        } else if (name === "submit_capture_candidates") {
          const input = decodeProviderContext(context).input;
          sourceId ??= input.eligibleEvidence.find((entry: { role: string }) =>
            entry.role === "user")?.id;
          assert.ok(sourceId);
          args = { candidates: extracted ? [] : [{ id: "storage", title: "Storage decision",
            content: "Use local files instead of SQLite.", context: "Proposed storage change",
            keywords: ["storage"], tags: [], sourceEntryIds: [sourceId],
            evidenceType: "userDecision" }] };
          extracted = true;
        } else {
          assert.equal(name, "submit_capture_decision");
          args = { action: "escalate", conflictingMemoryId: 42,
            reason: "Confirm whether local files replace SQLite.",
            oldClaim: old.content, newClaim: "Use local files instead of SQLite.",
            sourceEntryIds: [sourceId!] };
        }
        message.content = [{ type: "toolCall", id: `call-${Date.now()}`, name: name!,
          arguments: args }];
        message.stopReason = "toolUse";
      }
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: message.stopReason as "stop" | "toolUse", message });
      stream.end(message);
      return stream;
    },
  });
  let session: AgentSession | undefined;
  let sessionFile: string | undefined;
  const shutdown = async () => {
    if (!session) return;
    try {
      await session.abort();
      await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
    } finally { session.dispose(); session = undefined; }
  };
  t.after(async () => {
    try { await shutdown(); }
    finally {
      await new Promise<void>((done) => {
        server.close(() => done()); server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    }
  });
  const start = async () => {
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const manager = sessionFile ? SessionManager.open(sessionFile)
      : SessionManager.create(root, join(root, "sessions"));
    const loader = new DefaultResourceLoader({
      cwd: root, agentDir, settingsManager: settings, noSkills: true,
      noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const created = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("handoff", "main"),
      settingsManager: settings, sessionManager: manager, resourceLoader: loader,
      noTools: "builtin",
    });
    session = created.session;
    await session.bindExtensions({});
    await session.prompt("/forgetful status");
    sessionFile = manager.getSessionFile();
    assert.ok(sessionFile);
    return session;
  };
  const queue = async () => {
    const directory = join(agentDir, "forgetful/queues");
    const names = await readdir(directory);
    assert.equal(names.length, 1);
    return new DurableQueueStore({ directory: join(directory, names[0]!) });
  };
  const conflict = async () => {
    let id = "";
    await eventually(async () => {
      const store = await queue();
      const conflicts = await store.pendingConflicts();
      assert.equal(conflicts.length, 1);
      const job = await store.getJob(conflicts[0]!.jobId!);
      assert.equal(job?.status, "complete");
      id = conflicts[0]!.id;
    });
    return id;
  };
  return { start, shutdown, queue, conflict, mainContexts, writes,
    reopenJournal: () => SessionManager.open(sessionFile!) };
}

function notices(manager: SessionManager) {
  return manager.getBranch().filter((entry) => entry.type === "custom_message" &&
    entry.customType === "forgetful_conflict");
}

test("Pi hands off a conflict only after saving the notice, without resolving or redelivery",
  { timeout: 20_000 }, async (t) => {
    // Arrange: real capture escalation; nothing has yet been delivered to another model turn.
    const f = await fixture(t);
    const first = await f.start();
    await first.prompt("Should we replace SQLite with local files?");
    const id = await f.conflict();
    const queue = await f.queue();
    assert.equal(notices(first.sessionManager).length, 0);
    assert.equal(f.mainContexts.length, 1, "a conflict must not wake an idle agent");
    assert.equal((await queue.getConflict(id))?.status, "pending");

    // Act: close before delivery, reopen the actual journal, and start the next user turn.
    await f.shutdown();
    const second = await f.start();
    await second.prompt("Discuss the storage conflict with me before changing memory.");

    // Assert: a saved handoff ends local delivery, not the user's external resolution.
    assert.equal(notices(f.reopenJournal()).length, 1, "the next turn must save the handoff");
    await eventually(async () => assert.equal((await queue.getConflict(id))?.status, "handed_off"));
    const delivered = JSON.stringify(f.mainContexts.at(-1)?.messages);
    assert.match(delivered, /SQLite/);
    assert.match(delivered, /local files/);
    assert.match(delivered, /42/);
    assert.match(delivered, /CLI\/MCP/);
    assert.match(delivered, /user/);
    assert.doesNotMatch(delivered, /forgetful_resolve/);
    assert.deepEqual(await queue.pendingConflicts(), []);
    assert.deepEqual(f.writes, [], "handoff cannot write a replacement or supersede a memory");

    await f.shutdown();
    const third = await f.start();
    await third.prompt("Continue unrelated work.");
    assert.equal(notices(f.reopenJournal()).length, 1, "restart must not repeat a saved handoff");
    assert.equal((await queue.getConflict(id))?.status, "handed_off");
    assert.deepEqual(f.writes, []);
  });

for (const progress of [
  { label: "partial replacement", patch: { replacementId: 99 } },
  { label: "uncertain write", patch: { uncertainWrite: "Previous save outcome is unknown" } },
  { label: "started supersession", patch: { supersession: {
    oldMemoryId: 42, replacementId: 99, status: "started" as const,
  } } },
]) {
  test(`handoff leaves ${progress.label} records and original evidence untouched`,
    { timeout: 20_000 }, async (t) => {
      // Arrange: a persisted conflict carrying write progress from the old resolver.
      const f = await fixture(t);
      const first = await f.start();
      await first.prompt("Should we replace SQLite with local files?");
      const id = await f.conflict();
      const queue = await f.queue();
      const original = await queue.updateConflict(id, progress.patch);
      const evidence = (await queue.getJob(original.jobId!))!.snapshot;
      assert.ok(evidence.entries.length);

      // Act: discuss the conflict, then reopen and continue without invoking an extension writer.
      await first.prompt("Discuss the pending change.");
      await f.shutdown();
      const second = await f.start();
      await second.prompt("Continue discussing the change.");

      // Assert: notification is not permission to clear or replay an unfinished write.
      assert.deepEqual(await queue.getConflict(id), original);
      assert.deepEqual((await queue.getJob(original.jobId!))!.snapshot, evidence);
      assert.equal(notices(f.reopenJournal()).length, 1);
      assert.match(JSON.stringify(f.mainContexts.at(-1)?.messages), /Previous save needs checking/);
      assert.deepEqual(f.writes, []);
    });
}

test("an undelivered conflict never leaks to a sibling branch", { timeout: 20_000 }, async (t) => {
  // Arrange: a shared ancestor followed by an uncertain decision on only one branch.
  const f = await fixture(t);
  const session = await f.start();
  session.sessionManager.appendMessage({ role: "user", content: "Common planning context.",
    timestamp: 1 });
  const shared = session.sessionManager.appendMessage(reply());
  session.refreshContext();
  await session.prompt("Should we replace SQLite with local files?");
  const id = await f.conflict();
  const queue = await f.queue();
  const conflict = (await queue.getConflict(id))!;
  const origin = (await queue.getJob(conflict.jobId!))!.snapshot.leafEntryId!;

  // Act: leave before the next-turn notification, then start an unrelated sibling conversation.
  await session.navigateTree(shared, { summarize: false });
  await session.prompt("/forgetful status");
  await session.prompt("Work on an unrelated topic.");

  // Assert: only returning to the originating branch may receive and acknowledge the handoff.
  assert.equal(notices(session.sessionManager).length, 0);
  assert.doesNotMatch(JSON.stringify(f.mainContexts.at(-1)?.messages), /pending conflict\(s\)/);
  assert.equal((await queue.getConflict(id))!.status, "pending");
  await session.navigateTree(origin, { summarize: false });
  await session.prompt("/forgetful status");
  await session.prompt("Discuss the earlier storage conflict.");
  assert.equal(notices(session.sessionManager).length, 1);
  await eventually(async () => assert.equal((await queue.getConflict(id))!.status, "handed_off"));
  assert.deepEqual(f.writes, []);
});

test("handoff waits for an existing branch worker", { timeout: 20_000 }, async (t) => {
  // Arrange: a prior capture/resolution worker still owns the originating branch.
  const f = await fixture(t);
  const session = await f.start();
  await session.prompt("Should we replace SQLite with local files?");
  const id = await f.conflict();
  const queue = await f.queue();
  const conflict = (await queue.getConflict(id))!;
  let release!: () => void;
  const hold = new Promise<void>((done) => { release = done; });
  let locked!: () => void;
  const started = new Promise<void>((done) => { locked = done; });
  let worker: Promise<void | undefined>;
  await eventually(async () => {
    worker = queue.withWorkerLock(conflict.binding, conflict, async () => {
      locked();
      await hold;
    });
    assert.equal(await Promise.race([started.then(() => true), worker.then(() => false)]), true);
  });
  try {
    // Act: the user can receive the handoff without displacing an unfinished writer.
    await session.prompt("Discuss the conflict without interrupting the existing worker.");

    // Assert: delivery cannot release evidence while another worker may still record a write.
    assert.equal(notices(f.reopenJournal()).length, 1);
    assert.equal((await queue.getConflict(id))!.status, "pending");
  } finally { release(); await worker!; }
  await eventually(async () => assert.equal((await queue.getConflict(id))!.status, "handed_off"));
  assert.deepEqual(f.writes, []);
});
