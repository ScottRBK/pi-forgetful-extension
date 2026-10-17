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
async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "validation-links-"));
  const stored = new Map<number, Memory>([[1, memory(1)],
    [2, memory(2, { project_ids: [7, 9] })]]);
  const requests: Request[] = [];
  const feedback: string[] = [];
  const state = {
    decision: { action: "create" } as any,
    candidates: [candidate] as Array<typeof candidate>,
    review: (_input: any): unknown => ({ reviews: [] }),
    intercept: (_request: Request): {
      status: number; body: unknown; dropResponse?: boolean;
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
  const client = new ApiForgetfulClient({ baseUrl: `http://127.0.0.1:${address.port}` });
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 8_000,
      contextWindow: 200_000, input: ["text"] }) as any,
    complete: async (_model, context) => {
      const tool = context.tools![0]!;
      const input = decodeProviderContext(context).input;
      for (const message of context.messages) {
        if (message.role === "toolResult" && message.isError)
          feedback.push(JSON.stringify(message.content));
      }
      const args = tool.name === "submit_capture_candidates" ? { candidates: state.candidates }
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
  return { directory, stored, requests, feedback, state, client, queue, service, model };
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

test("queue restart retains completed and uncertain link receipts across model replanning",
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
    assert.equal((await f.queue.getJob(queued.jobId))!.status, "pending");
    // Another writer removes the completed edge. A saved receipt never authorizes repair.
    f.stored.get(100)!.linked_memory_ids = [];
    f.stored.get(2)!.linked_memory_ids = [];
    const reopened = new DurableQueueStore({ directory: f.directory, instanceId: "links" });
    const restarted = new CaptureService({ queue: reopened, client: f.client, model: f.model,
      instanceId: "links" });

    // Act: replay the same submitted instructions after a real filesystem queue restart.
    await restarted.checkpoint();

    // Assert: neither successful nor uncertain writes are submitted again.
    assert.equal(reviews, 2);
    assert.equal(f.requests.filter(r => r.path.endsWith("/links")).length, 2);
    assert.deepEqual((await f.client.get(100)).linked_memory_ids, []);
    assert.equal((await reopened.getJob(queued.jobId))!.status, "pending");
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
    assert.equal(first.length, 1, "invalid resource IDs must reach REST");
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
    assert.equal((await queue.getJob(queued.jobId))!.status, "pending");
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
    assert.match(review.reason, /GET \/memories\/2 returned HTTP 404: "Not Found"/);
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
      assert.equal((await queue.getJob(queued.jobId))!.status, "pending");
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
