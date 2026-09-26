import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";

import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";
import {
  KnowledgeWriter, type KnowledgeWritePlan, type KnowledgeWriteState,
} from "../src/knowledge-write.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

async function setup(t: TestContext) {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
  const project = await client.createProject({ name: "Execution", description: "Explicit writes",
    repo_name: "test/execution" });
  const memory = await client.create({ title: "Architecture", content: "The API serves requests.",
    context: "Settled work", keywords: ["api"], tags: [], project_ids: [project.id] });
  const plan: KnowledgeWritePlan = {
    operationId: "explicit", projectId: project.id, memoryId: memory.id,
    entities: [{ key: "api", input: { name: "API", entity_type: "System", aka: ["Gateway"],
      tags: [], project_ids: [project.id] } }],
    documents: [{ key: "guide", input: { title: "Guide", description: "API guide",
      content: "Call the API.", tags: [], project_id: project.id } }],
    codeArtifacts: [{ key: "call", input: { title: "Call", description: "API call",
      code: "call()", language: "typescript", tags: [], project_id: project.id } }],
  };
  const writer = new KnowledgeWriter(client.knowledge, (id, signal) => client.get(id, signal));
  return { baseUrl, client, plan, writer };
}

test("omitting existingId creates resources even when identical resources exist", realOptions,
  async (t) => {
    // Arrange: the service already contains the exact requested content.
    const { client, plan, writer } = await setup(t);
    const entity = await client.knowledge.createEntity(plan.entities![0]!.input);
    const document = await client.knowledge.createDocument(plan.documents![0]!.input);
    const artifact = await client.knowledge.createCodeArtifact(plan.codeArtifacts![0]!.input);

    // Act: an omitted selection is an explicit create, not a deduplication request.
    const result = await writer.execute(plan);

    // Assert through receipts and REST.
    assert.notEqual(result.entities[0]!.id, entity.id);
    assert.notEqual(result.documents[0]!.id, document.id);
    assert.notEqual(result.codeArtifacts[0]!.id, artifact.id);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 2);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 2);
  });

test("existingId selects exact resources without comparing names or content", realOptions,
  async (t) => {
    // Arrange: selected resources intentionally differ from the creation arguments.
    const { client, plan, writer } = await setup(t);
    const entity = await client.knowledge.createEntity({ ...plan.entities![0]!.input,
      name: "Renamed system", aka: [] });
    const document = await client.knowledge.createDocument({ ...plan.documents![0]!.input,
      title: "Different guide", content: "Previously reviewed instructions" });
    const artifact = await client.knowledge.createCodeArtifact({ ...plan.codeArtifacts![0]!.input,
      title: "Different call", code: "other()" });
    Object.assign(plan.entities![0]!, { existingId: entity.id });
    Object.assign(plan.documents![0]!, { existingId: document.id });
    Object.assign(plan.codeArtifacts![0]!, { existingId: artifact.id });
    plan.attachResources = true;

    // Act.
    const result = await writer.execute(plan);

    // Assert: exact selection does not create or rewrite a resource.
    assert.deepEqual(result.entities, [{ key: "api", id: entity.id }]);
    assert.deepEqual(result.documents, [{ key: "guide", id: document.id }]);
    assert.deepEqual(result.codeArtifacts, [{ key: "call", id: artifact.id }]);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 0);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 1);
    assert.deepEqual((await client.get(plan.memoryId)).document_ids, [document.id]);
    assert.deepEqual((await client.get(plan.memoryId)).code_artifact_ids, [artifact.id]);
  });

test("resource creates recheck destination scope after beforeWrite", realOptions, async (t) => {
  // Arrange: each create loses authorization while the asynchronous guard is running.
  const { client, plan, writer } = await setup(t);
  const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
    repo_name: "test/foreign" });
  for (const kind of ["entities", "documents", "codeArtifacts"] as const) {
    await client.knowledge.updateMemory(plan.memoryId, { project_ids: [plan.projectId] });
    const operation = { ...plan, entities: [], documents: [], codeArtifacts: [],
      [kind]: plan[kind] };

    // Act / Assert: no operation may use authorization from before the guard.
    await assert.rejects(writer.execute(operation, {}, undefined, undefined, async () => {
      await client.knowledge.updateMemory(plan.memoryId, { project_ids: [foreign.id] });
    }), /outside the project/);
  }
  assert.equal((await client.knowledge.searchEntities("API", 10)).length, 0);
  assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 0);
  assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 0);
});

