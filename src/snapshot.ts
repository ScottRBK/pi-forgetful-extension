import { createHash } from "node:crypto";
import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import type {
  CaptureMode,
  CaptureSnapshot,
  EvidenceEntry,
  Scope,
  WorkContext,
} from "./contracts.ts";
import { isMemoryOperation, sanitizeText, sanitizeValue } from "./privacy.ts";

export interface SnapshotSessionReader {
  getSessionId(): string;
  getLeafId(): string | null;
  getBranch(fromId?: string): SessionEntry[];
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
  /** Freeze the active leaf at settlement before asynchronous lifecycle work. */
  leafEntryId?: string;
  /** Explicit opt-outs affect evidence eligibility, never conversation visibility. */
  excludedEvidenceEntryIds?: readonly string[];
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
  toolCallId?: unknown;
  details?: unknown;
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

function safeText(text: string): string {
  return sanitizeText(text).trim();
}

/** Scrub payloads without treating Pi structural fields such as tokensBefore as credentials. */
function sanitizeConversation(value: unknown): unknown {
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map(sanitizeConversation);
  if (!isRecord(value)) return value;
  if (value.type === "image") {
    return { ...value, mimeType: sanitizeText(String(value.mimeType)), data: value.data };
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    ["arguments", "details", "data"].includes(key) ? sanitizeValue(item)
      : sanitizeConversation(item),
  ]));
}

export function sanitizeCaptureConversation(conversation: readonly unknown[]): unknown[] {
  return conversation.map(sanitizeConversation);
}

/** Also used at the queue boundary, including callers that did not use the Pi adapter. */
export function sanitizeCaptureSnapshot(snapshot: CaptureSnapshot): CaptureSnapshot {
  const { conversation, entries, ...metadata } = snapshot;
  return {
    ...sanitizeValue(metadata) as Omit<CaptureSnapshot, "entries" | "conversation">,
    entries: entries.map((entry) => sanitizeValue(entry) as EvidenceEntry),
    ...(conversation !== undefined
      ? { conversation: sanitizeCaptureConversation(conversation) } : {}),
  };
}

function conversationForEntry(entry: SessionEntry): unknown {
  const message = asMessage(entry);
  const memory = (typeof message?.toolName === "string" && isMemoryOperation(message.toolName)) ||
    ("customType" in entry && isMemoryOperation(entry.customType)) ||
    (isRecord(entry) && isRecord(entry.message) &&
      typeof entry.message.customType === "string" && isMemoryOperation(entry.message.customType));
  return { ...sanitizeConversation(entry) as Record<string, unknown>,
    ...(memory ? { trust: "untrusted-memory" } : {}) };
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
    const nonText = Array.isArray(message.content) && message.content.some((part) =>
      isRecord(part) && typeof part.type === "string" && part.type !== "text");
    const text = safeText(contentText(message.content)) || (nonText
      ? "[User supplied non-text content; see the original conversation entry.]" : "");
    return text ? { id: entry.id, role: "user", text } : undefined;
  }
  if (message.role === "assistant") {
    const text = safeText(contentText(message.content));
    return text ? { id: entry.id, role: "assistant", text } : undefined;
  }
  if (message.role === "toolResult" && typeof message.toolName === "string") {
    if (isMemoryOperation(message.toolName)) return undefined;
    const text = safeText(contentText(message.content)) || (message.isError === true
      ? "[Tool returned an error without text content; see the original conversation entry.]" : "");
    if (!text || (includeToolEvidence && !includeToolEvidence(message.toolName, text)))
      return undefined;
    return {
      id: entry.id,
      role: "toolResult",
      text,
      toolName: message.toolName,
      ...(typeof message.isError === "boolean" ? { isError: message.isError } : {}),
      ...(typeof message.toolCallId === "string" ? { toolCallId: message.toolCallId } : {}),
      ...(message.details !== undefined ? { details: sanitizeValue(message.details) } : {}),
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
  for (const entry of entries) {
    const evidence = evidenceForEntry(entry, includeToolEvidence);
    if (!evidence) continue;
    evidenceEntries.push(evidence);
  }
  return evidenceEntries;
}

export function buildCaptureSnapshot(options: SnapshotOptions): SnapshotResult {
  if (options.mode === "off")
    return { status: "skipped", reason: "capture is off" };

  const leafEntryId = options.leafEntryId ?? options.session.getLeafId() ?? undefined;
  const branch = options.session.getBranch(leafEntryId);
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

  const excluded = new Set(options.excludedEvidenceEntryIds);
  const entries = collectEvidence(branch, options.includeToolEvidence)
    .filter((entry) => !excluded.has(entry.id));

  const sessionId = options.session.getSessionId();
  const branchId =
    options.branchId ?? options.context.branchId ?? rootId(branch, sessionId);
  const context: WorkContext = { ...options.context, sessionId, branchId };
  const snapshot: CaptureSnapshotWithStatus = {
    id: snapshotId(sessionId, branchId, finalAssistant.entry.id),
    context,
    instanceId: options.instanceId,
    entries,
    conversation: branch.map(conversationForEntry),
    conversationCoverage: "complete",
    processedThroughEntryId: options.afterEntryId ?? options.baselineEntryId ?? null,
    leafEntryId,
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
