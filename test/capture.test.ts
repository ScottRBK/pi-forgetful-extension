import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CaptureService } from "../src/capture.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import type {
  CaptureSnapshot,
  ForgetfulClient,
  Memory,
  MemoryModelClient,
  MemoryInput,
} from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";

function snapshot(): CaptureSnapshot {
  return {
    id: "snapshot-1",
    context: {
      cwd: "/repo",
      repoName: "example/repo",
      project: { id: 7, name: "Example" },
      sessionId: "session-1",
      branchId: "branch-1",
    },
    instanceId: "instance-a",
    entries: [
      {
        id: "user-1",
        role: "user",
        text: "We decided to use SQLite for local development.",
      },
      {
        id: "assistant-1",
        role: "assistant",
        text: "Implemented the migration.",
      },
    ],
    finalEntryId: "assistant-1",
    mode: "auto",
    scope: "global",
    policy: "Capture only durable decisions with direct evidence.",
    modelVersion: "memory-model-v1",
    createdAt: new Date().toISOString(),
  };
}

function memory(id: number, input: MemoryInput): Memory {
  return { ...input, id, is_obsolete: false, linked_memory_ids: [] };
}

class FakeClient implements ForgetfulClient {
  readonly created: MemoryInput[] = [];
  readonly searches: Array<{ projectId?: number; query: string }> = [];
  readonly superseded: Array<{ oldId: number; replacementId: number }> = [];
  projects: Array<{ id: number; name: string; repo_name?: string }> = [
    { id: 7, name: "Example", repo_name: "example/repo" },
  ];
  searchResults: Memory[] = [];
  memories = new Map<number, Memory>();
  failSupersedeCount = 0;
  onGet?: (id: number) => void;
  private nextId = 100;

  async search(request: {
    query: string;
    query_context: string;
    project_ids?: number[];
    strict_project_filter: boolean;
  }): Promise<Memory[]> {
    this.searches.push({
      projectId: request.project_ids?.[0],
      query: request.query,
    });
    return this.searchResults;
  }

  async listProjects(
    repoName?: string,
  ): Promise<Array<{ id: number; name: string; repo_name?: string }>> {
    return repoName
      ? this.projects.filter((project) => project.repo_name === repoName)
      : this.projects;
  }

  async create(input: MemoryInput): Promise<{ id: number }> {
    this.created.push(input);
    return { id: this.nextId++ };
  }

  async get(id: number): Promise<Memory> {
    this.onGet?.(id);
    const value = this.memories.get(id);
    if (!value) throw new Error(`Unexpected get(${id})`);
    return value;
  }

  async supersede(oldId: number, replacementId: number): Promise<void> {
    if (this.failSupersedeCount > 0) {
      this.failSupersedeCount -= 1;
      throw new Error("temporary obsolescence failure");
    }
    this.superseded.push({ oldId, replacementId });
  }
}

class FakeModel implements MemoryModelClient {
  readonly requests: Array<{
    purpose: string;
    policy: string;
    input: unknown;
  }> = [];
  private readonly responses: unknown[];

  constructor(...responses: unknown[]) {
    this.responses = responses;
  }

  async complete(request: {
    purpose: "classification" | "capture" | "overlap";
    policy: string;
    input: unknown;
  }): Promise<unknown> {
    this.requests.push({
      purpose: request.purpose,
      policy: request.policy,
      input: request.input,
    });
    const response = this.responses.shift();
    if (response instanceof Error) throw response;
    return response;
  }
}

