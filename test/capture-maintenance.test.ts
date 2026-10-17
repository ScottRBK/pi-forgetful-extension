import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test, { type TestContext } from "node:test";
import { CaptureService, type CaptureCandidate } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const fact = { title: "Temporary workaround", content: "Disable retries until the fix ships.",
  context: "Temporary mitigation", keywords: ["retries"], tags: [], importance: 7 };
const maintenance = { id: "maintenance", kind: "maintenance",
  searchDescription: "Temporary retry workaround", sourceEntryIds: ["user"],
} satisfies CaptureCandidate;
const reason = "The retry fix shipped; the temporary workaround no longer applies.";
function snapshot(project: { id: number; name: string }): CaptureSnapshot {
  return { id: "maintenance", instanceId: "maintenance", mode: "auto", scope: "global",
    policy: "Maintain useful knowledge.", modelVersion: "test", createdAt: new Date().toISOString(),
    finalEntryId: "answer", context: { cwd: "/repo", sessionId: "session", branchId: "branch",
      project }, entries: [{ id: "user", role: "user", text: reason },
      { id: "answer", role: "assistant", text: "Understood." }] };
}
async function fixture(t: TestContext,
  environment: Record<string, string> = { MEMORY_NUM_AUTO_LINK: "0" }) {
  const baseUrl = await startForgetful(t, environment);
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Maintenance", description: "Capture tests",
    repo_name: "test/maintenance" });
  const directory = await mkdtemp(join(tmpdir(), "capture-maintenance-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "maintenance" });
  return { baseUrl, client, project, directory, queue };
}
function retireModel(ids: number[]) {
  return { async complete(request: ModelRequest) {
    const response = request.purpose === "capture" ? { candidates: [maintenance] } :
      { action: "retire", conflictingMemoryIds: ids, reason };
    request.submission.validate(response);
    return response;
  } };
}

test("retirement-only evidence retires selected records without inventing a replacement",
  realOptions, async (t) => {
    // Arrange: two selected historical records and one distinct active record.
    const { client, project, queue } = await fixture(t);
    const old = await client.create({ ...fact, project_ids: [project.id] });
    const second = await client.create({ ...fact, title: "Retry mitigation details",
      project_ids: [project.id] });
    const distinct = await client.create({ ...fact, title: "Retries for another service",
      project_ids: [project.id] });
    await client.knowledge.linkMemories(old.id, [distinct.id]);
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: retireModel([old.id, second.id]) });
    // Act: process and reopen the same durable queue.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    const job = (await queue.getJob(queued.jobId))!;
    const history = await client.get(old.id);
    await new CaptureService({ client, queue, instanceId: "maintenance",
      model: { complete: async () => assert.fail("Completed retirement must not run again") } })
      .checkpoint();
    // Assert through REST and public queue state.
    assert.equal(job.status, "complete", job.lastError);
    assert.equal((job.candidateOutcomes.maintenance as any).stage, "retired");
    assert.equal(history.is_obsolete, true);
    assert.equal((history as any).obsolete_reason, reason);
    assert.equal(history.superseded_by, null);
    assert.equal(history.content, fact.content);
    assert.ok(history.linked_memory_ids?.includes(distinct.id));
    assert.equal((await client.get(second.id)).is_obsolete, true);
    const active = await client.search({ query: "retries", query_context: "Check retirement",
      strict_project_filter: true, project_ids: [project.id], k: 20 });
    assert.deepEqual(active.map((memory) => memory.id), [distinct.id]);
  });

for (const mode of ["observe", "off"] as const) {
  test(`${mode} capture cannot retire existing knowledge`, realOptions, async (t) => {
    // Arrange.
    const { client, project, queue } = await fixture(t);
    const old = await client.create({ ...fact, project_ids: [project.id] });
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      getMode: () => mode, model: retireModel([old.id]) });
    // Act.
    await service.enqueue({ ...snapshot(project), mode });
    await service.checkpoint();
    // Assert.
    assert.equal((await client.get(old.id)).is_obsolete, false);
  });
}

test("retirement cancellation checkpoints receipts and resumes remaining targets after restart",
  realOptions, async (t) => {
    // Arrange: stop immediately after the server accepts the first retirement.
    const { baseUrl, client: api, project, queue, directory } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    const second = await api.create({ ...fact, project_ids: [project.id] });
    const deletes: string[] = [];
    let service: CaptureService;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "DELETE") { deletes.push(String(url)); service.stop(); }
      return response;
    } });
    service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: retireModel([old.id, second.id]) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
    const resumed = new CaptureService({ client: api, queue: reopened, instanceId: "maintenance",
      model: { complete: async () =>
        assert.fail("Resume must use the saved retirement decision") } });
    await resumed.checkpoint();
    // Assert: accepted first write remains complete, and the second target is processed.
    const job = (await reopened.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(deletes.length, 1);
    assert.equal((await api.get(old.id)).is_obsolete, true);
    assert.equal((await api.get(second.id)).is_obsolete, true);
  });

test("ambiguous retirement stays pending across restart and never dispatches another write",
  realOptions, async (t) => {
    // Arrange: server accepted the DELETE, but its reply is lost.
    const { baseUrl, client: api, project, queue, directory } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    let deletes = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "DELETE") { deletes++; throw new Error("retirement reply lost"); }
      return response;
    } });
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: retireModel([old.id]) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
    await new CaptureService({ client, queue: reopened, instanceId: "maintenance",
      model: retireModel([old.id]) }).checkpoint();
    // Assert: local uncertainty survives even though the server knows it committed.
    const job = (await reopened.getJob(queued.jobId))!;
    assert.equal(job.status, "paused");
    assert.match(job.uncertainWrite!, /retirement reply lost/);
    assert.equal(deletes, 1);
    assert.equal((await api.get(old.id)).is_obsolete, true);
  });

const addition = { id: "policy", title: "Dependency policy",
  content: "Add a minimum-version guard for uv.", context: "Adopted safeguard",
  keywords: ["dependencies", "uv"], tags: ["policy"], sourceEntryIds: ["user"] };
const combined = { title: "Dependency policy", content:
  "Use uv for Python dependencies. Audit before upgrading. Require uv >= 0.9.",
  context: "Python dependency changes require the audit and version guard.",
  keywords: ["dependencies", "uv", "audit"], tags: ["policy"], importance: 9 };
function mergeModel(ids: number[], onCompose?: (request: ModelRequest) => void,
  candidate: unknown = addition) {
  return { async complete(request: ModelRequest) {
    let response: unknown;
    if (request.purpose === "capture") response = { candidates: [candidate] };
    else if (request.submission.name === "submit_capture_decision")
      response = { action: "merge", conflictingMemoryIds: ids, reason: "Add the adopted guard." };
    else if (request.submission.name === "submit_capture_merge") {
      onCompose?.(request);
      response = combined;
    } else assert.fail(`Unexpected semantic review: ${request.submission.name}`);
    request.submission.validate(response);
    return response;
  } };
}

