import assert from "node:assert/strict";
import test from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { RecallService } from "../src/recall.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

test("private recall can read a missing stored memory before selecting its evidence", realOptions,
  async (t) => {
    // Arrange: there are more stored facts than the unchanged initial three-result search.
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
    const project = await client.createProject({ name: "Museum",
      description: "Isolated recall exploration", repo_name: "test/museum" });
    const stored: Array<{ id: number }> = [];
    for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday"]) {
      stored.push(await client.create({ title: `Museum visiting ${day}`,
        content: `${day} visits require a reservation; arrangements remain provisional.`,
        context: "Museum visits", keywords: ["museum"], tags: [], project_ids: [project.id] }));
    }
    let exploredId: number | undefined;
    let readPerformed = false;
    const service = new RecallService(client, {
      async complete(request) {
        if (request.purpose === "classification") return {
          search: true, queries: ["Museum visiting"], queryIntent: "Find visit arrangements",
          entities: [],
        };
        const input = request.input as { availableSources: { memoryIds: number[] } };
        exploredId = stored.find(({ id }) => !input.availableSources.memoryIds.includes(id))?.id;
        assert.ok(exploredId);
        assert.deepEqual(request.readTools?.map((tool) => tool.name), ["read_forgetful"]);
        const tool = request.readTools![0]!;
        const read = await tool.execute({ operation: "get_memory", memory_id: exploredId },
          request.signal!);
        readPerformed = true;
        assert.match(JSON.stringify(read), /arrangements remain provisional/);
        return request.submission!.validate({
          summary: "Visits require a reservation; arrangements remain provisional.",
          memoryIds: [exploredId], reason: "The requested stored record supplied the missing fact.",
        });
      },
    });

    // Act: the reviewer chooses a further read using only Forgetful, not repository sources.
    const result = await service.recall({ prompt: "What are the museum visit arrangements?",
      context: { cwd: "/unavailable", project, sessionId: "fresh", branchId: "main" },
      scope: "project", classificationPolicy: "Find history", recallPolicy: "Useful facts only",
      deadlineMs: 5_000 });

    // Assert: citation authority follows delivered content, not the initial search alone.
    assert.equal(readPerformed, true);
    assert.deepEqual(result.memoryIds, [exploredId]);
    assert.match(result.text, /arrangements remain provisional/);
  });