test("CaptureService creates a novel user-evidenced candidate in the current project", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-capture-"));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-1",
          title: "Use SQLite locally",
          content: "Local development uses SQLite.",
          context: "The database decision was made during the completed turn.",
          keywords: ["sqlite", "database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlapping memory exists." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  const queued = await service.enqueue(snapshot());
  const result = await service.checkpoint();

  assert.equal(queued.queued, true);
  assert.equal(result.processed, 1);
  assert.equal(client.created.length, 1);
  assert.equal(client.created[0]?.project_ids[0], 7);
  assert.match(client.created[0]?.context ?? "", /user-1/);
  assert.match(client.created[0]?.context ?? "", /session-1/);
  assert.equal(client.searches[0]?.projectId, 7);
  assert.deepEqual(
    model.requests.map((request) => request.purpose),
    ["capture", "overlap"],
  );
  assert.match(model.requests[0]?.policy ?? "", /Capture policy contract/);
  assert.match(
    model.requests[0]?.policy ?? "",
    /Capture only durable decisions with direct evidence/,
  );
  assert.equal(
    (model.requests[0]?.input as { context?: { cwd?: string } }).context?.cwd,
    "/repo",
  );
  assert.match(model.requests[1]?.policy ?? "", /Overlap policy contract/);
  assert.equal(
    (await queue.listPending({ instanceId: "instance-a" })).length,
    0,
  );
});

test("capture sanitizes policy and work context before queue persistence", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-snapshot-privacy-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const unsafe = snapshot();
  unsafe.policy = "api_key=super-secret-value";
  unsafe.context.repoName = "https://user:password@example.test/repo";
  const service = new CaptureService({
    queue,
    client: new FakeClient(),
    model: new FakeModel(),
    instanceId: "instance-a",
  });

  const queued = await service.enqueue(unsafe);
  const job = await queue.getJob(queued.jobId);

  assert(job);
  assert.equal(job.snapshot.policy, "[redacted]");
  assert.equal(job.snapshot.context.repoName, "[redacted]");
});

test("capture bounds provenance-aware memory context for the REST adapter", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-context-limit-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const createdBodies: Array<{ context?: unknown }> = [];
  const client = new ApiForgetfulClient({
    baseUrl: "http://localhost/api/v1",
    fetchImpl: async (input, init) => {
      const path = new URL(String(input)).pathname;
      if (path.endsWith("/memories/search")) {
        return new Response(
          JSON.stringify({ primary_memories: [], linked_memories: [] }),
          {
            status: 200,
          },
        );
      }
      if (path.endsWith("/memories") && init?.method === "POST") {
        const body = JSON.parse(String(init.body)) as { context?: unknown };
        createdBodies.push(body);
        return new Response(JSON.stringify({ id: 101 }), { status: 201 });
      }
      return new Response(JSON.stringify({ error: "unexpected request" }), {
        status: 404,
      });
    },
  });
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-long-context",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "x".repeat(500),
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(createdBodies.length, 1);
  assert.equal(typeof createdBodies[0]?.context, "string");
  assert.ok((createdBodies[0]?.context as string).length <= 500);
  assert.match(createdBodies[0]?.context as string, /Evidence entries: user-1/);
  assert.equal(
    (await queue.listJobs({ instanceId: "instance-a" }))[0]?.status,
    "complete",
  );
});

test("capture diagnostics expose bounded outcomes without transcript text", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-diagnostics-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-diagnostic",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A direct user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  const diagnostics = await service.diagnostics();

  assert.equal(diagnostics.jobs[0]?.candidates[0]?.destinationProjectId, 7);
  assert.equal(diagnostics.jobs[0]?.candidates[0]?.stage, "created");
  assert.deepEqual(diagnostics.jobs[0]?.candidates[0]?.sourceEntryIds, [
    "user-1",
  ]);
  assert.equal(diagnostics.jobs[0]?.candidates[0]?.action, "create");
  assert.equal(diagnostics.jobs[0]?.candidates[0]?.title, "Use SQLite");
  assert.equal(
    diagnostics.jobs[0]?.candidates[0]?.content,
    "Local development uses SQLite.",
  );
  assert.equal(
    JSON.stringify(diagnostics).includes("We decided to use SQLite"),
    false,
  );
});

