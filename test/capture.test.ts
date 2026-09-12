import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
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
import { FileLogger } from "../src/logging.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import type { AssistantMessage, Context } from "@earendil-works/pi-ai";

for (const level of ["debug", "info", "off"] as const) {
  test(`capture ${level} file explains rejected evidence and saves valid capture`, async (t) => {
    // Arrange: one mixed-evidence rejection followed by a verified tool change.
    const directory = await mkdtemp(join(tmpdir(), "capture-log-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const logger = new FileLogger({ directory, sessionId: "session-1", level });
    const queue = new DurableQueueStore({ directory: join(directory, "queue"),
      instanceId: "instance-a" });
    const client = new FakeClient();
    const candidate = {
      id: "invalid", title: "Use SQLite locally", content: "Local development uses SQLite.",
      context: "A durable database decision", keywords: ["sqlite"], tags: ["decision"],
      sourceEntryIds: ["user-1", "assistant-1"], evidenceType: "userDecision",
    };
    const outputs = [
      { candidates: [candidate, { ...candidate, id: "valid", sourceEntryIds: ["tool-1"],
        evidenceType: "verifiedToolChange" }] },
      { action: "create", reason: "No overlap for SQLite" },
    ];
    const registry: ModelRegistryPort = {
      find: () => ({ provider: "fake", id: "memory" }) as any,
      complete: async (_model, context) => {
        const output = outputs.shift();
        const tool = context.tools?.[0];
        return tool
          ? providerTool("capture-log", tool.name, output as any)
          : providerText(JSON.stringify(output));
      },
    };
    const model = new PiMemoryModel(registry, { provider: "fake", id: "memory" }, { logger });
    const service = new CaptureService({ queue, client, model, logger, instanceId: "instance-a" });
    const input = snapshot();
    input.entries.push({ id: "tool-1", role: "toolResult", toolName: "edit",
      text: "Changed local database to SQLite. api_key=private-capture-secret" });

    // Act.
    const queued = await service.enqueue(input);
    await service.checkpoint();
    await logger.flush();

    // Assert through the real JSONL output and the external write outcome.
    assert.equal(client.created.length, 1);
    const text = await readFile(logger.filePath, "utf8").catch((error) => {
      if (level === "off" && error.code === "ENOENT") return "";
      throw error;
    });
    assert.doesNotMatch(text, /private-capture-secret/);
    if (level === "off") return assert.equal(text, "");
    const events = text.trim().split("\n").map((line) => JSON.parse(line));
    for (const name of ["queued", "started", "completed", "write_completed"]) {
      const entry = events.find((event) => event.event === `capture.${name}`);
      assert.ok(entry, `missing capture.${name}`);
      assert.equal(entry.data.jobId, queued.jobId);
      assert.equal(entry.data.sessionId, "session-1");
      assert.equal(entry.data.branchId, "branch-1");
    }
    const write = events.find((event) => event.event === "capture.write_completed");
    assert.equal(write.data.memoryId, 100);
    assert.equal(write.data.destinationProjectId, 7);
    if (level === "info") {
      assert.ok(events.every((event) => event.level === "info"));
      assert.doesNotMatch(text, /SQLite|Implemented the migration|No overlap/);
    } else {
      const rejected = events.find((event) => event.event === "capture.candidate_rejected");
      assert.equal(rejected.data.candidateId, "invalid");
      assert.equal(rejected.data.reason, "assistant messages are not eligible evidence");
      assert.deepEqual(rejected.data.candidate, candidate);
      assert.deepEqual(rejected.data.entries.map((entry: any) => [entry.id, entry.role]),
        [["user-1", "user"], ["assistant-1", "assistant"]]);
      const accepted = events.find((event) => event.event === "capture.candidate_accepted");
      assert.equal(accepted.data.entries[0].toolName, "edit");
      const snapshotEvent = events.find((event) => event.event === "capture.snapshot");
      assert.equal(snapshotEvent.data.entries.length, 3);
      const overlap = events.find((event) => event.event === "capture.overlap_decision");
      assert.equal(overlap.data.decision.action, "create");
      const request = events.find((event) => event.event === "model.request" &&
        event.data.purpose === "overlap");
      assert.equal(request.data.candidateId, "valid");
      assert.equal(request.data.jobId, queued.jobId);
    }
  });
}

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

test("capture file correlates failed write and retry despite sink errors", async (t) => {
  // Arrange: a transient server write error must preserve the job and its accepted candidate.
  const directory = await mkdtemp(join(tmpdir(), "capture-retry-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  class ThrowingLogger extends FileLogger {
    override emit(...args: Parameters<FileLogger["emit"]>): void {
      super.emit(...args);
      throw new Error("Diagnostic failure");
    }
  }
  const logger = new ThrowingLogger({ directory, sessionId: "session-1", level: "debug" });
  const queue = new DurableQueueStore({ directory: join(directory, "queue"),
    instanceId: "instance-a" });
  class UnavailableClient extends FakeClient {
    calls = 0;
    override async create(input: MemoryInput): Promise<{ id: number }> {
      if (++this.calls === 1) throw new Error("Write unavailable; password=private-write-secret");
      return super.create(input);
    }
  }
  const client = new UnavailableClient();
  const model = new FakeModel({ candidates: [{ id: "retry-candidate", title: "SQLite locally",
    content: "Use SQLite for development", context: "Database decision", keywords: [], tags: [],
    sourceEntryIds: ["user-1"] }] }, { action: "create", reason: "Novel SQLite decision" });
  const service = new CaptureService({ queue, client, model, logger, instanceId: "instance-a" });

  // Act.
  const queued = await service.enqueue(snapshot());
  await service.checkpoint();
  await service.checkpoint();
  await logger.flush();

  // Assert: a failure is recorded before retry, and no transcript appears in info events.
  assert.equal(client.created.length, 1);
  const text = await readFile(logger.filePath, "utf8");
  const events = text.trim().split("\n").map((line) => JSON.parse(line));
  const failure = events.find((entry) => entry.event === "capture.error");
  assert.ok(failure, "missing capture.error for the failed candidate write");
  assert.equal(failure.data.candidateId, "retry-candidate");
  assert.equal(failure.data.jobId, queued.jobId);
  const retry = events.find((entry) => entry.event === "capture.retry");
  assert.equal(retry.data.attempt, 2);
  assert.equal(events.at(-1).event, "capture.completed");
  assert.match(text, /Write unavailable/);
  assert.doesNotMatch(text, /private-write-secret/);
  const info = events.filter((entry) => entry.level === "info");
  assert.doesNotMatch(JSON.stringify(info), /Write unavailable|SQLite|Implemented the migration/);
});

test("large rejected candidate keeps reason, evidence and bounded raw details", async (t) => {
  // Arrange: rejected data exceeds the file logger's event budget.
  const directory = await mkdtemp(join(tmpdir(), "capture-large-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-1", level: "debug" });
  const queue = new DurableQueueStore({ directory: join(directory, "queue"),
    instanceId: "instance-a" });
  const model = new FakeModel({ candidates: [{ id: "large-candidate", title: "Oversized title",
    content: "x".repeat(60_000), context: "Database decision",
    sourceEntryIds: ["assistant-1"] }] });
  const service = new CaptureService({ queue, model, client: new FakeClient(), logger,
    instanceId: "instance-a" });

  // Act.
  const queued = await service.enqueue(snapshot());
  await service.checkpoint();
  await logger.flush();

  // Assert.
  const lines = (await readFile(logger.filePath, "utf8")).trim().split("\n");
  const rejected = lines.map((line) => JSON.parse(line))
    .find((entry) => entry.event === "capture.candidate_rejected");
  assert.equal(rejected.data?.jobId, queued.jobId);
  assert.equal(rejected.data.reason, "content is missing, empty, or longer than 2000 characters");
  assert.equal(rejected.data.entries[0].role, "assistant");
  assert.equal(rejected.data.candidate.truncated, true);
  assert.match(rejected.data.candidate.preview, /Oversized title/);
  assert.ok(lines.every((line) => Buffer.byteLength(line + "\n") <= 64 * 1024));
});

test("capture snapshot log retains the full bounded evidence sent for extraction", async (t) => {
  // Arrange: the normal 50KB snapshot is already bounded; it must remain useful for debugging.
  const directory = await mkdtemp(join(tmpdir(), "capture-snapshot-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-1", level: "debug" });
  const queue = new DurableQueueStore({ directory: join(directory, "queue"),
    instanceId: "instance-a" });
  const model = new FakeModel({ candidates: [] });
  const input = snapshot();
  input.entries = Array.from({ length: 20 }, (_, index) => ({
    id: `entry-${index}`, role: "user", text: "Evidence ".repeat(277),
  }));
  input.finalEntryId = "entry-19";
  const service = new CaptureService({ queue, model, client: new FakeClient(), logger,
    instanceId: "instance-a" });

  // Act.
  await service.enqueue(input);
  await service.checkpoint();
  await logger.flush();

  // Assert: actual evidence, with no queue archive or unrelated session context attached.
  const events = (await readFile(logger.filePath, "utf8")).trim().split("\n")
    .map((line) => JSON.parse(line));
  const event = events.find((entry) => entry.event === "capture.snapshot");
  assert.deepEqual(event.data.entries, input.entries);
  assert.deepEqual(event.data.entries, (model.requests[0]?.input as any).entries);
  assert.equal(event.data.history, undefined);
});

test("capture file records disabled and unsuccessful settlements as skipped", async (t) => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "capture-skipped-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-1", level: "info" });
  const queue = new DurableQueueStore({ directory: join(directory, "queue"),
    instanceId: "instance-a" });
  const service = new CaptureService({ queue, client: new FakeClient(), model: new FakeModel(),
    logger, instanceId: "instance-a" });

  // Act.
  await service.enqueue({ ...snapshot(), mode: "off" });
  await service.enqueue({ ...snapshot(), id: "failed-snapshot", finalStatus: "error" } as any);
  await logger.flush();

  // Assert.
  const events = (await readFile(logger.filePath, "utf8")).trim().split("\n")
    .map((line) => JSON.parse(line));
  assert.deepEqual(events.map((entry) => [entry.event, entry.data.reason]), [
    ["capture.skipped", "capture is off"],
    ["capture.skipped", "final run did not complete"],
  ]);
});

