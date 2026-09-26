import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { createAssistantMessageEventStream, type AssistantMessage } from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { decodeProviderContext } from "./provider-context.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

test("real Pi capture rechecks trust synchronously after final endpoint authorization", realOptions,
  async (t) => {
    // Arrange: actual Pi lifecycle/config, private submission adapter and isolated REST storage.
    const baseUrl = await startForgetful(t, { MEMORY_NUM_AUTO_LINK: "1" });
    const setup = new ApiForgetfulClient({ baseUrl });
    const project = await setup.createProject({ name: "Gate", repo_name: "test/capture-gate",
      description: "Immediate mutation guard" });
    const unrelated = await setup.create({ title: "Printer queue",
      content: "The office printer queues badges.", context: "Unrelated work",
      keywords: [], tags: [], project_ids: [project.id] });
    const root = await mkdtemp(join(tmpdir(), "capture-gate-pi-"));
    let closeSession: (() => Promise<void>) | undefined;
    t.after(async () => {
      try { await closeSession?.(); }
      finally { await rm(root, { recursive: true, force: true }); }
    });
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
      base_url: baseUrl, model: "gate-test/memory", capture_mode: "auto", enabled: true,
      verbosity: "debug", timeout_ms: 4000,
    }));
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin",
      "https://github.com/test/capture-gate.git"]);
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    let reviewed = false, postReviewReads = 0, unlinks = 0, revoked = false;
    const client = new ApiForgetfulClient({ baseUrl, fetchImpl: async (url, init) => {
      if (init?.method === "DELETE") unlinks++;
      const response = await fetch(url, init);
      if (reviewed && init?.method === "GET" &&
          new URL(String(url)).pathname.endsWith(`/memories/${unrelated.id}`)) {
        // Revoke during the endpoint read immediately before the submitted unlink.
        // There is no separate graph-repair/readback phase in this executor.
        if (++postReviewReads === 1) {
          settings.setProjectTrusted(false);
          revoked = true;
        }
      }
      return response;
    } });
    const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
      modelsPath: null, refreshOnCreate: false });
    runtime.registerProvider("gate-test", {
      api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
        input: ["text"], contextWindow: 32000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
      streamSimple(model, context) {
        const name = model.id === "memory" ? context.tools?.[0]?.name : undefined;
        let args: unknown;
        if (name) {
          const { input } = decodeProviderContext(context);
          if (name === "submit_capture_candidates") args = { candidates: [{ id: "reports",
            title: "Queue reports", content: "Queue report generation to keep requests short.",
            context: "Latency decision", keywords: ["reports"], tags: [],
            sourceEntryIds: [input.eligibleEvidence.find(
              (e: { role: string }) => e.role === "user").id],
            evidenceType: "userDecision" }] };
          else if (name === "submit_capture_decision") args = { action: "create" };
          else if (name === "submit_capture_links") {
            reviewed = true;
            args = { reviews: [{ candidateId: "reports", decisions: [{ memoryId: unrelated.id,
              action: "reject", reason: "Printer queue is unrelated to report generation" }] }] };
          } else throw new Error(`Unexpected private tool ${name}`);
        }
        const message = { role: "assistant", api: "faux", provider: "gate-test", model: model.id,
          content: name ? [{ type: "toolCall", id: "submission", name, arguments: args }]
            : [{ type: "text", text: model.id === "main" ? "Understood." : JSON.stringify({
              search: false, queries: [], queryIntent: "", entities: [],
            }) }], stopReason: name ? "toolUse" : "stop", timestamp: Date.now(),
          usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        } as AssistantMessage;
        const stream = createAssistantMessageEventStream();
        stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
        stream.end(message);
        return stream;
      },
    });
    let reportRevokedTrust: () => void = () => undefined;
    const revokedTrustObserved = new Promise<void>((resolve) => { reportRevokedTrust = resolve; });
    const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
      noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [(pi) => {
        pi.on("session_start", (_event, ctx) => {
          const trusted = ctx.isProjectTrusted.bind(ctx);
          ctx.isProjectTrusted = () => {
            const value = trusted();
            if (revoked && !value) reportRevokedTrust();
            return value;
          };
        });
        return createForgetfulExtension({ agentDir, dependencies: { client } })(pi);
      }],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
      model: runtime.getModel("gate-test", "main"), settingsManager: settings,
      sessionManager: SessionManager.inMemory(root), resourceLoader: loader, noTools: "builtin" });
    closeSession = async () => {
      try {
        await session.abort();
        await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
      } finally { session.dispose(); }
    };
    await session.bindExtensions({});

    // Act: real settled capture, then trust revocation while the final REST read is in flight.
    await session.prompt("Queue report generation to keep browser requests short.");
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([revokedTrustObserved, new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error("Capture did not observe revoked Pi trust"));
        }, 8000);
      })]);
    } finally { clearTimeout(timer); }

    // Assert at the stored graph and Pi trust boundaries, not internal guard calls.
    assert.equal(revoked, true);
    assert.equal(postReviewReads, 1, "Revocation occurs in final endpoint authorization");
    assert.equal(unlinks, 0, "Pi trust must reach the final synchronous mutation guard");
    const old = await setup.get(unrelated.id);
    assert.equal(old.linked_memory_ids?.length, 1, "The automatic link remains untouched");
  });
