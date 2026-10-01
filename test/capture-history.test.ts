import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import type { ForgetfulClient, ModelRequest } from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";

function reply(): AssistantMessage {
  return { role: "assistant", content: [{ type: "text", text: "Noted." }],
    api: "openai-completions", provider: "test", model: "memory", timestamp: 1,
    stopReason: "stop", usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,
      totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

function settled(session: SessionManager, directory: string, branchId = "active") {
  const result = buildCaptureSnapshot({ session, instanceId: "history", mode: "observe",
    scope: "global", policy: "", modelVersion: "test/memory",
    context: { cwd: directory, sessionId: session.getSessionId(), branchId } });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("Expected settled snapshot");
  return result.snapshot;
}

function settledAt(
  session: SessionManager,
  directory: string,
  leafEntryId: string,
  branchId = "active",
) {
  const result = buildCaptureSnapshot({ session, instanceId: "history", mode: "observe",
    scope: "global", policy: "", modelVersion: "test/memory", leafEntryId,
    context: { cwd: directory, sessionId: session.getSessionId(), branchId } });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("Expected settled snapshot");
  return result.snapshot;
}

// The scripted external model reports the same compacted view as the private Pi adapter.
// Session identity, snapshots, capture lifecycle and restart persistence are real.
test("capture persists a compacted view while retaining original evidence for a retry",
  async (t) => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "capture-history-retry-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory(directory);
  const old = session.appendMessage({ role: "user", content: "Earlier decision.", timestamp: 1 });
  const through = session.appendMessage(reply());
  const fresh = session.appendMessage({ role: "user", content: "New decision.", timestamp: 2 });
  session.appendMessage(reply());
  const queue = new DurableQueueStore({ directory, instanceId: "history" });
  const capture = new CaptureService({ queue, instanceId: "history", getMode: () => "observe",
    client: {} as ForgetfulClient, model: { async complete(request: ModelRequest) {
      await request.onConversationCompacted?.({ summary: "Earlier decision was discussed.",
        summarizedThroughEntryId: through,
        retainedConversation: request.conversation!.slice(2) });
      throw new Error("Provider unavailable after compaction");
    } } });
  const queued = await capture.enqueue(settled(session, directory));

  // Act.
  await capture.checkpoint();
  const reopened = new DurableQueueStore({ directory, instanceId: "history" });
  const job = await reopened.getJob(queued.jobId);

  // Assert: disk now holds the summary and tail, but source evidence is not destroyed on failure.
  assert.ok(job);
  assert.equal(job.status, "pending");
  assert.match(JSON.stringify(job.snapshot.conversation?.[0]), /Earlier decision was discussed/);
  assert.equal(job.snapshot.conversation?.length, 3);
  assert.ok(job.snapshot.entries.some((entry) => entry.id === old));
  assert.ok(job.snapshot.entries.some((entry) => entry.id === fresh));
});

test("successful summaries stay outside the index and never cross session or branch scope",
  async (t) => {
    // Arrange: successful model compaction on one branch.
    const directory = await mkdtemp(join(tmpdir(), "capture-history-scope-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const early = session.appendMessage({ role: "user", content: "Earlier fact.", timestamp: 1 });
    const through = session.appendMessage(reply());
    session.appendMessage({ role: "user", content: "Fresh fact.", timestamp: 2 });
    session.appendMessage(reply());
    const queue = new DurableQueueStore({ directory, instanceId: "history" });
    const capture = new CaptureService({ queue, instanceId: "history", getMode: () => "observe",
      client: {} as ForgetfulClient, model: { async complete(request: ModelRequest) {
        await request.onConversationCompacted?.({ summary: "SCOPED_SUMMARY: prior fact.",
          summarizedThroughEntryId: through,
          retainedConversation: request.conversation!.slice(2) });
        return { candidates: [] };
      } } });
    await capture.enqueue(settled(session, directory));
    await capture.checkpoint();
    const reopened = new DurableQueueStore({ directory, instanceId: "history" });

    // Act: a new settlement has the same original IDs, but each scope is checked independently.
    session.appendMessage({ role: "user", content: "Next work.", timestamp: 3 });
    session.appendMessage(reply());
    const same = await reopened.enqueue(settled(session, directory));
    const sibling = await reopened.enqueue(settled(session, directory, "sibling"));
    const otherSession = settled(session, directory);
    otherSession.context = { ...otherSession.context, sessionId: "different-session" };
    const foreign = await reopened.enqueue(otherSession);
    const diverged = settled(session, directory);
    diverged.context = { ...diverged.context, branchId: "active" };
    diverged.finalEntryId = "divergent-leaf";
    diverged.conversation = diverged.conversation!.filter((entry: any) => entry.id !== through);
    const divergentJob = await reopened.enqueue(diverged);

    // Assert: only an exact matching branch and source boundary reuses the successful summary.
    const sameJob = (await reopened.getJob(same.jobId))!;
    assert.match(JSON.stringify(sameJob.snapshot.conversation?.[0]), /SCOPED_SUMMARY/);
    assert.ok(!sameJob.snapshot.entries.some((entry) => entry.id === early));
    for (const id of [sibling.jobId, foreign.jobId, divergentJob.jobId]) {
      const job = (await reopened.getJob(id))!;
      assert.doesNotMatch(JSON.stringify(job.snapshot.conversation), /SCOPED_SUMMARY/);
      assert.ok(job.snapshot.entries.some((entry) => entry.id === early));
    }
    assert.doesNotMatch(await readFile(join(directory, "queue.json"), "utf8"), /SCOPED_SUMMARY/);
  });

test("exhausted capture discards its summary and evidence without publishing branch history",
  async (t) => {
    // Arrange: compaction succeeds, but capture fails on all three attempts.
    const directory = await mkdtemp(join(tmpdir(), "capture-history-discard-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const early = session.appendMessage({ role: "user", content: "Earlier fact.", timestamp: 1 });
    const through = session.appendMessage(reply());
    session.appendMessage({ role: "user", content: "Fresh fact.", timestamp: 2 });
    session.appendMessage(reply());
    const queue = new DurableQueueStore({ directory, instanceId: "history" });
    let calls = 0;
    const capture = new CaptureService({ queue, instanceId: "history", getMode: () => "observe",
      client: {} as ForgetfulClient, model: { async complete(request: ModelRequest) {
        if (calls++ === 0) await request.onConversationCompacted?.({
          summary: "FAILED_SUMMARY",
          summarizedThroughEntryId: through,
          retainedConversation: request.conversation!.slice(2),
        });
        throw new Error("Provider unavailable");
      } } });
    const input = settled(session, directory);
    const queued = await capture.enqueue(input);

    // Act.
    const checkpoints = [];
    for (let attempt = 0; attempt < 3; attempt++) checkpoints.push(await capture.checkpoint());
    const reopened = new DurableQueueStore({ directory, instanceId: "history" });

    // Assert: failed summary is not reused and duplicate work is not replayed.
    assert.equal(await reopened.getJob(queued.jobId), undefined);
    assert.equal((await reopened.enqueue(input)).queued, false);
    assert.deepEqual((await readdir(directory)).filter((name) => name.includes("snapshot")), []);
    session.appendMessage({ role: "user", content: "Later work.", timestamp: 3 });
    session.appendMessage(reply());
    const next = await reopened.enqueue(settled(session, directory));
    const nextJob = (await reopened.getJob(next.jobId))!;
    assert.doesNotMatch(JSON.stringify(nextJob.snapshot), /FAILED_SUMMARY/);
    assert.ok(nextJob.snapshot.entries.some((entry) => entry.id === early));
    assert.equal(calls, 3);
    assert.deepEqual(checkpoints[2]?.discardedJobs, [{ jobId: queued.jobId,
      error: "Provider unavailable" }]);
  });

test("pending compaction retains original image, tool arguments and failed results on restart",
  async (t) => {
    // Arrange: Pi's text evidence projection cannot represent an image or full tool arguments.
    const directory = await mkdtemp(join(tmpdir(), "capture-history-native-evidence-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const image = { type: "image" as const, mimeType: "image/png", data: "aW1hZ2UtZXZpZGVuY2U=" };
    const imageId = session.appendMessage({ role: "user", timestamp: 1,
      content: [{ type: "text", text: "Original screenshot evidence." }, image] });
    const callId = session.appendMessage({ ...reply(), stopReason: "toolUse", content: [
      { type: "toolCall", id: "inspect", name: "read", arguments: { path: "src/original.ts" } },
    ] });
    const through = session.appendMessage({ role: "toolResult", toolCallId: "inspect",
      toolName: "read", isError: true, timestamp: 2,
      content: [{ type: "text", text: "Original HTTP 503 failure." }] });
    session.appendMessage({ role: "user", content: "New work.", timestamp: 3 });
    session.appendMessage(reply());
    const input = settled(session, directory);
    const original = structuredClone(input.conversation);
    const queue = new DurableQueueStore({ directory, instanceId: "history" });
    const job = await queue.enqueue(input);

    // Act: summarize the native records, then reload the still-unfinished job.
    await queue.checkpoint(job.jobId, { compactedConversation: {
      summary: "Earlier inspection failed.",
      summarizedThroughEntryId: through, retainedConversation: input.conversation!.slice(3) } });
    const reopened = new DurableQueueStore({ directory, instanceId: "history" });
    const pending = (await reopened.getJob(job.jobId))!;

    // Assert: model context is small, but full original evidence remains independently available.
    assert.deepEqual(pending.snapshot.sourceConversation, original);
    const sources = pending.snapshot.sourceConversation as Array<Record<string, any>>;
    assert.deepEqual(sources.find((entry) => entry.id === imageId)?.message.content[1], image);
    assert.equal(sources.find((entry) => entry.id === callId)?.message.content[0].arguments.path,
      "src/original.ts");
    assert.equal(sources.find((entry) => entry.id === through)?.message.isError, true);
    assert.doesNotMatch(JSON.stringify(pending.snapshot.conversation), /aW1hZ2UtZXZpZGVuY2U=/);
    assert.doesNotMatch(await readFile(join(directory, "queue.json"), "utf8"), /aW1hZ2U/);
    await reopened.checkpoint(job.jobId, { status: "failed" });
    assert.deepEqual(await readdir(directory), ["queue.json"]);
  });

test("a successful compacted capture retains verifiable conflict sources until skip resolves it",
  async (t) => {
    // Arrange: a conflict cites a real message that will no longer be in the model view.
    const directory = await mkdtemp(join(tmpdir(), "capture-history-conflict-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const source = session.appendMessage({ role: "user", content: "Earlier claim.", timestamp: 1 });
    const through = session.appendMessage(reply());
    session.appendMessage({ role: "user", content: "Fresh work.", timestamp: 2 });
    session.appendMessage(reply());
    const snapshot = settled(session, directory);
    const queue = new DurableQueueStore({ directory, instanceId: "history" });
    const queued = await queue.enqueue(snapshot);
    await queue.checkpoint(queued.jobId, { compactedConversation: {
      summary: "Earlier claim discussed.",
      summarizedThroughEntryId: through, retainedConversation: snapshot.conversation!.slice(2) } });
    const now = new Date().toISOString();
    await queue.addConflict({ id: "compacted-conflict", jobId: queued.jobId, candidateId: "claim",
      binding: { instanceId: "history" }, sessionId: snapshot.context.sessionId,
      branchId: snapshot.context.branchId, destinationProjectId: 7,
      candidate: { id: "claim" }, sourceEntryIds: [source], evidence: ["Earlier claim."],
      reason: "Needs clarification", status: "pending", createdAt: now, updatedAt: now });
    await queue.complete(queued.jobId);
    const reopened = new DurableQueueStore({ directory, instanceId: "history" });
    const capture = new CaptureService({ queue: reopened, instanceId: "history",
      client: {} as ForgetfulClient,
      model: { async complete() { throw new Error("No model needed"); } },
    });

    // Act: inspect and skip the originating conflict after restart.
    const [conflict] = await capture.pendingConflicts();
    assert.ok(conflict?.verifiedOrigin, "compacted source IDs must still verify their origin");
    const resolved = await capture.resolveConflict("compacted-conflict", { action: "skip" });

    // Assert: conflict is resolved and original evidence is reclaimed, leaving only its summary.
    assert.equal(resolved.status, "resolved");
    assert.deepEqual(await capture.pendingConflicts(), []);
    const finished = (await reopened.getJob(queued.jobId))!;
    assert.equal(finished.snapshot.sourceConversation, undefined);
    const files = (await Promise.all((await readdir(directory))
      .filter((name) => name.endsWith(".json"))
      .map((name) => readFile(join(directory, name), "utf8")))).join("\n");
    assert.doesNotMatch(files, /"content":"Earlier claim\."/);
  });

test("candidate matching failures return a transient final outcome after third-attempt deletion",
  async (t) => {
    // Arrange: extraction succeeds; the external matching service fails on every attempt.
    const directory = await mkdtemp(join(tmpdir(), "capture-candidate-discard-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const source = session.appendMessage({ role: "user", timestamp: 1,
      content: "We adopted SQLite for this repository." });
    session.appendMessage(reply());
    const snapshot = settled(session, directory);
    snapshot.mode = "auto";
    snapshot.context.project = { id: 7, name: "Project" };
    let searches = 0;
    const queue = new DurableQueueStore({ directory, instanceId: "history" });
    const client = { async search() {
      searches++;
      throw new Error("Matching service unavailable");
    } } as unknown as ForgetfulClient;
    const capture = new CaptureService({ queue, client, instanceId: "history", model: {
      async complete(request) {
        if (request.submission?.name === "submit_capture_candidates") return { candidates: [{
          id: "sqlite", title: "SQLite storage", content: "This repository uses SQLite.",
          context: "Adopted decision", keywords: ["sqlite"], tags: [],
          sourceEntryIds: [source], evidenceType: "userDecision",
        }] };
        assert.equal(request.submission?.name, "submit_capture_retry");
        return { action: "retry", reason: "Retry the transient matching failure." };
      },
    } });
    const queued = await capture.enqueue(snapshot);

    // Act.
    const results = [];
    for (let attempt = 0; attempt < 3; attempt++) results.push(await capture.checkpoint());
    const reopened = new DurableQueueStore({ directory, instanceId: "history" });

    // Assert: final reporting must not depend on looking up a deleted candidate/job record.
    assert.equal(searches, 3);
    assert.equal(await reopened.getJob(queued.jobId), undefined);
    assert.deepEqual(results[2]?.discardedJobs, [{ jobId: queued.jobId,
      error: "Matching service unavailable" }]);
    assert.deepEqual(results[2]?.errors, ["Matching service unavailable"]);
    assert.deepEqual(await readdir(directory), ["queue.json"]);
  });

test("a late old retry cannot replace a newer successful branch summary", async (t) => {
  // Arrange: the first job has a valid older summary but remains in flight while newer work wins.
  const directory = await mkdtemp(join(tmpdir(), "capture-history-monotonic-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory(directory);
  session.appendMessage({ role: "user", content: "First topic.", timestamp: 1 });
  const firstThrough = session.appendMessage(reply());
  const queue = new DurableQueueStore({ directory, instanceId: "history" });
  const old = await queue.enqueue(settledAt(session, directory, firstThrough));
  const oldClaim = (await queue.claimNext({ instanceId: "history" }))!;
  await queue.checkpoint(oldClaim.id, { compactedConversation: { summary: "OLD_SUMMARY",
    summarizedThroughEntryId: firstThrough, retainedConversation: oldClaim.snapshot.conversation!
      .slice(2) } });
  session.appendMessage({ role: "user", content: "Second topic.", timestamp: 2 });
  const newerThrough = session.appendMessage(reply());
  const capture = new CaptureService({ queue, instanceId: "history", getMode: () => "observe",
    client: {} as ForgetfulClient, model: { async complete(request: ModelRequest) {
      await request.onConversationCompacted?.({ summary: "NEW_SUMMARY",
        summarizedThroughEntryId: newerThrough,
        retainedConversation: request.conversation!.slice(4) });
      return { candidates: [] };
    } } });
  await capture.enqueue(settled(session, directory));

  // Act: newer summary is published first; then the old retry completes late.
  await capture.checkpoint();
  await queue.checkpoint(old.jobId, { status: "complete" });
  session.appendMessage({ role: "user", content: "Third topic.", timestamp: 3 });
  session.appendMessage(reply());
  const later = await queue.enqueue(settled(session, directory));
  const laterJob = (await queue.getJob(later.jobId))!;
  const files = (await Promise.all((await readdir(directory))
    .filter((name) => name.endsWith(".json"))
    .map((name) => readFile(join(directory, name), "utf8")))).join("\n");

  // Assert: future captures reuse the forward summary, not the late older one.
  assert.match(JSON.stringify(laterJob.snapshot.conversation?.[0]), /NEW_SUMMARY/);
  assert.doesNotMatch(JSON.stringify(laterJob.snapshot.conversation), /OLD_SUMMARY/);
  assert.doesNotMatch(files, /OLD_SUMMARY/);
});

test("a reused branch summary can advance again and reach the next capture", async (t) => {
  // Arrange: each compacted job starts from the successful prior summary, not full old history.
  const directory = await mkdtemp(join(tmpdir(), "capture-history-rolling-cursor-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory(directory);
  session.appendMessage({ role: "user", content: "First topic.", timestamp: 1 });
  const firstThrough = session.appendMessage(reply());
  const queue = new DurableQueueStore({ directory, instanceId: "history" });
  let through = firstThrough;
  let summary = "SUMMARY_ONE";
  const capture = new CaptureService({ queue, instanceId: "history", getMode: () => "observe",
    client: {} as ForgetfulClient, model: { async complete(request: ModelRequest) {
      const cut = request.conversation!.findIndex((entry: any) => entry.id === through) + 1;
      assert.ok(cut > 0);
      await request.onConversationCompacted?.({ summary, summarizedThroughEntryId: through,
        retainedConversation: request.conversation!.slice(cut) });
      return { candidates: [] };
    } } });
  await capture.enqueue(settled(session, directory));
  await capture.checkpoint();
  session.appendMessage({ role: "user", content: "Second topic.", timestamp: 2 });
  through = session.appendMessage(reply());
  summary = "SUMMARY_TWO";
  const second = await capture.enqueue(settled(session, directory));
  assert.match(JSON.stringify((await queue.getJob(second.jobId))?.snapshot.conversation?.[0]),
    /SUMMARY_ONE/);

  // Act: compact the reused view, complete it, reopen storage and settle a third job.
  await capture.checkpoint();
  session.appendMessage({ role: "user", content: "Third topic.", timestamp: 3 });
  session.appendMessage(reply());
  const reopened = new DurableQueueStore({ directory, instanceId: "history" });
  const third = await reopened.enqueue(settled(session, directory));
  const next = (await reopened.getJob(third.jobId))!;

  // Assert: the derived summary record represents the old source cursor, not a separate source.
  assert.match(JSON.stringify(next.snapshot.conversation?.[0]), /SUMMARY_TWO/);
  assert.doesNotMatch(JSON.stringify(next.snapshot.conversation), /SUMMARY_ONE/);
  assert.equal((await reopened.getWatermark(session.getSessionId(), "active"))
    .historyThroughEntryId, through);
});
