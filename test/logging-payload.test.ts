import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { FileLogger } from "../src/logging.ts";

// These are the payload sizes already supported by capture/model, not whole session archives.
test("default debug logging retains a normal 50KB capture snapshot", async t => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "capture-payload-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-a", level: "debug" });
  const entries = Array.from({ length: 20 }, (_, index) => ({
    id: `entry-${index}`, role: "user", text: "A".repeat(2_500),
  }));

  // Act.
  logger.emit("debug", "capture.snapshot", { jobId: "job-a", entries });
  await logger.flush();

  // Assert: routine supported input must not disappear because the logger cap is too small.
  const event = JSON.parse((await readFile(logger.filePath, "utf8")).trim());
  assert.deepEqual(event.data?.entries, entries);
  assert.equal(event.truncated, undefined);
});

test("oversized payload markers retain the IDs needed to investigate the event", async t => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "oversized-payload-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({
    directory, sessionId: "session-a", level: "debug", maxEventBytes: 512,
  });

  // Act.
  logger.emit("debug", "model.response", {
    jobId: "job-a", branchId: "branch-a", candidateId: "candidate-a",
    purpose: "capture", attempt: 2, response: "A".repeat(5_000),
  });
  await logger.flush();

  // Assert: bounded JSON remains useful even when its large body cannot fit.
  const text = await readFile(logger.filePath, "utf8");
  const event = JSON.parse(text.trim());
  assert.ok(Buffer.byteLength(text) <= 512);
  assert.equal(event.truncated, true);
  assert.equal(event.data?.jobId, "job-a");
  assert.equal(event.data?.branchId, "branch-a");
  assert.equal(event.data?.candidateId, "candidate-a");
  assert.equal(event.data?.attempt, 2);
});

test("debug payload strings redact pasted authentication headers", async t => {
  // Arrange: model message bodies often contain text or JSON rather than structured fields.
  const directory = await mkdtemp(join(tmpdir(), "header-payload-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-a", level: "debug" });

  // Act.
  logger.emit("debug", "model.request", { context: { messages: [{ content:
    'Authorization: Basic c3ludGhldGljOmNyZWRlbnRpYWw=\n' +
    '{"Cookie":"session=synthetic-cookie","status":"ok"}',
  }] } });
  await logger.flush();

  // Assert: known authentication formats are redacted even inside transcript text.
  const text = await readFile(logger.filePath, "utf8");
  assert.doesNotMatch(text, /c3ludGhldGljOmNyZWRlbnRpYWw=|synthetic-cookie/);
  assert.match(text, /status/);
});