test("capture validates destination overrides against all existing projects", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-destination-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  client.projects.push({ id: 9, name: "Other", repo_name: "other/repo" });
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-override",
          title: "Forgetful uses SQLite",
          content: "The Forgetful service uses SQLite.",
          context: "An evidenced change in the other project.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
          destinationProjectId: 9,
          destinationRationale: "The completed change concerns Other.",
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created[0]?.project_ids[0], 9);
  assert.equal(client.searches[0]?.projectId, 9);
});

test("overlap judgment receives the source evidence text", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-evidence-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-evidence",
          title: "Use SQLite locally",
          content: "Local development uses SQLite.",
          context: "The database decision was made during the completed turn.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  const overlapInput = model.requests[1]?.input as {
    evidenceEntries?: Array<{ id: string; text: string }>;
  };

  assert.deepEqual(overlapInput.evidenceEntries, [
    {
      id: "user-1",
      role: "user",
      text: "We decided to use SQLite for local development.",
    },
  ]);
});

test("capture stops model and network calls when live mode switches off", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-capture-off-"));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  let mode: "auto" | "off" = "auto";
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-off",
          title: "Use SQLite locally",
          content: "Local development uses SQLite.",
          context: "The database decision was made during the completed turn.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const originalComplete = model.complete.bind(model);
  model.complete = async (request) => {
    const response = await originalComplete(request);
    if (request.purpose === "capture") mode = "off";
    return response;
  };
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
    getMode: () => mode,
  });

  await service.enqueue(snapshot());
  const result = await service.checkpoint();

  assert.equal(result.paused, true);
  assert.deepEqual(
    model.requests.map((request) => request.purpose),
    ["capture"],
  );
  assert.equal(client.searches.length, 0);
  assert.equal(client.created.length, 0);
});

test("malformed supersession evidence never writes a replacement", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-bad-supersede-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-bad-supersede",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated.",
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (job?.candidateOutcomes["candidate-bad-supersede"] as { stage?: string })
      ?.stage,
    "skipped",
  );
});

test("malformed conflict fields cannot authorize supersession", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-malformed-fields-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-malformed-fields",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryIds: [old.id, "not-a-memory-id"],
      partial: "true",
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (job?.candidateOutcomes["candidate-malformed-fields"] as { stage?: string })
      ?.stage,
    "skipped",
  );
});

test("an unknown overlap action records a skip instead of retrying the whole job", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-invalid-action-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-invalid-action",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A direct user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "unknown" },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (job?.candidateOutcomes["candidate-invalid-action"] as { stage?: string })
      ?.stage,
    "skipped",
  );
  assert.equal(job?.status, "complete");
});

test("observe snapshots cannot write during a persisted supersession retry", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-observe-retry-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.memories.set(old.id, old);
  const candidate = {
    id: "candidate-observe-retry",
    title: "Use SQLite",
    content: "The project uses SQLite.",
    context: "A changed database decision.",
    keywords: ["database"],
    tags: ["decision"],
    sourceEntryIds: ["user-1"],
  };
  const observed = snapshot();
  observed.mode = "observe";
  const queued = await queue.enqueue(observed);
  const job = await queue.getJob(queued.jobId);
  assert(job);
  await queue.checkpoint(job.id, {
    status: "pending",
    extractedCandidates: [candidate],
    candidateOutcomes: {
      [candidate.id]: {
        stage: "replacement-created",
        oldMemoryId: old.id,
        oldMemory: old,
        replacementId: 100,
        destinationProjectId: 7,
        reason: "The project migrated.",
      },
    },
  });
  const service = new CaptureService({
    queue,
    client,
    model: new FakeModel(),
    instanceId: "instance-a",
  });

  const result = await service.checkpoint();

  assert.equal(result.paused, true);
  assert.equal(client.superseded.length, 0);
});

