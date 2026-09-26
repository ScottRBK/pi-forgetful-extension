import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateToolArguments } from "@earendil-works/pi-ai/utils/validation";

import type {
  CodeArtifact, CodeArtifactInput, Document, DocumentInput, Entity, EntityInput,
  EntityRelationshipInput, ForgetfulClient, Memory, MemoryInput, Project,
} from "../src/contracts.ts";
import { bundledSkillPaths } from "../src/encode.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import {
  executeKnowledgeRead,
  executeKnowledgeWrite,
  KNOWLEDGE_READ_PARAMETERS,
  validateKnowledgeReadRequest,
  type KnowledgeToolContext,
  type KnowledgeWriteRequest,
} from "../src/knowledge-tools.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const knowledgeReadTool = {
  name: "forgetful_knowledge_read",
  description: "test",
  parameters: KNOWLEDGE_READ_PARAMETERS,
};

function piRead(args: Record<string, unknown>) {
  return validateToolArguments(knowledgeReadTool, {
    type: "toolCall", id: "t", name: knowledgeReadTool.name, arguments: args,
  });
}

function piThenRuntime(args: Record<string, unknown>) {
  return validateKnowledgeReadRequest(piRead(args));
}

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
  assert.throws(
    () => validateKnowledgeReadRequest({ operation: "get_relationships" }),
    /entity_id is required/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({
      operation: "search_memories", query: "database", query_context: "Test", limit: 3,
    }),
    /uses k.*limit is not supported/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({ operation: "search_memories", query: "database" }),
    /query_context is required/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({
      operation: "search_memories", query: "database", query_context: "Test", offset: 0,
    }),
    /does not support offset/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({
      operation: "search_memories", query: "database", query_context: "Test", k: 21,
    }),
    /at most 20/,
  );
  assert.throws(
    () => validateKnowledgeReadRequest({
      operation: "search_memories", query: "database", query_context: "Test",
      include_links: "invalid",
    }),
    /include_links must be a boolean/,
  );
});

test("knowledge read ignores leftover search fields on other operations", () => {
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "list_projects", k: 3, include_links: true, max_links_per_primary: 5,
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "search_entities", query: "API", k: 3,
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "get_memory", memory_id: 1, k: 3, include_links: false,
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "list_projects", k: 21,
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "get_memory", memory_id: 1, k: "invalid",
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "search_entities", query: "API", include_links: "invalid",
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "search_entities", query: "API", query_context: "",
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "list_projects", k: [],
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "get_memory", memory_id: 1, max_links_per_primary: {},
  }));
  assert.doesNotThrow(() => validateKnowledgeReadRequest({
    operation: "search_entities", query: "API", include_links: [],
  }));
});

test("Pi schema accepts leftover search fields on other knowledge read operations", () => {
  assert.doesNotThrow(() => piThenRuntime({ operation: "list_projects", k: 21 }));
  assert.doesNotThrow(() => piThenRuntime({
    operation: "get_memory", memory_id: 1, k: "invalid",
  }));
  assert.doesNotThrow(() => piThenRuntime({
    operation: "search_entities", query: "API", include_links: "invalid",
  }));
  assert.doesNotThrow(() => piThenRuntime({
    operation: "search_entities", query: "API", query_context: "",
  }));
  assert.doesNotThrow(() => piThenRuntime({ operation: "list_projects", k: [] }));
  assert.doesNotThrow(() => piThenRuntime({
    operation: "get_memory", memory_id: 1, max_links_per_primary: {},
  }));
  assert.doesNotThrow(() => piThenRuntime({
    operation: "search_entities", query: "API", include_links: [],
  }));
});

test("forgetful-recall skill guidance does not advertise removed search length caps", () => {
  assert.doesNotThrow(() => piThenRuntime({
    operation: "search_memories", query: "q".repeat(241), query_context: "c".repeat(501),
  }), "query/query_context are no longer length-capped by the schema");

  const skillPath = bundledSkillPaths().find((path) => path.includes("forgetful-recall"));
  const skillText = readFileSync(skillPath!, "utf8");
  assert.ok(
    !/240 characters/.test(skillText) && !/500 characters/.test(skillText),
    "SKILL.md must not claim query/query_context length caps that the schema no longer enforces",
  );
});

