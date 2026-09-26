import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CaptureService } from "../src/capture.ts";
import type {
  CaptureSnapshot,
  CaptureMode,
  CodeArtifact,
  Document,
  Entity,
  EntityInput,
  EntityRelationship,
  MemoryModelClient,
  ModelRequest,
} from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { KnowledgeWriter } from "../src/knowledge-write.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

function snapshot(
  id: string,
  entryId: string,
  text: string,
  projectId: number,
  mode: CaptureMode = "auto",
): CaptureSnapshot {
  return {
    id,
    context: {
      cwd: "/repo",
      repoName: "example/repo",
      project: { id: projectId, name: "Example" },
      sessionId: `session-${id}`,
      branchId: `branch-${id}`,
    },
    instanceId: "instance-rich",
    entries: [
      { id: entryId, role: "user", text },
      {
        id: `${id}-assistant`,
        role: "assistant",
        text: "The architecture was recorded.",
      },
    ],
    finalEntryId: `${id}-assistant`,
    mode,
    scope: "global",
    policy: "Capture durable project knowledge.",
    modelVersion: "memory-model-v1",
    createdAt: new Date().toISOString(),
  };
}

function richCandidate(
  entryId: string,
  candidateId = "rich-candidate",
  entityKey = "api",
): Record<string, unknown> {
  return {
    id: candidateId,
    title: "API architecture",
    content: "The API depends on the database.",
    context: "The completed turn established the system boundaries.",
    keywords: ["api", "database"],
    tags: ["architecture"],
    sourceEntryIds: [entryId],
    files: [
      {
        filename: "secret.txt",
        content: "This must never be stored by capture.",
        sourceEntryIds: [entryId],
      },
    ],
    entities: [
      {
        key: entityKey,
        sourceEntryIds: [entryId],
        input: {
          name: "API",
          entity_type: "System",
          tags: ["architecture"],
          aka: ["Gateway"],
          notes: "Handles requests.",
        },
      },
      {
        key: "database",
        sourceEntryIds: [entryId],
        input: {
          name: "Database",
          entity_type: "System",
          tags: ["storage"],
          aka: [],
        },
      },
    ],
    documents: [
      {
        key: "architecture",
        sourceEntryIds: [entryId],
        input: {
          title: "API architecture",
          description: "The request path.",
          content: "The API depends on the database.",
          document_type: "text",
          tags: ["architecture"],
        },
      },
    ],
    codeArtifacts: [
      {
        key: "handler",
        sourceEntryIds: [entryId],
        input: {
          title: "Request handler",
          description: "The request handler entry point.",
          code: "export function handle() {}",
          language: "typescript",
          tags: ["api"],
        },
      },
    ],
    relationships: [
      {
        key: "api-depends-on-database",
        sourceEntityKey: entityKey,
        targetEntityKey: "database",
        sourceEntryIds: [entryId],
        input: { relationship_type: "depends_on" },
      },
    ],
  };
}

function reviewConnections(request: ModelRequest): unknown {
  const input = request.input as { candidates: any[] };
  return { reviews: input.candidates.map((item) => ({ candidateId: item.candidateId,
    decisions: item.memories.map((memory: any) => ({ memoryId: memory.id,
      action: item.memory.linked_memory_ids.includes(memory.id) ? "keep" : "unresolved",
      reason: "Fixture retains existing connections; no additional relationship is evidenced." })),
    ...(item.previous ? { preservation: { status: "complete", documentIds: [],
      codeArtifactIds: [], entityIds: [], reason: "Old resources stay historical." }
    } : {}),
  })) };
}

function selectExistingResources(request: ModelRequest, entityKey = "api") {
  const { neighborhood } = request.input as { neighborhood: {
    entities: Entity[]; documents: Document[]; codeArtifacts: CodeArtifact[];
    relationships: EntityRelationship[];
  } };
  // This fixture makes the model's choice explicit; the executor must use the selected IDs.
  const api = neighborhood.entities.find((item) => item.name === "API");
  const database = neighborhood.entities.find((item) => item.name === "Database");
  assert.ok(api);
  assert.ok(database);
  assert.equal(api.notes, "Handles requests.");
  const document = neighborhood.documents[0]!;
  const artifact = neighborhood.codeArtifacts[0]!;
  const relationship = neighborhood.relationships[0]!;
  assert.equal(document.content, "The API depends on the database.");
  assert.equal(artifact.code, "export function handle() {}");
  assert.equal(relationship.source_entity_id, api.id);
  assert.equal(relationship.target_entity_id, database.id);
  return {
    entities: [{ key: entityKey, id: api.id }, { key: "database", id: database.id }],
    documents: [{ key: "architecture", id: document.id }],
    codeArtifacts: [{ key: "handler", id: artifact.id }],
    relationships: [{ key: "api-depends-on-database", id: relationship.id }],
  };
}

