import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { CaptureService } from "../src/capture.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

const git = promisify(execFile);

for (const committed of [true, false]) {
  test(`capture inspects ${committed ? "committed" : "working-tree"} evidence read-only`,
    realOptions, async (t) => {
      // Arrange: a real source repository and isolated Forgetful service, never live memory.
      const directory = await mkdtemp(join(tmpdir(), "pi-capture-source-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const path = join(directory, "delivery.txt");
      await git("git", ["init", "-q", directory]);
      await writeFile(path, "Delivery needs a signed handover.\n");
      await git("git", ["-C", directory, "add", "delivery.txt"]);
      await git("git", ["-C", directory, "-c", "user.name=Fixture", "-c",
        "user.email=fixture@example.invalid", "commit", "-qm", "Initial source"]);
      const head = (await git("git", ["-C", directory, "rev-parse", "HEAD"])).stdout.trim();
      if (!committed) await writeFile(path, "Delivery needs a signed handover and photo.\n");
      const original = await readFile(path, "utf8");
      const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
      const project = await client.createProject({ name: "Delivery",
        description: "Source-backed capture", repo_name: "test/delivery" });
      const queue = new DurableQueueStore({ directory: join(directory, "queue"),
        instanceId: "isolated" });
      let inspected = false;
      let observationId: string | undefined;
      const snapshot: CaptureSnapshot = {
        id: "source-capture", instanceId: "isolated", finalEntryId: "a1", mode: "auto",
        scope: "project", policy: "", modelVersion: "test/model",
        createdAt: new Date().toISOString(),
        context: { cwd: directory, repoName: "test/delivery", project,
          sessionId: "capture", branchId: "main" },
        entries: [{ id: "u1", role: "user", text: "Record the documented delivery requirement." },
          { id: "a1", role: "assistant", text: "The source note is delivery.txt." }],
      };
      const capture = new CaptureService({ queue, client, instanceId: "isolated",
        model: { async complete(request) {
          if (request.purpose === "capture") {
            const tool = request.readTools?.find((item) => item.name === "inspect_source");
            assert.ok(tool, "capture must have a read-only source capability");
            const response = await tool.execute({ path: "delivery.txt" },
              new AbortController().signal) as { evidenceEntry: { id: string };
                result: { status: string; content: string; source_repo: string;
                  source_files: string[]; encoding_version?: string } };
            assert.equal(response.result.status, "ok");
            assert.equal(response.result.content, original);
            inspected = true;
            observationId = response.evidenceEntry.id;
            return request.submission!.validate({ candidates: [{ id: "delivery-rule",
              title: "Delivery handover requirement", content: original.trim(),
              context: committed ? "Documented delivery requirement" : "Uncommitted delivery note",
              keywords: ["delivery"], tags: ["requirement"], evidenceType: "observation",
              sourceEntryIds: [observationId], sourceFiles: response.result.source_files,
              sourceRepo: response.result.source_repo,
              ...(response.result.encoding_version
                ? { encodingVersion: response.result.encoding_version } : {}),
            }] });
          }
          return request.submission?.name === "submit_capture_decisions"
            ? { decisions: [{ candidateId: "delivery-rule", action: "create" }] }
            : { action: "create" };
        } } });

      // Act: inspect, select provenance, and execute the model's explicit capture operation.
      const queued = await capture.enqueue(snapshot);
      const outcome = await capture.checkpoint();
      const job = await queue.getJob(queued.jobId);

      // Assert: stored provenance matches inspected bytes; inspection never modifies the source.
      assert.equal(inspected, true, JSON.stringify(outcome));
      assert.equal(job?.status, "complete", JSON.stringify(job));
      const created = await client.search({ query: "delivery",
        query_context: "Inspect saved result",
        project_ids: [project.id], strict_project_filter: true, k: 3 });
      assert.equal(created.length, 1, JSON.stringify(job));
      assert.equal(created[0]?.content, original.trim());
      assert.deepEqual(created[0]?.source_files, ["delivery.txt"]);
      assert.equal(created[0]?.source_repo, "test/delivery");
      assert.equal(created[0]?.encoding_version ?? undefined, committed ? head : undefined);
      assert.ok(created[0]?.context.includes(observationId!));
      assert.equal(await readFile(path, "utf8"), original);
    });
}
