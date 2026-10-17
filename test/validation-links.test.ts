import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, Memory } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore, type QueueCheckpoint, type QueueJob } from "../src/queue.ts";
import { decodeProviderContext } from "./provider-context.ts";

const candidate = { id: "rule", title: "Bounded retries", content: "Retry transient errors twice.",
  context: "Adopted operational rule.", keywords: ["retry"], tags: [],
  sourceEntryIds: ["user"], evidenceType: "userDecision" };
const project = { id: 7, name: "Links" };
function memory(id: number, patch: Partial<Memory> = {}): Memory {
  return { id, title: `Stored fact ${id}`, content: "A related operational constraint.",
    context: "Existing fact.", keywords: ["retry"], tags: [], project_ids: [7],
    is_obsolete: false, linked_memory_ids: [], document_ids: [], code_artifact_ids: [], ...patch };
}
function snapshot(): CaptureSnapshot {
  return { id: "links", instanceId: "links", mode: "auto", scope: "global",
    policy: "Save supported facts.", modelVersion: "test", createdAt: new Date().toISOString(),
    finalEntryId: "answer", context: { cwd: "/repo", sessionId: "session", branchId: "branch",
      project }, entries: [
      { id: "user", role: "user", text: "We replaced one retry with two transient-error retries." },
      { id: "answer", role: "assistant", text: "Recorded." },
    ] };
}
interface Request { method: string; path: string; body: any }
async function fixture(t: TestContext, options: {
  timeoutMs?: number; fetchImpl?: typeof fetch;
} = {}) {
  const directory = await mkdtemp(join(tmpdir(), "validation-links-"));
  const stored = new Map<number, Memory>([[1, memory(1)],
    [2, memory(2, { project_ids: [7, 9] })]]);
  const requests: Request[] = [];
  const feedback: string[] = [];
  const modelCalls: string[] = [];
  const state = {
    decision: { action: "create" } as any,
    candidates: [candidate] as Array<typeof candidate>,
    review: (_input: any): unknown => ({ reviews: [] }),
    intercept: (_request: Request): {
      status: number; body: unknown; dropResponse?: boolean; holdResponse?: boolean;
    } | undefined => undefined,
  };
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString();
    const request = { method: req.method!, path: new URL(req.url!, "http://test").pathname,
      body: raw ? JSON.parse(raw) : undefined };
    requests.push(request);
    let status = 200, result: unknown;
    const intercepted = state.intercept(request);
    if (intercepted?.holdResponse) return;
    if (intercepted?.dropResponse) { res.destroy(); return; }
    if (intercepted) ({ status, body: result } = intercepted);
    else if (request.path === "/memories/search") result = {
      primary_memories: [stored.get(1)], linked_memories: [],
    };
    else if (request.path === "/projects") result = { projects: [
      { ...project, description: "Links test", repo_name: null },
    ] };
    else if (request.path === "/entities/search") result = { entities: [] };
    else if (request.path === "/documents") result = { documents: [] };
    else if (request.path === "/code-artifacts") result = { code_artifacts: [] };
    else if (request.path.startsWith("/graph/memory/")) result = {
      center_memory_id: Number(request.path.split("/").at(-1)), edges: [],
    };
    else if (request.path === "/memories" && request.method === "POST") {
      const createdId = 100 + requests.filter(r => r.method === "POST" &&
        r.path === "/memories").length - 1;
      stored.set(createdId, memory(createdId, { ...request.body, linked_memory_ids: [] }));
      status = 201;
      result = { id: createdId, linked_memory_ids: [] };
    } else {
      const match = request.path.match(/^\/memories\/(\d+)(?:\/links(?:\/(\d+))?)?$/);
      const id = Number(match?.[1]), target = Number(match?.[2]);
      const current = stored.get(id);
      if (!match || !current) { status = 404; result = "Not Found"; }
      else if (request.method === "GET") result = current;
      else if (request.method === "PUT") {
        Object.assign(current, request.body);
        result = current;
      } else if (request.path.endsWith("/links")) {
        const ids = request.body.related_ids as number[];
        current.linked_memory_ids = [...new Set([...current.linked_memory_ids!, ...ids])];
        for (const other of ids) stored.get(other)!.linked_memory_ids!.push(id);
        result = { linked_ids: ids };
      } else if (target) {
        current.linked_memory_ids = current.linked_memory_ids!.filter(value => value !== target);
        result = { success: true };
      } else {
        current.is_obsolete = true;
        current.superseded_by = request.body.superseded_by;
        result = { success: true };
      }
    }
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    await rm(directory, { recursive: true, force: true });
  });
  const address = server.address() as { port: number };
  const client = new ApiForgetfulClient({
    baseUrl: `http://127.0.0.1:${address.port}`, ...options,
  });
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 8_000,
      contextWindow: 200_000, input: ["text"] }) as any,
    complete: async (_model, context) => {
      const report = context.tools!.find(tool => tool.name === "report_capture_execution_failure");
      const reporting = report && !context.messages.some(message => message.role === "toolResult" &&
        message.toolName === "report_capture_execution_failure");
      const tool = reporting ? report : context.tools![0]!;
      modelCalls.push(tool.name);
      const input = decodeProviderContext(context).input;
      for (const message of context.messages) {
        if (message.role === "toolResult" && message.isError)
          feedback.push(JSON.stringify(message.content));
      }
      const args = reporting ? {} : tool.name === "submit_capture_candidates"
        ? { candidates: state.candidates }
        : tool.name === "submit_capture_decision" ? state.decision
        : tool.name === "submit_capture_decisions" ? { decisions: state.candidates.map(c =>
          ({ candidateId: c.id, ...state.decision })) } : state.review(input);
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: "submission", name: tool.name, arguments: args }],
        stopReason: "toolUse", timestamp: Date.now(), usage: {
          input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
        } } as any;
    },
  }, { provider: "test", id: "memory" });
  const queue = new DurableQueueStore({ directory, instanceId: "links" });
  const service = new CaptureService({ queue, client, model, instanceId: "links" });
  return {
    directory, stored, requests, feedback, modelCalls, state, client, queue, service, model,
  };
}
const judgment = (memoryId: number, action = "ignore", reason = "Related constraint.") =>
  ({ memoryId, action, reason });

test("capture accepts an additional unsupplied shared target and active shared saved memory",
  async (t) => {
    // Arrange: overlap supplies a local record; the provider adds another stored target.
    const f = await fixture(t);
    f.state.review = input => {
      assert.deepEqual(input.candidates[0].eligibleMemoryIds, [1]);
      f.stored.get(100)!.project_ids = [7, 9];
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1), judgment(2, "add")] }] };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act: execute the public worker and reopen its durable queue.
    const result = await f.service.checkpoint();
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const job = (await reopened.getJob(queued.jobId))!;

    // Assert through REST and durable outcome, with no live Forgetful instance.
    assert.deepEqual(result.errors, []);
    assert.equal(job.status, "complete", job.lastError);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, [2]);
    assert.deepEqual((await f.client.get(2)).linked_memory_ids, [100]);
    assert.deepEqual(f.feedback, []);
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 1);
  });

test("an already-shared saved memory can enter link review for explicit enrichment", async (t) => {
  // Arrange: L1 excludes other shared endpoints, not the saved memory being reviewed.
  const f = await fixture(t);
  f.stored.set(100, memory(100, { project_ids: [7, 9] }));
  f.state.decision = { action: "skip", memoryId: 100, enrich: true };
  let reviews = 0;
  f.state.review = input => {
    reviews++;
    assert.deepEqual(input.candidates[0].eligibleMemoryIds, [1]);
    return { reviews: [{ candidateId: "rule", decisions: [judgment(1, "add")] }] };
  };

  // Act.
  const queued = await f.service.enqueue(snapshot());
  const result = await f.service.checkpoint();

  // Assert: shared membership cannot silently bypass the requested review.
  assert.deepEqual(result.errors, []);
  assert.equal(reviews, 1);
  assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
  assert.deepEqual((await f.client.get(100)).linked_memory_ids, [1]);
});

