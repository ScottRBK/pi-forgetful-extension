import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import { CaptureService } from "../src/capture.ts";
import { loadForgetfulConfig } from "../src/config.ts";
import type { CaptureSnapshot } from "../src/contracts.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import { DEFAULT_MEMORY_POLICIES } from "../src/policies.ts";
import { sanitizeText } from "../src/privacy.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { RecallService } from "../src/recall.ts";
import { startForgetful } from "./real-forgetful.ts";

// Real model judgments and isolated REST storage. Fixed embeddings do NOT test search ranking.
// Oracles are saved for manual assessment, never supplied to capture or recall models.
const cases = [
  {
    name: "decision-with-reason", repo: "test/exports", shouldCapture: true,
    user: "Keep report generation off the request thread. Large reports have made customers " +
      "wait for the browser request to finish; queue them and return a job ID. We haven't " +
      "implemented this yet.",
    assistant: "I have implemented and tested the worker. Everything passes.",
    question: "What was the report-generation decision, and is it implemented?",
    required: ["Queue reports and return a job ID to avoid waiting on the request thread.",
      "Implementation is not established by this conversation."],
    forbidden: ["Implemented and tested successfully."],
    seeds: [
      { title: "Report job polling", content: "Report clients poll a job ID for completion." },
      { title: "Office printing", content: "The office printer queues printed visitor badges." },
    ],
  },
  {
    name: "scoped-investigation", repo: "test/search", shouldCapture: true,
    user: "We reproduced the search hang during index warmup on the small worker. The larger " +
      "worker did not hang in that run. Warmup looks related, but I don't have a causal test yet.",
    assistant: "Warmup is definitely the root cause. Disabling it fixes search everywhere.",
    question: "What do we know about the search hang, and what is still uncertain?",
    required: ["Observed during warmup on the small worker; causality remains uncertain.",
      "The larger worker did not hang in that run, not a universal guarantee."],
    forbidden: ["Warmup is a proven cause.", "A fix is verified on every worker."],
    seeds: [],
  },
  {
    name: "conditional-preference", repo: "test/reviews", shouldCapture: true,
    user: "For my weekly updates, give me the short version. When I'm reviewing an " +
      "architecture decision, though, I need the written reasons and trade-offs in detail.",
    assistant: "I'll make every answer a single sentence from now on.",
    question: "How detailed should an architecture decision review be?",
    required: ["Detailed written reasons and trade-offs for architecture reviews."],
    forbidden: ["All communication must be a single sentence."],
    seeds: [],
  },
  {
    name: "independent-decisions", repo: "test/ledger", shouldCapture: true,
    user: "For this project, keep audit logs for 90 days so support can investigate old " +
      "incidents. Use a decimal point in CSV exports regardless of the machine locale. " +
      "Start our weekly reporting period on Monday to match the finance team.",
    assistant: "Understood. Those are the project rules; I have not changed the implementation.",
    question: "What rules did we settle for audit retention, CSV decimals and reporting weeks?",
    required: ["Audit logs: 90 days, supporting incident investigation.",
      "CSV decimals: a point independent of machine locale.",
      "Reporting weeks: Monday, matching finance.", "Store distinct concepts separately."],
    forbidden: ["Implementation or tests verified.", "Replacing unrelated earlier decisions."],
    seeds: [],
  },
  {
    name: "corrected-fact-not-a-transition", repo: "test/warehouse", shouldCapture: true,
    user: "I said our stock counts come from nightly imports. Correction: they have always " +
      "come from scanner events. I mixed this up with the accounting export.",
    assistant: "I will record the migration from nightly imports to scanner events.",
    question: "Where do stock counts come from, and did that process change?",
    required: ["Stock counts come from scanner events.",
      "This corrects a mistaken statement; no process migration is established."],
    forbidden: ["Migrated from nightly imports.",
      "Nightly imports formerly supplied stock counts."],
    seeds: [],
  },
  {
    name: "adopted-change-not-a-correction", repo: "test/notifications", shouldCapture: true,
    user: "Until today we emailed an alert for every rejected payment. We have now decided " +
      "to send one daily digest instead because the individual messages are overwhelming. " +
      "The old behavior was intentional, not a mistaken description. Deployment is still pending.",
    assistant: "The digest is deployed and running.",
    question: "What changed about payment alerts, why, and is the change deployed?",
    required: ["Decision changes individual rejected-payment emails to one daily digest.",
      "Reason: individual messages were overwhelming; deployment remains pending."],
    forbidden: ["There were never individual alerts.", "The digest is deployed."],
    seeds: [],
  },
  {
    name: "request-is-not-completion", repo: "test/work", shouldCapture: false,
    user: "Thanks. Could you check the logs next?",
    assistant: "I checked them and confirmed the new worker is healthy.",
    question: "Was the worker's health actually verified?",
    required: ["No durable completed-work claim should be stored from this exchange."],
    forbidden: ["Logs were checked.", "The new worker is verified healthy."],
    seeds: [],
  },
];

const enabled = process.env.FORGETFUL_LIVE_CONNECTED_QUALITY === "1";
const MAX_PROVIDER_CALLS = 36;

