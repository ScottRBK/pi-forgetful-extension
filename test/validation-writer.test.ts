import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { Value } from "typebox/value";

import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient, ForgetfulHttpError, ForgetfulSchemaError } from "../src/http.ts";
import {
  KnowledgeWriter, type KnowledgeWritePlan, type KnowledgeWriteState,
} from "../src/knowledge-write.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

async function setup(t: TestContext) {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
  const project = await client.createProject({ name: "Writer validation",
    description: "Isolated validation", repo_name: "test/writer-validation" });
  const foreign = await client.createProject({ name: "Other project",
    description: "Independent resource destination", repo_name: "test/writer-other" });
  const memory = await client.create({ title: "Architecture", content: "The API serves requests.",
    context: "Settled work", keywords: ["api"], tags: [], project_ids: [project.id] });
  const writer = new KnowledgeWriter(client.knowledge, (id, signal) => client.get(id, signal));
  const plan: KnowledgeWritePlan = {
    operationId: "writer-validation", projectId: project.id, memoryId: memory.id,
    entities: [{ key: "api", input: { name: "API", entity_type: "System", aka: [],
      tags: [], project_ids: [project.id] } }],
    documents: [{ key: "guide", input: { title: "Guide", description: "API guide",
      content: "Call the API.", tags: [], project_id: project.id } }],
    codeArtifacts: [{ key: "call", input: { title: "Call", description: "API call",
      code: "call()", language: "typescript", tags: [], project_id: project.id } }],
  };
  return { baseUrl, client, project, foreign, memory, writer, plan };
}

function snapshot(project: { id: number; name: string }): CaptureSnapshot {
  return {
    id: "writer-snapshot", instanceId: "writer-validation",
    context: { cwd: "/repo", repoName: "test/writer-validation", project,
      sessionId: "writer-session", branchId: "writer-branch" },
    entries: [
      { id: "user", role: "user", text: "The API depends on the database." },
      { id: "assistant", role: "assistant", text: "The architecture is recorded." },
    ],
    finalEntryId: "assistant", mode: "auto", scope: "global",
    policy: "Capture durable architecture decisions.", modelVersion: "writer-test",
    createdAt: new Date().toISOString(),
  };
}

test("writer lets REST decide resource scope and attachments on shared obsolete memories",
  realOptions, async (t) => {
    // Arrange: neither memory nor resources belong to the writer's destination project.
    const { client, foreign, memory, plan, writer } = await setup(t);
    const third = await client.createProject({ name: "Third", description: "Shared ownership",
      repo_name: "test/writer-third" });
    await client.knowledge.updateMemory(memory.id, {
      project_ids: [foreign.id, third.id],
    });
    const replacement = await client.create({ title: "Revised architecture",
      content: "The API serves requests through a gateway.", context: "Later work",
      keywords: ["api"], tags: [], project_ids: [foreign.id, third.id] });
    await client.supersede(memory.id, replacement.id, "A later decision replaces this one.");
    plan.entities![0]!.input.project_ids = [foreign.id];
    plan.documents![0]!.input.project_id = foreign.id;
    plan.codeArtifacts![0]!.input.project_id = foreign.id;
    plan.attachResources = true;

    // Act.
    const saved = await writer.execute(plan);

    // Assert through the actual service: fields arrive unchanged and attachments are accepted.
    assert.deepEqual((await client.knowledge.getEntity(saved.entities[0]!.id)).project_ids,
      [foreign.id]);
    assert.equal((await client.knowledge.getDocument(saved.documents[0]!.id)).project_id,
      foreign.id);
    assert.equal((await client.knowledge.getCodeArtifact(saved.codeArtifacts[0]!.id)).project_id,
      foreign.id);
    const stored = await client.get(memory.id);
    assert.equal(stored.is_obsolete, true);
    assert.deepEqual(stored.document_ids, [saved.documents[0]!.id]);
    assert.deepEqual(stored.code_artifact_ids, [saved.codeArtifacts[0]!.id]);
  });

