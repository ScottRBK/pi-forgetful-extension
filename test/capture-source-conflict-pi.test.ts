import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context, type JsonObject,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { providerTools } from "./provider-context.ts";

const sourceText = "Delivery requires a signed digital handover.\n";

function reply(model = "main"): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "source-conflict", model,
    content: [{ type: "text", text: "Acknowledged." }], stopReason: "stop", timestamp: Date.now(),
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

async function eventually(check: () => Promise<void>): Promise<void> {
  const deadline = Date.now() + 5_000;
  for (;;) {
    try { await check(); return; }
    catch (error) {
      if (Date.now() >= deadline) throw error;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

function notices(manager: SessionManager) {
  return manager.getBranch().filter((entry) =>
    entry.type === "custom_message" && entry.customType === "forgetful_conflict");
}

async function fixture(t: TestContext) {
  const project = { id: 7, name: "Delivery", repo_name: "test/source-conflict" };
  const old = { id: 42, title: "Delivery handover", content: "Use a paper handover.",
    context: "Previous requirement", keywords: ["delivery"], tags: [], project_ids: [project.id],
    importance: 7, is_obsolete: false, linked_memory_ids: [] };
  const mutations: string[] = [];
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    const path = request.url ?? "";
    if (path.startsWith("/api/v1/projects") && request.method === "GET") {
      response.end(JSON.stringify({ projects: [project], total: 1 }));
    } else if (path === "/api/v1/memories/search") {
      response.end(JSON.stringify({ primary_memories: [old], linked_memories: [] }));
    } else if (path === "/api/v1/memories/42" && request.method === "GET") {
      response.end(JSON.stringify(old));
    } else if (path === "/api/v1/graph/memory/42?depth=1") {
      response.end(JSON.stringify({ center_memory_id: 42, edges: [] }));
    } else {
      if (request.method !== "GET") mutations.push(`${request.method} ${path}`);
      response.statusCode = 404;
      response.end("{}");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
  const client = new ApiForgetfulClient({ baseUrl });
  const root = await mkdtemp(join(tmpdir(), "pi-source-conflict-"));
  let closeSession: (() => Promise<void>) | undefined;
  t.after(async () => {
    try { await closeSession?.(); }
    finally {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    }
  });
  const cwd = join(root, "repo"), agentDir = join(root, "agent");
  await mkdir(cwd);
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await writeFile(join(cwd, "delivery.txt"), sourceText);
  const git = promisify(execFile);
  await git("git", ["init", "-q", cwd]);
  await git("git", ["-C", cwd, "remote", "add", "origin",
    "https://github.com/test/source-conflict.git"]);
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: baseUrl, model: "source-conflict/memory", capture_mode: "auto", enabled: true,
  }));
  const settings = SettingsManager.create(cwd, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ compaction: { enabled: false }, retry: { enabled: false } });
  const manager = SessionManager.inMemory(cwd);
  manager.appendMessage({ role: "user", timestamp: 1, content: "Review delivery requirements." });
  const shared = manager.appendMessage(reply());
  const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  let inspectionId: string | undefined, extracted = false;
  const mainContexts: Context[] = [];
  const inspectionResults: unknown[] = [];
  runtime.registerProvider("source-conflict", {
    api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false, input: ["text"],
      contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
    streamSimple(model, context: Context) {
      const message = reply(model.id);
      let name: string | undefined, args: JsonObject | undefined;
      if (model.id === "main") {
        assert.deepEqual(providerTools(context).map(tool => tool.name), ["forgetful_recall_wait"]);
        mainContexts.push(structuredClone(context));
      } else if (model.id === "memory") {
        const tools = providerTools(context);
        name = tools[0]?.name;
        if (name === "submit_capture_candidates") {
          assert.deepEqual(tools.map((tool) => tool.name),
            ["submit_capture_candidates", "inspect_source", "read_capture_evidence"]);
          const inspected = context.messages.find((item) =>
            item.role === "toolResult" && item.toolName === "inspect_source");
          if (extracted) args = { candidates: [] };
          else if (!inspected) {
            name = "inspect_source";
            args = { path: "delivery.txt" };
          } else {
            assert.equal(inspected.role, "toolResult");
            assert.ok(Array.isArray(inspected.content));
            const text = inspected.content.filter((item) => item.type === "text")
              .map((item) => item.text).join("\n");
            const result = JSON.parse(text);
            inspectionResults.push(result);
            assert.equal(result.result.status, "ok");
            assert.equal(result.result.content, sourceText);
            const observedId = result.evidenceEntry.id;
            assert.equal(typeof observedId, "string");
            inspectionId = observedId;
            extracted = true;
            args = { candidates: [{ id: "delivery", title: "Delivery handover",
              content: sourceText.trim(), context: "Observed delivery requirement",
              keywords: ["delivery"], tags: [], evidenceType: "observation",
              sourceEntryIds: [observedId], sourceFiles: ["delivery.txt"] }] };
          }
        } else if (name === "submit_capture_decision") {
          assert.ok(inspectionId);
          args = { action: "escalate", conflictingMemoryId: old.id,
            reason: "Confirm the changed handover requirement", sourceEntryIds: [inspectionId],
            oldClaim: "Use a paper handover.", newClaim: sourceText.trim() };
        } else if (name === "submit_recall_plan") {
          args = { search: false, queries: [], queryIntent: "", entities: [] };
        } else {
          assert.equal(name, undefined, `Unexpected private tool ${name}`);
          message.content = [{ type: "text", text: "No recall required." }];
        }
      }
      if (name) {
        message.content = [{ type: "toolCall", id: `call-${Date.now()}`, name, arguments: args! }];
        message.stopReason = "toolUse";
      }
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
      stream.end(message);
      return stream;
    },
  });
  const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager: settings,
    noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
    extensionFactories: [createForgetfulExtension({ agentDir })] });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const { session } = await createAgentSession({ cwd, agentDir, modelRuntime: runtime,
    model: runtime.getModel("source-conflict", "main"), settingsManager: settings,
    sessionManager: manager, resourceLoader: loader, noTools: "builtin" });
  closeSession = async () => {
    try {
      await session.abort();
      await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
    } finally { session.dispose(); }
  };
  await session.bindExtensions({});
  // Settle project discovery before exercising capture against the mapped project.
  await session.prompt("/forgetful status");
  const queue = async () => {
    const directory = join(agentDir, "forgetful/queues");
    const names = await readdir(directory);
    assert.equal(names.length, 1);
    return new DurableQueueStore({ directory: join(directory, names[0]!) });
  };
  return { client, old, cwd, agentDir, settings, session, manager, shared, mainContexts, queue,
    inspectionResults, mutations, inspectionId: () => inspectionId,
    async waitPendingConflict() {
      let id = "";
      await eventually(async () => {
        const store = await queue();
        const conflicts = await store.pendingConflicts();
        assert.equal(conflicts.length, 1, "source inspection should produce one pending conflict");
        const conflict = conflicts[0]!;
        assert.ok(conflict.jobId);
        assert.equal((await store.getJob(conflict.jobId))?.status, "complete");
        id = conflict.id;
      });
      return id;
    },
  };
}

