import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import type { ForgetfulClient, ModelRequest } from "../src/contracts.ts";

function answer(text: string): AssistantMessage {
  return {
    role: "assistant", content: [{ type: "text", text }], api: "openai-completions",
    provider: "test", model: "memory", timestamp: Date.now(), stopReason: "stop",
    usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
  };
}

test("capture receives the whole pinned conversation, not the watermark delta", async (t) => {
  // Arrange: real Pi history has early evidence and more than the old 100-entry cutoff.
  const directory = await mkdtemp(join(tmpdir(), "pi-capture-context-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const session = SessionManager.inMemory(directory);
  const early = session.appendMessage({ role: "user", timestamp: 1,
    content: "Keep the shipping change provisional until the carrier confirms it." });
  const marker = session.appendMessage(answer("The qualification is recorded."));
  for (let index = 0; index < 110; index++) {
    session.appendMessage({ role: "user", timestamp: index + 2,
      content: `Discussion item ${index}; no adopted change.` });
  }
  session.appendMessage({ ...answer("Checking the carrier note."), stopReason: "toolUse",
    content: [{ type: "toolCall", id: "check-note", name: "read",
      arguments: { path: "carrier.txt" } }] });
  session.appendMessage({ role: "toolResult", toolCallId: "check-note", toolName: "read",
    content: [{ type: "text", text: "Carrier confirmation unavailable: HTTP 503." }],
    isError: true, timestamp: 200 });
  session.appendMessage({ role: "user", timestamp: 201,
    content: "There is still no confirmation. Keep the earlier qualification." });
  const last = session.appendMessage(answer("The shipping plan remains provisional."));
  const result = buildCaptureSnapshot({ session, instanceId: "isolated", mode: "observe",
    scope: "project", policy: "", modelVersion: "test/memory", afterEntryId: marker,
    context: { cwd: directory, project: { id: 1, name: "Shipping" },
      sessionId: session.getSessionId(), branchId: "active" } });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  const seen: ModelRequest[] = [];
  const queue = new DurableQueueStore({ directory, instanceId: "isolated" });
  const capture = new CaptureService({ queue, instanceId: "isolated",
    client: {} as ForgetfulClient, getMode: () => "observe",
    model: { async complete(request) { seen.push(request); return { candidates: [] }; } } });

  // Act: enqueue, reopen the queue, then run capture at the public service boundary.
  const queued = await capture.enqueue(result.snapshot);
  const reopened = new DurableQueueStore({ directory, instanceId: "isolated" });
  const persisted = await reopened.getJob(queued.jobId);
  assert.ok(persisted);
  await capture.checkpoint();

  // Assert: complete history and original failed-tool metadata reach the model, once.
  assert.equal(seen.length, 1);
  const conversation = seen[0]!.conversation as Array<Record<string, any>>;
  assert.ok(conversation, "a separate full conversation must be supplied");
  assert.equal(conversation[0]?.id, early);
  assert.equal(conversation.at(-1)?.id, last);
  assert.ok(conversation.length > 100);
  assert.match(JSON.stringify(conversation), /provisional until the carrier confirms/);
  const call = conversation.find((entry) => entry.message?.content?.[0]?.id === "check-note");
  assert.deepEqual(call?.message.content[0].arguments, { path: "carrier.txt" });
  const failed = conversation.find((entry) => entry.message?.role === "toolResult");
  assert.ok(failed);
  assert.equal(failed.message.toolCallId, "check-note");
  assert.equal(failed?.message.isError, true);
  assert.match(JSON.stringify(failed), /HTTP 503/);
  const input = seen[0]!.input as Record<string, unknown>;
  assert.equal(input.processedThroughEntryId, marker);
  const eligible = input.eligibleEvidence as Array<{ id: string; role: string; isError?: boolean }>;
  assert.ok(!eligible.some((entry) => entry.role === "assistant"),
    "contextual assistant claims must not be advertised as eligible source citations");
  assert.ok(eligible.some((entry) => entry.id === early));
  assert.ok(eligible.some((entry) => entry.id === failed.id && entry.isError === true));
  assert.ok(!("entries" in input), "do not duplicate the transcript inside task metadata");
  assert.equal(persisted.snapshot.entries[0]?.id, early);
});
