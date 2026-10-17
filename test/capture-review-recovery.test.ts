import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { CaptureService } from "../src/capture.ts";
import type {
  CaptureSnapshot, ForgetfulClient, Memory, MemoryModelClient, ModelRequest,
} from "../src/contracts.ts";
import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const identity = { instanceId: "capture-review-recovery" };
const fact = { id: "fact", title: "Storage", content: "Use SQLite.", context: "Decision",
  keywords: [], tags: [], sourceEntryIds: ["user"], evidenceType: "userDecision" };
function snapshot(): CaptureSnapshot {
  return { id: "recovery", ...identity, mode: "auto", scope: "global", policy: "",
    modelVersion: "test", createdAt: new Date().toISOString(), finalEntryId: "answer",
    context: { cwd: "/repo", sessionId: "session", branchId: "branch",
      project: { id: 7, name: "Example" } }, entries: [
      { id: "user", role: "user", text: "Use SQLite." },
      { id: "answer", role: "assistant", text: "Noted." },
    ] };
}
async function answer(request: ModelRequest, value: unknown) {
  const report = request.readTools?.find(tool => tool.name === "report_capture_execution_failure");
  if (report) await report.execute({}, new AbortController().signal);
  request.submission!.validate(value);
  return value;
}
async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "capture-review-recovery-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const writes: string[] = [];
  const saved = new Map<number, Memory>();
  saved.set(1, { id: 1, title: "Storage", content: "Use Postgres.", context: "Old decision",
    keywords: [], tags: [], project_ids: [7], is_obsolete: false, linked_memory_ids: [] });
  const api = new ApiForgetfulClient({ baseUrl: "https://fixture.invalid/api/v1",
    fetchImpl: async (url, init) => {
      const path = new URL(String(url)).pathname;
      if (path.endsWith("/projects"))
        return Response.json({ projects: [{ id: 7, name: "Example" }] });
      if (path.endsWith("/memories/search"))
        return Response.json({ primary_memories: [], linked_memories: [] });
      if (path.endsWith("/memories") && init?.method === "POST") {
        writes.push("create");
        const id = 100 + writes.length;
        saved.set(id, { ...JSON.parse(String(init.body)), id, is_obsolete: false,
          linked_memory_ids: [] });
        return Response.json({ id });
      }
      const id = Number(path.split("/").at(-1));
      if (init?.method === "GET" && saved.has(id)) return Response.json(saved.get(id));
      if (init?.method === "DELETE" && saved.has(id)) {
        writes.push("supersede");
        saved.set(id, { ...saved.get(id)!, is_obsolete: true,
          superseded_by: JSON.parse(String(init.body)).superseded_by });
        return Response.json({ success: true });
      }
      return new Response("Not Found", { status: 404 });
    } });
  // This transport-neutral port exposes memory operations without optional link orchestration.
  const client: ForgetfulClient = { listProjects: api.listProjects.bind(api),
    search: api.search.bind(api), get: api.get.bind(api), create: api.create.bind(api),
    createProject: api.createProject.bind(api), linkProject: api.linkProject.bind(api),
    supersede: api.supersede.bind(api) };
  const model: MemoryModelClient = { async complete(request) {
    return answer(request, request.purpose === "capture" ? { candidates: [fact] }
      : { action: "create" });
  } };
  return { directory, queue, client, model, writes, saved };
}

test("permission revoked during the started create checkpoint allows retry after restart",
  async (t) => {
    // Arrange: the public disk checkpoint persists intent, then permission changes before HTTP.
    const f = await fixture(t);
    let allowed = true;
    const checkpoint = f.queue.checkpoint.bind(f.queue);
    f.queue.checkpoint = async (id, patch: any, outcome?: unknown) => {
      const job = typeof patch === "string"
        ? await checkpoint(id, patch, outcome) : await checkpoint(id, patch);
      if (typeof patch === "string" && (outcome as any)?.creation?.status === "started")
        allowed = false;
      return job;
    };
    const capture = new CaptureService({ ...identity, ...f, canWriteNow: () => allowed });
    const queued = await capture.enqueue(snapshot());
    // Act: pause before dispatch, then restore permission in a fresh queue/service.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    const paused = (await restarted.getJob(queued.jobId))!;
    // Assert: permission spends an attempt, but creates no uncertain accepted mutation.
    assert.deepEqual(f.writes, []);
    assert.equal(paused.status, "paused");
    assert.equal(paused.attempts, 1);
    assert.equal(paused.uncertainWrite, undefined);
    await new CaptureService({ ...identity, queue: restarted, client: f.client,
      model: f.model, canWriteNow: () => true }).checkpoint();
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.equal(finished.attempts, 2);
    assert.deepEqual(f.writes, ["create"]);
  });

