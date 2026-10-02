import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import type { ForgetfulClient } from "../src/contracts.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DEFAULT_MEMORY_POLICIES } from "../src/policies.ts";
import { RecallService } from "../src/recall.ts";

const noSearch = { search: false, queries: [], queryIntent: "", entities: [] };

test("recall accepts the planner tool, not accompanying commentary or JSON drafts", {
  timeout: 10_000,
}, async (t) => {
  // Arrange: real Pi SDK and recall service; only the external HTTP provider is simulated.
  const requests: Array<Record<string, any>> = [];
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push(JSON.parse(body));
    const base = { id: "plan", object: "chat.completion.chunk", created: 1, model: "memory" };
    const chunks = [
      { ...base, choices: [{ index: 0, delta: {
        role: "assistant", content: '{"search":true} broken draft\n{"search":true}',
        tool_calls: [{ index: 0, id: "plan-call", type: "function",
          function: { name: "submit_recall_plan", arguments: JSON.stringify(noSearch) } }],
      }, finish_reason: null }] },
      { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }] },
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
  const directory = await mkdtemp(join(tmpdir(), "pi-plan-wire-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const runtime = await ModelRuntime.create({
    authPath: join(directory, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  runtime.registerProvider("plan-test", {
    api: "openai-completions", apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    models: [{ id: "memory", name: "memory", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 32_000, maxTokens: 1200 }],
  });
  const model = new PiMemoryModel(new ModelRegistry(runtime), {
    provider: "plan-test", id: "memory",
  });
  let searches = 0;
  const client = { async search() { searches++; return []; } } as unknown as ForgetfulClient;
  const service = new RecallService(client, model);

  // Act: incidental text says search, but only the submitted tool arguments authorize a decision.
  const result = await service.recall({
    prompt: "Thanks", scope: "global", projects: [],
    context: { cwd: directory, sessionId: "session", branchId: "branch" },
    classificationPolicy: DEFAULT_MEMORY_POLICIES.classification, recallPolicy: "Use evidence",
  });

  // Assert: no fallback parses the draft or combines it with the final submission.
  assert.equal(result.reason, "planner-no-search", result.diagnostic);
  assert.equal(searches, 0);
  assert.equal(requests.length, 1);
  assert.equal(requests[0]?.tools?.[0]?.function?.name, "submit_recall_plan");
});
