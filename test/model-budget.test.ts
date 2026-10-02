import test from "node:test";
import assert from "node:assert/strict";
import { estimateTokens } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage, Context, Model, ModelsSimpleStreamOptions } from
  "@earendil-works/pi-ai";
import { Type } from "typebox";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";

const largeOutputModel = {
  provider: "fake",
  id: "large-output",
  contextWindow: 400_000,
  maxTokens: 384_000,
  input: ["text"],
} as Model<any>;

const settings = { enabled: true, reserveTokens: 16_384, keepRecentTokens: 20_000 };

function response(
  text: string,
  stopReason: AssistantMessage["stopReason"] = "stop",
): AssistantMessage {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    api: "fake",
    provider: "fake",
    model: "large-output",
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
    stopReason,
    timestamp: Date.now(),
  };
}

function toolResponse(
  id: string,
  name: string,
  args: Record<string, any>,
): AssistantMessage {
  return { ...response(""), content: [{ type: "toolCall", id, name, arguments: args }],
    stopReason: "toolUse" };
}

function contextTokens(context: Context): number {
  return context.messages.reduce((total, message) => total + estimateTokens(message), 0) +
    estimateTokens({ role: "user", content: context.systemPrompt ?? "", timestamp: 0 }) +
    (context.tools?.length
      ? estimateTokens({ role: "user", content: JSON.stringify(context.tools), timestamp: 0 })
      : 0);
}

function registry(
  model: Model<any>,
  complete: ModelRegistryPort["complete"],
): ModelRegistryPort {
  return { find: () => model, complete };
}

const submission = {
  name: "submit_result",
  description: "Submit the private task result.",
  parameters: Type.Object({ ok: Type.Boolean() }, { additionalProperties: false }),
  validate: (input: unknown) => input,
};

test("default budget caps large-output models for every private purpose", async () => {
  // Arrange: real model catalogs can advertise output larger than the private 100k budget.
  const calls: Array<{ context: Context; options?: ModelsSimpleStreamOptions }> = [];
  const model = new PiMemoryModel(registry(largeOutputModel, async (_model, context, options) => {
    calls.push({ context: structuredClone(context), options });
    return toolResponse("result", "submit_result", { ok: true });
  }), { provider: "fake", id: "large-output" });

  // Act.
  for (const purpose of ["classification", "recall-review", "capture", "overlap"] as const) {
    await model.complete({ purpose, policy: "Submit.", input: { work: purpose }, submission });
  }

  // Assert: provider output is capped before dispatch, not allowed to consume the input budget.
  assert.equal(calls.length, 4);
  for (const call of calls) {
    assert.equal(call.options?.maxTokens, 16_384);
    assert.ok(contextTokens(call.context) + call.options.maxTokens <= 100_000);
  }
});

test("disabled compaction still caps generation before provider dispatch", async () => {
  // Arrange: the input fits; the selected model's raw output allowance does not.
  const maxTokens: number[] = [];
  const model = new PiMemoryModel(registry(largeOutputModel, async (_model, _context, options) => {
    maxTokens.push(options?.maxTokens ?? 0);
    return toolResponse("result", "submit_result", { ok: true });
  }), { provider: "fake", id: "large-output" }, {
    compactionSettings: { ...settings, enabled: false },
  });

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: { ok: true },
    submission });

  // Assert.
  assert.deepEqual(maxTokens, [16_384]);
});

test("small model windows use only the space left by actual provider input", async () => {
  // Arrange: the selected model window, not the configured 100k cap, is the hard limit.
  const small = { ...largeOutputModel, contextWindow: 8_000 } as Model<any>;
  const calls: Array<{ context: Context; maxTokens: number }> = [];
  const model = new PiMemoryModel(registry(small, async (_model, context, options) => {
    calls.push({ context: structuredClone(context), maxTokens: options?.maxTokens ?? 0 });
    return toolResponse("result", "submit_result", { ok: true });
  }), { provider: "fake", id: "large-output" });

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.",
    input: { evidence: "Compact input. ".repeat(500) }, submission });

  // Assert.
  assert.equal(calls.length, 1);
  assert.ok(calls[0]!.maxTokens > 0);
  assert.ok(calls[0]!.maxTokens < 16_384);
  assert.ok(contextTokens(calls[0]!.context) + calls[0]!.maxTokens <= 8_000);
});