test("supersession without preservation leaves existing replacement attachments untouched",
  async (t) => {
    // Arrange: omission is an instruction to leave attachments alone, not set empty arrays.
    const f = await fixture(t);
    f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
      newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
    f.state.review = () => {
      f.stored.get(100)!.document_ids = [41];
      return { reviews: [{ candidateId: "rule", decisions: [] }] };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act.
    const result = await f.service.checkpoint();
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId: "links" });

    // Assert: old history is superseded, but no attachment update was inferred.
    assert.deepEqual(result.errors, []);
    assert.equal((await reopened.getJob(queued.jobId))!.status, "complete");
    assert.deepEqual((await f.client.get(100)).document_ids, [41]);
    assert.equal((await f.client.get(1)).superseded_by, 100);
    assert.equal(f.requests.filter(r => r.method === "PUT").length, 0);
  });

for (const replacing of [true, false]) {
  test(`explicit preservation is executed despite unresolved status; replacing=${replacing}`,
    async (t) => {
      // Arrange: resources need not be in the supplied neighborhood or destination project.
      const f = await fixture(t);
      if (replacing) f.state.decision = { action: "supersede", conflictingMemoryId: 1,
        oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
        reason: "Complete adopted change." };
      const documents = [41, 41, 42, 43, 44, 45];
      const artifacts = [51, 51, 52, 53, 54, 55];
      const entities = [61, 61, 62, 63, 64, 65, 66, 67, 68];
      f.state.review = input => ({ reviews: [{ candidateId: "rule",
        decisions: input.candidates[0].memories.map((m: Memory) => judgment(m.id)),
        preservation: { status: "unresolved", documentIds: documents,
          codeArtifactIds: artifacts, entityIds: entities, reason: " ".repeat(600) },
      }] });
      f.state.intercept = request => request.path.startsWith("/entities/") &&
        request.method === "POST" ? { status: 200, body: { success: true } } : undefined;
      const queued = await f.service.enqueue(snapshot());

      // Act.
      const result = await f.service.checkpoint();

      // Assert: only explicit selected instructions are executed, unchanged by local filtering.
      assert.deepEqual(result.errors, []);
      assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
      const updated = await f.client.get(100);
      assert.deepEqual(updated.document_ids, documents);
      assert.deepEqual(updated.code_artifact_ids, artifacts);
      assert.equal(f.requests.filter(r => r.method === "GET" &&
        /^\/(documents|code-artifacts|entities)\//.test(r.path)).length, 0);
      assert.equal(f.requests.filter(r => r.method === "POST" &&
        r.path.startsWith("/entities/")).length, 8, "duplicate entity receipt is not replayed");
      if (replacing) assert.equal((await f.client.get(1)).is_obsolete, true);
    });
}

test("coverage feedback identifies the selected ID substituted by an unsupplied target",
  async (t) => {
    // Arrange: one-for-one substitution must not satisfy every-selected-endpoint coverage.
    const f = await fixture(t);
    let attempts = 0;
    f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: ++attempts === 1
      ? [judgment(2, "add")] : [judgment(1), judgment(2, "add")] }] });
    const queued = await f.service.enqueue(snapshot());

    // Act: PiMemoryModel receives corrective private-tool feedback and submits full coverage.
    await f.service.checkpoint();

    // Assert: extra target is allowed, while the missing selected ID is explicit in feedback.
    assert.equal(attempts, 2);
    assert.match(f.feedback.join("\n"), /Candidate rule.*missing memory IDs: 1/);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, [2]);
  });

for (const invalid of ["nine-decisions", "four-reviews", "duplicate", "blank", "sensitive"]) {
  test(`private link submission corrects retained safety constraint: ${invalid}`, async (t) => {
    // Arrange: the external provider first violates one retained private submission rule.
    const f = await fixture(t);
    let attempts = 0;
    f.state.review = () => {
      if (++attempts > 1) return { reviews: [{ candidateId: "rule", decisions: [judgment(1)] }] };
      if (invalid === "four-reviews") return { reviews: Array.from({ length: 4 }, () =>
        ({ candidateId: "rule", decisions: [judgment(1)] })) };
      const decisions = invalid === "nine-decisions"
        ? Array.from({ length: 9 }, (_, index) => judgment(index + 1))
        : invalid === "duplicate" ? [judgment(1), judgment(1)]
        : [judgment(1, "ignore", invalid === "blank" ? " " :
          "password=correct-horse-battery-staple")];
      return { reviews: [{ candidateId: "rule", decisions }] };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act.
    await f.service.checkpoint();

    // Assert: correction is private feedback, and the accepted no-op never mutates the graph.
    assert.equal(attempts, 2);
    assert.ok(f.feedback.length);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, []);
    assert.equal(f.requests.filter(r => r.path.includes("/links")).length, 0);
  });
}

test("queue restart retains completed and uncertain link receipts without model replanning",
  async (t) => {
    // Arrange: first add succeeds; the second response is uncertain and must not be replayed.
    const f = await fixture(t);
    f.stored.set(3, memory(3, { project_ids: [7, 9] }));
    let reviews = 0;
    f.state.review = () => {
      reviews++;
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1),
        judgment(2, "add"), judgment(3, "add")] }] };
    };
    f.state.intercept = request => request.path.endsWith("/links") &&
      request.body.related_ids[0] === 3
      ? { status: 503, body: "Edge write receipt unavailable" } : undefined;
    const queued = await f.service.enqueue(snapshot());
    await f.service.checkpoint();
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "paused");
    // Another writer removes the completed edge. A saved receipt never authorizes repair.
    f.stored.get(100)!.linked_memory_ids = [];
    f.stored.get(2)!.linked_memory_ids = [];
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue: reopened, client: f.client, model: f.model,
      instanceId: "links" });

    // Act: inspect the blocked saved instructions after a real filesystem queue restart.
    await restarted.checkpoint();

    // Assert: neither successful nor uncertain writes are submitted again.
    assert.equal(reviews, 1);
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 2);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, []);
    assert.equal((await reopened.getJob(queued.jobId))!.status, "paused");
  });

test("server rejects raw attachment IDs and a corrected review succeeds after queue restart",
  async (t) => {
    // Arrange: the server owns resource ID validation; the private envelope must pass them through.
    const f = await fixture(t);
    f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
      newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
    let reviews = 0;
    f.state.review = input => {
      if (++reviews === 2) assert.match(JSON.stringify(input), /document_ids.*valid integer/);
      return { reviews: [{ candidateId: "rule", decisions: [], preservation: {
        status: "unresolved", documentIds: reviews === 1 ? [-1, "wrong", null, 1.5] : [41],
        codeArtifactIds: [], entityIds: [], reason: "",
      } }] };
    };
    f.state.intercept = request => request.method === "PUT" &&
      request.body.document_ids.includes("wrong") ? { status: 422, body: {
        detail: [{ loc: ["body", "document_ids", 1], msg: "Input should be a valid integer" }],
      } } : undefined;
    const queued = await f.service.enqueue(snapshot());
    await f.service.checkpoint();
    const first = f.requests.filter(r => r.method === "PUT");
    assert.equal(first.length, 2, "rejected IDs and immediate correction both reach REST");
    assert.deepEqual(first[0]!.body.document_ids, [-1, "wrong", null, 1.5]);
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });

    // Act: the model sees the exact error and explicitly corrects the rejected instruction.
    const result = await restarted.checkpoint();

    // Assert: authoritative rejection permits correction without replaying uncertain writes.
    assert.deepEqual(result.errors, []);
    assert.equal(reviews, 2);
    assert.deepEqual((await f.client.get(100)).document_ids, [41]);
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.requests.filter(r => r.method === "PUT").length, 2);
  });

test("preservation needs only executable ID arrays, without a status or reason guard",
  async (t) => {
    // Arrange: neither descriptive field drives the selected attachment instructions.
    const f = await fixture(t);
    f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
      newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
    f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: [],
      preservation: { documentIds: [41], codeArtifactIds: [], entityIds: [] },
    }] });
    const queued = await f.service.enqueue(snapshot());

    // Act.
    const result = await f.service.checkpoint();

    // Assert: submission remains a structured executable envelope, with optional descriptions.
    assert.deepEqual(result.errors, []);
    assert.deepEqual((await f.client.get(100)).document_ids, [41]);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
  });