test("a partial or multi-memory change is retained for escalation", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-escalate-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  const second = memory(42, {
    title: "Deployment choice",
    content: "The project deploys to Kubernetes.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old, second];
  client.memories.set(old.id, old);
  client.memories.set(second.id, second);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-shared",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryIds: [old.id, second.id],
      partial: true,
      oldClaim: "The project uses PostgreSQL and deploys to Kubernetes.",
      newClaim: "The project uses SQLite.",
      reason: "Only one part of a shared claim changed.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
  const conflicts = await service.pendingConflicts();
  assert.equal(conflicts.length, 1);
  assert.deepEqual(conflicts[0]?.oldMemoryIds, [41, 42]);
  await assert.rejects(
    () =>
      service.resolveConflict(conflicts[0]!.id, {
        action: "supersede",
        reason: "User confirmed only one part changed.",
        evidenceEntryIds: ["user-1"],
      }),
    /partial|multi-memory|validated candidate/i,
  );
  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
});

test("an already-obsolete memory is escalated without creating another replacement", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-obsolete-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = {
    ...memory(41, {
      title: "Database choice",
      content: "The project uses PostgreSQL.",
      context: "Old decision",
      keywords: ["database"],
      tags: ["decision"],
      project_ids: [7],
    }),
    is_obsolete: true,
    superseded_by: 999,
  };
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-obsolete",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated databases.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
  const conflicts = await service.pendingConflicts();
  assert.equal(conflicts.length, 1);
});

test("shared-project memories escalate without being rewritten", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-shared-project-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Shared decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7, 8],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-shared-project",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated databases.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
    sessionId: "session-1",
    branchId: "branch-1",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  const conflict = (await service.pendingConflicts())[0];
  assert(conflict);
  assert.match(conflict.reason, /shared|project/i);
  await assert.rejects(
    () =>
      service.resolveConflict(conflict.id, {
        action: "supersede",
        reason: "The user confirmed the migration.",
        evidenceEntryIds: ["user-1"],
      }),
    /shared|project|validated/i,
  );
  assert.equal(client.created.length, 0);
  assert.equal(client.superseded.length, 0);
});

test("one plural conflict ID is retained as the selected memory", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-single-conflict-id-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-single-conflict-id",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "escalate",
      conflictingMemoryIds: [old.id],
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The change needs confirmation.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  const conflict = (await service.pendingConflicts())[0];

  assert.equal(conflict?.oldMemoryId, old.id);
  assert.equal(
    (conflict?.oldMemory as { id?: number } | undefined)?.id,
    old.id,
  );
});

test("the same job and candidate produce a stable pending conflict ID", async () => {
  const run = async (directory: string): Promise<string> => {
    const queue = new DurableQueueStore({
      directory,
      instanceId: "instance-a",
    });
    const client = new FakeClient();
    const old = memory(41, {
      title: "Database choice",
      content: "The project uses PostgreSQL.",
      context: "Old decision",
      keywords: ["database"],
      tags: ["decision"],
      project_ids: [7],
    });
    client.searchResults = [old];
    client.memories.set(old.id, old);
    const model = new FakeModel(
      {
        candidates: [
          {
            id: "candidate-stable-conflict",
            title: "Use SQLite",
            content: "The project uses SQLite.",
            context: "A changed database decision.",
            keywords: ["database"],
            tags: ["decision"],
            sourceEntryIds: ["user-1"],
          },
        ],
      },
      {
        action: "escalate",
        conflictingMemoryId: old.id,
        oldClaim: "PostgreSQL is used.",
        newClaim: "SQLite is used.",
        reason: "The change needs confirmation.",
        sourceEntryIds: ["user-1"],
      },
    );
    const service = new CaptureService({
      queue,
      client,
      model,
      instanceId: "instance-a",
    });
    await service.enqueue(snapshot());
    await service.checkpoint();
    return (await service.pendingConflicts())[0]!.id;
  };

  const first = await run(
    await mkdtemp(join(tmpdir(), "pi-forgetful-capture-stable-a-")),
  );
  const second = await run(
    await mkdtemp(join(tmpdir(), "pi-forgetful-capture-stable-b-")),
  );

  assert.equal(first, second);
});

