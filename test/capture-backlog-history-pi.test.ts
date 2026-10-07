import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context, type ToolResultMessage,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { decodeProviderContext, providerSystemPrompt, providerTools } from "./provider-context.ts";

function gate() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => { release = resolve; });
  return { promise, release };
}

async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean,
  description: string): Promise<T> {
  const deadline = Date.now() + 10_000;
  let value: T;
  do {
    value = await read();
    if (accept(value)) return value;
    await delay(10);
  } while (Date.now() < deadline);
  assert.fail(`${description}\nLast observation: ${JSON.stringify(value, (key, item) =>
    ["snapshot", "binding", "dedupeKey"].includes(key) ? undefined : item)}`);
}

function assistant(text: string): AssistantMessage {
  return { role: "assistant", api: "faux", provider: "backlog-history", model: "main",
    content: [{ type: "text", text }], stopReason: "stop", timestamp: Date.now(),
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

interface PrivateCall {
  kind: "summary" | "capture";
  turn: number;
  context: Context;
  status: "started" | "finished" | "aborted";
}

function recordText(record: Record<string, any>): string {
  const content = record.message?.content;
  if (typeof content === "string") return content;
  return Array.isArray(content) ? content.filter((part) => part.type === "text")
    .map((part) => part.text).join("") : "";
}

/** Use readable provider evidence to submit a candidate, not IDs supplied by the test driver. */
function decision(context: Context) {
  const { input, conversation } = decodeProviderContext(context);
  const source = conversation.findLast((record) => record.message?.role === "user" &&
    /TURN_DECISION_\d:/.test(recordText(record)));
  assert.ok(source, "Extraction must receive the current turn's readable decision");
  const text = recordText(source);
  const turn = Number(text.match(/TURN_DECISION_(\d):/)![1]);
  assert.ok(input.eligibleEvidence.some((entry: { id: string }) => entry.id === source.id),
    "The readable decision must remain eligible source evidence");
  return { id: `turn-${turn}`, title: `Turn ${turn} repository decision`, content: text,
    context: "User selected a repository storage policy.", keywords: ["storage"],
    tags: ["decision"], evidenceType: "userDecision", sourceEntryIds: [source.id] };
}

/** Real Pi lifecycle, model adapter and queue; only external provider/REST replies are scripted. */
async function backlog(t: TestContext, interrupt: boolean, readOriginal = false) {
  const root = await mkdtemp(join(tmpdir(), "pi-backlog-history-"));
  const agentDir = join(root, "agent");
  const discovery = gate();
  const heldProvider = gate();
  const resumeProvider = gate();
  const heldResponses: ServerResponse[] = [];
  const calls: PrivateCall[] = [];
  const evidenceReads: ToolResultMessage[] = [];
  const evidenceErrors: ToolResultMessage[] = [];
  let discovered = false;
  let providerHeld = false;
  let pauseOnRead = false;
  let submissions = 0;
  let mainCalls = 0;
  let sessionFile: string | undefined;
  let closeSession: (() => Promise<void>) | undefined;
  const projects = { projects: [{ id: 7, name: "Backlog history",
    repo_name: "test/backlog-history" }], total: 1 };
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.method !== "GET" ||
        new URL(request.url!, "http://localhost").pathname !== "/api/v1/projects") {
      response.writeHead(404).end("{}");
      return;
    }
    if (discovered) response.end(JSON.stringify(projects));
    else { heldResponses.push(response); discovery.release(); }
  });
  t.after(async () => {
    resumeProvider.release();
    try { await closeSession?.(); }
    finally {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
      await rm(root, { recursive: true, force: true });
    }
  });
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const git = promisify(execFile);
  await git("git", ["init", "--quiet", root]);
  await git("git", ["-C", root, "remote", "add", "origin",
    "https://github.com/test/backlog-history.git"]);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "backlog-history/memory",
    capture_mode: "observe", enabled: true, logging: "off", timeout_ms: 60_000,
    context_limit_tokens: readOriginal ? 20_000 : 10_000,
  }));
  // The private model loads settings separately: persist these, not just main-session overrides.
  await writeFile(join(agentDir, "settings.json"), JSON.stringify({
    retry: { enabled: false },
    compaction: { enabled: true, reserveTokens: 1200,
      keepRecentTokens: readOriginal ? 6000 : 1200 },
  }));

  const startSession = async () => {
    const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    runtime.registerProvider("backlog-history", {
      api: "faux", apiKey: "fixture-only", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id, name: id, reasoning: false, input: ["text", "image"], contextWindow: 128_000,
        maxTokens: 2048, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context, options) {
        const name = model.id === "memory" ? providerTools(context)[0]?.name : undefined;
        const summarizing = model.id === "memory" &&
          providerSystemPrompt(context).includes("context summarization assistant");
        const capturing = name === "submit_capture_candidates";
        const call: PrivateCall | undefined = capturing || summarizing
          ? { kind: capturing ? "capture" : "summary", turn: submissions + 1,
            context: structuredClone(context), status: "started" } : undefined;
        if (call) calls.push(call);
        if (model.id === "main") mainCalls++;
        const hold = interrupt && call && submissions === 1 && !providerHeld;
        if (hold) { providerHeld = true; heldProvider.release(); }
        const stream = createAssistantMessageEventStream();
        void (async () => {
          if (hold) await new Promise<void>((resolve) => {
            const done = () => { options?.signal?.removeEventListener("abort", done); resolve(); };
            if (options?.signal?.aborted) done();
            else options?.signal?.addEventListener("abort", done, { once: true });
            void resumeProvider.promise.then(done);
          });
          let message = { ...assistant("Decision noted."), model: model.id };
          try {
            if (options?.signal?.aborted) {
              if (call) call.status = "aborted";
              message.stopReason = "aborted";
              stream.push({ type: "error", reason: "aborted", error: message });
            } else {
              if (capturing && pauseOnRead) {
                const { input } = decodeProviderContext(context);
                const readFailed = context.messages.some((entry) => entry.role === "toolResult" &&
                  entry.toolName === "read_capture_evidence");
                message = { ...message, stopReason: "toolUse", content: [{ type: "toolCall",
                  id: `revoked-${calls.length}`,
                  name: readFailed ? name! : "read_capture_evidence",
                  arguments: readFailed ? { candidates: [] }
                    : { entryId: input.eligibleEvidence[0].id },
                }] };
              } else if (capturing) {
                const candidate = decision(context);
                const latestRead = context.messages.findLast((entry) =>
                  entry.role === "toolResult" && entry.toolName === "read_capture_evidence");
                const read = latestRead?.role === "toolResult" ? latestRead : undefined;
                const text = read?.content.find((part) => part.type === "text");
                const page = !read?.isError && text?.type === "text"
                  ? JSON.parse(text.text) : undefined;
                if (readOriginal && submissions === 1) {
                  assert.ok(providerTools(context).some((tool) =>
                    tool.name === "read_capture_evidence"), "Pinned evidence reader is advertised");
                  if (read) (read.isError ? evidenceErrors : evidenceReads)
                    .push(structuredClone(read));
                }
                if (readOriginal && submissions === 1 && (!page || page.nextOffset !== null)) {
                  const { input } = decodeProviderContext(context);
                  const probes: Array<Record<string, string | number>> = [
                    { entryId: "outside-this-snapshot" },
                    { entryId: input.eligibleEvidence[0].id, limit: 16_001 },
                    { entryId: input.eligibleEvidence[0].id, offset: Number.MAX_SAFE_INTEGER },
                  ];
                  message = { ...message, stopReason: "toolUse", content: [{ type: "toolCall",
                    id: `read-${calls.length}`, name: "read_capture_evidence",
                    arguments: probes[evidenceErrors.length] ?? {
                      entryId: input.eligibleEvidence[0].id,
                      offset: page?.nextOffset ?? 0, limit: 1000,
                    },
                  }] };
                } else {
                  if (readOriginal && submissions === 1) {
                    candidate.sourceEntryIds.push(page.entryId);
                    candidate.content += " Earlier policy: WAL provides crash recovery.";
                  }
                  message = { ...message, stopReason: "toolUse", content: [{ type: "toolCall",
                    id: `capture-${calls.length}`, name: name!,
                    arguments: { candidates: [candidate] },
                  }] };
                  submissions++;
                }
              } else if (summarizing) {
                // This prefix is disposable planning, not the distinct decisions in the raw tail.
                message.content = [{ type: "text",
                  text: "SHARED_SUMMARY: earlier repository storage planning was discussed." }];
              } else if (name === "submit_recall_plan") {
                message = { ...message, stopReason: "toolUse", content: [{ type: "toolCall",
                  id: "recall-plan", name, arguments: {
                    search: false, queries: [], queryIntent: "", entities: [],
                  } }] };
              } else assert.equal(model.id, "main", "Unexpected private provider request");
              if (call) call.status = "finished";
              stream.push({ type: "done", reason: message.stopReason as "stop" | "toolUse",
                message });
            }
          } catch (error) {
            t.diagnostic(`Controlled provider failed: ${String(error)}`);
            message = { ...message, stopReason: "error", errorMessage: String(error) };
            stream.push({ type: "error", reason: "error", error: message });
          }
          stream.end(message);
        })();
        return stream;
      },
    });
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    await settings.flush();
    const manager = sessionFile ? SessionManager.open(sessionFile)
      : SessionManager.create(root, join(root, "sessions"));
    const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
      noExtensions: true, noSkills: true, noPromptTemplates: true, noThemes: true,
      noContextFiles: true, extensionFactories: [createForgetfulExtension({ agentDir })] });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
      model: runtime.getModel("backlog-history", "main"), settingsManager: settings,
      sessionManager: manager, resourceLoader: loader, noTools: "builtin" });
    closeSession = async () => {
      try {
        await session.abort();
        await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      } finally { session.dispose(); }
    };
    await session.bindExtensions({});
    sessionFile = manager.getSessionFile();
    assert.ok(sessionFile);
    return { session, manager };
  };
  const first = await startSession();
  await discovery.promise;
  for (let index = 0; index < 35; index++) {
    const text = `RAW_SHARED_PREFIX_${index}: ${"Earlier storage planning. ".repeat(100)}`;
    first.manager.appendMessage({ role: "user", timestamp: 1,
      content: readOriginal && index === 0 ? [
        { type: "text", text: `HIDDEN_ORIGINAL_POLICY: WAL provides crash recovery. ${text}` },
        { type: "image", mimeType: "image/png", data: "cGlubmVkLWltYWdl" },
      ] : text });
    first.manager.appendMessage(assistant("Historical detail recorded."));
  }
  for (let turn = 1; turn <= 3; turn++) {
    await first.session.prompt(`TURN_DECISION_${turn}: use SQLite for component ${turn}.`);
  }
  const queue = async () => {
    const directory = join(agentDir, "forgetful", "queues");
    const names = await readdir(directory);
    assert.equal(names.length, 1);
    return new DurableQueueStore({ directory: join(directory, names[0]!) });
  };
  const store = await queue();
  const pending = await until(() => store.listJobs(), (jobs) => jobs.length === 3,
    "All three turns must be durably queued before discovery completes");
  assert.equal(calls.length, 0);
  assert.ok(pending.every((job) => job.status === "pending" && !job.snapshot.historySummary));
  assert.equal(new Set(pending.map((job) => job.snapshot.context.branchId)).size, 1);
  return {
    pending, calls, queue, store, heldProvider, evidenceReads, evidenceErrors,
    get mainCalls() { return mainCalls; },
    ready() {
      discovered = true;
      for (const response of heldResponses) response.end(JSON.stringify(projects));
    },
    async disableBeforeRead() {
      pauseOnRead = true;
      await first.session.prompt("/forgetful capture off");
      resumeProvider.release();
    },
    async restart() {
      await closeSession!();
      closeSession = undefined;
      const paused = await (await queue()).getJob(pending[1]!.id);
      assert.ok(paused && paused.status === "paused");
      assert.equal(paused.attempts, 0, "Lifecycle cancellation must not spend a failure attempt");
      assert.deepEqual(paused.snapshot.entries, pending[1]!.snapshot.entries);
      assert.deepEqual(paused.snapshot.sourceConversation ?? paused.snapshot.conversation,
        pending[1]!.snapshot.conversation, "Restart must retain the pinned original records");
      const restarted = await startSession();
      assert.notEqual(restarted.session, first.session);
      assert.notEqual(restarted.manager, first.manager);
      assert.equal(restarted.manager.getSessionId(), first.manager.getSessionId());
    },
  };
}

