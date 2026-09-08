import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { DurableQueueStore, type PendingConflict } from "../src/queue.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";

function snapshot(finalEntryId = "assistant-1"): CaptureSnapshot {
  return {
    id: `snapshot-${finalEntryId}`,
    context: {
      cwd: "/repo",
      repoName: "example/repo",
      project: { id: 7, name: "Example" },
      sessionId: "session-1",
      branchId: "branch-1",
    },
    instanceId: "instance-a",
    entries: [
      { id: "user-1", role: "user", text: "We chose SQLite." },
      {
        id: finalEntryId,
        role: "assistant",
        text: "Implemented the database change.",
      },
    ],
    finalEntryId,
    mode: "auto",
    scope: "global",
    policy: "capture policy",
    modelVersion: "memory-model-v1",
    createdAt: new Date().toISOString(),
  };
}

function pendingConflict(id: string): PendingConflict {
  const timestamp = new Date().toISOString();
  return {
    id,
    candidateId: `candidate-${id}`,
    binding: { instanceId: "instance-a" },
    sessionId: "session-1",
    branchId: "branch-1",
    destinationProjectId: 7,
    candidate: { id: `candidate-${id}` },
    sourceEntryIds: ["user-1"],
    evidence: ["user-1: confirmed"],
    reason: "Needs review",
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

test("DurableQueueStore persists one fixed snapshot and deduplicates a settled entry", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-queue-"));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });

  const first = await queue.enqueue(snapshot());
  const second = await queue.enqueue(snapshot());
  const pending = await queue.listPending({ instanceId: "instance-a" });
  const watermark = await queue.getWatermark("session-1", "branch-1");
  const persisted = JSON.parse(
    await readFile(join(directory, "queue.json"), "utf8"),
  ) as {
    jobs: Array<{ snapshot: CaptureSnapshot }>;
  };

  assert.equal(first.queued, true);
  assert.equal(second.queued, false);
  assert.equal(second.jobId, first.jobId);
  assert.equal(pending.length, 1);
  assert.equal(pending[0]?.snapshot.entries[0]?.text, "We chose SQLite.");
  assert.deepEqual(watermark.consideredEntryIds, ["user-1", "assistant-1"]);
  assert.equal(persisted.jobs.length, 1);
  assert.equal(persisted.jobs[0]?.snapshot.id, "snapshot-assistant-1");
  assert.equal((await stat(join(directory, "queue.json"))).mode & 0o777, 0o600);
});

test("the queue redacts known sensitive snapshot text before persistence", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-privacy-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const unsafe = snapshot();
  unsafe.entries[0] = {
    ...unsafe.entries[0]!,
    text: "password=super-secret-value",
  };

  await queue.enqueue(unsafe);
  const pending = await queue.listPending({ instanceId: "instance-a" });

  assert.equal(pending[0]?.snapshot.entries[0]?.text, "[redacted]");
});

test("the queue preserves pending conflict receipts and refuses new ones at capacity", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-conflict-capacity-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });

  for (let index = 0; index < 100; index += 1) {
    await queue.addConflict(pendingConflict(`conflict-${index}`));
  }

  await assert.rejects(
    () => queue.addConflict(pendingConflict("conflict-over-capacity")),
    /capacity/i,
  );
  const conflicts = await queue.pendingConflicts({ instanceId: "instance-a" });
  assert.equal(conflicts.length, 100);
  assert.equal(conflicts[0]?.id, "conflict-0");
});

test("conflict pruning removes terminal records when pending capacity is full", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-conflict-prune-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  await queue.addConflict({
    ...pendingConflict("terminal"),
    status: "resolved",
  });
  for (let index = 0; index < 100; index += 1) {
    await queue.addConflict(pendingConflict(`pending-${index}`));
  }

  await queue.advanceWatermark({
    sessionId: "session-1",
    branchId: "branch-1",
    entryIds: [],
  });

  assert.equal(await queue.getConflict("terminal"), undefined);
  assert.equal(
    (await queue.pendingConflicts({ instanceId: "instance-a" })).length,
    100,
  );
});

test("watermarks stay bounded while retaining the newest considered entries", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-watermark-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  await queue.advanceWatermark({
    sessionId: "session-1",
    branchId: "branch-1",
    entryIds: Array.from({ length: 2_500 }, (_, index) => `entry-${index}`),
    finalEntryId: "entry-2499",
  });
  const watermark = await queue.getWatermark("session-1", "branch-1");

  assert.equal(watermark.consideredEntryIds.length, 2_000);
  assert.equal(watermark.consideredEntryIds[0], "entry-500");
  assert.equal(watermark.consideredEntryIds.at(-1), "entry-2499");
});

