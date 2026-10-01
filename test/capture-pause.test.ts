import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ForgetfulClient, ModelRequest } from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";

function snapshot(directory: string): CaptureSnapshot {
  return { id: "pause-work", context: { cwd: directory, project: { id: 7, name: "Test" },
    sessionId: "session", branchId: "branch" }, instanceId: "pause-test",
    entries: [{ id: "decision", role: "user", text: "Use local SQLite storage." }],
    finalEntryId: "decision", mode: "auto", scope: "global", policy: "", modelVersion: "test",
    createdAt: new Date().toISOString() };
}

const candidate = { id: "sqlite", title: "Local SQLite", content: "Use local SQLite storage.",
  context: "Storage decision.", keywords: ["sqlite"], tags: ["decision"],
  sourceEntryIds: ["decision"], evidenceType: "userDecision" };

for (const reason of ["disabled during inspection", "writes revoked"] as const) {
  test(`capture reports and discards its third pause: ${reason}`, async (t) => {
    // Arrange: real durable queue and capture worker, with only external responses scripted.
    const directory = await mkdtemp(join(tmpdir(), "capture-pause-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    let enabled = true;
    let writes = 0;
    const client = { async search() { return []; }, async create() {
      writes++;
      throw new Error("Paused capture must never write");
    } } as unknown as ForgetfulClient;
    const model = { async complete(request: ModelRequest) {
      if (reason === "disabled during inspection") {
        enabled = false;
        await request.readTools![0]!.execute({ path: "unused.txt" },
          new AbortController().signal);
        throw new Error("Disabled inspection must stop the task");
      }
      return request.purpose === "capture" ? { candidates: [candidate] }
        : { action: "create", reason: "No existing memory." };
    } };
    let queue = new DurableQueueStore({ directory, instanceId: "pause-test" });
    const input = snapshot(directory);
    const queued = await queue.enqueue(input);

    // Act and assert: each resume is another attempt, including across queue/service restart.
    for (const attempt of [1, 2, 3]) {
      enabled = true;
      queue = new DurableQueueStore({ directory, instanceId: "pause-test" });
      const capture = new CaptureService({ queue, client, model, instanceId: "pause-test",
        isEnabled: () => enabled, canWriteNow: () => reason !== "writes revoked" });
      const result = await capture.checkpoint();
      assert.deepEqual(result.processedJobIds, [queued.jobId]);
      const job = await queue.getJob(queued.jobId);
      if (attempt < 3) {
        assert.equal(job?.status, "paused");
        assert.equal(job?.attempts, attempt);
        assert.equal(result.paused, true);
        assert.equal(result.discardedJobs, undefined);
      } else {
        assert.equal(job, undefined, "third pause must delete immediately, not on next claim");
        assert.deepEqual(result.discardedJobs?.map((item) => item.jobId), [queued.jobId]);
        assert.ok(result.errors.some((message) => /disabled|revoked/.test(message)));
      }
    }
    assert.equal(writes, 0);
    assert.deepEqual(await readdir(directory), ["queue.json"]);
    assert.equal((await queue.enqueue(input)).queued, false, "discarded work must not replay");
  });
}

test("exhausted model-call budget fails rather than leaving an unresumable pause", async (t) => {
  // Arrange: extraction consumes the only allowed model call; overlap still needs one.
  const directory = await mkdtemp(join(tmpdir(), "capture-budget-failure-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "pause-test" });
  let calls = 0;
  const model = { async complete() { calls++; return { candidates: [candidate] }; } };
  const client = { async search() { return []; } } as unknown as ForgetfulClient;
  const capture = new CaptureService({ queue, client, model, instanceId: "pause-test",
    maxModelCalls: 1 });
  const queued = await capture.enqueue(snapshot(directory));

  // Act and assert: genuine failures exhaust three attempts with a visible final discard.
  for (const attempt of [1, 2, 3]) {
    const result = await capture.checkpoint();
    assert.equal(result.paused, false);
    assert.ok(result.errors.some((message) => /model call budget/.test(message)));
    if (attempt < 3) assert.equal((await queue.getJob(queued.jobId))?.status, "pending");
    else {
      assert.equal(await queue.getJob(queued.jobId), undefined);
      assert.deepEqual(result.discardedJobs?.map((item) => item.jobId), [queued.jobId]);
    }
  }
  assert.equal(calls, 1, "retry must never overrun the saved model-call budget");
  assert.deepEqual(await readdir(directory), ["queue.json"]);
});

test("a completed checkpoint is not reported as paused merely because the worker returns void",
  async (t) => {
    // Arrange.
    const directory = await mkdtemp(join(tmpdir(), "capture-complete-state-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "pause-test" });
    const capture = new CaptureService({ queue, instanceId: "pause-test",
      model: { async complete() { return { candidates: [] }; } },
      client: {} as ForgetfulClient });
    const queued = await capture.enqueue(snapshot(directory));

    // Act.
    const result = await capture.checkpoint();

    // Assert.
    assert.equal((await queue.getJob(queued.jobId))?.status, "complete");
    assert.equal(result.paused, false);
    assert.deepEqual(result.errors, []);
  });

test("recovery reports discard when a crash exhausted the third attempt", async (t) => {
  // Arrange: interrupted work has spent three attempts but never recorded its final outcome.
  const directory = await mkdtemp(join(tmpdir(), "capture-interrupted-discard-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "pause-test", staleJobMs: 0 });
  const input = snapshot(directory);
  const queued = await queue.enqueue(input);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const job = await queue.claimNext();
    assert.equal(job?.attempts, attempt);
    if (attempt < 3) await queue.checkpoint(queued.jobId, { status: "pending" });
  }
  let providerCalls = 0;
  const capture = new CaptureService({ queue, instanceId: "pause-test",
    model: { async complete() { providerCalls++; return { candidates: [] }; } },
    client: {} as ForgetfulClient });

  // Act: the worker recovers a stale third claim, rather than running a fourth attempt.
  const result = await capture.checkpoint();

  // Assert: durable cleanup and its final reporting agree even without a processing catch.
  assert.equal(await queue.getJob(queued.jobId), undefined);
  assert.deepEqual(result.discardedJobs?.map((item) => item.jobId), [queued.jobId]);
  assert.ok(result.processedJobIds.includes(queued.jobId));
  assert.ok(result.errors.some((message) => /attempts exhausted/.test(message)));
  assert.equal(providerCalls, 0);
  assert.deepEqual(await readdir(directory), ["queue.json"]);
  assert.equal((await queue.enqueue(input)).queued, false);
});
