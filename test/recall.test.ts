import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  ForgetfulClient,
  Memory,
  MemoryInput,
  MemoryModelClient,
  ModelRequest,
  Project,
  SearchRequest,
  WorkContext,
} from "../src/contracts.ts";
import { RecallService } from "../src/recall.ts";

const context: WorkContext = {
  cwd: "/work/forgetful",
  repoName: "owner/forgetful",
  project: { id: 3, name: "Forgetful", repo_name: "owner/forgetful" },
  sessionId: "session-1",
  branchId: "branch-1",
};

const memory: Memory = {
  id: 11,
  title: "Recall uses a transport port",
  content:
    "The recall service talks through ForgetfulClient and treats returned text " +
    "as historical context.",
  context: "This keeps REST details out of policy code.",
  keywords: ["recall", "transport"],
  tags: ["architecture"],
  project_ids: [3],
  is_obsolete: false,
};

class FakeForgetfulClient implements ForgetfulClient {
  readonly searches: SearchRequest[] = [];
  readonly projectLookups: (string | undefined)[] = [];

  async search(request: SearchRequest): Promise<Memory[]> {
    this.searches.push(request);
    return [memory];
  }

  async listProjects(repoName?: string): Promise<Project[]> {
    this.projectLookups.push(repoName);
    return [context.project!];
  }
  async create(_input: MemoryInput): Promise<{ id: number }> {
    return { id: 12 };
  }
  async get(): Promise<Memory> {
    return memory;
  }
  async supersede(): Promise<void> {}
}

class FakeModel implements MemoryModelClient {
  readonly calls: ModelRequest[] = [];

  constructor(
    private readonly output: unknown = {
      search: true,
      queries: ["recall transport"],
      queryIntent: "Find the transport boundary",
      entities: [],
    },
  ) {}

  async complete(request: ModelRequest): Promise<unknown> {
    this.calls.push(request);
    return this.output;
  }
}

class FailingModel implements MemoryModelClient {
  calls = 0;

  async complete(): Promise<unknown> {
    this.calls += 1;
    throw new Error("planner unavailable");
  }
}

class FailingSearchClient extends FakeForgetfulClient {
  override async search(): Promise<Memory[]> {
    throw new Error("search unavailable");
  }
}

