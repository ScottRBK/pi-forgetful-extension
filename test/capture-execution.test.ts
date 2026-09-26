import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const candidate = {
  id: "fact", title: "Storage", content: "SQLite is the storage engine.",
  context: "Current implementation.", keywords: ["storage"], tags: [],
  sourceEntryIds: ["correction"], evidenceType: "userDecision",
};
function snapshot(project: { id: number; name: string }): CaptureSnapshot {
  return { id: "execution", instanceId: "execution", mode: "auto", scope: "global",
    policy: "Save useful facts.", modelVersion: "test", createdAt: new Date().toISOString(),
    finalEntryId: "answer", context: { cwd: "/repo", sessionId: "session", branchId: "branch",
      project }, entries: [
      { id: "earlier", role: "user", text: "The storage engine is Postgres." },
      { id: "correction", role: "user", text: "Sorry, SQLite. We never used Postgres." },
      { id: "answer", role: "assistant", text: "Understood." },
    ] };
}
async function fixture(t: TestContext) {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Execution", description: "Explicit choices",
    repo_name: "test/execution" });
  const directory = await mkdtemp(join(tmpdir(), "capture-execution-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "execution" });
  return { baseUrl, client, project, queue };
}
function inputOf(request: ModelRequest): any { return request.input; }

test("capture executes an explicit removal of a historical scoped link", realOptions, async (t) => {
  // Arrange: the model, not creation metadata or claim comparison, chooses the connection.
  const { client, project, queue } = await fixture(t);
  const old = await client.create({ ...candidate, project_ids: [project.id] });
  const lead = await client.create({ ...candidate, title: "Unrelated service",
    content: "An unrelated service uses Postgres.", project_ids: [project.id] });
  await client.knowledge.linkMemories(old.id, [lead.id]);
  const service = new CaptureService({ client, queue, instanceId: "execution", model: {
    async complete(request) {
      if (request.purpose === "capture") return { candidates: [candidate] };
      if (request.submission?.name === "submit_capture_decision")
        return { action: "skip", memoryId: old.id, enrich: true, reason: "Review existing links." };
      const item = inputOf(request).candidates[0];
      await client.knowledge.updateMemory(lead.id, { content: "The other service uses MySQL." });
      return { reviews: [{ candidateId: "fact", decisions: item.memories.map((memory: any) => ({
        memoryId: memory.id, action: "reject", reason: "Unrelated service, not useful context.",
      })) }] };
    },
  } });
  // Act.
  const queued = await service.enqueue(snapshot(project));
  await service.checkpoint();
  // Assert: no code-owned identity judgment vetoes or changes the authorized instruction.
  const job = (await queue.getJob(queued.jobId))!;
  assert.equal(job.status, "complete", job.lastError);
  assert.ok(!(await client.get(old.id)).linked_memory_ids?.includes(lead.id));
});

test("a model supersession is not rewritten into an escalation by a partial flag", realOptions,
  async (t) => {
    // Arrange: a correction is not a migration; the model supplies the complete replacement.
    const { client, project, queue } = await fixture(t);
    const old = await client.create({ ...candidate, content: "Postgres is the storage engine.",
      project_ids: [project.id] });
    let conversation: any[] = [];
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        if (request.submission?.name === "submit_capture_decision") {
          conversation = inputOf(request).conversationEntries ?? [];
          return { action: "supersede", conflictingMemoryId: old.id, partial: true,
            oldClaim: "Postgres", newClaim: "SQLite", reason: "Corrected factual error.",
            sourceEntryIds: ["correction"] };
        }
        return { reviews: [{ candidateId: "fact", decisions: [], preservation: {
          status: "complete", documentIds: [], codeArtifactIds: [], entityIds: [],
          reason: "No applicable old references.",
        } }] };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert through the service: the requested replacement, not a substituted conflict.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal((await service.pendingConflicts()).length, 0);
    const previous = await client.get(old.id);
    assert.equal(previous.is_obsolete, true);
    assert.equal((await client.get(previous.superseded_by!)).content, candidate.content);
    assert.deepEqual(conversation.map((entry) => entry.id), ["earlier", "correction", "answer"]);
  });

test("failed link operations return to the model before any retry decision", realOptions,
  async (t) => {
    // Arrange: one raw REST failure; the model subsequently decides to leave the edge alone.
    const { baseUrl, client: api, project, queue } = await fixture(t);
    const old = await api.create({ ...candidate, project_ids: [project.id] });
    let deletes = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE") {
        deletes++;
        return new Response("maintenance detail: edge store unavailable", { status: 503 });
      }
      return fetch(url, init);
    } });
    let judgments = 0, received: unknown;
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        if (request.submission?.name === "submit_capture_decision") return { action: "create" };
        judgments++;
        const item = inputOf(request).candidates[0];
        if (judgments === 2) received = item.executionResults;
        return { reviews: [{ candidateId: "fact", decisions: item.memories.map((memory: any) => ({
          memoryId: memory.id, action: judgments === 1 ? "reject" : "keep",
          reason: judgments === 1 ? "Unhelpful edge." : "Leave stored state unchanged for now.",
        })) }] };
      },
    } });
    // Act: a new worker checkpoint must consult the model, not replay the failed deletion.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    await service.checkpoint();
    // Assert: exact service diagnostic reached the model; the revised decision was executed.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(judgments, 2);
    assert.match(JSON.stringify(received), /maintenance detail: edge store unavailable/);
    assert.equal(deletes, 1);
    assert.equal(job.callCount, 4);
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.fact as any;
    assert.ok((await api.get(outcome.memoryId)).linked_memory_ids?.includes(old.id));
  });

