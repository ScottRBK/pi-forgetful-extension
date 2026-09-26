import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SessionManager, type SessionEntry } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { DurableQueueStore } from "../src/queue.ts";

function assistant(text: string): AssistantMessage {
  return {
    role: "assistant", content: [{ type: "text", text }], api: "test" as never,
    provider: "test", model: "test", stopReason: "stop", timestamp: 1,
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
  };
}

test("Pi capture persists full history with typed outcomes and earlier evidence", async (t) => {
  // Arrange: original history survives both a compaction and a sibling branch.
  const directory = await mkdtemp(join(tmpdir(), "typed-conversation-pi-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory("/repo");
  const early = session.appendMessage({ role: "user", content: "Original decision", timestamp: 1 });
  for (let index = 0; index < 105; index++)
    session.appendMessage({ role: "user", content: `Detail ${index}`, timestamp: 1 });
  const watermark = session.appendMessage(assistant("Previous work settled"));
  const sibling = session.appendMessage({ role: "user", content: "Other branch", timestamp: 1 });
  session.branchWithSummary(watermark, "An abandoned branch was explored");
  const compaction = session.appendCompaction("Compressed history", watermark, 12345);
  const calls = session.appendMessage({ ...assistant("Inspecting"), stopReason: "toolUse",
    content: [{ type: "toolCall", id: "read-1", name: "read",
      arguments: { path: "src/app.ts", password: "fixture-secret" } }] });
  const failed = session.appendMessage({ role: "toolResult", toolCallId: "read-1", toolName: "read",
    isError: true, content: [{ type: "text", text: "Not Found" }], timestamp: 1,
    details: { status: 404, api_key: "fixture-secret" } });
  const memory = session.appendMessage({ role: "toolResult", toolCallId: "memory-1",
    toolName: "forgetful_recall", isError: false, timestamp: 1,
    content: [{ type: "text", text: "Untrusted historical claim" }] });
  const image = session.appendMessage({ role: "user", timestamp: 1,
    content: [{ type: "image", mimeType: "image/png", data: "aW1hZ2U=" }] });
  const custom = session.appendCustomMessageEntry(
    "forgetful_recall_async", "Memory context", false);
  const final = session.appendMessage(assistant("Finished"));

  // Act: evidence allowlisting must not remove any conversation context.
  const result = buildCaptureSnapshot({ session, instanceId: "test", mode: "auto", scope: "global",
    context: { cwd: "/repo", sessionId: session.getSessionId(), branchId: "branch" },
    policy: "capture", modelVersion: "test", afterEntryId: watermark,
    includeToolEvidence: () => false });

  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  const queue = new DurableQueueStore({ directory, instanceId: "test" });
  const queued = await queue.enqueue(result.snapshot);
  const reopened = new DurableQueueStore({ directory, instanceId: "test" });
  const snapshot = (await reopened.getJob(queued.jobId))!.snapshot;

  // Assert: history remains ordered and images remain native data across independent recovery.
  const conversation = snapshot.conversation as Array<SessionEntry & { trust?: string }>;
  assert.equal(conversation[0]?.id, early);
  assert.equal(conversation.at(-1)?.id, final);
  assert.ok(conversation.length > 100);
  assert.equal(conversation.some((entry) => entry.id === sibling), false);
  assert.equal((conversation.find((entry) => entry.id === compaction) as
    { tokensBefore: number }).tokensBefore, 12345);
  const call = conversation.find((entry) => entry.id === calls) as any;
  assert.deepEqual(call.message.content[0].arguments,
    { path: "src/app.ts", password: "[redacted]" });
  const failure = conversation.find((entry) => entry.id === failed) as any;
  assert.equal(failure.message.toolCallId, "read-1");
  assert.equal(failure.message.isError, true);
  assert.equal(failure.message.content[0].text, "Not Found");
  assert.deepEqual(failure.message.details, { status: 404, api_key: "[redacted]" });
  assert.equal(conversation.find((entry) => entry.id === memory)?.trust, "untrusted-memory");
  assert.equal(conversation.find((entry) => entry.id === custom)?.trust, "untrusted-memory");
  assert.deepEqual((conversation.find((entry) => entry.id === image) as any).message.content,
    [{ type: "image", mimeType: "image/png", data: "aW1hZ2U=" }]);
  assert.ok(snapshot.entries.some((entry) => entry.id === early));
  assert.equal(snapshot.entries.some((entry) =>
    [failed, memory, custom].includes(entry.id)), false);
  assert.equal(snapshot.processedThroughEntryId, watermark);
  assert.equal(snapshot.conversationCoverage, "complete");
  assert.equal(JSON.stringify(snapshot).includes("fixture-secret"), false);
  for (const file of await readdir(directory)) {
    if (file.endsWith(".json")) {
      const stored = await readFile(join(directory, file), "utf8");
      assert.equal(stored.includes("fixture-secret"), false);
    }
  }
});

test("a full in-memory Pi conversation over 5 MiB survives queue restart unchanged", async (t) => {
  // Arrange: the only source is an in-memory Pi session, not a mutable session journal.
  const directory = await mkdtemp(join(tmpdir(), "full-conversation-pi-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory("/repo");
  const early = session.appendMessage({ role: "user", timestamp: 1,
    content: "Original fact\n" + "x".repeat(6 * 1024 * 1024) });
  for (let index = 0; index < 105; index++)
    session.appendMessage({ role: "user", content: `Detail ${index}`, timestamp: 1 });
  const watermark = session.appendMessage(assistant("Previous work"));
  session.appendCompaction("Short summary", watermark, 1000000);
  session.appendMessage({ role: "user", content: "Correct the original fact", timestamp: 1 });
  session.appendMessage(assistant("Correction complete"));
  const result = buildCaptureSnapshot({ session, instanceId: "test", mode: "auto", scope: "global",
    context: { cwd: "/repo", sessionId: session.getSessionId(), branchId: "branch" },
    policy: "capture", modelVersion: "test", afterEntryId: watermark });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  const queue = new DurableQueueStore({ directory, instanceId: "test" });

  // Act: mutate the original session after enqueue, then reopen and checkpoint the durable job.
  const queued = await queue.enqueue(result.snapshot);
  session.appendMessage({ role: "user", content: "Later work must not leak", timestamp: 1 });
  result.snapshot.entries[0]!.text = "Caller mutation must not leak";
  const reopened = new DurableQueueStore({ directory, instanceId: "test" });
  const claimed = await reopened.claimNext();
  const saved = await reopened.checkpoint(queued.jobId, { callCount: 2,
    candidateOutcomes: { correction: { stage: "created", memoryId: 42 } } });

  // Assert: the public APIs hydrate the same full snapshot while the index stays bounded.
  assert.equal(claimed?.id, queued.jobId);
  assert.equal(saved.snapshot.entries[0]?.id, early);
  assert.equal(saved.snapshot.entries[0]?.text.length, 6 * 1024 * 1024 + 14);
  assert.ok(saved.snapshot.entries.length > 100);
  assert.equal(saved.snapshot.conversationCoverage, "complete");
  assert.equal(saved.snapshot.processedThroughEntryId, watermark);
  assert.equal(JSON.stringify(saved.snapshot).includes("Later work must not leak"), false);
  assert.equal(saved.callCount, 2);
  assert.deepEqual(saved.candidateOutcomes.correction, { stage: "created", memoryId: 42 });
  assert.equal((await reopened.listPending())[0]?.snapshot.entries[0]?.text,
    saved.snapshot.entries[0]?.text);
  const index = await readFile(join(directory, "queue.json"), "utf8");
  assert.ok(Buffer.byteLength(index) < 5 * 1024 * 1024);
  assert.equal(index.includes("Original fact"), false);
  assert.equal((await stat(join(directory, "queue.json"))).mode & 0o777, 0o600);
});

test("pinned Pi captures retain opt-outs as context without scheduling old work", () => {
  // Arrange: a settled branch has an explicit evidence opt-out and then receives a later turn.
  const session = SessionManager.inMemory("/repo");
  const allowed = session.appendMessage({
    role: "user", content: "Allowed old fact", timestamp: 1 });
  const watermark = session.appendMessage(assistant("First completion"));
  const excluded = session.appendMessage({
    role: "user", content: "Do not remember", timestamp: 1 });
  const leaf = session.appendMessage(assistant("Second completion"));
  const options = { session, instanceId: "test", mode: "auto" as const, scope: "global" as const,
    context: { cwd: "/repo", sessionId: session.getSessionId(), branchId: "branch" },
    policy: "capture", modelVersion: "test", afterEntryId: watermark, leafEntryId: leaf,
    excludedEvidenceEntryIds: [excluded] };
  session.appendMessage({ role: "user", content: "Later request", timestamp: 1 });
  session.appendMessage(assistant("Later completion"));

  // Act: build twice at the pinned settlement and inspect scheduling guards separately.
  const first = buildCaptureSnapshot(options);
  const second = buildCaptureSnapshot(options);
  const noNew = buildCaptureSnapshot({ ...options, afterEntryId: leaf });
  const stale = buildCaptureSnapshot({ ...options, afterEntryId: "other-branch" });

  // Assert: opting out is an evidence rule, never a context filter or watermark cutoff.
  assert.equal(first.status, "ready");
  assert.equal(second.status, "ready");
  if (first.status !== "ready" || second.status !== "ready") return;
  assert.equal(first.snapshot.id, second.snapshot.id);
  assert.equal(first.snapshot.finalEntryId, leaf);
  assert.equal(first.snapshot.entries.some((entry) => entry.id === excluded), false);
  assert.equal(first.snapshot.entries.some((entry) => entry.id === allowed), true);
  assert.ok(JSON.stringify(first.snapshot.conversation).includes("Do not remember"));
  assert.equal(JSON.stringify(first.snapshot).includes("Later request"), false);
  assert.equal(noNew.status, "skipped");
  assert.equal(stale.status, "skipped");
});

test("Pi failure observations and image-only provenance survive independent queue recovery",
  async (t) => {
    // Arrange: failures can have text or just details; recalled failures are still memory results.
    const directory = await mkdtemp(join(tmpdir(), "failure-provenance-pi-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory("/repo");
    const image = session.appendMessage({ role: "user", timestamp: 1,
      content: [{ type: "image", mimeType: "image/png", data: "aW1hZ2U=" }] });
    const failure = session.appendMessage({ role: "toolResult", toolName: "read",
      toolCallId: "read-1", isError: true, timestamp: 1,
      content: [{ type: "text", text: "Not Found" }], details: { status: 404 } });
    const emptyFailure = session.appendMessage({ role: "toolResult", toolName: "edit",
      toolCallId: "edit-1", isError: true, timestamp: 1, content: [],
      details: { status: 409, reason: "Conflict" } });
    const memoryFailure = session.appendMessage({ role: "toolResult", toolName: "forgetful_recall",
      toolCallId: "memory-1", isError: true, timestamp: 1,
      content: [{ type: "text", text: "Memory unavailable" }] });
    session.appendMessage(assistant("The requested changes could not be completed"));

    // Act: capture and reopen through the same public seams used by background work.
    const result = buildCaptureSnapshot({
      session, instanceId: "test", mode: "auto", scope: "global",
      context: { cwd: "/repo", sessionId: session.getSessionId(), branchId: "branch" },
      policy: "capture", modelVersion: "test" });
    assert.equal(result.status, "ready");
    if (result.status !== "ready") return;
    const queue = new DurableQueueStore({ directory, instanceId: "test" });
    const queued = await queue.enqueue(result.snapshot);
    const reopened = new DurableQueueStore({ directory, instanceId: "test" });
    const recovered = (await reopened.getJob(queued.jobId))!.snapshot;

    // Assert: provenance reports what was supplied or failed, without inventing image contents.
    assert.deepEqual(recovered.entries.find((entry) => entry.id === failure), {
      id: failure, role: "toolResult", toolName: "read", toolCallId: "read-1", isError: true,
      text: "Not Found", details: { status: 404 },
    });
    const empty = recovered.entries.find((entry) => entry.id === emptyFailure);
    assert.equal(empty?.isError, true);
    assert.equal(empty?.toolCallId, "edit-1");
    assert.deepEqual(empty?.details, { status: 409, reason: "Conflict" });
    assert.equal(empty?.text,
      "[Tool returned an error without text content; see the original conversation entry.]");
    const provenance = recovered.entries.find((entry) => entry.id === image);
    assert.equal(provenance?.role, "user");
    assert.equal(provenance?.text,
      "[User supplied non-text content; see the original conversation entry.]");
    assert.equal(JSON.stringify(recovered.entries).includes("aW1hZ2U="), false);
    assert.equal(recovered.entries.some((entry) => entry.id === memoryFailure), false);
    const conversation = recovered.conversation as Array<SessionEntry & { trust?: string }>;
    assert.equal(conversation.find((entry) => entry.id === memoryFailure)?.trust,
      "untrusted-memory");
    assert.deepEqual((conversation.find((entry) => entry.id === image) as any).message.content,
      [{ type: "image", mimeType: "image/png", data: "aW1hZ2U=" }]);
  });
