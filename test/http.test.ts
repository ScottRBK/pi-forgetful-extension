import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  ApiForgetfulClient,
  ForgetfulAbortError,
  ForgetfulSchemaError,
  ForgetfulTimeoutError,
} from "../src/http.ts";

const memory = {
  id: 7,
  title: "Keep the adapter transport neutral",
  content: "Application services use the ForgetfulClient port.",
  context: "This keeps HTTP details out of recall and capture.",
  keywords: ["adapter", "transport"],
  tags: ["architecture"],
  importance: 8,
  project_ids: [3],
  is_obsolete: false,
  linked_memory_ids: [],
};

describe("ApiForgetfulClient", () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    server = createServer(async (request, response) => {
      if (
        request.method === "POST" &&
        request.url === "/api/v1/memories/search"
      ) {
        const chunks: Buffer[] = [];
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString()) as {
          query?: string;
        };
        if (body.query === "malformed") {
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ primary_memories: [{}] }));
          return;
        }
        if (body.query === "redirect") {
          response.statusCode = 302;
          response.setHeader("location", "/api/v1/memories/search");
          response.end();
          return;
        }
        if (body.query === "slow") {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        response.setHeader("content-type", "application/json");
        response.end(
          JSON.stringify({
            query: body.query,
            primary_memories: [memory],
            linked_memories: [],
            total_count: 1,
            token_count: 10,
            truncated: false,
          }),
        );
        return;
      }
      if (
        request.method === "GET" &&
        request.url === "/api/v1/projects?repo_name=owner%2Frepo"
      ) {
        assert.equal(request.headers.authorization, "Bearer secret-token");
        response.setHeader("content-type", "application/json");
        response.end(
          JSON.stringify({
            projects: [{ id: 3, name: "forgetful", repo_name: "owner/repo" }],
            total: 1,
          }),
        );
        return;
      }
      if (request.method === "POST" && request.url === "/api/v1/memories") {
        const chunks: Buffer[] = [];
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString()) as Record<
          string,
          unknown
        >;
        assert.deepEqual(body.project_ids, [3]);
        response.statusCode = 201;
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify({ id: 8, title: body.title }));
        return;
      }
      if (request.method === "GET" && request.url === "/api/v1/memories/7") {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify(memory));
        return;
      }
      if (request.method === "DELETE" && request.url === "/api/v1/memories/7") {
        const chunks: Buffer[] = [];
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString()) as Record<
          string,
          unknown
        >;
        assert.deepEqual(body, { reason: "changed", superseded_by: 8 });
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify({ success: true }));
        return;
      }
      response.statusCode = 404;
      response.end(JSON.stringify({ error: "not found" }));
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const address = server.address();
    assert(address && typeof address !== "string");
    baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  it("searches the REST endpoint and validates a memory result", async () => {
    const client = new ApiForgetfulClient({ baseUrl });
    const memories = await client.search({
      query: "adapter",
      query_context: "Recall the adapter boundary",
      strict_project_filter: false,
    });

    assert.deepEqual(memories, [memory]);
  });

  it("uses bearer auth and implements project lookup, create, read, and supersede", async () => {
    const client = new ApiForgetfulClient({ baseUrl, token: "secret-token" });
    assert.deepEqual(await client.listProjects("owner/repo"), [
      {
        id: 3,
        name: "forgetful",
        repo_name: "owner/repo",
      },
    ]);
    const created = await client.create({
      title: "A memory",
      content: "Content",
      context: "Context",
      keywords: ["one"],
      tags: ["tag"],
      project_ids: [3],
    });
    assert.deepEqual(created, { id: 8 });
    assert.deepEqual(await client.get(7), memory);
    await client.supersede(7, 8, "changed");
  });

  it("fails closed on malformed responses and redirects", async () => {
    const client = new ApiForgetfulClient({ baseUrl });
    await assert.rejects(
      client.search({
        query: "malformed",
        query_context: "test",
        strict_project_filter: false,
      }),
      ForgetfulSchemaError,
    );
    await assert.rejects(
      client.search({
        query: "redirect",
        query_context: "test",
        strict_project_filter: false,
      }),
    );
  });

  it("enforces TLS for non-local endpoints and supports timeout and caller abort", async () => {
    assert.throws(
      () =>
        new ApiForgetfulClient({ baseUrl: "http://forgetful.example/api/v1" }),
      /TLS/,
    );
    assert.throws(
      () => new ApiForgetfulClient({ baseUrl: `${baseUrl}?token=leak` }),
      /query or fragment/,
    );
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 10 });
    await assert.rejects(
      client.search({
        query: "slow",
        query_context: "test",
        strict_project_filter: false,
      }),
      ForgetfulTimeoutError,
    );
    const controller = new AbortController();
    const pending = client.search(
      { query: "slow", query_context: "test", strict_project_filter: false },
      controller.signal,
    );
    controller.abort();
    await assert.rejects(pending, ForgetfulAbortError);
  });
});
