import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import type { AssistantMessage, Context, Model } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const instanceId = "immediate-feedback";
const fact = { id: "fact", title: "Storage", content: "Use SQLite.", context: "User decision",
  keywords: [], tags: [], sourceEntryIds: ["user"] };
type Call = { name: string; arguments: unknown };
async function fixture(t: TestContext, script: (context: Context) => Call) {
  const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
  const setup = new ApiForgetfulClient({ baseUrl });
  const project = await setup.createProject({ name: "Immediate feedback", description: "Test",
    repo_name: "test/immediate-feedback" });
  const directory = await mkdtemp(join(tmpdir(), "capture-immediate-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const posts: Array<{ path: string; body: any; status: number }> = [];
  const mutations: Array<{ method: string; path: string; body: any; status: number }> = [];
  const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
    const response = await fetch(url, init);
    if (["POST", "PUT", "DELETE"].includes(init?.method ?? "")) mutations.push({
      method: init!.method!, path: new URL(String(url)).pathname,
      body: init!.body ? JSON.parse(init!.body as string) : undefined, status: response.status });
    if (init?.method === "POST") posts.push({ path: new URL(String(url)).pathname,
      body: JSON.parse(init.body as string), status: response.status });
    return response;
  } });
  const contexts: Context[] = [];
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 4_000,
      contextWindow: 100_000, input: ["text"] }) as Model<any>,
    complete: async (_model, context) => {
      contexts.push(structuredClone(context));
      const call = script(context);
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: `call-${contexts.length}`, ...call }],
        stopReason: "toolUse", timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      } as AssistantMessage;
    },
  }, { provider: "test", id: "memory" });
  const queue = new DurableQueueStore({ directory, instanceId });
  const snapshot: CaptureSnapshot = { id: "snapshot", instanceId, finalEntryId: "answer",
    context: { cwd: directory, sessionId: "session", branchId: "branch", project },
    entries: [{ id: "user", role: "user", text: "Use SQLite." },
      { id: "answer", role: "assistant", text: "Done." }],
    mode: "auto", scope: "global", policy: "", modelVersion: "test",
    createdAt: new Date().toISOString() };
  return { setup, project, directory, posts, mutations, client, queue, snapshot, model, contexts };
}

function task(context: Context) {
  return context.tools!.find(tool => tool.name.startsWith("submit_"))!.name;
}

test("real overlong POST is corrected immediately after a required paired failure report",
  realOptions, async (t) => {
    // Arrange: the provider first tries to bypass reporting, then reads and corrects the failure.
    const overlong = { ...fact, content: "x".repeat(2001) };
    let correctionTurns = 0;
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [overlong] } };
      if (name === "submit_capture_decision") return { name, arguments: { action: "create" } };
      assert.equal(name, "submit_capture_correction");
      correctionTurns++;
      return correctionTurns === 2
        ? { name: "report_capture_execution_failure", arguments: {} }
        : { name, arguments: { candidate: fact } };
    });
    const service = new CaptureService({ ...f, instanceId });

    // Act: one drain includes the rejected request, correction, and successful save.
    const queued = await service.enqueue(f.snapshot);
    const result = await service.checkpoint();

    // Assert: no retry warning; failed payload and server diagnostic survive the report.
    assert.deepEqual(result.errors, []);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(correctionTurns, 3);
    const writes = f.posts.filter(post => post.path.endsWith("/memories"));
    assert.deepEqual(writes.map(write => write.status), [400, 201]);
    assert.equal(writes[0]!.body.content, overlong.content);
    assert.equal(writes[1]!.body.content, fact.content);
    const messages = f.contexts.at(-1)!.messages;
    const refused = messages.find(message => message.role === "toolResult" &&
      message.toolName === "submit_capture_correction");
    assert.ok(refused?.role === "toolResult" && refused.isError);
    assert.match(JSON.stringify(refused.content), /report_capture_execution_failure/);
    const feedback = messages.find(message => message.role === "toolResult" &&
      message.toolName === "report_capture_execution_failure");
    assert.ok(feedback?.role === "toolResult" && feedback.isError);
    assert.equal(feedback.toolCallId, "call-4");
    assert.ok(JSON.stringify(feedback.content).includes(overlong.content));
    assert.match(JSON.stringify(feedback.content), /HTTP 400.*2000/);
  });

