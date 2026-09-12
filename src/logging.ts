import { randomUUID } from "node:crypto";
import { appendFile, lstat, mkdir, readdir, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import { sanitizeValue } from "./privacy.ts";

const DEFAULT_FILE_BYTES = 5 * 1024 * 1024;
const DEFAULT_EVENT_BYTES = 256 * 1024;
const MAX_PENDING_BYTES = 1024 * 1024;
const MAX_DIRECTORY_FILES = 60;
const MAX_DIRECTORY_BYTES = 100 * 1024 * 1024;
// Only files whose local writer has permanently closed and finished its I/O are retired.
const retiredFiles = new Set<string>();
const AUTH_HEADER_PATTERN = new RegExp(
  String.raw`(["']?\b(?:authorization|proxy-authorization|cookie|set-cookie)["']?\s*[:=]\s*)` +
    String.raw`(?:"[^"\n]*"|'[^'\n]*'|[^\r\n,}]+)`,
  "gi",
);

function processExited(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "ESRCH";
  }
}

async function listLogFiles(directory: string) {
  const files = [];
  for (const name of await readdir(directory)) {
    const match = /^forgetful-([1-9]\d*)-[a-f0-9-]{36}\.jsonl(?:\.\d+)?$/.exec(name);
    if (!match) continue;
    const path = join(directory, name);
    try {
      const stat = await lstat(path);
      if (stat.isFile()) {
        files.push({ path, pid: Number(match[1]), modified: stat.mtimeMs, bytes: stat.size });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return files;
}

/** Preserve active/unknown writers; known closed local writers are safe to prune. */
async function pruneDirectory(directory: string, current: () => boolean): Promise<void> {
  const files = await listLogFiles(directory);
  let count = files.length;
  let bytes = files.reduce((total, file) => total + file.bytes, 0);
  for (const file of files.toSorted((a, b) => a.modified - b.modified)) {
    if (!current() || (count <= MAX_DIRECTORY_FILES && bytes <= MAX_DIRECTORY_BYTES)) break;
    if (!retiredFiles.has(file.path) && !processExited(file.pid)) continue;
    await rm(file.path, { force: true });
    retiredFiles.delete(file.path);
    count--;
    bytes -= file.bytes;
  }
}

function limit(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

function excludeCredentials(value: unknown): unknown {
  if (typeof value === "string") {
    // SDK message bodies can contain pasted headers or JSON encoded as text.
    return value.replace(AUTH_HEADER_PATTERN, '$1"[redacted]"');
  }
  // Never let JSON.stringify execute a caller's toJSON after filtering.
  if (typeof value === "function") return undefined;
  if (Array.isArray(value)) return value.map(excludeCredentials);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !/auth|headers?|cookies?|credentials?/i.test(key))
      .map(([key, item]) => [key, excludeCredentials(item)]));
  }
  return value;
}

export type FileLogLevel = "off" | "info" | "debug";

export interface DiagnosticLogger {
  emit(level: "info" | "debug", event: string, data?: Record<string, unknown>): void;
  flush(): Promise<void>;
}

/**
 * JSONL diagnostics for a local project directory. Defaults: 5 MiB/file, 3 files/writer,
 * 256 KiB/event (including newline), and 1 MiB of pending encoded data. Overflow is dropped.
 * Oversized events retain bounded correlation IDs and set truncated:true; bodies are omitted.
 * Limits too small for the envelope drop the event. Invalid limits use the defaults.
 * Startup/rotation prunes closed local and exited-process logs toward 100 MiB/60 files.
 * Active/unknown writers are protected, so limits are soft. Unrelated files are never included.
 * I/O failure disables this writer; malformed events are skipped. onError fires at most once.
 */
export class FileLogger implements DiagnosticLogger {
  readonly filePath: string;
  private level: FileLogLevel;
  private pending = Promise.resolve();
  private generation = 0;
  private failed = false;
  private closed = false;
  private warned = false;
  private readonly maxEventBytes: number;
  private readonly maxFileBytes: number;
  private readonly maxFiles: number;
  private fileBytes = 0;
  private fileCount = 0;
  private pendingBytes = 0;

  constructor(private readonly options: {
    directory: string;
    sessionId: string;
    level: FileLogLevel;
    onError?: (error: unknown) => void;
    maxFileBytes?: number;
    maxFiles?: number;
    maxEventBytes?: number;
  }) {
    this.level = options.level;
    this.maxFileBytes = limit(options.maxFileBytes, DEFAULT_FILE_BYTES);
    this.maxFiles = limit(options.maxFiles, 3);
    this.maxEventBytes = Math.min(
      limit(options.maxEventBytes, DEFAULT_EVENT_BYTES),
      this.maxFileBytes,
    );
    this.filePath = join(options.directory, `forgetful-${process.pid}-${randomUUID()}.jsonl`);
  }

  setLevel(level: FileLogLevel): void {
    if (this.closed) return;
    if (level === "off") this.generation++;
    this.level = level;
  }

  emit(level: "info" | "debug", event: string, data?: Record<string, unknown>): void {
    if (this.closed || this.failed || this.level === "off") return;
    if (level === "debug" && this.level !== "debug") return;
    try {
      this.enqueue(level, event, data);
    } catch (error) {
      this.warn(error);
    }
  }

  private enqueue(level: "info" | "debug", event: string, data?: Record<string, unknown>): void {
    const row = sanitizeValue(excludeCredentials({
      timestamp: new Date().toISOString(), level, event, sessionId: this.options.sessionId, data,
    })) as Record<string, unknown>;
    let line = JSON.stringify(row) + "\n";
    if (Buffer.byteLength(line) > this.maxEventBytes) {
      const detail = row.data as Record<string, unknown> | undefined;
      row.data = Object.fromEntries(
        ["jobId", "branchId", "candidateId", "purpose", "attempt", "model"]
          .filter(key => typeof detail?.[key] === "number" ||
            (typeof detail?.[key] === "string" && detail[key].length <= 200))
          .map(key => [key, detail![key]]),
      );
      row.truncated = true;
      line = JSON.stringify(row) + "\n";
      if (Buffer.byteLength(line) > this.maxEventBytes) {
        delete row.data;
        line = JSON.stringify(row) + "\n";
      }
      for (const field of ["event", "sessionId"]) {
        if (Buffer.byteLength(line) <= this.maxEventBytes) break;
        row[field] = "[truncated]";
        line = JSON.stringify(row) + "\n";
      }
      if (Buffer.byteLength(line) > this.maxEventBytes) {
        throw new Error("Log byte limit cannot fit an event envelope");
      }
    }
    const bytes = Buffer.byteLength(line);
    if (this.pendingBytes + bytes > MAX_PENDING_BYTES) {
      this.warn(new Error("Log pending queue is full; event dropped"));
      return;
    }
    this.pendingBytes += bytes;
    const generation = this.generation;
    this.pending = this.pending.then(async () => {
      if (generation !== this.generation) return;
      await mkdir(this.options.directory, { recursive: true });
      if (generation !== this.generation) return;
      const rotate = this.fileBytes + bytes > this.maxFileBytes;
      const prune = this.fileCount === 0 || rotate;
      if (rotate) await this.rotate();
      if (generation !== this.generation) return;
      await appendFile(this.filePath, line, "utf8");
      this.fileBytes += bytes;
      this.fileCount = Math.max(1, this.fileCount);
      if (prune) await pruneDirectory(this.options.directory, () => generation === this.generation);
    }).catch(error => {
      this.failed = true;
      this.generation++;
      this.warn(error);
    }).finally(() => {
      this.pendingBytes -= bytes;
    });
  }

  private async rotate(): Promise<void> {
    const path = (index: number) => index === 0 ? this.filePath : `${this.filePath}.${index}`;
    if (this.fileCount === this.maxFiles) await rm(path(this.maxFiles - 1));
    for (let index = Math.min(this.fileCount, this.maxFiles - 1); index > 0; index--) {
      await rename(path(index - 1), path(index));
    }
    this.fileCount = Math.min(this.fileCount + 1, this.maxFiles);
    this.fileBytes = 0;
  }

  private warn(error: unknown): void {
    if (this.warned) return;
    this.warned = true;
    try {
      Promise.resolve(this.options.onError?.(error)).catch(() => {});
    } catch { /* Diagnostics must not interrupt work. */ }
  }

  /** Permanently stop this runtime's writer; never retire files with outstanding I/O. */
  async close(): Promise<void> {
    if (!this.closed) {
      this.closed = true;
      void this.pending.then(() => {
        for (let index = 0; index < this.fileCount; index++) {
          retiredFiles.add(index === 0 ? this.filePath : `${this.filePath}.${index}`);
        }
      });
    }
    await this.flush();
  }

  /**
   * Wait for work accepted before this call. Off discards queued events, even if re-enabled.
   * An in-progress operation may finish later. Never hold a Pi control for more than 500 ms.
   */
  async flush(): Promise<void> {
    if (this.failed) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.pending,
        new Promise<void>(resolve => {
          timer = setTimeout(() => {
            this.failed = true;
            this.generation++;
            this.warn(new Error("File logging flush timed out; writer disabled"));
            resolve();
          }, 500);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
}
