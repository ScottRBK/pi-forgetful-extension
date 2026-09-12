import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import type { ToolCall } from "@earendil-works/pi-ai";
import { loadForgetfulConfig, type ForgetfulConfig } from "../src/config.ts";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import { sanitizeText } from "../src/privacy.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { startForgetful } from "./real-forgetful.ts";

// Opt-in: spends model credits. REST uses an isolated SQLite database and fixed embeddings.
// Ordinary tests never invoke a paid provider. Credentials stay in Pi's normal auth store.
const enabled = process.env.FORGETFUL_LIVE_CAPTURE === "1";

type SubmissionFault = "candidate-invalid" | "decision-invalid";

interface ModelObservation {
  name: string;
  fault?: SubmissionFault;
  elapsedMs?: number;
  passed?: boolean;
  providerCalls: number;
  candidateCalls: number;
  decisionCalls: number;
  feedback: string[];
  responses: unknown[];
  faultInjected?: boolean;
}

function startObservation(
  t: TestContext,
  observations: ModelObservation[],
  name: string,
  fault?: SubmissionFault,
): ModelObservation {
  const started = performance.now();
  const observation: ModelObservation = {
    name,
    ...(fault ? { fault } : {}),
    providerCalls: 0,
    candidateCalls: 0,
    decisionCalls: 0,
    feedback: [],
    responses: [],
  };
  observations.push(observation);
  t.after(() => {
    observation.elapsedMs = Math.round(performance.now() - started);
  });
  return observation;
}

function captureSnapshot(project: { id: number; name: string; repo_name?: string | null },
  userText: string,
  assistantText = "The adopted project decision is recorded in the completed turn.",
): CaptureSnapshot {
  const id = randomUUID();
  const userEntryId = `user-${id}`;
  return {
    id: `capture-${id}`,
    context: {
      cwd: process.cwd(),
      repoName: project.repo_name ?? undefined,
      project,
      sessionId: `session-${id}`,
      branchId: "live-capture",
    },
    instanceId: `live-capture-${id}`,
    entries: [
      { id: userEntryId, role: "user", text: userText },
      { id: `assistant-${id}`, role: "assistant", text: assistantText },
    ],
    finalEntryId: `assistant-${id}`,
    mode: "auto",
    scope: "project",
    policy: "Capture only durable, explicitly adopted project knowledge.",
    modelVersion: "live-configured-model",
    createdAt: new Date().toISOString(),
  };
}

function observedRegistry(
  registry: ModelRegistry,
  observation: ModelObservation,
  fault?: SubmissionFault,
): ModelRegistryPort {
  return {
    find: (provider, id) => registry.find(provider, id),
    async complete(model, context, options) {
      observation.providerCalls += 1;
      if (context.tools?.some((tool) => tool.name === "submit_capture_candidates")) {
        observation.candidateCalls += 1;
      }
      if (context.tools?.some((tool) => tool.name === "submit_capture_decision")) {
        observation.decisionCalls += 1;
      }
      for (const message of context.messages) {
        if (message.role !== "toolResult" || !message.isError) continue;
        const text = message.content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n");
        if (!observation.feedback.includes(text)) observation.feedback.push(text);
      }
      const response = await registry.complete(model, context, options);
      observation.responses.push({
        stopReason: response.stopReason,
        content: response.content.filter((part) => part.type !== "thinking"),
      });
      const candidateCall = context.tools?.some(
        (tool) => tool.name === "submit_capture_candidates",
      );
      const decisionCall = context.tools?.some(
        (tool) => tool.name === "submit_capture_decision",
      );
      const shouldCorrupt = !observation.faultInjected &&
        ((fault === "candidate-invalid" && candidateCall) ||
          (fault === "decision-invalid" && decisionCall));
      if (!shouldCorrupt) return response;
      const corrupted = structuredClone(response);
      const call = corrupted.content.find(
        (part): part is ToolCall => part.type === "toolCall",
      );
      assert.ok(call, "The first genuine response must call the capture submission tool");
      if (fault === "candidate-invalid") {
        const firstMessage = context.messages[0];
        if (firstMessage?.role !== "user" || typeof firstMessage.content !== "string") {
          throw new Error("The live capture request must contain JSON user input");
        }
        const input = JSON.parse(firstMessage.content) as {
          entries?: Array<{ id?: string; role?: string }>;
        };
        const userId = input.entries?.find((entry) => entry.role === "user")?.id;
        assert.ok(userId, "The live capture request must contain user evidence");
        call.arguments = {
          candidates: [{
            id: "deliberately-invalid-evidence",
            title: "Deliberately invalid evidence",
            content: "This candidate deliberately uses the wrong evidence type.",
            context: "Acceptance-test fault injection.",
            keywords: ["acceptance"],
            tags: ["test"],
            sourceEntryIds: [userId],
            evidenceType: "verifiedToolChange",
          }],
        };
      } else {
        call.arguments = {
          action: "supersede",
          conflictingMemoryId: 999_999,
          oldClaim: "Deliberately corrupted old claim.",
          newClaim: "Deliberately corrupted new claim.",
          reason: "Deliberate acceptance-test corruption.",
          sourceEntryIds: ["invalid-source-entry"],
        };
      }
      observation.faultInjected = true;
      return corrupted;
    },
  };
}

