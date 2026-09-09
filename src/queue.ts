import { createHash, randomUUID } from "node:crypto";
import {
  chmod,
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
} from "node:fs/promises";
import { dirname, join } from "node:path";

import type {
  CaptureSnapshot,
  EvidenceEntry,
  WorkContext,
} from "./contracts.ts";
import { sanitizeText, sanitizeValue } from "./privacy.ts";

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
  lastEntryId?: string;
  consideredEntryIds: string[];
  snapshotIds: string[];
  dedupeKeys: string[];
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
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  ownerPid?: number;
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
  resolution?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface QueueEnqueueResult {
  queued: boolean;
  jobId: string;
  reason?: string;
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
  lastError?: string;
  startedAt?: string;
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

interface QueueState {
  version: 1;
  jobs: QueueJob[];
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
const MAX_QUEUE_BYTES = 5 * 1024 * 1024;
const MAX_PENDING_CONFLICTS = 100;
const processMutationTails = new Map<string, Promise<void>>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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

function normaliseState(value: unknown): QueueState {
  if (!value || typeof value !== "object")
    throw new Error("Invalid queue state");
  const record = value as Partial<QueueState>;
  if (
    record.version !== 1 ||
    !Array.isArray(record.jobs) ||
    !Array.isArray(record.conflicts) ||
    !record.watermarks ||
    typeof record.watermarks !== "object"
  ) {
    throw new Error("Invalid queue state");
  }
  return {
    version: 1,
    jobs: Array.isArray(record.jobs) ? (record.jobs as QueueJob[]) : [],
    conflicts: Array.isArray(record.conflicts)
      ? (record.conflicts as PendingConflict[])
      : [],
    watermarks:
      record.watermarks && typeof record.watermarks === "object"
        ? (record.watermarks as Record<string, QueueWatermark>)
        : {},
  };
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

  constructor(options: DurableQueueStoreOptions | string = {}) {
    const resolved =
      typeof options === "string" ? { filePath: options } : options;
    this.filePath =
      resolved.filePath ??
      join(resolved.directory ?? ".pi/forgetful", "queue.json");
    this.directory = resolved.directory ?? dirname(this.filePath);
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
    await chmod(this.directory, 0o700);
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
        return { version: 1, jobs: [], conflicts: [], watermarks: {} };
      }
      throw error;
    }
  }

  private async writeState(state: QueueState): Promise<void> {
    await this.ensureDirectory();
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
        const result = await operation(state);
        if (result.changed !== false) await this.writeState(state);
        return result.value;
      });
    } finally {
      release();
      if (processMutationTails.get(this.lockPath) === current)
        processMutationTails.delete(this.lockPath);
    }
  }

  private prune(state: QueueState): void {
    const cutoff = this.now().getTime();
    state.jobs = state.jobs.filter(
      (job) =>
        job.status === "pending" ||
        job.status === "running" ||
        job.status === "paused" ||
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
    const safeSnapshot = sanitizeValue(snapshot) as CaptureSnapshot;
    const identity: QueueIdentity = {
      instanceId: safeSnapshot.instanceId,
      endpoint: this.endpoint,
      accountId: this.accountId,
    };
    const key = dedupeKey(safeSnapshot);
    const id = jobIdFor(key);
    return this.mutate<QueueEnqueueResult>((state) => {
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
      const timestamp = nowIso(this.now);
      const job: QueueJob = {
        id,
        dedupeKey: key,
        binding: identity,
        snapshot: clone(safeSnapshot),
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
      return { value: { queued: true, jobId: id } };
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
      return { value: clone(this.updateWatermark(state, value)) };
    });
  }

  async getWatermark(
    sessionId: string,
    branchId: string,
  ): Promise<QueueWatermark> {
    const state = await this.readState();
    return clone(
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

  async currentWatermark(
    context: Pick<WorkContext, "sessionId" | "branchId">,
  ): Promise<QueueWatermark> {
    return this.getWatermark(context.sessionId, context.branchId);
  }

  async listPending(
    identity: QueueIdentity = this.defaultIdentity(),
  ): Promise<QueueJob[]> {
    const state = await this.readState();
    return clone(
      state.jobs.filter(
        (job) =>
          identityMatches(job, identity) &&
          ["pending", "running", "paused"].includes(job.status),
      ),
    );
  }

  async listJobs(identity?: QueueIdentity): Promise<QueueJob[]> {
    const state = await this.readState();
    return clone(
      identity
        ? state.jobs.filter((job) => identityMatches(job, identity))
        : state.jobs,
    );
  }

  async getJob(jobId: string): Promise<QueueJob | undefined> {
    const state = await this.readState();
    const job = state.jobs.find((item) => item.id === jobId);
    return job ? clone(job) : undefined;
  }

  async claimNext(
    identity: QueueIdentity = this.defaultIdentity(),
    branch?: { sessionId: string; branchId: string },
  ): Promise<QueueJob | undefined> {
    return this.mutate((state) => {
      const currentTime = this.now().getTime();
      let changed = false;
      for (const job of state.jobs) {
        if (!identityMatches(job, identity)) continue;
        if (!this.matchesBranch(job, branch)) continue;
        if (job.status === "running") {
          if (!this.runningJobCanBeRecovered(job, currentTime)) continue;
          job.status = "pending";
          job.ownerPid = undefined;
          changed = true;
        }
        if (job.status !== "pending" && job.status !== "paused") continue;
        if (job.attempts >= this.maxAttempts) {
          this.failExhaustedJob(job);
          changed = true;
          continue;
        }
        this.claimJob(job);
        return { value: clone(job) };
      }
      return { value: undefined, changed };
    });
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

  private failExhaustedJob(job: QueueJob): void {
    job.status = "failed";
    job.lastError = "retry limit reached";
    job.snapshot = { ...job.snapshot, entries: [] as EvidenceEntry[] };
    job.updatedAt = nowIso(this.now);
  }

  private claimJob(job: QueueJob): void {
    job.status = "running";
    job.attempts += 1;
    job.startedAt = nowIso(this.now);
    job.ownerPid = process.pid;
    job.updatedAt = job.startedAt;
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
    return this.mutate((state) => {
      const job = state.jobs.find((item) => item.id === jobId);
      if (!job) throw new Error(`Unknown capture job: ${jobId}`);
      if (patch.status) job.status = patch.status;
      if (patch.callCount !== undefined) job.callCount = patch.callCount;
      if (patch.extractedCandidates !== undefined) {
        job.extractedCandidates = sanitizeValue(
          clone(patch.extractedCandidates),
        ) as unknown[];
      }
      if (patch.candidateOutcomes) {
        job.candidateOutcomes = {
          ...job.candidateOutcomes,
          ...sanitizeOutcomeMap(clone(patch.candidateOutcomes)),
        };
      }
      if (patch.lastError !== undefined)
        job.lastError = scrubDiagnostic(patch.lastError);
      if (patch.startedAt !== undefined) job.startedAt = patch.startedAt;
      if (patch.status && patch.status !== "running") job.ownerPid = undefined;
      job.updatedAt = nowIso(this.now);
      if (job.status === "complete" || job.status === "failed") {
        job.snapshot = { ...job.snapshot, entries: [] as EvidenceEntry[] };
      }
      return { value: clone(job) };
    });
  }

  async complete(jobId: string): Promise<QueueJob> {
    return this.checkpoint(jobId, { status: "complete" });
  }

  async addConflict(conflict: PendingConflict): Promise<PendingConflict> {
    return this.mutate((state) => {
      this.prune(state);
      const existing = state.conflicts.find((item) => item.id === conflict.id);
      if (existing) return { value: clone(existing), changed: false };
      if (
        state.conflicts.filter((item) => item.status === "pending").length >=
        MAX_PENDING_CONFLICTS
      ) {
        throw new Error(
          "Capture conflict capacity reached; pending receipts are retained",
        );
      }
      const bounded = sanitizeValue({
        ...clone(conflict),
        reason: scrubDiagnostic(conflict.reason),
        evidence: conflict.evidence.slice(0, 8).map(scrubDiagnostic),
        updatedAt: nowIso(this.now),
      }) as PendingConflict;
      state.conflicts.push(bounded);
      return { value: clone(bounded) };
    });
  }

  async getConflict(conflictId: string): Promise<PendingConflict | undefined> {
    const state = await this.readState();
    const conflict = state.conflicts.find((item) => item.id === conflictId);
    return conflict ? clone(conflict) : undefined;
  }

  async pendingConflicts(
    identity?: QueueIdentity,
    sessionId?: string,
    branchId?: string,
  ): Promise<PendingConflict[]> {
    const state = await this.readState();
    return clone(
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
      Object.assign(conflict, sanitizeValue(clone(patch)), {
        updatedAt: nowIso(this.now),
      });
      if (conflict.status !== "pending") {
        conflict.evidence = conflict.evidence.slice(0, 2).map(scrubDiagnostic);
      }
      return { value: clone(conflict) };
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
    try {
      return await this.withFileLock(workerPath, operation);
    } catch (error) {
      if (error instanceof QueueBusyError) return undefined;
      throw error;
    }
  }

  async close(): Promise<void> {
    // The queue does not keep file handles open. This method is intentionally present so Pi can
    // dispose an extension instance without needing to know the storage implementation.
  }
}
