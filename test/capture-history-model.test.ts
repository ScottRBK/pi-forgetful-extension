import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime, SessionManager } from "@earendil-works/pi-coding-agent";
import { createAssistantMessageEventStream, type AssistantMessage } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import type { ForgetfulClient } from "../src/contracts.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { providerTools } from "./provider-context.ts";

function answer(): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "history-test", model: "memory",
    content: [{ type: "text", text: "Acknowledged." }], stopReason: "stop", timestamp: 1,
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

test("real private-model compaction persists and reuses session history after restart",
  { timeout: 20_000 }, async (t) => {
    // Arrange: real Pi session/model adapter, capture worker and queue; only replies scripted.
    const directory = await mkdtemp(join(tmpdir(), "capture-history-model-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const early = session.appendMessage({ role: "user", timestamp: 1,
      content: `OLD_HISTORY_START ${"original evidence ".repeat(140)}` });
    for (let index = 0; index < 35; index++) {
      session.appendMessage({ role: "user", timestamp: 1,
        content: `Detail ${index}: ${"historical discussion ".repeat(100)}` });
    }
    session.appendMessage(answer());
    let summaryCalls = 0;
    const runtime = await ModelRuntime.create({ authPath: join(directory, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    runtime.registerProvider("history-test", { api: "faux", apiKey: "fixture-only",
      baseUrl: "http://127.0.0.1/unused", models: [{ id: "memory", name: "Memory", reasoning: false,
        input: ["text"], contextWindow: 64_000, maxTokens: 1024,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
      streamSimple(_model, context) {
        const capture = providerTools(context)[0]?.name === "submit_capture_candidates";
        if (!capture) summaryCalls++;
        const response: AssistantMessage = { ...answer(),
          content: capture ? [{ type: "toolCall", id: "capture",
            name: "submit_capture_candidates", arguments: { candidates: [] } }]
            : [{ type: "text",
              text: "HISTORY_SUMMARY: earlier project discussion, no new evidence." }],
          stopReason: capture ? "toolUse" : "stop" };
        const stream = createAssistantMessageEventStream();
        stream.end(response);
        return stream;
      } });
    const model = new PiMemoryModel(new ModelRegistry(runtime),
      { provider: "history-test", id: "memory" }, { contextLimitTokens: 8000,
        compactionSettings: { enabled: true, reserveTokens: 1200, keepRecentTokens: 1200 } });
    const queue = new DurableQueueStore({ directory, instanceId: "history-model" });
    const capture = new CaptureService({ queue, model, instanceId: "history-model",
      getMode: () => "observe", client: {} as ForgetfulClient });
    const snapshot = () => {
      const built = buildCaptureSnapshot({ session, instanceId: "history-model", mode: "observe",
        scope: "global", policy: "", modelVersion: "memory", context: { cwd: directory,
          sessionId: session.getSessionId(), branchId: "active" } });
      assert.equal(built.status, "ready");
      if (built.status !== "ready") throw new Error("Expected snapshot");
      return built.snapshot;
    };

    // Act: complete capture, reopen, then settle another message on the same branch.
    const first = await capture.enqueue(snapshot());
    await capture.checkpoint();
    assert.equal((await queue.getJob(first.jobId))?.status, "complete");
    assert.ok(summaryCalls > 0, "the smaller private cap must trigger existing summarisation");
    const callsAfterFirst = summaryCalls;
    const fresh = session.appendMessage({ role: "user", timestamp: 2,
      content: "NEW_WORK: next step." });
    session.appendMessage(answer());
    const reopened = new DurableQueueStore({ directory, instanceId: "history-model" });
    const nextCapture = new CaptureService({ queue: reopened, model, instanceId: "history-model",
      getMode: () => "observe", client: {} as ForgetfulClient });
    const next = await nextCapture.enqueue(snapshot());
    const pending = await reopened.getJob(next.jobId);

    // Assert: original processed history is replaced, not duplicated or resummarised on each job.
    assert.ok(pending);
    assert.equal(pending.snapshot.conversationCoverage, "summarized");
    assert.match(JSON.stringify(pending.snapshot.conversation?.[0]), /HISTORY_SUMMARY/);
    assert.doesNotMatch(JSON.stringify(pending.snapshot), /OLD_HISTORY_START/);
    assert.ok(!pending.snapshot.entries.some((entry) => entry.id === early));
    assert.ok(pending.snapshot.entries.some((entry) => entry.id === fresh));
    await nextCapture.checkpoint();
    assert.equal((await reopened.getJob(next.jobId))?.status, "complete");
    assert.equal(summaryCalls, callsAfterFirst);
  });
