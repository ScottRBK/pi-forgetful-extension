import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { Value } from "typebox/value";
import { CaptureService } from "../src/capture.ts";
import type {
  CaptureSnapshot, ForgetfulClient, Memory, MemoryInput, ModelRequest,
} from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { ForgetfulHttpError, ApiForgetfulClient } from "../src/http.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const identity = { instanceId: "validation-capture" };
const fact = { id: "fact", title: "Storage", content: "Use SQLite.", context: "Implementation",
  keywords: [], tags: [], sourceEntryIds: ["user"], evidenceType: "userDecision" };
function snapshot(project = { id: 7, name: "Example" }): CaptureSnapshot {
  return { id: "validation", ...identity, mode: "auto", scope: "global", policy: "",
    modelVersion: "test", createdAt: new Date().toISOString(), finalEntryId: "answer",
    context: { cwd: "/repo", sessionId: "session", branchId: "branch", project }, entries: [
      { id: "user", role: "user", text: "Use SQLite." },
      { id: "failed-tool", role: "toolResult", toolName: "read", isError: true, text: "Failure" },
      { id: "answer", role: "assistant", text: "Noted." },
    ] };
}
async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "capture-validation-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const saved = new Map<number, Memory>();
  const inputs: MemoryInput[] = [];
  const client = {
    async listProjects() { return [{ id: 7, name: "Example" }, { id: 9, name: "Other" }]; },
    async search() { return []; },
    async get(id: number) {
      if (!saved.has(id)) throw new ForgetfulHttpError("Not Found", 404, "Not Found");
      return saved.get(id)!;
    },
    async create(input: MemoryInput) {
      inputs.push(input);
      const id = 100 + inputs.length;
      saved.set(id, { ...input, id } as Memory);
      return { id, autoLinkedMemoryIds: [] };
    },
    async supersede(id: number, replacementId: number) {
      const old = saved.get(id)!;
      saved.set(id, { ...old, is_obsolete: true, superseded_by: replacementId });
    },
  } as unknown as ForgetfulClient;
  return { directory, queue, client, inputs, saved };
}
function answer(request: ModelRequest, value: unknown) {
  assert.ok(Value.Check(request.submission!.parameters as any, value),
    "private schema rejected payload");
  request.submission!.validate(value);
  return value;
}

test("capture forwards server-owned fields unchanged and retains only eligible evidence checks",
  async (t) => {
    // Arrange: even malformed server fields reach the external service unchanged.
    const { queue, client, inputs } = await fixture(t);
    const proposed = { ...fact, title: " ",
      content: "x".repeat(2001) + " password=stored-secret", context: "",
      keywords: "server validates", tags: Array(11).fill(""), importance: "8",
      sourceFiles: Array(21).fill(""), sourceRepo: "", sourceUrl: "", encodingVersion: "release",
      sourceEntryIds: ["failed-tool"], evidenceType: "userDecision" };
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        return answer(request, request.purpose === "capture"
          ? { candidates: [proposed] } : { action: "create" });
      },
    } });
    // Act.
    const queued = await capture.enqueue(snapshot());
    await capture.checkpoint();
    // Assert: no role, field, whitespace, list, provenance, or sensitive-data rewrite.
    assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
    assert.equal(inputs.length, 1);
    assert.deepEqual(inputs[0], { title: " ", content: proposed.content, context: "",
      keywords: "server validates", tags: proposed.tags, importance: "8", project_ids: [7],
      source_files: proposed.sourceFiles, source_repo: "", source_url: "",
      encoding_version: "release" });
  });

test("uncapped candidate submissions receive deterministic keys without losing duplicates",
  async (t) => {
    // Arrange: missing and duplicate candidate IDs are local bookkeeping, not rejected claims.
    const { queue, client, inputs } = await fixture(t);
    const proposed = [{ ...fact, id: undefined }, { ...fact, id: "same" },
      { ...fact, id: "same" }, { ...fact, id: "candidate-1" }];
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        return answer(request, request.purpose === "capture"
          ? { candidates: proposed } : { action: "create" });
      },
    } });
    // Act: retries grant a new four-task allowance while preserving completed writes.
    const queued = await capture.enqueue(snapshot());
    await capture.checkpoint();
    await capture.checkpoint();
    // Assert.
    assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
    assert.equal(inputs.length, 4);
  });

