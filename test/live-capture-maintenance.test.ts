import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { CaptureService } from "../src/capture.ts";
import { loadForgetfulConfig } from "../src/config.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import { sanitizeText } from "../src/privacy.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { startForgetful } from "./real-forgetful.ts";

// Opt-in paid model evaluation. Use envault run for provider credentials, as for other live suites.
// All writes target the isolated real server. Fixed embeddings do not evaluate search ranking.
const scenarios = [
  { name: "unchanged", old: "Audit every dependency before installation or upgrade.",
    user: "Our dependency policy remains: audit before installing or upgrading anything.",
    expected: "skip", rubric: "Leave the existing rule active; create no duplicate." },
  { name: "additive-detail", old: "Audit every dependency before installation or upgrade.",
    user: "Add this to our existing audit policy: record the upstream release tag in the audit.",
    expected: "merge", rubric: "Combined replacement retains the audit and adds release tags." },
  { name: "uv-policy", old: "Use uv for Python dependencies. Audit before installing or upgrading.",
    user: "Keep our uv policy and audit rule. Add a minimum-version guard requiring uv >= 0.9.",
    expected: "merge", rubric: "Retain uv and audit requirements; add the minimum version guard." },
  { name: "changed-fact", old: "The storage engine is Postgres.",
    user: "We migrated storage from Postgres to SQLite. SQLite is now our storage engine.",
    expected: "supersede", rubric: "The old engine claim becomes historical, with a replacement." },
  { name: "distinct-fact", old: "Audit dependencies before installing or upgrading.",
    user: "We decided to retain support audit logs for 90 days to investigate older incidents.",
    expected: "create",
    rubric: "Create separate retention knowledge and keep the dependency rule." },
  { name: "retirement-only", old: "Temporarily disable retries until the upstream retry fix ships.",
    user: "The upstream retry fix shipped. That temporary workaround no longer applies. " +
      "Remove the workaround from current knowledge; there is no replacement rule.",
    expected: "retire", rubric: "Retire the workaround without creating a replacement memory." },
  { name: "uncertainty", old: "The production storage engine is Postgres.",
    user: "The staging experiment might use SQLite. I cannot confirm production changed; " +
      "this may conflict with the stored production decision, so ask me before replacing it.",
    expected: "escalate", rubric: "Surface uncertainty; do not retire the production claim." },
] as const;

test("live model chooses maintenance actions with production capture policies", {
  skip: !(process.env.FORGETFUL_LIVE_MAINTENANCE === "1" && process.env.FORGETFUL_TEST_SOURCE) &&
    "Set FORGETFUL_LIVE_MAINTENANCE=1 and FORGETFUL_TEST_SOURCE; uses paid model calls",
  timeout: 900_000,
}, async (t) => {
  // Arrange: normal credential/config handling is evaluated only after explicit opt-in.
  const config = await loadForgetfulConfig({ cwd: process.cwd(), trusted: true });
  assert.ok(config.model, "Configure the memory model before opting in");
  const runtime = await ModelRuntime.create();
  const registry = new ModelRegistry(runtime);
  const selected = registry.find(config.model.provider, config.model.id);
  assert.ok(selected, "Configured memory model is unavailable");
  const directory = await mkdtemp(join(tmpdir(), "capture-maintenance-live-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const baseUrl = await startForgetful(t);
  const client = new ApiForgetfulClient({ baseUrl });
  const records: unknown[] = [];
  const reportPath = process.env.FORGETFUL_MAINTENANCE_REPORT ??
    join(tmpdir(), `forgetful-maintenance-${randomUUID()}.json`);
  const save = () => writeFile(reportPath, sanitizeText(JSON.stringify({
    model: config.model, providerCalls, records, scenarios,
    limitations: "Action assertions are automated; assess composed prose against each rubric. " +
      "Synthetic embeddings do not test ranking. No production memory writes.",
  }, null, 2)) + "\n", { mode: 0o600 });
  let providerCalls = 0;
  const monitored: ModelRegistryPort = {
    find: (provider, id) => registry.find(provider, id),
    complete(model, context, options) {
      if (++providerCalls > 48) throw new Error("Maintenance evaluation provider-call cap reached");
      return registry.complete(model, context, options);
    },
  };
  t.after(save);
  t.diagnostic(`Action choices and composition rubric: ${reportPath}`);
  for (const [index, scenario] of scenarios.entries()) {
    await t.test(scenario.name, async () => {
      const project = await client.createProject({ name: `Maintenance ${index}`,
        description: "Isolated model evaluation", repo_name: `test/maintenance-${index}` });
      const old = await client.create({ title: "Adopted policy", content: scenario.old,
        context: "Confirmed project policy", keywords: ["policy"], tags: [],
        project_ids: [project.id], importance: 8 });
      const queue = new DurableQueueStore({ directory: join(directory, String(index)),
        instanceId: "maintenance-eval" });
      const model = new PiMemoryModel(monitored, config.model!, {
        classificationTimeoutMs: config.recallModelTimeoutMs,
        sessionId: `maintenance-eval-${index}`, contextLimitTokens: config.contextLimitTokens,
      });
      const service = new CaptureService({ client, queue, model, instanceId: "maintenance-eval" });
      // Act: extraction and action choice are real model judgments, with no expected action hints.
      const queued = await service.enqueue({ id: `case-${index}`, instanceId: "maintenance-eval",
        mode: "auto", scope: "project", policy: "Maintain useful project knowledge.",
        modelVersion: config.model!.id, createdAt: new Date().toISOString(), finalEntryId: "answer",
        context: { cwd: "/synthetic", project, sessionId: `case-${index}`, branchId: "main" },
        entries: [{ id: "user", role: "user", text: scenario.user },
          { id: "answer", role: "assistant", text: "Understood." }] });
      const result = await service.checkpoint();
      const job = (await queue.getJob(queued.jobId))!;
      const outcomes = Object.values(job.candidateOutcomes) as Array<Record<string, any>>;
      const actions = outcomes.map((outcome) => outcome.action);
      const memories = await client.search({ query: "policy", query_context: "Evaluation readback",
        project_ids: [project.id], strict_project_filter: true, k: 20 });
      records.push({ name: scenario.name, result, job, memories, history: await client.get(old.id),
        semanticAssessment: "Needs review against rubric" });
      await save();
      // Assert action choices rather than prompt wording. Empty unchanged extraction is valid.
      assert.equal(job.status, "complete", job.lastError);
      if (scenario.expected === "skip") {
        assert.ok(actions.every((action) => action === "skip"));
        assert.equal(memories.length, 1);
      } else assert.ok(actions.includes(scenario.expected), JSON.stringify(actions));
      if (["create", "skip", "escalate"].includes(scenario.expected))
        assert.equal((await client.get(old.id)).is_obsolete, false);
      if (scenario.expected === "retire") assert.equal(memories.length, 0);
    });
  }
});
