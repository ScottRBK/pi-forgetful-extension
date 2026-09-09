import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  ModelRegistry,
  ModelRuntime,
} from "@earendil-works/pi-coding-agent";
import { PiMemoryModel } from "../src/model.ts";

test(
  "background memory completion preserves the Pi session at the real provider boundary",
  { timeout: 10_000 },
  async (t) => {
    const requests: Array<{
      headers: Record<string, string | string[] | undefined>;
      body: string;
    }> = [];
    const firstChunk = JSON.stringify({
      id: "memory-1",
      object: "chat.completion.chunk",
      created: 1,
      model: "memory",
      choices: [
        {
          index: 0,
          delta: { role: "assistant", content: "{}" },
          finish_reason: null,
        },
      ],
    });
    const finalChunk = JSON.stringify({
      id: "memory-1",
      object: "chat.completion.chunk",
      created: 1,
      model: "memory",
      choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    });
    const server = createServer(async (request, response) => {
      let body = "";
      for await (const chunk of request) body += chunk;
      requests.push({ headers: request.headers, body });
      response.writeHead(200, {
        "content-type": "text/event-stream",
        connection: "close",
      });
      const chunks = [
        {
          id: "memory-1", object: "chat.completion.chunk", created: 1, model: "memory",
          choices: [{ index: 0, delta: { role: "assistant", content: "{}" }, finish_reason: null }],
        },
        {
          id: "memory-1", object: "chat.completion.chunk", created: 1, model: "memory",
          choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        },
      ];
      response.end(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
        "data: [DONE]\n\n");
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const authDir = await mkdtemp(join(tmpdir(), "pi-forgetful-session-model-"));
    t.after(() => rm(authDir, { recursive: true, force: true }));

    const runtime = await ModelRuntime.create({
      authPath: join(authDir, "auth.json"),
      modelsPath: null,
      refreshOnCreate: false,
    });
    runtime.registerProvider("opencode-go", {
      api: "openai-completions",
      apiKey: "test-key",
      baseUrl: `http://127.0.0.1:${address.port}/v1`,
      models: [
        {
          id: "memory",
          name: "memory",
          reasoning: false,
          input: ["text"],
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: 32_000,
          maxTokens: 1_200,
        },
      ],
    });
    const registry = new ModelRegistry(runtime);
    const model = new PiMemoryModel(
      registry,
      { provider: "opencode-go", id: "memory" },
      {
        sessionId: "pi-session-123",
        transformHeaders: (headers) => ({
          ...headers,
          "x-test-hook": "applied",
        }),
      },
    );

    let result: unknown;
    try {
      result = await model.complete({
        purpose: "classification",
        policy: "Return JSON.",
        input: { prompt: "remember this" },
      });
    } catch (error) {
      const cause = error instanceof Error && error.cause instanceof Error
        ? `: ${error.cause.message}`
        : "";
      assert.fail(`${error instanceof Error ? error.message : String(error)}${cause}`);
    }

    assert.deepEqual(result, {});
    assert.equal(requests.length, 1);
    assert.equal(requests[0]?.headers["x-opencode-session"], "pi-session-123");
    assert.equal(requests[0]?.headers["x-opencode-client"], "pi");
    assert.equal(requests[0]?.headers["x-test-hook"], "applied");
    assert.equal(requests[0]?.headers.authorization, "Bearer test-key");
    assert.match(requests[0]?.body ?? "", /remember this/);

    const secondSession = new PiMemoryModel(
      registry, { provider: "opencode-go", id: "memory" },
      { sessionId: "pi-session-456" },
    );
    await secondSession.complete({
      purpose: "classification", policy: "Return JSON.", input: { prompt: "second session" },
    });
    assert.equal(requests.length, 2);
    assert.equal(requests[1]?.headers["x-opencode-session"], "pi-session-456");
    assert.equal(requests[1]?.headers.authorization, "Bearer test-key");
    assert.equal(requests[1]?.headers["x-test-hook"], undefined);

  },
);
