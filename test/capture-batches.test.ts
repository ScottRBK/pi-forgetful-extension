import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  CaptureService, type CaptureBranch, type CaptureCheckpointResult,
} from "../src/capture.ts";
import type {
  CaptureSnapshot, ForgetfulClient, MemoryModelClient, ModelRequest,
} from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";

const identity = { instanceId: "capture-batches" };
const branch = { sessionId: "session", branchId: "branch" };
type PreparedModel = MemoryModelClient & {
  prepareCapture(request: ModelRequest): Promise<"ready" | "progress">;
};

function gate() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

function snapshot(directory: string, finalEntryId = "a3", branchId = "branch"): CaptureSnapshot {
  const entries = [
    { id: "u1", role: "user" as const, text: "Keep original evidence one." },
    { id: "a1", role: "assistant" as const, text: "Noted one." },
    { id: "u2", role: "user" as const, text: "Keep original evidence two." },
    { id: "a2", role: "assistant" as const, text: "Noted two." },
    { id: "u3", role: "user" as const, text: "Keep original evidence three." },
    { id: finalEntryId, role: "assistant" as const, text: "Noted three." },
  ];
  return { id: `snapshot-${branchId}-${finalEntryId}`, instanceId: identity.instanceId,
    context: { cwd: directory, sessionId: branch.sessionId, branchId }, entries,
    conversation: entries, conversationCoverage: "complete", finalEntryId,
    mode: "observe", scope: "global", policy: "", modelVersion: "scripted-provider",
    createdAt: new Date().toISOString() };
}

function service(queue: DurableQueueStore, model: MemoryModelClient): CaptureService {
  return new CaptureService({ queue, model, ...identity, getMode: () => "observe",
    client: {} as ForgetfulClient });
}

test("an underfilled pass yields durable summary progress and resumes after restart", async (t) => {
  // Arrange: only the external provider is scripted; queue and restart persistence are real.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-progress-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let queue = new DurableQueueStore({ directory, ...identity });
  const input = snapshot(directory);
  const queued = await queue.enqueue(input);
  const firstProvider: PreparedModel = {
    async prepareCapture(request) {
      await request.onConversationCompacted!({ summary: "First cumulative summary.",
        summarizedThroughEntryId: "a1", retainedConversation: request.conversation!.slice(2) });
      return "progress";
    },
    async complete() { throw new Error("Extraction must wait for preparation"); },
  };

  // Act: one preparation slice, followed by a fresh worker reading the saved summary.
  const yielded = await service(queue, firstProvider).checkpoint();
  queue = new DurableQueueStore({ directory, ...identity });
  const pending = await queue.getJob(queued.jobId);

  // Assert: progress schedules another pass without spending either failure or extraction budget.
  assert.equal(yielded.processed, 1);
  assert.equal(yielded.continuation, "ready");
  assert.deepEqual(yielded.errors, []);
  assert.equal(yielded.deferredBranches, undefined);
  assert.equal(pending?.attempts, 0);
  assert.equal(pending?.callCount, 0);
  assert.equal(pending?.snapshot.historySummary?.throughEntryId, "a1");
  assert.deepEqual(pending?.snapshot.entries, input.entries);
  assert.deepEqual(pending?.snapshot.sourceConversation, input.conversation);
  assert.equal((await queue.getWatermark(branch.sessionId, branch.branchId)).historyDigest,
    undefined);

  const restartedProvider: PreparedModel = {
    async prepareCapture(request) {
      assert.match(JSON.stringify(request.conversation![0]), /First cumulative summary/);
      await request.onConversationCompacted!({ summary: "Second cumulative summary.",
        summarizedThroughEntryId: "a2", retainedConversation: request.conversation!.slice(3) });
      return "ready";
    },
    async complete(request) {
      assert.match(JSON.stringify(request.conversation![0]), /Second cumulative summary/);
      assert.equal(request.conversation!.length, 3);
      assert.equal((request.input as { conversationCoverage: string }).conversationCoverage,
        "summarized");
      return { candidates: [] };
    },
  };
  const finished = await service(queue, restartedProvider).checkpoint();
  const completed = await queue.getJob(queued.jobId);
  assert.equal(finished.continuation, undefined);
  assert.equal(completed?.status, "complete");
  assert.equal(completed?.attempts, 1);
  assert.equal(completed?.callCount, 1);
  assert.equal((await queue.getWatermark(branch.sessionId, branch.branchId)).historyThroughEntryId,
    "a2");
});

