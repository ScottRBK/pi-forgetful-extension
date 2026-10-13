import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CaptureService } from "../src/capture.ts";
import { ApiForgetfulClient, ForgetfulHttpError, ForgetfulSchemaError } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";
import { decodeProviderContext } from "./provider-context.ts";

async function fixture(
  t: import("node:test").TestContext, partial = false, autoLinks = "0",
) {
  const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: autoLinks });
  const setup = new ApiForgetfulClient({ baseUrl });
  const project = await setup.createProject({ name: "Resolution", description: "Explicit choices",
    repo_name: "test/resolution" });
  const foreign = await setup.createProject({ name: "Elsewhere", description: "Foreign scope",
    repo_name: "test/elsewhere" });
  const documents = [], artifacts = [], entities = [], memories = [];
  for (let i = 0; i < 2; i++) {
    documents.push(await setup.knowledge.createDocument({ title: `Reference ${i}`,
      description: "Reference material", content: `Detailed evidence ${i}.`, tags: [],
      project_id: project.id }));
    artifacts.push(await setup.knowledge.createCodeArtifact({ title: `Code ${i}`,
      description: "Example code", code: `const value = ${i};`, language: "javascript",
      tags: [], project_id: project.id }));
    entities.push(await setup.knowledge.createEntity({ name: `Component ${i}`,
      entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] }));
    memories.push(await setup.create({ title: `Related ${i}`, content: `Independent fact ${i}.`,
      context: "Existing evidence", keywords: [], tags: [], project_ids: [project.id] }));
  }
  const old = await setup.create({ title: "Database", content: "The database is PostgreSQL.",
    context: "An earlier assertion", keywords: ["database"], tags: [], project_ids: [project.id],
    document_ids: documents.map((item) => item.id),
    code_artifact_ids: artifacts.map((item) => item.id), source_files: ["obsolete.ts"],
    source_repo: "old/repo", source_url: "https://example.com/old", encoding_version: "old" });
  await setup.knowledge.linkMemories(old.id, memories.map((item) => item.id));
  for (const entity of entities) await setup.knowledge.linkEntityMemory(entity.id, old.id);
  const directory = await mkdtemp(join(tmpdir(), "resolution-execution-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "resolution" });
  const candidate = { id: "candidate", title: "Database", content: "The database uses SQLite.",
    context: "New assertion", keywords: ["sqlite"], tags: [], sourceEntryIds: ["original"],
    evidenceType: "userDecision", sourceFiles: ["candidate.ts"] };
  const now = new Date().toISOString();
  const conflict = await queue.addConflict({ id: "conflict", candidateId: candidate.id,
    binding: { instanceId: "resolution" }, sessionId: "session", branchId: "branch",
    context: { cwd: "/repo", repoName: "test/resolution", sessionId: "session", branchId: "branch",
      project }, destinationProjectId: project.id, oldMemoryId: old.id,
    oldMemory: await setup.get(old.id), candidate, partial,
    sourceEntryIds: ["original"], evidence: ["The database uses SQLite."], reason: "Clarify.",
    status: "pending", createdAt: now, updatedAt: now });
  const output = { title: "Database", content: "The database has always been SQLite.",
    context: "The PostgreSQL statement was incorrect; no migration occurred.",
    keywords: ["sqlite"], tags: [], importance: 8, sourceEntryIds: ["correction"],
    documentIds: [documents[1]!.id], codeArtifactIds: [artifacts[1]!.id],
    entityIds: [entities[1]!.id], memoryIds: [memories[1]!.id], fileIds: [], sourceFiles: [] };
  const state = { calls: 0, inputs: [] as any[], writes: [] as string[],
    reply: structuredClone(output) as Record<string, unknown>,
    onRequest: undefined as undefined |
      ((url: string, init?: RequestInit) => Promise<Response | undefined>) };
  const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
    const response = await state.onRequest?.(String(url), init);
    if (["POST", "PUT", "DELETE"].includes(init?.method ?? ""))
      state.writes.push(`${init!.method} ${new URL(String(url)).pathname}`);
    return response ?? fetch(url, init);
  } });
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 8_000,
      contextWindow: 200_000, input: ["text"] }) as any,
    complete: async (_model, context) => {
      state.calls++;
      state.inputs.push(decodeProviderContext(context).input);
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: "revision", name: context.tools![0]!.name,
          arguments: state.reply }], stopReason: "toolUse", timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } } as any;
    },
  }, { provider: "test", id: "memory" });
  const service = new CaptureService({ queue, client, model, instanceId: "resolution" });
  const input = { action: "supersede" as const, evidenceEntryIds: ["correction"],
    additionalEntries: [{ id: "correction", role: "user" as const,
      text: "Correction: the database has always been SQLite. No migration happened." }] };
  return { baseUrl, setup, project, foreign, documents, artifacts, entities, memories, old,
    directory, queue, conflict, state, client, model, service, input, output };
}