test("permission revoked during the started supersession checkpoint preserves replacement",
  async (t) => {
    // Arrange: persist a replacement, then revoke permission before the supersession HTTP call.
    const f = await fixture(t);
    const model: MemoryModelClient = { async complete(request) {
      return answer(request, request.purpose === "capture" ? { candidates: [fact] }
        : { action: "supersede", conflictingMemoryId: 1 });
    } };
    let allowed = true;
    const checkpoint = f.queue.checkpoint.bind(f.queue);
    f.queue.checkpoint = async (id, patch: any, outcome?: unknown) => {
      const job = typeof patch === "string"
        ? await checkpoint(id, patch, outcome) : await checkpoint(id, patch);
      if (patch.supersession?.status === "started") allowed = false;
      return job;
    };
    const capture = new CaptureService({ ...identity, ...f, model,
      canWriteNow: () => allowed });
    const queued = await capture.enqueue(snapshot());
    // Act: restart with restored permission after the guarded operation pauses.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    const paused = (await restarted.getJob(queued.jobId))!;
    // Assert: only the replacement was dispatched, and the permission attempt remains charged.
    assert.deepEqual(f.writes, ["create"]);
    assert.equal(paused.attempts, 1);
    assert.equal(paused.uncertainWrite, undefined);
    assert.equal(paused.supersession?.status, "failed");
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model,
      canWriteNow: () => true }).checkpoint();
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.deepEqual(f.writes, ["create", "supersede"]);
    assert.equal(f.saved.get(1)?.superseded_by, 101);
  });

for (const action of ["create", "supersede"] as const) {
  test(`shutdown during the started ${action} checkpoint remains safely retryable`, async (t) => {
    // Arrange: lifecycle shutdown occurs after intent is durable and before HTTP dispatch.
    const f = await fixture(t);
    const model: MemoryModelClient = { async complete(request) {
      return answer(request, request.purpose === "capture" ? { candidates: [fact] }
        : action === "create" ? { action } : { action, conflictingMemoryId: 1 });
    } };
    let capture: CaptureService;
    const checkpoint = f.queue.checkpoint.bind(f.queue);
    f.queue.checkpoint = async (id, patch: any, outcome?: unknown) => {
      const job = typeof patch === "string"
        ? await checkpoint(id, patch, outcome) : await checkpoint(id, patch);
      if (action === "create" && (outcome as any)?.creation?.status === "started" ||
          action === "supersede" && patch.supersession?.status === "started") capture.stop();
      return job;
    };
    capture = new CaptureService({ ...identity, ...f, model });
    const queued = await capture.enqueue(snapshot());
    // Act: stop, then reopen the queue and service.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    const paused = (await restarted.getJob(queued.jobId))!;
    // Assert: lifecycle cancellation is exempt, and the undispatched write is not uncertain.
    assert.deepEqual(f.writes, action === "create" ? [] : ["create"]);
    assert.equal(paused.status, "paused");
    assert.equal(paused.attempts, 0);
    assert.equal(paused.uncertainWrite, undefined);
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model })
      .checkpoint();
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.equal(finished.attempts, 1);
    assert.deepEqual(f.writes, action === "create" ? ["create"] : ["create", "supersede"]);
  });
}