function memory(id: number, input: MemoryInput): Memory {
  return { ...input, id, is_obsolete: false, linked_memory_ids: [] };
}

class FakeClient implements ForgetfulClient {
  async createProject(): Promise<never> {
    throw new Error("Not used by capture");
  }
  async linkProject(): Promise<never> {
    throw new Error("Not used by capture");
  }
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

function providerResponse(
  content: AssistantMessage["content"],
  stopReason: AssistantMessage["stopReason"] = "stop",
): AssistantMessage {
  return {
    role: "assistant",
    api: "faux",
    provider: "fake",
    model: "memory",
    content,
    stopReason,
    timestamp: Date.now(),
  } as AssistantMessage;
}

function providerText(text: string): AssistantMessage {
  return providerResponse([{ type: "text", text }]);
}

function providerTool(
  id: string,
  name: string,
  args: Record<string, unknown>,
): AssistantMessage {
  return providerResponse(
    [{ type: "toolCall", id, name, arguments: args }],
    "toolUse",
  );
}

test("capture candidate submission retries through the durable checkpoint flow", async (t) => {
  // Arrange: the provider first submits the wrong shape, then corrects it after tool feedback.
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-capture-submission-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const contexts: Context[] = [];
  let captureAttempts = 0;
  const invalidCandidate = {
    id: "assistant-only",
    title: "Assistant suggestion",
    content: "This suggestion is not capture evidence.",
    context: "The assistant proposed it.",
    keywords: ["invalid"],
    tags: ["test"],
    sourceEntryIds: ["assistant-1"],
    evidenceType: "userDecision",
  };
  const validCandidate = {
    id: "valid-after-retry",
    title: "Use SQLite locally",
    content: "Local development uses SQLite.",
    context: "The user made this database decision.",
    keywords: ["sqlite"],
    tags: ["decision"],
    sourceEntryIds: ["user-1"],
    evidenceType: "userDecision",
  };
  const registry: ModelRegistryPort = {
    find: () => ({ provider: "fake", id: "memory" }) as any,
    complete: async (_model, context) => {
      contexts.push(structuredClone(context));
      const firstContent = context.messages[0]?.content;
      const input = typeof firstContent === "string"
        ? JSON.parse(firstContent) as Record<string, unknown>
        : {};
      if (Array.isArray(input.entries)) {
        if (!context.tools?.[0]) {
          return providerText(JSON.stringify({ candidates: [validCandidate] }));
        }
        captureAttempts += 1;
        if (captureAttempts === 1) {
          return providerTool("capture-1", "submit_capture_candidates", {
            candidates: "not-an-array",
          });
        }
        return providerTool("capture-2", "submit_capture_candidates", {
          candidates: [invalidCandidate, validCandidate],
        });
      }
      const output = { action: "create", reason: "No overlap." };
      return context.tools?.[0]
        ? providerTool("overlap-1", context.tools[0].name, output)
        : providerText(JSON.stringify(output));
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory" },
    { classificationTimeoutMs: 1_000 },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  // Act.
  await service.enqueue(snapshot());
  const result = await service.checkpoint();

  // Assert.
  assert.deepEqual(result.errors, []);
  assert.equal(captureAttempts, 2);
  const captureContexts = contexts.filter((context) => {
    const content = context.messages[0]?.content;
    return typeof content === "string" && content.includes('"entries"');
  });
  const candidateTool = captureContexts[0]?.tools?.[0];
  assert.equal(candidateTool?.name, "submit_capture_candidates");
  assert.match(candidateTool?.description ?? "", /when no durable.*candidates.*\[\]/i);
  assert.match(candidateTool?.description ?? "", /every candidate must include/i);
  assert.match(candidateTool?.description ?? "", /never cite assistant/i);
  const candidateParameters = candidateTool?.parameters as {
    properties?: {
      candidates?: {
        items?: {
          properties?: Record<string, {
            description?: string;
            enum?: string[];
            items?: { type?: string };
          }>;
        };
      };
    };
  };
  const candidateProperties = candidateParameters.properties?.candidates?.items?.properties ?? {};
  assert.deepEqual(
    Object.keys(candidateProperties).slice(0, 4),
    ["id", "title", "content", "context"],
  );
  for (const name of ["id", "title", "content", "context", "keywords", "tags"]) {
    assert.ok(candidateProperties[name]?.description, `${name} must describe its meaning`);
  }
  assert.deepEqual(candidateProperties.evidenceType?.enum, [
    "userDecision",
    "verifiedToolChange",
  ]);
  assert.match(candidateProperties.sourceEntryIds?.description ?? "", /never.*assistant/i);
  assert.match(candidateProperties.evidenceType?.description ?? "", /userDecision.*user/i);
  assert.match(candidateProperties.evidenceType?.description ?? "", /verifiedToolChange.*tool/i);
  assert.equal(candidateProperties.entities?.items?.type, "object");
  const feedback = captureContexts[1]?.messages.at(-1) as Record<string, any>;
  assert.equal(feedback.role, "toolResult");
  assert.equal(feedback.toolCallId, "capture-1");
  assert.equal(feedback.isError, true);
  assert.match(feedback.content[0].text, /candidates\.0: must be object/);
  assert.equal(client.created.length, 1);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(job?.status, "complete");
  assert.equal(
    (job?.candidateOutcomes[invalidCandidate.id] as { stage?: string })?.stage,
    "skipped",
  );
  assert.equal(
    (job?.candidateOutcomes[validCandidate.id] as { stage?: string })?.stage,
    "created",
  );
  const diagnostics = await service.diagnostics();
  const diagnosticJob = diagnostics.jobs[0] as typeof diagnostics.jobs[number] & {
    submissionRejections?: string[];
  };
  assert.equal(diagnosticJob.submissionRejections?.length, 1);
  assert.match(diagnosticJob.submissionRejections?.[0] ?? "", /must be object/);
});

test("capture retries when every submitted candidate has invalid evidence", async (t) => {
  // Arrange: the first tool call cites only ineligible evidence, then corrects both fields.
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-capture-evidence-retry-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const contexts: Context[] = [];
  let captureAttempts = 0;
  const registry: ModelRegistryPort = {
    find: () => ({ provider: "fake", id: "memory" }) as any,
    complete: async (_model, context) => {
      contexts.push(structuredClone(context));
      const firstContent = context.messages[0]?.content;
      const input = typeof firstContent === "string"
        ? JSON.parse(firstContent) as Record<string, unknown>
        : {};
      if (Array.isArray(input.entries)) {
        captureAttempts += 1;
        if (captureAttempts === 1) {
          return providerTool("capture-invalid-evidence", "submit_capture_candidates", {
            candidates: [
              {
                id: "wrong-tool-kind",
                title: "SQLite locally",
                content: "Local development uses SQLite.",
                context: "The user adopted the database decision.",
                keywords: ["sqlite"],
                tags: ["decision"],
                sourceEntryIds: ["user-1"],
                evidenceType: "verifiedToolChange",
              },
              {
                id: "assistant-evidence",
                title: "Migration completed",
                content: "The database migration was completed.",
                context: "The assistant reported completion.",
                keywords: ["migration"],
                tags: ["change"],
                sourceEntryIds: ["assistant-1"],
                evidenceType: "userDecision",
              },
            ],
          });
        }
        return providerTool("capture-corrected-evidence", "submit_capture_candidates", {
          candidates: [{
            id: "corrected-user-decision",
            title: "SQLite locally",
            content: "Local development uses SQLite.",
            context: "The user adopted the database decision.",
            keywords: ["sqlite"],
            tags: ["decision"],
            sourceEntryIds: ["user-1"],
            evidenceType: "userDecision",
          }],
        });
      }
      return providerTool("overlap-create", "submit_capture_decision", {
        action: "create",
        reason: "No overlap.",
      });
    },
  };
  const service = new CaptureService({
    queue,
    client,
    model: new PiMemoryModel(
      registry,
      { provider: "fake", id: "memory" },
      { classificationTimeoutMs: 1_000 },
    ),
    instanceId: "instance-a",
  });

  // Act.
  await service.enqueue(snapshot());
  const result = await service.checkpoint();

  // Assert: all-invalid gets correction feedback; a valid sibling submission still writes.
  assert.deepEqual(result.errors, []);
  assert.equal(captureAttempts, 2);
  const feedback = contexts[1]?.messages.at(-1) as Record<string, any> | undefined;
  assert.equal(feedback?.role, "toolResult");
  assert.equal(feedback?.toolCallId, "capture-invalid-evidence");
  assert.equal(feedback?.isError, true);
  assert.match(feedback?.content?.[0]?.text ?? "", /verified tool changes require/i);
  assert.match(feedback?.content?.[0]?.text ?? "", /assistant messages are not eligible/i);
  assert.equal(client.created.length, 1);
  const diagnostics = await service.diagnostics();
  assert.equal(diagnostics.jobs[0]?.status, "complete");
  assert.equal(diagnostics.jobs[0]?.candidates.length, 1);
  assert.equal(diagnostics.jobs[0]?.candidates[0]?.stage, "created");
  assert.ok(diagnostics.jobs[0]?.submissionRejections?.some(
    (reason) => /all submitted capture candidates were invalid/i.test(reason),
  ));
});

test("capture overlap submission retries through the durable checkpoint flow", async (t) => {
  // Arrange: an existing overlap receives one invalid ID, then a corrected decision.
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-overlap-submission-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
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
  const candidate = {
    id: "candidate-overlap-retry",
    title: "Use SQLite",
    content: "The project uses SQLite.",
    context: "The user changed the database decision.",
    keywords: ["database"],
    tags: ["decision"],
    sourceEntryIds: ["user-1"],
    evidenceType: "userDecision",
  };
  const contexts: Context[] = [];
  let overlapAttempts = 0;
  const registry: ModelRegistryPort = {
    find: () => ({ provider: "fake", id: "memory" }) as any,
    complete: async (_model, context) => {
      contexts.push(structuredClone(context));
      const firstContent = context.messages[0]?.content;
      const input = typeof firstContent === "string"
        ? JSON.parse(firstContent) as Record<string, unknown>
        : {};
      if (Array.isArray(input.entries)) {
        return providerTool("capture-1", "submit_capture_candidates", {
          candidates: [candidate],
        });
      }
      overlapAttempts += 1;
      if (overlapAttempts === 1 && !context.tools?.length) {
        return providerText(JSON.stringify({
          action: "supersede",
          conflictingMemoryId: old.id,
          oldClaim: old.content,
          newClaim: candidate.content,
          reason: "The project migrated databases.",
          sourceEntryIds: candidate.sourceEntryIds,
        }));
      }
      if (overlapAttempts === 1) {
        return providerTool("decision-1", "submit_capture_decision", {
          action: "supersede",
          conflictingMemoryId: old.id + 1,
          oldClaim: old.content,
          newClaim: candidate.content,
          reason: "The project migrated databases.",
          sourceEntryIds: candidate.sourceEntryIds,
        });
      }
      return providerTool("decision-2", "submit_capture_decision", {
        action: "supersede",
        conflictingMemoryId: old.id,
        oldClaim: old.content,
        newClaim: candidate.content,
        reason: "The project migrated databases.",
        sourceEntryIds: candidate.sourceEntryIds,
      });
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory" },
    { classificationTimeoutMs: 1_000 },
  );
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  // Act.
  await service.enqueue(snapshot());
  const result = await service.checkpoint();

  // Assert.
  assert.deepEqual(result.errors, []);
  assert.equal(overlapAttempts, 2);
  const overlapContexts = contexts.filter((context) => {
    const content = context.messages[0]?.content;
    return typeof content === "string" && content.includes('"candidate"');
  });
  const decisionTool = overlapContexts[0]?.tools?.[0];
  assert.equal(decisionTool?.name, "submit_capture_decision");
  assert.match(decisionTool?.description ?? "", /create.*skip.*supersede.*escalate/i);
  assert.match(decisionTool?.description ?? "", /only.*supplied overlap/i);
  const decisionParameters = decisionTool?.parameters as {
    properties?: Record<string, { description?: string; enum?: string[] }>;
  };
  assert.deepEqual(decisionParameters.properties?.action?.enum, [
    "create",
    "skip",
    "supersede",
    "escalate",
  ]);
  for (const name of [
    "action",
    "reason",
    "conflictingMemoryId",
    "conflictingMemoryIds",
    "memoryId",
    "oldClaim",
    "newClaim",
    "sourceEntryIds",
    "partial",
  ]) {
    assert.ok(decisionParameters.properties?.[name]?.description,
      `${name} must describe its meaning`);
  }
  const feedback = overlapContexts[1]?.messages.at(-1) as Record<string, any> | undefined;
  assert.equal(feedback?.role, "toolResult");
  assert.equal(feedback?.toolCallId, "decision-1");
  assert.equal(feedback?.toolName, "submit_capture_decision");
  assert.equal(feedback?.isError, true);
  assert.match(feedback?.content?.[0]?.text ?? "", /outside the overlap search/);
  assert.equal(client.created.length, 1);
  assert.deepEqual(client.superseded, [{ oldId: old.id, replacementId: 100 }]);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(job?.status, "complete");
});

test("exhausted overlap submission skips one candidate and continues siblings", async (t) => {
  // Arrange: the first candidate never calls its tool; the second submits a valid decision.
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-overlap-exhausted-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const old = memory(42, {
    title: "Existing choice",
    content: "The project uses PostgreSQL.",
    context: "Earlier decision",
    keywords: ["database"],
    tags: ["decision"],
    project_ids: [7],
  });
  client.searchResults = [old];
  client.memories.set(old.id, old);
  const candidates = [
    {
      id: "invalid-overlap",
      title: "Use SQLite",
      content: "The project uses SQLite.",
      context: "A database decision.",
      keywords: ["database"],
      tags: ["decision"],
      sourceEntryIds: ["user-1"],
      evidenceType: "userDecision",
    },
    {
      id: "valid-sibling",
      title: "Use Redis",
      content: "The project uses Redis for caching.",
      context: "A cache decision.",
      keywords: ["cache"],
      tags: ["decision"],
      sourceEntryIds: ["user-1"],
      evidenceType: "userDecision",
    },
  ];
  let invalidAttempts = 0;
  let siblingAttempts = 0;
  const registry: ModelRegistryPort = {
    find: () => ({ provider: "fake", id: "memory" }) as any,
    complete: async (_model, context) => {
      const content = context.messages[0]?.content;
      const input = typeof content === "string"
        ? JSON.parse(content) as Record<string, any>
        : {};
      if (Array.isArray(input.entries)) {
        return providerTool("capture-1", "submit_capture_candidates", { candidates });
      }
      if (input.candidate?.id === "invalid-overlap") {
        invalidAttempts += 1;
        return providerText(JSON.stringify({ action: "skip", reason: "JSON is not a call." }));
      }
      siblingAttempts += 1;
      return providerTool("decision-sibling", "submit_capture_decision", {
        action: "create",
        reason: "This is a separate cache decision.",
      });
    },
  };
  const service = new CaptureService({
    queue,
    client,
    model: new PiMemoryModel(
      registry,
      { provider: "fake", id: "memory" },
      { classificationTimeoutMs: 1_000 },
    ),
    instanceId: "instance-a",
  });

  // Act.
  await service.enqueue(snapshot());
  const result = await service.checkpoint();

  // Assert.
  assert.deepEqual(result.errors, []);
  assert.equal(invalidAttempts, 3);
  assert.equal(siblingAttempts, 1);
  assert.equal(client.created.length, 1);
  const job = (await queue.listJobs({ instanceId: "instance-a" }))[0];
  assert.equal(job?.status, "complete");
  assert.equal(
    (job?.candidateOutcomes[candidates[0]!.id] as { stage?: string })?.stage,
    "skipped",
  );
  assert.equal(
    (job?.candidateOutcomes[candidates[1]!.id] as { stage?: string })?.stage,
    "created",
  );
});

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
  const diagnostics = await service.diagnostics();
  const rejected = diagnostics.jobs[0]?.candidates.find(
    (candidate) => candidate.id === "candidate-assistant-only",
  );
  assert.equal(rejected?.reason, "assistant messages are not eligible evidence");
  assert.equal(
    (
      job?.candidateOutcomes["candidate-valid-after-invalid"] as {
        stage?: string;
      }
    )?.stage,
    "created",
  );
});

test("capture diagnostics report exact extraction validation reasons", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-validation-reasons-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const client = new FakeClient();
  const candidate = {
    content: "A durable fact.",
    context: "A user decision.",
    keywords: ["fact"],
    tags: ["decision"],
    sourceEntryIds: ["user-1"],
  };
  const model = new FakeModel({
    candidates: [
      { ...candidate, id: "missing-title" },
      {
        ...candidate,
        id: "unknown-evidence",
        title: "Unknown evidence",
        sourceEntryIds: ["unknown-entry"],
      },
      {
        ...candidate,
        id: "invalid-destination",
        title: "Invalid destination",
        destinationProjectId: 0,
      },
    ],
  });
  const service = new CaptureService({
    queue,
    client,
    model,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();

  const diagnostics = await service.diagnostics();
  const reasons = Object.fromEntries(
    diagnostics.jobs[0]?.candidates.map(({ id, reason }) => [id, reason]) ?? [],
  );
  assert.deepEqual(reasons, {
    "missing-title": "title is missing, empty, or longer than 200 characters",
    "unknown-evidence": "sourceEntryIds references unknown evidence",
    "invalid-destination":
      "destination project requires a positive ID or non-empty name",
  });
});

test("partial supersession retries and logs both memory IDs and destination", async (t) => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-capture-retry-"),
  );
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-1", level: "info" });
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
    logger,
    instanceId: "instance-a",
  });

  await service.enqueue(snapshot());
  await service.checkpoint();
  assert.equal(client.created.length, 1);
  assert.equal(client.superseded.length, 0);
  await service.checkpoint();

  assert.equal(client.created.length, 1);
  assert.deepEqual(client.superseded, [{ oldId: 41, replacementId: 100 }]);
  await logger.flush();
  const events = (await readFile(logger.filePath, "utf8")).trim().split("\n")
    .map((line) => JSON.parse(line));
  const superseded = events.find((entry) => entry.data.stage === "superseded");
  assert.equal(superseded.data.oldMemoryId, 41);
  assert.equal(superseded.data.replacementId, 100);
  assert.equal(superseded.data.destinationProjectId, 7);
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