class RichModel implements MemoryModelClient {
  constructor(
    private readonly candidateId = "rich-candidate",
    private readonly entityKey = "api",
  ) {}

  async complete(request: ModelRequest): Promise<unknown> {
    if (request.submission?.name === "submit_capture_links") return reviewConnections(request);
    if (request.purpose === "capture") {
      const input = request.input as { entries?: Array<{ id: string }> };
      const entryId = input.entries?.[0]?.id ?? "missing-entry";
      return {
        candidates: [richCandidate(entryId, this.candidateId, this.entityKey)],
      };
    }
    const input = request.input as { overlaps?: Array<{ id: number }> };
    const overlap = input.overlaps?.[0];
    return overlap
      ? {
          action: "skip",
          memoryId: overlap.id, enrich: true,
          entityMemoryKeys: [this.entityKey, "database"],
          reuse: selectExistingResources(request, this.entityKey),
          reason: "The existing architecture memory is still current.",
        }
      : { action: "create", entityMemoryKeys: [this.entityKey, "database"],
          reason: "New architecture decision." };
  }
}

class SupersedingModel implements MemoryModelClient {
  private captureCount = 0;

  async complete(request: ModelRequest): Promise<unknown> {
    if (request.submission?.name === "submit_capture_links") return reviewConnections(request);
    if (request.purpose === "capture") {
      this.captureCount += 1;
      const input = request.input as { entries?: Array<{ id: string }> };
      const entryId = input.entries?.[0]?.id ?? "missing-entry";
      const candidate = richCandidate(
        entryId,
        `superseding-${this.captureCount}`,
      ) as Record<string, unknown>;
      if (this.captureCount > 1) {
        candidate.content = "The API now depends on the database v2.";
        const documents = candidate.documents as Array<Record<string, unknown>>;
        const documentInput = documents[0]?.input as Record<string, unknown>;
        documentInput.content = "The API now depends on the database v2.";
        const artifacts = candidate.codeArtifacts as Array<Record<string, unknown>>;
        const artifactInput = artifacts[0]?.input as Record<string, unknown>;
        artifactInput.code = "export function handleV2() {}";
      }
      return { candidates: [candidate] };
    }
    const input = request.input as {
      overlaps?: Array<{ id: number }>;
      evidenceEntries?: Array<{ id: string }>;
    };
    const overlap = input.overlaps?.[0];
    if (!overlap) return { action: "create", entityMemoryKeys: ["api", "database"],
      reason: "New architecture decision." };
    const reuse = selectExistingResources(request);
    return {
      action: "supersede", entityMemoryKeys: ["api", "database"],
      reuse: { entities: reuse.entities, relationships: reuse.relationships },
      conflictingMemoryId: overlap.id,
      oldClaim: "The API depends on the database.",
      newClaim: "The API now depends on the database v2.",
      sourceEntryIds: [input.evidenceEntries?.[0]?.id ?? "missing-entry"],
      reason: "The completed turn records a clear replacement.",
    };
  }
}

class EscalatingModel implements MemoryModelClient {
  private captureCount = 0;

