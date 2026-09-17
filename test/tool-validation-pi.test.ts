import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { RecallService } from "../src/recall.ts";
import { createToolSession, resultText, type ToolCall } from "./pi-tool-session.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

test("Pi gives the model the complete Forgetful error response", async (t) => {
  // Arrange: a Forgetful response that is larger than the old foreground error limit.
  const body = JSON.stringify({ detail: "Forgetful diagnostic: " + "x".repeat(2_100) + " END" });
  const server = createServer((_request, response) => {
    response.writeHead(422, { "content-type": "application/json" });
    response.end(body);
  });
  t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
  const { session, modelResults } = await createToolSession(t, baseUrl, [
    { name: "forgetful_knowledge_read", arguments: { operation: "get_memory", memory_id: 1 } },
  ]);

  // Act.
  await session.prompt("Read the requested Forgetful memory.");

  // Assert: the next model call receives the complete service-owned diagnostic unchanged.
  const result = modelResults[1]![0]!;
  assert.equal(result.isError, true);
  assert.match(resultText(result), /HTTP 422/);
  assert.match(resultText(result), new RegExp(body.replace(/[{}]/g, "\\$&")));
});

test("Pi returns API field validation to the main model and accepts a corrected project retry",
  realOptions, async (t) => {
    // Arrange: the real API has a stricter configured limit than the tool's default ceiling.
    const baseUrl = await startForgetful(t, { PROJECT_DESCRIPTION_MAX_LENGTH: "40" });
    const { session, modelResults } = await createToolSession(t, baseUrl, [
      { name: "forgetful_project_init", arguments: {
        name: "Validation", description: "x".repeat(41),
      } },
      { name: "forgetful_project_init", arguments: {
        name: "Validation", description: "Corrected description",
      } },
    ]);

    // Act: Pi supplies the failed result to the model before its next tool call.
    await session.prompt("Initialise this repository, correcting rejected arguments.");

    // Assert: the model sees the field and actual server limit, then a successful retry.
    const rejected = modelResults[1]![0]!;
    assert.equal(rejected.isError, true);
    assert.match(resultText(rejected), /HTTP 400/);
    assert.match(resultText(rejected), /description/);
    assert.match(resultText(rejected), /40 characters/);
    assert.equal(modelResults[2]![1]!.isError, false);
    const projects = await new ApiForgetfulClient({ baseUrl }).listProjects("test/validation");
    assert.equal(projects.length, 1);
    const saved = await fetch(`${baseUrl}/projects/${projects[0]!.id}`);
    assert.equal((await saved.json()).description, "Corrected description");
  });

test("generated provenance validation names the API field and limit before any knowledge write",
  realOptions, async (t) => {
    // Arrange: projects allow 255 repository characters, but knowledge provenance allows 200.
    const repo = "owner/" + "r".repeat(195);
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Long repository",
      description: "Provenance limits", repo_name: repo });
    const { session, modelResults } = await createToolSession(t, baseUrl, [
      { name: "forgetful_knowledge_write", arguments: { operation: "create_memory",
        title: "Memory", content: "Fact", context: "Evidence", keywords: [], tags: [] } },
      { name: "forgetful_knowledge_write", arguments: { operation: "create_entity",
        name: "API", entity_type: "System" } },
      { name: "forgetful_knowledge_write", arguments: { operation: "create_document",
        title: "Design", description: "Architecture", content: "Flow" } },
      { name: "forgetful_knowledge_write", arguments: { operation: "create_code_artifact",
        title: "Code", description: "Example", code: "const a = 1;", language: "typescript" } },
    ], `https://github.com/${repo}.git`);
    // Act.
    await session.prompt("Record the repository knowledge.");
    // Assert: retain the server's differing constraints without silently truncating provenance.
    for (const result of modelResults.at(-1)!) {
      assert.equal(result.isError, true);
      assert.match(resultText(result), /source_repo.*200/);
    }
    assert.deepEqual(await client.knowledge.listDocuments(project.id), []);
    assert.deepEqual(await client.knowledge.listCodeArtifacts(project.id), []);
  });

