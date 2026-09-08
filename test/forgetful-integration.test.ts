import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import test, { type TestContext } from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { CaptureService } from "../src/capture.ts";
import { DurableQueueStore } from "../src/queue.ts";

const source = process.env.FORGETFUL_TEST_SOURCE;

async function startForgetful(t: TestContext): Promise<string> {
  const child = spawn(
    join(source!, ".venv/bin/python"),
    [resolve("scripts/forgetful-test-server.py"), source!],
    { cwd: "/tmp", stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = once(child, "exit");
  t.after(async () => {
    child.kill("SIGTERM");
    await exited;
  });
  let errors = "";
  child.stderr.on("data", (data) => {
    errors = (errors + data).slice(-4000);
  });
  const lines = createInterface({ input: child.stdout });
  return Promise.race([
    (async () => {
      for await (const line of lines) {
        if (line.startsWith("READY ")) return line.slice(6);
      }
      throw new Error(`Test server exited: ${errors}`);
    })(),
    new Promise<never>((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Server startup: ${errors}`)),
        20_000,
      );
      timer.unref();
      t.after(() => clearTimeout(timer));
    }),
  ]);
}

async function seedProject(baseUrl: string, name: string): Promise<number> {
  const response = await fetch(`${baseUrl}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description: "Extension contract test",
      repo_name: name,
      project_type: "development",
    }),
  });
  assert.equal(response.status, 201);
  return ((await response.json()) as { id: number }).id;
}

const options = {
  skip:
    !source && "Set FORGETFUL_TEST_SOURCE to an existing Forgetful checkout",
  timeout: 30_000,
};

test(
  "real Forgetful REST scopes writes and preserves superseded history",
  options,
  async (t) => {
    // Arrange: the real application uses its own in-memory SQLite test fixture.
    const baseUrl = await startForgetful(t);
    const projectId = await seedProject(baseUrl, "test/extension");
    const otherId = await seedProject(baseUrl, "test/other");
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
    const payload = {
      title: "Database decision",
      content: "The project uses PostgreSQL.",
      context: "Original project decision",
      keywords: ["database"],
      tags: ["decision"],
      importance: 8,
      project_ids: [projectId],
    };

    // Act: write through the extension adapter, including an unrelated linked result.
    const old = await client.create(payload);
    const other = await client.create({ ...payload, project_ids: [otherId] });
    const replacement = await client.create({
      ...payload,
      content: "The project uses SQLite.",
    });
    await client.supersede(
      old.id,
      replacement.id,
      "Explicit project migration",
    );
    const projects = await client.listProjects("test/extension");
    const scoped = await client.search({
      query: "database",
      query_context: "Check project decision",
      project_ids: [projectId],
      strict_project_filter: true,
      include_links: true,
      k: 10,
    });
    const history = await client.get(old.id);

    // Assert: public API state proves project scope and non-destructive supersession.
    assert.deepEqual(
      projects.map((p) => p.id),
      [projectId],
    );
    assert.ok(scoped.some((m) => m.id === replacement.id));
    assert.ok(scoped.every((m) => m.id !== other.id && m.id !== old.id));
    assert.equal(history.is_obsolete, true);
    assert.equal(history.superseded_by, replacement.id);
    assert.equal(history.content, "The project uses PostgreSQL.");
    assert.equal((await client.get(replacement.id)).is_obsolete, false);
  },
);

test(
  "capture routes another repo's work through the real Forgetful API",
  options,
  async (t) => {
    // Arrange: active work belongs to one project; the evidenced fix belongs to another.
    const baseUrl = await startForgetful(t);
    const currentId = await seedProject(baseUrl, "test/extension");
    const destinationId = await seedProject(baseUrl, "test/forgetful");
    const directory = await mkdtemp(join(tmpdir(), "forgetful-capture-rest-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
    const queue = new DurableQueueStore({
      directory,
      instanceId: "test-instance",
    });
    const decisions: unknown[] = [
      {
        candidates: [
          {
            id: "database-change",
            title: "Forgetful database choice",
            content: "Forgetful uses SQLite.",
            context: "Scott confirmed the Forgetful change.",
            keywords: ["database", "sqlite"],
            tags: ["decision"],
            sourceEntryIds: ["user-choice"],
            evidenceType: "userDecision",
            destinationProjectId: destinationId,
            destinationRationale:
              "The user explicitly requested this change in test/forgetful.",
          },
        ],
      },
      { action: "create", reason: "No existing fact overlaps." },
    ];
    const service = new CaptureService({
      queue,
      client,
      instanceId: "test-instance",
      model: { complete: async () => decisions.shift() },
    });
    await service.enqueue({
      id: "routing-snapshot",
      instanceId: "test-instance",
      finalEntryId: "answer",
      context: {
        cwd: "/work/extension",
        repoName: "test/extension",
        project: {
          id: currentId,
          name: "test/extension",
          repo_name: "test/extension",
        },
        sessionId: "routing-session",
        branchId: "branch",
      },
      entries: [
        {
          id: "user-choice",
          role: "user",
          text: "For the test/forgetful repository, we decided to use SQLite.",
        },
        {
          id: "answer",
          role: "assistant",
          text: "The Forgetful repository now uses SQLite.",
        },
      ],
      mode: "auto",
      scope: "global",
      policy: "Capture evidenced decisions.",
      modelVersion: "test/model",
      createdAt: new Date().toISOString(),
    });

    // Act.
    await service.checkpoint();
    const memories = await client.search({
      query: "database",
      query_context: "Verify routing",
      project_ids: [destinationId],
      strict_project_filter: true,
    });

    // Assert through the public API: the capture is associated with the actual target repo.
    assert.equal(memories.length, 1);
    assert.equal(memories[0]?.content, "Forgetful uses SQLite.");
    assert.deepEqual(memories[0]?.project_ids, [destinationId]);
  },
);
