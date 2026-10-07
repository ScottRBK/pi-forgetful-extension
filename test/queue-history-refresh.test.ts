import assert from "node:assert/strict";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";

function snapshot(turns: number): CaptureSnapshot {
  const entries = Array.from({ length: turns }, (_, index) => [
    { id: `u${index + 1}`, role: "user" as const, text: `Adopt storage policy ${index + 1}.` },
    { id: `a${index + 1}`, role: "assistant" as const, text: "Decision recorded." },
  ]).flat();
  return { id: `snapshot-${turns}`, instanceId: "history-refresh", mode: "observe", scope: "global",
    policy: "", modelVersion: "fixture", createdAt: new Date().toISOString(),
    context: { cwd: "/fixture", sessionId: "session", branchId: "branch" },
    entries, conversation: entries.map(({ id, role, text }) => ({ type: "message", id,
      message: { role, content: text, timestamp: 1 } })), conversationCoverage: "complete",
    finalEntryId: entries.at(-1)!.id };
}

async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "queue-history-refresh-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const open = () => new DurableQueueStore({ directory, instanceId: "history-refresh" });
  return { directory, open, queue: open() };
}

async function summarize(queue: DurableQueueStore, jobId: string, through: string, text: string) {
  const job = (await queue.getJob(jobId))!;
  const conversation = job.snapshot.conversation!;
  const cut = conversation.findIndex((entry: any) => entry.id === through);
  assert.ok(cut >= 0);
  await queue.checkpoint(jobId, { compactedConversation: { summary: text,
    summarizedThroughEntryId: through, retainedConversation: conversation.slice(cut + 1) } });
}

test("refresh preserves pending evidence, inspection tail and receipts across disk reopening",
  async (t) => {
    // Arrange: both jobs predate the completed summary; the second also has durable observations.
    const { queue, open } = await fixture(t);
    const first = await queue.enqueue(snapshot(2));
    const original = snapshot(3);
    const second = await queue.enqueue(original);
    await queue.claimNext();
    await summarize(queue, first.jobId, "a1", "COMPLETED_HISTORY");
    await queue.complete(first.jobId);
    await queue.claimNext();
    const inspection = { id: "inspection:saved", role: "toolResult" as const,
      toolName: "inspect_source", text: "Observed source result", isError: false };
    await queue.checkpoint(second.jobId, { callCount: 2, inspectionEntries: [inspection],
      candidateOutcomes: { checked: { stage: "skipped", reason: "Already considered" } } });
    const before = (await queue.getJob(second.jobId))!;

    // Act: refresh the running extraction, then reopen the real queue from disk.
    const refreshed = await queue.refreshCaptureHistory(second.jobId);
    const after = (await open().getJob(second.jobId))!;

    // Assert: context shrinks, not evidence or execution state. The suffix is byte-identical.
    assert.equal(refreshed.historyError, undefined);
    assert.deepEqual(after, refreshed.job);
    assert.deepEqual(after.snapshot.entries, before.snapshot.entries);
    assert.deepEqual(after.snapshot.sourceConversation, original.conversation);
    assert.deepEqual(after.snapshot.conversation!.slice(1),
      [...original.conversation!.slice(2), inspection]);
    assert.deepEqual(after.snapshot.historySummary,
      { throughEntryId: "a1", text: "COMPLETED_HISTORY" });
    assert.equal(after.snapshot.finalEntryId, original.finalEntryId);
    assert.equal(after.attempts, before.attempts);
    assert.equal(after.callCount, before.callCount);
    assert.deepEqual(after.candidateOutcomes, before.candidateOutcomes);
  });

for (const scenario of ["other session", "other branch", "beyond pinned end", "equal progress",
  "newer local progress", "unorderable local progress", "legacy entries only",
  "legacy partial conversation"] as const) {
  test(`refresh ignores completed history with ${scenario}`, async (t) => {
    // Arrange: a prequeued task cannot safely advance using this cache.
    const { queue, open } = await fixture(t);
    const first = await queue.enqueue(snapshot(4));
    const target = snapshot(3);
    if (scenario === "other session") target.context.sessionId = "different-session";
    if (scenario === "other branch") target.context.branchId = "different-branch";
    if (scenario === "unorderable local progress") {
      target.historySummary = { throughEntryId: "missing-boundary", text: "LOCAL_PROGRESS" };
    }
    if (scenario === "legacy entries only") delete target.conversation;
    if (scenario.startsWith("legacy")) target.conversationCoverage = "legacy-partial";
    const second = await queue.enqueue(target);
    await queue.claimNext();
    await summarize(queue, first.jobId, scenario === "beyond pinned end" ? "u4" : "a1",
      "INCOMPATIBLE_CACHE");
    await queue.complete(first.jobId);
    await queue.claimNext();
    if (scenario === "equal progress" || scenario === "newer local progress") {
      await summarize(queue, second.jobId, scenario === "equal progress" ? "a1" : "a2",
        "LOCAL_PROGRESS");
    }
    const before = (await queue.getJob(second.jobId))!;

    // Act.
    const after = await queue.refreshCaptureHistory(second.jobId);

    // Assert: identity and ordering checks leave the task's own context and originals untouched.
    assert.deepEqual(after.job, before);
    assert.equal(after.historyError, undefined);
    assert.deepEqual(await open().getJob(second.jobId), before);
  });
}

