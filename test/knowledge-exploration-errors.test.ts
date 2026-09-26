import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer, type ServerResponse } from "node:http";
import test, { type TestContext } from "node:test";
import {
  ApiForgetfulClient, ForgetfulAbortError, ForgetfulHttpError,
} from "../src/http.ts";
import {
  executeKnowledgeRead, type KnowledgeReadRequest, type KnowledgeToolContext,
  type KnowledgeToolResult,
} from "../src/knowledge-tools.ts";
import { createToolSession, resultText } from "./pi-tool-session.ts";

const context: KnowledgeToolContext = {
  cwd: "/repo", scope: "project", project: { id: 7, name: "Current" },
};

function entity(id: number, projectIds = [7]) {
  return { id, name: `Entity ${id}`, entity_type: "System", project_ids: projectIds,
    aka: [], tags: [], notes: "Full entity details" };
}

function memory(id: number, projectIds = [7], obsolete = false) {
  return { id, title: `Memory ${id}`, content: "Observed fact", context: "Stored evidence",
    keywords: [], tags: [], project_ids: projectIds, is_obsolete: obsolete };
}

function page(result: KnowledgeToolResult) {
  const content = result.content[0];
  assert.ok(content?.type === "text");
  return JSON.parse(content.text);
}

const records = {
  "/entities/1": entity(1),
  "/entities/1/memories": { memories: [{ id: 11, title: "Linked fact" }] },
  "/entities/1/relationships": { relationships: [{ id: 21, source_entity_id: 1,
    target_entity_id: 2, relationship_type: "uses" }] },
  "/entities/search": { entities: [entity(2)] },
};

async function endpoint(t: TestContext, values: Record<string, unknown>, child?: {
  path: string; respond: (response: ServerResponse) => void;
}): Promise<string> {
  const server = createServer((request, response) => {
    const path = new URL(request.url!, "http://localhost").pathname.replace("/api/v1", "");
    if (path === child?.path) return child.respond(response);
    if (!(path in values)) {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Unexpected fixture path");
      return;
    }
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(values[path]));
  });
  t.after(() => new Promise<void>((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  }));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return `http://127.0.0.1:${address.port}/api/v1`;
}

test("entity memory pages filter foreign and obsolete records and keep offsets", async (t) => {
  // Arrange: each raw page has one eligible record; excluded records still consume page positions.
  const linked = [memory(11), memory(12, [9]), memory(13, [7], true), memory(14, [7, 9])];
  const baseUrl = await endpoint(t, { ...records,
    "/entities/1/memories": { memories: linked },
    ...Object.fromEntries(linked.map((item) => [`/memories/${item.id}`, item])),
  });
  const client = new ApiForgetfulClient({ baseUrl });
  const request = { operation: "get_entity_memories", entity_id: 1, limit: 2 };

  // Act: read both project pages and the global view of the same linked records.
  const first = await executeKnowledgeRead(client, request, context);
  const second = await executeKnowledgeRead(client, { ...request, offset: 2 }, context);
  const global = await executeKnowledgeRead(client, { ...request, limit: 100 },
    { ...context, scope: "global" });

  // Assert: foreign records remain globally visible; obsolete records never become live leads.
  assert.deepEqual(page(first), { offset: 0, limit: 2,
    items: [{ id: 11, title: "Memory 11" }], next_offset: 2, has_more: true, truncated: true });
  assert.deepEqual(page(second), { offset: 2, limit: 2,
    items: [{ id: 14, title: "Memory 14" }], next_offset: 4, has_more: false, truncated: false });
  assert.deepEqual(page(global).items.map((item: { id: number }) => item.id), [11, 12, 14]);
});

const reads: Array<{ request: KnowledgeReadRequest; childPath: string }> = [{
  request: { operation: "get_entity_memories", entity_id: 1 }, childPath: "/memories/11",
}, {
  request: { operation: "get_relationships", entity_id: 1 }, childPath: "/entities/2",
}, {
  request: { operation: "search_entities", query: "Entity" }, childPath: "/entities/2",
}];
const failures = [
  { status: 503, body: '{"detail":"Storage unavailable","trace":"service diagnostic"}',
    contentType: "application/json" },
  { status: 503, body: "upstream unavailable\nretry after maintenance", contentType: "text/plain" },
  { status: 404, body: "Not Found", contentType: "text/plain" },
  { status: 422, body: '{"detail":[{"loc":["path","id"],"msg":"invalid record"}]}',
    contentType: "application/json" },
];

for (const { request, childPath } of reads) {
  for (const { status, body, contentType } of failures) {
    test(`${request.operation} preserves child HTTP ${status} ${contentType}`, async (t) => {
      // Arrange: the parent/list succeeds but a required child read fails over local HTTP.
      const baseUrl = await endpoint(t, records, { path: childPath, respond(response) {
        response.writeHead(status, { "content-type": contentType });
        response.end(body);
      } });
      const client = new ApiForgetfulClient({ baseUrl });

      // Act / Assert: callers receive the service status and exact body, not a partial success.
      await assert.rejects(executeKnowledgeRead(client, request, context), (error: unknown) => {
        assert.ok(error instanceof ForgetfulHttpError);
        assert.equal(error.status, status);
        assert.equal(error.responseBody, body);
        assert.equal(error.message,
          `Forgetful GET /api/v1${childPath} returned HTTP ${status}: ${body}`);
        return true;
      });
    });
  }

  test(`${request.operation} propagates cancellation during its child read`, async (t) => {
    // Arrange: abort after the HTTP server receives the child request, not before the read starts.
    const controller = new AbortController();
    const baseUrl = await endpoint(t, records, { path: childPath,
      respond: () => controller.abort() });
    const client = new ApiForgetfulClient({ baseUrl });

    // Act / Assert: cancellation must not look like a successful empty graph or hydrated summary.
    await assert.rejects(executeKnowledgeRead(client, request, context, controller.signal),
      (error: unknown) => {
        assert.ok(error instanceof ForgetfulAbortError);
        assert.equal(error.message, "Forgetful request aborted");
        return true;
      });
  });
}

