import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer, type IncomingHttpHeaders } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { Context, Message } from "@earendil-works/pi-ai";
import { PiMemoryModel, type PiMemoryModelOptions } from "../src/model.ts";
import * as memoryContext from "../src/model-context.ts";
import type { CaptureSnapshot, CompactedConversation, ModelRequest } from "../src/contracts.ts";
import { DurableQueueStore } from "../src/queue.ts";

type WireRequest = {
  messages: Array<{ role: string; tool_call_id?: string;
    content?: string | Array<{ type: string; text?: string;
      image_url?: { url: string } }> | null;
    tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> }>;
  tools?: Array<{ function: { name: string } }>;
  max_tokens?: number;
  max_completion_tokens?: number;
};
type ToolReply = { name: string; arguments: unknown };
type Reply = string | ToolReply | ToolReply[] | { status: number; body: string };

function messageText(message: WireRequest["messages"][number]): string {
  return typeof message.content === "string" ? message.content :
    message.content?.map((part) => part.text ?? "").join("\n") ?? "";
}

async function fixture(
  t: TestContext,
  script: (request: WireRequest, index: number) => Reply | Promise<Reply>,
  options: PiMemoryModelOptions = {},
  selection = "large",
) {
  const requests: WireRequest[] = [];
  const headers: IncomingHttpHeaders[] = [];
  const directory = await mkdtemp(join(tmpdir(), "pi-memory-context-"));
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    const input = JSON.parse(body) as WireRequest;
    requests.push(input);
    headers.push(request.headers);
    const index = requests.length;
    const reply = await script(input, index);
    if (typeof reply !== "string" && "status" in reply) {
      response.writeHead(reply.status, { connection: "close" }).end(reply.body);
      return;
    }
    const base = { id: `completion-${index}`, object: "chat.completion.chunk",
      created: 1, model: selection };
    const delta = typeof reply === "string" ? { content: reply } : {
      tool_calls: (Array.isArray(reply) ? reply : [reply]).map((call, callIndex) => ({
        index: callIndex, id: Array.isArray(reply) ? `call-${index}-${callIndex}` : `call-${index}`,
        type: "function", function: { name: call.name, arguments: JSON.stringify(call.arguments) },
      })),
    };
    const chunks = [
      { ...base, choices: [{ index: 0, delta: { role: "assistant", ...delta },
        finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {},
        finish_reason: typeof reply === "string" ? "stop" : "tool_calls" }] },
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
  runtime.registerProvider("opencode", {
    api: "openai-completions", apiKey: "isolated-context-key",
    headers: { "x-configured-header": "configured" },
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: ["small", "large", "vision", "huge"].map((id) => ({
      id, name: id, reasoning: false,
      input: (id === "vision" ? ["text", "image"] : ["text"]) as ("text" | "image")[],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: id === "huge" ? 200_000 : id === "large" ? 64_000 : 8_000,
      maxTokens: 1_000,
    })),
  });
  const registry = new ModelRegistry(runtime);
  const selected = registry.find("opencode", selection)!;
  const model = new PiMemoryModel(registry, {
    provider: "opencode", id: selection,
  }, options);
  return { model, requests, headers, registry, selected, directory };
}

const submission = {
  name: "submit_result", description: "Submit the evidenced result.",
  parameters: Type.Object({ answer: Type.String() }, { additionalProperties: false }),
  validate: (input: unknown) => input,
};
const accepted: Reply = { name: "submit_result", arguments: { answer: "Recorded." } };

const settings = { enabled: true, reserveTokens: 1_200, keepRecentTokens: 1_200 };

for (const purpose of ["classification", "recall-review", "capture", "overlap"] as const) {
  test(`configured cap compacts ${purpose} below the actual model window`, async t => {
    // Arrange: all evidence fits the provider window but exceeds the private 8000 token cap.
    const { model, requests } = await fixture(t, request => request.tools?.length
      ? accepted : "Summary preserving source IDs.", {
      contextLimitTokens: 8_000, compactionSettings: settings,
    });

    // Act.
    await model.complete({ purpose, policy: "CURRENT_POLICY", input: "CURRENT_TASK",
      conversation: longConversation(), submission });

    // Assert: private summaries are used even on the large selected model.
    assert.ok(requests.length > 1);
    assert.ok(!requests[0]!.tools?.length);
    assert.match(JSON.stringify(requests.at(-1)), /CURRENT_TASK/);
  });
}

test("callers without Pi settings still enforce the default 100000 token cap", async t => {
  // Arrange: individually small records exceed the cap but fit this provider's 200k window.
  const { model, requests } = await fixture(t, request => request.tools?.length
    ? accepted : "Processed evidence summary.", {}, "huge");
  const conversation = Array.from({ length: 150 }, (_, id) => ({
    id, text: "Evidence details. ".repeat(200),
  }));

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation, submission });

  // Assert.
  assert.ok(requests.length > 1);
  assert.ok(!requests[0]!.tools?.length);
  assert.ok(requests.at(-1)!.tools?.length);
});

test("disabled compaction caps output when the input still fits", async t => {
  // Arrange: message input fits; the selected model's full output allowance would not.
  const { model, requests } = await fixture(t, () => accepted, {
    contextLimitTokens: 8_000, compactionSettings: { ...settings, enabled: false },
  });

  // Act.
  await model.complete({ purpose: "overlap", policy: "p".repeat(12_000),
    input: "t".repeat(12_000), submission: { ...submission,
      description: "s".repeat(4_000) } });

  // Assert.
  assert.equal(requests.length, 1);
  const allowance = requests[0]!.max_tokens ?? requests[0]!.max_completion_tokens;
  assert.ok(typeof allowance === "number");
  assert.ok(allowance < 1_000);
});
const image = { type: "image", mimeType: "image/png",
  data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aHhQ" +
    "AAAAASUVORK5CYII=" };

function imageRecord() {
  return { type: "message", id: "screenshot-record", parentId: "inspect-call",
    timestamp: "2026-09-26T09:00:00.000Z", message: {
      role: "toolResult", toolCallId: "screenshot-call", toolName: "inspect_screenshot",
      isError: false, content: [{ type: "text", text: "Visual source evidence." }, image],
    } };
}

function longConversation() {
  return Array.from({ length: 18 }, (_, index) => ({
    id: `record-${index}`, role: "toolResult", toolCallId: `operation-${index}`,
    toolName: "inspect_source", isError: index === 0,
    text: `BEGIN_${index} ${"Evidence details. ".repeat(180)} END_${index}`,
  }));
}

test("all ordered conversation records reach the private task separately from instructions", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: old evidence, failed tools and more than 100 entries all belong to this task.
  const conversation = [
    { id: "before-watermark", role: "user", text: "Original user decision." },
    { id: "attempt", role: "assistant", content: [{ type: "toolCall", id: "edit-1",
      name: "edit", arguments: { path: "src/decision.ts", oldText: "old", newText: "new" } }] },
    { id: "failure", role: "toolResult", toolCallId: "edit-1", toolName: "edit",
      isError: true, text: `${"Full failure detail. ".repeat(200)}FAILURE_BODY_END` },
    ...Array.from({ length: 130 }, (_, index) => ({
      id: `entry-${index}`, role: index % 2 ? "assistant" : "user", text: `Evidence ${index}.`,
    })),
  ];
  const original = structuredClone(conversation);
  const { model, requests } = await fixture(t, () => accepted);

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "CURRENT_POLICY",
    input: { task: "CURRENT_TASK", afterEntryId: "entry-100" }, conversation, submission });

  // Assert: each full original record occurs in its own labelled, ordered evidence message.
  assert.deepEqual(result, { answer: "Recorded." });
  const messages = requests[0]!.messages;
  const evidence = messages.filter((message) => messageText(message).includes("Historical record"));
  assert.equal(evidence.length, 133);
  for (const [index, record] of conversation.entries()) {
    assert.ok(messageText(evidence[index]!).includes(JSON.stringify(record)));
  }
  assert.match(JSON.stringify(messages), /CURRENT_POLICY/);
  assert.match(messageText(messages.at(-1)!), /CURRENT_TASK/);
  assert.deepEqual(conversation, original);
});

