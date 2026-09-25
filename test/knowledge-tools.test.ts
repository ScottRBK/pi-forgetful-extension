import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateToolArguments } from "@earendil-works/pi-ai/utils/validation";

import type { ForgetfulClient, MemoryInput, Project } from "../src/contracts.ts";
import { bundledSkillPaths } from "../src/encode.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import {
  executeKnowledgeRead,
  executeKnowledgeWrite,
  KNOWLEDGE_READ_PARAMETERS,
  validateKnowledgeReadRequest,
  type KnowledgeToolContext,
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
  // Arrange: record project scopes used for overlap checks and mutations.
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
  assert.deepEqual(searched, [[7], [9]]);
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
