import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { decodeProviderContext, providerTools } from "./provider-context.ts";

test("Pi warns at normal verbosity when capture cannot match an existing project", {
  timeout: 15_000,
}, async (t) => {
  // Arrange: real Pi lifecycle, capture and disk queue; only external services are scripted.
  const root = await mkdtemp(join(tmpdir(), "capture-project-warning-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  const writes: string[] = [];
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.method === "GET" && request.url?.startsWith("/api/v1/projects")) {
      response.end('{"projects":[],"total":0}');
    } else {
      if (request.method !== "GET") writes.push(`${request.method} ${request.url}`);
      response.statusCode = 404;
      response.end('{"error":"No such route in fixture"}');
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  let dispose: (() => Promise<void>) | undefined;
  t.after(async () => {
    await dispose?.();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
    base_url: `http://127.0.0.1:${address.port}/api/v1`, model: "project-warning/memory",
    capture_mode: "auto", verbosity: "warning", enabled: true,
  }));
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
  const runtime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"),
    modelsPath: null, refreshOnCreate: false });
  let extractions = 0;
  runtime.registerProvider("project-warning", {
    api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
    models: ["main", "memory"].map((id) => ({ id, name: id, reasoning: false,
      input: ["text"], contextWindow: 64_000, maxTokens: 2048,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } })),
    streamSimple(model, context) {
      const name = model.id === "memory" ? providerTools(context)[0]?.name : undefined;
      let args: unknown;
      if (name === "submit_recall_plan") {
        args = { search: false, queries: [], queryIntent: "", entities: [] };
      } else if (name === "submit_capture_candidates") {
        extractions++;
        const { input } = decodeProviderContext(context);
        args = { candidates: [{ id: "retry", title: "Retry policy",
          content: "Retry transient delivery failures twice.", context: "Adopted decision",
          keywords: ["delivery"], tags: [], evidenceType: "userDecision",
          sourceEntryIds: [input.eligibleEvidence.find((e: any) => e.role === "user").id] }] };
      } else if (name) throw new Error(`Unexpected tool: ${name}`);
      const message = { role: "assistant", api: "faux", provider: "project-warning",
        model: model.id, timestamp: Date.now(), stopReason: name ? "toolUse" : "stop",
        content: name ? [{ type: "toolCall", id: "submit", name, arguments: args }]
          : [{ type: "text", text: "Understood." }],
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      } as AssistantMessage;
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: name ? "toolUse" : "stop", message });
      stream.end(message);
      return stream;
    },
  });
  const notifications: string[] = [];
  const loader = new DefaultResourceLoader({ cwd: root, agentDir, settingsManager: settings,
    noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
    extensionFactories: [(pi) => {
      pi.on("session_start", (_event, ctx) => {
        ctx.ui.notify = (message) => { notifications.push(message); };
      });
      return createForgetfulExtension({ agentDir })(pi);
    }],
  });
  await loader.reload();
  assert.deepEqual(loader.getExtensions().errors, []);
  const { session } = await createAgentSession({ cwd: root, agentDir, modelRuntime: runtime,
    model: runtime.getModel("project-warning", "main"), settingsManager: settings,
    sessionManager: SessionManager.inMemory(root), resourceLoader: loader, noTools: "builtin" });
  dispose = async () => {
    await session.abort();
    await session.extensionRunner.emit({ type: "session_shutdown", reason: "quit" });
    session.dispose();
  };
  await session.bindExtensions({});
  await session.prompt("/forgetful status");

  // Act: a settled user decision cannot be assigned to any existing project.
  await session.prompt("We adopted two retries for transient delivery failures.");
  const until = Date.now() + 3_000;
  while (!notifications.some((message) => /No matching capture project/.test(message)) &&
      Date.now() < until) await new Promise((resolve) => setTimeout(resolve, 10));

  // Assert: visible warning at the default level; no automatic project or memory creation.
  assert.equal(extractions, 1);
  assert.match(notifications.join("\n"), /No matching capture project.*create a project/i);
  assert.deepEqual(writes, []);
});
