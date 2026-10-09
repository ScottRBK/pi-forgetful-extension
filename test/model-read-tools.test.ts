import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { PiMemoryModel, type PiMemoryModelOptions } from "../src/model.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import type { ModelRequest } from "../src/contracts.ts";

type ScriptCall = { name: string; arguments: Record<string, unknown> };

async function fixture(
  t: TestContext,
  calls: Array<ScriptCall | ScriptCall[]>,
  options: PiMemoryModelOptions = {},
) {
  const requests: Array<Record<string, any>> = [];
  const directory = await mkdtemp(join(tmpdir(), "pi-memory-read-tools-"));
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push(JSON.parse(body));
    const attempt = requests.length;
    const call = calls[attempt - 1];
    if (!call) {
      response.writeHead(500).end("Unexpected model completion");
      return;
    }
    const base = { id: `completion-${attempt}`, object: "chat.completion.chunk",
      created: 1, model: "memory" };
    const batch = Array.isArray(call) ? call : [call];
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant",
        tool_calls: batch.map((item, index) => ({
          index, id: Array.isArray(call) ? `read-${attempt}-${index}` : `read-${attempt}`,
          type: "function",
          function: { name: item.name, arguments: JSON.stringify(item.arguments) },
        })),
      }, finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }] },
    ];
    response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
    response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
      "data: [DONE]\n\n");
  });
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
  const runtime = await ModelRuntime.create({
    authPath: join(directory, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  runtime.registerProvider("read-test", {
    api: "openai-completions", apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: [{ id: "memory", name: "memory", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 32_000, maxTokens: 1_200 }],
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "read-test", id: "memory",
  }, options);
  return { requests, directory, model };
}

const submission = {
  name: "submit_result", description: "Submit the evidence-based result.",
  parameters: Type.Object({ answer: Type.String() }, { additionalProperties: false }),
  validate: (input: unknown) => input,
};

test("private memory tools return actual read results before the model submits", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: the real Pi SDK talks to a scripted provider and the read tool reads a real file.
  const { requests, directory, model } = await fixture(t, [
    { name: "inspect_source", arguments: { path: "decision.txt" } },
    { name: "submit_result", arguments: { answer: "Deployment remains pending." } },
  ]);
  await writeFile(join(directory, "decision.txt"), "Decision adopted; deployment pending.");
  const input: ModelRequest = {
    purpose: "capture", policy: "Inspect the evidence and submit.", input: {}, submission,
    readTools: [{
      name: "inspect_source", description: "Read a source file; no writes are available.",
      parameters: Type.Object({ path: Type.String() }, { additionalProperties: false }),
      execute: async (args: unknown) => {
        assert.deepEqual(args, { path: "decision.txt" });
        return { text: await readFile(join(directory, "decision.txt"), "utf8") };
      },
    }],
  };

  // Act.
  const result = await model.complete(input);

  // Assert: actual evidence, not a fabricated success or rejected tool message, reached the model.
  assert.deepEqual(result, { answer: "Deployment remains pending." });
  const advertised = requests[0]?.tools.map((tool: any) => tool.function.name);
  assert.deepEqual(advertised, ["submit_result", "inspect_source"]);
  const feedback = requests[1]?.messages.find((message: any) => message.role === "tool");
  assert.equal(feedback?.tool_call_id, "read-1");
  assert.deepEqual(JSON.parse(feedback.content), {
    text: "Decision adopted; deployment pending.",
  });
});

test("read turns leave all three submission correction attempts available", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: exploration needs more turns than the submission correction budget.
  const { model, requests } = await fixture(t, [
    ...[1, 2, 3, 4].map((id) => ({ name: "read_memory", arguments: { id } })),
    { name: "submit_result", arguments: { answer: 12 } },
    { name: "submit_result", arguments: {} },
    { name: "submit_result", arguments: { answer: "The corrected policy is current." } },
  ]);
  const visited: number[] = [];

  // Act.
  const result = await model.complete({
    purpose: "recall-review", policy: "Read then submit.", input: {}, submission,
    readTools: [{ name: "read_memory", description: "Read the requested stored memory.",
      parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
      execute: async (args) => {
        visited.push((args as { id: number }).id);
        return { content: "Stored policy", linked_memory_ids: [visited.length + 1] };
      } }],
  });

  // Assert.
  assert.deepEqual(visited, [1, 2, 3, 4]);
  assert.deepEqual(result, { answer: "The corrected policy is current." });
  assert.equal(requests.length, 7);
});