test("selected model compacts complete labelled evidence through Pi with auth and task intact", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: aggregate history exceeds the smaller model; each original record fits individually.
  const conversation = longConversation();
  const events: Array<{ event: string; data?: Record<string, unknown> }> = [];
  const { model, requests, headers } = await fixture(t, (request) =>
    request.tools?.length ? accepted : "Historical summary retaining source IDs and uncertainty.", {
    compactionSettings: settings,
    sessionId: "context-session",
    transformHeaders: (value) => ({ ...value, "x-private-task": "memory" }),
    logger: { emit: (_level, event, data) => { events.push({ event, data }); },
      flush: async () => {} },
  }, "small");

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "CURRENT_POLICY",
    input: { task: "CURRENT_TASK" }, conversation, submission });

  // Assert: compaction precedes the task and every source record reaches a model without clipping.
  assert.deepEqual(result, { answer: "Recorded." });
  assert.ok(requests.length > 1);
  assert.equal(requests[0]!.tools?.length ?? 0, 0);
  const received = requests.map((request) => JSON.stringify(request)).join("\n");
  let position = -1;
  for (let index = 0; index < 18; index++) {
    const next = received.indexOf(`BEGIN_${index} `, position + 1);
    assert.ok(next > position, `record ${index} arrived in order`);
    assert.ok(received.includes(` END_${index}`), `record ${index} tail survived`);
    position = next;
  }
  const summaryInput = JSON.stringify(requests[0]);
  assert.match(summaryInput, /record-0/);
  assert.match(summaryInput, /operation-0/);
  assert.match(summaryInput, /isError\\":true/);
  assert.match(summaryInput, /END_0/);
  const task = requests.at(-1)!;
  assert.match(JSON.stringify(task.messages), /CURRENT_POLICY/);
  assert.match(JSON.stringify(task.messages), /CURRENT_TASK/);
  assert.equal(task.tools?.[0]?.function.name, "submit_result");
  for (const header of headers) {
    assert.equal(header.authorization, "Bearer isolated-context-key");
    assert.equal(header["x-configured-header"], "configured");
    assert.equal(header["x-private-task"], "memory");
    assert.equal(header["x-opencode-session"], "context-session");
  }
  assert.equal(requests[0]!.max_tokens ?? requests[0]!.max_completion_tokens, 750);
  assert.equal(task.max_tokens ?? task.max_completion_tokens, 1_000);
  const attempts = events.filter((entry) => entry.event === "model.attempt");
  assert.equal(attempts.length, requests.length);
  assert.equal(attempts.filter((entry) => entry.data?.kind === "compaction").length,
    requests.length - 1);
  assert.deepEqual(attempts.map((entry) => entry.data?.call),
    requests.map((_request, index) => index + 1));
  const totals = events.find((entry) => entry.event === "model.calls")?.data;
  assert.equal(totals?.providerCalls, requests.length);
  assert.equal(totals?.compactionCalls, requests.length - 1);
});

test("the larger selected model admits the same full history without a summary", async (t) => {
  // Arrange: the same Pi settings and records fit the selected larger context window.
  const { model, requests } = await fixture(t, () => accepted, {
    compactionSettings: settings,
  });

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation(), submission });

  // Assert.
  assert.equal(requests.length, 1);
  assert.match(JSON.stringify(requests[0]), /BEGIN_0 /);
  assert.match(JSON.stringify(requests[0]), / END_17/);
});

test("Pi's reserve setting triggers compaction before the provider window is full", async (t) => {
  // Arrange: this same history passes the disabled test, including its output allowance.
  const { model, requests } = await fixture(t, (request) =>
    request.tools?.length ? accepted : "Earlier source evidence.", {
    compactionSettings: { ...settings, reserveTokens: 2_500 },
  }, "small");

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation().slice(0, 8), submission });

  // Assert: enabled Pi settings, not a fixed entry count or overflowing HTTP call, trigger summary.
  assert.ok(requests.length > 1);
  assert.equal(requests[0]!.tools?.length ?? 0, 0);
  assert.equal(requests.at(-1)!.tools?.[0]?.function.name, "submit_result");
});

test("disabled compaction makes no summary above Pi's configured threshold", async (t) => {
  // Arrange: history exceeds the configured threshold but still fits with the output allowance.
  const { model, requests } = await fixture(t, () => accepted, {
    compactionSettings: { ...settings, reserveTokens: 2_500, enabled: false },
  }, "small");

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation().slice(0, 8), submission });

  // Assert.
  assert.equal(requests.length, 1);
  assert.equal(requests[0]!.tools?.[0]?.function.name, "submit_result");
  assert.match(JSON.stringify(requests[0]), / END_7/);
});

test("read continuations compact complete outcomes and keep the task and correction budget", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: growing read results cross the window only after the initial task call.
  let taskCalls = 0;
  const { model, requests } = await fixture(t, (request) => {
    if (!request.tools?.length) return "Prior investigations, including a failed read.";
    taskCalls++;
    if (taskCalls <= 6) return { name: "inspect_source", arguments: { id: taskCalls } };
    if (taskCalls === 7) return { name: "submit_result", arguments: { answer: 5 } };
    if (taskCalls === 8) return { name: "submit_result", arguments: {} };
    return accepted;
  }, { compactionSettings: settings }, "small");
  const inspected: number[] = [];
  let savedHistory = 0;

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "CURRENT_POLICY",
    input: { task: "CURRENT_TASK" }, submission,
    onConversationCompacted: async () => { savedHistory++; },
    readTools: [{ name: "inspect_source", description: "Read actual source evidence.",
      parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
      execute: async (input) => {
        const { id } = input as { id: number };
        inspected.push(id);
        const body = `${"Actual diagnostic detail. ".repeat(200)}READ_BODY_END_${id}`;
        if (id === 1) throw new Error(`HTTP 422: ${body}`);
        return { id, body };
      } }],
  }).catch((error: Error) => { assert.fail(`${error.message}: ${String(error.cause)}`); });

  // Assert: all reads, then the third submission, succeed within a single task.
  assert.deepEqual(result, { answer: "Recorded." });
  assert.deepEqual(inspected, [1, 2, 3, 4, 5, 6]);
  assert.equal(taskCalls, 9);
  assert.equal(savedHistory, 0, "private investigation summaries must not become reusable history");
  const summaries = requests.filter((request) => !request.tools?.length);
  assert.ok(summaries.length > 0);
  const firstSummary = summaries[0]!.messages.map(messageText).join("\n");
  assert.match(firstSummary, /"toolCallId":"call-1"/);
  assert.match(firstSummary, /"isError":true/);
  assert.match(firstSummary, /READ_BODY_END_1/);
  assert.match(firstSummary, /"arguments":\{"id":1\}/);
  for (const request of requests.filter((value) => value.tools?.length)) {
    assert.match(JSON.stringify(request.messages), /CURRENT_TASK/);
    assert.match(JSON.stringify(request.messages), /CURRENT_POLICY/);
    assert.deepEqual(request.tools!.map((tool) => tool.function.name),
      ["submit_result", "inspect_source"]);
  }
});