test(
  "cross-project writes reject missing and unassigned destinations before searching",
  async () => {
    // Arrange: Forgetful exposes the requested project, but it has no repository assignment.
    const projects: Project[] = [{ id: 7, name: "Current", repo_name: "test/tools" },
      { id: 9, name: "Unassigned", repo_name: null }];
    let searches = 0;
    let creates = 0;
    const client = {
      knowledge: {},
      async listProjects() { return projects; },
      async search() { searches += 1; return []; },
      async create(input: MemoryInput) {
        creates += 1;
        return { id: 1, ...input, is_obsolete: false };
      },
    } as unknown as ForgetfulClient;

    // Act and assert: destination validation stops before overlap checks or mutation.
    await assert.rejects(executeKnowledgeWrite(client, {
      operation: "create_memory", project_id: 9,
      title: "Unassigned destination", content: "This write must not be redirected.",
      context: "Cross-project validation", keywords: [], tags: [],
    }, context(7)), /not assigned to a repository/);
    await assert.rejects(executeKnowledgeWrite(client, {
      operation: "create_memory", project_id: 99,
      title: "Missing destination", content: "This write must not be redirected.",
      context: "Cross-project validation", keywords: [], tags: [],
    }, context(7)), /not found or is unavailable/);
    assert.equal(searches, 0);
    assert.equal(creates, 0);
  },
);

test("knowledge writes use the default or explicit project consistently", async () => {
  // Arrange: explicit creates use the chosen project, without an inferred overlap decision.
  const searched: number[][] = [];
  const created: number[][] = [];
  const projects: Project[] = [{ id: 9, name: "Target", repo_name: "test/target" }];
  const client = {
    knowledge: {},
    async listProjects() { return projects; },
    async search(input: { project_ids?: number[] }) {
      searched.push(input.project_ids ?? []);
      return [];
    },
    async create(input: MemoryInput) {
      created.push(input.project_ids);
      return { id: created.length, ...input, is_obsolete: false };
    },
  } as unknown as ForgetfulClient;
  const request = {
    operation: "create_memory", title: "Scoped destination",
    content: "Overlap and mutation must use one project.",
    context: "Cross-project validation", keywords: [], tags: [],
  };

  // Act: omit the destination once, then explicitly select another assigned project.
  await executeKnowledgeWrite(client, request, context(7));
  await executeKnowledgeWrite(client, { ...request, project_id: 9 }, context(7));

  // Assert.
  assert.deepEqual(searched, [], "Creates must not infer reuse from search results");
  assert.deepEqual(created, [[7], [9]]);
});

test("cross-project writes reject an ambiguous destination before searching", async () => {
  // Arrange: two distinct projects are both mapped to the same repository.
  const projects: Project[] = [
    { id: 9, name: "First", repo_name: "test/shared" },
    { id: 10, name: "Second", repo_name: "test/shared" },
  ];
  let searches = 0;
  const client = {
    knowledge: {},
    async listProjects() { return projects; },
    async search() { searches += 1; return []; },
    async create(input: MemoryInput) { return { id: 1, ...input, is_obsolete: false }; },
  } as unknown as ForgetfulClient;

  // Act and assert: the extension refuses to guess between projects sharing a repository.
  await assert.rejects(executeKnowledgeWrite(client, {
    operation: "create_memory", project_id: 9,
    title: "Ambiguous destination", content: "No project may be guessed.",
    context: "Cross-project validation", keywords: [], tags: [],
  }, context(7)), /ambiguous/);
  assert.equal(searches, 0);
});

test("cross-project writes reject a reassigned destination before mutation", async () => {
  // Arrange: the project ID remains valid but is remapped after the overlap search.
  let projectReads = 0;
  let creates = 0;
  const client = {
    knowledge: {},
    async listProjects() {
      projectReads += 1;
      const repo_name = projectReads === 1 ? "test/target" : "test/reassigned";
      return [{ id: 9, name: "Target", repo_name }];
    },
    async search() { return []; },
    async create(input: MemoryInput) {
      creates += 1;
      return { id: 1, ...input, is_obsolete: false };
    },
  } as unknown as ForgetfulClient;

  // Act and assert: a stable numeric ID cannot hide a changed repository assignment.
  await assert.rejects(executeKnowledgeWrite(client, {
    operation: "create_memory", project_id: 9,
    title: "Reassigned destination", content: "The mapping must remain stable.",
    context: "Cross-project validation", keywords: [], tags: [],
  }, context(7)), /destination project changed/i);
  assert.equal(projectReads, 2);
  assert.equal(creates, 0);
});

