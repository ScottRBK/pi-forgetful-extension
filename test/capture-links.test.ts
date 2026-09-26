import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { RecallService } from "../src/recall.ts";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";
import { decodeProviderContext } from "./provider-context.ts";

function candidate(id = "decision") {
  return { id, title: "Durable retry decision", content: "Retry transient failures twice.",
    context: "Adopted operational rule.", keywords: ["retries"], tags: ["decision"],
    sourceEntryIds: ["user"], evidenceType: "userDecision" };
}

function snapshot(project: { id: number; name: string }): CaptureSnapshot {
  return { id: "snapshot", instanceId: "links", finalEntryId: "answer", mode: "auto",
    scope: "global", policy: "Save supported knowledge.", modelVersion: "test",
    createdAt: new Date().toISOString(),
    context: { cwd: "/repo", sessionId: "capture", branchId: "branch", project },
    entries: [{ id: "user", role: "user", text: "We adopted two retries for transient failures." },
      { id: "answer", role: "assistant", text: "Recorded." }] };
}

function model(reply: (name: string, input: any) => unknown) {
  return new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 8_000 }) as any,
    complete: async (_model, context) => {
      const tool = context.tools![0]!;
      const input = decodeProviderContext(context).input;
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: "submission", name: tool.name,
          arguments: await reply(tool.name, input) }], stopReason: "toolUse", timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } } as any;
    },
  }, { provider: "test", id: "memory" });
}

test("capture reviews stored automatic links and adds a useful missed connection", realOptions,
  async (t) => {
    // Arrange: real service creates two automatic links; another full record is available to add.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "2" });
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Links", description: "Link review",
      repo_name: "test/links" });
    const seeds: Array<{ id: number }> = [];
    for (const [title, content] of [["Retry rationale", "Transient outages usually recover."],
      ["Retired experiment", "An experiment proposed unlimited retries."],
      ["Latency constraint", "Requests must finish within the interactive latency allowance."]]) {
      seeds.push(await client.create({ title: title!, content: content!, context: "Existing fact",
        keywords: ["retries"], tags: [], project_ids: [project.id] }));
    }
    const directory = await mkdtemp(join(tmpdir(), "capture-links-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let reviewed = false;
    let keep = 0, reject = 0, add = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        assert.equal(name, "submit_capture_links");
        reviewed = true;
        const item = input.candidates[0];
        assert.ok(item.memory.linked_memory_ids.length === 2);
        [keep, reject] = item.memory.linked_memory_ids;
        add = seeds.find((seed) => !item.memory.linked_memory_ids.includes(seed.id))!.id;
        assert.ok(item.memories.every((memory: any) => memory.content && memory.context));
        return { reviews: [{ candidateId: "decision", decisions: [
          { memoryId: keep, action: "keep", reason: "Supports the adopted rule." },
          { memoryId: reject, action: "reject", reason: "Misleading unadopted experiment." },
          { memoryId: add, action: "add", reason: "Related operational constraint." },
        ] }] };
      }) });

    // Act: public capture worker writes, reads, reviews, mutates, and verifies real stored links.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();

    // Assert: the stored bidirectional graph and durable receipt agree.
    assert.equal(reviewed, true);
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.decision as any;
    const stored = await client.get(outcome.memoryId);
    assert.ok(stored.linked_memory_ids!.includes(keep));
    assert.ok(stored.linked_memory_ids!.includes(add));
    assert.ok(!stored.linked_memory_ids!.includes(reject));
    assert.ok(!(await client.get(reject)).linked_memory_ids!.includes(stored.id));
    assert.equal(outcome.linkReview.status, "complete");
    assert.equal(job.callCount, 3);

  });

test("three candidates share one overlap task and reuse an earlier sibling", realOptions,
  async (t) => {
    // Arrange: the model judges semantic equivalence, without comparing strings in production.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Batch", description: "Batch capture",
      repo_name: "test/batch" });
    const directory = await mkdtemp(join(tmpdir(), "capture-batch-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const tasks: string[] = [];
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        tasks.push(name);
        if (name === "submit_capture_candidates") return { candidates: [candidate("first"),
          { ...candidate("same"), title: "Bounded retry policy",
            content: "Give temporary errors two more chances." },
          { ...candidate("distinct"), title: "Latency constraint",
            content: "Keep interactive requests within the latency allowance." }] };
        if (name === "submit_capture_decisions") {
          assert.equal(input.candidates.length, 3);
          return { decisions: [{ candidateId: "first", action: "create" },
            { candidateId: "same", action: "skip", equivalentCandidateId: "first",
              reason: "These describe the same adopted retry limit." },
            { candidateId: "distinct", action: "create" }] };
        }
        assert.equal(name, "submit_capture_links");
        return { reviews: input.candidates.map((item: any) => ({ candidateId: item.candidateId,
          decisions: item.memories.map((memory: any) => ({ memoryId: memory.id,
            action: "keep", reason: "A related operational constraint." })) })) };
      }) });
    const input = snapshot(project);
    input.entries[0]!.text += " Interactive requests must respect the latency allowance.";

    // Act.
    const queued = await service.enqueue(input);
    await service.checkpoint();

    // Assert through stored state: all three candidates considered, only two distinct facts saved.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.callCount, 3);
    assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decisions",
      "submit_capture_links"]);
    const outcomes = job.candidateOutcomes as Record<string, any>;
    assert.equal(outcomes.same.memoryId, outcomes.first.memoryId);
    assert.notEqual(outcomes.first.memoryId, outcomes.distinct.memoryId);
    const stored = await client.search({ query: "retry latency", query_context: "test",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(stored.length, 2);
  });

for (const malformedId of [false, true]) {
test(`invalid batch preserves valid sibling; malformed ID=${malformedId}`, realOptions,
  async (t) => {
    // Arrange: candidate-local IDs must survive batching without leaking sibling evidence.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Isolation",
      description: "Sibling validation",
      repo_name: "test/isolation" });
    const directory = await mkdtemp(join(tmpdir(), "capture-isolation-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let corrections = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate("bad"),
          candidate("good")] };
        if (name === "submit_capture_decisions") {
          corrections++;
          return { decisions: [{ candidateId: malformedId ? "unknown" : "bad", action: "supersede",
            conflictingMemoryId: 999, sourceEntryIds: ["assistant"], oldClaim: "old",
            newClaim: "new", reason: "Invalid authority" },
          { candidateId: "good", action: "create" }] };
        }
        return { reviews: input.candidates.map((item: any) => ({ candidateId: item.candidateId,
          decisions: [] })) };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(corrections, 3);
    // The surviving singleton has an empty neighborhood, so no link task is needed.
    assert.equal(job.callCount, 2);
    assert.equal((job.candidateOutcomes.bad as any).stage, "skipped");
    assert.equal((job.candidateOutcomes.good as any).stage, "created");
  });
}

test("lost unlink response reaches the model before it explicitly leaves the absent edge alone",
  realOptions, async (t) => {
    // Arrange: transport loses the successful mutation reply, as can happen on disconnect.
    const baseUrl = await startForgetful(t);
    let lose = true, deletes = 0, creates = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE") deletes++;
      if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
      const response = await fetch(url, init);
      if (lose && init?.method === "DELETE" && String(url).includes("/links/")) {
        lose = false;
        return new Response("Lost unlink response", { status: 503 });
      }
      return response;
    } });
    const project = await client.createProject({ name: "Retry", description: "Durable link receipt",
      repo_name: "test/retry" });
    const misleading = await client.create({ title: "Old experiment",
      content: "Retry indefinitely.",
      context: "Not adopted", keywords: ["retry"], tags: [], project_ids: [project.id] });
    const directory = await mkdtemp(join(tmpdir(), "capture-retry-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let reviews = 0;
    const memoryModel = model((name, input) => {
      if (name === "submit_capture_candidates") return { candidates: [candidate()] };
      if (name === "submit_capture_decision") return { action: "create" };
      reviews++;
      if (reviews === 2) assert.match(JSON.stringify(input), /Lost unlink response/);
      return { reviews: [{ candidateId: "decision", decisions: [
        { memoryId: misleading.id, action: reviews === 1 ? "reject" : "ignore",
          reason: "No useful connection remains." },
      ] }] };
    });
    const service = new CaptureService({ queue, client, model: memoryModel, instanceId: "links" });
    const queued = await service.enqueue(snapshot(project));
    // Act.
    await service.checkpoint();
    const before = (await queue.getJob(queued.jobId))!;
    assert.equal(before.status, "pending");
    const savedId = (before.candidateOutcomes.decision as any).memoryId;
    const restarted = new CaptureService({
      queue: new DurableQueueStore({ directory, instanceId: "links" }), client, instanceId: "links",
      model: memoryModel,
    });
    await restarted.checkpoint();
    // Assert.
    const after = (await queue.getJob(queued.jobId))!;
    assert.equal(after.status, "complete", after.lastError);
    assert.equal(after.callCount, 4);
    assert.equal(reviews, 2);
    assert.equal(deletes, 1);
    assert.equal(creates, 2, "One setup memory and one capture creation");
    assert.equal((after.candidateOutcomes.decision as any).memoryId, savedId);
    assert.ok(!(await client.get(savedId)).linked_memory_ids!.includes(misleading.id));
  });