for (const readConcurrency of [1, 2]) {
  test(`compaction keeps fresh reads and their source snapshot at concurrency ${readConcurrency}`, {
    timeout: 10_000,
  }, async (t) => {
    // Arrange: the history fits initially; a new read batch forces compaction before review.
    let taskCalls = 0;
    const bodies = [1, 2].map(id => `${"Complete read evidence. ".repeat(240)}READ_BODY_END_${id}`);
    const snapshot = { availableSources: { memoryIds: [2] } };
    const { model, requests } = await fixture(t, (request) => {
      if (!request.tools?.length) return "Summary of older historical evidence.";
      if (++taskCalls === 1) return [1, 2].map(id => ({
        name: "inspect_source", arguments: { id },
      }));
      return accepted;
    }, { compactionSettings: settings }, "small");

    // Act: one read fails; both complete outcomes and the snapshot belong to the retained tail.
    const result = await model.complete({ purpose: "recall-review", policy: "CURRENT_POLICY",
      input: { task: "CURRENT_TASK" }, conversation: longConversation().slice(0, 7), submission,
      readConcurrency, readBatchContext: () => snapshot,
      readTools: [{ name: "inspect_source", description: "Read source evidence.",
        parameters: Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
        execute: async (input) => {
          const { id } = input as { id: number };
          if (id === 1) throw new Error(`HTTP 503: ${bodies[0]}`);
          return { id, body: bodies[1] };
        } }],
    });

    // Assert: compaction summarises only older records, not evidence awaiting its first review.
    assert.deepEqual(result, { answer: "Recorded." });
    assert.equal(taskCalls, 2);
    assert.ok(requests[0]!.tools?.length, "the initial history must fit without compaction");
    const summaries = requests.filter(request => !request.tools?.length);
    assert.ok(summaries.length > 0, "compaction must run after the read batch");
    const review = requests.at(-1)!;
    const results = review.messages.filter(message => message.role === "tool");
    assert.equal(results.length, 2, "both fresh results must reach the reviewer verbatim");
    assert.equal(messageText(results[0]!), `HTTP 503: ${bodies[0]}`);
    assert.deepEqual(JSON.parse(messageText(results[1]!)), { id: 2, body: bodies[1] });
    const calls = review.messages.flatMap(message => message.tool_calls ?? []);
    assert.deepEqual(calls.map(call => call.id), results.map(message => message.tool_call_id));
    assert.deepEqual(calls.map(call => JSON.parse(call.function.arguments)),
      [{ id: 1 }, { id: 2 }]);
    assert.equal(review.messages.at(-1)!.role, "user");
    assert.deepEqual(JSON.parse(messageText(review.messages.at(-1)!)), snapshot);
    assert.match(review.messages.map(messageText).join("\n"), /CURRENT_TASK/);
    assert.match(review.messages.map(messageText).join("\n"), /CURRENT_POLICY/);
    for (const summary of summaries) {
      assert.doesNotMatch(summary.messages.map(messageText).join("\n"), /READ_BODY_END_/);
    }
  });
}

test("cancelling compaction aborts the task before any submission request", async (t) => {
  // Arrange: abort only once the real provider receives the summary request.
  const controller = new AbortController();
  const { model, requests } = await fixture(t, () => {
    controller.abort();
    return "Late summary must not be accepted.";
  }, { compactionSettings: settings }, "small");

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation(), submission, signal: controller.signal }), /aborted/);

  // Assert.
  assert.equal(requests.length, 1);
  assert.equal(requests[0]!.tools?.length ?? 0, 0);
});

test("successive summaries share the classification deadline", { timeout: 10_000 }, async (t) => {
  // Arrange: each call fits separately; two sequential calls cannot fit the shared deadline.
  const { model, requests } = await fixture(t, async () => {
    await delay(650, undefined, { ref: false });
    return "Small summary.";
  }, { compactionSettings: settings, classificationTimeoutMs: 1_000 }, "small");
  const started = performance.now();

  // Act.
  await assert.rejects(model.complete({ purpose: "classification", policy: "Classify.", input: {},
    conversation: longConversation(), submission }), (error: Error) => {
    assert.match(String(error.cause), /timeout/);
    return true;
  });

  // Assert: no fresh deadline was created for the second summary or the final task.
  assert.equal(requests.length, 2);
  assert.ok(performance.now() - started < 1_500);
});

test("an oversized record fails without clipping or provider calls", async (t) => {
  // Arrange: Pi's whole-entry cut cannot make this one source record fit.
  const events: Array<{ event: string; data?: Record<string, unknown> }> = [];
  const { model, requests } = await fixture(t, () => accepted, {
    compactionSettings: settings,
    logger: { emit: (_level, event, data) => { events.push({ event, data }); },
      flush: async () => {} },
  }, "small");

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: [{ id: "oversized", text: "Long source record. ".repeat(10_000) }],
    submission }), (error: Error) => {
    assert.match(String(error.cause), /cannot fit/);
    assert.match(String(error.cause), /No conversation record was clipped/);
    return true;
  });

  // Assert: failure detail reaches diagnostics, with no invented successful submission.
  assert.equal(requests.length, 0);
  const detail = events.find((entry) => entry.event === "model.error_detail");
  assert.match(String(detail?.data?.cause), /cannot fit/);
});

test("failed summary calls are counted once and never retried implicitly", async (t) => {
  // Arrange: a retryable HTTP failure occurs at the actual summary provider boundary.
  const events: Array<{ event: string; data?: Record<string, unknown> }> = [];
  const { model, requests } = await fixture(t, () => ({
    status: 500, body: "SUMMARY_PROVIDER_FAILURE",
  }), { compactionSettings: settings,
    logger: { emit: (_level, event, data) => { events.push({ event, data }); },
      flush: async () => {} },
  }, "small");

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation(), submission }), (error: Error) => {
    assert.match(String(error.cause), /SUMMARY_PROVIDER_FAILURE/);
    return true;
  });

  // Assert: no repeated summary, task call or text fallback is dispatched.
  assert.equal(requests.length, 1);
  const totals = events.find((entry) => entry.event === "model.calls")?.data;
  assert.equal(totals?.providerCalls, 1);
  assert.equal(totals?.compactionCalls, 1);
});

test("unserializable historical evidence fails instead of becoming placeholder text", async (t) => {
  // Arrange: malformed caller input must not quietly become '[object Object]'.
  const record: Record<string, unknown> = { id: "broken-record", text: "Original evidence" };
  record.cycle = record;
  const { model, requests } = await fixture(t, () => accepted);

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: [record], submission }), (error: Error) => {
    assert.match(String(error.cause), /Historical record 1 is not JSON serializable/);
    return true;
  });

  // Assert.
  assert.equal(requests.length, 0);
});

test("proactive compaction keeps a full retained tail when the hard window still fits", async t => {
  // Arrange: policy/task overhead crosses the threshold; message history is below keepRecentTokens.
  const compactionSettings = { enabled: true, reserveTokens: 2_500, keepRecentTokens: 4_000 };
  const { model, requests } = await fixture(t, () => accepted, { compactionSettings }, "small");
  const policy = `CURRENT_POLICY ${"p".repeat(13_000)}`;
  const input = { task: `CURRENT_TASK ${"t".repeat(10_000)}` };
  const record = { id: "original-source", role: "user", text: "Keep all this evidence." };

  // Act.
  const result = await model.complete({ purpose: "capture", policy, input,
    conversation: [record], submission });

  // Assert: the actual model window still fits, so neither history nor settings are altered.
  assert.deepEqual(result, { answer: "Recorded." });
  assert.equal(requests.length, 1);
  const text = requests[0]!.messages.map(messageText).join("\n");
  assert.ok(text.includes(policy));
  assert.ok(text.includes(JSON.stringify(input)));
  assert.ok(text.includes(JSON.stringify(record)));
  assert.deepEqual(compactionSettings,
    { enabled: true, reserveTokens: 2_500, keepRecentTokens: 4_000 });
});