test("writer accepts local plan IDs and duplicate keys without recreating completed resources",
  realOptions, async (t) => {
    // Arrange: local metadata does not affect these independent resource payloads.
    const { client, writer, plan, foreign } = await setup(t);
    plan.operationId = "";
    plan.projectId = 0;
    plan.memoryId = -1;
    plan.entities!.push(structuredClone(plan.entities![0]!));

    // Act: change the whole instruction after saving receipts, keeping stable resource keys.
    const saved = await writer.execute(plan);
    plan.operationId = "corrected-operation";
    plan.projectId = foreign.id;
    plan.memoryId = 0;
    plan.entities![0]!.input.name = "Corrected proposal for a completed create";
    const resumed = await writer.execute(plan, JSON.parse(JSON.stringify(saved)));
    const legacy = structuredClone(resumed);
    delete legacy.instructionId;
    const legacyResumed = await writer.execute(plan, legacy);

    // Assert: changing proposed fields or a missing legacy hash cannot replay completed creates.
    assert.deepEqual(resumed.entities, saved.entities);
    assert.deepEqual(legacyResumed.entities, saved.entities);
    assert.equal(saved.entities.length, 2);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 2);
    assert.equal((await client.knowledge.searchEntities("Corrected proposal", 10)).length, 0);
    assert.equal((await client.knowledge.listDocuments()).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts()).length, 1);
  });

test("REST 400 resource correction survives queue restart and keeps every completed receipt",
  realOptions, async (t) => {
    // Arrange: REST rejects an overlong document title after earlier creates have completed.
    const { client, project, plan, writer } = await setup(t);
    plan.entities!.push({ key: "db", input: { ...plan.entities![0]!.input, name: "Database" } });
    plan.documents!.push({ key: "reference", input: { ...plan.documents![0]!.input,
      title: "x".repeat(501) } });
    const directory = await mkdtemp(join(tmpdir(), "validation-writer-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    const queued = await queue.enqueue(snapshot(project));
    const checkpoint = async (knowledgeState: KnowledgeWriteState) => {
      await queue.checkpoint(queued.jobId, "fact", { stage: "knowledge-partial", knowledgeState });
    };

    // Act: retrieve the actual HTTP validation error, restart, and correct the rejected title.
    await assert.rejects(writer.execute(plan, {}, checkpoint), (error) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.equal(error.status, 400);
      assert.match(error.responseBody!, /title/);
      assert.match(error.responseBody!, /string_too_long/);
      return true;
    });
    const restarted = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    const job = (await restarted.getJob(queued.jobId))!;
    const previous = (job.candidateOutcomes.fact as { knowledgeState: KnowledgeWriteState })
      .knowledgeState;
    assert.equal(previous.pendingCreates?.length ?? 0, 0);
    plan.documents![1]!.input.title = "Reference";
    plan.operationId = "corrected-operation";
    const saved = await writer.execute(plan, previous);

    // Assert: corrected creation succeeds, while all previous resource IDs stay intact.
    assert.deepEqual(saved.entities, previous.entities);
    assert.deepEqual(saved.documents[0], previous.documents[0]);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.searchEntities("Database", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments()).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts()).length, 1);
    assert.equal((await client.knowledge.getDocument(saved.documents[1]!.id)).title, "Reference");
  });

test("uncertain resource creates stay blocked after changed instructions and queue restart",
  realOptions, async (t) => {
    // Arrange: REST accepts a document, but the response is lost after completed entity receipts.
    const { baseUrl, client, project, plan, writer } = await setup(t);
    const lost = new ForgetfulHttpError("HTTP 503: lost accepted response", 503, "lost response");
    const interrupted = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/documents")) throw lost;
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "validation-writer-uncertain-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    const queued = await queue.enqueue(snapshot(project));
    const failing = new KnowledgeWriter(interrupted.knowledge, (id) => interrupted.get(id));
    await assert.rejects(failing.execute(plan, {}, async (knowledgeState) => {
      await queue.checkpoint(queued.jobId, "fact", { stage: "knowledge-partial", knowledgeState });
    }), (error) => error === lost);

    // Act: change the instruction, operation ID and resource key before resuming saved receipts.
    const restarted = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    const job = (await restarted.getJob(queued.jobId))!;
    const previous = (job.candidateOutcomes.fact as { knowledgeState: KnowledgeWriteState })
      .knowledgeState;
    plan.operationId = "corrected-operation";
    plan.documents![0]!.key = "renamed-guide";
    plan.documents![0]!.input.title = "Corrected title";
    await assert.rejects(writer.execute(plan, previous), /unknown/i);

    // Assert: the uncertain create was never repeated, and its prior successes remain durable.
    assert.equal(previous.pendingCreates!.length, 1);
    assert.equal(previous.entities.length, 1);
    assert.equal((await client.knowledge.listDocuments()).length, 1);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts()).length, 0);
  });

