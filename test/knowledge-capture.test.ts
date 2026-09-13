import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CaptureService } from "../src/capture.ts";
import type {
  CaptureSnapshot,
  CaptureMode,
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

class RichModel implements MemoryModelClient {
  constructor(
    private readonly candidateId = "rich-candidate",
    private readonly entityKey = "api",
  ) {}

  async complete(request: ModelRequest): Promise<unknown> {
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
          memoryId: overlap.id,
          reason: "The existing architecture memory is still current.",
        }
      : { action: "create", reason: "New architecture decision." };
  }
}

class SupersedingModel implements MemoryModelClient {
  private captureCount = 0;

  async complete(request: ModelRequest): Promise<unknown> {
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
    if (!overlap) return { action: "create", reason: "New architecture decision." };
    return {
      action: "supersede",
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
    if (!overlap) return { action: "create", reason: "New architecture decision." };
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
  await service.enqueue(value);
  await service.checkpoint();
}

test(
  "capture creates and then reuses rich knowledge through the queue and REST adapter",
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
  "knowledge writer rejects ambiguous entity identity at the REST seam",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const projectId = await createProject(client);
    const memory = await client.create({
      title: "Ambiguous entity memory",
      content: "This memory only validates entity identity.",
      context: "writer test",
      keywords: ["identity"],
      tags: ["test"],
      project_ids: [projectId],
    });
    await client.knowledge.createEntity({
      name: "Gateway",
      entity_type: "System",
      tags: [],
      aka: [],
      project_ids: [projectId],
    });
    await client.knowledge.createEntity({
      name: "Gateway",
      entity_type: "System",
      tags: ["second"],
      aka: [],
      project_ids: [projectId],
    });
    const writer = new KnowledgeWriter(
      client.knowledge,
      (id, signal) => client.get(id, signal),
    );

    await assert.rejects(
      writer.execute({
        operationId: "ambiguous-entity",
        projectId,
        memoryId: memory.id,
        entities: [
          {
            key: "gateway",
            input: {
              name: "Gateway",
              entity_type: "System",
              tags: [],
              aka: [],
              project_ids: [projectId],
            },
          },
        ],
      }),
      /Ambiguous knowledge entity identity/,
    );
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
  "knowledge writer refuses a changed destination claim before rich writes",
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

    await assert.rejects(
      writer.execute({
        operationId: "changed-destination-claim",
        projectId,
        memoryId: memory.id,
        expectedClaim: {
          title: "Original destination claim",
          content: "The original claim is still expected.",
        },
        documents: [
          {
            key: "claim-document",
            input: {
              title: "Claim document",
              description: "A document that must not be written.",
              content: "The claim changed during the pause.",
              tags: [],
              project_id: projectId,
            },
          },
        ],
      }),
      /Destination memory claim changed/,
    );
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 0);
  },
);

