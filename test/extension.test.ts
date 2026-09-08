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
import type {
  CaptureSnapshot,
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
    project: {
      id: 7,
      name: "Test repo",
      repo_name: "test/repo",
    } satisfies Project,
  };
  const sessionManager = {
    getSessionId: () => "session-1",
    getLeafId: () => leaf,
    getBranch: () => entries,
  };
  const ctx: any = {
    cwd: root,
    sessionManager,
    signal: undefined,
    hasUI: true,
    isProjectTrusted: () => true,
    ui: {
      notify: (message: string) => {
        notifications.push(message);
      },
      confirm: async () => true,
      select: async (_title: string, values: string[]) => values[0],
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
    exec: async () => ({ code: 1, stdout: "", stderr: "" }),
  };
  createForgetfulExtension({
    agentDir,
    dependencies: {
      recall,
      capture,
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