test("explicit recall returns validation failures to Pi without changing automatic recall policy",
  realOptions, async (t) => {
    // Arrange: real services and REST; fault injection only at the external HTTP boundary.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, options) => {
      const body = options?.body ? JSON.parse(String(options.body)) : undefined;
      if (body?.query === "rejected-query") {
        return Response.json({ error: [{ loc: ["query"], msg: "Use a more specific query",
          input: "private-echo-canary" }] }, { status: 400 });
      }
      return fetch(url, options);
    } });
    const recall = new RecallService(client, { complete: async () => ({
      search: false, queries: [], queryIntent: "", entities: [],
    }) });
    const { session, modelResults } = await createToolSession(t, baseUrl, [
      { name: "forgetful_recall", arguments: { query: " " } },
      { name: "forgetful_recall", arguments: { query: "rejected-query" } },
      { name: "forgetful_recall", arguments: { query: "specific query" } },
      { name: "forgetful_knowledge_read", arguments: { operation: "get_memory", memory_id: 999 } },
    ], undefined, { client, recall });
    // Act.
    await session.prompt("Correct failed foreground recall calls.");
    // Assert: failures aren't confused with a successful search that has no matches.
    const results = modelResults.at(-1)!;
    assert.equal(results[0]!.isError, true);
    assert.match(resultText(results[0]!), /query.*240/);
    assert.equal(results[1]!.isError, true);
    assert.match(resultText(results[1]!), /HTTP 400/);
    assert.match(resultText(results[1]!), /Use a more specific query/);
    assert.match(resultText(results[1]!), /private-echo-canary/);
    assert.equal(results[2]!.isError, false);
    assert.match(resultText(results[2]!), /No matching/);
    assert.equal(results[3]!.isError, true);
    assert.match(resultText(results[3]!), /HTTP 404: Memory not found/);
  });

test("Pi preserves server validation on all rich create/update routes and recovers on retry",
  realOptions, async (t) => {
    // Arrange: the actual server, not a mock, enforces a stricter tag count.
    const baseUrl = await startForgetful(t, {
      MEMORY_TAGS_MAX_COUNT: "1", ENTITY_TAGS_MAX_COUNT: "1",
      DOCUMENT_TAGS_MAX_COUNT: "1", CODE_ARTIFACT_TAGS_MAX_COUNT: "1",
    });
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Validation",
      description: "Server constraints", repo_name: "test/validation" });
    const memory = await client.create({ title: "Existing memory", content: "Existing fact",
      context: "Evidence", keywords: [], tags: [], project_ids: [project.id] });
    const entity = await client.knowledge.createEntity({ name: "Existing entity",
      entity_type: "System", tags: [], aka: [], project_ids: [project.id] });
    const document = await client.knowledge.createDocument({ title: "Existing document",
      description: "Architecture", content: "Flow", tags: [], project_id: project.id });
    const code = await client.knowledge.createCodeArtifact({ title: "Existing artifact",
      description: "Example", code: "const value = 1;", language: "typescript",
      tags: [], project_id: project.id });
    const operations = [
      { operation: "create_memory", title: "New memory", content: "New fact",
        context: "Evidence", keywords: [] },
      { operation: "create_entity", name: "New entity", entity_type: "System" },
      { operation: "create_document", title: "New document", description: "Architecture",
        content: "New flow" },
      { operation: "create_code_artifact", title: "New artifact", description: "Example",
        code: "const value = 2;", language: "typescript" },
      { operation: "update_memory", memory_id: memory.id },
      { operation: "update_entity", entity_id: entity.id },
      { operation: "update_document", document_id: document.id },
      { operation: "update_code_artifact", code_artifact_id: code.id },
    ];
    const { session, modelResults } = await createToolSession(t, baseUrl,
      operations.flatMap((operation) => [
        { name: "forgetful_knowledge_write", arguments: { ...operation, tags: ["one", "two"] } },
        { name: "forgetful_knowledge_write", arguments: { ...operation, tags: ["one"] } },
      ]));
    // Act.
    await session.prompt("Correct each rejected write using the server's validation feedback.");
    // Assert: the model sees field-level failures followed by successful corrected calls.
    const results = modelResults.at(-1)!;
    for (const [index, operation] of operations.entries()) {
      const rejected = results[index * 2]!;
      assert.equal(rejected.isError, true, operation.operation);
      assert.match(resultText(rejected), /HTTP 400.*tags.*1 item/s, operation.operation);
      const corrected = results[index * 2 + 1]!;
      assert.equal(corrected.isError, false, resultText(corrected));
    }
    assert.deepEqual((await client.get(memory.id)).tags, ["one"]);
    assert.deepEqual((await client.knowledge.getEntity(entity.id)).tags, ["one"]);
    assert.deepEqual((await client.knowledge.getDocument(document.id)).tags, ["one"]);
    assert.deepEqual((await client.knowledge.getCodeArtifact(code.id)).tags, ["one"]);
    assert.equal((await client.knowledge.listDocuments(project.id)).length, 2);
    assert.equal((await client.knowledge.listCodeArtifacts(project.id)).length, 2);
  });

