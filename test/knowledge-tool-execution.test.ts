import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";

import { ApiForgetfulClient, ForgetfulHttpError } from "../src/http.ts";
import {
  executeKnowledgeWrite, type KnowledgeToolContext, type KnowledgeToolResult,
} from "../src/knowledge-tools.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

async function setup(t: TestContext) {
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
  const project = await client.createProject({ name: "Foreground", description: "Explicit writes",
    repo_name: "test/foreground" });
  const context: KnowledgeToolContext = { cwd: "/repo", repoName: "test/foreground",
    commit: "a".repeat(40), project, scope: "project" };
  const input = { title: "Architecture", content: "The API uses polling.",
    context: "Earlier decision", keywords: ["api"], tags: ["architecture"],
    project_ids: [project.id] };
  return { baseUrl, client, project, context, input };
}

function value(result: KnowledgeToolResult): Record<string, any> {
  const content = result.content.find((item) => item.type === "text");
  assert.ok(content?.type === "text");
  return JSON.parse(content.text);
}

test("foreground writes stop on revocation or cancellation during the final authorization GET",
  realOptions, async (t) => {
    // Arrange: real REST records, with revocation injected as the final GET returns.
    const { baseUrl, client, project, context, input } = await setup(t);
    const memory = await client.create(input);
    const replacement = await client.create({ ...input, title: "Replacement" });
    const otherMemory = await client.create({ ...input, title: "Other source" });
    const document = await client.knowledge.createDocument({ title: "Guide", description: "Doc",
      content: "Reference", tags: [], project_id: project.id });
    const artifact = await client.knowledge.createCodeArtifact({ title: "Example",
      description: "Code", code: "run()", language: "typescript", tags: [],
      project_id: project.id });
    const entity = await client.knowledge.createEntity({ name: "API", entity_type: "System",
      aka: [], tags: [], project_ids: [project.id] });
    const target = await client.knowledge.createEntity({ name: "DB", entity_type: "System",
      aka: [], tags: [], project_ids: [project.id] });
    const creation = { title: input.title, content: input.content, context: input.context,
      keywords: input.keywords, tags: input.tags, document_ids: [document.id] };
    const cases = [
      { request: { operation: "create_memory", ...creation },
        path: `/documents/${document.id}` },
      { request: { operation: "update_memory", memory_id: memory.id, content: "Correction" },
        path: `/memories/${memory.id}` },
      { request: { operation: "update_memory", memory_id: memory.id, ...creation },
        path: `/documents/${document.id}` },
      { request: { operation: "link_memories", memory_id: memory.id,
        related_memory_ids: [replacement.id] }, path: `/memories/${replacement.id}` },
      { request: { operation: "supersede_memory", memory_id: memory.id,
        replacement_memory_id: replacement.id, reason: "Correction", source_files: ["src/api.ts"] },
        path: `/memories/${replacement.id}` },
      { request: { operation: "supersede_memory", memory_id: otherMemory.id, ...creation,
        reason: "Correction", source_files: ["src/api.ts"] }, path: `/documents/${document.id}` },
      { request: { operation: "update_entity", entity_id: entity.id, notes: "Correction" },
        path: `/entities/${entity.id}` },
      { request: { operation: "link_entity_memory", entity_id: entity.id, memory_id: memory.id },
        path: `/memories/${memory.id}` },
      { request: { operation: "create_relationship", source_entity_id: entity.id,
        target_entity_id: target.id, relationship_type: "depends_on" },
        path: `/entities/${target.id}` },
      { request: { operation: "update_document", document_id: document.id, content: "Correction" },
        path: `/documents/${document.id}` },
      { request: { operation: "update_code_artifact", code_artifact_id: artifact.id,
        code: "correct()" }, path: `/code-artifacts/${artifact.id}` },
    ];
    for (const { request, path } of cases) {
      for (const stop of ["revocation", "cancellation"] as const) {
        await t.test(`${request.operation} ${stop} after ${path}`, async () => {
          const controller = new AbortController();
          let prepared = false;
          let revoked = false;
          const mutations: string[] = [];
          const observed = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000,
            fetchImpl: async (url, init) => {
              if (init?.method !== "GET") mutations.push(`${init?.method} ${url}`);
              const response = await fetch(url, init);
              if (prepared && init?.method === "GET" && String(url).endsWith(path)) {
                await response.clone().arrayBuffer();
                revoked = true;
                if (stop === "cancellation") controller.abort();
              }
              return response;
            } });

          // Act: the asynchronous guard succeeds; access changes during the final record read.
          const result = executeKnowledgeWrite(observed, request, context, controller.signal,
            async () => { assert.equal(revoked, false); prepared = true; },
            stop === "cancellation" ? undefined : () => {
              if (revoked) throw new Error("Session write access revoked.");
            });

          // Assert: no mutation request is dispatched, even when the last GET was authorized.
          await assert.rejects(result, stop === "cancellation"
            ? /cancelled|aborted/i : /Session write access revoked/);
          assert.equal(revoked, true);
          assert.deepEqual(mutations, []);
        });
      }
    }
  });

