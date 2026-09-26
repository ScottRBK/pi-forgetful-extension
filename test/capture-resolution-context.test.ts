import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { CaptureService, type ResolveConflictInput } from "../src/capture.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

function answer(): AssistantMessage {
  return { role: "assistant", content: [{ type: "text", text: "The note is recorded." }],
    api: "openai-completions", provider: "test", model: "memory", timestamp: 1,
    stopReason: "stop", usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

for (const active of [false, true]) {
  test(`resolution receives full ${active ? "active" : "retained originating"} conversation`,
    realOptions, async (t) => {
      // Arrange: a real Pi history and isolated service with an unresolved captured claim.
      const directory = await mkdtemp(join(tmpdir(), "pi-resolution-context-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
      const project = await client.createProject({ name: "Carrier", repo_name: "test/carrier",
        description: "Full resolution context" });
      const old = await client.create({ title: "Handover", content: "Use a paper handover.",
        context: "Previous decision", keywords: [], tags: [], project_ids: [project.id] });
      const session = SessionManager.inMemory(directory);
      const early = session.appendMessage({ role: "user", timestamp: 1,
        content: "Signed digital handover is provisional until the carrier confirms it." });
      for (let i = 0; i < 105; i++) session.appendMessage({ role: "user", timestamp: i + 2,
        content: `Discussion ${i}: no additional decision.` });
      const recent = session.appendMessage({ role: "user", timestamp: 109,
        content: "Consider the digital handover, but keep the original qualification." });
      session.appendMessage(answer());
      const snapshot = buildCaptureSnapshot({ session, instanceId: "isolated", mode: "auto",
        scope: "project", policy: "", modelVersion: "test/memory",
        context: { cwd: directory, project, repoName: "test/carrier",
          sessionId: session.getSessionId(), branchId: "branch" } });
      assert.equal(snapshot.status, "ready");
      if (snapshot.status !== "ready") return;
      const queue = new DurableQueueStore({ directory: join(directory, "queue"),
        instanceId: "isolated" });
      let correction: string | undefined;
      let reviewed = false;
      const model = { async complete(request: import("../src/contracts.ts").ModelRequest) {
        const candidate = { id: "handover", title: "Handover",
          content: "Digital handover proposed.",
          context: "Carrier discussion", keywords: ["handover"], tags: [],
          sourceEntryIds: [recent], evidenceType: "userDecision" };
        if (request.submission?.name === "submit_capture_candidates")
          return { candidates: [candidate] };
        if (request.submission?.name === "submit_memory_revision") {
          const records = request.conversation as Array<{ id: string }> | undefined;
          assert.ok(records, "resolution must receive conversation outside selected evidence");
          assert.ok(records.length > 100);
          assert.ok(records.some((entry) => entry.id === early));
          if (active) assert.ok(records.some((entry) => entry.id === correction));
          reviewed = true;
          return { title: "Provisional digital handover",
            content: "Digital handover remains provisional pending carrier confirmation.",
            context: "Carrier qualification retained", keywords: ["handover"], tags: [],
            importance: 7, sourceEntryIds: [recent], documentIds: [], codeArtifactIds: [],
            entityIds: [], memoryIds: [], fileIds: [], sourceFiles: [] };
        }
        return { action: "escalate", conflictingMemoryId: old.id,
          oldClaim: "Use a paper handover.", newClaim: candidate.content,
          reason: "Clarify the qualification", sourceEntryIds: [recent] };
      } };
      const capture = new CaptureService({ queue, client, model, instanceId: "isolated" });
      await capture.enqueue(snapshot.snapshot);
      await capture.checkpoint();
      const [conflict] = await capture.pendingConflicts();
      assert.ok(conflict);
      correction = session.appendMessage({ role: "user", timestamp: 112,
        content: "It is still provisional, not an implemented switch." });
      const input = { action: "supersede", reason: "Preserve the original qualification.",
        evidenceEntryIds: [recent],
        ...(active ? { conversation: session.getBranch() } : {}),
      } as ResolveConflictInput;
      const resumed = new CaptureService({ client, model, instanceId: "isolated",
        queue: new DurableQueueStore({ directory: join(directory, "queue"),
          instanceId: "isolated" }) });

      // Act: resolve after restart, with active context when the Pi caller has it.
      const resolved = await resumed.resolveConflict(conflict.id, input);

      // Assert: the selected correction executes; neither old context nor qualifications vanish.
      assert.equal(reviewed, true);
      assert.equal(resolved.status, "resolved");
      const saved = await client.get(resolved.conflict.replacementId!);
      assert.equal(saved.content,
        "Digital handover remains provisional pending carrier confirmation.");
    });
}