test("live capture to stored connections to fresh recall across different contexts", {
  skip: !enabled && "Set FORGETFUL_LIVE_CONNECTED_QUALITY=1 and FORGETFUL_TEST_SOURCE",
  timeout: 900_000,
}, async (t) => {
  // Arrange: new in-memory service; never the configured live Forgetful endpoint.
  assert.ok(process.env.FORGETFUL_TEST_SOURCE);
  const config = await loadForgetfulConfig({ cwd: process.cwd(), trusted: true });
  assert.ok(config.model);
  assert.ok(!Object.values(config.prompts).some(Boolean), "Use default production policies");
  const registry = new ModelRegistry(await ModelRuntime.create());
  assert.ok(registry.find(config.model.provider, config.model.id));
  const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "1" });
  const client = new ApiForgetfulClient({ baseUrl });
  const directory = await mkdtemp(join(tmpdir(), "pi-connected-quality-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const reportPath = process.env.FORGETFUL_CONNECTED_QUALITY_REPORT ??
    join(tmpdir(), `pi-connected-quality-${randomUUID()}.json`);
  let providerCalls = 0;
  const records: Array<Record<string, unknown>> = [];
  const save = () => writeFile(reportPath, sanitizeText(JSON.stringify({
    model: config.model, providerCalls, providerCallCap: MAX_PROVIDER_CALLS,
    methodology: "Synthetic sessions, real model judgments, isolated REST with fixed embeddings. " +
      "Read actual stored facts, links and fresh recall against the rubric. Not a ranking test " +
      "or a full Pi main-agent answer evaluation.", cases, records,
  }, null, 2)) + "\n", { mode: 0o600 });
  t.after(save);
  t.diagnostic(`Detailed evidence: ${reportPath}`);

  for (const scenario of cases) {
    await t.test(scenario.name, async (t) => {
      const project = await client.createProject({ name: scenario.name, repo_name: scenario.repo,
        description: "Isolated synthetic quality fixture" });
      const seeds: Array<{ id: number }> = [];
      for (const seed of scenario.seeds) {
        seeds.push(await client.create({ ...seed, context: "Existing project knowledge",
          keywords: [], tags: [], project_ids: [project.id] }));
      }
      const run: Record<string, unknown> = { name: scenario.name, responses: [], policies: [],
        providerCalls: 0, seedIds: seeds.map((seed) => seed.id),
        semanticAssessment: "needs review" };
      records.push(run);
      const pending: Promise<unknown>[] = [];
      const monitored: ModelRegistryPort = {
        find: (provider, id) => registry.find(provider, id),
        complete(model, context, options) {
          if (providerCalls >= MAX_PROVIDER_CALLS) throw new Error("Evaluation call cap reached");
          providerCalls++;
          run.providerCalls = Number(run.providerCalls) + 1;
          (run.policies as unknown[]).push({ systemPrompt: context.systemPrompt,
            tools: context.tools });
          const call = registry.complete(model, context, options).then((response) => {
            (run.responses as unknown[]).push({ stopReason: response.stopReason,
              content: response.content.filter((part) => part.type !== "thinking") });
            return response;
          });
          pending.push(call);
          return call;
        },
      };
      const snapshot: CaptureSnapshot = {
        id: randomUUID(), instanceId: scenario.name, finalEntryId: "assistant", mode: "auto",
        scope: "project", policy: "", modelVersion: `${config.model!.provider}/${config.model!.id}`,
        createdAt: new Date().toISOString(),
        context: { cwd: "/synthetic", repoName: scenario.repo, project,
          sessionId: `capture-${randomUUID()}`, branchId: "settled" },
        entries: [{ id: "user", role: "user", text: scenario.user },
          { id: "assistant", role: "assistant", text: scenario.assistant }],
      };
      const queue = new DurableQueueStore({ directory: join(directory, scenario.name),
        instanceId: scenario.name });
      const service = new CaptureService({ queue, client, instanceId: scenario.name,
        model: new PiMemoryModel(monitored, config.model!, {
          sessionId: snapshot.context.sessionId,
          classificationTimeoutMs: config.recallModelTimeoutMs,
        }) });
      const started = performance.now();
      try {
        // Act: capture using production admission, overlap, link review and durable limits.
        const queued = await service.enqueue(snapshot);
        run.checkpoint = await service.checkpoint();
        run.captureMs = Math.round(performance.now() - started);
        const job = await queue.getJob(queued.jobId);
        run.job = job;
        const stored = await client.search({ query: scenario.question,
          query_context: "Inspect actual stored results for independent assessment",
          project_ids: [project.id], strict_project_filter: true, k: 20 });
        run.stored = stored;
        const created = stored.filter((memory) => !seeds.some((seed) => seed.id === memory.id));
        run.createdCount = created.length;
        // Assert mechanics only; actual claim quality is assessed separately, never by regex.
        assert.equal(job?.status, "complete", job?.lastError);
        assert.equal(created.length > 0, scenario.shouldCapture);
        if (!scenario.shouldCapture) return;

        // A fresh service has no snapshot/session text: its only history comes from stored records.
        const fresh = new RecallService(new ApiForgetfulClient({ baseUrl }),
          new PiMemoryModel(monitored, config.model!, {
            sessionId: `recall-${randomUUID()}`,
            classificationTimeoutMs: config.recallModelTimeoutMs,
          }));
        const recallStarted = performance.now();
        run.recall = await fresh.recall({ prompt: scenario.question,
          context: { cwd: "/synthetic", repoName: scenario.repo, project,
            sessionId: `fresh-${randomUUID()}`, branchId: "new" },
          scope: "project", classificationPolicy: DEFAULT_MEMORY_POLICIES.classification,
          recallPolicy: DEFAULT_MEMORY_POLICIES.recall, deadlineMs: config.instance.timeoutMs });
        run.recallMs = Math.round(performance.now() - recallStarted);
        const result = run.recall as { text: string; diagnostic?: string };
        assert.ok(result.text, result.diagnostic ?? "Fresh recall did not deliver context");
      } finally {
        await Promise.allSettled(pending);
        run.elapsedMs = Math.round(performance.now() - started);
        await save();
        t.diagnostic(JSON.stringify({ name: scenario.name, providerCalls: run.providerCalls,
          createdCount: run.createdCount, captureMs: run.captureMs, recallMs: run.recallMs }));
      }
    });
  }
});