test("domain feedback survives without authorizing schema-invalid original arguments", async t => {
  // Arrange: Pi accepts/coerces both null and numeric strings; neither original is authorized.
  const supplied = [{ entityIds: null }, { entityIds: ["3"] }, { entityIds: [3] }];
  const rejected: unknown[] = [];
  const { model, requests } = await fixture(t, (_request, index) => ({
    name: "submit_result", arguments: supplied[index - 1],
  }));

  // Act.
  const result = await model.complete({ purpose: "recall-review", policy: "Submit sources.",
    input: {}, submission: {
      name: "submit_result", description: "Submit exact entity IDs.",
      parameters: Type.Object({ entityIds: Type.Optional(Type.Array(Type.Integer())) }),
      validate: (input) => {
        const { entityIds } = input as { entityIds: unknown };
        if (!Array.isArray(entityIds)) {
          throw new Error("entityIds must be an integer array. Use [] for no sources.");
        }
        // Even a permissive domain validator's corrected return cannot authorize raw strings.
        return { entityIds: entityIds.map(Number) };
      },
      onRejection: (_reason, input) => { rejected.push(structuredClone(input)); },
    } });

  // Assert: useful domain instructions reach correction, and strict original checks still run.
  assert.deepEqual(result, { entityIds: [3] });
  assert.equal(requests.length, 3);
  assert.match(requests[1]!.messages.map(messageText).join("\n"),
    /entityIds must be an integer array. Use \[\] for no sources/);
  assert.deepEqual(rejected, [{ entityIds: null }, { entityIds: ["3"] }]);
});

test("historical images reach vision models with native blocks and source metadata", async t => {
  // Arrange: a real Pi session record carries both tool-result text and a native image.
  const record = imageRecord();
  const original = structuredClone(record);
  const { model, requests } = await fixture(t, () => accepted, {}, "vision");

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "CURRENT_POLICY",
    input: "CURRENT_TASK", conversation: [record], submission });

  // Assert: bytes go only through the SDK image path; original role and IDs remain labelled data.
  assert.deepEqual(result, { answer: "Recorded." });
  assert.equal(requests.length, 1);
  const evidence = requests[0]!.messages.find(message =>
    messageText(message).includes("Historical record 1"))!;
  assert.ok(Array.isArray(evidence.content));
  assert.deepEqual(evidence.content.filter(part => part.type === "image_url"), [{
    type: "image_url", image_url: { url: `data:image/png;base64,${image.data}` },
  }]);
  const text = requests[0]!.messages.map(messageText).join("\n");
  for (const metadata of ["screenshot-record", "inspect-call", "screenshot-call",
    "toolResult", "inspect_screenshot", "Visual source evidence.", record.timestamp]) {
    assert.ok(text.includes(metadata), metadata);
  }
  assert.ok(!text.includes(image.data));
  assert.match(text, /CURRENT_POLICY/);
  assert.match(text, /CURRENT_TASK/);
  assert.deepEqual(record, original);
});

test("text-only models explicitly reject image evidence before any provider call", async t => {
  // Arrange: older callers without settings still cannot turn unseen images into text evidence.
  const { model, requests } = await fixture(t, () => accepted);

  // Act.
  await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation: [imageRecord()], submission }), (error: Error) => {
    assert.match(String(error.cause), /opencode\/large.*does not support.*image evidence/);
    return true;
  });

  // Assert: neither a task nor a summary can claim to have inspected these images.
  assert.equal(requests.length, 0);
});

test("Pi compaction receives native images before replacing their labelled records", async t => {
  // Arrange: the oldest visual evidence must be compacted to fit the selected vision model.
  const { model, requests, headers } = await fixture(t, request => request.tools?.length
    ? accepted : "Visual summary from screenshot-record, with uncertainty retained.", {
    compactionSettings: settings, sessionId: "image-compaction-session",
  }, "vision");

  // Act.
  await model.complete({ purpose: "capture", policy: "CURRENT_POLICY", input: "CURRENT_TASK",
    conversation: [imageRecord(), ...longConversation()], submission });

  // Assert: the stock text serializer cannot silently discard visual evidence.
  const summaries = requests.filter(request => !request.tools?.length);
  assert.ok(summaries.length > 0);
  const images = summaries.flatMap(request => request.messages.flatMap(message =>
    Array.isArray(message.content)
      ? message.content.filter(part => part.type === "image_url") : []));
  assert.deepEqual(images, [{
    type: "image_url", image_url: { url: `data:image/png;base64,${image.data}` },
  }]);
  const first = summaries[0]!.messages.map(messageText).join("\n");
  assert.match(first, /screenshot-record/);
  assert.match(first, /screenshot-call/);
  assert.match(first, /toolResult/);
  assert.match(first, /Historical record 1, image 1/);
  for (const request of requests) {
    assert.ok(!request.messages.map(messageText).join("\n").includes(image.data));
  }
  for (const header of headers) {
    assert.equal(header.authorization, "Bearer isolated-context-key");
    assert.equal(header["x-opencode-session"], "image-compaction-session");
  }
  const task = requests.at(-1)!;
  assert.match(task.messages.map(messageText).join("\n"), /Visual summary from screenshot-record/);
  assert.match(task.messages.map(messageText).join("\n"), /CURRENT_POLICY/);
  assert.match(task.messages.map(messageText).join("\n"), /CURRENT_TASK/);
  assert.equal(task.tools?.[0]?.function.name, "submit_result");
});

test("compacted history exposes its summary and retained originals without the task", async t => {
  // Arrange: use real Pi summarization requests against the external provider fixture.
  const { registry, selected } = await fixture(t, () => "Earlier source summary.");
  const history = longConversation().map((record, index) =>
    memoryContext.evidenceMessage(record, `Historical record ${index + 1}`, index));
  const task: Message = { role: "user", content: "PRIVATE_TASK", timestamp: 100 };
  const context: Context = { systemPrompt: "PRIVATE_POLICY", messages: [...history, task] };
  const state = new memoryContext.MemoryTaskContext(selected, task, settings, 8_000);

  // Act.
  assert.equal(state.getCompactedHistory(), undefined);
  await state.prepare(context, new AbortController().signal, undefined,
    (context, options) => registry.complete(selected, context, options));
  const compacted = state.getCompactedHistory();

  // Assert: retained records are the unchanged original objects, in order.
  assert.ok(compacted);
  assert.equal(compacted.summary, "Earlier source summary.");
  assert.ok(compacted.retainedMessages.length > 0);
  assert.ok(compacted.retainedMessages.length < history.length);
  assert.deepEqual(compacted.retainedMessages,
    history.slice(history.length - compacted.retainedMessages.length));
  assert.ok(compacted.retainedMessages.every(message => history.includes(message)));
  assert.ok(!compacted.retainedMessages.includes(task));
  assert.ok(context.messages.includes(task));
  assert.equal(context.systemPrompt, "PRIVATE_POLICY");
});

