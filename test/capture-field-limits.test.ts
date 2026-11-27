import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot, ModelRequest } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";

/** Runs one extraction against a server that publishes `limits`; returns its prompt. */
async function extractionPolicy(t: TestContext, limits: unknown): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "capture-field-limits-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const client = new ApiForgetfulClient({ baseUrl: "http://localhost/api/v1",
    fetchImpl: async (url) => {
      assert.match(String(url), /\/\.well-known$/);
      return Response.json({ schema_version: 1, limits });
    } });
  const policies: string[] = [];
  const model = { async complete(request: ModelRequest) {
    policies.push(request.policy);
    const response = { candidates: [] };
    request.submission.validate(response);
    return response;
  } };
  const queue = new DurableQueueStore({ directory, instanceId: "limits" });
  const service = new CaptureService({ client, queue, model, instanceId: "limits" });
  const snapshot: CaptureSnapshot = { id: "limits", instanceId: "limits", mode: "auto",
    scope: "project", policy: "", modelVersion: "test", finalEntryId: "user",
    createdAt: new Date().toISOString(),
    context: { cwd: directory, project: { id: 7, name: "Limits" },
      sessionId: "limits", branchId: "main" },
    entries: [{ id: "user", role: "user", text: "Nothing durable here." }] };
  const queued = await service.enqueue(snapshot);
  await service.checkpoint();
  assert.equal((await queue.getJob(queued.jobId))?.status ?? "complete", "complete");
  assert.equal(policies.length, 1);
  return policies[0]!;
}

test("capture states at most 16 published fields for each record type", async (t) => {
  // Arrange: a broken or hostile server publishes 40 memory fields.
  const fields = Object.fromEntries(Array.from({ length: 40 },
    (_, i) => [`field_${String(i).padStart(2, "0")}`, { max_length: 10 }]));

  // Act.
  const policy = await extractionPolicy(t, { memory: fields });

  // Assert: the prompt stays a bounded size.
  assert.match(policy, /\bfield_15 10\b/);
  assert.doesNotMatch(policy, /\bfield_16\b/);
});

test("capture states a published zero bound", async (t) => {
  // Arrange / Act: zero tags means only an empty tag list is valid.
  const policy = await extractionPolicy(t, { memory: { tags: { max_items: 0 } } });

  // Assert.
  assert.match(policy, /memory: tags 0 items\b/);
});

test("capture gives no target range for a content limit too small to have one", async (t) => {
  // Arrange / Act.
  const policy = await extractionPolicy(t, { memory: { content: { max_length: 1 } } });

  // Assert: the limit is stated; no "aim for 0-0" target.
  assert.match(policy, /memory: content 1\b/);
  assert.doesNotMatch(policy, /aim for/);
});

test("capture gives a target range below a normal content limit", async (t) => {
  // Arrange / Act.
  const policy = await extractionPolicy(t, { memory: { content: { max_length: 2000 } } });

  // Assert.
  assert.match(policy, /at most 2000 characters; aim for 1600-1800\b/);
});
