import assert from "node:assert/strict";
import test from "node:test";
import type { KnowledgeClient, Memory, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { KnowledgeReadService } from "../src/knowledge-read.ts";
import { RecallService } from "../src/recall.ts";

const memory: Memory = {
  id: 11, title: "Archive access", content: "The archive opens by appointment.",
  context: "Visitor arrangements", keywords: [], tags: [], project_ids: [3],
  document_ids: [31], is_obsolete: false,
};
const document = {
  id: 31, title: "Archive entrance", description: "Access arrangements",
  content: "Visitors use the east entrance.", tags: [], project_id: 3,
};
const recallRequest = {
  prompt: "How do I visit the archive?",
  context: { cwd: "/unavailable", project: { id: 3, name: "Archive" },
    sessionId: "fresh", branchId: "main" },
  scope: "project" as const, classificationPolicy: "Find history",
  recallPolicy: "Useful facts only", deadlineMs: 5_000,
};

function clientWithResponses(
  overrides: Record<string, (signal?: AbortSignal) => Response | Promise<Response>>,
) {
  return new ApiForgetfulClient({ baseUrl: "https://forgetful.test",
    fetchImpl: async (url, init) => {
      const path = new URL(String(url)).pathname;
      if (overrides[path]) return overrides[path](init?.signal ?? undefined);
      if (path === "/memories/search") return Response.json({ primary_memories: [memory],
        linked_memories: [] });
      if (path === "/documents/31") return Response.json(document);
      if (path === "/entities/search") return Response.json({ entities: [] });
      throw new Error(`Unexpected fixture request ${path}`);
    } });
}

function reviewingModel(review: (request: ModelRequest) => unknown) {
  return { async complete(request: ModelRequest) {
    if (request.purpose === "classification") return { search: true, queries: ["archive"],
      queryIntent: "Find visiting arrangements", entities: ["Archive"] };
    return review(request);
  } };
}

test("private review receives optional failures and sibling evidence", async () => {
  // Arrange: use the real HTTP adapter; only the external service/model are simulated.
  const client = clientWithResponses({ "/entities/search": () =>
    new Response("ENTITY_SERVICE_DOWN password=hidden-value", { status: 503 }) });
  let reviewInput: Record<string, unknown> | undefined;
  const service = new RecallService(client, reviewingModel((request) => {
    reviewInput = request.input as Record<string, unknown>;
    return request.submission!.validate({ summary: "Visitors use the east entrance.",
      memoryIds: [], documentIds: [31], reason: "The stored document describes access." });
  }));

  // Act.
  const result = await service.recall(recallRequest);

  // Assert: errors have their own private channel and cannot become citation sources.
  assert.match(JSON.stringify(reviewInput?.knowledgeFailures), /ENTITY_SERVICE_DOWN/);
  assert.doesNotMatch(JSON.stringify(reviewInput), /hidden-value/);
  assert.match(String(reviewInput?.retrievedContext), /Visitors use the east entrance/);
  assert.doesNotMatch(String(reviewInput?.retrievedContext), /ENTITY_SERVICE_DOWN/);
  assert.deepEqual(reviewInput?.availableSources, { memoryIds: [11], entityIds: [],
    relationshipIds: [], documentIds: [31], codeArtifactIds: [], fileIds: [] });
  assert.deepEqual(result.documentIds, [31]);
  assert.match(result.text, /Visitors use the east entrance/);
  assert.doesNotMatch(JSON.stringify(result), /ENTITY_SERVICE_DOWN|hidden-value/);
});

const entity = { id: 21, name: "Archive", entity_type: "System", aka: [], tags: [],
  project_ids: [3] };
const attachmentMemory = { ...memory, document_ids: [31, 32], code_artifact_ids: [41, 42],
  file_ids: [51] };

function graphResponses(): Record<string, () => Response> {
  return {
    "/entities/search": () => Response.json({ entities: [entity] }),
    "/entities/21": () => Response.json(entity),
    "/entities/22": () => Response.json({ ...entity, id: 22, name: "Museum" }),
    "/entities/21/relationships": () => Response.json({ relationships: [{ id: 61,
      source_entity_id: 21, target_entity_id: 22, relationship_type: "part_of" }] }),
    "/entities/21/memories": () => Response.json({ memories: [{ id: 12, title: "Hours" }] }),
    "/memories/12": () => Response.json({ ...memory, id: 12 }),
    "/documents/32": () => Response.json({ ...document, id: 32, title: "Archive hours" }),
    "/code-artifacts/41": () => Response.json({ id: 41, title: "Opening hours",
      description: "Hours", code: "openByAppointment()", language: "typescript",
      tags: [], project_id: 3 }),
    "/code-artifacts/42": () => Response.json({ id: 42, title: "Booking",
      description: "Booking", code: "bookVisit()", language: "typescript",
      tags: [], project_id: 3 }),
    "/files": () => Response.json({ files: [{ id: 51, filename: "archive.txt",
      description: "Archive information", mime_type: "text/plain", size_bytes: 100,
      tags: [], project_id: 3 }] }),
  };
}

for (const [path, operation, sibling] of [
  ["/entities/21", "get_entity 21", "Document #31"],
  ["/entities/21/relationships", "get_relationships 21", "Document #31"],
  ["/entities/22", "get_entity 22", "Document #31"],
  ["/entities/21/memories", "get_entity_memories 21", "Document #31"],
  ["/memories/12", "get_memory 12", "Document #31"],
  ["/documents/31", "get_document 31", "Document #32"],
  ["/code-artifacts/41", "get_code_artifact 41", "Code artifact #42"],
  ["/files", "list_files 3", "Document #31"],
]) {
  test(`optional ${operation} failure preserves diagnostics and siblings`, async () => {
    // Arrange: each failed operation uses the actual HTTP adapter with a non-JSON 404 body.
    const client = clientWithResponses({ ...graphResponses(), [path]: () =>
      new Response("Not Found: LOOKUP_FAILED password=hidden-value", { status: 404 }) });
    const service = new KnowledgeReadService(client.knowledge, client.get.bind(client));

    // Act.
    const result = await service.expand({ memories: [attachmentMemory], entityNames: ["Archive"],
      scope: "project", projectId: 3 });

    // Assert: failed records remain separate from the content used for recall evidence.
    assert.deepEqual(result.failures?.map((failure) => failure.operation), [operation]);
    assert.match(result.failures![0].message, /HTTP 404: Not Found: LOOKUP_FAILED/);
    assert.doesNotMatch(result.failures![0].message, /hidden-value/);
    assert.ok(result.text.includes(sibling), result.text);
    assert.doesNotMatch(result.text, /LOOKUP_FAILED|Not Found/);
  });
}

test("unexpected expansion errors preserve diagnostics and attachment evidence", async () => {
  // Arrange: a transport port supplies a malformed list instead of rejecting the read.
  const client = { searchEntities: async () => ({ invalid: true }),
    getDocument: async () => document } as unknown as KnowledgeClient;
  const service = new KnowledgeReadService(client);

  // Act: list processing fails outside the individual read's rejection handler.
  const result = await service.expand({ memories: [memory], entityNames: ["Archive"],
    scope: "project", projectId: 3 });

  // Assert: the original exception remains visible; independent valid records survive.
  assert.match(JSON.stringify(result.failures), /not iterable/);
  assert.deepEqual(result.documentIds, [31]);
  assert.match(result.text, /Visitors use the east entrance/);
  assert.doesNotMatch(result.text, /not iterable/);
});

test("private search failure preserves responseBody and sanitized field details", async () => {
  // Arrange: a JSON service diagnostic must retain its late validation details.
  const responseBody = JSON.stringify({ detail: [{ loc: ["body", "query"],
    msg: "Validation diagnostic. ".repeat(100) + "QUERY_FIELD_ERROR" }],
  password: "hidden-value" });
  const client = clientWithResponses({ "/memories/search": () =>
    new Response(responseBody, { status: 422 }) });
  let input: { searchFailure?: { status?: number; responseBody?: string } } | undefined;
  const service = new RecallService(client, reviewingModel((request) => {
    input = request.input as typeof input;
    return request.submission!.validate({ summary: "", memoryIds: [],
      reason: "No stored evidence was retrieved." });
  }));

  // Act.
  const result = await service.recall(recallRequest);

  // Assert: structured original diagnostics reach only private review.
  assert.equal(input?.searchFailure?.status, 422);
  assert.match(input?.searchFailure?.responseBody ?? "", /QUERY_FIELD_ERROR/);
  assert.match(input?.searchFailure?.responseBody ?? "", /"loc":\["body","query"\]/);
  assert.doesNotMatch(JSON.stringify(input?.searchFailure), /hidden-value/);
  assert.equal(result.text, "");
  assert.deepEqual(result.memoryIds, []);
});

test("private search failures retain safe network causes without following cycles", async () => {
  // Arrange: fetch has a useful underlying refusal and a cyclic cause chain.
  const refusal = new Error("connect ECONNREFUSED 127.0.0.1:8020 password=hidden-value");
  const failure = new TypeError("fetch failed", { cause: refusal });
  refusal.cause = failure;
  const client = clientWithResponses({ "/memories/search": () => { throw failure; } });
  let input: { searchFailure?: { message?: string } } | undefined;
  const service = new RecallService(client, reviewingModel((request) => {
    input = request.input as typeof input;
    return request.submission!.validate({ summary: "", memoryIds: [],
      reason: "No stored evidence was retrieved." });
  }));

  // Act.
  const result = await service.recall(recallRequest);

  // Assert: useful causes survive, but credentials, stacks and raw evidence do not escape.
  const message = input?.searchFailure?.message ?? "";
  assert.match(message, /fetch failed/);
  assert.match(message, /ECONNREFUSED 127\.0\.0\.1:8020/);
  assert.equal(message.match(/fetch failed/g)?.length, 1);
  assert.doesNotMatch(JSON.stringify(input?.searchFailure), /hidden-value|stack|\.test\.ts/);
  assert.equal(result.text, "");
  assert.deepEqual(result.memoryIds, []);
});

test("successful empty optional lookups are distinguishable from network failures", async () => {
  // Arrange: the same public request gets a successful empty lookup and then a failed lookup.
  const network = new Error("fetch failed", {
    cause: new Error("connect ECONNREFUSED 127.0.0.1:8020 password=hidden-value"),
  });
  const inputs: Record<string, unknown>[] = [];
  const model = reviewingModel((request) => {
    inputs.push(request.input as Record<string, unknown>);
    return request.submission!.validate({ summary: "", memoryIds: [],
      reason: "No relevant evidence." });
  });

  // Act.
  const empty = await new RecallService(clientWithResponses({}), model).recall(recallRequest);
  const failed = await new RecallService(clientWithResponses({ "/entities/search": () => {
    throw network;
  } }), model).recall(recallRequest);

  // Assert: optional failures cannot trigger a raw-memory fallback after review rejects context.
  assert.equal(inputs[0].knowledgeFailures, undefined);
  assert.match(JSON.stringify(inputs[1].knowledgeFailures), /ECONNREFUSED 127\.0\.0\.1:8020/);
  assert.doesNotMatch(JSON.stringify(inputs[1].knowledgeFailures), /hidden-value|stack/);
  assert.doesNotMatch(String(inputs[1].retrievedContext), /fetch failed|ECONNREFUSED/);
  assert.equal(empty.text, "");
  assert.equal(failed.text, "");
  assert.deepEqual(failed.memoryIds, []);
  assert.doesNotMatch(JSON.stringify(failed), /fetch failed|ECONNREFUSED/);
});

for (const cancellation of ["caller", "deadline"] as const) {
  test(`${cancellation} cancellation during enrichment never reviews raw context`, async () => {
    // Arrange: enrichments hang despite having a valid memory search result.
    const controller = new AbortController();
    let reviewStarted = false;
    const client = clientWithResponses({ "/entities/search": (signal) => {
      if (cancellation === "caller") controller.abort();
      return new Promise<Response>((_resolve, reject) => {
        if (signal?.aborted) reject(signal.reason);
        else signal?.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
    } });
    const service = new RecallService(client, reviewingModel(() => {
      reviewStarted = true;
      throw new Error("Review must not start after cancellation");
    }));

    // Act.
    const result = await service.recall({ ...recallRequest, signal: controller.signal,
      deadlineMs: cancellation === "deadline" ? 30 : 5_000 });

    // Assert: optional failure-open handling does not swallow lifecycle cancellation.
    assert.equal(reviewStarted, false);
    assert.equal(result.reason, cancellation === "caller" ? "aborted" : "deadline-exceeded");
    assert.equal(result.text, "");
    assert.deepEqual(result.memoryIds, []);
  });
}
