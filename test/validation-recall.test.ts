import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { AssistantMessage, Context, Model } from "@earendil-works/pi-ai";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { RecallService } from "../src/recall.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

function scriptedModel(calls: Array<{ name: string; arguments: Record<string, any> }>) {
  const contexts: Context[] = [];
  const selected = { provider: "scripted", id: "memory", contextWindow: 200_000,
    maxTokens: 16_384, input: ["text"] } as Model<any>;
  const model = new PiMemoryModel({
    find: () => selected,
    async complete(_model, context): Promise<AssistantMessage> {
      contexts.push(structuredClone(context));
      const call = calls[contexts.length - 1];
      assert.ok(call, "Recall must finish with its validated review");
      return { role: "assistant", api: "openai-completions", provider: "scripted",
        model: "memory", timestamp: Date.now(), stopReason: "toolUse",
        content: [{ type: "toolCall", id: `call-${contexts.length}`, ...call }],
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
    },
  }, selected);
  return { model, contexts };
}

const plan = { name: "submit_recall_plan", arguments: {
  search: true, queries: ["Recall validation"], queryIntent: "Find the approved decision",
  entities: [],
} };
const request = { prompt: "Recall the approved decision",
  context: { cwd: "/work", sessionId: "validation", branchId: "main" }, scope: "global" as const,
  classificationPolicy: "", recallPolicy: "" };

// These bodies are sent unchanged to the actual server to establish its own error wording.
const invalidSearches = [
  {},
  { query: "", query_context: "Find the decision" },
  { query: 42, query_context: "Find the decision" },
  { query: "decision" },
  { query: "decision", query_context: false },
  { query: "decision", query_context: "why", k: 21 },
  { query: "decision", query_context: "why", k: null },
  { query: "decision", query_context: "why", max_links_per_primary: -1 },
  { query: "decision", query_context: "why", max_links_per_primary: "many" },
];

test("recall forwards real REST validation errors and accepts corrected reads", realOptions,
  async (t) => {
    // Arrange: only the external model is scripted; REST uses isolated upstream storage.
    const baseUrl = await startForgetful(t);
    const created = await fetch(`${baseUrl}/memories`, { method: "POST",
      headers: { "content-type": "application/json" }, body: JSON.stringify({
        title: "Recall validation", content: "The approved deadline is thirty seconds.",
        context: "User approved the decision.", keywords: ["recall"], tags: ["decision"],
        importance: 8,
      }) });
    assert.equal(created.status, 201);
    const saved = await created.json() as { id: number };
    for (const fields of invalidSearches) {
      const raw = await fetch(`${baseUrl}/memories/search`, { method: "POST",
        headers: { "content-type": "application/json" }, body: JSON.stringify({
          query: undefined, query_context: undefined, strict_project_filter: false,
          k: 3, include_links: 1, max_links_per_primary: 5,
          ...fields,
        }) });
      assert.equal(raw.status, 400);
      const body = await raw.text();
      const f = scriptedModel([plan,
        { name: "read_forgetful", arguments: { operation: "search_memories", ...fields } },
        { name: "read_forgetful", arguments: { operation: "search_memories",
          query: "Recall validation", query_context: "Find the approved decision", k: 1,
          include_links: false, max_links_per_primary: 0 } },
        { name: "submit_recall_review", arguments: {
          summary: "The approved deadline is thirty seconds.", memoryIds: [saved.id],
          reason: "The corrected read confirms the approved decision.",
        } },
      ]);
      const service = new RecallService(new ApiForgetfulClient({ baseUrl }), f.model);

      // Act: the reviewer receives upstream errors, corrects its read and submits evidence.
      const result = await service.recall(request);

      // Assert: no local schema or normalization hides the server's validation body.
      const feedback = f.contexts[2]?.messages.find((message) =>
        message.role === "toolResult" && message.isError);
      assert.ok(feedback && feedback.role === "toolResult", JSON.stringify(result));
      assert.deepEqual(feedback.content, [{ type: "text",
        text: `Forgetful POST /api/v1/memories/search returned HTTP 400: ${body}` }],
      JSON.stringify(fields));
      assert.match(result.text, /The approved deadline is thirty seconds\./, result.diagnostic);
      assert.deepEqual(result.memoryIds, [saved.id]);
      const correction = f.contexts[3]?.messages.filter((message) =>
        message.role === "toolResult").at(-1);
      assert.ok(correction && correction.role === "toolResult" && !correction.isError);
      assert.match(JSON.stringify(correction.content), /approved deadline is thirty seconds/);
      assert.equal(f.contexts.length, 4);
    }
  });

test("direct recall defaults to thirty seconds and still cancels on deadline", async (t) => {
  // Arrange: hold the external model so only the overall service deadline can settle recall.
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const service = new RecallService(new ApiForgetfulClient({
    baseUrl: "http://127.0.0.1:18000/api/v1",
  }), { async complete() { return new Promise(() => undefined); } });
  let settled = false;

  // Act: advance to just before thirty seconds, then to the deadline.
  const pending = service.recall(request);
  void pending.then(() => { settled = true; });
  await new Promise<void>((resolve) => setImmediate(resolve));
  t.mock.timers.tick(29_999);
  await new Promise<void>((resolve) => setImmediate(resolve));

  // Assert: the former ten-second deadline must not terminate this request.
  assert.equal(settled, false);
  t.mock.timers.tick(1);
  const result = await pending;
  assert.equal(result.reason, "deadline-exceeded");
  assert.match(result.diagnostic ?? "", /30000 ms/);
});

for (const [label, settings, expected] of [
  ["default", {}, 30_000],
  ["explicit legacy timeout", { timeout_ms: 1_200 }, 1_200],
] as const) {
  test(`extension recall uses the ${label} overall deadline`, async (t) => {
    // Arrange: exercise real extension wiring and model/read services; script the provider only.
    const { createForgetfulExtension } = await import("../src/extension.ts");
    const { loadForgetfulConfig } = await import("../src/config.ts");
    const root = await mkdtemp(join(tmpdir(), "validation-recall-deadline-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(join(agentDir, "forgetful", "settings.json"), JSON.stringify({
      model: "scripted/memory", capture_mode: "off", recall_model_timeout_ms: 60_000,
      ...settings,
    }));
    const selected = { provider: "scripted", id: "memory", contextWindow: 200_000,
      maxTokens: 16_384, input: ["text"] } as Model<any>;
    let providerSignal: AbortSignal | undefined;
    let waitTool: any;
    let start!: () => void;
    const started = new Promise<void>((resolve) => { start = resolve; });
    const handlers = new Map<string, Array<(event: any, ctx: any) => unknown>>();
    const ctx: any = { cwd: root, hasUI: false, isProjectTrusted: () => true,
      sessionManager: { getSessionId: () => "deadline", getLeafId: () => null,
        getBranch: () => [], getEntries: () => [] },
      modelRegistry: { find: () => selected,
        async complete(_model: unknown, _context: unknown, options: { signal?: AbortSignal }) {
          providerSignal = options.signal;
          start();
          return new Promise(() => undefined);
        } },
    };
    createForgetfulExtension({ agentDir, dependencies: {
      client: new ApiForgetfulClient({ baseUrl: "http://127.0.0.1:18000/api/v1" }),
      resolveWorkContext: () => ({ ...request.context, cwd: root,
        project: { id: 7, name: "Deadline" }, projects: [] }),
    } })({ on(name: string, handler: (event: any, ctx: any) => unknown) {
      handlers.set(name, [...(handlers.get(name) ?? []), handler]);
    }, registerCommand() {}, registerShortcut() {},
    registerTool(tool: any) { waitTool = tool; }, sendMessage() {},
    appendEntry() {}, events: { on() {}, off() {} },
    } as any);
    const emit = async (name: string, event: any) => {
      for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
    };
    await emit("session_start", { type: "session_start", reason: "new" });
    const config = await loadForgetfulConfig({ agentDir, cwd: root, trusted: true });

    // Act: begin automatic recall and move to just before its configured deadline.
    t.mock.timers.enable({ apis: ["setTimeout"] });
    await emit("before_agent_start", { type: "before_agent_start", prompt: request.prompt,
      systemPrompt: "test" });
    await started;
    let waitSettled = false;
    const waiting = waitTool.execute("wait", {}, undefined, undefined, ctx);
    void waiting.then(() => { waitSettled = true; });
    await new Promise<void>((resolve) => setImmediate(resolve));
    t.mock.timers.tick(expected - 1);
    await new Promise<void>((resolve) => setImmediate(resolve));

    // Assert: transport timeout and private model timeout are independent of overall recall.
    assert.equal(providerSignal?.aborted, false);
    assert.equal(waitSettled, false, "recall wait shares the overall deadline, not HTTP timeout");
    t.mock.timers.tick(1);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(providerSignal?.aborted, true);
    await waiting;
    assert.equal(config.recallDeadlineMs, expected);
    assert.equal(config.instance.timeoutMs, settings.timeout_ms ?? 10_000);
    await emit("session_shutdown", { type: "session_shutdown" });
  });
}