test("all six Pi tools reject unknown arguments without echoing the submitted values",
  realOptions, async (t) => {
    // Arrange: typos and invented API fields must not silently disappear.
    const baseUrl = await startForgetful(t);
    const calls: ToolCall[] = [
      { name: "forgetful_project_init", arguments: { name: "Project", description: "Testing" } },
      { name: "forgetful_knowledge_read", arguments: { operation: "list_projects" } },
      { name: "forgetful_knowledge_write", arguments: {
        operation: "create_entity", name: "API", entity_type: "System",
      } },
      { name: "forgetful_recall", arguments: { query: "database" } },
      { name: "forgetful_recall_wait", arguments: {} },
      { name: "forgetful_resolve", arguments: { conflict_id: "unknown", action: "skip" } },
    ];
    const { session, modelResults } = await createToolSession(t, baseUrl,
      calls.map((call) => ({ ...call, arguments: {
        ...call.arguments, unexpected_argument: "private-submission-canary",
      } })));
    // Act.
    await session.prompt("Check rejected arguments.");
    // Assert: inspect exactly what the model receives, not just the extension callback.
    const results = modelResults.at(-1)!;
    assert.equal(results.length, 6);
    for (const result of results) {
      assert.equal(result.isError, true, result.toolName);
      assert.match(resultText(result), /unexpected_argument|additional propert/i);
      assert.doesNotMatch(resultText(result), /private-submission-canary|Received arguments/);
    }
  });

test("operation-specific validation tells the Pi model the missing field or exact constraint",
  realOptions, async (t) => {
    // Arrange: schemas are flat for provider compatibility; runtime checks narrow each operation.
    const baseUrl = await startForgetful(t);
    await new ApiForgetfulClient({ baseUrl }).createProject({
      name: "Validation", description: "Argument validation", repo_name: "test/validation",
    });
    const cases: Array<{ arguments: Record<string, unknown>; error: RegExp; write?: boolean }> = [
      { arguments: { operation: "search_memories", query: "fact" }, error: /query_context/ },
      { arguments: { operation: "search_entities", query: " " }, error: /query.*240/ },
      ...[
        ["get_memory", "memory_id"], ["get_entity", "entity_id"],
        ["get_entity_memories", "entity_id"], ["get_relationships", "entity_id"],
        ["get_document", "document_id"], ["get_code_artifact", "code_artifact_id"],
        ["get_file", "file_id"],
      ].map(([operation, field]) => ({ arguments: { operation }, error: new RegExp(field!) })),
      ...["list_projects", "list_documents", "list_code_artifacts", "list_files"].map(
        (operation) => ({ arguments: { operation, limit: 101 }, error: /limit.*100/ })),
      { write: true, arguments: { operation: "create_memory", title: "x".repeat(201),
        content: "Fact", context: "Evidence", keywords: [], tags: [] }, error: /title.*200/ },
      ...[
        ["create_memory", "title"], ["update_memory", "memory_id"],
        ["supersede_memory", "memory_id"], ["link_memories", "memory_id"],
        ["create_entity", "name"], ["update_entity", "entity_id"],
        ["link_entity_memory", "entity_id"], ["create_relationship", "source_entity_id"],
        ["create_document", "title"], ["update_document", "document_id"],
        ["create_code_artifact", "title"], ["update_code_artifact", "code_artifact_id"],
      ].map(([operation, field]) => ({ write: true, arguments: { operation },
        error: new RegExp(field!) })),
      { write: true, arguments: { operation: "create_entity", name: "API", entity_type: "system" },
        error: /entity_type.*System/ },
      { write: true, arguments: { operation: "update_entity", entity_id: 1, entity_type: "Other" },
        error: /custom_type/ },
      { write: true, arguments: { operation: "create_relationship", source_entity_id: 1,
        target_entity_id: 1, relationship_type: "depends_on" }, error: /must be different/ },
      { write: true, arguments: { operation: "link_memories", memory_id: 1,
        related_memory_ids: [1] }, error: /cannot link.*itself/i },
    ];
    const { session, modelResults } = await createToolSession(t, baseUrl, cases.map((item) => ({
      name: item.write ? "forgetful_knowledge_write" : "forgetful_knowledge_read",
      arguments: item.arguments,
    })));
    // Act.
    await session.prompt("Validate the tool submissions.");
    // Assert.
    const results = modelResults.at(-1)!;
    assert.equal(results.length, cases.length);
    for (const [index, item] of cases.entries()) {
      const result = results[index]!;
      assert.equal(result.isError, true, JSON.stringify(item.arguments));
      assert.match(resultText(result), item.error, JSON.stringify(item.arguments));
    }
  });