test("private recall cannot cite title-only leads or read another project's content", realOptions,
  async (t) => {
    // Arrange: only one project is authorized; both projects contain similar record titles.
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
    const project = await client.createProject({ name: "Garden",
      description: "Authorized records", repo_name: "test/garden" });
    const foreign = await client.createProject({ name: "Orchard",
      description: "Foreign records", repo_name: "test/orchard" });
    const entity = await client.knowledge.createEntity({ name: "Planting",
      entity_type: "System", tags: [], aka: [], project_ids: [project.id] });
    const documents = await client.knowledge.createDocument({ title: "Planting dates",
      description: "Dates requiring inspection", content: "The seedlings move outside in May.",
      tags: [], project_id: project.id });
    const seed = await client.create({ title: "Garden plan", content: "Planting is seasonal.",
      context: "Garden planning", keywords: ["garden"], tags: [], project_ids: [project.id] });
    const hidden = await client.create({ title: "Orchard plan", content: "FOREIGN_MARKER",
      context: "Orchard planning", keywords: [], tags: [], project_ids: [foreign.id] });
    let checksCompleted = false;
    const service = new RecallService(client, {
      async complete(request) {
        if (request.purpose === "classification") return { search: true,
          queries: ["garden"], entities: [], queryIntent: "Find planting dates" };
        const tool = request.readTools![0]!;
        await assert.rejects(tool.execute({ operation: "get_memory", memory_id: hidden.id },
          request.signal!), /outside the current project/);
        await assert.rejects(tool.execute({ operation: "update_memory", memory_id: seed.id,
          content: "Must not write" }, request.signal!), /operation/);
        const listed = await tool.execute({ operation: "list_documents" }, request.signal!);
        assert.match(JSON.stringify(listed), /Planting dates/);
        assert.throws(() => request.submission!.validate({ summary: "Plants move in May.",
          memoryIds: [], documentIds: [documents.id], reason: "Only the title was read." }),
        /availableSources/);
        const read = await tool.execute({ operation: "get_document", document_id: documents.id },
          request.signal!);
        assert.match(JSON.stringify(read), /seedlings move outside in May/);
        // Uninspected entity metadata is not implicitly accepted as evidence either.
        assert.throws(() => request.submission!.validate({ summary: "Planting has a schedule.",
          memoryIds: [], entityIds: [entity.id], reason: "Uninspected ID" }), /availableSources/);
        checksCompleted = true;
        return request.submission!.validate({ summary: "The seedlings move outside in May.",
          memoryIds: [], documentIds: [documents.id],
          reason: "The stored document supplies dates." });
      },
    });

    // Act.
    const result = await service.recall({ prompt: "When can the seedlings move outside?",
      context: { cwd: "/unavailable", project, sessionId: "fresh", branchId: "main" },
      scope: "project", classificationPolicy: "Find history", recallPolicy: "Useful facts only",
      deadlineMs: 5_000 });

    // Assert: reads do not widen scope or turn into writes; only delivered content is citable.
    assert.equal(checksCompleted, true);
    assert.deepEqual(result.documentIds, [documents.id]);
    assert.deepEqual(result.memoryIds, []);
    assert.doesNotMatch(result.text, /FOREIGN_MARKER/);
    assert.equal((await client.get(seed.id)).content, "Planting is seasonal.");
  });

test("private recall can explore documents when the first memory search is empty", realOptions,
  async (t) => {
    // Arrange: useful history exists only as a stored document, not an atomic memory.
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
    const project = await client.createProject({ name: "Accessibility",
      description: "Document-only history", repo_name: "test/accessibility" });
    const document = await client.knowledge.createDocument({ title: "Workshop access",
      description: "Access arrangements", content: "The workshop uses the step-free east entrance.",
      tags: [], project_id: project.id });
    let reviewed = false;
    const service = new RecallService(client, {
      async complete(request) {
        if (request.purpose === "classification") return { search: true,
          queries: ["workshop entrance"], entities: [], queryIntent: "Find access arrangements" };
        const tool = request.readTools![0]!;
        const list = await tool.execute({ operation: "list_documents" }, request.signal!);
        assert.match(JSON.stringify(list), /Workshop access/);
        await tool.execute({ operation: "get_document", document_id: document.id },
          request.signal!);
        reviewed = true;
        return request.submission!.validate({
          summary: "The workshop uses the step-free east entrance.", memoryIds: [],
          documentIds: [document.id], reason: "The stored workshop arrangement answers the gap.",
        });
      },
    });

    // Act.
    const result = await service.recall({ prompt: "Which entrance is accessible for the workshop?",
      context: { cwd: "/unavailable", project, sessionId: "fresh", branchId: "main" },
      scope: "project", classificationPolicy: "Find history", recallPolicy: "Useful facts only",
      deadlineMs: 5_000 });

    // Assert: an empty first search is not a code-owned decision that nothing useful exists.
    assert.equal(reviewed, true);
    assert.deepEqual(result.documentIds, [document.id]);
    assert.match(result.text, /step-free east entrance/);
  });