test("preservation bounds automatic reads but can select unread old resources after sharing",
  async (t) => {
    // Arrange: old and replacement records have more resources than automatic context allows.
    const f = await fixture(t);
    const documents = [41, 42, 43, 44, 45];
    const artifacts = [51, 52, 53, 54, 55];
    const entities = [61, 62, 63, 64, 65, 66, 67, 68, 69];
    f.stored.get(1)!.document_ids = documents;
    f.stored.get(1)!.code_artifact_ids = artifacts;
    f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
      newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
    f.state.intercept = request => {
      if (request.method === "POST" && request.path === "/memories")
        f.stored.get(1)!.project_ids = [7, 9];
      if (request.path === "/memories/100" && request.method === "GET") {
        f.stored.get(100)!.document_ids = [71, 72, 73, 74, 75];
        f.stored.get(100)!.code_artifact_ids = [81, 82, 83, 84, 85];
      }
      if (request.path === "/graph/memory/1") return { status: 200, body: {
        center_memory_id: 1, edges: entities.map(id => ({ type: "entity_memory",
          source: "memory_1", target: `entity_${id}` })),
      } };
      if (request.path.startsWith("/entities/") && request.method === "POST")
        return { status: 200, body: { success: true } };
      if (/^\/entities\/\d+$/.test(request.path)) return { status: 200, body: {
        id: Number(request.path.split("/").at(-1)), name: "Supporting system",
        entity_type: "System", aka: [], tags: [], project_ids: [9],
      } };
      if (request.path.startsWith("/code-artifacts/")) return { status: 200, body: {
        id: Number(request.path.split("/").at(-1)), title: "Supporting implementation",
        description: "Related context.", code: "retry(2)", language: "ts",
        tags: [], project_id: 9,
      } };
      if (request.path.startsWith("/documents/")) return { status: 200, body: {
        id: Number(request.path.split("/").at(-1)), title: "Supporting rationale",
        description: "Related context.", content: "Attempts consume the latency allowance.",
        tags: [], project_id: 9,
      } };
      return undefined;
    };
    let reviewInput: any;
    f.state.review = input => {
      reviewInput = input;
      return { reviews: [{ candidateId: "rule", decisions: [], preservation: {
        documentIds: documents, codeArtifactIds: artifacts, entityIds: entities,
      } }] };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act.
    const result = await f.service.checkpoint();

    // Assert: bounds limit actual GETs, while actions may include unread and foreign resources.
    assert.deepEqual(result.errors, []);
    assert.deepEqual(reviewInput.candidates[0].previous.memory.project_ids, [7, 9]);
    const { previous, resources } = reviewInput.candidates[0];
    const ids = (records: Array<{ id: number }>) => records.map(record => record.id);
    assert.deepEqual(previous.memory.document_ids, documents);
    assert.deepEqual(previous.memory.code_artifact_ids, artifacts);
    assert.deepEqual(previous.entityIds, entities);
    assert.equal(previous.complete, false);
    assert.deepEqual(ids(previous.documents), [41, 42, 43, 44]);
    assert.deepEqual(ids(previous.codeArtifacts), [51, 52, 53, 54]);
    assert.deepEqual(ids(previous.entities), [61, 62, 63, 64, 65, 66, 67, 68]);
    assert.deepEqual(ids(resources.documents), [71, 72, 73, 74]);
    assert.deepEqual(ids(resources.codeArtifacts), [81, 82, 83, 84]);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    const resourceReads = f.requests.filter(r => r.method === "GET" &&
      /^\/(documents|code-artifacts|entities)\/\d+$/.test(r.path)).map(r => r.path);
    assert.deepEqual(resourceReads, [
      "/documents/41", "/documents/42", "/documents/43", "/documents/44",
      "/code-artifacts/51", "/code-artifacts/52", "/code-artifacts/53", "/code-artifacts/54",
      "/entities/61", "/entities/62", "/entities/63", "/entities/64",
      "/entities/65", "/entities/66", "/entities/67", "/entities/68",
      "/documents/71", "/documents/72", "/documents/73", "/documents/74",
      "/code-artifacts/81", "/code-artifacts/82", "/code-artifacts/83", "/code-artifacts/84",
    ]);
    const update = f.requests.find(r => r.method === "PUT")!;
    assert.deepEqual(update.body.document_ids, documents);
    assert.deepEqual(update.body.code_artifact_ids, artifacts);
    assert.equal(f.requests.filter(r => r.method === "POST" &&
      r.path.startsWith("/entities/")).length, 9);
    assert.equal((await f.client.get(1)).is_obsolete, true);
  });

for (const receipt of ["completed-attachments", "uncertain-attachments"]) {
  test(`preservation restart retains ${receipt} without restoring external changes`, async (t) => {
    // Arrange: execution reaches a durable receipt before a later/uncertain REST failure.
    const f = await fixture(t);
    f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
      newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
    f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: [], preservation: {
      status: "complete", documentIds: [41], codeArtifactIds: [], entityIds: [61], reason: "",
    } }] });
    f.state.intercept = request => {
      if (receipt === "uncertain-attachments" && request.method === "PUT") {
        f.stored.get(100)!.document_ids = [41];
        return { status: 503, body: "Attachment response unavailable" };
      }
      if (request.method === "POST" && request.path.startsWith("/entities/"))
        return { status: 503, body: "Entity response unavailable" };
      return undefined;
    };
    const queued = await f.service.enqueue(snapshot());
    await f.service.checkpoint();
    f.stored.get(100)!.document_ids = [];
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });

    // Act.
    await restarted.checkpoint();

    // Assert: the receipt describes a past operation; it never authorizes desired-state repair.
    assert.equal(f.requests.filter(r => r.method === "PUT").length, 1);
    assert.deepEqual((await f.client.get(100)).document_ids, []);
    assert.equal((await queue.getJob(queued.jobId))!.status, "paused");
    assert.equal((await f.client.get(1)).is_obsolete, false);
    assert.equal(f.requests.filter(r => r.method === "POST" &&
      r.path.startsWith("/entities/")).length, receipt === "completed-attachments" ? 1 : 0);
  });
}

test("explicit shared-target rejection avoids DELETE when the fresh saved memory has no edge",
  async (t) => {
    // Arrange: an additional target is active/in-scope but already absent from the graph.
    const f = await fixture(t);
    f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: [judgment(1),
      judgment(2, "reject")] }] });
    const queued = await f.service.enqueue(snapshot());

    // Act.
    await f.service.checkpoint();

    // Assert: fresh absence completes the explicit removal without a failing server DELETE.
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.requests.filter(r => r.method === "DELETE").length, 0);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, []);
  });

for (const denied of ["obsolete", "foreign", "permission"]) {
  test(`link execution retains ${denied} protection for an additional stored target`, async (t) => {
    // Arrange: authorization may change after the provider selects an additional target.
    const f = await fixture(t);
    let reviewed = false, writable = true;
    f.state.review = () => {
      reviewed = true;
      if (denied === "obsolete") f.stored.get(2)!.is_obsolete = true;
      if (denied === "foreign") f.stored.get(2)!.project_ids = [9];
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1), judgment(2, "add")] }] };
    };
    f.state.intercept = request => {
      if (denied === "permission" && reviewed && request.path === "/memories/2") writable = false;
      return undefined;
    };
    const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
      instanceId: "links", canWriteNow: () => writable });
    const input = snapshot();
    if (denied === "foreign") input.scope = "project";
    const queued = await service.enqueue(input);

    // Act.
    await service.checkpoint();

    // Assert: no POST after permission/activity loss, or destination loss in project scope.
    assert.notEqual((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 0);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, []);
  });
}

test("missing candidate coverage feedback identifies the candidate needing a review",
  async (t) => {
    // Arrange: optional preservation does not remove the requirement to review each candidate.
    const f = await fixture(t);
    let attempts = 0;
    f.state.review = () => ({ reviews: ++attempts === 1 ? [] : [
      { candidateId: "rule", decisions: [judgment(1)] },
    ] });
    const queued = await f.service.enqueue(snapshot());

    // Act.
    await f.service.checkpoint();

    // Assert: the model can identify and correct the exact missing candidate.
    assert.equal(attempts, 2);
    assert.match(f.feedback.join("\n"), /missing candidate IDs: rule/);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
  });

test("opposite commands on the same bidirectional edge require private correction",
  async (t) => {
    // Arrange: two captured siblings request opposite mutations of the same edge.
    const f = await fixture(t);
    f.state.candidates.push({ ...candidate, id: "related", title: "Interactive latency",
      content: "Each request must respect the interactive latency allowance." });
    let attempts = 0;
    f.state.review = input => {
      attempts++;
      return { reviews: input.candidates.map((item: any, index: number) => ({
        candidateId: item.candidateId,
        decisions: item.memories.map((m: Memory) => judgment(m.id,
          attempts === 1 && m.id >= 100 ? index === 0 ? "add" : "reject" : "ignore")),
      })) };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act.
    await f.service.checkpoint();

    // Assert: the bidirectional conflict still needs correction before either mutation executes.
    assert.equal(attempts, 2);
    assert.match(f.feedback.join("\n"), /Contradictory judgments for a bidirectional memory link/);
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.requests.filter(r => r.path.includes("/links")).length, 0);
  });