for (const preservationRace of ["none", "lost-reply", "late-link", "changed-document",
  "unselected-replacement-reference"] as const) {
test(`supersession retains selected references; race=${preservationRace}`, realOptions,
  async (t) => {
    // Arrange: one still-applicable document and memory connection, plus a stale document.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    let lose = preservationRace === "lost-reply";
    let oldId = 0;
    let arrived = false, lateId = 0;
    const concurrent = new ApiForgetfulClient({ baseUrl });
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (preservationRace === "late-link" && !arrived && oldId && init?.method === "PUT" &&
          String(url).includes("/memories/")) {
        arrived = true;
        const old = await concurrent.get(oldId);
        const late = await concurrent.create({ ...candidate(), title: "Later constraint",
          content: "An additional deployment constraint applies.", project_ids: old.project_ids });
        lateId = late.id;
        await concurrent.knowledge.linkMemories(oldId, [late.id]);
      }
      if (lose && init?.method === "DELETE" && !String(url).includes("/links/")) {
        lose = false;
        return new Response("Lost supersession response", { status: 503 });
      }
      return response;
    } });
    const project = await client.createProject({ name: "Migration", description: "Retain history",
      repo_name: "test/migration" });
    const retained = await client.knowledge.createDocument({ title: "Operational rationale",
      description: "Why retries are bounded",
      content: "Repeated attempts consume the latency budget.",
      tags: [], project_id: project.id });
    const stale = await client.knowledge.createDocument({ title: "Old retry rule",
      description: "Previous policy", content: "Retry transient failures once.", tags: [],
      project_id: project.id });
    const old = await client.create({ ...candidate(), project_ids: [project.id],
      content: "Retry transient failures once.", document_ids: [retained.id, stale.id] });
    oldId = old.id;
    const related = await client.create({ ...candidate(), title: "Latency constraint",
      content: "Bound the time spent on each request.", project_ids: [project.id] });
    await client.knowledge.linkMemories(old.id, [related.id]);
    const directory = await mkdtemp(join(tmpdir(), "capture-preserve-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let reviewed = false, reviews = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model(async (name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "supersede",
          conflictingMemoryId: old.id, oldClaim: "Retry once", newClaim: "Retry twice",
          sourceEntryIds: ["user"], reason: "Complete evidenced change to the same retry rule." };
        reviews++;
        if (reviews === 2) assert.match(JSON.stringify(input), /Lost supersession response/);
        const item = input.candidates[0];
        assert.equal(item.previous.memory.id, old.id);
        assert.ok(item.previous.documents.some((doc: any) => doc.content === retained.content));
        reviewed = true;
        if (preservationRace === "unselected-replacement-reference")
          await concurrent.knowledge.updateMemory(item.memory.id, { document_ids: [stale.id] });
        if (preservationRace === "changed-document")
          await concurrent.knowledge.updateDocument(stale.id,
            { content: "A new operational constraint now applies to the replacement." });
        return { reviews: [{ candidateId: "decision", decisions: item.memories.map((m: any) => ({
          memoryId: m.id, action: "add", reason: "Retain applicable operational rationale." })),
        preservation: { status: "complete", documentIds: [retained.id], codeArtifactIds: [],
          entityIds: [], reason: "The old rule is stale; the rationale still applies." } }] };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    if (preservationRace === "lost-reply") await service.checkpoint();
    // Assert: actual new references preserve the model's choices; old references remain historical.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(reviewed, true);
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.decision as any;
    const replacement = await client.get(outcome.replacementId);
    const historical = await client.get(old.id);
    assert.deepEqual(replacement.document_ids, [retained.id]);
    assert.ok(replacement.linked_memory_ids!.includes(related.id));
    assert.deepEqual(historical.document_ids, [retained.id, stale.id]);
    assert.equal(historical.superseded_by, replacement.id);
    if (preservationRace === "late-link") {
      assert.equal(arrived, true);
      assert.ok(!replacement.linked_memory_ids!.includes(lateId));
      assert.ok(historical.linked_memory_ids!.includes(lateId));
    }
    assert.equal(job.callCount, preservationRace === "lost-reply" ? 4 : 3);
  });
}

for (const scenario of [
  "shared", "foreign", "stale", "unresolved", "retry", "exhausted",
] as const) {
  test(`stored link review handles ${scenario} without unsafe mutation`, realOptions, async (t) => {
    // Arrange: isolated records and provider-controlled judgments; all validation remains real.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Boundary", description: "Scope and retries",
      repo_name: "test/boundary" });
    const other = await client.createProject({ name: "Other", description: "Another destination",
      repo_name: "test/other" });
    const endpoint = await client.create({ title: "Architectural dependency",
      content: "The worker depends on the database being available.", context: "Existing fact",
      keywords: ["worker"], tags: [], project_ids: scenario === "shared"
        ? [project.id, other.id] : scenario === "foreign" ? [other.id] : [project.id] });
    const directory = await mkdtemp(join(tmpdir(), "capture-boundary-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let attempts = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model(async (name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        attempts++;
        if ((scenario === "retry" && attempts === 1) || scenario === "exhausted")
          throw new Error("Transient provider failure");
        if (scenario === "stale")
          await client.knowledge.updateMemory(endpoint.id, { content: "The dependency changed." });
        if (scenario === "foreign" || scenario === "shared") {
          assert.equal(input.candidates[0].memories.length, 0);
          assert.ok(!JSON.stringify(input).includes("worker depends on the database"));
        }
        return { reviews: [{ candidateId: "decision", decisions: input.candidates[0].memories
          .map((memory: any) => ({ memoryId: memory.id,
            action: scenario === "unresolved" ? "unresolved" : "reject",
            reason: "Model judged this connection against the full records." })) }] };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    if (scenario === "retry" || scenario === "exhausted") await service.checkpoint();
    if (scenario === "exhausted") await service.checkpoint();
    // Assert: scope and uncertainty block writes; changed claims do not veto model operations.
    const job = (await queue.getJob(queued.jobId))!;
    const outcome = job.candidateOutcomes.decision as any;
    const stored = await client.get(outcome.memoryId);
    if (scenario === "retry" || scenario === "stale") {
      assert.equal(job.status, "complete", job.lastError);
      assert.equal(job.callCount, scenario === "retry" ? 4 : 3);
      assert.ok(!stored.linked_memory_ids!.includes(endpoint.id));
    } else {
      assert.ok(stored.linked_memory_ids!.includes(endpoint.id));
      if (scenario === "exhausted") {
        assert.notEqual(job.status, "complete");
        assert.notEqual(outcome.linkReview.status, "complete");
      } else {
        assert.equal(job.status, "complete", job.lastError);
        assert.equal(outcome.linkReview.status, "partial");
      }
      assert.ok(job.callCount <= 4);
      if (scenario === "exhausted") assert.equal(attempts, 2);
    }
  });
}

