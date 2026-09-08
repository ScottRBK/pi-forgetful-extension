import test from "node:test";
import assert from "node:assert/strict";
import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import {
  buildCaptureSnapshot,
  type SnapshotSessionReader,
} from "../src/snapshot.ts";

function messageEntry(
  id: string,
  message: Record<string, unknown>,
  parentId: string | null,
): SessionEntry {
  return {
    type: "message",
    id,
    parentId,
    timestamp: new Date(0).toISOString(),
    message,
  } as unknown as SessionEntry;
}

function session(entries: SessionEntry[]): SnapshotSessionReader {
  return {
    getSessionId: () => "session-1",
    getLeafId: () => entries.at(-1)?.id ?? null,
    getBranch: () => entries,
  };
}

test("capture snapshot contains only the new safe conversation delta", () => {
  const entries = [
    messageEntry(
      "old-user",
      { role: "user", content: "Earlier work", timestamp: 1 },
      null,
    ),
    messageEntry(
      "old-assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "Earlier answer" }],
        stopReason: "stop",
        timestamp: 2,
      },
      "old-user",
    ),
    messageEntry(
      "new-user",
      {
        role: "user",
        content: "Use api_key=sk-abcdefghijklmnopqrstuvwxyz to finish the fix",
        timestamp: 3,
      },
      "old-assistant",
    ),
    messageEntry(
      "memory-tool",
      {
        role: "toolResult",
        toolName: "forgetful_recall",
        content: [{ type: "text", text: "historical memory" }],
        isError: false,
        timestamp: 4,
      },
      "new-user",
    ),
    messageEntry(
      "new-assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "The fix is now complete." }],
        stopReason: "stop",
        timestamp: 5,
      },
      "memory-tool",
    ),
  ];

  const result = buildCaptureSnapshot({
    session: session(entries),
    context: { cwd: "/repo", sessionId: "session-1", branchId: "branch-1" },
    instanceId: "forgetful-local",
    mode: "auto",
    scope: "global",
    policy: "capture-v1",
    modelVersion: "fake/memory",
    afterEntryId: "old-assistant",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.snapshot?.finalEntryId, "new-assistant");
  assert.deepEqual(
    result.snapshot?.entries.map((entry) => [entry.id, entry.role]),
    [
      ["new-user", "user"],
      ["new-assistant", "assistant"],
    ],
  );
  assert.match(result.snapshot?.entries[0]?.text ?? "", /\[redacted\]/);
  assert.doesNotMatch(
    result.snapshot?.entries[0]?.text ?? "",
    /sk-abcdefghijklmnopqrstuvwxyz/,
  );
});

test("failed assistant runs are skipped and do not become capture evidence", () => {
  const entries = [
    messageEntry(
      "user",
      { role: "user", content: "Please do the work", timestamp: 1 },
      null,
    ),
    messageEntry(
      "assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "I was interrupted" }],
        stopReason: "aborted",
        timestamp: 2,
      },
      "user",
    ),
  ];

  const result = buildCaptureSnapshot({
    session: session(entries),
    context: { cwd: "/repo", sessionId: "session-1", branchId: "branch-1" },
    instanceId: "forgetful-local",
    mode: "auto",
    scope: "global",
    policy: "capture-v1",
    modelVersion: "fake/memory",
  });

  assert.equal(result.status, "skipped");
  assert.match(result.reason ?? "", /aborted/);
});

test("the snapshot identity is stable when the same settled entry is observed again", () => {
  const entries = [
    messageEntry(
      "user",
      { role: "user", content: "Remember this", timestamp: 1 },
      null,
    ),
    messageEntry(
      "assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "Done" }],
        stopReason: "stop",
        timestamp: 2,
      },
      "user",
    ),
  ];
  const options = {
    session: session(entries),
    context: { cwd: "/repo", sessionId: "session-1", branchId: "branch-1" },
    instanceId: "forgetful-local",
    mode: "auto" as const,
    scope: "global" as const,
    policy: "capture-v1",
    modelVersion: "fake/memory",
  };

  const first = buildCaptureSnapshot(options);
  const second = buildCaptureSnapshot(options);

  assert.equal(first.status, "ready");
  assert.equal(second.status, "ready");
  assert.equal(first.snapshot?.id, second.snapshot?.id);
});

test("a stale capture marker fails closed instead of replaying the active branch", () => {
  const entries = [
    messageEntry(
      "user",
      { role: "user", content: "Remember this", timestamp: 1 },
      null,
    ),
    messageEntry(
      "assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "Done" }],
        stopReason: "stop",
        timestamp: 2,
      },
      "user",
    ),
  ];
  const result = buildCaptureSnapshot({
    session: session(entries),
    context: { cwd: "/repo", sessionId: "session-1", branchId: "branch-1" },
    instanceId: "forgetful-local",
    mode: "auto",
    scope: "global",
    policy: "capture-v1",
    modelVersion: "fake/memory",
    afterEntryId: "entry-from-another-branch",
  });
  assert.equal(result.status, "skipped");
  assert.match(result.reason, /active branch/);
});

test("failed edit evidence is excluded even when the tool name is allowlisted", () => {
  const entries = [
    messageEntry(
      "user",
      { role: "user", content: "Change the file", timestamp: 1 },
      null,
    ),
    messageEntry(
      "failed-edit",
      {
        role: "toolResult",
        toolName: "edit",
        isError: true,
        content: [{ type: "text", text: "The edit failed." }],
        timestamp: 2,
      },
      "user",
    ),
    messageEntry(
      "assistant",
      {
        role: "assistant",
        content: [{ type: "text", text: "The change is complete." }],
        stopReason: "stop",
        timestamp: 3,
      },
      "failed-edit",
    ),
  ];
  const result = buildCaptureSnapshot({
    session: session(entries),
    context: { cwd: "/repo", sessionId: "session-1", branchId: "branch-1" },
    instanceId: "forgetful-local",
    mode: "auto",
    scope: "global",
    policy: "capture-v1",
    modelVersion: "fake/memory",
    includeToolEvidence: () => true,
  });
  assert.equal(result.status, "ready");
  assert.equal(
    result.snapshot.entries.some((entry) => entry.id === "failed-edit"),
    false,
  );
});