test("Pi hands off a conflict supported by actual source inspection", { timeout: 15_000 },
  async (t) => {
    // Arrange: real Pi, private source reading and disk queue; controlled external services.
    const f = await fixture(t);

    // Act: extraction inspects the source; the next user turn receives the pending conflict.
    await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
    const id = await f.waitPendingConflict();
    const queue = await f.queue();
    const receipt = await queue.getConflict(id);
    assert.equal(receipt?.status, "pending", "capture alone does not hand the conflict to Pi");
    assert.deepEqual(receipt?.sourceEntryIds, [f.inspectionId()]);
    assert.ok(receipt?.jobId);
    const evidence = (await queue.getJob(receipt.jobId))?.snapshot.entries;
    assert.ok(evidence?.some((entry) => entry.id === f.inspectionId() &&
      entry.role === "toolResult" && entry.toolName === "inspect_source"));
    assert.equal(notices(f.manager).length, 0);
    assert.equal(f.mainContexts.length, 1, "a pending conflict must not wake the main agent");
    await f.session.prompt("Explain the handover conflict so I can handle it externally.");

    // Assert: private source evidence is handed over without inventing a Pi journal entry.
    assert.equal(f.inspectionResults.length, 1);
    assert.ok(f.inspectionId());
    assert.equal(f.manager.getEntries().some((entry) => entry.id === f.inspectionId()), false);
    const saved = notices(f.manager);
    assert.equal(saved.length, 1);
    assert.match(JSON.stringify(saved[0]), /signed digital handover/);
    assert.match(JSON.stringify(saved[0]), /paper handover/);
    assert.ok(JSON.stringify(saved[0]).includes(f.inspectionId()!));
    const delivered = JSON.stringify(f.mainContexts.at(-1)?.messages);
    assert.match(delivered, /signed digital handover/);
    assert.match(delivered, /paper handover/);
    assert.ok(delivered.includes(f.inspectionId()!));
    await eventually(async () => {
      const handedOff = await queue.getConflict(id);
      assert.equal(handedOff?.status, "handed_off");
      assert.equal(handedOff?.handoffEntryId, saved[0]!.id);
      assert.deepEqual((await queue.getJob(receipt.jobId!))?.snapshot.entries, []);
    });
    assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
    assert.deepEqual(f.mutations, []);
    assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
  });