test("relationship pages filter foreign endpoints and keep incoming scoped links", async (t) => {
  // Arrange: the first relationship crosses the project boundary and the next points inward.
  const baseUrl = await endpoint(t, { ...records, "/entities/2": entity(2, [9]),
    "/entities/3": entity(3, [7, 9]),
    "/entities/1/relationships": { relationships: [
      { id: 21, source_entity_id: 1, target_entity_id: 2, relationship_type: "uses" },
      { id: 22, source_entity_id: 3, target_entity_id: 1, relationship_type: "stores" },
    ] },
  });
  const client = new ApiForgetfulClient({ baseUrl });
  const request = { operation: "get_relationships", entity_id: 1, limit: 1 };

  // Act: the filtered first page must still let the caller advance to the incoming link.
  const first = await executeKnowledgeRead(client, request, context);
  const second = await executeKnowledgeRead(client, { ...request, offset: 1 }, context);
  const global = await executeKnowledgeRead(client, { ...request, limit: 100 },
    { ...context, scope: "global" });

  // Assert: filtering changes items, not pagination, and never widens a project-scoped root read.
  assert.deepEqual(page(first), { offset: 0, limit: 1, items: [],
    next_offset: 1, has_more: true, truncated: true });
  assert.deepEqual(page(second), { offset: 1, limit: 1, items: [{ id: 22, source_entity_id: 3,
    target_entity_id: 1, relationship_type: "stores" }],
    next_offset: 2, has_more: false, truncated: false });
  assert.deepEqual(page(global).items.map((item: { id: number }) => item.id), [21, 22]);
  await assert.rejects(executeKnowledgeRead(client, { ...request, entity_id: 2 }, context),
    /outside the current project/);
});

test("entity search scopes and pages fetched details rather than stale summaries", async (t) => {
  // Arrange: current project membership differs from the search summaries in both directions.
  const baseUrl = await endpoint(t, {
    "/entities/search": { entities: [entity(2), entity(3, [9]), entity(4)] },
    "/entities/2": entity(2, [9]),
    "/entities/3": { ...entity(3), notes: "Fresh details" },
    "/entities/4": entity(4),
  });
  const client = new ApiForgetfulClient({ baseUrl });
  const request = { operation: "search_entities", query: "Entity", limit: 1 };

  // Act: project filtering happens after hydration; offsets apply to the filtered search results.
  const first = await executeKnowledgeRead(client, request, context);
  const second = await executeKnowledgeRead(client, { ...request, offset: 1 }, context);
  const selected = await executeKnowledgeRead(client, { ...request, project_id: 9 },
    { ...context, scope: "global" });

  // Assert: callers see fetched notes, unchanged pagination and the existing 100-record window.
  assert.deepEqual(page(first).items, [{ ...entity(3), notes: "Fresh details" }]);
  assert.equal(page(first).offset, 0);
  assert.equal(page(first).has_more, true);
  assert.equal(page(first).search_window, 100);
  assert.equal(page(first).search_window_complete, true);
  assert.deepEqual(page(second).items, [entity(4)]);
  assert.equal(page(second).offset, 1);
  assert.equal(page(second).has_more, false);
  assert.deepEqual(page(selected).items, [entity(2, [9])]);
});

test("Pi delivers raw child read errors to the next scripted model turn", async (t) => {
  // Arrange: real Pi tools and HTTP, with an entirely local scripted provider and no model API.
  const body = "storage temporarily offline\nupstream diagnostic: retry later";
  const baseUrl = await endpoint(t, { ...records,
    "/projects": { projects: [{ id: 7, name: "Current", repo_name: "test/validation" }] },
  }, { path: "/entities/2", respond(response) {
    response.writeHead(503, { "content-type": "text/plain" });
    response.end(body);
  } });
  const { session, modelResults } = await createToolSession(t, baseUrl, [
    { name: "forgetful_knowledge_read",
      arguments: { operation: "search_entities", query: "Entity" } },
    { name: "forgetful_knowledge_read",
      arguments: { operation: "get_relationships", entity_id: 1 } },
  ]);

  // Act: execute the registered tools, then let Pi pass their results to its next provider call.
  await session.prompt("Inspect the stored entity and its relationships.");

  // Assert: failed exploration is visibly an error with the exact service diagnostic intact.
  const results = modelResults.at(-1)!;
  assert.equal(results.length, 2);
  for (const result of results) {
    assert.equal(result.isError, true);
    assert.equal(resultText(result),
      `Forgetful GET /api/v1/entities/2 returned HTTP 503: ${body}`);
  }
});