test("a failed create is reported to the model, not automatically repeated", realOptions,
  async (t) => {
    // Arrange: service returns its own plain-text failure; capture cannot infer a new plan.
    const { baseUrl, project, queue } = await fixture(t);
    let creates = 0, seen: any;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url).endsWith("/memories")) {
        creates++;
        return new Response("storage unavailable: write outcome unknown", { status: 503 });
      }
      return fetch(url, init);
    } });
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        if (request.submission?.name === "submit_capture_decision") return { action: "create" };
        assert.equal(request.submission?.name, "submit_capture_retry");
        seen = request.input;
        return { action: "stop", reason: "Do not repeat a write with an unknown outcome." };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    await service.checkpoint();
    // Assert: stopped is explicitly distinct from saved or a semantic duplicate skip.
    assert.equal(creates, 1);
    assert.match(JSON.stringify(seen), /storage unavailable: write outcome unknown/);
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal((job.candidateOutcomes.fact as any).stage, "execution-stopped");
    assert.equal(job.callCount, 3);
  });

test("overlap model selects exact existing rich records without executor identity matching",
  realOptions, async (t) => {
    // Arrange: labels differ; only the model knows these records describe the same component.
    const { client, project, queue } = await fixture(t);
    const entity = await client.knowledge.createEntity({ name: "Storage", entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] });
    const document = await client.knowledge.createDocument({ title: "Established storage rationale",
      description: "Existing rationale", content: "SQLite keeps this tool self-contained.",
      document_type: "text", tags: [], project_id: project.id });
    const rich = { ...candidate, entities: [{ key: "storage", sourceEntryIds: ["correction"],
      input: { name: "Storage", entity_type: "System", tags: [], aka: [],
        notes: "Current embedded database." } }], documents: [{ key: "reason",
      sourceEntryIds: ["correction"], input: { title: "Storage rationale", description: "Why",
        content: "Use an embedded database.", document_type: "text", tags: [] } }] };
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [rich] };
        if (request.submission?.name === "submit_capture_decision") {
          const neighborhood = inputOf(request).neighborhood;
          assert.equal(inputOf(request).candidate.documents[0].input.content,
            "Use an embedded database.");
          assert.equal(neighborhood.documents[0].content, document.content);
          return { action: "create", entityMemoryKeys: ["storage"], reuse: {
            entities: [{ key: "storage", id: entity.id }],
            documents: [{ key: "reason", id: document.id }] } };
        }
        return { reviews: [] };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert via REST: exactly the selected records, no synthesized duplicate or metadata rewrite.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const stored = await client.get((job.candidateOutcomes.fact as any).memoryId);
    assert.deepEqual(stored.document_ids, [document.id]);
    assert.deepEqual(await client.getMemoryEntityIds(stored.id), [entity.id]);
    assert.equal((await client.knowledge.listDocuments(project.id)).length, 1);
    assert.equal((await client.knowledge.getEntity(entity.id)).notes, entity.notes);
  });

