import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { promisify } from "node:util";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type ToolResultMessage,
} from "@earendil-works/pi-ai";
import {
  createForgetfulExtension, type ForgetfulExtensionDependencies,
} from "../src/extension.ts";

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

/** Real Pi and extension; only the external LLM's tool choices are scripted. */
export async function createToolSession(
  t: TestContext, baseUrl: string,
  calls: Array<ToolCall | ((results: ToolResultMessage[]) => ToolCall)>,
  remote = "https://github.com/test/validation.git",
  dependencies?: ForgetfulExtensionDependencies,
) {
  const root = await mkdtemp(join(tmpdir(), "forgetful-tool-validation-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: baseUrl, enabled: true, capture_mode: "off", timeout_ms: 4000,
  }));
  const git = promisify(execFile);
  await git("git", ["init", "--quiet", root]);
  await git("git", ["-C", root, "remote", "add", "origin", remote]);
  const runtime = await ModelRuntime.create({
    authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
  });
  const modelResults: ToolResultMessage[][] = [];
  let next = 0;
  runtime.registerProvider("validation-test", {
    api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
    models: [{ id: "main", name: "main", reasoning: false, input: ["text"],
      contextWindow: 64000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
    streamSimple(model, context) {
      const results = context.messages.filter((item) => item.role === "toolResult");
      modelResults.push(structuredClone(results));
      const entry = calls[next++];
      const call = typeof entry === "function" ? entry(results) : entry;
      const message: AssistantMessage = {
        role: "assistant", api: "faux", provider: "validation-test", model: model.id,
        content: call ? [{ type: "toolCall", id: `call-${next}`, ...call }]
          : [{ type: "text", text: "Validation checks finished." }],
        stopReason: call ? "toolUse" : "stop", timestamp: Date.now(),
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      };
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: call ? "toolUse" : "stop", message });
      stream.end(message);
      return stream;
    },
  });
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
  const loader = new DefaultResourceLoader({
    cwd: root, agentDir, settingsManager: settings, noSkills: true,
    noPromptTemplates: true, noThemes: true, noContextFiles: true,
    extensionFactories: [createForgetfulExtension({ agentDir, dependencies })],
  });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const { session } = await createAgentSession({
    cwd: root, agentDir, modelRuntime: runtime,
    model: runtime.getModel("validation-test", "main"), settingsManager: settings,
    sessionManager: SessionManager.inMemory(root), resourceLoader: loader, noTools: "builtin",
  });
  t.after(() => session.dispose());
  await session.bindExtensions({});
  return { session, modelResults, root, settings };
}

export function resultText(result: ToolResultMessage): string {
  return result.content.filter((item) => item.type === "text")
    .map((item) => item.text).join("\n");
}