test("missing supersession target supplies actual REST error for correction after restart",
  realOptions, async (t) => {
    // Arrange: use isolated real REST storage, not a live Forgetful service.
    const f = await fixture(t);
    const baseUrl = await startForgetful(t);
    let missingBody = "";
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (new URL(String(url)).pathname.endsWith("/memories/999999"))
        missingBody = await response.clone().text();
      return response;
    } });
    const project = await client.createProject({ name: "Recovery", description: "Isolated test",
      repo_name: "test/capture-recovery" });
    const old = await client.create({ title: "Storage", content: "Use Postgres.",
      context: "Old decision", keywords: [], tags: [], importance: 7,
      project_ids: [project.id] });
    const input = snapshot();
    input.context.project = project;
    let correctionInput: any;
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates") return answer(request, { candidates: [fact] });
      if (name === "submit_capture_decision")
        return answer(request, { action: "supersede", conflictingMemoryId: 999999 });
      if (name === "submit_capture_correction") {
        correctionInput = request.input;
        return answer(request, { candidate: fact,
          decision: { action: "supersede", conflictingMemoryId: old.id } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "No new connection" })),
        preservation: { status: "complete", documentIds: [], codeArtifactIds: [], entityIds: [],
          reason: "Old memory has no resources" },
      })) });
    } };
    const capture = new CaptureService({ ...identity, queue: f.queue, client, model });
    const queued = await capture.enqueue(input);
    // Act: a missing read fails before any replacement, then a new process corrects that target.
    await capture.checkpoint();
    const first = (await f.queue.getJob(queued.jobId))!;
    assert.equal(first.status, "complete");
    assert.equal((await client.get(old.id)).is_obsolete, true);
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client, model }).checkpoint();
    // Assert: actual status/body reach the model, then the new target is executed once.
    assert.ok(correctionInput, "the failed target must reach submit_capture_correction");
    assert.match(correctionInput.outcome.executionFailure, /HTTP 404/);
    assert.ok(missingBody, "the isolated service returned an error body");
    assert.ok(correctionInput.outcome.executionFailure.includes(missingBody));
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    const outcome = finished.candidateOutcomes.fact as any;
    assert.equal((await client.get(old.id)).superseded_by, outcome.replacementId);
    const memories = await client.search({ query: "SQLite", query_context: "Recovery test",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(memories.filter((memory) => !memory.is_obsolete).length, 1);
  });

test("missing skip enrichment target supplies actual REST error for correction after restart",
  realOptions, async (t) => {
    // Arrange: a real target exists, but the model initially selects an invented memory ID.
    const f = await fixture(t);
    const baseUrl = await startForgetful(t);
    let missingBody = "";
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (new URL(String(url)).pathname.endsWith("/memories/999999"))
        missingBody = await response.clone().text();
      return response;
    } });
    const project = await client.createProject({ name: "Recovery", description: "Isolated test",
      repo_name: "test/enrichment-recovery" });
    const target = await client.create({ title: "Storage", content: "Use SQLite.",
      context: "Existing decision", keywords: [], tags: [], importance: 7,
      project_ids: [project.id] });
    const proposed = { ...fact, entities: [{ key: "database", sourceEntryIds: ["user"],
      input: { name: "SQLite", entity_type: "System", tags: [], aka: [] } }] };
    const input = snapshot();
    input.context.project = project;
    let correctionInput: any;
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates")
        return answer(request, { candidates: [proposed] });
      if (name === "submit_capture_decision")
        return answer(request, { action: "skip", enrich: true, memoryId: 999999 });
      if (name === "submit_capture_correction") {
        correctionInput = request.input;
        return answer(request, { candidate: proposed,
          decision: { action: "skip", enrich: true, memoryId: target.id,
            entityMemoryKeys: ["database"] } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "No new connection" })),
      })) });
    } };
    const capture = new CaptureService({ ...identity, queue: f.queue, client, model });
    const queued = await capture.enqueue(input);
    // Act: restart after the failed read, and correct only the failed candidate's target.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client, model }).checkpoint();
    // Assert: the service body is preserved, and enrichment uses the corrected memory.
    assert.ok(correctionInput, "the failed target must reach submit_capture_correction");
    assert.match(correctionInput.outcome.executionFailure, /HTTP 404/);
    assert.ok(missingBody);
    assert.ok(correctionInput.outcome.executionFailure.includes(missingBody));
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    const entities = await client.knowledge.searchEntities("SQLite");
    assert.equal(entities.length, 1);
    assert.deepEqual(await client.getMemoryEntityIds(target.id), [entities[0]!.id]);
    const memories = await client.search({ query: "SQLite", query_context: "Recovery test",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(memories.length, 1, "enrichment must not create a duplicate memory");
  });

