import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { createAssistantMessageEventStream, type AssistantMessage } from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import type { Memory } from "../src/contracts.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

for (const action of ["retire", "merge"] as const) {
  test(`real Pi settles ${action} capture and reports its actual outcome`, { timeout: 12_000 },
    async (t) => {
      // Arrange: actual Pi lifecycle, model submissions, queue and transport adapter.
      // Only the external model/REST boundaries are controlled; no paid model calls.
      const root = await mkdtemp(join(tmpdir(), "maintenance-pi-"));
      const agentDir = join(root, "agent");
      await mkdir(join(agentDir, "forgetful"), { recursive: true });
      const git = promisify(execFile);
      await git("git", ["init", "--quiet", root]);
      await git("git", ["-C", root, "remote", "add", "origin",
        "https://github.com/test/maintenance.git"]);
      await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
        base_url: "http://127.0.0.1:9199/api/v1", model: "maintenance/memory",
        capture_mode: "auto", verbosity: "debug", timeout_ms: 2000,
      }));
      const project = { id: 7, name: "Maintenance", repo_name: "test/maintenance" };
      const original: Memory = { id: 1, title: "Retry policy", content: "Use bounded retries.",
        context: "Temporary workaround", keywords: ["retries"], tags: [], project_ids: [7],
        is_obsolete: false, linked_memory_ids: [] };
      const stored = new Map<number, Memory>([[1, original]]);
      if (action === "retire") stored.set(3, { ...original, id: 3 });
      stored.set(4, { ...original, id: 4, content: "The independent retry policy still applies." });
      const mutations: string[] = [], submissions: string[] = [], notices: string[] = [];
      const errors: unknown[] = [];
      let compositionAttempts = 0, compositionErrorSeen = false;
      let extractionAttempts = 0, extractionErrorSeen = false;
      let recallAfterCapture = false;
      const reviewedSources: number[][] = [];
      const client = new ApiForgetfulClient({ baseUrl: "http://127.0.0.1:9199/api/v1",
        fetchImpl: async (url, init) => {
          const path = new URL(String(url)).pathname;
          const method = init?.method ?? "GET";
          const body = init?.body ? JSON.parse(String(init.body)) : {};
          const id = Number(path.match(/\/memories\/(\d+)$/)?.[1]);
          if (method === "GET" && path.endsWith("/projects"))
            return Response.json({ projects: [project], total: 1 });
          if (method === "POST" && path.endsWith("/search"))
            return Response.json({ primary_memories: [...stored.values()].filter((m) =>
              recallAfterCapture || !m.is_obsolete), linked_memories: [] });
          if (method === "GET" && path.includes("/graph/memory/"))
            return Response.json({ center_memory_id: Number(path.split("/").at(-1)), edges: [] });
          if (method === "GET" && stored.has(id)) return Response.json(stored.get(id));
          mutations.push(`${method} ${path}`);
          if (method === "POST" && path.endsWith("/memories")) {
            stored.set(2, { ...body, id: 2, is_obsolete: false, linked_memory_ids: [] });
            return Response.json({ id: 2, linked_memory_ids: [] }, { status: 201 });
          }
          if (method === "DELETE" && stored.has(id)) {
            Object.assign(stored.get(id)!, { is_obsolete: true, obsolete_reason: body.reason,
              superseded_by: body.superseded_by ?? null });
            return Response.json({ success: true });
          }
          assert.fail(`Unexpected REST instruction: ${method} ${path}`);
        } });
      const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
        modelsPath: null, refreshOnCreate: false });
      runtime.registerProvider("maintenance", { api: "faux", apiKey: "fixture-only",
        baseUrl: "http://127.0.0.1/unused", models: ["main", "memory"].map((id) => ({
          id, name: id, reasoning: false, input: ["text"], contextWindow: 32_000, maxTokens: 2048,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
        streamSimple(model, context) {
          const name = model.id === "memory" ? providerTools(context)[0]?.name : undefined;
          let args: any;
          if (name) {
            submissions.push(name);
            const { input } = decodeProviderContext(context);
            if (name === "submit_recall_plan")
              args = { search: recallAfterCapture,
                queries: recallAfterCapture ? ["retry policy"] : [],
                queryIntent: "Recall the current retry policy", entities: [] };
            else if (name === "submit_recall_review") {
              const ids = input.availableSources.memoryIds as number[];
              reviewedSources.push(ids);
              args = { summary: ids.map((id) => stored.get(id)!.content).join(" "),
                memoryIds: ids, reason: "These active policies answer the question." };
            }
            else if (name === "submit_capture_candidates") {
              extractionAttempts++;
              extractionErrorSeen ||= context.messages.some((message) =>
                message.role === "toolResult" && message.isError);
              const source = input.eligibleEvidence.find((entry: any) => entry.role === "user");
              args = { candidates: [action === "retire" ? { id: "maintenance",
                kind: "maintenance", searchDescription: "Temporary retry workaround",
                sourceEntryIds: [source.id] } : { id: "maintenance", title: "Retry policy",
                content: "Add jitter.", context: "Adopted improvement", keywords: [], tags: [],
                sourceEntryIds: [source.id] }] };
              if (action === "retire" && extractionAttempts === 1)
                delete args.candidates[0].searchDescription;
            } else if (name === "submit_capture_decision") args = {
              action, conflictingMemoryIds: action === "retire" ? [1, 3] : [1],
              reason: "User confirmed the maintenance." };
            else if (name === "submit_capture_merge") {
              compositionAttempts++;
              compositionErrorSeen ||= context.messages.some((message) =>
                message.role === "toolResult" && message.isError);
              args = compositionAttempts === 1 ? { content: "Missing required fields" } : {
                title: "Retry policy",
              content: "Use bounded retries with jitter.", context: "Adopted policy",
              keywords: ["retries"], tags: [] };
            } else assert.fail(`Unexpected private tool ${name}`);
          }
          const message = { role: "assistant", api: "faux", provider: "maintenance",
            model: model.id, content: name ? [{ type: "toolCall", id: `call-${submissions.length}`,
              name, arguments: args }] : [{ type: "text", text: "Understood." }],
            stopReason: name ? "toolUse" : "stop", timestamp: Date.now(),
            usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          } as AssistantMessage;
          const stream = createAssistantMessageEventStream();
          stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
          stream.end(message);
          return stream;
        },
      });
      const settings = SettingsManager.create(root, agentDir);
      settings.setProjectTrusted(true);
      settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
      const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
        noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
        extensionFactories: [(pi) => {
          pi.on("session_start", (_event, ctx) => {
            const notify = ctx.ui.notify.bind(ctx.ui);
            ctx.ui.notify = (text, type) => { notices.push(text); notify(text, type); };
          });
          return createForgetfulExtension({ agentDir, dependencies: { client } })(pi);
        }] });
      await loader.reload();
      const sessionManager = SessionManager.inMemory(root);
      const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
        model: runtime.getModel("maintenance", "main"), settingsManager: settings,
        sessionManager, resourceLoader: loader,
        noTools: "builtin" });
      session.extensionRunner.onError((error) => errors.push(error));
      t.after(async () => {
        try { await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" }); }
        finally {
          session.dispose();
          await rm(root, { recursive: true, force: true });
        }
      });
      await session.bindExtensions({});
      await session.prompt("/forgetful status");
      // Act: a normal conversation settles and automatically captures maintenance evidence.
      await session.prompt(action === "retire" ? "The temporary retry workaround no longer applies."
        : "Add jitter to our bounded retry policy.");
      const expected = action === "retire" ? "retired 2 memories" : "merged 1 memory";
      const deadline = Date.now() + 3500;
      while (!notices.some((notice) => notice.includes(expected)) && Date.now() < deadline)
        await delay(10);
      // Assert: actual Pi feedback, remote state and private tools agree.
      assert.ok(notices.some((notice) => notice.includes(expected)), notices.join("\n"));
      assert.deepEqual(errors, []);
      assert.equal(stored.get(1)!.is_obsolete, true);
      assert.equal(mutations.filter((write) => write === "POST /api/v1/memories").length,
        action === "retire" ? 0 : 1);
      assert.ok(!notices.some((notice) => notice.includes("saved 1 memory")));
      assert.equal(submissions.includes("submit_capture_merge"), action === "merge");
      if (action === "retire") {
        assert.equal(extractionAttempts, 2);
        assert.equal(extractionErrorSeen, true);
      }
      if (action === "merge") {
        assert.equal(compositionAttempts, 2);
        assert.equal(compositionErrorSeen, true, "Invalid composition gets private tool feedback");
      }
      assert.deepEqual(session.getActiveToolNames(), ["forgetful_recall_wait"]);
      // A later real Pi turn must exclude obsolete sources even if search returns history.
      await session.prompt("/forgetful capture off");
      recallAfterCapture = true;
      await session.prompt("What retry policies still apply?");
      const recallDeadline = Date.now() + 3500;
      const savedRecall = () => sessionManager.getEntries().filter((entry) =>
        entry.type === "custom_message" && entry.customType === "forgetful_recall_result");
      while (!savedRecall().length && Date.now() < recallDeadline) await delay(10);
      assert.deepEqual(reviewedSources.map((ids) => ids.toSorted((a, b) => a - b)),
        [action === "merge" ? [2, 4] : [4]]);
      assert.equal(savedRecall().length, 1);
      assert.match(JSON.stringify(savedRecall()[0]), /independent retry policy still applies/);
      assert.doesNotMatch(JSON.stringify(savedRecall()[0]), /Use bounded retries\./);
      assert.deepEqual(errors, []);
    });
}
