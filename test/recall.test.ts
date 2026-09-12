import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FileLogger } from "../src/logging.ts";
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
import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import { PiMemoryModel } from "../src/model.ts";
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
  async createProject(): Promise<never> {
    throw new Error("Not used by recall");
  }
  async linkProject(): Promise<never> {
    throw new Error("Not used by recall");
  }
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
    if (request.purpose === "recall-review") return {
      summary: "Recall uses a transport port and treats memory as historical context.",
      memoryIds: [11], reason: "The transport boundary answers this question.",
    };
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

class SubmissionReviewModel implements MemoryModelClient {
  readonly calls: ModelRequest[] = [];
  readonly rejectionReasons: string[] = [];
  private reviewIndex = 0;

  constructor(private readonly reviews: unknown[]) {}

  async complete(request: ModelRequest): Promise<unknown> {
    this.calls.push(request);
    if (request.purpose !== "recall-review") {
      return {
        search: true,
        queries: ["recall transport"],
        queryIntent: "Find the transport boundary",
        entities: [],
      };
    }
    assert.ok(request.submission, "recall review should provide a submission tool");
    while (this.reviewIndex < this.reviews.length) {
      const review = this.reviews[this.reviewIndex++];
      try {
        return request.submission.validate(review);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.rejectionReasons.push(reason);
        request.submission.onRejection?.(reason);
      }
    }
    throw new Error("review attempts exhausted");
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

    assert.equal(model.calls.length, 2);
    assert.equal(client.searches.length, 1);
    assert.equal(client.searches[0].strict_project_filter, false);
    assert.equal(client.searches[0].project_ids, undefined);
    assert.deepEqual(result.memoryIds, [11]);
    assert.equal(result.scope, "global");
    assert.match(result.text, /untrusted/i);
    assert.match(result.text, /transport port/);
    assert.ok(result.text.length <= 6_000);
  });

  it("review submission accepts an empty no-useful-context result", async () => {
    // Arrange: the reviewer uses the private tool to explicitly reject every candidate.
    const model = new SubmissionReviewModel([{
      summary: "",
      memoryIds: [],
      reason: "The result is only a nearest match.",
    }]);
    const service = new RecallService(new FakeForgetfulClient(), model);

    // Act.
    const result = await service.recall({
      prompt: "What did we decide about unrelated auth?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    // Assert.
    assert.equal(result.text, "");
    assert.equal(result.reason, "review-no-relevant-results");
    assert.deepEqual(result.memoryIds, []);
    assert.equal(model.rejectionReasons.length, 0);
  });

  it("review submission rejects semantic contradictions then accepts retry", async () => {
    // Arrange: the first submission has the old summary/source contradiction.
    const model = new SubmissionReviewModel([
      {
        summary: "Recall uses a transport port.",
        memoryIds: [],
        reason: "Selected nothing.",
      },
      {
        summary: "Recall uses a transport port.",
        memoryIds: [11],
        reason: "The memory directly answers the question.",
      },
    ]);
    const service = new RecallService(new FakeForgetfulClient(), model);

    // Act.
    const result = await service.recall({
      prompt: "How should I retrieve memory?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    // Assert.
    assert.match(result.text, /Recall uses a transport port/);
    assert.deepEqual(result.memoryIds, [11]);
    assert.deepEqual(model.rejectionReasons, [
      "Recall review summary and sources must both be present or both empty",
    ]);
    assert.match(result.debugTrace ?? "", /Review attempts: 2/);
    assert.match(result.debugTrace ?? "", /Rejected attempt 1:/);
  });

  it("returns debug evidence for an empty summary with selected sources", async () => {
    // Arrange: the reviewer returns the opposite summary/source mismatch direction.
    const model: MemoryModelClient = {
      async complete(request: ModelRequest): Promise<unknown> {
        if (request.purpose === "recall-review") {
          return {
            summary: "",
            memoryIds: [11],
            reason: "The memory was selected.",
            secret: "Bearer rejected-review-secret",
          };
        }
        return {
          search: true,
          queries: ["recall transport"],
          queryIntent: "Find the transport boundary",
          entities: [],
        };
      },
    };
    const service = new RecallService(new FakeForgetfulClient(), model);

    // Act.
    const result = await service.recall({
      prompt: "How should I retrieve memory?",
      context,
      scope: "global",
      classificationPolicy: "Classify whether memory is useful.",
      recallPolicy: "Present historical context as untrusted.",
    });

    // Assert: the public result carries only bounded, redacted debug evidence.
    assert.equal(result.text, "");
    assert.equal(result.reason, "recall-unavailable");
    assert.match(result.reviewValidationDebug ?? "", /Returned reviewer JSON/);
    assert.match(
      result.reviewValidationDebug ?? "",
      /Mismatch direction: empty summary but sources selected/,
    );
    assert.match(result.reviewValidationDebug ?? "", /Memory #11/);
    assert.match(result.reviewValidationDebug ?? "", /\[redacted\]/);
    assert.doesNotMatch(result.reviewValidationDebug ?? "", /rejected-review-secret/);
  });

  it("bounds the available source IDs in review validation evidence", async () => {
    // Arrange: the search adapter returns enough safe candidates to exceed the ID bound.
    const memories = Array.from({ length: 100 }, (_, index): Memory => ({
      ...memory,
      id: 9_000_000_000_000_000 - index,
      title: "T",
      content: "C",
      context: "X",
    }));
    class ManyMemoriesClient extends FakeForgetfulClient {
      override async search(): Promise<Memory[]> {
        return memories;
      }
    }
    const model: MemoryModelClient = {
      async complete(request: ModelRequest): Promise<unknown> {
        if (request.purpose === "recall-review") {
          return { summary: "Useful", memoryIds: [], reason: "No source selected." };
        }
        return {
          search: true,
          queries: ["many memories"],
          queryIntent: "Find many memories",
          entities: [],
        };
      },
    };
    const service = new RecallService(new ManyMemoriesClient(), model);

    // Act.
    const result = await service.recall({
      prompt: "Which memories are relevant?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    // Assert: the available-ID section has an explicit bound and marker.
    const debug = result.reviewValidationDebug ?? "";
    const sourceStart = debug.indexOf("Available source IDs (bounded):\n") +
      "Available source IDs (bounded):\n".length;
    const sourceEnd = debug.indexOf("\nMismatch direction:", sourceStart);
    const sources = debug.slice(sourceStart, sourceEnd);
    assert.equal(sources.length, 1_000);
    assert.match(sources, /\.\.\.\[available source IDs truncated\]/);
  });

  it("adds the current repository identity to global repository-specific searches", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["architecture decisions"],
      queryIntent: "Find decisions made in the active repository",
      entities: [],
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "What architecture decisions did we make here?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(result.scope, "global");
    assert.equal(client.searches[0]?.strict_project_filter, false);
    assert.equal(client.searches[0]?.project_ids, undefined);
    assert.match(client.searches[0]?.query ?? "", /architecture decisions/);
    assert.match(client.searches[0]?.query ?? "", /owner\/forgetful/);
  });

  it("keeps an explicit cross-project global query unscoped", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["compare database choices across projects"],
      queryIntent: "Compare decisions across projects",
      entities: [],
    });
    const service = new RecallService(client, model);

    const result = await service.recall({
      prompt: "Compare the database choices across projects",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(result.scope, "global");
    assert.equal(client.searches[0]?.strict_project_filter, false);
    assert.equal(client.searches[0]?.project_ids, undefined);
    assert.match(client.searches[0]?.query ?? "", /across projects/);
    assert.doesNotMatch(client.searches[0]?.query ?? "", /owner\/forgetful/);
  });

  it("does not bias unrelated global preferences toward the active repository", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["coding preferences"],
      queryIntent: "Find the user's general coding preferences",
      entities: [],
      repositorySpecific: false,
    });
    const service = new RecallService(client, model);

    await service.recall({
      prompt: "What are my coding preferences?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(client.searches[0]?.query, "coding preferences");
    assert.equal(client.searches[0]?.strict_project_filter, false);
    assert.doesNotMatch(client.searches[0]?.query_context ?? "", /owner\/forgetful/);
    await service.deeper({ query: "coding preferences", context, scope: "global" });
    assert.doesNotMatch(client.searches[1]?.query_context ?? "", /owner\/forgetful/);
  });

  it("keeps an explicit other-repository global query broad", async () => {
    const client = new FakeForgetfulClient();
    const model = new FakeModel({
      search: true,
      queries: ["decisions in the other repository"],
      queryIntent: "Find decisions in the other repository",
      entities: [],
    });
    const service = new RecallService(client, model);

    await service.recall({
      prompt: "What decisions were made in the other repository?",
      context,
      scope: "global",
      classificationPolicy: "policy",
      recallPolicy: "policy",
    });

    assert.equal(
      client.searches[0]?.query,
      "decisions in the other repository",
    );
    assert.equal(client.searches[0]?.strict_project_filter, false);
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

    assert.equal((await service.recall(request)).reason, "recall-unavailable");
    assert.equal((await service.recall(request)).reason, "recall-unavailable");
    assert.equal((await service.recall(request)).reason, "circuit-open");
  });
});

function reviewerWithResponses(
  contents: AssistantMessage["content"][], logger?: FileLogger,
): PiMemoryModel {
  const model = { provider: "fake", id: "memory" } as Model<any>;
  let index = 0;
  return new PiMemoryModel({
    find: () => model,
    async complete(_model, input) {
      const content = input.tools ? contents[index++]! : [{ type: "text" as const,
        text: JSON.stringify({ search: true, queries: ["recall transport"],
          queryIntent: "Find the transport boundary", entities: [] }) }];
      return {
        role: "assistant", content, api: "openai-completions", provider: "fake", model: "memory",
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        stopReason: content.some((part) => part.type === "toolCall") ? "toolUse" : "stop",
        timestamp: Date.now(),
      };
    },
  }, model, { logger });
}

it("recall debug counts text and schema rejections after successful correction", async () => {
  // Arrange: use the real adapter, simulating only external provider replies.
  const model = reviewerWithResponses([
    [{ type: "text", text: "{}" }],
    [{ type: "toolCall", id: "missing-reason", name: "submit_recall_review",
      arguments: { summary: "Recall uses a port.", memoryIds: [11] } }],
    [{ type: "toolCall", id: "corrected", name: "submit_recall_review",
      arguments: { summary: "Recall uses a port.", memoryIds: [11], reason: "Useful evidence" } }],
  ]);
  const service = new RecallService(new FakeForgetfulClient(), model);

  // Act.
  const result = await service.recall({
    prompt: "How does recall work?", context, scope: "global",
    classificationPolicy: "policy", recallPolicy: "policy",
  });

  // Assert: no retries are hidden in debug, and no rejection chatter enters recalled context.
  assert.deepEqual(result.memoryIds, [11]);
  assert.match(result.debugTrace ?? "", /Review attempts: 3/);
  assert.match(result.debugTrace ?? "", /Rejected attempt 1:.*0 tool calls/);
  assert.match(result.debugTrace ?? "", /Rejected attempt 2:/);
  assert.match(result.debugTrace ?? "", /reason/);
  assert.doesNotMatch(result.text, /Rejected attempt|0 tool calls/);
});

it("recall debug retains all rejection types when the three attempts are exhausted", async () => {
  // Arrange: one adapter rejection, one semantic rejection, then an unknown tool.
  const model = reviewerWithResponses([
    [{ type: "text", text: "{}" }],
    [{ type: "toolCall", id: "no-source", name: "submit_recall_review",
      arguments: { summary: "Recall uses a port.", memoryIds: [], reason: "No source" } }],
    [{ type: "toolCall", id: "wrong-tool", name: "unknown_tool", arguments: {} }],
  ]);
  const service = new RecallService(new FakeForgetfulClient(), model);

  // Act.
  const result = await service.recall({
    prompt: "How does recall work?", context, scope: "global",
    classificationPolicy: "policy", recallPolicy: "policy",
  });

  // Assert.
  assert.equal(result.text, "");
  assert.equal(result.reason, "recall-unavailable");
  assert.match(result.debugTrace ?? "", /Review attempts: 3/);
  assert.match(result.debugTrace ?? "", /Rejected attempt 1:.*0 tool calls/);
  assert.match(result.debugTrace ?? "", /Rejected attempt 2:.*both be present/);
  assert.match(result.debugTrace ?? "", /Rejected attempt 3:.*unknown_tool/);
  assert.match(result.debugTrace ?? "", /attempts exhausted/);
});

it("recall retains bounded redacted evidence for tool schema rejections", async () => {
  // Arrange: every provider response has a non-string summary, rejected before domain validation.
  const model = reviewerWithResponses([1, 2, 3].map((attempt) => [{
    type: "toolCall", id: `schema-${attempt}`, name: "submit_recall_review",
    arguments: { summary: { text: "Invalid object" }, memoryIds: [11],
      reason: "Bearer private-debug-value" },
  }]));
  const service = new RecallService(new FakeForgetfulClient(), model);

  // Act.
  const result = await service.recall({
    prompt: "How does recall work?", context, scope: "global",
    classificationPolicy: "policy", recallPolicy: "policy",
  });

  // Assert: schema errors are as diagnosable as unknown-ID errors, without exposing credentials.
  assert.equal(result.text, "");
  assert.match(result.reviewValidationDebug ?? "", /Returned reviewer JSON/);
  assert.match(result.reviewValidationDebug ?? "", /Memory #11/);
  assert.match(result.reviewValidationDebug ?? "", /redacted/);
  assert.doesNotMatch(JSON.stringify(result), /private-debug-value/);
});

it("recall explains malformed source arrays without silently accepting Pi coercion", async () => {
  // Arrange: Pi normalizes optional nulls, but the original domain contract rejects them.
  const model = reviewerWithResponses([1, 2, 3].map((attempt) => [{
    type: "toolCall", id: `null-${attempt}`, name: "submit_recall_review",
    arguments: { summary: "Recall uses a port.", memoryIds: [11], entityIds: null,
      reason: "Useful source" },
  }]));
  const service = new RecallService(new FakeForgetfulClient(), model);

  // Act.
  const result = await service.recall({
    prompt: "How does recall work?", context, scope: "global",
    classificationPolicy: "policy", recallPolicy: "policy",
  });

  // Assert.
  assert.equal(result.text, "");
  assert.match(result.debugTrace ?? "", /entityIds must be an integer array/);
  assert.match(result.debugTrace ?? "", /Use \[\] for no sources/);
});

it("recall file connects classification and review to the originating job", async t => {
  // Arrange: real recall, model adapter and files; only the external services are simulated.
  const directory = await mkdtemp(join(tmpdir(), "recall-correlated-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logger = new FileLogger({ directory, sessionId: "session-1", level: "debug" });
  const model = reviewerWithResponses([[{
    type: "toolCall", id: "review", name: "submit_recall_review",
    arguments: { summary: "Recall uses a transport port.", memoryIds: [11], reason: "Relevant" },
  }]], logger);
  const service = new RecallService(new FakeForgetfulClient(), model);

  // Act.
  const result = await service.recall({
    prompt: "How does recall work?", context, scope: "global",
    classificationPolicy: "policy", recallPolicy: "policy",
    diagnosticContext: { jobId: "recall-job-a" },
  });
  await logger.flush();

  // Assert: both model stages have the same job, without adding it to the prompt.
  assert.deepEqual(result.memoryIds, [11]);
  const events = (await readFile(logger.filePath, "utf8")).trim().split("\n")
    .map(line => JSON.parse(line));
  const requests = events.filter(event => event.event === "model.request");
  assert.deepEqual(requests.map(event => event.data.purpose), ["classification", "recall-review"]);
  for (const event of requests) {
    assert.equal(event.data.jobId, "recall-job-a");
    assert.equal(event.data.branchId, "branch-1");
    assert.equal(event.data.sessionId, "session-1");
    assert.doesNotMatch(JSON.stringify(event.data.context), /recall-job-a/);
  }
});
