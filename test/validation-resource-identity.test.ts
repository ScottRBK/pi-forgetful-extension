import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";
import {
  KnowledgeWriter, type KnowledgeWritePlan, type KnowledgeWriteState,
} from "../src/knowledge-write.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

function snapshot(project: { id: number; name: string }): CaptureSnapshot {
  return {
    id: "resource-identity", instanceId: "resource-identity",
    context: { cwd: "/repo", repoName: "test/resource-identity", project,
      sessionId: "resource-session", branchId: "resource-branch" },
    entries: [
      { id: "user", role: "user", text: "The API and worker depend on the database." },
      { id: "assistant", role: "assistant", text: "The architecture is recorded." },
    ],
    finalEntryId: "assistant", mode: "auto", scope: "global",
    policy: "Capture durable architecture decisions.", modelVersion: "resource-test",
    createdAt: new Date().toISOString(),
  };
}

test("duplicate resource slots survive capture correction and queue restart without replay",
  realOptions, async (t) => {
    // Arrange: REST rejects the second guide after distinct entities and the first guide save.
    const baseUrl = await startForgetful(t);
    const mutations: string[] = [];
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        if (init?.method && init.method !== "GET") mutations.push(`${init.method} ${url}`);
        return fetch(url, init);
      } });
    const project = await client.createProject({ name: "Resource identity",
      description: "Isolated resource regression", repo_name: "test/resource-identity" });
    const directory = await mkdtemp(join(tmpdir(), "forgetful-resource-identity-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const proposed = {
      id: "fact", title: "Architecture", content: "The API and worker depend on the database.",
      context: "The completed turn established system boundaries.", keywords: ["api"], tags: [],
      sourceEntryIds: ["user"], evidenceType: "userDecision",
      entities: [
        { key: "system", input: { name: "API", entity_type: "System" } },
        { key: "system", input: { name: "Worker", entity_type: "System" } },
        { key: "database", input: { name: "Database", entity_type: "System" } },
      ],
      documents: [
        { key: "guide", input: { title: "First guide", description: "API guide",
          content: "Call the API." } },
        { key: "guide", input: { title: "x".repeat(501), description: "Worker guide",
          content: "Run the worker." } },
      ],
      codeArtifacts: [
        { key: "handler", input: { title: "API call", description: "API example",
          code: "api()", language: "typescript" } },
        { key: "handler", input: { title: "Worker call", description: "Worker example",
          code: "worker()", language: "typescript" } },
      ],
      relationships: [
        { key: "dependency", sourceEntityKey: "system", targetEntityKey: "database",
          input: { relationship_type: "depends_on" } },
        { key: "dependency", sourceEntityKey: "system", targetEntityKey: "database",
          input: { relationship_type: "communicates_with" } },
      ],
    };
    const corrected = structuredClone(proposed);
    corrected.entities[0]!.input.name = "Changed completed proposal";
    corrected.documents[0]!.input.title = "Changed completed guide";
    corrected.documents[1]!.input.title = "Second guide";
    let correctionInput: unknown;
    const model = { async complete(request: ModelRequest) {
      const name = request.submission!.name;
      let response: unknown;
      if (name === "submit_capture_candidates") response = { candidates: [proposed] };
      else if (name === "submit_capture_decision") {
        response = { action: "create", entityMemoryKeys: ["system", "database"] };
      } else if (name === "submit_capture_correction") {
        correctionInput = request.input;
        response = { candidate: corrected };
      } else if (name === "submit_capture_links") {
        response = { reviews: (request.input as { candidates: { candidateId: string }[] })
          .candidates.map((item) => ({ candidateId: item.candidateId, decisions: [] })) };
      } else throw new Error(`Unexpected submission: ${name}`);
      request.submission!.validate(response);
      return response;
    } };
    const capture = new CaptureService({ instanceId: "resource-identity", queue, client, model });

    // Act: save partial progress, reconstruct the queue/service, then correct the failed slot.
    const queued = await capture.enqueue(snapshot(project));
    await capture.checkpoint();
    const partial = (await queue.getJob(queued.jobId))!.candidateOutcomes.fact as {
      executionFailure?: string; memoryId: number; knowledgeState: KnowledgeWriteState;
    };
    assert.match(String(partial.executionFailure), /HTTP 400/);
    assert.equal(partial.knowledgeState.entities.length, 3);
    assert.equal(partial.knowledgeState.documents.length, 1);
    assert.equal(partial.knowledgeState.pendingCreates?.length ?? 0, 0);
    const restarted = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    await new CaptureService({ instanceId: "resource-identity", queue: restarted, client, model })
      .checkpoint();

    // Assert via REST: every requested create/attachment exists once; completed slots keep IDs.
    assert.equal((await restarted.getJob(queued.jobId))!.status, "complete");
    assert.match(JSON.stringify(correctionInput), /HTTP 400/);
    assert.match(JSON.stringify(correctionInput), /string_too_long/);
    const api = (await client.knowledge.searchEntities("API", 10))[0]!;
    const worker = (await client.knowledge.searchEntities("Worker", 10))[0]!;
    const database = (await client.knowledge.searchEntities("Database", 10))[0]!;
    assert.equal(api.id, partial.knowledgeState.entities[0]!.id);
    assert.equal(worker.id, partial.knowledgeState.entities[1]!.id);
    assert.equal(database.id, partial.knowledgeState.entities[2]!.id);
    assert.equal((await client.knowledge.searchEntities("Changed completed", 10)).length, 0);
    const documents = await client.knowledge.listDocuments(project.id);
    assert.deepEqual(documents.map((item) => item.title).sort(), ["First guide", "Second guide"]);
    assert.ok(documents.some((item) => item.id === partial.knowledgeState.documents[0]!.id));
    const artifacts = await client.knowledge.listCodeArtifacts(project.id);
    assert.deepEqual(artifacts.map((item) => item.title).sort(), ["API call", "Worker call"]);
    const memory = await client.get(partial.memoryId);
    assert.deepEqual(memory.document_ids!.slice().sort(), documents.map((item) => item.id).sort());
    assert.deepEqual(memory.code_artifact_ids!.slice().sort(),
      artifacts.map((item) => item.id).sort());
    const relationships = await client.knowledge.getRelationships(api.id);
    assert.deepEqual(relationships.map((item) => item.relationship_type).sort(),
      ["communicates_with", "depends_on"]);
    assert.ok(relationships.every((item) => item.target_entity_id === database.id));
    // Ambiguous model keys retain their first binding; the second entity is still created.
    assert.equal((await client.knowledge.getRelationships(worker.id)).length, 0);
    assert.ok((await client.knowledge.getEntityMemories(api.id))
      .some((item) => item.id === memory.id));
    assert.equal((await client.knowledge.getEntityMemories(worker.id)).length, 0);
    assert.equal(mutations.filter((url) => url.endsWith("/entities")).length, 3);
    assert.equal(mutations.filter((url) => url.endsWith("/documents")).length, 3);
    assert.equal(mutations.filter((url) => url.endsWith("/code-artifacts")).length, 2);
    const before = mutations.length;
    const completeQueue = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    await new CaptureService({
      instanceId: "resource-identity", queue: completeQueue, client, model,
    })
      .checkpoint();
    assert.equal(mutations.length, before, "A completed capture is never replayed after restart");
  });

