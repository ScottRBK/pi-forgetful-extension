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

for (const key of ["error", "detail"]) {
  test(`HTTP ${key} errors preserve field paths without echoing inputs or secrets`, async (t) => {
    // Arrange: both Forgetful and standard validation envelopes, including hostile extras.
    const body = JSON.stringify({ [key]: [
      { loc: ["body", "tags", 1], msg: "String should have at most 40 characters",
        type: "string_too_long", input: "private-input-marker",
        ctx: { internal: "private-context-marker" }, url: "https://internal.invalid/private" },
      { loc: ["repo_name"], msg: "Use owner/repo; Bearer secret-marker; token-value" },
    ], traceback: "private-trace-marker" });
    const baseUrl = await errorEndpoint(t, key === "error" ? 400 : 422, body);
    const client = new ApiForgetfulClient({ baseUrl, token: "token-value" });

    // Act / Assert: only actionable, sanitised fields cross the public client boundary.
    await assert.rejects(client.listProjects(), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.match(error.message, /body.tags.1: String should have at most 40 characters/);
      assert.match(error.message, /repo_name: Use owner\/repo/);
      assert.doesNotMatch(error.message, /private-|secret-marker|token-value|internal.invalid/);
      return true;
    });
  });
}

for (const [status, body] of [
  [400, "<html>private-proxy-page</html>"],
  [422, '{"detail":'],
  [500, '{"error":"private-server-stack"}'],
  [503, '{"detail":[{"msg":"private-upstream-error"}]}'],
] as const) {
  test(`HTTP ${status} with an unsafe or malformed body remains an actionable HTTP error`,
    async (t) => {
      // Arrange.
      const client = new ApiForgetfulClient({ baseUrl: await errorEndpoint(t, status, body) });
      // Act / Assert.
      await assert.rejects(client.listProjects(), (error: unknown) => {
        assert.ok(error instanceof ForgetfulHttpError);
        assert.equal(error.status, status);
        assert.match(error.message, new RegExp(`HTTP ${status}`));
        assert.doesNotMatch(error.message, /private-|JSON|SyntaxError/);
        return true;
      });
    });
}

test("oversized validation responses preserve HTTP status without exposing the response body",
  async (t) => {
    // Arrange: validators can echo a huge rejected submission in their response.
    const baseUrl = await errorEndpoint(t, 400, JSON.stringify({ error: [{
      loc: ["content"], msg: "Content too long", input: "private-input".repeat(1000),
    }] }));
    const client = new ApiForgetfulClient({ baseUrl, maxResponseBytes: 1000 });
    // Act / Assert.
    await assert.rejects(client.listProjects(), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.equal(error.status, 400);
      assert.match(error.message, /HTTP 400/);
      assert.match(error.message, /size limit/);
      assert.doesNotMatch(error.message, /private-input/);
      return true;
    });
  });

test("validation feedback bounds many errors but retains more than the old 500-character cut-off",
  async (t) => {
    // Arrange.
    const baseUrl = await errorEndpoint(t, 400, JSON.stringify({ error:
      Array.from({ length: 100 }, (_, index) => ({
        loc: ["field", index], msg: "Invalid field: " + "x".repeat(600),
      })),
    }));
    // Act / Assert.
    await assert.rejects(new ApiForgetfulClient({ baseUrl }).listProjects(), (error: unknown) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.ok(error.message.length > 500 && error.message.length <= 2000);
      assert.doesNotMatch(error.message, /field.8:/);
      return true;
    });
  });