test("overlap considers existing entity edges and rejects an unsupported reverse relationship",
  realOptions, async (t) => {
    // Arrange: a known directed dependency and a proposed reverse edge needing model judgment.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Graph", description: "Entity judgment",
      repo_name: "test/graph" });
    const api = await client.knowledge.createEntity({ name: "Gateway", entity_type: "System",
      notes: "Handles requests", tags: [], aka: [], project_ids: [project.id] });
    const database = await client.knowledge.createEntity({ name: "Database", entity_type: "System",
      notes: "Stores data", tags: [], aka: [], project_ids: [project.id] });
    const original = await client.knowledge.createRelationship({ source_entity_id: api.id,
      target_entity_id: database.id, relationship_type: "depends_on" });
    const directory = await mkdtemp(join(tmpdir(), "capture-entities-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const rich = { ...candidate(), content: "Gateway depends on Database.",
      entities: [{ key: "api", sourceEntryIds: ["user"], input: { name: "Gateway",
        entity_type: "System", tags: [], aka: [], notes: "Handles requests" } },
      { key: "db", sourceEntryIds: ["user"], input: { name: "Database",
        entity_type: "System", tags: [], aka: [], notes: "Stores data" } }],
      relationships: [{ key: "supported", sourceEntityKey: "api", targetEntityKey: "db",
        sourceEntryIds: ["user"], input: { relationship_type: "depends_on" } },
      { key: "guessed", sourceEntityKey: "db", targetEntityKey: "api", sourceEntryIds: ["user"],
        input: { relationship_type: "depends_on" } }] };
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [rich] };
        if (name === "submit_capture_decision") {
          assert.ok(input.neighborhood.relationships.some((edge: any) => edge.id === original.id));
          assert.equal(input.neighborhood.entities.length, 2);
          return { action: "create", relationshipKeys: ["supported"], reuse: {
            entities: [{ key: "api", id: api.id }, { key: "db", id: database.id }],
            relationships: [{ key: "supported", id: original.id }] },
            reason: "The evidence supports Gateway depending on Database, not the reverse." };
        }
        return { reviews: [{ candidateId: "decision", decisions: [] }] };
      }) });
    const input = snapshot(project);
    input.entries[0]!.text =
      "Gateway depends on Database. The reverse dependency was only a guess.";
    // Act.
    const queued = await service.enqueue(input);
    await service.checkpoint();
    // Assert: existing direction reused; unsupported reverse not written.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.deepEqual((await client.knowledge.getRelationships(api.id)).map((edge) => edge.id),
      [original.id]);
    assert.equal((await client.knowledge.searchEntities("Gateway", 100)).length, 1);
  });

test("unfinished legacy queues retain spent allowance and never recurate completed candidates",
  realOptions, async (t) => {
    // Arrange: a pre-review worker already saved one candidate using all four model tasks.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Legacy", description: "Queue compatibility",
      repo_name: "test/legacy" });
    await client.create({ ...candidate(), title: "Existing connection to judge",
      project_ids: [project.id] });
    const saved = await client.create({ ...candidate(), project_ids: [project.id] });
    const directory = await mkdtemp(join(tmpdir(), "capture-legacy-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: { complete: async () => { throw new Error("Spent allowance must remain spent"); } } });
    const queued = await service.enqueue(snapshot(project));
    await queue.checkpoint(queued.jobId, { callCount: 4, extractedCandidates: [candidate()],
      candidateOutcomes: { decision: { stage: "memory-created", action: "create",
        memoryId: saved.id, destinationProjectId: project.id } } });
    // Act: new worker resumes the saved memory but cannot make an unfunded judgment.
    await service.checkpoint();
    const pending = (await queue.getJob(queued.jobId))!;
    assert.equal(pending.callCount, 4);
    assert.notEqual(pending.status, "complete");
    assert.equal((pending.candidateOutcomes.decision as any).memoryId, saved.id);
    assert.notEqual((pending.candidateOutcomes.decision as any).linkReview.status, "complete");
    // Assert: legacy completed jobs remain outside the worker; no historical cleanup is inferred.
    await queue.checkpoint(queued.jobId, { status: "complete",
      candidateOutcomes: { decision: { stage: "created", memoryId: saved.id } } });
    await service.checkpoint();
    const complete = (await queue.getJob(queued.jobId))!;
    assert.equal(complete.callCount, 4);
    assert.equal((complete.candidateOutcomes.decision as any).linkReview, undefined);
  });