test("invalid candidates are recorded as skipped while valid candidates continue", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-invalid-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-assistant-only",
          title: "Do this",
          content: "An assistant suggestion.",
          context: "Suggestion",
          keywords: ["bad"],
          tags: ["bad"],
          sourceEntryIds: ["assistant-1"],
        },
        {
          id: "candidate-valid-after-invalid",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 1);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (job?.candidateOutcomes["candidate-assistant-only"] as { stage?: string })
      ?.stage,
    "skipped",
  );
  assert.equal(
    (
      job?.candidateOutcomes["candidate-valid-after-invalid"] as {
        stage?: string;
      }
    )?.stage,
    "created",
  );
});

test("partial supersession retries obsolescence with the recorded replacement ID", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-retry-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  client.failSupersedeCount = 1;
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-retry",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated databases.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  assert.equal(client.created.length, 1);
  assert.equal(client.superseded.length, 0);
  await service.checkpoint();

  assert.equal(client.created.length, 1);
  assert.deepEqual(client.superseded, [{ oldId: 41, replacementId: 100 }]);
});

test("conflict resolution validates the action and evidence references", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-resolve-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-conflict",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "escalate",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The change needs confirmation.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
    sessionId: "session-1",
    branchId: "branch-1",
  });
  await service.enqueue(snapshot());
  await service.checkpoint();
  const conflict = (await service.pendingConflicts())[0];
  assert(conflict);

  await assert.rejects(
    () =>
      service.resolveConflict(conflict.id, {
        action: "unknown" as "supersede",
        reason: "bad action",
      }),
    /unknown|invalid/i,
  );
  await assert.rejects(
    () =>
      service.resolveConflict(conflict.id, {
        action: "supersede",
        reason: "confirmed",
        evidenceEntryIds: ["not-in-snapshot"],
      }),
    /evidence/i,
  );
  assert.equal(client.created.length, 0);
});

test("resolution accepts later user evidence from the originating session", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-resolve-later-evidence-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-later-evidence",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "escalate",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The change needs confirmation.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
    sessionId: "session-1",
    branchId: "branch-1",
  });
  await service.enqueue(snapshot());
  await service.checkpoint();
  const conflict = (await service.pendingConflicts())[0];
  assert(conflict);

  const result = await service.resolveConflict(conflict.id, {
    action: "supersede",
    reason: "The user confirmed the migration.",
    evidenceEntryIds: ["later-user"],
    additionalEntries: [
      {
        id: "later-user",
        role: "user",
        text: "I confirmed the migration to SQLite.",
      },
      {
        id: "later-context",
        role: "user",
        text: "The clarification applies to this project.",
      },
    ],
  });

  assert.equal(result.conflict.status, "resolved");
  assert.equal(client.created.length, 1);
  assert.deepEqual(client.superseded, [{ oldId: 41, replacementId: 100 }]);
});

test("sensitive overlap results are rejected before the overlap model or any write", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-overlap-secret-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  client.searchResults = [
    memory(91, {
      title: "Old credential",
      content: "password=super-secret-value",
      context: "Sensitive old record",
      keywords: ["credential"],
      tags: ["secret"],
      project_ids: [7],
    }),
  ];
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-secret-overlap",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 0);
  assert.deepEqual(
    model.requests.map((request) => request.purpose),
    ["capture"],
  );
});

test("an unresolved capture destination is recorded as a skip without falling back", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-no-destination-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-no-destination",
          title: "A durable fact",
          content: "A durable fact.",
          context: "No current project is available.",
          keywords: ["fact"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const noProject = snapshot();
  noProject.context.project = undefined;
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(noProject);
  await service.checkpoint();

  assert.equal(client.searches.length, 0);
  assert.equal(client.created.length, 0);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (job?.candidateOutcomes["candidate-no-destination"] as { stage?: string })
      ?.stage,
    "skipped",
  );
});