test("merge composes full selected contents and preserves every inherited and new connection",
  realOptions, async (t) => {
    // Arrange: inherited counts exceed all automatic review limits; resources are reused.
    const { client, project, queue, baseUrl } = await fixture(t);
    const other = await client.createProject({ name: "Shared", description: "Shared policy",
      repo_name: "test/shared" });
    const docs: number[] = [], artifacts: number[] = [];
    const entities: number[] = [], leads: number[] = [];
    for (let i = 0; i < 10; i++) {
      leads.push((await client.create({ ...fact, title: `Related constraint ${i}`,
        project_ids: [i === 9 ? other.id : project.id] })).id);
      entities.push((await client.knowledge.createEntity({ name: `Component ${i}`,
        entity_type: "System", tags: [], aka: [], project_ids: [project.id] })).id);
      if (i < 6) {
        docs.push((await client.knowledge.createDocument({ title: `Rationale ${i}`,
          description: "Complete rationale", content: `Qualification ${i}`, tags: [],
          project_id: project.id })).id);
        artifacts.push((await client.knowledge.createCodeArtifact({ title: `Guard ${i}`,
          description: "Existing guard", code: `guard(${i})`, language: "python", tags: [],
          project_id: project.id })).id);
      }
    }
    const uploaded = await fetch(`${baseUrl}/files`, { method: "POST",
      headers: { "content-type": "application/json" }, body: JSON.stringify({
        filename: "policy.txt", description: "Existing attachment", mime_type: "text/plain",
        data: Buffer.from("Policy evidence").toString("base64"), tags: [], project_id: project.id,
      }) });
    assert.equal(uploaded.status, 201);
    const fileId = ((await uploaded.json()) as { id: number }).id;
    const old = await client.create({ ...fact, content: "Use uv for Python dependencies.",
      project_ids: [project.id, other.id], document_ids: docs.slice(0, 4),
      code_artifact_ids: artifacts.slice(0, 4), file_ids: [fileId] });
    const second = await client.create({ ...fact, content: "Audit before upgrading.",
      project_ids: [project.id], document_ids: docs.slice(3),
      code_artifact_ids: artifacts.slice(3) });
    await client.knowledge.linkMemories(old.id, [...leads, second.id]);
    for (const id of entities) await client.knowledge.linkEntityMemory(id, old.id);
    const candidate = { ...addition, documents: [{ key: "new-rationale", sourceEntryIds: ["user"],
      input: { title: "Version guard", description: "New guard rationale",
        content: "Prevent unsupported uv versions.", tags: [] } }], entities: [{ key: "new-entity",
      sourceEntryIds: ["user"], input: { name: "Version verifier", entity_type: "System",
        tags: [], aka: [] } }] };
    const model = mergeModel([old.id, second.id], (request) => {
      const targets = (request.input as any).memories;
      assert.deepEqual(targets.map((memory: any) => memory.content),
        ["Use uv for Python dependencies.", "Audit before upgrading."]);
    }, candidate);
    const complete = model.complete;
    model.complete = async (request) => {
      const response: any = await complete(request);
      if (request.submission.name === "submit_capture_decision")
        return { ...response, entityMemoryKeys: ["new-entity"] };
      return response;
    };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model,
      maxModelCalls: 3 });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert through REST: full content and complete unions, with historical originals intact.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const outcome = job.candidateOutcomes.policy as any;
    assert.equal(outcome.stage, "merged");
    const stored = await client.get(outcome.replacementId);
    assert.equal(stored.content, combined.content);
    assert.equal(stored.context, combined.context);
    assert.deepEqual(stored.project_ids, [project.id]);
    assert.deepEqual(stored.file_ids, [fileId]);
    assert.equal(stored.document_ids?.length, 7);
    assert.ok(docs.every((id) => stored.document_ids?.includes(id)));
    assert.deepEqual([...stored.code_artifact_ids!].sort(), [...artifacts].sort());
    assert.ok(leads.every((id) => stored.linked_memory_ids?.includes(id)));
    assert.equal((await client.getMemoryEntityIds(stored.id)).length, 11);
    for (const id of [old.id, second.id]) {
      const history = await client.get(id);
      assert.equal(history.is_obsolete, true);
      assert.equal(history.superseded_by, stored.id);
      assert.equal(history.obsolete_reason, "Add the adopted guard.");
    }
    assert.equal((await client.get(old.id)).content, "Use uv for Python dependencies.");
    assert.ok((await client.get(old.id)).linked_memory_ids?.includes(second.id));
    assert.ok((await client.get(leads[9]!)).is_obsolete === false);
  });

for (const stopAt of ["create", "preservation", "obsolete"] as const) {
  test(`merge resumes after ${stopAt} without regenerating or replaying confirmed writes`,
    realOptions, async (t) => {
      // Arrange: a real server; cancel after a confirmed operation at each public HTTP seam.
      const { baseUrl, client: api, project, queue, directory } = await fixture(t);
      const old = await api.create({ ...fact, content: "Use uv for Python dependencies.",
        project_ids: [project.id] });
      const second = await api.create({ ...fact, content: "Audit before upgrading.",
        project_ids: [project.id] });
      const lead = await api.create({ ...fact, title: "Build constraints",
        project_ids: [project.id] });
      await api.knowledge.linkMemories(old.id, [lead.id]);
      const writes: string[] = [];
      let stopped = false, compositions = 0, service: CaptureService;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (init?.method && ["POST", "PATCH", "PUT", "DELETE"].includes(init.method)) {
          const path = new URL(String(url)).pathname;
          if (!path.endsWith("/search")) writes.push(`${init.method} ${path}`);
          const match = stopAt === "create" ? init.method === "POST" && path.endsWith("/memories")
            : stopAt === "preservation" ? init.method === "POST" && path.endsWith("/links")
            : init.method === "DELETE";
          if (!stopped && match) { stopped = true; service.stop(); }
        }
        return response;
      } });
      const model = mergeModel([old.id, second.id], () => { compositions++; });
      service = new CaptureService({ client, queue, instanceId: "maintenance", model });
      // Act: reopen with a fresh service and disk queue, keeping the external HTTP observer.
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      assert.equal(stopped, true, `Fixture did not stop at ${stopAt}`);
      const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
      await new CaptureService({ client, queue: reopened, instanceId: "maintenance", model })
        .checkpoint();
      // Assert at public queue and REST seams.
      const job = (await reopened.getJob(queued.jobId))!;
      assert.equal(job.status, "complete", job.lastError);
      const replacement = (job.candidateOutcomes.policy as any).replacementId;
      assert.equal(compositions, 1);
      assert.equal(writes.filter((write) => write.endsWith(" /api/v1/memories")).length, 1);
      assert.equal(new Set(writes).size, writes.length, JSON.stringify(writes));
      assert.equal((await api.get(old.id)).superseded_by, replacement);
      assert.equal((await api.get(second.id)).superseded_by, replacement);
      assert.ok((await api.get(replacement)).linked_memory_ids?.includes(lead.id));
    });
}