test("explicit selection rechecks scope after beforeWrite without expanding membership",
  realOptions, async (t) => {
    // Arrange: selected resources move to another project during the guard.
    const { client, plan, writer } = await setup(t);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });
    const entity = await client.knowledge.createEntity(plan.entities![0]!.input);
    const document = await client.knowledge.createDocument(plan.documents![0]!.input);
    const artifact = await client.knowledge.createCodeArtifact(plan.codeArtifacts![0]!.input);
    plan.entities![0]!.existingId = entity.id;
    plan.documents![0]!.existingId = document.id;
    plan.codeArtifacts![0]!.existingId = artifact.id;
    const move = {
      entities: () => client.knowledge.updateEntity(entity.id, { project_ids: [foreign.id] }),
      documents: () => client.knowledge.updateDocument(document.id, { project_id: foreign.id }),
      codeArtifacts: () => client.knowledge.updateCodeArtifact(artifact.id,
        { project_id: foreign.id }),
    };

    // Act / Assert.
    for (const kind of ["entities", "documents", "codeArtifacts"] as const) {
      const operation = { ...plan, entities: [], documents: [], codeArtifacts: [],
        [kind]: plan[kind] };
      await assert.rejects(writer.execute(operation, {}, undefined, undefined, async () => {
        await move[kind]();
      }), /outside the destination project/);
    }
    assert.deepEqual((await client.knowledge.getEntity(entity.id)).project_ids, [foreign.id]);
    assert.equal((await client.knowledge.getDocument(document.id)).project_id, foreign.id);
    assert.equal((await client.knowledge.getCodeArtifact(artifact.id)).project_id, foreign.id);
  });

test("expectedClaim does not decide whether an explicit operation remains relevant", realOptions,
  async (t) => {
    // Arrange: the caller's old claim is no longer the stored text.
    const { client, plan, writer } = await setup(t);
    plan.expectedClaim = { title: "Old title", content: "Old content" };

    // Act.
    const result = await writer.execute(plan);

    // Assert: scope still authorizes the operation; relevance belongs to the model.
    assert.equal(result.entities.length, 1);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 1);
  });

test("completed receipts never restore externally removed resources, links, or attachments",
  realOptions, async (t) => {
    // Arrange: execute a complete plan, then externally remove its effects.
    const { baseUrl, client, plan, writer } = await setup(t);
    plan.entities!.push({ key: "db", input: { ...plan.entities![0]!.input, name: "Database" } });
    plan.relationships = [{ key: "depends", sourceEntityKey: "api", targetEntityKey: "db",
      input: { source_entity_id: 1, target_entity_id: 2, relationship_type: "depends_on" } }];
    plan.entityMemoryLinks = [{ entityKey: "api" }];
    const related = await client.create({ title: "Related", content: "A related decision.",
      context: "Settled work", keywords: ["api"], tags: [], project_ids: [plan.projectId] });
    plan.linkedMemoryIds = [related.id];
    plan.attachResources = true;
    const completed = await writer.execute(plan);
    await client.knowledge.updateMemory(plan.memoryId, { document_ids: [], code_artifact_ids: [] });
    await client.knowledge.unlinkMemories(plan.memoryId, related.id);
    const entityId = completed.entities[0]!.id;
    for (const path of [
      `/entities/${entityId}/memories/${plan.memoryId}`,
      `/entities/relationships/${completed.relationships[0]!.id}`,
      `/documents/${completed.documents[0]!.id}`,
    ]) {
      const response = await fetch(`${baseUrl}${path}`, { method: "DELETE" });
      assert.equal(response.ok, true, await response.text());
    }

    // Act: durable receipts represent completed operations, not desired current state.
    const resumed = await writer.execute(plan, completed);

    // Assert.
    assert.deepEqual(resumed, completed);
    const memory = await client.get(plan.memoryId);
    assert.deepEqual(memory.document_ids, []);
    assert.deepEqual(memory.code_artifact_ids, []);
    assert.deepEqual(memory.linked_memory_ids, []);
    assert.deepEqual(await client.knowledge.getRelationships(entityId), []);
    assert.deepEqual(await client.knowledge.getEntityMemories(entityId), []);
    assert.deepEqual(await client.knowledge.listDocuments(plan.projectId), []);
  });

