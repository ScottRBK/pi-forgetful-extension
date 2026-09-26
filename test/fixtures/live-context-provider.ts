import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { ModelRuntime } from "@earendil-works/pi-coding-agent";

// Local HTTP version of the scripted provider used in model-submission-wire.test.ts.
// Only imported in DRY_RUN mode. These deterministic choices prove wiring, never quality.
type Wire = Record<string, any>;
type Reply = string | { name: string; arguments: Wire };

function choose(request: Wire): Reply {
  const messages = request.messages as Wire[];
  const names: string[] = request.tools?.map((tool: Wire) => tool.function.name) ?? [];
  const text = (message: Wire): string => typeof message.content === "string"
    ? message.content : message.content?.map((part: Wire) => part.text ?? "").join("") ?? "";
  const results = messages.filter(message => message.role === "tool");
  const call = (name: string, args: Wire): Reply => ({ name, arguments: args });
  const pastCalls = messages.flatMap(message => message.tool_calls ?? []);
  if (names.includes("forgetful_recall_wait")) {
    if (!pastCalls.some(item => item.function.name === "forgetful_recall_wait"))
      return call("forgetful_recall_wait", {});
    if (!pastCalls.some(item => item.function.name === "forgetful_knowledge_read"))
      return call("forgetful_knowledge_read", { operation: "list_documents" });
    return "Scripted wiring response; not a semantic quality judgment. Observed tool results: " +
      results.map(text).join("\n");
  }
  const inputMessage = messages.find(message => message.role === "user" &&
    text(message).trimStart().startsWith("{"));
  assert.ok(inputMessage, "Private request must contain a current task");
  const input = JSON.parse(text(inputMessage));
  const history = messages.filter(message => message.role === "user" &&
    text(message).startsWith("Historical record "))
    .map(message => JSON.parse(text(message).slice(text(message).indexOf("\n") + 1)));
  if (names.includes("submit_capture_candidates")) {
    const source = history.some(entry => JSON.stringify(entry).includes("src/batch-policy.ts"));
    if (source && results.length === 0)
      return call("inspect_source", { path: "src/batch-policy.ts" });
    const users = history.filter(entry => entry.message?.role === "user");
    const ends = [users[0], users.at(-1)].map(entry => [entry.id, entry] as const);
    const evidence = [...new Map(ends).values()];
    const inspection = source ? JSON.parse(text(results[0]!)) : undefined;
    if (inspection) assert.equal(inspection.result.status, "ok");
    return call("submit_capture_candidates", { candidates: [{
      id: "wire-observation", title: "Context wiring observation",
      content: inspection ? inspection.result.content :
        evidence.map(entry => entry.message.content).join("\n"),
      context: "Scripted transport fixture, requiring no semantic judgment",
      keywords: ["context"], tags: ["wiring"],
      evidenceType: inspection ? "observation" : "userDecision",
      sourceEntryIds: inspection ? [inspection.evidenceEntry.id] : evidence.map(entry => entry.id),
      ...(inspection ? { sourceFiles: inspection.result.source_files,
        sourceRepo: inspection.result.source_repo } : {}),
    }] });
  }
  if (names.includes("submit_capture_decision")) return call("submit_capture_decision", {
    action: "create", reason: "New isolated fixture record",
  });
  if (names.includes("submit_capture_decisions")) return call("submit_capture_decisions", {
    decisions: input.candidates.map((item: Wire) => ({ candidateId: item.candidate.id,
      action: "create", reason: "New isolated fixture record" })),
  });
  if (names.includes("submit_capture_links")) return call("submit_capture_links", {
    reviews: input.candidates.map((item: Wire) => ({ candidateId: item.candidateId,
      decisions: item.eligibleMemoryIds.map((memoryId: number) => ({ memoryId,
        action: "keep", reason: "Leave fixture connections as observed" })) })),
  });
  if (names.includes("submit_recall_review")) {
    if (results.length === 0) return call("read_forgetful", {
      operation: "search_entities", query: "mobile lab",
    });
    const searched = JSON.parse(text(results[0]!));
    assert.ok(Array.isArray(searched.record?.items),
      "Entity search must return a real read result");
    if (results.length === 1) return call("read_forgetful", { operation: "list_documents" });
    const listed = JSON.parse(text(results[1]!));
    const documentId = listed.record.items?.[0]?.id;
    if (results.length === 2) {
      if (documentId) return call("read_forgetful", {
        operation: "get_document", document_id: documentId,
      });
      const memoryId = input.availableSources.memoryIds[0];
      assert.ok(memoryId, "Capture must have written a memory for dry wiring validation");
      return call("read_forgetful", { operation: "get_memory", memory_id: memoryId });
    }
    const read = JSON.parse(text(results.at(-1)!));
    assert.ok(read.record.content, "Private read must return actual stored content");
    return call("submit_recall_review", { summary: read.record.content,
      memoryIds: documentId ? [] : [read.record.id],
      ...(documentId ? { documentIds: [documentId] } : {}), reason: "Read the fixture record" });
  }
  assert.equal(names.length, 0, `Unexpected private task: ${names.join(", ")}`);
  return JSON.stringify({ search: true, queries: ["stored context"], entities: [],
    queryIntent: "Find stored context for the current question", repositorySpecific: true });
}

export async function scriptedRuntime(t: TestContext, directory: string) {
  const requests: Wire[] = [];
  const server = createServer(async (request, response) => {
    try {
      let body = "";
      for await (const chunk of request) body += chunk;
      const parsed = JSON.parse(body);
      requests.push(parsed);
      const reply = choose(parsed);
      const base = { id: `wire-${requests.length}`, object: "chat.completion.chunk",
        created: 1, model: "same-main-and-memory" };
      const tool = typeof reply !== "string";
      const delta = tool ? { role: "assistant", tool_calls: [{ index: 0,
        id: `call-${requests.length}`, type: "function", function: {
          name: reply.name, arguments: JSON.stringify(reply.arguments),
        } }] } : { role: "assistant", content: reply };
      const chunks = [
        { ...base, choices: [{ index: 0, delta, finish_reason: null }] },
        { ...base, choices: [{ index: 0, delta: {},
          finish_reason: tool ? "tool_calls" : "stop" }],
        usage: { prompt_tokens: 100, completion_tokens: 100, total_tokens: 200 } },
      ];
      response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
      response.end(chunks.map(chunk => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
        "data: [DONE]\n\n");
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain" });
      response.end(String(error));
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const runtime = await ModelRuntime.create({ authPath: join(directory, "dry-auth.json"),
    modelsPath: null, refreshOnCreate: false });
  runtime.registerProvider("context-wire", { api: "openai-completions", apiKey: "fixture-only",
    baseUrl: `http://127.0.0.1:${address.port}/v1`, models: [{ id: "same-main-and-memory",
      name: "Local scripted fixture", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 128_000, maxTokens: 4096 }] });
  return { runtime, requests };
}