test("writer permits selected relationships with different endpoints and direct server endpoints",
  realOptions, async (t) => {
    // Arrange: the selected relationship differs from both requested entity bindings.
    const { client, plan, writer, foreign } = await setup(t);
    const source = await client.knowledge.createEntity(plan.entities![0]!.input);
    const target = await client.knowledge.createEntity({ ...plan.entities![0]!.input,
      name: "Database", project_ids: [foreign.id] });
    const selected = await client.knowledge.createRelationship({ source_entity_id: source.id,
      target_entity_id: target.id, relationship_type: "depends_on" });
    plan.documents = [];
    plan.codeArtifacts = [];
    plan.entities = [{ ...plan.entities![0]!, existingId: target.id }];
    plan.relationships = [
      { key: "selected", existingId: selected.id, sourceEntityKey: "missing-source",
        targetEntityKey: "api", input: { source_entity_id: target.id, target_entity_id: source.id,
          relationship_type: "selected_only" } },
      { key: "direct", sourceEntityKey: "direct-source", targetEntityKey: "direct-target",
        input: { source_entity_id: source.id, target_entity_id: target.id,
          relationship_type: "connects_to" } },
    ];

    // Act.
    const saved = await writer.execute(plan);

    // Assert: selection neither rewrites endpoints nor rejects explicit server field values.
    assert.equal(saved.relationships[0]!.id, selected.id);
    const relationships = await client.knowledge.getRelationships(source.id);
    assert.equal(relationships.length, 2);
    assert.ok(relationships.some((item) => item.relationship_type === "depends_on"));
    assert.ok(relationships.some((item) => item.relationship_type === "connects_to"));
  });

test("writer forwards proposed resource and link IDs to REST validation",
  realOptions, async (t) => {
    // Arrange: each field is server-owned, including attachment IDs and link endpoints.
    const { writer, plan } = await setup(t);
    const invalid: KnowledgeWritePlan[] = [
      { ...plan, entities: [{ ...plan.entities![0]!, existingId: -1 }],
        documents: [], codeArtifacts: [] },
      { ...plan, entities: [], documents: [{ ...plan.documents![0]!, existingId: -1 }],
        codeArtifacts: [] },
      { ...plan, entities: [], documents: [], codeArtifacts: [], attachResources: true,
        existingDocumentIds: [-1], existingCodeArtifactIds: [-1] },
      { ...plan, entities: [], documents: [], codeArtifacts: [], linkedMemoryIds: [-1] },
      { ...plan, entities: [], documents: [], codeArtifacts: [],
        entityMemoryLinks: [{ entityKey: "unbound" }] },
    ];

    // Act / Assert: each actual REST error reaches the caller without a local interpretation.
    for (const proposed of invalid) {
      await assert.rejects(writer.execute(proposed), (error) => {
        if (proposed.linkedMemoryIds) {
          assert.ok(error instanceof ForgetfulSchemaError);
          assert.match(error.message, /did not confirm all requested memory links/);
          return true;
        }
        assert.ok(error instanceof ForgetfulHttpError, String(error));
        assert.ok(error.status! >= 400);
        assert.ok(error.responseBody!.length > 0);
        return true;
      });
    }
  });