for (const maxModelCalls of [1, 4]) {
  test(`execution cycles survive disk reopen with task budget ${maxModelCalls}`,
    realOptions, async (t) => {
      // Arrange: every model correction remains invalid; reporting is a read within each task.
      const invalid = { ...fact, content: "x".repeat(2001) };
      let reports = 0;
      const f = await fixture(t, context => {
        const name = task(context);
        if (name === "submit_capture_candidates") return { name, arguments: {
          candidates: [invalid] } };
        if (name === "submit_capture_decision") return { name, arguments: { action: "create" } };
        assert.equal(name, "submit_capture_correction");
        if (!context.messages.some(message => message.role === "toolResult" &&
            message.toolName === "report_capture_execution_failure")) {
          reports++;
          return { name: "report_capture_execution_failure", arguments: {} };
        }
        return { name, arguments: { candidate: invalid } };
      });
      const queued = await new CaptureService({ ...f, instanceId, maxModelCalls })
        .enqueue(f.snapshot);
      const failures: number[] = [];
      let job;

      // Act: every pass gets a new queue/service instance; budget progress is not a failure.
      for (let pass = 0; pass < 40; pass++) {
        const queue = new DurableQueueStore({ directory: f.directory, instanceId });
        const result = await new CaptureService({ ...f, queue, instanceId, maxModelCalls })
          .checkpoint();
        job = await queue.getJob(queued.jobId);
        if (result.errors.length) {
          failures.push(job?.attempts ?? (result.discardedJobs?.length ? 3 : -1));
          assert.equal(f.posts.filter(post => post.path.endsWith("/memories")).length,
            failures.length * 3);
        } else assert.equal(job!.attempts, failures.length);
        if (!job || job.status === "failed") break;
      }

      // Assert: three executions per cycle, three queue failures, never a replenished cycle.
      assert.equal(job, undefined);
      assert.deepEqual(failures, [1, 2, 3]);
      assert.equal(reports, 8); // Two corrections, then three in each later eligible cycle.
      assert.equal(f.posts.filter(post => post.path.endsWith("/memories")).length, 9);
    });
}

test("resource correction retains actual rejected input and completed memory/entity receipts",
  realOptions, async (t) => {
    // Arrange: fail the document after the memory and entity have already been accepted.
    const entity = { key: "database", input: { name: "SQLite", entity_type: "System" } };
    const document = { key: "design", input: { title: null, description: "Decision",
      content: "Use SQLite." } };
    const proposed = { ...fact, entities: [entity], documents: [document] };
    const corrected = { ...proposed, documents: [{ ...document,
      input: { ...document.input, title: "Storage design" } }] };
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [proposed] } };
      if (name === "submit_capture_decision") return { name, arguments: { action: "create" } };
      assert.equal(name, "submit_capture_correction");
      if (!context.messages.some(message => message.role === "toolResult"))
        return { name: "report_capture_execution_failure", arguments: {} };
      return { name, arguments: { candidate: corrected } };
    });
    const service = new CaptureService({ ...f, instanceId });

    // Act.
    const queued = await service.enqueue(f.snapshot);
    const result = await service.checkpoint();

    // Assert through provider messages, REST traffic, and disk queue status.
    assert.deepEqual(result.errors, []);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.posts.filter(post => post.path.endsWith("/memories")).length, 1);
    assert.equal(f.posts.filter(post => post.path.endsWith("/entities")).length, 1);
    const writes = f.posts.filter(post => post.path.endsWith("/documents"));
    assert.deepEqual(writes.map(write => write.status), [400, 201]);
    const feedback = f.contexts.at(-1)!.messages.find(message => message.role === "toolResult" &&
      message.toolName === "report_capture_execution_failure");
    assert.ok(feedback?.role === "toolResult" && feedback.isError);
    const content = feedback.content[0];
    assert.ok(content.type === "text");
    const failure = JSON.parse(content.text);
    assert.deepEqual(failure.knowledge.failure.input, writes[0]!.body);
    assert.equal(failure.knowledge.failure.key, "design");
    assert.match(failure.knowledge.failure.error, /POST .*documents.*HTTP 400/);
    assert.equal((await f.setup.knowledge.listDocuments(f.project.id)).length, 1);
  });

