import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer, type ServerResponse } from "node:http";
import test, { type TestContext } from "node:test";
import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { RecallService } from "../src/recall.ts";
import type { ForgetfulClient, Memory, ModelRequest } from "../src/contracts.ts";

const context = {
  cwd: "/work/recall", repoName: "test/recall", sessionId: "session", branchId: "main",
  project: { id: 3, name: "Recall", repo_name: "test/recall" },
};
const recallRequest = {
  prompt: "Which decisions apply?", context, scope: "project" as const,
  classificationPolicy: "Find history", recallPolicy: "Review the evidence",
};

function memory(id: number, project = 3) {
  return { id, title: `Decision ${id}`, content: `Decision ${id} remains current.`,
    context: "Recall concurrency test", keywords: [], tags: [], project_ids: [project],
    is_obsolete: false };
}

async function searchServer(t: TestContext) {
  const requests: Array<{ body: Record<string, any>; response: ServerResponse }> = [];
  const waiters: Array<() => void> = [];
  const cancelled: number[] = [];
  let dispatched = 0;
  const controller = new AbortController();
  const server = createServer(async (request, response) => {
    if (request.url !== "/api/v1/memories/search") {
      response.writeHead(404).end("Unexpected request");
      return;
    }
    let text = "";
    for await (const chunk of request) text += chunk;
    const index = requests.length;
    response.once("close", () => {
      if (!response.writableEnded) cancelled.push(index);
      for (const notify of waiters) notify();
    });
    requests.push({ body: JSON.parse(text), response });
    for (const notify of waiters) notify();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    controller.abort();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const waitFor = (condition: () => boolean) => new Promise<void>((resolve) => {
    const check = () => { if (condition()) resolve(); };
    waiters.push(check);
    check();
  });
  return {
    requests, cancelled, controller,
    client: new ApiForgetfulClient({
      baseUrl: `http://127.0.0.1:${address.port}/api/v1`, timeoutMs: 10_000,
      fetchImpl: (url, init) => { dispatched++; return fetch(url, init); },
    }),
    get dispatched() { return dispatched; },
    waitForCount: (count: number) => waitFor(() => requests.length >= count),
    waitForCancelled: (count: number) => waitFor(() => cancelled.length >= count),
    respond(index: number, memories = [memory(11 + index)]) {
      const { body, response } = requests[index]!;
      response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({
        query: body.query, primary_memories: memories, linked_memories: [],
        total_count: memories.length, token_count: 20, truncated: false,
      }));
    },
  };
}

function reviewingModel() {
  const reviews: Array<Record<string, any>> = [];
  const selection = { provider: "scripted", id: "memory" } as Model<any>;
  const model = new PiMemoryModel({
    find: () => selection,
    async complete(_model, input) {
      // Simulate only provider responses; real recall and private submission validation execute.
      let content: AssistantMessage["content"];
      if (!input.tools) {
        content = [{ type: "text", text: JSON.stringify({ search: true,
          queries: ["first decision", "second decision"], queryIntent: "Find decisions",
          entities: [] }) }];
      } else {
        const message = input.messages.at(-1)!;
        const text = typeof message.content === "string" ? message.content :
          message.content.filter((part) => part.type === "text").map((part) => part.text).join("");
        const review = JSON.parse(text);
        reviews.push(review);
        const memoryIds = review.availableSources.memoryIds;
        content = [{ type: "toolCall", id: "review", name: "submit_recall_review", arguments: {
          summary: memoryIds.length ? "The stored decisions remain current." : "",
          memoryIds, reason: "Selected delivered evidence.",
        } }];
      }
      return { role: "assistant", content, api: "openai-completions", provider: "scripted",
        model: "memory", timestamp: Date.now(),
        stopReason: input.tools ? "toolUse" : "stop",
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
    },
  }, selection);
  return { model, reviews };
}

async function beforeRecallSettles(started: Promise<void>, pending: Promise<unknown>) {
  await Promise.race([started, pending.then(() => {
    throw new Error("Recall settled before the expected concurrent requests arrived");
  })]);
}

for (const concurrency of [undefined, 1, 2, 8]) {
  test(`initial recall searches honour concurrency ${concurrency ?? "default"}`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: HTTP replies are held, so overlap is observed rather than inferred from timing.
    const http = await searchServer(t);
    const { model, reviews } = reviewingModel();
    const service = new RecallService(http.client, model, { concurrency, deadlineMs: 5_000 });

    // Act: the second result finishes first when concurrency is enabled.
    const pending = service.recall({ ...recallRequest, signal: http.controller.signal });
    if (concurrency === 1) {
      await beforeRecallSettles(http.waitForCount(1), pending);
      assert.equal(http.requests.length, 1);
      assert.equal(http.dispatched, 1, "the queued search must not reach the HTTP transport");
      http.respond(0, [memory(11), memory(99, 9)]);
      await beforeRecallSettles(http.waitForCount(2), pending);
      http.respond(1, [memory(12), memory(11)]);
    } else {
      await beforeRecallSettles(http.waitForCount(2), pending);
      http.respond(1, [memory(12), memory(11)]);
      http.respond(0, [memory(11), memory(99, 9)]);
    }
    const result = await pending;

    // Assert: query order, deduplication, project checks and reviewed-only delivery are unchanged.
    assert.equal(result.reason, undefined, result.diagnostic);
    assert.deepEqual(result.memoryIds, [11, 12]);
    assert.equal(reviews.length, 1);
    assert.deepEqual(reviews[0]!.availableSources.memoryIds, [11, 12]);
    assert.doesNotMatch(reviews[0]!.retrievedContext, /Decision 99/);
    assert.deepEqual(http.requests.map(({ body }) => body.query),
      ["first decision", "second decision"]);
    for (const { body } of http.requests) {
      assert.deepEqual(body.project_ids, [3]);
      assert.equal(body.strict_project_filter, true);
      assert.equal(body.k, 3);
      assert.equal(body.include_links, 0);
    }
  });
}

for (const failed of [0, 1, "both"] as const) {
  test(`concurrent initial searches preserve successes and failure details: ${failed}`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: one or both HTTP requests fail with distinct, unabridged service diagnostics.
    const http = await searchServer(t);
    const { model, reviews } = reviewingModel();
    const service = new RecallService(http.client, model, { deadlineMs: 5_000 });
    const detail = "Service validation detail. ".repeat(60);

    // Act.
    const pending = service.recall({ ...recallRequest, signal: http.controller.signal });
    await beforeRecallSettles(http.waitForCount(2), pending);
    for (const index of [1, 0]) {
      if (failed === "both" || failed === index) {
        http.requests[index]!.response.writeHead(index === 0 ? 503 : 422)
          .end(`${detail}ORIGINAL_ERROR_${index}`);
      } else http.respond(index);
    }
    const result = await pending;

    // Assert: a failed sibling cannot hide good evidence or another service error from review.
    assert.deepEqual(result.memoryIds, failed === "both" ? [] : [failed === 0 ? 12 : 11]);
    assert.equal(reviews.length, 1);
    const failure = reviews[0]!.searchFailure;
    const failures = Array.isArray(failure) ? failure : [failure];
    assert.equal(failures.length, failed === "both" ? 2 : 1);
    assert.deepEqual(failures.map((item) => item.status),
      failed === "both" ? [503, 422] : [failed === 0 ? 503 : 422]);
    for (const index of failed === "both" ? [0, 1] : [failed]) {
      assert.ok(JSON.stringify(failures).includes(`${detail}ORIGINAL_ERROR_${index}`));
    }
    assert.match(result.diagnostic ?? "", /memory search.*HTTP/);
    assert.doesNotMatch(result.text, /ORIGINAL_ERROR/);
  });
}