test("legacy first-slot receipts coexist with duplicates and arbitrary model keys after restart",
  realOptions, async (t) => {
    // Arrange: ordinary single-key receipts predate occurrence metadata and instruction hashes.
    const baseUrl = await startForgetful(t);
    const mutations: string[] = [];
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method && init.method !== "GET") mutations.push(`${init.method} ${url}`);
      return fetch(url, init);
    } });
    const project = await client.createProject({ name: "Legacy resource identity",
      description: "Isolated legacy regression", repo_name: "test/resource-identity" });
    const memory = await client.create({ title: "Architecture", content: "The API serves requests.",
      context: "Settled work", keywords: ["api"], tags: [], project_ids: [project.id] });
    const target = await client.knowledge.createEntity({ name: "Database", entity_type: "System",
      project_ids: [project.id], tags: [], aka: [] });
    const plan: KnowledgeWritePlan = {
      operationId: "legacy", projectId: project.id, memoryId: memory.id,
      entities: [{ key: "api", input: { name: "API", entity_type: "System",
        project_ids: [project.id], tags: [], aka: [] } }],
      documents: [{ key: "guide", input: { title: "First guide", description: "API guide",
        content: "Call the API.", project_id: project.id, tags: [] } }],
      codeArtifacts: [{ key: "call", input: { title: "First call", description: "API call",
        code: "api()", language: "typescript", project_id: project.id, tags: [] } }],
      relationships: [{ key: "dependency", sourceEntityKey: "api", targetEntityKey: "explicit",
        input: { source_entity_id: 0, target_entity_id: target.id,
          relationship_type: "depends_on" } }],
    };
    const writer = new KnowledgeWriter(client.knowledge, (id) => client.get(id));
    const legacy = await writer.execute(plan);
    delete legacy.instructionId;
    for (const kind of ["entities", "documents", "codeArtifacts", "relationships"] as const) {
      assert.deepEqual(Object.keys(legacy[kind][0]!).sort(), ["id", "key"]);
    }
    const directory = await mkdtemp(join(tmpdir(), "forgetful-resource-legacy-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const queued = await queue.enqueue(snapshot(project));
    // Older object-map receipts must also remain usable alongside the current array format.
    const persisted = { ...legacy, documents: { guide: legacy.documents[0]!.id } };
    await queue.checkpoint(queued.jobId, "fact", { knowledgeState: persisted });
    plan.entities!.push(structuredClone(plan.entities![0]!));
    plan.documents!.push({ ...plan.documents![0]!, input: { ...plan.documents![0]!.input,
      title: "Second guide" } });
    plan.documents!.push({ ...plan.documents![0]!, key: '["guide",1]',
      input: { ...plan.documents![0]!.input, title: "Literal key guide" } });
    plan.codeArtifacts!.push({ ...plan.codeArtifacts![0]!, input: {
      ...plan.codeArtifacts![0]!.input, title: "Second call", code: "worker()" } });
    plan.relationships!.push({ ...plan.relationships![0]!, input: {
      ...plan.relationships![0]!.input, relationship_type: "communicates_with" } });
    plan.operationId = "corrected";
    plan.attachResources = true;

    // Act: resume legacy progress, checkpoint all duplicate slots, then change completed payloads.
    const restarted = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const previous = (await restarted.getJob(queued.jobId))!.candidateOutcomes.fact as {
      knowledgeState: KnowledgeWriteState;
    };
    const saved = await writer.execute(plan, previous.knowledgeState, async (knowledgeState) => {
      await restarted.checkpoint(queued.jobId, "fact", { knowledgeState });
    });
    const before = mutations.length;
    plan.operationId = "another-correction";
    plan.entities![1]!.input.name = "Changed completed duplicate";
    plan.documents![1]!.input.title = "Changed completed duplicate guide";
    plan.codeArtifacts![1]!.input.code = "changed()";
    plan.relationships![1]!.input.relationship_type = "changed_relationship";
    const restored = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const completed = (await restored.getJob(queued.jobId))!.candidateOutcomes.fact as {
      knowledgeState: KnowledgeWriteState;
    };
    const resumed = await writer.execute(plan, completed.knowledgeState);

    // Assert: completed slots, including identical payloads, survive without repeated operations.
    for (const kind of ["entities", "documents", "codeArtifacts", "relationships"] as const) {
      assert.equal(saved[kind][0]!.id, legacy[kind][0]!.id);
      assert.deepEqual(resumed[kind], saved[kind]);
      assert.notEqual(saved[kind][0]!.id, saved[kind][1]!.id);
    }
    assert.equal(mutations.length, before);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 2);
    assert.equal((await client.knowledge.searchEntities("Changed completed", 10)).length, 0);
    assert.equal((await client.knowledge.listDocuments(project.id)).length, 3);
    assert.equal((await client.knowledge.listCodeArtifacts(project.id)).length, 2);
    assert.equal((await client.knowledge.getRelationships(legacy.entities[0]!.id)).length, 2);
    const attached = await client.get(memory.id);
    assert.deepEqual(attached.document_ids!.slice().sort(),
      saved.documents.map((r) => r.id).sort());
    assert.deepEqual(attached.code_artifact_ids!.slice().sort(),
      saved.codeArtifacts.map((r) => r.id).sort());
  });