test("restart reports an interrupted create instead of guessing that it failed", realOptions,
  async (t) => {
    // Arrange: a stored memory and an attempt receipt, with no returned ID checkpoint.
    const { client, project, queue } = await fixture(t);
    await client.create({ ...candidate, project_ids: [project.id] });
    let seen: any;
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        assert.equal(request.submission?.name, "submit_capture_retry");
        seen = request.input;
        return { action: "stop", reason: "Reconcile the unknown creation before another write." };
      },
    } });
    const queued = await service.enqueue(snapshot(project));
    await queue.checkpoint(queued.jobId, { callCount: 2, extractedCandidates: [candidate],
      candidateOutcomes: { fact: { stage: "decided", decision: { action: "create" },
        destinationProjectId: project.id, overlaps: [], creation: { status: "started" } } } });
    // Act: a fresh worker only has the durable record of what was attempted.
    await service.checkpoint();
    await service.checkpoint();
    // Assert: no duplicate exists, and the model is told that the outcome is unknown.
    assert.match(JSON.stringify(seen), /creation outcome is unknown/i);
    const stored = await client.search({ query: "storage", query_context: "Inspect capture",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(stored.length, 1);
  });

test("a new model instruction may deliberately repeat an earlier completed link operation",
  realOptions, async (t) => {
    // Arrange: the first addition succeeds, a later removal fails, then another writer unlinks it.
    const { baseUrl, client: api, project, queue } = await fixture(t);
    const source = await api.create({ ...candidate, project_ids: [project.id] });
    const target = await api.create({ ...candidate, title: "Related fact",
      project_ids: [project.id] });
    const other = await api.create({ ...candidate, title: "Unhelpful fact",
      project_ids: [project.id] });
    await api.knowledge.unlinkMemories(source.id, target.id);
    let fail = true, links = 0, decisions = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url).endsWith(`/memories/${source.id}/links`)) links++;
      if (fail && init?.method === "DELETE") {
        fail = false;
        return new Response("Temporary link failure", { status: 503 });
      }
      return fetch(url, init);
    } });
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        if (request.submission?.name === "submit_capture_decision")
          return { action: "skip", memoryId: source.id, enrich: true };
        decisions++;
        return { reviews: [{ candidateId: "fact", decisions: [
          { memoryId: target.id, action: "add", reason: "Explicitly link this useful fact." },
          { memoryId: other.id, action: "reject", reason: "Remove this unrelated connection." },
        ] }] };
      },
    } });
    // Act: the second model judgment explicitly requests the addition again.
    await service.enqueue(snapshot(project));
    await service.checkpoint();
    await api.knowledge.unlinkMemories(source.id, target.id);
    await service.checkpoint();
    // Assert: receipts prevent automatic replay, not a fresh instruction from the model.
    assert.equal(decisions, 2);
    assert.equal(links, 2);
    assert.ok((await api.get(source.id)).linked_memory_ids?.includes(target.id));
  });

test("skip does not silently become enrichment or entity linking", realOptions, async (t) => {
  // Arrange: extraction proposed resources, but the overlap model explicitly skips the candidate.
  const { client, project, queue } = await fixture(t);
  const old = await client.create({ ...candidate, project_ids: [project.id] });
  const rich = { ...candidate, entities: [{ key: "storage", sourceEntryIds: ["correction"],
    input: { name: "Store", entity_type: "System", tags: [], aka: [] } }] };
  const service = new CaptureService({ client, queue, instanceId: "execution", model: {
    async complete(request) {
      if (request.purpose === "capture") return { candidates: [rich] };
      return { action: "skip", memoryId: old.id, reason: "No new knowledge to write." };
    },
  } });
  // Act.
  await service.enqueue(snapshot(project));
  await service.checkpoint();
  // Assert: a skipped candidate creates neither resources nor attachments.
  assert.deepEqual(await client.knowledge.searchEntities("Store", 10), []);
  assert.deepEqual(await client.getMemoryEntityIds(old.id), []);
});