test("invalid original read arguments and unavailable writes never execute", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: the provider first sends a write, then a coercible but invalid read argument.
  const { model, requests } = await fixture(t, [
    { name: "write", arguments: { path: "file", content: "bad" } },
    { name: "read_memory", arguments: { id: "42" } },
    { name: "read_memory", arguments: { id: 42 } },
    { name: "submit_result", arguments: { answer: "Supported by memory 42." } },
  ]);
  const executed: unknown[] = [];

  // Act.
  await model.complete({
    purpose: "recall-review", policy: "Read then submit.", input: {}, submission,
    readTools: [{ name: "read_memory", description: "Read a stored memory.",
      parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
      execute: async (args) => { executed.push(args); return { content: "Stored fact" }; } }],
  });

  // Assert: raw arguments were not repaired before dispatch.
  assert.deepEqual(executed, [{ id: 42 }]);
  assert.match(JSON.stringify(requests[1]?.messages), /not found/);
  const rejected = requests[2]?.messages.find((message: any) =>
    message.role === "tool" && message.tool_call_id === "read-2");
  assert.match(rejected?.content ?? "", /integer/);
});

test("source failures return their complete actual detail to the model", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: a failed external read has a diagnostic larger than the UI diagnostic limit.
  const detail = `HTTP 422: ${"field details; ".repeat(100)}ORIGINAL_BODY_END`;
  const { model, requests } = await fixture(t, [
    { name: "inspect_source", arguments: {} },
    { name: "submit_result", arguments: { answer: "Source unavailable; not verified." } },
  ]);

  // Act.
  await model.complete({
    purpose: "capture", policy: "Read then submit.", input: {}, submission,
    readTools: [{ name: "inspect_source", description: "Inspect a source.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async () => { throw new Error(detail); } }],
  });

  // Assert: failures are evidence of failure, not replaced with fabricated source content.
  const feedback = requests[1]?.messages.find((message: any) => message.role === "tool");
  assert.equal(feedback?.content, detail);
});

test("cancellation aborts a private read without accepting a later submission", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: abort while the task is awaiting an actual read capability.
  const { model, requests } = await fixture(t, [
    { name: "read_memory", arguments: {} },
    { name: "submit_result", arguments: { answer: "Must not arrive" } },
  ]);
  const controller = new AbortController();
  let readSignal: AbortSignal | undefined;

  // Act.
  await assert.rejects(model.complete({
    purpose: "recall-review", policy: "Read then submit.", input: {}, submission,
    signal: controller.signal,
    readTools: [{ name: "read_memory", description: "Read a stored memory.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async (_args, signal) => {
        readSignal = signal;
        controller.abort();
        return new Promise(() => {});
      } }],
  }), /aborted/);

  // Assert.
  assert.equal(readSignal?.aborted, true);
  assert.equal(requests.length, 1);
});

async function heldMemoryServer(t: TestContext) {
  const pending = new Map<number, ServerResponse>();
  const arrived: number[] = [];
  const dispatched: number[] = [];
  const cancelled: number[] = [];
  const signals: AbortSignal[] = [];
  const waiters: Array<() => void> = [];
  let peak = 0;
  const server = createServer((request, response) => {
    const id = Number(request.url?.split("/").at(-1));
    arrived.push(id);
    pending.set(id, response);
    peak = Math.max(peak, pending.size);
    response.once("close", () => {
      if (!response.writableEnded) cancelled.push(id);
      pending.delete(id);
      for (const notify of waiters) notify();
    });
    for (const notify of waiters) notify();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  }));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const client = new ApiForgetfulClient({
    baseUrl: `http://127.0.0.1:${address.port}/api/v1`, timeoutMs: 10_000,
    fetchImpl: (url, init) => {
      dispatched.push(Number(String(url).split("/").at(-1)));
      signals.push(init!.signal!);
      return fetch(url, init);
    },
  });
  const waitFor = (condition: () => boolean) => new Promise<void>((resolve) => {
    const check = () => { if (condition()) resolve(); };
    waiters.push(check);
    check();
  });
  return {
    client, arrived, dispatched, cancelled, signals,
    get peak() { return peak; },
    waitForCount: (count: number) => waitFor(() => arrived.length >= count),
    waitForCancelled: (count: number) => waitFor(() => cancelled.length >= count),
    respond(id: number, status = 200, body?: string) {
      const response = pending.get(id)!;
      pending.delete(id);
      response.writeHead(status, { "content-type": "application/json" });
      response.end(body ?? JSON.stringify({
        id, title: `Read ${id}`, content: `Verified fact ${id}.`, context: "Read concurrency",
        keywords: [], tags: [], project_ids: [3], is_obsolete: false,
      }));
    },
  };
}

function memoryRead(client: ApiForgetfulClient): NonNullable<ModelRequest["readTools"]>[number] {
  return {
    name: "read_memory", description: "Read a stored memory.",
    parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
    execute: async (args, signal) => client.get((args as { id: number }).id, signal),
  };
}