test("capture can choose an existing project without an override rationale", async (t) => {
  // Arrange.
  const { queue, client, inputs } = await fixture(t);
  const capture = new CaptureService({ ...identity, queue, client, model: {
    async complete(request) {
      return answer(request, request.purpose === "capture"
        ? { candidates: [{ ...fact, destinationProjectName: "Other" }] } : { action: "create" });
    },
  } });
  // Act.
  const queued = await capture.enqueue(snapshot());
  await capture.checkpoint();
  // Assert.
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
  assert.deepEqual(inputs[0]?.project_ids, [9]);
});

test("unknown capture project skips with a creation warning in public diagnostics", async (t) => {
  // Arrange.
  const { queue, client, inputs } = await fixture(t);
  const capture = new CaptureService({ ...identity, queue, client, model: {
    async complete(request) {
      return answer(request, { candidates: [{ ...fact, destinationProjectName: "Missing" }] });
    },
  } });
  // Act.
  await capture.enqueue(snapshot());
  await capture.checkpoint();
  // Assert: the extension can surface the warning without creating a project.
  assert.equal(inputs.length, 0);
  assert.match((await capture.diagnostics()).jobs[0].candidates[0].reason!, /create a project/i);
});

test("retry resets four charged tasks while preparation yields preserve the current allowance",
  async (t) => {
    // Arrange: persist a spent first attempt, then restart the queue.
    const { directory, queue } = await fixture(t);
    const queued = await queue.enqueue(snapshot());
    await queue.claimNext(identity);
    await queue.checkpoint(queued.jobId, { callCount: 4, status: "pending" });
    let restarted = new DurableQueueStore({ directory, ...identity });
    // Act: retry and then yield preparation within that same attempt.
    const retry = await restarted.claimNext(identity);
    assert.equal(retry?.callCount, 0);
    await restarted.checkpoint(queued.jobId, { callCount: 2 });
    await restarted.releaseProgress(queued.jobId);
    restarted = new DurableQueueStore({ directory, ...identity });
    const resumed = await restarted.claimNext(identity);
    // Assert: yielding never grants another allowance or spends another failed attempt.
    assert.equal(resumed?.callCount, 2);
    assert.equal(resumed?.attempts, 2);
  });