for (const mode of ["observe", "off", "unsupported"] as const) {
  test(`connected capture preserves ${mode} behavior`, realOptions, async (t) => {
    // Arrange.
    const baseUrl = await startForgetful(t);
    const api = new ApiForgetfulClient({ baseUrl });
    const project = await api.createProject({ name: "Mode", description: "Optional capabilities",
      repo_name: "test/mode" });
    const client = mode === "unsupported" ? {
      search: api.search.bind(api), create: api.create.bind(api), get: api.get.bind(api),
      supersede: api.supersede.bind(api), listProjects: api.listProjects.bind(api),
      createProject: api.createProject.bind(api), linkProject: api.linkProject.bind(api),
    } : api;
    const directory = await mkdtemp(join(tmpdir(), "capture-mode-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let calls = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      getMode: () => mode === "unsupported" ? "auto" : mode,
      model: model((name) => {
        calls++;
        return name === "submit_capture_candidates" ? { candidates: [candidate()] }
          : { action: "create" };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    const memories = await api.search({ query: "retry", query_context: "test",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(memories.length, mode === "unsupported" ? 1 : 0);
    assert.equal(calls, mode === "off" ? 0 : mode === "observe" ? 1 : 2);
    if (mode === "unsupported") {
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(job.status, "complete");
      assert.equal((job.candidateOutcomes.decision as any).linkReview.status, "unsupported");
    }
  });
}

for (const firstAction of ["keep", "add"] as const) {
test(`bidirectional ${firstAction} and reject distinguish writes from no-ops`,
  realOptions, async (t) => {
    // Arrange: two saved candidates are automatically linked to one another.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Edge conflict",
      description: "Batch agreement",
      repo_name: "test/edge-conflict" });
    const directory = await mkdtemp(join(tmpdir(), "capture-edge-conflict-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate("a"),
          { ...candidate("b"), title: "Related constraint", content: "Bound total latency." }] };
        if (name === "submit_capture_decisions") return { decisions: [
          { candidateId: "a", action: "create" }, { candidateId: "b", action: "create" }] };
        return { reviews: input.candidates.map((item: any, index: number) => ({
          candidateId: item.candidateId, decisions: item.memories.map((m: any) => ({ memoryId: m.id,
            action: index === 0 ? firstAction : "reject",
            reason: "Contradictory judgments." })) })) };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: two opposing writes conflict, but a no-op does not veto an explicit removal.
    const job = (await queue.getJob(queued.jobId))!;
    const outcomes = job.candidateOutcomes as Record<string, any>;
    const stored = await client.get(outcomes.a.memoryId);
    if (firstAction === "add") {
      assert.notEqual(job.status, "complete");
      assert.ok(job.submissionRejections?.some((reason) => reason.includes("Contradictory")));
      assert.ok(stored.linked_memory_ids!.includes(outcomes.b.memoryId));
    } else {
      assert.equal(job.status, "complete", job.lastError);
      assert.ok(!stored.linked_memory_ids!.includes(outcomes.b.memoryId));
    }
  });

}

test("switching off during link inspection stops subsequent reads and preserves the saved memory",
  realOptions, async (t) => {
    // Arrange: revoke permission immediately after the first post-write memory read.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Live mode", description: "Stop inspection",
      repo_name: "test/live-mode" });
    await setup.create({ ...candidate(), project_ids: [project.id] });
    let mode: "auto" | "off" = "auto";
    let created = false;
    let callsAfterOff = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (mode === "off") callsAfterOff++;
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/memories")) created = true;
      if (created && init?.method === "GET" && /\/memories\/\d+$/.test(String(url))) mode = "off";
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-stop-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links", getMode: () => mode,
      model: model((name) => name === "submit_capture_candidates" ? { candidates: [candidate()] }
        : { action: "create" }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    assert.equal(callsAfterOff, 0);
    const job = (await queue.getJob(queued.jobId))!;
    assert.notEqual(job.status, "complete");
    assert.ok((job.candidateOutcomes.decision as any).memoryId);
    assert.equal(job.callCount, 2);
  });

test("equivalent existing memory executes additions and explicit historical link removal",
  realOptions, async (t) => {
    // Arrange: no creation in this job; the existing link has no automatic-origin receipt here.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Reuse",
      description: "Enrich equivalent fact",
      repo_name: "test/reuse" });
    const saved = await client.create({ ...candidate(), project_ids: [project.id] });
    const historical = await client.create({ ...candidate(), title: "Historical rationale",
      content: "This explains an earlier choice.", project_ids: [project.id] });
    const related = await client.create({ ...candidate(), title: "Operational constraint",
      content: "Finish requests within the latency allowance.", project_ids: [project.id] });
    await client.knowledge.linkMemories(saved.id, [historical.id]);
    const directory = await mkdtemp(join(tmpdir(), "capture-reuse-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let reviewed = false;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision")
          return { action: "skip", memoryId: saved.id, enrich: true };
        reviewed = true;
        return { reviews: [{ candidateId: "decision", decisions: [
          { memoryId: historical.id, action: "reject",
            reason: "Historical rationale no longer applies." },
          { memoryId: related.id, action: "add", reason: "Related latency constraint." },
        ] }] };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    assert.equal(reviewed, true);
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal((job.candidateOutcomes.decision as any).memoryId, saved.id);
    assert.deepEqual((await client.get(saved.id)).linked_memory_ids!.sort((a, b) => a - b),
      [related.id]);
    const memories = await client.search({ query: "retry", query_context: "test",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(memories.length, 3);
  });

test("overflow connections remain stored and explicitly unreviewed within the eight-record bound",
  realOptions, async (t) => {
    // Arrange: a service graph larger than a single bounded capture review.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "10" });
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Overflow", description: "Bounded coverage",
      repo_name: "test/overflow" });
    for (let index = 0; index < 10; index++)
      await client.create({ ...candidate(), title: `Existing constraint ${index}`,
        project_ids: [project.id] });
    const directory = await mkdtemp(join(tmpdir(), "capture-overflow-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        assert.equal(input.candidates[0].memories.length, 8);
        return { reviews: [{ candidateId: "decision", decisions: input.candidates[0].memories
          .map((m: any) => ({ memoryId: m.id, action: "keep",
            reason: "Supported connection." })) }] };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: no hidden pruning and no claim to have reviewed the whole graph.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.decision as any;
    assert.equal((await client.get(outcome.memoryId)).linked_memory_ids!.length, 10);
    assert.equal(outcome.linkReview.status, "partial");
    assert.equal(outcome.linkReview.unreviewed.length, 2);
    assert.equal(job.callCount, 3);
  });


test("public capture hands a reviewed stored fact to a fresh recall service", realOptions,
  async (t) => {
  // Arrange: three records fit the real recall k=3 with this fixture's identical embeddings.
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Handover", description: "Fresh context",
    repo_name: "test/handover" });
  const rationale = await client.create({ ...candidate(), title: "Recovery rationale",
    content: "Transient failures usually recover on another attempt.", project_ids: [project.id] });
  const proposal = await client.create({ ...candidate(), title: "Unadopted proposal",
    content: "An experiment proposed unlimited retries.", project_ids: [project.id] });
  const directory = await mkdtemp(join(tmpdir(), "capture-handover-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "links" });
  const service = new CaptureService({ queue, client, instanceId: "links",
    model: model((name) => {
      if (name === "submit_capture_candidates") return { candidates: [candidate()] };
      if (name === "submit_capture_decision") return { action: "create" };
      return { reviews: [{ candidateId: "decision", decisions: [
        { memoryId: rationale.id, action: "keep", reason: "Supported operational rationale." },
        { memoryId: proposal.id, action: "reject", reason: "The proposal is not a justification." },
      ] }] };
    }) });
  // Act: storage followed by a fresh recall instance, with no original conversation.
  const queued = await service.enqueue(snapshot(project));
  await service.checkpoint();
  const job = (await queue.getJob(queued.jobId))!;
  assert.equal(job.status, "complete", job.lastError);
  const stored = await client.get((job.candidateOutcomes.decision as any).memoryId);
  assert.deepEqual(stored.linked_memory_ids, [rationale.id]);
  const freshClient = new ApiForgetfulClient({ baseUrl });
  const recall = new RecallService(freshClient, { complete: async (request) => {
    if (request.purpose === "classification") return { search: true, queries: ["retry rule"],
      queryIntent: "Find the adopted retry limit", entities: [] };
    assert.match(JSON.stringify(request.input), /Retry transient failures twice/);
    return request.submission!.validate({ summary: "Retry transient failures twice.",
      reason: "The stored adopted rule answers the question.", memoryIds: [stored.id] });
  } });
  const recalled = await recall.recall({ prompt: "What retry limit did we adopt?",
    context: { cwd: "/repo", sessionId: "fresh", branchId: "fresh-branch", project },
    scope: "global", classificationPolicy: "Find the missing decision.",
    recallPolicy: "Use supported stored facts.", deadlineMs: 4_000 });
  assert.deepEqual(recalled.memoryIds, [stored.id], JSON.stringify(recalled));
  assert.match(recalled.text, /Retry transient failures twice/);
  assert.doesNotMatch(recalled.text, /unlimited retries/);
});

test("retry does not repeat a verified unlink after another writer restores the edge", realOptions,
  async (t) => {
    // Arrange: first edge verified, second mutation interrupted, then an external graph change.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Concurrent", description: "Changed edge",
      repo_name: "test/concurrent" });
    const first = await setup.create({ ...candidate(), project_ids: [project.id] });
    const second = await setup.create({ ...candidate(), project_ids: [project.id] });
    let interrupt = true, firstDeletes = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE" && String(url).endsWith(`/links/${first.id}`))
        firstDeletes++;
      if (interrupt && init?.method === "DELETE" && String(url).endsWith(`/links/${second.id}`)) {
        interrupt = false;
        return new Response("Interrupted second mutation", { status: 503 });
      }
      return fetch(url, init);
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-restored-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let reviews = 0;
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        reviews++;
        if (reviews === 2) assert.match(JSON.stringify(input), /Interrupted second mutation/);
        return { reviews: [{ candidateId: "decision", decisions: [first.id, second.id]
          .map((memoryId) => ({ memoryId,
            action: reviews === 2 && memoryId === first.id ? "keep" : "reject",
            reason: reviews === 2 && memoryId === first.id
              ? "Retain the restored connection." : "Misleading connection." })) }] };
      }) });
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    const receipt = (await queue.getJob(queued.jobId))!.candidateOutcomes.decision as any;
    assert.ok(receipt.linkReview.executionResults.some((result: any) =>
      result.operation === "unlink" && result.targetId === first.id &&
      result.status === "completed"));
    // Act: an external writer restores the already-reviewed edge before the worker resumes.
    await setup.knowledge.linkMemories(receipt.memoryId, [first.id]);
    await service.checkpoint();
    // Assert: the new model instruction retains the restored edge and retries the failed removal.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.ok((await setup.get(receipt.memoryId)).linked_memory_ids!.includes(first.id));
    assert.equal(job.callCount, 4);
    assert.equal(reviews, 2);
    assert.equal(firstDeletes, 1);
    assert.ok(!(await setup.get(receipt.memoryId)).linked_memory_ids!.includes(second.id));
  });