test("private history summarization carries a prior summary and preserves whole source records",
  async t => {
    // Arrange: previous derived context and new originals go through the public task boundary.
    const { registry, selected, requests } = await fixture(t, () => "Updated source summary.");
    const records = longConversation().map((record, index) =>
      memoryContext.evidenceMessage(record, `Processed record ${index + 1}`, index));
    const original = structuredClone(records);
    const task: Message = { role: "user", content: "CURRENT_TASK", timestamp: 100 };
    const context: Context = { messages: [
      { role: "user", content: "PREVIOUS_SUMMARY", timestamp: 0 }, ...records, task,
    ] };
    const state = new memoryContext.MemoryTaskContext(selected, task, settings, 8_000);

    // Act.
    await state.prepare(context, new AbortController().signal, undefined,
      (context, options) => registry.complete(selected, context, options));

    // Assert: batching and retained tail together preserve every original record.
    assert.equal(state.getCompactedHistory()?.summary, "Updated source summary.");
    assert.ok(requests.length > 1);
    assert.match(JSON.stringify(requests[0]), /PREVIOUS_SUMMARY/);
    const received = JSON.stringify({ requests, retained: context.messages });
    for (let index = 0; index < 18; index++) {
      assert.ok(received.includes(`BEGIN_${index} `));
      assert.ok(received.includes(` END_${index}`));
    }
    assert.deepEqual(records, original);
  });

test("model evidence omits native provider replay without altering arbitrary payloads", async t => {
  // Arrange: signatures occur both in SDK content and inside unrelated source payloads.
  const payload = { thinkingSignature: "PAYLOAD_THINKING", textSignature: "PAYLOAD_TEXT",
    thoughtSignature: "PAYLOAD_TOOL_THOUGHT",
    replacementHistory: [{ encrypted_content: "PAYLOAD_ENCRYPTED" }] };
  const conversation = [
    { type: "message", id: "assistant-source", message: { role: "assistant", content: [
      { type: "thinking", thinking: "Readable reasoning.", thinkingSignature: "NATIVE_THINKING" },
      { type: "text", text: "Readable answer.", textSignature: "NATIVE_TEXT" },
      { type: "toolCall", id: "call", name: "inspect", arguments: payload,
        thoughtSignature: "NATIVE_TOOL_THOUGHT" },
    ] } },
    { type: "compaction", id: "native-summary", summary: "Readable native summary.",
      details: { kind: "openai-codex-native-compaction", version: 1,
        modelKey: "openai-codex:openai-codex-responses:model",
        replacementHistory: [{ type: "compaction", encrypted_content: "NATIVE_ENCRYPTED" }],
        readableMetadata: "Keep this metadata." } },
    { type: "message", id: "user-source", message: { role: "user", content: [payload] } },
    { type: "message", id: "tool-source", message: { role: "toolResult", details: payload } },
    { type: "compaction", id: "unknown-version", details: {
      kind: "openai-codex-native-compaction", version: 2, ...payload } },
  ];
  const original = structuredClone(conversation);
  const { model, requests } = await fixture(t, () => accepted);

  // Act.
  await model.complete({ purpose: "capture", policy: "Submit.", input: payload,
    conversation, submission });

  // Assert: only fields at known SDK/plugin locations are projected out.
  const wire = JSON.stringify(requests[0]);
  assert.doesNotMatch(wire, /NATIVE_THINKING|NATIVE_TEXT|NATIVE_ENCRYPTED|NATIVE_TOOL_THOUGHT/);
  assert.match(wire, /Readable reasoning\.|Readable answer\.|Readable native summary\./);
  assert.match(wire, /Keep this metadata\./);
  for (const marker of ["PAYLOAD_THINKING", "PAYLOAD_TEXT", "PAYLOAD_ENCRYPTED",
    "PAYLOAD_TOOL_THOUGHT"]) {
    assert.match(wire, new RegExp(marker));
  }
  assert.deepEqual(conversation, original);
});

test("initial capture summaries checkpoint each cumulative chunk before another provider call",
  async t => {
    // Arrange: several whole-record chunks are necessary to fit the private window.
    const saved: CompactedConversation[] = [];
    const observedCheckpoints: number[] = [];
    const { model, requests } = await fixture(t, (request, index) => {
      observedCheckpoints.push(saved.length);
      return request.tools?.length ? accepted : `CUMULATIVE_SUMMARY_${index}`;
    }, { compactionSettings: settings }, "small");
    const conversation = longConversation();

    // Act.
    await model.complete({ purpose: "capture", policy: "Submit.", input: "PRIVATE_TASK",
      conversation, submission, onConversationCompacted: async view => {
        await delay(5);
        saved.push(view);
      } });

    // Assert: every checkpoint names exactly the original prefix and leaves the raw tail intact.
    const summaries = requests.filter(request => !request.tools?.length);
    assert.ok(summaries.length > 1);
    assert.equal(saved.length, summaries.length);
    assert.deepEqual(observedCheckpoints, requests.map((_, index) => index));
    let previousCut = 0;
    for (const [index, view] of saved.entries()) {
      const cut = conversation.length - view.retainedConversation.length;
      assert.ok(cut > previousCut);
      assert.equal(view.summarizedThroughEntryId, conversation[cut - 1]!.id);
      assert.equal(view.summary, `CUMULATIVE_SUMMARY_${index + 1}`);
      assert.deepEqual(view.retainedConversation, conversation.slice(cut));
      assert.ok(view.retainedConversation.every((record, tailIndex) =>
        record === conversation[cut + tailIndex]));
      if (index > 0) assert.match(JSON.stringify(summaries[index]),
        new RegExp(`CUMULATIVE_SUMMARY_${index}`));
      previousCut = cut;
    }
  });

test("capture preflight yields one durable chunk then resumes to ready before extraction",
  async t => {
  // Arrange: persistence rebuilds the next request from a cumulative summary and raw tail.
  let conversation: readonly unknown[] = longConversation();
  const original = structuredClone(conversation);
  const saved: CompactedConversation[] = [];
  const { model, requests } = await fixture(t, (request, index) => request.tools?.length
    ? accepted : `PERSISTED_SUMMARY_${index}`, { compactionSettings: settings }, "small");
  const request = () => ({ purpose: "capture" as const, policy: "Submit.", input: "EXTRACT_TASK",
    conversation, submission, onConversationCompacted: async (
      view: CompactedConversation,
    ) => {
      await delay(5);
      saved.push(view);
      conversation = [{ type: "capture_history_summary",
        id: `capture-summary:${view.summarizedThroughEntryId}`,
        throughEntryId: view.summarizedThroughEntryId, summary: view.summary },
      ...view.retainedConversation];
    } });

  // Act: every slice is a new public request, as after a capture queue pass/restart.
  const first = await model.prepareCapture(request());
  assert.equal(first, "progress");
  assert.equal(requests.length, 1);
  assert.equal(saved.length, 1);
  let outcome: "ready" | "progress" = first;
  for (let slice = 0; outcome === "progress" && slice < 10; slice++) {
    const before = requests.length;
    outcome = await model.prepareCapture(request());
    assert.ok(requests.length - before <= 1);
  }
  const beforeExtraction = requests.length;
  await model.complete(request());

  // Assert: no preparation request advertises the extraction tools or repeats saved originals.
  assert.equal(outcome, "ready");
  assert.ok(saved.length > 1);
  assert.equal(requests.length, beforeExtraction + 1);
  assert.ok(requests.slice(0, beforeExtraction).every(request => !request.tools?.length));
  assert.ok(requests.at(-1)!.tools?.length);
  assert.match(JSON.stringify(requests[1]), /PERSISTED_SUMMARY_1/);
  assert.doesNotMatch(JSON.stringify(requests[1]), /BEGIN_0 /);
  assert.deepEqual(original, longConversation());
});