for (const partial of [false, true]) {
  for (const selection of ["subset", "empty"] as const) {
    test(`resolution executes correction and ${selection} selections; partial=${partial}`,
      realOptions, async (t) => {
        const f = await fixture(t, partial);
        if (selection === "empty") Object.assign(f.state.reply,
          { documentIds: [], codeArtifactIds: [], entityIds: [], memoryIds: [] });
        await f.setup.knowledge.updateMemory(f.old.id,
          { content: "A corrected current assertion." });

        const result = await f.service.resolveConflict(f.conflict.id, f.input);

        assert.equal(result.status, "resolved");
        assert.equal(f.state.calls, 1);
        assert.equal(f.state.inputs[0].oldMemory.content, "A corrected current assertion.");
        assert.deepEqual(f.state.inputs[0].additionalEntries, f.input.additionalEntries);
        assert.equal(f.state.inputs[0].resources.documents[1].content, "Detailed evidence 1.");
        const saved = await f.setup.get(result.conflict.replacementId!);
        assert.equal(saved.content, f.output.content);
        assert.ok(saved.context.startsWith(f.output.context));
        assert.deepEqual(saved.document_ids, f.state.reply.documentIds);
        assert.deepEqual(saved.code_artifact_ids, f.state.reply.codeArtifactIds);
        assert.deepEqual(saved.linked_memory_ids, f.state.reply.memoryIds);
        assert.deepEqual(await f.setup.getMemoryEntityIds(saved.id), f.state.reply.entityIds);
        assert.deepEqual(saved.source_files ?? [], []);
        assert.equal(saved.source_url ?? null, null);
        assert.equal(saved.source_repo ?? null, null);
        assert.equal(saved.encoding_version ?? null, null);
        assert.equal((await f.setup.get(f.old.id)).is_obsolete, true);
        assert.equal(result.conflict.replacement!.planVersion, 1);
      });
  }
}

test("restart preserves receipts and external edits while uncertain supersession blocks replay",
  realOptions, async (t) => {
    const f = await fixture(t, true);
    f.state.onRequest = async (url, init) => {
      if (init?.method === "DELETE" && url.endsWith(`/memories/${f.old.id}`))
        return new Response("Supersession service unavailable: raw diagnostic", { status: 503 });
      return undefined;
    };
    let originalError: unknown;
    await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input), (error) => {
      originalError = error;
      return true;
    });
    const pending = (await f.queue.getConflict(f.conflict.id))!;
    const replacementId = pending.replacementId!;
    assert.deepEqual(pending.replacement!.completedMemoryIds, f.output.memoryIds);
    assert.deepEqual(pending.replacement!.completedEntityIds, f.output.entityIds);
    await f.setup.knowledge.unlinkMemories!(replacementId, f.memories[1]!.id);
    const unlinked = await fetch(`${f.baseUrl}/entities/${f.entities[1]!.id}/memories/` +
      replacementId, { method: "DELETE" });
    assert.equal(unlinked.status, 200);
    await f.setup.knowledge.updateMemory(replacementId,
      { document_ids: [], content: "A subsequent writer edited the replacement." });
    const late = await f.setup.create({ title: "Late", content: "Later independent fact.",
      context: "External writer", keywords: [], tags: [], project_ids: [f.project.id] });
    await f.setup.knowledge.linkMemories(f.old.id, [late.id]);
    f.state.onRequest = undefined;
    f.state.writes.length = 0;
    const restarted = new CaptureService({
      queue: new DurableQueueStore({ directory: f.directory, instanceId: "resolution" }),
      client: f.client, model: f.model, instanceId: "resolution" });

    await assert.rejects(restarted.resolveConflict(f.conflict.id, f.input), /raw diagnostic/);

    const retained = (await f.queue.getConflict(f.conflict.id))!;
    assert.equal(retained.status, "pending");
    assert.equal(retained.supersession?.status, "started");
    assert.match(retained.uncertainWrite!, /raw diagnostic/);
    assert.deepEqual(retained.replacement!.completedMemoryIds, f.output.memoryIds);
    assert.deepEqual(retained.replacement!.completedEntityIds, f.output.entityIds);
    assert.equal(f.state.calls, 1);
    assert.deepEqual(f.state.writes, []);
    assert.equal((await f.setup.get(f.old.id)).is_obsolete, false);
    const saved = await f.setup.get(replacementId);
    assert.equal(saved.content, "A subsequent writer edited the replacement.");
    assert.deepEqual(saved.document_ids, []);
    assert.deepEqual(saved.linked_memory_ids, []);
    assert.deepEqual(await f.setup.getMemoryEntityIds(replacementId), []);
    // Check the raw error last so masking cannot hide a receipt/replay regression.
    assert.ok(originalError instanceof ForgetfulHttpError);
    assert.equal(originalError.status, 503);
    assert.equal(originalError.responseBody,
      "Supersession service unavailable: raw diagnostic");
    assert.ok(originalError.message.includes(originalError.responseBody));
  });