test("relationship selection uses its exact ID rather than inferring from its type", realOptions,
  async (t) => {
    // Arrange: both relationships exist between the selected endpoints.
    const { client, plan, writer } = await setup(t);
    const source = await client.knowledge.createEntity(plan.entities![0]!.input);
    const target = await client.knowledge.createEntity({ ...plan.entities![0]!.input, name: "DB" });
    plan.entities![0]!.existingId = source.id;
    plan.entities!.push({ key: "db", existingId: target.id, input: plan.entities![0]!.input });
    const input = { source_entity_id: source.id, target_entity_id: target.id,
      relationship_type: "depends_on" };
    const selected = await client.knowledge.createRelationship({
      ...input, relationship_type: "uses",
    });
    await client.knowledge.createRelationship(input);
    plan.relationships = [{ key: "relation", existingId: selected.id,
      sourceEntityKey: "api", targetEntityKey: "db", input }];

    // Act.
    const result = await writer.execute(plan);

    // Assert: type equality is not a selection rule.
    assert.deepEqual(result.relationships, [{ key: "relation", id: selected.id }]);
    assert.equal((await client.knowledge.getRelationships(source.id)).length, 2);
  });

test("ADD attachments preserves unaddressed and concurrently added references", realOptions,
  async (t) => {
    // Arrange: an unaddressed attachment has moved outside this operation's scope.
    const { client, plan, writer } = await setup(t);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });
    const input = plan.documents![0]!.input;
    const untouched = await client.knowledge.createDocument({ ...input, title: "Unaddressed" });
    const concurrent = await client.knowledge.createDocument({ ...input, title: "Concurrent" });
    const requested = await client.knowledge.createDocument({ ...input, title: "Requested" });
    await client.knowledge.updateMemory(plan.memoryId, { document_ids: [untouched.id] });
    await client.knowledge.updateDocument(untouched.id, { project_id: foreign.id });
    const operation = { ...plan, entities: [], documents: [], codeArtifacts: [],
      attachResources: true, existingDocumentIds: [requested.id] };

    // Act: another attachment arrives while awaiting the write guard.
    const state = await writer.execute(operation, {}, undefined, undefined, async () => {
      await client.knowledge.updateMemory(plan.memoryId,
        { document_ids: [untouched.id, concurrent.id] });
    });

    // Assert: ADD names only the new reference and keeps everything already attached.
    assert.equal(state.attachmentsApplied, true);
    assert.deepEqual((await client.get(plan.memoryId)).document_ids!.sort((a, b) => a - b),
      [untouched.id, concurrent.id, requested.id].sort((a, b) => a - b));
  });

test("a lost create response stays unknown on resume without reconstructing or creating again",
  realOptions, async (t) => {
    // Arrange: the real service accepts the artifact, but its response is lost.
    const { baseUrl, client, plan, writer } = await setup(t);
    let dropped = false;
    const lostResponse = new Error("Lost response after acceptance");
    const interrupted = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (!dropped && init?.method === "POST" && String(url).endsWith("/code-artifacts")) {
          dropped = true;
          throw lostResponse;
        }
        return response;
      } });
    let saved: Partial<KnowledgeWriteState> = {};
    const checkpoint = async (state: KnowledgeWriteState) => { saved = state; };
    const failing = new KnowledgeWriter(interrupted.knowledge, (id) => interrupted.get(id));

    // Act: retain successful receipts and resume through a fresh writer.
    await assert.rejects(failing.execute(plan, {}, checkpoint), (error) => {
      assert.equal(error, lostResponse);
      return true;
    });
    const completedEntities = saved.entities;
    const completedDocuments = saved.documents;
    await assert.rejects(writer.execute(plan, saved, checkpoint), /unknown/i);

    // Assert: neither identical content nor a receipt search resolves the uncertainty.
    assert.equal(dropped, true);
    assert.deepEqual(saved.entities, completedEntities);
    assert.deepEqual(saved.documents, completedDocuments);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 1);
  });