for (const stop of ["caller", "deadline"] as const) {
  test(`${stop} cancellation aborts both initial HTTP searches without a review`, {
    timeout: 15_000,
  }, async (t) => {
    // Arrange: neither held response will complete normally.
    const http = await searchServer(t);
    const { model, reviews } = reviewingModel();
    const service = new RecallService(http.client, model, {
      deadlineMs: stop === "deadline" ? 1_000 : 5_000,
    });

    // Act: cancel only after both real HTTP requests arrive, or let their shared deadline expire.
    const pending = service.recall({ ...recallRequest, signal: http.controller.signal });
    await beforeRecallSettles(http.waitForCount(2), pending);
    if (stop === "caller") http.controller.abort();
    const result = await pending;
    await http.waitForCancelled(2);

    // Assert: no raw candidates or late private submission escape the cancelled operation.
    assert.equal(result.reason, stop === "caller" ? "aborted" : "deadline-exceeded");
    assert.equal(result.text, "");
    assert.deepEqual(result.memoryIds, []);
    assert.deepEqual(reviews, []);
    assert.deepEqual(http.cancelled.sort(), [0, 1]);
  });
}

test("recall rejects programmatic concurrency outside the hard one-to-eight range", () => {
  // Arrange: bypassing the settings parser must not bypass the hard limit.
  const client = new ApiForgetfulClient({ baseUrl: "http://localhost:1/api/v1" });
  const { model } = reviewingModel();

  // Act/Assert.
  for (const concurrency of [0, -1, 9, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => new RecallService(client, model, { concurrency }), /1 to 8/);
  }
});

