import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test, { type TestContext } from "node:test";
import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";

async function rejectingServer(t: TestContext) {
  const requests: Array<{ path: string; body: unknown }> = [];
  const diagnostic = '{"detail":[{"loc":["body","title"],"msg":"Service-owned rule"}]}';
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push({ path: request.url!, body: body ? JSON.parse(body) : undefined });
    response.writeHead(422, { "content-type": "application/json" });
    response.end(diagnostic);
  });
  t.after(() => new Promise<void>((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  }));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const client = new ApiForgetfulClient({
    baseUrl: `http://127.0.0.1:${address.port}/api/v1`,
  });
  const isOriginalError = (error: unknown) => {
    assert.ok(error instanceof ForgetfulHttpError);
    assert.equal(error.status, 422);
    assert.equal(error.responseBody, diagnostic);
    return true;
  };
  return { client, requests, isOriginalError };
}

test("write field failures come from REST without repairing missing, null or oversized input",
  async (t) => {
    // Arrange: the remote endpoint owns field validation; use the real HTTP adapter.
    const { client, requests, isOriginalError } = await rejectingServer(t);
    const bad = { title: "x".repeat(501), description: null, tags: 7,
      source_files: Array.from({ length: 101 }, () => ""), encoding_version: "not-a-commit" };
    const calls = [
      () => client.create(bad as any),
      () => client.knowledge.createEntity(bad as any),
      () => client.knowledge.createDocument(bad as any),
      () => client.knowledge.createCodeArtifact(bad as any),
      () => client.knowledge.updateMemory(7, bad as any),
      () => client.knowledge.updateEntity(7, bad as any),
      () => client.knowledge.updateDocument(7, bad as any),
      () => client.knowledge.updateCodeArtifact(7, bad as any),
    ];

    // Act / Assert: each unchanged body reaches REST, and its full error returns to the caller.
    for (const call of calls) await assert.rejects(call, isOriginalError);
    assert.equal(requests.length, 8);
    for (const request of requests) assert.deepEqual(request.body, bad);
    await assert.rejects(client.knowledge.createRelationship({ source_entity_id: 7,
      target_entity_id: null, relationship_type: "" } as any), isOriginalError);
    assert.deepEqual(requests.at(-1)?.body,
      { source_entity_id: 7, target_entity_id: null, relationship_type: "" });
    await assert.rejects(client.supersede(7, 8, ""), isOriginalError);
    assert.deepEqual(requests.at(-1)?.body, { reason: "", superseded_by: 8 });
  });

test("read field failures reach REST; explicit null values never become search defaults",
  async (t) => {
    // Arrange.
    const { client, requests, isOriginalError } = await rejectingServer(t);
    const request = { query: null, query_context: "", k: null,
      max_links_per_primary: null, project_ids: [], strict_project_filter: true } as any;

    // Act / Assert.
    await assert.rejects(client.search(request), isOriginalError);
    await assert.rejects(client.queryMemory(request), isOriginalError);
    assert.deepEqual(requests[0]?.body, { ...request, include_links: 0 });
    assert.deepEqual(requests[1]?.body, { ...request, include_links: 1 });
    for (const call of [
      () => client.get(0), () => client.knowledge.getEntity(0),
      () => client.knowledge.getDocument(0), () => client.knowledge.getCodeArtifact(0),
      () => client.knowledge.getFile(0), () => client.knowledge.getRelationships(0),
      () => client.knowledge.getEntityMemories(0), () => client.knowledge.listDocuments(0),
      () => client.knowledge.listCodeArtifacts(0), () => client.knowledge.listFiles(0),
      () => client.knowledge.searchEntities(""),
    ]) await assert.rejects(call, isOriginalError);
    assert.equal(requests.length, 13);
    await assert.rejects(client.get("../projects" as any), isOriginalError);
    assert.equal(requests.at(-1)?.path, "/api/v1/memories/..%2Fprojects");
  });

test("resource payloads reach REST unchanged even when they are not objects", async (t) => {
  // Arrange: these are server-owned payloads, not the extension's submission envelope.
  const { client, requests, isOriginalError } = await rejectingServer(t);
  for (const input of [null, "malformed", [1, 2]]) {
    // Act: transport must not spread these values into invented object fields.
    for (const call of [
      () => client.knowledge.createEntity(input as any),
      () => client.knowledge.createDocument(input as any),
      () => client.knowledge.createCodeArtifact(input as any),
    ]) {
      await assert.rejects(call, isOriginalError);
      // Assert: the service sees exactly what the model supplied.
      assert.deepEqual(requests.at(-1)?.body, input);
    }
  }
});