test("a completed summary advances older job-local preparation without replacing originals",
  async (t) => {
    // Arrange: the target has partial progress from before another task completed.
    const { queue, open } = await fixture(t);
    const first = await queue.enqueue(snapshot(4));
    const original = snapshot(3);
    const second = await queue.enqueue(original);
    await summarize(queue, second.jobId, "a1", "PARTIAL_HISTORY");
    await queue.claimNext();
    await summarize(queue, first.jobId, "a2", "NEWER_COMPLETED_HISTORY");
    await queue.complete(first.jobId);
    await queue.claimNext();

    // Act.
    await queue.refreshCaptureHistory(second.jobId);
    const after = (await open().getJob(second.jobId))!;

    // Assert: strictly newer completed progress is reusable, with the receiver's exact suffix.
    assert.deepEqual(after.snapshot.historySummary,
      { throughEntryId: "a2", text: "NEWER_COMPLETED_HISTORY" });
    assert.deepEqual(after.snapshot.sourceConversation, original.conversation);
    assert.deepEqual(after.snapshot.entries, original.entries);
    assert.deepEqual(after.snapshot.conversation!.slice(1), original.conversation!.slice(4));
  });

for (const damage of ["missing", "corrupt"] as const) {
  test(`refresh falls back from a ${damage} cache but not damaged originals`, async (t) => {
    // Arrange: the published cache is disposable, whereas the queued original is authoritative.
    const { directory, queue, open } = await fixture(t);
    const first = await queue.enqueue(snapshot(2));
    const second = await queue.enqueue(snapshot(3));
    await queue.claimNext();
    await summarize(queue, first.jobId, "a1", "CACHE_TO_DAMAGE");
    await queue.complete(first.jobId);
    await queue.claimNext();
    const before = (await queue.getJob(second.jobId))!;
    const digest = (await queue.getWatermark("session", "branch")).historyDigest!;
    const cache = (await readdir(directory)).find((name) => name.endsWith(`${digest}.json`))!;
    if (damage === "missing") await rm(join(directory, cache));
    else await writeFile(join(directory, cache), "corrupt cache contents");

    // Act.
    const after = await queue.refreshCaptureHistory(second.jobId);

    // Assert: recoverable cache diagnostics retain the actual error and spend no retry allowance.
    assert.deepEqual(after.job, before);
    assert.match(after.historyError ?? "", damage === "missing" ? /ENOENT/ : /digest mismatch/);
    assert.equal((await open().getWatermark("session", "branch")).historyDigest, undefined);
    assert.deepEqual(await open().getJob(second.jobId), before);
    // Fixture damage only: the completed source is released, leaving the pending source sidecar.
    const source = (await readdir(directory)).find((name) => name.startsWith("snapshot-"))!;
    await rm(join(directory, source));
    await assert.rejects(queue.refreshCaptureHistory(second.jobId), { code: "ENOENT" });
  });
}

for (const state of ["extracted", "uncertain write", "started receipt"] as const) {
  test(`history refresh never resets ${state} work`, async (t) => {
    // Arrange: this job has already crossed the safe pre-extraction refresh boundary.
    const { queue } = await fixture(t);
    const first = await queue.enqueue(snapshot(2));
    const second = await queue.enqueue(snapshot(3));
    await queue.claimNext();
    await summarize(queue, first.jobId, "a1", "DO_NOT_APPLY");
    await queue.complete(first.jobId);
    await queue.claimNext();
    if (state === "extracted") await queue.checkpoint(second.jobId, { extractedCandidates: [] });
    if (state === "uncertain write") await queue.cancel(second.jobId, false, "Unknown save result");
    if (state === "started receipt") await queue.checkpoint(second.jobId, {
      candidateOutcomes: { fact: { creation: { status: "started" } } },
    });
    const before = (await queue.getJob(second.jobId))!;

    // Act.
    const after = await queue.refreshCaptureHistory(second.jobId);

    // Assert: neither new history nor a retry may erase previously accepted work/write uncertainty.
    assert.deepEqual(after.job, before);
    if (state !== "extracted") {
      if (state === "started receipt") await queue.cancel(second.jobId);
      assert.equal(await queue.claimNext(), undefined);
    }
  });
}