test("unknown create response retains its actual failure and never repeats creation", realOptions,
  async (t) => {
    const f = await fixture(t);
    let creates = 0, storedId = 0;
    f.state.onRequest = async (url, init) => {
      if (init?.method === "POST" && url.endsWith("/memories")) {
        creates++;
        storedId = (await f.setup.create(JSON.parse(init.body as string))).id;
        return new Response("Create committed but response failed: service diagnostic 987",
          { status: 503 });
      }
      return undefined;
    };
    await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input),
      /service diagnostic 987/);
    const restarted = new CaptureService({
      queue: new DurableQueueStore({ directory: f.directory, instanceId: "resolution" }),
      client: f.client, model: f.model, instanceId: "resolution" });
    await assert.rejects(restarted.resolveConflict(f.conflict.id, f.input),
      /service diagnostic 987/);
    assert.equal(creates, 1);
    assert.equal(f.state.calls, 1);
    assert.equal((await f.setup.get(storedId)).content, f.output.content);
    const pending = (await f.queue.getConflict(f.conflict.id))!;
    assert.equal(pending.status, "pending");
    assert.equal(pending.replacementId, undefined);
    assert.equal(pending.replacement!.creationAttempted, true);
  });

for (const blocked of ["foreign-argument", "document-moved", "off", "stop", "sync-gate",
  "both-endpoints-moved"] as const) {
  test(`explicit resolution respects permission and model-selected scope: ${blocked}`,
    realOptions, async (t) => {
    const f = await fixture(t);
    let writable = true, changed = false;
    if (blocked === "foreign-argument") {
      const foreign = await f.setup.knowledge.createDocument({ title: "Foreign",
        description: "Other project", content: "Foreign evidence", tags: [],
        project_id: f.foreign.id });
      f.state.reply.documentIds = [foreign.id];
    }
    if (blocked === "both-endpoints-moved") Object.assign(f.state.reply,
      { documentIds: [], codeArtifactIds: [], entityIds: [], memoryIds: [] });
    const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
      instanceId: "resolution", canWriteNow: () => writable,
      getMode: async () => {
        if (f.state.calls && blocked === "off") return "off" as const;
        if (f.state.calls && blocked === "stop") service.stop();
        if (f.state.calls && blocked === "sync-gate") writable = false;
        if (f.state.calls && blocked === "document-moved" && !changed) {
          changed = true;
          await f.setup.knowledge.updateDocument(f.documents[1]!.id,
            { project_id: f.foreign.id });
        }
        return "auto" as const;
      } });
    f.state.onRequest = async (url, init) => {
      if (f.state.calls && init?.method === "GET" && url.endsWith(`/memories/${f.old.id}`)) {
        if (blocked === "both-endpoints-moved" && !changed) {
          const saved = await f.queue.getConflict(f.conflict.id);
          if (saved!.replacementId) {
            changed = true;
            await f.setup.knowledge.updateMemory(f.old.id, { project_ids: [f.foreign.id] });
            await f.setup.knowledge.updateMemory(saved!.replacementId,
              { project_ids: [f.foreign.id] });
          }
        }
      }
      return undefined;
    };

    if (["off", "stop", "sync-gate"].includes(blocked)) {
      await assert.rejects(service.resolveConflict(f.conflict.id, f.input));
      assert.equal((await f.queue.getConflict(f.conflict.id))!.status, "pending");
      assert.equal((await f.setup.get(f.old.id)).is_obsolete, false);
      assert.deepEqual(f.state.writes, []);
    } else {
      const result = await service.resolveConflict(f.conflict.id, f.input);
      assert.equal(result.status, "resolved");
      const replacement = await f.setup.get(result.conflict.replacementId!);
      assert.deepEqual(replacement.document_ids, f.state.reply.documentIds);
      assert.equal((await f.setup.get(f.old.id)).superseded_by, replacement.id);
      if (blocked === "foreign-argument" || blocked === "document-moved") {
        const id = (f.state.reply.documentIds as number[])[0]!;
        assert.equal((await f.setup.knowledge.getDocument(id)).project_id, f.foreign.id);
      }
      if (blocked === "both-endpoints-moved") {
        assert.equal(changed, true);
        assert.deepEqual(replacement.project_ids, [f.foreign.id]);
        assert.deepEqual((await f.setup.get(f.old.id)).project_ids, [f.foreign.id]);
      }
    }
  });
}