for (const invalid of ["out-of-scope", "obsolete"] as const) {
  const behavior = invalid === "obsolete" ? "retains only on historical originals"
    : "rejects before retiring predecessors";
  test(`merge ${behavior}: ${invalid} inherited connection`,
    realOptions, async (t) => {
      // Arrange: selected predecessors have a foreign or historical connection.
      const { client, project, queue } = await fixture(t);
      const other = await client.createProject({ name: "Other", description: "Separate project",
        repo_name: "test/other" });
      const lead = await client.create({ ...fact,
        project_ids: [invalid === "out-of-scope" ? other.id : project.id] });
      const old = await client.create({ ...fact, project_ids: [project.id] });
      await client.knowledge.linkMemories(old.id, [lead.id]);
      if (invalid === "obsolete") await client.obsolete(lead.id, "Historical constraint removed");
      const service = new CaptureService({ client, queue, instanceId: "maintenance",
        model: mergeModel([old.id]) });
      // Act.
      const queued = await service.enqueue({ ...snapshot(project), scope: "project" });
      const result = await service.checkpoint();
      // Assert: only obsolete connections stay historical; active foreign links block the merge.
      const job = (await queue.getJob(queued.jobId))!;
      if (invalid === "obsolete") {
        assert.equal(job.status, "complete", job.lastError);
        assert.ok((await client.get(old.id)).linked_memory_ids?.includes(lead.id));
        const replacement = await client.get((job.candidateOutcomes.policy as any).replacementId);
        assert.ok(!replacement.linked_memory_ids?.includes(lead.id));
        return;
      }
      assert.equal(job.status, "pending");
      assert.match(result.errors.join("\n"), /Cannot preserve merge connection/);
      assert.equal((await client.get(old.id)).is_obsolete, false);
    });
}

test("merge composition rejects malformed submission before any replacement is created",
  realOptions, async (t) => {
    // Arrange.
    const { client, project, queue } = await fixture(t);
    const old = await client.create({ ...fact, project_ids: [project.id] });
    const model = mergeModel([old.id]);
    const complete = model.complete;
    model.complete = async (request) => request.submission.name === "submit_capture_merge"
      ? { content: "incomplete replacement" } : complete(request);
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "pending");
    assert.match(job.lastError!, /complete combined memory fields/);
    assert.equal((await client.get(old.id)).is_obsolete, false);
    assert.equal((job.candidateOutcomes.policy as any).creation, undefined);
  });

for (const action of ["retire", "merge"] as const) {
  test(`${action} passes original server rejection to correction and preserves confirmed progress`,
    realOptions, async (t) => {
      // Arrange: a definitely rejected retirement; another target succeeds first.
      const { baseUrl, client: api, project, queue, directory } = await fixture(t);
      const old = await api.create({ ...fact, project_ids: [project.id] });
      const second = await api.create({ ...fact, project_ids: [project.id] });
      let rejected = false, correctionError = "";
      const deletes: number[] = [];
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        const id = Number(new URL(String(url)).pathname.split("/").at(-1));
        if (init?.method === "DELETE") {
          deletes.push(id);
          if (id === second.id && !rejected) {
            rejected = true;
            return new Response('{"detail":"selected target rejected by server"}', { status: 422 });
          }
        }
        return fetch(url, init);
      } });
      const model = action === "retire" ? retireModel([old.id, second.id])
        : mergeModel([old.id, second.id]);
      const complete = model.complete;
      model.complete = async (request) => {
        if (request.submission.name === "submit_capture_correction") {
          correctionError = (request.input as any).outcome.executionFailure;
          // A changed target selection cannot discard completed writes.
          return { candidate: (request.input as any).candidate,
            decision: { action: "skip", reason: "Do not create anything else." } };
        }
        return complete(request);
      };
      const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
      // Act: restart after the rejected second target, retaining the first receipt.
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
      await new CaptureService({ client, queue: reopened, instanceId: "maintenance", model })
        .checkpoint();
      // Assert: the original service body reaches correction, and completed work is not replayed.
      const job = (await reopened.getJob(queued.jobId))!;
      assert.match(correctionError, /selected target rejected by server/);
      assert.equal(job.status, "complete", job.lastError);
      assert.deepEqual(deletes, [old.id, second.id, second.id]);
      assert.equal((await api.get(second.id)).is_obsolete, true);
    });
}

for (const failure of ["preservation", "obsolete"] as const) {
  test(`an ambiguous merge ${failure} is never replayed after reopening the queue`, realOptions,
    async (t) => {
      // Arrange: accept a mutation at the real server, then lose its response.
      const { baseUrl, client: api, project, queue, directory } = await fixture(t);
      const old = await api.create({ ...fact, project_ids: [project.id] });
      const lead = await api.create({ ...fact, project_ids: [project.id] });
      await api.knowledge.linkMemories(old.id, [lead.id]);
      let failed = 0;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        const matches = failure === "preservation"
          ? init?.method === "POST" && String(url).endsWith("/links") : init?.method === "DELETE";
        if (matches) { failed++; throw new Error(`${failure} response lost`); }
        return response;
      } });
      const service = new CaptureService({ client, queue, instanceId: "maintenance",
        model: mergeModel([old.id]) });
      // Act.
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
      await new CaptureService({ client, queue: reopened, instanceId: "maintenance",
        model: { complete: async () =>
          assert.fail("Unknown write cannot authorize another model") } })
        .checkpoint();
      // Assert.
      const job = (await reopened.getJob(queued.jobId))!;
      assert.equal(job.status, "paused");
      assert.match(job.uncertainWrite!, new RegExp(`${failure} response lost`));
      assert.equal(failed, 1);
      assert.equal((await api.get(old.id)).is_obsolete, failure === "obsolete");
    });
}

test("merge preserves connections added to a predecessor while preservation is running",
  realOptions, async (t) => {
    // Arrange: another client adds a connection after the first inherited edge is accepted.
    const { baseUrl, client: api, project, queue } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    const first = await api.create({ ...fact, project_ids: [project.id] });
    const late = await api.create({ ...fact, project_ids: [project.id] });
    await api.knowledge.linkMemories(old.id, [first.id]);
    let added = false;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (!added && init?.method === "POST" && String(url).endsWith("/links")) {
        added = true;
        await api.knowledge.linkMemories(old.id, [late.id]);
      }
      return response;
    } });
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: mergeModel([old.id]) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert: all inherited links survive, including concurrent additions observed before retire.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const replacement = await api.get((job.candidateOutcomes.policy as any).replacementId);
    assert.ok(replacement.linked_memory_ids?.includes(late.id));
    assert.equal((await api.get(old.id)).is_obsolete, true);
  });

for (const change of ["scope", "obsolete"] as const) {
  test(`retirement rechecks ${change} at its final authorization read`, realOptions, async (t) => {
    // Arrange: another client changes the target between selection and final authorization.
    const { baseUrl, client: api, project, queue } = await fixture(t);
    const other = await api.createProject({ name: "Other", description: "Other ownership",
      repo_name: "test/other" });
    const old = await api.create({ ...fact, project_ids: [project.id] });
    let selected = false, changed = false, selectedReads = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (selected && !changed && init?.method === "GET" && String(url).endsWith(`/${old.id}`) &&
          ++selectedReads === 2) {
        changed = true;
        if (change === "scope") await api.knowledge.updateMemory(old.id,
          { project_ids: [other.id] });
        else await api.obsolete(old.id, "Another client retired this record.");
      }
      return response;
    } });
    const model = retireModel([old.id]);
    const complete = model.complete;
    model.complete = async (request) => {
      const response = await complete(request);
      if (request.submission.name === "submit_capture_decision") selected = true;
      return response;
    };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    // Act.
    const queued = await service.enqueue({ ...snapshot(project), scope: "project" });
    await service.checkpoint();
    // Assert: scope/active checks apply immediately before dispatch, preserving the other write.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "pending");
    const stored = await api.get(old.id);
    if (change === "scope") assert.equal(stored.is_obsolete, false);
    else assert.equal(stored.obsolete_reason, "Another client retired this record.");
  });
}

