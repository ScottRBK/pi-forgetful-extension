import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { ModelRegistry, ModelRuntime } from "@earendil-works/pi-coding-agent";
import type { ForgetfulClient } from "../src/contracts.ts";
import { loadForgetfulConfig } from "../src/config.ts";
import { PiMemoryModel, type ModelRegistryPort } from "../src/model.ts";
import { DEFAULT_MEMORY_POLICIES } from "../src/policies.ts";
import { sanitizeText } from "../src/privacy.ts";
import { RecallService, type RecallResult } from "../src/recall.ts";
import { memoryQualityCases } from "./fixtures/memory-quality.ts";

// Opt-in model calls. Fixed external search results make prompt comparisons reproducible.
// This does not measure retrieval ranking and never opens a Forgetful database or writes memory.
const enabled = process.env.FORGETFUL_LIVE_QUALITY === "1";
const MAX_PROVIDER_CALLS = 48;

type Variant = {
  name: string;
  Recall: typeof RecallService;
  Model: typeof PiMemoryModel;
  policies: typeof DEFAULT_MEMORY_POLICIES;
};

test("live memory quality across different contexts using production policies", {
  skip: !enabled && "Set FORGETFUL_LIVE_QUALITY=1 to spend model calls",
  timeout: 900_000,
}, async (t) => {
  // Arrange: only public synthetic facts go to the configured Pi memory model.
  const config = await loadForgetfulConfig({ cwd: process.cwd(), trusted: true });
  assert.ok(config.model, "A configured memory model is required");
  assert.ok(!config.prompts.classification && !config.prompts.recall,
    "Evaluate local policy overlays separately; do not send them with synthetic fixtures");
  const registry = new ModelRegistry(await ModelRuntime.create());
  assert.ok(registry.find(config.model.provider, config.model.id));
  const variants: Variant[] = [{ name: "current", Recall: RecallService,
    Model: PiMemoryModel, policies: DEFAULT_MEMORY_POLICIES }];
  const baseline = process.env.FORGETFUL_QUALITY_BASELINE;
  if (baseline) {
    const load = (name: string) => import(pathToFileURL(resolve(baseline, "src", name)).href);
    const [recall, model, policies] = await Promise.all([
      load("recall.ts"), load("model.ts"), load("policies.ts"),
    ]);
    variants.unshift({ name: "baseline", Recall: recall.RecallService,
      Model: model.PiMemoryModel, policies: policies.DEFAULT_MEMORY_POLICIES });
  }
  const selectedVariant = process.env.FORGETFUL_QUALITY_VARIANT;
  const evaluated = selectedVariant
    ? variants.filter((variant) => variant.name === selectedVariant) : variants;
  assert.ok(evaluated.length, "Requested evaluation variant is unavailable");
  const reportPath = process.env.FORGETFUL_QUALITY_REPORT ??
    join(await mkdtemp(join(tmpdir(), "pi-memory-quality-")), "results.json");
  const records: Array<Record<string, unknown>> = [];
  let providerCalls = 0;
  const save = () => writeFile(reportPath, sanitizeText(JSON.stringify({
    model: config.model, providerCalls, providerCallCap: MAX_PROVIDER_CALLS,
    modelTimeoutMs: config.recallModelTimeoutMs, recallTimeoutMs: config.instance.timeoutMs,
    methodology: "Paired production policies with fixed search evidence. No real ranking, " +
      "storage mutations, or automatic semantic grading. Read output against the saved rubric.",
    cases: memoryQualityCases, records,
  }, null, 2)) + "\n", { mode: 0o600 });
  t.after(save);
  t.diagnostic(`Detailed evidence: ${reportPath}`);

  for (const [index, scenario] of memoryQualityCases.entries()) {
    // Alternate the order to avoid running every baseline before every revised case.
    for (const variant of index % 2 === 0 ? evaluated : [...evaluated].reverse()) {
      await t.test(`${scenario.name}/${variant.name}`, async () => {
        const project = { id: 1, name: "Synthetic case", repo_name: scenario.repo };
        const record: Record<string, unknown> = { name: scenario.name, variant: variant.name,
          providerCalls: 0, responses: [], policies: [], policyHashes: [],
          semanticAssessment: "needs review" };
        records.push(record);
        const pending: Promise<unknown>[] = [];
        const monitored: ModelRegistryPort = {
          find: (provider, id) => registry.find(provider, id),
          complete(model, context, options) {
            if (providerCalls >= MAX_PROVIDER_CALLS) throw new Error("Evaluation call cap reached");
            providerCalls++;
            record.providerCalls = Number(record.providerCalls) + 1;
            (record.policyHashes as string[]).push(createHash("sha256")
              .update(context.systemPrompt ?? "").digest("hex"));
            (record.policies as unknown[]).push({ systemPrompt: context.systemPrompt,
              tools: context.tools });
            const completion = registry.complete(model, context, options).then((response) => {
              (record.responses as unknown[]).push({ stopReason: response.stopReason,
                content: response.content.filter((part) => part.type !== "thinking") });
              return response;
            });
            pending.push(completion);
            return completion;
          },
        };
        const neverWrite = async (): Promise<never> => {
          throw new Error("The quality fixture must not perform memory writes or unrelated reads");
        };
        const client: ForgetfulClient = {
          search: async (request) => {
            record.search = request;
            return structuredClone(scenario.memories);
          },
          listProjects: async () => [project], createProject: neverWrite,
          linkProject: neverWrite, create: neverWrite, get: neverWrite, supersede: neverWrite,
        };
        const model = new variant.Model(monitored, config.model!, {
          classificationTimeoutMs: config.recallModelTimeoutMs,
          sessionId: `quality-${randomUUID()}`,
        });
        const service = new variant.Recall(client, model);
        const started = performance.now();
        try {
          // Act: actual planner, reviewer, private submission validation and existing deadlines.
          const result: RecallResult = await service.recall({
            prompt: scenario.prompt, sessionContext: scenario.sessionContext,
            context: { cwd: "/synthetic", repoName: scenario.repo, project,
              sessionId: `fresh-${randomUUID()}`, branchId: "quality" },
            projects: [project], scope: "global",
            classificationPolicy: variant.policies.classification,
            recallPolicy: variant.policies.recall, deadlineMs: config.instance.timeoutMs,
          });
          record.result = result;
          // Assert source selection only. IDs alone cannot prove that the prose is accurate.
          const sourceSelectionPassed = scenario.requiredIds.every((id) =>
            result.memoryIds.includes(id)) && result.memoryIds.every((id) =>
            scenario.allowedIds.includes(id));
          const deliveryPassed = !result.diagnostic && (scenario.allowedIds.length > 0
            ? result.text.length > 0 : result.text === "");
          record.sourceSelectionPassed = sourceSelectionPassed;
          record.deliveryPassed = deliveryPassed;
          assert.ok(sourceSelectionPassed,
            "Required sources missing or unrelated sources selected");
          assert.ok(deliveryPassed,
            result.diagnostic ?? "Useful/empty delivery did not match case");
        } finally {
          record.elapsedMs = Math.round(performance.now() - started);
          await Promise.allSettled(pending);
          await save();
          t.diagnostic(JSON.stringify({ case: scenario.name, variant: variant.name,
            elapsedMs: record.elapsedMs, providerCalls: record.providerCalls,
            sourceSelectionPassed: record.sourceSelectionPassed,
            deliveryPassed: record.deliveryPassed }));
        }
      });
    }
  }
});