test("unknown model-selected destination is corrected using actual existing projects",
  realOptions, async (t) => {
    // Arrange: a model invents a destination although a real project is configured.
    let destination: number;
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [{ ...fact, destinationProjectId: 999999 }] } };
      if (name === "submit_capture_decision") return { name, arguments: { action: "create" } };
      assert.equal(name, "submit_capture_correction");
      if (!context.messages.some(message => message.role === "toolResult"))
        return { name: "report_capture_execution_failure", arguments: {} };
      const report = context.messages.find(message => message.role === "toolResult");
      assert.ok(report?.role === "toolResult" && report.isError);
      assert.match(JSON.stringify(report.content), /999999/);
      assert.match(JSON.stringify(report.content), /Immediate feedback/);
      return { name, arguments: { candidate: { ...fact, destinationProjectId: destination } } };
    });
    destination = f.project.id;
    const service = new CaptureService({ ...f, instanceId });

    // Act.
    const queued = await service.enqueue(f.snapshot);
    const result = await service.checkpoint();

    // Assert: only the model's corrected destination is written; no project is created.
    assert.deepEqual(result.errors, []);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    const writes = f.posts.filter(post => post.path.endsWith("/memories"));
    assert.equal(writes.length, 1);
    assert.deepEqual(writes[0]!.body.project_ids, [destination]);
    assert.equal(f.posts.filter(post => post.path.endsWith("/projects")).length, 0);
    assert.equal(f.contexts.filter(context => task(context) === "submit_capture_correction")
      .length, 2);
  });

test("lost entity-connection response stays uncertain across queue reopen", realOptions,
  async (t) => {
    // Arrange: the real service accepts the entity link before the transport loses its response.
    const proposed = { ...fact, entities: [{ key: "database",
      input: { name: "SQLite", entity_type: "System" } }] };
    let corrections = 0;
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [proposed] } };
      if (name === "submit_capture_decision") return { name, arguments: {
        action: "create", entityMemoryKeys: ["database"] } };
      corrections++;
      return { name, arguments: { candidate: proposed } };
    });
    const link = f.client.knowledge.linkEntityMemory.bind(f.client.knowledge);
    let links = 0;
    f.client.knowledge.linkEntityMemory = async (...args) => {
      links++;
      await link(...args);
      throw new Error("Accepted entity link response lost");
    };
    const service = new CaptureService({ ...f, instanceId });

    // Act.
    const queued = await service.enqueue(f.snapshot);
    const first = await service.checkpoint();
    const queue = new DurableQueueStore({ directory: f.directory, instanceId });
    await new CaptureService({ ...f, queue, instanceId }).checkpoint();

    // Assert: reporting is never permission to resend an uncertain connection.
    assert.equal(first.paused, true);
    assert.equal((await queue.getJob(queued.jobId))!.status, "paused");
    assert.equal(links, 1);
    assert.equal(corrections, 0);
  });

for (const maxModelCalls of [1, 4]) {
  test(`connection rejection keeps successful receipts across budget ${maxModelCalls} and restart`,
    realOptions, async (t) => {
      // Arrange: a successful link precedes a real rejected attachment PUT in every cycle.
      let targetId: number;
      let reports = 0;
      const f = await fixture(t, context => {
        const name = task(context);
        if (name === "submit_capture_candidates") return { name, arguments: {
          candidates: [fact] } };
        if (name === "submit_capture_decision") return { name, arguments: { action: "create" } };
        assert.equal(name, "submit_capture_links");
        if (context.tools!.some(tool => tool.name === "report_capture_execution_failure") &&
            !context.messages.some(message => message.role === "toolResult")) {
          reports++;
          return { name: "report_capture_execution_failure", arguments: {} };
        }
        return { name, arguments: { reviews: [{ candidateId: fact.id,
          decisions: [{ memoryId: targetId, action: "add", reason: "Related decision" }],
          preservation: { documentIds: ["bad"], codeArtifactIds: [], entityIds: [] },
        }] } };
      });
      targetId = (await f.setup.create({ ...fact, title: "Related decision",
        project_ids: [f.project.id] })).id;
      const queued = await new CaptureService({ ...f, instanceId, maxModelCalls })
        .enqueue(f.snapshot);
      const failures: number[] = [];
      let finished = false;

      // Act: reopen at every pass, leaving all accepted operations in their original receipts.
      for (let pass = 0; pass < 40; pass++) {
        const queue = new DurableQueueStore({ directory: f.directory, instanceId });
        const result = await new CaptureService({ ...f, queue, instanceId, maxModelCalls })
          .checkpoint();
        const job = await queue.getJob(queued.jobId);
        if (result.errors.length) {
          failures.push(job?.attempts ?? 3);
          assert.equal(f.mutations.filter(request => request.method === "PUT").length,
            failures.length * 3);
        } else assert.equal(job!.attempts, failures.length);
        if (!job) { finished = true; break; }
      }

      // Assert: connection cycles have independent durable bounds and never repeat the good link.
      assert.equal(finished, true);
      assert.deepEqual(failures, [1, 2, 3]);
      assert.equal(reports, 8);
      assert.equal(f.posts.filter(post => post.path.endsWith("/memories")).length, 1);
      assert.equal(f.posts.filter(post => post.path.endsWith("/links")).length, 1);
      assert.equal(f.mutations.filter(request => request.method === "PUT").length, 9);
      assert.ok(f.mutations.filter(request => request.method === "PUT")
        .every(request => [400, 422].includes(request.status)));
      const report = f.contexts.findLast(context => context.messages.some(message =>
        message.role === "toolResult" && message.toolName === "report_capture_execution_failure"));
      assert.match(JSON.stringify(report!.messages), /bad/);
      assert.match(JSON.stringify(report!.messages), /PUT.*HTTP (400|422)/);
    });
}

