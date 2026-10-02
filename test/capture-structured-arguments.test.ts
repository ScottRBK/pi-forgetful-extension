import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, Memory, MemoryInput } from "../src/contracts.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";

class StructuredClient {
  readonly created: MemoryInput[] = [];
  readonly memories = new Map<number, Memory>();
  projects = [
    { id: 7, name: "Example", repo_name: "example/repo" },
    { id: 9, name: "Other", repo_name: "example/other" },
  ];
  private nextId = 100;

  readonly knowledge = new Proxy({}, {
    get: (_target, key) => typeof key === "string" && key !== "then"
      ? async () => []
      : undefined,
  }) as any;

  async getMemoryEntityIds(): Promise<number[]> {
    return [];
  }

  async createProject(): Promise<never> {
    throw new Error("Not used by structured argument capture tests");
  }

  async linkProject(): Promise<never> {
    throw new Error("Not used by structured argument capture tests");
  }

  async search(): Promise<Memory[]> {
    return [];
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
    const id = this.nextId++;
    this.memories.set(id, {
      ...input,
      id,
      is_obsolete: false,
      linked_memory_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Memory);
    return { id };
  }

  async get(id: number): Promise<Memory> {
    const memory = this.memories.get(id);
    if (!memory) throw new Error(`Unexpected memory read: ${id}`);
    return memory;
  }

  async supersede(): Promise<void> {
    return;
  }
}

function providerTool(name: string, args: unknown): any {
  return {
    role: "assistant",
    api: "fake",
    provider: "fake",
    model: "memory",
    content: [{ type: "toolCall", id: "tool-1", name, arguments: args }],
    stopReason: "toolUse",
    timestamp: Date.now(),
  };
}

function snapshot(): CaptureSnapshot {
  return {
    id: "structured-arguments",
    instanceId: "structured-arguments",
    mode: "auto",
    scope: "project",
    policy: "Capture durable decisions only.",
    modelVersion: "memory-model-v1",
    finalEntryId: "answer",
    createdAt: new Date().toISOString(),
    context: {
      cwd: "/repo",
      repoName: "example/repo",
      project: { id: 7, name: "Example", repo_name: "example/repo" },
      sessionId: "session",
      branchId: "branch",
    },
    entries: [
      { id: "user", role: "user", text: "Use durable queues and durable receipts." },
      { id: "answer", role: "assistant", text: "Understood." },
    ],
  };
}

async function runCapture(
  t: test.TestContext,
  reply: (toolName: string) => unknown,
): Promise<StructuredClient> {
  const directory = await mkdtemp(join(tmpdir(), "capture-structured-arguments-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "structured-arguments" });
  const client = new StructuredClient();
  const registry: ModelRegistryPort = {
    find: () => ({ provider: "fake", id: "memory", contextWindow: 200_000,
      maxTokens: 16_384, input: ["text"] }) as any,
    complete: async (_model, context) => {
      const name = context.tools?.[0]?.name;
      if (!name) throw new Error("Expected a submission tool");
      return providerTool(name, reply(name));
    },
  };
  const service = new CaptureService({
    queue,
    client: client as any,
    model: new PiMemoryModel(registry, { provider: "fake", id: "memory" }),
    instanceId: "structured-arguments",
  });
  await service.enqueue(snapshot());
  await service.checkpoint();
  return client;
}

const candidateBase = {
  title: "Durable queue",
  content: "Use a durable queue.",
  context: "The user made a durable queue decision.",
  keywords: ["queue"],
  tags: [],
  sourceEntryIds: ["user"],
  evidenceType: "userDecision",
};

test("schema-invalid JSON-string batch decisions never write memories", async (t) => {
  // Arrange: candidate extraction succeeds, but batch decisions are JSON strings.
  const client = await runCapture(t, (toolName) => {
    if (toolName === "submit_capture_candidates") {
      return { candidates: ["queue", "receipts"].map((id) => ({
        ...candidateBase,
        id,
        title: `Durable ${id}`,
        content: `Use durable ${id}.`,
        keywords: [id],
      })) };
    }
    if (toolName === "submit_capture_decisions") {
      return {
        decisions: ["queue", "receipts"].map((candidateId) =>
          JSON.stringify({ candidateId, action: "create" })),
      };
    }
    return { reviews: [] };
  });

  // Assert: JSON text that resembles tool arguments did not drive writes.
  assert.deepEqual(client.created, []);
});

for (const [name, extra] of [
  ["JSON-string destination", {
    destination: JSON.stringify({ projectId: 9, rationale: "Other project." }),
  }],
  ["object destination", {
    destination: { projectId: 9, rationale: "Other project." },
  }],
  ["target aliases", {
    targetProjectId: 9,
    targetProjectName: "Other",
    targetProjectRationale: "Other project.",
  }],
] as const) {
  test(`undeclared ${name} fields never choose project 9`, async (t) => {
    // Arrange: the provider uses undeclared fields to request another project.
    const client = await runCapture(t, (toolName) => {
      if (toolName === "submit_capture_candidates") {
        return { candidates: [{ ...candidateBase, id: "queue", ...extra }] };
      }
      return { action: "create", reason: "No overlap." };
    });

    // Assert: the invalid candidate was rejected instead of routed anywhere.
    assert.deepEqual(client.created, []);
  });
}

test("schema-declared destinationProjectId still chooses project 9", async (t) => {
  // Arrange: canonical destination fields are declared in the capture schema.
  const client = await runCapture(t, (toolName) => {
    if (toolName === "submit_capture_candidates") {
      return { candidates: [{
        ...candidateBase,
        id: "queue",
        destinationProjectId: 9,
        destinationRationale: "The user named the Other project.",
      }] };
    }
    return { action: "create", reason: "No overlap." };
  });

  // Assert: structured, schema-declared arguments still preserve intended routing.
  assert.deepEqual(client.created.map((memory) => memory.project_ids), [[9]]);
});