test("cross-project writes revalidate the destination immediately before mutation", async () => {
  // Arrange: the destination disappears after resolution and overlap search.
  const assigned: Project[] = [{ id: 9, name: "Target", repo_name: "test/target" }];
  let projectReads = 0;
  let creates = 0;
  const client = {
    knowledge: {},
    async listProjects() {
      projectReads += 1;
      return projectReads === 1 ? assigned : [];
    },
    async search() { return []; },
    async create(input: MemoryInput) {
      creates += 1;
      return { id: 1, ...input, is_obsolete: false };
    },
  } as unknown as ForgetfulClient;

  // Act and assert: stale validation cannot authorize a later mutation.
  await assert.rejects(executeKnowledgeWrite(client, {
    operation: "create_memory", project_id: 9,
    title: "Changed destination", content: "The target must still be assigned.",
    context: "Cross-project validation", keywords: [], tags: [],
  }, context(7)), /not found or is unavailable/);
  assert.equal(projectReads, 2);
  assert.equal(creates, 0);
});

test(
  "list_projects allows an exact repo_name lookup outside the current repository in project " +
  "scope",
  async () => {
    // Arrange: the target project lives under a different repository than the current one.
    const target: Project[] = [{ id: 9, name: "Target", repo_name: "test/target" }];
    let queriedRepoName: string | undefined;
    const client = {
      knowledge: {},
      async listProjects(repoName?: string) {
        queriedRepoName = repoName;
        return repoName === "test/target" ? target : [];
      },
    } as unknown as ForgetfulClient;

    // Act: request the destination project's metadata by its exact repository name.
    const result = value(await executeKnowledgeRead(client, {
      operation: "list_projects", repo_name: "test/target",
    }, context(7)));

    // Assert: the verified destination project is discoverable, not rejected.
    assert.equal(queriedRepoName, "test/target");
    assert.deepEqual(result.items, target);
  },
);

test(
  "list_projects filters out unrelated repos when the server over-returns on a cross-repo lookup",
  async () => {
    // Arrange: a nonconforming/stale server ignores the repo_name filter and returns extras.
    const target: Project = { id: 9, name: "Target", repo_name: "test/target" };
    const unrelated: Project = { id: 11, name: "Unrelated", repo_name: "test/unrelated" };
    const client = {
      knowledge: {},
      async listProjects() { return [target, unrelated]; },
    } as unknown as ForgetfulClient;

    // Act: request the destination project's metadata by its exact repository name.
    const result = value(await executeKnowledgeRead(client, {
      operation: "list_projects", repo_name: "test/target",
    }, context(7)));

    // Assert: only the exact repo_name match is returned, not the unrelated project.
    assert.deepEqual(result.items, [target]);
  },
);

test(
  "list_projects with no repo_name stays limited to the current project in project scope",
  async () => {
    // Arrange: Forgetful holds both the current project and another one in the same repo.
    const projects: Project[] = [
      { id: 7, name: "Current", repo_name: "test/tools" },
      { id: 8, name: "Other", repo_name: "test/tools" },
    ];
    const client = {
      knowledge: {},
      async listProjects() { return projects; },
    } as unknown as ForgetfulClient;

    // Act: list projects without an explicit repo_name.
    const result = value(await executeKnowledgeRead(client, {
      operation: "list_projects",
    }, context(7)));

    // Assert: only the current project is returned.
    assert.deepEqual(result.items, [projects[0]]);
  },
);

test(
  "foreground memory search returns the server's grouped query metadata",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const project = await client.createProject({
      name: "Grouped", description: "Grouped search", repo_name: "test/grouped",
    });
    await client.create({
      title: "Grouped query memory", content: "The grouped REST result is complete.",
      context: "Foreground search", keywords: ["grouped"], tags: [], project_ids: [project.id],
    });

    const result = value(await executeKnowledgeRead(client, {
      operation: "search_memories", query: "grouped REST result",
      query_context: "Verify grouped foreground search", k: 3,
    }, context(project.id)));

    assert.equal(typeof result.query, "string");
    assert.ok(Array.isArray(result.primary_memories));
    assert.ok(Array.isArray(result.linked_memories));
    assert.equal(typeof result.total_count, "number");
    assert.equal(typeof result.token_count, "number");
    assert.equal(typeof result.truncated, "boolean");
    assert.ok((result.primary_memories as Array<{ content: string }>).some(
      (item) => item.content.includes("grouped REST result"),
    ));
  },
);