test("CaptureService corrects REST resources after restart without repeating completed writes",
  realOptions, async (t) => {
    // Arrange: resource failure occurs after the memory and entity have been saved.
    const { client, project, plan } = await setup(t);
    const directory = await mkdtemp(join(tmpdir(), "validation-writer-capture-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    const rejected = {
      id: "fact", title: "Capture architecture", content: "The API depends on the database.",
      context: "The completed turn established system boundaries.", keywords: ["api"], tags: [],
      sourceEntryIds: ["user"], evidenceType: "userDecision",
      entities: [{ key: "api", sourceEntryIds: ["user"], input: plan.entities![0]!.input }],
      documents: [{ key: "guide", sourceEntryIds: ["user"],
        input: { ...plan.documents![0]!.input, title: "x".repeat(501) } }],
    };
    const corrected = structuredClone(rejected);
    corrected.title = "Corrected proposal for an already saved memory";
    corrected.entities[0]!.input.name = "Corrected proposal for an already saved entity";
    corrected.documents[0]!.input.title = "Corrected guide";
    let correctionInput: unknown;
    const calls: string[] = [];
    const model = { async complete(request: ModelRequest) {
      const name = request.submission!.name;
      calls.push(name);
      let response: unknown;
      if (name === "submit_capture_candidates") response = { candidates: [rejected] };
      else if (name === "submit_capture_decision") response = { action: "create" };
      else if (name === "submit_capture_correction") {
        correctionInput = request.input;
        response = { candidate: corrected };
      } else if (name === "submit_capture_links") {
        response = { reviews: (request.input as any).candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
            memoryId: memory.id, action: "ignore", reason: "Independent architecture context." })),
        })) };
      } else throw new Error(`Unexpected submission: ${name}`);
      assert.ok(Value.Check(request.submission!.parameters as any, response));
      request.submission!.validate(response);
      return response;
    } };
    let capture = new CaptureService({ instanceId: "writer-validation", queue, client, model });

    // Act: checkpoint the rejected fields, then resume from a new service and queue instance.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const partial = (await queue.getJob(queued.jobId))!.candidateOutcomes.fact as any;
    assert.match(partial.executionFailure, /HTTP 400/);
    assert.equal(partial.knowledgeState.entities.length, 1);
    assert.equal(partial.knowledgeState.pendingCreates?.length ?? 0, 0);
    const restarted = new DurableQueueStore({ directory, instanceId: "writer-validation" });
    capture = new CaptureService({
      instanceId: "writer-validation", queue: restarted, client, model,
    });
    await capture.checkpoint();

    // Assert: the model receives actual server details and prior receipts; only failed fields save.
    assert.match(JSON.stringify(correctionInput), /HTTP 400/);
    assert.match(JSON.stringify(correctionInput), /string_too_long/);
    assert.match(JSON.stringify(correctionInput), /title/);
    assert.equal(calls.filter((name) => name === "submit_capture_correction").length, 1);
    const complete = (await restarted.getJob(queued.jobId))!;
    assert.equal(complete.status, "complete", complete.lastError);
    assert.equal((await client.get(partial.memoryId)).title, "Capture architecture");
    assert.equal((await client.knowledge.getEntity(partial.knowledgeState.entities[0].id)).name,
      "API");
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    const documents = await client.knowledge.listDocuments();
    assert.equal(documents.length, 1);
    assert.equal(documents[0]!.title, "Corrected guide");
    assert.deepEqual((await client.get(partial.memoryId)).document_ids, [documents[0]!.id]);
    const memories = await client.search({ query: "API", query_context: "Duplicate protection",
      project_ids: [project.id], strict_project_filter: true, k: 20 });
    assert.equal(memories.length, 2, "Only the setup memory and one captured memory exist");
  });