test("missing sibling enrichment target is corrected after restart", async (t) => {
  // Arrange: target selection is model-owned, so an unsaved sibling fails during execution.
  const f = await fixture(t);
  let failure: any;
  const model: MemoryModelClient = { async complete(request) {
    if (request.purpose === "capture") return answer(request, { candidates: [fact] });
    if (request.submission!.name === "submit_capture_decision") return answer(request,
      { action: "skip", enrich: true, equivalentCandidateId: "unsaved" });
    failure = request.input;
    return answer(request, { candidate: fact, decision: { action: "create" } });
  } };
  const capture = new CaptureService({ ...identity, ...f, model });
  const queued = await capture.enqueue(snapshot());
  // Act: restart with the failed sibling instruction preserved for private correction.
  await capture.checkpoint();
  const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
  await new CaptureService({ ...identity, queue: restarted, client: f.client, model }).checkpoint();
  // Assert: correction identifies the failed candidate and saves the revised instruction once.
  assert.equal(failure.candidate.id, "fact");
  assert.match(failure.outcome.executionFailure, /Selected sibling has no saved memory ID/);
  const finished = (await restarted.getJob(queued.jobId))!;
  assert.equal(finished.status, "complete", finished.lastError);
  assert.deepEqual(f.writes, ["create"]);
});

test("sibling cycle feeds candidate-specific correction and recomputes execution order",
  async (t) => {
    // Arrange: the public batch submission selects a cycle, without a pre-write target gate.
    const f = await fixture(t);
    f.client.knowledge = { async linkMemories() {}, async unlinkMemories() {} } as any;
    const candidates = [{ ...fact, id: "first" }, { ...fact, id: "second" }];
    const corrections: any[] = [];
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates") return answer(request, { candidates });
      if (name === "submit_capture_decisions") return answer(request, { decisions: [
        { candidateId: "first", action: "skip", enrich: true, equivalentCandidateId: "second" },
        { candidateId: "second", action: "skip", enrich: true, equivalentCandidateId: "first" },
      ] });
      if (name === "submit_capture_correction") {
        corrections.push(request.input);
        return answer(request, { candidate: (request.input as any).candidate,
          decision: { action: "create" } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "Already represented" })),
      })) });
    } };
    const capture = new CaptureService({ ...identity, ...f, model });
    const queued = await capture.enqueue(snapshot());
    // Act: execute, restart, and break the cycle by correcting its failed instruction.
    await capture.checkpoint();
    assert.deepEqual(f.writes, ["create"]);
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model })
      .checkpoint();
    // Assert: one specific candidate gets the real execution error; its sibling reuses the save.
    assert.equal(corrections.length, 1, "cycle errors must reach private correction after restart");
    assert.equal(corrections[0].candidate.id, "first");
    assert.match(corrections[0].outcome.executionFailure, /cycle/);
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.deepEqual(f.writes, ["create"]);
    const first = finished.candidateOutcomes.first as any;
    const second = finished.candidateOutcomes.second as any;
    assert.equal(first.memoryId, second.memoryId);
  });