test("entity updates reject coercible types before preparing a write", realOptions, async (t) => {
  const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t), timeoutMs: 4_000 });
  const project = await client.createProject({
    name: "Types", description: "Type validation", repo_name: "test/tools",
  });
  const entity = await client.knowledge.createEntity({
    name: "API", entity_type: "System", project_ids: [project.id], tags: [], aka: [],
  });
  let preparedWrites = 0;

  await assert.rejects(executeKnowledgeWrite(client, {
    operation: "update_entity", entity_id: entity.id, entity_type: ["System"],
  }, context(project.id), undefined, async () => { preparedWrites += 1; }),
  /invalid/);

  assert.equal(preparedWrites, 0);
  assert.equal((await client.knowledge.getEntity(entity.id)).entity_type, "System");
});

test("explicit destinations cover update, link, and supersede write families",
  realOptions, async (t) => {
    // Arrange: seed target-owned records while the active context belongs to another project.
    const client = new ApiForgetfulClient({
      baseUrl: await startForgetful(t), timeoutMs: 4_000,
    });
    const source = await client.createProject({
      name: "Source", description: "Active source", repo_name: "test/source",
    });
    const target = await client.createProject({
      name: "Target", description: "Explicit destination", repo_name: "test/target",
    });
    const document = await client.knowledge.createDocument({
      title: "Original", description: "Target document", content: "Original content",
      tags: [], project_id: target.id, source_repo: "test/target",
      source_files: ["target.md"], encoding_version: "b".repeat(40),
    });
    const entity = await client.knowledge.createEntity({
      name: "Target API", entity_type: "System", tags: [], aka: [], project_ids: [target.id],
    });
    const old = await client.create({
      title: "Old target claim", content: "The old claim.", context: "Target history",
      keywords: [], tags: [], project_ids: [target.id],
    });
    const related = await client.create({
      title: "Related target claim", content: "Supporting context.", context: "Target history",
      keywords: [], tags: [], project_ids: [target.id],
    });
    const duplicate = await client.create({
      title: "Existing target claim", content: "Keep target provenance.",
      context: "Target history", keywords: [], tags: [], project_ids: [target.id],
      source_repo: "test/target", source_files: ["target.md"],
      encoding_version: "b".repeat(40),
    });
    const active = context(source.id);

    // Act: exercise representative mutation families through one explicit destination.
    await executeKnowledgeWrite(client, {
      operation: "update_document", project_id: target.id, document_id: document.id,
      title: "Updated target document",
    }, active);
    await executeKnowledgeWrite(client, {
      operation: "link_entity_memory", project_id: target.id,
      entity_id: entity.id, memory_id: old.id,
    }, active);
    await executeKnowledgeWrite(client, {
      operation: "link_memories", project_id: target.id,
      memory_id: old.id, related_memory_ids: [related.id],
    }, active);
    await executeKnowledgeWrite(client, {
      operation: "supersede_memory", project_id: target.id, memory_id: old.id,
      title: "Current target claim", content: "The current claim.",
      context: "Target history", keywords: [], tags: [],
      reason: "The source now proves the current claim.", source_files: ["README.md"],
    }, active);
    await executeKnowledgeWrite(client, {
      operation: "create_memory", project_id: target.id,
      title: "Existing target claim", content: "Keep target provenance.",
      context: "Target history", keywords: [], tags: [], source_files: ["source.md"],
    }, active);

    // Assert: each operation stayed within the explicit target project.
    const updatedDocument = await client.knowledge.getDocument(document.id);
    assert.equal(updatedDocument.title, "Updated target document");
    assert.equal(updatedDocument.source_repo, "test/target");
    assert.deepEqual(updatedDocument.source_files, ["target.md"]);
    assert.equal(updatedDocument.encoding_version, "b".repeat(40));
    const reused = await client.get(duplicate.id);
    assert.equal(reused.source_repo, "test/target");
    assert.deepEqual(reused.source_files, ["target.md"]);
    assert.equal(reused.encoding_version, "b".repeat(40));
    assert.deepEqual((await client.knowledge.getEntityMemories(entity.id)).map((item) => item.id),
      [old.id]);
    assert.ok((await client.get(old.id)).linked_memory_ids?.includes(related.id));
    assert.equal((await client.get(old.id)).is_obsolete, true);
  });