test("HTTP 422 clears only a rejected create and returns its exact diagnostic for correction",
  async (t) => {
    // Arrange: use the real HTTP adapter with an external service returning a field rejection.
    const diagnostic = '{"detail":[{"loc":["body","name"],"msg":"Required service field"}]}';
    const bodies: unknown[] = [];
    const server = createServer(async (request, response) => {
      let text = "";
      for await (const chunk of request) text += chunk;
      const body = JSON.parse(text);
      bodies.push(body);
      response.writeHead(bodies.length === 1 ? 422 : 201, { "content-type": "application/json" });
      response.end(bodies.length === 1 ? diagnostic : JSON.stringify({ ...body, id: 17 }));
    });
    t.after(() => new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    }));
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const client = new ApiForgetfulClient({ baseUrl: `http://127.0.0.1:${address.port}/api/v1` });
    const writer = new KnowledgeWriter(client.knowledge);
    const plan: KnowledgeWritePlan = {
      operationId: "field-correction", projectId: 7, memoryId: 5,
      entities: [{ key: "api", input: { entity_type: "System", project_ids: [7] } as any }],
    };
    let previous: Partial<KnowledgeWriteState> = {};

    // Act: the original error is preserved; corrected fields can resume the same resource key.
    await assert.rejects(writer.execute(plan, {}, async (state) => { previous = state; }),
      (error) => {
        assert.ok(error instanceof ForgetfulHttpError);
        assert.equal(error.status, 422);
        assert.equal(error.responseBody, diagnostic);
        assert.match(error.message, /Required service field/);
        return true;
      });
    assert.equal(previous.pendingCreates?.length ?? 0, 0);
    plan.entities![0]!.input.name = "API";
    const corrected = await writer.execute(plan, previous);

    // Assert: no defaults, cleaning or substitutions were added to either server payload.
    assert.deepEqual(bodies, [
      { entity_type: "System", project_ids: [7] },
      { entity_type: "System", project_ids: [7], name: "API" },
    ]);
    assert.deepEqual(corrected.entities, [{ key: "api", id: 17 }]);
  });

test("writer checks live permission after the asynchronous guard and before the service mutation",
  async () => {
    // Arrange: permission changes while the capture guard is awaited.
    let allowed = true;
    let calls = 0;
    const denied = new Error("Write permission changed");
    const external = { async createEntity(input: any) {
      calls += 1;
      return { ...input, id: 17 };
    } } as ConstructorParameters<typeof KnowledgeWriter>[0];
    const writer = new KnowledgeWriter(external, undefined, () => {
      if (!allowed) throw denied;
    });
    const plan: KnowledgeWritePlan = { operationId: "live-permission", projectId: 7, memoryId: 5,
      entities: [{ key: "api", input: { name: "API", entity_type: "System", aka: [], tags: [],
        project_ids: [7] } }] };
    let previous: Partial<KnowledgeWriteState> = {};

    // Act / Assert: no service call occurs, and no uncertain marker blocks a permitted retry.
    await assert.rejects(writer.execute(plan, {}, async (state) => { previous = state; },
      undefined, async () => { allowed = false; }), (error) => error === denied);
    assert.equal(calls, 0);
    assert.equal(previous.pendingCreates?.length ?? 0, 0);
    allowed = true;
    const saved = await writer.execute(plan, previous);
    assert.equal(calls, 1);
    assert.deepEqual(saved.entities, [{ key: "api", id: 17 }]);
  });

test("invalid successful resource IDs retain the uncertain marker and cannot replay",
  async () => {
    // Arrange: the external create returns success without a usable receipt ID.
    let calls = 0;
    const external = { async createEntity(input: any) {
      calls += 1;
      return { ...input, id: 0 };
    } } as ConstructorParameters<typeof KnowledgeWriter>[0];
    const writer = new KnowledgeWriter(external);
    const plan: KnowledgeWritePlan = { operationId: "invalid-receipt", projectId: 7, memoryId: 5,
      entities: [{ key: "api", input: { name: "API", entity_type: "System", aka: [], tags: [],
        project_ids: [7] } }] };
    let previous: Partial<KnowledgeWriteState> = {};

    // Act: preserve the write-ahead receipt instead of treating a corrupt success as rejection.
    await assert.rejects(writer.execute(plan, {}, async (state) => { previous = state; }),
      /Invalid knowledge ID/);
    plan.entities![0]!.input.name = "Corrected proposal";
    await assert.rejects(writer.execute(plan, previous), /unknown/i);

    // Assert: a service success without a valid receipt never earns a completed create or replay.
    assert.equal(calls, 1);
    assert.equal(previous.pendingCreates!.length, 1);
    assert.deepEqual(previous.entities, []);
  });