test("definitely rejected memory fields are corrected from raw server errors after restart",
  realOptions, async (t) => {
    // Arrange: a real isolated REST service rejects a 201-character title.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Validation", description: "Test",
      repo_name: "test/capture-validation" });
    const { directory, queue } = await fixture(t);
    const rejected = { ...fact, title: "x".repeat(201) };
    let failure: any;
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture") return answer(request, { candidates: [rejected] });
      if (request.submission!.name === "submit_capture_decision")
        return answer(request, { action: "create" });
      if (request.submission!.name === "submit_capture_correction") {
        failure = request.input;
        return answer(request, { candidate: fact });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "Independent fact" })),
      })) });
    } };
    let capture = new CaptureService({ ...identity, queue, client, model });
    // Act: durable rejected receipt is available to the next process for field correction.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory, ...identity });
    capture = new CaptureService({ ...identity, queue: restarted, client, model });
    await capture.checkpoint();
    // Assert: actual validation details reached the model, and corrected fields were saved once.
    assert.match(JSON.stringify(failure), /HTTP 400/);
    assert.match(JSON.stringify(failure), /title/);
    const job = (await restarted.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.fact as any;
    assert.equal((await client.get(outcome.memoryId)).title, "Storage");
    const memories = await client.search({ query: "SQLite", query_context: "Validation",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(memories.length, 1);
  });

test("uncertain create responses never authorize another accepted write", async (t) => {
  // Arrange: server accepted the write, but its response was lost.
  const { directory, queue, client, inputs } = await fixture(t);
  const create = client.create.bind(client);
  client.create = async (input) => {
    await create(input);
    throw new ForgetfulHttpError("HTTP 503: response outcome unknown", 503, "outcome unknown");
  };
  let corrections = 0;
  const model = { async complete(request: ModelRequest) {
    if (request.purpose === "capture") return answer(request, { candidates: [fact] });
    if (request.submission!.name === "submit_capture_decision")
      return answer(request, { action: "create" });
    corrections++;
    return { candidate: fact };
  } };
  const capture = new CaptureService({ ...identity, queue, client, model });
  // Act.
  const queued = await capture.enqueue(snapshot());
  await capture.checkpoint();
  const restarted = new DurableQueueStore({ directory, ...identity });
  await new CaptureService({ ...identity, queue: restarted, client, model }).checkpoint();
  // Assert: receipts protect the accepted mutation across a process restart.
  assert.equal(inputs.length, 1);
  assert.equal(corrections, 0);
  assert.equal((await restarted.getJob(queued.jobId))?.status, "paused");
});

test("model can supersede multiple unsupplied shared targets with one replacement", async (t) => {
  // Arrange: neither target was returned by overlap search; one is shared across projects.
  const { queue, client, inputs, saved } = await fixture(t);
  saved.set(1, { ...fact, id: 1, project_ids: [7, 9] } as unknown as Memory);
  saved.set(2, { ...fact, id: 2, project_ids: [9] } as unknown as Memory);
  const capture = new CaptureService({ ...identity, queue, client, model: {
    async complete(request) {
      return answer(request, request.purpose === "capture" ? { candidates: [fact] }
        : { action: "supersede", conflictingMemoryId: 1, conflictingMemoryIds: [2] });
    },
  } });
  // Act.
  const queued = await capture.enqueue(snapshot());
  await capture.checkpoint();
  // Assert: every selected target points to the single replacement without explanation gates.
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
  assert.equal(inputs.length, 1);
  assert.equal(saved.get(1)?.is_obsolete, true);
  assert.equal(saved.get(2)?.is_obsolete, true);
  assert.equal(saved.get(1)?.superseded_by, saved.get(2)?.superseded_by);
});

test("large candidate lists chunk link reviews into no more than three per request", async (t) => {
  // Arrange: the server exposes the same existing lead to all six newly saved facts.
  const { queue, client, inputs, saved } = await fixture(t);
  saved.set(1, { ...fact, id: 1, project_ids: [7], linked_memory_ids: [] } as unknown as Memory);
  client.search = async () => [saved.get(1)!];
  client.knowledge = {
    async searchEntities() { return []; }, async getRelationships() { return []; },
    async linkMemories() {}, async unlinkMemories() {},
  } as any;
  const chunks: number[] = [];
  const capture = new CaptureService({ ...identity, queue, client, model: {
    async complete(request) {
      if (request.purpose === "capture") return answer(request, { candidates:
        Array.from({ length: 6 }, (_, index) => ({ ...fact, id: `fact-${index}` })) });
      const candidates = (request.input as any).candidates;
      if (request.submission!.name === "submit_capture_decisions")
        return answer(request, { decisions: candidates.map((item: any) => ({
          candidateId: item.candidate.id, action: "create" })) });
      chunks.push(candidates.length);
      return answer(request, { reviews: candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "No connection requested" })),
      })) });
    },
  } });
  // Act.
  const queued = await capture.enqueue(snapshot());
  await capture.checkpoint();
  // Assert: uncapped extraction and overlap fit four charged tasks with two link chunks.
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
  assert.equal(inputs.length, 6);
  assert.deepEqual(chunks, [3, 3]);
});

