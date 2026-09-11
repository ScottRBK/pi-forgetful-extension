import test from "node:test";
import assert from "node:assert/strict";
import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import {
  PiMemoryModel,
  modelLabel,
  parseModelResponse,
  type ModelRegistryPort,
} from "../src/model.ts";
import type { ModelSubmissionTool } from "../src/contracts.ts";

const selectedModel = {
  provider: "fake",
  id: "memory-model",
} as unknown as Model<any>;

function response(text: string): AssistantMessage {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    api: "openai-completions",
    provider: "fake",
    model: "memory-model",
    usage: {
      input: 1,
      output: 1,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "stop",
    timestamp: Date.now(),
  };
}

function toolResponse(
  calls: Array<{ id: string; name: string; arguments: Record<string, any> }>,
): AssistantMessage {
  return {
    ...response(""),
    content: calls.map((call) => ({ type: "toolCall" as const, ...call })),
    stopReason: "toolUse",
  };
}

function reviewSubmission(
  validate: ModelSubmissionTool["validate"] = (input) => input,
): ModelSubmissionTool {
  return {
    name: "submit_recall_review",
    description: "Submit the reviewed Forgetful recall summary.",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string" },
        memoryIds: { type: "array", items: { type: "integer" } },
        reason: { type: "string" },
      },
      required: ["summary", "memoryIds", "reason"],
      additionalProperties: false,
    },
    validate,
  };
}

test("memory model sends a bounded JSON request and parses a JSON response", async () => {
  const calls: Array<{ systemPrompt?: string; content: unknown }> = [];
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      calls.push({
        systemPrompt: context.systemPrompt,
        content: context.messages[0]?.content,
      });
      return response('```json\n{"search":true,"queries":["auth"]}\n```');
    },
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });

  const result = await model.complete({
    purpose: "classification",
    policy: "Return a bounded plan.",
    input: { prompt: "How did we solve auth?" },
  });

  assert.deepEqual(result, { search: true, queries: ["auth"] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.systemPrompt, "Return a bounded plan.");
  assert.match(String(calls[0]?.content), /How did we solve auth/);
});

