import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { DurableQueueStore } from "../src/queue.ts";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ForgetfulClient } from "../src/contracts.ts";

function snapshot(ids: string[]): CaptureSnapshot {
  const entries = ids.map((id) => ({ id, role: "assistant" as const, text: `Fixture ${id}` }));
  return {
    id: `snapshot-${ids.at(-1)}`, instanceId: "boundary-repro", mode: "observe", scope: "global",
    policy: "", modelVersion: "fixture", createdAt: new Date().toISOString(),
    context: { cwd: "/fixture", sessionId: "session", branchId: "branch" },
    entries, conversation: entries.map(({ id, role, text }) => ({ type: "message", id,
      message: { role, content: text, timestamp: 1 } })), conversationCoverage: "complete",
    finalEntryId: ids.at(-1)!,
  };
}

async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "summary-cache-paths-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const open = () => new DurableQueueStore({ directory, instanceId: "boundary-repro" });
  return { directory, open, queue: open() };
}

async function summarize(
  queue: DurableQueueStore, jobId: string, through: string, summary: string,
) {
  const job = (await queue.getJob(jobId))!;
  const conversation = job.snapshot.conversation!;
  const cut = conversation.findIndex((entry: any) => entry.id === through);
  assert.ok(cut >= 0);
  await queue.checkpoint(jobId, { compactedConversation: {
    summary, summarizedThroughEntryId: through, retainedConversation: conversation.slice(cut + 1),
  } });
}

async function finish(queue: DurableQueueStore, jobId: string, through: string, summary: string) {
  const job = await queue.claimNext();
  assert.equal(job?.id, jobId);
  await summarize(queue, jobId, through, summary);
  await queue.complete(jobId);
}

