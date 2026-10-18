import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  estimateTokens, ModelRegistry, ModelRuntime, SessionManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type JsonObject,
} from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

function answer(): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "batch-context", model: "memory",
    content: [{ type: "text", text: "Recorded with qualifications." }], stopReason: "stop",
    timestamp: 1, usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

for (const action of ["skip", "create"] as const) {
test(`capture can ${action} six claims sharing large evidence within the default context limit`,
  { timeout: 20_000 }, async (t) => {
    // Arrange: real session, capture, queue and adapters; only external responses are scripted.
    const directory = await mkdtemp(join(tmpdir(), "capture-overlap-context-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const session = SessionManager.inMemory(directory);
    const project = { id: 1, name: "Batch context", repo_name: "test/batch-context" };
    for (let index = 0; index < 60; index++) {
      session.appendMessage({ role: "user", timestamp: 1,
        content: `Earlier discussion ${index}: ` +
          "Preserve the operational qualification. ".repeat(100) });
    }
    session.appendMessage({ ...answer(), stopReason: "toolUse", content: [{ type: "toolCall",
      id: "source-read", name: "bash", arguments: { command: "cat operational-evidence.txt" } }] });
    const source = "SOURCE_START " +
      "Shared operational evidence. ".repeat(action === "create" ? 3_000 : 2_000) + " SOURCE_END";
    const sharedId = session.appendMessage({ role: "toolResult", toolName: "bash",
      toolCallId: "source-read", content: [{ type: "text", text: source }], isError: true,
      details: { output: source, exitCode: 1 }, timestamp: 1 });
    const candidates = Array.from({ length: 6 }, (_, index) => {
      const text = `Adopt operational rule ${index}, retaining the failed-check qualification.`;
      const id = session.appendMessage({ role: "user", content: text, timestamp: 1 });
      return { id: `claim-${index}`, title: `Operational rule ${index}`, content: text,
        context: "Explicit user decision; the source check failed.", keywords: ["operations"],
        tags: [], sourceEntryIds: [sharedId, id], evidenceType: "userDecision" };
    });
    session.appendMessage(answer());
    const built = buildCaptureSnapshot({ session, instanceId: "batch-context", mode: "auto",
      scope: "project", policy: "Keep qualifications.", modelVersion: "memory",
      context: { cwd: directory, project, sessionId: session.getSessionId(),
        branchId: "branch" } });
    assert.equal(built.status, "ready");
    if (built.status !== "ready") throw new Error("Expected capture snapshot");
    const original = structuredClone(built.snapshot);
    const queue = new DurableQueueStore({ directory, instanceId: "batch-context" });
    const stored = new Map<number, Record<string, any>>();
    let jobId: string;
    const client = new ApiForgetfulClient({ baseUrl: "http://127.0.0.1/unused",
      fetchImpl: async (url, init) => {
        const path = new URL(String(url)).pathname;
        if (path.endsWith("/projects") && init?.method === "GET")
          return Response.json({ projects: [project] });
        if (path.endsWith("/memories/search") && init?.method === "POST")
          return Response.json({ primary_memories: [] });
        if (path.endsWith("/memories") && init?.method === "POST") {
          const pending = await queue.getJob(jobId);
          assert.deepEqual(pending?.snapshot.entries, original.entries);
          assert.deepEqual(pending?.snapshot.sourceConversation, original.conversation);
          const memory = { ...JSON.parse(String(init.body)), id: stored.size + 1,
            is_obsolete: false, linked_memory_ids: [] };
          stored.set(memory.id, memory);
          return Response.json(memory, { status: 201 });
        }
        const match = path.match(/\/memories\/(\d+)$/);
        if (match && init?.method === "GET" && stored.has(Number(match[1])))
          return Response.json(stored.get(Number(match[1])));
        throw new Error(`Unexpected Forgetful request: ${init?.method} ${path}`);
      } });
    const received: Array<{ name: string; input: Record<string, any> }> = [];
    let summaries = 0;
    const runtime = await ModelRuntime.create({ authPath: join(directory, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    runtime.registerProvider("batch-context", { api: "faux", apiKey: "fixture-only",
      baseUrl: "http://127.0.0.1/unused", models: [{ id: "memory", name: "Memory", reasoning: false,
        input: ["text"], contextWindow: 200_000, maxTokens: 16_384,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
      streamSimple(_model, context, options) {
        const inputTokens = context.messages.reduce((total, message) =>
          total + estimateTokens(message), 0);
        assert.ok(inputTokens + options!.maxTokens! <= 100_000,
          "Every dispatched request must include room for the reply within the unchanged cap");
        const name = providerTools(context)[0]?.name;
        let response = answer();
        if (!name) {
          summaries++;
          response.content = [{ type: "text", text: "Earlier discussion retains qualifications." }];
        } else {
          const input = decodeProviderContext(context).input;
          received.push({ name, input });
          assert.ok(["submit_capture_candidates", "submit_capture_decisions",
            "submit_capture_links"].includes(name));
          const args: JsonObject = name === "submit_capture_candidates" ? { candidates }
            : name === "submit_capture_decisions" ? {
              decisions: candidates.map(candidate => ({ candidateId: candidate.id, action,
                reason: "Retain the original qualification." })),
            } : { reviews: input.candidates.map((item: any) => ({ candidateId: item.candidateId,
              decisions: item.memories.map((memory: any) => ({ memoryId: memory.id,
                action: "ignore", reason: "Independent operational rule; no connection needed." }))
            })) };
          response = { ...response, stopReason: "toolUse", content: [{ type: "toolCall",
            id: "submission", name, arguments: args }] };
        }
        const stream = createAssistantMessageEventStream();
        stream.end(response);
        return stream;
      } });
    const model = new PiMemoryModel(new ModelRegistry(runtime),
      { provider: "batch-context", id: "memory" });
    const capture = new CaptureService({ queue, client, model, instanceId: "batch-context" });

    // Act: finish the public workflow, including any durable history-preparation slices.
    const queued = await capture.enqueue(built.snapshot);
    jobId = queued.jobId!;
    for (let pass = 0; pass < 10; pass++) {
      const result = await capture.checkpoint();
      assert.deepEqual(result.errors, []);
      if (result.continuation !== "ready") break;
    }
    const reopened = new DurableQueueStore({ directory, instanceId: "batch-context" });
    const completed = await reopened.getJob(queued.jobId);

    // Assert: history is compacted, but full cited evidence and per-candidate attribution survive.
    assert.equal(completed?.status, "complete", completed?.lastError);
    assert.equal(completed.attempts, 1);
    assert.equal(completed.callCount, action === "create" ? 4 : 2);
    assert.ok(summaries > 0);
    assert.deepEqual(received.map(task => task.name),
      ["submit_capture_candidates", "submit_capture_decisions",
        ...(action === "create" ? ["submit_capture_links", "submit_capture_links"] : [])]);
    for (const { name, input } of received.slice(1)) {
      const ids = input.candidates.map((item: any) => item.candidate?.id ?? item.candidateId);
      const selected = candidates.filter(candidate => ids.includes(candidate.id));
      assert.deepEqual(input.candidates.map((item: any) =>
        name === "submit_capture_decisions" ? item.candidate.sourceEntryIds : item.sourceEntryIds),
      selected.map(candidate => candidate.sourceEntryIds));
      const citedIds = new Set(selected.flatMap(candidate => candidate.sourceEntryIds));
      assert.deepEqual(input.evidenceEntries,
        original.entries.filter(entry => citedIds.has(entry.id)));
      assert.ok(input.candidates.every((item: any) => !("evidenceEntries" in item)),
        "Shared source records belong to the request, not repeated inside each candidate");
    }
    assert.equal(stored.size, action === "create" ? 6 : 0);
    for (const memory of stored.values()) {
      assert.match(memory.content, /retaining the failed-check qualification/);
      assert.deepEqual(memory.project_ids, [1]);
    }
    assert.deepEqual(built.snapshot, original,
      "Request deduplication cannot change pinned sources");
  });
}
