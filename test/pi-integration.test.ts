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

test(
  "real Pi receives transient same-turn recall and exposes the bounded tools",
  {
    timeout: 20_000,
  },
  async (t) => {
    // Arrange: real Pi and extension services, fake external model and memory HTTP endpoint.
    const root = await mkdtemp(join(tmpdir(), "pi-forgetful-sdk-"));
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
      "https://github.com/test/extension.git",
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
    const queries: unknown[] = [];
    const created: Record<string, unknown>[] = [];
    const obsoleted: number[] = [];
    let failCaptureSearch = false;
    const server = createServer(async (request, response) => {
      response.setHeader("content-type", "application/json");
      if (request.url?.startsWith("/api/v1/projects")) {
        response.end(
          JSON.stringify({
            projects: [
              { id: 7, name: "Test extension", repo_name: "test/extension" },
            ],
            total: 1,
          }),
        );
        return;
      }
      if (request.url === "/api/v1/memories" && request.method === "POST") {
        let body = "";
        for await (const chunk of request) body += chunk;
        created.push(JSON.parse(body));
        response.statusCode = 201;
        response.end(JSON.stringify({ id: 99 }));
        return;
      }
      if (request.url === "/api/v1/memories/42" && request.method === "GET") {
        response.end(JSON.stringify(memory));
        return;
      }
      if (
        request.url === "/api/v1/memories/42" &&
        request.method === "DELETE"
      ) {
        let body = "";
        for await (const chunk of request) body += chunk;
        obsoleted.push(JSON.parse(body).superseded_by);
        response.end(JSON.stringify({ success: true }));
        return;
      }
      if (request.url === "/api/v1/memories/search") {
        let body = "";
        for await (const chunk of request) body += chunk;
        const query = JSON.parse(body) as {
          query: string;
          strict_project_filter?: boolean;
        };
        queries.push(query);
        if (failCaptureSearch && query.strict_project_filter === true) {
          response.statusCode = 503;
          response.end("{}");
          return;
        }
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
    t.after(() => new Promise<void>((done) => server.close(() => done())));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await writeFile(
      join(agentDir, "forgetful/settings.json"),
      JSON.stringify({
        base_url: `http://127.0.0.1:${address.port}/api/v1`,
        model: "test/memory",
        capture_mode: "off",
        verbosity: "debug",
        timeout_ms: 2000,
      }),
    );

    const mainContexts: Context[] = [];
    const memoryContexts: Context[] = [];
    const providerSessions: Array<{ model: string; sessionId?: string }> = [];
    const captureInputs: Array<{
      entries: Array<{ id: string; role: string; text: string }>;
    }> = [];
    const notifications: Array<{ message: string; type?: string }> = [];
    const patchedUis = new WeakSet<object>();
    let holdNextMain = false;
    let releaseMain: (() => void) | undefined;
    let onHeldMain: (() => void) | undefined;
    let holdNextCapture = false;
    let releaseCapture: (() => void) | undefined;
    let onHeldCapture: (() => void) | undefined;
    let createConflict = false;
    let resolveOnNextMain = false;
    let skipExtraction = false;
    let groupedSkipCandidates = false;
    let queueOneNeedsTool = false;
    const handoffs: Array<{ content: unknown; details?: unknown }> = [];
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
        contextWindow: 32000,
        maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context, options) {
        providerSessions.push({ model: model.id, sessionId: options?.sessionId });
        (model.id === "main" ? mainContexts : memoryContexts).push(
          JSON.parse(JSON.stringify(context)) as Context,
        );
        let holdCapture = false;
        let decision: unknown = {
          search: true,
          queries: ["database decision"],
          queryIntent: "Recall database decisions",
          entities: [],
        };
        let reviewDecision = false;
        let captureDecision = false;
        let overlapDecision = false;
        if (model.id === "memory") {
          const last = context.messages.at(-1);
          const raw = last?.content;
          const inputText =
            typeof raw === "string"
              ? raw
              : Array.isArray(raw)
                ? raw
                    .filter((p) => p.type === "text")
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("")
                : "{}";
          const input = JSON.parse(inputText) as Record<string, unknown>;
          captureDecision = Boolean(
            Array.isArray(input.entries) &&
              context.tools?.some((tool) => tool.name === "submit_capture_candidates"),
          );
          overlapDecision = Boolean(
            input.candidate &&
              context.tools?.some((tool) => tool.name === "submit_capture_decision"),
          );
          if (input.availableSources) {
            reviewDecision = true;
            const prompt = (input.work as { prompt: string }).prompt;
            decision = prompt === "debug review evidence"
              ? { summary: "Rejected review marker REJECTED_PI_REVIEW", memoryIds: [],
                reason: "No source selected.", token: "Bearer pi-review-secret",
                extra: "x".repeat(8_000) }
              : prompt === "queued request one"
                ? { summary: "Queue one memory.", memoryIds: [43],
                  reason: "First queued topic" }
                : prompt === "queued request two"
                  ? { summary: "Queue two memory.", memoryIds: [44],
                    reason: "Second queued topic" }
                  : { summary: "SQLite was chosen for durable state.", memoryIds: [42],
                    reason: "The database decision answers the question." };
          } else if (
            input.prompt === "queued request one" ||
            input.prompt === "queued request two"
          ) {
            decision = {
              search: true,
              queries: [
                input.prompt === "queued request one"
                  ? "queue-one"
                  : "queue-two",
              ],
              queryIntent: "Recall queued topic",
              entities: [],
            };
          } else if (input.candidate) {
            decision = createConflict
              ? {
                  action: "escalate",
                  conflictingMemoryId: 42,
                  oldClaim: memory.content,
                  newClaim: "The test project uses local storage.",
                  reason: "The database change needs confirmation.",
                  sourceEntryIds: (
                    input.candidate as { sourceEntryIds: string[] }
                  ).sourceEntryIds,
                }
              : { action: "create", reason: "New project decision." };
            if (groupedSkipCandidates)
              decision = { action: "skip", reason: "already known" };
          } else if (Array.isArray(input.entries)) {
            captureInputs.push(
              input as unknown as (typeof captureInputs)[number],
            );
            const user = input.entries.find(
              (e: { role: string }) => e.role === "user",
            );
            decision = user
              ? {
                candidates: [
                  {
                    id: "storage",
                    title: "Use local storage",
                    content: "The test project uses local storage.",
                    context: "Explicit user decision.",
                    keywords: ["storage"],
                    tags: ["decision"],
                    sourceEntryIds: [user.id],
                    evidenceType: "userDecision",
                  },
                ],
              }
              : { candidates: [] };
            if (groupedSkipCandidates && user) {
              decision = {
                candidates: [
                  {
                    id: "skip-one",
                    title: "Known choice one",
                    content: "The first known choice.",
                    context: "Explicit user decision.",
                    keywords: ["known"],
                    tags: ["decision"],
                    sourceEntryIds: [user.id],
                    evidenceType: "userDecision",
                  },
                  {
                    id: "skip-two",
                    title: "Known choice two",
                    content: "The second known choice.",
                    context: "Explicit user decision.",
                    keywords: ["known"],
                    tags: ["decision"],
                    sourceEntryIds: [user.id],
                    evidenceType: "userDecision",
                  },
                ],
              };
            }
            if (skipExtraction) decision = { candidates: [] };
            if (holdNextCapture) {
              holdNextCapture = false;
              holdCapture = true;
            }
          }
        }
        const text =
          model.id === "main"
            ? "SQLite is configured."
            : JSON.stringify(decision);
        const message: AssistantMessage = {
          role: "assistant",
          api: "faux",
          provider: "test",
          model: model.id,
          content: reviewDecision
            ? [{
                type: "toolCall",
                id: "review-1",
                name: "submit_recall_review",
                arguments: decision as Record<string, any>,
              }]
            : captureDecision
              ? [{
                  type: "toolCall",
                  id: "capture-1",
                  name: "submit_capture_candidates",
                  arguments: decision as Record<string, any>,
                }]
              : overlapDecision
                ? [{
                    type: "toolCall",
                    id: "decision-1",
                    name: "submit_capture_decision",
                    arguments: decision as Record<string, any>,
                  }]
              : [{ type: "text", text }],
          stopReason: reviewDecision || captureDecision || overlapDecision
            ? "toolUse"
            : "stop",
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
        if (model.id === "main" && resolveOnNextMain) {
          resolveOnNextMain = false;
          const details = handoffs
            .filter(({ details }) =>
              Array.isArray(
                (details as { conflictIds?: unknown } | undefined)?.conflictIds,
              ),
            )
            .at(-1)?.details as { conflictIds: string[] };
          message.content = [
            {
              type: "toolCall",
              id: "resolve-1",
              name: "forgetful_resolve",
              arguments: {
                conflict_id: details.conflictIds[0],
                action: "supersede",
                reason: "The user confirmed the project storage change.",
              },
            },
          ];
          message.stopReason = "toolUse";
        }
        const latestUser = context.messages.findLast(
          (item) =>
            item.role === "user" &&
            !JSON.stringify(item.content).includes("[Forgetful "),
        );
        if (
          model.id === "main" &&
          queueOneNeedsTool &&
          JSON.stringify(latestUser?.content).includes("queued request one")
        ) {
          queueOneNeedsTool = false;
          message.content = [
            {
              type: "toolCall",
              id: "deeper-1",
              name: "forgetful_recall",
              arguments: { query: "database detail" },
            },
          ];
          message.stopReason = "toolUse";
        }
        const stream = createAssistantMessageEventStream();
        const emit = () => {
          stream.push({
            type: "done",
            reason: message.stopReason as "stop" | "toolUse",
            message,
          });
          stream.end(message);
        };
        if (holdCapture) {
          releaseCapture = emit;
          onHeldCapture?.();
        } else if (model.id === "main" && holdNextMain) {
          holdNextMain = false;
          releaseMain = emit;
          onHeldMain?.();
        } else queueMicrotask(emit);
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
      noThemes: true,
      noContextFiles: true,
      extensionFactories: [
        (pi) => {
          const observeNotifications = (ctx: {
            ui: {
              notify: (
                message: string,
                type?: "info" | "warning" | "error",
              ) => void;
            };
          }) => {
            if (patchedUis.has(ctx.ui)) return;
            patchedUis.add(ctx.ui);
            const notify = ctx.ui.notify.bind(ctx.ui);
            ctx.ui.notify = (message, type) => {
              notifications.push({ message, type });
              notify(message, type);
            };
          };
          pi.on("session_start", (_event, ctx) => observeNotifications(ctx));
          pi.on("agent_settled", (_event, ctx) => observeNotifications(ctx));
          const sendMessage = pi.sendMessage.bind(pi);
          pi.sendMessage = (message, options) => {
            handoffs.push(message);
            sendMessage(message, options);
          };
          return createForgetfulExtension({ agentDir })(pi);
        },
      ],
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

    // Act.
    await session.prompt("Which database did we choose?");

    // Assert: the first boundary carries current progress; completion replaces it later.
    assert.equal(mainContexts.length, 2, JSON.stringify(session.messages));
    assert.equal(memoryContexts.length, 2);
    assert.equal(
      providerSessions.filter(({ model }) => model === "memory").length,
      2,
    );
    assert.equal(
      providerSessions.filter(({ model }) => model === "main").length,
      mainContexts.length,
    );
    assert.match(JSON.stringify(mainContexts[0]), /retrieval underway/);
    assert.doesNotMatch(JSON.stringify(mainContexts[0]), /SQLite was chosen/);
    assert.ok(!mainContexts[0]?.systemPrompt?.includes(memory.content));
    assert.match(JSON.stringify(mainContexts[1]), /SQLite was chosen for durable state/);
    assert.doesNotMatch(JSON.stringify(mainContexts[1]), /retrieval underway/);
    assert.doesNotMatch(JSON.stringify(mainContexts[1]), /memory-decision-pending/);
    assert.ok(JSON.stringify(memoryContexts[1]).includes(memory.content));
    assert.ok(
      JSON.stringify(memoryContexts[0]).includes(
        "Which database did we choose?",
      ),
    );
        const recallEntries = sessionManager.getEntries().filter((entry) =>
          entry.type === "custom_message" &&
          entry.customType === "forgetful_recall_async",
        );
        assert.equal(recallEntries.length, 2);
        const persistedLifecycle = recallEntries.map((entry) => JSON.stringify(entry));
        assert.ok(persistedLifecycle.some((text) => text.includes("memory-decision-pending")));
        const wakeLifecycle = persistedLifecycle.filter((text) =>
          text.includes('"phase":"wake"'),
        );
        assert.equal(wakeLifecycle.length, 1);
        assert.ok(
          wakeLifecycle.every((text) =>
            text.includes("[Forgetful automatic recall background continuation]"),
          ),
        );
        assert.doesNotMatch(wakeLifecycle.join("\n"), /terminal state|SQLite was chosen|memoryIds/);
        assert.doesNotMatch(persistedLifecycle.join("\n"), /retrieval underway|SQLite was chosen/);
    assert.ok(
      recallEntries.every(
        (entry) => "display" in entry && entry.display === false,
      ),
    );
    assert.ok(session.getActiveToolNames().includes("forgetful_recall"));
    assert.ok(session.getActiveToolNames().includes("forgetful_resolve"));
    assert.equal(queries.length, 1);
    assert.equal(
      (queries[0] as { strict_project_filter: boolean }).strict_project_filter,
      false,
    );

    await t.test(
      "real Pi keeps review correction evidence out of the main model and session history",
      async () => {
        const beforeNotifications = notifications.length;

        // Act: the scripted memory model returns an invalid review through real Pi.
        await session.prompt("debug review evidence");
        const deadline = Date.now() + 3_000;
        while (
          !notifications.slice(beforeNotifications).some(({ message }) =>
            message.startsWith("Forgetful recall review validation debug:"),
          ) &&
          Date.now() < deadline
        ) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Assert: bounded debug reaches the user, not main-model context or session history.
        // The private review conversation deliberately retains redacted correction evidence.
        const feedback = notifications
          .slice(beforeNotifications)
          .filter(({ message }) =>
            message.startsWith("Forgetful recall review validation debug:"),
          );
        assert.equal(feedback.length, 1, JSON.stringify(notifications.slice(beforeNotifications)));
        assert.match(feedback[0]?.message ?? "", /REJECTED_PI_REVIEW/);
        assert.match(feedback[0]?.message ?? "", /\[redacted\]/);
        assert.match(
          feedback[0]?.message ?? "",
          /\.\.\.\[reviewer JSON truncated at 4000 characters\]/,
        );
        assert.match(feedback[0]?.message ?? "", /Available source IDs \(bounded\):/);
        assert.doesNotMatch(feedback[0]?.message ?? "", /pi-review-secret/);
        assert.ok(
          feedback[0]!.message.length < 6_000,
          `feedback was ${feedback[0]!.message.length} characters`,
        );
        assert.doesNotMatch(
          JSON.stringify({
            mainContexts,
            entries: sessionManager.getEntries(),
            messages: session.messages,
          }),
          /REJECTED_PI_REVIEW|pi-review-secret/,
        );
        assert.doesNotMatch(JSON.stringify(memoryContexts), /pi-review-secret/);
        const corrections = memoryContexts.filter((context) => context.messages.some((message) =>
          message.role === "toolResult" && message.toolName === "submit_recall_review"));
        assert.match(JSON.stringify(corrections), /REJECTED_PI_REVIEW/);
        const otherMemoryCalls = memoryContexts.filter((context) =>
          !context.tools?.some((tool) => tool.name === "submit_recall_review"));
        assert.doesNotMatch(JSON.stringify(otherMemoryCalls), /REJECTED_PI_REVIEW/);
      },
    );

    await t.test(
      "the capture command enables real automatic capture after settlement",
      async () => {
        // Arrange: use the public command; all files and memories are isolated test fixtures.
        const beforeCreated = created.length;
        await session.prompt("/forgetful capture auto");

        // Act: normal work settles; capture should write through the real service wiring.
        await session.prompt(
          "We decided that the test project uses local storage.",
        );
        const deadline = Date.now() + 3000;
        while (created.length === 0 && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        const feedbackDeadline = Date.now() + 3000;
        while (
          !notifications.some(({ message }) =>
            /Forgetful capture saved 1 memory\./.test(message),
          ) &&
          Date.now() < feedbackDeadline
        ) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Assert through the external write boundary.
        assert.equal(
          created.length,
          beforeCreated + 1,
          JSON.stringify(memoryContexts.map((c) => c.messages)),
        );
        const saved = created.find((candidate) =>
          candidate.content === "The test project uses local storage.",
        );
        assert.ok(saved);
        assert.equal(
          saved.content,
          "The test project uses local storage.",
        );
        assert.deepEqual(saved.project_ids, [7]);
        const savedFeedback = notifications.find(({ message }) =>
          /Forgetful capture(?:: | )saved \d+ memor(?:y|ies)(?:\.|;)/.test(message),
        );
        assert.ok(
          savedFeedback,
          notifications.map(({ message }) => message).join("\n"),
        );
        assert.equal(savedFeedback.type, "info");
        assert.doesNotMatch(
          JSON.stringify({
            mainContexts,
            memoryContexts,
            entries: sessionManager.getEntries(),
          }),
          /Forgetful capture(?:: | )saved \d+ memor(?:y|ies)(?:\.|;)/,
        );
        const overlap = memoryContexts.find((context) =>
          JSON.stringify(context.messages).includes('\\"candidate\\":'),
        );
        assert.ok(
          overlap?.systemPrompt?.includes(
            "action create, skip, supersede, or escalate",
          ),
        );
        assert.ok(
          !overlap?.systemPrompt?.includes("{candidates: [...]}"),
          "overlap must not receive the incompatible extraction response contract",
        );
      },
    );

    await t.test(
      "overlapping captures report one combined outcome",
      async () => {
        const beforeCreated = created.length;
        const beforeNotifications = notifications.length;
        const heldCapture = new Promise<void>((done) => {
          onHeldCapture = done;
        });
        holdNextCapture = true;
        try {
          // Arrange: hold the first capture worker while the second run is queued.
          const firstPrompt = session.prompt(
            "We decided that the first overlapping run uses local storage.",
          );
          await heldCapture;
          await firstPrompt;

          // Act: the second settled run queues while the first worker owns the lock.
          await session.prompt(
            "We decided that the second overlapping run uses local storage.",
          );
          releaseCapture?.();

          const deadline = Date.now() + 3000;
          while (created.length < beforeCreated + 2 && Date.now() < deadline) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                /Forgetful capture(?::| (saved|skipped|failed))/.test(message),
              ) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Assert: both writes are reflected by one stable, truthful notice.
          const feedback = notifications
            .slice(beforeNotifications)
            .filter(({ message }) =>
              /Forgetful capture(?::| (saved|skipped|failed))/.test(message),
            );
          assert.equal(
            created.length,
            beforeCreated + 2,
            JSON.stringify({
              created: created.slice(beforeCreated),
              captureInputs: captureInputs.slice(-5).map((input) => ({
                entries: input.entries.map((entry) => `${entry.role}:${entry.text}`),
              })),
              memoryContexts: memoryContexts.slice(-8).map((context) => ({
                systemPrompt: context.systemPrompt?.slice(0, 80),
                last: context.messages.at(-1),
              })),
              notifications: notifications.slice(beforeNotifications),
            }),
          );
          assert.equal(
            feedback.length,
            1,
            notifications.map(({ message }) => message).join("\n"),
          );
          assert.equal(feedback[0]?.type, "info");
          assert.match(feedback[0]?.message ?? "", /saved 2 memories/);
          assert.doesNotMatch(
            JSON.stringify({
              mainContexts,
              memoryContexts,
              entries: sessionManager.getEntries(),
            }),
            /Forgetful capture: saved 2 memories\./,
          );
        } finally {
          releaseCapture?.();
          holdNextCapture = false;
          onHeldCapture = undefined;
          releaseCapture = undefined;
        }
      },
    );

    await t.test(
      "debug reports when automatic capture finds no candidates",
      async () => {
        const beforeNotifications = notifications.length;
        const beforeCaptures = captureInputs.length;
        skipExtraction = true;
        try {
          // Act: settle a run whose scripted capture model returns an empty list.
          await session.prompt("Routine work with no durable decision.");
          const captureDeadline = Date.now() + 3000;
          while (
            captureInputs.length === beforeCaptures &&
            Date.now() < captureDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                /Forgetful capture: skipped \d+ jobs with no candidates\./.test(message),
              ) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Assert: empty automatic capture is visible only at debug level.
          assert.ok(
            notifications
              .slice(beforeNotifications)
              .some(({ message, type }) =>
                type === "info" &&
                /Forgetful capture: skipped \d+ jobs with no candidates\./.test(message),
              ),
            notifications.map(({ message }) => message).join("\n"),
          );
        } finally {
          skipExtraction = false;
        }
      },
    );

    await t.test(
      "real Pi reports grouped reasons for skipped capture candidates",
      async () => {
        const beforeNotifications = notifications.length;
        const beforeCaptures = captureInputs.length;
        groupedSkipCandidates = true;
        try {
          // Act: the real Pi session runs a capture whose overlap decisions both skip.
          await session.prompt("Two durable choices are already known.");
          const captureDeadline = Date.now() + 3000;
          while (
            captureInputs.length === beforeCaptures &&
            Date.now() < captureDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                message.includes("skipped 2 candidates (2: already known)"),
              ) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Assert through the real Pi notification seam.
          const feedback = notifications
            .slice(beforeNotifications)
            .filter(({ message }) =>
              message.includes("skipped 2 candidates (2: already known)"),
            );
          assert.equal(
            feedback.length,
            1,
            JSON.stringify(notifications.slice(beforeNotifications)),
          );
          assert.match(
            feedback[0]?.message ?? "",
            /Forgetful capture(?: |: )skipped 2 candidates \(2: already known\)/,
          );
          assert.equal(feedback[0]?.type, "info");
          const notice = "skipped 2 candidates (2: already known)";
          assert.ok(!JSON.stringify(sessionManager.getEntries()).includes(notice));
          assert.ok(!JSON.stringify(mainContexts).includes(notice));
          assert.ok(!JSON.stringify(memoryContexts).includes(notice));
        } finally {
          groupedSkipCandidates = false;
        }
      },
    );

    await t.test(
      "automatic capture feedback remains debug-only",
      async () => {
        try {
          for (const verbosity of ["info", "warning", "error"] as const) {
            await session.prompt(`/forgetful verbosity ${verbosity}`);
            const beforeNotifications = notifications.length;
            const beforeCreated = created.length;
            await session.prompt(`Routine work at ${verbosity} verbosity.`);
            const captureDeadline = Date.now() + 3000;
            while (
              created.length < beforeCreated + 1 &&
              Date.now() < captureDeadline
            ) {
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
            assert.equal(created.length, beforeCreated + 1);
            await session.prompt("/forgetful verbosity debug");
            const beforeProbeNotifications = notifications.length;
            const beforeProbeCreated = created.length;
            await session.prompt(`Capture completion probe for ${verbosity}.`);
            const probeDeadline = Date.now() + 3000;
            while (
              created.length < beforeProbeCreated + 1 &&
              Date.now() < probeDeadline
            ) {
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
            const feedbackDeadline = Date.now() + 3000;
            while (
              !notifications
                .slice(beforeProbeNotifications)
                .some(({ message }) =>
                  /Forgetful capture(?:: | )saved \d+ memor(?:y|ies)(?:\.|;)/.test(message),
                ) &&
              Date.now() < feedbackDeadline
            ) {
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
            assert.ok(
              notifications.slice(beforeProbeNotifications).some(({ message }) =>
                /Forgetful capture(?:: | )saved \d+ memor(?:y|ies)(?:\.|;)/.test(message),
              ),
              "the debug probe must finish reporting before checking quiet capture output",
            );
            const output = notifications
              .slice(beforeNotifications, beforeProbeNotifications)
              .map(({ message }) => message)
              .join("\n");
            assert.doesNotMatch(output, /Forgetful capture(?::| (saved|skipped|failed))/);
          }
        } finally {
          skipExtraction = false;
          await session.prompt("/forgetful verbosity debug");
        }
      },
    );

    await t.test(
      "a later checkpoint reports a live capture retry after it succeeds",
      async () => {
        const beforeNotifications = notifications.length;
        const beforeCreated = created.length;
        createConflict = false;
        skipExtraction = false;
        failCaptureSearch = true;
        try {
          await session.prompt("We decided that this capture should retry.");
          const failureDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) => /retry pending/.test(message)) &&
            Date.now() < failureDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          failCaptureSearch = false;
          skipExtraction = true;
          await session.prompt("We decided that the retry should complete now.");
          const captureDeadline = Date.now() + 3000;
          while (
            created.length < beforeCreated + 1 &&
            Date.now() < captureDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) => /saved 1 memory/.test(message)) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          assert.equal(created.length, beforeCreated + 1);
          assert.ok(
            notifications
              .slice(beforeNotifications)
              .some(({ message }) => /saved 1 memory/.test(message)),
            notifications.map(({ message }) => message).join("\n"),
          );
        } finally {
          skipExtraction = false;
          failCaptureSearch = false;
        }
      },
    );

    await t.test(
      "observe capture reports candidates without claiming a saved memory",
      async () => {
        const beforeNotifications = notifications.length;
        const beforeCreated = created.length;
        await session.prompt("/forgetful capture observe");
        try {
          await session.prompt("Observe this durable decision without writing it.");
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                /Forgetful capture: observed \d+ candidates?(?:\.|;)/.test(message),
              ) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          assert.equal(created.length, beforeCreated);
          assert.ok(
            notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                /Forgetful capture: observed \d+ candidates?(?:\.|;)/.test(message),
              ),
            notifications.map(({ message }) => message).join("\n"),
          );
        } finally {
          await session.prompt("/forgetful capture auto");
        }
      },
    );

    await t.test(
      "capture skip excludes the run from later captures too",
      async () => {
        // Arrange.
        const marker = "Transient marker to skip: dune-lark-63";
        const captureCount = captureInputs.length;
        const beforeCreated = created.length;
        await session.prompt("/forgetful capture skip");

        // Act: skip one run, then carry out a normal decision in the same session.
        await session.prompt(marker);
        assert.equal(captureInputs.length, captureCount);
        await session.prompt("We confirmed local storage for this project.");
        const deadline = Date.now() + 3000;
        while (created.length < beforeCreated + 1 && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Assert at the memory-model boundary: skipped text never returns as later evidence.
        assert.equal(created.length, beforeCreated + 1);
        assert.ok(
          captureInputs
            .at(-1)
            ?.entries.every((entry) => !entry.text.includes(marker)),
          JSON.stringify(captureInputs.slice(captureCount)),
        );
      },
    );

    await t.test(
      "queued prompts each receive transient recall in their continuation",
      async () => {
        // Arrange: hold an external provider response while the user queues two requests.
        await session.prompt("/forgetful capture off");
        const firstContext = mainContexts.length;
        const firstMemoryContext = memoryContexts.length;
        const firstQuery = queries.length;
        const held = new Promise<void>((done) => {
          onHeldMain = done;
        });
        queueOneNeedsTool = true;
        holdNextMain = true;
        const ongoing = session.prompt("Continue the current work.");
        await held;

        // Act: use Pi's real follow-up input path, which bypasses before_agent_start.
        try {
          await session.prompt("queued request one", {
            streamingBehavior: "followUp",
          });
          await session.prompt("queued request two", {
            streamingBehavior: "followUp",
          });
        } finally {
          releaseMain?.();
        }
        await ongoing;

        // Assert: both topics reach the model alongside their request without entering
        // saved history.
        assert.equal(
          mainContexts.length,
          firstContext + 4,
          JSON.stringify(mainContexts.slice(firstContext).map((context) => context.messages)),
        );
        assert.equal(memoryContexts.length, firstMemoryContext + 6);
        assert.equal(queries.length, firstQuery + 4);
        const continuations = mainContexts
          .slice(firstContext + 1)
          .map((c) => JSON.stringify(c.messages));
        assert.equal(continuations.length, 3);
        assert.ok(
          continuations.some(
            (text) =>
              text.includes("queued request one") &&
              text.includes("Queue one memory."),
          ),
          JSON.stringify({
            contexts: mainContexts.slice(firstContext + 1).map((context) => ({
              users: context.messages
                .filter((item) => item.role === "user")
                .map((item) => JSON.stringify(item.content).slice(0, 90))
                .slice(-3),
              hasQueueOne: JSON.stringify(context).includes("Queue one memory."),
              hasQueueTwo: JSON.stringify(context).includes("Queue two memory."),
            })),
            memoryInputs: memoryContexts.map((context) => {
              const raw = context.messages.at(-1)?.content;
              const text = typeof raw === "string"
                ? raw
                : JSON.stringify(raw ?? "");
              try {
                const input = JSON.parse(text) as Record<string, unknown>;
                return {
                  prompt: input.prompt,
                  workPrompt: (input.work as { prompt?: unknown } | undefined)?.prompt,
                  queries: input.queries,
                  availableSources: Boolean(input.availableSources),
                };
              } catch {
                return { invalid: text.slice(0, 80) };
              }
            }),
          }),
        );
        assert.ok(
          continuations.some(
            (text) =>
              text.includes("queued request two") &&
              text.includes("Queue two memory."),
          ),
          JSON.stringify(continuations),
        );
        const firstRequestContexts = mainContexts
          .slice(firstContext + 1)
          .filter((context) =>
              JSON.stringify(
              context.messages.findLast(
                (item) =>
                  item.role === "user" &&
                  !JSON.stringify(item.content).includes("[Forgetful "),
              )
                ?.content,
            ).includes("queued request one"),
          );
        assert.equal(firstRequestContexts.length, 2, "queued work continues after the tool result");
        const firstRecallContexts = firstRequestContexts.filter((context) =>
          JSON.stringify(context.messages).includes("Queue one memory."),
        );
        assert.equal(firstRecallContexts.length, 1, "queued recall must reach one later boundary");
        assert.ok(
          firstRecallContexts.some((context) =>
            JSON.stringify(context.messages).includes('"toolName":"forgetful_recall"'),
          ),
          "queued recall must remain available through the tool continuation",
        );
        assert.ok(
          firstRecallContexts.every((context) =>
            !JSON.stringify(context.messages).includes("Queue two memory."),
          ),
          "queued request one must not receive request two's recall",
        );
        const secondRequestContexts = mainContexts
          .slice(firstContext + 1)
          .filter((context) =>
            JSON.stringify(
              context.messages.findLast(
                (item) =>
                  item.role === "user" &&
                  !JSON.stringify(item.content).includes("[Forgetful "),
              )?.content,
            ).includes("queued request two"),
          );
        const secondRecallContexts = secondRequestContexts.filter((context) =>
          JSON.stringify(context.messages).includes("Queue two memory."),
        );
        assert.equal(secondRequestContexts.length, 1);
        assert.equal(secondRecallContexts.length, 1, "queued request two must reach one boundary");
        assert.ok(
          secondRecallContexts.every((context) =>
            !JSON.stringify(context.messages).includes("Queue one memory."),
          ),
          "queued request two must retain only its own recall",
        );
        const queuedRecallEntries = sessionManager.getEntries().filter((entry) => {
          if (
            entry.type !== "custom_message" ||
            entry.customType !== "forgetful_recall_async"
          )
            return false;
          const text = JSON.stringify(entry);
          return text.includes("Queue one memory.") ||
            text.includes("Queue two memory.");
        });
        assert.equal(queuedRecallEntries.length, 0,
          "reviewed summaries are transient context overlays");
      },
    );

    await t.test(
      "a real settled conflict reaches the next prompt and can be resolved",
      async () => {
        // Arrange: the separate memory model finds an uncertain same-fact conflict.
        await session.prompt("/forgetful capture auto");
        createConflict = true;
        const before = created.length;
        await session.prompt(
          "We are switching the test project to local storage.",
        );
        const settledMainCalls = mainContexts.length;

        // Act: let the durable capture worker deliver through Pi's actual nextTurn mechanism.
        const deadline = Date.now() + 3000;
        const conflictHandoffs = () => handoffs.filter(({ details }) =>
          Array.isArray((details as { conflictIds?: unknown } | undefined)?.conflictIds),
        );
        while (conflictHandoffs().length === 0 && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        const conflictHandoff = conflictHandoffs()[0];
        assert.equal(
          conflictHandoffs().length,
          1,
          "settled capture must reach its originating live session",
        );
        assert.equal(
          mainContexts.length,
          settledMainCalls,
          "handoff must not start a model turn",
        );
        assert.equal(created.length, before);
        assert.match(String(conflictHandoff?.content), /SQLite/);
        assert.match(String(conflictHandoff?.content), /local storage/);

        // The main model uses the bounded resolver after a real user clarification.
        skipExtraction = true;
        resolveOnNextMain = true;
        await session.prompt(
          "Yes, replace the old SQLite decision with local storage.",
        );

        // Assert at the real tool and external service boundaries.
        assert.ok(
          JSON.stringify(mainContexts[settledMainCalls]).includes(
            "Forgetful capture needs a bounded decision",
          ),
        );
        assert.equal(
          created.length,
          before + 1,
          JSON.stringify(session.messages.slice(-5)),
        );
        assert.deepEqual(obsoleted, [99]);
        const resolved = session.messages.filter(
          (message) => message.role === "toolResult",
        );
        assert.ok(
          resolved.some((message) =>
            JSON.stringify(message).includes("resolved"),
          ),
        );
      },
    );

    await t.test(
      "debug reports a capture failure once while leaving retry state durable",
      async () => {
        const beforeNotifications = notifications.length;
        const beforeCreated = created.length;
        skipExtraction = false;
        createConflict = false;
        failCaptureSearch = true;
        try {
          // Act: the overlap API fails after the candidate has been checkpointed.
          await session.prompt(
            "We decided that the test project needs a temporary failure test.",
          );
          const feedbackDeadline = Date.now() + 3000;
          while (
            !notifications
              .slice(beforeNotifications)
              .some(({ message }) =>
                /Forgetful capture(?: failed|:.*failed)/.test(message),
              ) &&
            Date.now() < feedbackDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Assert: the failure is bounded, user-only, and not duplicated.
          const feedback = notifications
            .slice(beforeNotifications)
            .filter(({ message }) =>
              /Forgetful capture(?: failed|:.*failed)/.test(message),
            );
          assert.equal(
            feedback.length,
            1,
            notifications.map(({ message }) => message).join("\n"),
          );
          assert.equal(feedback[0]?.type, "info");
          assert.match(feedback[0]?.message ?? "", /retry pending/);
          assert.match(feedback[0]?.message ?? "", /503/);
          assert.equal(created.length, beforeCreated);
          assert.doesNotMatch(
            notifications
              .slice(beforeNotifications)
              .map(({ message }) => message)
              .join("\n"),
            /capture worker skipped/,
          );
        } finally {
          failCaptureSearch = false;
        }
      },
    );

  },
);

test(
  "real Pi persists recall failures as errors while keeping no-match results successful",
  { timeout: 20_000 },
  async (t) => {
    // Arrange: the real SDK, a scripted provider, and a memory endpoint that first fails.
    const root = await mkdtemp(join(tmpdir(), "pi-forgetful-errors-"));
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
      "https://github.com/test/recall-errors.git",
    ]);
    let searchCalls = 0;
    const server = createServer((request, response) => {
      response.setHeader("content-type", "application/json");
      if (!request.url?.endsWith("/memories/search")) {
        response.statusCode = 404;
        response.end("{}");
        return;
      }
      searchCalls += 1;
      if (searchCalls === 1) {
        response.statusCode = 503;
        response.end("{}");
        return;
      }
      response.end(JSON.stringify({
        primary_memories: [],
        linked_memories: [],
      }));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise<void>((done) => server.close(() => done())));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await writeFile(
      join(agentDir, "forgetful/settings.json"),
      JSON.stringify({
        base_url: `http://127.0.0.1:${address.port}/api/v1`,
        model: "test/memory",
        capture_mode: "off",
        timeout_ms: 2_000,
      }),
    );

    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"),
      modelsPath: null,
      refreshOnCreate: false,
    });
    const mainPrompts = new Set<string>();
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
      streamSimple(model, context) {
        const stream = createAssistantMessageEventStream();
        const decision = model.id === "memory"
          ? {
              search: false,
              queries: [],
              queryIntent: "No historical context needed",
              entities: [],
            }
          : undefined;
        const latestUser = context.messages.findLast(
          (message) =>
            message.role === "user" &&
            !JSON.stringify(message.content).includes("[Forgetful "),
        );
        const promptKey = JSON.stringify(latestUser?.content ?? "");
        const shouldCall = model.id === "main" && !mainPrompts.has(promptKey);
        if (shouldCall) mainPrompts.add(promptKey);
        const content = decision
          ? [{ type: "text" as const, text: JSON.stringify(decision) }]
          : shouldCall
            ? [{
              type: "toolCall" as const,
              id: `recall-${searchCalls + 1}`,
              name: "forgetful_recall",
              arguments: { query: "recall error regression" },
            }]
            : [{ type: "text" as const, text: "Recall completed." }];
        const message: AssistantMessage = {
          role: "assistant",
          api: "faux",
          provider: "test",
          model: model.id,
          content,
          stopReason: decision || !shouldCall ? "stop" : "toolUse",
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
        queueMicrotask(() => {
          stream.push({
            type: "done",
            reason: message.stopReason as "stop" | "toolUse",
            message,
          });
          stream.end(message);
        });
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
      noThemes: true,
      noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
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
    const toolEnds: Array<{ isError?: boolean }> = [];
    session.subscribe((event) => {
      if (
        event.type === "tool_execution_end" &&
        event.toolName === "forgetful_recall"
      ) {
        toolEnds.push(event);
      }
    });

    // Act: the first direct recall fails, then the second returns no matches.
    await session.prompt("Trigger the recall error path.");
    await session.prompt("Trigger the normal no-match path.");

    // Assert at the SDK event and persisted-message seams.
    assert.equal(searchCalls, 2);
    assert.ok(toolEnds[0]?.isError, "the emitted tool execution must be an error");
    assert.equal(toolEnds[1]?.isError, false);
    const results = session.messages.filter(
      (message) =>
        message.role === "toolResult" &&
        message.toolName === "forgetful_recall",
    ) as Array<{ role: "toolResult"; isError?: boolean }>;
    assert.equal(results.length, 2);
    assert.equal(results[0]?.isError, true);
    assert.equal(results[1]?.isError, false);
  },
);
