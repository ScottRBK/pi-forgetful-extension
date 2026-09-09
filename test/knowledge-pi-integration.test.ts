import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager,
} from "@earendil-works/pi-coding-agent";
import {
  createAssistantMessageEventStream, type AssistantMessage, type Context,
} from "@earendil-works/pi-ai";
import { createForgetfulExtension } from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

test("real Pi encodes linked repository knowledge through real REST without a background model",
  { ...realOptions, timeout: 40_000 }, async (t) => {
    // Arrange: real Pi, a trusted temporary repo and isolated Forgetful; only the LLM is scripted.
    const baseUrl = await startForgetful(t);
    const client = new ApiForgetfulClient({ baseUrl, timeoutMs: 4000 });
    const root = await mkdtemp(join(tmpdir(), "knowledge-pi-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const agentDir = join(root, "agent");
    await mkdir(join(agentDir, "forgetful"), { recursive: true });
    await writeFile(join(agentDir, "forgetful/settings.json"), JSON.stringify({
      base_url: baseUrl, enabled: true, capture_mode: "off", timeout_ms: 4000,
    }));
    const git = promisify(execFile);
    await git("git", ["init", "--quiet", root]);
    await git("git", ["-C", root, "remote", "add", "origin", "https://github.com/test/encode.git"]);
    await writeFile(join(root, "README.md"), "# API\nThe API stores validated requests.\n");
    await git("git", ["-C", root, "add", "README.md"]);
    await git("git", ["-C", root, "-c", "user.name=Test", "-c", "user.email=test@example.invalid",
      "commit", "--quiet", "-m", "fixture"]);
    const contexts: Context[] = [];
    const results: unknown[] = [];
    let step = 0;
    let finished = 0;
    const fileBytes = Buffer.from([0, 255, 13, 10, 128, 1]);
    const fileResponse = await fetch(`${baseUrl}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: "reference.bin", description: "Existing binary reference",
        mime_type: "application/octet-stream", data: fileBytes.toString("base64"), tags: [] }),
    });
    assert.equal(fileResponse.status, 201);
    const storedFile = await fileResponse.json() as { id: number };
    const imageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA" +
      "AAC0lEQVR42mP8/x8AAwMCAO+aH1sAAAAASUVORK5CYII=";
    const imageResponse = await fetch(`${baseUrl}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: "diagram.png", description: "Existing architecture image",
        mime_type: "image/png", data: imageData, tags: [] }),
    });
    assert.equal(imageResponse.status, 201);
    const storedImage = await imageResponse.json() as { id: number };
    const operations = [
      () => ({ name: "forgetful_project_init", arguments: {
        name: "API", description: "Stores validated requests",
      } }),
      () => ({ name: "forgetful_knowledge_write", arguments: {
        operation: "create_document", title: "API architecture", description: "Request flow",
        content: "The API validates requests before storing them.", document_type: "markdown",
        tags: ["architecture"], source_files: ["README.md"],
      } }),
      () => ({ name: "forgetful_knowledge_write", arguments: {
        operation: "create_entity", name: "API", entity_type: "System", tags: [], aka: [],
        source_files: ["README.md"],
      } }),
      async () => {
        const project = (await client.listProjects("test/encode"))[0]!;
        assert.ok(project, JSON.stringify(results));
        const document = (await client.knowledge.listDocuments(project.id))[0]!;
        assert.ok(document, JSON.stringify(results));
        return { name: "forgetful_knowledge_write", arguments: {
          operation: "create_memory", title: "API request validation",
          content: "The API validates requests before storing them.", context: "Repository survey",
          keywords: ["API", "validation"], tags: ["architecture"],
          document_ids: [document.id], source_files: ["README.md"],
        } };
      },
      async () => {
        const entity = (await client.knowledge.searchEntities("API"))[0]!;
        const memory = (await client.search({ query: "API", query_context: "verify encode",
          strict_project_filter: false }))[0]!;
        return { name: "forgetful_knowledge_write", arguments: {
          operation: "link_entity_memory", entity_id: entity.id, memory_id: memory.id,
        } };
      },
      async () => {
        const project = (await client.listProjects("test/encode"))[0]!;
        const document = (await client.knowledge.listDocuments(project.id))[0]!;
        return { name: "forgetful_knowledge_read", arguments: {
          operation: "get_document", document_id: document.id,
        } };
      },
      () => ({ name: "forgetful_knowledge_read", arguments: {
        operation: "get_file", file_id: storedFile.id,
      } }),
      () => ({ name: "forgetful_knowledge_read", arguments: {
        operation: "get_file", file_id: storedImage.id,
      } }),
    ];
    const runtime = await ModelRuntime.create({
      authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false,
    });
    runtime.registerProvider("test", {
      api: "faux", apiKey: "test-only", baseUrl: "http://127.0.0.1/unused",
      models: [{ id: "main", name: "main", reasoning: false, input: ["text", "image"],
        contextWindow: 64000, maxTokens: 2048,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }],
      streamSimple(model, context) {
        contexts.push(context);
        results.push(...context.messages.filter((message) => message.role === "toolResult"));
        const stream = createAssistantMessageEventStream();
        const index = step++;
        void (async () => {
          const operation = operations[index % (operations.length + 1)];
          const call = operation ? await operation() : undefined;
          const message: AssistantMessage = {
            role: "assistant", api: "faux", provider: "test", model: model.id,
            content: call ? [{ type: "toolCall", id: `call-${index}`, ...call }] :
              [{ type: "text", text: "Coverage: API documented; deployment details are missing." }],
            stopReason: call ? "toolUse" : "stop", timestamp: Date.now(),
            usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
          };
          stream.push({ type: "done", reason: call ? "toolUse" : "stop", message });
          stream.end(message);
          if (!call) finished++;
        })().catch((error) => { stream.end(); throw error; });
        return stream;
      },
    });
    const settings = SettingsManager.create(root, agentDir);
    settings.setProjectTrusted(true);
    settings.applyOverrides({ retry: { enabled: false }, compaction: { enabled: false } });
    const loader = new DefaultResourceLoader({
      cwd: root, agentDir, settingsManager: settings, noSkills: true,
      noPromptTemplates: true, noThemes: true, noContextFiles: true,
      extensionFactories: [createForgetfulExtension({ agentDir })],
    });
    await loader.reload();
    assert.deepEqual(loader.getExtensions().errors, []);
    const { session } = await createAgentSession({
      cwd: root, agentDir, modelRuntime: runtime, model: runtime.getModel("test", "main"),
      settingsManager: settings, sessionManager: SessionManager.inMemory(root),
      resourceLoader: loader, noTools: "builtin",
    });
    t.after(() => session.dispose());
    await session.bindExtensions({});

    // Act: exercise the actual slash command twice through Pi's normal tool validation/execution.
    for (let run = 1; run <= 2; run++) {
      await session.prompt("/forgetful encode");
      const deadline = Date.now() + 10_000;
      while (finished < run && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      assert.equal(finished, run, JSON.stringify(session.messages));
    }

    // Assert: persisted knowledge is complete, linked and not duplicated by the second run.
    const fileResult = results.find((result) => {
      const value = result as { details?: { operation?: string; id?: number } };
      return value.details?.operation === "get_file" && value.details.id === storedFile.id;
    }) as { details: { path?: string }; content: unknown[] } | undefined;
    assert.ok(fileResult?.details.path, "Binary files need a usable local download path");
    assert.ok(fileResult.details.path.startsWith(join(agentDir, "forgetful/downloads/")));
    assert.deepEqual(await readFile(fileResult.details.path), fileBytes);
    assert.equal((await stat(fileResult.details.path)).mode & 0o777, 0o600);
    assert.ok(!JSON.stringify(fileResult).includes(fileBytes.toString("base64")));
    const imageResult = results.find((result) => {
      const value = result as { details?: { operation?: string; id?: number } };
      return value.details?.operation === "get_file" && value.details.id === storedImage.id;
    }) as { content: Array<{ type: string; data?: string; mimeType?: string }> } | undefined;
    assert.deepEqual(imageResult?.content.find((part) => part.type === "image"),
      { type: "image", data: imageData, mimeType: "image/png" });
    assert.equal(imageResult && "file" in imageResult, false);
    const project = (await client.listProjects("test/encode"))[0]!;
    const documents = await client.knowledge.listDocuments(project.id);
    const entities = await client.knowledge.searchEntities("API");
    const memories = await client.search({ query: "API", query_context: "verify encode",
      project_ids: [project.id], strict_project_filter: true });
    assert.equal(documents.length, 1);
    assert.equal(entities.length, 1);
    assert.equal(memories.length, 1);
    assert.deepEqual(memories[0]?.document_ids, [documents[0]!.id]);
    assert.deepEqual((await client.knowledge.getEntityMemories(entities[0]!.id)).map((m) => m.id),
      [memories[0]!.id]);
    assert.match(memories[0]?.encoding_version ?? "", /^[a-f0-9]{40}$/);
    assert.match(JSON.stringify(contexts[0]), /coverage report/i);
    assert.ok(results.every((value) => !(value as { isError?: boolean }).isError),
      JSON.stringify(results));
  });