for (const missingBoundary of [false, true]) {
  test(`next job reuses completed summary: old boundary ${missingBoundary ? "absent" : "present"}`,
    async (t) => {
      // Arrange: a cached summary and two prequeued jobs, as in the observed backlog.
      // Synthetic IDs/content only; no live queue files are copied or changed.
      const directory = await mkdtemp(join(tmpdir(), "summary-boundary-repro-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const open = () => new DurableQueueStore({ directory, instanceId: "boundary-repro" });
      const queue = open();
      const oldIds = ["root", "shared", "old-boundary", "old-end"];
      const nextIds = missingBoundary
        ? ["root", "shared", "new-boundary", "new-end"]
        : [...oldIds, "new-boundary", "new-end"];
      const first = await queue.enqueue(snapshot(oldIds));
      const second = await queue.enqueue(snapshot(nextIds));
      const third = await queue.enqueue(snapshot([...nextIds, "third-end"]));
      await finish(queue, first.jobId, "old-boundary", "OLD_SUMMARY");

      // Act: refresh and complete the newer job, then reopen and refresh the next backlog job.
      const secondClaim = await queue.claimNext();
      assert.equal(secondClaim?.id, second.jobId);
      await queue.refreshCaptureHistory(second.jobId);
      const secondJob = (await queue.getJob(second.jobId))!;
      const conversation = secondJob.snapshot.conversation!;
      const cut = conversation.findIndex((entry: any) => entry.id === "new-boundary");
      await queue.checkpoint(second.jobId, { compactedConversation: {
        summary: "NEW_SUMMARY", summarizedThroughEntryId: "new-boundary",
        retainedConversation: conversation.slice(cut + 1),
      } });
      await queue.complete(second.jobId);
      const reopened = open();
      const thirdClaim = await reopened.claimNext();
      assert.equal(thirdClaim?.id, third.jobId);
      const result = await reopened.refreshCaptureHistory(third.jobId);
      const watermark = await reopened.getWatermark("session", "branch");

      // Assert: successful preparation is reused instead of repeating that historical work.
      assert.deepEqual(result.job.snapshot.historySummary,
        { throughEntryId: "new-boundary", text: "NEW_SUMMARY" });
      assert.equal(watermark.historyThroughEntryId, "new-boundary");
      assert.deepEqual(result.job.snapshot.entries, snapshot([...nextIds, "third-end"]).entries);
      assert.deepEqual(result.job.snapshot.sourceConversation,
        snapshot([...nextIds, "third-end"]).conversation);
      assert.deepEqual(result.job.snapshot.conversation!.slice(1),
        snapshot(["new-end", "third-end"]).conversation);
    });
}

test("late old completions cannot evict newer compatible history with a long retained tail",
  async (t) => {
    // Arrange: the summary boundary itself falls outside the old 2,000-ID ordering window.
    const directory = await mkdtemp(join(tmpdir(), "summary-long-path-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const open = () => new DurableQueueStore({ directory, instanceId: "boundary-repro" });
    const queue = open();
    const ids = ["root"];
    const oldJobs = [];
    for (let index = 1; index <= 4; index++) {
      ids.push(`old-${index}`);
      const cut = ids.length;
      ids.push(...Array.from({ length: 2_010 }, (_, i) => `old-${index}-tail-${i}`));
      const original = snapshot(ids);
      const job = await queue.enqueue(original);
      await queue.checkpoint(job.jobId, { compactedConversation: {
        summary: `OLD_${index}`, summarizedThroughEntryId: `old-${index}`,
        retainedConversation: original.conversation!.slice(cut),
      } });
      oldJobs.push(job.jobId);
    }
    ids.push("current");
    const cut = ids.length;
    ids.push(...Array.from({ length: 2_010 }, (_, i) => `current-tail-${i}`));
    const latest = await queue.enqueue(snapshot(ids));
    await queue.checkpoint(latest.jobId, { compactedConversation: {
      summary: "CURRENT_HISTORY", summarizedThroughEntryId: "current",
      retainedConversation: snapshot(ids).conversation!.slice(cut),
    } });
    await queue.complete(latest.jobId);

    // Act: each late completion crosses a disk reopening before the next capture arrives.
    for (const jobId of oldJobs.reverse()) await open().complete(jobId);
    const next = await open().enqueue(snapshot([...ids, "next-end"]));
    const received = (await open().getJob(next.jobId))!;

    // Assert: arrival order and a long suffix cannot roll the shared context backward.
    assert.deepEqual(received.snapshot.historySummary,
      { throughEntryId: "current", text: "CURRENT_HISTORY" });
  });

test("advancing reused history retains ordering against retries from before the inherited summary",
  async (t) => {
    // Arrange: enqueue-time reuse removes the older prefix from the later job's model view.
    const directory = await mkdtemp(join(tmpdir(), "summary-inherited-order-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const open = () => new DurableQueueStore({ directory, instanceId: "boundary-repro" });
    const queue = open();
    const ids = ["root", "early", "early-end", "middle", "middle-end", "current", "end"];
    const old = await queue.enqueue(snapshot(ids.slice(0, 3)));
    await queue.checkpoint(old.jobId, { compactedConversation: {
      summary: "OLD_RETRY", summarizedThroughEntryId: "early",
      retainedConversation: snapshot(ids.slice(0, 3)).conversation!.slice(2),
    } });
    const seed = await queue.enqueue(snapshot(ids.slice(0, 5)));
    await queue.checkpoint(seed.jobId, { compactedConversation: {
      summary: "SEED", summarizedThroughEntryId: "middle",
      retainedConversation: snapshot(ids.slice(0, 5)).conversation!.slice(4),
    } });
    await queue.complete(seed.jobId);
    const latest = await queue.enqueue(snapshot(ids));
    await queue.checkpoint(latest.jobId, { compactedConversation: {
      summary: "CURRENT", summarizedThroughEntryId: "current",
      retainedConversation: snapshot(ids).conversation!.slice(6),
    } });
    await queue.complete(latest.jobId);

    // Act: the original older job completes after reopening the advanced cache.
    await open().complete(old.jobId);
    const watermark = await open().getWatermark("session", "branch");
    const next = await open().enqueue(snapshot([...ids, "next"]));

    // Assert: this known-compatible retry does not publish a regressed cursor.
    assert.equal(watermark.historyThroughEntryId, "current");
    assert.deepEqual((await open().getJob(next.jobId))!.snapshot.historySummary,
      { throughEntryId: "current", text: "CURRENT" });
  });

test("legacy single-cache queues recover prequeued partial work without resetting receipts",
  async (t) => {
    // Arrange: materialize the pre-fix v2 disk format using synthetic source data only.
    const { directory, queue, open } = await fixture(t);
    const old = await queue.enqueue(snapshot(["root", "old", "old-end"]));
    const second = await queue.enqueue(snapshot(["root", "new", "new-end"]));
    const original = snapshot(["root", "new", "new-end", "third-end"]);
    const third = await queue.enqueue(original);
    await finish(queue, old.jobId, "old", "LEGACY_OLD");
    await queue.claimNext();
    await summarize(queue, second.jobId, "root", "PARTIAL_NEW_PATH");
    await queue.checkpoint(second.jobId, { callCount: 2,
      candidateOutcomes: { saved: { stage: "skipped", reason: "Already considered" } } });
    await queue.releaseProgress(second.jobId);
    const before = (await queue.getJob(second.jobId))!;
    const watermark = await queue.getWatermark("session", "branch");
    const name = (await readdir(directory)).find((file) =>
      file.endsWith(`${watermark.historyDigest}.json`))!;
    const legacy = JSON.stringify({ entries: [],
      historySummary: { throughEntryId: "old", text: "LEGACY_OLD" } });
    const digest = createHash("sha256").update(legacy).digest("hex");
    await writeFile(join(directory, name.replace(watermark.historyDigest!, digest)), legacy);
    const disk = JSON.parse(await readFile(queue.filePath, "utf8"));
    const legacyWatermark = Object.values(disk.watermarks)[0] as Record<string, unknown>;
    legacyWatermark.historyDigest = digest;
    delete legacyWatermark.historyAlternatives;
    await writeFile(queue.filePath, JSON.stringify(disk));

    // Act: reopen a legacy queue, finish the incompatible path, then resume its waiting successor.
    const restarted = open();
    assert.equal((await restarted.claimNext())!.id, second.jobId);
    const refreshed = (await restarted.refreshCaptureHistory(second.jobId)).job;
    await summarize(restarted, second.jobId, "new", "RECOVERED_NEW");
    await restarted.complete(second.jobId);
    assert.equal((await open().claimNext())!.id, third.jobId);
    const result = await open().refreshCaptureHistory(third.jobId);
    const oldPath = await open().enqueue(snapshot(["root", "old", "old-end", "old-next"]));

    // Assert: local partial preparation survives migration, and both paths remain reusable.
    assert.deepEqual(refreshed.snapshot, before.snapshot);
    assert.equal(refreshed.callCount, before.callCount);
    assert.deepEqual(refreshed.candidateOutcomes, before.candidateOutcomes);
    assert.deepEqual(result.job.snapshot.historySummary,
      { throughEntryId: "new", text: "RECOVERED_NEW" });
    assert.deepEqual(result.job.snapshot.entries, original.entries);
    assert.deepEqual(result.job.snapshot.sourceConversation, original.conversation);
    assert.deepEqual((await open().getJob(oldPath.jobId))!.snapshot.historySummary,
      { throughEntryId: "old", text: "LEGACY_OLD" });
    assert.equal((await open().enqueue(snapshot(["root", "new", "new-end"]))).queued, false);
  });

test("alternating paths keep their own forward history despite out-of-order completion",
  async (t) => {
    // Arrange: two paths share a branch label but diverge after root, with older work in flight.
    const { queue, open } = await fixture(t);
    const paths = ["a", "b"];
    const oldJobs = [];
    const newJobs = [];
    const pending = [];
    for (const path of paths) {
      const ids = ["root", `${path}-old`, `${path}-old-end`];
      const old = await queue.enqueue(snapshot(ids));
      await summarize(queue, old.jobId, `${path}-old`, `${path}_OLD`);
      oldJobs.push(old.jobId);
      const newer = await queue.enqueue(snapshot([...ids, `${path}-new`, `${path}-end`]));
      await summarize(queue, newer.jobId, `${path}-new`, `${path}_NEW`);
      newJobs.push(newer.jobId);
      pending.push(await queue.enqueue(snapshot([...ids, `${path}-new`, `${path}-end`,
        `${path}-pending`])));
    }

    // Act: publish both new paths, then complete their older jobs in the opposite order.
    for (const id of [...newJobs, ...oldJobs.reverse()]) await open().complete(id);
    const received = [];
    for (const job of pending) {
      assert.equal((await open().claimNext())!.id, job.jobId);
      received.push((await open().refreshCaptureHistory(job.jobId)).job.snapshot.historySummary);
      await open().complete(job.jobId);
    }

    // Assert: neither the latest completion nor the other path wins over compatible progress.
    assert.deepEqual(received, [
      { throughEntryId: "a-new", text: "a_NEW" },
      { throughEntryId: "b-new", text: "b_NEW" },
    ]);
    for (const identity of ["session", "branch"] as const) {
      const target = snapshot(["root", "a-new", "b-new", `${identity}-end`]);
      if (identity === "session") target.context.sessionId = "other-session";
      else target.context.branchId = "other-branch";
      const queued = await open().enqueue(target);
      assert.equal((await open().getJob(queued.jobId))!.snapshot.historySummary, undefined);
      assert.equal((await open().claimNext())!.id, queued.jobId);
      assert.equal((await open().refreshCaptureHistory(queued.jobId))
        .job.snapshot.historySummary, undefined);
      await open().complete(queued.jobId);
    }
  });

test("bounded path caches evict context only and preserve dedupe and pending source evidence",
  async (t) => {
    // Arrange: five incomparable paths exceed the four-entry disposable cache allowance.
    const { queue, open } = await fixture(t);
    const originals = [];
    const jobs = [];
    for (let index = 0; index < 5; index++) {
      const original = snapshot(["root", `path-${index}`, `end-${index}`]);
      originals.push(original);
      const job = await queue.enqueue(original);
      await finish(queue, job.jobId, `path-${index}`, `SUMMARY_${index}`);
      jobs.push(job);
    }

    // Act: revisit an evicted path and a retained path after restarting.
    const evicted = await open().enqueue(snapshot(["root", "path-0", "end-0", "next-0"]));
    const retained = await open().enqueue(snapshot(["root", "path-1", "end-1", "next-1"]));
    const evictedJob = (await open().getJob(evicted.jobId))!;
    const retainedJob = (await open().getJob(retained.jobId))!;

    // Assert: eviction costs preparation, never original evidence or exactly-once processing.
    assert.equal(evictedJob.snapshot.historySummary, undefined);
    assert.deepEqual(evictedJob.snapshot.entries,
      snapshot(["root", "path-0", "end-0", "next-0"]).entries);
    assert.deepEqual(retainedJob.snapshot.historySummary,
      { throughEntryId: "path-1", text: "SUMMARY_1" });
    assert.deepEqual(await open().enqueue(originals[0]),
      { queued: false, jobId: jobs[0].jobId, reason: "duplicate" });
  });

for (const damage of ["missing", "corrupt"] as const) {
  test(`a ${damage} alternative cache does not invalidate another path`, async (t) => {
    // Arrange: retain two incompatible paths, then damage the older cache's temporary sidecar.
    const { directory, queue, open } = await fixture(t);
    const first = await queue.enqueue(snapshot(["root", "a", "a-end"]));
    await finish(queue, first.jobId, "a", "A_CACHE");
    const digest = (await queue.getWatermark("session", "branch")).historyDigest!;
    const second = await queue.enqueue(snapshot(["root", "b", "b-end"]));
    await finish(queue, second.jobId, "b", "B_CACHE");
    const name = (await readdir(directory)).find((file) => file.endsWith(`${digest}.json`))!;
    if (damage === "missing") await rm(join(directory, name));
    else await writeFile(join(directory, name), "Damaged fixture cache");

    // Act: the affected path falls back, then another path reads its healthy cache after restart.
    const a = await open().enqueue(snapshot(["root", "a", "a-end", "a-next"]));
    const b = await open().enqueue(snapshot(["root", "b", "b-end", "b-next"]));

    // Assert: the original diagnostic and pinned source survive; the other cache remains usable.
    assert.match(a.historyError ?? "", damage === "missing" ? /ENOENT/ : /digest mismatch/);
    assert.equal((await open().getJob(a.jobId))!.snapshot.historySummary, undefined);
    assert.deepEqual((await open().getJob(a.jobId))!.snapshot.entries,
      snapshot(["root", "a", "a-end", "a-next"]).entries);
    assert.equal(b.historyError, undefined);
    assert.deepEqual((await open().getJob(b.jobId))!.snapshot.historySummary,
      { throughEntryId: "b", text: "B_CACHE" });
  });
}

test("all incompatible caches expire together without losing dedupe", async (t) => {
  // Arrange: two completed paths on an otherwise idle branch, using a controlled retention clock.
  const directory = await mkdtemp(join(tmpdir(), "summary-cache-expiry-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let now = new Date("2026-10-17T10:00:00Z");
  const open = () => new DurableQueueStore({ directory, instanceId: "boundary-repro",
    retentionMs: 1000, now: () => now });
  const queue = open();
  const originals = [snapshot(["root", "a", "a-end"]), snapshot(["root", "b", "b-end"])];
  for (const [index, original] of originals.entries()) {
    const job = await queue.enqueue(original);
    await finish(queue, job.jobId, index === 0 ? "a" : "b", `CACHE_${index}`);
  }

  // Act: another branch triggers retention after the caches become inactive.
  now = new Date("2026-10-17T10:00:02Z");
  const elsewhere = snapshot(["other"]);
  elsewhere.context.branchId = "different";
  await open().enqueue(elsewhere);

  // Assert: both paths require preparation again, while processed snapshots cannot be replayed.
  for (const original of originals) {
    const ids = original.entries.map((entry) => entry.id);
    const later = await open().enqueue(snapshot([...ids, `${original.finalEntryId}-next`]));
    assert.equal((await open().getJob(later.jobId))!.snapshot.historySummary, undefined);
    assert.equal((await open().enqueue(original)).queued, false);
  }
});

test("capture prepares the new path once and reuses it for the next prequeued extraction",
  async (t) => {
    // Arrange: real queue and capture worker; only external model responses are scripted.
    const { queue, open } = await fixture(t);
    const old = await queue.enqueue(snapshot(["root", "old", "old-end"]));
    await queue.enqueue(snapshot(["root", "new", "new-end"]));
    await queue.enqueue(snapshot(["root", "new", "new-end", "next-end"]));
    await finish(queue, old.jobId, "old", "INCOMPATIBLE_OLD");
    const prepared: unknown[] = [];
    const extracted: unknown[] = [];
    const capture = new CaptureService({ queue: open(), instanceId: "boundary-repro",
      getMode: () => "observe", client: {} as ForgetfulClient, model: {
        async prepareCapture(request) {
          const conversation = request.conversation as Array<Record<string, unknown>>;
          if (conversation[0]?.type !== "capture_history_summary") {
            prepared.push(conversation);
            const cut = conversation.findIndex((record) => record.id === "new");
            assert.ok(cut >= 0);
            await request.onConversationCompacted!({ summary: "NEW_PATH_HISTORY",
              summarizedThroughEntryId: "new", retainedConversation: conversation.slice(cut + 1) });
          }
          return "ready";
        },
        async complete(request) {
          extracted.push(request.conversation);
          return { candidates: [] };
        },
      } });

    // Act: normal capture drains the two jobs that were queued before either summary completed.
    const result = await capture.checkpoint();

    // Assert: the model sees reviewed context on both extractions without repeating preparation.
    assert.deepEqual(result.errors, []);
    assert.equal(prepared.length, 1);
    assert.equal(extracted.length, 2);
    for (const conversation of extracted) {
      assert.match(JSON.stringify(conversation), /NEW_PATH_HISTORY/);
      assert.doesNotMatch(JSON.stringify(conversation), /INCOMPATIBLE_OLD/);
    }
    assert.deepEqual(await open().listPending(), []);
  });

test("a fork publishes shared-prefix history when a sibling cache is past the fork", async (t) => {
  // Arrange: the first path's cache is unusable on the second path, despite shared ancestors.
  const { queue, open } = await fixture(t);
  const shared = ["root", ...Array.from({ length: 2_010 }, (_, i) => `shared-${i}`), "shared-end"];
  const p1 = [...shared, "p1a", "p1-end"];
  const p2 = [...shared, "p2a", "p2-end"];
  const first = await queue.enqueue(snapshot(p1));
  await finish(queue, first.jobId, "p1a", "P1_AFTER_FORK");
  const second = await queue.enqueue(snapshot(p2));
  const pendingSource = snapshot([...p2, "p2-next"]);
  const pending = await queue.enqueue(pendingSource);

  // Act: P2 completes with its summary still before the fork; reopen for both reuse paths.
  await finish(open(), second.jobId, "shared-end", "P2_SHARED_PREFIX");
  assert.equal((await open().claimNext())!.id, pending.jobId);
  const refreshed = await open().refreshCaptureHistory(pending.jobId);
  const later = await open().enqueue(snapshot([...p2, "p2-next", "p2-later"]));
  const sibling = await open().enqueue(snapshot([...p1, "p1-next"]));

  // Assert: queued and new P2 jobs reuse the prefix; P1 keeps its further compatible summary.
  const expected = { throughEntryId: "shared-end", text: "P2_SHARED_PREFIX" };
  assert.deepEqual(refreshed.job.snapshot.historySummary, expected);
  assert.deepEqual(refreshed.job.snapshot.entries, pendingSource.entries);
  assert.deepEqual(refreshed.job.snapshot.sourceConversation, pendingSource.conversation);
  assert.deepEqual((await open().getJob(later.jobId))!.snapshot.historySummary, expected);
  assert.deepEqual((await open().getJob(sibling.jobId))!.snapshot.historySummary,
    { throughEntryId: "p1a", text: "P1_AFTER_FORK" });
});

test("a sibling completion preserves shared-prefix history needed by the other fork", async (t) => {
  // Arrange: P1's completed cache covers a shared prefix, but its producing path extends into P1.
  const { queue, open } = await fixture(t);
  const shared = ["root", ...Array.from({ length: 2_010 }, (_, i) => `shared-${i}`), "shared-end"];
  const p1 = [...shared, "p1a", "p1-end"];
  const p2 = [...shared, "p2a", "p2-end"];
  const first = await queue.enqueue(snapshot(p1));
  const pendingSource = snapshot([...p1, "p1-next"]);
  const pending = await queue.enqueue(pendingSource);
  const second = await queue.enqueue(snapshot(p2));
  await finish(queue, first.jobId, "shared-end", "P1_SHARED_PREFIX");
  assert.equal((await queue.claimNext())!.id, pending.jobId);

  // Act: P2 finishes out of order past the fork; reopen before refreshing or enqueueing P1.
  await finish(open(), second.jobId, "p2a", "P2_AFTER_FORK");
  const refreshed = await open().refreshCaptureHistory(pending.jobId);
  const later = await open().enqueue(snapshot([...p1, "p1-next", "p1-later"]));
  const sibling = await open().enqueue(snapshot([...p2, "p2-next"]));

  // Assert: P2's newer boundary cannot replace a cache that P1 still needs and can actually use.
  const expected = { throughEntryId: "shared-end", text: "P1_SHARED_PREFIX" };
  assert.deepEqual(refreshed.job.snapshot.historySummary, expected);
  assert.deepEqual(refreshed.job.snapshot.entries, pendingSource.entries);
  assert.deepEqual(refreshed.job.snapshot.sourceConversation, pendingSource.conversation);
  assert.deepEqual((await open().getJob(later.jobId))!.snapshot.historySummary, expected);
  assert.deepEqual((await open().getJob(sibling.jobId))!.snapshot.historySummary,
    { throughEntryId: "p2a", text: "P2_AFTER_FORK" });
});

test("repeated advances retire their own cache and preserve a sibling prefix", async (t) => {
  // Arrange: P1 still needs a shared-prefix cache while P2 repeatedly advances after the fork.
  const { queue, open } = await fixture(t);
  const shared = ["root", ...Array.from({ length: 2_010 }, (_, i) => `shared-${i}`), "shared-end"];
  const p1 = [...shared, "p1a", "p1-end"];
  const first = await queue.enqueue(snapshot(p1));
  await finish(queue, first.jobId, "shared-end", "P1_SHARED_PREFIX");

  // Act: more advances than the cache capacity, reopening each time, all on the same P2 path.
  const p2 = [...shared];
  for (let index = 1; index <= 6; index++) {
    p2.push(`p2-${index}`, `p2-end-${index}`);
    const job = await open().enqueue(snapshot(p2));
    await finish(open(), job.jobId, `p2-${index}`, `P2_PROGRESS_${index}`);
  }
  const sibling = await open().enqueue(snapshot([...p1, "p1-next"]));
  const advancing = await open().enqueue(snapshot([...p2, "p2-next"]));

  // Assert: obsolete P2 caches do not consume slots needed by P1, and P2 gets its furthest summary.
  assert.deepEqual((await open().getJob(sibling.jobId))!.snapshot.historySummary,
    { throughEntryId: "shared-end", text: "P1_SHARED_PREFIX" });
  assert.deepEqual((await open().getJob(advancing.jobId))!.snapshot.historySummary,
    { throughEntryId: "p2-6", text: "P2_PROGRESS_6" });
});