test("foreground update applies an explicit correction with different text", realOptions,
  async (t) => {
    // Arrange.
    const { client, context, input } = await setup(t);
    const memory = await client.create(input);

    // Act.
    const result = value(await executeKnowledgeWrite(client, {
      operation: "update_memory", memory_id: memory.id, title: "Corrected architecture",
      content: "The API uses events.", context: "Correction verified in source",
    }, context));

    // Assert through the public result and REST.
    assert.equal(result.status, "updated");
    assert.equal(result.memory.id, memory.id);
    const stored = await client.get(memory.id);
    assert.equal(stored.title, "Corrected architecture");
    assert.equal(stored.content, "The API uses events.");
    assert.equal(stored.context, "Correction verified in source");
    assert.deepEqual(stored.keywords, ["api"]);
    assert.deepEqual(stored.tags, ["architecture"]);
    assert.equal(stored.is_obsolete, false);
  });

test("foreground PUT replaces supplied attachment lists and leaves omitted fields untouched",
  realOptions, async (t) => {
    // Arrange: two of each attachment, including a file created through the public REST API.
    const { baseUrl, client, project, context, input } = await setup(t);
    const documents = [];
    const artifacts = [];
    const files = [];
    for (const title of ["First", "Second"]) {
      documents.push(await client.knowledge.createDocument({ title, description: title,
        content: "Reference", tags: [], project_id: project.id }));
      artifacts.push(await client.knowledge.createCodeArtifact({ title, description: title,
        code: "run()", language: "typescript", tags: [], project_id: project.id }));
      const response = await fetch(`${baseUrl}/files`, { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          filename: `${title}.txt`, description: title, mime_type: "text/plain",
          data: Buffer.from(title).toString("base64"), tags: [], project_id: project.id,
        }) });
      assert.equal(response.status, 201);
      files.push(await response.json() as { id: number });
    }
    const memory = await client.create({ ...input,
      document_ids: documents.map((item) => item.id),
      code_artifact_ids: artifacts.map((item) => item.id), file_ids: files.map((item) => item.id),
    });

    // Act: replace with the exact lists, including an empty list to detach every artifact.
    await executeKnowledgeWrite(client, { operation: "update_memory", memory_id: memory.id,
      document_ids: [documents[1]!.id], code_artifact_ids: [], file_ids: [files[1]!.id],
    }, context);

    // Assert: omitted references are removed, not unioned into the request.
    const stored = await client.get(memory.id);
    assert.deepEqual(stored.document_ids, [documents[1]!.id]);
    assert.deepEqual(stored.code_artifact_ids, []);
    assert.deepEqual(stored.file_ids, [files[1]!.id]);
    assert.equal(stored.content, input.content);
    await executeKnowledgeWrite(client, { operation: "update_memory", memory_id: memory.id,
      tags: ["corrected"],
    }, context);
    const untouched = await client.get(memory.id);
    assert.deepEqual(untouched.document_ids, [documents[1]!.id]);
    assert.deepEqual(untouched.code_artifact_ids, []);
    assert.deepEqual(untouched.file_ids, [files[1]!.id]);
  });

test("foreground creates execute even when names, aliases, titles or content match",
  realOptions, async (t) => {
    // Arrange.
    const { client, context, project, input } = await setup(t);
    const requests = [
      { operation: "create_memory", title: input.title, content: input.content,
        context: input.context, keywords: input.keywords, tags: input.tags },
      { operation: "create_entity", name: "API", entity_type: "System", aka: ["Gateway"] },
      { operation: "create_document", title: "Guide", description: "API guide",
        content: "Use events." },
      { operation: "create_code_artifact", title: "Handler", description: "API handler",
        code: "handle()", language: "typescript" },
    ];
    const keys = ["memory", "entity", "document", "code_artifact"];
    for (const [index, request] of requests.entries()) {
      await t.test(request.operation, async () => {
        const key = keys[index]!;
        const first = value(await executeKnowledgeWrite(client, request, context));

        // Act: exact repetition and a same-title/name request with changed content both create.
        const repeated = value(await executeKnowledgeWrite(client, request, context));
        const changed = value(await executeKnowledgeWrite(client, { ...request,
          ...(request.operation === "create_memory" ? { content: "Use a queue." } : {}),
          ...(request.operation === "create_entity" ? { notes: "Another API" } : {}),
          ...(request.operation === "create_document" ? { content: "Use a queue." } : {}),
          ...(request.operation === "create_code_artifact" ? { code: "enqueue()" } : {}),
        }, context));

        // Assert: every create returns a separate persisted identity.
        assert.equal(repeated.status, "created");
        assert.equal(changed.status, "created");
        assert.equal(new Set([first[key].id, repeated[key].id, changed[key].id]).size, 3);
        if (key === "memory") {
          assert.equal((await client.get(repeated.memory.id)).content, input.content);
          assert.equal((await client.get(changed.memory.id)).content, "Use a queue.");
        }
      });
    }
    const alias = value(await executeKnowledgeWrite(client, {
      operation: "create_entity", name: "Gateway", entity_type: "System",
    }, context));
    assert.equal(alias.status, "created");
    assert.equal((await client.knowledge.getEntity(alias.entity.id)).name, "Gateway");
    assert.equal((await client.knowledge.listDocuments(project.id)).length, 3);
    assert.equal((await client.knowledge.listCodeArtifacts(project.id)).length, 3);
  });