  async complete(request: ModelRequest): Promise<unknown> {
    if (request.submission?.name === "submit_capture_links") return reviewConnections(request);
    if (request.submission?.name === "submit_memory_revision") {
      return request.submission.validate({ title: "Confirmed API architecture",
        content: "The API now depends on the database uncertainly.",
        context: "The originating session confirmed the database choice.",
        keywords: ["api", "database"], tags: ["architecture"], importance: 8,
        sourceEntryIds: ["later-user"], documentIds: [], codeArtifactIds: [],
        entityIds: [], memoryIds: [], fileIds: [], sourceFiles: [] });
    }
    if (request.purpose === "capture") {
      this.captureCount += 1;
      const input = request.input as { entries?: Array<{ id: string }> };
      const entryId = input.entries?.[0]?.id ?? "missing-entry";
      const candidate = richCandidate(
        entryId,
        `escalating-${this.captureCount}`,
      ) as Record<string, unknown>;
      if (this.captureCount > 1) {
        candidate.content = "The API now depends on the database uncertainly.";
        const documents = candidate.documents as Array<Record<string, unknown>>;
        const documentInput = documents[0]?.input as Record<string, unknown>;
        documentInput.content =
          "The API now depends on the database uncertainly.";
        const artifacts = candidate.codeArtifacts as Array<Record<string, unknown>>;
        const artifactInput = artifacts[0]?.input as Record<string, unknown>;
        artifactInput.code = "export function handleUncertainly() {}";
      }
      return { candidates: [candidate] };
    }
    const input = request.input as {
      overlaps?: Array<{ id: number }>;
      evidenceEntries?: Array<{ id: string }>;
    };
    const overlap = input.overlaps?.[0];
    if (!overlap) return { action: "create", entityMemoryKeys: ["api", "database"],
      reason: "New architecture decision." };
    return {
      action: "escalate",
      conflictingMemoryId: overlap.id,
      oldClaim: "The API depends on the database.",
      newClaim: "The API now depends on the database uncertainly.",
      sourceEntryIds: [input.evidenceEntries?.[0]?.id ?? "missing-entry"],
      reason: "The change needs confirmation in the originating session.",
    };
  }
}

async function createProject(client: ApiForgetfulClient): Promise<number> {
  const project = await client.createProject({
    name: "Example",
    description: "Rich capture test project",
    repo_name: "example/repo",
  });
  return project.id;
}

async function captureOnce(
  client: ApiForgetfulClient,
  directory: string,
  model: MemoryModelClient,
  value: CaptureSnapshot,
): Promise<void> {
  const queue = new DurableQueueStore({
    directory,
    instanceId: "instance-rich",
  });
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-rich",
  });
  const enqueued = await service.enqueue(value);
  await service.checkpoint();
  const job = await queue.getJob(enqueued.jobId);
  assert.equal(job?.status, "complete", job?.lastError);
}

test(
  "capture reuses model-selected full records through the queue and REST adapter",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-rich-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const model = new RichModel();

    await captureOnce(
      client,
      directory,
      model,
      snapshot(
        "first",
        "first-user",
        "The API depends on the database and uses the request handler.",
        projectId,
      ),
    );
    await captureOnce(
      client,
      directory,
      model,
      snapshot(
        "second",
        "second-user",
        "The API depends on the database and uses the request handler.",
        projectId,
      ),
    );

    const entities = await client.knowledge.searchEntities("Gateway", 10);
    const documents = await client.knowledge.listDocuments(projectId);
    const artifacts = await client.knowledge.listCodeArtifacts(projectId);
    const relationships = await client.knowledge.getRelationships(entities[0]!.id);
    const memories = await client.search({
      query: "API architecture database",
      query_context: "rich capture test",
      project_ids: [projectId],
      strict_project_filter: true,
      k: 10,
    });

    assert.equal(entities.length, 1);
    assert.equal(documents.length, 1);
    assert.equal(artifacts.length, 1);
    assert.equal(relationships.length, 1);
    assert.equal(memories.length, 1);
    assert.deepEqual(
      await client.knowledge.getEntityMemories(entities[0]!.id),
      [{ id: memories[0]!.id, title: memories[0]!.title }],
    );
  },
);

test(
  "knowledge writer follows explicit entity IDs despite identical names and aliases",
  realOptions,
  async (t) => {
    // Arrange: two same-name records are distinct choices, not an executor ambiguity.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const memory = await client.create({
      title: "Explicit entity identity", content: "The selected gateway handles requests.",
      context: "writer test", keywords: ["identity"], tags: ["test"],
      project_ids: [projectId],
    });
    const input: EntityInput = { name: "Gateway", entity_type: "System", tags: [], aka: ["API"],
      project_ids: [projectId] };
    const first = await client.knowledge.createEntity(input);
    const selected = await client.knowledge.createEntity({ ...input, notes: "Selected gateway." });
    const writer = new KnowledgeWriter(
      client.knowledge, (id, signal) => client.get(id, signal),
    );

    // Act: reuse exactly the second ID, then explicitly create despite matching records.
    const reused = await writer.execute({ operationId: "selected-entity", projectId,
      memoryId: memory.id, entities: [{ key: "gateway", existingId: selected.id,
        input: { ...input, notes: "Do not overwrite the selected record." } }],
      entityMemoryLinks: [{ entityKey: "gateway" }] });
    const created = await writer.execute({ operationId: "new-entity", projectId,
      memoryId: memory.id, entities: [{ key: "gateway", input }] });

    // Assert: labels neither select nor veto a resource; reuse leaves its contents intact.
    assert.deepEqual(reused.entities, [{ key: "gateway", id: selected.id }]);
    assert.notEqual(created.entities[0]!.id, selected.id);
    assert.notEqual(created.entities[0]!.id, first.id);
    assert.deepEqual(await client.getMemoryEntityIds(memory.id), [selected.id]);
    assert.equal((await client.knowledge.getEntity(selected.id)).notes, "Selected gateway.");
    assert.equal((await client.knowledge.searchEntities("Gateway", 10)).length, 3);
  },
);