function raceKnowledgeClient(seed: {
  memories?: Map<number, Memory>;
  entities?: Map<number, Entity>;
  documents?: Map<number, Document>;
  codeArtifacts?: Map<number, CodeArtifact>;
  searchResults?: Memory[];
}): { client: ForgetfulClient; mutations: string[] } {
  const memories = seed.memories ?? new Map<number, Memory>();
  const entities = seed.entities ?? new Map<number, Entity>();
  const documents = seed.documents ?? new Map<number, Document>();
  const codeArtifacts = seed.codeArtifacts ?? new Map<number, CodeArtifact>();
  const mutations: string[] = [];
  let nextMemoryId = 1000;
  const client = {
    knowledge: {
      async getEntity(id: number) {
        const found = entities.get(id);
        if (!found) throw new Error("Entity not found.");
        return found;
      },
      async updateEntity(id: number, input: Partial<EntityInput>) {
        mutations.push("updateEntity");
        const next = { ...entities.get(id)!, ...input } as Entity;
        entities.set(id, next);
        return next;
      },
      async linkEntityMemory() { mutations.push("linkEntityMemory"); },
      async getEntityMemories() { return []; },
      async getRelationships() { return []; },
      async createRelationship(input: EntityRelationshipInput) {
        mutations.push("createRelationship");
        return { id: 900, ...input };
      },
      async getDocument(id: number) {
        const found = documents.get(id);
        if (!found) throw new Error("Document not found.");
        return found;
      },
      async updateDocument(id: number, input: Partial<DocumentInput>) {
        mutations.push("updateDocument");
        const next = { ...documents.get(id)!, ...input } as Document;
        documents.set(id, next);
        return next;
      },
      async getCodeArtifact(id: number) {
        const found = codeArtifacts.get(id);
        if (!found) throw new Error("Code artifact not found.");
        return found;
      },
      async updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>) {
        mutations.push("updateCodeArtifact");
        const next = { ...codeArtifacts.get(id)!, ...input } as CodeArtifact;
        codeArtifacts.set(id, next);
        return next;
      },
      async updateMemory(id: number, input: Partial<MemoryInput>) {
        mutations.push("updateMemory");
        const next = { ...memories.get(id)!, ...input } as Memory;
        memories.set(id, next);
        return next;
      },
      async linkMemories() { mutations.push("linkMemories"); },
    },
    async listProjects() { return []; },
    async get(id: number) {
      const found = memories.get(id);
      if (!found) throw new Error("Memory not found.");
      return found;
    },
    async search() { return seed.searchResults ?? []; },
    async create(input: MemoryInput) {
      mutations.push("create");
      const id = nextMemoryId++;
      const record = { id, ...input, is_obsolete: false } as Memory;
      memories.set(id, record);
      return record;
    },
    async supersede() { mutations.push("supersede"); },
  } as unknown as ForgetfulClient;
  return { client, mutations };
}

const raceTarget = 1;
const raceElsewhere = 2;
const raceContext = context(raceTarget);

function raceMemory(id: number, overrides: Partial<Memory> = {}): Memory {
  return {
    id, title: "Race memory", content: "Original content", context: "race",
    keywords: [], tags: [], project_ids: [raceTarget], is_obsolete: false, ...overrides,
  };
}

function raceEntity(id: number, overrides: Partial<Entity> = {}): Entity {
  return {
    id, name: "Race entity", entity_type: "System", tags: [], aka: [],
    project_ids: [raceTarget], ...overrides,
  };
}

interface RaceCase {
  name: string;
  build(): {
    client: ForgetfulClient;
    mutations: string[];
    request: KnowledgeWriteRequest;
    race(): void;
    allowedMutations?: string[];
  };
}