test("submission corrections recompute the output cap after feedback grows context", async () => {
  // Arrange: disabled compaction leaves correction history in place; generation must shrink.
  const maxTokens: number[] = [];
  let attempt = 0;
  const selected = { ...largeOutputModel, contextWindow: 100_000,
    maxTokens: 16_384 } as Model<any>;
  const model = new PiMemoryModel(registry(selected, async (_model, _context, options) => {
    maxTokens.push(options?.maxTokens ?? 0);
    attempt++;
    if (attempt === 1) {
      return toolResponse("invalid", "submit_result", { answer: "x".repeat(30_000) });
    }
    return toolResponse("valid", "submit_result", { answer: "ok" });
  }), { provider: "fake", id: "large-output" }, {
    contextLimitTokens: 20_000,
    compactionSettings: { ...settings, enabled: false },
  });

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "Submit.",
    input: { task: "review" }, submission: {
      name: "submit_result",
      description: "Submit a short answer.",
      parameters: Type.Object({ answer: Type.String({ maxLength: 10 }) },
        { additionalProperties: false }),
      validate: input => input,
    } });

  // Assert.
  assert.deepEqual(result, { answer: "ok" });
  assert.equal(maxTokens.length, 2);
  assert.equal(maxTokens[0], 16_384);
  assert.ok(maxTokens[1]! > 0);
  assert.ok(maxTokens[1]! < maxTokens[0]!);
});

test("read continuations recompute the output cap after tool results grow context", async () => {
  // Arrange: a read result is source evidence for the next model turn, so it counts in budget.
  const maxTokens: number[] = [];
  let attempt = 0;
  const selected = { ...largeOutputModel, contextWindow: 100_000,
    maxTokens: 16_384 } as Model<any>;
  const model = new PiMemoryModel(registry(selected, async (_model, _context, options) => {
    maxTokens.push(options?.maxTokens ?? 0);
    if (++attempt === 1) return toolResponse("read-1", "inspect_source", { id: 1 });
    return toolResponse("submit-1", "submit_result", { answer: "ok" });
  }), { provider: "fake", id: "large-output" }, {
    contextLimitTokens: 20_000,
    compactionSettings: { ...settings, enabled: false },
  });

  // Act.
  const result = await model.complete({ purpose: "recall-review", policy: "Submit.",
    input: { task: "review" }, submission: {
      name: "submit_result",
      description: "Submit a short answer.",
      parameters: Type.Object({ answer: Type.String() }, { additionalProperties: false }),
      validate: input => input,
    },
    readTools: [{
      name: "inspect_source",
      description: "Read actual source evidence.",
      parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
      execute: async () => ({ body: "Read evidence. ".repeat(4_000) }),
    }],
  });

  // Assert.
  assert.deepEqual(result, { answer: "ok" });
  assert.equal(maxTokens.length, 2);
  assert.equal(maxTokens[0], 16_384);
  assert.ok(maxTokens[1]! > 0);
  assert.ok(maxTokens[1]! < maxTokens[0]!);
});

test("length-stopped structured outputs remain errors after the cap is applied", async () => {
  // Arrange: the model reaches its capped generation budget before producing a complete schema.
  const maxTokens: number[] = [];
  const model = new PiMemoryModel(registry(largeOutputModel, async (_model, _context, options) => {
    maxTokens.push(options?.maxTokens ?? 0);
    return response('{"answer": "unfinished"', "length");
  }), { provider: "fake", id: "large-output" });

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.",
    input: { task: "review" }, submission: {
      name: "submit_result",
      description: "Submit the answer.",
      parameters: Type.Object({ answer: Type.String() }, { additionalProperties: false }),
      validate: input => input,
    } }), (error: Error) => {
    assert.match(String(error.cause), /length/);
    return true;
  });

  // Assert.
  assert.deepEqual(maxTokens, [16_384]);
});