test("earlier-sibling reuse follows the explicit selection despite changed claims",
  realOptions,
  async (t) => {
    // Arrange: an external write changes the first fact before the equivalent sibling reuses it.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Sibling race", description: "Stale reuse",
      repo_name: "test/sibling-race" });
    let createdId = 0;
    let change = true;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (change && createdId && init?.method === "GET" &&
          String(url).endsWith(`/memories/${createdId}`)) {
        change = false;
        await setup.knowledge.updateMemory(createdId,
          { content: "Another adopted rule now applies." });
      }
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/memories"))
        createdId = (await response.clone().json() as { id: number }).id;
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-sibling-race-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate("first"),
          candidate("same")] };
        if (name === "submit_capture_decisions") return { decisions: [
          { candidateId: "first", action: "create" },
          { candidateId: "same", action: "skip", equivalentCandidateId: "first",
            reason: "Equivalent evidenced fact." }] };
        return { reviews: input.candidates.map((item: any) => ({ candidateId: item.candidateId,
          decisions: [] })) };
      }) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(change, false);
    assert.equal((job.candidateOutcomes.same as any).memoryId, createdId);
    assert.equal((await setup.get(createdId)).content, "Another adopted rule now applies.");
    assert.equal(job.callCount, 2);
  });

for (const action of ["add", "reject"] as const) {
  test(`permission callback cannot authorize an out-of-scope ${action} endpoint`, realOptions,
    async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: action === "add" ? "0" : "1" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Permission", description: "Authorization",
      repo_name: `test/permission-${action}` });
    const foreign = await setup.createProject({ name: "Other", description: "Other scope",
      repo_name: `test/other-${action}` });
    const endpoint = await setup.create({ ...candidate(), project_ids: [project.id] });
    let reviewed = false, moved = false, unauthorized = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (moved && ["POST", "DELETE"].includes(init?.method ?? "") &&
          String(url).includes("/links")) unauthorized++;
      const response = await fetch(url, init);
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-permission-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      getMode: async () => {
        if (reviewed && !moved) {
          moved = true;
          await setup.knowledge.updateMemory(endpoint.id, { project_ids: [foreign.id] });
        }
        return "auto" as const;
      },
      model: model((name) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        reviewed = true;
        return { reviews: [{ candidateId: "decision", decisions: [{ memoryId: endpoint.id,
          action, reason: "Supported judgment from the supplied full record." }] }] };
      }) });
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    assert.equal(moved, true);
    assert.equal(unauthorized, 0, "No link write may use the pre-permission membership");
    assert.notEqual((await queue.getJob(queued.jobId))!.status, "complete");
  });
}

for (const [drift, firstAction] of [["edge", "reject"], ["endpoint", "reject"],
  ["edge", "keep"], ["edge", "add"]] as const) {
  test(`completed ${firstAction} remains completed after later ${drift} changes`, realOptions,
    async (t) => {
      const baseUrl = await startForgetful(t);
      const setup = new ApiForgetfulClient({ baseUrl });
      const project = await setup.createProject({ name: "Final check", description: "Concurrent",
        repo_name: `test/final-${drift}` });
      const first = await setup.create({ ...candidate(), project_ids: [project.id] });
      const second = await setup.create({ ...candidate(), project_ids: [project.id] });
      let changed = false;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (!changed && init?.method === "DELETE" &&
            String(url).endsWith(`/links/${second.id}`)) {
          changed = true;
          const source = Number(String(url).match(/memories\/(\d+)\/links/)![1]);
          if (drift === "endpoint")
            await setup.knowledge.updateMemory(first.id, { content: "Changed claim." });
          else if (firstAction === "reject")
            await setup.knowledge.linkMemories(source, [first.id]);
          else await setup.knowledge.unlinkMemories(source, first.id);
        }
        return response;
      } });
      const directory = await mkdtemp(join(tmpdir(), "capture-final-state-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: "links" });
      const service = new CaptureService({ queue, client, instanceId: "links",
        model: model((name) => {
          if (name === "submit_capture_candidates") return { candidates: [candidate()] };
          if (name === "submit_capture_decision") return { action: "create" };
          return { reviews: [{ candidateId: "decision", decisions: [first.id, second.id]
            .map((memoryId) => ({ memoryId,
              action: memoryId === first.id ? firstAction : "reject",
              reason: "Judgment from the supplied full records." })) }] };
        }) });
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      assert.equal(changed, true);
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(job.status, "complete", job.lastError);
      const stored = await setup.get((job.candidateOutcomes.decision as any).memoryId);
      assert.equal(stored.linked_memory_ids!.includes(first.id),
        drift === "edge" && firstAction === "reject");
      assert.ok(!stored.linked_memory_ids!.includes(second.id));
      assert.equal(job.callCount, 3);
    });
}

for (const race of ["document-permission", "entity-permission", "late-entity",
  "removed-association", "removed-edge", "removed-entity", "late-replacement-link",
  "gate-off", "stop"] as const) {
  test(`supersession checks permissions without enforcing completed associations: ${race}`,
    realOptions, async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Preservation", description: "Fresh records",
      repo_name: `test/preservation-${race}` });
    const foreign = await setup.createProject({ name: "Foreign", description: "Other records",
      repo_name: `test/foreign-${race}` });
    const document = await setup.knowledge.createDocument({ title: "Rationale",
      description: "Bounded attempts", content: "Attempts consume latency budget.", tags: [],
      project_id: project.id });
    const entity = await setup.knowledge.createEntity({ name: "Gateway", entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] });
    const late = await setup.knowledge.createEntity({ name: "Late dependency",
      entity_type: "System", tags: [], aka: [], project_ids: [project.id] });
    const old = await setup.create({ ...candidate(), content: "Retry once.",
      project_ids: [project.id], document_ids: [document.id] });
    await setup.knowledge.linkEntityMemory(entity.id, old.id);
    const related = await setup.create({ ...candidate(), title: "Related constraint",
      project_ids: [project.id] });
    await setup.knowledge.linkMemories(old.id, [related.id]);
    let reviewed = false, replacement = 0, changed = false, unauthorized = 0;
    let attached = false;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const path = new URL(String(url)).pathname;
      const mutation = ["PUT", "POST", "DELETE"].includes(init?.method ?? "");
      if (changed && mutation && ((race === "document-permission" && init?.method === "PUT") ||
          (race === "entity-permission" && path.endsWith(`/entities/${entity.id}/memories`)) ||
          race === "gate-off" || race === "stop")) unauthorized++;
      const response = await fetch(url, init);
      if (init?.method === "POST" && path.endsWith("/memories") &&
          !path.includes("/entities/"))
        replacement = (await response.clone().json() as { id: number }).id;
      if (reviewed && init?.method === "POST" &&
          path.endsWith(`/entities/${entity.id}/memories`)) attached = true;
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-preservation-race-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      ...(race === "gate-off" ? { canWriteNow: () => !changed } : {}),
      getMode: async () => {
        if (!reviewed || changed) return "auto" as const;
        if ((race === "gate-off" || race === "stop") && attached) {
          changed = true;
          if (race === "stop") service.stop();
        } else if (race === "document-permission") {
          changed = true;
          await setup.knowledge.updateDocument(document.id, { project_id: foreign.id });
        } else if (race === "entity-permission") {
          changed = true;
          await setup.knowledge.updateEntity(entity.id, { project_ids: [foreign.id] });
        } else if (race === "late-entity") {
          changed = true;
          await setup.knowledge.linkEntityMemory(late.id, old.id);
        } else if (race === "removed-association" && attached) {
          changed = true;
          await setup.knowledge.updateMemory(replacement, { document_ids: [] });
        } else if (race === "removed-edge" && attached) {
          changed = true;
          await setup.knowledge.unlinkMemories(replacement, related.id);
        } else if (race === "late-replacement-link" && attached) {
          changed = true;
          const extra = await setup.create({ ...candidate(), title: "New constraint",
            project_ids: [project.id] });
          await setup.knowledge.linkMemories(replacement, [extra.id]);
        } else if (race === "removed-entity" && attached) {
          changed = true;
          const response = await fetch(
            `${baseUrl}/entities/${entity.id}/memories/${replacement}`,
            { method: "DELETE" });
          assert.equal(response.status, 200, await response.text());
        }
        return "auto" as const;
      }, model: model((name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "supersede",
          conflictingMemoryId: old.id, oldClaim: "Retry once", newClaim: "Retry twice",
          sourceEntryIds: ["user"], reason: "Complete change to the same rule." };
        reviewed = true;
        return { reviews: [{ candidateId: "decision", decisions: input.candidates[0].memories
          .map((m: any) => ({ memoryId: m.id, action: "add", reason: "Related constraint." })),
        preservation: { status: "complete", documentIds: [document.id], codeArtifactIds: [],
          entityIds: [entity.id], reason: "The supporting rationale and system still apply." } }] };
      }) });
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    assert.equal(changed, true, JSON.stringify(await queue.getJob(queued.jobId)));
    if (race === "removed-entity") {
      const before = (await queue.getJob(queued.jobId))!;
      assert.deepEqual(await setup.getMemoryEntityIds(replacement), [], JSON.stringify(before));
      assert.equal((before.candidateOutcomes.decision as any).linkReview.preservationVerified,
        true, JSON.stringify(before));
      await service.checkpoint();
      assert.deepEqual(await setup.getMemoryEntityIds(replacement), []);
    }
    assert.equal(unauthorized, 0, "No writes using revoked resource or worker permission");
    const job = (await queue.getJob(queued.jobId))!;
    const blocked = ["document-permission", "entity-permission", "gate-off", "stop"].includes(race);
    if (blocked) assert.notEqual(job.status, "complete");
    else assert.equal(job.status, "complete", job.lastError);
    assert.equal((await setup.get(old.id)).is_obsolete, !blocked);
    if (race === "removed-association")
      assert.deepEqual((await setup.get(replacement)).document_ids, []);
    if (race === "removed-edge")
      assert.ok(!(await setup.get(replacement)).linked_memory_ids!.includes(related.id));
    if (race === "late-entity")
      assert.ok(!(await setup.getMemoryEntityIds(replacement)).includes(late.id));
    assert.equal(job.callCount, 3);
  });
}