async function runRaceCases(cases: RaceCase[]): Promise<void> {
  // Act and assert: each write family must re-check the record and attachments it is about
  // to mutate using state read after the destination-revalidation round trip, not a snapshot
  // read before that network call.
  for (const testCase of cases) {
    const { client, mutations, request, race, allowedMutations } = testCase.build();
    let raced = false;
    await assert.rejects(
      executeKnowledgeWrite(client, request, raceContext, undefined, async () => {
        if (!raced) {
          raced = true;
          race();
        }
      }),
      /outside the destination project|changed while preparing/i,
      testCase.name,
    );
    assert.deepEqual(
      mutations, allowedMutations ?? [],
      `${testCase.name} must not mutate using state read before the destination revalidated`,
    );
  }
}

test(
  "update, link, and relationship writes reject records moved during the destination " +
  "revalidation gap",
  async () => {
    // Arrange: every case starts a record inside the target project and moves it to a
    // sibling project from within the beforeWrite hook, simulating another client's write
    // landing during the network round trip that revalidates the destination.
    const cases: RaceCase[] = [
      {
        name: "update_memory",
        build() {
          const memories = new Map([[1, raceMemory(1)]]);
          const { client, mutations } = raceKnowledgeClient({ memories });
          return {
            client, mutations,
            request: { operation: "update_memory", memory_id: 1, tags: ["updated"] },
            race: () => memories.set(1, { ...memories.get(1)!, project_ids: [raceElsewhere] }),
          };
        },
      },
      {
        name: "link_memories",
        build() {
          const memories = new Map([[1, raceMemory(1)], [2, raceMemory(2)]]);
          const { client, mutations } = raceKnowledgeClient({ memories });
          return {
            client, mutations,
            request: { operation: "link_memories", memory_id: 1, related_memory_ids: [2] },
            race: () => memories.set(2, { ...memories.get(2)!, project_ids: [raceElsewhere] }),
          };
        },
      },
      {
        name: "update_entity",
        build() {
          const entities = new Map([[1, raceEntity(1)]]);
          const { client, mutations } = raceKnowledgeClient({ entities });
          return {
            client, mutations,
            request: { operation: "update_entity", entity_id: 1, notes: "updated" },
            race: () => entities.set(1, { ...entities.get(1)!, project_ids: [raceElsewhere] }),
          };
        },
      },
      {
        name: "link_entity_memory",
        build() {
          const entities = new Map([[1, raceEntity(1)]]);
          const memories = new Map([[1, raceMemory(1)]]);
          const { client, mutations } = raceKnowledgeClient({ entities, memories });
          return {
            client, mutations,
            request: { operation: "link_entity_memory", entity_id: 1, memory_id: 1 },
            race: () => entities.set(1, { ...entities.get(1)!, project_ids: [raceElsewhere] }),
          };
        },
      },
      {
        name: "update_document",
        build() {
          const documents = new Map<number, Document>([[1, {
            id: 1, title: "Race document", description: "Race", content: "Original",
            tags: [], project_id: raceTarget,
          }]]);
          const { client, mutations } = raceKnowledgeClient({ documents });
          return {
            client, mutations,
            request: { operation: "update_document", document_id: 1, title: "Updated document" },
            race: () => documents.set(1, { ...documents.get(1)!, project_id: raceElsewhere }),
          };
        },
      },
      {
        name: "update_code_artifact",
        build() {
          const codeArtifacts = new Map<number, CodeArtifact>([[1, {
            id: 1, title: "Race artifact", description: "Race", code: "print(1)",
            language: "python", tags: [], project_id: raceTarget,
          }]]);
          const { client, mutations } = raceKnowledgeClient({ codeArtifacts });
          return {
            client, mutations,
            request: {
              operation: "update_code_artifact", code_artifact_id: 1, title: "Updated artifact",
            },
            race: () =>
              codeArtifacts.set(1, { ...codeArtifacts.get(1)!, project_id: raceElsewhere }),
          };
        },
      },
      {
        name: "create_relationship",
        build() {
          const entities = new Map([[1, raceEntity(1)], [2, raceEntity(2)]]);
          const { client, mutations } = raceKnowledgeClient({ entities });
          return {
            client, mutations,
            request: {
              operation: "create_relationship", source_entity_id: 1, target_entity_id: 2,
              relationship_type: "race",
            },
            race: () => entities.set(2, { ...entities.get(2)!, project_ids: [raceElsewhere] }),
          };
        },
      },
    ];

    await runRaceCases(cases);
  },
);