test("a lost relationship response is not reconstructed or blindly retried", realOptions,
  async (t) => {
    // Arrange: endpoint bindings succeeded before a relationship response was lost.
    const { baseUrl, client, plan, writer } = await setup(t);
    plan.documents = [];
    plan.codeArtifacts = [];
    plan.entities!.push({ key: "db", input: { ...plan.entities![0]!.input, name: "Database" } });
    plan.relationships = [{ key: "depends", sourceEntityKey: "api", targetEntityKey: "db",
      input: { source_entity_id: 1, target_entity_id: 2, relationship_type: "depends_on" } }];
    const lostResponse = new Error("Lost relationship response");
    const interrupted = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (init?.method === "POST" && String(url).endsWith("/relationships")) {
          throw lostResponse;
        }
        return response;
      } });
    let saved: Partial<KnowledgeWriteState> = {};
    const checkpoint = async (state: KnowledgeWriteState) => { saved = state; };
    const failing = new KnowledgeWriter(interrupted.knowledge, (id) => interrupted.get(id));

    // Act / Assert: retain endpoint receipts but require a model decision for the unknown create.
    await assert.rejects(failing.execute(plan, {}, checkpoint), (error) => {
      assert.equal(error, lostResponse);
      return true;
    });
    await assert.rejects(writer.execute(plan, saved, checkpoint), /unknown/i);
    assert.equal((await client.knowledge.getRelationships(saved.entities![0]!.id)).length, 1);
  });

test("create arguments cannot place resources outside the destination project", realOptions,
  async (t) => {
    // Arrange: valid resource inputs name an unauthorized project.
    const { client, plan, writer } = await setup(t);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });
    plan.entities![0]!.input.project_ids = [plan.projectId, foreign.id];
    plan.documents![0]!.input.project_id = foreign.id;
    plan.codeArtifacts![0]!.input.project_id = foreign.id;

    // Act / Assert: reject arguments rather than silently rewriting their scope.
    for (const kind of ["entities", "documents", "codeArtifacts"] as const) {
      const operation = { ...plan, entities: [], documents: [], codeArtifacts: [],
        [kind]: plan[kind] };
      await assert.rejects(writer.execute(operation), /outside the destination project/);
    }
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 0);
    assert.equal((await client.knowledge.listDocuments(foreign.id)).length, 0);
    assert.equal((await client.knowledge.listCodeArtifacts(foreign.id)).length, 0);
  });

test("ADD rejects another plan's receipts and uses fresh state for named resources", realOptions,
  async (t) => {
    // Arrange: previous completed work created a document without attaching it.
    const { client, plan, writer } = await setup(t);
    const previous = await writer.execute({ ...plan, entities: [], codeArtifacts: [] });
    const named = await client.knowledge.createDocument({ ...plan.documents![0]!.input,
      title: "Explicitly named attachment" });

    // Act: a new instruction must use fresh state; keep the old successful receipt intact.
    const operation = { ...plan, operationId: "add-named", entities: [], documents: [],
      codeArtifacts: [], attachResources: true, existingDocumentIds: [named.id] };
    await assert.rejects(writer.execute(operation, previous), /receipt.*instruction.*mismatch/i);
    await writer.execute(operation);

    // Assert: fresh execution attaches only the explicitly named resource.
    assert.deepEqual((await client.get(plan.memoryId)).document_ids, [named.id]);
  });