test("bounded passes drain more than eight claims while deferring a failed branch", async (t) => {
  // Arrange: an earlier failing branch must not starve twelve healthy jobs.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-drain-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const failed = await queue.enqueue(snapshot(directory, "failure", "failed"));
  const healthyIds: string[] = [];
  for (let index = 0; index < 12; index++) {
    healthyIds.push((await queue.enqueue(snapshot(directory, `healthy-${index}`))).jobId);
  }
  const capture = service(queue, { async complete(request) {
    if (request.diagnosticContext?.branchId === "failed") throw new Error("Provider failure");
    return { candidates: [] };
  } });

  // Act: exercise the scheduling contract, accumulating exclusions for this drain only.
  const passes: CaptureCheckpointResult[] = [];
  const excludeBranches: CaptureBranch[] = [];
  for (let pass = 0; pass < 4; pass++) {
    const result = await capture.checkpoint({ excludeBranches });
    passes.push(result);
    excludeBranches.push(...(result.deferredBranches ?? []));
    if (!result.continuation) break;
  }

  // Assert: processed counts claims, and every healthy job finishes without retrying the failure.
  assert.deepEqual(passes.map((result) => result.processed), [8, 5]);
  assert.deepEqual(passes.map((result) => result.continuation), ["ready", undefined]);
  assert.deepEqual(excludeBranches, [{ sessionId: branch.sessionId, branchId: "failed" }]);
  assert.equal((await queue.getJob(failed.jobId))?.attempts, 1);
  for (const id of healthyIds) assert.equal((await queue.getJob(id))?.status, "complete");

  // A later drain cycle may make one new attempt, without spinning immediately.
  const later = await capture.checkpoint();
  assert.equal((await queue.getJob(failed.jobId))?.attempts, 2);
  assert.equal(later.continuation, undefined);
  assert.deepEqual(later.errors, ["Provider failure"]);
});

