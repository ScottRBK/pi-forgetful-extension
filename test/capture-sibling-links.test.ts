import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

for (const connect of [false, true]) {
  test(`model can ${connect ? "connect" : "leave separate"} newly captured facts`,
    realOptions, async (t) => {
      // Arrange: no automatic links; model must see both saved facts before choosing connections.
      const directory = await mkdtemp(join(tmpdir(), "pi-sibling-links-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t,
        { MEMORY_NUM_AUTO_LINK: "0" }) });
      const project = await client.createProject({ name: "Delivery", repo_name: "test/delivery",
        description: "Distinct decision and status" });
      const queue = new DurableQueueStore({ directory, instanceId: "isolated" });
      const candidates = [
        { id: "decision", title: "Signed delivery handover",
          content: "Adopt signed handover to make delivery disputes traceable." },
        { id: "status", title: "Handover rollout approval",
          content: "The signed handover rollout is awaiting carrier approval." },
      ].map((item) => ({ ...item, context: "Delivery process", keywords: ["handover"], tags: [],
        sourceEntryIds: ["user"], evidenceType: "userDecision" }));
      const tasks: string[] = [];
      let reviewed = false;
      const capture = new CaptureService({ queue, client, instanceId: "isolated",
        model: { async complete(request: ModelRequest) {
          const name = request.submission!.name;
          tasks.push(name);
          if (name === "submit_capture_candidates") return { candidates };
          if (name === "submit_capture_decisions") return { decisions: candidates.map((item) =>
            ({ candidateId: item.id, action: "create" })) };
          assert.equal(name, "submit_capture_links");
          const input = request.input as { candidates: Array<{ candidateId: string;
            memory: { id: number }; memories: Array<{ id: number; content: string }> }> };
          assert.equal(input.candidates.length, 2);
          for (const item of input.candidates) {
            assert.equal(item.memories.length, 1);
            assert.notEqual(item.memories[0]!.id, item.memory.id);
            assert.ok(item.memories[0]!.content);
          }
          reviewed = true;
          return { reviews: input.candidates.map((item, index) => ({
            candidateId: item.candidateId,
            decisions: item.memories.map((memory) => ({ memoryId: memory.id,
              action: connect && index === 0 ? "add" : "ignore",
              reason: connect ? "Approval qualifies this handover decision." : "Keep separate.",
            })),
          })) };
        } } });
      const snapshot: CaptureSnapshot = { id: "handover", instanceId: "isolated", mode: "auto",
        scope: "project", policy: "", modelVersion: "test", finalEntryId: "assistant",
        createdAt: new Date().toISOString(),
        context: { cwd: directory, project, sessionId: "session", branchId: "branch" },
        entries: [{ id: "user", role: "user",
          text: candidates.map((item) => item.content).join(" ") },
          { id: "assistant", role: "assistant", text: "Recorded." }] };

      // Act: capture and inspect actual stored records through REST.
      const queued = await capture.enqueue(snapshot);
      await capture.checkpoint();
      const job = await queue.getJob(queued.jobId);
      const stored = await client.search({ query: "handover", query_context: "Inspect graph",
        project_ids: [project.id], strict_project_filter: true, k: 3 });

      // Assert: code neither adds the model-declined edge nor hides the possible connection.
      assert.equal(job?.status, "complete", JSON.stringify(job));
      assert.equal(reviewed, true, "new siblings must be supplied as full reviewable records");
      assert.equal(stored.length, 2);
      for (const memory of stored) assert.deepEqual(memory.linked_memory_ids,
        connect ? [stored.find((other) => other.id !== memory.id)!.id] : []);
      assert.deepEqual(tasks,
        ["submit_capture_candidates", "submit_capture_decisions", "submit_capture_links"]);
      assert.equal(job.callCount, 3);
    });
}