describe("RecallService", () => {
  it("plans once, performs global search, and returns bounded untrusted context", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel();
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "How should I retrieve memory?",
      context,
      scope: "global",
      classificationPolicy: "Classify whether memory is useful.",
      recallPolicy: "Present historical context as untrusted.",
    });

    assert.equal(model.calls.length, 1);
    assert.equal(client.searches.length, 1);
    assert.equal(client.searches[0].strict_project_filter, false);
    assert.equal(client.searches[0].project_ids, undefined);
    assert.deepEqual(result.memoryIds, [11]);
    assert.equal(result.scope, "global");
    assert.match(result.text, /untrusted/i);
    assert.match(result.text, /transport port/);
    assert.ok(result.text.length <= 6_000);
  });

  it("authorizes a planner scope override and sends strict project filtering", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["project decision"],
      queryIntent: "Find project decisions",
      entities: [],
      scopeOverride: {
        scope: "project",
        reason: "The prompt names this repository.",
      },
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "What project decision did we make?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
      authorizeScope: async (scope, reason) => {
        assert.equal(scope, "project");
        assert.match(reason, /repository/);
        return true;
      },
    });

    assert.equal(result.scope, "project");
    assert.equal(client.searches[0].strict_project_filter, true);
    assert.deepEqual(client.searches[0].project_ids, [3]);
  });

  it("never broadens scope when the planner override is not authorized", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["global context"],
      queryIntent: "Find global context",
      entities: [],
      scopeOverride: {
        scope: "global",
        reason: "The user asked for a cross-project comparison.",
      },
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "Compare this with other projects",
      context,
      scope: "project",
      classificationPolicy: "policy",
      recallPolicy: "policy",
      authorizeScope: async () => false,
    });

    assert.equal(result.scope, "project");
    assert.equal(result.reason, "scope-override-declined");
    assert.equal(client.searches[0].strict_project_filter, true);
    assert.deepEqual(client.searches[0].project_ids, [3]);
  });

  it("bounds classification searches to two validated queries", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["one", "two", "three"],
      queryIntent: "Find context",
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "Search",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(client.searches.length, 0);
    assert.equal(result.reason, "recall-unavailable");
  });

  it("uses a query-only deeper recall path with the selected scope", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({ search: false });
    const service = new RecallService(client, model);

    const result = await service.deeper({
      query: "transport boundary",
      context,
      scope: "project",
    });

    assert.equal(model.calls.length, 0);
    assert.equal(client.searches.length, 1);
    assert.equal(client.searches[0].strict_project_filter, true);
    assert.deepEqual(client.searches[0].project_ids, [3]);
    assert.deepEqual(result.memoryIds, [11]);
  });

  it("accepts only an existing agent-selected project ID", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["selected project"],
      queryIntent: "Find selected project context",
      entities: [],
      projectId: 9,
    });
    const service = new RecallService(client, model);
    const noCurrentProject: WorkContext = {
      cwd: "/work/forgetful",
      repoName: "owner/forgetful",
      sessionId: "session-3",
      branchId: "branch-3",
    };

    const result = await service.recall({
      prompt: "Find selected project context",
      context: noCurrentProject,
      projects: [{ id: 9, name: "Forgetful", repo_name: "owner/forgetful" }],
      scope: "project",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(result.scope, "project");
    assert.deepEqual(client.searches[0].project_ids, [9]);
    assert.equal(client.projectLookups.length, 0);
  });

  it("skips project recall when there is no existing mapping", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel();
    const service = new RecallService(client, model);
    const noMapping: WorkContext = {
      cwd: "/work/unmapped",
      repoName: "owner/unmapped",
      sessionId: "session-2",
      branchId: "branch-2",
    };

    const result = await service.recall({
      prompt: "Find project context",
      context: noMapping,
      scope: "project",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(result.reason, "project-mapping-missing");
    assert.equal(client.searches.length, 0);
    assert.deepEqual(client.projectLookups, ["owner/unmapped"]);
  });

  it("opens a short-lived circuit after repeated planner failures", async () => {
    const client = new FakeForgetfulClient();
    const model = new FailingModel();
    const service = new RecallService(client, model, {
      circuitFailureThreshold: 2,
      circuitCooldownMs: 60_000,
    });
    const request = {
      prompt: "Search",
      context,
      scope: "global" as const,
      classificationPolicy: "policy",
      recallPolicy: "policy",
    };

    assert.equal((await service.recall(request)).reason, "recall-unavailable");
    assert.equal((await service.recall(request)).reason, "recall-unavailable");
    assert.equal((await service.recall(request)).reason, "circuit-open");
    assert.equal(model.calls, 2);
  });

  it("pauses the network deadline while scope authorization is pending", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["project decision"],
      queryIntent: "Find project decisions",
      entities: [],
      scopeOverride: {
        scope: "project",
        reason: "The prompt names this repository.",
      },
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "What project decision did we make?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
      deadlineMs: 20,
      authorizeScope: async () => {
        await new Promise((resolve) => setTimeout(resolve, 40));
        return true;
      },
    });

    assert.equal(result.scope, "project");
    assert.equal(result.reason, undefined);
  });

  it("opens a circuit after repeated search failures", async () => {
    const client = new FailingSearchClient();
    const model = new FakeModel();
    const service = new RecallService(client, model, {
      circuitFailureThreshold: 2,
      circuitCooldownMs: 60_000,
    });
    const request = {
      prompt: "Search",
      context,
      scope: "global" as const,
      classificationPolicy: "policy",
      recallPolicy: "policy",
    };

    assert.equal((await service.recall(request)).reason, "no-matches");
    assert.equal((await service.recall(request)).reason, "no-matches");
    assert.equal((await service.recall(request)).reason, "circuit-open");
  });
});