for (const operation of ["link", "unlink", "attachments", "entity"]) {
  const name = `restart resumes ${operation} after permission revocation before HTTP dispatch`;
  test(name, async (t) => {
    // Arrange: revoke at an HTTP read/receipt boundary before the selected mutation is invoked.
    const f = await fixture(t);
    let writable = true, reviewed = false;
    const preserving = operation === "attachments" || operation === "entity";
    if (preserving) f.state.decision = { action: "supersede", conflictingMemoryId: 1,
      oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
      reason: "Complete adopted change." };
    if (operation === "unlink") f.stored.set(100, memory(100, { linked_memory_ids: [2] }));
    if (operation === "unlink") f.state.decision = { action: "skip", memoryId: 100,
      enrich: true };
    f.state.review = input => {
      reviewed = true;
      return { reviews: [{ candidateId: "rule",
        decisions: input.candidates[0].memories
          .filter((m: Memory) => preserving || m.id !== 2)
          .map((m: Memory) => judgment(m.id)).concat(
            preserving ? [] : [judgment(2, operation === "link" ? "add" : "reject")]),
        ...(preserving ? { preservation: { documentIds: [41], codeArtifactIds: [],
          entityIds: operation === "entity" ? [61] : [] } } : {}),
      }] };
    };
    f.state.intercept = request => {
      if (reviewed && request.method === "GET" && request.path ===
          (preserving ? "/memories/1" : "/memories/2") && operation !== "entity")
        writable = false;
      if (operation === "entity" && request.method === "PUT") writable = false;
      if (request.path.startsWith("/entities/") && request.method === "POST")
        return { status: 200, body: { success: true } };
      return undefined;
    };
    const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
      instanceId: "links", canWriteNow: () => writable });
    const queued = await service.enqueue(snapshot());

    // Act: pause before dispatch, then restore permission and restart from disk.
    const first = await service.checkpoint();
    const mutationRequests = () => f.requests.filter(r => operation === "attachments"
      ? r.method === "PUT" : operation === "entity"
        ? r.method === "POST" && r.path.startsWith("/entities/")
        : r.path.includes("/links") && r.method !== "GET");
    assert.equal(first.paused, true);
    assert.equal(mutationRequests().length, 0);
    const paused = (await f.queue.getJob(queued.jobId))!;
    assert.equal((paused.candidateOutcomes.rule as any).connectionCycle.attempts, 1);
    assert.equal((paused.candidateOutcomes.rule as any).connectionCycle.phase, "ready",
      "Permission pause must retain the reserved execution, not spend a correction");
    const review = (paused.candidateOutcomes.rule as any).linkReview;
    assert.equal(review.executionResults.some((r: any) => r.status !== "completed"), false,
      "a permission failure before dispatch must not leave an uncertain mutation receipt");
    writable = true;
    f.state.intercept = request => request.path.startsWith("/entities/") &&
      request.method === "POST" ? { status: 200, body: { success: true } } : undefined;
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links", canWriteNow: () => writable });
    const result = await restarted.checkpoint();

    // Assert: the same submitted instruction completes exactly once; completed writes stay saved.
    assert.deepEqual(result.errors, []);
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(mutationRequests().length, 1);
    if (preserving) assert.equal((await f.client.get(1)).superseded_by, 100);
    if (operation === "entity") assert.equal(f.requests.filter(r => r.method === "PUT").length, 1);
  });
}

test("a pre-write GET 404 preserves its raw error and allows the same link after restart",
  async (t) => {
    // Arrange: the target is temporarily unavailable only during fresh execution checks.
    const f = await fixture(t);
    let reviewed = false;
    f.state.review = () => {
      reviewed = true;
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1), judgment(2, "add")] }] };
    };
    f.state.intercept = request => reviewed && request.method === "GET" &&
      request.path === "/memories/2" ? { status: 404, body: "Not Found" } : undefined;
    const queued = await f.service.enqueue(snapshot());

    // Act: fail the fresh read, recover the external service, then restart the durable worker.
    await f.service.checkpoint();
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 0);
    const failed = (await f.queue.getJob(queued.jobId))!;
    const review = (failed.candidateOutcomes.rule as any).linkReview;
    assert.match((failed.candidateOutcomes.rule as any).connectionCycle.failure.error,
      /GET \/memories\/2 returned HTTP 404: "Not Found"/);
    assert.deepEqual(review.executionResults, []);
    f.state.intercept = () => undefined;
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });
    const result = await restarted.checkpoint();

    // Assert: failure to read is not an uncertain write; there is one accepted link request.
    assert.deepEqual(result.errors, []);
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 1);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, [2]);
  });

for (const operation of ["link", "attachments", "entity"]) {
  for (const failure of ["500", "lost-response"]) {
    test(`restart blocks dispatched ${operation} after ${failure}`, async (t) => {
      // Arrange: the HTTP request reaches the server, but its outcome is not authoritative.
      const f = await fixture(t);
      const preserving = operation !== "link";
      if (preserving) f.state.decision = { action: "supersede", conflictingMemoryId: 1,
        oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
        reason: "Complete adopted change." };
      f.state.review = () => ({ reviews: [{ candidateId: "rule",
        decisions: preserving ? [] : [judgment(1), judgment(2, "add")],
        ...(preserving ? { preservation: { documentIds: [41], codeArtifactIds: [],
          entityIds: operation === "entity" ? [61] : [] } } : {}),
      }] });
      const isMutation = (request: Request) => operation === "link"
        ? request.path.endsWith("/links") : operation === "attachments"
          ? request.method === "PUT"
          : request.method === "POST" && request.path.startsWith("/entities/");
      f.state.intercept = request => isMutation(request)
        ? { status: 500, body: "Mutation receipt unavailable", dropResponse: failure !== "500" }
        : undefined;
      const queued = await f.service.enqueue(snapshot());
      await f.service.checkpoint();
      assert.equal(f.requests.filter(isMutation).length, 1);
      const first = (await f.queue.getJob(queued.jobId))!;
      const receipts = (first.candidateOutcomes.rule as any).linkReview.executionResults;
      const failed = receipts.find((r: any) => r.operation === operation);
      assert.equal(failed.status, "failed");
      if (failure === "500") assert.equal(failed.httpStatus, 500);
      else assert.equal(failed.httpStatus, undefined);
      f.state.intercept = request => request.path.startsWith("/entities/") &&
        request.method === "POST" ? { status: 200, body: { success: true } } : undefined;
      const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
      const restarted = new CaptureService({ queue, client: f.client, model: f.model,
        instanceId: "links" });

      // Act: submit the same instruction with the server now healthy.
      await restarted.checkpoint();

      // Assert: arbitrary post-dispatch failures never become permission to replay the write.
      assert.equal(f.requests.filter(isMutation).length, 1);
      assert.equal((await queue.getJob(queued.jobId))!.status, "paused");
      if (preserving) assert.equal((await f.client.get(1)).is_obsolete, false);
    });
  }
}