test(
  "knowledge writer refuses a moved destination memory before rich writes",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const foreign = await client.createProject({
      name: "Foreign",
      description: "Foreign scope for destination validation",
      repo_name: "foreign/tools",
    });
    const memory = await client.create({
      title: "Moved destination memory",
      content: "The destination will move before the write.",
      context: "writer test",
      keywords: ["scope"],
      tags: ["test"],
      project_ids: [projectId],
    });
    await client.knowledge.updateMemory(memory.id, {
      project_ids: [foreign.id],
    });
    const writer = new KnowledgeWriter(
      client.knowledge,
      (id, signal) => client.get(id, signal),
    );

    await assert.rejects(
      writer.execute({
        operationId: "moved-destination",
        projectId,
        memoryId: memory.id,
        documents: [
          {
            key: "scope-document",
            input: {
              title: "Scope document",
              description: "A document that must not be written.",
              content: "The destination is outside the project.",
              tags: [],
              project_id: projectId,
            },
          },
        ],
      }),
      /Destination memory is outside the project/,
    );
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 0);
  },
);

test(
  "knowledge writer executes an explicit attachment after the destination claim changes",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const memory = await client.create({
      title: "Original destination claim",
      content: "The original claim is still expected.",
      context: "writer test",
      keywords: ["claim"],
      tags: ["test"],
      project_ids: [projectId],
    });
    await client.knowledge.updateMemory(memory.id, {
      title: "Changed destination claim",
    });
    const writer = new KnowledgeWriter(
      client.knowledge,
      (id, signal) => client.get(id, signal),
    );

    // Act: the selected destination remains authorized after a content edit.
    const state = await writer.execute({
      operationId: "changed-destination-claim", projectId, memoryId: memory.id,
      expectedClaim: {
        title: "Original destination claim", content: "The original claim is still expected.",
      },
      attachResources: true,
      documents: [{ key: "claim-document", input: {
        title: "Claim document", description: "An explicitly selected attachment.",
        content: "The claim changed during the pause.", tags: [], project_id: projectId,
      } }],
    });

    // Assert: claim equality is not an additional permission check.
    const current = await client.get(memory.id);
    assert.equal(current.title, "Changed destination claim");
    assert.deepEqual(current.document_ids, [state.documents[0]!.id]);
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 1);
  },
);

test(
  "capture reports an unknown create outcome without matching or duplicating rich writes",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    let droppedDocumentResponse = false;
    const fetchImpl: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      const url = String(input);
      if (
        !droppedDocumentResponse &&
        url.endsWith("/documents") &&
        init?.method === "POST"
      ) {
        droppedDocumentResponse = true;
        throw new Error("simulated lost document response");
      }
      return response;
    };
    const client = new ApiForgetfulClient({
      baseUrl,
      timeoutMs: 4_000,
      fetchImpl,
    });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-retry-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const richModel = new RichModel("token-service", "token-service");
    const failures: string[] = [];
    const model: MemoryModelClient = { complete: async (request) => {
      if (request.submission?.name === "submit_capture_retry") {
        const input = request.input as { outcome: { executionFailure: string } };
        failures.push(input.outcome.executionFailure);
        return { action: "stop",
          reason: "Reconcile the lost create response before trying again." };
      }
      return richModel.complete(request);
    } };
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-rich",
    });
    const service = new CaptureService({
      queue,
      client,
      model,
      instanceId: "instance-rich",
    });

    await service.enqueue(
      snapshot(
        "interrupted",
        "interrupted-user",
        "The API depends on the database and uses the request handler.",
        projectId,
      ),
    );
    await service.checkpoint();
    assert.equal(droppedDocumentResponse, true);
    const interrupted = (await queue.listJobs())[0]!;
    assert.equal(interrupted.status, "pending");
    assert.equal(failures.length, 0, "Failure review waits for the next checkpoint");

    await service.checkpoint();

    const job = (await queue.listJobs())[0]!;
    assert.equal(job.status, "complete");
    const outcome = job.candidateOutcomes["token-service"] as {
      stage: string; knowledgeState: unknown;
    };
    const previous = interrupted.candidateOutcomes["token-service"] as {
      knowledgeState: unknown;
    };
    assert.equal(outcome.stage, "execution-stopped");
    assert.deepEqual(outcome.knowledgeState, previous.knowledgeState);
    assert.equal(job.callCount, 3, "Extraction, overlap and one explicit retry review");

    const entities = await client.knowledge.searchEntities("Gateway", 10);
    const documents = await client.knowledge.listDocuments(projectId);
    const artifacts = await client.knowledge.listCodeArtifacts(projectId);
    const relationships = await client.knowledge.getRelationships(entities[0]!.id);

    assert.equal(entities.length, 1);
    assert.equal(documents.length, 1);
    assert.equal(artifacts.length, 0);
    assert.equal(relationships.length, 0);
    // Check raw failure last so a diagnostic regression cannot hide duplicate-write regressions.
    assert.deepEqual(failures, ["simulated lost document response"]);
    assert.match(interrupted.lastError!, /simulated lost document response/);
  },
);

