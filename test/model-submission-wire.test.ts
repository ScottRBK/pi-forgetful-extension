import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { PiMemoryModel } from "../src/model.ts";

test("real Pi SDK sends rejected submission feedback to the provider and accepts correction", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: only the external model HTTP endpoint is simulated; Pi serializes actual tool turns.
  const requests: Array<Record<string, any>> = [];
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push(JSON.parse(body));
    const attempt = requests.length;
    const args = {
      summary: "Definite failures may retry using current eligible state.",
      memoryIds: attempt === 1 ? [999] : [39],
      reason: "The retry contract is relevant.",
    };
    const base = {
      id: `completion-${attempt}`, object: "chat.completion.chunk", created: 1, model: "memory",
    };
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant", tool_calls: [{
        index: 0, id: `call-${attempt}`, type: "function",
        function: { name: "submit_recall_review", arguments: JSON.stringify(args) },
      }] }, finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
    ];
    response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
    response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
      "data: [DONE]\n\n");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const directory = await mkdtemp(join(tmpdir(), "pi-review-wire-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const runtime = await ModelRuntime.create({
    authPath: join(directory, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  runtime.registerProvider("review-test", {
    api: "openai-completions", apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: [{ id: "memory", name: "memory", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 32_000, maxTokens: 1200 }],
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "review-test", id: "memory",
  });

  // Act: reject a syntactically valid tool call on semantic grounds, then allow its correction.
  const result = await model.complete({
    purpose: "recall-review", policy: "Submit through submit_recall_review.",
    input: { availableSources: { memoryIds: [39] } },
    submission: {
      name: "submit_recall_review", description: "Submit useful historical facts.",
      parameters: { type: "object", additionalProperties: false,
        properties: { summary: { type: "string" },
          memoryIds: { type: "array", items: { type: "integer" } },
          reason: { type: "string" } },
        required: ["summary", "memoryIds", "reason"] },
      validate(input) {
        const args = input as { memoryIds: number[] };
        if (args.memoryIds.some((id) => id !== 39)) {
          throw new Error("memoryIds must contain only IDs in availableSources: 39");
        }
        return input;
      },
    },
  });

  // Assert: error feedback survives real Pi's HTTP serialization with the matching call ID.
  assert.deepEqual(result, {
    summary: "Definite failures may retry using current eligible state.",
    memoryIds: [39], reason: "The retry contract is relevant.",
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[0]?.tools?.[0]?.function?.name, "submit_recall_review");
  const feedback = requests[1]?.messages?.find((message: Record<string, any>) =>
    message.role === "tool");
  assert.equal(feedback?.tool_call_id, "call-1");
  assert.match(JSON.stringify(feedback?.content), /only IDs in availableSources: 39/);
  const previous = requests[1]?.messages?.find((message: Record<string, any>) =>
    message.role === "assistant");
  assert.equal(previous?.tool_calls?.[0]?.id, "call-1");
});

test("memory requests use Pi's configured output allowance for every purpose", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: exercise Pi's registry and provider serialization, not a fake SDK.
  const requests: Array<Record<string, any>> = [];
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push(JSON.parse(body));
    const base = { id: "completion", object: "chat.completion.chunk", created: 1, model: "memory" };
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant", content: "{}" },
        finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {}, finish_reason: "stop" }] },
    ];
    response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
    response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
      "data: [DONE]\n\n");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const directory = await mkdtemp(join(tmpdir(), "pi-budget-wire-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const modelsPath = join(directory, "models.json");
  await writeFile(modelsPath, JSON.stringify({ providers: {
    "budget-test": { modelOverrides: { memory: { maxTokens: 16_384 } } },
  } }));
  const runtime = await ModelRuntime.create({
    authPath: join(directory, "auth.json"), modelsPath, refreshOnCreate: false,
  });
  runtime.registerProvider("budget-test", {
    api: "openai-completions", apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: [{ id: "memory", name: "memory", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200_000, maxTokens: 4_096 }],
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "budget-test", id: "memory",
  });

  // Act: the same configured model serves all four background operations.
  for (const purpose of ["classification", "recall-review", "capture", "overlap"] as const) {
    await model.complete({ purpose, policy: "Return JSON", input: { work: "A decision" } });
  }

  // Assert: no request substitutes an extension-owned output cap.
  assert.equal(requests.length, 4);
  for (const request of requests) {
    assert.equal(request.max_tokens ?? request.max_completion_tokens, 16_384);
  }
});

test("full context reaches Pi and oversized submitted content can be corrected", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: long context and output exceed the old transport-wide character caps.
  const policy = `${"Review policy. ".repeat(3_000)}POLICY_END`;
  const evidence = `${"Historical evidence. ".repeat(3_000)}EVIDENCE_END`;
  const explanation = `${"Review notes. ".repeat(300)}NOTES_END`;
  const requests: Array<Record<string, any>> = [];
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push(JSON.parse(body));
    const attempt = requests.length;
    const summary = attempt === 1 ? "x".repeat(33_000) : "The service recovered after updating.";
    const base = { id: `completion-${attempt}`, object: "chat.completion.chunk",
      created: 1, model: "memory" };
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant", content: explanation,
        tool_calls: [{ index: 0, id: `call-${attempt}`, type: "function",
          function: { name: "submit_recall_review", arguments: JSON.stringify({ summary }) } }],
      }, finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }] },
    ];
    response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
    response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
      "data: [DONE]\n\n");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const directory = await mkdtemp(join(tmpdir(), "pi-full-context-wire-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const runtime = await ModelRuntime.create({
    authPath: join(directory, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  runtime.registerProvider("context-test", {
    api: "openai-completions", apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: [{ id: "memory", name: "memory", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 48_000, maxTokens: 32_768 }],
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "context-test", id: "memory",
  });

  // Act: schema validation, rather than a response-size guard, requests a correction.
  const result = await model.complete({
    purpose: "recall-review", policy, input: { evidence },
    submission: {
      name: "submit_recall_review", description: "Submit a concise summary.",
      parameters: { type: "object", properties: {
        summary: { type: "string", maxLength: 3_000 },
      }, required: ["summary"], additionalProperties: false },
      validate: (input) => input,
    },
  });

  // Assert: full input and rejected output survive; the model receives field-level feedback.
  assert.deepEqual(result, { summary: "The service recovered after updating." });
  assert.equal(requests.length, 2);
  assert.equal(requests[0]?.messages.find((message: any) => message.role === "system").content,
    policy);
  assert.deepEqual(JSON.parse(requests[0]?.messages.find((message: any) =>
    message.role === "user").content), { evidence });
  const feedback = requests[1]?.messages.find((message: any) => message.role === "tool");
  assert.equal(feedback?.tool_call_id, "call-1");
  assert.match(JSON.stringify(feedback?.content), /summary/);
  assert.match(JSON.stringify(feedback?.content), /3000/);
  const rejected = requests[1]?.messages.find((message: any) => message.role === "assistant");
  assert.equal(JSON.parse(rejected?.tool_calls[0].function.arguments).summary.length, 33_000);
  assert.equal(rejected?.content, explanation);
  const allowances = requests.map((request) => request.max_tokens ?? request.max_completion_tokens);
  assert.deepEqual(allowances, [32_768, 32_768],
    "initial and correction requests use the configured model allowance");
});