test("creating a proposed entity does not implicitly link it to the memory", realOptions,
  async (t) => {
    // Arrange: the model creates a related entity, without requesting an entity-memory edge.
    const { client, project, queue } = await fixture(t);
    const rich = { ...candidate, entities: [{ key: "storage", sourceEntryIds: ["correction"],
      input: { name: "Store", entity_type: "System", tags: [], aka: [] } }] };
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [rich] };
        return { action: "create", entityMemoryKeys: [] };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: only the explicit resource creation happens; no inferred association.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal((await client.knowledge.searchEntities("Store", 10)).length, 1);
    const savedId = (job.candidateOutcomes.fact as any).memoryId;
    assert.deepEqual(await client.getMemoryEntityIds(savedId), []);
  });

test("an explicit retry instruction reaches an unfinished rich create", realOptions, async (t) => {
  // Arrange: the first document request fails, while the primary memory was saved successfully.
  const { baseUrl, client: api, project, queue } = await fixture(t);
  let failures = 1, attempts = 0;
  const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
    if (init?.method === "POST" && String(url).endsWith("/documents")) {
      attempts++;
      if (failures-- > 0) return new Response("Document write unavailable", { status: 503 });
    }
    return fetch(url, init);
  } });
  const rich = { ...candidate, documents: [{ key: "reason", sourceEntryIds: ["correction"],
    input: { title: "Storage reason", description: "Why", content: "An embedded store is used.",
      document_type: "text", tags: [] } }] };
  const service = new CaptureService({ client, queue, instanceId: "execution", model: {
    async complete(request) {
      if (request.purpose === "capture") return { candidates: [rich] };
      if (request.submission?.name === "submit_capture_retry") {
        assert.match(JSON.stringify(request.input), /Document write unavailable/);
        return { action: "retry", reason: "Retry the uncompleted document operation." };
      }
      return { action: "create" };
    },
  } });
  // Act.
  const queued = await service.enqueue(snapshot(project));
  await service.checkpoint();
  await service.checkpoint();
  // Assert: the instruction was executed, rather than rejected by a code-owned retry policy.
  const job = (await queue.getJob(queued.jobId))!;
  assert.equal(job.status, "complete", job.lastError);
  assert.equal(attempts, 2);
  assert.equal((await api.knowledge.listDocuments(project.id)).length, 1);
});

test("explicit enrichment does not restore predecessor attachments removed before execution",
  realOptions, async (t) => {
    // Arrange: another writer removes an attachment after overlap retrieval.
    const { client, project, queue } = await fixture(t);
    const oldDocument = await client.knowledge.createDocument({ title: "Outdated reference",
      description: "Previous notes", content: "Historical text", document_type: "text",
      tags: [], project_id: project.id });
    const old = await client.create({ ...candidate, document_ids: [oldDocument.id],
      project_ids: [project.id] });
    const rich = { ...candidate, documents: [{ key: "new", sourceEntryIds: ["correction"],
      input: { title: "Current reference", description: "Current notes", content: "Current text",
        document_type: "text", tags: [] } }] };
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [rich] };
        await client.knowledge.updateMemory(old.id, { document_ids: [] });
        return { action: "skip", memoryId: old.id, enrich: true };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: only the model's newly requested attachment was added.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const stored = await client.get(old.id);
    assert.equal(stored.document_ids?.length, 1);
    assert.ok(!stored.document_ids?.includes(oldDocument.id));
  });

