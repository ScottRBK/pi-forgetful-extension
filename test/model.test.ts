import test from "node:test";
import assert from "node:assert/strict";
import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import {
  PiMemoryModel,
  modelLabel,
  parseModelResponse,
  type ModelRegistryPort,
} from "../src/model.ts";

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