test(
  "replacement creation and attachment checks reject records moved during revalidation",
  async () => {
    // Arrange: scope is checked again after destination validation; semantic matching is absent.
    const cases: RaceCase[] = [
      {
        name: "create_memory (attachment moved)",
        build() {
          const documents = new Map<number, Document>([[1, {
            id: 1, title: "Doc", description: "d", content: "c", tags: [], project_id: raceTarget,
          }]]);
          const { client, mutations } = raceKnowledgeClient({ documents, searchResults: [] });
          return {
            client, mutations,
            request: {
              operation: "create_memory", title: "New memory", content: "New content",
              context: "race", keywords: [], tags: [], document_ids: [1],
            },
            race: () => documents.set(1, { ...documents.get(1)!, project_id: raceElsewhere }),
          };
        },
      },
      {
        name: "update_memory (attachment moved)",
        build() {
          const memories = new Map([[1, raceMemory(1)]]);
          const documents = new Map<number, Document>([[1, {
            id: 1, title: "Doc", description: "d", content: "c", tags: [], project_id: raceTarget,
          }]]);
          const { client, mutations } = raceKnowledgeClient({ memories, documents });
          return {
            client, mutations,
            request: { operation: "update_memory", memory_id: 1, document_ids: [1] },
            race: () => documents.set(1, { ...documents.get(1)!, project_id: raceElsewhere }),
          };
        },
      },
      {
        name: "supersede_memory (replacement attachment moved)",
        build() {
          const old = raceMemory(1, { title: "Old claim", content: "Old content" });
          const memories = new Map([[1, old]]);
          const documents = new Map<number, Document>([[1, {
            id: 1, title: "Doc", description: "d", content: "c", tags: [], project_id: raceTarget,
          }]]);
          const { client, mutations } = raceKnowledgeClient(
            { memories, documents, searchResults: [] },
          );
          return {
            client, mutations,
            request: {
              operation: "supersede_memory", memory_id: 1, title: "New claim",
              content: "New content", context: "race", keywords: [], tags: [],
              reason: "test", source_files: ["README.md"], document_ids: [1],
            },
            race: () => documents.set(1, { ...documents.get(1)!, project_id: raceElsewhere }),
          };
        },
      },
      {
        // The selected predecessor must still be authorized before creating its replacement.
        name: "supersede_memory (old memory moved)",
        build() {
          const old = raceMemory(1, { title: "Old claim", content: "Old content" });
          const memories = new Map([[1, old]]);
          const { client, mutations } = raceKnowledgeClient({ memories, searchResults: [] });
          return {
            client, mutations,
            request: {
              operation: "supersede_memory", memory_id: 1, title: "New claim",
              content: "New content", context: "race", keywords: [], tags: [],
              reason: "test", source_files: ["README.md"],
            },
            race: () => memories.set(1, { ...memories.get(1)!, project_ids: [raceElsewhere] }),
          };
        },
      },
      {
        name: "supersede_memory (explicit replacement moved)",
        build() {
          const old = raceMemory(1, { title: "Old claim", content: "Old content" });
          const replacement = raceMemory(2, {
            title: "Replacement claim", content: "Replacement content",
          });
          const memories = new Map([[1, old], [2, replacement]]);
          const { client, mutations } = raceKnowledgeClient({ memories, searchResults: [] });
          return {
            client, mutations,
            request: {
              operation: "supersede_memory", memory_id: 1, replacement_memory_id: 2,
              reason: "test", source_files: ["README.md"],
            },
            race: () => memories.set(2, { ...memories.get(2)!, project_ids: [raceElsewhere] }),
          };
        },
      },
    ];

    await runRaceCases(cases);
  },
);

test("foreground replacement cleans legacy context without changing novel creates", async () => {
  // Arrange: both writes receive text matching the exact historical capture suffix.
  const semanticContext = "The database decision changed.";
  const submittedContext = `${semanticContext}\n` +
    "Session: old-session; Branch: old-branch; Evidence entries: user-1";
  const old = raceMemory(1, { title: "Old claim", content: "Old content" });
  const memories = new Map([[old.id, old]]);
  const { client } = raceKnowledgeClient({ memories });

  // Act through the public foreground write boundary.
  const novel = value(await executeKnowledgeWrite(client, {
    operation: "create_memory",
    title: "Novel claim",
    content: "Novel content",
    context: submittedContext,
    keywords: [],
    tags: [],
  }, raceContext));
  const superseded = value(await executeKnowledgeWrite(client, {
    operation: "supersede_memory",
    memory_id: old.id,
    title: "Current claim",
    content: "Current content",
    context: submittedContext,
    keywords: [],
    tags: [],
    reason: "The source corrected the claim.",
    source_files: ["README.md"],
  }, raceContext));

  // Assert: only the replacement path performs the narrow legacy cleanup.
  const novelId = (novel.memory as { id: number }).id;
  assert.equal((await client.get(novelId)).context, submittedContext);
  assert.equal(
    (await client.get(superseded.replacement_memory_id as number)).context,
    semanticContext,
  );
});

