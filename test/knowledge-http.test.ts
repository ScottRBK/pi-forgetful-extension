import assert from "node:assert/strict";
import test from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

test("memory creation validates importance and accepts both score boundaries",
  realOptions, async (t) => {
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t), timeoutMs: 4000 });
    const project = await client.createProject({ name: "Scores", description: "Score validation",
      repo_name: "test/scores" });
    const input = { title: "Scored knowledge", content: "A durable fact", context: "Validation",
      keywords: [], tags: [], project_ids: [project.id] };
    for (const importance of [0, 11, 1.5]) {
      await assert.rejects(client.create({ ...input, importance }),
        (error: unknown) => error instanceof TypeError && /importance/.test(error.message));
    }
    for (const importance of [1, 10]) {
      const created = await client.create({ ...input, importance });
      assert.equal((await client.get(created.id)).importance, importance);
    }
  });

test("real REST links project entities, relationships and memories", realOptions, async (t) => {
  // Arrange: a fresh, isolated Forgetful server.
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
  const project = await client.createProject({
    name: "Knowledge", description: "Knowledge contract", repo_name: "test/knowledge",
  });
  const input = {
    name: "API", entity_type: "System" as const, tags: ["architecture"], aka: ["Gateway"],
    project_ids: [project.id], notes: "Accepts requests",
  };

  // Act: model components, connect them and attach an atomic fact.
  const api = await client.knowledge.createEntity(input);
  const database = await client.knowledge.createEntity({ ...input, name: "Database", aka: [] });
  await client.knowledge.createRelationship({
    source_entity_id: api.id, target_entity_id: database.id, relationship_type: "depends_on",
  });
  const memory = await client.create({
    title: "API persists requests", content: "API uses Database for request storage.",
    context: "Architecture", keywords: ["API"], tags: ["architecture"], project_ids: [project.id],
  });
  await client.knowledge.linkEntityMemory(api.id, memory.id);
  await client.knowledge.updateEntity(api.id, { notes: "Validates and stores requests" });

  // Assert: data and graph edges are independently readable through the public API.
  assert.equal((await client.knowledge.searchEntities("Gateway", 10))[0]?.id, api.id);
  assert.equal((await client.knowledge.getEntity(api.id)).notes, "Validates and stores requests");
  assert.deepEqual((await client.knowledge.getEntity(api.id)).project_ids, [project.id]);
  const relationships = await client.knowledge.getRelationships(api.id);
  assert.equal(relationships[0]?.target_entity_id, database.id);
  assert.equal(relationships[0]?.relationship_type, "depends_on");
  assert.deepEqual(await client.knowledge.getEntityMemories(api.id), [
    { id: memory.id, title: "API persists requests" },
  ]);
});

test("real REST retrieves stored file metadata and binary content without upload support",
  realOptions, async (t) => {
    // Arrange: a file uploaded by another Forgetful client, not by automatic capture.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
    const project = await client.createProject({
      name: "Files", description: "Stored references", repo_name: "test/files",
    });
    const response = await fetch(`${baseUrl}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "diagram.txt", description: "Storage flow", mime_type: "text/plain",
        data: Buffer.from("API -> Database").toString("base64"), project_id: project.id, tags: [],
      }),
    });
    assert.equal(response.status, 201);
    const stored = await response.json() as { id: number };

    // Act.
    const files = await client.knowledge.listFiles(project.id);
    const file = await client.knowledge.getFile(stored.id);

    // Assert: metadata and exact bytes are available to an explicit read.
    assert.equal(files[0]?.filename, "diagram.txt");
    assert.equal(files[0]?.project_id, project.id);
    assert.equal("data" in files[0]!, false);
    assert.equal(Buffer.from(file.data, "base64").toString(), "API -> Database");
    assert.equal(file.size_bytes, 15);
    assert.equal("createFile" in client.knowledge, false);
  });

test("explicit stored-file reads support a one-megabyte asset and respect configured limits",
  realOptions, async (t) => {
    // Arrange: file payloads are larger than ordinary recall responses.
    const baseUrl = await startForgetful(t);
    const data = Buffer.alloc(1_000_000, 65).toString("base64");
    const response = await fetch(`${baseUrl}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "reference.bin", description: "Large stored reference",
        mime_type: "application/octet-stream", data, tags: [],
      }),
    });
    assert.equal(response.status, 201);
    const stored = await response.json() as { id: number };

    // Act and assert: explicit retrieval succeeds, while a user's smaller cap remains enforced.
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
    assert.equal((await client.knowledge.getFile(stored.id)).data, data);
    const bounded = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000, maxResponseBytes: 1000 });
    await assert.rejects(bounded.knowledge.getFile(stored.id), /size limit/);
  });

test("real REST reads and refreshes documents and code linked from memories",
  realOptions, async (t) => {
  // Arrange.
  const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t), timeoutMs: 4000 });
  const project = await client.createProject({
    name: "Sources", description: "Repository knowledge", repo_name: "test/sources",
  });
  const common = {
    title: "Storage", description: "Storage implementation", tags: ["storage"],
    project_id: project.id, source_repo: "test/sources", source_files: ["src/storage.ts"],
    encoding_version: "0123456789abcdef",
  };

  // Act: store each form and make it discoverable from an atomic memory.
  const document = await client.knowledge.createDocument({
    ...common, content: "Storage persists to SQLite.", document_type: "markdown",
  });
  const artifact = await client.knowledge.createCodeArtifact({
    ...common, code: "await db.save(record);", language: "typescript",
  });
  const memory = await client.create({
    title: "Storage choice", content: "Storage uses SQLite.", context: "Repository survey",
    keywords: ["storage"], tags: ["architecture"], project_ids: [project.id],
    document_ids: [document.id], code_artifact_ids: [artifact.id],
    source_repo: "test/sources", encoding_version: "0123456789abcdef",
  });
  const related = await client.create({
    title: "Storage schema", content: "Records are keyed by ID.", context: "Repository survey",
    keywords: ["storage"], tags: ["schema"], project_ids: [project.id],
  });
  await client.knowledge.linkMemories(memory.id, [related.id]);
  await client.knowledge.updateDocument(document.id, {
    content: "Storage persists records to SQLite.",
  });
  await client.knowledge.updateCodeArtifact(artifact.id, { code: "await db.save(record, tx);" });
  await client.knowledge.updateMemory(related.id, { document_ids: [document.id] });

  // Assert: links, source provenance and refreshed content survive the REST boundary.
  const stored = await client.get(memory.id);
  assert.deepEqual(stored.document_ids, [document.id]);
  assert.deepEqual(stored.code_artifact_ids, [artifact.id]);
  assert.equal(stored.encoding_version, "0123456789abcdef");
  assert.ok(stored.linked_memory_ids?.includes(related.id));
  assert.deepEqual((await client.get(related.id)).document_ids, [document.id]);
  assert.equal((await client.knowledge.getDocument(document.id)).content,
    "Storage persists records to SQLite.");
  assert.equal((await client.knowledge.getCodeArtifact(artifact.id)).code,
    "await db.save(record, tx);");
  assert.deepEqual((await client.knowledge.listDocuments(project.id)).map((d) => d.id),
    [document.id]);
  assert.deepEqual((await client.knowledge.listCodeArtifacts(project.id)).map((a) => a.id),
    [artifact.id]);
  assert.equal((await client.knowledge.getDocument(document.id)).source_repo, "test/sources");
});