test("resource field correction preserves the accepted memory and completed entity receipts",
  realOptions, async (t) => {
    // Arrange: a real resource POST is rejected after memory and first entity succeeded.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Resources", description: "Correction",
      repo_name: "test/resource-correction" });
    const { directory, queue } = await fixture(t);
    const first = { key: "db", input: { name: "Database", entity_type: "System" } };
    const bad = { key: "service", input: { name: "Service", entity_type: "NotAType" } };
    const proposed = { ...fact, entities: [first, bad], documents: [{ key: "notes",
      input: { title: "Notes", description: "", content: "Resource correction" } }] };
    let corrections = 0, failure: any;
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture") return answer(request, { candidates: [proposed] });
      if (request.submission!.name === "submit_capture_decision")
        return answer(request, { action: "create" });
      if (request.submission!.name === "submit_capture_correction") {
        corrections++; failure = request.input;
        return answer(request, { candidate: { ...proposed, documents: [{ key: "notes",
          input: { ...proposed.documents[0].input, description: "Details" } }], entities: [first,
          { ...bad, input: { ...bad.input, entity_type: "System" } }] } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "Independent" })),
      })) });
    } };
    let capture = new CaptureService({ ...identity, queue, client, model });
    // Act: restart with the accepted memory and partial resource state.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const partial = (await queue.getJob(queued.jobId))!.candidateOutcomes.fact as any;
    const memoryId = partial.memoryId;
    const entityId = partial.knowledgeState?.entities[0]?.id;
    const restarted = new DurableQueueStore({ directory, ...identity });
    capture = new CaptureService({ ...identity, queue: restarted, client, model });
    await capture.checkpoint();
    // Assert: raw error and completed receipt reached correction; no completed create replayed.
    assert.equal(corrections, 1);
    assert.match(JSON.stringify(failure), /HTTP 400/);
    assert.match(JSON.stringify(failure), /entity_type/);
    const final = (await restarted.getJob(queued.jobId))!;
    assert.equal(final.status, "complete", final.lastError);
    const outcome = final.candidateOutcomes.fact as any;
    assert.equal(outcome.memoryId, memoryId);
    assert.equal((await client.knowledge.getEntity(entityId)).name, "Database");
    assert.equal((await client.knowledge.searchEntities("Database")).length, 1);
    assert.equal((await client.knowledge.searchEntities("Service")).length, 1);
    assert.equal((await client.get(memoryId)).document_ids?.length, 1);
  });

test("legacy resolution forwards server fields and unsupplied cross-project attachments",
  realOptions, async (t) => {
    // Arrange: human handoff origin stays validated; stored fields and associations use REST rules.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Origin", description: "Origin",
      repo_name: "test/resolution-origin" });
    const foreign = await client.createProject({ name: "Foreign", description: "Foreign",
      repo_name: "test/resolution-foreign" });
    const old = await client.create({ ...fact, project_ids: [project.id, foreign.id] });
    const document = await client.knowledge.createDocument({ title: "Reference",
      description: "Foreign reference", content: "Evidence", tags: [], project_id: foreign.id });
    const { queue } = await fixture(t);
    const now = new Date().toISOString();
    await queue.addConflict({ id: "resolution", candidateId: fact.id, binding: identity,
      sessionId: "session", branchId: "branch", context: snapshot(project).context,
      destinationProjectId: project.id, oldMemoryId: old.id, oldMemory: await client.get(old.id),
      candidate: fact, sourceEntryIds: ["user"], evidence: ["Use SQLite"], reason: "Clarify",
      status: "pending", createdAt: now, updatedAt: now });
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        const { id: _id, evidenceType: _kind, ...fields } = fact;
        return answer(request, { ...fields, context: "", title: " ",
          importance: "8", keywords: [""], sourceEntryIds: ["correction"],
          documentIds: [document.id], codeArtifactIds: [], entityIds: [], memoryIds: [],
          fileIds: [], sourceFiles: Array(21).fill(""), encodingVersion: "release" });
      },
    } });
    // Act.
    const result = await capture.resolveConflict("resolution", { action: "supersede",
      evidenceEntryIds: ["correction"], additionalEntries: [{ id: "correction", role: "user",
        text: "Confirmed SQLite" }] });
    // Assert: scope and nonblank-field restrictions do not override the model's instructions.
    assert.equal(result.status, "resolved");
    const response = await fetch(`${baseUrl}/memories/${result.conflict.replacementId}`);
    const saved = await response.json() as Memory;
    assert.equal(saved.title, " ");
    assert.equal(saved.context, "");
    assert.equal(saved.encoding_version, "release");
    assert.deepEqual(saved.document_ids, [document.id]);
  });

