import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, Memory } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";

function submit(response: ServerResponse, name: string, args: unknown): void {
  const base = { id: "completion", object: "chat.completion.chunk", created: 1, model: "memory" };
  const chunks = [
    { ...base, choices: [{ index: 0, delta: { role: "assistant", tool_calls: [{
      index: 0, id: "submission", type: "function",
      function: { name, arguments: JSON.stringify(args) },
    }] }, finish_reason: null }] },
    { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }],
      usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
  ];
  response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
  response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
    "data: [DONE]\n\n");
}

for (const scenario of ["absent", "present", "removed during review",
  "added during review", "unreported membership"] as const) {
  test(`capture reject checks fresh membership: ${scenario}`, { timeout: 15_000 }, async (t) => {
    // Arrange: real capture, disk queue, HTTP client and Pi SDK; remote endpoints are scripted.
    const directory = await mkdtemp(join(tmpdir(), "capture-link-presence-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const candidate = { id: "decision", title: "Bounded retries",
      content: "Retry transient failures twice.", context: "Adopted operational rule.",
      keywords: ["retries"], tags: [], sourceEntryIds: ["user"], evidenceType: "userDecision" };
    const unrelated: Memory = { id: 42, title: "Old experiment", content: "Retry indefinitely.",
      context: "An unadopted proposal.", keywords: ["retries"], tags: [],
      project_ids: [7], is_obsolete: false, linked_memory_ids: [] };
    const stored = new Map<number, Memory>([[42, unrelated]]);
    const mutations: string[] = [];
    const unexpectedRequests: string[] = [];
    const tasks: string[] = [];
    const initiallyLinked = scenario === "present" || scenario === "removed during review" ||
      scenario === "unreported membership";
    let omitMembership = scenario === "unreported membership";
    const server = createServer(async (request, response) => {
      const path = request.url ?? "";
      let body = "";
      for await (const chunk of request) body += chunk;
      if (request.method === "POST" && path === "/v1/chat/completions") {
        const input = JSON.parse(body);
        const name = input.tools[0]?.function.name ?? "missing-tool";
        tasks.push(name);
        let args: unknown;
        if (name === "submit_capture_candidates") args = { candidates: [candidate] };
        else if (name === "submit_capture_decision") args = { action: "create" };
        else if (name === "submit_capture_links") {
          const item = JSON.parse(input.messages.findLast((message: { role: string }) =>
            message.role === "user").content).candidates[0];
          assert.deepEqual(item.memory.linked_memory_ids,
            omitMembership ? undefined : initiallyLinked ? [42] : []);
          // Change the remote graph after the model receives its historical review records.
          if (scenario === "removed during review" || scenario === "added during review") {
            const linked = scenario === "added during review";
            stored.get(99)!.linked_memory_ids = linked ? [42] : [];
            unrelated.linked_memory_ids = linked ? [99] : [];
          }
          args = { reviews: [{ candidateId: "decision", decisions: [{ memoryId: 42,
            action: "reject", reason: "This proposal is not a useful connection." }] }] };
        } else unexpectedRequests.push(`provider tool ${name}`);
        submit(response, name, args ?? {});
        return;
      }
      response.setHeader("content-type", "application/json");
      if (request.method === "POST" && path === "/api/v1/memories/search") {
        response.end(JSON.stringify({ primary_memories: [unrelated], linked_memories: [] }));
        return;
      }
      if (request.method === "POST" && path === "/api/v1/memories") {
        mutations.push(`POST ${path}`);
        const linked = initiallyLinked ? [42] : [];
        stored.set(99, { ...JSON.parse(body), id: 99, is_obsolete: false,
          linked_memory_ids: linked });
        unrelated.linked_memory_ids = initiallyLinked ? [99] : [];
        response.statusCode = 201;
        response.end(JSON.stringify({ id: 99, linked_memory_ids: linked }));
        return;
      }
      const id = path.match(/^\/api\/v1\/memories\/(\d+)$/)?.[1];
      if (request.method === "GET" && id && stored.has(Number(id))) {
        const memory = stored.get(Number(id))!;
        response.end(JSON.stringify(omitMembership && Number(id) === 99
          ? { ...memory, linked_memory_ids: undefined } : memory));
        return;
      }
      if (request.method === "DELETE" && path === "/api/v1/memories/99/links/42") {
        mutations.push(`DELETE ${path}`);
        if (!stored.get(99)!.linked_memory_ids?.includes(42)) {
          response.statusCode = 404;
          response.end('{"error":"Link not found"}');
        } else {
          stored.get(99)!.linked_memory_ids = [];
          unrelated.linked_memory_ids = [];
          response.end('{"success":true}');
        }
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
    runtime.registerProvider("link-presence", { api: "openai-completions", apiKey: "fixture-only",
      baseUrl: `${origin}/v1`, models: [{ id: "memory", name: "memory", reasoning: false,
        input: ["text"], contextWindow: 64_000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }] });
    const instanceId = "link-presence";
    const queue = new DurableQueueStore({ directory, instanceId });
    const client = new ApiForgetfulClient({ baseUrl: `${origin}/api/v1` });
    const capture = new CaptureService({ queue, client, instanceId,
      model: new PiMemoryModel(new ModelRegistry(runtime),
        { provider: "link-presence", id: "memory" }) });
    const snapshot: CaptureSnapshot = { id: "snapshot", instanceId, finalEntryId: "answer",
      context: { cwd: directory, sessionId: "capture", branchId: "main",
        project: { id: 7, name: "Link presence" } },
      entries: [{ id: "user", role: "user",
        text: "We adopted two retries for transient failures." },
        { id: "answer", role: "assistant", text: "Recorded." }],
      mode: "auto", scope: "global", policy: "Save supported knowledge.", modelVersion: "memory",
      createdAt: new Date().toISOString() };

    // Act: process capture and read its durable result after reopening the queue.
    const queued = await capture.enqueue(snapshot);
    const result = await capture.checkpoint();
    const reopened = new DurableQueueStore({ directory, instanceId });
    const finished = await reopened.getJob(queued.jobId);

    // Assert: use fresh membership, never DELETE an absent edge, and preserve saved memories.
    assert.deepEqual(unexpectedRequests, []);
    assert.deepEqual(result.errors, []);
    assert.equal(finished?.status, "complete", finished?.lastError);
    assert.equal(finished?.callCount, 3);
    assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decision",
      "submit_capture_links"]);
    assert.deepEqual(mutations, ["present", "added during review", "unreported membership"]
      .includes(scenario) ? ["POST /api/v1/memories", "DELETE /api/v1/memories/99/links/42"]
        : ["POST /api/v1/memories"]);
    omitMembership = false;
    assert.deepEqual((await client.get(99)).linked_memory_ids, []);
    assert.deepEqual((await client.get(42)).linked_memory_ids, []);
  });
}