async function liveCaptureService(
  t: TestContext,
  client: ApiForgetfulClient,
  registry: ModelRegistry,
  config: ForgetfulConfig,
  snapshot: CaptureSnapshot,
  observation: ModelObservation,
  fault?: SubmissionFault,
): Promise<CaptureService> {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-live-capture-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({
    directory,
    instanceId: snapshot.instanceId,
  });
  return new CaptureService({
    queue,
    client,
    model: new PiMemoryModel(
      observedRegistry(registry, observation, fault),
      config.model!,
      {
        sessionId: snapshot.context.sessionId,
        classificationTimeoutMs: config.recallModelTimeoutMs,
      },
    ),
    instanceId: snapshot.instanceId,
  });
}

test("live capture submissions with the configured memory model", {
  skip: !enabled && "Set FORGETFUL_LIVE_CAPTURE=1 and FORGETFUL_TEST_SOURCE (paid calls)",
  timeout: 900_000,
}, async (t) => {
  // Arrange: real Pi provider/auth and real Forgetful REST, never the production database.
  assert.ok(process.env.FORGETFUL_TEST_SOURCE, "FORGETFUL_TEST_SOURCE is required");
  const config = await loadForgetfulConfig({ cwd: process.cwd(), trusted: true });
  assert.ok(config.model, "Configure a memory model before running live tests");
  const registry = new ModelRegistry(await ModelRuntime.create());
  assert.ok(registry.find(config.model.provider, config.model.id), "Configured model must exist");
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 5_000 });
  const observations: ModelObservation[] = [];
  t.after(async () => {
    const natural = observations.filter((observation) => !observation.fault);
    const forced = observations.filter((observation) => observation.fault);
    const summary = {
      model: `${config.model!.provider}/${config.model!.id}`,
      naturalRuns: natural.length,
      naturalPassed: natural.filter((observation) => observation.passed).length,
      naturalFirstTry: natural.filter((observation) =>
        observation.passed && observation.feedback.length === 0).length,
      forcedRuns: forced.length,
      forcedRecovered: forced.filter((observation) =>
        observation.passed && observation.feedback.length > 0).length,
      providerCalls: observations.reduce(
        (sum, observation) => sum + observation.providerCalls,
        0,
      ),
      candidateCalls: observations.reduce(
        (sum, observation) => sum + observation.candidateCalls,
        0,
      ),
      decisionCalls: observations.reduce(
        (sum, observation) => sum + observation.decisionCalls,
        0,
      ),
    };
    const directory = join(process.cwd(), "test-results");
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, "capture-submission-live.json"),
      sanitizeText(JSON.stringify({ summary, observations }, null, 2)) + "\n",
      { mode: 0o600 },
    );
    t.diagnostic(JSON.stringify(summary));
  });

  await t.test("captures a novel explicit project decision", async (t) => {
    // Arrange.
    const project = await client.createProject({
      name: "Live novel capture",
      repo_name: `test/live-capture-${randomUUID()}`,
      description: "Disposable live capture acceptance fixture.",
    });
    const snapshot = captureSnapshot(
      project,
      "We have explicitly decided and adopted this durable project rule: local development " +
        "must use SQLite databases. This is a final decision, not a suggestion.",
    );
    const observation = startObservation(t, observations, "novel-decision");
    const service = await liveCaptureService(
      t,
      client,
      registry,
      config,
      snapshot,
      observation,
    );

    // Act.
    const queued = await service.enqueue(snapshot);
    const result = await service.checkpoint();
    const diagnostics = await service.diagnostics({ jobId: queued.jobId });

    // Assert.
    assert.equal(queued.queued, true);
    assert.deepEqual(result.errors, []);
    assert.equal(diagnostics.jobs[0]?.status, "complete");
    const created = diagnostics.jobs[0]?.candidates.find(
      (candidate) => candidate.stage === "created",
    );
    assert.ok(created?.memoryId, "The live model must produce one created memory");
    const stored = await client.get(created.memoryId);
    assert.match(stored.content, /SQLite/i);
    assert.deepEqual(stored.project_ids, [project.id]);
    assert.ok(observation.candidateCalls >= 1);
    assert.ok(observation.decisionCalls >= 1);
    assert.equal(observation.feedback.length, 0);
    observation.passed = true;
    t.diagnostic(JSON.stringify({
      providerCalls: observation.providerCalls,
      candidateCalls: observation.candidateCalls,
      decisionCalls: observation.decisionCalls,
    }));
  });

  await t.test("submits no candidate for routine conversation", async (t) => {
    // Arrange.
    const project = await client.createProject({
      name: "Live empty capture",
      repo_name: `test/live-capture-${randomUUID()}`,
      description: "Disposable no-candidate acceptance fixture.",
    });
    const snapshot = captureSnapshot(
      project,
      "Thanks. Please acknowledge this message. There is no project decision, reusable fact, " +
        "preference, or verified change in this conversation.",
      "Acknowledged.",
    );
    const observation = startObservation(t, observations, "no-candidate");
    const service = await liveCaptureService(
      t,
      client,
      registry,
      config,
      snapshot,
      observation,
    );

    // Act.
    const queued = await service.enqueue(snapshot);
    const result = await service.checkpoint();
    const diagnostics = await service.diagnostics({ jobId: queued.jobId });
    const stored = await client.search({
      query: "routine acknowledgement",
      query_context: "Confirm that routine conversation produced no durable memory.",
      project_ids: [project.id],
      strict_project_filter: true,
    });

    // Assert.
    assert.deepEqual(result.errors, []);
    assert.equal(diagnostics.jobs[0]?.status, "complete");
    assert.deepEqual(diagnostics.jobs[0]?.candidates, []);
    assert.deepEqual(stored, []);
    assert.equal(observation.candidateCalls, 1);
    assert.equal(observation.decisionCalls, 0);
    assert.equal(observation.feedback.length, 0);
    observation.passed = true;
    t.diagnostic(JSON.stringify({
      providerCalls: observation.providerCalls,
      candidateCalls: observation.candidateCalls,
      decisionCalls: observation.decisionCalls,
    }));
  });

  await t.test("supersedes an outdated memory after an explicit decision change", async (t) => {
    // Arrange.
    const project = await client.createProject({
      name: "Live contradiction capture",
      repo_name: `test/live-capture-${randomUUID()}`,
      description: "Disposable supersession acceptance fixture.",
    });
    const previous = await client.create({
      title: "Local development database",
      content: "Local development must use PostgreSQL databases.",
      context: "The previously adopted database rule.",
      keywords: ["local development", "database", "PostgreSQL"],
      tags: ["decision"],
      importance: 8,
      project_ids: [project.id],
    });
    const snapshot = captureSnapshot(
      project,
      "We have changed the existing local development database decision. Local development " +
        "must now use SQLite databases instead of PostgreSQL. This replacement is final and " +
        "explicitly adopted; the previous PostgreSQL rule is no longer valid.",
    );
    const observation = startObservation(t, observations, "supersession");
    const service = await liveCaptureService(
      t,
      client,
      registry,
      config,
      snapshot,
      observation,
    );

    // Act.
    const queued = await service.enqueue(snapshot);
    const result = await service.checkpoint();
    const diagnostics = await service.diagnostics({ jobId: queued.jobId });

    // Assert.
    assert.deepEqual(result.errors, []);
    assert.equal(diagnostics.jobs[0]?.status, "complete");
    const superseded = diagnostics.jobs[0]?.candidates.find(
      (candidate) => candidate.stage === "superseded",
    );
    assert.equal(superseded?.action, "supersede");
    assert.ok(superseded?.replacementId, "A replacement memory must be created");
    const oldMemory = await client.get(previous.id);
    const replacement = await client.get(superseded.replacementId);
    assert.equal(oldMemory.is_obsolete, true);
    assert.equal(oldMemory.superseded_by, replacement.id);
    assert.match(replacement.content, /SQLite/i);
    assert.doesNotMatch(replacement.content, /must use PostgreSQL/i);
    assert.deepEqual(replacement.project_ids, [project.id]);
    assert.equal(observation.candidateCalls, 1);
    assert.equal(observation.decisionCalls, 1);
    assert.equal(observation.feedback.length, 0);
    observation.passed = true;
    t.diagnostic(JSON.stringify({
      providerCalls: observation.providerCalls,
      candidateCalls: observation.candidateCalls,
      decisionCalls: observation.decisionCalls,
    }));
  });

  await t.test("recovers after an invalid candidate submission", async (t) => {
    // Arrange.
    const project = await client.createProject({
      name: "Live candidate recovery",
      repo_name: `test/live-capture-${randomUUID()}`,
      description: "Disposable candidate-retry acceptance fixture.",
    });
    const snapshot = captureSnapshot(
      project,
      "We explicitly decided and adopted that all local test fixtures must use SQLite. " +
        "This is a durable final project rule, not a suggestion.",
    );
    const observation = startObservation(
      t,
      observations,
      "candidate-recovery",
      "candidate-invalid",
    );
    const service = await liveCaptureService(
      t,
      client,
      registry,
      config,
      snapshot,
      observation,
      "candidate-invalid",
    );

    // Act.
    const queued = await service.enqueue(snapshot);
    const result = await service.checkpoint();
    const diagnostics = await service.diagnostics({ jobId: queued.jobId });

    // Assert.
    assert.deepEqual(result.errors, []);
    const created = diagnostics.jobs[0]?.candidates.find(
      (candidate) => candidate.stage === "created",
    );
    assert.ok(created?.memoryId, "The corrected submission must create a memory");
    assert.ok(observation.faultInjected);
    assert.ok(observation.candidateCalls >= 2 && observation.candidateCalls <= 3);
    assert.equal(observation.decisionCalls, 1);
    assert.ok(observation.feedback.some(
      (message) => /verified tool changes require only tool result evidence/i.test(message),
    ));
    assert.ok(diagnostics.jobs[0]?.submissionRejections?.some(
      (message) => /verified tool changes require only tool result evidence/i.test(message),
    ));
    const stored = await client.get(created.memoryId);
    assert.match(stored.content, /SQLite/i);
    observation.passed = true;
    t.diagnostic(JSON.stringify({
      providerCalls: observation.providerCalls,
      candidateCalls: observation.candidateCalls,
      decisionCalls: observation.decisionCalls,
      rejections: observation.feedback.length,
    }));
  });

  await t.test("recovers after an invalid overlap decision", async (t) => {
    // Arrange.
    const project = await client.createProject({
      name: "Live overlap recovery",
      repo_name: `test/live-capture-${randomUUID()}`,
      description: "Disposable overlap-retry acceptance fixture.",
    });
    const previous = await client.create({
      title: "Test fixture database",
      content: "Local test fixtures must use PostgreSQL.",
      context: "The previously adopted fixture database rule.",
      keywords: ["test fixtures", "database", "PostgreSQL"],
      tags: ["decision"],
      importance: 8,
      project_ids: [project.id],
    });
    const snapshot = captureSnapshot(
      project,
      "We have explicitly replaced the existing test fixture database rule. Local test " +
        "fixtures must now use SQLite instead of PostgreSQL. The old PostgreSQL rule is no " +
        "longer valid, and this replacement is final.",
    );
    const observation = startObservation(
      t,
      observations,
      "decision-recovery",
      "decision-invalid",
    );
    const service = await liveCaptureService(
      t,
      client,
      registry,
      config,
      snapshot,
      observation,
      "decision-invalid",
    );

    // Act.
    const queued = await service.enqueue(snapshot);
    const result = await service.checkpoint();
    const diagnostics = await service.diagnostics({ jobId: queued.jobId });

    // Assert.
    assert.deepEqual(result.errors, []);
    const superseded = diagnostics.jobs[0]?.candidates.find(
      (candidate) => candidate.stage === "superseded",
    );
    assert.ok(superseded?.replacementId, "The corrected decision must supersede the old memory");
    assert.ok(observation.faultInjected);
    assert.equal(observation.candidateCalls, 1);
    assert.ok(observation.decisionCalls >= 2 && observation.decisionCalls <= 3);
    assert.ok(observation.feedback.some((message) => /overlap search/i.test(message)));
    assert.ok(diagnostics.jobs[0]?.submissionRejections?.some(
      (message) => /overlap search/i.test(message),
    ));
    const oldMemory = await client.get(previous.id);
    const replacement = await client.get(superseded.replacementId);
    assert.equal(oldMemory.is_obsolete, true);
    assert.equal(oldMemory.superseded_by, replacement.id);
    assert.match(replacement.content, /SQLite/i);
    observation.passed = true;
    t.diagnostic(JSON.stringify({
      providerCalls: observation.providerCalls,
      candidateCalls: observation.candidateCalls,
      decisionCalls: observation.decisionCalls,
      rejections: observation.feedback.length,
    }));
  });
});