test("foreground supersession creates supplied content even when an exact memory exists",
  realOptions, async (t) => {
    // Arrange: the requested replacement even matches the memory being superseded.
    const { client, context, input } = await setup(t);
    const old = await client.create(input);

    // Act.
    const result = value(await executeKnowledgeWrite(client, { operation: "supersede_memory",
      memory_id: old.id, title: input.title, content: input.content, context: input.context,
      keywords: input.keywords, tags: input.tags, reason: "Explicit replacement requested",
      source_files: ["src/api.ts"],
    }, context));

    // Assert: matching content is never an instruction to reuse an ID.
    assert.equal(result.status, "superseded");
    assert.notEqual(result.replacement_memory_id, old.id);
    assert.equal((await client.get(old.id)).superseded_by, result.replacement_memory_id);
    const replacement = await client.get(result.replacement_memory_id);
    assert.equal(replacement.title, input.title);
    assert.equal(replacement.content, input.content);
    assert.equal(replacement.context, input.context);
  });

test("foreground supersession uses the supplied ID despite text changes during beforeWrite",
  realOptions, async (t) => {
    // Arrange: the chosen memory deliberately differs from the optional creation fields.
    const { client, context, input } = await setup(t);
    const old = await client.create(input);
    const selected = await client.create({ ...input, title: "Selected",
      content: "Selected claim" });
    const other = await client.create({ ...input, title: "Other", content: "Other claim" });

    // Act: while awaiting authorization, both selected records change but retain their scope.
    const result = value(await executeKnowledgeWrite(client, { operation: "supersede_memory",
      memory_id: old.id, replacement_memory_id: selected.id, title: "Other",
      content: "Other claim", reason: "Use the selected replacement", source_files: ["src/api.ts"],
    }, context, undefined, async () => {
      await client.knowledge.updateMemory(old.id, { content: "Concurrent old text" });
      await client.knowledge.updateMemory(selected.id, { content: "Concurrent replacement text" });
    }));

    // Assert: IDs and authorization decide execution; content equality does not.
    assert.equal(result.replacement_memory_id, selected.id);
    assert.equal((await client.get(old.id)).superseded_by, selected.id);
    assert.equal((await client.get(selected.id)).content, "Concurrent replacement text");
    assert.equal((await client.get(other.id)).is_obsolete, false);
  });

test("foreground supersession does not invent an omitted replacement title or context",
  realOptions, async (t) => {
    // Arrange.
    const { client, context, input } = await setup(t);
    const old = await client.create(input);
    const request = { operation: "supersede_memory", memory_id: old.id,
      content: "An explicit replacement claim", reason: "Correction",
      source_files: ["src/api.ts"] };

    // Act / Assert: normal create validation explains the missing original arguments.
    await assert.rejects(executeKnowledgeWrite(client, request, context), /title is required/);
    await assert.rejects(executeKnowledgeWrite(client, { ...request, title: "Replacement" },
      context), /context is required/);
    assert.equal((await client.get(old.id)).is_obsolete, false);
  });

test("foreground relationship CREATE returns the actual REST rejection for duplicates",
  realOptions, async (t) => {
    // Arrange: observe real HTTP responses without replacing the service or client behavior.
    const { baseUrl, client, project, context } = await setup(t);
    const source = await client.knowledge.createEntity({ name: "API", entity_type: "System",
      aka: [], tags: [], project_ids: [project.id] });
    const target = await client.knowledge.createEntity({ name: "DB", entity_type: "System",
      aka: [], tags: [], project_ids: [project.id] });
    const request = { operation: "create_relationship", source_entity_id: source.id,
      target_entity_id: target.id, relationship_type: "depends_on" };
    await executeKnowledgeWrite(client, request, context);
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

    // Act / Assert: a duplicate reaches Forgetful instead of becoming an "existing" result.
    await assert.rejects(executeKnowledgeWrite(observed, request, context), (error) => {
      assert.ok(error instanceof ForgetfulHttpError);
      assert.ok(actualBody);
      assert.equal(error.status, actualStatus);
      assert.equal(error.responseBody, actualBody);
      assert.ok(error.message.includes(actualBody));
      return true;
    });
    assert.equal((await client.knowledge.getRelationships(source.id)).length, 1);
  });