test("foreground replacement preserves missing-field service validation", async () => {
  // Arrange: emulate Forgetful's normal required-field validation at the external write boundary.
  const old = raceMemory(1, { title: "Old claim", content: "Old content" });
  const memories = new Map([[old.id, old]]);
  const { client } = raceKnowledgeClient({ memories });
  const create = client.create.bind(client);
  client.create = async (input, signal) => {
    if (!input.title) throw new Error("Memory title is required.");
    if (!input.context) throw new Error("Memory context is required.");
    return create(input, signal);
  };
  const request = {
    operation: "supersede_memory" as const,
    memory_id: old.id,
    content: "Current content",
    reason: "The source corrected the claim.",
    source_files: ["README.md"],
  };

  // Act / Assert: cleanup must not mask Forgetful's actionable field errors.
  await assert.rejects(executeKnowledgeWrite(client, request, raceContext), /title is required/i);
  await assert.rejects(executeKnowledgeWrite(client, { ...request, title: "Current claim" },
    raceContext), /context is required/i);
});

test(
  "knowledge tools create explicitly requested entities without name-based deduplication",
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

  assert.equal(value(result).status, "created");
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
  assert.equal(hydrated.filter((item) => item.project_ids.includes(project.id)).length, 2);
  const search = value(await executeKnowledgeRead(client, {
    operation: "search_entities", query: "API", limit: 10,
  }, context(project.id)));
  assert.equal((search.items as Array<{ id: number }>).length, 2);
  assert.equal(search.next_offset, 2);
  },
);

test(
  "entity search pages by limit when leftover k differs",
  realOptions,
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const project = await client.createProject({
      name: "Limit", description: "Entity limit vs k", repo_name: "test/entity-limit",
    });
    await client.knowledge.createEntity({
      name: "Limit Alpha", entity_type: "System", tags: [], aka: [], project_ids: [project.id],
    });
    await client.knowledge.createEntity({
      name: "Limit Beta", entity_type: "System", tags: [], aka: [], project_ids: [project.id],
    });

    const search = value(await executeKnowledgeRead(client, {
      operation: "search_entities", query: "Limit", limit: 1, k: 20,
    }, context(project.id)));

    assert.equal((search.items as Array<{ id: number }>).length, 1);
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
  "knowledge tools page content, stamp provenance, and execute an explicit supersession",
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
    assert.equal(sharedResult.status, "created");
    const sharedChange = value(await executeKnowledgeWrite(client, {
      operation: "create_memory", title: "Shared claim", content: "Shared content",
      context: "test", keywords: [], tags: ["replacement"], source_files: ["new.md"],
    }, current));
    assert.equal(sharedChange.status, "created");
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
    assert.equal(caseChanged.status, "created");

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
    const superseded = value(await executeKnowledgeWrite(client, {
      operation: "supersede_memory", memory_id: old.id, title: "New claim",
      content: "The new claim", context: "test", keywords: [], tags: [],
      reason: "Verified source changed the claim", source_files: ["README.md"],
    }, current, undefined, async () => {
      if (!mutationApplied) {
        mutationApplied = true;
        await client.knowledge.updateMemory(old.id, { tags: ["changed"] });
      }
    }));
    assert.equal((await client.get(old.id)).is_obsolete, true);
    const replacementId = superseded.replacement_memory_id as number;
    assert.equal(superseded.status, "superseded");
    const retry = value(await executeKnowledgeWrite(client, {
      operation: "supersede_memory", memory_id: old.id,
      replacement_memory_id: replacementId, reason: "Retry completed operation",
      source_files: ["README.md"],
    }, current));
    assert.equal(retry.status, "already");
  });