test("legacy implicit receipt is reported without writes or private automatic revision",
  realOptions, async (t) => {
    const f = await fixture(t, true);
    const old = await f.setup.get(f.old.id);
    await f.queue.updateConflict(f.conflict.id, { replacement: {
      input: old, candidate: f.conflict.candidate, entityIds: [], memoryIds: [],
    } });

    await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input), /Legacy.*model review/);

    assert.equal(f.state.calls, 0);
    assert.deepEqual(f.state.writes, []);
    assert.equal((await f.queue.getConflict(f.conflict.id))!.status, "pending");
  });

for (const malformed of ["missing-selection", "coerced-id", "extra-field",
  "blank-title"] as const) {
  test(`revision preserves submitted fields for their owning validator: ${malformed}`,
    realOptions, async (t) => {
      const f = await fixture(t);
      if (malformed === "missing-selection") delete f.state.reply.documentIds;
      if (malformed === "coerced-id") f.state.reply.documentIds = [String(f.documents[1]!.id)];
      if (malformed === "extra-field") f.state.reply.preserveEverything = true;
      if (malformed === "blank-title") f.state.reply.title = " ";

      if (malformed === "extra-field") {
        // Unknown private-envelope fields are still rejected locally.
        await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input));
        assert.equal(f.state.calls, 3);
        assert.deepEqual(f.state.writes, []);
        assert.equal((await f.queue.getConflict(f.conflict.id))!.replacement, undefined);
      } else {
        // REST defaults omitted lists, accepts numeric-string IDs and whitespace titles.
        const result = await f.service.resolveConflict(f.conflict.id, f.input);
        assert.equal(result.status, "resolved");
        assert.equal(f.state.calls, 1);
        const saved = await f.setup.get(result.conflict.replacementId!);
        assert.deepEqual(saved.document_ids,
          malformed === "missing-selection" ? [] : f.output.documentIds);
        assert.equal(saved.title, malformed === "blank-title" ? " " : f.output.title);
        const submitted = result.conflict.replacement!.input;
        if (malformed === "coerced-id")
          assert.deepEqual(submitted.document_ids, [String(f.documents[1]!.id)]);
        if (malformed === "missing-selection") assert.equal(submitted.document_ids, undefined);
      }
    });
}

test("later content and edge changes do not replace the accepted model instruction", realOptions,
  async (t) => {
    const f = await fixture(t);
    let changed = false;
    Object.assign(f.state.reply, { sourceFiles: ["selected.ts"], sourceRepo: "chosen/repo",
      sourceUrl: "https://example.com/chosen", encodingVersion: "chosen" });
    const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
      instanceId: "resolution", getMode: async () => {
        if (f.state.calls && !changed) {
          changed = true;
          await f.setup.knowledge.updateMemory(f.old.id, { content: "New concurrent wording." });
          await f.setup.knowledge.updateDocument(f.documents[1]!.id,
            { content: "Concurrent document update in the same project." });
          await f.setup.knowledge.unlinkMemories!(f.old.id, f.memories[1]!.id);
        }
        return "auto" as const;
      } });

    const result = await service.resolveConflict(f.conflict.id, f.input);

    assert.equal(f.state.calls, 1);
    assert.equal(changed, true);
    const saved = await f.setup.get(result.conflict.replacementId!);
    assert.equal(saved.content, f.output.content);
    assert.deepEqual(saved.document_ids, f.output.documentIds);
    assert.deepEqual(saved.linked_memory_ids, f.output.memoryIds);
    assert.deepEqual(saved.source_files, ["selected.ts"]);
    assert.equal(saved.source_repo, "chosen/repo");
    assert.equal(saved.source_url, "https://example.com/chosen");
    assert.equal(saved.encoding_version, "chosen");
  });