test("uncertain accepted resource creates stay pending across restart without correction",
  realOptions, async (t) => {
    // Arrange: memory succeeded and entity was accepted before its response was lost.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Uncertain", description: "Resources",
      repo_name: "test/uncertain-resource" });
    let creates = 0, corrections = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url).endsWith("/entities")) {
        creates++;
        const accepted = await fetch(url, init);
        assert.equal(accepted.status, 201);
        return new Response("Entity accepted but reply lost", { status: 503 });
      }
      return fetch(url, init);
    } });
    const { directory, queue } = await fixture(t);
    const candidate = { ...fact, entities: [{ key: "db", input: {
      name: "Database", entity_type: "System" } }] };
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture") return answer(request, { candidates: [candidate] });
      if (request.submission!.name === "submit_capture_decision")
        return answer(request, { action: "create" });
      corrections++;
      return answer(request, { candidate });
    } };
    const capture = new CaptureService({ ...identity, queue, client, model });
    // Act.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client, model }).checkpoint();
    // Assert: no second resource POST, no retry/model correction, receipts remain durable.
    const job = (await restarted.getJob(queued.jobId))!;
    assert.equal(creates, 1);
    assert.equal(corrections, 0);
    assert.equal(job.status, "paused");
    const outcome = job.candidateOutcomes.fact as any;
    assert.equal(outcome.creation.status, "completed");
    assert.equal(outcome.knowledgeState.pendingCreates.length, 1);
    assert.equal((await setup.get(outcome.memoryId)).content, fact.content);
    assert.equal((await setup.knowledge.searchEntities("Database")).length, 1);
  });

test("model can reuse unsupplied resources whose keys were not in the candidate proposal",
  realOptions, async (t) => {
    // Arrange: resource IDs are model-directed, independent of supplied enrichment records.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Reuse", description: "Target",
      repo_name: "test/reuse" });
    const foreign = await client.createProject({ name: "Existing", description: "Resources",
      repo_name: "test/reuse-foreign" });
    const document = await client.knowledge.createDocument({ title: "Existing reference",
      description: "Reference", content: "Stored resource", tags: [], project_id: foreign.id });
    const entity = await client.knowledge.createEntity({ name: "Existing component",
      entity_type: "System", tags: [], aka: [], project_ids: [foreign.id] });
    const { queue } = await fixture(t);
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        if (request.purpose === "capture") return answer(request, { candidates: [fact] });
        if (request.submission!.name === "submit_capture_decision") return answer(request, {
          action: "create", reuse: { documents: [{ key: "reference", id: document.id }],
            entities: [{ key: "component", id: entity.id }] }, entityMemoryKeys: ["component"],
        });
        return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
            memoryId: memory.id, action: "ignore", reason: "Independent" })),
        })) });
      },
    } });
    // Act.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    // Assert: selections are executed, without being silently dropped as unproposed keys.
    const outcome = (await queue.getJob(queued.jobId))!.candidateOutcomes.fact as any;
    const saved = await client.get(outcome.memoryId);
    assert.deepEqual(saved.document_ids, [document.id]);
    assert.deepEqual(await client.getMemoryEntityIds(saved.id), [entity.id]);
  });