test("preparation cancellation retains its summary and never refunds an earlier extraction",
  { timeout: 10_000 }, async (t) => {
    // Arrange: a previous extraction failed, consuming one genuine attempt and model call.
    const directory = await mkdtemp(join(tmpdir(), "capture-batches-cancel-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    let queue = new DurableQueueStore({ directory, ...identity });
    const input = snapshot(directory);
    const queued = await queue.enqueue(input);
    await service(queue, { async complete() { throw new Error("Earlier extraction failed"); } })
      .checkpoint();
    const started = gate();
    const phases: Array<string | undefined> = [];
    const provider: PreparedModel = {
      async prepareCapture(request) {
        await request.onConversationCompacted!({ summary: "Durable partial summary.",
          summarizedThroughEntryId: "a1", retainedConversation: request.conversation!.slice(2) });
        return new Promise((_, reject) => {
          request.signal!.addEventListener("abort", () => reject(request.signal!.reason),
            { once: true });
          started.resolve();
        });
      },
      async complete() { throw new Error("Cancelled preparation must not extract"); },
    };
    const capture = new CaptureService({ queue, model: provider, ...identity,
      client: {} as ForgetfulClient, getMode: () => "observe",
      onActivity: (phase) => phases.push(phase) });
    t.after(() => capture.stop());

    // Act: cancel after durable summary acceptance, then reopen from the actual files.
    const worker = capture.checkpoint();
    await started.promise;
    capture.stop();
    const cancelled = await worker;
    queue = new DurableQueueStore({ directory, ...identity });
    const pending = await queue.getJob(queued.jobId);

    // Assert: only the interrupted claim is refunded; earlier extraction allowance is retained.
    assert.equal(cancelled.continuation, undefined);
    assert.equal(pending?.status, "paused");
    assert.equal(pending?.attempts, 1);
    assert.equal(pending?.callCount, 1);
    assert.equal(pending?.snapshot.historySummary?.text, "Durable partial summary.");
    assert.deepEqual(pending?.snapshot.entries, input.entries);
    assert.deepEqual(pending?.snapshot.sourceConversation, input.conversation);
    assert.equal(phases[0], "reviewing");
    assert.equal(phases.at(-1), undefined);
    assert.equal((await queue.getWatermark(branch.sessionId, branch.branchId)).historyDigest,
      undefined);

    const resumed: PreparedModel = {
      async prepareCapture(request) {
        assert.match(JSON.stringify(request.conversation![0]), /Durable partial summary/);
        return "ready";
      },
      async complete() { return { candidates: [] }; },
    };
    await service(queue, resumed).checkpoint();
    const completed = await queue.getJob(queued.jobId);
    assert.equal(completed?.status, "complete");
    assert.equal(completed?.attempts, 2);
    assert.equal(completed?.callCount, 2);
  });

test("three genuine preparation failures discard evidence without extraction charges",
  async (t) => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-prep-failure-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const input = snapshot(directory);
  let queue = new DurableQueueStore({ directory, ...identity });
  const queued = await queue.enqueue(input);
  const provider: PreparedModel = {
    async prepareCapture() { throw new Error("Preparation provider unavailable"); },
    async complete() { throw new Error("Failed preparation must not extract"); },
  };

  // Act and assert: a fresh worker represents each independently triggered drain cycle.
  for (let attempt = 1; attempt <= 3; attempt++) {
    queue = new DurableQueueStore({ directory, ...identity });
    const result = await service(queue, provider).checkpoint();
    const pending = await queue.getJob(queued.jobId);
    assert.equal(result.continuation, undefined);
    assert.deepEqual(result.deferredBranches, [branch]);
    assert.deepEqual(result.errors, ["Preparation provider unavailable"]);
    if (attempt < 3) {
      assert.equal(pending?.attempts, attempt);
      assert.equal(pending?.callCount, 0);
      assert.deepEqual(pending?.snapshot.entries, input.entries);
    } else {
      assert.equal(pending, undefined);
      assert.deepEqual(result.discardedJobs,
        [{ jobId: queued.jobId, error: "Preparation provider unavailable" }]);
    }
  }
  assert.deepEqual(await readdir(directory), ["queue.json"]);
  assert.equal((await queue.enqueue(input)).queued, false);
});

test("prepared extraction can cite durable source inspection evidence", async (t) => {
  // Arrange: real source inspection and queue; only the model provider is scripted.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-source-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "requirement.txt"), "Delivery needs a signed handover.\n");
  const queue = new DurableQueueStore({ directory, ...identity });
  const input = snapshot(directory);
  input.context.project = { id: 7, name: "Delivery" };
  const queued = await queue.enqueue(input);
  let inspectionId = "";
  const provider: PreparedModel = {
    async prepareCapture() { return "ready"; },
    async complete(request) {
      const response = await request.readTools![0]!.execute({ path: "requirement.txt" },
        request.signal!) as { evidenceEntry: { id: string }; result: { content: string } };
      inspectionId = response.evidenceEntry.id;
      return request.submission.validate({ candidates: [{ id: "handover",
        title: "Delivery handover", content: response.result.content.trim(),
        context: "Verified source requirement", keywords: ["delivery"], tags: ["requirement"],
        evidenceType: "observation", sourceEntryIds: [inspectionId] }] });
    },
  };

  // Act.
  const result = await service(queue, provider).checkpoint();

  // Assert: extraction retains the inspected candidate instead of dropping its source ID.
  assert.deepEqual(result.errors, []);
  const job = await queue.getJob(queued.jobId);
  assert.equal(job?.status, "complete");
  assert.deepEqual((job?.candidateOutcomes.handover as { sourceEntryIds?: string[] })
    ?.sourceEntryIds, [inspectionId]);
});

test("a live worker lock yields busy and is never stolen even when old", async (t) => {
  // Arrange: an actual owner holds the branch lock while another service checkpoints.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-busy-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const queued = await queue.enqueue(snapshot(directory));
  const locked = gate();
  const released = gate();
  const owner = queue.withWorkerLock(identity, branch, async () => {
    locked.resolve();
    await released.promise;
  });
  t.after(async () => { released.resolve(); await owner; });
  await locked.promise;
  const lock = (await readdir(directory)).find((name) => name.startsWith("worker-"))!;
  const lockPath = join(directory, lock);
  await utimes(lockPath, new Date(0), new Date(0));
  const originalLock = await readFile(lockPath, "utf8");
  const capture = service(queue, { async complete() { return { candidates: [] }; } });

  // Act.
  const busy = await capture.checkpoint();

  // Assert: contention spends no attempt and schedules only a delayed recheck.
  assert.equal(busy.processed, 0);
  assert.equal(busy.continuation, "busy");
  assert.equal(busy.deferredBranches, undefined);
  assert.equal((await queue.getJob(queued.jobId))?.attempts, 0);
  assert.equal(await readFile(lockPath, "utf8"), originalLock);
  released.resolve();
  await owner;
  const done = await capture.checkpoint();
  assert.equal(done.continuation, undefined);
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete");
});

for (const blockedBy of ["discovery", "unknown save"] as const) {
  test(`${blockedBy} work retains evidence without claiming or scheduling`, async (t) => {
    // Arrange: use the real queue's discovery flag or cancellation receipt.
    const directory = await mkdtemp(join(tmpdir(), "capture-batches-blocked-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, ...identity });
    const input = snapshot(directory);
    if (blockedBy === "discovery") input.context.projectDiscoveryPending = true;
    const queued = await queue.enqueue(input);
    if (blockedBy === "unknown save") {
      await queue.claimNext(identity, branch);
      await queue.cancel(queued.jobId, false, "Earlier save outcome unknown");
    }
    const locked = gate();
    const released = gate();
    const owner = queue.withWorkerLock(identity, branch, async () => {
      locked.resolve();
      await released.promise;
    });
    t.after(async () => { released.resolve(); await owner; });
    await locked.promise;

    // Act.
    const result = await service(queue, { async complete() {
      throw new Error("Blocked capture must not contact the provider");
    } }).checkpoint(branch);

    // Assert.
    assert.equal(result.processed, 0);
    assert.equal(result.continuation, undefined);
    assert.deepEqual(result.errors, []);
    const pending = await queue.getJob(queued.jobId);
    assert.equal(pending?.attempts, 0);
    assert.deepEqual(pending?.snapshot.entries, input.entries);
  });
}

test("a damaged branch is deferred while healthy backlog continues", async (t) => {
  // Arrange: remove only the failing branch's real immutable source sidecar.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-damage-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const damaged = await queue.enqueue(snapshot(directory, "damaged", "damaged"));
  const path = join(directory, "queue.json");
  const index = JSON.parse(await readFile(path, "utf8"));
  const digest = index.jobs.find((job: { id: string }) => job.id === damaged.jobId).snapshotDigest;
  const source = (await readdir(directory)).find((name) => name.endsWith(`${digest}.json`))!;
  await rm(join(directory, source));
  const healthyIds: string[] = [];
  for (let count = 0; count < 9; count++) {
    healthyIds.push((await queue.enqueue(snapshot(directory, `healthy-${count}`))).jobId);
  }
  const capture = service(queue, { async complete() { return { candidates: [] }; } });

  // Act.
  const first = await capture.checkpoint();
  const second = await capture.checkpoint({ excludeBranches: first.deferredBranches });

  // Assert: report the original load failure once; the remaining branch finishes normally.
  assert.equal(first.processed, 8);
  assert.ok(first.errors.some((error) => /ENOENT/.test(error)));
  assert.deepEqual(first.deferredBranches, [{ sessionId: branch.sessionId, branchId: "damaged" }]);
  assert.equal(first.continuation, "ready");
  assert.equal(second.processed, 1);
  assert.deepEqual(second.errors, []);
  assert.equal(second.continuation, undefined);
  for (const id of healthyIds) assert.equal((await queue.getJob(id))?.status, "complete");
});

test("a dead worker lock is recovered before processing instead of scheduling busy", async (t) => {
  // Arrange: learn the real worker path, then leave a lock whose recorded owner is dead.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-dead-lock-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const queued = await queue.enqueue(snapshot(directory));
  let lockPath = "";
  await queue.withWorkerLock(identity, branch, async () => {
    const lock = (await readdir(directory)).find((name) => name.startsWith("worker-"))!;
    lockPath = join(directory, lock);
  });
  await writeFile(lockPath, JSON.stringify({ token: "dead", pid: process.pid + 100_000 }));

  // Act.
  const result = await service(queue, { async complete() { return { candidates: [] }; } })
    .checkpoint();

  // Assert.
  assert.equal(result.processed, 1);
  assert.equal(result.continuation, undefined);
  assert.equal((await queue.getJob(queued.jobId))?.status, "complete");
  assert.ok(!(await readdir(directory)).some((name) => name.startsWith("worker-")));
});

test("permission-paused work is deferred while another branch drains", async (t) => {
  // Arrange: the provider proposes a save on one branch after write permission was revoked.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-permission-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const pausedInput = snapshot(directory, "paused", "permission-paused");
  pausedInput.mode = "auto";
  pausedInput.context.project = { id: 7, name: "Delivery" };
  const paused = await queue.enqueue(pausedInput);
  const healthyIds: string[] = [];
  for (let index = 0; index < 9; index++) {
    healthyIds.push((await queue.enqueue(snapshot(directory, `healthy-${index}`))).jobId);
  }
  const capture = new CaptureService({ queue, ...identity, canWriteNow: () => false,
    client: { async search() { return []; } } as unknown as ForgetfulClient,
    model: { async complete(request) {
      if (request.diagnosticContext?.branchId !== "permission-paused") return { candidates: [] };
      if (request.purpose === "capture") return { candidates: [{ id: "delivery",
        title: "Delivery handover", content: "Keep original evidence one.",
        context: "User decision", keywords: ["delivery"], tags: ["decision"],
        sourceEntryIds: ["u1"], evidenceType: "userDecision" }] };
      return { action: "create", reason: "No existing memory." };
    } } });

  // Act.
  const first = await capture.checkpoint();
  const second = await capture.checkpoint({ excludeBranches: first.deferredBranches });

  // Assert: permission consumes one failed attempt, without retrying in the same drain cycle.
  assert.equal(first.paused, true);
  assert.equal(first.continuation, "ready");
  assert.deepEqual(first.deferredBranches,
    [{ sessionId: branch.sessionId, branchId: "permission-paused" }]);
  assert.equal(second.continuation, undefined);
  const pending = await queue.getJob(paused.jobId);
  assert.equal(pending?.status, "paused");
  assert.equal(pending?.attempts, 1);
  assert.equal(pending?.callCount, 2);
  for (const id of healthyIds) assert.equal((await queue.getJob(id))?.status, "complete");
});

test("an exhausted extraction allowance does not start paid preparation", async (t) => {
  // Arrange: an older interrupted job has no extraction calls left.
  const directory = await mkdtemp(join(tmpdir(), "capture-batches-exhausted-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, ...identity });
  const queued = await queue.enqueue(snapshot(directory));
  await queue.checkpoint(queued.jobId, { callCount: 4 });
  let preparations = 0;
  const provider: PreparedModel = {
    async prepareCapture(request) {
      preparations++;
      await request.onConversationCompacted!({ summary: "Unusable preparation progress.",
        summarizedThroughEntryId: "a1", retainedConversation: request.conversation!.slice(2) });
      return "progress";
    },
    async complete() { throw new Error("No extraction allowance remains"); },
  };

  // Act: a bounded pass must reject the exhausted job before any provider work.
  const result = await service(queue, provider).checkpoint();

  // Assert: unavailable extraction is a real failure, not an endlessly resumable preparation.
  assert.equal(preparations, 0);
  assert.match(result.errors.join(" "), /model call budget/i);
  assert.equal(result.continuation, undefined);
  const job = await queue.getJob(queued.jobId);
  assert.equal(job?.attempts, 1);
  assert.equal(job?.callCount, 4);
  assert.equal(job?.snapshot.historySummary, undefined);
});