test("memory model accepts one valid recall review submission tool call", async () => {
  const contexts: Array<{ tools: unknown; messages: unknown[] }> = [];
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      contexts.push({ tools: context.tools, messages: context.messages });
      return toolResponse([{
        id: "review-1",
        name: "submit_recall_review",
        arguments: {
          summary: "Recall uses a transport port.",
          memoryIds: [11],
          reason: "The memory directly answers the request.",
        },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  const result = await model.complete({
    purpose: "recall-review",
    policy: "Use the tool.",
    input: { availableSources: { memoryIds: [11] } },
    submission: reviewSubmission((input) => ({ accepted: input })),
  });

  assert.equal(contexts.length, 1);
  assert.equal((contexts[0]?.tools as any[])?.[0]?.name, "submit_recall_review");
  assert.deepEqual(result, {
    accepted: {
      summary: "Recall uses a transport port.",
      memoryIds: [11],
      reason: "The memory directly answers the request.",
    },
  });
});

test("memory model sends semantic review rejection as an error tool result", async () => {
  const contexts: Array<{ messages: unknown[] }> = [];
  let attempt = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      contexts.push({ messages: context.messages });
      attempt += 1;
      return toolResponse([{
        id: `review-${attempt}`,
        name: "submit_recall_review",
        arguments: attempt === 1
          ? { summary: "Unsupported claim.", memoryIds: [], reason: "No source." }
          : { summary: "Recall uses a port.", memoryIds: [11], reason: "Selected memory." },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  const result = await model.complete({
    purpose: "recall-review",
    policy: "Use the tool.",
    input: {},
    submission: reviewSubmission((input) => {
      const args = input as { memoryIds?: number[] };
      if (args.memoryIds?.length === 0) throw new Error("summary requires a source");
      return input;
    }),
  });

  assert.deepEqual(result, {
    summary: "Recall uses a port.",
    memoryIds: [11],
    reason: "Selected memory.",
  });
  assert.equal(contexts.length, 2);
  const retryMessages = contexts[1]?.messages as any[];
  assert.equal(retryMessages.at(-1)?.role, "toolResult");
  assert.equal(retryMessages.at(-1)?.toolCallId, "review-1");
  assert.equal(retryMessages.at(-1)?.toolName, "submit_recall_review");
  assert.equal(retryMessages.at(-1)?.isError, true);
  assert.match(retryMessages.at(-1)?.content?.[0]?.text ?? "", /summary requires a source/);
});

test("memory model rejects text-only recall review instead of parsing JSON", async () => {
  const contexts: Array<{ messages: unknown[] }> = [];
  let attempt = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      contexts.push({ messages: context.messages });
      attempt += 1;
      if (attempt === 1) {
        return response('{"summary":"JSON text is not accepted","memoryIds":[11],"reason":"No"}');
      }
      return toolResponse([{
        id: "review-2",
        name: "submit_recall_review",
        arguments: { summary: "Tool summary.", memoryIds: [11], reason: "Tool was used." },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  const result = await model.complete({
    purpose: "recall-review",
    policy: "Use the tool.",
    input: {},
    submission: reviewSubmission(),
  });

  assert.deepEqual(result, {
    summary: "Tool summary.",
    memoryIds: [11],
    reason: "Tool was used.",
  });
  assert.equal(contexts.length, 2);
  const correction = (contexts[1]?.messages as any[]).at(-1);
  assert.equal(correction.role, "user");
  assert.match(correction.content, /submit_recall_review/);
  assert.doesNotMatch(JSON.stringify(contexts), /JSON text is not accepted/);
});

test("memory model rejects multiple and unknown review tool calls before retrying", async () => {
  const contexts: Array<{ messages: unknown[] }> = [];
  let attempt = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      contexts.push({ messages: context.messages });
      attempt += 1;
      if (attempt === 1) {
        return toolResponse([
          { id: "wrong", name: "unknown_review_tool", arguments: {} },
          { id: "extra", name: "submit_recall_review", arguments: {
            summary: "", memoryIds: [], reason: "Empty is okay.",
          } },
        ]);
      }
      return toolResponse([{
        id: "review-2",
        name: "submit_recall_review",
        arguments: { summary: "", memoryIds: [], reason: "No useful source." },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  const result = await model.complete({
    purpose: "recall-review",
    policy: "Use the tool.",
    input: {},
    submission: reviewSubmission(),
  });

  assert.deepEqual(result, { summary: "", memoryIds: [], reason: "No useful source." });
  const retryMessages = contexts[1]?.messages as any[];
  const errors = retryMessages.filter((message) => message.role === "toolResult");
  assert.equal(errors.length, 2);
  assert.ok(errors.every((message) => message.isError === true));
  assert.match(errors.map((message) => message.content[0].text).join("\n"), /exactly one/);
  assert.match(errors.map((message) => message.content[0].text).join("\n"), /unknown_review_tool/);
});

test("memory model bounds recall review submission attempts", async () => {
  let calls = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => {
      calls += 1;
      return toolResponse([{
        id: `review-${calls}`,
        name: "submit_recall_review",
        arguments: { summary: "Unsupported", memoryIds: [], reason: "No source." },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  await assert.rejects(
    model.complete({
      purpose: "recall-review",
      policy: "Use the tool.",
      input: {},
      submission: reviewSubmission(() => {
        throw new Error("summary requires a source");
      }),
    }),
    /Memory model submission failed/,
  );
  assert.equal(calls, 3);
});

test("memory model uses one timeout budget across recall review retries", async () => {
  let calls = 0;
  let retrySignalAborted = false;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, _context, options) => {
      calls += 1;
      if (calls === 1) {
        return toolResponse([{
          id: "review-1",
          name: "submit_recall_review",
          arguments: { summary: "Unsupported", memoryIds: [], reason: "No source." },
        }]);
      }
      return new Promise<AssistantMessage>((resolve, reject) => {
        const fallback = setTimeout(() => resolve(response("{}")), 500);
        options?.signal?.addEventListener("abort", () => {
          clearTimeout(fallback);
          retrySignalAborted = true;
          reject(new Error("Provider aborted"));
        }, { once: true });
      });
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory-model" },
    { classificationTimeoutMs: 50 },
  );

  await assert.rejects(
    model.complete({
      purpose: "recall-review",
      policy: "Use the tool.",
      input: {},
      submission: reviewSubmission(() => {
        throw new Error("summary requires a source");
      }),
    }),
    /Memory model request failed/,
  );
  assert.equal(calls, 2);
  assert.equal(retrySignalAborted, true);
});

test("memory model redacts nested sensitive fields before JSON encoding", async () => {
  let seen = "";
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      seen = String(context.messages[0]?.content);
      return response("{}");
    },
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });
  await model.complete({
    purpose: "capture",
    policy: "policy",
    input: {
      nested: { api_key: "sk-abcdefghijklmnopqrstuvwxyz" },
      text: "safe",
    },
  });
  assert.doesNotMatch(seen, /sk-abcdefghijklmnopqrstuvwxyz/);
  assert.match(seen, /\[redacted\]/);
});

test("memory model fails clearly when the configured model is unavailable", async () => {
  const registry: ModelRegistryPort = {
    find: () => undefined,
    complete: async () => response("unused"),
  };
  const model = new PiMemoryModel(registry, {
    provider: "missing",
    id: "model",
  });

  await assert.rejects(
    model.complete({ purpose: "overlap", policy: "policy", input: {} }),
    /not available/,
  );
});

test("memory model preserves a bounded, redacted provider error for diagnostics", async () => {
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => ({
      ...response(""),
      stopReason: "error",
      errorMessage: `HTTP 429: rate limit; Bearer private-test-token ${"x".repeat(1_000)}`,
    }),
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  await assert.rejects(
    model.complete({ purpose: "classification", policy: "policy", input: {} }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Memory model request failed");
      assert.ok(error.cause instanceof Error);
      assert.match(error.cause.message, /HTTP 429: rate limit/);
      assert.match(error.cause.message, /\[redacted\]/);
      assert.doesNotMatch(error.cause.message, /private-test-token/);
      assert.ok(error.cause.message.length <= 550);
      return true;
    },
  );
});

test("plain model output remains usable when it is not JSON", () => {
  assert.equal(
    parseModelResponse("No memory is relevant."),
    "No memory is relevant.",
  );
  assert.equal(
    modelLabel({ provider: "fake", id: "memory-model" }),
    "fake/memory-model",
  );
});

test("unclosed fenced output stays bounded for a long whitespace run", () => {
  const input = `\`\`\`${" ".repeat(1_200)}x`;
  const started = performance.now();

  const result = parseModelResponse(input);

  const elapsed = performance.now() - started;
  assert.equal(result, input);
  assert.ok(
    elapsed < 100,
    `fenced response parsing took ${elapsed.toFixed(1)} ms`,
  );
});

test("memory model sanitizes the provider input and hides provider error details", async () => {
  let seen = "";
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, context) => {
      seen = String(context.messages[0]?.content);
      throw Object.assign(
        new Error("provider leaked api_key=sk-abcdefghijklmnopqrstuvwxyz"),
        {
          name: "ProviderError",
        },
      );
    },
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });

  await assert.rejects(
    model.complete({
      purpose: "capture",
      policy: "policy",
      input: "api_key=sk-abcdefghijklmnopqrstuvwxyz",
    }),
    (error: Error) => error.message === "Memory model request failed",
  );
  assert.doesNotMatch(seen, /sk-abcdefghijklmnopqrstuvwxyz/);
});

test("memory model sanitizes provider output before structured parsing", async () => {
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () =>
      response('{"content":"api_key=sk-abcdefghijklmnopqrstuvwxyz"}'),
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });
  const result = await model.complete({
    purpose: "capture",
    policy: "policy",
    input: {},
  });
  assert.doesNotMatch(JSON.stringify(result), /sk-abcdefghijklmnopqrstuvwxyz/);
  assert.match(JSON.stringify(result), /\[redacted\]/);
});

test("memory model stops promptly when the caller aborts a non-cooperative provider", async () => {
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => new Promise<AssistantMessage>(() => undefined),
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory-model" },
    { timeoutMs: 500 },
  );
  const controller = new AbortController();
  const started = Date.now();
  const pending = model.complete({
    purpose: "classification",
    policy: "policy",
    input: {},
    signal: controller.signal,
  });
  setTimeout(() => controller.abort(), 10);
  await assert.rejects(pending, /aborted/);
  assert.ok(Date.now() - started < 300);
});

test("memory model rejects oversized structured input before calling the provider", async () => {
  let calls = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => {
      calls += 1;
      return response("{}");
    },
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });
  await assert.rejects(
    model.complete({
      purpose: "capture",
      policy: "policy",
      input: { entries: [{ text: "x".repeat(40_000) }] },
    }),
    /Memory model request failed/,
  );
  assert.equal(calls, 0);
});

test("memory model gives capture requests a longer provider deadline", async () => {
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      return response("{}");
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory-model" },
    { timeoutMs: 10 },
  );

  await assert.doesNotReject(
    model.complete({ purpose: "capture", policy: "policy", input: {} }),
  );
});

test("memory model gives rich capture enough output without enlarging overlap output", async () => {
  const maxTokens: number[] = [];
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, _context, options) => {
      maxTokens.push(options?.maxTokens ?? 0);
      return response("{}");
    },
  };
  const model = new PiMemoryModel(registry, {
    provider: "fake",
    id: "memory-model",
  });

  await model.complete({ purpose: "capture", policy: "policy", input: {} });
  await model.complete({ purpose: "overlap", policy: "policy", input: {} });

  assert.deepEqual(maxTokens, [6_000, 1_200]);
});

test("memory model keeps the capture deadline independent from classification", async () => {
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      return response("{}");
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory-model" },
    { classificationTimeoutMs: 10 },
  );

  await assert.rejects(
    model.complete({ purpose: "classification", policy: "policy", input: {} }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Memory model request failed");
      assert.ok(error.cause instanceof Error);
      assert.equal(error.cause.message, "Memory model timeout");
      return true;
    },
  );
  await assert.doesNotReject(
    model.complete({ purpose: "capture", policy: "policy", input: {} }),
  );
  await assert.doesNotReject(
    model.complete({ purpose: "overlap", policy: "policy", input: {} }),
  );
});

