import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  canonicalRepository,
  createForgetfulExtension,
  type CaptureServicePort,
  type RecallServicePort,
} from "../src/extension.ts";
import { ApiForgetfulClient } from "../src/http.ts";
import type {
  CaptureSnapshot,
  ForgetfulClient,
  Project,
  WorkContext,
} from "../src/contracts.ts";
import type { RecallResult } from "../src/recall.ts";

type Handler = (event: any, context: any) => Promise<unknown> | unknown;

interface FakeCapture extends CaptureServicePort {
  enqueued: CaptureSnapshot[];
  checkpoints: Array<{ sessionId?: string; branchId?: string }>;
  advanced: Array<{ sessionId: string; branchId: string; entryIds: string[] }>;
  stopped: Array<{ sessionId?: string; branchId?: string }>;
  conflicts: unknown[];
  resolutions: Array<{ id: string; value: unknown }>;
  diagnostics: () => Promise<unknown>;
}

interface Harness {
  root: string;
  agentDir: string;
  ctx: any;
  entries: any[];
  setLeaf(value: string | null): void;
  emit(name: string, event: any): Promise<unknown>;
  command(args: string): Promise<void>;
  capture: FakeCapture;
  recallCalls: string[];
  sentMessages: Array<{ message: unknown; options: unknown }>;
  notifications: string[];
  tools: Map<string, any>;
  cleanup(): Promise<void>;
}

function entry(
  id: string,
  parentId: string | null,
  role: string,
  content: string,
  stopReason?: string,
): any {
  return {
    type: "message",
    id,
    parentId,
    timestamp: new Date().toISOString(),
    message: { role, content, ...(stopReason ? { stopReason } : {}) },
  };
}

