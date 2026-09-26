import assert from "node:assert/strict";
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
  createAssistantMessageEventStream, type AssistantMessage, type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { decodeProviderContext } from "./provider-context.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const sourceText = "Delivery requires a signed digital handover.\n";

function reply(model = "main"): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "source-conflict", model,
    content: [{ type: "text", text: "Acknowledged." }], stopReason: "stop", timestamp: Date.now(),
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

async function bounded<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(label)), 5_000);
    })]);
  } finally { clearTimeout(timer); }
}

async function fixture(t: TestContext) {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Delivery", repo_name: "test/source-conflict",
    description: "Source inspection conflict ownership" });
  const old = await client.create({ title: "Delivery handover", content: "Use a paper handover.",
    context: "Previous requirement", keywords: ["delivery"], tags: [], project_ids: [project.id] });
  const root = await mkdtemp(join(tmpdir(), "pi-source-conflict-"));
  let closeSession: (() => Promise<void>) | undefined;
  t.after(async () => {
    try { await closeSession?.(); }
    finally { await rm(root, { recursive: true, force: true }); }
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
  let resolution: Record<string, unknown> | undefined;
  let notifyHandoff!: (id: string) => void;
  const handoff = new Promise<string>((resolve) => { notifyHandoff = resolve; });
  const handoffs: string[] = [];
  const inspectionResults: unknown[] = [];
  runtime.registerProvider("source-conflict", {
    api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false, input: ["text"],
      contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
    streamSimple(model, context: Context) {
      const message = reply(model.id);
      let name: string | undefined, args: Record<string, unknown> | undefined;
      if (model.id === "main" && resolution) {
        name = "forgetful_resolve";
        args = resolution;
        resolution = undefined;
      } else if (model.id === "memory") {
        name = context.tools?.[0]?.name;
        if (name === "submit_capture_candidates") {
          assert.deepEqual(context.tools?.map((tool) => tool.name),
            ["submit_capture_candidates", "inspect_source"]);
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
            inspectionId = result.evidenceEntry.id;
            extracted = true;
            args = { candidates: [{ id: "delivery", title: "Delivery handover",
              content: sourceText.trim(), context: "Observed delivery requirement",
              keywords: ["delivery"], tags: [], evidenceType: "observation",
              sourceEntryIds: [inspectionId], sourceFiles: ["delivery.txt"] }] };
          }
        } else if (name === "submit_capture_decision") {
          args = { action: "escalate", conflictingMemoryId: old.id,
            reason: "Confirm the changed handover requirement", sourceEntryIds: [inspectionId],
            oldClaim: "Use a paper handover.", newClaim: sourceText.trim() };
        } else if (name === "submit_memory_revision") {
          const { input } = decodeProviderContext(context);
          assert.ok(input.evidenceEntryIds.includes(inspectionId));
          args = { title: "Delivery handover", content: sourceText.trim(),
            context: "Confirmed delivery requirement", keywords: ["delivery"], tags: [],
            importance: 7, sourceEntryIds: [inspectionId], documentIds: [], codeArtifactIds: [],
            entityIds: [], memoryIds: [], fileIds: [], sourceFiles: ["delivery.txt"] };
        } else {
          assert.equal(name, undefined, `Unexpected private tool ${name}`);
          message.content = [{ type: "text", text: JSON.stringify({ search: false, queries: [],
            entities: [], queryIntent: "No recall required" }) }];
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
    extensionFactories: [(pi) => {
      const send = pi.sendMessage.bind(pi);
      pi.sendMessage = (message, options) => {
        send(message, options);
        if (message.customType === "forgetful_conflict") {
          const ids = (message.details as { conflictIds: string[] }).conflictIds;
          handoffs.push(...ids);
          notifyHandoff(ids[0]!);
        }
      };
      return createForgetfulExtension({ agentDir })(pi);
    }] });
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
  return { client, old, cwd, agentDir, settings, session, manager, shared, handoffs,
    inspectionResults, inspectionId: () => inspectionId,
    waitHandoff: () => bounded(handoff, "Inspected-source conflict did not reach Pi handoff"),
    async queue() {
      const directory = join(agentDir, "forgetful/queues");
      const names = await readdir(directory);
      assert.equal(names.length, 1);
      return new DurableQueueStore({ directory: join(directory, names[0]!) });
    },
    async resolve(id: string, evidenceEntryIds = [inspectionId!]) {
      resolution = { conflict_id: id, action: "supersede",
        reason: "Use the inspected delivery requirement.", evidenceEntryIds };
      await session.prompt(
        "Resolve the pending handover conflict using the inspected requirement.",
      );
      const entry = manager.getBranch().findLast((item) => item.type === "message" &&
        item.message.role === "toolResult" && item.message.toolName === "forgetful_resolve");
      assert.ok(entry?.type === "message" && entry.message.role === "toolResult");
      return entry.message;
    },
  };
}

test("Pi hands off and resolves a conflict supported by actual source inspection", realOptions,
  async (t) => {
    // Arrange: actual source reading, Pi tools and capture, with an isolated REST predecessor.
    const f = await fixture(t);

    // Act: extraction reads the source; escalation reaches Pi; its public resolve tool executes.
    await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
    const id = await f.waitHandoff().catch(async (error) => {
      assert.ok(f.inspectionId(), "The real source read must have completed before handoff");
      const queue = await f.queue();
      const pending = await queue.pendingConflicts();
      assert.equal(pending.length, 1, JSON.stringify(await queue.listJobs()));
      assert.deepEqual(pending[0]!.sourceEntryIds, [f.inspectionId()]);
      throw error;
    });
    const result = await f.resolve(id);

    // Assert: private evidence is usable without being invented as a Pi journal entry.
    assert.equal(f.inspectionResults.length, 1);
    assert.ok(f.inspectionId());
    assert.equal(f.manager.getEntries().some((entry) => entry.id === f.inspectionId()), false);
    assert.equal(result.isError, false, JSON.stringify(result));
    const predecessor = await f.client.get(f.old.id);
    assert.equal(predecessor.is_obsolete, true);
    assert.ok(predecessor.superseded_by);
    assert.equal((await f.client.get(predecessor.superseded_by)).content, sourceText.trim());
    assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
  });

test("Pi keeps source-conflict receipts across reload and refuses a sibling branch", realOptions,
  async (t) => {
    // Arrange: one durable inspected-source conflict on a branch below a shared journal entry.
    const f = await fixture(t);
    await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
    const id = await f.waitHandoff();
    const queue = await f.queue();
    const receipt = await queue.getConflict(id);
    assert.ok(receipt?.jobId);
    const original = await queue.getJob(receipt.jobId);
    assert.ok(original?.snapshot.leafEntryId);

    // Act: reload the extension, visit a sibling, then return to the original pinned entry.
    await f.session.reload();
    assert.deepEqual(await queue.getConflict(id), receipt);
    await f.session.navigateTree(f.shared, { summarize: false });
    const denied = await f.resolve(id);

    // Assert: real inspection is insufficient without the originating Pi branch anchor.
    assert.equal(denied.isError, true, JSON.stringify(denied));
    assert.match(JSON.stringify(denied.content), /No pending Forgetful conflict can be resolved/);
    assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
    assert.deepEqual(await queue.getConflict(id), receipt);

    await f.session.navigateTree(original.snapshot.leafEntryId, { summarize: false });
    const resolved = await f.resolve(id);
    assert.equal(resolved.isError, false, JSON.stringify(resolved));
    assert.equal((await f.client.get(f.old.id)).is_obsolete, true);
    assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
  });

for (const invalid of ["invented inspection", "foreign inspection", "later journal"] as const) {
  test(`Pi refuses conflict evidence from ${invalid}`, realOptions, async (t) => {
    // Arrange: an actual inspection and conflict; replace its source ID through the queue port.
    const f = await fixture(t);
    await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
    const id = await f.waitHandoff();
    const queue = await f.queue();
    const original = await queue.getConflict(id);
    assert.ok(original?.jobId);
    const job = await queue.getJob(original.jobId);
    assert.ok(job);
    let invalidId = "inspection:invented";
    if (invalid === "foreign inspection") {
      const foreignQueue = new DurableQueueStore({ filePath: queue.filePath, ...original.binding });
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
      // A serialized claim of verification must never substitute for snapshot membership.
      ...{ verifiedOrigin: { entryId: job.snapshot.leafEntryId, inspectionEntryIds: [invalidId] } },
    });

    // Act: use the real foreground Pi tool, supplying the selected but unowned evidence ID.
    const result = await f.resolve(id, [invalidId]);

    // Assert: prefixes, foreign observations and later journal IDs do not grant ownership.
    assert.equal(result.isError, true, JSON.stringify(result));
    assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
    assert.deepEqual(await queue.getConflict(id), altered);
    assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
  });
}

test("Pi source-conflict resolution respects revoked project trust", realOptions, async (t) => {
  // Arrange: trust permitted the original read, but is revoked before conflict resolution.
  const f = await fixture(t);
  await f.session.prompt("Inspect delivery.txt and record the handover requirement.");
  const id = await f.waitHandoff();
  const queue = await f.queue();
  const receipt = await queue.getConflict(id);
  f.settings.setProjectTrusted(false);

  // Act.
  const result = await f.resolve(id);

  // Assert: verified provenance grants no new write authority.
  assert.equal(result.isError, true, JSON.stringify(result));
  assert.equal((await f.client.get(f.old.id)).is_obsolete, false);
  assert.deepEqual(await queue.getConflict(id), receipt);
  assert.equal(await readFile(join(f.cwd, "delivery.txt"), "utf8"), sourceText);
});