for (const [status, phase] of [[404, "inspection"], [503, "inspection"],
  [404, "application"], [503, "application"]] as const) {
  test(`selected endpoint HTTP ${status} during ${phase} preserves independent connections`,
    realOptions, async (t) => {
      const baseUrl = await startForgetful(t);
      const setup = new ApiForgetfulClient({ baseUrl });
      const project = await setup.createProject({ name: "Unavailable", description: "Coverage",
        repo_name: `test/unavailable-${status}` });
      const missing = await setup.create({ ...candidate(), project_ids: [project.id] });
      const useful = await setup.create({ ...candidate(), project_ids: [project.id] });
      let captureCreated = false, reviewed = false, reviews = 0;
      const serviceText = `Selected endpoint unavailable: service diagnostic ${status}`;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        if (captureCreated && init?.method === "GET" &&
            String(url).endsWith(`/memories/${missing.id}`)) {
          if (phase === "inspection" || (phase === "application" && reviewed))
            return new Response(serviceText, { status });
        }
        const response = await fetch(url, init);
        if (init?.method === "POST" && String(url).endsWith("/memories"))
          captureCreated = true;
        return response;
      } });
      const directory = await mkdtemp(join(tmpdir(), "capture-missing-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: "links" });
      const service = new CaptureService({ queue, client, instanceId: "links",
        model: model((name, input) => {
          if (name === "submit_capture_candidates") return { candidates: [candidate()] };
          if (name === "submit_capture_decision") return { action: "create" };
          reviewed = true;
          reviews++;
          if (reviews === 2) {
            assert.match(JSON.stringify(input), new RegExp(serviceText));
            return { reviews: input.candidates.map((item: any) => ({
              candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
                memoryId: memory.id, action: "reject", reason: "Retry the explicit removal." })),
            })) };
          }
          assert.deepEqual(input.candidates[0].memories.map((m: any) => m.id).sort(),
            (phase === "inspection" ? [useful.id] : [missing.id, useful.id]).sort());
          return { reviews: [{ candidateId: "decision", decisions: input.candidates[0].memories
            .map((memory: any) => ({ memoryId: memory.id,
              action: "reject",
              reason: "Judgment supported by the supplied full record." })) }] };
        }) });
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      const job = (await queue.getJob(queued.jobId))!;
      if (phase === "application") {
        assert.notEqual(job.status, "complete");
        assert.ok(job.lastError?.includes(serviceText), job.lastError);
        await service.checkpoint();
        assert.equal(reviews, 2);
        assert.equal((await queue.getJob(queued.jobId))!.callCount, 4);
        return;
      }
      if (status === 503) {
        assert.notEqual(job.status, "complete");
        assert.ok(job.lastError?.includes(serviceText), job.lastError);
        return;
      }
      assert.equal(job.status, "complete", job.lastError);
      const outcome = job.candidateOutcomes.decision as any;
      assert.equal(outcome.linkReview.status, "partial");
      assert.ok(outcome.linkReview.unreviewed.some((item: any) =>
        item.memoryId === missing.id && item.reason.includes(serviceText)));
      assert.deepEqual((await setup.get(outcome.memoryId)).linked_memory_ids, [missing.id]);
      assert.equal(job.callCount, 3);
    });
}

for (const revoke of ["gate", "stop", "non-true"] as const) {
test(`synchronous ${revoke} during final authorization prevents mutation`, realOptions,
  async (t) => {
  const baseUrl = await startForgetful(t);
  const setup = new ApiForgetfulClient({ baseUrl });
  const project = await setup.createProject({ name: "Gate", description: "Final read",
    repo_name: "test/final-gate" });
  const endpoint = await setup.create({ ...candidate(), project_ids: [project.id] });
  let mode: "auto" | "off" = "auto";
  let reviewed = false, reads = 0, unauthorized = 0;
  const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
    if (mode === "off" && init?.method === "DELETE") unauthorized++;
    const response = await fetch(url, init);
    if (reviewed && init?.method === "GET" &&
        String(url).endsWith(`/memories/${endpoint.id}`) && ++reads === 1) {
      mode = "off";
      if (revoke === "stop") service.stop();
    }
    return response;
  } });
  const directory = await mkdtemp(join(tmpdir(), "capture-final-off-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "links" });
  const service = new CaptureService({ queue, client, instanceId: "links",
    getMode: async () => "auto" as const,
    ...(revoke === "stop" ? {} : { canWriteNow: () => mode === "auto" ? true :
      revoke === "non-true" ? undefined as unknown as boolean : false }),
    model: model((name) => {
      if (name === "submit_capture_candidates") return { candidates: [candidate()] };
      if (name === "submit_capture_decision") return { action: "create" };
      reviewed = true;
      return { reviews: [{ candidateId: "decision", decisions: [{ memoryId: endpoint.id,
        action: "reject", reason: "Misleading proposal connection." }] }] };
    }) });
  await service.enqueue(snapshot(project));
  await service.checkpoint();
  assert.equal(mode, "off");
  assert.equal(unauthorized, 0);
});
}

for (const race of ["scope", "gate", "stop"] as const) {
test(`capture rich attachments revalidate scope and guard ${race}`, realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Writer", description: "Fresh attachments",
      repo_name: "test/writer" });
    const foreign = await setup.createProject({ name: "Foreign", description: "Other attachments",
      repo_name: "test/writer-other" });
    let documentId = 0, documentReads = 0, moved = false, unauthorized = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (moved && init?.method === "PUT" && String(url).includes("/memories/")) unauthorized++;
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/documents"))
        documentId = (await response.clone().json() as { id: number }).id;
      if (documentId && init?.method === "GET" &&
          String(url).endsWith(`/documents/${documentId}`)) {
        documentReads++;
        if (documentReads === 1 && race !== "scope") {
          moved = true;
          if (race === "stop") service.stop();
        }
      }
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-writer-gate-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      ...(race === "gate" ? { canWriteNow: () => !moved } : {}),
      getMode: async () => {
        if (race === "scope" && documentId && !moved) {
          moved = true;
          await setup.knowledge.updateDocument(documentId, { project_id: foreign.id });
        }
        return "auto" as const;
      }, model: model((name) => {
        if (name === "submit_capture_candidates") return { candidates: [{ ...candidate(),
          documents: [{ key: "rule", sourceEntryIds: ["user"], input: { title: "Retry rule",
            description: "Adopted retry policy", content: "Retry transient failures twice.",
            document_type: "text", tags: [] } }] }] };
        if (name === "submit_capture_decision") return { action: "create" };
        return { reviews: [{ candidateId: "decision", decisions: [] }] };
      }) });
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    assert.equal(moved, true);
    assert.equal(unauthorized, 0);
    assert.notEqual((await queue.getJob(queued.jobId))!.status, "complete");
  });

}