test(
  "capture checkpoints before rich writes when mode changes mid-job",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    let mode: CaptureMode = "auto";
    let interrupted = false;
    const fetchImpl: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      if (
        !interrupted &&
        String(input).endsWith("/memories") &&
        init?.method === "POST"
      ) {
        interrupted = true;
        mode = "observe";
      }
      return response;
    };
    const client = new ApiForgetfulClient({
      baseUrl,
      timeoutMs: 4_000,
      fetchImpl,
    });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-guard-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-rich",
    });
    const service = new CaptureService({
      queue,
      client,
      model: new RichModel(),
      instanceId: "instance-rich",
      getMode: () => mode,
    });

    const enqueued = await service.enqueue(
      snapshot(
        "guard",
        "guard-user",
        "The API depends on the database and uses the request handler.",
        projectId,
      ),
    );
    await service.checkpoint();

    const paused = await queue.getJob(enqueued.jobId);
    assert.equal(paused?.status, "paused");
    assert.equal(await client.knowledge.searchEntities("Gateway", 10).then(
      (items) => items.length,
    ), 0);
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 0);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 0);

    mode = "auto";
    await service.checkpoint();

    const completed = await queue.getJob(enqueued.jobId);
    assert.equal(completed?.status, "complete");
    assert.equal((await client.knowledge.searchEntities("Gateway", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 1);
  },
);

test(
  "capture resumes receipted writes after explicit retry and fresh attachment scope checks",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    let pausedAfterArtifact = false;
    let mode: CaptureMode = "auto";
    const fetchImpl: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      if (
        !pausedAfterArtifact &&
        String(input).endsWith("/code-artifacts") &&
        init?.method === "POST"
      ) {
        pausedAfterArtifact = true;
        mode = "observe";
      }
      return response;
    };
    const client = new ApiForgetfulClient({
      baseUrl,
      timeoutMs: 4_000,
      fetchImpl,
    });
    const projectId = await createProject(client);
    const foreign = await client.createProject({
      name: "Foreign",
      description: "Foreign scope for resume checks",
      repo_name: "foreign/tools",
    });
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-scope-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-rich",
      maxAttempts: 8,
    });
    const richModel = new RichModel();
    const failures: string[] = [];
    const model: MemoryModelClient = { complete: async (request) => {
      if (request.submission?.name === "submit_capture_retry") {
        const input = request.input as { outcome: { executionFailure: string } };
        failures.push(input.outcome.executionFailure);
        return { action: "retry", reason: "The resource was returned to the authorized project." };
      }
      return richModel.complete(request);
    } };
    const service = new CaptureService({
      queue,
      client,
      model,
      getMode: () => mode,
      instanceId: "instance-rich",
    });
    const enqueued = await service.enqueue(
      snapshot(
        "scope-resume",
        "scope-resume-user",
        "The API depends on the database and uses the request handler.",
        projectId,
      ),
    );
    await service.checkpoint();
    assert.equal(pausedAfterArtifact, true);

    const interrupted = await queue.getJob(enqueued.jobId);
    assert.equal(interrupted?.status, "paused");
    const outcome = interrupted?.candidateOutcomes["rich-candidate"] as {
      memoryId?: number;
    };
    assert.ok(outcome?.memoryId);
    const memoryId = outcome.memoryId;
    const documents = await client.knowledge.listDocuments(projectId);
    const architecture = documents.find(
      (document) => document.title === "API architecture",
    );
    assert.ok(architecture);
    const extra = await client.knowledge.createDocument({
      title: "Concurrent attachment",
      description: "Added while the writer was interrupted.",
      content: "This attachment must survive the resumed write.",
      tags: ["concurrent"],
      project_id: projectId,
    });
    await client.knowledge.updateMemory(memoryId, {
      document_ids: [extra.id],
    });

    await client.knowledge.updateDocument(architecture.id, {
      project_id: foreign.id,
    });
    mode = "auto";
    await service.checkpoint();
    const blocked = (await queue.getJob(enqueued.jobId))!;
    assert.equal(blocked.status, "pending");
    assert.match(blocked.lastError!, /Knowledge document is outside the destination project/);
    assert.equal(failures.length, 0);
    assert.deepEqual((await client.get(memoryId)).document_ids, [extra.id]);

    await client.knowledge.updateDocument(architecture.id, {
      project_id: projectId,
    });
    await service.checkpoint();

    const completed = await queue.getJob(enqueued.jobId);
    assert.equal(completed?.status, "complete", completed?.lastError);
    assert.deepEqual(failures, ["Knowledge document is outside the destination project"]);
    assert.equal(completed.callCount, 3, "Extraction, overlap and one explicit retry review");
    const finalMemory = await client.get(memoryId);
    assert.deepEqual(
      [...(finalMemory.document_ids ?? [])].sort((a, b) => a - b),
      [architecture.id, extra.id].sort((a, b) => a - b),
    );
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 1);
  },
);