test("reviewer receives upstream missing-field and ID read errors, then corrects them",
  realOptions, async (t) => {
    // Arrange: compare each private read with the same direct request to isolated real REST.
    const baseUrl = await startForgetful(t);
    const cases = [
      { arguments: { operation: "search_entities" }, path: "/entities/search",
        body: { limit: 100 } },
      { arguments: { operation: "search_entities", query: "" }, path: "/entities/search",
        body: { query: "", limit: 100 } },
      ...[
        ["get_memory", "memory_id", "/memories"],
        ["get_entity", "entity_id", "/entities"],
        ["get_entity_memories", "entity_id", "/entities"],
        ["get_relationships", "entity_id", "/entities"],
        ["get_document", "document_id", "/documents"],
        ["get_code_artifact", "code_artifact_id", "/code-artifacts"],
        ["get_file", "file_id", "/files"],
      ].flatMap(([operation, field, path]) => [
        { arguments: { operation }, path: `${path}/undefined`, body: undefined },
        { arguments: { operation, [field!]: "invalid" },
          path: `${path}/invalid`, body: undefined },
        { arguments: { operation, [field!]: 0 }, path: `${path}/0`, body: undefined },
      ]),
      { arguments: { operation: "list_documents", project_id: "invalid" },
        path: "/documents?project_id=invalid", body: undefined },
      { arguments: { operation: "list_code_artifacts", project_id: "invalid" },
        path: "/code-artifacts?project_id=invalid", body: undefined },
      { arguments: { operation: "list_files", project_id: "invalid" },
        path: "/files?project_id=invalid", body: undefined },
    ];
    for (const item of cases) {
      const method = item.body ? "POST" : "GET";
      const raw = await fetch(`${baseUrl}${item.path}`, { method,
        ...(item.body ? { headers: { "content-type": "application/json" },
          body: JSON.stringify(item.body) } : {}),
      });
      assert.ok(raw.status >= 400, item.path);
      const body = await raw.text();
      const f = scriptedModel([plan,
        { name: "read_forgetful", arguments: item.arguments },
        { name: "read_forgetful", arguments: { operation: "list_projects" } },
        { name: "submit_recall_review", arguments: { summary: "", memoryIds: [],
          reason: "The corrected read succeeded, but no useful evidence was found." } },
      ]);
      const service = new RecallService(new ApiForgetfulClient({ baseUrl }), f.model);

      // Act: attempt the bad read, then a valid read through the same private tool.
      const result = await service.recall(request);

      // Assert: malformed/missing server inputs never turn into local runtime exceptions.
      const feedback = f.contexts[2]?.messages.find((message) =>
        message.role === "toolResult" && message.isError);
      assert.ok(feedback && feedback.role === "toolResult", JSON.stringify(result));
      const path = new URL(`${baseUrl}${item.path}`).pathname;
      assert.deepEqual(feedback.content, [{ type: "text",
        text: `Forgetful ${method} ${path} returned HTTP ${raw.status}: ${body}` }],
      JSON.stringify(item.arguments));
      const correction = f.contexts[3]?.messages.filter((message) =>
        message.role === "toolResult").at(-1);
      assert.ok(correction && correction.role === "toolResult" && !correction.isError);
      assert.equal(result.reason, "review-no-relevant-results", result.diagnostic);
    }
  });

