import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  createAgentSession,
  DefaultResourceLoader,
  ModelRuntime,
  SessionManager,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream,
  type AssistantMessage,
  type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";

interface Gate {
  readonly started: Promise<void>;
  readonly release: Promise<void>;
  start(): void;
  finish(): void;
}

function gate(): Gate {
  let start!: () => void;
  let finish!: () => void;
  return {
    started: new Promise<void>((resolve) => {
      start = resolve;
    }),
    release: new Promise<void>((resolve) => {
      finish = resolve;
    }),
    start() {
      start();
    },
    finish() {
      finish();
    },
  };
}

function message(
  model: string,
  content: AssistantMessage["content"],
  stopReason: "stop" | "toolUse" | "aborted" = "stop",
): AssistantMessage {
  return {
    role: "assistant",
    api: "faux",
    provider: "test",
    model,
    content,
    stopReason,
    timestamp: Date.now(),
    usage: {
      input: 1,
      output: 1,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 2,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
  };
}

function messageText(context: Context): string {
  const raw = context.messages.at(-1)?.content;
  if (typeof raw === "string") return raw;
  if (!Array.isArray(raw)) return "";
  return raw
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");
}

async function waitFor(
  condition: () => boolean,
  description: string,
): Promise<void> {
  const deadline = Date.now() + 2_000;
  while (!condition() && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.ok(condition(), description);
}

test(
  "async recall lets real Pi work, wait, and follow up after a late result",
  { timeout: 20_000 },
  async (t) => {
    // Arrange: real Pi lifecycle and model seam with isolated HTTP fixtures.
    const root = await mkdtemp(join(tmpdir(), "pi-forgetful-async-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await promisify(execFile)("git", ["init", "--quiet", root]);
    await promisify(execFile)("git", [
      "-C",
      root,
      "remote",
      "add",
      "origin",
      "https://github.com/test/async-extension.git",
    ]);

    const memory = {
      id: 42,
      title: "Database",
      content: "The project uses SQLite for durable state.",
      context: "Approved decision",
      keywords: ["database"],
      tags: ["decision"],
      importance: 8,
      project_ids: [7],
      is_obsolete: false,
      linked_memory_ids: [],
    };
    const server = createServer(async (request, response) => {
      response.setHeader("content-type", "application/json");
      if (request.url?.startsWith("/api/v1/projects")) {
        response.end(
          JSON.stringify({
            projects: [
              { id: 7, name: "Async extension", repo_name: "test/async-extension" },
            ],
            total: 1,
          }),
        );
        return;
      }
      if (request.url === "/api/v1/memories/search") {
        let body = "";
        for await (const chunk of request) body += chunk;
        const query = JSON.parse(body) as { query?: string };
        if (query.query === "boundary search") plannerGate.finish();
        const found =
          query.query === "queue-one"
            ? { ...memory, id: 43, content: "Queue one memory." }
            : query.query === "queue-two"
              ? { ...memory, id: 44, content: "Queue two memory." }
              : memory;
        response.end(
          JSON.stringify({ primary_memories: [found], linked_memories: [] }),
        );
        return;
      }
      response.statusCode = 404;
      response.end("{}");
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await writeFile(
      join(agentDir, "forgetful/settings.json"),
      JSON.stringify({
        base_url: `http://127.0.0.1:${address.port}/api/v1`,
        model: "test/memory",
        capture_mode: "off",
        verbosity: "warning",
        timeout_ms: 2_000,
      }),
    );

    const mainContexts: Context[] = [];
    const memoryContexts: Context[] = [];
    let mode:
      | "wait"
      | "late"
      | "late-no-context"
      | "cancel"
      | "queued"
      | "progress"
      | "identical" = "wait";
    let mainCalls = 0;
    let waitAfterTerminal = false;
    let plannerGate = gate();
    let progressReviewGate = gate();
    let queuedMainGate = gate();
    let identicalFirstReviewGate = gate();
    let identicalReviewCalls = 0;
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"),
      modelsPath: null,
      refreshOnCreate: false,
    });
    runtime.registerProvider("test", {
      api: "faux",
      apiKey: "test-only-key",
      baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id,
        name: id,
        reasoning: false,
        input: ["text"],
        contextWindow: 32_000,
        maxTokens: 2_048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context, options) {
        const copy = JSON.parse(JSON.stringify(context)) as Context;
        if (model.id === "main") {
          mainContexts.push(copy);
          mainCalls += 1;
        } else {
          memoryContexts.push(copy);
        }

        const stream = createAssistantMessageEventStream();
        const emit = (result: AssistantMessage) => {
          stream.push({
            type: "done",
            reason: result.stopReason === "toolUse" ? "toolUse" : "stop",
            message: result,
          });
          stream.end(result);
        };

        if (model.id === "memory") {
          const input = JSON.parse(messageText(context)) as Record<string, unknown>;
          if (input.availableSources) {
            const recalledPrompt = (input.work as { prompt?: unknown } | undefined)?.prompt;
            const review = () => {
              let summary: Record<string, unknown>;
              if (recalledPrompt === "queued request one") {
                summary = {
                  summary: "Queue one memory.",
                  memoryIds: [43],
                  reason: "The first queued topic answers the request.",
                };
              } else if (recalledPrompt === "queued request two") {
                summary = {
                  summary: "Queue two memory.",
                  memoryIds: [44],
                  reason: "The second queued topic answers the request.",
                };
              } else {
                summary = {
                  summary: "SQLite was chosen for durable state.",
                  memoryIds: [42],
                  reason: "The stored decision answers the request.",
                };
              }
              emit(
                message(
                  "memory",
                  [{
                    type: "toolCall",
                    id: `review-${String(recalledPrompt)}`,
                    name: "submit_recall_review",
                    arguments: summary,
                  }],
                  "toolUse",
                ),
              );
            };
            if (mode === "progress") {
              progressReviewGate.start();
              void progressReviewGate.release.then(review);
            } else if (
              mode === "identical" &&
              recalledPrompt === "identical queued request"
            ) {
              identicalReviewCalls += 1;
              if (identicalReviewCalls === 1) {
                identicalFirstReviewGate.start();
                void identicalFirstReviewGate.release.then(review);
              } else {
                queueMicrotask(review);
              }
            } else queueMicrotask(review);
          } else {
            plannerGate.start();
            void plannerGate.release.then(() =>
              emit(
                message(
                  "memory",
                  [
                    {
                      type: "text",
                      text: JSON.stringify({
                        search: mode !== "late-no-context",
                        queries: mode === "late-no-context"
                          ? []
                          : [
                              input.prompt === "queued request one"
                                ? "queue-one"
                                : input.prompt === "queued request two"
                                  ? "queue-two"
                                  : "database decision",
                            ],
                        queryIntent: mode === "late-no-context"
                          ? ""
                          : "Recall database decisions",
                        entities: [],
                      }),
                    },
                  ],
                ),
              ),
            );
          }
          return stream;
        }

        if (mode === "progress" && mainCalls === 1) {
          queueMicrotask(() =>
            emit(
              message("main", [
                {
                  type: "toolCall",
                  id: "boundary-1",
                  name: "forgetful_recall",
                  arguments: { query: "boundary search" },
                },
              ], "toolUse"),
            ),
          );
          return stream;
        }
        if ((mode === "queued" || mode === "identical") && mainCalls === 1) {
          queuedMainGate.start();
          void queuedMainGate.release.then(() =>
            emit(
              message("main", [
                {
                  type: "text",
                  text: "I can continue independent work while recall settles.",
                },
              ]),
            ),
          );
          return stream;
        }
        if (mode === "cancel" && mainCalls === 1) {
          options?.signal?.addEventListener(
            "abort",
            () => {
              emit(message("main", [], "aborted"));
            },
            { once: true },
          );
        } else if (
          (mode === "wait" && mainCalls === 1) ||
          (waitAfterTerminal && mainCalls === 2)
        ) {
          queueMicrotask(() =>
            emit(
              message(
                "main",
                [
                  {
                    type: "toolCall",
                    id: "wait-1",
                    name: "forgetful_recall_wait",
                    arguments: {},
                  },
                ],
                "toolUse",
              ),
            ),
          );
        } else {
          queueMicrotask(() =>
            emit(
              message("main", [
                {
                  type: "text",
                  text: "I can continue independent work while recall settles.",
                },
              ]),
            ),
          );
        }
        return stream;
      },
    });

    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({
      retry: { enabled: false },
      compaction: { enabled: false },
    });
    const loader = new DefaultResourceLoader({
      cwd: root,
      agentDir,
      settingsManager: settings,
      noSkills: true,
      noPromptTemplates: true,
      noContextFiles: true,
      noThemes: true,
      extensionFactories: [(pi) => createForgetfulExtension({ agentDir })(pi)],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const sessionManager = SessionManager.inMemory(root);
    const { session } = await createAgentSession({
      cwd: root,
      agentDir,
      modelRuntime: runtime,
      model: runtime.getModel("test", "main"),
      settingsManager: settings,
      sessionManager,
      resourceLoader: loader,
      noTools: "builtin",
    });
    t.after(() => session.dispose());
    await session.bindExtensions({});

    // Act/Assert: the first model call is not held behind the memory planner.
    const waitingPrompt = session.prompt("Which database did we choose?");
    await plannerGate.started;
    await waitFor(
      () => mainContexts.length === 1,
      "main work should start while recall planning is pending",
    );
    assert.match(
      JSON.stringify(mainContexts[0]),
      /memory-decision-pending/i,
      "the first model boundary must carry an explicit pending lifecycle message",
    );
    assert.match(mainContexts[0]?.systemPrompt ?? "", /forgetful_recall_wait/);
    assert.match(mainContexts[0]?.systemPrompt ?? "", /continue independent work/i);
    assert.match(mainContexts[0]?.systemPrompt ?? "", /defer.*memory-dependent/i);
    assert.ok(session.getActiveToolNames().includes("forgetful_recall_wait"));
    waitAfterTerminal = true;
    plannerGate.finish();
    await waitingPrompt;
    assert.equal(mainContexts.length, 3);
    assert.equal(memoryContexts.length, 2);
    assert.match(
      JSON.stringify(mainContexts[1]),
      /SQLite was chosen for durable state/,
      "the next real model request must contain the current terminal fact",
    );
    assert.doesNotMatch(
      JSON.stringify(mainContexts[1]?.messages),
      /memory-decision-pending/,
      "the current model request must not retain stale pending state",
    );
    assert.doesNotMatch(
      mainContexts[1]?.systemPrompt ?? "",
      /memory-decision-pending/i,
      "a completed lifecycle state must supersede the initial pending prompt",
    );
    assert.match(
      JSON.stringify(mainContexts[2]),
      /already.*delivered|already-terminal/i,
      "a second wait must describe the retained terminal result accurately",
    );
    await session.waitForIdle();
    // sendMessage() is fire-and-forget at the extension boundary. Give an idle
    // completion's triggered follow-up a turn to publish its active state.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await session.waitForIdle();

    // Act/Assert: an intervening model boundary sees progress before review completes.
    const progressBase = mainContexts.length;
    mode = "progress";
    mainCalls = 0;
    plannerGate = gate();
    progressReviewGate = gate();
    const progressPrompt = session.prompt("Continue while recall is still reviewing.");
    await plannerGate.started;
    await waitFor(
      () => mainContexts.length === progressBase + 1,
      `progress test should start independent main work ` +
        `(main=${mainContexts.length}, memory=${memoryContexts.length})`,
    );
    await waitFor(
      () => mainContexts.length === progressBase + 2,
      "a tool boundary should allow another main model call",
    );
    const progressContext = JSON.stringify(mainContexts[progressBase + 1]);
    assert.match(progressContext, /retrieval underway/);
    assert.doesNotMatch(progressContext, /automatic recall terminal state/);
    progressReviewGate.finish();
    await progressPrompt;
    await waitFor(
      () => mainContexts.length === progressBase + 3,
      "recall completion should follow the progress boundary",
    );
    assert.match(
      JSON.stringify(mainContexts[progressBase + 2]),
      /automatic recall terminal state/,
    );

    // Act/Assert: a result arriving after an idle initial response starts one follow-up.
    mode = "late";
    waitAfterTerminal = false;
    mainCalls = 0;
    plannerGate = gate();
    const latePrompt = session.prompt("What database decision should I document?");
    await plannerGate.started;
    await waitFor(
      () => mainContexts.length === progressBase + 4,
      "late recall should still allow the initial model response",
    );
    let lateSettled = false;
    void latePrompt.then(() => {
      lateSettled = true;
    });
    await waitFor(
      () => lateSettled,
      "the initial response must settle while the planner remains held",
    );
    plannerGate.finish();
    await latePrompt;
    await waitFor(
      () => mainContexts.length === progressBase + 5,
      "late recall completion should trigger a bounded follow-up",
    );
    assert.equal(memoryContexts.length, 6);
    assert.match(
      JSON.stringify(mainContexts[progressBase + 4]),
      /SQLite was chosen for durable state/,
    );
    const lateContext = mainContexts[progressBase + 4];
    assert.ok(lateContext, "late recall must produce a provider request");
    const lateLatestMessage = lateContext.messages.at(-1);
    assert.equal(lateLatestMessage?.role, "user", JSON.stringify(lateContext));
    const lateContinuation = messageText(lateContext);
    assert.ok(lateContinuation.trim(), JSON.stringify(lateContext));
    assert.match(
      lateContinuation,
      /\[Forgetful automatic recall background continuation\]/,
    );
    assert.match(lateContinuation, /original user request|not a new user request/i);
    assert.match(lateContinuation, /do not ask the user to resend/i);
    assert.match(lateContinuation, /already fully answered/i);
    assert.match(JSON.stringify(lateContext), /What database decision should I document\?/);

    // Act/Assert: a real abort invalidates recall and cannot resurrect a new main turn.
    mode = "cancel";
    mainCalls = 0;
    plannerGate = gate();
    const cancelledPrompt = session.prompt("Cancel this memory-dependent request.");
    await plannerGate.started;
    await waitFor(
      () => mainContexts.length === progressBase + 6,
      "the cancellable main request should start before planner completion",
    );
    await session.abort();
    await cancelledPrompt;
    plannerGate.finish();
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(mainContexts.length, progressBase + 6);

    // Act/Assert: queued input starts independent recall without blocking Pi's queue.
    mode = "queued";
    mainCalls = 0;
    plannerGate = gate();
    queuedMainGate = gate();
    const queuedMainBase = mainContexts.length;
    const queuedMemoryBase = memoryContexts.length;
    const ongoing = session.prompt("Keep working while queued recall runs.");
    await plannerGate.started;
    await queuedMainGate.started;
    const queuedOne = session.prompt("queued request one", {
      streamingBehavior: "followUp",
    });
    const queuedTwo = session.prompt("queued request two", {
      streamingBehavior: "followUp",
    });
    const queuedDuplicate = session.prompt("queued request one", {
      streamingBehavior: "followUp",
    });
    const queuedDeadline = new Promise<"deadline">((resolve) =>
      setTimeout(() => resolve("deadline"), 200),
    );
    assert.equal(
      await Promise.race([
        queuedOne.then(() => "queued" as const),
        queuedDeadline,
      ]),
      "queued",
      "queued input must not wait for recall completion",
    );
    assert.equal(
      await Promise.race([
        queuedTwo.then(() => "queued" as const),
        queuedDeadline,
      ]),
      "queued",
      "a second queued input must not wait for recall completion",
    );
    assert.equal(
      await Promise.race([
        queuedDuplicate.then(() => "queued" as const),
        queuedDeadline,
      ]),
      "queued",
      "an identical queued input must not wait for recall completion",
    );
    plannerGate.finish();
    await waitFor(
      () => memoryContexts.length === queuedMemoryBase + 8,
      "queued recall jobs should finish without running the queued main work",
    );
    queuedMainGate.finish();
    await ongoing;
    await queuedOne;
    await queuedTwo;
    await queuedDuplicate;
    assert.equal(
      mainContexts.length,
      queuedMainBase + 5,
      "the held request and three queued requests each get one intentional follow-up",
    );
    const queuedContexts = mainContexts.slice(queuedMainBase);
    const queuedOneContexts = queuedContexts.filter((context) => {
      const lastUser = context.messages.findLast((item) => item.role === "user");
      return JSON.stringify(lastUser?.content).includes("queued request one");
    });
    const queuedTwoContexts = queuedContexts.filter((context) => {
      const lastUser = context.messages.findLast((item) => item.role === "user");
      return JSON.stringify(lastUser?.content).includes("queued request two");
    });
    assert.equal(queuedOneContexts.length, 2);
    assert.equal(queuedTwoContexts.length, 1);
    for (const context of queuedOneContexts) {
      assert.match(JSON.stringify(context), /Queue one memory\./);
      assert.doesNotMatch(
        JSON.stringify(context),
        /memory-decision-pending|retrieval underway/,
      );
      assert.doesNotMatch(JSON.stringify(context), /Queue two memory\./);
    }
    assert.match(JSON.stringify(queuedTwoContexts[0]), /Queue two memory\./);
    assert.doesNotMatch(
      JSON.stringify(queuedTwoContexts[0]),
      /memory-decision-pending|retrieval underway/,
    );
    assert.doesNotMatch(JSON.stringify(queuedTwoContexts[0]), /Queue one memory\./);

    // Act/Assert: a late old identical request cannot wake the newer request.
    mode = "identical";
    mainCalls = 0;
    plannerGate = gate();
    queuedMainGate = gate();
    identicalFirstReviewGate = gate();
    identicalReviewCalls = 0;
    const identicalMainBase = mainContexts.length;
    const identicalMemoryBase = memoryContexts.length;
    const identicalOngoing = session.prompt("Keep working while identical recall runs.");
    await plannerGate.started;
    await queuedMainGate.started;
    const identicalFirst = session.prompt("identical queued request", {
      streamingBehavior: "followUp",
    });
    const identicalSecond = session.prompt("identical queued request", {
      streamingBehavior: "followUp",
    });
    plannerGate.finish();
    await identicalFirstReviewGate.started;
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(
      identicalReviewCalls,
      2,
      `the newer identical request should finish review first: ${
        JSON.stringify(memoryContexts.map(messageText))
      }`,
    );
    queuedMainGate.finish();
    await identicalOngoing;
    await identicalFirst;
    await identicalSecond;
    assert.equal(
      mainContexts.length,
      identicalMainBase + 4,
      "the held request and two identical queued requests each get one call",
    );
    identicalFirstReviewGate.finish();
    await waitFor(
      () => memoryContexts.length === identicalMemoryBase + 6,
      "the older identical review should eventually finish",
    );
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(
      mainContexts.length,
      identicalMainBase + 4,
      "the older identical result must not wake the newer request",
    );

    // Act/Assert: a late no-context result still supplies terminal status once.
    mode = "late-no-context";
    mainCalls = 0;
    plannerGate = gate();
    const noContextBase = mainContexts.length;
    const noContextMemoryBase = memoryContexts.length;
    const noContextPrompt = session.prompt(
      "What should I do if memory has no answer?",
    );
    await plannerGate.started;
    await waitFor(
      () => mainContexts.length === noContextBase + 1,
      "late no-context recall should still allow the initial response",
    );
    let noContextSettled = false;
    void noContextPrompt.then(() => {
      noContextSettled = true;
    });
    await waitFor(
      () => noContextSettled,
      "the no-context response must settle while planning remains held",
    );
    plannerGate.finish();
    await noContextPrompt;
    await waitFor(
      () => mainContexts.length === noContextBase + 2,
      "late no-context recall should trigger one bounded follow-up",
    );
    assert.equal(memoryContexts.length, noContextMemoryBase + 1);
    const noContext = mainContexts[noContextBase + 1];
    assert.ok(noContext, "late no-context recall must produce a provider request");
    assert.equal(noContext.messages.at(-1)?.role, "user", JSON.stringify(noContext));
    const noContextContinuation = messageText(noContext);
    assert.match(
      noContextContinuation,
      /\[Forgetful automatic recall terminal state: no-context\]/,
    );
    assert.match(
      noContextContinuation,
      /\[Forgetful automatic recall background continuation\]/,
    );
    assert.match(noContextContinuation, /do not ask the user to resend/i);
    assert.match(
      JSON.stringify(noContext),
      /What should I do if memory has no answer\?/,
    );
    assert.doesNotMatch(noContextContinuation, /SQLite was chosen|memoryIds/);

    const wakeEntries = sessionManager.getEntries().filter((entry) => {
      if (
        entry.type !== "custom_message" ||
        entry.customType !== "forgetful_recall_async"
      )
        return false;
      return JSON.stringify(entry).includes('"phase":"wake"');
    });
    assert.ok(wakeEntries.length >= 2, JSON.stringify(sessionManager.getEntries()));
    const wakeText = wakeEntries.map((entry) => JSON.stringify(entry)).join("\n");
    assert.doesNotMatch(wakeText, /"content":""/);
    assert.match(
      wakeText,
      /\[Forgetful automatic recall background continuation\]/,
    );
    assert.doesNotMatch(wakeText, /terminal state|SQLite was chosen|memoryIds/);
  },
);
