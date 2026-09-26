import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, createReadTool, DefaultResourceLoader, ModelRegistry, ModelRuntime,
  SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import type { AssistantMessage, Context } from "@earendil-works/pi-ai";
import { CaptureService } from "../src/capture.ts";
import { loadForgetfulConfig, type ModelSelection } from "../src/config.ts";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { PiMemoryModel } from "../src/model.ts";
import { sanitizeText } from "../src/privacy.ts";
import { DurableQueueStore } from "../src/queue.ts";
import { RecallService } from "../src/recall.ts";
import { buildCaptureSnapshot } from "../src/snapshot.ts";
import { startForgetful } from "./real-forgetful.ts";

// Live (spends money): FORGETFUL_LIVE_CONTEXT_QUALITY=1 FORGETFUL_TEST_SOURCE=/path/to/forgetful
//   node --import tsx --test test/live-context-quality.test.ts
// Local wiring: replace the live switch with FORGETFUL_CONTEXT_QUALITY_DRY_RUN=1.
// FORGETFUL_CONTEXT_QUALITY_REPORT overrides the default /tmp JSON report location.
// One evaluation; the scripted fixture is loaded only by the explicit local switch.
const live = process.env.FORGETFUL_LIVE_CONTEXT_QUALITY === "1";
const dry = process.env.FORGETFUL_CONTEXT_QUALITY_DRY_RUN === "1";
const MAX_PROVIDER_CALLS = 48;
const READ_TOOLS = ["forgetful_recall_wait", "forgetful_knowledge_read", "forgetful_recall"];
const execute = promisify(execFile);
type RecordData = Record<string, unknown>;

// Rubrics are report-only: never pass these objects to a model or the extension.
const scenarios = [
  {
    name: "ridge-history-correction",
    question: "For Ridge overnight cold-room trials, what pressure units do the battery nodes " +
      "and mains bench units use? Was there a firmware transition, and is calibration verified?",
    rubric: [
      "The battery-node correction is millibars; earlier kPa was a mistaken description.",
      "Retain the earlier overnight cold-room qualification and mains bench units using bar.",
      "Do not invent a firmware migration, old operating regime, or verified calibration.",
    ],
  },
  {
    name: "carton-dirty-source",
    question: "What carton batch limit is supported by the inspected source, what is its " +
      "revision status, and what do we know about warehouse rollout verification?",
    rubric: [
      "Working-tree MAX_CARTONS is 6; it is a modified, uncommitted source observation.",
      "Check source file/repository and observation hash; do not label dirty bytes as HEAD.",
      "The rollout log read failed. Assistant claims do not verify tests or warehouse rollout.",
    ],
  },
  {
    name: "conditional-release-decision",
    question: "When may the mobile lab use a cached release manifest, and what must happen " +
      "when its certificate is expired?",
    rubric: [
      "Cached manifests are allowed only for offline rehearsal with a valid certificate.",
      "Connected production still requires a fresh manifest; this decision is not deployment.",
      "The separate stored certificate procedure requires stopping and contacting the custodian.",
      "Report whether private read_forgetful exploration actually occurred; do not assume it.",
    ],
  },
] as const;
type Scenario = typeof scenarios[number];

function errorRecord(error: unknown): unknown {
  if (!(error instanceof Error)) return String(error);
  return { name: error.name, message: error.message, stack: error.stack,
    ...Object.fromEntries(Object.entries(error)),
    ...(error.cause === undefined ? {} : { cause: errorRecord(error.cause) }) };
}