async function beforeCompletion(started: Promise<void>, pending: Promise<unknown>) {
  await Promise.race([started, pending.then(() => {
    throw new Error("Model finished before the expected concurrent reads arrived");
  })]);
}

for (const [purpose, readConcurrency, limit] of [
  ["capture", undefined, 1], ["recall-review", 1, 1],
  ["recall-review", 2, 2], ["recall-review", 8, 8],
] as const) {
  test(`${purpose} reads use ${limit} slots and refill without reordering tool results`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: the real Pi SDK receives a multi-tool turn and each read makes a held HTTP request.
    const count = limit + 2;
    const batch = Array.from({ length: count }, (_, index) => ({
      name: "read_memory", arguments: { id: index + 1 },
    }));
    const { model, requests } = await fixture(t, [batch,
      { name: "submit_result", arguments: { answer: "All reads are complete." } }]);
    const http = await heldMemoryServer(t);

    // Act: keep the earliest reads blocked; each freed slot must take the next queued call.
    const controller = new AbortController();
    t.after(() => controller.abort());
    const pending = model.complete({ purpose, policy: "Read then submit.",
      input: {}, submission, readConcurrency, readTools: [memoryRead(http.client)],
      signal: controller.signal });
    await beforeCompletion(http.waitForCount(limit), pending);
    assert.equal(http.dispatched.length, limit);
    for (let id = limit; id < count; id++) {
      http.respond(id);
      await beforeCompletion(http.waitForCount(id + 1), pending);
      assert.equal(requests.length, 1, "review must wait for every read in this batch");
    }
    http.respond(count);
    for (let id = limit - 1; id > 0; id--) http.respond(id);
    const result = await pending;

    // Assert: completion order never changes call/result pairing or the configured ceiling.
    assert.deepEqual(result, { answer: "All reads are complete." });
    assert.equal(http.peak, limit);
    const feedback = requests[1]!.messages.filter((message: any) => message.role === "tool");
    assert.equal(feedback.length, count);
    for (let index = 0; index < count; index++) {
      assert.equal(feedback[index].tool_call_id, `read-1-${index}`);
      assert.equal(JSON.parse(feedback[index].content).id, index + 1);
    }
  });
}

for (const readConcurrency of [0, -1, 9, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  test(`private task rejects invalid read concurrency ${readConcurrency} before provider use`, {
    timeout: 10_000,
  }, async (t) => {
    // Arrange: direct task callers cannot bypass the hard limit enforced by user settings.
    const { model, requests } = await fixture(t, [
      { name: "submit_result", arguments: { answer: "Must not run" } },
    ]);

    // Act/Assert.
    await assert.rejects(model.complete({ purpose: "recall-review", policy: "Submit.",
      input: {}, submission, readConcurrency }), /integer from 1 to 8/);
    assert.equal(requests.length, 0);
  });
}

for (const stop of ["caller", "deadline"] as const) {
  test(`${stop} cancellation aborts concurrent reads and leaves queued reads unstarted`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: two in-flight HTTP reads and one queued tool call in the same model response.
    const { model, requests } = await fixture(t, [[1, 2, 3].map((id) => ({
      name: "read_memory", arguments: { id },
    })), { name: "submit_result", arguments: { answer: "Must not arrive" } }], {
      classificationTimeoutMs: stop === "deadline" ? 1_000 : 5_000,
    });
    const http = await heldMemoryServer(t);
    const controller = new AbortController();
    t.after(() => controller.abort());

    // Act.
    const pending = model.complete({ purpose: "recall-review", policy: "Read then submit.",
      input: {}, submission, readConcurrency: 2, readTools: [memoryRead(http.client)],
      signal: controller.signal });
    const rejected = assert.rejects(pending,
      stop === "caller" ? /aborted/ : /Memory model timeout after 1 second/);
    await beforeCompletion(http.waitForCount(2), pending);
    if (stop === "caller") controller.abort();
    await rejected;
    await http.waitForCancelled(2);

    // Assert: cancellation propagates to every in-flight request, with no third read or model turn.
    assert.deepEqual(http.dispatched, [1, 2]);
    assert.deepEqual(http.cancelled.sort(), [1, 2]);
    assert.ok(http.signals.every((signal) => signal.aborted));
    assert.equal(requests.length, 1);
  });
}

