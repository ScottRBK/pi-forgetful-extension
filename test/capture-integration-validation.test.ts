import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { Value } from "typebox/value";
import { CaptureService } from "../src/capture.ts";
import { ModelSubmissionError, type CaptureSnapshot, type ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const instanceId = "capture-integration-validation";
const fact = { id: "fact", title: "Storage", content: "Use SQLite.", context: "User decision",
  keywords: [], tags: [], sourceEntryIds: ["user"] };
const entity = { key: "database", input: { name: "SQLite", entity_type: "System" } };
function answer(request: ModelRequest, value: unknown) {
  assert.ok(Value.Check(request.submission!.parameters as any, value));
  request.submission!.validate(value);
  return value;
}
async function fixture(t: TestContext) {
  const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
  const setup = new ApiForgetfulClient({ baseUrl });
  const project = await setup.createProject({ name: "Capture integration", description: "Test",
    repo_name: "test/capture-integration" });
  const directory = await mkdtemp(join(tmpdir(), "capture-integration-validation-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const writes: Array<{ path: string; body: any }> = [];
  const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
    if (init?.method === "POST") writes.push({ path: new URL(String(url)).pathname,
      body: init.body ? JSON.parse(init.body as string) : undefined });
    return fetch(url, init);
  } });
  const queue = new DurableQueueStore({ directory, instanceId });
  const snapshot: CaptureSnapshot = { id: "snapshot", instanceId, finalEntryId: "answer",
    context: { cwd: directory, repoName: "test/capture-integration",
      sessionId: "session", branchId: "branch", project },
    entries: [{ id: "user", role: "user", text: "Use SQLite." },
      { id: "answer", role: "assistant", text: "Done." }],
    mode: "auto", scope: "global", policy: "", modelVersion: "test",
    createdAt: new Date().toISOString() };
  return { setup, project, directory, writes, client, queue, snapshot };
}

for (const name of [undefined, null, 42]) {
  test(`invalid entity name reaches create validation and correction after restart: ${name}`,
    realOptions, async (t) => {
      // Arrange: optional enrichment lookup must not prevent the server validating a create.
      const f = await fixture(t);
      const input = name === undefined ? { entity_type: "System" }
        : { name, entity_type: "System" };
      const proposed = { ...fact, entities: [{ ...entity, input }] };
      let correction: any;
      const model = { async complete(request: ModelRequest) {
        switch (request.submission!.name) {
          case "submit_capture_candidates": return answer(request, { candidates: [proposed] });
          case "submit_capture_decision": return answer(request, { action: "create" });
          case "submit_capture_correction":
            correction = request.input;
            return answer(request, { candidate: { ...fact, entities: [entity] } });
          default: throw new Error(`Unexpected task: ${request.submission!.name}`);
        }
      } };
      const service = new CaptureService({ ...f, model, instanceId });
      // Act: retry with the disk queue and the original completed memory receipt.
      const queued = await service.enqueue(f.snapshot);
      await service.checkpoint();
      const pending = await f.queue.getJob(queued.jobId);
      assert.equal((pending!.candidateOutcomes.fact as any).creation?.status, "completed");
      const reopened = new DurableQueueStore({ directory: f.directory, instanceId });
      const restarted = new CaptureService({ queue: reopened, client: f.client,
        model, instanceId });
      await restarted.checkpoint();
      // Assert: actual create rejection reaches correction; memory creation is never repeated.
      assert.match(correction.outcome.executionFailure, /POST .*entities.*HTTP (400|422)/);
      const bodies = f.writes.filter(write => write.path.endsWith("/entities"));
      assert.deepEqual(bodies[0]!.body, { ...input, source_repo: f.snapshot.context.repoName,
        project_ids: [f.project.id] });
      assert.equal(bodies.length, 2);
      assert.equal(f.writes.filter(write => write.path.endsWith("/memories")).length, 1);
      assert.equal((await reopened.getJob(queued.jobId))!.status, "complete");
      assert.equal((await f.setup.knowledge.searchEntities("SQLite")).length, 1);
    });
}

