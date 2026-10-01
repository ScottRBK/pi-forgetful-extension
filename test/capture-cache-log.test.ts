import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ForgetfulClient } from "../src/contracts.ts";
import { FileLogger } from "../src/logging.ts";
import { DurableQueueStore } from "../src/queue.ts";

test("capture logs the actual reusable-summary error while accepting original session history",
  async (t) => {
    // Arrange: a successful capture publishes a summary; only its reusable copy goes missing.
    const directory = await mkdtemp(join(tmpdir(), "capture-cache-log-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queueDirectory = join(directory, "queue");
    const queue = new DurableQueueStore({ directory: queueDirectory, instanceId: "cache-test" });
    const original: CaptureSnapshot = { id: "first", instanceId: "cache-test",
      context: { cwd: directory, sessionId: "session", branchId: "branch" },
      entries: [{ id: "old", role: "user", text: "Old decision." },
        { id: "fresh", role: "user", text: "Fresh decision." }],
      conversation: [{ id: "old", message: { role: "user", content: "Old decision." } },
        { id: "fresh", message: { role: "user", content: "Fresh decision." } }],
      finalEntryId: "fresh", mode: "observe", scope: "global", policy: "", modelVersion: "test",
      createdAt: new Date().toISOString() };
    const first = await queue.enqueue(original);
    await queue.checkpoint(first.jobId, { compactedConversation: {
      summary: "An old decision was discussed.", summarizedThroughEntryId: "old",
      retainedConversation: original.conversation!.slice(1),
    } });
    await queue.complete(first.jobId);
    const watermark = await queue.getWatermark("session", "branch");
    assert.ok(watermark?.historyDigest);
    const cacheName = (await readdir(queueDirectory)).find((name) =>
      name.endsWith(`${watermark.historyDigest}.json`));
    assert.ok(cacheName);
    await rm(join(queueDirectory, cacheName));
    const logger = new FileLogger({ directory: join(directory, "logs"), sessionId: "session",
      level: "debug" });
    t.after(() => logger.close());
    const capture = new CaptureService({ queue, logger, instanceId: "cache-test",
      getMode: () => "observe", model: { async complete() { return { candidates: [] }; } },
      client: {} as ForgetfulClient });

    // Act.
    const accepted = await capture.enqueue({ ...original, id: "second", finalEntryId: "next" });
    await logger.flush();

    // Assert: cache loss does not lose pinned messages and is visible in the existing logs.
    assert.equal(accepted.queued, true);
    assert.deepEqual((await queue.getJob(accepted.jobId))?.snapshot.conversation,
      original.conversation);
    const text = await readFile(logger.filePath, "utf8");
    const events = text.trim().split("\n").map((line) => JSON.parse(line));
    const failure = events.find((event) => event.event === "capture.history_cache_error");
    assert.ok(failure, "cache fallback must not silently swallow the underlying error");
    assert.equal(failure.data.jobId, accepted.jobId);
    assert.match(failure.data.error, /ENOENT/);
    assert.match(failure.data.error, new RegExp(watermark.historyDigest));
  });