for (const timing of ["linked", "during-review", "after-receipt"] as const) {
  test(`ignore never removes an edge: ${timing}`, realOptions, async (t) => {
    const baseUrl = await startForgetful(t, {
      MEMORY_NUM_AUTO_LINK: timing === "linked" ? "1" : "0",
    });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Ignore", description: "No pruning authority",
      repo_name: `test/ignore-${timing}` });
    const endpoint = await setup.create({ ...candidate(), project_ids: [project.id] });
    let sourceId = 0, deletes = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE") deletes++;
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/memories"))
        sourceId = (await response.clone().json() as { id: number }).id;
      return response;
    } });
    const directory = await mkdtemp(join(tmpdir(), "capture-ignore-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const service = new CaptureService({ queue, client, instanceId: "links",
      model: model(async (name, input) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_capture_decision") return { action: "create" };
        assert.deepEqual(input.candidates[0].eligibleMemoryIds, [endpoint.id]);
        assert.equal("previous" in input.candidates[0], false);
        if (timing === "during-review")
          await setup.knowledge.linkMemories(sourceId, [endpoint.id]);
        return { reviews: [{ candidateId: "decision", decisions: [{ memoryId: endpoint.id,
          action: "ignore", reason: "Unrelated subject." }] }] };
      }) });
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    if (timing === "after-receipt") {
      await setup.knowledge.linkMemories(sourceId, [endpoint.id]);
      await service.checkpoint();
    }
    assert.ok((await setup.get(sourceId)).linked_memory_ids!.includes(endpoint.id));
    assert.equal(deletes, 0);
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
  });
}

test("batch overlap has an explicit array contract and preserves the trusted overlay verbatim",
  realOptions, async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Batch policy", description: "Protocol",
      repo_name: "test/batch-policy" });
    const directory = await mkdtemp(join(tmpdir(), "capture-policy-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    const overlay = "Compare submit_capture_decision with submit_capture_decisions. Preserve this.";
    let observed = false;
    const provider = new PiMemoryModel({
      find: () => ({ provider: "test", id: "memory", maxTokens: 8_000 }) as any,
      complete: async (_model, context) => {
        const name = context.tools![0]!.name;
        const input = decodeProviderContext(context).input;
        let args: unknown;
        if (name === "submit_capture_candidates") args = {
          candidates: [candidate("first"), { ...candidate("second"), title: "Another fact" }] };
        else {
          assert.equal(name, "submit_capture_decisions");
          assert.ok(context.systemPrompt?.includes(overlay), context.systemPrompt);
          assert.match(context.systemPrompt ?? "", /decisions array/);
          assert.match(context.systemPrompt ?? "", /candidateId/);
          assert.deepEqual(input.candidates.map((item: any) => item.candidate.id),
            ["first", "second"]);
          assert.deepEqual(input.siblings.map((item: any) => item.id), ["first", "second"]);
          observed = true;
          args = { decisions: [{ candidateId: "first", action: "create" },
            { candidateId: "second", action: "skip", equivalentCandidateId: "first",
              reason: "Same supported fact." }] };
        }
        return { role: "assistant", api: "test", provider: "test", model: "memory",
          content: [{ type: "toolCall", id: "submit", name, arguments: args }],
          stopReason: "toolUse", timestamp: Date.now(),
          usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } } as any;
      },
    }, { provider: "test", id: "memory" });
    const service = new CaptureService({ queue, client, model: provider, instanceId: "links" });
    const queued = await service.enqueue({ ...snapshot(project), policy: overlay });
    await service.checkpoint();
    assert.equal(observed, true);
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.callCount, 2);
  });

test("ignore does not veto an explicit add on the same edge", realOptions, async (t) => {
  const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Symmetry", description: "Agree on absence",
    repo_name: "test/ignore-symmetry" });
  const first = await client.create({ ...candidate(), project_ids: [project.id] });
  const second = await client.create({ ...candidate(), title: "Another rule",
    project_ids: [project.id] });
  const directory = await mkdtemp(join(tmpdir(), "capture-ignore-symmetry-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "links" });
  const service = new CaptureService({ queue, client, instanceId: "links",
    model: model((name, input) => {
      if (name === "submit_capture_candidates") return { candidates: [candidate("a"),
        { ...candidate("b"), title: "Another rule" }] };
      if (name === "submit_capture_decisions") return { decisions: [
        { candidateId: "a", action: "skip", memoryId: first.id, enrich: true },
        { candidateId: "b", action: "skip", memoryId: second.id, enrich: true }] };
      return { reviews: input.candidates.map((item: any, index: number) => ({
        candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
          memoryId: memory.id, action: index === 0 ? "ignore" : "add",
          reason: "Conflicting model judgments." })) })) };
    }) });
  const queued = await service.enqueue(snapshot(project));
  await service.checkpoint();
  const job = (await queue.getJob(queued.jobId))!;
  assert.equal(job.status, "complete", job.lastError);
  assert.deepEqual((await client.get(first.id)).linked_memory_ids, [second.id]);
  assert.deepEqual((await client.get(second.id)).linked_memory_ids, [first.id]);
});

for (const stale of [false, true]) {
  test(`three-candidate reuse chain executes model selections; changed claim=${stale}`, realOptions,
    async (t) => {
      const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
      const setup = new ApiForgetfulClient({ baseUrl });
      const project = await setup.createProject({ name: "Reuse chain", description: "Same fact",
        repo_name: "test/reuse-chain" });
      const directory = await mkdtemp(join(tmpdir(), "capture-reuse-chain-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: "links" });
      let createdId = 0, changed = false, creates = 0;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        if (stale && !changed && createdId && init?.method === "GET" &&
            String(url).endsWith(`/memories/${createdId}`)) {
          const jobs = await queue.listJobs();
          if ((jobs[0]?.candidateOutcomes.b as any)?.stage === "links-pending") {
            changed = true;
            await setup.knowledge.updateMemory(createdId, { content: "A different adopted fact." });
          }
        }
        const response = await fetch(url, init);
        if (init?.method === "POST" && String(url).endsWith("/memories")) {
          creates++;
          createdId = (await response.clone().json() as { id: number }).id;
        }
        return response;
      } });
      const service = new CaptureService({ queue, client, instanceId: "links",
        model: model((name) => {
          if (name === "submit_capture_candidates")
            return { candidates: [candidate("a"), candidate("b"), candidate("c")] };
          assert.equal(name, "submit_capture_decisions");
          return { decisions: [{ candidateId: "a", action: "create" },
            { candidateId: "b", action: "skip", equivalentCandidateId: "a", enrich: true,
              reason: "Same fact." },
            { candidateId: "c", action: "skip", equivalentCandidateId: "b", enrich: true,
              reason: "Same fact." }]
          };
        }) });
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(creates, 1);
      assert.equal(job.callCount, 2);
      assert.equal(changed, stale);
      assert.equal(job.status, "complete", job.lastError);
      for (const id of ["a", "b", "c"])
        assert.equal((job.candidateOutcomes[id] as any).memoryId, createdId);
      if (stale) assert.equal((await setup.get(createdId)).content, "A different adopted fact.");
    });
}