for (const invalid of ["invented inspection", "foreign inspection", "later journal"] as const) {
  test(`Pi refuses a conflict handoff with evidence from ${invalid}`, { timeout: 15_000 },
    async (t) => {
      // Arrange: actual source inspection, with an unowned source ID in its pending conflict.
      const f = await fixture(t);
      await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
      const id = await f.waitPendingConflict();
      const queue = await f.queue();
      const original = await queue.getConflict(id);
      assert.ok(original?.jobId);
      const job = await queue.getJob(original.jobId);
      assert.ok(job);
      let invalidId = "inspection:invented";
      if (invalid === "foreign inspection") {
        const foreignQueue = new DurableQueueStore({
          filePath: queue.filePath, ...original.binding,
        });
        const foreign = await foreignQueue.enqueue({ ...job.snapshot, id: "foreign-snapshot",
          finalEntryId: "foreign-final",
          context: { ...job.snapshot.context, sessionId: "foreign" } });
        const observed = job.snapshot.entries.find((entry) => entry.id === f.inspectionId());
        assert.ok(observed);
        invalidId = "inspection:foreign";
        await foreignQueue.checkpoint(foreign.jobId, {
          inspectionEntries: [{ ...observed, id: invalidId }], status: "paused",
        });
      } else if (invalid === "later journal") {
        invalidId = f.manager.appendMessage({ role: "user", timestamp: Date.now(),
          content: "This entry was never part of the originating capture snapshot." });
      }
      const altered = await queue.updateConflict(id, { sourceEntryIds: [invalidId],
        // Persisted provenance cannot substitute for membership in the originating snapshot.
        ...{ verifiedOrigin: {
          entryId: job.snapshot.leafEntryId, inspectionEntryIds: [invalidId],
        } },
      });

      // Act: the next normal user turn asks for a handoff through the real Pi hooks.
      await f.session.prompt("Explain any pending handover conflict.");

      // Assert: invalid provenance neither delivers a notice nor releases its original evidence.
      assert.equal(notices(f.manager).length, 0);
      assert.doesNotMatch(JSON.stringify(f.mainContexts.at(-1)?.messages), /paper handover/);
      assert.deepEqual(await queue.getConflict(id), altered);
      assert.deepEqual((await queue.getJob(original.jobId))?.snapshot, job.snapshot);
      assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
      assert.deepEqual(f.mutations, []);
      assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
    });
}

test("Pi retains source-conflict evidence across reload without handing it to a sibling branch",
  { timeout: 15_000 }, async (t) => {
    // Arrange: an inspected-source conflict below a shared journal entry, not yet delivered.
    const f = await fixture(t);
    await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
    const id = await f.waitPendingConflict();
    const queue = await f.queue();
    const receipt = await queue.getConflict(id);
    assert.ok(receipt?.jobId);
    const original = await queue.getJob(receipt.jobId);
    assert.ok(original?.snapshot.leafEntryId);

    // Act: reopen, switch to a sibling, and settle a turn there.
    await f.session.reload();
    assert.deepEqual(await queue.getConflict(id), receipt);
    await f.session.navigateTree(f.shared, { summarize: false });
    await f.session.prompt("Continue unrelated work on this sibling branch.");
    await f.session.prompt("/forgetful status");

    // Assert: neither the notice nor private evidence belongs to this sibling conversation.
    assert.equal(notices(f.manager).length, 0,
      "a pending source-conflict notice must not be saved in a sibling conversation");
    assert.doesNotMatch(JSON.stringify(f.mainContexts.at(-1)?.messages), /paper handover/);
    assert.deepEqual(await queue.getConflict(id), receipt);
    assert.deepEqual((await queue.getJob(receipt.jobId))?.snapshot, original.snapshot);
    assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
    assert.deepEqual(f.mutations, []);

    // The original branch still owns the inspection and its unresolved memory conflict.
    await f.session.navigateTree(original.snapshot.leafEntryId, { summarize: false });
    await f.session.prompt("Review the original inspected handover requirement.");
    assert.equal(notices(f.manager).length, 1);
    assert.match(JSON.stringify(f.mainContexts.at(-1)?.messages), /signed digital handover/);
    assert.match(JSON.stringify(f.mainContexts.at(-1)?.messages), /paper handover/);
    await eventually(async () => {
      assert.equal((await queue.getConflict(id))?.status, "handed_off");
      assert.deepEqual((await queue.getJob(receipt.jobId!))?.snapshot.entries, []);
    });
    assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
    assert.deepEqual(f.mutations, []);
    assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
  });
