import assert from "node:assert/strict";
import test from "node:test";

import { ApiForgetfulClient } from "../src/http.ts";
import {
  executeKnowledgeRead,
  executeKnowledgeWrite,
  validateKnowledgeReadRequest,
  type KnowledgeToolContext,
} from "../src/knowledge-tools.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

function context(projectId: number, commit = "a".repeat(40)): KnowledgeToolContext {
  return {
    cwd: "/repo",
    repoName: "test/tools",
    commit,
    project: { id: projectId, name: "Tools" },
    scope: "project",
  };
}

function value(
  result: { content: Array<{ type: string; text?: string }> },
): Record<string, unknown> {
  const text = result.content.find((item) => item.type === "text")?.text;
  assert.ok(text);
  return JSON.parse(text) as Record<string, unknown>;
}

test("knowledge read validation keeps list and content bounds distinct", () => {
  assert.throws(
    () => validateKnowledgeReadRequest({ operation: "list_files", limit: 101 }),
    /at most 100/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({ operation: "get_document", document_id: 1, limit: 5_001 }),
    /at most 5000/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({ operation: "get_document", document_id: 1, offset: -1 }),
    /non-negative/,
  );
});

test(
  "knowledge tools hydrate entity search results before scoped dedupe",
  realOptions,
  async (t) => {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
  const project = await client.createProject({
    name: "Tools", description: "Knowledge tool tests", repo_name: "test/tools",
  });
  await client.knowledge.createEntity({
    name: "API", entity_type: "System", tags: [], aka: [], project_ids: [project.id],
  });

  const result = await executeKnowledgeWrite(client, {
    operation: "create_entity", name: "API", entity_type: "System", tags: [], aka: [],
    source_files: ["README.md"],
  }, context(project.id));

  assert.equal(value(result).status, "existing");
  const typed = await client.knowledge.createEntity({
    name: "Typed", entity_type: "Individual", tags: [], aka: [], project_ids: [project.id],
  });
  const typedResult = value(await executeKnowledgeWrite(client, {
    operation: "create_entity", name: "Typed", entity_type: "System", tags: [], aka: [],
  }, context(project.id)));
  assert.equal(typedResult.status, "created");
  assert.equal((typedResult.entity as { id: number }).id !== typed.id, true);
  const entities = await client.knowledge.searchEntities("API", 10);
  const hydrated = await Promise.all(entities.map((item) => client.knowledge.getEntity(item.id)));
  assert.equal(hydrated.filter((item) => item.project_ids.includes(project.id)).length, 1);
  const search = value(await executeKnowledgeRead(client, {
    operation: "search_entities", query: "API", limit: 10,
  }, context(project.id)));
  assert.equal((search.items as Array<{ id: number }>).length, 1);
  assert.equal(search.next_offset, 1);
  },
);