async function harness(
  options: {
    conflicts?: unknown[];
    userSettings?: Record<string, unknown>;
    uiInputs?: Array<string | undefined>;
    uiSelections?: Array<string | undefined>;
    withoutProject?: boolean;
    gitRemote?: string;
    createClient?: (options: {
      baseUrl: string;
      token?: string;
      timeoutMs: number;
    }) => ForgetfulClient;
    workContextGate?: Promise<void>;
    onWorkContext?: () => void;
  } = {},
): Promise<Harness> {
  const root = await mkdtemp(join(tmpdir(), "pi-forgetful-extension-"));
  const agentDir = join(root, "agent");
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await writeFile(
    join(agentDir, "forgetful", "settings.json"),
    JSON.stringify({
      model: "test/memory",
      capture_mode: "auto",
      enabled: true,
      ...options.userSettings,
    }),
  );

  let leaf: string | null = "root";
  const entries: any[] = [entry("root", null, "custom", "session root")];
  const recallCalls: string[] = [];
  const sentMessages: Array<{ message: unknown; options: unknown }> = [];
  const notifications: string[] = [];
  const tools = new Map<string, any>();
  const handlers = new Map<string, Handler[]>();
  const commands = new Map<
    string,
    (args: string, context: any) => Promise<void>
  >();
  const model = { provider: "test", id: "memory" };

  const capture: FakeCapture = {
    enqueued: [],
    checkpoints: [],
    advanced: [],
    stopped: [],
    conflicts: options.conflicts ?? [],
    resolutions: [],
    async enqueue(snapshot) {
      this.enqueued.push(snapshot);
      return { queued: true, jobId: snapshot.id };
    },
    async checkpoint(value = {}) {
      this.checkpoints.push(value);
      return { processed: 0, paused: false, errors: [] };
    },
    async advanceWatermark(value) {
      this.advanced.push(value);
    },
    async stop(sessionId, branchId) {
      this.stopped.push({ sessionId, branchId });
    },
    async pendingConflicts() {
      return this.conflicts;
    },
    async diagnostics() {
      return {
        jobs: [
          {
            id: "job-1",
            candidates: [{ id: "candidate-1", stage: "overlap" }],
          },
        ],
        conflicts: [{ id: "conflict-1" }],
      };
    },
    async resolveConflict(id, value) {
      this.resolutions.push({ id, value });
      return { status: "resolved" };
    },
  };

  const context: WorkContext = {
    cwd: root,
    repoName: "test/repo",
    sessionId: "session-1",
    branchId: "session-1:root",
    project: options.withoutProject
      ? undefined
      : ({
          id: 7,
          name: "Test repo",
          repo_name: "test/repo",
        } satisfies Project),
  };
  const sessionManager = {
    getSessionId: () => "session-1",
    getLeafId: () => leaf,
    getBranch: () => entries,
  };
  const ctx: any = {
    cwd: root,
    mode: "tui",
    sessionManager,
    signal: undefined,
    hasUI: true,
    isProjectTrusted: () => true,
    ui: {
      notify: (message: string) => {
        notifications.push(message);
      },
      confirm: async () => true,
      select: async (_title: string, values: string[]) =>
        options.uiSelections ? options.uiSelections.shift() : values[0],
      custom: async () => undefined,
      input: async (_title: string, placeholder?: string) =>
        options.uiInputs ? options.uiInputs.shift() : placeholder,
    },
    modelRegistry: {
      find: () => model,
      getAvailable: () => [model],
    },
    scopedModels: [],
    model,
  };
  const recall: RecallServicePort = {
    async recall(request): Promise<RecallResult> {
      recallCalls.push(request.prompt);
      return {
        text: `historical context for ${request.prompt}`,
        memoryIds: [42],
        scope: request.scope,
      };
    },
    async deeper(): Promise<RecallResult> {
      return { text: "deeper result", memoryIds: [42], scope: "global" };
    },
  };
  const pi: any = {
    on(name: string, handler: Handler) {
      handlers.set(name, [...(handlers.get(name) ?? []), handler]);
    },
    registerCommand(
      name: string,
      definition: { handler: (args: string, context: any) => Promise<void> },
    ) {
      commands.set(name, definition.handler);
    },
    registerTool(definition: any) {
      tools.set(definition.name, definition);
    },
    sendMessage(message: unknown, sendOptions: unknown) {
      sentMessages.push({ message, options: sendOptions });
    },
    exec: async () => ({
      code: options.gitRemote ? 0 : 1,
      stdout: options.gitRemote ?? "",
      stderr: "",
    }),
  };
  createForgetfulExtension({
    agentDir,
    dependencies: {
      recall,
      capture,
      ...(options.createClient ? { createClient: options.createClient } : {}),
      resolveWorkContext: async () => {
        options.onWorkContext?.();
        await options.workContextGate;
        return { ...context };
      },
    },
  })(pi);

  return {
    root,
    agentDir,
    ctx,
    entries,
    capture,
    recallCalls,
    sentMessages,
    notifications,
    tools,
    setLeaf(value) {
      leaf = value;
    },
    async emit(name, event) {
      let result: unknown;
      for (const handler of handlers.get(name) ?? [])
        result = await handler(event, ctx);
      return result;
    },
    async command(args) {
      await commands.get("forgetful")?.(args, ctx);
    },
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("setup validates the real endpoint before saving user connection settings", async () => {
  const endpoint = "http://localhost:8020/api/v1";
  const fixture = await harness({
    userSettings: {
      model: undefined,
      custom_setting: "keep",
      token: "legacy-secret",
      token_env: "OLD_FORGETFUL_TOKEN",
    },
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async (input, init) => {
          assert.equal(String(input), `${endpoint}/projects`);
          assert.equal(init?.method, "GET");
          assert.equal(
            new Headers(init?.headers).get("authorization"),
            null,
          );
          return new Response(JSON.stringify({ projects: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        },
      }),
  });
  try {
    fixture.ctx.ui.input = async () => "";
    fixture.ctx.ui.select = async () => "Unauthenticated";

    await fixture.command("setup");

    const user = JSON.parse(
      await readFile(
        join(fixture.agentDir, "forgetful", "settings.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    assert.equal(user.base_url, endpoint);
    assert.equal(user.custom_setting, "keep");
    assert.equal(user.token, undefined);
    assert.equal(user.token_env, undefined);
    assert.equal(
      fixture.notifications.some((message) =>
        message.includes("legacy-secret"),
      ),
      false,
    );
    assert.ok(
      fixture.notifications.some((message) =>
        message.includes("/forgetful model"),
      ),
    );
    await assert.rejects(
      readFile(join(fixture.root, ".pi", "forgetful", "settings.json")),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("setup keeps the current endpoint when its input is left blank", async () => {
  const endpoint = "https://memory.example/api/v1";
  let validatedEndpoint: string | undefined;
  const fixture = await harness({
    userSettings: { base_url: endpoint },
    uiInputs: [""],
    uiSelections: ["Unauthenticated"],
    createClient: (options) => {
      validatedEndpoint = options.baseUrl;
      return new ApiForgetfulClient({
        ...options,
        fetchImpl: async () =>
          new Response(JSON.stringify({ projects: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      });
    },
  });
  try {
    await fixture.command("setup");

    assert.equal(validatedEndpoint, endpoint);
    assert.ok(
      fixture.notifications.some((message) => message.includes("saved")),
    );
    const settings = JSON.parse(
      await readFile(
        join(fixture.agentDir, "forgetful", "settings.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    assert.equal(settings.base_url, endpoint);
  } finally {
    await fixture.cleanup();
  }
});

test("setup never displays credentials from a saved endpoint", async () => {
  const password = "saved-password";
  const fixture = await harness({
    userSettings: {
      base_url: `https://user:${password}@memory.example/api/v1`,
    },
  });
  try {
    const displayed: string[] = [];
    fixture.ctx.ui.input = async (title: string, placeholder?: string) => {
      displayed.push(title, placeholder ?? "");
      return undefined;
    };

    await fixture.command("setup");

    assert.doesNotMatch(displayed.join("\n"), new RegExp(password));
    assert.match(displayed.join("\n"), /http:\/\/localhost:8020\/api\/v1/);
  } finally {
    await fixture.cleanup();
  }
});

test("setup sends a bearer token from the selected environment variable", async () => {
  const endpoint = "http://localhost:8020/api/v1";
  const tokenEnv = "FORGETFUL_SETUP_TEST_TOKEN";
  const token = "setup-bearer-secret";
  process.env[tokenEnv] = token;
  const fixture = await harness({
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async (input, init) => {
          assert.equal(String(input), `${endpoint}/projects`);
          assert.equal(
            new Headers(init?.headers).get("authorization"),
            `Bearer ${token}`,
          );
          return new Response(JSON.stringify({ projects: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        },
      }),
  });
  try {
    fixture.ctx.ui.input = async (title: string) =>
      title.includes("environment") ? tokenEnv : "";
    fixture.ctx.ui.select = async () =>
      "Bearer token from environment variable";

    await fixture.command("setup");

    const user = JSON.parse(
      await readFile(
        join(fixture.agentDir, "forgetful", "settings.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    assert.equal(user.token_env, tokenEnv);
    assert.equal(user.token, undefined);
    assert.equal(
      fixture.notifications.some((message) => message.includes(token)),
      false,
    );
  } finally {
    delete process.env[tokenEnv];
    await fixture.cleanup();
  }
});

test("setup rejects an unsafe token environment name without echoing it", async () => {
  const fixture = await harness();
  try {
    const settingsPath = join(fixture.agentDir, "forgetful", "settings.json");
    const before = await readFile(settingsPath, "utf8");
    const pastedToken = "raw token with spaces";
    fixture.ctx.ui.input = async (title: string) =>
      title.includes("environment") ? pastedToken : "";
    fixture.ctx.ui.select = async () =>
      "Bearer token from environment variable";

    await fixture.command("setup");

    assert.equal(await readFile(settingsPath, "utf8"), before);
    assert.equal(
      fixture.notifications.some((message) => message.includes(pastedToken)),
      false,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("setup cancellation at each prompt leaves settings unchanged", async () => {
  const cases = [
    { inputs: [undefined], selections: [] },
    { inputs: ["https://memory.example/api/v1"], selections: [undefined] },
    {
      inputs: ["https://memory.example/api/v1", undefined],
      selections: ["Bearer token from environment variable"],
    },
  ];
  for (const value of cases) {
    const fixture = await harness({
      uiInputs: value.inputs,
      uiSelections: value.selections,
      createClient: () => {
        throw new Error("cancelled setup must not validate");
      },
    });
    try {
      const settingsPath = join(fixture.agentDir, "forgetful", "settings.json");
      const before = await readFile(settingsPath, "utf8");

      await fixture.command("setup");

      assert.equal(await readFile(settingsPath, "utf8"), before);
    } finally {
      await fixture.cleanup();
    }
  }
});

test("setup failure keeps settings and shows endpoint installation guidance", async () => {
  const fixture = await harness({
    uiInputs: ["http://remote.example/api/v1"],
    uiSelections: ["Unauthenticated"],
  });
  try {
    const settingsPath = join(fixture.agentDir, "forgetful", "settings.json");
    const before = await readFile(settingsPath, "utf8");

    await fixture.command("setup");

    assert.equal(await readFile(settingsPath, "utf8"), before);
    const messages = fixture.notifications.join("\n");
    assert.match(
      messages,
      /github\.com\/ScottRBK\/forgetful\/tree\/main\/skills\/forgetful-mcp-setup/,
    );
    assert.match(
      messages,
      /github\.com\/ScottRBK\/forgetful#option-3-docker-deployment-productionscale/,
    );
    assert.match(messages, /TLS is required/);
  } finally {
    await fixture.cleanup();
  }
});

test("setup does not replace malformed user settings", async () => {
  const fixture = await harness({
    uiInputs: [""],
    uiSelections: ["Unauthenticated"],
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async () =>
          new Response(JSON.stringify({ projects: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      }),
  });
  try {
    const settingsPath = join(fixture.agentDir, "forgetful", "settings.json");
    const malformed = "{ keep this for manual recovery";
    await writeFile(settingsPath, malformed);

    await assert.doesNotReject(fixture.command("setup"));

    assert.equal(await readFile(settingsPath, "utf8"), malformed);
    assert.ok(
      fixture.notifications.some((message) =>
        message.includes("settings were not changed"),
      ),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("setup invalidates an in-flight runtime built from old settings", async () => {
  let releaseWorkContext!: () => void;
  const workContextGate = new Promise<void>((resolve) => {
    releaseWorkContext = resolve;
  });
  let reportWorkContextStarted!: () => void;
  const workContextStarted = new Promise<void>((resolve) => {
    reportWorkContextStarted = resolve;
  });
  const fixture = await harness({
    workContextGate,
    onWorkContext: reportWorkContextStarted,
    uiInputs: [""],
    uiSelections: ["Unauthenticated"],
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async () =>
          new Response(JSON.stringify({ projects: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      }),
  });
  try {
    const oldLoad = fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await workContextStarted;

    await fixture.command("setup");
    releaseWorkContext();

    await assert.rejects(oldLoad, /runtime superseded/);
  } finally {
    releaseWorkContext();
    await fixture.cleanup();
  }
});

test("setup requires interactive UI and does not change settings", async () => {
  const fixture = await harness();
  try {
    const settingsPath = join(fixture.agentDir, "forgetful", "settings.json");
    const before = await readFile(settingsPath, "utf8");
    fixture.ctx.hasUI = false;

    await fixture.command("setup");

    assert.equal(await readFile(settingsPath, "utf8"), before);
    assert.ok(
      fixture.notifications.some((message) => message.includes("interactive")),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("missing model warning directs the user to setup", async () => {
  const fixture = await harness({ userSettings: { model: undefined } });
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });

    assert.ok(
      fixture.notifications.includes(
        "Forgetful memory model is not configured; recall and capture are paused. " +
          "Run /forgetful setup in Pi to configure Forgetful.",
      ),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("debug reports automated recall activity and status keeps the latest result", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.command("debug on");
    fixture.notifications.splice(0);

    const result = await fixture.emit("before_agent_start", {
      type: "before_agent_start",
      prompt: "Which database did we choose?",
      systemPrompt: "base system prompt",
    });

    assert.match(
      String((result as { systemPrompt?: unknown } | undefined)?.systemPrompt),
      /historical context/,
    );
    assert.ok(
      fixture.notifications.some((message) =>
        message.includes("Forgetful recall completed: 1 memory in global scope."),
      ),
    );

    await fixture.command("status");

    assert.ok(
      fixture.notifications.some((message) =>
        message.includes("last recall 1 memory in global scope"),
      ),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("model command uses Pi's searchable picker for a large model catalogue", async () => {
  const fixture = await harness();
  try {
    const selected = {
      provider: "openrouter",
      id: "anthropic/claude-sonnet-4",
    };
    fixture.ctx.modelRegistry.getAvailable = () =>
      [
        selected,
        ...Array.from({ length: 149 }, (_, index) => ({
          provider: "openrouter",
          id: `provider/model-${index}`,
        })),
      ];
    fixture.ctx.ui.select = async () => {
      throw new Error("flat model selector must not be used");
    };
    fixture.ctx.ui.custom = async () => selected;

    await fixture.command("model");

    const settings = JSON.parse(
      await readFile(
        join(fixture.agentDir, "forgetful", "settings.json"),
        "utf8",
      ),
    );
    assert.equal(settings.model, "openrouter/anthropic/claude-sonnet-4");
    assert.ok(
      fixture.notifications.includes(
        "Forgetful memory model set to openrouter/anthropic/claude-sonnet-4.",
      ),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("controls persist capture, enablement, debug, and project scope safely", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.command("capture observe");
    await fixture.command("off");
    await fixture.command("debug on");
    await fixture.command("scope project");

    const user = JSON.parse(
      await readFile(
        join(fixture.agentDir, "forgetful", "settings.json"),
        "utf8",
      ),
    );
    const project = JSON.parse(
      await readFile(
        join(fixture.root, ".pi", "forgetful", "settings.json"),
        "utf8",
      ),
    );
    assert.equal(user.capture_mode, "observe");
    assert.equal(user.enabled, false);
    assert.equal(user.debug, true);
    assert.deepEqual(project, { scope: "project" });
  } finally {
    await fixture.cleanup();
  }
});

test("skip and off advance the range while observe enqueues evidence", async () => {
  const skipped = await harness();
  try {
    await skipped.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await skipped.command("capture skip");
    skipped.entries.push(
      entry("skip-user", "root", "user", "do not retain this"),
    );
    skipped.entries.push(
      entry("skip-assistant", "skip-user", "assistant", "done", "stop"),
    );
    await skipped.emit("agent_settled", { type: "agent_settled" });
    assert.equal(skipped.capture.enqueued.length, 0);
    assert.deepEqual(skipped.capture.advanced[0]?.entryIds, [
      "skip-user",
      "skip-assistant",
    ]);
  } finally {
    await skipped.cleanup();
  }

  const observed = await harness();
  try {
    await observed.command("capture observe");
    await observed.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    observed.entries.push(entry("observe-user", "root", "user", "retain this"));
    observed.entries.push(
      entry("observe-assistant", "observe-user", "assistant", "done", "stop"),
    );
    await observed.emit("agent_settled", { type: "agent_settled" });
    assert.equal(observed.capture.enqueued.length, 1);
    assert.doesNotMatch(
      observed.capture.enqueued[0]?.policy ?? "",
      /Return exactly one JSON object/,
    );
  } finally {
    await observed.cleanup();
  }

  const off = await harness();
  try {
    await off.command("off");
    await off.emit("session_start", { type: "session_start", reason: "new" });
    off.entries.push(entry("off-user", "root", "user", "do not capture"));
    off.entries.push(
      entry("off-assistant", "off-user", "assistant", "done", "stop"),
    );
    await off.emit("agent_settled", { type: "agent_settled" });
    assert.equal(off.capture.enqueued.length, 0);
    assert.deepEqual(off.capture.advanced[0]?.entryIds, [
      "off-user",
      "off-assistant",
    ]);
  } finally {
    await off.cleanup();
  }
});

test("canonical repository names match Forgetful owner/repository mappings", () => {
  assert.equal(
    canonicalRepository("https://github.com/test/extension.git"),
    "test/extension",
  );
  assert.equal(
    canonicalRepository("git@github.com:test/extension.git"),
    "test/extension",
  );
  assert.equal(
    canonicalRepository("https://git.example.test/team/extension.git"),
    "git.example.test/team/extension",
  );
  assert.equal(
    canonicalRepository(
      "https://user:password@example.test/team/extension.git",
    ),
    undefined,
  );
});

test("queued recalls wait for their matching user message and preserve two prompts", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.emit("input", {
      type: "input",
      text: "first queued",
      source: "interactive",
      streamingBehavior: "followUp",
    });
    await fixture.emit("input", {
      type: "input",
      text: "second queued",
      source: "interactive",
      streamingBehavior: "followUp",
    });
    assert.equal(
      await fixture.emit("context", { type: "context", messages: [] }),
      undefined,
    );

    const second = (await fixture.emit("context", {
      type: "context",
      messages: [
        { role: "user", content: "second queued", timestamp: Date.now() },
      ],
    })) as { messages: Array<{ content?: unknown }> };
    const first = (await fixture.emit("context", {
      type: "context",
      messages: [
        { role: "user", content: "first queued", timestamp: Date.now() },
      ],
    })) as { messages: Array<{ content?: unknown }> };
    assert.match(String(second.messages[0]?.content), /second queued/);
    assert.match(String(first.messages[0]?.content), /first queued/);
    assert.equal(
      await fixture.emit("context", {
        type: "context",
        messages: [
          { role: "user", content: "first queued", timestamp: Date.now() },
        ],
      }),
      undefined,
    );
    assert.deepEqual(fixture.recallCalls.slice(-2), [
      "first queued",
      "second queued",
    ]);
  } finally {
    await fixture.cleanup();
  }
});

test("queued recall survives tool continuations and clears for the next user request", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.emit("input", {
      type: "input",
      text: "queued with tools",
      source: "interactive",
      streamingBehavior: "followUp",
    });
    const initial = (await fixture.emit("context", {
      type: "context",
      messages: [
        { role: "user", content: "queued with tools", timestamp: Date.now() },
      ],
    })) as { messages: Array<{ content?: unknown }> };
    const continuation = (await fixture.emit("context", {
      type: "context",
      messages: [
        { role: "user", content: "queued with tools", timestamp: Date.now() },
        { role: "toolResult", content: "tool output", timestamp: Date.now() },
      ],
    })) as { messages: Array<{ content?: unknown }> };
    assert.match(String(initial.messages[0]?.content), /historical context/);
    assert.match(
      String(continuation.messages[0]?.content),
      /historical context/,
    );
    assert.equal(
      await fixture.emit("context", {
        type: "context",
        messages: [
          {
            role: "user",
            content: "a different request",
            timestamp: Date.now(),
          },
        ],
      }),
      undefined,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("turning memory off drops queued transient recall", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.emit("input", {
      type: "input",
      text: "queued before off",
      source: "interactive",
      streamingBehavior: "followUp",
    });
    await fixture.command("off");
    await fixture.emit("before_agent_start", {
      type: "before_agent_start",
      prompt: "normal prompt",
      systemPrompt: "system",
    });
    assert.equal(
      await fixture.emit("context", {
        type: "context",
        messages: [
          { role: "user", content: "queued before off", timestamp: Date.now() },
        ],
      }),
      undefined,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("tree navigation stops the old worker and drops old-branch queued recall", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.emit("input", {
      type: "input",
      text: "old branch",
      source: "interactive",
      streamingBehavior: "steer",
    });
    fixture.setLeaf("branch-b");
    await fixture.emit("session_tree", {
      type: "session_tree",
      oldLeafId: "root",
      newLeafId: "branch-b",
    });
    assert.equal(fixture.capture.stopped.length, 1);
    assert.equal(
      await fixture.emit("context", {
        type: "context",
        messages: [
          { role: "user", content: "old branch", timestamp: Date.now() },
        ],
      }),
      undefined,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("startup recovery and escalation handoff stay on the originating branch", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    assert.equal(fixture.capture.checkpoints.length, 1);
    fixture.capture.conflicts = [
      {
        id: "conflict-1",
        reason: "same fact needs review",
        sessionId: "session-1",
        branchId: "session-1:root",
        oldMemoryId: 42,
        oldMemory: { content: "old project decision" },
        candidate: { title: "new decision", content: "new project decision" },
        destinationProjectId: 7,
        sourceEntryIds: ["user-1"],
        evidence: ["user-1: Please settle this"],
      },
    ];
    fixture.entries.push(entry("user-1", "root", "user", "Please settle this"));
    fixture.entries.push(
      entry("assistant-1", "user-1", "assistant", "I need a decision", "stop"),
    );
    await fixture.emit("agent_settled", { type: "agent_settled" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(fixture.sentMessages.length, 1);
    assert.deepEqual(fixture.sentMessages[0]?.options, {
      deliverAs: "nextTurn",
    });
    assert.match(
      String((fixture.sentMessages[0]?.message as { content: string }).content),
      /conflict-1/,
    );

    const tool = fixture.tools.get("forgetful_resolve");
    const result = await tool.execute(
      "call-1",
      {
        conflict_id: "conflict-1",
        action: "skip",
        reason: "keep existing fact",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    assert.match(String(result.content[0].text), /resolved/);
    assert.equal(fixture.capture.resolutions[0]?.id, "conflict-1");
    assert.deepEqual(fixture.capture.resolutions[0]?.value, {
      action: "skip",
      reason: "keep existing fact",
      additionalEntries: [
        { id: "user-1", role: "user", text: "Please settle this" },
      ],
    });
  } finally {
    await fixture.cleanup();
  }
});

test("a sibling branch cannot inherit a conflict from the shared baseline", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    fixture.entries.push(
      entry("sibling-user", "root", "user", "A different branch decision"),
    );
    fixture.entries.push(
      entry("sibling-assistant", "sibling-user", "assistant", "Done", "stop"),
    );
    fixture.setLeaf("sibling-assistant");
    fixture.capture.conflicts = [
      {
        id: "old-branch-conflict",
        sessionId: "session-1",
        branchId: "session-1:root",
        sourceEntryIds: ["old-branch-user"],
        reason: "old branch evidence",
      },
    ];
    await fixture.emit("agent_settled", { type: "agent_settled" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(fixture.sentMessages.length, 0);

    const tool = fixture.tools.get("forgetful_resolve");
    const result = await tool.execute(
      "resolve-old",
      {
        conflict_id: "old-branch-conflict",
        action: "skip",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    assert.match(String(result.content[0].text), /No pending/);
    assert.equal(fixture.capture.resolutions.length, 0);
  } finally {
    await fixture.cleanup();
  }
});

test("a resolver race cannot delegate after session tree navigation", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    let release!: (value: unknown[]) => void;
    let started = false;
    const pending = new Promise<unknown[]>((resolve) => {
      release = resolve;
    });
    fixture.capture.pendingConflicts = async () => {
      started = true;
      return pending;
    };
    const tool = fixture.tools.get("forgetful_resolve");
    const resolving = tool.execute(
      "resolve-race",
      {
        conflict_id: "race-conflict",
        action: "skip",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    for (let attempt = 0; !started && attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    fixture.setLeaf("branch-b");
    await fixture.emit("session_tree", {
      type: "session_tree",
      oldLeafId: "root",
      newLeafId: "branch-b",
    });
    release([
      {
        id: "race-conflict",
        sessionId: "session-1",
        branchId: "session-1:root",
        sourceEntryIds: ["root"],
        reason: "race",
      },
    ]);
    const result = await resolving;
    assert.match(String(result.content[0].text), /No pending/);
    assert.equal(fixture.capture.resolutions.length, 0);
  } finally {
    await fixture.cleanup();
  }
});

test("an in-flight runtime cannot install after session tree navigation", async () => {
  let release!: () => void;
  let entered = false;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const fixture = await harness({
    workContextGate: gate,
    onWorkContext: () => {
      entered = true;
    },
  });
  try {
    const loading = fixture.emit("before_agent_start", {
      type: "before_agent_start",
      prompt: "wait for runtime",
      systemPrompt: "system",
    });
    for (let attempt = 0; !entered && attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    fixture.setLeaf("branch-b");
    await fixture.emit("session_tree", {
      type: "session_tree",
      oldLeafId: "root",
      newLeafId: "branch-b",
    });
    release();
    await loading;
    fixture.entries.push(entry("late-user", "root", "user", "late work"));
    fixture.entries.push(
      entry("late-assistant", "late-user", "assistant", "done", "stop"),
    );
    await fixture.emit("agent_settled", { type: "agent_settled" });
    assert.equal(fixture.capture.enqueued.length, 0);
  } finally {
    await fixture.cleanup();
  }
});

test("conflict resolution passes at most eight recent trusted evidence entries", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    for (let index = 0; index < 10; index += 1) {
      fixture.entries.push(
        entry(`evidence-${index}`, "root", "user", `clarification ${index}`),
      );
    }
    fixture.capture.conflicts = [
      {
        id: "conflict-evidence",
        sessionId: "session-1",
        branchId: "session-1:root",
        sourceEntryIds: ["evidence-0"],
      },
    ];
    const tool = fixture.tools.get("forgetful_resolve");
    await tool.execute(
      "call-evidence",
      {
        conflict_id: "conflict-evidence",
        action: "supersede",
        reason: "confirmed",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    const additionalEntries =
      (
        fixture.capture.resolutions[0]?.value as {
          additionalEntries?: Array<{ id: string }>;
        }
      ).additionalEntries ?? [];
    assert.ok(additionalEntries.length <= 8);
    assert.ok(additionalEntries.some((item) => item.id === "evidence-0"));
    assert.ok(additionalEntries.some((item) => item.id === "evidence-9"));
  } finally {
    await fixture.cleanup();
  }
});

test("conflict resolution reports deferred and rejected statuses", async () => {
  const fixture = await harness({
    conflicts: [
      {
        id: "conflict-status",
        sessionId: "session-1",
        branchId: "session-1:root",
        sourceEntryIds: [],
      },
    ],
  });
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    fixture.capture.resolveConflict = async (id, value) => {
      fixture.capture.resolutions.push({ id, value });
      return { status: value.action === "defer" ? "deferred" : "rejected" };
    };
    const tool = fixture.tools.get("forgetful_resolve");
    const deferred = await tool.execute(
      "call-defer",
      {
        conflict_id: "conflict-status",
        action: "defer",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    assert.match(String(deferred.content[0].text), /deferred/);
    const rejected = await tool.execute(
      "call-skip",
      {
        conflict_id: "conflict-status",
        action: "skip",
      },
      undefined,
      undefined,
      fixture.ctx,
    );
    assert.match(String(rejected.content[0].text), /rejected/);
  } finally {
    await fixture.cleanup();
  }
});

test("an invalid endpoint fails open while status remains usable", async () => {
  const fixture = await harness({ userSettings: { base_url: "not a URL" } });
  try {
    await assert.doesNotReject(
      fixture.emit("session_start", { type: "session_start", reason: "new" }),
    );
    await assert.doesNotReject(fixture.command("status"));
  } finally {
    await fixture.cleanup();
  }
});

test("debug status reports bounded capture diagnostics", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    await fixture.command("debug on");
    await fixture.command("status");
    assert.ok(fixture.notifications.some((message) => /jobs 1/.test(message)));
    assert.ok(
      fixture.notifications.some((message) => /conflicts 1/.test(message)),
    );
    assert.ok(
      fixture.notifications.some((message) => /candidate-1/.test(message)),
    );
    assert.ok(fixture.notifications.some((message) => /overlap/.test(message)));
  } finally {
    await fixture.cleanup();
  }
});

test("a delayed conflict handoff is discarded after branch navigation", async () => {
  const fixture = await harness();
  try {
    await fixture.emit("session_start", {
      type: "session_start",
      reason: "new",
    });
    let release!: (value: unknown[]) => void;
    let started = false;
    const pending = new Promise<unknown[]>((resolve) => {
      release = resolve;
    });
    fixture.capture.pendingConflicts = async () => {
      started = true;
      return pending;
    };
    fixture.entries.push(
      entry("user-race", "root", "user", "Please settle this"),
    );
    fixture.entries.push(
      entry(
        "assistant-race",
        "user-race",
        "assistant",
        "I need a decision",
        "stop",
      ),
    );
    await fixture.emit("agent_settled", { type: "agent_settled" });
    for (let attempt = 0; !started && attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    fixture.setLeaf("branch-b");
    await fixture.emit("session_tree", {
      type: "session_tree",
      oldLeafId: "root",
      newLeafId: "branch-b",
    });
    release([
      {
        id: "conflict-race",
        sessionId: "session-1",
        branchId: "session-1:root",
        sourceEntryIds: ["user-race"],
        reason: "same fact",
        destinationProjectId: 7,
        oldMemory: { content: "old" },
        candidate: { content: "new" },
        evidence: [],
      },
    ]);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(fixture.sentMessages.length, 0);
  } finally {
    await fixture.cleanup();
  }
});

test("project init creates once and activates capture in the session", async () => {
  // Arrange: an unmapped repository and a real HTTP adapter with a fake external service.
  const projects: Project[] = [];
  const writes: unknown[] = [];
  const fixture = await harness({
    withoutProject: true,
    gitRemote: "git@github.com:test/repo.git",
    uiInputs: ["Repo memory", "Decisions for the repository"],
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async (url, init) => {
          assert.equal(new URL(String(url)).pathname, "/api/v1/projects");
          if (init?.method === "POST") {
            const body = JSON.parse(String(init.body));
            writes.push(body);
            projects.push({ id: 23, ...body });
            return Response.json(projects[0], { status: 201 });
          }
          return Response.json({ projects });
        },
      }),
  });
  try {
    await fixture.emit("session_start", { type: "session_start" });
    fixture.entries.push(entry("question", "root", "user", "We chose SQLite."));
    fixture.entries.push(
      entry("answer", "question", "assistant", "Confirmed.", "stop"),
    );
    fixture.setLeaf("answer");

    // Act: initialise twice and capture work already present in the session.
    await fixture.command("project init");
    await fixture.command("project init");
    await fixture.command("status");
    await fixture.emit("agent_settled", { type: "agent_settled" });

    // Assert: one server project, unchanged scope, and the new default capture destination.
    assert.deepEqual(writes, [
      {
        name: "Repo memory",
        description: "Decisions for the repository",
        project_type: "development",
        repo_name: "test/repo",
      },
    ]);
    assert.match(
      fixture.notifications.join("\n"),
      /project Repo memory \(#23\)/,
    );
    assert.match(fixture.notifications.join("\n"), /scope global/);
    assert.equal(fixture.capture.enqueued.at(-1)?.context.project?.id, 23);
    assert.ok(
      fixture.capture.enqueued.at(-1)?.entries.some((e) => e.id === "question"),
    );
    await assert.rejects(
      readFile(join(fixture.root, ".pi/forgetful/settings.json")),
    );
  } finally {
    await fixture.cleanup();
  }
});

test("project init links an unassigned project and preserves other repositories", async () => {
  // Arrange: two identically named projects, only one available to link.
  const projects: Project[] = [
    { id: 9, name: "Existing", repo_name: "test/other" },
    {
      id: 10,
      name: "Existing",
      repo_name: null,
      description: "Keep this description",
    },
  ];
  const writes: unknown[] = [];
  const fixture = await harness({
    withoutProject: true,
    gitRemote: "https://github.com/test/repo.git",
    uiSelections: ["Link an existing project", "Existing (#10)"],
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async (url, init) => {
          if (init?.method === "PUT") {
            assert.equal(new URL(String(url)).pathname, "/api/v1/projects/10");
            const body = JSON.parse(String(init.body));
            writes.push(body);
            Object.assign(projects[1], body);
            return Response.json(projects[1]);
          }
          assert.equal(init?.method, "GET");
          return Response.json({ projects });
        },
      }),
  });
  const selections: string[][] = [];
  const select = fixture.ctx.ui.select;
  fixture.ctx.ui.select = async (title: string, values: string[]) => {
    selections.push(values);
    return select(title, values);
  };
  try {
    // Act.
    await fixture.command("project init");
    await fixture.command("status");

    // Assert through the command and API boundaries.
    assert.deepEqual(writes, [{ repo_name: "test/repo" }]);
    assert.deepEqual(selections[1], ["Existing (#10)"]);
    assert.equal(projects[0]?.repo_name, "test/other");
    assert.equal(projects[1]?.description, "Keep this description");
    assert.match(fixture.notifications.join("\n"), /project Existing \(#10\)/);
  } finally {
    await fixture.cleanup();
  }
});

async function projectFixture(
  projects: Project[] = [],
  inputs?: Array<string | undefined>,
) {
  const writes: unknown[] = [];
  const fixture = await harness({
    withoutProject: true,
    gitRemote: "git@github.com:test/repo.git",
    uiInputs: inputs ?? ["Project", "Description"],
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async (_url, init) => {
          if (init?.method !== "GET") {
            const body = JSON.parse(String(init?.body));
            writes.push(body);
            const project = { id: 25, name: "Project", ...body };
            projects.push(project);
            return Response.json(project, {
              status: init?.method === "POST" ? 201 : 200,
            });
          }
          return Response.json({ projects });
        },
      }),
  });
  return { ...fixture, writes };
}

test("project init cancellation leaves the server and settings unchanged", async () => {
  for (const stage of [
    "action",
    "name",
    "description",
    "create",
    "project",
    "link",
  ]) {
    // Arrange.
    const fixture = await projectFixture([{ id: 10, name: "Existing" }]);
    const settingsPath = join(fixture.agentDir, "forgetful/settings.json");
    const before = await readFile(settingsPath, "utf8");
    let inputs = 0;
    fixture.ctx.ui.input = async () => {
      inputs++;
      return (stage === "name" && inputs === 1) ||
        (stage === "description" && inputs === 2)
        ? undefined
        : "Project";
    };
    fixture.ctx.ui.select = async (_title: string, values: string[]) => {
      if (stage === "action") return undefined;
      if (values.includes("Link an existing project")) {
        return ["project", "link"].includes(stage)
          ? "Link an existing project"
          : values[0];
      }
      return stage === "project" ? undefined : values[0];
    };
    fixture.ctx.ui.confirm = async () => false;
    try {
      // Act.
      await fixture.command("project init");
      // Assert.
      assert.deepEqual(fixture.writes, [], stage);
      assert.equal(await readFile(settingsPath, "utf8"), before, stage);
      assert.doesNotMatch(
        fixture.notifications.join("\n"),
        /linked to test\/repo/,
      );
    } finally {
      await fixture.cleanup();
    }
  }
});

test("project init rejects blank or oversized project details before writing", async () => {
  for (const inputs of [
    [" ", "Description"],
    ["Project", " "],
    ["x".repeat(501), "Description"],
    ["Project", "x".repeat(5001)],
  ]) {
    // Arrange.
    const fixture = await projectFixture([], inputs);
    try {
      // Act.
      await fixture.command("project init");
      // Assert.
      assert.deepEqual(fixture.writes, []);
      assert.match(fixture.notifications.join("\n"), /name|description/i);
    } finally {
      await fixture.cleanup();
    }
  }
});

test("project init reports ambiguous mappings without creating another project", async () => {
  // Arrange.
  const fixture = await projectFixture([
    { id: 1, name: "First", repo_name: "test/repo" },
    { id: 2, name: "Second", repo_name: "test/repo" },
  ]);
  try {
    // Act.
    await fixture.command("project init");
    // Assert.
    assert.deepEqual(fixture.writes, []);
    assert.match(
      fixture.notifications.join("\n"),
      /Multiple Forgetful projects/,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("project init rechecks the mapping after the user confirms creation", async () => {
  // Arrange: another session initialises the repository while the dialog is open.
  const projects: Project[] = [];
  const fixture = await projectFixture(projects);
  fixture.ctx.ui.confirm = async () => {
    projects.push({ id: 40, name: "Already created", repo_name: "test/repo" });
    return true;
  };
  try {
    // Act.
    await fixture.command("project init");
    await fixture.command("status");
    // Assert.
    assert.deepEqual(fixture.writes, []);
    assert.match(
      fixture.notifications.join("\n"),
      /project Already created \(#40\)/,
    );
  } finally {
    await fixture.cleanup();
  }
});

test("project init rejects linking a project assigned while the dialog was open", async () => {
  // Arrange.
  const projects: Project[] = [{ id: 10, name: "Existing" }];
  const fixture = await projectFixture(projects);
  fixture.ctx.ui.select = async (_title: string, values: string[]) =>
    values.includes("Link an existing project")
      ? "Link an existing project"
      : values[0];
  fixture.ctx.ui.confirm = async () => {
    projects[0]!.repo_name = "test/other";
    return true;
  };
  try {
    // Act.
    await fixture.command("project init");
    // Assert.
    assert.deepEqual(fixture.writes, []);
    assert.match(fixture.notifications.join("\n"), /changed|assigned/i);
  } finally {
    await fixture.cleanup();
  }
});

test("project init stops before writing if the originating session changes", async () => {
  // Arrange.
  const fixture = await projectFixture();
  fixture.ctx.ui.confirm = async () => {
    await fixture.emit("session_tree", { type: "session_tree" });
    return true;
  };
  try {
    // Act.
    await fixture.command("project init");
    // Assert.
    assert.deepEqual(fixture.writes, []);
    assert.match(fixture.notifications.join("\n"), /session changed/i);
  } finally {
    await fixture.cleanup();
  }
});

test("project init works before model selection and preserves off and scope settings", async () => {
  // Arrange: connection setup is done, but memory is off and no model is selected.
  const fixture = await projectFixture([], ["", "Repository decisions"]);
  const settings = join(fixture.agentDir, "forgetful/settings.json");
  await writeFile(settings, JSON.stringify({ enabled: false }));
  await mkdir(join(fixture.root, ".pi/forgetful"), { recursive: true });
  await writeFile(
    join(fixture.root, ".pi/forgetful/settings.json"),
    '{"scope":"project"}',
  );
  try {
    // Act.
    await fixture.command("project init");
    await fixture.command("status");
    // Assert.
    assert.deepEqual(fixture.writes, [
      {
        name: "repo",
        description: "Repository decisions",
        repo_name: "test/repo",
        project_type: "development",
      },
    ]);
    assert.equal(await readFile(settings, "utf8"), '{"enabled":false}');
    assert.match(
      fixture.notifications.join("\n"),
      /Forgetful off; capture auto; scope project/,
    );
    assert.match(fixture.notifications.join("\n"), /project repo \(#25\)/);
  } finally {
    await fixture.cleanup();
  }
});

test("project init connection failure gives guidance and preserves settings", async () => {
  // Arrange: an unreachable external service.
  const fixture = await harness({
    withoutProject: true,
    gitRemote: "git@github.com:test/repo.git",
    createClient: (options) =>
      new ApiForgetfulClient({
        ...options,
        fetchImpl: async () => {
          throw new Error("private service detail");
        },
      }),
  });
  const settings = join(fixture.agentDir, "forgetful/settings.json");
  const before = await readFile(settings, "utf8");
  try {
    // Act.
    await assert.doesNotReject(fixture.command("project init"));
    // Assert.
    assert.match(
      fixture.notifications.join("\n"),
      /initialisation failed.*\/forgetful setup/,
    );
    assert.doesNotMatch(
      fixture.notifications.join("\n"),
      /private service detail/,
    );
    assert.equal(await readFile(settings, "utf8"), before);
  } finally {
    await fixture.cleanup();
  }
});

test("project init requires interactive project trust and a usable origin remote", async () => {
  for (const reason of ["trust", "ui", "remote"]) {
    // Arrange.
    const fixture =
      reason === "remote"
        ? await harness({ withoutProject: true })
        : await projectFixture();
    if (reason === "trust") fixture.ctx.isProjectTrusted = () => false;
    if (reason === "ui") fixture.ctx.hasUI = false;
    fixture.ctx.ui.select = async () => {
      assert.fail("No wizard should open");
    };
    try {
      // Act.
      await fixture.command("project init");
      // Assert.
      assert.match(
        fixture.notifications.join("\n"),
        reason === "remote"
          ? /origin remote/
          : /interactive Pi session and project trust/,
      );
    } finally {
      await fixture.cleanup();
    }
  }
});

test("project status discovers an existing repository link even when memory is off", async () => {
  // Arrange: a fresh session with a server mapping, memory disabled, and no model.
  const fixture = await projectFixture([
    { id: 40, name: "Existing", repo_name: "test/repo" },
  ]);
  await writeFile(
    join(fixture.agentDir, "forgetful/settings.json"),
    '{"enabled":false}',
  );
  try {
    // Act.
    await fixture.emit("session_start", { type: "session_start" });
    await fixture.command("status");
    // Assert.
    assert.match(fixture.notifications.join("\n"), /project Existing \(#40\)/);
    assert.deepEqual(fixture.writes, []);
  } finally {
    await fixture.cleanup();
  }
});

test("project init filters large project lists before opening the selector", async () => {
  // Arrange.
  const projects = Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `Project ${i}`,
  }));
  const fixture = await projectFixture(projects, ["Project 149"]);
  fixture.ctx.ui.select = async (_title: string, values: string[]) => {
    assert.ok(
      values.length <= 20,
      "Dialogs should not render a huge project catalogue",
    );
    return values.includes("Link an existing project")
      ? "Link an existing project"
      : values[0];
  };
  // Cancel at the last review: this test checks navigation without linking the fake project.
  const confirmations: string[] = [];
  fixture.ctx.ui.confirm = async (_title: string, message: string) => {
    confirmations.push(message);
    return false;
  };
  try {
    // Act.
    await fixture.command("project init");
    // Assert: filtering reached the final review instead of failing the oversized selector.
    assert.doesNotMatch(fixture.notifications.join("\n"), /failed/);
    assert.deepEqual(confirmations, ["Link Project 149 (#150) to test/repo?"]);
    assert.deepEqual(fixture.writes, []);
  } finally {
    await fixture.cleanup();
  }
});