for (const restart of [false, true]) {
  test(`prequeued Pi turns reuse completed history${restart ? " after disk reopening" : ""}`,
    { timeout: 30_000 }, async (t) => {
      // Arrange: three real settled turns overlap before any summary or capture can complete.
      const pi = await backlog(t, restart);
      const sources = pi.pending.map((job, index) => {
        const source = job.snapshot.entries.find((entry) =>
          entry.text === `TURN_DECISION_${index + 1}: use SQLite for component ${index + 1}.`);
        assert.ok(source);
        return source;
      });

      // Act: automatic passes, optionally cancelled after the first successful capture.
      pi.ready();
      if (restart) {
        await pi.heldProvider.promise;
        const first = (await pi.store.getJob(pi.pending[0]!.id))!;
        assert.equal(first.status, "complete");
        const { sessionId, branchId } = first.snapshot.context;
        const watermark = await pi.store.getWatermark(sessionId, branchId);
        assert.ok(watermark.historyDigest, "A successful branch summary must exist before restart");
        assert.ok(watermark.historyThroughEntryId);
        await pi.restart();
      }
      const store = await pi.queue();
      const completed = await until(() => store.listJobs(),
        (jobs) => jobs.length === 3 && jobs.every((job) => job.status === "complete"),
        "Automatic follow-on processing must drain the backlog without another prompt");

      // Assert: actual evidence is accepted for every turn; completion alone is insufficient.
      assert.equal(pi.mainCalls, 3, "No extra foreground prompt may drive the drain or restart");
      for (const [index, job] of completed.entries()) {
        assert.equal(job.id, pi.pending[index]!.id);
        assert.equal(job.attempts, 1);
        const outcome = job.candidateOutcomes[`turn-${index + 1}`] as Record<string, unknown>;
        assert.equal(outcome?.stage, "observed");
        assert.deepEqual(outcome.sourceEntryIds, [sources[index]!.id]);
      }
      const summaries = pi.calls.filter((call) =>
        call.kind === "summary" && call.status === "finished");
      const counts = [1, 2, 3].map((turn) => summaries.filter((call) => call.turn === turn).length);
      const rawPrefixes = (call: PrivateCall) => [...JSON.stringify(call.context.messages)
        .matchAll(/RAW_SHARED_PREFIX_\d+:/g)].map((match) => match[0]);
      const firstCompletedPrefix = new Set(summaries.filter((call) => call.turn === 1)
        .flatMap(rawPrefixes));
      const repeatedWork = summaries.filter((call) => call.turn > 1 &&
        rawPrefixes(call).some((marker) => firstCompletedPrefix.has(marker)));
      const repeatedStart = summaries.filter((call) => call.turn > 1 &&
        rawPrefixes(call).includes("RAW_SHARED_PREFIX_0:"));
      t.diagnostic(`Summary calls by turn: ${counts.join(", ")}; ` +
        `later calls repeating completed history: ${repeatedWork.length}; ` +
        `later restarts from original prefix: ${repeatedStart.length}; ` +
        `aborted requests: ${pi.calls.filter((call) => call.status === "aborted").length}`);
      assert.ok(counts[0]! > 1, "The fixture must require resumable, multi-chunk preparation");
      const captures = pi.calls.filter((call) =>
        call.kind === "capture" && call.status === "finished");
      assert.equal(captures.length, 3);
      for (const call of captures.slice(1)) {
        assert.ok(JSON.stringify(call.context.messages).includes(
          "SHARED_SUMMARY: earlier repository storage planning was discussed."),
        "Later extraction must receive the saved history, not merely stop summarizing it");
      }
      assert.ok(firstCompletedPrefix.has("RAW_SHARED_PREFIX_0:"));
      assert.equal(repeatedWork.length, 0,
        "Later prequeued tasks must not rebuild an already-completed historical summary");
    });
}