test("an API rejection preserves its body and successful receipts without substituting a plan",
  realOptions, async (t) => {
    // Arrange: Forgetful rejects a duplicate relationship; omission still requests CREATE.
    const { baseUrl, client, plan } = await setup(t);
    plan.entities!.push({ key: "db", input: { ...plan.entities![0]!.input, name: "DB" } });
    const source = await client.knowledge.createEntity(plan.entities![0]!.input);
    const target = await client.knowledge.createEntity(plan.entities![1]!.input);
    plan.entities![0]!.existingId = source.id;
    plan.entities![1]!.existingId = target.id;
    const input = { source_entity_id: source.id, target_entity_id: target.id,
      relationship_type: "depends_on" };
    await client.knowledge.createRelationship(input);
    plan.relationships = [{ key: "duplicate",
      sourceEntityKey: "api", targetEntityKey: "db", input }];
    let actualBody: string | undefined;
    let actualStatus: number | undefined;
    const observed = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (init?.method === "POST" && String(url).endsWith("/relationships")) {
          actualBody = await response.clone().text();
          actualStatus = response.status;
        }
        return response;
      } });
    let saved: Partial<KnowledgeWriteState> = {};
    const writer = new KnowledgeWriter(observed.knowledge, (id) => observed.get(id));

    // Act / Assert: the actual service response reaches the caller unchanged.
    await assert.rejects(writer.execute(plan, {}, async (state) => { saved = state; }), (error) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.ok(actualBody);
      assert.equal(error.responseBody, actualBody);
      assert.equal(error.status, actualStatus);
      assert.ok(error.message.includes(actualBody));
      return true;
    });
    assert.deepEqual(saved.entities, [{ key: "api", id: source.id }, { key: "db", id: target.id }]);
    assert.equal(saved.documents!.length, 1);
    assert.equal(saved.codeArtifacts!.length, 1);
    assert.deepEqual(saved.relationships, []);
    assert.equal((await client.knowledge.getRelationships(source.id)).length, 1);
  });

test("the synchronous enabled guard runs after fresh authorization", realOptions, async (t) => {
  // Arrange: configuration changes during the final scope read.
  const { client, plan } = await setup(t);
  let enabled = true;
  const writer = new KnowledgeWriter(client.knowledge, async (id, signal) => {
    const memory = await client.get(id, signal);
    enabled = false;
    return memory;
  }, () => { if (!enabled) throw new Error("Writes disabled"); });
  let saved: Partial<KnowledgeWriteState> = {};

  // Act / Assert: the guard prevents the first create after all awaited checks.
  await assert.rejects(writer.execute(plan, {}, async (state) => { saved = state; }, undefined,
    async () => { enabled = true; }), /Writes disabled/);
  assert.equal(saved.pendingCreates, undefined);
  assert.equal((await client.knowledge.searchEntities("API", 10)).length, 0);
  assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 0);
});

test("duplicate operation keys are rejected before any resource is created", realOptions,
  async (t) => {
    // Arrange: two requested creates cannot share one completion receipt.
    const { client, plan, writer } = await setup(t);
    plan.entities!.push({ ...plan.entities![0]!, input: { ...plan.entities![0]!.input,
      name: "Another system" } });

    // Act / Assert: do not silently treat the second requested create as complete.
    await assert.rejects(writer.execute(plan), /duplicate.*key/i);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 0);
    assert.equal((await client.knowledge.searchEntities("Another system", 10)).length, 0);
  });

test("receipts reject changed instructions before writes, even with the same operationId",
  realOptions, async (t) => {
    // Arrange: completed creates and attachments have durable receipts.
    const { client, plan, writer } = await setup(t);
    plan.attachResources = true;
    const completed = await writer.execute(plan);
    const before = structuredClone(completed);
    const entity = await client.knowledge.createEntity({ ...plan.entities![0]!.input,
      name: "Explicit alternative" });
    const document = await client.knowledge.createDocument({ ...plan.documents![0]!.input,
      title: "Explicit alternative" });
    const artifact = await client.knowledge.createCodeArtifact({ ...plan.codeArtifacts![0]!.input,
      title: "Explicit alternative" });
    const changes: Partial<KnowledgeWritePlan>[] = [
      { operationId: "new-operation" },
      { entities: [{ ...plan.entities![0]!, existingId: entity.id }] },
      { documents: [{ ...plan.documents![0]!, existingId: document.id }] },
      { codeArtifacts: [{ ...plan.codeArtifacts![0]!, existingId: artifact.id }] },
      { existingDocumentIds: [document.id] },
      { existingCodeArtifactIds: [artifact.id] },
      { documents: [{ ...plan.documents![0]!, input: { ...plan.documents![0]!.input,
        content: "A changed create instruction" } }] },
    ];

    // Act / Assert: neither an operation ID nor a resource key can hide changed arguments.
    for (const change of changes) {
      for (const operationId of [plan.operationId, "new-operation"]) {
        let checkpointed = false;
        let guarded = false;
        await assert.rejects(writer.execute({ ...plan, operationId, ...change }, completed,
          async () => { checkpointed = true; }, undefined,
          async () => { guarded = true; }), /receipt.*instruction.*mismatch/i);
        assert.equal(checkpointed, false);
        assert.equal(guarded, false);
      }
    }
    assert.deepEqual(completed, before);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 2);
    assert.deepEqual((await client.get(plan.memoryId)).document_ids,
      [completed.documents[0]!.id]);
    assert.deepEqual((await client.get(plan.memoryId)).code_artifact_ids,
      [completed.codeArtifacts[0]!.id]);
  });