test("forward sibling enrichment executes after its selected sibling is saved", async (t) => {
  // Arrange: explicit sibling selection need not point backward or remain in the same project.
  const { queue, client, inputs, saved } = await fixture(t);
  const documents = new Map<number, any>();
  client.knowledge = {
    async searchEntities() { return []; }, async getRelationships() { return []; },
    async linkMemories() {}, async unlinkMemories() {},
    async listDocuments() { return []; },
    async createDocument(input: any) {
      const document = { ...input, id: 1 }; documents.set(1, document); return document;
    },
    async getDocument(id: number) { return documents.get(id); },
    async updateMemory(id: number, update: any) {
      const memory = { ...saved.get(id), ...update };
      saved.set(id, memory as Memory); return memory;
    },
  } as any;
  const proposed = [{ ...fact, id: "enrich", destinationProjectId: 9,
    documents: [{ key: "notes", input: { title: "Notes", description: "Details",
      content: "Reference", tags: [] } }] }, { ...fact, id: "saved" }];
  const capture = new CaptureService({ ...identity, queue, client, model: {
    async complete(request) {
      if (request.purpose === "capture") return answer(request, { candidates: proposed });
      if (request.submission!.name === "submit_capture_decisions") return answer(request, {
        decisions: [{ candidateId: "enrich", action: "skip", enrich: true,
          equivalentCandidateId: "saved" }, { candidateId: "saved", action: "create" }],
      });
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "No selected edge" })),
      })) });
    },
  } });
  // Act.
  const queued = await capture.enqueue(snapshot());
  await capture.checkpoint();
  // Assert: one memory is saved and then receives the explicitly selected resource.
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete",
      (await queue.getJob(queued.jobId))?.lastError);
  assert.equal(inputs.length, 1);
  assert.deepEqual(saved.get(101)?.document_ids, [1]);
  assert.equal(documents.get(1)?.project_id, 9);
});

test("opposite link instructions across review chunks are rejected before connection writes",
  async (t) => {
    // Arrange: six candidates need two review submissions; two select the same edge oppositely.
    const { queue, client, saved } = await fixture(t);
    saved.set(1, { ...fact, id: 1, project_ids: [7] } as unknown as Memory);
    client.search = async () => [saved.get(1)!];
    const mutations: string[] = [];
    client.knowledge = {
      async searchEntities() { return []; }, async getRelationships() { return []; },
      async linkMemories(id: number, targets: number[]) {
        mutations.push(`add:${id}:${targets[0]}`);
      },
      async unlinkMemories(id: number, target: number) {
        mutations.push(`remove:${id}:${target}`);
      },
    } as any;
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        if (request.purpose === "capture") return answer(request, { candidates:
          Array.from({ length: 6 }, (_, index) => ({ ...fact, id: `fact-${index}` })) });
        const candidates = (request.input as any).candidates;
        if (request.submission!.name === "submit_capture_decisions")
          return answer(request, { decisions: candidates.map((item: any) => ({
            candidateId: item.candidate.id, action: "create" })) });
        return answer(request, { reviews: candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
            memoryId: memory.id, action: item.candidateId === "fact-0" && memory.id === 104
              ? "add" : item.candidateId === "fact-3" && memory.id === 101 ? "reject" : "ignore",
            reason: "Selected connection" })),
        })) });
      },
    } });
    // Act.
    await capture.enqueue(snapshot());
    const result = await capture.checkpoint();
    // Assert: L5 coverage is job-wide even though each request is bounded to three reviews.
    assert.match(result.errors.join(" "), /Contradictory judgments/);
    assert.deepEqual(mutations, []);
  });