test("reopened backlog can selectively read paged original evidence hidden by reused history",
  { timeout: 30_000 }, async (t) => {
    // Arrange: a saved original decision and image are not copied into the shared summary.
    const pi = await backlog(t, true, true);
    const original = pi.pending[1]!.snapshot.entries[0]!;
    assert.match(original.text, /HIDDEN_ORIGINAL_POLICY/);

    // Act: complete the first task, reopen disk state, then read the hidden source.
    pi.ready();
    await pi.heldProvider.promise;
    await pi.restart();
    const jobs = await until(() => pi.store.listJobs(),
      (jobs) => jobs.every((job) => job.status === "complete"),
      "Selective reads must allow resumed extraction to complete");

    // Assert: the source was genuinely hidden; selective reads recover it without new authority.
    const firstSecondCall = pi.calls.find((call) => call.kind === "capture" && call.turn === 2)!;
    assert.match(JSON.stringify(firstSecondCall.context.messages), /SHARED_SUMMARY/);
    assert.doesNotMatch(JSON.stringify(firstSecondCall.context.messages), /HIDDEN_ORIGINAL_POLICY/);
    assert.equal(pi.evidenceErrors.length, 3);
    assert.match(JSON.stringify(pi.evidenceErrors[0]), /Unknown pinned capture entry/);
    assert.match(JSON.stringify(pi.evidenceErrors[1]), /limit/);
    assert.match(JSON.stringify(pi.evidenceErrors[2]), /offset is beyond/);
    assert.ok(pi.evidenceReads.length > 1,
      "The selected source must require multiple bounded pages");
    const pages = pi.evidenceReads.map((read) => {
      const content = read.content[0];
      assert.equal(content?.type, "text");
      return JSON.parse(content.type === "text" ? content.text : "");
    });
    assert.ok(pages.every((page) => page.entryId === original.id && page.text.length <= 1000));
    assert.match(pages.map((page) => page.text).join(""), /HIDDEN_ORIGINAL_POLICY/);
    assert.equal(pages[0].offset, 0);
    assert.equal(pages.at(-1).nextOffset, null);
    for (let index = 1; index < pages.length; index++) {
      assert.equal(pages[index].offset, pages[index - 1].nextOffset);
    }
    assert.deepEqual(pi.evidenceReads[0]!.content.filter((part) => part.type === "image"),
      [{ type: "image", mimeType: "image/png", data: "cGlubmVkLWltYWdl" }]);
    assert.ok(pi.evidenceReads.slice(1).every((read) =>
      read.content.every((part) => part.type !== "image")), "Images belong to the first page");
    assert.ok(pages.every((page) => !page.text.includes("cGlubmVkLWltYWdl")));
    const second = jobs.find((job) => job.id === pi.pending[1]!.id)!;
    const outcome = second.candidateOutcomes["turn-2"] as {
      sourceEntryIds: string[]; stage: string;
    };
    assert.equal(outcome.stage, "observed");
    assert.ok(outcome.sourceEntryIds.includes(original.id));
    assert.equal(pi.mainCalls, 3);
  });

