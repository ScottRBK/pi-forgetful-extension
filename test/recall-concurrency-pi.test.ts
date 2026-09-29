import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";

for (const [configured, failedRead] of [
  [undefined, undefined], [1, undefined], [8, undefined], [2, 2],
] as const) {
  const label = `${configured ?? "default"}${failedRead ? " with a failed sibling" : ""}`;
  test(`real Pi applies recall_concurrency ${label} to searches and review`, {
    timeout: 20_000,
  }, async (t) => {
    // Arrange: real Pi lifecycle, user settings, service and transport; only external replies vary.
    const root = await mkdtemp(join(tmpdir(), "pi-recall-concurrency-"));
    const agentDir = join(root, "agent");
    const limit = configured ?? 2;
    const readCount = limit + 2;
    const arrived = { initial: [] as string[], review: [] as string[] };
    const dispatched = { initial: [] as string[], review: [] as string[] };
    const pendingResponses = new Map<string, ServerResponse>();
    const waiters: Array<() => void> = [];
    const server = createServer(async (request, response) => {
      if (request.url?.startsWith("/api/v1/projects")) {
        response.writeHead(200, { "content-type": "application/json" })
          .end(JSON.stringify({ projects: [], total: 0 }));
        return;
      }
      if (request.url !== "/api/v1/memories/search") {
        response.writeHead(404).end("Unexpected request");
        return;
      }
      let body = "";
      for await (const chunk of request) body += chunk;
      const query = JSON.parse(body).query as string;
      const stage = query.startsWith("initial-") ? "initial" : "review";
      arrived[stage].push(query);
      pendingResponses.set(query, response);
      for (const notify of waiters) notify();
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
    let closeSession: (() => Promise<void>) | undefined;
    t.after(async () => {
      await closeSession?.();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    });
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(join(agentDir, "forgetful", "settings.json"), JSON.stringify({
      base_url: baseUrl, model: "concurrency-test/memory", capture_mode: "off",
      timeout_ms: 5_000, recall_model_timeout_ms: 5_000, recall_concurrency: configured,
    }));
    const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    const mainContexts: Context[] = [];
    const memoryContexts: Context[] = [];
    runtime.registerProvider("concurrency-test", {
      api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
        input: ["text"], contextWindow: 64_000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
      streamSimple(model, context) {
        const contexts = model.id === "main" ? mainContexts : memoryContexts;
        contexts.push(structuredClone(context));
        let content: AssistantMessage["content"];
        if (model.id === "main") {
          content = contexts.length === 1 ? [{ type: "toolCall", id: "wait",
            name: "forgetful_recall_wait", arguments: {} }] :
            [{ type: "text", text: "Reviewed recall received." }];
        } else if (contexts.length === 1) {
          content = [{ type: "text", text: JSON.stringify({ search: true,
            queries: ["initial-1", "initial-2"], queryIntent: "Find decisions", entities: [] }) }];
        } else if (contexts.length === 2) {
          content = Array.from({ length: readCount }, (_, index) => ({ type: "toolCall" as const,
            id: `read-${index + 1}`, name: "read_forgetful", arguments: {
              operation: "search_memories", query: `review-${index + 1}`,
              query_context: "Read missing decision", k: 1, include_links: false,
            } }));
        } else {
          content = [{ type: "toolCall", id: "submission", name: "submit_recall_review",
            arguments: { summary: "Concurrent reads supplied the missing decisions.",
              memoryIds: Array.from({ length: readCount }, (_, index) => 101 + index)
                .filter((id) => id !== 100 + Number(failedRead)),
              reason: "The additional stored records were read." } }];
        }
        const usesTools = content.some((part) => part.type === "toolCall");
        const message: AssistantMessage = { role: "assistant", content, api: "faux",
          provider: "concurrency-test", model: model.id, timestamp: Date.now(),
          stopReason: usesTools ? "toolUse" : "stop",
          usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
        const stream = createAssistantMessageEventStream();
        stream.push({ type: "done", reason: usesTools ? "toolUse" : "stop", message });
        stream.end(message);
        return stream;
      },
    });
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
      noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir, dependencies: {
        createClient: (options) => new ApiForgetfulClient({ ...options,
          fetchImpl: (url, init) => {
            // Trace actual outgoing HTTP dispatch; do not replace responses or internal services.
            if (String(url).endsWith("/memories/search")) {
              const query = JSON.parse(String(init!.body)).query as string;
              dispatched[query.startsWith("initial-") ? "initial" : "review"].push(query);
            }
            return fetch(url, init);
          },
        }),
      } })],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
      model: runtime.getModel("concurrency-test", "main"), settingsManager: settings,
      sessionManager: SessionManager.inMemory(root), resourceLoader: loader, noTools: "builtin" });
    closeSession = async () => {
      try {
        await session.abort();
        await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      } finally { session.dispose(); }
    };
    await session.bindExtensions({});
    const respond = (query: string) => {
      const id = Number(query.split("-")[1]) + (query.startsWith("review-") ? 100 : 0);
      if (query === `review-${failedRead}`) {
        pendingResponses.get(query)!.writeHead(503).end("BROKEN_READ_2");
        pendingResponses.delete(query);
        return;
      }
      pendingResponses.get(query)!.writeHead(200, { "content-type": "application/json" })
        .end(JSON.stringify({ query, primary_memories: [{ id, title: `Decision ${id}`,
          content: `Decision ${id} remains current.`, context: "Concurrency test",
          keywords: [], tags: [], project_ids: [], is_obsolete: false }],
        linked_memories: [], total_count: 1, token_count: 20, truncated: false }));
      pendingResponses.delete(query);
    };

    // Act: release replies out of order, retaining earlier calls while their sibling slots refill.
    const prompt = session.prompt("Which stored decisions apply?");
    const waitForCount = (stage: "initial" | "review", count: number) => Promise.race([
      new Promise<void>((resolve) => {
        const check = () => { if (arrived[stage].length >= count) resolve(); };
        waiters.push(check);
        check();
      }),
      prompt.then(() => { throw new Error(`Pi finished before ${stage} request ${count}`); }),
    ]);
    for (const [stage, count] of [["initial", 2], ["review", readCount]] as const) {
      const slots = Math.min(limit, count);
      await waitForCount(stage, slots);
      assert.equal(dispatched[stage].length, slots, `${stage} must respect user concurrency`);
      for (let id = slots; id <= count; id++) {
        respond(`${stage}-${id}`);
        if (id < count) await waitForCount(stage, id + 1);
      }
      for (let id = slots - 1; id > 0; id--) respond(`${stage}-${id}`);
    }
    await prompt;

    // Assert: configuration reaches both executors; all delivered content remains valid evidence.
    assert.equal(memoryContexts.length, 3);
    const feedback = memoryContexts[2]!.messages.filter((message) => message.role === "toolResult");
    assert.deepEqual(feedback.map((result) => result.toolCallId),
      Array.from({ length: readCount }, (_, index) => `read-${index + 1}`));
    assert.deepEqual(feedback.filter((result) => result.isError).map((result) => result.toolCallId),
      failedRead ? ["read-2"] : []);
    const state = memoryContexts[2]!.messages.filter((message) => message.role === "user").at(-1)!;
    const stateText = typeof state.content === "string" ? state.content : state.content
      .filter((part) => part.type === "text").map((part) => part.text).join("");
    const available = JSON.parse(stateText).availableSources.memoryIds as number[];
    assert.deepEqual(available.toSorted((a, b) => a - b), [1, 2,
      ...Array.from({ length: readCount }, (_, index) => 101 + index)
        .filter((id) => id !== 100 + Number(failedRead))],
    "the latest source snapshot must include every delivered success, regardless of finish order");
    assert.match(JSON.stringify(mainContexts.at(-1)),
      /Concurrent reads supplied the missing decisions/);
    assert.equal(dispatched.initial.length, 2, "concurrency must not raise the initial query cap");
    assert.equal(dispatched.review.length, readCount);
  });
}