test("reviewer retains read-only access, local paging and boolean link translation", realOptions,
  async (t) => {
    // Arrange: monitor only the public REST boundary of an isolated upstream server.
    const baseUrl = await startForgetful(t);
    const dispatched: string[] = [];
    const client = new ApiForgetfulClient({ baseUrl,
      fetchImpl: async (url, options) => {
        dispatched.push(`${options?.method} ${new URL(String(url)).pathname}`);
        return fetch(url, options);
      },
    });
    const invalid = [
      { operation: "delete_memory", memory_id: 1 },
      { operation: "create_memory", title: "Must not write" },
      { operation: "list_projects", limit: 101 },
      { operation: "search_entities", query: "decision", limit: 101 },
      { operation: "get_document", document_id: 1, limit: 5001 },
      { operation: "list_projects", offset: -1 },
      { operation: "list_projects", offset: 10_000_001 },
      { operation: "search_memories", query: "decision", query_context: "why", limit: 3 },
      { operation: "search_memories", query: "decision", query_context: "why", offset: 0 },
      { operation: "search_memories", query: "decision", query_context: "why",
        include_links: 2 },
    ];
    const f = scriptedModel([plan,
      ...invalid.map((arguments_) => ({ name: "read_forgetful", arguments: arguments_ })),
      { name: "read_forgetful", arguments: { operation: "list_projects", limit: 100 } },
      { name: "submit_recall_review", arguments: { summary: "", memoryIds: [],
        reason: "No useful stored evidence was found." } },
    ]);

    // Act: local controls reject these calls and still allow a corrected bounded read.
    const result = await new RecallService(client, f.model).recall(request);

    // Assert: no unknown operation can turn into a write or an unbounded read.
    const results = f.contexts.at(-1)!.messages.filter((message) => message.role === "toolResult");
    assert.equal(results.length, invalid.length + 1);
    assert.ok(results.slice(0, -1).every((message) => message.isError));
    assert.equal(results.at(-1)!.isError, false);
    assert.deepEqual(dispatched, ["POST /api/v1/memories/search", "GET /api/v1/projects"]);
    assert.equal(result.reason, "review-no-relevant-results", result.diagnostic);
  });