for (const timing of ["before", "after"]) {
  test(`failed receipt cleanup ${timing} persistence remains blocked on restart`, async (t) => {
    // Arrange: the real durable queue experiences one cleanup-checkpoint failure.
    const f = await fixture(t);
    let writable = true, reviewed = false, failCleanup = true, cleanupFailures = 0;
    class FailingCleanupQueue extends DurableQueueStore {
      override async checkpoint(
        jobId: string, patchOrCandidate: QueueCheckpoint | string, outcome?: unknown,
      ): Promise<QueueJob> {
        const old = await this.getJob(jobId);
        const previous = (old?.candidateOutcomes.rule as any)?.linkReview?.executionResults;
        const next = typeof patchOrCandidate === "string"
          ? (outcome as any)?.linkReview?.executionResults : undefined;
        const cleanup = failCleanup && previous?.some((r: any) => r.status === "started") &&
          next?.length === 0;
        if (cleanup) { failCleanup = false; cleanupFailures++; }
        if (cleanup && timing === "before") throw new Error("Receipt cleanup unavailable");
        const saved = typeof patchOrCandidate === "string"
          ? await super.checkpoint(jobId, patchOrCandidate, outcome)
          : await super.checkpoint(jobId, patchOrCandidate);
        if (cleanup) throw new Error("Receipt cleanup unavailable");
        return saved;
      }
    }
    const queue = new FailingCleanupQueue({ directory: f.directory, instanceId: "links" });
    f.state.review = () => {
      reviewed = true;
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1), judgment(2, "add")] }] };
    };
    f.state.intercept = request => {
      if (reviewed && request.path === "/memories/2") writable = false;
      return undefined;
    };
    const service = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links", canWriteNow: () => writable });
    const queued = await service.enqueue(snapshot());

    // Act: fail before dispatch and during marker cleanup, then restore permission and restart.
    await service.checkpoint();
    assert.equal(cleanupFailures, 1);
    const first = (await queue.getJob(queued.jobId))!;
    const receipts = (first.candidateOutcomes.rule as any).linkReview.executionResults;
    assert.deepEqual(receipts, [{ operation: "link", targetId: 2, status: "started" }]);
    assert.match((first.candidateOutcomes.rule as any).linkReview.reason,
      /capture writes were synchronously revoked/);
    writable = true;
    f.state.intercept = () => undefined;
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue: reopened, client: f.client, model: f.model,
      instanceId: "links", canWriteNow: () => writable });
    await restarted.checkpoint();

    // Assert: failed persistence never clears duplicate protection or permits an HTTP mutation.
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 0);
    const blocked = (await reopened.getJob(queued.jobId))!;
    assert.equal(blocked.status, "paused");
    assert.deepEqual((blocked.candidateOutcomes.rule as any).linkReview.executionResults, receipts);
  });
}

for (const kind of ["documents", "code-artifacts", "entities", "sensitive-document"]) {
  test(`old resource coverage reports incomplete for ${kind} without blocking supersession`,
    async (t) => {
      // Arrange: each resource category exceeds its own read bound, or contains private data.
      const f = await fixture(t);
      const sensitive = kind === "sensitive-document";
      const ids = kind === "entities" ? [61, 62, 63, 64, 65, 66, 67, 68, 69]
        : sensitive ? [41] : [41, 42, 43, 44, 45];
      if (kind === "documents" || sensitive) f.stored.get(1)!.document_ids = ids;
      if (kind === "code-artifacts") f.stored.get(1)!.code_artifact_ids = ids;
      f.state.decision = { action: "supersede", conflictingMemoryId: 1,
        oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
        reason: "Complete adopted change." };
      let reviewInput: any;
      f.state.review = input => {
        reviewInput = input;
        return { reviews: [{ candidateId: "rule", decisions: [] }] };
      };
      f.state.intercept = request => {
        if (kind === "entities" && request.path === "/graph/memory/1")
          return { status: 200, body: { center_memory_id: 1,
            edges: ids.map(id => ({ type: "entity_memory",
              source: "memory_1", target: `entity_${id}` })),
          } };
        if (/^\/(documents|code-artifacts|entities)\/\d+$/.test(request.path)) {
          const id = Number(request.path.split("/").at(-1));
          const resource = kind === "entities" ? { id, name: "Related system",
            entity_type: "System", aka: [], tags: [], project_ids: [9] }
            : { id, title: "Related rationale", description: "Supporting context.", tags: [],
              project_id: 9, ...(kind === "code-artifacts"
                ? { code: "retry(2)", language: "typescript" }
                : { content: sensitive ? "password=correct-horse-battery-staple"
                  : "Retry twice." }),
            };
          return { status: 200, body: resource };
        }
        return undefined;
      };
      const queued = await f.service.enqueue(snapshot());

      // Act.
      const result = await f.service.checkpoint();

      // Assert: each bound limits HTTP reads; privacy filters context; neither blocks the action.
      assert.deepEqual(result.errors, []);
      const previous = reviewInput.candidates[0].previous;
      assert.equal(previous.complete, false);
      const supplied = kind === "entities" ? previous.entities : kind === "code-artifacts"
        ? previous.codeArtifacts : previous.documents;
      assert.deepEqual(supplied.map((record: { id: number }) => record.id),
        sensitive ? [] : ids.slice(0, kind === "entities" ? 8 : 4));
      const resourceReads = f.requests.filter(r => r.method === "GET" &&
        /^\/(documents|code-artifacts|entities)\/\d+$/.test(r.path));
      assert.deepEqual(resourceReads.map(r => r.path), ids.slice(0, kind === "entities" ? 8 : 4)
        .map(id => `/${sensitive ? "documents" : kind}/${id}`));
      assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
      assert.equal((await f.client.get(1)).superseded_by, 100);
    });
}

test("legacy queued connection failures use report-gated connection review after restart",
  async (t) => {
    // Arrange: a queue written before correction cycles, with an existing completed memory.
    const f = await fixture(t);
    f.stored.set(100, memory(100));
    const error = 'Forgetful POST /memories/100/links returned HTTP 422: "Rejected edge"';
    const queued = await f.queue.enqueue(snapshot());
    await f.queue.checkpoint(queued.jobId, { extractedCandidates: [candidate],
      candidateOutcomes: { rule: { stage: "links-pending", action: "create", memoryId: 100,
        destinationProjectId: 7, executionFailure: error,
        creation: { status: "completed", result: { id: 100 } },
        linkReview: { status: "pending", memory: memory(100), memories: [memory(1)],
          decisions: [judgment(1, "add")],
          executionResults: [{ operation: "link", targetId: 1, status: "failed",
            httpStatus: 422, error }], failures: [{ operation: "connections", error }] },
      } } });
    f.state.review = input => {
      assert.equal(input.candidates[0].completedWrites.memoryId, 100);
      return { reviews: [{ candidateId: "rule", decisions: [judgment(1)] }] };
    };
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });

    // Act: open the saved queue through the current capture service and real Pi adapter.
    const result = await new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" }).checkpoint();

    // Assert: no field-correction detour, no replay, and an actual failed tool result.
    assert.deepEqual(result.errors, []);
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.match(f.feedback.join("\n"), /Rejected edge/);
    assert.equal(f.requests.filter(request => request.method !== "GET" &&
      request.path !== "/memories/search").length, 0);
  });

test("lifecycle stop during connection read resumes its reserved plan without correction",
  async (t) => {
    // Arrange: the first link completes before shutdown interrupts the second target read.
    const f = await fixture(t);
    let reviews = 0;
    f.state.review = () => {
      reviews++;
      return { reviews: [{ candidateId: "rule",
        decisions: [judgment(1, "add"), judgment(2, "add")] }] };
    };
    f.state.intercept = request => {
      if (reviews && request.method === "GET" && request.path === "/memories/2")
        f.service.stop();
      return undefined;
    };
    const queued = await f.service.enqueue(snapshot());

    // Act: stop inside the real HTTP read, then reopen the durable queue.
    const first = await f.service.checkpoint();
    const paused = (await f.queue.getJob(queued.jobId))!;
    assert.equal(first.paused, true);
    assert.equal(paused.status, "paused");
    assert.equal(paused.attempts, 0);
    const outcome = paused.candidateOutcomes.rule as any;
    assert.deepEqual(outcome.connectionCycle, { cycle: 1, attempts: 1, phase: "ready" });
    assert.equal(outcome.linkReview.status, "planned");
    assert.deepEqual(outcome.linkReview.executionResults,
      [{ operation: "link", targetId: 1, status: "completed" }]);
    f.state.intercept = () => undefined;
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });
    const result = await restarted.checkpoint();

    // Assert: retain the decision, reservation and successful receipt; finish only the second link.
    assert.deepEqual(result.errors, []);
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(reviews, 1);
    assert.deepEqual(f.modelCalls,
      ["submit_capture_candidates", "submit_capture_decision", "submit_capture_links"]);
    assert.deepEqual(f.feedback, []);
    assert.equal(f.requests.filter(r => r.method === "POST" && r.path === "/memories").length, 1);
    assert.deepEqual(f.requests.filter(r => r.path.endsWith("/links")).map(r => r.body.related_ids),
      [[1], [2]]);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, [1, 2]);
  });