test("maintenance merge correction requires the complete composition before another POST",
  realOptions, async (t) => {
    // Arrange: a maintenance item selects a merge, whose complete composition is rejected.
    const maintenance = { id: "maintenance", kind: "maintenance",
      searchDescription: "Consolidate storage policy", sourceEntryIds: ["user"] };
    const combined = { title: "Storage policy", content: "Use SQLite with bounded retries.",
      context: "Consolidated adopted policy", keywords: ["storage"], tags: [], importance: 8 };
    let oldId: number;
    let corrections = 0;
    let compositions = 0;
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [maintenance] } };
      if (name === "submit_capture_decision") return { name, arguments: {
        action: "merge", conflictingMemoryIds: [oldId],
        reason: "Consolidate the storage policy." } };
      if (name === "submit_capture_merge") {
        compositions++;
        return { name, arguments: { ...combined, content: "x".repeat(2001) } };
      }
      assert.equal(name, "submit_capture_correction");
      if (!context.messages.some(message => message.role === "toolResult"))
        return { name: "report_capture_execution_failure", arguments: {} };
      corrections++;
      return { name, arguments: { candidate: corrections === 1 ? maintenance
        : { ...maintenance, ...combined } } };
    });
    oldId = (await f.setup.create({ ...combined, project_ids: [f.project.id] })).id;
    const service = new CaptureService({ ...f, instanceId });

    // Act: the incomplete correction must be corrected within the same private task.
    const queued = await service.enqueue(f.snapshot);
    const result = await service.checkpoint();

    // Assert at the REST, model and durable queue boundaries.
    assert.deepEqual(f.posts.filter(post => post.path.endsWith("/memories"))
      .map(post => post.status), [400, 201], "No incomplete composition may reach memory POST");
    assert.deepEqual(result.errors, []);
    const job = (await f.queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.attempts, 1);
    assert.equal(job.callCount, 4);
    assert.equal(compositions, 1);
    assert.equal(corrections, 2);
    const posted = f.posts.filter(post => post.path.endsWith("/memories")).at(-1)!.body;
    for (const [key, value] of Object.entries(combined)) assert.deepEqual(posted[key], value);
    const messages = f.contexts.at(-1)!.messages;
    assert.ok(messages.some(message => message.role === "toolResult" && message.isError &&
      message.toolName === "submit_capture_correction"), "Missing fields need private feedback");
    const report = messages.find(message => message.role === "toolResult" &&
      message.toolName === "report_capture_execution_failure");
    assert.ok(report?.role === "toolResult" && report.isError);
    assert.match(JSON.stringify(report.content), /HTTP 400/);
    const outcome = job.candidateOutcomes.maintenance as { replacementId: number };
    assert.equal((await f.setup.get(oldId)).superseded_by, outcome.replacementId);
    assert.equal((await f.setup.get(outcome.replacementId)).content, combined.content);
  });