test("a read batch preserves complete errors and validates every call before execution", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: a valid read, invalid uncoerced input, service failure, and another valid read.
  const detail = "HTTP field diagnostic. ".repeat(80) + "COMPLETE_SERVICE_ERROR_END";
  const { model, requests } = await fixture(t, [[
    { name: "read_memory", arguments: { id: 1 } },
    { name: "read_memory", arguments: { id: "2" } },
    { name: "read_memory", arguments: { id: 3 } },
    { name: "read_memory", arguments: { id: 4 } },
  ], { name: "submit_result", arguments: { answer: "Reads 1 and 4 are available." } }]);
  const http = await heldMemoryServer(t);

  // Act: a failed read frees its slot without discarding another read or bypassing validation.
  const pending = model.complete({ purpose: "recall-review", policy: "Read then submit.",
    input: {}, submission, readConcurrency: 2, readTools: [memoryRead(http.client)] });
  await beforeCompletion(http.waitForCount(2), pending);
  assert.deepEqual(http.dispatched, [1, 3]);
  http.respond(3, 503, detail);
  await beforeCompletion(http.waitForCount(3), pending);
  http.respond(4);
  http.respond(1);
  const result = await pending;

  // Assert: failed reads reach the model unchanged in the matching ordered tool results.
  assert.deepEqual(result, { answer: "Reads 1 and 4 are available." });
  assert.deepEqual(http.dispatched, [1, 3, 4]);
  assert.equal(http.peak, 2);
  const feedback = requests[1]!.messages.filter((message: any) => message.role === "tool");
  assert.deepEqual(feedback.map((message: any) => message.tool_call_id),
    ["read-1-0", "read-1-1", "read-1-2", "read-1-3"]);
  assert.equal(JSON.parse(feedback[0].content).id, 1);
  assert.match(feedback[1].content, /integer/);
  assert.ok(feedback[2].content.includes(detail));
  assert.equal(JSON.parse(feedback[3].content).id, 4);
});

test("concurrency never dispatches a mixed read/write tool batch", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: a model attempts to combine a permitted read with an unavailable write.
  const { model, requests } = await fixture(t, [[
    { name: "read_memory", arguments: { id: 1 } },
    { name: "write", arguments: { content: "Must not write" } },
  ], { name: "submit_result", arguments: { answer: "No unsupported operations." } }]);
  const http = await heldMemoryServer(t);

  // Act.
  await model.complete({ purpose: "recall-review", policy: "Read then submit.", input: {},
    submission, readConcurrency: 8, readTools: [memoryRead(http.client)] });

  // Assert: the existing rejection/correction path runs without executing any part of the batch.
  assert.deepEqual(http.dispatched, []);
  assert.match(JSON.stringify(requests[1]!.messages), /not found/);
});

for (const stop of ["caller", "deadline"] as const) {
  test(`${stop} cancellation does not wait for non-cooperative reads or restart their queue`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: real file reads ignore the signal and stay blocked until after task cancellation.
    const { model, requests, directory } = await fixture(t, [[1, 2, 3].map((id) => ({
      name: "read_memory", arguments: { id },
    })), { name: "submit_result", arguments: { answer: "Must not arrive" } }], {
      classificationTimeoutMs: stop === "deadline" ? 1_000 : 5_000,
    });
    await writeFile(join(directory, "1.json"), JSON.stringify({ id: 1, content: "Late fact" }));
    // File 2 is deliberately missing: its late failure must also remain observed.
    const release = new Map<number, () => void>();
    const started: number[] = [];
    const signals: AbortSignal[] = [];
    let notifyStarted!: () => void;
    const bothStarted = new Promise<void>((resolve) => { notifyStarted = resolve; });
    let notifyFinished!: () => void;
    const bothFinished = new Promise<void>((resolve) => { notifyFinished = resolve; });
    let finished = 0;
    let contextRefreshes = 0;
    const controller = new AbortController();
    t.after(() => controller.abort());

    // Act: the model deadline must settle even while neither underlying read has completed.
    const pending = model.complete({ purpose: "recall-review", policy: "Read then submit.",
      input: {}, submission, readConcurrency: 2, signal: controller.signal,
      readBatchContext: () => { contextRefreshes++; return {}; },
      readTools: [{ name: "read_memory", description: "Read a stored record.",
        parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
        execute: async (args, signal) => {
          const id = (args as { id: number }).id;
          started.push(id);
          signals.push(signal);
          await new Promise<void>((resolve) => {
            release.set(id, resolve);
            if (started.length === 2) notifyStarted();
          });
          try { return JSON.parse(await readFile(join(directory, `${id}.json`), "utf8")); }
          finally { if (++finished === 2) notifyFinished(); }
        } }],
    });
    const rejected = assert.rejects(pending,
      stop === "caller" ? /aborted/ : /Memory model timeout after 1 second/);
    await beforeCompletion(bothStarted, pending);
    if (stop === "caller") controller.abort();
    await rejected;
    assert.equal(finished, 0);
    release.get(1)!();
    release.get(2)!();
    await bothFinished;

    // Assert: late success/failure cannot refresh evidence, start the queued third read or submit.
    assert.deepEqual(started, [1, 2]);
    assert.ok(signals.every((signal) => signal.aborted));
    assert.equal(contextRefreshes, 0);
    assert.equal(requests.length, 1);
  });
}