for (const reply of ["confirmed", "unknown"] as const) {
  test(`lifecycle stop during accepted link preserves its ${reply} receipt`, async (t) => {
    // Arrange: the remote endpoint accepts a link, then shutdown races its reply.
    const f = await fixture(t);
    let reviews = 0;
    f.state.review = () => {
      reviews++;
      return { reviews: [{ candidateId: "rule",
        decisions: [judgment(1, "add"), judgment(2, "add")] }] };
    };
    f.state.intercept = request => {
      if (request.method !== "POST" || !request.path.endsWith("/links")) return;
      f.stored.get(100)!.linked_memory_ids = [1];
      f.stored.get(1)!.linked_memory_ids = [100];
      f.service.stop();
      return { status: 200, body: { linked_ids: [1] }, holdResponse: reply === "unknown" };
    };
    const queued = await f.service.enqueue(snapshot());

    // Act: either receive the accepted receipt or exhaust the shutdown receipt grace period.
    const first = await f.service.checkpoint();
    const paused = (await f.queue.getJob(queued.jobId))!;
    assert.equal(first.paused, true);
    assert.equal(paused.status, "paused");
    assert.equal(paused.attempts, 0);
    const outcome = paused.candidateOutcomes.rule as any;
    assert.deepEqual(outcome.connectionCycle, { cycle: 1, attempts: 1, phase: "ready" });
    assert.equal(outcome.linkReview.status, "planned");
    assert.equal(outcome.linkReview.executionResults.length, 1);
    assert.equal(outcome.linkReview.executionResults[0].status,
      reply === "confirmed" ? "completed" : "failed");
    assert.equal(Boolean(paused.uncertainWrite), reply === "unknown");
    f.state.intercept = () => undefined;
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });
    await restarted.checkpoint();
    await restarted.checkpoint();

    // Assert: no report/replanning; completed writes are skipped and unknown writes stay blocked.
    const saved = (await queue.getJob(queued.jobId))!;
    assert.equal(saved.status, reply === "confirmed" ? "complete" : "paused");
    assert.equal(Boolean(saved.uncertainWrite), reply === "unknown");
    assert.equal(reviews, 1);
    assert.deepEqual(f.modelCalls,
      ["submit_capture_candidates", "submit_capture_decision", "submit_capture_links"]);
    assert.deepEqual(f.feedback, []);
    assert.equal(f.requests.filter(r => r.method === "POST" && r.path === "/memories").length, 1);
    assert.deepEqual(f.requests.filter(r => r.path.endsWith("/links")).map(r => r.body.related_ids),
      reply === "confirmed" ? [[1], [2]] : [[1]]);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids,
      reply === "confirmed" ? [1, 2] : [1]);
  });
}

test("candidate read outage queues retry without a correction task", async (t) => {
  // Arrange: a saved selection fails at its pre-dispatch lookup.
  const f = await fixture(t);
  f.state.decision = { action: "skip", enrich: true, memoryId: 2 };
  f.state.review = input => input.candidate ? { candidate, decision: f.state.decision }
    : { reviews: [{ candidateId: "rule", decisions: [judgment(1)] }] };
  f.state.intercept = request => request.method === "GET" && request.path === "/memories/2"
    ? { status: 503, body: { detail: "selection store unavailable" } } : undefined;
  const queued = await f.service.enqueue(snapshot());

  // Act: one ordinary queue failure, followed by a fresh worker when the service recovers.
  const first = await f.service.checkpoint();
  assert.deepEqual(f.modelCalls, ["submit_capture_candidates", "submit_capture_decision"]);
  assert.equal(first.errors.length, 1);
  assert.match(first.errors[0]!, /503.*selection store unavailable/);
  const pending = (await f.queue.getJob(queued.jobId))!;
  assert.equal(pending.attempts, 1);
  assert.equal((pending.candidateOutcomes.rule as any).correctionCycle.attempts, 1);
  f.state.intercept = () => undefined;
  const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
  await new CaptureService({ queue, client: f.client, model: f.model,
    instanceId: "links" }).checkpoint();

  // Assert: the saved selection resumes; outage reporting did not become model work on restart.
  assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
  assert.deepEqual(f.modelCalls, ["submit_capture_candidates", "submit_capture_decision",
    "submit_capture_links"]);
  assert.deepEqual(f.feedback, []);
});

test("connection read outage retains its plan and completed receipts without correction",
  async (t) => {
    // Arrange: the first planned link succeeds; the second target lookup is unavailable.
    const f = await fixture(t);
    let reviewed = false;
    f.state.review = () => {
      reviewed = true;
      return { reviews: [{ candidateId: "rule",
        decisions: [judgment(1, "add"), judgment(2, "add")] }] };
    };
    f.state.intercept = request => reviewed && request.method === "GET" &&
      request.path === "/memories/2"
      ? { status: 503, body: { detail: "connection store unavailable" } } : undefined;
    const queued = await f.service.enqueue(snapshot());

    // Act: fail one queue attempt, then restore the service and reopen the saved plan.
    const first = await f.service.checkpoint();
    assert.deepEqual(f.modelCalls, ["submit_capture_candidates", "submit_capture_decision",
      "submit_capture_links"]);
    assert.equal(first.errors.length, 1);
    assert.match(first.errors[0]!, /503.*connection store unavailable/);
    const pending = (await f.queue.getJob(queued.jobId))!;
    assert.equal(pending.attempts, 1);
    const outcome = pending.candidateOutcomes.rule as any;
    assert.equal(outcome.connectionCycle.attempts, 1);
    assert.equal(outcome.connectionCycle.phase, "ready");
    assert.equal(outcome.linkReview.status, "planned");
    f.state.intercept = () => undefined;
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    await new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" }).checkpoint();

    // Assert: no extra model task and no replay of the first successful link.
    assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
    assert.equal(f.modelCalls.length, 3);
    assert.deepEqual(f.feedback, []);
    assert.deepEqual(f.requests.filter(r => r.path.endsWith("/links")).map(r => r.body.related_ids),
      [[1], [2]]);
  });

for (const path of ["candidate", "connection"] as const) {
  for (const invalid of ["obsolete", "outside scope"] as const) {
    test(`${path} local ${invalid} selection still receives immediate correction`, async (t) => {
      // Arrange: deterministic stored selection state, with no failed remote request.
      const f = await fixture(t);
      f.stored.set(2, memory(2, invalid === "obsolete"
        ? { is_obsolete: true } : { project_ids: [9] }));
      if (path === "candidate") f.state.decision = { action: "merge",
        conflictingMemoryIds: [2], reason: "Consolidate related policy" };
      let reviews = 0;
      f.state.review = input => {
        if (input.candidate) return { candidate, decision: { action: "skip" } };
        reviews++;
        return { reviews: [{ candidateId: "rule", decisions: reviews === 1
          ? [judgment(1), judgment(2, "add")] : [judgment(1)] }] };
      };
      const queued = await f.service.enqueue({ ...snapshot(), scope: "project" });

      // Act.
      const result = await f.service.checkpoint();

      // Assert: a typed local selection failure is corrected without an infrastructure retry.
      assert.deepEqual(result.errors, []);
      assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
      assert.equal(f.modelCalls.filter(name =>
        name === "report_capture_execution_failure").length, 1);
      assert.match(f.feedback.join("\n"), /obsolete|scope|project/);
      assert.equal(f.requests.filter(request => request.path.endsWith("/links")).length, 0);
    });
  }
}

async function closedEndpoint(): Promise<string> {
  const server = createServer();
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  await new Promise<void>(resolve => server.close(() => resolve()));
  return `http://127.0.0.1:${port}`;
}