test(
  "observe mode leaves rich resources and files untouched",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-observe-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-rich",
    });
    const service = new CaptureService({
      queue,
      client,
      model: new RichModel(),
      instanceId: "instance-rich",
    });

    await service.enqueue(
      snapshot(
        "observe",
        "observe-user",
        "The API depends on the database and uses the request handler.",
        projectId,
        "observe",
      ),
    );
    await service.checkpoint();

    assert.deepEqual(await client.knowledge.searchEntities("Gateway", 10), []);
    assert.deepEqual(await client.knowledge.listDocuments(projectId), []);
    assert.deepEqual(await client.knowledge.listCodeArtifacts(projectId), []);
    assert.deepEqual(await client.knowledge.listFiles(projectId), []);
    const off = await service.enqueue(
      snapshot(
        "off",
        "off-user",
        "The API depends on the database and uses the request handler.",
        projectId,
        "off",
      ),
    );
    assert.equal(off.queued, false);
  },
);

test(
  "clear supersession keeps historical rich attachments on the old memory",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-super-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const model = new SupersedingModel();

    await captureOnce(
      client,
      directory,
      model,
      snapshot(
        "before-change",
        "before-user",
        "The API depends on the database.",
        projectId,
      ),
    );
    const oldMemory = (
      await client.search({
        query: "API architecture database",
        query_context: "supersession test",
        project_ids: [projectId],
        strict_project_filter: true,
        k: 10,
      })
    )[0];
    assert.ok(oldMemory);

    await captureOnce(
      client,
      directory,
      model,
      snapshot(
        "after-change",
        "after-user",
        "The API now depends on the database v2.",
        projectId,
      ),
    );

    const oldStored = await client.get(oldMemory.id);
    const currentMemories = await client.search({
      query: "API architecture database v2",
      query_context: "supersession test",
      project_ids: [projectId],
      strict_project_filter: true,
      k: 10,
    });
    const newMemory = currentMemories.find((memory) => memory.id !== oldMemory.id);
    assert.ok(newMemory);
    assert.equal(oldStored.is_obsolete, true);
    assert.equal(oldStored.superseded_by, newMemory.id);
    assert.notDeepEqual(oldStored.document_ids, newMemory.document_ids);
    assert.notDeepEqual(oldStored.code_artifact_ids, newMemory.code_artifact_ids);
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 2);

    const entities = await client.knowledge.searchEntities("Gateway", 10);
    assert.equal(entities.length, 1);
    assert.equal(
      (await client.knowledge.getEntityMemories(entities[0]!.id)).length,
      2,
    );
  },
);

