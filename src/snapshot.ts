import { createHash } from "node:crypto";
import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import type {
  CaptureMode,
  CaptureSnapshot,
  EvidenceEntry,
  Scope,
  WorkContext,
} from "./contracts.ts";
import { isMemoryOperation, sanitizeText } from "./privacy.ts";

export const MAX_SNAPSHOT_ENTRIES = 100;
export const MAX_SNAPSHOT_ENTRY_CHARS = 4_000;
export const MAX_SNAPSHOT_CHARS = 32_000;

export interface SnapshotSessionReader {
  getSessionId(): string;
  getLeafId(): string | null;
  getBranch(): SessionEntry[];
}

export interface SnapshotOptions {
  session: SnapshotSessionReader;
  context: WorkContext;
  instanceId: string;
  mode: CaptureMode;
  scope: Scope;
  policy: string;
  modelVersion: string;
  afterEntryId?: string | null;
  baselineEntryId?: string | null;
  branchId?: string;
  createdAt?: string;
  includeToolEvidence?: (toolName: string, text: string) => boolean;
}

export interface CaptureSnapshotWithStatus extends CaptureSnapshot {
  finalStopReason: string;
}

export type SnapshotResult =
  | { status: "ready"; snapshot: CaptureSnapshotWithStatus }
  | { status: "skipped"; reason: string; finalEntryId?: string };

interface MessageRecord {
  role?: unknown;
  content?: unknown;
  toolName?: unknown;
  isError?: unknown;
  stopReason?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asMessage(entry: SessionEntry): MessageRecord | undefined {
  if (entry.type !== "message" || !isRecord(entry.message)) return undefined;
  return entry.message as unknown as MessageRecord;
}

function contentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter(
      (part): part is { type: "text"; text: string } =>
        isRecord(part) && part.type === "text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join("\n");
}

function boundedText(text: string): string {
  const safe = sanitizeText(text).trim();
  return safe.length > MAX_SNAPSHOT_ENTRY_CHARS
    ? `${safe.slice(0, MAX_SNAPSHOT_ENTRY_CHARS)}\n[truncated]`
    : safe;
}

function rootId(branch: SessionEntry[], fallback: string): string {
  return branch.find((entry) => entry.parentId === null)?.id ?? fallback;
}

function snapshotId(
  sessionId: string,
  branchId: string,
  finalEntryId: string,
): string {
  const digest = createHash("sha256")
    .update(`${sessionId}\0${branchId}\0${finalEntryId}`)
    .digest("hex")
    .slice(0, 32);
  return `snapshot-${digest}`;
}

function deltaStartIndex(
  branch: SessionEntry[],
  afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined,
): number | undefined {
  if (afterEntryId !== undefined && afterEntryId !== null) {
    const index = branch.findIndex((entry) => entry.id === afterEntryId);
    return index >= 0 ? index + 1 : undefined;
  }
  if (baselineEntryId !== undefined && baselineEntryId !== null) {
    const index = branch.findIndex((entry) => entry.id === baselineEntryId);
    return index >= 0 ? index + 1 : undefined;
  }
  return 0;
}

function evidenceForEntry(
  entry: SessionEntry,
  includeToolEvidence:
    | ((toolName: string, text: string) => boolean)
    | undefined,
): EvidenceEntry | undefined {
  const message = asMessage(entry);
  if (!message) return undefined;
  if (message.role === "user") {
    const text = boundedText(contentText(message.content));
    return text ? { id: entry.id, role: "user", text } : undefined;
  }
  if (message.role === "assistant") {
    const text = boundedText(contentText(message.content));
    return text ? { id: entry.id, role: "assistant", text } : undefined;
  }
  if (message.role === "toolResult" && typeof message.toolName === "string") {
    if (isMemoryOperation(message.toolName)) return undefined;
    if (message.isError === true) return undefined;
    const text = boundedText(contentText(message.content));
    if (!text || !includeToolEvidence?.(message.toolName, text))
      return undefined;
    return {
      id: entry.id,
      role: "toolResult",
      text,
      toolName: message.toolName,
    };
  }
  return undefined;
}

function lastAssistantEntry(
  entries: SessionEntry[],
): { entry: SessionEntry; message: MessageRecord } | undefined {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const message = asMessage(entries[index]);
    if (message?.role === "assistant")
      return { entry: entries[index], message };
  }
  return undefined;
}

function collectEvidence(
  entries: SessionEntry[],
  includeToolEvidence: SnapshotOptions["includeToolEvidence"],
): EvidenceEntry[] {
  const evidenceEntries: EvidenceEntry[] = [];
  let totalChars = 0;
  for (const entry of entries) {
    if (
      evidenceEntries.length >= MAX_SNAPSHOT_ENTRIES ||
      totalChars >= MAX_SNAPSHOT_CHARS
    )
      break;
    const evidence = evidenceForEntry(entry, includeToolEvidence);
    if (!evidence) continue;
    const remaining = MAX_SNAPSHOT_CHARS - totalChars;
    if (evidence.text.length > remaining)
      evidence.text = evidence.text.slice(0, remaining);
    if (!evidence.text) continue;
    evidenceEntries.push(evidence);
    totalChars += evidence.text.length;
  }
  return evidenceEntries;
}

export function buildCaptureSnapshot(options: SnapshotOptions): SnapshotResult {
  if (options.mode === "off")
    return { status: "skipped", reason: "capture is off" };

  const branch = options.session.getBranch();
  const start = deltaStartIndex(
    branch,
    options.afterEntryId,
    options.baselineEntryId,
  );
  if (start === undefined) {
    return {
      status: "skipped",
      reason: "capture watermark is not on the active branch",
    };
  }
  const delta = branch.slice(start);
  if (delta.length === 0)
    return { status: "skipped", reason: "no new session entries" };

  const finalAssistant = lastAssistantEntry(delta);
  if (!finalAssistant)
    return {
      status: "skipped",
      reason: "settled run has no assistant message",
    };

  const finalStopReason =
    typeof finalAssistant.message.stopReason === "string"
      ? finalAssistant.message.stopReason
      : "unknown";
  if (finalStopReason !== "stop") {
    return {
      status: "skipped",
      reason: `final assistant run was ${finalStopReason}`,
      finalEntryId: finalAssistant.entry.id,
    };
  }

  const entries = collectEvidence(delta, options.includeToolEvidence);
  if (entries.length === 0) {
    return {
      status: "skipped",
      reason: "settled run has no eligible evidence",
      finalEntryId: finalAssistant.entry.id,
    };
  }

  const sessionId = options.session.getSessionId();
  const branchId =
    options.branchId ?? options.context.branchId ?? rootId(branch, sessionId);
  const context: WorkContext = { ...options.context, sessionId, branchId };
  const snapshot: CaptureSnapshotWithStatus = {
    id: snapshotId(sessionId, branchId, finalAssistant.entry.id),
    context,
    instanceId: options.instanceId,
    entries,
    finalEntryId: finalAssistant.entry.id,
    mode: options.mode,
    scope: options.scope,
    policy: options.policy,
    modelVersion: options.modelVersion,
    createdAt: options.createdAt ?? new Date().toISOString(),
    finalStopReason,
  };
  return { status: "ready", snapshot };
}