test("legacy maintenance merge with missing composed fields recovers after queue reopen",
  realOptions, async (t) => {
    // Arrange: obtain a real rejected merge and reproduce its legacy incomplete saved plan.
    const maintenance = { id: "maintenance", kind: "maintenance",
      searchDescription: "Consolidate storage policy", sourceEntryIds: ["user"] };
    const combined = { title: "Recovered storage policy",
      content: "Use SQLite with bounded retries.",
      context: "Consolidated adopted policy", keywords: ["storage"], tags: [], importance: 8 };
    let oldId: number;
    let compositions = 0;
    let reports = 0;
    let corrections = 0;
    const f = await fixture(t, context => {
      const name = task(context);
      if (name === "submit_capture_candidates") return { name, arguments: {
        candidates: [maintenance] } };
      if (name === "submit_capture_decision") return { name, arguments: {
        action: "merge", conflictingMemoryIds: [oldId],
        reason: "Consolidate the storage policy." } };
      if (name === "submit_capture_merge") {
        compositions++;
        return { name, arguments: { ...combined, content: "x".repeat(2001) } };
      }
      assert.equal(name, "submit_capture_correction");
      if (!context.messages.some(message => message.role === "toolResult")) {
        reports++;
        return { name: "report_capture_execution_failure", arguments: {} };
      }
      corrections++;
      const report = context.messages.find(message => message.role === "toolResult");
      assert.match(JSON.stringify(report?.content), /HTTP 400/);
      return { name, arguments: { candidate: { ...maintenance, ...combined } } };
    });
    oldId = (await f.setup.create({ ...combined, project_ids: [f.project.id] })).id;
    const service = new CaptureService({ ...f, instanceId, maxModelCalls: 3 });
    const queued = await service.enqueue(f.snapshot);
    const first = await service.checkpoint();
    assert.deepEqual(first.errors, []);
    const pending = (await f.queue.getJob(queued.jobId))!;
    assert.equal(pending.attempts, 0, "A budget yield must not spend a failed attempt");
    const saved = pending.candidateOutcomes.maintenance as any;
    assert.equal(saved.creation.status, "rejected");
    const incomplete = { project_ids: [f.project.id] };
    let legacyError = "";
    try { await f.client.create(incomplete as any); }
    catch (error) { legacyError = (error as Error).message; }
    assert.match(legacyError, /HTTP 400/);
    const legacy = { ...saved, mergePlan: { ...saved.mergePlan, candidate: maintenance },
      creation: { status: "rejected", input: incomplete, error: legacyError },
      executionFailure: legacyError };
    delete legacy.correctionCycle;
    await f.queue.checkpoint(queued.jobId, { candidateOutcomes: { maintenance: legacy } });
    service.stop();

    // Act: a new worker must correct the old record within a one-task allowance.
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId });
    const restarted = new CaptureService({ ...f, queue: reopened, instanceId, maxModelCalls: 1 });
    const result = await restarted.checkpoint();

    // Assert: actual corrected fields reach REST once; the completed merge never replays.
    assert.deepEqual(result.errors, []);
    const job = (await reopened.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.attempts, 1);
    assert.equal(job.callCount, 1);
    assert.equal(compositions, 1);
    assert.equal(reports, 1);
    assert.equal(corrections, 1);
    const posts = f.posts.filter(post => post.path.endsWith("/memories"));
    assert.deepEqual(posts.map(post => post.status), [400, 400, 201]);
    for (const [key, value] of Object.entries(combined))
      assert.deepEqual(posts[2]!.body[key], value);
    const outcome = job.candidateOutcomes.maintenance as { replacementId: number };
    assert.equal((await f.setup.get(oldId)).superseded_by, outcome.replacementId);
    const correctionTask = f.contexts.find(context =>
      task(context) === "submit_capture_correction")!;
    const taskText = JSON.stringify(correctionTask.messages);
    assert.match(taskText, /Consolidate storage policy/);
    assert.match(taskText, /Recovered storage policy/);
    const tasksBefore = f.contexts.length;
    const writesBefore = f.mutations.length;
    await new CaptureService({ ...f, queue: reopened, instanceId, maxModelCalls: 1 }).checkpoint();
    assert.equal(f.contexts.length, tasksBefore);
    assert.equal(f.mutations.length, writesBefore);
  });