test(
  "ordinary resolution omits old associations when the model selects empty arrays",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-conflict-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const model = new EscalatingModel();
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-rich",
    });
    const service = new CaptureService({
      queue,
      client,
      model,
      instanceId: "instance-rich",
    });

    await service.enqueue(
      snapshot(
        "conflict-before",
        "conflict-before-user",
        "The API depends on the database.",
        projectId,
      ),
    );
    await service.checkpoint();
    await service.enqueue(
      snapshot(
        "conflict-after",
        "conflict-after-user",
        "The API now depends on the database uncertainly.",
        projectId,
      ),
    );
    await service.checkpoint();

    const pending = await service.pendingConflicts();
    assert.equal(pending.length, 1);
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 1);

    const oldId = pending[0]!.oldMemoryId!;
    const old = await client.get(oldId);
    const related = await client.create({ title: "Applicable architectural constraint",
      content: "The database supports deployment rollback.", context: "Existing constraint",
      keywords: ["database"], tags: [], project_ids: [projectId] });
    await client.knowledge.linkMemories(oldId, [related.id]);
    assert.ok((await client.getMemoryEntityIds(oldId)).length);
    const result = await service.resolveConflict(pending[0]!.id, {
      action: "supersede",
      reason: "The originating session confirmed the change.",
      evidenceEntryIds: ["later-user"],
      additionalEntries: [{ id: "later-user", role: "user",
        text: "I confirmed the database change for this project." }],
    });

    assert.equal(result.status, "resolved");
    assert.equal((await service.pendingConflicts()).length, 0);
    const replacement = await client.get(result.conflict.replacementId!);
    assert.equal(replacement.title, "Confirmed API architecture");
    assert.deepEqual(replacement.document_ids, []);
    assert.deepEqual(replacement.code_artifact_ids, []);
    assert.deepEqual(replacement.file_ids, []);
    assert.deepEqual(replacement.source_files ?? [], []);
    assert.deepEqual(replacement.linked_memory_ids, []);
    assert.deepEqual(await client.getMemoryEntityIds(replacement.id), []);
    assert.equal((await client.get(oldId)).is_obsolete, true);
    assert.deepEqual((await client.get(oldId)).document_ids, old.document_ids);
    assert.ok((await client.get(oldId)).linked_memory_ids!.includes(related.id));
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 1);
  },
);