test(
  "capture resumes after a response is lost without duplicating rich writes",
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
    const model = new RichModel("token-service", "token-service");
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

    await service.checkpoint();

    const job = (await queue.listJobs())[0];
    assert.equal(job?.status, "complete");
    assert.equal(
      (job?.candidateOutcomes["token-service"] as { stage?: string })?.stage,
      "created",
    );

    const entities = await client.knowledge.searchEntities("Gateway", 10);
    const documents = await client.knowledge.listDocuments(projectId);
    const artifacts = await client.knowledge.listCodeArtifacts(projectId);
    const relationships = await client.knowledge.getRelationships(entities[0]!.id);

    assert.equal(entities.length, 1);
    assert.equal(documents.length, 1);
    assert.equal(artifacts.length, 1);
    assert.equal(relationships.length, 1);
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
  "capture resumes rich writes only after fresh attachment and receipt scope checks",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    let droppedArtifactResponse = false;
    const fetchImpl: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      if (
        !droppedArtifactResponse &&
        String(input).endsWith("/code-artifacts") &&
        init?.method === "POST"
      ) {
        droppedArtifactResponse = true;
        throw new Error("simulated lost artifact response");
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
    const service = new CaptureService({
      queue,
      client,
      model: new RichModel(),
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
    assert.equal(droppedArtifactResponse, true);

    const interrupted = await queue.getJob(enqueued.jobId);
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
    await service.checkpoint();
    assert.equal((await queue.getJob(enqueued.jobId))?.status, "pending");

    await client.knowledge.updateDocument(architecture.id, {
      project_id: projectId,
    });
    await service.checkpoint();

    const completed = await queue.getJob(enqueued.jobId);
    assert.equal(completed?.status, "complete");
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
  "originating-session conflict resolution writes deferred rich knowledge",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
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

    const resolved = await service.resolveConflict(pending[0]!.id, {
      action: "supersede",
      reason: "The originating session confirmed the change.",
      evidenceEntryIds: ["later-user"],
      additionalEntries: [
        {
          id: "later-user",
          role: "user",
          text: "I confirmed the database change for this project.",
        },
      ],
    });

    assert.equal(resolved.status, "resolved");
    assert.equal((await client.knowledge.listDocuments(projectId)).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts(projectId)).length, 2);
  },
);

test("partial resolution preserves old links alongside new rich capture through real REST",
  realOptions, async (t) => {
    // Arrange: existing architecture has attachments and entity/memory links.
    const baseUrl = await startForgetful(t);
    const writer = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    let addLateLinks: (() => Promise<void>) | undefined;
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (addLateLinks && init?.method === "POST" && String(url).endsWith("/memories")) {
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
        return request.submission.validate({ title: "Architecture",
          content: "API uses database v2. Deploy with Docker.",
          context: "Only the database changed",
          keywords: [" database", "docker "], tags: [" architecture "], importance: 9,
          sourceEntryIds: ["partial-user"] });
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

    // Act: add new rich resources, retain old associations, then obsolete the old memory.
    const result = await service.resolveConflict(conflict.id, { action: "supersede",
      reason: "Confirmed database change only", evidenceEntryIds: ["partial-user"] });

    // Assert only through REST and durable queue boundaries.
    const replacement = await client.get(result.conflict.replacementId!);
    assert.equal(replacement.content, "API uses database v2. Deploy with Docker.");
    assert.deepEqual(replacement.keywords, ["database", "docker"]);
    assert.deepEqual(replacement.tags, ["architecture"]);
    assert.equal(replacement.importance, 9);
    assert.deepEqual(replacement.project_ids, [projectId]);
    assert.equal(replacement.document_ids!.length, 2);
    assert.ok(replacement.document_ids!.includes(oldDocument.id));
    assert.equal(replacement.code_artifact_ids!.length, 2);
    assert.ok(replacement.code_artifact_ids!.includes(oldCode.id));
    assert.deepEqual(replacement.file_ids, [fileId]);
    assert.ok(replacement.linked_memory_ids!.includes(related.id));
    assert.ok(replacement.linked_memory_ids!.includes(lateMemoryId!));
    const entityIds = await client.getMemoryEntityIds(replacement.id);
    assert.ok(entityIds.includes(oldEntity.id));
    assert.ok(entityIds.includes(lateEntity.id));
    assert.equal(entityIds.length, 4);
    assert.equal(new Set(entityIds).size, 4);
    assert.equal((await client.get(old.id)).superseded_by, replacement.id);
    const receipt = await queue.getConflict(conflict.id);
    assert.equal(receipt!.status, "resolved");
    assert.deepEqual(receipt!.replacement!.input.keywords, ["database", "docker"]);
    assert.deepEqual(receipt!.replacement!.input.tags, ["architecture"]);
    const revision = receipt!.replacement!.candidate as { keywords: string[]; tags: string[] };
    assert.deepEqual(revision.keywords, ["database", "docker"]);
    assert.deepEqual(revision.tags, ["architecture"]);
    assert.ok(receipt!.replacement!.memoryIds.includes(lateMemoryId!));
    assert.ok(receipt!.replacement!.entityIds.includes(lateEntity.id));
  });
