import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, open, readdir, rm, writeFile, type FileHandle } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import { ModelRegistry, ModelRuntime, SessionManager } from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type JsonObject,
} from "@earendil-works/pi-ai";
import { CaptureService, type CaptureServiceOptions } from "../src/capture.ts";
import type { ForgetfulClient } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

function gate<T = void>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

async function bounded<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("capture did not drain promptly")), 5_000);
    })]);
  } finally { clearTimeout(timer); }
}

function heldResponse(signal?: AbortSignal | null) {
  const response = gate<Response>();
  const aborted = gate();
  const onAbort = () => aborted.resolve();
  if (signal?.aborted) onAbort();
  else signal?.addEventListener("abort", onAbort, { once: true });
  const promise = Promise.race([response.promise, aborted.promise.then(() => {
    throw new DOMException("Transport aborted", "AbortError");
  })]).finally(() => signal?.removeEventListener("abort", onAbort));
  return { ...response, aborted: aborted.promise, promise };
}

async function failOneCheckpoint(directory: string): Promise<{ finished: Promise<void> }> {
  // Each FIFO returns a live lock owner. Replace it before EOF so the next lock read is gated
  // independently. Six reads exhaust one real queue mutation's bounded lock-acquisition retries.
  const path = join(directory, "queue.json.lock");
  const fifo = () => promisify(execFile)("mkfifo", [path]);
  await fifo();
  const finished = (async () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      const writer = await open(path, "w");
      try {
        await writer.writeFile(JSON.stringify({ pid: process.pid, token: "external-writer" }));
        await rm(path);
        if (attempt < 5) await fifo();
      } finally { await writer.close(); }
    }
  })();
  return { finished };
}