test("merge rechecks preserved endpoint scope after cancellation before retiring predecessors",
  realOptions, async (t) => {
    // Arrange: preserve an edge, cancel, then a different client moves that endpoint.
    const { baseUrl, client: api, project, queue, directory } = await fixture(t);
    const other = await api.createProject({ name: "Other", description: "Other scope",
      repo_name: "test/other" });
    const old = await api.create({ ...fact, project_ids: [project.id] });
    const lead = await api.create({ ...fact, project_ids: [project.id] });
    await api.knowledge.linkMemories(old.id, [lead.id]);
    let service: CaptureService;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/links")) service.stop();
      return response;
    } });
    service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: mergeModel([old.id]) });
    const queued = await service.enqueue({ ...snapshot(project), scope: "project" });
    await service.checkpoint();
    await api.knowledge.updateMemory(lead.id, { project_ids: [other.id] });
    // Act: completed edge receipts must not bypass the configured scope on resume.
    const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
    await new CaptureService({ client: api, queue: reopened, instanceId: "maintenance",
      model: mergeModel([old.id]) }).checkpoint();
    // Assert: the old record remains useful while its connection cannot be carried forward.
    const job = (await reopened.getJob(queued.jobId))!;
    assert.equal(job.status, "pending");
    assert.match(job.lastError!, /Cannot preserve merge connection/);
    assert.equal((await api.get(old.id)).is_obsolete, false);
  });

for (const remove of [false, true]) {
  test(`merge retains requested resources without replaying writes: removed=${remove}`,
    realOptions, async (t) => {
      // Arrange: a new requested document is attached before inherited preservation starts.
      const { baseUrl, client: api, project, queue, directory } = await fixture(t);
      const old = await api.create({ ...fact, project_ids: [project.id] });
      const candidate = { ...addition, documents: [{ key: "new-rationale",
        sourceEntryIds: ["user"], input: { title: "New safeguard", description: "New rationale",
          content: "Preserve the adopted guard rationale.", tags: [] } }] };
      let updates = 0, service: CaptureService;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (init?.method === "PUT" && /\/memories\/\d+$/.test(String(url))) {
          updates++;
          if (remove) service.stop();
        }
        return response;
      } });
      const model = mergeModel([old.id], undefined, candidate);
      service = new CaptureService({ client, queue, instanceId: "maintenance", model });
      const queued = await service.enqueue(snapshot(project));
      await service.checkpoint();
      // Act: after cancellation, another client removes the requested attachment.
      if (remove) {
        const pending = (await queue.getJob(queued.jobId))!;
        const id = (pending.candidateOutcomes.policy as any).replacementId;
        await api.knowledge.updateMemory(id, { document_ids: [] });
        const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
        await new CaptureService({ client, queue: reopened, instanceId: "maintenance", model })
          .checkpoint();
      }
      // Assert: completed writes are historical receipts, never a permission to silently repair.
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(updates, 1, "The completed attachment operation is never repeated");
      assert.equal(job.status, remove ? "pending" : "complete", job.lastError);
      assert.equal((await api.get(old.id)).is_obsolete, !remove);
      if (remove) assert.match(job.lastError!, /missing requested document/);
    });
}

for (const action of ["retire", "merge"] as const) {
  for (const receiptDelay of [25, 750]) {
    test(`${action} shutdown retains accepted receipts within the 500 ms grace: ${receiptDelay} ms`,
      realOptions, async (t) => {
        // Arrange: the real server accepts DELETE; only its response is delayed across shutdown.
        const { baseUrl, client: api, project, queue, directory } = await fixture(t);
        const old = await api.create({ ...fact, project_ids: [project.id] });
        let deletes = 0, service: CaptureService;
        const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
          const response = await fetch(url, init);
          if (init?.method === "DELETE") {
            deletes++;
            service.stop();
            await delay(receiptDelay, undefined, { signal: init.signal ?? undefined });
          }
          return response;
        } });
        const model = action === "retire" ? retireModel([old.id]) : mergeModel([old.id]);
        service = new CaptureService({ client, queue, instanceId: "maintenance", model });
        // Act: reopen the durable queue, without allowing replay of uncertain writes.
        const queued = await service.enqueue(snapshot(project));
        await service.checkpoint();
        const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
        await new CaptureService({ client: api, queue: reopened, instanceId: "maintenance",
          model: { complete: async () =>
            assert.fail("Shutdown receipts cannot generate new work") } })
          .checkpoint();
        // Assert: confirmed short responses settle; responses beyond grace remain uncertain.
        const job = (await reopened.getJob(queued.jobId))!;
        assert.equal(job.status, receiptDelay < 500 ? "complete" : "paused", job.lastError);
        assert.equal(Boolean(job.uncertainWrite), receiptDelay > 500);
        assert.equal(deletes, 1);
        assert.equal((await api.get(old.id)).is_obsolete, true);
      });
  }
}

test("another candidate's completed retirement does not freeze a rejected merge correction",
  realOptions, async (t) => {
    // Arrange: one retirement succeeds before a separate merge receives a server rejection.
    const { client, project, queue } = await fixture(t);
    const retired = await client.create({ ...fact, project_ids: [project.id] });
    const mergeTarget = await client.create({ ...fact, project_ids: [project.id] });
    let corrections = 0;
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model: {
      async complete(request) {
        let response: unknown;
        switch (request.submission.name) {
          case "submit_capture_candidates":
            response = { candidates: [maintenance, addition] };
            break;
          case "submit_capture_decisions":
            response = { decisions: [
              { candidateId: maintenance.id, action: "retire",
                conflictingMemoryIds: [retired.id], reason },
              { candidateId: addition.id, action: "merge",
                conflictingMemoryIds: [mergeTarget.id], reason },
            ] };
            break;
          case "submit_capture_merge":
            response = { ...combined, content: 123 };
            break;
          case "submit_capture_correction":
            corrections++;
            response = { candidate: addition,
              decision: { action: "skip", reason: "Do not store the rejected proposal." } };
            break;
          default:
            assert.fail(`Unexpected private tool ${request.submission.name}`);
        }
        request.submission.validate(response);
        return response;
      },
    } });

    // Act: the correction belongs only to the candidate whose write was rejected.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    await service.checkpoint();

    // Assert: the earlier receipt cannot force another attempt of the rejected merge payload.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(corrections, 1);
    assert.equal((job.candidateOutcomes.policy as { stage: string }).stage, "skipped");
    assert.equal((await client.get(retired.id)).is_obsolete, true);
    assert.equal((await client.get(mergeTarget.id)).is_obsolete, false);
  });