test("legacy receipts require explicit review and are never silently bound or discarded",
  realOptions, async (t) => {
    // Arrange: old persisted state has successes but no instruction identity.
    const { client, plan, writer } = await setup(t);
    plan.attachResources = true;
    const completed = await writer.execute(plan);
    const legacy = { ...completed };
    delete legacy.instructionId;
    const before = structuredClone(legacy);

    // Act / Assert: neither the original plan nor a changed plan can prove legacy ownership.
    for (const operationId of [plan.operationId, "another-operation"]) {
      let checkpointed = false;
      await assert.rejects(writer.execute({ ...plan, operationId }, legacy,
        async () => { checkpointed = true; }), /legacy.*receipt.*review/i);
      assert.equal(checkpointed, false);
    }
    assert.deepEqual(legacy, before);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 1);
    assert.deepEqual((await client.get(plan.memoryId)).document_ids, [completed.documents[0]!.id]);
  });

test("unchanged instructions retry across JSON key order and deprecated claim changes", realOptions,
  async (t) => {
    // Arrange: persist receipts, then change memory text independently of the instruction.
    const { client, plan, writer } = await setup(t);
    const completed = await writer.execute(plan);
    await client.knowledge.updateMemory(plan.memoryId, { title: "Externally revised",
      content: "The stored claim has changed." });
    const entity = plan.entities![0]!;
    const reordered: KnowledgeWritePlan = {
      codeArtifacts: plan.codeArtifacts,
      documents: plan.documents,
      entities: [{ input: { project_ids: entity.input.project_ids, tags: entity.input.tags,
        aka: entity.input.aka, entity_type: entity.input.entity_type, name: entity.input.name },
      key: entity.key }],
      memoryId: plan.memoryId, projectId: plan.projectId, operationId: plan.operationId,
      expectedClaim: { title: "Ignored", content: "Deprecated compatibility field" },
    };

    // Act: object key order and deprecated claims are not instruction changes.
    const retried = await writer.execute(reordered, JSON.parse(JSON.stringify(completed)));

    // Assert: identical receipt ownership survives serialization without re-executing creates.
    assert.deepEqual(retried, completed);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 1);
    assert.equal((await client.knowledge.listCodeArtifacts(plan.projectId)).length, 1);
    assert.equal((await client.get(plan.memoryId)).title, "Externally revised");
  });

test("legacy pending-only state cannot be discarded to repeat an uncertain create", realOptions,
  async (t) => {
    // Arrange: the first create succeeded remotely but never returned its ID.
    const { baseUrl, client, plan, writer } = await setup(t);
    const lostResponse = new Error("Lost entity response");
    const interrupted = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
      fetchImpl: async (url, init) => {
        const response = await fetch(url, init);
        if (init?.method === "POST" && String(url).endsWith("/entities")) {
          throw lostResponse;
        }
        return response;
      } });
    const failing = new KnowledgeWriter(interrupted.knowledge, (id) => interrupted.get(id));
    let saved: Partial<KnowledgeWriteState> = {};
    await assert.rejects(failing.execute(plan, {}, async (state) => { saved = state; }),
      (error) => {
        assert.equal(error, lostResponse);
        return true;
      });
    const legacy = structuredClone(saved);
    delete legacy.instructionId;
    const before = structuredClone(legacy);

    // Act / Assert: unbound legacy attempts require review; bound attempts remain unknown.
    await assert.rejects(writer.execute(plan, legacy), /legacy.*receipt.*review/i);
    await assert.rejects(writer.execute(plan, saved), /unknown/i);
    assert.deepEqual(legacy, before);
    assert.deepEqual(legacy.entities, []);
    assert.equal(legacy.pendingCreates!.length, 1);
    assert.equal((await client.knowledge.searchEntities("API", 10)).length, 1);
    assert.equal((await client.knowledge.listDocuments(plan.projectId)).length, 0);
  });