test("private exploration retains the project discovered from the repository mapping", realOptions,
  async (t) => {
    // Arrange: Pi supplies only the repository; scope resolution discovers its real project.
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
    const project = await client.createProject({ name: "Archive", repo_name: "test/archive",
      description: "Discovered project" });
    const other = await client.createProject({ name: "Other", repo_name: "test/other",
      description: "Unauthorized project" });
    const memory = await client.create({ title: "Archive access",
      content: "The archive opens by appointment.", context: "Visitor arrangements",
      keywords: [], tags: [], project_ids: [project.id] });
    const foreign = await client.create({ title: "Elsewhere", content: "Foreign arrangement.",
      context: "Other project", keywords: [], tags: [], project_ids: [other.id] });
    let inspected = false;
    const service = new RecallService(client, { async complete(request) {
      if (request.purpose === "classification") return { search: true, queries: ["archive"],
        queryIntent: "Find access arrangements", entities: [] };
      const tool = request.readTools![0]!;
      const record = await tool.execute({ operation: "get_memory", memory_id: memory.id },
        request.signal!);
      assert.match(JSON.stringify(record), /opens by appointment/);
      await assert.rejects(tool.execute({ operation: "get_memory", memory_id: foreign.id },
        request.signal!), /outside the current project/);
      inspected = true;
      return request.submission!.validate({ summary: "The archive opens by appointment.",
        memoryIds: [memory.id], reason: "Direct stored record" });
    } });

    // Act: initial retrieval and subsequent reads share the same resolved authorization.
    const result = await service.recall({ prompt: "How can I visit the archive?",
      context: { cwd: "/unavailable", repoName: "test/archive",
        sessionId: "fresh", branchId: "main" }, scope: "project",
      classificationPolicy: "Find relevant history", recallPolicy: "Keep useful qualifications",
      deadlineMs: 5_000 });

    // Assert.
    assert.equal(inspected, true, result.diagnostic);
    assert.deepEqual(result.memoryIds, [memory.id]);
    assert.match(result.text, /opens by appointment/);
  });

test("private reviewer receives full service failure apart from bounded diagnostics", realOptions,
  async (t) => {
    // Arrange: the display diagnostic is short; a later field error still matters to the model.
    const baseUrl = await startForgetful(t);
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Gallery", repo_name: "test/gallery",
      description: "Search failure recovery" });
    const document = await setup.knowledge.createDocument({ title: "Gallery entry",
      description: "Entry arrangements", content: "The gallery requires timed entry tickets.",
      tags: [], project_id: project.id });
    const body = "Search is unavailable. " + "Detailed service diagnostic. ".repeat(60) +
      "ACTUAL_SERVICE_ERROR_TAIL";
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) =>
      String(url).endsWith("/memories/search")
        ? new Response(body, { status: 503, statusText: "Service Unavailable" })
        : fetch(url, init) });
    let fullFailureReceived = false;
    const service = new RecallService(client, { async complete(request) {
      if (request.purpose === "classification") return { search: true, queries: ["gallery"],
        queryIntent: "Find entry arrangements", entities: [] };
      const input = request.input as { searchFailure?: { status?: number; message?: string };
        searchDiagnostic: string };
      assert.equal(input.searchFailure?.status, 503);
      assert.match(input.searchFailure?.message ?? "", /ACTUAL_SERVICE_ERROR_TAIL/);
      assert.ok(input.searchDiagnostic.length < body.length);
      fullFailureReceived = true;
      await request.readTools![0]!.execute({ operation: "get_document", document_id: document.id },
        request.signal!);
      return request.submission!.validate({ summary: "The gallery requires timed entry tickets.",
        memoryIds: [], documentIds: [document.id], reason: "Stored entry procedure was read." });
    } });

    // Act: the same reviewer gets the failure and chooses a working read operation.
    const result = await service.recall({ prompt: "How do I enter the gallery?",
      context: { cwd: "/unavailable", project, sessionId: "fresh", branchId: "main" },
      scope: "project", classificationPolicy: "Find history", recallPolicy: "Useful facts",
      deadlineMs: 5_000 });

    // Assert: full error reaches review; only reviewed useful context reaches the main agent.
    assert.equal(fullFailureReceived, true, result.diagnostic);
    assert.deepEqual(result.documentIds, [document.id]);
    assert.match(result.text, /requires timed entry tickets/);
    assert.doesNotMatch(result.text, /Detailed service diagnostic/);
  });