test("create-owned automatic links are reported separately from explicit model selections",
  realOptions, async (t) => {
    const f = await fixture(t, false, "2");
    Object.assign(f.state.reply,
      { documentIds: [], codeArtifactIds: [], entityIds: [], memoryIds: [] });

    const result = await f.service.resolveConflict(f.conflict.id, f.input);

    const receipt = result.conflict.replacement!;
    assert.deepEqual(receipt.memoryIds, []);
    assert.ok(receipt.autoLinkedMemoryIds!.length > 0);
    const saved = await f.setup.get(result.conflict.replacementId!);
    assert.deepEqual(saved.linked_memory_ids!.sort(), receipt.autoLinkedMemoryIds!.sort());
    assert.ok(f.state.writes.every((write) => !write.includes("/links")));
  });

for (const selected of [false, true]) {
  test(`resolution selects existing file references explicitly; selected=${selected}`,
    realOptions, async (t) => {
      const f = await fixture(t);
      const response = await fetch(`${f.baseUrl}/files`, { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          filename: "existing.txt", description: "Existing test evidence", mime_type: "text/plain",
          data: Buffer.from("Existing reference contents").toString("base64"), tags: [],
          project_id: f.project.id,
        }) });
      assert.equal(response.status, 201);
      const file = await response.json() as { id: number };
      await f.setup.knowledge.updateMemory(f.old.id, { file_ids: [file.id] });
      f.state.reply.fileIds = selected ? [file.id] : [];

      const result = await f.service.resolveConflict(f.conflict.id, f.input);

      assert.equal(f.state.inputs[0].resources.files[0].description, "Existing test evidence");
      assert.equal(f.state.inputs[0].resources.files[0].data, undefined);
      assert.deepEqual((await f.setup.get(result.conflict.replacementId!)).file_ids,
        selected ? [file.id] : []);
      assert.ok(f.state.writes.every((write) => !write.includes("/files")));
    });
}

for (const selected of [false, true]) {
  test(`atomic-only adapter checks selected operation support before writes; selected=${selected}`,
    realOptions, async (t) => {
      const f = await fixture(t);
      Object.defineProperty(f.client, "knowledge", { value: undefined });
      Object.assign(f.state.reply, { documentIds: [], codeArtifactIds: [], entityIds: [],
        memoryIds: selected ? f.output.memoryIds : [] });
      const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
        instanceId: "resolution" });

      const result = service.resolveConflict(f.conflict.id, f.input);

      if (selected) {
        await assert.rejects(result, /require rich knowledge writes/);
        assert.deepEqual(f.state.writes, []);
      } else {
        assert.equal((await result).status, "resolved");
        assert.equal(f.state.writes.length, 2);
      }
      assert.equal(f.state.calls, 1);
    });
}