test(
  "scoped graph reads retain incoming links and filter mixed project memories",
  realOptions,
  async (t) => {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
  const project = await client.createProject({
    name: "Tools", description: "Knowledge tool graph", repo_name: "test/tools-graph",
  });
  const foreign = await client.createProject({
    name: "Foreign", description: "Outside project", repo_name: "test/tools-foreign",
  });
  const api = await client.knowledge.createEntity({
    name: "API", entity_type: "System", tags: [], aka: [], project_ids: [project.id],
  });
  const database = await client.knowledge.createEntity({
    name: "Database", entity_type: "System", tags: [], aka: [], project_ids: [project.id],
  });
  const foreignEntity = await client.knowledge.createEntity({
    name: "Foreign", entity_type: "System", tags: [], aka: [], project_ids: [foreign.id],
  });
  const incoming = await client.knowledge.createRelationship({
    source_entity_id: database.id, target_entity_id: api.id, relationship_type: "stores",
  });
  await client.knowledge.createRelationship({
    source_entity_id: foreignEntity.id, target_entity_id: api.id, relationship_type: "foreign",
  });
  const foreignMemory = await client.create({
    title: "Foreign fact", content: "Foreign", context: "test", keywords: [], tags: [],
    project_ids: [foreign.id],
  });
  const localMemory = await client.create({
    title: "Local fact", content: "Local", context: "test", keywords: [], tags: [],
    project_ids: [project.id],
  });
  await client.knowledge.linkEntityMemory(api.id, foreignMemory.id);
  await client.knowledge.linkEntityMemory(api.id, localMemory.id);

  const graphFirst = value(await executeKnowledgeRead(client, {
    operation: "get_relationships", entity_id: api.id, limit: 1,
  }, context(project.id)));
  assert.deepEqual(graphFirst.items, []);
  assert.equal(graphFirst.next_offset, 1);
  assert.equal(graphFirst.has_more, true);
  const graphSecond = value(await executeKnowledgeRead(client, {
    operation: "get_relationships", entity_id: api.id, offset: 1, limit: 1,
  }, context(project.id)));
  assert.deepEqual(
    (graphSecond.items as Array<{ id: number }>).map((item) => item.id), [incoming.id],
  );

  const graph = value(await executeKnowledgeRead(client, {
    operation: "get_relationships", entity_id: api.id,
  }, context(project.id)));
  const relationships = graph.items as Array<{ id: number }>;
  assert.deepEqual(relationships.map((item) => item.id), [incoming.id]);

  const linked = value(await executeKnowledgeRead(client, {
    operation: "get_entity_memories", entity_id: api.id, limit: 1,
  }, context(project.id)));
  assert.deepEqual(linked.items, []);
  assert.equal(linked.next_offset, 1);
  assert.equal(linked.has_more, true);
  const linkedSecond = value(await executeKnowledgeRead(client, {
    operation: "get_entity_memories", entity_id: api.id, offset: 1, limit: 1,
  }, context(project.id)));
  const memories = linkedSecond.items as Array<{ id: number }>;
  assert.deepEqual(memories.map((item) => item.id), [localMemory.id]);
  },
);

