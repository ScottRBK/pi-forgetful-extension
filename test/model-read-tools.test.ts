import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { PiMemoryModel } from "../src/model.ts";
import type { ModelRequest } from "../src/contracts.ts";

type ScriptCall = { name: string; arguments: Record<string, unknown> };

async function fixture(t: TestContext, calls: ScriptCall[]) {
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
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant", tool_calls: [{
        index: 0, id: `read-${attempt}`, type: "function",
        function: { name: call.name, arguments: JSON.stringify(call.arguments) },
      }] }, finish_reason: null }] },
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
  });
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