test("partial resolution uses exact selected references without copying candidate resources",
  realOptions, async (t) => {
    // Arrange: existing architecture has attachments and entity/memory links.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const writer = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    let addLateLinks: (() => Promise<void>) | undefined;
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (addLateLinks && init?.method === "POST" && String(url).endsWith("/memories")) {
          const body = JSON.parse(init.body as string);
          assert.deepEqual(body.keywords, [" database", "docker "]);
          assert.deepEqual(body.tags, [" architecture "]);
          const add = addLateLinks;
          addLateLinks = undefined;
          await add();
        }
        return response;
      } });
    const projectId = await createProject(client);
    const directory = await mkdtemp(join(tmpdir(), "partial-rich-rest-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const oldDocument = await client.knowledge.createDocument({ title: "Deployment",
      description: "Unchanged deployment", content: "Deploy with Docker", tags: [],
      project_id: projectId });
    const oldCode = await client.knowledge.createCodeArtifact({ title: "Deploy script",
      description: "Unchanged deployment", code: "docker compose up", language: "bash",
      tags: [], project_id: projectId });
    const oldEntity = await client.knowledge.createEntity({ name: "Docker", entity_type: "System",
      tags: [], aka: [], project_ids: [projectId] });
    const response = await fetch(`${baseUrl}/files`, { method: "POST",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        filename: "deployment.txt", description: "Deployment", mime_type: "text/plain",
        data: Buffer.from("Docker deployment").toString("base64"), tags: [], project_id: projectId,
      }) });
    assert.equal(response.status, 201);
    const fileId = (await response.json() as { id: number }).id;
    const oldInput = { title: "Architecture", content: "API uses database v1. Deploy with Docker.",
      context: "Architecture decisions", keywords: ["database"], tags: ["architecture"],
      importance: 8, project_ids: [projectId], document_ids: [oldDocument.id],
      code_artifact_ids: [oldCode.id], file_ids: [fileId] };
    const old = await client.create(oldInput);
    const related = await client.create({ ...oldInput, title: "Deployment background" });
    await client.knowledge.linkMemories(old.id, [related.id]);
    await client.knowledge.linkEntityMemory(oldEntity.id, old.id);
    const candidate = richCandidate("partial-user");
    candidate.content = "The API now depends on database v2.";
    const model: MemoryModelClient = { complete: async (request) => {
      if (request.submission?.name === "submit_memory_revision") {
        const input = request.input as { resources: {
          documents: Document[]; codeArtifacts: CodeArtifact[]; entities: Entity[];
        } };
        assert.equal(input.resources.documents[0]!.content, "Deploy with Docker");
        assert.equal(input.resources.codeArtifacts[0]!.code, "docker compose up");
        assert.equal(input.resources.entities[0]!.id, oldEntity.id);
        return request.submission.validate({ title: "Architecture",
          content: "API uses database v2. Deploy with Docker.",
          context: "Only the database changed",
          keywords: [" database", "docker "], tags: [" architecture "], importance: 9,
          sourceEntryIds: ["partial-user"], documentIds: [oldDocument.id],
          codeArtifactIds: [oldCode.id], entityIds: [oldEntity.id], memoryIds: [related.id],
          fileIds: [fileId], sourceFiles: [] });
      }
      return request.purpose === "capture" ? { candidates: [candidate] } : {
        action: "escalate", conflictingMemoryId: old.id, partial: true,
        oldClaim: "API uses database v1", newClaim: "API uses database v2",
        sourceEntryIds: ["partial-user"], reason: "Retain deployment claims",
      };
    } };
    const queue = new DurableQueueStore({ directory, instanceId: "instance-rich" });
    const service = new CaptureService({ queue, client, model, instanceId: "instance-rich" });
    await service.enqueue(snapshot("partial", "partial-user",
      "The API uses database v2 now. Keep Docker deployment and record the new API architecture.",
      projectId));
    await service.checkpoint();
    const conflict = (await service.pendingConflicts())[0]!;
    assert.ok(conflict);
    const lateEntity = await writer.knowledge.createEntity({ name: "Deployment operator",
      entity_type: "System", tags: [], aka: [], project_ids: [projectId] });
    let lateMemoryId: number | undefined;
    addLateLinks = async () => {
      const late = await writer.create({ ...oldInput, title: "Later deployment context" });
      lateMemoryId = late.id;
      await writer.knowledge.linkMemories(old.id, [late.id]);
      await writer.knowledge.linkEntityMemory(lateEntity.id, old.id);
    };

    // Act: preserve explicitly selected references; concurrent additions were not selected.
    const result = await service.resolveConflict(conflict.id, { action: "supersede",
      reason: "Confirmed database change only", evidenceEntryIds: ["partial-user"] });

    // Assert only through REST and durable queue boundaries.
    const replacement = await client.get(result.conflict.replacementId!);
    assert.equal(replacement.content, "API uses database v2. Deploy with Docker.");
    // Forgetful trims keyword/tag whitespace; the request and receipt retain model arguments.
    assert.deepEqual(replacement.keywords, ["database", "docker"]);
    assert.deepEqual(replacement.tags, ["architecture"]);
    assert.equal(replacement.importance, 9);
    assert.deepEqual(replacement.project_ids, [projectId]);
    assert.deepEqual(replacement.document_ids, [oldDocument.id]);
    assert.deepEqual(replacement.code_artifact_ids, [oldCode.id]);
    assert.deepEqual(replacement.source_files ?? [], []);
    assert.deepEqual(replacement.file_ids, [fileId]);
    assert.deepEqual(replacement.linked_memory_ids, [related.id]);
    assert.deepEqual(await client.getMemoryEntityIds(replacement.id), [oldEntity.id]);
    assert.ok(lateMemoryId);
    assert.ok((await client.get(old.id)).linked_memory_ids!.includes(lateMemoryId));
    assert.ok((await client.getMemoryEntityIds(old.id)).includes(lateEntity.id));
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 1);
    assert.deepEqual(await client.knowledge.searchEntities("API", 10), []);
    assert.equal((await client.get(old.id)).superseded_by, replacement.id);
    const receipt = await queue.getConflict(conflict.id);
    assert.equal(receipt!.status, "resolved");
    assert.deepEqual(receipt!.replacement!.input.keywords, [" database", "docker "]);
    assert.deepEqual(receipt!.replacement!.input.tags, [" architecture "]);
    const revision = receipt!.replacement!.candidate as { keywords: string[]; tags: string[] };
    assert.deepEqual(revision.keywords, [" database", "docker "]);
    assert.deepEqual(revision.tags, [" architecture "]);
    assert.deepEqual(receipt!.replacement!.memoryIds, [related.id]);
    assert.deepEqual(receipt!.replacement!.entityIds, [oldEntity.id]);
  });