function assistant(text: string): AssistantMessage {
  return { role: "assistant", content: [{ type: "text", text }], api: "fixture" as never,
    provider: "transcript-fixture", model: "transcript-fixture", stopReason: "stop",
    timestamp: Date.now(), usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,
      totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
}

async function git(cwd: string, ...args: string[]): Promise<string> {
  return (await execute("git", ["-C", cwd, ...args])).stdout.trim();
}

async function repository(cwd: string, name: string): Promise<void> {
  await mkdir(cwd, { recursive: true });
  await git(cwd, "init", "-q");
  await git(cwd, "remote", "add", "origin", `https://github.com/context-fixture/${name}.git`);
}

async function sourceState(cwd: string) {
  const bytes = await readFile(join(cwd, "src/batch-policy.ts"));
  return { path: "src/batch-policy.ts", content: bytes.toString("utf8"),
    contentHash: createHash("sha256").update(bytes).digest("hex"),
    head: await git(cwd, "rev-parse", "HEAD"), status: await git(cwd, "status", "--porcelain"),
    diff: await git(cwd, "diff", "--", "src/batch-policy.ts") };
}

async function originalSession(scenario: Scenario, cwd: string, record: RecordData) {
  const manager = SessionManager.inMemory(cwd);
  const user = (text: string) => manager.appendMessage({ role: "user", content: text,
    timestamp: Date.now() });
  let watermark: string | undefined;
  let early: string | undefined;
  if (scenario.name === "ridge-history-correction") {
    early = user("For battery-only Ridge telemetry nodes during overnight cold-room trials, " +
      "reported pressures are kPa. Mains-powered bench units use bar. This note describes " +
      "units, not calibration accuracy: we have not checked calibration.");
    manager.appendMessage(assistant("I have recorded the limited scope of that observation."));
    for (let index = 0; index < 54; index++) {
      user(`Temporary worksheet row ${index + 1}: move the cursor to the next empty cell.`);
      manager.appendMessage(assistant("Ready for the next row."));
    }
    watermark = manager.appendMessage(assistant("Worksheet navigation is finished."));
    manager.appendCompaction("We discussed trial units and navigated a temporary worksheet.",
      watermark, 12_000);
    user("Correction to that earlier battery-node unit label: it has always been millibars. " +
      "I misread the label. No firmware change occurred; the other qualifications still apply.");
    manager.appendMessage(assistant("The firmware migration from kPa to millibars is complete " +
      "and calibration is verified everywhere."));
  } else if (scenario.name === "carton-dirty-source") {
    await mkdir(join(cwd, "src"));
    const path = join(cwd, "src/batch-policy.ts");
    await writeFile(path, "// Packing bench default; not a deployment receipt.\n" +
      "export const MAX_CARTONS = 8;\n");
    await git(cwd, "add", "src/batch-policy.ts");
    await git(cwd, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid",
      "commit", "-qm", "Initial bench policy");
    await writeFile(path, "// Packing bench default; not a deployment receipt.\n" +
      "export const MAX_CARTONS = 6;\n");
    record.sourceBefore = await sourceState(cwd);
    user("Confirm the carton batch limit from src/batch-policy.ts in this working tree. " +
      "The branch has uncommitted edits; leave files unchanged. The rollout receipt would " +
      "be artifacts/rollout.log. Do not infer deployment from a source change.");
    manager.appendMessage({ ...assistant("Reading the rollout receipt."), stopReason: "toolUse",
      content: [{ type: "toolCall", id: "rollout-read", name: "read",
        arguments: { path: "artifacts/rollout.log" } }] });
    // Execute Pi's actual builtin. The failure is observed, not an invented tool result.
    let failure: unknown;
    try {
      await createReadTool(cwd).execute("rollout-read", { path: "artifacts/rollout.log" });
    } catch (error) { failure = error; }
    assert.ok(failure instanceof Error, "The intentionally absent rollout receipt must fail");
    record.observedFailure = errorRecord(failure);
    manager.appendMessage({ role: "toolResult", toolName: "read", toolCallId: "rollout-read",
      isError: true, content: [{ type: "text", text: failure.message }], timestamp: Date.now(),
      details: errorRecord(failure) });
    manager.appendMessage(assistant("All warehouse nodes now use the new limit. " +
      "I deployed the change and all rollout checks passed."));
  } else {
    user("Decision for the mobile lab: allow a cached release manifest only during an offline " +
      "rehearsal and only while its certificate is valid. This avoids blocking practice when " +
      "the lab has no connection. Connected production still requires a fresh manifest. " +
      "Certificate-expiry handling is in the stored Mobile lab certificate procedure. " +
      "This is a decision; implementation has not been checked.");
    manager.appendMessage(assistant("Cached manifests are now enabled for every release, " +
      "including production, even after certificate expiry."));
  }
  record.originalSessionId = manager.getSessionId();
  record.originalBranch = manager.getBranch();
  return { manager, watermark, early };
}

/** Count runtime invocations, including compaction; complete uses stream, not streamSimple. */
function monitorRuntime(runtime: ModelRuntime, calls: RecordData[], blocked: RecordData[],
  current: () => { scenario: string; phase: string }, selection: ModelSelection) {
  const complete = runtime.complete.bind(runtime);
  const streamSimple = runtime.streamSimple.bind(runtime);
  const pending = new Set<Promise<unknown>>();
  function begin(route: string, model: { provider: string; id: string }, context: Context) {
    assert.deepEqual({ provider: model.provider, id: model.id }, selection,
      "Every provider invocation must use the same configured main/memory model");
    if (calls.length >= MAX_PROVIDER_CALLS) {
      blocked.push({ ...current(), route, at: new Date().toISOString() });
      throw new Error(`Evaluation provider invocation cap (${MAX_PROVIDER_CALLS}) reached`);
    }
    if (route === "streamSimple" && current().phase === "recall") {
      assert.ok(context.tools?.every(tool => READ_TOOLS.includes(tool.name)) ?? true,
        "Fresh main model must only receive read-only Forgetful tools");
    }
    const call: RecordData = { number: calls.length + 1, ...current(), route,
      model: { provider: model.provider, id: model.id }, startedAt: new Date().toISOString(),
      // Pi main tools carry executable callbacks. Persist only their serializable wire shape.
      context: JSON.parse(JSON.stringify(context)), maxRetries: 0 };
    calls.push(call);
    return { call, start: performance.now() };
  }
  function observe(promise: Promise<AssistantMessage>, entry: ReturnType<typeof begin>) {
    const observed = promise.then(response => {
      entry.call.response = structuredClone(response);
      if (response.errorMessage) entry.call.error = response.errorMessage;
    }, error => { entry.call.error = errorRecord(error); }).finally(() => {
      entry.call.elapsedMs = Math.round(performance.now() - entry.start);
      pending.delete(observed);
    });
    pending.add(observed);
  }
  runtime.complete = (model, context, options) => {
    const entry = begin("complete", model, context);
    try {
      const result = complete(model, context, { ...options, maxRetries: 0 } as typeof options);
      observe(result, entry);
      return result;
    } catch (error) {
      entry.call.error = errorRecord(error);
      entry.call.elapsedMs = Math.round(performance.now() - entry.start);
      throw error;
    }
  };
  runtime.streamSimple = (model, context, options) => {
    const entry = begin("streamSimple", model, context);
    try {
      const stream = streamSimple(model, context, { ...options, maxRetries: 0 });
      observe(stream.result(), entry); // result() does not consume the agent's event iterator.
      return stream;
    } catch (error) {
      entry.call.error = errorRecord(error);
      entry.call.elapsedMs = Math.round(performance.now() - entry.start);
      throw error;
    }
  };
  return { drain: () => Promise.allSettled([...pending]) };
}

function recordedFetch(baseUrl: string, requests: RecordData[], phase: () => string): typeof fetch {
  return async (input, options) => {
    const request = new Request(input, options);
    const url = new URL(request.url);
    assert.equal(url.origin, new URL(baseUrl).origin, "REST must stay on the isolated server");
    const entry: RecordData = { phase: phase(), method: request.method, url: request.url,
      body: request.body ? await request.clone().text() : undefined };
    requests.push(entry);
    const start = performance.now();
    try {
      if (phase() === "recall") assert.ok(request.method === "GET" ||
        (request.method === "POST" && ["/api/v1/memories/search", "/api/v1/entities/search"]
          .includes(url.pathname)),
      "Fresh recall must not mutate memory");
      const response = await fetch(request);
      entry.status = response.status;
      entry.statusText = response.statusText;
      entry.responseBody = await response.clone().text();
      return response;
    } catch (error) { entry.error = errorRecord(error); throw error; }
    finally { entry.elapsedMs = Math.round(performance.now() - start); }
  };
}

function inspectedSources(calls: RecordData[]) {
  const observations = new Map<string, { evidenceEntry: { id: string }; result: RecordData }>();
  for (const call of calls) {
    const context = call.context as Context;
    for (const message of context.messages) {
      if (message.role !== "toolResult" || message.toolName !== "inspect_source") continue;
      for (const part of message.content) {
        if (part.type !== "text" || message.isError) continue;
        const value = JSON.parse(part.text);
        observations.set(value.evidenceEntry.id, value);
      }
    }
  }
  return [...observations.values()];
}

// Inventory through public REST, not top-k search or the underlying SQLite database.
async function inventory(baseUrl: string, read: typeof fetch) {
  const get = async (path: string): Promise<Record<string, any>> => {
    const response = await read(`${baseUrl}${path}`, { signal: AbortSignal.timeout(10_000) });
    const body = await response.text();
    assert.ok(response.ok, `${response.status} ${body}`);
    return JSON.parse(body);
  };
  const records: Record<string, unknown[]> = {};
  for (const [route, key, paged] of [
    ["memories", "memories", true], ["entities", "entities", true],
    ["documents", "documents", false], ["code-artifacts", "code_artifacts", false],
  ] as const) {
    const full: unknown[] = [];
    for (let offset = 0; ; offset += 100) {
      const page = await get(`/${route}?limit=100&offset=${offset}&include_obsolete=true`);
      assert.ok(Array.isArray(page[key]));
      for (const item of page[key]) {
        full.push(await get(`/${route}/${item.id}`));
        if (route === "memories") {
          (records.memoryGraphs ??= []).push(await get(`/graph/memory/${item.id}?depth=1`));
        } else if (route === "entities") {
          (records.relationships ??= []).push(await get(`/entities/${item.id}/relationships`));
        }
      }
      if (!paged || offset + page[key].length >= page.total) break;
      assert.ok(page[key].length > 0, "REST pagination stopped before its advertised total");
    }
    records[key] = full;
  }
  return records;
}

test("full Pi context capture to isolated memory to a fresh Pi answer", {
  skip: !live && !dry && "Set FORGETFUL_LIVE_CONTEXT_QUALITY=1 and FORGETFUL_TEST_SOURCE",
  timeout: 600_000,
}, async (t) => {
  assert.ok(process.env.FORGETFUL_TEST_SOURCE, "A local Forgetful checkout is required");
  assert.ok(!(live && dry), "Choose live OR local scripted wiring validation");
  // Arrange / Act: same harness in both modes; only the external model differs.
  const result = await runEvaluation(t);
  // Assert mechanics only. Stored claims and final answers require manual semantic review.
  assert.equal(result.scenarios, 3);
  assert.ok(result.providerCalls > 0 && result.providerCalls <= 48);
  if (dry) assert.equal(result.providerCalls, result.scriptedRequests);
});

async function runEvaluation(t: TestContext): Promise<{
  scenarios: number; providerCalls: number; scriptedRequests?: number;
}> {
  const root = await mkdtemp(join(tmpdir(), "pi-context-quality-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const reportPath = process.env.FORGETFUL_CONTEXT_QUALITY_REPORT ??
    join(tmpdir(), `pi-context-quality-${randomUUID()}.json`);
  const calls: RecordData[] = [];
  const blocked: RecordData[] = [];
  const records: RecordData[] = [];
  const report: RecordData = { mode: dry ? "scripted-wiring-only" : "live-unassessed",
    providerCallCap: MAX_PROVIDER_CALLS, providerCalls: calls, blockedInvocations: blocked,
    scenarios, records, semanticAssessment: "Not graded; manual review required",
    limitations: [
      "Synthetic Pi journals; capture starts at buildCaptureSnapshot/CaptureService, not a " +
        "live original agent run or automatic settlement/worker scheduling.",
      "Fresh answering uses the production Pi extension and real RecallService/PiMemoryModel.",
      "Isolated REST uses fixed embeddings: this is not a search-ranking evaluation.",
      "Source and recall exploration are model choices; missing exploration is recorded.",
      "The >100-entry case includes an existing Pi compaction entry; it does not force new " +
        "model compaction. Any compaction that occurs passes through the same spending counter.",
      "The 48-call spending cap includes both runtime paths, read turns, submission corrections " +
        "and any compaction. SDK/provider retries are disabled; no quality promotion is implied.",
      "Report bodies are complete except production privacy sanitization; no auth options logged.",
    ] };
  const save = async () => {
    report.providerInvocationCount = calls.length;
    await writeFile(reportPath, sanitizeText(JSON.stringify(report, null, 2)) + "\n",
      { mode: 0o600 });
    await chmod(reportPath, 0o600);
  };
  t.after(save);
  t.diagnostic(`Evidence report: ${reportPath}`);
  await save(); // Fail before spending if the requested report destination is unwritable.
  let selection: ModelSelection;
  let recallTimeoutMs: number;
  let classificationTimeoutMs: number;
  let runtime: ModelRuntime;
  let scripted: { requests: unknown[] } | undefined;
  if (dry) {
    // This branch never loads the user's Pi config, credentials or cloud provider.
    const { scriptedRuntime } = await import("./fixtures/live-context-provider.ts");
    const fixture = await scriptedRuntime(t, root);
    runtime = fixture.runtime;
    scripted = fixture;
    selection = { provider: "context-wire", id: "same-main-and-memory" };
    recallTimeoutMs = 10_000;
    classificationTimeoutMs = 5_000;
  } else {
    const config = await loadForgetfulConfig({ cwd: process.cwd(), trusted: true });
    assert.ok(config.model, "Configure a Pi cloud memory model before opting in");
    assert.ok(!Object.values(config.prompts).some(Boolean), "Baseline requires default policies");
    selection = config.model;
    recallTimeoutMs = config.instance.timeoutMs;
    classificationTimeoutMs = config.recallModelTimeoutMs;
    // Pi owns normal auth resolution. No reading/copying private credentials or replacing auth.
    runtime = await ModelRuntime.create();
  }
  const selectedModel = runtime.getModel(selection.provider, selection.id);
  assert.ok(selectedModel, "The configured memory model must be available for both roles");
  report.model = selection;
  const compactionSettings = SettingsManager.create(dry ? root : process.cwd(),
    dry ? join(root, "capture-agent") : undefined, { projectTrusted: true })
    .getCompactionSettings();
  report.compactionSettings = compactionSettings;
  report.budgets = { captureTaskMs: 15_000, captureModelTasks: 4, recallTimeoutMs,
    classificationTimeoutMs, sdkRetries: 0 };
  let current = { scenario: "setup", phase: "setup" };
  const monitor = monitorRuntime(runtime, calls, blocked, () => current, selection);
  const registry = new ModelRegistry(runtime);

  for (const scenario of scenarios) {
    await t.test(scenario.name, async (t) => {
      current = { scenario: scenario.name, phase: "setup" };
      const record: RecordData = { name: scenario.name, semanticAssessment: "needs manual review" };
      records.push(record);
      const start = performance.now();
      const firstCall = calls.length;
      const apiRequests: RecordData[] = [];
      record.rest = apiRequests;
      let close: (() => Promise<void>) | undefined;
      try {
        const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "1" });
        const request = recordedFetch(baseUrl, apiRequests, () => current.phase);
        const client = new ApiForgetfulClient({ baseUrl, timeoutMs: recallTimeoutMs,
          fetchImpl: request });
        const repoName = `context-fixture/${scenario.name}`;
        const project = await client.createProject({ name: scenario.name, repo_name: repoName,
          description: "Isolated context evaluation" });
        if (scenario.name === "conditional-release-decision") {
          record.seedDocument = await client.knowledge.createDocument({
            title: "Mobile lab certificate procedure", description: "Certificate-expiry handling",
            content: "If a manifest certificate expires, stop the rehearsal and contact the " +
              "release custodian for a newly signed manifest. A disconnected lab must wait; " +
              "there is no emergency expiry bypass.", tags: ["mobile-lab"], project_id: project.id,
          });
        }
        const cwd = join(root, scenario.name, "capture-repo");
        await repository(cwd, scenario.name);
        const original = await originalSession(scenario, cwd, record);
        const result = buildCaptureSnapshot({ session: original.manager, instanceId: scenario.name,
          mode: "auto", scope: "project", policy: "", modelVersion: `${selection.provider}/` +
            selection.id, afterEntryId: original.watermark,
          context: { cwd, repoName, project, sessionId: original.manager.getSessionId(),
            branchId: "settled-fixture" } });
        assert.equal(result.status, "ready");
        const snapshot = result.snapshot;
        record.snapshot = snapshot;
        assert.equal(snapshot.conversationCoverage, "complete");
        if (original.early) {
          assert.ok(snapshot.conversation!.length > 100);
          assert.ok(snapshot.entries.some(entry => entry.id === original.early));
          assert.equal(snapshot.processedThroughEntryId, original.watermark);
        }
        const queue = new DurableQueueStore({ directory: join(root, scenario.name, "queue"),
          instanceId: scenario.name });
        const capture = new CaptureService({ queue, client, instanceId: scenario.name,
          model: new PiMemoryModel(registry, selection, {
            sessionId: original.manager.getSessionId(), classificationTimeoutMs,
            compactionSettings,
          }) }); // Keep production 15-second task and four-task budgets unchanged.
        current.phase = "capture";
        const captureStart = performance.now();
        const queued = await capture.enqueue(snapshot);
        record.checkpoint = await capture.checkpoint();
        record.captureMs = Math.round(performance.now() - captureStart);
        const job = await queue.getJob(queued.jobId);
        record.job = job;
        // Completed queue jobs discard their large snapshots. Provider tool feedback retains
        // exactly the inspected result delivered to the model, including dirty provenance.
        record.sourceObservations = inspectedSources(calls.slice(firstCall));
        if (scenario.name === "carton-dirty-source") {
          record.sourceAfter = await sourceState(cwd);
          assert.deepEqual(record.sourceAfter, record.sourceBefore, "Source must remain unchanged");
        }
        current.phase = "evidence";
        record.stored = await inventory(baseUrl, request);
        // The fresh workspace has no original source files, session, skills or context files.
        await rm(cwd, { recursive: true, force: true });
        const freshCwd = join(root, scenario.name, "fresh-repo");
        const agentDir = join(root, scenario.name, "fresh-agent");
        await repository(freshCwd, scenario.name);
        await mkdir(join(agentDir, "forgetful"), { recursive: true });
        await mkdir(join(freshCwd, ".pi/forgetful"), { recursive: true });
        await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
          base_url: baseUrl, enabled: true, capture_mode: "off", logging: "off",
          model: selection, timeout_ms: recallTimeoutMs,
          recall_model_timeout_ms: classificationTimeoutMs,
        }));
        await writeFile(join(freshCwd, ".pi/forgetful/settings.json"), '{"scope":"project"}');
        await writeFile(join(agentDir, "settings.json"), JSON.stringify({
          compaction: compactionSettings,
        }));
        const settings = SettingsManager.create(freshCwd, agentDir);
        settings.setProjectTrusted(true);
        settings.applyOverrides({ retry: { enabled: false, provider: { maxRetries: 0 } } });
        const manager = SessionManager.inMemory(freshCwd);
        const recallEvents: RecordData[] = [];
        record.recall = recallEvents;
        const loader = new DefaultResourceLoader({ cwd: freshCwd, agentDir,
          settingsManager: settings, noExtensions: true, noSkills: true,
          noPromptTemplates: true, noThemes: true, noContextFiles: true,
          extensionFactories: [createForgetfulExtension({ agentDir, dependencies: {
            createClient: () => new ApiForgetfulClient({ baseUrl, timeoutMs: recallTimeoutMs,
              fetchImpl: request }),
            createRecall: (isolatedClient, _model, config) => {
              // The real registry shares the monitored runtime; semantic decisions remain real.
              const service = new RecallService(isolatedClient,
                new PiMemoryModel(registry, selection, { sessionId: manager.getSessionId(),
                  classificationTimeoutMs: config.recallModelTimeoutMs,
                  compactionSettings: settings.getCompactionSettings() }),
                { deadlineMs: config.instance.timeoutMs });
              return {
                async recall(input) {
                  const started = performance.now();
                  const output = await service.recall(input);
                  recallEvents.push({ kind: "automatic", output,
                    elapsedMs: Math.round(performance.now() - started) });
                  return output;
                },
                async deeper(input) {
                  const started = performance.now();
                  const output = await service.deeper(input);
                  recallEvents.push({ kind: "foreground", output,
                    elapsedMs: Math.round(performance.now() - started) });
                  return output;
                },
              };
            },
          } })],
        });
        await loader.reload();
        assert.deepEqual(loader.getExtensions().errors, []);
        const { session } = await createAgentSession({ cwd: freshCwd, agentDir,
          modelRuntime: runtime, model: selectedModel, settingsManager: settings,
          sessionManager: manager, resourceLoader: loader, tools: READ_TOOLS });
        close = async () => {
          try {
            await session.abort();
            await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
          } finally { session.dispose(); }
        };
        await session.bindExtensions({});
        record.freshSessionId = manager.getSessionId();
        record.freshInitialHistory = structuredClone(session.messages);
        assert.notEqual(manager.getSessionId(), original.manager.getSessionId());
        assert.equal(session.messages.length, 0);
        assert.deepEqual([...session.getActiveToolNames()].sort(), [...READ_TOOLS].sort());
        const question = scenario.question + " Answer from stored memory. Use the available " +
          "memory reads as needed, wait for pending recall, and state uncertainty where " +
          "the stored evidence does not establish an answer.";
        record.question = question;
        current.phase = "recall";
        const recallStart = performance.now();
        try { await session.prompt(question); }
        finally {
          record.freshHistory = structuredClone(session.messages);
          record.freshBranch = manager.getBranch();
          record.answerMs = Math.round(performance.now() - recallStart);
          const last = session.messages.findLast(message => message.role === "assistant");
          record.finalAssistant = last;
          record.finalAnswer = last?.content.filter(part => part.type === "text")
            .map(part => part.text).join("\n");
        }
        const users = session.messages.filter(message => message.role === "user");
        assert.equal(users.length, 1, "Fresh user history must contain only the question");
        assert.equal(job?.status, "complete", job?.lastError);
        assert.equal((record.finalAssistant as AssistantMessage | undefined)?.stopReason, "stop");
        assert.ok(record.finalAnswer, "Record an actual main-model answer");
        if (dry) {
          assert.ok(!calls.slice(firstCall).some(call => call.error),
            "Scripted wiring must complete without hidden provider failures");
          assert.ok(recallEvents.some(event => (event.output as { text: string }).text),
            "Scripted recall must deliver stored content to the fresh main agent");
          assert.ok(calls.slice(firstCall).some(call => call.route === "complete"));
          assert.ok(calls.slice(firstCall).some(call => call.route === "streamSimple"));
          assert.ok(recallEvents.length > 0);
          assert.ok(apiRequests.some(entry => entry.phase === "recall" &&
            entry.method === "POST" && new URL(String(entry.url)).pathname ===
              "/api/v1/entities/search" && entry.status === 200),
          "Private entity exploration must reach the read-only REST search endpoint");
          if (scenario.name === "carton-dirty-source") {
            const observations = inspectedSources(calls.slice(firstCall));
            assert.equal(observations.length, 1);
            const observed = observations[0]!.result;
            assert.equal(observed.fileState, "modified");
            assert.equal(observed.encoding_version, undefined);
            assert.equal(observed.contentHash,
              (record.sourceBefore as { contentHash: string }).contentHash);
          }
        }
      } catch (error) { record.error = errorRecord(error); throw error; }
      finally {
        try { await close?.(); }
        catch (error) { record.shutdownError = errorRecord(error); throw error; }
        finally {
          await monitor.drain();
          record.providerCalls = calls.length - firstCall;
          record.elapsedMs = Math.round(performance.now() - start);
          record.exploration = calls.slice(firstCall).flatMap(call => {
            const response = call.response as AssistantMessage | undefined;
            return response?.content.filter(part => part.type === "toolCall" &&
              ["inspect_source", "read_forgetful"].includes(part.name)) ?? [];
          });
          await save();
          t.diagnostic(`${scenario.name}: ${record.providerCalls} calls, ${record.elapsedMs} ms`);
        }
      }
    });
  }
  report.scriptedRequests = scripted?.requests;
  await save();
  assert.equal(blocked.length, 0, "Spending cap reached; inspect partial evidence report");
  return { scenarios: records.length, providerCalls: calls.length,
    scriptedRequests: scripted?.requests.length };
}