test("multiple predecessor reviews resume after four tasks without replaying completed targets",
  realOptions, async (t) => {
    // Arrange: three predecessor reviews exceed the first attempt's remaining task budget.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Supersede", description: "Three targets",
      repo_name: "test/multi-supersede" });
    const foreign = await setup.createProject({ name: "Other scope", description: "Targets",
      repo_name: "test/multi-supersede-foreign" });
    const leadId = (await setup.create({ ...fact, title: "Independent SQLite reference",
      project_ids: [project.id] })).id;
    const originals: number[] = [], documentIds: number[] = [];
    for (let index = 0; index < 3; index++) {
      const document = await setup.knowledge.createDocument({ title: `Reference ${index}`,
        description: "Prior evidence", content: "Useful reference", tags: [],
        project_id: project.id });
      documentIds.push(document.id);
      originals.push((await setup.create({ ...fact, title: `Old claim ${index}`,
        project_ids: index === 1 ? [project.id, foreign.id]
          : index === 2 ? [foreign.id] : [project.id], document_ids: [document.id] })).id);
    }
    let creates = 0, links = 0;
    const deletions: string[] = [];
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
      if (init?.method === "DELETE") deletions.push(String(url));
      if (init?.method === "POST" && String(url).endsWith("/links")) links++;
      return fetch(url, init);
    } });
    const { directory, queue } = await fixture(t);
    const reviewed: number[] = [];
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture") return answer(request, { candidates: [fact] });
      if (request.submission!.name === "submit_capture_decision")
        return answer(request, { action: "supersede", conflictingMemoryIds: originals });
      const item = (request.input as any).candidates[0];
      assert.equal(item.completedWrites.previousReviews?.length ?? 0, reviewed.length);
      reviewed.push(item.previous.memory.id);
      return answer(request, { reviews: [{ candidateId: item.candidateId,
        decisions: item.memories.map((memory: Memory) => ({ memoryId: memory.id,
          action: memory.id === leadId ? "add" : "ignore",
          reason: "Preserve only the independent reference" })),
        preservation: { documentIds: [...item.memory.document_ids,
          ...item.previous.documents.map((document: any) => document.id)],
          codeArtifactIds: [], entityIds: [] },
      }] });
    } };
    let capture = new CaptureService({ ...identity, queue, client, model });
    // Act: restart after the four-task limit interrupted preparation for predecessor three.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const pending = (await queue.getJob(queued.jobId))!;
    assert.equal(pending.callCount, 4);
    assert.equal(pending.status, "pending");
    assert.equal((pending.candidateOutcomes.fact as any).supersededMemoryIds.length, 2);
    const restarted = new DurableQueueStore({ directory, ...identity });
    capture = new CaptureService({ ...identity, queue: restarted, client, model });
    await capture.checkpoint();
    // Assert: one replacement, three reviewed and completed targets, no duplicated deletes.
    const final = (await restarted.getJob(queued.jobId))!;
    assert.equal(final.status, "complete", final.lastError);
    assert.equal(final.callCount, 1);
    assert.equal(creates, 1);
    assert.equal(deletions.length, 3);
    assert.equal(links, 1);
    assert.deepEqual(reviewed, originals);
    const replacementId = (final.candidateOutcomes.fact as any).replacementId;
    for (const id of originals) assert.equal((await setup.get(id)).superseded_by, replacementId);
    assert.deepEqual((await setup.get(replacementId)).document_ids, documentIds);
    assert.deepEqual((await setup.get(replacementId)).project_ids, [project.id]);
  });

test("uncertain acceptance on the third attempt retains evidence instead of expiring receipts",
  async (t) => {
    // Arrange: two genuine provider failures are followed by an accepted write with lost response.
    const { queue, client, inputs } = await fixture(t);
    const create = client.create.bind(client);
    client.create = async (input) => {
      await create(input);
      throw new ForgetfulHttpError("Accepted but receipt lost", 503, "Accepted but receipt lost");
    };
    let extractions = 0;
    const capture = new CaptureService({ ...identity, queue, client, model: {
      async complete(request) {
        if (request.purpose === "capture") {
          if (++extractions < 3) throw new Error("Provider unavailable");
          return answer(request, { candidates: [fact] });
        }
        return answer(request, { action: "create" });
      },
    } });
    // Act.
    const queued = await capture.enqueue(snapshot());
    await capture.checkpoint();
    await capture.checkpoint();
    await capture.checkpoint();
    // Assert: uncertainty remains pending with original evidence and durable mutation receipts.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "paused");
    assert.equal(job.attempts, 2);
    assert.equal(job.snapshot.entries.length, 3);
    assert.equal((job.candidateOutcomes.fact as any).creation.status, "unknown");
    assert.equal(inputs.length, 1);
  });