test("explicit resource projects and provenance take precedence over inherited defaults",
  realOptions, async (t) => {
    // Arrange: each resource deliberately names another project and its own source.
    const f = await fixture(t);
    const foreign = await f.setup.createProject({ name: "Resource project", description: "Test",
      repo_name: "test/resource-project" });
    const provenance = { source_repo: "resource/repo", source_files: ["resource.ts"],
      source_url: "https://example.com/resource", encoding_version: "resource-version" };
    const proposed = { ...fact, sourceRepo: "candidate/repo", sourceFiles: ["candidate.ts"],
      sourceUrl: "https://example.com/candidate", encodingVersion: "candidate-version",
      entities: [{ ...entity, input: { ...entity.input, ...provenance,
        project_ids: [foreign.id] } }],
      documents: [{ key: "doc", input: { title: "Design", description: "Decision",
        content: "Use SQLite.", ...provenance, project_id: foreign.id } }],
      codeArtifacts: [{ key: "code", input: { title: "Example", description: "Code",
        code: "const database = 'sqlite';", language: "javascript", ...provenance,
        project_id: foreign.id } }] };
    const service = new CaptureService({ ...f, instanceId, model: {
      async complete(request) {
        return answer(request, request.purpose === "capture"
          ? { candidates: [proposed] } : { action: "create" });
      },
    } });
    // Act.
    const queued = await service.enqueue(f.snapshot);
    await service.checkpoint();
    // Assert through REST requests and stored resources.
    for (const [path, expected] of [["entities", proposed.entities[0]!.input],
      ["documents", proposed.documents[0]!.input],
      ["code-artifacts", proposed.codeArtifacts[0]!.input]] as const) {
      assert.deepEqual(f.writes.find(write => write.path.endsWith(`/${path}`))!.body, expected);
    }
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    const selected = (await f.setup.knowledge.searchEntities("SQLite"))[0]!;
    assert.deepEqual((await f.setup.knowledge.getEntity(selected.id)).project_ids, [foreign.id]);
    assert.equal((await f.setup.knowledge.listDocuments(foreign.id)).length, 1);
    assert.equal((await f.setup.knowledge.listCodeArtifacts(foreign.id)).length, 1);
  });

for (const input of [null, "invalid resource"]) {
  test(`nonobject resource reaches REST unchanged; its HTTP 500 blocks replay: ${input}`,
    realOptions, async (t) => {
      // Arrange: this server returns 500, not a definite validation rejection, for these bodies.
      const f = await fixture(t);
      const model = { async complete(request: ModelRequest) {
        if (request.purpose === "capture")
          return answer(request, { candidates: [{ ...fact, entities: [{ ...entity, input }] }] });
        assert.equal(request.submission!.name, "submit_capture_decision");
        return answer(request, { action: "create" });
      } };
      const service = new CaptureService({ ...f, model, instanceId });
      // Act: keep the actual server error, then attempt another checkpoint.
      const queued = await service.enqueue(f.snapshot);
      await service.checkpoint();
      await service.checkpoint();
      // Assert: unknown server effects cannot be treated as a safe field-correction retry.
      const job = (await f.queue.getJob(queued.jobId))!;
      assert.equal(job.status, "paused");
      assert.match((job.candidateOutcomes.fact as any).executionFailure,
        /HTTP 500: Internal Server Error/);
      const submitted = f.writes.filter(write => write.path.endsWith("/entities"));
      assert.equal(submitted.length, 1);
      assert.equal(submitted[0]!.body, input);
      assert.equal(f.writes.filter(write => write.path.endsWith("/memories")).length, 1);
    });
}

test("capture model receives descriptive resource examples while payload schemas stay loose",
  realOptions, async (t) => {
    // Arrange: an actual capture request exposes the instructions the private model sees.
    const f = await fixture(t);
    let parameters: any;
    const service = new CaptureService({ ...f, instanceId, model: {
      async complete(request) {
        parameters = request.submission!.parameters;
        return answer(request, { candidates: [] });
      },
    } });
    // Act.
    await service.enqueue(f.snapshot);
    await service.checkpoint();
    // Assert: examples teach payload names without enforcing server fields or resource caps.
    const schema = parameters.properties.candidates.items.properties;
    for (const [kind, fields] of [["entities", ["name", "entity_type"]],
      ["documents", ["title", "description", "content"]],
      ["codeArtifacts", ["title", "description", "code", "language"]],
      ["relationships", ["relationship_type"]]] as const) {
      const payload = schema[kind].items.properties.input;
      for (const field of fields) assert.ok(payload.description?.includes(`"${field}"`),
        `${kind} lacks an example for ${field}`);
      for (const value of [null, 42, {}, { arbitrary: "server-owned" }])
        assert.ok(Value.Check(payload, value));
      assert.equal(schema[kind].maxItems, undefined);
    }
  });