for (const path of ["candidate", "resource", "connection", "merge", "retire"] as const) {
  for (const fault of [503, 429, "timeout", "refusal", "runtime"] as const) {
    for (const budget of [1, 4]) {
      test(`${path} pre-dispatch ${fault} uses queue retries at budget ${budget}`, async (t) => {
        // Arrange: a real local HTTP read fails after its selection was saved.
        let outage = true, reviewed = false;
        const route = path === "resource" ? "/entities/61" : "/memories/2";
        const unavailable = fault === "refusal" ? await closedEndpoint() : "";
        const shouldFail = (method: string, requestPath: string) => outage && method === "GET" &&
          requestPath === route && (path !== "connection" || reviewed);
        const f = await fixture(t, { timeoutMs: 250, fetchImpl: (url, init) => {
          const failing = shouldFail(init?.method ?? "GET", new URL(String(url)).pathname);
          if (failing && fault === "runtime") throw new Error("HTTP 404 missing: runtime fault");
          return fetch(failing && fault === "refusal" ? unavailable : url, init);
        } });
        f.state.decision = path === "candidate" ? { action: "skip", enrich: true, memoryId: 2 }
          : path === "merge" || path === "retire" ? { action: path,
            conflictingMemoryIds: [2], reason: "Maintain selected stored policy" }
            : { action: "create" };
        if (path === "resource") f.state.candidates = [{ ...candidate, entities: [{
          key: "system", existingId: 61, input: { name: "System", entity_type: "System" },
          sourceEntryIds: ["user"],
        }] } as any];
        f.state.review = input => {
          if (input.candidate && input.memories) return { title: "Merged policy",
            content: "Retry transient errors twice.", context: "Consolidated policy",
            keywords: ["retry"], tags: [] };
          reviewed = true;
          return { reviews: [{ candidateId: "rule", decisions: path === "connection"
            ? [judgment(1, "add"), judgment(2, "add")] : [judgment(1)] }] };
        };
        f.state.intercept = request => {
          if (shouldFail(request.method, request.path)) return {
            status: typeof fault === "number" ? fault : 503,
            body: { detail: `original ${fault} body` }, holdResponse: fault === "timeout" };
          if (request.path === "/entities/61") return { status: 200,
            body: { id: 61, name: "System", entity_type: "System", tags: [], aka: [],
              project_ids: [7] } };
          return undefined;
        };
        let queue = f.queue;
        let service = new CaptureService({ queue, client: f.client, model: f.model,
          instanceId: "links", maxModelCalls: budget });
        const queued = await service.enqueue(snapshot());
        const drainToFailure = async () => {
          for (let pass = 0; pass < 12; pass++) {
            const result = await service.checkpoint();
            if (result.errors.length) return result.errors[0]!;
          }
          assert.fail("Expected an ordinary queue failure");
        };

        // Act: fail, reopen while still unavailable, then recover the same saved instructions.
        const diagnostic = await drainToFailure();
        assert.match(diagnostic, fault === "refusal" ? /ECONNREFUSED/
          : fault === "timeout" ? /timed out/
            : fault === "runtime" ? /HTTP 404 missing: runtime fault/
            : new RegExp(`original ${fault} body`));
        let saved = (await queue.getJob(queued.jobId))!;
        assert.equal(saved.attempts, 1);
        const calls = [...f.modelCalls];
        queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
        service = new CaptureService({ queue, client: f.client, model: f.model,
          instanceId: "links", maxModelCalls: budget });
        const repeated = await drainToFailure();
        assert.equal(repeated, diagnostic);
        assert.deepEqual(f.modelCalls, calls, "Restart must not turn an outage into correction");
        saved = (await queue.getJob(queued.jobId))!;
        assert.equal(saved.attempts, 2);
        assert.equal(saved.lastError, diagnostic);
        const outcome = saved.candidateOutcomes.rule as any;
        const cycle = path === "connection" ? outcome.connectionCycle : outcome.correctionCycle;
        assert.equal(cycle.attempts, 1);
        assert.equal(cycle.phase, "ready");
        outage = false;
        for (let pass = 0; pass < 12; pass++) {
          const result = await service.checkpoint();
          assert.deepEqual(result.errors, []);
          if ((await queue.getJob(queued.jobId))?.status === "complete") break;
        }

        // Assert: no failure-report/correction task, no duplicate successful writes.
        assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
        assert.equal(f.modelCalls.includes("report_capture_execution_failure"), false);
        assert.equal(f.modelCalls.includes("submit_capture_correction"), false);
        assert.deepEqual(f.feedback, []);
        assert.equal(f.requests.filter(r => r.method === "POST" && r.path === "/memories").length,
          path === "candidate" || path === "retire" ? 0 : 1);
        if (path === "connection") assert.deepEqual(f.requests
          .filter(r => r.path.endsWith("/links")).map(r => r.body.related_ids), [[1], [2]]);
      });
    }
  }
}

for (const path of ["candidate", "resource", "connection", "merge", "retire"] as const) {
  for (const fault of [503, 429, 404, "timeout", "network"] as const) {
    for (const budget of [1, 4]) {
      test(`${path} dispatched ${fault} remains unknown at budget ${budget}`, async (t) => {
        // Arrange: the mutation reaches the server; its response cannot establish rejection.
        const f = await fixture(t, { timeoutMs: 250 });
        f.state.decision = path === "merge" || path === "retire" ? { action: path,
          conflictingMemoryIds: [2], reason: "Maintain selected stored policy" }
          : { action: "create" };
        if (path === "resource") f.state.candidates = [{ ...candidate, entities: [{
          key: "system", input: { name: "System", entity_type: "System" },
          sourceEntryIds: ["user"],
        }] } as any];
        f.state.review = input => input.candidate && input.memories
          ? { title: "Merged policy", content: "Retry twice.", context: "Consolidated policy",
            keywords: ["retry"], tags: [] }
          : { reviews: [{ candidateId: "rule", decisions: [judgment(1, "add")] }] };
        const isMutation = (request: Request) => path === "resource"
          ? request.method === "POST" && request.path === "/entities"
          : path === "connection" ? request.method === "POST" && request.path.endsWith("/links")
            : path === "retire" ? request.method === "DELETE" && request.path === "/memories/2"
              : request.method === "POST" && request.path === "/memories";
        f.state.intercept = request => {
          if (!isMutation(request)) return;
          // Model a remotely accepted operation when its success reply is lost or delayed.
          if (typeof fault !== "number") {
            if (path === "candidate" || path === "merge")
              f.stored.set(100, memory(100, request.body));
            if (path === "connection") f.stored.get(100)!.linked_memory_ids = [1];
            if (path === "retire") f.stored.get(2)!.is_obsolete = true;
          }
          return { status: typeof fault === "number" ? fault : 200,
            body: { detail: `original mutation ${fault}` }, holdResponse: fault === "timeout",
            dropResponse: fault === "network" };
        };
        const service = new CaptureService({ queue: f.queue, client: f.client, model: f.model,
          instanceId: "links", maxModelCalls: budget });
        const queued = await service.enqueue(snapshot());

        // Act: exhaust any task-budget preparation, then reopen after the unconfirmed mutation.
        for (let pass = 0; pass < 12; pass++) {
          if ((await service.checkpoint()).paused) break;
        }
        const pending = (await f.queue.getJob(queued.jobId))!;
        assert.equal(pending.status, "paused");
        assert.match(pending.uncertainWrite!, fault === "network" ? /other side closed/
          : fault === "timeout" ? /timed out/ : new RegExp(`original mutation ${fault}`));
        assert.equal(pending.attempts, 0);
        assert.equal(f.requests.filter(isMutation).length, 1);
        const calls = [...f.modelCalls];
        const requests = f.requests.length;
        f.state.intercept = () => undefined;
        const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
        const restarted = new CaptureService({ queue, client: f.client, model: f.model,
          instanceId: "links", maxModelCalls: budget });
        await restarted.checkpoint();
        await restarted.checkpoint();

        // Assert: no model correction and no replay, including dispatched HTTP 404.
        assert.equal((await queue.getJob(queued.jobId))!.status, "paused");
        assert.equal((await queue.getJob(queued.jobId))!.uncertainWrite, pending.uncertainWrite);
        assert.deepEqual(f.modelCalls, calls);
        assert.equal(f.modelCalls.includes("report_capture_execution_failure"), false);
        assert.equal(f.requests.length, requests);
      });
    }
  }
}