async function fixture(t: TestContext, options: Partial<CaptureServiceOptions> = {}) {
  const directory = await mkdtemp(join(tmpdir(), "capture-cancellation-"));
  const workers: Promise<unknown>[] = [];
  const services: CaptureService[] = [];
  const releases: Array<() => void> = [];
  t.after(async () => {
    services.forEach((service) => service.stop());
    releases.forEach((release) => release());
    await Promise.allSettled(workers);
    await rm(directory, { recursive: true, force: true });
  });
  const state = {
    holdModel: false, failModel: false, modelStarted: gate(), modelAborted: gate(),
    emptyCandidates: false, rich: false,
    action: "create" as "create" | "supersede" | "escalate",
    rest: undefined as undefined | ((path: string, init?: RequestInit) =>
      Promise<Response> | undefined),
    creates: 0, supersessions: 0, models: [] as string[],
  };
  const stored = new Map<number, Record<string, unknown>>();
  const client = new ApiForgetfulClient({ baseUrl: "https://fixture.invalid/api/v1",
    timeoutMs: 60_000, fetchImpl: async (url, init) => {
      const path = new URL(String(url)).pathname;
      const scripted = state.rest?.(path, init);
      if (scripted) return scripted;
      if (path.endsWith("/projects")) return Response.json({ projects: [{ id: 7, name: "Test" }] });
      if (path.endsWith("/memories/search"))
        return Response.json({ primary_memories: stored.has(42) ? [stored.get(42)] : [],
          linked_memories: [] });
      if (path.endsWith("/entities/search")) return Response.json({ entities: [] });
      if (path.endsWith("/memories") && init?.method === "POST") {
        state.creates++;
        stored.set(99, { ...JSON.parse(String(init.body)), id: 99, is_obsolete: false,
          linked_memory_ids: [] });
        return Response.json({ id: 99 });
      }
      const id = Number(path.split("/").at(-1));
      if (path.includes("/graph/memory/"))
        return Response.json({ center_memory_id: id, edges: [] });
      if (init?.method === "GET" && stored.has(id)) return Response.json(stored.get(id));
      if (init?.method === "PUT" && stored.has(id)) {
        stored.set(id, { ...stored.get(id), ...JSON.parse(String(init.body)) });
        return Response.json(stored.get(id));
      }
      if (init?.method === "DELETE" && stored.has(id)) {
        state.supersessions++;
        stored.set(id, { ...stored.get(id), is_obsolete: true,
          superseded_by: JSON.parse(String(init.body)).superseded_by });
        return Response.json({ success: true });
      }
      return new Response("Unexpected fixture request", { status: 404 });
    } });
  const runtime = await ModelRuntime.create({ authPath: join(directory, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  runtime.registerProvider("cancellation", { api: "faux", apiKey: "fixture-only",
    baseUrl: "https://fixture.invalid/unused", models: [{ id: "memory", name: "Memory",
      reasoning: false, input: ["text"], contextWindow: 64_000, maxTokens: 1024,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
    streamSimple(_model, context, options) {
      const name = providerTools(context)[0]!.name;
      state.models.push(name);
      const input = decodeProviderContext(context).input;
      const source = input.eligibleEvidence?.find(
        (entry: { role: string }) => entry.role === "user");
      const arguments_: JsonObject = name === "submit_capture_candidates" ? {
        candidates: state.emptyCandidates ? [] : [{
        id: "storage", title: "Storage", content: "Use SQLite for this repo.",
        context: "Explicit decision", keywords: ["storage"], tags: [],
        sourceEntryIds: [source.id], evidenceType: "userDecision",
        ...(state.rich ? { entities: [{ key: "database", sourceEntryIds: [source.id],
          input: { name: "SQLite", entity_type: "System", tags: [], aka: [] } }] } : {}),
      }] } : name === "submit_capture_decision" ? state.action === "create"
        ? { action: "create" } : { action: state.action, conflictingMemoryId: 42,
          oldClaim: "Use Postgres.", newClaim: "Use SQLite.", reason: "Explicit correction.",
          sourceEntryIds: input.candidate.sourceEntryIds }
        : name === "submit_capture_retry" ? { action: "retry", reason: "Retry requested." }
          : name === "submit_memory_revision" ? {
            title: "Storage", content: "Use SQLite for this repo.", context: "Confirmed change.",
            keywords: ["storage"], tags: [], importance: 7, sourceEntryIds: input.evidenceEntryIds,
            documentIds: [], codeArtifactIds: [], entityIds: [], memoryIds: [], fileIds: [],
            sourceFiles: [],
          } : { reviews: [{ candidateId: "storage",
            decisions: (input.candidates?.[0]?.memories ?? []).map((memory: { id: number }) => ({
              memoryId: memory.id, action: "ignore", reason: "Leave unrelated memories unchanged.",
            })),
            ...(state.action === "supersede" ? { preservation: { status: "complete",
              documentIds: [], codeArtifactIds: [], entityIds: [], reason: "No prior resources." } }
              : {}),
          }] };
      const message: AssistantMessage = { role: "assistant", api: "faux",
        provider: "cancellation", model: "memory", content: [{ type: "toolCall",
          id: "submission", name, arguments: arguments_ }], stopReason: "toolUse", timestamp: 1,
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      const stream = createAssistantMessageEventStream();
      const emit = () => stream.end(message);
      if (state.holdModel) {
        releases.push(emit);
        options?.signal?.addEventListener("abort", () => {
          state.modelAborted.resolve();
          stream.end({ ...message, content: [], stopReason: "aborted" });
        }, { once: true });
        state.modelStarted.resolve();
      } else if (state.failModel) stream.end({ ...message, content: [], stopReason: "error",
        errorMessage: "External model unavailable" });
      else queueMicrotask(emit);
      return stream;
    } });
  const model = new PiMemoryModel(new ModelRegistry(runtime),
    { provider: "cancellation", id: "memory" });
  const open = (recovery: { staleJobMs?: number } = {}) => {
    const queue = new DurableQueueStore({ ...recovery, directory, instanceId: "test" });
    const service = new CaptureService({ ...options, queue, client, model, instanceId: "test" });
    services.push(service);
    return { queue, service, run() {
      const worker = service.checkpoint();
      workers.push(worker);
      void worker.catch(() => undefined);
      return worker;
    } };
  };
  const session = SessionManager.inMemory(directory);
  session.appendMessage({ role: "user", content: "We decided to use SQLite for this repo.",
    timestamp: 1 });
  session.appendMessage({ role: "assistant", api: "faux", provider: "cancellation",
    model: "memory", content: [{ type: "text", text: "Decision noted." }],
    stopReason: "stop", timestamp: 2,
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } });
  const snapshot = buildCaptureSnapshot({ session, instanceId: "test", mode: "auto",
    scope: "global", policy: "Save decisions", modelVersion: "memory", context: {
      cwd: directory, sessionId: session.getSessionId(), branchId: "active",
      project: { id: 7, name: "Test" },
    } });
  assert.equal(snapshot.status, "ready");
  if (snapshot.status !== "ready") throw new Error("Expected capture evidence");
  const initial = open();
  const queued = await initial.service.enqueue(snapshot.snapshot);
  return { ...initial, directory, state, stored, open, jobId: queued.jobId, releases,
    snapshot: snapshot.snapshot, track(promise: Promise<unknown>) {
      workers.push(promise);
      void promise.catch(() => undefined);
    } };
}

test("worker lock contention is distinct from a failed nested capture checkpoint", async (t) => {
  // Arrange: real branch and queue file locks, with a durably enqueued capture job.
  const f = await fixture(t);
  const identity = { instanceId: "test" };
  const branch = f.snapshot.context;
  const lockPath = join(f.directory, "queue.json.lock");
  // Act: the worker owns its branch but a separate writer owns the mutation lock.
  const work = f.queue.withWorkerLock(identity, branch, async () => {
    const competing = await f.open().queue.withWorkerLock(identity, branch,
      async () => "must not acquire");
    assert.equal(competing, undefined, "own branch contention remains failure-open");
    await writeFile(lockPath, JSON.stringify({ pid: process.pid, token: "other-writer" }));
    await f.queue.checkpoint(f.jobId, { lastError: "Capture checkpoint" });
  });

  // Assert: nested persistence failure is visible and the branch lock is still released.
  await assert.rejects(bounded(work), (error: Error) =>
    error.name === "QueueBusyError" && error.message.includes(lockPath));
  assert.deepEqual((await readdir(f.directory)).filter((name) => name.startsWith("worker-")), []);
});

test("cancellation waits for a summary checkpoint already blocked by the real queue lock",
  { skip: process.platform === "win32", timeout: 15_000 }, async (t) => {
    // Arrange: real Pi model, source history and durable queue; only provider output is scripted.
    const directory = await mkdtemp(join(tmpdir(), "capture-blocked-summary-"));
    const providerStarted = gate(), providerReply = gate(), modelSettled = gate();
    const queue = new DurableQueueStore({ directory, instanceId: "blocked-summary" });
    const order: string[] = [];
    const runtime = await ModelRuntime.create({ authPath: join(directory, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    const message: AssistantMessage = { role: "assistant", api: "faux",
      provider: "blocked-summary", model: "memory", stopReason: "stop", timestamp: 1,
      content: [{ type: "text", text: "Accepted cumulative source summary." }],
      usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
    runtime.registerProvider("blocked-summary", { api: "faux", apiKey: "fixture-only",
      baseUrl: "https://fixture.invalid/unused", models: [{ id: "memory", name: "Memory",
        reasoning: false, input: ["text"], contextWindow: 64_000, maxTokens: 1024,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
      streamSimple(_model, context) {
        assert.deepEqual(providerTools(context), [], "Only preparation may reach this provider");
        const stream = createAssistantMessageEventStream();
        providerStarted.resolve();
        void providerReply.promise.then(() => stream.end(message));
        return stream;
      } });
    const model = new PiMemoryModel(new ModelRegistry(runtime),
      { provider: "blocked-summary", id: "memory" }, { contextLimitTokens: 8000,
        compactionSettings: { enabled: true, reserveTokens: 1200, keepRecentTokens: 1200 } });
    const capture = new CaptureService({ queue, model, instanceId: "blocked-summary",
      client: {} as ForgetfulClient,
      getMode: () => "observe", onActivity: (phase) => {
        if (phase === undefined) { order.push("model-settled"); modelSettled.resolve(); }
      } });
    let writer: FileHandle | undefined;
    let worker: Promise<unknown> | undefined;
    t.after(async () => {
      capture.stop();
      providerReply.resolve();
      await rm(queue.lockPath, { force: true });
      await writer?.close();
      await worker;
      await rm(directory, { recursive: true, force: true });
    });
    const session = SessionManager.inMemory(directory);
    for (let index = 0; index < 36; index++) {
      session.appendMessage({ role: "user", timestamp: 1,
        content: `Original evidence ${index}: ${"historical discussion ".repeat(100)}` });
    }
    session.appendMessage(message);
    const built = buildCaptureSnapshot({ session, instanceId: "blocked-summary", mode: "observe",
      scope: "global", policy: "", modelVersion: "memory", context: { cwd: directory,
        sessionId: session.getSessionId(), branchId: "active" } });
    assert.equal(built.status, "ready");
    if (built.status !== "ready") throw new Error("Expected source snapshot");
    const queued = await capture.enqueue(built.snapshot);

    // Act: a FIFO's reader/writer handshake proves the durable callback is waiting on the lock.
    let returned = false;
    worker = capture.checkpoint().then((result) => {
      returned = true;
      order.push("checkpoint-returned");
      return result;
    });
    await bounded(providerStarted.promise);
    await promisify(execFile)("mkfifo", [queue.lockPath]);
    providerReply.resolve();
    writer = await bounded(open(queue.lockPath, "w"));
    order.push("summary-checkpoint-blocked");
    capture.stop();
    order.push("lifecycle-cancelled");
    await bounded(modelSettled.promise);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(returned, false, "Cancellation must wait behind the already accepted checkpoint");
    // Remove the FIFO before EOF; the next actual queue lock acquisition can then succeed.
    await writer.writeFile(JSON.stringify({ pid: process.pid + 100_000, token: "dead-writer" }));
    await rm(queue.lockPath);
    await writer.close();
    writer = undefined;
    order.push("queue-lock-released");
    await bounded(worker);

    // Assert: the in-flight checkpoint wins before cancellation, retaining progress on restart.
    const reopened = new DurableQueueStore({ directory, instanceId: "blocked-summary" });
    const pending = await reopened.getJob(queued.jobId);
    assert.equal(pending?.status, "paused");
    assert.equal(pending?.attempts, 0);
    assert.equal(pending?.callCount, 0);
    assert.equal(pending?.snapshot.historySummary?.text, "Accepted cumulative source summary.");
    assert.deepEqual(pending?.snapshot.entries, built.snapshot.entries);
    assert.deepEqual(pending?.snapshot.sourceConversation, built.snapshot.conversation);
    assert.equal((await reopened.getWatermark(session.getSessionId(), "active")).historyDigest,
      undefined);
    assert.deepEqual(order, ["summary-checkpoint-blocked", "lifecycle-cancelled", "model-settled",
      "queue-lock-released", "checkpoint-returned"]);
  });

for (const operation of ["create", "supersede"] as const) {
  test(`failed shutdown persistence reports errors and prevents ${operation} replay`, async (t) => {
    // Arrange: an accepted request followed by an unavailable queue mutation lock.
    const f = await fixture(t);
    if (operation === "supersede") {
      f.stored.set(42, oldMemory);
      f.state.action = "supersede";
    }
    const started = gate<ReturnType<typeof heldResponse>>();
    let accepted = 0;
    f.state.rest = (path, init) => {
      if (!(operation === "create" ? path.endsWith("/memories") && init?.method === "POST"
        : init?.method === "DELETE")) return;
      accepted++;
      const held = heldResponse(init?.signal);
      f.releases.push(() => held.resolve(Response.json({ id: 99, success: true })));
      started.resolve(held);
      return held.promise;
    };
    const worker = f.run();
    const held = await bounded(started.promise);
    const lockPath = join(f.directory, "queue.json.lock");
    await writeFile(lockPath, JSON.stringify({ pid: process.pid, token: "blocked-disk" }));
    // Act: every post-abort checkpoint fails; a drained worker must report unsafe persistence.
    f.service.stop();
    await bounded(held.aborted);
    try {
      await assert.rejects(bounded(worker), (error: AggregateError) => {
        assert.ok(error instanceof AggregateError);
        assert.ok(error.errors.some((item: Error) => /aborted/i.test(item.message)));
        assert.ok(error.errors.some((item: Error) => item.name === "QueueBusyError"));
        return true;
      });
    } finally { await rm(lockPath, { force: true }); }
    // Assert: durable pre-dispatch receipts also protect a later restart with no final marker.
    const beforeRecovery = await f.open().queue.getJob(f.jobId);
    const receipt = operation === "supersede" ? beforeRecovery?.supersession
      : (beforeRecovery?.candidateOutcomes.storage as { creation?: { status: string } })?.creation;
    assert.equal(receipt?.status, "started", "The accepted write must have a durable receipt");
    const recoveries = [];
    for (let i = 0; i < 4; i++) recoveries.push(await f.open({ staleJobMs: 0 }).run());
    assert.equal(accepted, 1);
    const saved = await f.open().queue.getJob(f.jobId);
    assert.ok(saved?.uncertainWrite, JSON.stringify({ operation, accepted, saved,
      recoveries, modelSubmissions: f.state.models }));
    assert.match(JSON.stringify(saved?.snapshot.entries), /We decided to use SQLite/);
  });
}


test("an aborted create stays blocked when its first receipt checkpoint fails",
  { skip: process.platform === "win32" }, async (t) => {
    // Arrange: accepted REST create, real queue, and one externally blocked checkpoint.
    const f = await fixture(t);
    const started = gate<ReturnType<typeof heldResponse>>();
    f.state.rest = (path, init) => {
      if (!path.endsWith("/memories") || init?.method !== "POST") return;
      f.state.creates++;
      const held = heldResponse(init.signal);
      f.releases.push(() => held.resolve(Response.json({ id: 99 })));
      started.resolve(held);
      return held.promise;
    };
    const worker = f.run();
    const held = await bounded(started.promise);
    const fault = await failOneCheckpoint(f.directory);
    // Act: the abort diagnostic cannot be written, but the later safety checkpoint can.
    f.service.stop();
    await bounded(Promise.all([held.aborted, worker, fault.finished]));
    // Assert: attribution survives the checkpoint error and recovery never reissues the create.
    const saved = await f.open().queue.getJob(f.jobId);
    assert.equal((saved?.candidateOutcomes.storage as any).creation.status, "started");
    assert.ok(saved?.uncertainWrite);
    assert.equal(saved?.attempts, 0);
    for (let i = 0; i < 4; i++) await f.open().run();
    assert.equal(f.state.creates, 1);
    assert.match(JSON.stringify(saved?.snapshot.entries), /We decided to use SQLite/);
  });

test("four model cancellations preserve evidence and budgets across restarts", async (t) => {
  // Arrange: real Pi model/queue with a held external provider response.
  const f = await fixture(t);
  f.state.holdModel = true;
  for (let i = 0; i < 4; i++) {
    const current = f.open();
    f.state.modelStarted = gate();
    f.state.modelAborted = gate();
    const worker = current.run();
    await bounded(f.state.modelStarted.promise);
    // Act: stop and await the real worker without releasing its model response.
    current.service.stop();
    await bounded(Promise.all([worker, f.state.modelAborted.promise]));
    // Assert: reopening retains the original evidence and all failure/model allowance.
    const job = await f.open().queue.getJob(f.jobId);
    assert.equal(job?.status, "paused");
    assert.equal(job?.attempts, 0);
    assert.equal(job?.callCount, 0);
    assert.match(JSON.stringify(job?.snapshot.entries), /We decided to use SQLite/);
  }
  f.state.holdModel = false;
  const resumed = f.open();
  await resumed.run();
  assert.equal((await resumed.queue.getJob(f.jobId))?.status, "complete");
  assert.equal(f.state.creates, 1);
});

const oldMemory = { id: 42, title: "Storage", content: "Use Postgres.",
  context: "Old decision", keywords: ["storage"], tags: [], importance: 7,
  project_ids: [7], is_obsolete: false, linked_memory_ids: [] };

test("cancelled supersession keeps its unknown outcome across durable restarts", async (t) => {
  // Arrange: the server accepts obsolescence but no acknowledgement is available.
  const f = await fixture(t);
  f.stored.set(42, oldMemory);
  f.state.action = "supersede";
  const started = gate<ReturnType<typeof heldResponse>>();
  f.state.rest = (_path, init) => {
    if (init?.method !== "DELETE") return;
    f.state.supersessions++;
    const held = heldResponse(init.signal);
    f.releases.push(() => held.resolve(Response.json({ success: true })));
    started.resolve(held);
    return held.promise;
  };
  const worker = f.run();
  const held = await bounded(Promise.race([started.promise, worker.then((result) => {
    throw new Error(`Supersession finished before acceptance: ${JSON.stringify(result)}`);
  })]));
  // Act.
  f.service.stop();
  await bounded(Promise.all([worker, held.aborted]));
  f.state.rest = undefined;
  for (let i = 0; i < 4; i++) await f.open().run();
  // Assert: even an old/stale read of the original cannot authorize another supersession.
  assert.equal(f.state.creates, 1);
  assert.equal(f.state.supersessions, 1);
  const job = await f.open().queue.getJob(f.jobId);
  assert.equal(job?.status, "paused");
  assert.equal(job?.attempts, 0);
  assert.ok(job?.uncertainWrite);
});

test("stop cancels foreground resolution's model; the retained conflict resumes", async (t) => {
  // Arrange: produce a conflict through the normal capture path.
  const f = await fixture(t);
  f.stored.set(42, oldMemory);
  f.state.action = "escalate";
  await f.run();
  const [conflict] = await f.service.pendingConflicts();
  assert.ok(conflict);
  f.state.holdModel = true;
  const resolution = { action: "supersede" as const, reason: "Confirmed correction." };
  const resolving = f.service.resolveConflict(conflict.id, resolution)
    .then(() => undefined, (error: unknown) => error);
  await bounded(Promise.race([f.state.modelStarted.promise, resolving.then((error) => {
    throw error ?? new Error("Resolution finished before the held model request");
  })]));
  // Act.
  f.service.stop();
  const [error] = await bounded(Promise.all([resolving, f.state.modelAborted.promise]));
  // Assert: cancellation reaches the provider and recovery uses the original evidence.
  assert.ok(error instanceof Error);
  assert.equal((await f.open().queue.getConflict(conflict.id))?.status, "pending");
  f.state.holdModel = false;
  const result = await f.open().service.resolveConflict(conflict.id, resolution);
  assert.equal(result.status, "resolved");
  assert.equal(f.state.creates, 1);
});

for (const operation of ["create", "supersede"] as const) {
  test(`an uncertain foreground ${operation} is not repeated after restart`, async (t) => {
    // Arrange: produce a real pending conflict and hold an accepted resolution mutation.
    const f = await fixture(t);
    f.stored.set(42, oldMemory);
    f.state.action = "escalate";
    await f.run();
    const [conflict] = await f.service.pendingConflicts();
    assert.ok(conflict);
    const started = gate<ReturnType<typeof heldResponse>>();
    let accepted = 0;
    f.state.rest = (path, init) => {
      const matches = operation === "create"
        ? path.endsWith("/memories") && init?.method === "POST" : init?.method === "DELETE";
      if (!matches) return;
      accepted++;
      const held = heldResponse(init?.signal);
      f.releases.push(() => held.resolve(Response.json(
        operation === "create" ? { id: 99 } : { success: true })));
      started.resolve(held);
      return held.promise;
    };
    const resolution = { action: "supersede" as const, reason: "Confirmed correction." };
    const resolving = f.service.resolveConflict(conflict.id, resolution)
      .then(() => undefined, (error: unknown) => error);
    f.track(resolving);
    const held = await bounded(Promise.race([started.promise, resolving.then((error) => {
      throw error ?? new Error("Resolution finished without the held write");
    })]));
    // Act: cancel without supplying a response, then reopen and repeat the same request.
    f.service.stop();
    await bounded(Promise.all([resolving, held.aborted]));
    const diagnostic = (await f.open().queue.getConflict(conflict.id))?.uncertainWrite;
    assert.ok(diagnostic);
    for (let i = 0; i < 4; i++) {
      await assert.rejects(f.open().service.resolveConflict(conflict.id, resolution),
        (error: Error) => {
          assert.match(error.message, /Earlier save outcome unknown; automatic retry blocked/);
          assert.ok(error.message.includes(diagnostic), "Pi only forwards error.message");
          assert.equal((error.cause as Error)?.message, diagnostic);
          return true;
        });
    }
    // Assert: the pending conflict retains both known receipts and the unresolved outcome.
    const saved = await f.open().queue.getConflict(conflict.id);
    assert.equal(saved?.status, "pending");
    assert.ok(saved?.uncertainWrite);
    assert.equal(accepted, 1);
    if (operation === "supersede") assert.equal(saved?.replacement?.memoryId, 99);
  });
}

test("stopping an overlap read aborts REST and preserves the job for restart", async (t) => {
  // Arrange: the actual REST adapter waits for a controlled HTTP response.
  const f = await fixture(t);
  const started = gate<ReturnType<typeof heldResponse>>();
  f.state.rest = (path, init) => {
    if (!path.endsWith("/memories/search")) return;
    const held = heldResponse(init?.signal);
    f.releases.push(() => held.resolve(Response.json({ primary_memories: [] })));
    started.resolve(held);
    return held.promise;
  };
  const worker = f.run();
  const held = await bounded(started.promise);
  // Act.
  f.service.stop();
  await bounded(Promise.all([worker, held.aborted]));
  // Assert.
  const resumed = f.open();
  const job = await resumed.queue.getJob(f.jobId);
  assert.equal(job?.status, "paused");
  assert.equal(job?.attempts, 0);
  f.state.rest = undefined;
  await resumed.run();
  assert.equal((await resumed.queue.getJob(f.jobId))?.status, "complete");
  assert.equal(f.state.creates, 1);
});

for (const response of ["within grace", "unknown"] as const) {
  test(`accepted capture write ${response} is not repeated after restart`, async (t) => {
    // Arrange: the remote service accepts the create, but holds its response.
    const f = await fixture(t);
    const started = gate<ReturnType<typeof heldResponse>>();
    f.state.rest = (path, init) => {
      if (!path.endsWith("/memories") || init?.method !== "POST") return;
      f.state.creates++;
      f.stored.set(99, { ...JSON.parse(String(init.body)), id: 99, is_obsolete: false,
        linked_memory_ids: [] });
      const held = heldResponse(init.signal);
      f.releases.push(() => held.resolve(Response.json({ id: 99 })));
      started.resolve(held);
      return held.promise;
    };
    const worker = f.run();
    const held = await bounded(started.promise);
    // Act: stop after acceptance. Only the grace case supplies a response.
    f.service.stop();
    if (response === "within grace") {
      const timer = setTimeout(() => held.resolve(Response.json({ id: 99 })), 50);
      t.after(() => clearTimeout(timer));
      await bounded(worker);
    } else await bounded(Promise.all([worker, held.aborted]));
    // Assert: receipts/evidence survive; recovery cannot duplicate an uncertain create.
    f.state.rest = undefined;
    const resumed = f.open();
    const job = await resumed.queue.getJob(f.jobId);
    assert.equal(job?.status, "paused");
    assert.equal(job?.attempts, 0);
    const outcome = job?.candidateOutcomes.storage as any;
    assert.equal(outcome.creation.status, response === "within grace" ? "completed" : "unknown");
    if (response === "within grace") assert.equal(outcome.memoryId, 99);
    for (let i = 0; i < 4; i++) await resumed.run();
    assert.equal(f.state.creates, 1);
    const after = await resumed.queue.getJob(f.jobId);
    assert.equal(after?.status, response === "within grace" ? "complete" : "paused");
    if (response === "unknown") {
      assert.equal(after?.attempts, 0);
      assert.match(JSON.stringify(after?.snapshot.entries), /We decided to use SQLite/);
    }
  });
}

for (const response of ["within grace", "unknown"] as const) {
  test(`rich creation ${response} retains its receipt without replay`, async (t) => {
    // Arrange: real KnowledgeWriter with a held external entity creation.
    const f = await fixture(t);
    f.state.rich = true;
    const started = gate<ReturnType<typeof heldResponse>>();
    let creates = 0;
    let entity: Record<string, unknown>;
    f.state.rest = (path, init) => {
      if (path.endsWith("/entities/51")) return Promise.resolve(Response.json(entity));
      if (!path.endsWith("/entities") || init?.method !== "POST") return;
      creates++;
      entity = { ...JSON.parse(String(init.body)), id: 51 };
      const held = heldResponse(init.signal);
      f.releases.push(() => held.resolve(Response.json(entity, { status: 201 })));
      started.resolve(held);
      return held.promise;
    };
    const worker = f.run();
    const held = await bounded(Promise.race([started.promise, worker.then((result) => {
      throw new Error(`Entity creation did not start: ${JSON.stringify(result)}`);
    })]));
    // Act: retain successful receipts in grace, or abort the unacknowledged transport.
    f.service.stop();
    if (response === "within grace") held.resolve(Response.json(entity!, { status: 201 }));
    else await bounded(held.aborted);
    await bounded(worker);
    const resumed = f.open();
    const before = await resumed.queue.getJob(f.jobId);
    const receipt = (before?.candidateOutcomes.storage as any).knowledgeState;
    if (response === "within grace")
      assert.deepEqual(receipt.entities, [{ key: "database", id: 51 }]);
    else assert.equal(receipt.pendingCreates.length, 1);
    for (let i = 0; i < 4; i++) await resumed.run();
    // Assert: the memory and entity were each accepted exactly once.
    assert.equal(f.state.creates, 1);
    assert.equal(creates, 1);
    assert.equal((await resumed.queue.getJob(f.jobId))?.status,
      response === "within grace" ? "complete" : "paused");
  });
}

test("real model failures still discard capture after three attempts", async (t) => {
  // Arrange.
  const f = await fixture(t);
  f.state.failModel = true;
  // Act and assert through separate durable workers.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const current = f.open();
    const result = await current.run();
    const job = await current.queue.getJob(f.jobId);
    if (attempt < 3) assert.equal(job?.attempts, attempt);
    else {
      assert.equal(job, undefined);
      assert.equal(result.discardedJobs?.length, 1);
    }
  }
});

test("a worker finishing does not hide concurrent foreground resolution activity", async (t) => {
  // Arrange: create a conflict, then hold another branch's worker and the foreground review.
  const phases: Array<"reviewing" | "saving" | "checking" | undefined> = [];
  const f = await fixture(t, { onActivity: (phase) => phases.push(phase) });
  f.stored.set(42, oldMemory);
  f.state.action = "escalate";
  await f.run();
  const [conflict] = await f.service.pendingConflicts();
  assert.ok(conflict);
  f.state.holdModel = true;
  f.state.emptyCandidates = true;
  await f.service.enqueue({ ...f.snapshot, id: "other-branch",
    context: { ...f.snapshot.context, branchId: "other" } });
  const worker = f.run();
  await bounded(f.state.modelStarted.promise);
  const releaseWorker = f.releases.at(-1)!;
  f.state.modelStarted = gate();
  const resolving = f.service.resolveConflict(conflict.id,
    { action: "supersede", reason: "Confirmed correction." });
  f.track(resolving);
  await bounded(f.state.modelStarted.promise);
  const releaseResolution = f.releases.at(-1)!;
  // Act: finish only the background worker while the foreground model remains held.
  releaseWorker();
  await bounded(worker);
  // Assert: UI still reports the foreground work, then clears after its full completion.
  assert.equal(phases.at(-1), "reviewing");
  f.state.holdModel = false;
  releaseResolution();
  await bounded(resolving);
  assert.ok(phases.includes("checking"));
  assert.ok(phases.includes("saving"));
  assert.equal(phases.at(-1), undefined);
});

test("foreground safety checkpoint failure reports abort and storage diagnostics", async (t) => {
  // Arrange: real pending conflict, with a held final supersession and blocked queue storage.
  const f = await fixture(t);
  f.stored.set(42, oldMemory);
  f.state.action = "escalate";
  await f.run();
  const [conflict] = await f.service.pendingConflicts();
  const started = gate<ReturnType<typeof heldResponse>>();
  let accepted = 0;
  f.state.rest = (_path, init) => {
    if (init?.method !== "DELETE") return;
    accepted++;
    const held = heldResponse(init.signal);
    f.releases.push(() => held.resolve(Response.json({ success: true })));
    started.resolve(held);
    return held.promise;
  };
  const resolution = { action: "supersede" as const, reason: "Confirmed correction." };
  const resolving = f.service.resolveConflict(conflict!.id, resolution);
  f.track(resolving);
  const held = await bounded(started.promise);
  const lockPath = join(f.directory, "queue.json.lock");
  await writeFile(lockPath, JSON.stringify({ pid: process.pid, token: "blocked-disk" }));
  // Act: abort after acceptance while the safety checkpoint cannot acquire its file lock.
  f.service.stop();
  try {
    await assert.rejects(bounded(resolving), (error: AggregateError) => {
      assert.ok(error instanceof AggregateError);
      assert.ok(error.errors.some((item: Error) => /aborted/i.test(item.message)));
      assert.ok(error.errors.some((item: Error) => item.name === "QueueBusyError"));
      return true;
    });
    await bounded(held.aborted);
  } finally { await rm(lockPath, { force: true }); }
  // Assert: the older pre-dispatch receipt is sufficient to block replay after disk recovery.
  const saved = await f.open().queue.getConflict(conflict!.id);
  assert.equal(saved?.supersession?.status, "started");
  await assert.rejects(f.open().service.resolveConflict(conflict!.id, resolution),
    /Earlier save outcome unknown; automatic retry blocked/);
  assert.equal(accepted, 1);
});

test("ordinary memory reads report reviewing; saved replacement validation reports checking",
  async (t) => {
    // Arrange: hold an existing-memory read before the foreground model has proposed any save.
    const phases: Array<"reviewing" | "saving" | "checking" | undefined> = [];
    const f = await fixture(t, { onActivity: (phase) => phases.push(phase) });
    f.stored.set(42, oldMemory);
    f.state.action = "escalate";
    await f.run();
    const [conflict] = await f.service.pendingConflicts();
    const reading = gate<ReturnType<typeof heldResponse>>();
    const checking = gate<ReturnType<typeof heldResponse>>();
    let firstRead = true;
    f.state.rest = (path, init) => {
      if (init?.method !== "GET") return;
      if (!(firstRead && path.endsWith("/memories/42")) &&
          !path.endsWith("/memories/99")) return;
      const held = heldResponse(init.signal);
      f.releases.push(() => held.resolve(Response.json(f.stored.get(99) ?? oldMemory)));
      if (firstRead) { firstRead = false; reading.resolve(held); }
      else checking.resolve(held);
      return held.promise;
    };
    const resolving = f.service.resolveConflict(conflict!.id,
      { action: "supersede", reason: "Confirmed correction." });
    f.track(resolving);
    // Act and assert at the actual REST reads, not timing-dependent UI snapshots.
    const old = await bounded(reading.promise);
    assert.equal(phases.at(-1), "reviewing");
    old.resolve(Response.json(oldMemory));
    const saved = await bounded(checking.promise);
    assert.equal(phases.at(-1), "checking");
    f.state.rest = undefined;
    saved.resolve(Response.json(f.stored.get(99)));
    assert.equal((await bounded(resolving)).status, "resolved");
  });

test("branch failure retains supersession uncertainty after a receipt checkpoint fails",
  { skip: process.platform === "win32" }, async (t) => {
    // Arrange: an accepted supersession with the first failure receipt blocked on disk.
    const f = await fixture(t);
    f.stored.set(42, oldMemory);
    f.state.action = "supersede";
    const started = gate<ReturnType<typeof heldResponse>>();
    let accepted = 0;
    f.state.rest = (_path, init) => {
      if (init?.method !== "DELETE") return;
      accepted++;
      const held = heldResponse(init.signal);
      f.releases.push(() => held.resolve(Response.json({ success: true })));
      started.resolve(held);
      return held.promise;
    };
    const worker = f.run();
    const held = await bounded(started.promise);
    const fault = await failOneCheckpoint(f.directory);
    // Act.
    f.service.stop();
    await bounded(Promise.all([worker, held.aborted, fault.finished]));
    // Assert: the outer branch handler retains the transport outcome independently of errors.
    const saved = await f.open().queue.getJob(f.jobId);
    assert.ok(saved?.uncertainWrite);
    assert.equal(saved?.supersession?.status, "started");
    assert.equal(saved?.attempts, 0);
    for (let i = 0; i < 4; i++) await f.open().run();
    assert.equal(accepted, 1);
  });

test("foreground write uncertainty cannot contaminate a concurrent worker's read cancellation",
  async (t) => {
    // Arrange: one service owns a foreground resolution and a worker on another branch.
    const f = await fixture(t);
    f.stored.set(42, oldMemory);
    f.state.action = "escalate";
    await f.run();
    const [conflict] = await f.service.pendingConflicts();
    f.state.action = "create";
    const background = await f.service.enqueue({ ...f.snapshot, id: "other-branch",
      context: { ...f.snapshot.context, branchId: "other" } });
    const readStarted = gate();
    const writeStarted = gate();
    const foregroundFinished = gate();
    f.state.rest = (path, init) => {
      if (path.endsWith("/memories/search")) {
        const held = heldResponse(init?.signal);
        f.releases.push(() => held.resolve(Response.json({ primary_memories: [] })));
        readStarted.resolve();
        // Return the read abort only after the foreground has persisted its uncertain write.
        return held.promise.catch(async (error) => {
          await foregroundFinished.promise;
          throw error;
        });
      }
      if (path.endsWith("/memories") && init?.method === "POST") {
        const held = heldResponse(init.signal);
        f.releases.push(() => held.resolve(Response.json({ id: 99 })));
        writeStarted.resolve();
        return held.promise;
      }
    };
    const worker = f.run();
    await bounded(readStarted.promise);
    const resolving = f.service.resolveConflict(conflict!.id,
      { action: "supersede", reason: "Confirmed correction." })
      .catch((error: unknown) => error).finally(() => foregroundFinished.resolve());
    f.track(resolving);
    await bounded(writeStarted.promise);
    // Act: both operations are cancelled, but only the foreground accepted a mutation.
    f.service.stop();
    await bounded(Promise.all([worker, resolving]));
    // Assert: only the conflict is blocked; the other branch retains an ordinary paused job.
    const reopened = f.open();
    assert.ok((await reopened.queue.getConflict(conflict!.id))?.uncertainWrite);
    const job = await reopened.queue.getJob(background.jobId);
    assert.equal(job?.status, "paused");
    assert.equal(job?.uncertainWrite, undefined);
    assert.equal(job?.attempts, 0);
    f.state.rest = undefined;
    await reopened.run();
    assert.equal((await reopened.queue.getJob(background.jobId))?.status, "complete");
  });

for (const operation of ["create", "supersede"] as const) {
  test(`explicit ${operation} service failure still permits model-reviewed retry`, async (t) => {
    // Arrange: one actual HTTP failure, followed by the model's existing retry instruction.
    const f = await fixture(t);
    if (operation === "supersede") {
      f.stored.set(42, oldMemory);
      f.state.action = "supersede";
    }
    let requests = 0;
    f.state.rest = (path, init) => {
      if (!(operation === "create" ? path.endsWith("/memories") && init?.method === "POST"
        : init?.method === "DELETE")) return;
      requests++;
      if (requests === 1)
        return Promise.resolve(new Response("Service maintenance detail", { status: 503 }));
    };
    // Act: complete a failed checkpoint, then let a new worker follow the model's decision.
    await f.run();
    const failed = await f.queue.getJob(f.jobId);
    assert.match(failed?.lastError ?? "", /Service maintenance detail/);
    const resumed = f.open();
    await resumed.run();
    // Assert: the safety change applies to unacknowledged operations, preserving explicit retries.
    const saved = await resumed.queue.getJob(f.jobId);
    assert.equal(saved?.status, "complete", saved?.lastError);
    assert.equal(requests, 2);
    assert.equal(saved?.uncertainWrite, undefined);
  });
}