test("successive merges with production auto-linking preserve active knowledge and history",
  realOptions, async (t) => {
    // Arrange: default MEMORY_NUM_AUTO_LINK=3, including automatic ancestor links on replacements.
    const { client, project, queue } = await fixture(t, {});
    const a = await client.create({ ...fact, project_ids: [project.id] });
    const b = await client.create({ ...fact, project_ids: [project.id] });
    const lead = await client.create({ ...fact, title: "Active supporting policy",
      project_ids: [project.id] });
    const ids = [a.id, b.id];
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: mergeModel(ids) });
    const first = await service.enqueue(snapshot(project));
    await service.checkpoint();
    const firstJob = (await queue.getJob(first.jobId))!;
    assert.equal(firstJob.status, "complete", firstJob.lastError);
    const r1 = (firstJob.candidateOutcomes.policy as any).replacementId as number;
    assert.ok((await client.get(r1)).linked_memory_ids?.includes(a.id));
    ids.splice(0, ids.length, r1);
    // Act: refine the already merged memory in a separate settled conversation.
    const second = await service.enqueue({ ...snapshot(project), id: "second-merge",
      context: { ...snapshot(project).context, sessionId: "second-session" } });
    await service.checkpoint();
    // Assert: only the latest replacement and distinct supporting memory remain active.
    const job = (await queue.getJob(second.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const r2 = (job.candidateOutcomes.policy as any).replacementId as number;
    const active = await client.search({ query: "policy", query_context: "Read current state",
      strict_project_filter: true, project_ids: [project.id], k: 20 });
    assert.deepEqual(active.map((memory) => memory.id).sort(), [lead.id, r2].sort());
    assert.ok((await client.get(r2)).linked_memory_ids?.includes(lead.id));
    assert.equal((await client.get(r1)).superseded_by, r2);
    assert.ok((await client.get(r1)).linked_memory_ids?.includes(a.id));
    assert.ok((await client.get(a.id)).linked_memory_ids?.includes(b.id));
  });

for (const endpoint of ["foreign-memory", "missing-memory", "foreign-target", "missing-target",
  "projectless-document", "foreign-document", "missing-document", "projectless-entity",
  "foreign-entity", "missing-entity", "projectless-artifact", "foreign-artifact",
  "missing-artifact",
  "projectless-file", "foreign-file", "missing-file"] as const) {
  test(`merge preflights inherited ${endpoint} before creating any replacement`, realOptions,
    async (t) => {
      // Arrange: real stored resources, or a dangling source reference returned by the REST seam.
      const { client: api, baseUrl, project, queue } = await fixture(t);
      const old = await api.create({ ...fact, project_ids: [project.id] });
      const targets = [old.id];
      const other = await api.createProject({ name: "Other", description: "Other scope",
        repo_name: "test/other" });
      if (endpoint === "foreign-memory") {
        const lead = await api.create({ ...fact, project_ids: [other.id] });
        await api.knowledge.linkMemories(old.id, [lead.id]);
      }
      if (endpoint === "foreign-target")
        targets.push((await api.create({ ...fact, project_ids: [other.id] })).id);
      if (endpoint === "missing-target") targets.push(999999);
      if (endpoint === "projectless-document" || endpoint === "foreign-document") {
        const doc = await api.knowledge.createDocument({ title: "Global rationale",
          description: "Scoped rationale", content: "Shared policy", tags: [],
          ...(endpoint === "foreign-document" ? { project_id: other.id } : {}) });
        await api.knowledge.updateMemory(old.id, { document_ids: [doc.id] });
      }
      if (endpoint === "projectless-artifact" || endpoint === "foreign-artifact") {
        const artifact = await api.knowledge.createCodeArtifact({ title: "Existing guard",
          description: "Scoped guard", code: "guard()", language: "python", tags: [],
          ...(endpoint === "foreign-artifact" ? { project_id: other.id } : {}) });
        await api.knowledge.updateMemory(old.id, { code_artifact_ids: [artifact.id] });
      }
      if (endpoint === "projectless-file" || endpoint === "foreign-file") {
        const response = await fetch(`${baseUrl}/files`, { method: "POST",
          headers: { "content-type": "application/json" }, body: JSON.stringify({
            filename: "policy.txt", description: "Existing attachment", mime_type: "text/plain",
            data: Buffer.from("Policy evidence").toString("base64"), tags: [],
            ...(endpoint === "foreign-file" ? { project_id: other.id } : {}),
          }) });
        assert.equal(response.status, 201);
        const file = await response.json() as { id: number };
        await api.knowledge.updateMemory(old.id, { file_ids: [file.id] });
      }
      if (endpoint === "projectless-entity" || endpoint === "foreign-entity") {
        const entity = await api.knowledge.createEntity({ name: "Component", entity_type: "System",
          tags: [], aka: [], project_ids: endpoint === "foreign-entity" ? [other.id] : [] });
        await api.knowledge.linkEntityMemory(entity.id, old.id);
      }
      let creates = 0;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
        const response = await fetch(url, init);
        if (endpoint === "missing-entity" && init?.method === "GET" &&
            new URL(String(url)).pathname.endsWith(`/graph/memory/${old.id}`))
          return Response.json({ center_memory_id: old.id, edges: [{ type: "entity_memory",
            source: `memory_${old.id}`, target: "entity_999999" }] });
        if (init?.method === "GET" && String(url).endsWith(`/memories/${old.id}`)) {
          const fields: Record<string, string> = { "missing-memory": "linked_memory_ids",
            "missing-document": "document_ids", "missing-artifact": "code_artifact_ids",
            "missing-file": "file_ids" };
          const field = fields[endpoint];
          if (field) return Response.json({ ...await response.json(), [field]: [999999] });
        }
        return response;
      } });
      const service = new CaptureService({ client, queue, instanceId: "maintenance",
        model: mergeModel(targets) });
      // Act.
      const queued = await service.enqueue({ ...snapshot(project), scope: "project" });
      const result = await service.checkpoint();
      // Assert: deterministic invalid endpoints cannot leave a duplicate active replacement.
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(job.status, "pending");
      assert.ok(result.errors.length > 0);
      assert.equal(creates, 0);
      const active = await api.search({ query: "policy", query_context: "Check preflight",
        strict_project_filter: true, project_ids: [project.id], k: 20 });
      assert.deepEqual(active.map((memory) => memory.id), [old.id]);
    });
}

test("merge rechecks inherited scope after composition before creating a replacement",
  realOptions, async (t) => {
    // Arrange: the composing model finishes while another writer adds a foreign connection.
    const { client: api, baseUrl, project, queue } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    const foreign = await api.createProject({ name: "Other", description: "Separate project",
      repo_name: "test/other" });
    const lead = await api.create({ ...fact, project_ids: [foreign.id] });
    let creates = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
      return fetch(url, init);
    } });
    const initial = mergeModel([old.id]);
    const model = { async complete(request: ModelRequest) {
      const response = await initial.complete(request);
      if (request.submission.name === "submit_capture_merge")
        await api.knowledge.linkMemories(old.id, [lead.id]);
      return response;
    } };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    // Act.
    await service.enqueue({ ...snapshot(project), scope: "project" });
    const result = await service.checkpoint();
    // Assert: the final pre-create read detects the new invalid endpoint without duplicating.
    assert.match(result.errors.join("\n"), /Cannot preserve merge connection/);
    assert.equal(creates, 0);
    const active = await api.search({ query: "policy", query_context: "Check latest references",
      strict_project_filter: true, project_ids: [project.id], k: 20 });
    assert.deepEqual(active.map((memory) => memory.id), [old.id]);
    assert.ok((await api.get(old.id)).linked_memory_ids?.includes(lead.id));
  });