test("memory model passes the real session and public header transform to Pi", async () => {
  let seenOptions: Parameters<NonNullable<ModelRegistryPort["complete"]>>[2];
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    complete: async (_model, _context, options) => {
      seenOptions = options;
      return response("{}");
    },
  };
  const model = new PiMemoryModel(
    registry,
    { provider: "fake", id: "memory-model" },
    {
      sessionId: "pi-session-123",
      transformHeaders: (headers) => ({
        ...headers,
        "x-test-hook": "applied",
      }),
    },
  );

  await model.complete({ purpose: "classification", policy: "policy", input: {} });

  assert.equal(seenOptions?.sessionId, "pi-session-123");
  assert.ok(seenOptions?.transformHeaders);
  assert.deepEqual(
    await seenOptions.transformHeaders({ authorization: "Bearer test" }),
    { authorization: "Bearer test", "x-test-hook": "applied" },
  );
});

test("review correction retains bounded redacted arguments rather than an empty call", async () => {
  // Arrange: a semantic rejection should preserve what failed, without leaking a credential.
  const histories: any[][] = [];
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    async complete(_model, context) {
      histories.push(structuredClone(context.messages));
      return toolResponse([{
        id: `review-${histories.length}`, name: "submit_recall_review",
        arguments: { summary: "Useful fact", memoryIds: [39], reason: "Evidence",
          password: "private-test-password" },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });
  const submission = reviewSubmission((input) => input);
  // Keep the extra field in this schema so the deliberate domain rejection is exercised.
  (submission.parameters as any).additionalProperties = true;
  let validations = 0;
  submission.validate = (input) => {
    if (++validations === 1) throw new Error("Use a more specific useful fact.");
    return input;
  };

  // Act.
  await model.complete({ purpose: "recall-review", policy: "Use the tool", input: {}, submission });

  // Assert.
  const previous = histories[1]?.find((message) => message.role === "assistant");
  assert.equal(previous?.content[0]?.arguments?.summary, "Useful fact");
  assert.deepEqual(previous?.content[0]?.arguments?.memoryIds, [39]);
  assert.doesNotMatch(JSON.stringify(histories[1]), /private-test-password/);
  assert.match(JSON.stringify(histories[1]), /redacted/);
});

test("review rejects oversized provider responses before validation or retry history", async () => {
  // Arrange: a provider can ignore maxTokens, including through unexpected fields.
  let validations = 0;
  let calls = 0;
  const registry: ModelRegistryPort = {
    find: () => selectedModel,
    async complete() {
      calls++;
      return toolResponse([{
        id: "large-review", name: "submit_recall_review",
        arguments: { summary: "x".repeat(33_000), memoryIds: [39], reason: "Evidence" },
      }]);
    },
  };
  const model = new PiMemoryModel(registry, { provider: "fake", id: "memory-model" });

  // Act / Assert.
  await assert.rejects(model.complete({
    purpose: "recall-review", policy: "Use the tool", input: {},
    submission: reviewSubmission((input) => { validations++; return input; }),
  }));
  assert.equal(validations, 0);
  assert.equal(calls, 1);
});