test("capture preparation rejects an empty provider summary without saving or yielding",
  async t => {
  // Arrange: a successful transport response contains no usable summary.
  let checkpoints = 0;
  const { model, requests } = await fixture(t, () => "   ", {
    compactionSettings: settings,
  }, "small");

  // Act.
  await assert.rejects(model.prepareCapture({ purpose: "capture", policy: "Submit.", input: {},
    conversation: longConversation(), submission,
    onConversationCompacted: async () => { checkpoints++; } }), (error: Error) => {
    assert.match(String(error.cause), /empty summary/);
    return true;
  });

  // Assert.
  assert.equal(requests.length, 1);
  assert.equal(checkpoints, 0);
});

test("capture preparation fails before summaries when the unsummarised task cannot fit",
  async t => {
  // Arrange: historical summaries cannot shrink the extraction task itself.
  let checkpoints = 0;
  const { model, requests } = await fixture(t, () => "Small source summary.", {
    compactionSettings: settings,
  }, "small");

  // Act.
  await assert.rejects(model.prepareCapture({ purpose: "capture", policy: "Submit.",
    input: "UNSUMMARISED_TASK ".repeat(10_000), conversation: longConversation(), submission,
    onConversationCompacted: async () => { checkpoints++; } }), (error: Error) => {
    assert.match(String(error.cause), /cannot fit/);
    return true;
  });

  // Assert: source history is not repeatedly summarised for an irreparable input.
  assert.equal(requests.length, 0);
  assert.equal(checkpoints, 0);
});

test("interrupted cumulative chunks resume from the saved boundary after actual queue restart",
  async t => {
    // Arrange: original source history needs more than two summaries.
    const controller = new AbortController();
    const { model, requests, directory, registry } = await fixture(t, (_request, index) =>
      `DURABLE_CUMULATIVE_${index}`, { compactionSettings: settings }, "small");
    const conversation = Array.from({ length: 36 }, (_, index) => ({
      id: `source-${index}`, role: "user" as const,
      text: `ORIGINAL_${index} ${"Historical source details. ".repeat(140)} END_${index}`,
    }));
    const snapshot: CaptureSnapshot = { id: "interrupted-model", instanceId: "isolated-test",
      context: { cwd: directory, sessionId: "session", branchId: "branch" },
      entries: conversation, conversation, conversationCoverage: "complete",
      finalEntryId: "source-35", mode: "observe", scope: "global", policy: "Submit.",
      modelVersion: model.version, createdAt: new Date().toISOString() };
    const queue = new DurableQueueStore({ directory, instanceId: "isolated-test" });
    const queued = await queue.enqueue(snapshot);
    let checkpoints = 0;
    const request: ModelRequest = { purpose: "capture", policy: "Submit.", input: "TASK",
      conversation, submission, signal: controller.signal,
      onConversationCompacted: async view => {
        await queue.checkpoint(queued.jobId, { compactedConversation: view });
        if (++checkpoints === 2) controller.abort();
      } };

    // Act: interrupt after the second durable checkpoint, reopen the real queue and adapter.
    await assert.rejects(model.complete(request), /aborted/);
    const reopened = new DurableQueueStore({ directory, instanceId: "isolated-test" });
    const job = await reopened.getJob(queued.jobId);
    assert.ok(job);
    const resumed = new PiMemoryModel(registry, { provider: "opencode", id: "small" }, {
      compactionSettings: settings,
    });
    await resumed.prepareCapture({ ...request, signal: undefined,
      conversation: job.snapshot.conversation,
      onConversationCompacted: async view => {
        await reopened.checkpoint(queued.jobId, { compactedConversation: view });
      } });

    // Assert: the saved summary is used, covered originals are not replayed, raw sources survive.
    assert.equal(checkpoints, 2);
    assert.equal(requests.length, 3);
    assert.equal(job.snapshot.historySummary?.text, "DURABLE_CUMULATIVE_2");
    const boundary = Number(job.snapshot.historySummary!.throughEntryId.split("-")[1]);
    const nextRequest = JSON.stringify(requests[2]);
    assert.match(nextRequest, /DURABLE_CUMULATIVE_2/);
    for (let index = 0; index <= boundary; index++) {
      assert.ok(!nextRequest.includes(`ORIGINAL_${index} `));
    }
    assert.deepEqual(job.snapshot.sourceConversation, conversation);
    assert.deepEqual(job.snapshot.conversation?.slice(1), conversation.slice(boundary + 1));
  });

function barrier() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => { release = resolve; });
  return { promise, release };
}

for (const interruption of ["timeout", "cancellation"] as const) {
  test(`capture preparation ${interruption} throws without checkpointing or yielding`, async t => {
    // Arrange: hold a real HTTP summary response while the model's deadline/signal fires.
    const arrived = barrier();
    const blocked = barrier();
    const controller = new AbortController();
    let checkpoints = 0;
    const events: Array<{ event: string; data?: Record<string, unknown> }> = [];
    const { model, requests } = await fixture(t, async () => {
      arrived.release();
      await blocked.promise;
      return "Late summary.";
    }, { compactionSettings: settings,
      logger: { emit: (_level, event, data) => { events.push({ event, data }); },
        flush: async () => {} } }, "small");
    t.after(blocked.release);
    t.mock.timers.enable({ apis: ["setTimeout"] });

    // Act.
    const rejected = assert.rejects(model.prepareCapture({ purpose: "capture", policy: "Submit.",
      input: {}, conversation: longConversation(), submission, signal: controller.signal,
      onConversationCompacted: async () => { checkpoints++; } }), (error: Error) => {
      assert.match(interruption === "timeout" ? String(error.cause) : error.message,
        interruption === "timeout" ? /timeout/ : /aborted/);
      return true;
    });
    await arrived.promise;
    if (interruption === "timeout") t.mock.timers.tick(180_000);
    else controller.abort();
    await rejected;

    // Assert: the real attempted summary is counted, with no fake refund or progress result.
    assert.equal(requests.length, 1);
    assert.equal(checkpoints, 0);
    assert.equal(events.find(entry => entry.event === "model.calls")?.data?.providerCalls, 1);
    assert.equal(events.find(entry => entry.event === "model.calls")?.data?.compactionCalls, 1);
  });
}

test("each preparation slice gets a bounded deadline independent of the next slice", async t => {
  // Arrange: two 120-second provider chunks exceed a single shared 180-second allowance.
  const arrived = [barrier(), barrier()];
  const blocked = [barrier(), barrier()];
  let conversation: readonly unknown[] = longConversation();
  const { model, requests } = await fixture(t, async (_request, index) => {
    arrived[index - 1]!.release();
    await blocked[index - 1]!.promise;
    return `TIMED_SUMMARY_${index}`;
  }, { compactionSettings: settings }, "small");
  t.after(() => blocked.forEach(gate => gate.release()));
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const request = (): ModelRequest => ({ purpose: "capture", policy: "Submit.", input: {},
    conversation, submission, onConversationCompacted: async view => {
      conversation = [{ type: "capture_history_summary",
        id: `capture-summary:${view.summarizedThroughEntryId}`,
        throughEntryId: view.summarizedThroughEntryId, summary: view.summary },
      ...view.retainedConversation];
    } });

  // Act.
  const first = model.prepareCapture(request());
  await arrived[0]!.promise;
  t.mock.timers.tick(120_000);
  blocked[0]!.release();
  assert.equal(await first, "progress");
  const second = model.prepareCapture(request());
  await arrived[1]!.promise;
  t.mock.timers.tick(120_000);
  blocked[1]!.release();
  const outcome = await second;

  // Assert: both completed chunks remain real provider work, without a carryover timeout.
  assert.equal(requests.length, 2);
  assert.equal(outcome, "ready");
  assert.match(JSON.stringify(conversation[0]), /TIMED_SUMMARY_2/);
});