test("retirement preflights every target and corrects an invalid selection without partial deletes",
  realOptions, async (t) => {
    // Arrange: the second selected target is missing; the first is valid and active.
    const { client: api, baseUrl, project, queue } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    let deletes = 0, originalBody = "", correction = "";
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE") deletes++;
      const response = await fetch(url, init);
      if (response.status === 404) originalBody = await response.clone().text();
      return response;
    } });
    const initial = retireModel([old.id, 999999]);
    const model = { async complete(request: ModelRequest) {
      if (request.submission.name !== "submit_capture_correction") return initial.complete(request);
      correction = (request.input as any).outcome.executionFailure;
      const response = { candidate: maintenance,
        decision: { action: "retire", conflictingMemoryIds: [old.id], reason } };
      request.submission.validate(response);
      return response;
    } };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    // Act: fail the deterministic preflight, then correct the selected targets.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    assert.equal(deletes, 0, "Every target must be preflighted before the first DELETE");
    assert.equal((await api.get(old.id)).is_obsolete, false);
    await service.checkpoint();
    // Assert: exact server error reaches correction; the valid target can then retire.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.match(correction, /HTTP 404/);
    assert.ok(correction.includes(originalBody));
    assert.equal(deletes, 1);
    assert.equal((await api.get(old.id)).is_obsolete, true);
  });

test("a rejected composed merge is corrected from the original server error without recomposition",
  realOptions, async (t) => {
    // Arrange: Forgetful owns the 2000-character limit; the composed payload exceeds it.
    const { client: api, baseUrl, project, queue } = await fixture(t);
    const old = await api.create({ ...fact, project_ids: [project.id] });
    let compositions = 0, corrections = 0, originalBody = "", receivedError = "";
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      const response = await fetch(url, init);
      if (init?.method === "POST" && String(url).endsWith("/memories") && !response.ok)
        originalBody = await response.clone().text();
      return response;
    } });
    const initial = mergeModel([old.id]);
    const model = { async complete(request: ModelRequest): Promise<unknown> {
      if (request.submission.name === "submit_capture_merge") {
        compositions++;
        return { ...combined, content: "x".repeat(2500) };
      }
      if (request.submission.name === "submit_capture_correction") {
        corrections++;
        const input = request.input as any;
        receivedError = input.outcome.executionFailure;
        assert.equal(input.candidate.content.length, 2500,
          "Correction must receive the actual rejected complete composition");
        const response = { candidate: { ...input.candidate, content: combined.content } };
        request.submission.validate(response);
        return response;
      }
      return initial.complete(request);
    } };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    // Act: the next normal attempt corrects the saved composition, then creates it once.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    await service.checkpoint();
    // Assert: exact service feedback funds a real field correction, not blind recomposition.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(compositions, 1);
    assert.equal(corrections, 1);
    assert.ok(receivedError.includes(originalBody));
    assert.match(receivedError, /2000/);
    const replacement = await api.get((job.candidateOutcomes.policy as any).replacementId);
    assert.equal(replacement.content, combined.content);
    assert.equal((await api.get(old.id)).superseded_by, replacement.id);
  });

test("batched merges defer composition budgets as progress across cancellation and restart",
  realOptions, async (t) => {
    // Arrange: four selected merges share a three-task allowance in each normal worker pass.
    const { client, project, queue, directory } = await fixture(t);
    const candidates = Array.from({ length: 4 }, (_, i) => ({ ...addition, id: `policy-${i}` }));
    const ids: number[] = [];
    for (const candidate of candidates)
      ids.push((await client.create({ ...fact, title: candidate.id,
        project_ids: [project.id] })).id);
    let selections = 0, compositions = 0;
    const model = { async complete(request: ModelRequest): Promise<unknown> {
      let response: unknown;
      if (request.submission.name === "submit_capture_candidates") response = { candidates };
      else if (request.submission.name === "submit_capture_decisions") {
        selections++;
        response = { decisions: candidates.map((candidate, i) => ({ candidateId: candidate.id,
          action: "merge", conflictingMemoryIds: [ids[i]], reason: "Adopted refinement" })) };
      } else if (request.submission.name === "submit_capture_merge") {
        compositions++;
        response = combined;
      } else assert.fail(`Budget progress must not ask for ${request.submission.name}`);
      request.submission.validate(response);
      return response;
    } };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model,
      maxModelCalls: 3 });
    const queued = await service.enqueue(snapshot(project));
    // Act: yield at the budget, then cancel and reopen the normal durable worker.
    const first = await service.checkpoint();
    const progress = (await queue.getJob(queued.jobId))!;
    assert.deepEqual(first.errors, []);
    assert.equal(first.continuation, "ready");
    assert.equal(progress.attempts, 0, "Progress must not consume a failure attempt");
    assert.equal(progress.status, "pending");
    assert.ok(Object.values(progress.candidateOutcomes).every((outcome: any) =>
      !outcome.executionFailure));
    service.stop();
    const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
    const next = await new CaptureService({ client, queue: reopened, instanceId: "maintenance",
      model, maxModelCalls: 3 }).checkpoint();
    // Assert: no new selections/corrections; confirmed writes and composition work resume normally.
    const job = (await reopened.getJob(queued.jobId))!;
    assert.deepEqual(next.errors, []);
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.attempts, 1);
    assert.equal(selections, 1);
    assert.equal(compositions, 4);
    for (const id of ids) assert.equal((await client.get(id)).is_obsolete, true);
  });