test("queued link task receives only bounded link rejection feedback after restart",
  realOptions, async (t) => {
    // Arrange: an independent stored fact ensures capture schedules a semantic link review.
    const f = await fixture(t);
    await f.setup.create({ ...fact, title: "Operational policy", content: "Retry twice.",
      project_ids: [f.project.id] });
    const reasons = ["first", "second", "third"].map(label =>
      `Missing selected memory decision: ${label} ${"x".repeat(700)}`);
    const inputs: any[] = [];
    let reviewCalls = 0;
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture") {
        request.submission!.onRejection!("Unrelated extraction rejection");
        return answer(request, { candidates: [fact] });
      }
      if (request.submission!.name === "submit_capture_decision")
        return answer(request, { action: "create" });
      assert.equal(request.submission!.name, "submit_capture_links");
      inputs.push(request.input);
      if (++reviewCalls === 1) {
        for (const reason of reasons) request.submission!.onRejection!(reason);
        throw new ModelSubmissionError("Link decisions exhausted", reasons);
      }
      return answer(request, { reviews: (request.input as any).candidates.map((item: any) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
          memoryId: memory.id, action: "ignore", reason: "Independent operational fact." })),
      })) });
    } };
    const service = new CaptureService({ ...f, instanceId, model });
    // Act: the next link task is a fresh model request restored from disk.
    const queued = await service.enqueue(f.snapshot);
    await service.checkpoint();
    const pending = await f.queue.getJob(queued.jobId);
    assert.equal(pending!.status, "pending");
    const savedId = (pending!.candidateOutcomes.fact as any).memoryId;
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId });
    await new CaptureService({ queue: reopened, client: f.client, model, instanceId }).checkpoint();
    // Assert: no unrelated rejection, no repeated write, bounded feedback survives restart.
    assert.deepEqual(inputs[0].candidates[0].submissionRejections, []);
    assert.deepEqual(inputs[1].candidates[0].submissionRejections,
      reasons.map(reason => reason.slice(0, 500)));
    assert.equal(inputs[1].candidates[0].completedWrites.memoryId, savedId);
    assert.equal(f.writes.filter(write => write.path.endsWith("/memories")).length, 1);
    assert.equal((await reopened.getJob(queued.jobId))!.status, "complete");
  });

test("explicit invalid resource metadata reaches server correction without inherited replacement",
  realOptions, async (t) => {
    // Arrange: null scope and provenance are supplied values, not omitted defaults.
    const f = await fixture(t);
    const input = { ...entity.input, project_ids: null, source_repo: null,
      source_files: "invalid" };
    let correction: any;
    const model = { async complete(request: ModelRequest) {
      if (request.purpose === "capture")
        return answer(request, { candidates: [{ ...fact, entities: [{ ...entity, input }] }] });
      if (request.submission!.name === "submit_capture_correction") {
        correction = request.input;
        return answer(request, { candidate: { ...fact, entities: [entity] } });
      }
      return answer(request, { action: "create" });
    } };
    const service = new CaptureService({ ...f, instanceId, model });
    // Act.
    const queued = await service.enqueue(f.snapshot);
    await service.checkpoint();
    await service.checkpoint();
    // Assert: upstream receives the exact invalid fields and supplies its own field details.
    assert.deepEqual(f.writes.find(write => write.path.endsWith("/entities"))!.body, input);
    assert.match(correction.outcome.executionFailure, /HTTP (400|422)/);
    assert.match(correction.outcome.executionFailure, /source_files/);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.writes.filter(write => write.path.endsWith("/memories")).length, 1);
  });

for (const context of [undefined, null, 42,
  "  Decision context  \nSession: old; Branch: old; Evidence entries: user"] as const) {
  test(`replacement cleanup preserves server validation and whitespace: ${context}`, realOptions,
    async (t) => {
      // Arrange: exact legacy metadata is removed only when context is a string.
      const f = await fixture(t);
      const old = await f.setup.create({ ...fact, content: "Use PostgreSQL.",
        project_ids: [f.project.id] });
      const model = { async complete(request: ModelRequest) {
        if (request.purpose === "capture")
          return answer(request, { candidates: [{ ...fact, context }] });
        if (request.submission!.name === "submit_capture_decision")
          return answer(request, { action: "supersede", conflictingMemoryId: old.id });
        if (request.submission!.name === "submit_capture_correction") {
          assert.match((request.input as any).outcome.executionFailure, /HTTP (400|422)/);
          return answer(request, { candidate: fact });
        }
        return answer(request, { reviews: [{ candidateId: fact.id, decisions: [] }] });
      } };
      const service = new CaptureService({ ...f, instanceId, model });
      // Act: a definite rejection can be corrected; completed writes are retained.
      const queued = await service.enqueue(f.snapshot);
      await service.checkpoint();
      await service.checkpoint();
      // Assert through the outgoing create and the resulting stored replacement.
      const first = f.writes.find(write => write.path.endsWith("/memories"))!.body;
      assert.equal(first.context, typeof context === "string" ? "  Decision context  " : context);
      const job = (await f.queue.getJob(queued.jobId))!;
      assert.equal(job.status, "complete", job.lastError);
      const saved = await f.setup.get((job.candidateOutcomes.fact as any).replacementId);
      assert.equal(saved.context,
        typeof context === "string" ? "  Decision context  " : fact.context);
      assert.equal((await f.setup.get(old.id)).is_obsolete, true);
    });
}