test("an uncertain second duplicate create retains its marker and blocks replay after restart",
  realOptions, async (t) => {
    // Arrange: the service accepts both guides, but the second response is lost.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Uncertain duplicate",
      description: "Isolated uncertain regression", repo_name: "test/resource-identity" });
    const memory = await client.create({ title: "Architecture", content: "The API serves requests.",
      context: "Settled work", keywords: ["api"], tags: [], project_ids: [project.id] });
    const directory = await mkdtemp(join(tmpdir(), "forgetful-resource-uncertain-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const queued = await queue.enqueue(snapshot(project));
    const lost = new ForgetfulHttpError("HTTP 503: accepted response lost", 503, "Raw diagnostic");
    let creates = 0;
    const interrupted = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/documents")) {
        creates += 1;
        if (creates === 2) throw lost;
      }
      return response;
    } });
    const writer = new KnowledgeWriter(interrupted.knowledge, (id) => interrupted.get(id));
    const plan: KnowledgeWritePlan = {
      operationId: "uncertain", projectId: project.id, memoryId: memory.id,
      documents: ["First guide", "Second guide"].map((title) => ({ key: "guide",
        input: { title, description: "Architecture guide", content: "Call the API.",
          project_id: project.id, tags: [] } })),
    };

    // Act: checkpoint the uncertainty, restart, and attempt a changed instruction.
    await assert.rejects(writer.execute(plan, {}, async (knowledgeState) => {
      await queue.checkpoint(queued.jobId, "fact", { knowledgeState });
    }), (error) => error === lost);
    const restarted = new DurableQueueStore({ directory, instanceId: "resource-identity" });
    const previous = (await restarted.getJob(queued.jobId))!.candidateOutcomes.fact as {
      knowledgeState: KnowledgeWriteState;
    };
    const before = structuredClone(previous.knowledgeState);
    plan.operationId = "changed-operation";
    plan.documents![1]!.key = "changed-key";
    plan.documents![1]!.input.title = "Corrected uncertain guide";
    await assert.rejects(writer.execute(plan, previous.knowledgeState), /unknown/i);

    // Assert: the completed first receipt and pending second receipt are never discarded/replayed.
    assert.deepEqual(previous.knowledgeState, before);
    assert.equal(before.documents.length, 1);
    assert.equal(before.pendingCreates!.length, 1);
    assert.equal(creates, 2);
    assert.equal((await client.knowledge.listDocuments(project.id)).length, 2);
    assert.equal((await client.get(memory.id)).document_ids?.length ?? 0, 0);
  });
