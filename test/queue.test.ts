import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  mkdtemp, readFile, readdir, rename, rm, stat, symlink, utimes, writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

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

function orderedSnapshot(ids: string[]): CaptureSnapshot {
  const finalEntryId = ids.at(-1) ?? "assistant-1";
  const input = snapshot(finalEntryId);
  input.entries = ids.map((id, index) => ({
    id,
    role: index % 2 === 0 ? "user" : "assistant",
    text: `Message ${index + 1}`,
  }));
  input.conversation = input.entries.map((entry) => ({ id: entry.id, role: entry.role,
    text: entry.text }));
  input.conversationCoverage = "complete";
  return input;
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

test("sequential job reads release full snapshots within a bounded heap", async (t) => {
  // Arrange: 192 MiB of distinct payloads exceed the reader's 128 MiB heap in aggregate.
  // One 8 MiB payload fits comfortably, including parsing and caller-owned copies.
  const directory = await mkdtemp(join(tmpdir(), "queue-sequential-memory-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const jobIds: string[] = [];
  for (let index = 0; index < 24; index += 1) {
    const input = snapshot(`assistant-${index}`);
    const text = `${index}: ${"history ".repeat(512 * 1024)}`;
    input.entries[0]!.text = text;
    input.conversation = [{ id: `history-${index}`, type: "message",
      message: { role: "user", content: text } }];
    input.conversationCoverage = "complete";
    jobIds.push((await queue.enqueue(input)).jobId);
  }
  const queueModule = new URL("../src/queue.ts", import.meta.url).href;
  const script = `
    import assert from "node:assert/strict";
    import { DurableQueueStore } from ${JSON.stringify(queueModule)};
    const [directory, encodedIds] = process.argv.slice(1);
    const jobIds = JSON.parse(encodedIds);
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    async function readJob(index) {
      const job = await queue.getJob(jobIds[index]);
      const text = index + ": " + "history ".repeat(512 * 1024);
      assert.equal(job.snapshot.entries[0].text, text);
      assert.equal(job.snapshot.conversation[0].message.content, text);
      assert.equal(job.snapshot.conversationCoverage, "complete");
    }
    for (let index = 0; index < jobIds.length; index += 1) {
      await readJob(index);
      await new Promise(setImmediate);
      global.gc();
    }
    process.stdout.write("Read all 24 full snapshots");
  `;

  // Act: a fresh reader releases each result before requesting the next job.
  const { stdout } = await promisify(execFile)(process.execPath, [
    "--max-old-space-size=128", "--expose-gc", "--import", import.meta.resolve("tsx"),
    "--input-type=module", "--eval", script, directory, JSON.stringify(jobIds),
  ], { cwd: directory, timeout: 60_000 });

  // Assert: every full payload was read successfully under the fixed heap budget.
  assert.equal(stdout, "Read all 24 full snapshots");
});

test("undefined conflict patch fields preserve the persisted decision", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-forgetful-queue-patch-"));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  await queue.addConflict(pendingConflict("preserve"));

  const updated = await queue.updateConflict("preserve", { reason: undefined });
  const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const persisted = await reopened.getConflict("preserve");

  assert.equal(updated.reason, "Needs review");
  assert.equal(persisted?.reason, "Needs review");
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

for (const failure of ["checkpoint", "claim exhaustion", "stale recovery"] as const) {
  test(`${failure} deletes failed work and conflicts but preserves restart dedupe`, async (t) => {
    // Arrange: use real sidecars and all three conflict states on a three-attempt job.
    const directory = await mkdtemp(join(tmpdir(), "queue-failed-cleanup-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    let now = new Date("2026-10-01T10:00:00Z");
    const options = { directory, instanceId: "instance-a", now: () => now };
    const queue = new DurableQueueStore(options);
    const original = snapshot();
    const queued = await queue.enqueue(original);
    await queue.checkpoint(queued.jobId, { inspectionEntries: [
      { id: "inspection:source", role: "toolResult", toolName: "read", text: "source evidence" },
    ] });
    const conflictIds = ["pending", "resolved", "rejected"] as const;
    for (const status of conflictIds) {
      await queue.addConflict({ ...pendingConflict(status), jobId: queued.jobId, status });
    }
    const watermark = await queue.currentWatermark(original.context);
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      assert.equal((await queue.claimNext())?.attempts, attempt);
      if (attempt < 3) await queue.checkpoint(queued.jobId, { status: "pending" });
    }

    // Act: finish the third failure, or recover its abandoned claim without a fourth attempt.
    if (failure === "checkpoint") {
      await queue.checkpoint(queued.jobId, { status: "failed", lastError: "third failure" });
    } else {
      if (failure === "claim exhaustion") {
        await queue.checkpoint(queued.jobId, { status: "pending" });
      } else {
        now = new Date("2026-10-01T10:10:00Z");
      }
      assert.equal(await new DurableQueueStore(options).claimNext(), undefined);
    }
    assert.deepEqual(await readdir(directory), ["queue.json"]);
    for (const id of conflictIds) assert.equal(await queue.getConflict(id), undefined);
    const restarted = new DurableQueueStore(options);

    // Assert: no job, conflict or sidecar survives, but the considered work remains deduplicated.
    assert.equal(await restarted.getJob(queued.jobId), undefined);
    assert.deepEqual(await restarted.listJobMetadata(), []);
    for (const id of conflictIds) assert.equal(await restarted.getConflict(id), undefined);
    assert.deepEqual(await restarted.pendingConflicts(), []);
    assert.deepEqual(await restarted.currentWatermark(original.context), watermark);
    assert.deepEqual(await restarted.enqueue(original), {
      queued: false, jobId: queued.jobId, reason: "duplicate",
    });
    assert.deepEqual(await readdir(directory), ["queue.json"]);
  });
}

test("terminal cleanup retains outstanding work and pending-conflict evidence", async (t) => {
  // Arrange: two independent jobs, one with a conflict that outlives its capture run.
  const directory = await mkdtemp(join(tmpdir(), "queue-cleanup-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const first = await queue.enqueue(snapshot("first"));
  const second = await queue.enqueue(snapshot("second"));
  const files = () => readdir(directory).then((names) =>
    names.filter((name) => name.startsWith("snapshot-") && name.endsWith(".json")));
  await queue.addConflict({ ...pendingConflict("keep-evidence"), jobId: first.jobId });

  // Act: a completed job retains readable evidence until its pending conflict is resolved.
  const completed = await queue.complete(first.jobId);
  const retained = await files();
  await queue.updateConflict("keep-evidence", { status: "resolved" });
  const afterResolution = await files();
  const outstanding = await queue.getJob(second.jobId);
  await queue.complete(second.jobId);

  // Assert: only reachable private snapshots survive each transition.
  assert.deepEqual(completed.snapshot.entries, snapshot("first").entries);
  assert.equal(completed.snapshot.conversation, undefined);
  assert.equal(retained.length, 2);
  assert.equal(afterResolution.length, 1);
  assert.equal(outstanding?.snapshot.entries[0]?.text, "We chose SQLite.");
  assert.deepEqual(await files(), []);
});

test("inspection evidence appends durably without replacing conversation or existing evidence",
  async (t) => {
    // Arrange: a fixed transcript plus two distinct read-only source observations.
    const directory = await mkdtemp(join(tmpdir(), "queue-inspection-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const original = snapshot();
    original.conversation = [{ id: "user-1", type: "message",
      message: { role: "user", content: "We chose SQLite." } }];
    const queued = await queue.enqueue(original);
    const observation = { id: "inspection:file-1", role: "toolResult" as const,
      toolName: "inspect_source", toolCallId: "read-file-1", isError: false,
      text: "export const database = 'sqlite';", details: { api_key: "fixture-secret" } };

    // Act: persist observations across separate workers and retry an already-recorded observation.
    await queue.checkpoint(queued.jobId, { inspectionEntries: [observation], callCount: 1 });
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    await reopened.checkpoint(queued.jobId, { inspectionEntries: [observation] });
    const updated = await reopened.checkpoint(queued.jobId, {
      inspectionEntries: [{ ...observation, id: "inspection:url-1", isError: true,
        text: "Not Found", details: { status: 404 } }],
      candidateOutcomes: { sqlite: { stage: "created", memoryId: 9 } },
    });

    // Assert: the transcript is immutable and observations remain independently addressable.
    assert.deepEqual(updated.snapshot.conversation, original.conversation);
    assert.deepEqual(updated.snapshot.entries.map((entry) => entry.id),
      ["user-1", "assistant-1", "inspection:file-1", "inspection:url-1"]);
    assert.equal(updated.callCount, 1);
    assert.deepEqual(updated.snapshot.entries[2]?.details, { api_key: "[redacted]" });
    assert.equal(updated.snapshot.entries[3]?.isError, true);
    assert.deepEqual(updated.candidateOutcomes.sqlite, { stage: "created", memoryId: 9 });
    await assert.rejects(reopened.checkpoint(queued.jobId, { inspectionEntries: [
      { ...observation, id: "user-1" },
    ] }), /inspection|original/i);
    await assert.rejects(reopened.checkpoint(queued.jobId, { inspectionEntries: [
      { ...observation, text: "Different result for the same ID" },
    ] }), /immutable|already/i);
    const index = await readFile(join(directory, "queue.json"), "utf8");
    assert.equal(index.includes("export const database"), false);
    await reopened.complete(queued.jobId);
    assert.equal((await readdir(directory)).some((name) => name.startsWith("snapshot-")), false);
  });

test("legacy inline jobs migrate mechanically without resetting budgets, receipts or coverage",
  async (t) => {
    // Arrange: an existing v1 job contains partial history and an unresolved write outcome.
    const directory = await mkdtemp(join(tmpdir(), "queue-legacy-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const original = snapshot();
    const key = "instance-a\u0000session-1\u0000branch-1\u0000assistant-1";
    const receipt = { stage: "execution-stopped", creationAttempted: true, memoryId: 19 };
    const watermark = { sessionId: "session-1", branchId: "branch-1", lastEntryId: "assistant-1",
      consideredEntryIds: ["user-1", "assistant-1"], snapshotIds: [original.id],
      dedupeKeys: [key], updatedAt: original.createdAt };
    await writeFile(join(directory, "queue.json"), JSON.stringify({ version: 1,
      jobs: [{ id: "legacy-job", dedupeKey: key, binding: { instanceId: "instance-a" },
        snapshot: original, status: "paused", attempts: 2, callCount: 3,
        extractedCandidates: [{ id: "sqlite", sourceEntryIds: ["user-1"] }],
        candidateOutcomes: { sqlite: receipt }, lastError: "Unknown write outcome",
        createdAt: original.createdAt, updatedAt: original.createdAt }],
      conflicts: [{ ...pendingConflict("legacy-conflict"), jobId: "legacy-job" }],
      watermarks: { ["session-1\u0000branch-1"]: watermark },
    }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });

    // Act: read legacy data, then make an ordinary metadata checkpoint and reopen.
    const before = await queue.getJob("legacy-job");
    await queue.checkpoint("legacy-job", { lastError: "Still unknown" });
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const after = await reopened.getJob("legacy-job");

    // Assert: migration creates no new work and does not pretend the old delta was complete.
    assert.equal(before?.snapshot.conversationCoverage, "legacy-partial");
    assert.equal(after?.snapshot.conversationCoverage, "legacy-partial");
    assert.equal(after?.snapshot.conversation, undefined);
    assert.deepEqual(after?.snapshot.entries, original.entries);
    assert.equal(after?.attempts, 2);
    assert.equal(after?.callCount, 3);
    assert.equal(after?.status, "paused");
    assert.deepEqual(after?.candidateOutcomes.sqlite, receipt);
    assert.deepEqual(await reopened.getWatermark("session-1", "branch-1"), watermark);
    assert.equal((await reopened.pendingConflicts()).length, 1);
    assert.equal((await reopened.enqueue(original)).queued, false);
    const index = JSON.parse(await readFile(join(directory, "queue.json"), "utf8"));
    assert.equal(index.version, 2);
    assert.equal(JSON.stringify(index).includes("We chose SQLite."), false);
  });

for (const damage of ["missing", "changed", "symlink", "traversal", "missing-reference"] as const) {
  test(`a ${damage} snapshot never becomes partial capture input`, async (t) => {
    // Arrange: warm the cache too, so later damage cannot be hidden by hydrated data.
    const directory = await mkdtemp(join(tmpdir(), "queue-damaged-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const original = snapshot();
    original.conversation = [{ id: "user-1", message: { role: "user", content: "Original" } }];
    original.conversationCoverage = "complete";
    const queued = await queue.enqueue(original);
    await queue.getJob(queued.jobId);
    const name = (await readdir(directory)).find((name) => name.startsWith("snapshot-"))!;
    const path = join(directory, name);
    if (damage === "missing") await rm(path);
    if (damage === "changed") await writeFile(path, '{"entries":[]}');
    if (damage === "symlink") {
      const outside = await mkdtemp(join(tmpdir(), "outside-queue-"));
      t.after(() => rm(outside, { recursive: true, force: true }));
      const target = join(outside, "valid-snapshot.json");
      await writeFile(target, await readFile(path));
      await rm(path);
      await symlink(target, path);
    }
    if (damage === "traversal" || damage === "missing-reference") {
      const index = JSON.parse(await readFile(join(directory, "queue.json"), "utf8"));
      if (damage === "traversal") index.jobs[0].snapshotDigest = "../outside";
      else delete index.jobs[0].snapshotDigest;
      await writeFile(join(directory, "queue.json"), JSON.stringify(index));
    }

    // Act / Assert: retrieval and claiming fail; no model-ready partial snapshot is returned.
    await assert.rejects(queue.getJob(queued.jobId));
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    await assert.rejects(reopened.claimNext());
    const index = JSON.parse(await readFile(join(directory, "queue.json"), "utf8"));
    assert.equal(index.jobs[0].attempts, 0);
    assert.equal(index.jobs[0].status, "pending");
  });
}

test("the index ceiling rejects metadata without advancing work or losing accepted snapshots",
  async (t) => {
    // Arrange: transcript input is separate, but policy/output metadata remains bounded.
    const directory = await mkdtemp(join(tmpdir(), "queue-index-capacity-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const tooLarge = snapshot("oversized-metadata");
    tooLarge.policy = "x".repeat(51 * 1024 * 1024);

    // Act: refuse the oversized index transaction, then accept a normal job.
    await assert.rejects(queue.enqueue(tooLarge), /storage limit/);
    const before = await queue.getWatermark("session-1", "branch-1");
    const accepted = await queue.enqueue(snapshot("accepted"));

    // Assert: failed enqueue did not commit its watermark; only the accepted snapshot remains.
    assert.equal(before.lastEntryId, undefined);
    assert.deepEqual(before.dedupeKeys, []);
    assert.equal((await queue.getJob(accepted.jobId))?.snapshot.finalEntryId, "accepted");
    const snapshots = (await readdir(directory)).filter((name) => name.startsWith("snapshot-"));
    assert.equal(snapshots.length, 1);
    assert.ok((await stat(join(directory, "queue.json"))).size < 5 * 1024 * 1024);
  });

test("private snapshots stay unchanged across metadata checkpoints and outlive conflict retention",
  async (t) => {
    // Arrange: a completed job's conflict still needs its original evidence after receipt expiry.
    const directory = await mkdtemp(join(tmpdir(), "queue-retention-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    let now = new Date("2026-01-01T00:00:00Z");
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a", retentionMs: 1000,
      now: () => now });
    const queued = await queue.enqueue(snapshot());
    const name = (await readdir(directory)).find((name) => name.startsWith("snapshot-"))!;
    const path = join(directory, name);
    const before = await stat(path, { bigint: true });
    await queue.checkpoint(queued.jobId, { callCount: 2 });
    const after = await stat(path, { bigint: true });
    await queue.addConflict({ ...pendingConflict("retained"), jobId: queued.jobId });
    await queue.complete(queued.jobId);

    // Act: advance past retention, then resolve the conflict.
    now = new Date("2026-01-02T00:00:00Z");
    await queue.advanceWatermark({ sessionId: "session-1", branchId: "branch-1", entryIds: [] });
    const retained = await queue.getJob(queued.jobId);
    const preserved = await stat(path);
    await queue.updateConflict("retained", { status: "resolved" });

    // Assert: no payload rewrite for metadata; permissions and pending evidence are preserved.
    assert.equal(after.ino, before.ino);
    assert.equal(after.mtimeNs, before.mtimeNs);
    assert.equal(preserved.mode & 0o777, 0o600);
    assert.equal((await stat(directory)).mode & 0o777, 0o700);
    assert.equal(retained?.status, "complete");
    await assert.rejects(stat(path), { code: "ENOENT" });
  });

test("snapshot cleanup reclaims abandoned temporary writes after retention", async (t) => {
  // Arrange: a crash left one expired partial write and one recent write beside a live snapshot.
  const directory = await mkdtemp(join(tmpdir(), "queue-partial-write-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const now = new Date();
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a", retentionMs: 1000,
    now: () => now });
  const queued = await queue.enqueue(snapshot());
  const name = (await readdir(directory)).find((name) => name.startsWith("snapshot-"))!;
  const old = join(directory, `${name}.00000000-0000-0000-0000-000000000000.tmp`);
  const recent = join(directory, `${name}.11111111-1111-1111-1111-111111111111.tmp`);
  await writeFile(old, "Interrupted sanitized transcript", { mode: 0o600 });
  await writeFile(recent, "Recent partial write", { mode: 0o600 });
  await utimes(old, new Date(now.getTime() - 2000), new Date(now.getTime() - 2000));

  // Act: an ordinary checkpoint performs cleanup under the queue lock.
  await queue.checkpoint(queued.jobId, { callCount: 1 });

  // Assert: retention only reclaims the abandoned temporary file, not live/recent data.
  await assert.rejects(stat(old), { code: "ENOENT" });
  assert.ok((await stat(recent)).isFile());
  assert.equal((await queue.getJob(queued.jobId))?.snapshot.entries[0]?.text, "We chose SQLite.");
});

test("a relocated queue remains self-contained without its original directory", async (t) => {
  // Arrange: sidecars belong to the queue bundle, not to an absolute source location.
  const root = await mkdtemp(join(tmpdir(), "queue-relocate-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "original");
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const queued = await queue.enqueue(snapshot());

  // Act: move the private queue directory and reopen it without the original path.
  const moved = join(root, "moved");
  await rename(directory, moved);
  const reopened = new DurableQueueStore({ directory: moved, instanceId: "instance-a" });
  const recovered = await reopened.getJob(queued.jobId);

  // Assert: independent durability includes all data needed to reconstruct the snapshot.
  assert.equal(recovered?.snapshot.entries[0]?.text, "We chose SQLite.");
  assert.equal(recovered?.attempts, 0);
});

for (const status of ["complete"] as const) {
  test(`${status} conflict context and inspection evidence survive restart`, async (t) => {
    // Arrange: the worker has a durable conflict referring to its original conversation.
    const directory = await mkdtemp(join(tmpdir(), "queue-conflict-context-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const original = snapshot();
    original.conversation = [{ id: "user-1", type: "message",
      message: { role: "user", content: "We chose SQLite." } },
    { id: "assistant-1", type: "message",
      message: { role: "assistant", content: [{ type: "text", text: "Change completed" }] } }];
    original.conversationCoverage = "complete";
    const queued = await queue.enqueue(original);
    const observation = { id: "inspection:file-1", role: "toolResult" as const,
      toolName: "inspect_source", toolCallId: "source-1", isError: false,
      text: "Observed repository source" };
    await queue.checkpoint(queued.jobId, { inspectionEntries: [observation], callCount: 3 });
    await queue.addConflict({ ...pendingConflict("needs-context"), jobId: queued.jobId });

    // Act: settle the job, restart, then finish the conflict and restart again.
    const settled = await queue.checkpoint(queued.jobId, { status });
    const restarted = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const retained = await restarted.getJob(queued.jobId);
    const listed = (await restarted.listJobs()).find((job) => job.id === queued.jobId);
    await restarted.updateConflict("needs-context", { status: "resolved" });
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const released = await reopened.getJob(queued.jobId);

    // Assert: terminal status does not hide still-retained context or require released sidecars.
    for (const job of [settled, retained, listed]) {
      assert.equal(job?.status, status);
      assert.equal(job?.callCount, 3);
      assert.deepEqual(job?.snapshot.conversation, original.conversation);
      assert.deepEqual(job?.snapshot.entries, [...original.entries, observation]);
    }
    assert.equal(released?.status, status);
    assert.equal(released?.snapshot.conversation, undefined);
    assert.deepEqual(released?.snapshot.entries, []);
    assert.equal((await readdir(directory)).some((name) => name.startsWith("snapshot-")), false);
  });
}

for (const damage of ["missing", "corrupt"] as const) {
  test(`a ${damage} retained conflict snapshot fails explicitly until released`, async (t) => {
    // Arrange: a terminal job still owns its snapshot through a pending conflict.
    const directory = await mkdtemp(join(tmpdir(), "queue-conflict-damaged-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const queued = await queue.enqueue(snapshot());
    await queue.addConflict({ ...pendingConflict("damaged-context"), jobId: queued.jobId });
    await queue.complete(queued.jobId);
    const name = (await readdir(directory)).find((name) => name.startsWith("snapshot-"))!;
    const path = join(directory, name);
    if (damage === "missing") await rm(path);
    else await writeFile(path, '{"entries":[]}');

    // Act / Assert: restart reports damage instead of silently returning an empty transcript.
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    await assert.rejects(reopened.getJob(queued.jobId),
      damage === "missing" ? { code: "ENOENT" } : /snapshot digest mismatch/);
    await reopened.updateConflict("damaged-context", { status: "rejected" });
    assert.deepEqual((await reopened.getJob(queued.jobId))?.snapshot.entries, []);
  });
}

for (const status of ["complete"] as const) {
  test(`${status} conflict rejects a missing index reference without deleting retained evidence`,
    async (t) => {
      // Arrange: a retained conversation and completed operations must survive index damage.
      const directory = await mkdtemp(join(tmpdir(), "queue-conflict-reference-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
      const original = snapshot();
      original.conversation = [{ id: "user-1", role: "user", text: "We chose SQLite." }];
      original.conversationCoverage = "complete";
      const queued = await queue.enqueue(original);
      await queue.addConflict({ ...pendingConflict("needs-original"), jobId: queued.jobId });
      await queue.checkpoint(queued.jobId, { status, callCount: 3,
        candidateOutcomes: { first: { stage: "memory-created", memoryId: 42 } } });
      const path = join(directory, "queue.json");
      const index = JSON.parse(await readFile(path, "utf8"));
      delete index.jobs[0].snapshotDigest;
      const damaged = JSON.stringify(index);
      await writeFile(path, damaged);
      const names = (await readdir(directory)).sort();
      const restarted = new DurableQueueStore({ directory, instanceId: "instance-a" });

      // Act / Assert: neither a read nor a later mutation may turn corruption into empty history.
      await assert.rejects(restarted.getJob(queued.jobId), /snapshot reference is missing/);
      await assert.rejects(restarted.checkpoint(queued.jobId, { lastError: "Retain original" }),
        /snapshot reference is missing/);
      assert.equal(await readFile(path, "utf8"), damaged);
      assert.deepEqual((await readdir(directory)).sort(), names);
    });
}

for (const version of [1, 2] as const) {
  for (const recovery of ["duplicate enqueue", "claim"] as const) {
    test(`legacy v${version} failed jobs are released during ${recovery}`, async (t) => {
      // Arrange: emulate old persisted failed history, including a missing snapshot reference.
      const directory = await mkdtemp(join(tmpdir(), "queue-legacy-failed-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const options = { directory, instanceId: "instance-a" };
      const queue = new DurableQueueStore(options);
      const original = snapshot();
      const queued = await queue.enqueue(original);
      await queue.checkpoint(queued.jobId, { inspectionEntries: [
        { id: "inspection:old", role: "toolResult", toolName: "read", text: "old evidence" },
      ] });
      await queue.addConflict({ ...pendingConflict("legacy"), jobId: queued.jobId });
      await queue.addConflict(pendingConflict("unrelated"));
      const watermark = await queue.currentWatermark(original.context);
      const index = JSON.parse(await readFile(queue.filePath, "utf8"));
      index.version = version;
      index.jobs[0].status = "failed";
      index.jobs[0].attempts = 3;
      delete index.jobs[0].snapshotDigest;
      if (version === 1) index.jobs[0].snapshot = original;
      await writeFile(queue.filePath, JSON.stringify(index));

      // Act: ordinary durable recovery must release legacy data without a cleanup command.
      const restarted = new DurableQueueStore(options);
      if (recovery === "claim") assert.equal(await restarted.claimNext(), undefined);
      else assert.equal((await restarted.enqueue(original)).queued, false);
      const reopened = new DurableQueueStore(options);

      // Assert: unrelated conflicts and independent watermark history survive reclamation.
      assert.deepEqual(await reopened.listJobs(), []);
      assert.equal(await reopened.getConflict("legacy"), undefined);
      assert.equal((await reopened.getConflict("unrelated"))?.status, "pending");
      assert.deepEqual(await reopened.currentWatermark(original.context), watermark);
      assert.equal((await reopened.enqueue(original)).queued, false);
      assert.deepEqual(await readdir(directory), ["queue.json"]);
    });
  }
}

test("default queue index accepts more than 5 MiB and rejects more than 50 MiB", async (t) => {
  // Arrange: retry artifacts live in the index, independently of transcript sidecars.
  const directory = await mkdtemp(join(tmpdir(), "queue-capacity-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const options = { directory, instanceId: "instance-a" };
  const queue = new DurableQueueStore(options);
  const queued = await queue.enqueue(snapshot());
  const artifacts = ["overlap evidence ".repeat(400_000)];

  // Act: persist an index beyond the former limit and resume through the public store.
  await queue.checkpoint(queued.jobId, { extractedCandidates: artifacts });
  const restarted = new DurableQueueStore(options);

  // Assert: the larger index survives restart; exceeding 50 MiB leaves accepted state intact.
  assert.ok((await stat(queue.filePath)).size > 5 * 1024 * 1024);
  assert.deepEqual((await restarted.getJob(queued.jobId))?.extractedCandidates, artifacts);
  await assert.rejects(restarted.checkpoint(queued.jobId, {
    extractedCandidates: ["large artifact ".repeat(3_500_000)],
  }), /bounded storage limit/);
  assert.deepEqual((await restarted.getJob(queued.jobId))?.extractedCandidates, artifacts);
});

test("completion keeps small diagnostic outcomes and leaves pending retry artifacts intact",
  async (t) => {
    // Arrange: two jobs contain the same bulky retry artifacts; one still needs conflict evidence.
    const directory = await mkdtemp(join(tmpdir(), "queue-complete-metadata-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const options = { directory, instanceId: "instance-a" };
    const queue = new DurableQueueStore(options);
    const completedId = (await queue.enqueue(snapshot("completed"))).jobId;
    const pendingId = (await queue.enqueue(snapshot("pending"))).jobId;
    const content = "detailed stored knowledge ".repeat(10_000);
    const patch = {
      extractedCandidates: [{ id: "fact", title: "Database choice", content,
        sourceEntryIds: ["user-1"], documents: [{ content }], codeArtifacts: [{ content }] }],
      candidateOutcomes: { fact: {
        stage: "created", destinationProjectId: 7, memoryId: 42,
        decision: { action: "create", reason: content }, reason: "Stored database choice",
        overlaps: [{ id: 12, content }],
        linkReview: { status: "partial", reason: "One unrelated memory was unavailable",
          unreviewed: [{ memoryId: 90, reason: "Outside destination" }],
          memory: { content }, memories: [{ content }], previous: { memory: { content } },
          resources: { documents: [{ content }], codeArtifacts: [{ content }] } },
        knowledgeState: { documents: [{ content }] }, creation: { result: { content } },
      } },
    };
    for (const id of [completedId, pendingId]) await queue.checkpoint(id, patch);
    await queue.addConflict({ ...pendingConflict("retain-context"), jobId: completedId });
    const before = await queue.getJob(pendingId);

    // Act: complete one job and reopen the durable store.
    const completed = await queue.complete(completedId);
    const restarted = new DurableQueueStore(options);
    const metadata = (await restarted.listJobMetadata()).find((job) => job.id === completedId)!;

    // Assert: UI fields remain useful while bulky artifacts no longer occupy completed metadata.
    assert.ok(Buffer.byteLength(JSON.stringify(metadata)) < 4_000);
    assert.deepEqual(metadata.extractedCandidates, [{
      id: "fact", title: "Database choice", content: content.slice(0, 2_000),
    }]);
    assert.deepEqual(metadata.candidateOutcomes.fact, {
      stage: "created", action: "create", destinationProjectId: 7, memoryId: 42,
      sourceEntryIds: ["user-1"], reason: "Stored database choice",
      linkReview: { status: "partial", reason: "One unrelated memory was unavailable",
        unreviewed: [{ memoryId: 90, reason: "Outside destination" }] },
    });
    assert.deepEqual(completed.candidateOutcomes, metadata.candidateOutcomes);
    assert.deepEqual(await restarted.getJob(pendingId), before);
    assert.deepEqual((await restarted.getJob(completedId))?.snapshot.entries,
      snapshot("completed").entries);
  });

test("inactive successful summary cache expires without clearing enqueue dedupe", async (t) => {
  // Arrange: one completed compacted capture publishes a reusable summary for its branch.
  const directory = await mkdtemp(join(tmpdir(), "queue-summary-retention-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let now = new Date("2026-10-01T10:00:00Z");
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a", retentionMs: 1000,
    now: () => now });
  const original = orderedSnapshot(["entry-1", "entry-2", "entry-3"]);
  const queued = await queue.enqueue(original);
  await queue.checkpoint(queued.jobId, { compactedConversation: { summary: "Cached summary",
    summarizedThroughEntryId: "entry-2", retainedConversation: original.conversation!.slice(2) } });
  await queue.complete(queued.jobId);
  const withSummary = await queue.getWatermark("session-1", "branch-1");
  assert.ok(withSummary.historyDigest);

  // Act: mutate a different branch after retention so this branch is inactive.
  now = new Date("2026-10-01T10:00:02Z");
  await queue.enqueue({ ...snapshot("other-branch"), context: { ...original.context,
    branchId: "branch-2" } });
  const retained = await queue.getWatermark("session-1", "branch-1");
  const duplicate = await queue.enqueue(original);
  const later = orderedSnapshot(["entry-1", "entry-2", "entry-3", "entry-4"]);
  const accepted = await queue.enqueue(later);
  const laterJob = (await queue.getJob(accepted.jobId))!;

  // Assert: only the reusable summary expires; the dedupe receipt and future work stay intact.
  assert.equal(retained.historyDigest, undefined);
  assert.deepEqual(duplicate, { queued: false, jobId: queued.jobId, reason: "duplicate" });
  assert.equal(accepted.queued, true);
  assert.doesNotMatch(JSON.stringify(laterJob.snapshot.conversation), /Cached summary/);
  assert.ok(laterJob.snapshot.entries.some((entry) => entry.id === "entry-1"));
});

test("damaged reusable summary cache falls back but damaged source evidence still errors",
  async (t) => {
    // Arrange: create a successful summary cache, then damage only that cache sidecar.
    const directory = await mkdtemp(join(tmpdir(), "queue-summary-damage-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const original = orderedSnapshot(["entry-1", "entry-2", "entry-3"]);
    const completed = await queue.enqueue(original);
    await queue.checkpoint(completed.jobId, { compactedConversation: { summary: "Reusable",
      summarizedThroughEntryId: "entry-2",
      retainedConversation: original.conversation!.slice(2) } });
    await queue.complete(completed.jobId);
    const digest = (await queue.getWatermark("session-1", "branch-1")).historyDigest!;
    const cacheName = (await readdir(directory)).find((name) => name.includes(digest))!;
    await writeFile(join(directory, cacheName), "{not json");

    // Act: enqueueing new work accepts the original pinned history and reports the cache error.
    const next = orderedSnapshot(["entry-1", "entry-2", "entry-3", "entry-4"]);
    const accepted = await queue.enqueue(next);
    const job = (await queue.getJob(accepted.jobId))!;
    const cleared = await queue.getWatermark("session-1", "branch-1");

    // Assert: reusable cache damage is recoverable, but source evidence damage is still fatal.
    assert.equal(accepted.queued, true);
    assert.match(accepted.historyError ?? "", /summary cache/i);
    assert.equal(cleared.historyDigest, undefined);
    assert.ok(job.snapshot.entries.some((entry) => entry.id === "entry-1"));
    const sourceName = (await readdir(directory))
      .find((name) => name.startsWith("snapshot-") && !name.includes(digest))!;
    await rm(join(directory, sourceName));
    await assert.rejects(queue.getJob(accepted.jobId), { code: "ENOENT" });
  });

test("completed capture cursor advances only on success and never rolls back on an older retry",
  async (t) => {
    // Arrange: enqueue has its own receipt, independent of completed and summarized progress.
    const directory = await mkdtemp(join(tmpdir(), "queue-completed-cursor-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const old = await queue.enqueue(orderedSnapshot(["entry-1", "entry-2"]));
    const newer = await queue.enqueue(orderedSnapshot(["entry-1", "entry-2", "entry-3"]));
    const pending = await queue.getWatermark("session-1", "branch-1");
    assert.equal(pending.lastEntryId, "entry-3");
    assert.equal(pending.capturedThroughEntryId, undefined);

    // Act: successful newer work completes before an older retry.
    await queue.complete(newer.jobId);
    const completed = await queue.getWatermark("session-1", "branch-1");
    await queue.complete(old.jobId);
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const afterRetry = await reopened.getWatermark("session-1", "branch-1");

    // Assert: no false progress from enqueue, failure or out-of-order completion.
    assert.equal(completed.capturedThroughEntryId, "entry-3");
    assert.equal(afterRetry.capturedThroughEntryId, "entry-3");
    assert.equal(afterRetry.historyThroughEntryId, undefined);
    const failing = await reopened.enqueue(orderedSnapshot([
      "entry-1", "entry-2", "entry-3", "entry-4",
    ]));
    await reopened.checkpoint(failing.jobId, { status: "failed" });
    const afterFailure = await reopened.getWatermark("session-1", "branch-1");
    assert.equal(afterFailure.capturedThroughEntryId, "entry-3");
    assert.equal(afterFailure.lastEntryId, "entry-4");
  });

for (const protectedBy of ["pending job", "pending conflict"] as const) {
  test(`summary retention protects a branch with a ${protectedBy}`, async (t) => {
    // Arrange: completed summarized work and an outstanding consumer on the same branch.
    const directory = await mkdtemp(join(tmpdir(), "queue-summary-active-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    let now = new Date("2026-10-01T10:00:00Z");
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a", retentionMs: 1000,
      now: () => now });
    const first = orderedSnapshot(["entry-1", "entry-2", "entry-3"]);
    const queued = await queue.enqueue(first);
    await queue.checkpoint(queued.jobId, { compactedConversation: { summary: "Active summary",
      summarizedThroughEntryId: "entry-2", retainedConversation: first.conversation!.slice(2) } });
    if (protectedBy === "pending conflict") {
      await queue.addConflict({ ...pendingConflict("active-summary"), jobId: queued.jobId });
    }
    await queue.complete(queued.jobId);
    const active = protectedBy === "pending job"
      ? await queue.enqueue(orderedSnapshot(["entry-1", "entry-2", "entry-3", "entry-4"]))
      : undefined;
    const cached = await queue.getWatermark("session-1", "branch-1");
    assert.ok(cached.historyDigest);

    // Act: expiry runs while this branch still has work or conflict evidence to retain.
    now = new Date("2026-10-01T10:00:02Z");
    await queue.advanceWatermark({ sessionId: "other-session", branchId: "other-branch",
      entryIds: [] });
    const protectedCursor = await queue.getWatermark("session-1", "branch-1");

    // Assert: active cache survives; after the consumer finishes it can expire normally.
    assert.equal(protectedCursor.historyDigest, cached.historyDigest);
    const name = (await readdir(directory)).find((name) =>
      name.endsWith(`${cached.historyDigest}.json`));
    assert.ok(name);
    assert.match(await readFile(join(directory, name), "utf8"), /Active summary/);
    if (active) await queue.complete(active.jobId);
    else await queue.updateConflict("active-summary", { status: "resolved" });
    now = new Date("2026-10-01T10:00:04Z");
    await queue.advanceWatermark({ sessionId: "other-session", branchId: "other-branch",
      entryIds: [] });
    assert.equal((await queue.getWatermark("session-1", "branch-1")).historyDigest, undefined);
    await assert.rejects(readFile(join(directory, name)), { code: "ENOENT" });
    assert.equal((await queue.enqueue(first)).queued, false);
  });
}

test("branch recovery follows the last queued source boundary, never sibling or session state",
  async (t) => {
    // Arrange: each scope has its own persisted receipt; Pi's leaf moves after every turn.
    const directory = await mkdtemp(join(tmpdir(), "queue-branch-resume-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    await queue.enqueue({ ...orderedSnapshot(["root", "shared", "left"]),
      context: { ...snapshot().context, branchId: "session-1:root" } });
    await queue.enqueue({ ...orderedSnapshot(["root", "shared", "right"]),
      context: { ...snapshot().context, branchId: "session-1:shared" } });
    await queue.enqueue({ ...orderedSnapshot(["root", "shared", "foreign"]),
      context: { ...snapshot().context, sessionId: "other-session", branchId: "foreign-branch" } });
    const reopened = new DurableQueueStore({ directory, instanceId: "instance-a" });

    // Act and assert: continuations retain identity; divergent histories get a fresh identity.
    assert.equal(await reopened.resolveBranchId("session-1",
      ["root", "shared", "left", "next"], "session-1:next"), "session-1:root");
    assert.equal(await reopened.resolveBranchId("session-1",
      ["root", "shared", "right", "next-right"], "session-1:next-right"), "session-1:shared");
    assert.equal(await reopened.resolveBranchId("session-1",
      ["root", "shared", "fresh-fork"], "session-1:fresh-fork"), "session-1:fresh-fork");
    assert.equal(await reopened.resolveBranchId("session-1",
      ["root", "shared", "foreign"], "session-1:foreign"), "session-1:foreign");
    assert.equal(await reopened.resolveBranchId("missing-session",
      ["root", "shared", "left"], "missing-session:left"), "missing-session:left");
  });

test("revisiting the same fork point cannot reuse an incompatible fallback branch ID",
  async (t) => {
    // Arrange: one path already used the ID derived from the fork point, then advanced beyond it.
    const directory = await mkdtemp(join(tmpdir(), "queue-fork-identity-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
    const forkBranchId = "session-1:fork";
    await queue.enqueue({ ...orderedSnapshot(["root", "fork", "first-child"]),
      context: { ...snapshot().context, branchId: forkBranchId } });

    // Act: returning to the same fork point starts another path with the same fallback spelling.
    const secondBranchId = await queue.resolveBranchId("session-1", ["root", "fork"], forkBranchId);

    // Assert: the new path gets a distinct identity, preserving the anchor suffix for conflicts.
    assert.notEqual(secondBranchId, forkBranchId);
    assert.ok(secondBranchId.endsWith(":fork"));
    const second = await queue.enqueue({ ...orderedSnapshot(["root", "fork", "second-child"]),
      context: { ...snapshot().context, branchId: secondBranchId } });
    await queue.complete(second.jobId);
    assert.equal(await queue.resolveBranchId("session-1",
      ["root", "fork", "second-child", "next"], "session-1:next"), secondBranchId);
    assert.equal(await queue.resolveBranchId("session-1", ["root", "fork", "first-child"],
      "session-1:first-child"), forkBranchId);
  });

test("stopping a failed candidate does not block other candidates after restart", async (t) => {
  // Arrange: a definite resource failure was deliberately stopped, not left for another write.
  const directory = await mkdtemp(join(tmpdir(), "queue-stopped-candidate-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const { jobId } = await queue.enqueue(snapshot());
  await queue.claimNext();
  await queue.checkpoint(jobId, { status: "paused", candidateOutcomes: {
    stopped: { stage: "execution-stopped", executionFailure: null,
      knowledgeState: { pendingCreates: [{ key: "entity", kind: "entity",
        error: "The service rejected this create" }] } },
    remaining: { stage: "planned" },
  } });
  // Act: the next worker uses only durable state, not the previous worker's objects.
  const restarted = new DurableQueueStore({ directory, instanceId: "instance-a" });
  const claimed = await restarted.claimNext();
  // Assert: a final stop leaves the remaining candidate eligible without replaying the stopped one.
  assert.equal(claimed?.id, jobId);
  assert.equal(claimed?.uncertainWrite, undefined);
  assert.equal((claimed?.candidateOutcomes.stopped as { stage: string }).stage,
    "execution-stopped");
});