for (const path of ["candidate", "connection"] as const) {
  for (const oldCycle of [false, true]) {
    test(`legacy ${path} outage resumes its plan with old cycle=${oldCycle}`, async (t) => {
      // Arrange: an old queue saved outage text, sometimes with an unclassified correction cycle.
      const f = await fixture(t);
      const queued = await f.service.enqueue(snapshot());
      const error = "original unclassified legacy service failure";
      f.stored.set(100, memory(100, { linked_memory_ids: [1] }));
      const base = { correctionCycle: oldCycle
        ? { cycle: 1, attempts: 1, phase: "needs-review", failure: { error } } : undefined,
      executionFailure: error, decision: { action: "skip", memoryId: 2, enrich: true },
      destinationProjectId: 7 };
      const outcome = path === "candidate" ? { ...base, stage: "decided" }
        : { ...base, stage: "links-pending", action: "create", memoryId: 100,
          connectionCycle: base.correctionCycle,
          creation: { status: "completed", result: { id: 100 } },
          linkReview: { status: "pending", memory: memory(100), memories: [memory(1)],
            decisions: [judgment(1, "add"), judgment(2, "add")],
            executionResults: [{ operation: "link", targetId: 1, status: "completed" }],
            failures: [{ operation: "connections", error }] } };
      await f.queue.checkpoint(queued.jobId, { extractedCandidates: [candidate],
        candidateOutcomes: { rule: outcome } });
      f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: [judgment(1)] }] });
      const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });

      // Act: resume the legacy selection using current mechanical classification.
      await new CaptureService({ queue, client: f.client, model: f.model,
        instanceId: "links" }).checkpoint();

      // Assert: text diagnostics never authorize correction or replay a successful receipt.
      assert.equal((await queue.getJob(queued.jobId))!.status, "complete");
      assert.deepEqual(f.modelCalls, path === "candidate" ? ["submit_capture_links"] : []);
      assert.deepEqual(f.requests.filter(r => r.path.endsWith("/links"))
        .map(r => r.body.related_ids), path === "candidate" ? [] : [[2]]);
    });
  }
}

for (const path of ["candidate", "connection"] as const) {
  for (const budget of [1, 4]) {
    const name = `${path} persistent outage uses three queue failures only at budget ${budget}`;
    test(name, async (t) => {
      // Arrange: an outage persists across every eligible queue retry.
      const f = await fixture(t);
      let reviewed = false;
      if (path === "candidate") f.state.decision = { action: "skip", enrich: true, memoryId: 2 };
      f.state.review = () => {
        reviewed = true;
        return { reviews: [{ candidateId: "rule", decisions: [judgment(1), judgment(2, "add")] }] };
      };
      f.state.intercept = request => request.path === "/memories/2" &&
        (path === "candidate" || reviewed)
        ? { status: 503, body: { detail: "persistent outage" } } : undefined;
      const queued = await f.service.enqueue(snapshot());
      let failures = 0;
      let finished = false;

      // Act: reopen the disk queue every pass, including budget-only yields.
      for (let pass = 0; pass < 16; pass++) {
        const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
        const service = new CaptureService({ queue, client: f.client, model: f.model,
          instanceId: "links", maxModelCalls: budget });
        const result = await service.checkpoint();
        if (result.errors.length) {
          assert.equal(result.errors.length, 1);
          assert.match(result.errors[0]!, /persistent outage/);
          failures++;
        }
        const job = await queue.getJob(queued.jobId);
        if (!job) {
          assert.equal(result.discardedJobs?.[0]?.jobId, queued.jobId);
          finished = true;
          break;
        }
        assert.equal(job.attempts, failures);
      }

      // Assert: three ordinary failures, without any extra execution-correction cycle.
      assert.equal(finished, true);
      assert.equal(failures, 3);
      assert.deepEqual(f.modelCalls, ["submit_capture_candidates", "submit_capture_decision",
        ...(path === "connection" ? ["submit_capture_links"] : [])]);
    });
  }
}

for (const status of [404, 503, undefined]) {
  test(`legacy dispatched link status ${status} is blocked before model work`, async (t) => {
    // Arrange: older queues may retain a failed dispatched receipt without uncertainWrite.
    const f = await fixture(t);
    const queued = await f.service.enqueue(snapshot());
    f.stored.set(100, memory(100));
    const error = `Original legacy write failure ${status}`;
    await f.queue.checkpoint(queued.jobId, { extractedCandidates: [candidate],
      candidateOutcomes: { rule: { stage: "links-pending", action: "create", memoryId: 100,
        destinationProjectId: 7, executionFailure: error,
        connectionCycle: { cycle: 1, attempts: 2, phase: "needs-review", failure: { error } },
        creation: { status: "completed", result: { id: 100 } },
        linkReview: { status: "pending", memory: memory(100), decisions: [judgment(1, "add")],
          executionResults: [{ operation: "link", targetId: 1, status: "failed",
            httpStatus: status, error }], failures: [{ operation: "connections", error }] },
      } } });
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const service = new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" });

    // Act.
    await service.checkpoint();
    await service.checkpoint();

    // Assert: neither text nor an old correction phase can authorize replay/reporting.
    const saved = (await queue.getJob(queued.jobId))!;
    assert.equal(saved.status, "paused");
    assert.equal(saved.uncertainWrite, error);
    assert.deepEqual(f.modelCalls, []);
    assert.deepEqual(f.requests, []);
    assert.equal((saved.candidateOutcomes.rule as any).linkReview.executionResults[0].error, error);
  });
}

test("connection correction waits through a refresh outage without extra model calls",
  async (t) => {
  // Arrange: a rejected link needs correction, but refreshed records are unavailable.
  const f = await fixture(t);
  let rejected = false, outage = true;
  let reviews = 0;
  f.state.review = () => {
    reviews++;
    return { reviews: [{ candidateId: "rule", decisions: [judgment(1),
      judgment(2, reviews === 1 ? "add" : "ignore")] }] };
  };
  f.state.intercept = request => {
    if (request.method === "POST" && request.path.endsWith("/links")) {
      rejected = true;
      return { status: 422, body: { detail: "Original rejected edge" } };
    }
    if (rejected && outage && request.method === "GET" && request.path === "/memories/100")
      return { status: 503, body: { detail: "Original refresh outage" } };
    return undefined;
  };
  const queued = await f.service.enqueue(snapshot());

  // Act: repeat the ordinary queue retry while refresh still fails, then restore availability.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const result = await new CaptureService({ queue, client: f.client, model: f.model,
      instanceId: "links" }).checkpoint();
    assert.match(result.errors[0]!, /Original refresh outage/);
    assert.equal((await queue.getJob(queued.jobId))!.attempts, attempt);
    assert.equal(f.modelCalls.length, 3);
  }
  outage = false;
  const result = await f.service.checkpoint();

  // Assert: the original rejection gets one correction only once its records can be refreshed.
  assert.deepEqual(result.errors, []);
  assert.equal((await f.queue.getJob(queued.jobId))!.status, "complete");
  assert.equal(reviews, 2);
  assert.equal(f.modelCalls.filter(name =>
        name === "report_capture_execution_failure").length, 1);
  assert.match(f.feedback.join("\n"), /Original rejected edge/);
  assert.equal(f.requests.filter(request => request.path.endsWith("/links")).length, 1);
});

test("uncertain supersede DELETE retains a non-correctable connection cycle", async (t) => {
  // Arrange: a missing mutation response cannot prove that retirement did not happen.
  const f = await fixture(t);
  f.state.decision = { action: "supersede", conflictingMemoryId: 1, oldClaim: "Retry once",
    newClaim: "Retry twice", sourceEntryIds: ["user"], reason: "Complete adopted change." };
  f.state.review = () => ({ reviews: [{ candidateId: "rule", decisions: [] }] });
  f.state.intercept = request => request.method === "DELETE" && request.path === "/memories/1"
    ? { status: 404, body: { error: "Original missing mutation response" } } : undefined;
  const queued = await f.service.enqueue(snapshot());

  // Act: inspect the durable state after dispatch, then attempt recovery twice.
  await f.service.checkpoint();
  const queue = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
  const pending = (await queue.getJob(queued.jobId))!;
  const requests = f.requests.length;
  const calls = [...f.modelCalls];
  const restarted = new CaptureService({ queue, client: f.client, model: f.model,
    instanceId: "links" });
  await restarted.checkpoint();
  await restarted.checkpoint();

  // Assert: uncertainty blocks replay and must not advertise an available correction.
  assert.equal(pending.status, "paused");
  assert.match(pending.uncertainWrite!, /Original missing mutation response/);
  assert.equal(pending.supersession?.status, "started");
  assert.equal(f.requests.filter(r => r.method === "DELETE").length, 1);
  assert.equal(f.requests.length, requests);
  assert.deepEqual(f.modelCalls, calls);
  const cycle = (pending.candidateOutcomes.rule as any).connectionCycle;
  assert.equal(cycle.failureKind, "retry");
  assert.equal(cycle.phase, "ready");
  assert.equal(cycle.attempts, 1);
  assert.equal((await queue.getJob(queued.jobId))!.uncertainWrite, pending.uncertainWrite);
});
