import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  createAgentSession,
  DefaultResourceLoader,
  ModelRuntime,
  SessionManager,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream,
  type AssistantMessage,
  type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { realOptions, startForgetful } from "./real-forgetful.ts";

function jsonInput(context: Context): Record<string, unknown> {
  const message = context.messages[0];
  if (!message || typeof message.content !== "string") return {};
  try {
    const value = JSON.parse(message.content) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

async function captureJobSettled(agentDir: string): Promise<boolean> {
  const queues = join(agentDir, "forgetful", "queues");
  const directories = await readdir(queues, { withFileTypes: true }).catch(() => []);
  for (const directory of directories) {
    if (!directory.isDirectory()) continue;
    try {
      const value = JSON.parse(
        await readFile(join(queues, directory.name, "queue.json"), "utf8"),
      ) as { jobs?: Array<{
        status?: unknown;
        candidateOutcomes?: Record<string, unknown>;
        extractedCandidates?: Array<{ id?: unknown }>;
      }> };
      const job = value.jobs?.find((candidate) =>
        Boolean(candidate.candidateOutcomes?.["trust-revocation-candidate"]) ||
        candidate.extractedCandidates?.some(
          (item) => item.id === "trust-revocation-candidate",
        ),
      );
      if (job && job.status !== "pending" && job.status !== "running") return true;
    } catch {
      // The queue can be between atomic writes; read it on the next poll.
    }
  }
  return false;
}

test(
  "revoking project trust during auto capture prevents a REST mutation",
  { ...realOptions, timeout: 40_000 },
  async (t) => {
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4_000 });
    const root = await mkdtemp(join(tmpdir(), "capture-trust-pi-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(
      join(agentDir, "forgetful/settings.json"),
      JSON.stringify({
        base_url: baseUrl,
        model: "test/memory",
        enabled: true,
        capture_mode: "auto",
        timeout_ms: 4_000,
      }),
    );
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", [
      "-C",
      root,
      "remote",
      "add",
      "origin",
      "https://github.com/test/trust-capture.git",
    ]);
    await client.createProject({
      name: "Trust capture",
      description: "Trust revocation regression",
      repo_name: "test/trust-capture",
    });

    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({
      retry: { enabled: false },
      compaction: { enabled: false },
    });
    let captureStarted = false;
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"),
      modelsPath: null,
      refreshOnCreate: false,
    });
    runtime.registerProvider("test", {
      api: "faux",
      apiKey: "test-only-key",
      baseUrl: "http://127.0.0.1/unused",
      models: ["main", "memory"].map((id) => ({
        id,
        name: id,
        reasoning: false,
        input: ["text"],
        contextWindow: 64_000,
        maxTokens: 2_048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      })),
      streamSimple(model, context) {
        const stream = createAssistantMessageEventStream();
        queueMicrotask(() => {
          const input = jsonInput(context);
          let output: unknown = {
            text: "The request was handled.",
          };
          if (model.id === "memory") {
            if (Array.isArray(input.entries)) {
              captureStarted = true;
              settings.setProjectTrusted(false);
              const entries = input.entries as Array<{
                id?: unknown;
                role?: unknown;
              }>;
              const evidence = entries.find((entry) => entry.role === "user")
                ?.id;
              output = {
                candidates: evidence
                  ? [{
                      id: "trust-revocation-candidate",
                      title: "Trust revocation marker",
                      content: "This candidate must never be written after trust is revoked.",
                      context: "Trust revocation regression",
                      keywords: ["trust"],
                      tags: ["test"],
                      sourceEntryIds: [evidence],
                      evidenceType: "userDecision",
                    }]
                  : [],
              };
            } else {
              output = {
                action: "create",
                reason: "No overlapping memory exists.",
              };
            }
          }
          const captureDecision = model.id === "memory" &&
            context.tools?.some((tool) => tool.name === "submit_capture_candidates");
          const overlapDecision = model.id === "memory" &&
            Boolean(input.candidate) &&
            context.tools?.some((tool) => tool.name === "submit_capture_decision");
          const message: AssistantMessage = {
            role: "assistant",
            api: "faux",
            provider: "test",
            model: model.id,
            content: overlapDecision
              ? [{
                  type: "toolCall",
                  id: "decision-1",
                  name: "submit_capture_decision",
                  arguments: output as Record<string, any>,
                }]
              : captureDecision
              ? [{
                  type: "toolCall",
                  id: "capture-1",
                  name: "submit_capture_candidates",
                  arguments: output as Record<string, any>,
                }]
              : [{ type: "text", text: JSON.stringify(output) }],
            stopReason: captureDecision || overlapDecision ? "toolUse" : "stop",
            timestamp: Date.now(),
            usage: {
              input: 1,
              output: 1,
              cacheRead: 0,
              cacheWrite: 0,
              totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
            },
          };
          stream.push({
            type: "done",
            reason: captureDecision || overlapDecision ? "toolUse" : "stop",
            message,
          });
          stream.end(message);
        });
        return stream;
      },
    });
    const loader = new DefaultResourceLoader({
      cwd: root,
      agentDir,
      settingsManager: settings,
      noSkills: true,
      noPromptTemplates: true,
      noThemes: true,
      noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({
      cwd: root,
      agentDir,
      modelRuntime: runtime,
      model: runtime.getModel("test", "main"),
      settingsManager: settings,
      sessionManager: SessionManager.inMemory(root),
      resourceLoader: loader,
      noTools: "builtin",
    });
    t.after(() => session.dispose());
    await session.bindExtensions({});

    await session.prompt(
      "We decided to retain this trust revocation regression marker.",
    );
    const deadline = Date.now() + 10_000;
    while (!captureStarted && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    assert.equal(captureStarted, true, "auto capture did not invoke the model");
    const settleDeadline = Date.now() + 10_000;
    while (!(await captureJobSettled(agentDir)) && Date.now() < settleDeadline) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    assert.equal(
      await captureJobSettled(agentDir),
      true,
      "auto capture queue job did not settle",
    );

    const memories = await client.search({
      query: "Trust revocation marker",
      query_context: "verify trust revocation",
      strict_project_filter: false,
      k: 20,
    });
    assert.equal(memories.length, 0, JSON.stringify(memories));
  },
);
