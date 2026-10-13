import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

test("uncertain creation preserves a structured diagnostic after queue restart", realOptions,
  async (t) => {
    // Arrange: the transport accepts a write, then reports a structured lost-response error.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl });
    const project = await client.createProject({ name: "Diagnostics", description: "Test",
      repo_name: "test/capture-diagnostics" });
    const directory = await mkdtemp(join(tmpdir(), "capture-error-diagnostic-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const identity = { instanceId: "capture-error-diagnostic" };
    const queue = new DurableQueueStore({ directory, ...identity });
    const candidate = { id: "fact", title: "Storage", content: "Use SQLite.",
      context: "Decision", keywords: [], tags: [], sourceEntryIds: ["user"] };
    const snapshot: CaptureSnapshot = { id: "snapshot", ...identity, mode: "auto",
      scope: "global", policy: "", modelVersion: "test", createdAt: new Date().toISOString(),
      finalEntryId: "answer", context: { cwd: directory, project,
        sessionId: "session", branchId: "branch" }, entries: [
        { id: "user", role: "user", text: "Use SQLite." },
        { id: "answer", role: "assistant", text: "Done." },
      ] };
    const diagnostic = { status: 503, detail: "Accepted write; response lost",
      errors: [{ field: "receipt", message: "Receipt unavailable" }] };
    const create = client.create.bind(client);
    let creates = 0;
    client.create = async (input, signal) => {
      creates++;
      await create(input, signal);
      throw diagnostic;
    };
    const service = new CaptureService({ queue, client, ...identity, model: {
      async complete(request) {
        if (request.purpose === "capture") return { candidates: [candidate] };
        return { action: "create" };
      },
    } });
    const queued = await service.enqueue(snapshot);

    // Act: use public capture processing with a reopened disk queue and real REST client.
    const result = await service.checkpoint();
    const reopened = new DurableQueueStore({ directory, ...identity });
    await new CaptureService({ queue: reopened, client, ...identity, model: {
      async complete(): Promise<never> {
        assert.fail("An uncertain creation cannot enter model correction or write again");
      },
    } }).checkpoint();

    // Assert: the original structured detail remains available without a duplicate write.
    assert.equal(result.paused, true, JSON.stringify(result));
    const retained = (await reopened.getJob(queued.jobId!))!;
    assert.equal(retained.uncertainWrite, JSON.stringify(diagnostic));
    assert.equal(creates, 1);
    assert.equal((await client.search({ query: "SQLite", query_context: "Stored capture",
      project_ids: [project.id], strict_project_filter: true })).length, 1);
  });