test("mixed create and merges yield an unfunded link review without consuming failure attempts",
  realOptions, async (t) => {
    // Arrange: extraction, selection and two compositions exhaust the default four calls.
    const { baseUrl, client: api, project, queue, directory } = await fixture(t);
    const candidates = ["new-policy", "merge-one", "merge-two"]
      .map((id) => ({ ...addition, id }));
    const oldIds: number[] = [];
    for (const title of ["First policy", "Second policy"])
      oldIds.push((await api.create({ ...fact, title, project_ids: [project.id] })).id);
    let creates = 0, retirements = 0;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "POST" && String(url) === `${baseUrl}/memories`) creates++;
      if (init?.method === "DELETE") retirements++;
      return fetch(url, init);
    } });
    const tasks: string[] = [];
    const model = { async complete(request: ModelRequest): Promise<unknown> {
      tasks.push(request.submission.name);
      let response: unknown;
      if (request.submission.name === "submit_capture_candidates") response = { candidates };
      else if (request.submission.name === "submit_capture_decisions")
        response = { decisions: candidates.map((candidate, i) => ({ candidateId: candidate.id,
          action: i === 0 ? "create" : "merge",
          ...(i === 0 ? {} : { conflictingMemoryIds: [oldIds[i - 1]],
            reason: "Adopted refinement" }) })) };
      else if (request.submission.name === "submit_capture_merge") response = combined;
      else if (request.submission.name === "submit_capture_links") {
        const input = request.input as { candidates: Array<{ candidateId: string;
          memories: Array<{ id: number }> }> };
        assert.deepEqual(input.candidates.map((item) => item.candidateId), ["new-policy"]);
        assert.equal(input.candidates[0]!.memories.length, 2);
        response = { reviews: input.candidates.map((item) => ({ candidateId: item.candidateId,
          decisions: item.memories.map((memory) => ({ memoryId: memory.id, action: "add",
            reason: "Related dependency policies" })) })) };
      } else assert.fail(`Unexpected task: ${request.submission.name}`);
      request.submission.validate(response);
      return response;
    } };
    const service = new CaptureService({ client, queue, instanceId: "maintenance", model });
    const queued = await service.enqueue(snapshot(project));

    // Act: yield after all accepted writes, stop, then reopen the durable worker.
    const first = await service.checkpoint();
    const progress = (await queue.getJob(queued.jobId))!;
    assert.deepEqual(first.errors, []);
    assert.equal(first.continuation, "ready");
    assert.equal(progress.status, "pending");
    assert.equal(progress.attempts, 0, "Budget progress must not consume a failure attempt");
    assert.equal(progress.callCount, 0, "The next pass must have a funded link review");
    assert.equal(progress.lastError, undefined);
    assert.equal(creates, 3);
    assert.equal(retirements, 2);
    assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decisions",
      "submit_capture_merge", "submit_capture_merge"]);
    const outcomes = progress.candidateOutcomes as Record<string, any>;
    assert.equal(outcomes["new-policy"].stage, "links-pending");
    assert.equal(outcomes["new-policy"].linkReview.status, "pending");
    const createdId = outcomes["new-policy"].memoryId as number;
    const replacements = [outcomes["merge-one"].replacementId,
      outcomes["merge-two"].replacementId] as number[];
    for (const id of ["merge-one", "merge-two"]) {
      assert.equal(outcomes[id].stage, "merged");
      assert.equal(outcomes[id].decision.action, "merge");
      assert.ok(outcomes[id].mergePlan);
    }
    assert.ok(Object.values(outcomes).every((outcome) => !outcome.executionFailure));
    service.stop();
    const reopened = new DurableQueueStore({ directory, instanceId: "maintenance" });
    const next = await new CaptureService({ client, queue: reopened, instanceId: "maintenance",
      model }).checkpoint();

    // Assert: only link review runs after restart; accepted creates and retirements are retained.
    const job = (await reopened.getJob(queued.jobId))!;
    assert.deepEqual(next.errors, []);
    assert.equal(job.status, "complete", job.lastError);
    assert.equal(job.attempts, 1);
    assert.equal(job.callCount, 1);
    assert.equal(creates, 3);
    assert.equal(retirements, 2);
    assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decisions",
      "submit_capture_merge", "submit_capture_merge", "submit_capture_links"]);
    assert.equal((job.candidateOutcomes["new-policy"] as any).memoryId, createdId);
    assert.deepEqual((await api.get(createdId)).linked_memory_ids?.toSorted(),
      replacements.toSorted());
    for (const [index, id] of oldIds.entries()) {
      const old = await api.get(id);
      assert.equal(old.is_obsolete, true);
      assert.equal(old.superseded_by, replacements[index]);
      assert.equal((await api.get(replacements[index]!)).content, combined.content);
    }
  });

for (const action of ["create", "supersede"] as const) {
  for (const maxModelCalls of [4, 1]) {
    test(`two merges then ${action} resume without failures or replay at budget ${maxModelCalls}`,
      realOptions, async (t) => {
        // Arrange: two compositions consume the default allowance before the final action.
        const { baseUrl, client: api, project, directory } = await fixture(t);
        const candidates = ["merge-one", "merge-two", "last"]
          .map((id) => ({ ...addition, id }));
        const originals: number[] = [];
        for (const title of ["First policy", "Second policy", "Prior last policy"])
          originals.push((await api.create({ ...fact, title, project_ids: [project.id] })).id);
        let creates = 0, deletes = 0;
        const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
          if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
          if (init?.method === "DELETE") deletes++;
          return fetch(url, init);
        } });
        const tasks: string[] = [];
        const decisions = candidates.map((candidate, i) => ({ candidateId: candidate.id,
          action: i < 2 ? "merge" : action,
          ...(i < 2 || action === "supersede" ? { conflictingMemoryIds: [originals[i]],
            reason: "Adopted policy change" } : {}) }));
        const model = { async complete(request: ModelRequest): Promise<unknown> {
          tasks.push(request.submission.name);
          let response: unknown;
          if (request.submission.name === "submit_capture_candidates") response = { candidates };
          else if (request.submission.name === "submit_capture_decisions")
            response = { decisions };
          else if (request.submission.name === "submit_capture_merge") response = combined;
          else if (request.submission.name === "submit_capture_links") {
            const items = (request.input as any).candidates;
            response = { reviews: items.map((item: any) => ({ candidateId: item.candidateId,
              decisions: item.memories.map((memory: any) => ({ memoryId: memory.id,
                action: "add", reason: "Related policy" })),
              ...(item.previous ? { preservation: { documentIds: [], codeArtifactIds: [],
                entityIds: [] } } : {}) })) };
          } else assert.fail(`Budget exhaustion must not request ${request.submission.name}`);
          request.submission.validate(response);
          return response;
        } };
        let queue = new DurableQueueStore({ directory, instanceId: "maintenance" });
        let service = new CaptureService({ client, queue, instanceId: "maintenance", model,
          ...(maxModelCalls === 4 ? {} : { maxModelCalls }) });
        const queued = await service.enqueue(snapshot(project));
        const savedReplacements = new Map<string, number>();

        // Act: reopen after every yield, bounding passes so a starved continuation cannot pass.
        const passes = maxModelCalls === 4 ? 2 : 5;
        for (let pass = 1; pass <= passes; pass++) {
          const result = await service.checkpoint();
          const job = (await queue.getJob(queued.jobId))!;
          assert.deepEqual(result.errors, []);
          assert.equal(job.attempts, pass === passes ? 1 : 0);
          assert.equal(job.status, pass === passes ? "complete" : "pending", job.lastError);
          assert.ok(Object.values(job.candidateOutcomes).every((outcome: any) =>
            !outcome.executionFailure));
          for (const id of ["merge-one", "merge-two"]) {
            const outcome = job.candidateOutcomes[id] as any;
            if (outcome.stage !== "merged") continue;
            if (savedReplacements.has(id))
              assert.equal(outcome.replacementId, savedReplacements.get(id));
            savedReplacements.set(id, outcome.replacementId);
          }
          if (pass === passes) break;
          assert.equal(result.continuation, "ready");
          assert.equal(job.callCount, 0);
          assert.equal(tasks.length, maxModelCalls === 4 ? 4 : pass);
          if (maxModelCalls === 4 || pass === 4) {
            assert.equal(creates, 2);
            assert.equal(deletes, 2);
            const last = job.candidateOutcomes.last as any;
            assert.equal(last.stage, "decided");
            assert.equal(last.decision.action, action);
          }
          service.stop();
          queue = new DurableQueueStore({ directory, instanceId: "maintenance" });
          service = new CaptureService({ client, queue, instanceId: "maintenance", model,
            maxModelCalls });
        }

        // Assert: saved choices and accepted writes survive; only the pending work runs.
        const job = (await queue.getJob(queued.jobId))!;
        assert.equal(creates, 3);
        assert.equal(deletes, action === "supersede" ? 3 : 2);
        assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decisions",
          "submit_capture_merge", "submit_capture_merge", "submit_capture_links"]);
        assert.equal(savedReplacements.size, 2);
        for (const [index, id] of ["merge-one", "merge-two"].entries()) {
          const replacementId = savedReplacements.get(id)!;
          assert.equal((await api.get(originals[index]!)).superseded_by, replacementId);
          assert.equal((await api.get(replacementId)).content, combined.content);
        }
        const last = job.candidateOutcomes.last as any;
        assert.equal(last.action, action);
        assert.equal((await api.get(last.memoryId ?? last.replacementId)).content,
          addition.content);
        assert.equal((await api.get(originals[2]!)).is_obsolete, action === "supersede");
      });
  }
}