test("capture read continuation retains the extraction deadline after preparation", async t => {
  // Arrange: the first task response consumes 120 seconds, then a read is held open.
  const arrived = barrier();
  const responseGate = barrier();
  const readStarted = barrier();
  const readGate = barrier();
  const { model, requests } = await fixture(t, async () => {
    arrived.release();
    await responseGate.promise;
    return { name: "inspect_source", arguments: {} };
  });
  t.after(() => { responseGate.release(); readGate.release(); });
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const request: ModelRequest = { purpose: "capture", policy: "Submit.", input: {}, submission,
    readTools: [{ name: "inspect_source", description: "Read source.",
      parameters: Type.Object({}), execute: async (_input, signal) => {
        readStarted.release();
        await readGate.promise;
        assert.equal(signal.aborted, true);
        return "Late evidence.";
      } }] };

  // Act: preparation fits immediately; extraction and its reads share one new deadline.
  assert.equal(await model.prepareCapture(request), "ready");
  const rejected = assert.rejects(model.complete(request), (error: Error) => {
    assert.match(String(error.cause), /timeout/);
    return true;
  });
  await arrived.promise;
  t.mock.timers.tick(120_000);
  responseGate.release();
  await readStarted.promise;
  t.mock.timers.tick(60_000);
  await rejected;
  readGate.release();

  // Assert: timeout stops the read continuation instead of resetting its allowance.
  assert.equal(requests.length, 1);
});

for (const failure of ["oversized record", "nonreducing summary", "oversized saved summary",
  "failed persistence", "missing persistence"] as const) {
  test(`capture preparation fails on ${failure} instead of returning progress`, async t => {
    // Arrange: each failure must leave the caller with an error, not a resumable yield.
    let checkpoints = 0;
    const { model, requests } = await fixture(t, () => failure === "nonreducing summary"
      ? "Bloated nonreducing summary. ".repeat(4_000) : "Small summary.", {
      compactionSettings: { ...settings,
        keepRecentTokens: failure === "oversized saved summary" ? 0 : settings.keepRecentTokens },
    }, "small");
    const conversation = failure === "oversized record" ? [
      { id: "oversized", text: "Readable source history. ".repeat(10_000) },
    ] : failure === "oversized saved summary" ? [
      { type: "capture_history_summary", id: "capture-summary:old", throughEntryId: "old",
        summary: "Previous derived history. ".repeat(500) },
    ] : longConversation();
    const expected = failure === "oversized record" ? /cannot fit/ :
      failure === "nonreducing summary" ? /did not reduce/ :
      failure === "oversized saved summary" ? /cannot fit/ :
      failure === "failed persistence" ? /CHECKPOINT_FAILED/ : /requires durable progress/;

    // Act.
    await assert.rejects(model.prepareCapture({ purpose: "capture", input: {}, conversation,
      policy: failure === "oversized saved summary" ? "p".repeat(22_000) : "Submit.", submission,
      onConversationCompacted: failure === "missing persistence" ? undefined : async () => {
        checkpoints++;
        throw new Error("CHECKPOINT_FAILED");
      } }), (error: Error) => {
      assert.match(String(error.cause), expected);
      return true;
    });

    // Assert: no further summary or extraction follows a failed chunk.
    assert.equal(requests.length,
      failure === "oversized record" || failure === "oversized saved summary" ||
        failure === "missing persistence" ? 0 : 1);
    assert.equal(checkpoints, failure === "failed persistence" ? 1 : 0);
  });
}

test("large native replay cannot force compaction of small readable evidence", async t => {
  // Arrange: encrypted replay is huge, while useful source text and a native image are small.
  const conversation = [
    { type: "message", id: "reasoning", message: { role: "assistant", content: [
      { type: "thinking", thinking: "Readable source reasoning.",
        thinkingSignature: "OPAQUE_THINKING_REPLAY".repeat(10_000) },
      { type: "text", text: "Readable source outcome.",
        textSignature: "OPAQUE_TEXT_REPLAY".repeat(10_000) },
    ] } },
    { type: "custom", customType: "openai-codex-native-compaction", id: "custom-checkpoint",
      data: { kind: "openai-codex-native-compaction", version: 1, modelKey: "native:model",
        replacementHistory: [{ type: "compaction",
          encrypted_content: "OPAQUE_COMPACTION_REPLAY".repeat(10_000) }],
        summary: "Readable checkpoint metadata." } },
    imageRecord(),
  ];
  const original = structuredClone(conversation);
  const { model, requests } = await fixture(t, () => accepted, {
    compactionSettings: settings,
  }, "vision");

  // Act.
  assert.equal(await model.prepareCapture({ purpose: "capture", policy: "Submit.", input: {},
    conversation, submission }), "ready");
  await model.complete({ purpose: "capture", policy: "Submit.", input: {},
    conversation, submission });

  // Assert: the task receives readable context and its image, with no summary provider calls.
  assert.equal(requests.length, 1);
  const wire = JSON.stringify(requests[0]);
  assert.doesNotMatch(wire, /OPAQUE_/);
  assert.match(wire, /Readable source reasoning\.|Readable source outcome\./);
  assert.match(wire, /Readable checkpoint metadata\./);
  assert.match(wire, new RegExp(`data:${image.mimeType};base64,`));
  assert.deepEqual(conversation, original);
});

for (const action of ["prepareCapture", "complete"] as const) {
  test(`saved source summary resumes through ${action} above soft threshold without paid summary`,
    async t => {
      // Arrange: preparation persists a prefix; its unchanged recent tail fits the hard window.
      const recent = { id: "recent-tail", role: "user",
        text: "Readable recent tail. ".repeat(900) };
      const older = { id: "older-source", role: "user" as const,
        text: "Older source evidence. ".repeat(500) };
      let conversation: readonly unknown[] = [older, recent];
      const saved: CompactedConversation[] = [];
      const configured = { enabled: true, reserveTokens: 1_200, keepRecentTokens: 4_000 };
      const { model, requests, registry, directory } = await fixture(t, request =>
        request.tools?.length
        ? accepted : "CUMULATIVE_SAVED_SOURCE", { compactionSettings: configured }, "small");
      const queue = new DurableQueueStore({ directory, instanceId: "summary-resume" });
      const snapshot: CaptureSnapshot = { id: "summary-resume", instanceId: "summary-resume",
        context: { cwd: directory, sessionId: "session", branchId: "branch" },
        entries: [older, { ...recent, role: "user" }], conversation,
        conversationCoverage: "complete", finalEntryId: recent.id,
        mode: "observe", scope: "global", policy: "Submit.", modelVersion: model.version,
        createdAt: new Date().toISOString() };
      const queued = await queue.enqueue(snapshot);
      const request = (): ModelRequest => ({ purpose: "capture", policy: "p".repeat(9_000),
        input: {}, conversation, submission, onConversationCompacted: async view => {
          saved.push(view);
          const updated = await queue.checkpoint(queued.jobId, { compactedConversation: view });
          conversation = updated.snapshot.conversation!;
        } });
      assert.equal(await model.prepareCapture(request()), "progress");
      assert.equal(saved.length, 1);
      assert.equal(saved[0]!.summarizedThroughEntryId, "older-source");
      const resumed = new PiMemoryModel(registry, { provider: "opencode", id: "small" }, {
        compactionSettings: configured,
      });
      const reopened = new DurableQueueStore({ directory, instanceId: "summary-resume" });
      const persisted = await reopened.getJob(queued.jobId);
      assert.ok(persisted);
      conversation = persisted.snapshot.conversation!;
      const before = requests.length;

      // Act: a fresh instance represents the next pass or a new job reusing branch history.
      const result = await resumed[action](request());

      // Assert: retained context is admitted without resummarising or publishing the old boundary.
      assert.deepEqual(result, action === "prepareCapture" ? "ready" : { answer: "Recorded." });
      assert.equal(saved.length, 1);
      assert.equal(requests.length - before, action === "prepareCapture" ? 0 : 1);
      assert.equal(saved[0]!.retainedConversation[0], recent);
      assert.deepEqual(conversation[1], recent);
      if (action === "complete") {
        assert.ok(requests.at(-1)!.tools?.length);
        assert.match(JSON.stringify(requests.at(-1)), /CUMULATIVE_SAVED_SOURCE/);
        assert.match(JSON.stringify(requests.at(-1)), /Readable recent tail/);
      }
    });
}

