import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";
import { decodeProviderContext } from "./provider-context.ts";

test("wrong-name batch submissions cannot authorize capture writes", realOptions, async (t) => {
  // Arrange: real private submission validation, real service, scripted external provider replies.
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl });
  const project = await client.createProject({ name: "Routing", repo_name: "test/routing",
    description: "Private tool identity regression" });
  const directory = await mkdtemp(join(tmpdir(), "capture-routing-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const queue = new DurableQueueStore({ directory, instanceId: "routing" });
  let wrongCalls = 0;
  const model = new PiMemoryModel({
    find: () => ({ provider: "test", id: "memory", maxTokens: 8_000 }) as Model<any>,
    complete: async (_model, context) => {
      const tool = context.tools![0]!;
      let name = tool.name;
      let args: unknown;
      if (name === "submit_capture_candidates") {
        args = { candidates: ["queue", "receipts"].map((id) => ({ id,
          title: `Decision about ${id}`, content: `Use durable ${id}.`, context: "Adopted design",
          keywords: [id], tags: [], sourceEntryIds: ["user"], evidenceType: "userDecision" })) };
      } else if (name === "submit_capture_decisions") {
        wrongCalls++;
        name = "not_the_submission_tool";
        args = { decisions: ["queue", "receipts"].map((candidateId) =>
          ({ candidateId, action: "create" })) };
      } else {
        // If the invalid decisions leak, allow review to finish so actual unauthorized writes show.
        const input = decodeProviderContext(context).input;
        args = { reviews: input.candidates.map((item: { candidateId: string;
          memories: Array<{ id: number }> }) => ({ candidateId: item.candidateId,
          decisions: item.memories.map((memory) => ({ memoryId: memory.id,
            action: "keep", reason: "Related durability design" })) })) };
      }
      return { role: "assistant", api: "test", provider: "test", model: "memory",
        content: [{ type: "toolCall", id: "submission", name, arguments: args }],
        stopReason: "toolUse", timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      } as AssistantMessage;
    },
  }, { provider: "test", id: "memory" });
  const service = new CaptureService({ queue, client, model, instanceId: "routing" });
  const snapshot: CaptureSnapshot = { id: "snapshot", instanceId: "routing", mode: "auto",
    scope: "project", policy: "", modelVersion: "test", finalEntryId: "answer",
    createdAt: new Date().toISOString(),
    context: { cwd: "/synthetic", project, sessionId: "routing", branchId: "branch" },
    entries: [{ id: "user", role: "user", text: "Use durable queues and durable receipts." },
      { id: "answer", role: "assistant", text: "Understood." }] };

  // Act: the provider uses the wrong private tool three times with otherwise valid batch data.
  await service.enqueue(snapshot);
  await service.checkpoint();

  // Assert: rejected routing must not become write authority through sibling salvage.
  assert.equal(wrongCalls, 3);
  const stored = await client.search({ query: "durability", query_context: "Verify no writes",
    project_ids: [project.id], strict_project_filter: true });
  assert.deepEqual(stored, []);
});