test("late private reads cannot authorise sources after recall cancellation", {
  timeout: 10_000,
}, async () => {
  // Arrange: a transport port returns records after abort, without the HTTP adapter's protection.
  const replies = new Map<number, (response: Memory) => void>();
  let notifyStarted!: () => void;
  const bothStarted = new Promise<void>((resolve) => { notifyStarted = resolve; });
  const unexpected = async (): Promise<never> => {
    throw new Error("Unexpected client operation");
  };
  const client: ForgetfulClient = {
    search: async () => [],
    get: async (id) => new Promise<Memory>((resolve) => {
      replies.set(id, resolve);
      if (replies.size === 2) notifyStarted();
    }),
    listProjects: unexpected, createProject: unexpected, linkProject: unexpected,
    create: unexpected, supersede: unexpected,
  };
  let review: ModelRequest | undefined;
  let readResults!: Promise<PromiseSettledResult<unknown>[]>;
  const service = new RecallService(client, {
    async complete(request) {
      if (request.purpose === "classification") return { search: true, queries: ["decisions"],
        queryIntent: "Read missing decisions", entities: [] };
      // Model choices are scripted through the public read capability, not private service methods.
      review = request;
      readResults = Promise.allSettled([21, 22].map((memory_id) =>
        request.readTools![0]!.execute({ operation: "get_memory", memory_id }, request.signal!)));
      await readResults;
      return { summary: "", memoryIds: [], reason: "Cancelled reads are not evidence." };
    },
  });
  const controller = new AbortController();

  // Act: recall must settle before the non-cooperative transport finishes.
  const pending = service.recall({ ...recallRequest, signal: controller.signal });
  await beforeRecallSettles(bothStarted, pending);
  controller.abort();
  const result = await pending;
  for (const id of [21, 22]) replies.get(id)!(memory(id));
  const late = await readResults;

  // Assert: recall itself rejects late records before they can become citable evidence.
  assert.equal(result.reason, "aborted");
  assert.deepEqual(result.memoryIds, []);
  assert.equal(result.text, "");
  for (const outcome of late) {
    assert.ok(outcome.status === "rejected");
    assert.equal(outcome.reason.name, "AbortError");
  }
  assert.deepEqual((review!.readBatchContext!() as {
    availableSources: { memoryIds: number[] };
  }).availableSources.memoryIds, []);
  assert.throws(() => review!.submission!.validate({ summary: "Late claims", memoryIds: [21, 22],
    reason: "Must not authorise cancelled reads." }), /availableSources/);
});