test("resumed compaction sends fresh whole records together with the cumulative prior summary",
  async t => {
    // Arrange: later originals exceed the budget, so the saved summary must be extended.
    const prior = { type: "capture_history_summary", id: "capture-summary:earlier",
      throughEntryId: "earlier",
      summary: "PRIOR_REUSABLE_SUMMARY api_key=fixture-sensitive-value" };
    const originals = longConversation();
    const saved: CompactedConversation[] = [];
    const { registry, requests } = await fixture(t, () => "EXTENDED_CUMULATIVE_SUMMARY", {
      compactionSettings: settings,
    }, "small");
    const model = new PiMemoryModel(registry, { provider: "opencode", id: "small" }, {
      compactionSettings: settings,
    });

    // Act.
    const result = await model.prepareCapture({ purpose: "capture", policy: "Submit.", input: {},
      conversation: [prior, ...originals], submission,
      onConversationCompacted: async view => { saved.push(view); } });

    // Assert: prior derived context is carried as a summary, not reclassified as a source record.
    assert.equal(result, "progress");
    assert.equal(requests.length, 1);
    const sent = requests[0]!.messages.map(messageText).join("\n");
    assert.match(sent, /PRIOR_REUSABLE_SUMMARY/);
    assert.doesNotMatch(sent, /fixture-sensitive-value/);
    assert.doesNotMatch(sent, /capture_history_summary|capture-summary:earlier/);
    assert.match(sent, /BEGIN_0 .* END_0/);
    assert.equal(saved.length, 1);
    const cut = originals.length - saved[0]!.retainedConversation.length;
    assert.ok(cut > 0);
    assert.equal(saved[0]!.summarizedThroughEntryId, originals[cut - 1]!.id);
    assert.equal(saved[0]!.summary, "EXTENDED_CUMULATIVE_SUMMARY");
    assert.deepEqual(saved[0]!.retainedConversation, originals.slice(cut));
  });

test("private read compaction fails explicitly when an indivisible tool exchange cannot fit",
  async t => {
    // Arrange: native read replies fit individually; summary JSON escaping enlarges the old group.
    let taskCalls = 0;
    let rejectedOrphan = false;
    let savedHistory = 0;
    const { model, requests } = await fixture(t, request => {
      if (!request.tools?.length) return "Older investigation summary.";
      if (++taskCalls <= 2) return { name: "inspect_source", arguments: {
        step: taskCalls, reason: taskCalls === 1 ? "source".repeat(500) : "next",
      } };
      const calls = new Set(request.messages.flatMap(message =>
        message.tool_calls?.map(call => call.id) ?? []));
      rejectedOrphan = request.messages.some(message => message.role === "tool" &&
        !calls.has(message.tool_call_id!));
      return rejectedOrphan ? { status: 400, body: "ORPHAN_REAL_PRIVATE_RESULT" } : accepted;
    }, { compactionSettings: settings }, "small");
    const originalBody = "ESCAPED_RESULT_START" + String.raw`"\\":`.repeat(4_000) +
      "ESCAPED_RESULT_END";
    const inspected: number[] = [];

    // Act: these are actual private assistant/tool messages, not historical user envelopes.
    await assert.rejects(model.complete({ purpose: "capture", policy: "Submit.", input: "TASK",
      submission, onConversationCompacted: async () => { savedHistory++; },
      readTools: [{ name: "inspect_source", description: "Read original source.",
        parameters: Type.Object({ step: Type.Integer(), reason: Type.String() }),
        execute: async input => {
          const step = (input as { step: number }).step;
          inspected.push(step);
          return step === 1 ? originalBody : "FRESH_RESULT ".repeat(400);
        } }] }), (error: Error) => {
      assert.match(String(error.cause), /indivisible tool exchange.*cannot fit/);
      return true;
    });

    // Assert: preparation fails before a paid partial summary or orphaned task request.
    assert.deepEqual(inspected, [1, 2]);
    assert.equal(rejectedOrphan, false);
    assert.equal(requests.length, 2);
    assert.ok(requests.every(request => request.tools?.length));
    assert.equal(savedHistory, 0);
  });

test("private summary chunks keep whole tool batches when a smaller complete exchange fits",
  async t => {
    // Arrange: halving five old native records would cut inside the first two-result batch.
    let taskCalls = 0;
    const { model, requests } = await fixture(t, request => {
      if (!request.tools?.length) return "Entire first tool exchange summary.";
      if (++taskCalls === 1) return [1, 2].map(step => ({ name: "inspect_source",
        arguments: { step, reason: "a".repeat(600) } }));
      if (taskCalls <= 3) return { name: "inspect_source", arguments: {
        step: taskCalls + 1, reason: taskCalls === 2 ? "a".repeat(1_500) : "next",
      } };
      const calls = new Set(request.messages.flatMap(message =>
        message.tool_calls?.map(call => call.id) ?? []));
      return request.messages.some(message => message.role === "tool" &&
        !calls.has(message.tool_call_id!))
        ? { status: 400, body: "ORPHAN_PRIVATE_BATCH" } : accepted;
    }, { compactionSettings: settings }, "small");
    const bodies = [String.raw`"\\":`.repeat(1_000), "SECOND_READ_BODY ".repeat(430),
      String.raw`"\\":`.repeat(1_500), "FRESH_READ_BODY ".repeat(400)];

    // Act: actual private reads produce the protocol records that compaction must group.
    const result = await model.complete({ purpose: "capture", policy: "Submit.", input: "TASK",
      submission, readTools: [{ name: "inspect_source", description: "Read source.",
        parameters: Type.Object({ step: Type.Integer(), reason: Type.String() }),
        execute: async input => bodies[(input as { step: number }).step - 1] }] })
      .catch((error: Error) => { assert.fail(`${error.message}: ${String(error.cause)}`); });

    // Assert: both old results are summarised together; retained native results have their calls.
    assert.deepEqual(result, { answer: "Recorded." });
    assert.equal(taskCalls, 4);
    const summaries = requests.filter(request => !request.tools?.length);
    assert.equal(summaries.length, 1);
    const sent = summaries[0]!.messages.map(messageText).join("\n");
    assert.match(sent, /call-1-0/);
    assert.match(sent, /call-1-1/);
    assert.match(sent, /SECOND_READ_BODY/);
    const final = requests.at(-1)!;
    const results = final.messages.filter(message => message.role === "tool");
    assert.deepEqual(results.map(message => message.tool_call_id), ["call-2", "call-3"]);
    assert.equal(messageText(results[0]!), bodies[2]);
    assert.equal(messageText(results[1]!), bodies[3]);
    const calls = final.messages.flatMap(message => message.tool_calls ?? []);
    assert.deepEqual(calls.map(call => call.id), ["call-2", "call-3"]);
  });