for (const choice of ["update", "create"] as const) {
  test(`changed correction returns to the model, which chooses ${choice}`,
    realOptions, async (t) => {
    const f = await fixture(t);
    f.state.onRequest = async (url, init) => init?.method === "DELETE" &&
      url.endsWith(`/memories/${f.old.id}`)
      ? new Response("Obsoletion rejected: original service detail", { status: 400 }) : undefined;
    await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input),
      /original service detail/);
    const prior = (await f.queue.getConflict(f.conflict.id))!;
    const priorId = prior.replacementId!;
    const priorMemory = await f.setup.get(priorId);
    await f.setup.knowledge.updateMemory(f.old.id,
      { content: "Fresh predecessor for second request." });
    const revised = { ...f.input, reason: "Use the corrected evidence instead.",
      additionalEntries: [{ ...f.input.additionalEntries[0]!,
        text: "Correction: SQLite is only for tests; production has always used MySQL." }] };
    f.state.reply = { ...f.output, content: "Tests use SQLite; production has always used MySQL.",
      documentIds: [f.documents[0]!.id], codeArtifactIds: [], sourceFiles: [],
      ...(choice === "update" ? { replacementMemoryId: priorId } : {}) };
    f.state.onRequest = undefined;
    f.state.writes.length = 0;
    const resumed = new CaptureService({ client: f.client, model: f.model, instanceId: "resolution",
      queue: new DurableQueueStore({ directory: f.directory, instanceId: "resolution" }) });

    const result = await resumed.resolveConflict(f.conflict.id, revised);

    assert.equal(f.state.calls, 2);
    assert.equal(f.state.inputs[1].oldMemory.content, "Fresh predecessor for second request.");
    assert.deepEqual(f.state.inputs[1].previous.memory, priorMemory);
    assert.deepEqual(f.state.inputs[1].previous.receipt.completedMemoryIds, f.output.memoryIds);
    assert.deepEqual(f.state.inputs[1].previous.receipt.completedEntityIds, f.output.entityIds);
    assert.match(f.state.inputs[1].previous.receipt.executionError, /original service detail/);
    const saved = await f.setup.get(result.conflict.replacementId!);
    assert.equal(saved.content, f.state.reply.content);
    assert.deepEqual(saved.document_ids, [f.documents[0]!.id]);
    assert.deepEqual(saved.code_artifact_ids, []);
    if (choice === "update") {
      assert.equal(saved.id, priorId);
      assert.match(f.state.writes[0]!, new RegExp(`^PUT .*/memories/${priorId}$`));
      assert.ok(f.state.writes.every((write) => !/^POST .*\/memories$/.test(write)));
    } else {
      assert.notEqual(saved.id, priorId);
      assert.equal((await f.setup.get(priorId)).content, priorMemory.content);
      assert.equal((await f.setup.get(priorId)).is_obsolete, false);
    }
    assert.equal(result.conflict.replacement!.request!.reason, revised.reason);
    assert.deepEqual(result.conflict.replacement!.request!.selectedAdditionalEntries,
      revised.additionalEntries);
  });
}

test("model may replace an obsolete predecessor without a returned supersession ID", realOptions,
  async (t) => {
    const f = await fixture(t);
    await f.setup.supersede(f.old.id, f.memories[0]!.id, "Existing obsoletion");
    f.state.onRequest = async (url, init) => {
      if (init?.method === "GET" && url.endsWith(`/memories/${f.old.id}`)) {
        const response = await fetch(url, init);
        const memory = await response.json() as Record<string, unknown>;
        assert.equal(memory.is_obsolete, true);
        // This nullable field may be omitted by an adapter. It is not a known replacement ID.
        delete memory.superseded_by;
        return new Response(JSON.stringify(memory), { status: 200 });
      }
      return undefined;
    };

    const result = await f.service.resolveConflict(f.conflict.id, f.input);
    assert.equal(result.status, "resolved");
    assert.equal(f.state.calls, 1);
    assert.equal((await f.setup.get(result.conflict.replacementId!)).content, f.output.content);
    const response = await fetch(`${f.baseUrl}/memories/${f.old.id}`);
    assert.equal(response.status, 200);
    assert.equal((await response.json() as { superseded_by: number }).superseded_by,
      result.conflict.replacementId);
  });

async function pendingReplacement(f: Awaited<ReturnType<typeof fixture>>) {
  f.state.onRequest = async (url, init) => init?.method === "DELETE" &&
    url.endsWith(`/memories/${f.old.id}`)
    ? new Response("Pending obsoletion: service failure", { status: 400 }) : undefined;
  await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input), /service failure/);
  return (await f.queue.getConflict(f.conflict.id))!;
}

