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

for (const scenario of ["unlinked-irrelevant", "foreign-only", "keep-during-review",
  "ignore-during-review"] as const) {
  test(`capture handles ${scenario} without inventing an unresolved judgment`, realOptions,
    async (t) => {
      // Arrange: these cases emerged from real model runs, not just fixture-driven submissions.
      const baseUrl = await startForgetful(t, {
        MEMORY_NUM_AUTO_LINK: ["foreign-only", "keep-during-review"].includes(scenario) ? "1" : "0",
      });
      const client = new ApiForgetfulClient({ baseUrl });
      const project = await client.createProject({ name: "Capture", repo_name: "test/contract",
        description: "Connection submission contract" });
      const foreign = await client.createProject({ name: "Other", repo_name: "test/elsewhere",
        description: "No write authority from the capture destination" });
      const existing = await client.create({ title: "Office printing",
        content: "The printer queues visitor badges.", context: "An unrelated operational fact",
        keywords: ["queue"], tags: [],
        project_ids: [scenario === "foreign-only" ? foreign.id : project.id] });
      const directory = await mkdtemp(join(tmpdir(), "capture-link-contract-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const queue = new DurableQueueStore({ directory, instanceId: scenario });
      const tasks: string[] = [];
      const model = new PiMemoryModel({
        find: () => ({ provider: "test", id: "memory", maxTokens: 8_000 }) as Model<any>,
        complete: async (_model, context) => {
          const name = context.tools![0]!.name;
          tasks.push(name);
          let args: unknown;
          if (name === "submit_capture_candidates") args = { candidates: [{ id: "report-queue",
            title: "Queue reports", content: "Queue report generation and return a job ID.",
            context: "Adopted latency decision", keywords: ["queue"], tags: ["decision"],
            sourceEntryIds: ["user"], evidenceType: "userDecision" }] };
          else if (name === "submit_capture_decision") args = { action: "create" };
          else {
            assert.notEqual(scenario, "foreign-only",
              "No eligible endpoints or predecessor means there is no model judgment to request");
            const input = JSON.parse(context.messages[0]!.content as string);
            const savedId = input.candidates[0].memory.id;
            if (scenario === "keep-during-review")
              await client.knowledge.unlinkMemories(savedId, existing.id);
            if (scenario === "ignore-during-review")
              await client.knowledge.linkMemories(savedId, [existing.id]);
            // Another writer's change must survive both no-op choices.
            args = { reviews: [{ candidateId: "report-queue", decisions: [{
              memoryId: existing.id, action: scenario === "keep-during-review" ? "keep" : "ignore",
              reason: "Different subjects, not a dependency",
            }] }] };
          }
          return { role: "assistant", api: "test", provider: "test", model: "memory",
            content: [{ type: "toolCall", id: "submission", name, arguments: args }],
            stopReason: "toolUse", timestamp: Date.now(),
            usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          } as AssistantMessage;
        },
      }, { provider: "test", id: "memory" });
      const service = new CaptureService({ queue, client, model, instanceId: scenario });
      const snapshot: CaptureSnapshot = { id: "snapshot", instanceId: scenario, mode: "auto",
        scope: "global", policy: "", modelVersion: "test", finalEntryId: "answer",
        createdAt: new Date().toISOString(),
        context: { cwd: "/synthetic", project, sessionId: scenario, branchId: "branch" },
        entries: [{ id: "user", role: "user",
          text: "Queue report generation and return a job ID to avoid long browser requests." },
        { id: "answer", role: "assistant", text: "Understood." }] };

      // Act: create and review the stored neighborhood through the public capture worker.
      const queued = await service.enqueue(snapshot);
      await service.checkpoint();

      // Assert: confidently irrelevant is distinct from unknown; foreign links stay unreviewed.
      const job = (await queue.getJob(queued.jobId))!;
      assert.equal(job.status, "complete", job.lastError);
      const result = job.candidateOutcomes["report-queue"] as {
        memoryId: number; linkReview: { status: string; unreviewed: unknown[] };
      };
      const stored = await client.get(result.memoryId);
      assert.equal(stored.linked_memory_ids?.includes(existing.id),
        scenario === "foreign-only" || scenario === "ignore-during-review");
      assert.equal(result.linkReview.status, scenario === "foreign-only" ? "partial" : "complete");
      if (scenario === "foreign-only") {
        assert.equal(result.linkReview.unreviewed.length, 1);
        assert.deepEqual(tasks, ["submit_capture_candidates", "submit_capture_decision"]);
      }
    });
}