for (const correction of ["invalid-target", "wrong-tool", "missing", "oversized"] as const) {
test(`rejected batch corrections never resurrect earlier decisions: ${correction}`,
  realOptions,
  async (t) => {
    // Arrange: correction replaces first=create with an invalid supersession; second stays valid.
    const { client, project, queue } = await fixture(t);
    let batches = 0;
    const model = new PiMemoryModel({
      find: () => ({ provider: "test", id: "memory", maxTokens: 8_000 }) as any,
      complete: async (_model, context) => {
        const name = context.tools![0]!.name;
        const input = JSON.parse(context.messages[0]!.content as string);
        let args: unknown;
        if (name === "submit_capture_candidates") args = { candidates: [
          { ...candidate, id: "first" }, { ...candidate, id: "second" },
        ] };
        else if (name === "submit_capture_decisions") {
          batches++;
          args = { decisions: batches === 1 ? [
            { candidateId: "first", action: "create" },
            { candidateId: "second", action: "invalid" },
          ] : [
            { candidateId: "first", action: "supersede", conflictingMemoryId: 999 },
            { candidateId: "second", action: "create" },
          ] };
          if (batches === 3 && correction === "missing") args = {};
          if (batches === 3 && correction === "oversized") args = { decisions: [
            { candidateId: "first", action: "create" },
            { candidateId: "second", action: "create" },
            { candidateId: "unknown-1", action: "create" },
            { candidateId: "unknown-2", action: "create" },
          ] };
        } else args = { reviews: input.candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
            memoryId: memory.id, action: "keep", reason: "Leave the existing connection alone.",
          })),
        })) };
        return { role: "assistant", api: "test", provider: "test", model: "memory",
          content: [{ type: "toolCall", id: "submission",
            name: correction === "wrong-tool" && batches === 3 &&
              name === "submit_capture_decisions"
              ? "wrong_submission" : name, arguments: args }],
          stopReason: "toolUse", timestamp: Date.now(),
          usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } } as any;
      },
    }, { provider: "test", id: "memory" });
    const service = new CaptureService({ client, queue, instanceId: "execution", model });
    // Act through the real private submission correction protocol.
    await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: only the still-valid sibling instruction executed.
    assert.equal(batches, 3);
    const stored = await client.search({ query: "storage",
      query_context: "Inspect completed writes",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(stored.length, correction === "invalid-target" ? 1 : 0);
  });
}

test("failed supersession returns its actual diagnostic before model reconsideration", realOptions,
  async (t) => {
    // Arrange: creation and chosen references succeed; the final supersede request fails.
    const { baseUrl, client: api, project, queue } = await fixture(t);
    const old = await api.create({ ...candidate, content: "Postgres is used.",
      project_ids: [project.id] });
    let deletions = 0, reviews = 0, received: unknown;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE" && String(url).endsWith(`/memories/${old.id}`)) {
        deletions++;
        return new Response("Supersession rejected: storage under maintenance", { status: 503 });
      }
      return fetch(url, init);
    } });
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        if (request.submission?.name === "submit_capture_decision") return {
          action: "supersede", conflictingMemoryId: old.id, oldClaim: "Postgres",
          newClaim: "SQLite", sourceEntryIds: ["correction"], reason: "Correct the mistaken fact.",
        };
        reviews++;
        if (reviews === 2) received = request.input;
        return { reviews: [{ candidateId: "fact", decisions: [], preservation: {
          status: reviews === 1 ? "complete" : "unresolved", documentIds: [], codeArtifactIds: [],
          entityIds: [], reason: reviews === 1
            ? "No old resources apply." : "Stop until available.",
        } }] };
      },
    } });
    // Act.
    await service.enqueue(snapshot(project));
    await service.checkpoint();
    await service.checkpoint();
    // Assert: code does not mask the error or retry supersession after the model defers it.
    assert.equal(reviews, 2);
    assert.match(JSON.stringify(received), /Supersession rejected: storage under maintenance/);
    assert.equal(deletions, 1);
    assert.equal((await api.get(old.id)).is_obsolete, false);
  });

test("a no-op choice does not impose a conflicting graph-state requirement", realOptions,
  async (t) => {
    // Arrange: two models' per-candidate instructions share an edge; only one requests a mutation.
    const { client, project, queue } = await fixture(t);
    const service = new CaptureService({ client, queue, instanceId: "execution", model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [
          { ...candidate, id: "first" }, { ...candidate, id: "second" },
        ] };
        if (request.submission?.name === "submit_capture_decisions") return { decisions: [
          { candidateId: "first", action: "create" }, { candidateId: "second", action: "create" },
        ] };
        return { reviews: inputOf(request).candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
            memoryId: memory.id, action: item.candidateId === "first" ? "keep" : "reject",
            reason: "First does nothing; second explicitly removes this connection.",
          })),
        })) };
      },
    } });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: a no-op is not an assertion that code must preserve the original edge.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const first = (job.candidateOutcomes.first as any).memoryId;
    const second = (job.candidateOutcomes.second as any).memoryId;
    assert.ok(!(await client.get(first)).linked_memory_ids?.includes(second));
  });
