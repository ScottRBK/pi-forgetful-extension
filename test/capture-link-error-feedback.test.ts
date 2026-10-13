import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { CaptureService } from "../src/capture.ts";
import type { CaptureLinkReview } from "../src/capture-links.ts";
import type { CaptureSnapshot, Memory } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";

interface ProviderRequest {
  messages: Array<{ role: string; content: string }>;
  tools: Array<{ function: { name: string } }>;
}

function submit(response: ServerResponse, id: number, name: string, args: unknown): void {
  const base = { id: `completion-${id}`, object: "chat.completion.chunk",
    created: 1, model: "memory" };
  const chunks = [
    { ...base, choices: [{ index: 0, delta: { role: "assistant", tool_calls: [{
      index: 0, id: `call-${id}`, type: "function",
      function: { name, arguments: JSON.stringify(args) },
    }] }, finish_reason: null }] },
    { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }],
      usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
  ];
  response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
  response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
    "data: [DONE]\n\n");
}

function linkTask(request: ProviderRequest) {
  const message = request.messages.findLast((item) => item.role === "user");
  assert.ok(message, "the provider must receive the current task");
  return JSON.parse(message.content).candidates[0];
}

test("missing-link HTTP 404 reaches the retry provider intact after reopening the queue", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: real capture, disk queue, HTTP client and Pi SDK; only remote endpoints are scripted.
  const directory = await mkdtemp(join(tmpdir(), "capture-link-error-feedback-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const candidate = { id: "decision", title: "Bounded retries",
    content: "Retry transient failures twice.", context: "Adopted operational rule.",
    keywords: ["retries"], tags: [], sourceEntryIds: ["user"], evidenceType: "userDecision" };
  const project = { id: 7, name: "Retry test" };
  const unrelated: Memory = { id: 42, title: "Old experiment", content: "Retry indefinitely.",
    context: "An unadopted proposal.", keywords: ["retries"], tags: [],
    project_ids: [7], is_obsolete: false, linked_memory_ids: [] };
  const stored = new Map<number, Memory>([[42, unrelated]]);
  const providerRequests: ProviderRequest[] = [];
  const mutations: string[] = [];
  const unexpectedRequests: string[] = [];
  const events: string[] = [];
  let reviews = 0;
  const server = createServer(async (request, response) => {
    const path = request.url ?? "";
    let body = "";
    for await (const chunk of request) body += chunk;
    if (request.method === "POST" && path === "/v1/chat/completions") {
      const input: ProviderRequest = JSON.parse(body);
      providerRequests.push(input);
      const name = input.tools[0]?.function.name ?? "missing-tool";
      events.push(name);
      let args: unknown;
      if (name === "submit_capture_candidates") args = { candidates: [candidate] };
      else if (name === "submit_capture_decision") args = { action: "create" };
      else if (name === "submit_capture_links") {
        reviews++;
        args = { reviews: [{ candidateId: "decision", decisions: [{ memoryId: 42,
          action: reviews === 1 ? "reject" : "ignore",
          reason: reviews === 1 ? "This proposal is not a useful connection."
            : "The link is already absent; leave it alone." }] }] };
      } else unexpectedRequests.push(`provider tool ${name}`);
      submit(response, providerRequests.length, name, args ?? {});
      return;
    }
    response.setHeader("content-type", "application/json");
    if (request.method === "POST" && path === "/api/v1/memories/search") {
      response.end(JSON.stringify({ primary_memories: [unrelated], linked_memories: [] }));
      return;
    }
    if (request.method === "POST" && path === "/api/v1/memories") {
      mutations.push(`POST ${path}`);
      stored.set(99, { ...JSON.parse(body), id: 99, is_obsolete: false, linked_memory_ids: [42] });
      response.statusCode = 201;
      response.end(JSON.stringify({ id: 99, linked_memory_ids: [42] }));
      return;
    }
    const memoryId = path.match(/^\/api\/v1\/memories\/(\d+)$/)?.[1];
    if (request.method === "GET" && memoryId && stored.has(Number(memoryId))) {
      response.end(JSON.stringify(stored.get(Number(memoryId))));
      return;
    }
    if (request.method === "DELETE" && path === "/api/v1/memories/99/links/42") {
      mutations.push(`DELETE ${path}`);
      events.push("DELETE returned 404");
      // A concurrent client removed the link after capture's last authorization read.
      stored.get(99)!.linked_memory_ids = [];
      response.statusCode = 404;
      response.end('{"error":"Link not found"}');
      return;
    }
    unexpectedRequests.push(`${request.method} ${path}`);
    response.statusCode = 500;
    response.end('{"error":"Unexpected fixture request"}');
  });
  t.after(() => new Promise<void>((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  }));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  const runtime = await ModelRuntime.create({ authPath: join(directory, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  runtime.registerProvider("link-feedback", { api: "openai-completions", apiKey: "fixture-only",
    baseUrl: `${origin}/v1`, models: [{ id: "memory", name: "memory", reasoning: false,
      input: ["text"], contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }] });
  const instanceId = "link-feedback";
  const queue = new DurableQueueStore({ directory, instanceId });
  const model = () => new PiMemoryModel(new ModelRegistry(runtime),
    { provider: "link-feedback", id: "memory" });
  const client = () => new ApiForgetfulClient({ baseUrl: `${origin}/api/v1` });
  const capture = new CaptureService({ queue, client: client(), model: model(), instanceId });
  const snapshot: CaptureSnapshot = { id: "snapshot", instanceId, finalEntryId: "answer",
    context: { cwd: directory, sessionId: "capture", branchId: "main", project },
    entries: [{ id: "user", role: "user", text: "We adopted two retries for transient failures." },
      { id: "answer", role: "assistant", text: "Recorded." }],
    mode: "auto", scope: "global", policy: "Save supported knowledge.", modelVersion: "memory",
    createdAt: new Date().toISOString() };
  const expectedError = 'Forgetful DELETE /api/v1/memories/99/links/42 returned HTTP 404: ' +
    '{"error":"Link not found"}';

  // Act: create the memory, receive the failed delete, then retry from fresh persisted state.
  const queued = await capture.enqueue(snapshot);
  assert.equal(queued.queued, true);
  const first = await capture.checkpoint();
  assert.deepEqual(first.errors, [expectedError]);
  assert.equal(providerRequests.length, 3, "failure ends this pass, not an immediate model turn");
  const pending = await queue.getJob(queued.jobId);
  assert.equal(pending?.status, "pending");
  assert.equal(pending?.lastError, expectedError);
  assert.equal(pending?.callCount, 3);
  const pendingReview = (pending?.candidateOutcomes.decision as {
    linkReview: CaptureLinkReview;
  }).linkReview;
  assert.deepEqual(pendingReview.executionResults, [
    { operation: "unlink", targetId: 42, status: "failed", error: expectedError, httpStatus: 404 },
  ]);
  const reopened = new DurableQueueStore({ directory, instanceId });
  const restarted = new CaptureService({ queue: reopened, client: client(), model: model(),
    instanceId });
  const second = await restarted.checkpoint();

  // Assert: the actual outgoing HTTP request contains the original failure and current records.
  assert.deepEqual(unexpectedRequests, []);
  assert.deepEqual(second.errors, []);
  assert.deepEqual(events, ["submit_capture_candidates", "submit_capture_decision",
    "submit_capture_links", "DELETE returned 404", "submit_capture_links"]);
  const linkRequests = providerRequests.filter((request) =>
    request.tools[0]?.function.name === "submit_capture_links");
  assert.equal(linkRequests.length, 2);
  for (const [index, request] of linkRequests.entries()) {
    const item = linkTask(request);
    assert.equal(item.memory.id, 99);
    assert.deepEqual(item.memory.linked_memory_ids, index === 0 ? [42] : []);
    assert.deepEqual(item.eligibleMemoryIds, [42]);
    assert.equal(item.memories[0].content, "Retry indefinitely.");
  }
  assert.deepEqual(linkTask(linkRequests[0]!).executionResults, []);
  assert.deepEqual(linkTask(linkRequests[0]!).executionFailures, []);
  const retried = linkTask(linkRequests[1]!);
  assert.deepEqual(retried.executionResults, [
    { operation: "unlink", targetId: 42, status: "failed", error: expectedError, httpStatus: 404 },
  ]);
  assert.deepEqual(retried.executionFailures, [{ operation: "connections", error: expectedError }]);
  assert.equal(retried.completedWrites.memoryId, 99);
  const finished = await reopened.getJob(queued.jobId);
  assert.equal(finished?.status, "complete", finished?.lastError);
  assert.equal(finished?.attempts, 2);
  assert.equal(finished?.callCount, 1);
  assert.equal((finished?.candidateOutcomes.decision as { memoryId: number }).memoryId, 99);
  assert.deepEqual(mutations, ["POST /api/v1/memories", "DELETE /api/v1/memories/99/links/42"],
    "retry must not recreate the saved memory or repeat a deletion without a new instruction");
  assert.deepEqual((await client().get(99)).linked_memory_ids, []);
});
