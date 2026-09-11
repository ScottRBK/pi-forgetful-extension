import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
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