test("a zero configured budget completes single-candidate capture in one-call passes",
  realOptions, async (t) => {
    // Arrange: zero is clamped to one; every stage must remain fundable without a reservation.
    const { client, project, queue } = await fixture(t);
    await client.create({ ...fact, project_ids: [project.id] });
    const tasks: string[] = [];
    const service = new CaptureService({ client, queue, instanceId: "maintenance", maxModelCalls: 0,
      model: { async complete(request) {
        tasks.push(request.submission.name);
        if (request.purpose === "capture") return { candidates: [addition] };
        if (request.submission.name === "submit_capture_decision") return { action: "create" };
        assert.equal(request.submission.name, "submit_capture_links");
        return { reviews: (request.input as any).candidates.map((item: any) => ({
          candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
            memoryId: memory.id, action: "ignore", reason: "Keep policies separate" })) })) };
      } } });
    const queued = await service.enqueue(snapshot(project));

    // Act/Assert: extraction, selection, and link review each advance exactly one normal pass.
    for (let pass = 1; pass <= 3; pass++) {
      const result = await service.checkpoint();
      const job = (await queue.getJob(queued.jobId))!;
      assert.deepEqual(result.errors, []);
      assert.equal(tasks.length, pass);
      assert.equal(job.status, pass === 3 ? "complete" : "pending", job.lastError);
      assert.equal(job.attempts, pass === 3 ? 1 : 0);
    }
    assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decision",
      "submit_capture_links"]);
  });

for (const recover of [true, false]) {
  test(`one-call correction keeps genuine failures bounded; recover=${recover}`, realOptions,
    async (t) => {
      // Arrange: Forgetful rejects the real oversized payload, not a simulated service error.
      const { baseUrl, client: api, project, directory } = await fixture(t);
      await api.create({ ...fact, project_ids: [project.id] });
      const bad = { ...addition, content: "x".repeat(2500) };
      let creates = 0;
      const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
        if (init?.method === "POST" && String(url).endsWith("/memories")) creates++;
        return fetch(url, init);
      } });
      const tasks: string[] = [];
      const model = { async complete(request: ModelRequest): Promise<unknown> {
        tasks.push(request.submission.name);
        let response: unknown;
        if (request.purpose === "capture") response = { candidates: [bad] };
        else if (request.submission.name === "submit_capture_decision")
          response = { action: "create" };
        else if (request.submission.name === "submit_capture_correction") {
          assert.match((request.input as any).outcome.executionFailure, /2000/);
          response = { candidate: recover ? addition : bad };
        } else {
          assert.equal(request.submission.name, "submit_capture_links");
          response = { reviews: (request.input as any).candidates.map((item: any) => ({
            candidateId: item.candidateId, decisions: item.memories.map((memory: any) => ({
              memoryId: memory.id, action: "ignore", reason: "Keep policies separate" })) })) };
        }
        request.submission.validate(response);
        return response;
      } };
      let queue = new DurableQueueStore({ directory, instanceId: "maintenance" });
      let service = new CaptureService({ client, queue, instanceId: "maintenance", model,
        maxModelCalls: 1 });
      const queued = await service.enqueue(snapshot(project));
      let failures = 0, finished = false;

      // Act: restart every pass, including after correction spends the entire allowance.
      for (let pass = 1; pass <= 8; pass++) {
        const result = await service.checkpoint();
        if (result.errors.length) {
          assert.equal(result.errors.length, 1);
          assert.match(result.errors[0]!, /2000/);
          failures++;
        }
        const job = await queue.getJob(queued.jobId);
        if (!job || job.status === "complete") {
          assert.equal(Boolean(job), recover);
          if (job) assert.equal(job.attempts, 2);
          else assert.equal(result.discardedJobs?.[0]?.jobId, queued.jobId);
          finished = true;
          break;
        }
        assert.equal(job.attempts, failures, "Only actual REST rejections spend failure attempts");
        if (!result.errors.length) {
          assert.equal(result.continuation, "ready");
          assert.equal(job.callCount, 0);
        }
        service.stop();
        queue = new DurableQueueStore({ directory, instanceId: "maintenance" });
        service = new CaptureService({ client, queue, instanceId: "maintenance", model,
          maxModelCalls: 1 });
      }

      // Assert: correction is saved before yielding; repeated rejection expires after three tries.
      assert.equal(finished, true, "Minimum budgets must never continue without bounded progress");
      assert.equal(failures, recover ? 1 : 3);
      assert.equal(creates, recover ? 2 : 3);
      assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decision",
        "submit_capture_correction",
        recover ? "submit_capture_links" : "submit_capture_correction"]);
    });
}

for (const kind of ["document", "entity"] as const) {
  test(`global merge preserves an existing projectless ${kind}`, realOptions, async (t) => {
    // Arrange: project scope rejects these resources, but global scope authorizes their reuse.
    const { client, project, queue } = await fixture(t);
    const old = await client.create({ ...fact, project_ids: [project.id] });
    let id: number;
    if (kind === "document") {
      id = (await client.knowledge.createDocument({ title: "Global rationale",
        description: "Shared", content: "Global dependency policy", tags: [] })).id;
      await client.knowledge.updateMemory(old.id, { document_ids: [id] });
    } else {
      id = (await client.knowledge.createEntity({ name: "Global component", entity_type: "System",
        project_ids: [], tags: [], aka: [] })).id;
      await client.knowledge.linkEntityMemory(id, old.id);
    }
    const service = new CaptureService({ client, queue, instanceId: "maintenance",
      model: mergeModel([old.id]) });
    // Act.
    const queued = await service.enqueue(snapshot(project));
    await service.checkpoint();
    // Assert through the real graph/attachment APIs.
    const job = (await queue.getJob(queued.jobId))!;
    assert.equal(job.status, "complete", job.lastError);
    const replacement = (job.candidateOutcomes.policy as any).replacementId as number;
    const refs = kind === "document" ? (await client.get(replacement)).document_ids
      : await client.getMemoryEntityIds(replacement);
    assert.ok(refs?.includes(id));
    assert.equal((await client.get(old.id)).superseded_by, replacement);
  });
}
