import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test, { type TestContext } from "node:test";
import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";

async function errorEndpoint(t: TestContext, status: number, body: string) {
  const server = createServer((_request, response) => {
    response.writeHead(status, { "content-type": "application/json" });
    response.end(body);
  });
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return `http://127.0.0.1:${address.port}/api/v1`;
}

for (const [status, body] of [
  [400, JSON.stringify({ detail: [{
    loc: ["body", "tags", 1],
    msg: "String should have at most 40 characters",
    input: "private-input-marker",
    ctx: { internal: "private-context-marker" },
  }], traceback: "private-trace-marker" })],
  [404, "Not Found"],
  [500, JSON.stringify({ error: "private-server-stack" })],
] as const) {
  test(`HTTP ${status} forwards the exact Forgetful response body`, async (t) => {
    // Arrange.
    const client = new ApiForgetfulClient({
      baseUrl: await errorEndpoint(t, status, body),
      token: "token-value",
    });

    // Act / Assert: the public client boundary preserves service-owned diagnostics verbatim.
    await assert.rejects(client.knowledge.unlinkMemories(1, 2), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.equal(error.status, status);
      assert.equal(error.message,
        `Forgetful DELETE /api/v1/memories/1/links/2 returned HTTP ${status}: ${body}`);
      return true;
    });
    await assert.rejects(client.listProjects(), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.equal(error.status, status);
      assert.equal(
        error.message,
        `Forgetful GET /api/v1/projects returned HTTP ${status}: ${body}`,
      );
      return true;
    });
  });
}

test(
  "oversized error responses preserve HTTP status and explain the transport limit",
  async (t) => {
    // Arrange: the body cannot be safely read beyond the configured transport boundary.
    const body = JSON.stringify({ error: "x".repeat(2_000) });
    const client = new ApiForgetfulClient({
      baseUrl: await errorEndpoint(t, 400, body),
      maxResponseBytes: 1_000,
    });

    // Act / Assert.
    await assert.rejects(client.listProjects(), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.equal(error.status, 400);
      assert.match(error.message, /HTTP 400/);
      assert.match(error.message, /response exceeded the configured size limit/);
      assert.doesNotMatch(error.message, /"x{20}/);
      return true;
    });
  },
);

test("transport exceptions retain their original diagnostic at the client boundary", async () => {
  // Arrange: an external fetch failure is distinct from a returned HTTP response.
  const failure = new Error("Socket closed after accepting the write; response outcome unknown");
  const client = new ApiForgetfulClient({ baseUrl: "http://127.0.0.1:18000/api/v1",
    fetchImpl: async () => { throw failure; } });
  // Act / Assert: callers must see the actual failure, not an invented generic diagnosis.
  await assert.rejects(client.create({ title: "Fact", content: "Supported fact.",
    context: "User evidence.", keywords: [], tags: [], project_ids: [1] }),
  (error: unknown) => error === failure);
});