test("correction before accepted writes replaces cached enrichment target and resource plan",
  realOptions, async (t) => {
    // Arrange: an invalid resource read fails after the skip checkpoint and before writes.
    const f = await fixture(t);
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Plans", description: "Isolated test",
      repo_name: "test/capture-plan-recovery" });
    const previous = await client.create({ title: "Old storage", content: "Use Postgres.",
      context: "Previous decision", keywords: [], tags: [], importance: 7,
      project_ids: [project.id] });
    const target = await client.create({ title: "Storage", content: "Use SQLite.",
      context: "Current decision", keywords: [], tags: [], importance: 7,
      project_ids: [project.id] });
    const entity = await client.knowledge.createEntity({ name: "SQLite", entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] });
    const proposed = { ...fact, entities: [{ key: "database", existingId: 999999,
      sourceEntryIds: ["user"],
      input: { name: "SQLite", entity_type: "System", tags: [], aka: [] } }]
    };
    const corrected = { ...proposed, entities: [{ ...proposed.entities[0]!, existingId: entity.id }]
    };
    const input = snapshot();
    input.context.project = project;
    let failure: any;
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates")
        return answer(request, { candidates: [proposed] });
      if (name === "submit_capture_decision") return answer(request,
        { action: "skip", enrich: true, memoryId: previous.id, entityMemoryKeys: ["database"] });
      if (name === "submit_capture_correction") {
        failure = request.input;
        return answer(request, { candidate: corrected, decision: { action: "skip", enrich: true,
          memoryId: target.id, entityMemoryKeys: ["database"] } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "No new connection" })),
      })) });
    } };
    const capture = new CaptureService({ ...identity, queue: f.queue, client, model });
    const queued = await capture.enqueue(input);
    // Act: restart with a corrected read target and a different enrichment destination.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client, model }).checkpoint();
    // Assert: stale target/plan data cannot override the revised instruction before any save.
    assert.match(failure.outcome.executionFailure, /HTTP 404/);
    assert.equal(failure.outcome.creation, undefined);
    assert.equal(failure.outcome.knowledgeState, undefined);
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.deepEqual(await client.getMemoryEntityIds(previous.id), []);
    assert.deepEqual(await client.getMemoryEntityIds(target.id), [entity.id]);
    assert.equal((finished.candidateOutcomes.fact as any).memoryId, target.id);
  });

test("target correction preserves a sibling's completed creation receipt across restart",
  async (t) => {
    // Arrange: the first batch instruction saves a memory before the second target read fails.
    const f = await fixture(t);
    f.client.knowledge = { async linkMemories() {}, async unlinkMemories() {} } as any;
    const candidates = [{ ...fact, id: "saved" }, { ...fact, id: "failed" }];
    const corrections: string[] = [];
    let receiptDuringCorrection: unknown;
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates") return answer(request, { candidates });
      if (name === "submit_capture_decisions") return answer(request, { decisions: [
        { candidateId: "saved", action: "create" },
        { candidateId: "failed", action: "supersede", conflictingMemoryId: 999999 },
      ] });
      if (name === "submit_capture_correction") {
        const input = request.input as any;
        corrections.push(input.candidate.id);
        const job = await f.queue.getJob(request.diagnosticContext!.jobId!);
        receiptDuringCorrection = (job!.candidateOutcomes.saved as any).creation;
        return answer(request, { candidate: input.candidate, decision: { action: "skip",
          enrich: true, equivalentCandidateId: "saved" } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "Already represented" })),
      })) });
    } };
    const capture = new CaptureService({ ...identity, ...f, model });
    const queued = await capture.enqueue(snapshot());
    // Act: restart with one completed creation and one failed instruction.
    await capture.checkpoint();
    const before = (await f.queue.getJob(queued.jobId))!.candidateOutcomes.saved as any;
    assert.equal((receiptDuringCorrection as any).status, "completed");
    assert.deepEqual(f.writes, ["create"]);
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model })
      .checkpoint();
    // Assert: only the failed candidate is corrected; the sibling receipt remains completed.
    assert.deepEqual(corrections, ["failed"]);
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.deepEqual(f.writes, ["create"]);
    assert.equal((receiptDuringCorrection as any).result.id, before.memoryId);
    assert.equal((finished.candidateOutcomes.failed as any).memoryId, before.memoryId);
  });