test("revoking capture during a pinned read pauses the task without another provider call",
  { timeout: 30_000 }, async (t) => {
    // Arrange: the next controlled response will read evidence, then submit nothing if allowed on.
    const pi = await backlog(t, true);
    pi.ready();
    await pi.heldProvider.promise;
    const before = pi.calls.length;
    assert.equal(pi.calls.at(-1)?.kind, "capture");

    // Act: the real Pi command revokes reads before the held provider reply is executed.
    await pi.disableBeforeRead();
    const job = await until(() => pi.store.getJob(pi.pending[1]!.id),
      (job) => job?.status === "paused" || job?.status === "complete",
      "Revoked capture must settle rather than continue model/tool rounds");

    // Assert: permission denial is not ordinary tool feedback and cannot complete an empty capture.
    assert.equal(job?.status, "paused");
    assert.equal(pi.calls.length, before, "No private provider call may follow the denied read");
    assert.equal(job.attempts, 1);
    assert.equal(job.callCount, 1);
    assert.equal(job.extractedCandidates, undefined);
    assert.deepEqual(job.snapshot.entries, pi.pending[1]!.snapshot.entries);
    assert.deepEqual(job.snapshot.sourceConversation, pi.pending[1]!.snapshot.conversation);
    assert.equal((await pi.store.getJob(pi.pending[2]!.id))?.attempts, 0);
    assert.equal(pi.mainCalls, 3, "The mode command does not add a foreground model call");
  });
