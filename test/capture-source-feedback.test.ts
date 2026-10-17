import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type RequestListener } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import type { AssistantMessage, Context, Model } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";

async function fixture(t: TestContext, options: {
  source: RequestListener;
  input?: Record<string, unknown>;
  beforeInspection?: () => void;
  canReadNow?: () => boolean;
  isEnabled?: () => boolean;
}) {
  const directory = await mkdtemp(join(tmpdir(), "capture-source-feedback-"));
  const server = createServer(options.source);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
    await rm(directory, { recursive: true, force: true });
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/source`;
  const queue = new DurableQueueStore({ directory: join(directory, "queue"), instanceId: "test" });
  const contexts: Context[] = [];
  const saved: CaptureSnapshot[] = [];
  let jobId: string;
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 2_000,
      contextWindow: 100_000, input: ["text"] }) as Model<any>,
    complete: async (_model, context) => {
      contexts.push(structuredClone(context));
      saved.push((await queue.getJob(jobId))!.snapshot);
      const first = contexts.length === 1;
      if (first) options.beforeInspection?.();
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: `call-${contexts.length}`,
          name: first ? "inspect_source" : "submit_capture_candidates",
          arguments: first ? options.input ?? { url } : { candidates: [] } }],
        stopReason: "toolUse", timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      } as AssistantMessage;
    },
  }, { provider: "test", id: "memory" });
  const capture = new CaptureService({ queue, model, instanceId: "test",
    client: new ApiForgetfulClient({ baseUrl: url }),
    canReadNow: options.canReadNow, isEnabled: options.isEnabled });
  const snapshot: CaptureSnapshot = { id: "source", instanceId: "test", mode: "auto",
    scope: "project", policy: "", modelVersion: "test", finalEntryId: "user",
    createdAt: new Date().toISOString(),
    context: { cwd: directory, project: { id: 7, name: "Source" },
      sessionId: "source", branchId: "main" },
    entries: [{ id: "user", role: "user", text: "Check the source before saving any facts." }] };
  jobId = (await capture.enqueue(snapshot)).jobId;
  return { capture, queue, jobId, contexts, saved, url, directory };
}

test("source HTTP failure reaches the private model as a complete structured error", async (t) => {
  // Arrange: real source HTTP, queue and capture/model services; only provider replies scripted.
  const body = "Diagnostic field detail; ".repeat(100) + "ORIGINAL_BODY_END";
  const state = await fixture(t, { source: (_request, response) => {
    response.writeHead(503, "Source unavailable", { "content-type": "text/plain" }).end(body);
  } });

  // Act.
  const outcome = await state.capture.checkpoint();

  // Assert: the outer tool flag agrees with the durable observation, without summarizing its body.
  assert.deepEqual(outcome.errors, []);
  const feedback = state.contexts[1]?.messages.find((message) => message.role === "toolResult");
  assert.ok(feedback?.role === "toolResult");
  assert.equal(feedback.isError, true);
  assert.equal(feedback.toolCallId, "call-1");
  const content = feedback.content[0];
  assert.equal(content.type, "text");
  assert.ok(content.type === "text");
  const payload = JSON.parse(content.text);
  assert.equal(payload.result.status, "error");
  assert.equal(payload.result.httpStatus, 503);
  assert.equal(payload.result.httpStatusText, "Source unavailable");
  assert.equal(payload.result.source_url, state.url);
  assert.equal(payload.result.body, body);
  assert.deepEqual(payload.result.error, { name: "HttpError", message: "Source unavailable" });
  assert.match(payload.result.observedAt, /^\d{4}-/);
  assert.equal(payload.evidenceEntry.isError, true);
  const evidence = state.saved[1]?.entries.find((entry) => entry.id === payload.evidenceEntry.id);
  assert.ok(evidence);
  assert.equal(evidence.toolName, "inspect_source");
  assert.equal(evidence.isError, true);
  assert.deepEqual(JSON.parse(evidence.text), payload.result);
});

for (const when of ["before dispatch", "during the read"] as const) {
  test(`source permission revoked ${when} pauses without inspection evidence`, async (t) => {
    // Arrange: revoke at the provider boundary or once the real HTTP source receives the read.
    let allowed = true;
    let sourceReads = 0;
    const state = await fixture(t, {
      canReadNow: () => allowed,
      beforeInspection: () => { if (when === "before dispatch") allowed = false; },
      source: (_request, response) => {
        sourceReads++;
        allowed = false;
        response.end("Content that is no longer authorized for capture.");
      },
    });

    // Act.
    const result = await state.capture.checkpoint();
    const reopened = new DurableQueueStore({ directory: join(state.directory, "queue"),
      instanceId: "test" });
    const job = await reopened.getJob(state.jobId);

    // Assert: the pause crosses PiMemoryModel, stops further model turns and keeps only originals.
    assert.equal(job?.status, "paused");
    assert.equal(result.paused, true);
    assert.match(result.errors.join("\n"), /reads disabled|revoked/);
    assert.equal(job.attempts, 1);
    assert.equal(state.contexts.length, 1);
    assert.equal(sourceReads, when === "before dispatch" ? 0 : 1);
    assert.deepEqual(job.snapshot.entries, state.saved[0]?.entries);
    assert.doesNotMatch(JSON.stringify(job.snapshot), /inspection:|no longer authorized/);
  });
}

test("permission loss pauses even if trust returns before the read finishes", async (t) => {
  // Arrange: the source read observes revocation; a later trust change cannot authorize its bytes.
  let allowed = true;
  const state = await fixture(t, {
    canReadNow: () => {
      if (!allowed) queueMicrotask(() => { allowed = true; });
      return allowed;
    },
    source: (_request, response) => {
      allowed = false;
      response.end("Revoked source bytes");
    },
  });

  // Act.
  const result = await state.capture.checkpoint();
  const job = await state.queue.getJob(state.jobId);

  // Assert: never persist a permission error as evidence or continue that private task.
  assert.equal(result.paused, true);
  assert.equal(job?.status, "paused");
  assert.equal(state.contexts.length, 1);
  assert.deepEqual(job.snapshot.entries, state.saved[0]?.entries);
});

test("missing source files retain their structured OS error and evidence reference", async (t) => {
  // Arrange.
  const state = await fixture(t, { input: { path: "missing.txt" },
    source: (_request, response) => response.writeHead(500).end("Unexpected request") });

  // Act.
  const result = await state.capture.checkpoint();

  // Assert.
  assert.deepEqual(result.errors, []);
  const feedback = state.contexts[1]?.messages.find((message) => message.role === "toolResult");
  assert.ok(feedback?.role === "toolResult");
  assert.equal(feedback.isError, true);
  const content = feedback.content[0];
  assert.ok(content.type === "text");
  const payload = JSON.parse(content.text);
  assert.equal(payload.result.error.name, "Error");
  assert.equal(payload.result.error.code, "ENOENT");
  assert.match(payload.result.error.message, /no such file or directory.*missing\.txt/);
  assert.ok(state.saved[1]?.entries.some((entry) => entry.id === payload.evidenceEntry.id &&
    entry.isError === true && entry.text === JSON.stringify(payload.result)));
});

test("source content that describes errors remains a successful observation", async (t) => {
  // Arrange: arbitrary source JSON never controls the outer tool's error flag.
  const text = '{"status":"error","isError":true,"error":"Application diagnostic"}';
  const state = await fixture(t, { input: { path: "diagnostic.json" },
    source: (_request, response) => response.writeHead(500).end("Unexpected request") });
  await writeFile(join(state.directory, "diagnostic.json"), text);

  // Act.
  const result = await state.capture.checkpoint();

  // Assert: provenance failure in a non-Git directory also leaves the successful bytes available.
  assert.deepEqual(result.errors, []);
  const feedback = state.contexts[1]?.messages.find((message) => message.role === "toolResult");
  assert.ok(feedback?.role === "toolResult");
  assert.equal(feedback.isError, false);
  const content = feedback.content[0];
  assert.ok(content.type === "text");
  const payload = JSON.parse(content.text);
  assert.equal(payload.result.status, "ok");
  assert.equal(payload.result.content, text);
  assert.equal(payload.result.provenanceError.code, "ENOENT");
  assert.equal(payload.evidenceEntry.isError, false);
  assert.ok(state.saved[1]?.entries.some((entry) => entry.id === payload.evidenceEntry.id &&
    entry.isError === false));
});

for (const when of ["before dispatch", "during the read"] as const) {
  test(`capture disabled ${when} still pauses without source evidence`, async (t) => {
    // Arrange: settings permission is independent of the synchronous trust permission.
    let enabled = true;
    let sourceReads = 0;
    const state = await fixture(t, {
      isEnabled: () => enabled,
      beforeInspection: () => { if (when === "before dispatch") enabled = false; },
      source: (_request, response) => {
        sourceReads++;
        enabled = false;
        response.end("Disabled capture must not retain this source.");
      },
    });

    // Act.
    const result = await state.capture.checkpoint();
    const job = await state.queue.getJob(state.jobId);

    // Assert.
    assert.equal(result.paused, true);
    assert.equal(job?.status, "paused");
    assert.equal(job.attempts, 1);
    assert.equal(state.contexts.length, 1);
    assert.equal(sourceReads, when === "before dispatch" ? 0 : 1);
    assert.deepEqual(job.snapshot.entries, state.saved[0]?.entries);
  });
}

test("stopping capture aborts an in-flight source read without saving evidence", {
  timeout: 5_000,
}, async (t) => {
  // Arrange: leave a real HTTP body open until cancellation closes the connection.
  let started!: () => void;
  const reading = new Promise<void>((resolve) => { started = resolve; });
  let closed!: () => void;
  const disconnected = new Promise<void>((resolve) => { closed = resolve; });
  const state = await fixture(t, { source: (_request, response) => {
    response.once("close", closed);
    response.writeHead(200).write("Partial source content");
    started();
  } });

  // Act.
  const pending = state.capture.checkpoint();
  await reading;
  state.capture.stop();
  const result = await pending;
  await disconnected;
  const job = await state.queue.getJob(state.jobId);

  // Assert: ordinary lifecycle cancellation keeps its existing zero-attempt retry semantics.
  assert.equal(result.paused, true);
  assert.deepEqual(result.errors, []);
  assert.equal(job?.status, "paused");
  assert.equal(job.attempts, 0);
  assert.equal(state.contexts.length, 1);
  assert.deepEqual(job.snapshot.entries, state.saved[0]?.entries);
});