for (const field of ["reason", "text", "evidence-id", "raw-whitespace"] as const) {
  test(`resolution request comparison detects changed ${field}`, realOptions, async (t) => {
    const f = await fixture(t);
    const prior = await pendingReplacement(f);
    const next = { ...f.input, reason: undefined as string | undefined,
      additionalEntries: f.input.additionalEntries.map((entry) => ({ ...entry })) };
    if (field === "reason") next.reason = "A different explicit reason.";
    if (field === "text") next.additionalEntries[0]!.text = "A different supplied correction.";
    if (field === "evidence-id") {
      next.evidenceEntryIds = ["second-correction"];
      next.additionalEntries[0]!.id = "second-correction";
    }
    if (field === "raw-whitespace") next.reason = " ";
    f.state.reply = { ...f.output, replacementMemoryId: prior.replacementId,
      sourceEntryIds: next.evidenceEntryIds };
    f.state.onRequest = undefined;

    const result = await f.service.resolveConflict(f.conflict.id, next);

    assert.equal(f.state.calls, 2);
    assert.notEqual(result.conflict.replacement!.requestKey, prior.replacement!.requestKey);
    assert.deepEqual(result.conflict.replacement!.request!.evidenceEntryIds, next.evidenceEntryIds);
    assert.deepEqual(result.conflict.replacement!.request!.selectedAdditionalEntries,
      next.additionalEntries);
    if (field === "raw-whitespace") {
      const receipt = result.conflict.replacement as { requestPayload?: string };
      assert.equal(JSON.parse(receipt.requestPayload ?? "{}").reason, " ");
    }
  });
}

test("an unbound explicit receipt goes back to the model instead of borrowing current evidence",
  realOptions, async (t) => {
    const f = await fixture(t);
    const prior = await pendingReplacement(f);
    await f.queue.updateConflict(f.conflict.id,
      { replacement: { ...prior.replacement!, requestKey: undefined, request: undefined } });
    f.state.reply = { ...f.output, replacementMemoryId: prior.replacementId };
    f.state.onRequest = undefined;

    await f.service.resolveConflict(f.conflict.id, f.input);

    assert.equal(f.state.calls, 2);
    assert.ok((await f.queue.getConflict(f.conflict.id))!.replacement!.requestKey);
  });

test("unchanged revised request skips a completed update and links after external removals",
  realOptions, async (t) => {
    const f = await fixture(t);
    const prior = await pendingReplacement(f);
    const next = { ...f.input, reason: "Update this replacement using the new instruction." };
    f.state.reply = { ...f.output, replacementMemoryId: prior.replacementId,
      content: "The model explicitly revised this complete fact.",
      memoryIds: [f.memories[0]!.id], entityIds: [f.entities[0]!.id] };
    await assert.rejects(f.service.resolveConflict(f.conflict.id, next), /service failure/);
    const updated = (await f.queue.getConflict(f.conflict.id))!;
    assert.equal(updated.replacement!.updateComplete, true);
    assert.deepEqual(updated.replacement!.completedMemoryIds, [f.memories[0]!.id]);
    await f.setup.knowledge.updateMemory(prior.replacementId!,
      { content: "External content after successful update.", document_ids: [] });
    await f.setup.knowledge.unlinkMemories!(prior.replacementId!, f.memories[0]!.id);
    f.state.writes.length = 0;
    f.state.onRequest = undefined;
    const restarted = new CaptureService({ client: f.client, model: f.model,
      instanceId: "resolution",
      queue: new DurableQueueStore({ directory: f.directory, instanceId: "resolution" }) });

    await restarted.resolveConflict(f.conflict.id, structuredClone(next));

    assert.equal(f.state.calls, 2);
    assert.deepEqual(f.state.writes, [`DELETE /api/v1/memories/${f.old.id}`]);
    const stored = await f.setup.get(prior.replacementId!);
    assert.equal(stored.content, "External content after successful update.");
    assert.deepEqual(stored.document_ids, []);
    assert.ok(!stored.linked_memory_ids!.includes(f.memories[0]!.id));
  });

