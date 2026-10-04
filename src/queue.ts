import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import {
  chmod,
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
  stat,
} from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import type {
  CaptureSnapshot,
  CompactedConversation,
  EvidenceEntry,
  MemoryInput,
  Project,
  WorkContext,
} from "./contracts.ts";
import { sanitizeText, sanitizeValue } from "./privacy.ts";
import {
  compactCaptureSnapshot, reuseCaptureHistory, sanitizeCaptureSnapshot,
} from "./snapshot.ts";

export type QueueJobStatus =
  | "pending"
  | "running"
  | "paused"
  | "complete"
  | "failed";

export interface QueueIdentity {
  instanceId: string;
  endpoint?: string;
  accountId?: string;
}

export interface QueueWatermark {
  sessionId: string;
  branchId: string;
  /** Latest enqueue/skip boundary; dedupe is independent of successful capture progress. */
  lastEntryId?: string;
  /** Furthest successful capture boundary, not a guarantee that older queued jobs finished. */
  capturedThroughEntryId?: string;
  consideredEntryIds: string[];
  snapshotIds: string[];
  dedupeKeys: string[];
  /** Successful historical summary in an immutable sidecar, never raw failed-job evidence. */
  historyDigest?: string;
  /** Summary cursor, separate from enqueue dedupe and capture watermarks. */
  historyThroughEntryId?: string;
  /** Original branch entry IDs used only to compare summary cursor order. */
  historyEntryIds?: string[];
  updatedAt: string;
}

export interface QueueJob {
  id: string;
  dedupeKey: string;
  binding: QueueIdentity;
  snapshot: CaptureSnapshot;
  status: QueueJobStatus;
  attempts: number;
  callCount: number;
  extractedCandidates?: unknown[];
  candidateOutcomes: Record<string, unknown>;
  submissionRejections?: string[];
  lastError?: string;
  /** An aborted accepted mutation requires reconciliation before any replay. */
  uncertainWrite?: string;
  supersession?: SupersessionReceipt;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  ownerPid?: number;
}

export interface SupersessionReceipt {
  oldMemoryId: number;
  replacementId: number;
  status: "started" | "completed" | "failed";
}

export interface QueueJobMetadata extends Omit<QueueJob, "snapshot"> {
  snapshot: Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">;
}

export interface PendingConflict {
  id: string;
  jobId?: string;
  candidateId: string;
  binding: QueueIdentity;
  sessionId: string;
  branchId: string;
  context?: WorkContext;
  destinationProjectId: number;
  oldMemoryId?: number;
  oldMemoryIds?: number[];
  oldClaim?: string;
  newClaim?: string;
  oldMemory?: unknown;
  candidate: unknown;
  sourceEntryIds: string[];
  evidence: string[];
  partial?: boolean;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  replacementId?: number;
  uncertainWrite?: string;
  supersession?: SupersessionReceipt;
  replacement?: {
    // Missing version identifies legacy implicit preservation plans; never execute as explicit.
    planVersion?: 1;
    requestKey?: string;
    requestPayload?: string;
    request?: {
      evidenceEntryIds: string[];
      selectedAdditionalEntries: EvidenceEntry[];
      reason?: string;
      additionalEvidence?: string;
    };
    // The model's update selection and this plan's actual target are distinct from older targets.
    replacementMemoryId?: number;
    memoryId?: number;
    priorMemoryId?: number;
    updateComplete?: boolean;
    executionError?: string;
    // Service creation output, separate from model-selected manual link operations.
    autoLinkedMemoryIds?: number[];
    completedEntityIds?: number[];
    completedMemoryIds?: number[];
    creationError?: string;
    input: MemoryInput;
    candidate: unknown;
    entityIds: number[];
    memoryIds: number[];
    linksComplete?: boolean;
    creationAttempted?: boolean;
    knowledgeState?: unknown;
  };
  resolution?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface QueueEnqueueResult {
  queued: boolean;
  jobId: string;
  reason?: string;
  historyError?: string;
}

export interface WatermarkAdvance {
  sessionId: string;
  branchId: string;
  entryIds: string[];
  finalEntryId?: string;
  snapshotId?: string;
  dedupeKey?: string;
}

export interface QueueCheckpoint {
  status?: QueueJobStatus;
  callCount?: number;
  extractedCandidates?: unknown[];
  candidateOutcomes?: Record<string, unknown>;
  submissionRejections?: string[];
  lastError?: string;
  startedAt?: string;
  supersession?: SupersessionReceipt;
  /** Append-only source observations; inspection: IDs must never reuse session IDs. */
  inspectionEntries?: EvidenceEntry[];
  compactedConversation?: CompactedConversation;
}

export interface DurableQueueStoreOptions {
  directory?: string;
  filePath?: string;
  lockPath?: string;
  instanceId?: string;
  endpoint?: string;
  accountId?: string;
  staleLockMs?: number;
  staleJobMs?: number;
  maxAttempts?: number;
  retentionMs?: number;
  now?: () => Date;
}

interface StoredQueueJob extends QueueJob {
  snapshotDigest?: string;
  inspectionDigest?: string;
}

type SnapshotPayload = Pick<CaptureSnapshot,
  "entries" | "conversation" | "sourceConversation" | "historySummary">;

interface QueueState {
  version: 1 | 2;
  jobs: StoredQueueJob[];
  conflicts: PendingConflict[];
  watermarks: Record<string, QueueWatermark>;
}

interface FileLock {
  token: string;
  release(): Promise<void>;
}

export class QueueBusyError extends Error {
  constructor(path: string) {
    super(`Queue lock is busy: ${path}`);
    this.name = "QueueBusyError";
  }
}

const DEFAULT_STALE_LOCK_MS = 60_000;
const DEFAULT_STALE_JOB_MS = 5 * 60_000;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETENTION_MS = 7 * 24 * 60 * 60_000;
const MAX_QUEUE_BYTES = 50 * 1024 * 1024;
const MAX_PENDING_CONFLICTS = 100;
const processMutationTails = new Map<string, Promise<void>>();

function jsonSnapshot<T>(value: T): T {
  // Match persisted JSON, including omission of undefined patch fields. A structured clone
  // retains those fields and could erase existing conflict values when applying a patch.
  const serialized = JSON.stringify(value);
  return JSON.parse(serialized) as T;
}

function nowIso(now: () => Date): string {
  return now().toISOString();
}

function contextKey(sessionId: string, branchId: string): string {
  return `${sessionId}\u0000${branchId}`;
}

function dedupeKey(snapshot: CaptureSnapshot): string {
  return [
    snapshot.instanceId,
    snapshot.context.sessionId,
    snapshot.context.branchId,
    snapshot.finalEntryId,
  ].join("\u0000");
}

function jobIdFor(key: string): string {
  return `capture-${createHash("sha256").update(key).digest("hex").slice(0, 24)}`;
}

function scrubDiagnostic(value: string): string {
  return sanitizeText(value).slice(0, 1_000);
}

function sanitizeOutcomeMap(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, outcome]) => [key, sanitizeValue(outcome)]),
  );
}

function outcomeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function interruptedWrite(job: QueueJob): boolean {
  if (job.supersession?.status === "started") return true;
  return Object.values(job.candidateOutcomes).some((value) => {
    const outcome = outcomeRecord(value);
    if (outcome.uncertainWrite || outcomeRecord(outcome.creation).status === "started") return true;
    // A stopped candidate keeps historical failed receipts, not instructions to try again.
    if (outcome.stage === "execution-stopped") return false;
    const pending = outcomeRecord(outcome.knowledgeState).pendingCreates;
    if (Array.isArray(pending) && pending.length && !outcome.executionFailure) return true;
    const results = outcomeRecord(outcome.linkReview).executionResults;
    return Array.isArray(results) &&
      results.some((item) => outcomeRecord(item).status === "started");
  });
}

function releaseCompletedArtifacts(job: StoredQueueJob): void {
  if (job.status !== "complete") return;
  const candidates = new Map((job.extractedCandidates ?? []).map((value) => {
    const candidate = outcomeRecord(value);
    return [candidate.id, candidate];
  }));
  job.candidateOutcomes = Object.fromEntries(Object.entries(job.candidateOutcomes)
    .map(([id, value]) => {
      const outcome = outcomeRecord(value);
      const summary: Record<string, unknown> = {};
      for (const key of ["stage", "action", "reason", "destinationProjectId", "memoryId",
        "replacementId", "conflictId"]) {
        const field = outcome[key];
        if (typeof field === "string") summary[key] = scrubDiagnostic(field);
        else if (typeof field === "number") summary[key] = field;
      }
      const action = outcomeRecord(outcome.decision).action;
      if (summary.action === undefined && typeof action === "string")
        summary.action = scrubDiagnostic(action);
      const sourceIds = outcome.sourceEntryIds ?? candidates.get(id)?.sourceEntryIds;
      if (Array.isArray(sourceIds)) summary.sourceEntryIds = sourceIds.slice(0, 8)
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.slice(0, 200));
      if (outcome.linkReview) {
        const review = outcomeRecord(outcome.linkReview);
        summary.linkReview = {
          ...(typeof review.status === "string" ? { status: review.status } : {}),
          ...(typeof review.reason === "string" ? { reason: scrubDiagnostic(review.reason) } : {}),
          ...(Array.isArray(review.unreviewed) ? { unreviewed: review.unreviewed.map((value) => {
            const item = outcomeRecord(value);
            return { memoryId: item.memoryId,
              ...(typeof item.reason === "string"
                ? { reason: scrubDiagnostic(item.reason) } : {}) };
          }) } : {}),
        };
      }
      return [id, summary];
    }));
  // Keep only the bounded preview already exposed by capture diagnostics.
  if (job.extractedCandidates) job.extractedCandidates = job.extractedCandidates.slice(0, 4)
    .map((value) => {
      const candidate = outcomeRecord(value);
      const preview: Record<string, unknown> = {};
      for (const [key, limit] of [["id", 100], ["title", 200], ["content", 2_000]] as const) {
        if (typeof candidate[key] === "string") preview[key] = candidate[key].slice(0, limit);
      }
      return preview;
    });
}

function normaliseState(value: unknown): QueueState {
  if (!value || typeof value !== "object")
    throw new Error("Invalid queue state");
  const record = value as Partial<QueueState>;
  if (
    (record.version !== 1 && record.version !== 2) ||
    !Array.isArray(record.jobs) ||
    !Array.isArray(record.conflicts) ||
    !record.watermarks ||
    typeof record.watermarks !== "object"
  ) {
    throw new Error("Invalid queue state");
  }
  if (record.version === 1) {
    for (const job of record.jobs) {
      job.snapshot = { ...job.snapshot, conversationCoverage: "legacy-partial" };
    }
  } else {
    for (const job of record.jobs) {
      const needsSnapshot = job.status !== "failed" && (job.status !== "complete" ||
        record.conflicts.some((conflict) =>
          conflict.status === "pending" && conflict.jobId === job.id));
      if (needsSnapshot && !job.snapshotDigest)
        throw new Error("Capture snapshot reference is missing");
    }
  }
  return {
    version: record.version,
    jobs: record.jobs as StoredQueueJob[],
    conflicts: record.conflicts,
    watermarks: record.watermarks,
  };
}

function validateInspectionEntry(input: EvidenceEntry, reserved: Set<string>): void {
  if (!input || typeof input.id !== "string" || !input.id.startsWith("inspection:") ||
      input.id === "inspection:" || reserved.has(input.id) || input.role !== "toolResult" ||
      typeof input.text !== "string" || !input.toolName)
    throw new Error("Invalid inspection evidence or original session entry ID");
}