for (const action of ["create", "supersede"] as const) {
  test(`arbitrary errors after dispatched ${action} stay protected across restart`, async (t) => {
    // Arrange: the external service accepts a mutation but its receipt is lost with a plain Error.
    const f = await fixture(t);
    if (action === "create") {
      const create = f.client.create.bind(f.client);
      f.client.create = async (...args) => {
        await create(...args);
        throw new Error("Create receipt lost");
      };
    } else {
      const supersede = f.client.supersede.bind(f.client);
      f.client.supersede = async (...args) => {
        await supersede(...args);
        throw new Error("Supersession receipt lost");
      };
    }
    let corrections = 0;
    const model: MemoryModelClient = { async complete(request) {
      if (request.submission!.name === "submit_capture_correction") corrections++;
      return answer(request, request.purpose === "capture" ? { candidates: [fact] }
        : action === "create" ? { action } : { action, conflictingMemoryId: 1 });
    } };
    const capture = new CaptureService({ ...identity, ...f, model });
    const queued = await capture.enqueue(snapshot());
    // Act: the next worker must leave the accepted mutation pending for reconciliation.
    await capture.checkpoint();
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model })
      .checkpoint();
    // Assert: plain errors never establish that a mutation was not dispatched.
    const job = (await restarted.getJob(queued.jobId))!;
    assert.equal(job.status, "paused");
    assert.ok(job.uncertainWrite);
    assert.equal(corrections, 0);
    assert.deepEqual(f.writes, action === "create" ? ["create"] : ["create", "supersede"]);
  });
}

test("corrected decisions cannot block a completed save behind an unused sibling dependency",
  async (t) => {
    // Arrange: the first candidate saves its memory, then the service rejects its resource fields.
    const f = await fixture(t);
    let entityCreates = 0;
    f.client.knowledge = { async linkMemories() {}, async unlinkMemories() {},
      async searchEntities() { return []; },
      async createEntity(input: any) {
        entityCreates++;
        if (input.name.length > 200)
          throw new ForgetfulHttpError("HTTP 422: entity name too long", 422,
            "entity name too long");
        return { ...input, id: 50 };
      },
    } as any;
    const first = { ...fact, id: "saved", entities: [{ key: "database",
      sourceEntryIds: ["user"], input: { name: "x".repeat(201), entity_type: "System" } }] };
    const second = { ...fact, id: "dependent" };
    let corrections = 0;
    const model: MemoryModelClient = { async complete(request) {
      const name = request.submission!.name;
      if (name === "submit_capture_candidates")
        return answer(request, { candidates: [first, second] });
      if (name === "submit_capture_decisions") return answer(request, { decisions: [
        { candidateId: "saved", action: "create" },
        { candidateId: "dependent", action: "skip", enrich: true,
          equivalentCandidateId: "saved" },
      ] });
      if (name === "submit_capture_correction") {
        corrections++;
        assert.match(request.policy,
          /Saved execution targets cannot change after protected writes/);
        return answer(request, { candidate: { ...first,
          entities: [{ ...first.entities[0]!, input: { name: "SQLite", entity_type: "System" } }] },
          decision: { action: "skip", enrich: true, equivalentCandidateId: "dependent" } });
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: Memory) => ({
          memoryId: memory.id, action: "ignore", reason: "Already represented" })),
      })) });
    } };
    const capture = new CaptureService({ ...identity, ...f, model });
    const queued = await capture.enqueue(snapshot());
    // Act: correction changes fields and decision, while the completed save owns its identity.
    await capture.checkpoint();
    assert.deepEqual(f.writes, ["create"]);
    const restarted = new DurableQueueStore({ directory: f.directory, ...identity });
    await new CaptureService({ ...identity, queue: restarted, client: f.client, model })
      .checkpoint();
    // Assert: resume the saved candidate's remaining work, then let its sibling reuse that memory.
    const finished = (await restarted.getJob(queued.jobId))!;
    assert.equal(finished.status, "complete", finished.lastError);
    assert.equal(corrections, 1);
    assert.equal(entityCreates, 2);
    assert.deepEqual(f.writes, ["create"]);
    assert.equal((finished.candidateOutcomes.saved as any).memoryId,
      (finished.candidateOutcomes.dependent as any).memoryId);
  });