test("a malformed existing destination is skipped instead of becoming project zero", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-malformed-destination-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  client.projects.push({ id: 0, name: "Broken" });
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-malformed-destination",
          title: "A durable fact",
          content: "A durable fact.",
          context: "A malformed project record was returned.",
          keywords: ["fact"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
          destinationProjectName: "Broken",
          destinationRationale: "The work belongs there.",
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.searches.length, 0);
  assert.equal(client.created.length, 0);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(
    (
      job?.candidateOutcomes["candidate-malformed-destination"] as {
        stage?: string;
      }
    )?.stage,
    "skipped",
  );
});

test("capture keeps extraction plus overlap judgment within four model calls", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-budget-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const candidates = [1, 2, 3].map((index) => ({
    id: `candidate-${index}`,
    title: `Decision ${index}`,
    content: `Fact ${index}.`,
    context: "A direct user decision.",
    keywords: [`fact-${index}`],
    tags: ["decision"],
    sourceEntryIds: ["user-1"],
  }));
  const model = new FakeModel(
    { candidates },
    { action: "create", reason: "No overlap." },
    { action: "create", reason: "No overlap." },
    { action: "create", reason: "No overlap." },
    { action: "create", reason: "Should not be called." },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.deepEqual(
    model.requests.map((request) => request.purpose),
    ["capture", "overlap", "overlap", "overlap"],
  );
  assert.equal(client.created.length, 3);
});

test("a settle checkpoint sweeps bound branches within one total job budget", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-branch-budget-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-branch-a",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A direct user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
    {
      candidates: [
        {
          id: "candidate-branch-b",
          title: "Use SQLite",
          content: "Local development uses SQLite.",
          context: "A direct user decision.",
          keywords: ["sqlite"],
          tags: ["decision"],
          sourceEntryIds: ["user-1-b"],
        },
      ],
    },
    { action: "create", reason: "No overlap." },
  );
  const branchA = snapshot();
  const branchB = snapshot();
  branchB.id = "snapshot-branch-b";
  branchB.context = { ...branchB.context, branchId: "branch-2" };
  branchB.entries = branchB.entries.map((entry) => ({
    ...entry,
    id: `${entry.id}-b`,
  }));
  branchB.finalEntryId = "assistant-1-b";
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
    maxJobsPerCheckpoint: 2,
  });

  await service.enqueue(branchA);
  await service.enqueue(branchB);
  const result = await service.checkpoint({
    sessionId: "session-1",
    branchId: "branch-1",
  });

  assert.equal(result.processed, 2);
  assert.equal(client.created.length, 2);
  assert.equal(
    (await queue.listPending({ instanceId: "instance-a" })).length,
    0,
  );
});

test("stale reads after creation preserve the replacement ID", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-stale-replacement-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(41, {
    title: "Database choice",
    content: "The project uses PostgreSQL.",
    context: "Old decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  const changed = { ...old, content: "The project uses MySQL." };
  client.searchResults = [old];
  client.memories.set(old.id, old);
  let reads = 0;
  client.onGet = () => {
    reads += 1;
    if (reads === 2) client.memories.set(old.id, changed);
  };
  const model = new FakeModel(
    {
      candidates: [
        {
          id: "candidate-stale",
          title: "Use SQLite",
          content: "The project uses SQLite.",
          context: "A changed database decision.",
          keywords: ["database"],
          tags: ["decision"],
          sourceEntryIds: ["user-1"],
        },
      ],
    },
    {
      action: "supersede",
      conflictingMemoryId: old.id,
      oldClaim: "PostgreSQL is used.",
      newClaim: "SQLite is used.",
      reason: "The project migrated databases.",
      sourceEntryIds: ["user-1"],
    },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  assert.equal(client.created.length, 1);
  const conflict = (await service.pendingConflicts())[0];
  assert.equal(conflict?.replacementId, 100);
  assert.equal(client.superseded.length, 0);
});