test("supersession rechecks authorization before creating a replacement after beforeWrite",
  realOptions, async (t) => {
    // Arrange.
    const { client, context, input, project } = await setup(t);
    const old = await client.create(input);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });

    // Act: the source loses authorization while the create guard is awaited.
    await assert.rejects(executeKnowledgeWrite(client, { operation: "supersede_memory",
      memory_id: old.id, title: "Replacement", content: "New claim", context: "Verified",
      keywords: [], tags: [], reason: "Correction", source_files: ["src/api.ts"],
    }, context, undefined, async () => {
      await client.knowledge.updateMemory(old.id, { project_ids: [foreign.id] });
    }), /outside the destination project/);

    // Assert: no replacement was created using authorization from before the guard.
    const remaining = await client.search({ query: "Replacement", query_context: "Verify no write",
      project_ids: [project.id], strict_project_filter: true, k: 20, include_links: false });
    assert.deepEqual(remaining, []);
    assert.equal((await client.get(old.id)).is_obsolete, false);
  });

test("supersession still rejects foreign, shared and obsolete IDs after beforeWrite",
  realOptions, async (t) => {
    // Arrange.
    const { client, context, input, project } = await setup(t);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });
    for (const target of ["old", "replacement"] as const) {
      for (const change of ["foreign", "shared", "obsolete"] as const) {
        const old = await client.create({ ...input, title: `${target} ${change} old` });
        const replacement = await client.create({ ...input, title: `${target} ${change} new` });
        const changedId = target === "old" ? old.id : replacement.id;

        // Act / Assert: scope and lifecycle restrictions survive removal of text comparisons.
        await assert.rejects(executeKnowledgeWrite(client, { operation: "supersede_memory",
          memory_id: old.id, replacement_memory_id: replacement.id, reason: "Correction",
          source_files: ["src/api.ts"],
        }, context, undefined, async () => {
          if (change === "obsolete") {
            const successor = await client.create({ ...input, title: "Concurrent successor" });
            await client.supersede(changedId, successor.id, "Concurrent supersession");
          } else {
            await client.knowledge.updateMemory(changedId, {
              project_ids: change === "foreign" ? [foreign.id] : [project.id, foreign.id],
            });
          }
        }), /outside the destination project|Shared memories|obsolete/);
        assert.notEqual((await client.get(old.id)).superseded_by, replacement.id);
      }
    }
  });

test("foreground updates preserve original argument, trust, scope and enablement checks",
  realOptions, async (t) => {
    // Arrange.
    const { client, context, input, project } = await setup(t);
    const memory = await client.create(input);
    const foreign = await client.createProject({ name: "Foreign", description: "Other scope",
      repo_name: "test/foreign" });
    const document = await client.knowledge.createDocument({ title: "Foreign", description: "Doc",
      content: "Evidence", tags: [], project_id: foreign.id });
    const request = { operation: "update_memory", memory_id: memory.id, content: "Correction" };

    // Act / Assert: reject original invalid inputs and unauthorized writes, without repair.
    await assert.rejects(executeKnowledgeWrite(client, { ...request, memory_id: `${memory.id}` },
      context), /positive integer/);
    await assert.rejects(executeKnowledgeWrite(client, { ...request, document_ids: ["1"] },
      context), /positive integer/);
    await assert.rejects(executeKnowledgeWrite(client, { ...request,
      content: "Bearer abcdef123456" }, context), /sensitive data/);
    await assert.rejects(executeKnowledgeWrite(client, { ...request, document_ids: [document.id] },
      context), /outside the destination project/);
    let enabled = true;
    await assert.rejects(executeKnowledgeWrite(client, request, context, undefined,
      async () => { enabled = false; },
      () => { if (!enabled) throw new Error("Forgetful is disabled."); }), /disabled/);
    assert.equal((await client.get(memory.id)).content, input.content);
    await assert.rejects(executeKnowledgeWrite(client, request, context, undefined, async () => {
      await client.knowledge.updateMemory(memory.id, { project_ids: [project.id, foreign.id] });
    }), /Shared memories/);
    assert.equal((await client.get(memory.id)).content, input.content);
  });