for (const denial of ["target-scope", "attachment-scope", "off", "stop", "sync-gate"] as const) {
  test(`revised replacement respects permission and model-selected scope: ${denial}`,
    realOptions, async (t) => {
      const f = await fixture(t);
      const prior = await pendingReplacement(f);
      f.state.reply = { ...f.output, replacementMemoryId: prior.replacementId,
        documentIds: [f.documents[0]!.id], content: "A newly instructed replacement." };
      f.state.writes.length = 0;
      let changed = false, writable = true;
      const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
        instanceId: "resolution", canWriteNow: () => writable, getMode: async () => {
          if (f.state.calls === 2 && denial === "stop") service.stop();
          if (f.state.calls === 2 && denial === "sync-gate") writable = false;
          if (f.state.calls === 2 && !changed) {
            changed = true;
            if (denial === "target-scope")
              await f.setup.knowledge.updateMemory(prior.replacementId!,
                { project_ids: [f.foreign.id] });
            if (denial === "attachment-scope")
              await f.setup.knowledge.updateDocument(f.documents[0]!.id,
                { project_id: f.foreign.id });
          }
          return denial === "off" && f.state.calls === 2 ? "off" as const : "auto" as const;
        } });
      f.state.onRequest = undefined;
      const result = service.resolveConflict(f.conflict.id,
        { ...f.input, reason: "Use the revised request." });
      if (["off", "stop", "sync-gate"].includes(denial)) {
        await assert.rejects(result);
        assert.deepEqual(f.state.writes, []);
        assert.equal((await f.queue.getConflict(f.conflict.id))!.status, "pending");
        assert.equal((await f.setup.get(prior.replacementId!)).content, f.output.content);
      } else {
        assert.equal((await result).status, "resolved");
        const saved = await f.setup.get(prior.replacementId!);
        assert.equal(saved.content, "A newly instructed replacement.");
        assert.deepEqual(saved.document_ids, [f.documents[0]!.id]);
        if (denial === "target-scope")
          assert.deepEqual(saved.project_ids, [f.project.id]);
        if (denial === "attachment-scope")
          assert.equal((await f.setup.knowledge.getDocument(f.documents[0]!.id)).project_id,
            f.foreign.id);
      }
      assert.equal(f.state.calls, 2);
    });
}

for (const invalid of ["other-id", "self-link"] as const) {
  test(`model-selected update checks the actual server outcome: ${invalid}`,
    realOptions, async (t) => {
      const f = await fixture(t);
      const prior = await pendingReplacement(f);
      f.state.reply = { ...f.output,
        replacementMemoryId: invalid === "other-id" ? f.memories[0]!.id : prior.replacementId,
        ...(invalid === "self-link" ? { memoryIds: [prior.replacementId] } : {}) };
      let linkResponse: { status: number; body: unknown } | undefined;
      f.state.onRequest = async (url, init) => {
        if (init?.method === "POST" && url.endsWith(`/memories/${prior.replacementId}/links`)) {
          const response = await fetch(url, init);
          linkResponse = { status: response.status, body: await response.clone().json() };
          return response;
        }
        return undefined;
      };
      f.state.writes.length = 0;

      const result = f.service.resolveConflict(f.conflict.id,
        { ...f.input, reason: "A new explicit instruction." });
      if (invalid === "other-id") {
        const resolved = await result;
        assert.equal(resolved.status, "resolved");
        assert.equal(resolved.conflict.replacementId, f.memories[0]!.id);
        assert.equal((await f.setup.get(f.memories[0]!.id)).content, f.output.content);
        assert.equal((await f.setup.get(prior.replacementId!)).content, f.output.content);
        assert.match(f.state.writes[0]!, new RegExp(`^PUT .*/memories/${f.memories[0]!.id}$`));
      } else {
        await assert.rejects(result, (error) => {
          // The server removes self-links; retained response checks require confirmation.
          assert.ok(error instanceof ForgetfulSchemaError);
          assert.match(error.message, /did not confirm all requested memory links/);
          return true;
        });
        assert.deepEqual(linkResponse, { status: 200, body: { linked_ids: [] } });
        assert.equal((await f.queue.getConflict(f.conflict.id))!.status, "pending");
        assert.match(f.state.writes[0]!, new RegExp(`^PUT .*/memories/${prior.replacementId}$`));
        assert.equal((await f.setup.get(f.old.id)).is_obsolete, false);
      }
      assert.equal(f.state.calls, 2);
    });
}

test("changed evidence cannot erase an unresolved create receipt and duplicate the write",
  realOptions, async (t) => {
    const f = await fixture(t);
    let creates = 0;
    f.state.onRequest = async (url, init) => {
      if (init?.method === "POST" && url.endsWith("/memories")) {
        creates++;
        await f.setup.create(JSON.parse(init.body as string));
        return new Response("Create outcome unavailable: original diagnostic", { status: 503 });
      }
      return undefined;
    };
    await assert.rejects(f.service.resolveConflict(f.conflict.id, f.input), /original diagnostic/);

    await assert.rejects(f.service.resolveConflict(f.conflict.id,
      { ...f.input, reason: "Different instruction while the first create remains unknown." }),
    /original diagnostic/);

    assert.equal(creates, 1);
    assert.equal((await f.queue.getConflict(f.conflict.id))!.status, "pending");
    assert.equal((await f.queue.getConflict(f.conflict.id))!.replacement!.creationAttempted, true);
  });