function isProcessAlive(pid: unknown): boolean {
  if (typeof pid !== "number" || !Number.isInteger(pid) || pid <= 0)
    return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

function identityMatches(job: QueueJob, identity: QueueIdentity): boolean {
  return (
    job.binding.instanceId === identity.instanceId &&
    job.binding.endpoint === identity.endpoint &&
    job.binding.accountId === identity.accountId
  );
}

function conflictIdentityMatches(
  conflict: PendingConflict,
  identity?: QueueIdentity,
): boolean {
  return (
    !identity ||
    identityMatches({ binding: conflict.binding } as QueueJob, identity)
  );
}

function shouldRetain(
  timestamp: string,
  now: number,
  retentionMs: number,
): boolean {
  const parsed = Date.parse(timestamp);
  return !Number.isFinite(parsed) || now - parsed <= retentionMs;
}

function diagnosticError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordId(value: unknown): string | undefined {
  // A derived summary stands at its original source boundary for ordering, not evidence.
  if (value && typeof value === "object" && "type" in value &&
      value.type === "capture_history_summary" && "throughEntryId" in value &&
      typeof value.throughEntryId === "string") return value.throughEntryId;
  return value && typeof value === "object" && "id" in value &&
    typeof value.id === "string" ? value.id : undefined;
}

function orderedSourceEntryIds(snapshot: CaptureSnapshot): string[] | undefined {
  const source = snapshot.sourceConversation ?? snapshot.conversation ?? snapshot.entries;
  const ids = source.map(recordId).filter((id): id is string => Boolean(id));
  return ids.length ? ids : undefined;
}

function summaryCursor(snapshot: CaptureSnapshot): {
  throughEntryId: string;
  entryIds: string[];
} | undefined {
  const history = snapshot.historySummary;
  const entryIds = orderedSourceEntryIds(snapshot);
  if (!history || !entryIds?.includes(history.throughEntryId)) return undefined;
  return { throughEntryId: history.throughEntryId, entryIds };
}

function cursorComparison(
  candidate: { throughEntryId: string; entryIds: string[] },
  current: { throughEntryId?: string; entryIds?: string[] },
): number | undefined {
  if (!current.throughEntryId || !current.entryIds?.length) return undefined;
  const candidateInCurrent = current.entryIds.indexOf(candidate.throughEntryId);
  const currentInCurrent = current.entryIds.indexOf(current.throughEntryId);
  if (candidateInCurrent >= 0 && currentInCurrent >= 0)
    return Math.sign(candidateInCurrent - currentInCurrent);
  const candidateInCandidate = candidate.entryIds.indexOf(candidate.throughEntryId);
  const currentInCandidate = candidate.entryIds.indexOf(current.throughEntryId);
  if (candidateInCandidate >= 0 && currentInCandidate >= 0)
    return Math.sign(candidateInCandidate - currentInCandidate);
  return undefined;
}

function clearHistoryCache(watermark: QueueWatermark): void {
  delete watermark.historyDigest;
  delete watermark.historyThroughEntryId;
  delete watermark.historyEntryIds;
}

/**
 * A small JSON-backed queue. Every mutation is written to a temporary file and renamed while
 * a 0600 lock is held. The lock is deliberately separate from the queue data so a crashed
 * worker can be recovered without treating a partially-written JSON file as valid state.
 */
export class DurableQueueStore {
  readonly filePath: string;
  readonly lockPath: string;

  private readonly directory: string;
  private readonly instanceId?: string;
  private readonly endpoint?: string;
  private readonly accountId?: string;
  private readonly staleLockMs: number;
  private readonly staleJobMs: number;
  private readonly maxAttempts: number;
  private readonly retentionMs: number;
  private readonly now: () => Date;
  private readonly snapshotPrefix: string;

  constructor(options: DurableQueueStoreOptions | string = {}) {
    const resolved =
      typeof options === "string" ? { filePath: options } : options;
    this.filePath =
      resolved.filePath ??
      join(resolved.directory ?? ".pi/forgetful", "queue.json");
    this.directory = resolved.directory ?? dirname(this.filePath);
    this.snapshotPrefix = "snapshot-" + createHash("sha256")
      .update(basename(this.filePath)).digest("hex").slice(0, 16) + "-";
    this.lockPath = resolved.lockPath ?? `${this.filePath}.lock`;
    this.instanceId = resolved.instanceId;
    this.endpoint = resolved.endpoint;
    this.accountId = resolved.accountId;
    this.staleLockMs = resolved.staleLockMs ?? DEFAULT_STALE_LOCK_MS;
    this.staleJobMs = resolved.staleJobMs ?? DEFAULT_STALE_JOB_MS;
    this.maxAttempts = resolved.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    this.retentionMs = resolved.retentionMs ?? DEFAULT_RETENTION_MS;
    this.now = resolved.now ?? (() => new Date());
  }

  private defaultIdentity(): QueueIdentity {
    if (!this.instanceId)
      throw new Error(
        "DurableQueueStore requires an instanceId for this operation",
      );
    return {
      instanceId: this.instanceId,
      endpoint: this.endpoint,
      accountId: this.accountId,
    };
  }

  private async ensureDirectory(): Promise<void> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    if (!(await lstat(this.directory)).isDirectory())
      throw new Error("Capture queue directory must not be a symlink");
    await chmod(this.directory, 0o700);
  }

  private snapshotPath(digest: string): string {
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error("Invalid capture snapshot digest");
    return join(this.directory, `${this.snapshotPrefix}${digest}.json`);
  }

  private async syncDirectory(): Promise<void> {
    const handle = await open(this.directory, constants.O_RDONLY | constants.O_NOFOLLOW);
    try { await handle.sync(); } finally { await handle.close(); }
  }

  private async readSnapshot(digest: string): Promise<SnapshotPayload> {
    if (!(await lstat(this.directory)).isDirectory())
      throw new Error("Capture queue directory must not be a symlink");
    const handle = await open(this.snapshotPath(digest),
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    try {
      const details = await handle.stat();
      if (!details.isFile()) throw new Error("Capture snapshot must be a regular file");
      const encoded = await handle.readFile("utf8");
      if (createHash("sha256").update(encoded).digest("hex") !== digest)
        throw new Error("Capture snapshot digest mismatch");
      const payload = JSON.parse(encoded) as SnapshotPayload;
      if (!Array.isArray(payload.entries) ||
          (payload.conversation !== undefined && !Array.isArray(payload.conversation)) ||
          (payload.sourceConversation !== undefined &&
            !Array.isArray(payload.sourceConversation)) ||
          (payload.historySummary !== undefined &&
            (typeof payload.historySummary?.throughEntryId !== "string" ||
              typeof payload.historySummary?.text !== "string")))
        throw new Error("Invalid capture snapshot payload");
      return payload;
    } finally { await handle.close(); }
  }

  private async storeSnapshot(payload: SnapshotPayload): Promise<string> {
    const encoded = JSON.stringify(payload);
    const digest = createHash("sha256").update(encoded).digest("hex");
    try {
      await this.readSnapshot(digest);
      return digest;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const path = this.snapshotPath(digest);
    const temporary = `${path}.${randomUUID()}.tmp`;
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(encoded);
      await handle.sync();
    } catch (error) {
      await rm(temporary, { force: true });
      throw error;
    } finally { await handle.close(); }
    try {
      await rename(temporary, path);
      await this.syncDirectory();
    } catch (error) {
      await rm(temporary, { force: true });
      throw error;
    }
    return digest;
  }

  private async hydrateJob(job: StoredQueueJob): Promise<QueueJob> {
    const { snapshotDigest, inspectionDigest, snapshot, ...metadata } = job;
    const payload = snapshotDigest ? await this.readSnapshot(snapshotDigest)
      : snapshot;
    const inspections = inspectionDigest
      ? (await this.readSnapshot(inspectionDigest)).entries : [];
    // Payloads belong to this read, so only metadata needs the JSON copy's undefined handling.
    return { ...jsonSnapshot(metadata), snapshot: { ...snapshot, ...payload,
      entries: [...payload.entries, ...inspections] } };
  }

  private releaseTerminalSnapshot(state: QueueState, job: StoredQueueJob): void {
    if ((job.status === "complete" || job.status === "failed") &&
        !state.conflicts.some((conflict) => conflict.status === "pending" &&
          conflict.jobId === job.id)) {
      delete job.snapshotDigest;
      delete job.inspectionDigest;
    }
  }

  private async appendInspections(job: StoredQueueJob, additions: EvidenceEntry[]): Promise<void> {
    if (job.status === "complete" || job.status === "failed")
      throw new Error("Cannot append inspection evidence to a terminal capture job");
    const original = job.snapshotDigest
      ? await this.readSnapshot(job.snapshotDigest) : job.snapshot;
    const reserved = new Set(original.entries.map((entry) => entry.id));
    for (const entry of original.conversation ?? []) {
      if (entry && typeof entry === "object" && "id" in entry) reserved.add(String(entry.id));
    }
    const entries = job.inspectionDigest
      ? [...(await this.readSnapshot(job.inspectionDigest)).entries] : [];
    for (const input of additions) {
      validateInspectionEntry(input, reserved);
      const entry = sanitizeValue(jsonSnapshot(input)) as EvidenceEntry;
      const existing = entries.find((item) => item.id === entry.id);
      if (existing && JSON.stringify(existing) !== JSON.stringify(entry))
        throw new Error("Inspection evidence IDs are immutable once recorded");
      if (!existing) entries.push(entry);
    }
    if (entries.length) job.inspectionDigest = await this.storeSnapshot({ entries });
  }

  private async collectSnapshots(state: QueueState): Promise<void> {
    const digests = [...state.jobs.flatMap((job) => [job.snapshotDigest, job.inspectionDigest]),
      ...Object.values(state.watermarks).map((watermark) => watermark.historyDigest)];
    const retained = new Set(digests.filter((value): value is string => Boolean(value))
      .map((digest) => this.snapshotPath(digest)));
    for (const name of await readdir(this.directory)) {
      if (!name.startsWith(this.snapshotPrefix)) continue;
      const suffix = name.slice(this.snapshotPrefix.length);
      if (/^[a-f0-9]{64}\.json\.[a-f0-9-]{36}\.tmp$/.test(suffix)) {
        const path = join(this.directory, name);
        const details = await lstat(path);
        if (this.now().getTime() - details.mtimeMs > this.retentionMs)
          await rm(path, { force: true });
        continue;
      }
      if (!name.endsWith(".json")) continue;
      const digest = name.slice(this.snapshotPrefix.length, -5);
      if (!/^[a-f0-9]{64}$/.test(digest)) continue;
      const path = this.snapshotPath(digest);
      if (retained.has(path)) continue;
      await rm(path, { force: true });
    }
    await this.syncDirectory();
  }

  private async readState(): Promise<QueueState> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      if (Buffer.byteLength(raw, "utf8") > MAX_QUEUE_BYTES) {
        throw new Error("Capture queue exceeds its bounded storage limit");
      }
      try {
        return normaliseState(JSON.parse(raw));
      } catch (error) {
        if (error instanceof SyntaxError)
          throw new Error("Invalid queue state");
        throw error;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return { version: 2, jobs: [], conflicts: [], watermarks: {} };
      }
      throw error;
    }
  }

  private async writeState(state: QueueState): Promise<void> {
    await this.ensureDirectory();
    this.pruneFailedJobs(state);
    for (const job of state.jobs) {
      releaseCompletedArtifacts(job);
      this.releaseTerminalSnapshot(state, job);
      if (job.snapshotDigest || ((job.status === "complete" || job.status === "failed") &&
          !job.snapshot.entries.length && job.snapshot.conversation === undefined)) continue;
      const { entries, conversation, sourceConversation, historySummary, ...metadata } =
        sanitizeCaptureSnapshot(job.snapshot);
      job.snapshotDigest = await this.storeSnapshot({ entries, conversation,
        sourceConversation, historySummary });
      job.snapshot = { ...metadata, entries: [] };
    }
    state.version = 2;
    const temporary = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    const handle = await open(temporary, "wx", 0o600);
    try {
      const encoded = JSON.stringify(state);
      if (Buffer.byteLength(encoded, "utf8") > MAX_QUEUE_BYTES) {
        throw new Error("Capture queue exceeds its bounded storage limit");
      }
      await handle.writeFile(encoded);
      await handle.sync();
      await handle.close();
    } catch (error) {
      await handle.close().catch(() => undefined);
      await rm(temporary, { force: true });
      throw error;
    }
    await chmod(temporary, 0o600);
    try {
      await rename(temporary, this.filePath);
    } catch (error) {
      await rm(temporary, { force: true });
      throw error;
    }
    await chmod(this.filePath, 0o600);
    await this.syncDirectory();
    // A committed receipt remains successful if optional reclamation fails. The next mutation
    // retries collection; retaining an unreachable private file is safer than losing evidence.
    await this.collectSnapshots(state).catch(() => undefined);
  }

  private async acquireFileLock(path: string): Promise<FileLock> {
    await this.ensureDirectory();
    const token = randomUUID();
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.createFileLock(path, token);
      } catch (error) {
        await this.recoverExistingLock(path, error);
      }
    }
    throw new QueueBusyError(path);
  }

  private async recoverExistingLock(
    path: string,
    error: unknown,
  ): Promise<void> {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    try {
      await this.removeAbandonedLock(path);
    } catch (staleError) {
      if (staleError instanceof QueueBusyError) throw staleError;
      if ((staleError as NodeJS.ErrnoException).code !== "ENOENT") {
        throw staleError;
      }
    }
  }

  private async createFileLock(path: string, token: string): Promise<FileLock> {
    const handle = await open(path, "wx", 0o600);
    try {
      await handle.writeFile(
        JSON.stringify({
          token,
          pid: process.pid,
          createdAt: nowIso(this.now),
        }),
      );
      await handle.sync();
    } finally {
      await handle.close();
    }
    await chmod(path, 0o600);
    return { token, release: () => this.releaseFileLock(path, token) };
  }

  private async releaseFileLock(path: string, token: string): Promise<void> {
    try {
      const current = JSON.parse(await readFile(path, "utf8")) as {
        token?: string;
      };
      if (current.token === token) await rm(path, { force: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  private async removeAbandonedLock(path: string): Promise<void> {
    const details = await stat(path);
    const age = Date.now() - details.mtimeMs;
    let ownerPid: unknown;
    try {
      const metadata = JSON.parse(await readFile(path, "utf8")) as {
        pid?: unknown;
      };
      ownerPid = metadata.pid;
    } catch {
      // A stale, unreadable lock can be removed after the age check below.
    }
    const hasValidPid =
      typeof ownerPid === "number" &&
      Number.isInteger(ownerPid) &&
      ownerPid > 0;
    if (hasValidPid ? isProcessAlive(ownerPid) : age <= this.staleLockMs) {
      throw new QueueBusyError(path);
    }
    await rm(path, { force: true });
  }

  private async withFileLock<T>(
    path: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const lock = await this.acquireFileLock(path);
    try {
      return await operation();
    } finally {
      await lock.release();
    }
  }

  private async withMutationFileLock<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    let waitMs = 5;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      try {
        return await this.withFileLock(this.lockPath, operation);
      } catch (error) {
        if (!(error instanceof QueueBusyError) || attempt === 5) throw error;
        await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
        waitMs *= 2;
      }
    }
    throw new QueueBusyError(this.lockPath);
  }

  private async mutate<T>(
    operation: (
      state: QueueState,
    ) =>
      | Promise<{ value: T; changed?: boolean }>
      | { value: T; changed?: boolean },
  ): Promise<T> {
    const previous =
      processMutationTails.get(this.lockPath) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    processMutationTails.set(this.lockPath, current);
    await previous;
    try {
      return await this.withMutationFileLock(async () => {
        const state = await this.readState();
        const pruned = this.pruneFailedJobs(state);
        const result = await operation(state);
        if (pruned || result.changed !== false) await this.writeState(state);
        return result.value;
      });
    } finally {
      release();
      if (processMutationTails.get(this.lockPath) === current)
        processMutationTails.delete(this.lockPath);
    }
  }

  private pruneFailedJobs(state: QueueState): boolean {
    const failedIds = new Set(state.jobs.filter((job) => job.status === "failed")
      .map((job) => job.id));
    if (!failedIds.size) return false;
    state.jobs = state.jobs.filter((job) => !failedIds.has(job.id));
    state.conflicts = state.conflicts.filter((conflict) =>
      !conflict.jobId || !failedIds.has(conflict.jobId));
    return true;
  }

  private prune(state: QueueState): void {
    const cutoff = this.now().getTime();
    const liveBranches = new Set([
      ...state.jobs.filter((job) =>
        job.status === "pending" || job.status === "running" || job.status === "paused")
        .map((job) => contextKey(job.snapshot.context.sessionId, job.snapshot.context.branchId)),
      ...state.conflicts.filter((conflict) => conflict.status === "pending")
        .map((conflict) => contextKey(conflict.sessionId, conflict.branchId)),
    ]);
    state.jobs = state.jobs.filter(
      (job) =>
        job.status === "pending" ||
        job.status === "running" ||
        job.status === "paused" ||
        state.conflicts.some((conflict) => conflict.status === "pending" &&
          conflict.jobId === job.id) ||
        shouldRetain(job.updatedAt, cutoff, this.retentionMs),
    );
    state.conflicts = state.conflicts.filter(
      (conflict) =>
        conflict.status === "pending" ||
        shouldRetain(conflict.updatedAt, cutoff, this.retentionMs),
    );
    const watermarks = Object.values(state.watermarks);
    for (const watermark of watermarks) {
      watermark.consideredEntryIds = watermark.consideredEntryIds.slice(-2_000);
      watermark.snapshotIds = watermark.snapshotIds.slice(-200);
      watermark.dedupeKeys = watermark.dedupeKeys.slice(-2_000);
      if (watermark.historyEntryIds)
        watermark.historyEntryIds = watermark.historyEntryIds.slice(-2_000);
      if (watermark.historyDigest &&
          !liveBranches.has(contextKey(watermark.sessionId, watermark.branchId)) &&
          !shouldRetain(watermark.updatedAt, cutoff, this.retentionMs)) {
        clearHistoryCache(watermark);
      }
    }
    const pending = state.conflicts.filter(
      (conflict) => conflict.status === "pending",
    );
    const terminal = state.conflicts.filter(
      (conflict) => conflict.status !== "pending",
    );
    const terminalCapacity = MAX_PENDING_CONFLICTS - pending.length;
    state.conflicts =
      terminalCapacity > 0
        ? [...pending, ...terminal.slice(-terminalCapacity)]
        : pending;
  }

  private updateWatermark(
    state: QueueState,
    update: WatermarkAdvance,
  ): QueueWatermark {
    const key = contextKey(update.sessionId, update.branchId);
    const current = state.watermarks[key] ?? {
      sessionId: update.sessionId,
      branchId: update.branchId,
      consideredEntryIds: [],
      snapshotIds: [],
      dedupeKeys: [],
      updatedAt: nowIso(this.now),
    };
    for (const entryId of update.entryIds) {
      if (
        typeof entryId === "string" &&
        entryId &&
        !current.consideredEntryIds.includes(entryId)
      ) {
        current.consideredEntryIds.push(entryId);
      }
    }
    if (update.snapshotId && !current.snapshotIds.includes(update.snapshotId))
      current.snapshotIds.push(update.snapshotId);
    if (update.dedupeKey && !current.dedupeKeys.includes(update.dedupeKey))
      current.dedupeKeys.push(update.dedupeKey);
    if (update.finalEntryId) current.lastEntryId = update.finalEntryId;
    current.updatedAt = nowIso(this.now);
    current.consideredEntryIds = current.consideredEntryIds.slice(-2_000);
    current.snapshotIds = current.snapshotIds.slice(-200);
    current.dedupeKeys = current.dedupeKeys.slice(-2_000);
    state.watermarks[key] = current;
    return current;
  }

  async enqueue(snapshot: CaptureSnapshot): Promise<QueueEnqueueResult> {
    if (
      !snapshot?.instanceId ||
      !snapshot.context?.sessionId ||
      !snapshot.context?.branchId ||
      !snapshot.finalEntryId ||
      !Array.isArray(snapshot.entries)
    ) {
      throw new Error("Invalid capture snapshot");
    }
    if (this.instanceId && snapshot.instanceId !== this.instanceId) {
      throw new Error("Capture snapshot belongs to another Forgetful instance");
    }
    const safeSnapshot = sanitizeCaptureSnapshot(snapshot);
    const identity: QueueIdentity = {
      instanceId: safeSnapshot.instanceId,
      endpoint: this.endpoint,
      accountId: this.accountId,
    };
    const key = dedupeKey(safeSnapshot);
    const id = jobIdFor(key);
    return this.mutate<QueueEnqueueResult>(async (state) => {
      this.prune(state);
      const existing = state.jobs.find(
        (job) => job.id === id || job.dedupeKey === key,
      );
      const watermark =
        state.watermarks[
          contextKey(
            safeSnapshot.context.sessionId,
            safeSnapshot.context.branchId,
          )
        ];
      if (existing || watermark?.dedupeKeys.includes(key)) {
        return {
          value: {
            queued: false,
            jobId: existing?.id ?? id,
            reason: "duplicate",
          },
          changed: false,
        };
      }
      let historyError: string | undefined;
      let history = undefined as SnapshotPayload["historySummary"] | undefined;
      if (watermark?.historyDigest) {
        try {
          history = (await this.readSnapshot(watermark.historyDigest)).historySummary;
        } catch (error) {
          historyError = `Reusable summary cache unavailable: ${diagnosticError(error)}`;
          clearHistoryCache(watermark);
        }
      }
      const persistedSnapshot = reuseCaptureHistory(safeSnapshot, history);
      const timestamp = nowIso(this.now);
      const job: QueueJob = {
        id,
        dedupeKey: key,
        binding: identity,
        snapshot: jsonSnapshot(persistedSnapshot),
        status: "pending",
        attempts: 0,
        callCount: 0,
        candidateOutcomes: {},
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      state.jobs.push(job);
      this.updateWatermark(state, {
        sessionId: safeSnapshot.context.sessionId,
        branchId: safeSnapshot.context.branchId,
        entryIds: safeSnapshot.entries.map((entry) => entry.id),
        finalEntryId: safeSnapshot.finalEntryId,
        snapshotId: safeSnapshot.id,
        dedupeKey: key,
      });
      return { value: { queued: true, jobId: id, historyError } };
    });
  }

  async enqueueSnapshot(
    snapshot: CaptureSnapshot,
  ): Promise<QueueEnqueueResult> {
    return this.enqueue(snapshot);
  }

  async advanceWatermark(
    update: WatermarkAdvance | CaptureSnapshot,
  ): Promise<QueueWatermark> {
    const value: WatermarkAdvance =
      "entries" in update
        ? {
            sessionId: update.context.sessionId,
            branchId: update.context.branchId,
            entryIds: update.entries.map((entry) => entry.id),
            finalEntryId: update.finalEntryId,
            snapshotId: update.id,
            dedupeKey: dedupeKey(update),
          }
        : update;
    if (!value.sessionId || !value.branchId || !Array.isArray(value.entryIds)) {
      throw new Error("Invalid watermark update");
    }
    return this.mutate((state) => {
      this.prune(state);
      return { value: jsonSnapshot(this.updateWatermark(state, value)) };
    });
  }

  async getWatermark(
    sessionId: string,
    branchId: string,
  ): Promise<QueueWatermark> {
    const state = await this.readState();
    return jsonSnapshot(
      state.watermarks[contextKey(sessionId, branchId)] ?? {
        sessionId,
        branchId,
        consideredEntryIds: [],
        snapshotIds: [],
        dedupeKeys: [],
        updatedAt: nowIso(this.now),
      },
    );
  }

  /** Resume only a persisted branch whose latest handled entry remains on the active path. */
  async resolveBranchId(
    sessionId: string, activeEntryIds: readonly string[], fallbackBranchId: string,
  ): Promise<string> {
    const state = await this.readState();
    const positions = new Map(activeEntryIds.map((id, index) => [id, index]));
    let branchId = fallbackBranchId;
    let furthest = -1;
    for (const watermark of Object.values(state.watermarks)) {
      if (watermark.sessionId !== sessionId || !watermark.lastEntryId) continue;
      const position = positions.get(watermark.lastEntryId);
      if (position !== undefined && position > furthest) {
        branchId = watermark.branchId;
        furthest = position;
      }
    }
    if (furthest < 0 && state.watermarks[contextKey(sessionId, fallbackBranchId)]) {
      // Repeated visits to one fork point must not alias a previously divergent branch.
      // Preserve the final anchor suffix used by conflict delivery's active-path check.
      return `${randomUUID()}:${fallbackBranchId}`;
    }
    return branchId;
  }

  async currentWatermark(
    context: Pick<WorkContext, "sessionId" | "branchId">,
  ): Promise<QueueWatermark> {
    return this.getWatermark(context.sessionId, context.branchId);
  }

  /** Attach discovery results to work saved locally while the server was still pending. */
  async completeProjectDiscovery(context: WorkContext & { projects?: Project[] }): Promise<void> {
    if (context.projectDiscoveryPending ||
        (context.project && context.project.repo_name !== context.repoName)) return;
    await this.mutate((state) => {
      let changed = false;
      for (const job of state.jobs) {
        if (!identityMatches(job, this.defaultIdentity()) ||
            !job.snapshot.context.projectDiscoveryPending ||
            job.snapshot.context.repoName !== context.repoName ||
            (!context.repoName && job.snapshot.context.cwd !== context.cwd) ||
            !["pending", "paused"].includes(job.status)) continue;
        const { projectDiscoveryPending: _, ...previous } = job.snapshot.context;
        job.snapshot.context = { ...previous, project: context.project,
          ...("projects" in context ? { projects: context.projects } : {}) };
        changed = true;
      }
      return { value: undefined, changed };
    });
  }

  async listPending(
    identity: QueueIdentity = this.defaultIdentity(),
  ): Promise<QueueJob[]> {
    return this.mutate(async (state) => ({ changed: false,
      value: await Promise.all(state.jobs.filter(
        (job) =>
          identityMatches(job, identity) &&
          ["pending", "running", "paused"].includes(job.status),
      ).map((job) => this.hydrateJob(job))),
    }));
  }

  async listJobs(identity?: QueueIdentity): Promise<QueueJob[]> {
    return this.mutate(async (state) => ({ changed: false,
      value: await Promise.all((identity
        ? state.jobs.filter((job) => identityMatches(job, identity))
        : state.jobs).map((job) => this.hydrateJob(job))),
    }));
  }

  /** Read bounded index metadata without opening transcript or inspection sidecars. */
  async listJobMetadata(identity?: QueueIdentity): Promise<QueueJobMetadata[]> {
    return this.mutate((state) => ({ changed: false,
      value: state.jobs.filter((job) => !identity || identityMatches(job, identity))
        .map(({ snapshotDigest, inspectionDigest, snapshot, ...metadata }) => {
          const { entries, conversation, sourceConversation, ...snapshotMetadata } = snapshot;
          return { ...metadata, snapshot: snapshotMetadata };
        }),
    }));
  }

  async getJob(jobId: string): Promise<QueueJob | undefined> {
    return this.mutate(async (state) => {
      const job = state.jobs.find((item) => item.id === jobId);
      return { value: job ? await this.hydrateJob(job) : undefined, changed: false };
    });
  }

  /** Check eligibility from the index without loading source sidecars or claiming an attempt. */
  async hasClaimableWork(
    identity: QueueIdentity,
    excludeBranches: Array<{ sessionId: string; branchId: string }> = [],
  ): Promise<boolean> {
    return this.mutate((state) => ({ changed: false,
      value: state.jobs.some((job) => identityMatches(job, identity) &&
        !excludeBranches.some((branch) => this.matchesBranch(job, branch)) &&
        !job.snapshot.context.projectDiscoveryPending && !job.uncertainWrite &&
        !interruptedWrite(job) && (["pending", "paused"].includes(job.status) ||
          (job.status === "running" && this.runningJobCanBeRecovered(job, this.now().getTime())))),
    }));
  }

  async claimNext(
    identity: QueueIdentity = this.defaultIdentity(),
    branch?: { sessionId: string; branchId: string },
    onDiscarded?: (outcomes: Array<{ jobId: string; error: string }>) => void,
  ): Promise<QueueJob | undefined> {
    const result = await this.mutate<{
      job?: QueueJob; discarded: Array<{ jobId: string; error: string }>;
    }>(async (state) => {
      const currentTime = this.now().getTime();
      const discarded: Array<{ jobId: string; error: string }> = [];
      let changed = false;
      // No worker attempt is spent while discovery or an unknown save blocks a queued turn.
      const eligible = state.jobs.filter((job) =>
        identityMatches(job, identity) && this.matchesBranch(job, branch) &&
        !job.snapshot.context.projectDiscoveryPending && !job.uncertainWrite);
      for (const job of eligible) {
        if (job.status === "running") {
          if (!this.runningJobCanBeRecovered(job, currentTime)) continue;
          job.status = "pending";
          job.ownerPid = undefined;
          changed = true;
        }
        if (job.status !== "pending" && job.status !== "paused") continue;
        // A pre-dispatch receipt with no recorded outcome cannot authorize automatic replay,
        // even if the last worker could not persist its cancellation or exhausted its attempts.
        if (interruptedWrite(job)) {
          job.status = "paused";
          job.uncertainWrite = "Earlier save outcome unknown; automatic retry blocked";
          job.lastError = job.uncertainWrite;
          changed = true;
          continue;
        }
        if (job.attempts >= this.maxAttempts) {
          job.status = "failed";
          discarded.push({ jobId: job.id,
            error: job.lastError ?? "Capture attempts exhausted after interrupted processing" });
          changed = true;
          continue;
        }
        this.claimJob(job);
        return { value: { job: await this.hydrateJob(job), discarded } };
      }
      return { value: { discarded }, changed };
    });
    // Report only after failed jobs and source files were removed durably.
    if (result.discarded.length) onDiscarded?.(result.discarded);
    return result.job;
  }

  private matchesBranch(
    job: QueueJob,
    branch: { sessionId: string; branchId: string } | undefined,
  ): boolean {
    return (
      !branch ||
      (job.snapshot.context.sessionId === branch.sessionId &&
        job.snapshot.context.branchId === branch.branchId)
    );
  }

  private runningJobCanBeRecovered(
    job: QueueJob,
    currentTime: number,
  ): boolean {
    const ownerAlive = isProcessAlive(job.ownerPid);
    if (ownerAlive && job.ownerPid !== process.pid) return false;
    const started = job.startedAt ? Date.parse(job.startedAt) : Number.NaN;
    return !(
      ownerAlive &&
      Number.isFinite(started) &&
      currentTime - started < this.staleJobMs
    );
  }

  private claimJob(job: QueueJob): void {
    job.status = "running";
    job.attempts += 1;
    job.startedAt = nowIso(this.now);
    job.ownerPid = process.pid;
    job.updatedAt = job.startedAt;
  }

  /** A durable preparation slice advances context without spending a failure attempt. */
  async releaseProgress(jobId: string): Promise<void> {
    await this.mutate((state) => {
      const job = state.jobs.find((item) => item.id === jobId);
      if (job?.status !== "running") return { value: undefined, changed: false };
      job.status = "pending";
      job.attempts = Math.max(0, job.attempts - 1);
      job.ownerPid = undefined;
      job.updatedAt = nowIso(this.now);
      return { value: undefined };
    });
  }

  /** Lifecycle cancellation releases a claim without consuming a failure attempt. */
  async cancel(
    jobId: string, interruptedModelCall = false, uncertainWrite?: string,
  ): Promise<void> {
    await this.mutate((state) => {
      const job = state.jobs.find((item) => item.id === jobId);
      if (job?.status !== "running") return { value: undefined, changed: false };
      job.status = "paused";
      job.attempts = Math.max(0, job.attempts - 1);
      if (interruptedModelCall) job.callCount = Math.max(0, job.callCount - 1);
      if (uncertainWrite !== undefined) {
        job.uncertainWrite = scrubDiagnostic(uncertainWrite);
        job.lastError = job.uncertainWrite;
      }
      job.ownerPid = undefined;
      job.updatedAt = nowIso(this.now);
      return { value: undefined };
    });
  }

  async checkpoint(jobId: string, patch: QueueCheckpoint): Promise<QueueJob>;
  async checkpoint(
    jobId: string,
    candidateId: string,
    outcome: unknown,
  ): Promise<QueueJob>;
  async checkpoint(
    jobId: string,
    patchOrCandidate: QueueCheckpoint | string,
    outcome?: unknown,
  ): Promise<QueueJob> {
    const patch: QueueCheckpoint =
      typeof patchOrCandidate === "string"
        ? { candidateOutcomes: { [patchOrCandidate]: outcome } }
        : patchOrCandidate;
    return this.mutate(async (state) => {
      const job = state.jobs.find((item) => item.id === jobId);
      if (!job) throw new Error(`Unknown capture job: ${jobId}`);
      if (patch.inspectionEntries) await this.appendInspections(job, patch.inspectionEntries);
      if (patch.compactedConversation) {
        await this.compactJobSnapshot(job, patch.compactedConversation);
      }
      if (patch.status === "complete") await this.recordCompletedCapture(state, job);
      this.applyCheckpointPatch(job, patch);
      if (job.status === "complete" || job.status === "failed") {
        const { conversation: _conversation, sourceConversation: _sources, ...metadata } =
          job.snapshot;
        job.snapshot = { ...metadata, entries: [] };
        this.pruneFailedJobs(state);
        this.releaseTerminalSnapshot(state, job);
        releaseCompletedArtifacts(job);
      }
      return { value: await this.hydrateJob(job) };
    });
  }

  private async compactJobSnapshot(
    job: StoredQueueJob,
    conversation: CompactedConversation,
  ): Promise<void> {
    const compacted = compactCaptureSnapshot((await this.hydrateJob(job)).snapshot, conversation);
    const { entries, conversation: compactedConversation, sourceConversation,
      historySummary, ...metadata } = compacted;
    // Inspections have their own immutable sidecar; do not duplicate them in the base payload.
    const sourceEntries = entries.filter((entry) => !entry.id.startsWith("inspection:"));
    job.snapshotDigest = await this.storeSnapshot({ entries: sourceEntries,
      conversation: compactedConversation, sourceConversation, historySummary });
    job.snapshot = { ...metadata, entries: [] };
  }

  private async recordCompletedCapture(state: QueueState, job: StoredQueueJob): Promise<void> {
    const completedSnapshot = (await this.hydrateJob(job)).snapshot;
    const key = contextKey(job.snapshot.context.sessionId, job.snapshot.context.branchId);
    const watermark = state.watermarks[key];
    const sourceIds = orderedSourceEntryIds(completedSnapshot);
    if (watermark && sourceIds?.includes(completedSnapshot.finalEntryId)) {
      const comparison = cursorComparison({ throughEntryId: completedSnapshot.finalEntryId,
        entryIds: sourceIds }, { throughEntryId: watermark.capturedThroughEntryId,
        entryIds: watermark.consideredEntryIds });
      if (!watermark.capturedThroughEntryId ||
          (comparison !== undefined && comparison > 0)) {
        watermark.capturedThroughEntryId = completedSnapshot.finalEntryId;
      }
      watermark.updatedAt = nowIso(this.now);
    }
    const history = completedSnapshot.historySummary;
    const cursor = summaryCursor(completedSnapshot);
    if (!history || !cursor) return;
    const comparison = watermark ? cursorComparison(cursor, {
      throughEntryId: watermark.historyThroughEntryId,
      entryIds: watermark.historyEntryIds,
    }) : undefined;
    const shouldPublish = watermark && (!watermark.historyDigest ||
      (comparison !== undefined && comparison > 0));
    if (shouldPublish) {
      watermark.historyDigest = await this.storeSnapshot({
        entries: [],
        historySummary: history,
      });
      watermark.historyThroughEntryId = cursor.throughEntryId;
      watermark.historyEntryIds = cursor.entryIds.slice(-2_000);
      watermark.updatedAt = nowIso(this.now);
    }
  }

  private applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint): void {
    if (patch.status) job.status = patch.status;
    if (patch.callCount !== undefined) job.callCount = patch.callCount;
    if (patch.supersession !== undefined) job.supersession = patch.supersession;
    if (patch.extractedCandidates !== undefined) {
      job.extractedCandidates = sanitizeValue(
        jsonSnapshot(patch.extractedCandidates),
      ) as unknown[];
    }
    if (patch.candidateOutcomes) {
      job.candidateOutcomes = {
        ...job.candidateOutcomes,
        ...sanitizeOutcomeMap(jsonSnapshot(patch.candidateOutcomes)),
      };
    }
    if (patch.submissionRejections !== undefined) {
      job.submissionRejections = patch.submissionRejections
        .map(scrubDiagnostic)
        .slice(-3);
    }
    if (patch.lastError !== undefined)
      job.lastError = scrubDiagnostic(patch.lastError);
    if (patch.startedAt !== undefined) job.startedAt = patch.startedAt;
    if (patch.status && patch.status !== "running") job.ownerPid = undefined;
    job.updatedAt = nowIso(this.now);
  }

  async complete(jobId: string): Promise<QueueJob> {
    return this.checkpoint(jobId, { status: "complete" });
  }

  async addConflict(conflict: PendingConflict): Promise<PendingConflict> {
    return this.mutate((state) => {
      this.prune(state);
      const existing = state.conflicts.find((item) => item.id === conflict.id);
      if (existing) return { value: jsonSnapshot(existing), changed: false };
      if (
        state.conflicts.filter((item) => item.status === "pending").length >=
        MAX_PENDING_CONFLICTS
      ) {
        throw new Error(
          "Capture conflict capacity reached; pending receipts are retained",
        );
      }
      const bounded = sanitizeValue({
        ...jsonSnapshot(conflict),
        reason: scrubDiagnostic(conflict.reason),
        evidence: conflict.evidence.slice(0, 8).map(scrubDiagnostic),
        updatedAt: nowIso(this.now),
      }) as PendingConflict;
      state.conflicts.push(bounded);
      return { value: jsonSnapshot(bounded) };
    });
  }

  async getConflict(conflictId: string): Promise<PendingConflict | undefined> {
    const state = await this.readState();
    const conflict = state.conflicts.find((item) => item.id === conflictId);
    return conflict ? jsonSnapshot(conflict) : undefined;
  }

  async pendingConflicts(
    identity?: QueueIdentity,
    sessionId?: string,
    branchId?: string,
  ): Promise<PendingConflict[]> {
    const state = await this.readState();
    return jsonSnapshot(
      state.conflicts.filter(
        (conflict) =>
          conflict.status === "pending" &&
          conflictIdentityMatches(conflict, identity) &&
          (!sessionId || conflict.sessionId === sessionId) &&
          (!branchId || conflict.branchId === branchId),
      ),
    );
  }

  async listPendingConflicts(
    identity?: QueueIdentity,
    sessionId?: string,
    branchId?: string,
  ): Promise<PendingConflict[]> {
    return this.pendingConflicts(identity, sessionId, branchId);
  }

  async updateConflict(
    conflictId: string,
    patch: Partial<PendingConflict>,
  ): Promise<PendingConflict> {
    return this.mutate((state) => {
      const conflict = state.conflicts.find((item) => item.id === conflictId);
      if (!conflict) throw new Error(`Unknown pending conflict: ${conflictId}`);
      Object.assign(conflict, sanitizeValue(jsonSnapshot(patch)), {
        updatedAt: nowIso(this.now),
      });
      if (conflict.status !== "pending") {
        conflict.evidence = conflict.evidence.slice(0, 2).map(scrubDiagnostic);
      }
      return { value: jsonSnapshot(conflict) };
    });
  }

  async withWorkerLock<T>(
    identity: QueueIdentity,
    branch: { sessionId: string; branchId: string },
    operation: () => Promise<T>,
  ): Promise<T | undefined> {
    const workerName = createHash("sha256")
      .update(
        [
          identity.instanceId,
          identity.endpoint ?? "",
          identity.accountId ?? "",
          branch.sessionId,
          branch.branchId,
        ].join("\u0000"),
      )
      .digest("hex")
      .slice(0, 32);
    const workerPath = join(this.directory, `worker-${workerName}.lock`);
    let lock: FileLock;
    try {
      lock = await this.acquireFileLock(workerPath);
    } catch (error) {
      if (error instanceof QueueBusyError) return undefined;
      throw error;
    }
    try {
      return await operation();
    } finally {
      await lock.release();
    }
  }

  async close(): Promise<void> {
    // The queue does not keep file handles open. This method is intentionally present so Pi can
    // dispose an extension instance without needing to know the storage implementation.
  }
}