for (const drift of ["none", "restored-edge", "endpoint", "arrived-edge"] as const) {
  test(`restart preserves completed operations without enforcing graph state: ${drift}`,
    realOptions,
    async (t) => {
      const baseUrl = await startForgetful(t);
      const setup = new ApiForgetfulClient({ baseUrl });
      const project = await setup.createProject({ name: "Review restart", description: "Read back",
        repo_name: "test/review-restart" });
      const endpoint = await setup.create({ ...candidate(), project_ids: [project.id] });
      const directory = await mkdtemp(join(tmpdir(), "capture-finished-review-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: "links" });
      let receipt: any;
      const service = new CaptureService({ queue, client: setup, instanceId: "links",
        logger: { flush: async () => undefined, emit: (_level, event, data) => {
          const outcome = data?.outcome as any;
          if (event === "capture.candidate_outcome" && outcome?.stage === "links-pending" &&
              outcome.linkReview?.status === "complete") receipt = structuredClone(outcome);
        } }, model: model((name) => {
          if (name === "submit_capture_candidates") return { candidates: [candidate()] };
          if (name === "submit_capture_decision") return { action: "create" };
          return { reviews: [{ candidateId: "decision", decisions: [{ memoryId: endpoint.id,
            action: "reject", reason: "Misleading connection." }] }] };
        }) });
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      assert.ok(receipt);
      // Restore the actual durable boundary, simulating loss before the final candidate checkpoint.
      await queue.checkpoint(queued.jobId, { status: "pending",
        candidateOutcomes: { decision: receipt } });
      if (drift === "restored-edge")
        await setup.knowledge.linkMemories(receipt.memoryId, [endpoint.id]);
      if (drift === "endpoint")
        await setup.knowledge.updateMemory(endpoint.id, { content: "A different claim." });
      if (drift === "arrived-edge") {
        const other = await setup.create({ ...candidate(), project_ids: [project.id] });
        await setup.knowledge.linkMemories(receipt.memoryId, [other.id]);
      }
      let mutations = 0;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        if (["POST", "PUT", "DELETE"].includes(init?.method ?? "")) mutations++;
        return fetch(url, init);
      } });
      const restarted = new CaptureService({
        queue: new DurableQueueStore({ directory, instanceId: "links" }),
        client, instanceId: "links", model: { complete: async () => {
          throw new Error("Accepted review must retain its budget");
        } },
      });
      await restarted.checkpoint();
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(job.callCount, 3);
      assert.equal(mutations, 0);
      assert.equal(job.status, "complete", job.lastError);
      assert.equal((job.candidateOutcomes.decision as any).linkReview.status, "complete");
      if (drift === "restored-edge")
        assert.ok((await setup.get(receipt.memoryId)).linked_memory_ids!.includes(endpoint.id));
    });
}

for (const drift of ["replacement-scope", "memory-scope", "entity-scope"] as const) {
  test(`partial migration reauthorizes after permission changes ${drift}`,
    realOptions, async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Migration", description: "Scope safety",
      repo_name: "test/migration" });
    const foreign = await setup.createProject({ name: "Foreign", description: "Other destination",
      repo_name: "test/foreign" });
    const old = await setup.create({ ...candidate(), content: "Retry once. Keep the timeout.",
      project_ids: [project.id] });
    const related = await setup.create({ ...candidate(), title: "Timeout constraint",
      project_ids: [project.id] });
    const entity = await setup.knowledge.createEntity({ name: "Retry worker", entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] });
    if (drift === "entity-scope") await setup.knowledge.linkEntityMemory(entity.id, old.id);
    else await setup.knowledge.linkMemories(old.id, [related.id]);
    const directory = await mkdtemp(join(tmpdir(), "partial-permission-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let replacementId: number | undefined, armed = false, changed = false, migrationWrites = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const path = new URL(String(url)).pathname;
      if (changed && init?.method === "POST" &&
          (path.endsWith("/links") || path.endsWith(`/entities/${entity.id}/memories`)))
        migrationWrites++;
      const response = await fetch(url, init);
      if (init?.method === "POST" && path.endsWith("/memories") && !path.includes("/entities/")) {
        replacementId = (await response.clone().json() as { id: number }).id;
        armed = true;
      }
      return response;
    } });
    const service = new CaptureService({ queue, client, instanceId: "links",
      getMode: async () => {
        if (armed && !changed) {
          changed = true;
          if (drift === "entity-scope")
            await setup.knowledge.updateEntity(entity.id, { project_ids: [foreign.id] });
          else await setup.knowledge.updateMemory(drift === "memory-scope"
            ? related.id : replacementId!, { project_ids: [foreign.id] });
        }
        return "auto" as const;
      }, model: model((name) => {
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_memory_revision") return { title: "Retry and timeout",
          content: "Retry twice. Keep the timeout.", context: "Only retries changed.",
          keywords: ["retry"], tags: ["decision"], importance: 8, sourceEntryIds: ["user"],
          documentIds: [], codeArtifactIds: [], fileIds: [], sourceFiles: [],
          entityIds: drift === "entity-scope" ? [entity.id] : [],
          memoryIds: drift === "entity-scope" ? [] : [related.id] };
        assert.equal(name, "submit_capture_decision");
        return { action: "escalate", conflictingMemoryId: old.id, partial: true,
          oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
          reason: "Preserve timeout claim." };
      }) });
    await service.enqueue(snapshot(project));
    await service.checkpoint();
    const conflict = (await service.pendingConflicts())[0]!;
    assert.ok(conflict);

    await assert.rejects(service.resolveConflict(conflict.id, { action: "supersede",
      evidenceEntryIds: ["user"], reason: "Change retries, retain timeout." }),
    /changed|scope|destination/i);

    assert.equal(changed, true);
    assert.equal(migrationWrites, 0);
    assert.equal((await setup.get(old.id)).is_obsolete, false);
    assert.equal((await queue.getConflict(conflict.id))!.status, "pending");
  });
}

for (const association of ["none", "entity", "late-entity"] as const) {
  test(`ordinary resolution follows explicit empty associations: ${association}`,
    realOptions, async (t) => {
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "0" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Resolution", description: "History guard",
      repo_name: "test/resolution" });
    const old = await setup.create({ ...candidate(), content: "Retry once.",
      project_ids: [project.id] });
    const entity = await setup.knowledge.createEntity({ name: "Worker", entity_type: "System",
      tags: [], aka: [], project_ids: [project.id] });
    if (association === "entity") await setup.knowledge.linkEntityMemory(entity.id, old.id);
    const directory = await mkdtemp(join(tmpdir(), "ordinary-resolution-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const queue = new DurableQueueStore({ directory, instanceId: "links" });
    let created = 0, arrived = false, calls = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/memories")) created++;
      return response;
    } });
    const service = new CaptureService({ queue, client, instanceId: "links",
      getMode: async () => {
        if (association === "late-entity" && created && !arrived) {
          arrived = true;
          await setup.knowledge.linkEntityMemory(entity.id, old.id);
        }
        return "auto" as const;
      }, model: model((name) => {
        calls++;
        if (name === "submit_capture_candidates") return { candidates: [candidate()] };
        if (name === "submit_memory_revision") return { title: "Retry limit",
          content: "Retry twice.", context: "Updated operational rule.",
          keywords: ["retry"], tags: [], importance: 7, sourceEntryIds: ["user"],
          documentIds: [], codeArtifactIds: [], entityIds: [], memoryIds: [], fileIds: [],
          sourceFiles: [] };
        assert.equal(name, "submit_capture_decision");
        return { action: "escalate", conflictingMemoryId: old.id,
          oldClaim: "Retry once", newClaim: "Retry twice", sourceEntryIds: ["user"],
          reason: "Confirm revised rule." };
      }) });
    await service.enqueue(snapshot(project));
    await service.checkpoint();
    const conflict = (await service.pendingConflicts())[0]!;
    const resolving = service.resolveConflict(conflict.id, { action: "supersede",
      evidenceEntryIds: ["user"], reason: "Confirmed." });
    const resolved = await resolving;
    assert.equal(resolved.status, "resolved");
    assert.equal((await setup.get(old.id)).is_obsolete, true);
    assert.deepEqual(await setup.getMemoryEntityIds(resolved.conflict.replacementId!), []);
    assert.deepEqual(await setup.getMemoryEntityIds(old.id),
      association === "none" ? [] : [entity.id]);
    assert.equal(calls, 3);
    assert.equal(created, 1);
    if (association === "late-entity") assert.equal(arrived, true);
  });
}