test(
  "knowledge tools page readable content, stamp the current commit, and reject stale supersession",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const project = await client.createProject({
      name: "Tools", description: "Knowledge tool paging", repo_name: "test/tools-pages",
    });
    const current = context(project.id);
    const secret = "Bearer abcdef123456";
    await assert.rejects(
      executeKnowledgeWrite(client, {
        operation: "create_memory", title: "Secret memory", content: secret,
        context: "test", keywords: [], tags: [],
      }, current),
      /cannot contain sensitive data/,
    );
    await assert.rejects(
      executeKnowledgeWrite(client, {
        operation: "create_document", title: "Secret document", description: "Evidence",
        content: secret, tags: [],
      }, current),
      /cannot contain sensitive data/,
    );
    await assert.rejects(
      executeKnowledgeWrite(client, {
        operation: "create_code_artifact", title: "Secret artifact", description: "Evidence",
        code: secret, language: "text", tags: [],
      }, current),
      /cannot contain sensitive data/,
    );
    assert.equal(
      (await client.knowledge.listDocuments(project.id)).some(
        (item) => item.title === "Secret document",
      ),
      false,
    );
    assert.equal(
      (await client.knowledge.listCodeArtifacts(project.id)).some(
        (item) => item.title === "Secret artifact",
      ),
      false,
    );
    const secretMemories = await client.search({
      query: "Secret memory", project_ids: [project.id], strict_project_filter: true,
      query_context: "Checking that rejected input was not stored", k: 20,
      include_links: false,
    });
    assert.equal(secretMemories.some((item) => item.title === "Secret memory"), false);
    const document = await client.knowledge.createDocument({
      title: "Long", description: "Long text", content: "x".repeat(5_000), tags: [],
      project_id: project.id,
    });
    const page = value(await executeKnowledgeRead(client, {
      operation: "get_document", document_id: document.id,
    }, current));
    assert.equal((page.content as string).length, 4_000);
    assert.equal(page.truncated, true);
    const nextPage = value(await executeKnowledgeRead(client, {
      operation: "get_document", document_id: document.id, offset: 4_000, limit: 1_000,
    }, current));
    assert.equal(nextPage.content, "x".repeat(1_000));

    const stamped = value(await executeKnowledgeWrite(client, {
      operation: "create_document", title: "Stamped", description: "Evidence",
      content: "The current commit is the source.", tags: [], source_files: ["README.md"],
    }, current));
    const stampedDocument = stamped.document as { id: number };
    assert.equal(
      (await client.knowledge.getDocument(stampedDocument.id)).encoding_version,
      current.commit,
    );
    await assert.rejects(
      executeKnowledgeWrite(client, {
        operation: "create_document", title: "Wrong commit", description: "Evidence",
        content: "This must be rejected.", tags: [], source_files: ["README.md"],
        encoding_version: "b".repeat(40),
      }, current),
      /match the current repository commit/,
    );

    const sharedProject = await client.createProject({
      name: "Shared", description: "Shared memory", repo_name: "test/tools-shared",
    });
    const shared = await client.create({
      title: "Shared claim", content: "Shared content", context: "test",
      keywords: [], tags: ["original"], project_ids: [project.id, sharedProject.id],
      source_files: ["original.md"], encoding_version: current.commit,
    });
    const sharedResult = value(await executeKnowledgeWrite(client, {
      operation: "create_memory", title: "Shared claim", content: "Shared content",
      context: "test", keywords: [], tags: ["original"], source_files: ["original.md"],
    }, current));
    assert.equal(sharedResult.status, "existing");
    const sharedChange = value(await executeKnowledgeWrite(client, {
      operation: "create_memory", title: "Shared claim", content: "Shared content",
      context: "test", keywords: [], tags: ["replacement"], source_files: ["new.md"],
    }, current));
    assert.equal(sharedChange.status, "needs_review");
    const sharedAfter = await client.get(shared.id);
    assert.deepEqual(sharedAfter.tags, ["original"]);
    assert.deepEqual(sharedAfter.source_files, ["original.md"]);

    await client.create({
      title: "Case-sensitive claim", content: "Use SQLite for durable state.",
      context: "test", keywords: [], tags: [], project_ids: [project.id],
    });
    const caseChanged = value(await executeKnowledgeWrite(client, {
      operation: "create_memory", title: "Case-sensitive claim",
      content: "use sqlite for durable state.", context: "test", keywords: [], tags: [],
    }, current));
    assert.equal(caseChanged.status, "needs_review");

    const fileResponse = await fetch(`${baseUrl}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "chunk.txt", description: "Chunked", mime_type: "text/plain",
        data: Buffer.from("0123456789").toString("base64"), tags: [], project_id: project.id,
      }),
    });
    assert.equal(fileResponse.status, 201);
    const storedFile = await fileResponse.json() as { id: number };
    const filePage = value(await executeKnowledgeRead(client, {
      operation: "get_file", file_id: storedFile.id, offset: 2, limit: 3,
    }, current));
    assert.equal(filePage.text, "234");

    const old = await client.create({
      title: "Old claim", content: "The old claim", context: "test", keywords: [], tags: [],
      project_ids: [project.id], source_files: ["README.md"], encoding_version: current.commit,
    });
    let mutationApplied = false;
    await assert.rejects(
      executeKnowledgeWrite(client, {
        operation: "supersede_memory", memory_id: old.id, title: "New claim",
        content: "The new claim", context: "test", keywords: [], tags: [],
        reason: "Verified source changed the claim", source_files: ["README.md"],
      }, current, undefined, async () => {
        if (!mutationApplied) {
          mutationApplied = true;
          await client.knowledge.updateMemory(old.id, { tags: ["changed"] });
        }
      }),
      /old memory changed/,
    );
    assert.equal((await client.get(old.id)).is_obsolete, false);

    const superseded = value(await executeKnowledgeWrite(client, {
      operation: "supersede_memory", memory_id: old.id, title: "New claim",
      content: "The new claim", context: "test", keywords: [], tags: [],
      reason: "Verified source changed the claim", source_files: ["README.md"],
    }, current));
    const replacementId = superseded.replacement_memory_id as number;
    assert.equal(superseded.status, "superseded");
    const retry = value(await executeKnowledgeWrite(client, {
      operation: "supersede_memory", memory_id: old.id,
      replacement_memory_id: replacementId, reason: "Retry completed operation",
      source_files: ["README.md"],
    }, current));
    assert.equal(retry.status, "already");
  });
