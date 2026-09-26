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
import { PiMemoryModel, type PiMemoryModelOptions } from "../src/model.ts";

type WireRequest = {
  messages: Array<{ role: string; tool_call_id?: string;
    content?: string | Array<{ type: string; text?: string;
      image_url?: { url: string } }> | null }>;
  tools?: Array<{ function: { name: string } }>;
  max_tokens?: number;
  max_completion_tokens?: number;
};
type Reply = string | { name: string; arguments: unknown } | { status: number; body: string };

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
    const delta = typeof reply === "string" ? { content: reply } : { tool_calls: [{
      index: 0, id: `call-${index}`, type: "function",
      function: { name: reply.name, arguments: JSON.stringify(reply.arguments) },
    }] };
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
    models: ["small", "large", "vision"].map((id) => ({
      id, name: id, reasoning: false,
      input: (id === "vision" ? ["text", "image"] : ["text"]) as ("text" | "image")[],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: id === "large" ? 64_000 : 8_000, maxTokens: 1_000,
    })),
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "opencode", id: selection,
  }, options);
  return { model, requests, headers };
}

const submission = {
  name: "submit_result", description: "Submit the evidenced result.",
  parameters: Type.Object({ answer: Type.String() }, { additionalProperties: false }),
  validate: (input: unknown) => input,
};
const accepted: Reply = { name: "submit_result", arguments: { answer: "Recorded." } };

const settings = { enabled: true, reserveTokens: 1_200, keepRecentTokens: 1_200 };
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
  assert.equal(requests[0]!.max_tokens ?? requests[0]!.max_completion_tokens, 960);
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

  // Act.
  const result = await model.complete({ purpose: "capture", policy: "CURRENT_POLICY",
    input: { task: "CURRENT_TASK" }, submission,
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
    conversation: longConversation() }), (error: Error) => {
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
    assert.match(String(error.cause), /indivisible record/);
    assert.match(String(error.cause), /No records were clipped/);
    return true;
  });

  // Assert: failure detail reaches diagnostics, with no invented successful submission.
  assert.equal(requests.length, 0);
  const detail = events.find((entry) => entry.event === "model.error_detail");
  assert.match(String(detail?.data?.cause), /indivisible record/);
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