test("queue jobs stay bound to their originating instance and endpoint", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-binding-"),
  );
  const original = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    endpoint: "http://one",
  });
  const changed = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    endpoint: "http://two",
  });
  await original.enqueue(snapshot());

  assert.equal(
    (
      await changed.listPending({
        instanceId: "instance-a",
        endpoint: "http://two",
      })
    ).length,
    0,
  );
  assert.equal(
    await changed.claimNext({
      instanceId: "instance-a",
      endpoint: "http://two",
    }),
    undefined,
  );
  assert.equal(
    (
      await original.listPending({
        instanceId: "instance-a",
        endpoint: "http://one",
      })
    ).length,
    1,
  );
});

test("an endpoint-bound worker rejects jobs without endpoint binding", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-binding-missing-"),
  );
  const unbound = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
  });
  const bound = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    endpoint: "http://two",
  });
  await unbound.enqueue(snapshot());

  assert.equal(
    (
      await bound.listPending({
        instanceId: "instance-a",
        endpoint: "http://two",
      })
    ).length,
    0,
  );
  assert.equal(
    await bound.claimNext({ instanceId: "instance-a", endpoint: "http://two" }),
    undefined,
  );
});

test("DurableQueueStore serializes concurrent mutations in one process", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-concurrent-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });

  const results = await Promise.all([
    queue.enqueue(snapshot("assistant-a")),
    queue.enqueue(snapshot("assistant-b")),
  ]);

  assert.deepEqual(
    results.map((result) => result.queued),
    [true, true],
  );
  assert.equal(
    (await queue.listPending({ instanceId: "instance-a" })).length,
    2,
  );
});

test("separate queue instances serialize mutations without dropping jobs", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-concurrent-instances-"),
  );
  const first = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const second = new DurableQueueStore({ directory, instanceId: "instance-a" });

  const results = await Promise.all([
    first.enqueue(snapshot("assistant-a")),
    second.enqueue(snapshot("assistant-b")),
  ]);

  assert.deepEqual(results.map((result) => result.queued).sort(), [true, true]);
  assert.equal(
    (await first.listPending({ instanceId: "instance-a" })).length,
    2,
  );
});

test("DurableQueueStore does not steal a stale lock held by a live process", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-queue-lock-"));
  const queue = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    staleLockMs: 1,
  });
  const lockPath = join(directory, "queue.json.lock");
  await writeFile(
    lockPath,
    JSON.stringify({ token: "live", pid: process.pid }),
    { mode: 0o600 },
  );
  const old = new Date(Date.now() - 10_000);
  await utimes(lockPath, old, old);

  await assert.rejects(() => queue.enqueue(snapshot()), /Queue lock is busy/);
});

test("DurableQueueStore immediately recovers a lock whose recorded owner is dead", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-dead-lock-"),
  );
  const queue = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    staleLockMs: 5 * 60_000,
  });
  const lockPath = join(directory, "queue.json.lock");
  await writeFile(
    lockPath,
    JSON.stringify({ token: "dead", pid: process.pid + 100_000 }),
    {
      mode: 0o600,
    },
  );

  const result = await queue.enqueue(snapshot());

  assert.equal(result.queued, true);
});

test("DurableQueueStore rejects an unsupported or malformed queue version", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-corrupt-"),
  );
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  await writeFile(
    join(directory, "queue.json"),
    JSON.stringify({ version: 99, jobs: [], conflicts: [], watermarks: {} }),
    { mode: 0o600 },
  );

  await assert.rejects(() => queue.listJobs(), /Invalid queue state/);
});

test("retry exhaustion scrubs the fixed transcript from a terminal queue record", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "pi-forgetful-queue-terminal-"),
  );
  const queue = new DurableQueueStore({
    directory,
    instanceId: "instance-a",
    maxAttempts: 1,
  });
  await queue.enqueue(snapshot());
  const claimed = await queue.claimNext({ instanceId: "instance-a" });
  assert(claimed);
  await queue.checkpoint(claimed.id, {
    status: "pending",
    lastError: "temporary failure",
  });
  assert.equal(await queue.claimNext({ instanceId: "instance-a" }), undefined);
  const terminal = (await queue.listJobs({ instanceId: "instance-a" }))[0];

  assert.equal(terminal?.status, "failed");
  assert.deepEqual(terminal?.snapshot.entries, []);
});
