import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import { constants } from "node:fs";
import { open, realpath, stat } from "node:fs/promises";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import { BlockList, isIP } from "node:net";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";
import { Type, type Static } from "typebox";
import { Value } from "typebox/value";
import { sanitizeText, sanitizeValue } from "./privacy.ts";

export interface SourceInspectorOptions {
  cwd: string;
  /** Repository identity supplied by the trusted caller; never inferred from source text. */
  repoName?: string;
  canRead?: () => boolean;
}

const paging = {
  offset: Type.Optional(Type.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER })),
};

/** Exactly one source; paging counts UTF-16 code units in the complete sanitized text. */
export const SOURCE_INSPECTION_PARAMETERS = Type.Object({
  path: Type.Optional(Type.String({ minLength: 1 })),
  url: Type.Optional(Type.String({ minLength: 1 })),
  ...paging,
}, { additionalProperties: false, oneOf: [{ required: ["path"] }, { required: ["url"] }] });
export type SourceInspectionRequest = Pick<
  Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit"
> & ({ path: string; url?: never } | { url: string; path?: never });

export interface SourceInspectionError {
  name: string;
  message: string;
  code?: string;
}

export type SourceInspectionResult = {
  status: "ok";
  identifier: string;
  content: string;
  observedAt: string;
  /** SHA-256 of the complete observed source bytes, before sanitizing or paging. */
  contentHash: string;
  sanitized: boolean;
  page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string;
  source_files?: string[];
  source_url?: string;
  encoding_version?: string;
  /** Describes the observed file bytes, not the repository/index as a whole. */
  fileState?: "committed" | "modified" | "uncommitted" | "unknown";
  provenanceError?: SourceInspectionError;
  httpStatus?: number;
} | {
  status: "error";
  observedAt: string;
  error: SourceInspectionError;
  source_url?: string;
  httpStatus?: number;
  httpStatusText?: string;
  body?: string;
};

const execute = promisify(execFile);

const blockedV4 = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
  ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24],
  ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) blockedV4.addSubnet(address, prefix);
const publicV6 = new BlockList();
publicV6.addSubnet("2000::", 3, "ipv6");
const blockedV6 = new BlockList();
blockedV6.addSubnet("2001::", 23, "ipv6");
blockedV6.addSubnet("2001:db8::", 32, "ipv6");
blockedV6.addSubnet("2002::", 16, "ipv6");

function loopback(host: string): boolean {
  return host === "localhost" || host === "::1" || (isIP(host) === 4 && host.startsWith("127."));
}

function validateUrl(url: URL): string {
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Source URLs must use HTTP or HTTPS.");
  if (url.username || url.password || sanitizeText(url.href) !== url.href ||
      [...url.searchParams].some(([key, value]) =>
        /^(?:auth|authorization|credentials?|signature|sig|awsaccesskeyid)$/i.test(key) ||
        /^x-(?:amz|goog)-(?:credential|signature)$/i.test(key) ||
        (sanitizeValue({ [key]: value }) as Record<string, unknown>)[key] !== value))
    throw new Error("Credential-bearing source URLs are not permitted.");
  url.hash = "";
  return url.hostname.replace(/^\[|\]$/g, "");
}

function validateAddress(address: string, allowLoopback: boolean): void {
  if (allowLoopback && loopback(address)) return;
  const family = isIP(address);
  const publicAddress = family === 4 ? !blockedV4.check(address) : family === 6 &&
    publicV6.check(address, "ipv6") && !blockedV6.check(address, "ipv6");
  if (!publicAddress)
    throw new Error(`Private or reserved source address is not allowed: ${address}`);
}

function errorDetails(error: unknown): SourceInspectionError {
  return error instanceof Error ? {
    name: error.name,
    message: sanitizeText(error.message),
    ...("code" in error ? { code: String(error.code) } : {}),
  } : { name: "Error", message: sanitizeText(String(error)) };
}

function sourceContent(bytes: Buffer, request: SourceInspectionRequest) {
  const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  if (text.includes("\0")) throw new Error("Source is not UTF-8 text: contains NUL bytes.");
  const safe = sanitizeText(text);
  const offset = request.offset ?? 0;
  const endOffset = request.limit === undefined ? undefined : offset + request.limit;
  const content = safe.slice(offset, endOffset);
  const end = offset + content.length;
  return {
    content, contentHash: createHash("sha256").update(bytes).digest("hex"),
    sanitized: safe !== text,
    page: {
      offset, totalCharacters: safe.length,
      ...(end < safe.length ? { nextOffset: end } : {}),
    },
  };
}

function requireInside(cwd: string, path: string): void {
  const name = relative(cwd, path);
  if (name === ".." || name.startsWith(`..${sep}`) || isAbsolute(name))
    throw new Error("Source path is outside the trusted repository directory.");
}

/**
 * Capture-only UTF-8 reader; no tool registration or memory writes. File checks require Linux/WSL.
 * The caller supplies current capture scope/trust via canRead and any deadline via AbortSignal.
 * External Git metadata (including linked worktrees) yields unknown commit provenance.
 */
export class SourceInspector {
  private root?: { path: string; dev: number; ino: number };

  constructor(private readonly options: SourceInspectorOptions) {}

  async inspect(input: unknown, signal?: AbortSignal): Promise<SourceInspectionResult> {
    try {
      this.check(signal);
      if (!Value.Check(SOURCE_INSPECTION_PARAMETERS, input)) {
        const error = new Error("Supply one path or URL and optional integer offset/limit.");
        error.name = "InvalidSourceRequest";
        throw error;
      }
      const request = input as SourceInspectionRequest;
      if (request.url !== undefined) return await this.inspectUrl(request, signal);
      const cwd = await realpath(this.options.cwd);
      this.check(signal);
      const directory = await stat(cwd);
      this.check(signal);
      this.root ??= { path: cwd, dev: directory.dev, ino: directory.ino };
      if (cwd !== this.root.path || directory.dev !== this.root.dev ||
          directory.ino !== this.root.ino) throw new Error("Trusted source directory changed.");
      requireInside(cwd, resolve(cwd, request.path));
      const path = await realpath(resolve(cwd, request.path));
      this.check(signal);
      requireInside(cwd, path);
      const identifier = relative(cwd, path);
      const bytes = await this.readFile(cwd, path, signal);
      const observedAt = new Date().toISOString();
      const provenance = await this.provenance(cwd, identifier, bytes, signal);
      this.check(signal);
      return sanitizeValue({
        status: "ok", identifier, observedAt, ...sourceContent(bytes, request),
        ...(this.options.repoName ? { source_repo: this.options.repoName } : {}),
        source_files: [identifier],
        ...provenance,
      }) as SourceInspectionResult;
    } catch (error) {
      return { status: "error", observedAt: new Date().toISOString(),
        error: errorDetails(signal?.aborted ? signal.reason : error) };
    }
  }

  private async inspectUrl(
    request: SourceInspectionRequest & { url: string },
    signal?: AbortSignal,
  ): Promise<SourceInspectionResult> {
    let url = new URL(request.url);
    const initial = new URL(url);
    const allowLoopback = loopback(validateUrl(initial));
    for (let redirects = 0; ; redirects++) {
      this.check(signal);
      validateUrl(url);
      const localOrigin = allowLoopback && url.origin === initial.origin;
      const response = await this.getUrl(url, localOrigin, signal);
      this.check(signal);
      if ([301, 302, 303, 307, 308].includes(response.status) && response.location) {
        if (redirects === 5) throw new Error("Source URL exceeded five redirects.");
        url = new URL(response.location, url);
        continue;
      }
      if (response.status < 200 || response.status >= 300) return {
        status: "error", observedAt: new Date().toISOString(), source_url: sanitizeText(url.href),
        httpStatus: response.status, httpStatusText: sanitizeText(response.statusText),
        body: sanitizeText(response.bytes.toString("utf8")),
        error: { name: "HttpError", message: sanitizeText(response.statusText) },
      };
      return sanitizeValue({
        status: "ok", identifier: url.href, source_url: url.href,
        observedAt: new Date().toISOString(), httpStatus: response.status,
        ...sourceContent(response.bytes, request),
      }) as SourceInspectionResult;
    }
  }

  private async getUrl(url: URL, allowLoopback: boolean, signal?: AbortSignal): Promise<{
    bytes: Buffer; status: number; statusText: string; location?: string;
  }> {
    this.check(signal);
    const host = validateUrl(url);
    const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] :
      await lookup(host, { all: true, verbatim: true });
    this.check(signal);
    if (!addresses.length) throw new Error("Source hostname resolved to no addresses.");
    for (const entry of addresses) validateAddress(entry.address, allowLoopback);
    // Pin the validated DNS result to the connection; do not resolve it a second time.
    const address = addresses[0];
    return new Promise((resolve, reject) => {
      const get = url.protocol === "https:" ? httpsGet : httpGet;
      this.check(signal);
      const request = get(url, {
        signal, agent: false, family: address.family,
        lookup: (_host, _options, callback) => callback(null, address.address, address.family),
      }, async response => {
        try {
          this.check(signal);
          const chunks: Buffer[] = [];
          for await (const chunk of response) {
            this.check(signal);
            chunks.push(Buffer.from(chunk));
          }
          this.check(signal);
          resolve({ bytes: Buffer.concat(chunks), status: response.statusCode!,
            statusText: response.statusMessage ?? "", location: response.headers.location });
        } catch (error) {
          response.destroy();
          reject(error);
        }
      });
      request.once("error", reject);
    });
  }

  private check(signal?: AbortSignal): void {
    signal?.throwIfAborted();
    if (this.options.canRead && !this.options.canRead())
      throw new Error("Source reading is disabled or trust was revoked.");
  }

  private async readFile(cwd: string, path: string, signal?: AbortSignal): Promise<Buffer> {
    this.check(signal);
    const flags = constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK;
    const handle = await open(path, flags);
    try {
      this.check(signal);
      const before = await handle.stat();
      this.check(signal);
      if (!before.isFile()) throw new Error("Source must be a regular file.");
      // Linux/WSL descriptor resolution catches parent-symlink swaps before reading any bytes.
      // Platforms without /proc fail closed instead of weakening the containment boundary.
      requireInside(cwd, await realpath(`/proc/self/fd/${handle.fd}`));
      this.check(signal);
      const bytes = await handle.readFile({ signal });
      this.check(signal);
      requireInside(cwd, await realpath(`/proc/self/fd/${handle.fd}`));
      this.check(signal);
      const after = await handle.stat();
      this.check(signal);
      if (before.size !== after.size || before.mtimeMs !== after.mtimeMs ||
          before.ctimeMs !== after.ctimeMs) throw new Error("Source changed while being read.");
      return bytes;
    } finally {
      await handle.close();
    }
  }

  private async provenance(cwd: string, path: string, bytes: Buffer, signal?: AbortSignal) {
    try {
      const head = (await this.git(cwd, ["rev-parse", "--verify", "HEAD"], signal)).trim();
      const tree = await this.git(cwd, ["ls-tree", "-z", head, "--", path], signal);
      const blob = tree.match(/^100(?:644|755) blob ([a-f0-9]+)\t/);
      // Hash raw bytes with Git's blob framing, never working-tree filters or the status cache.
      const hash = createHash(head.length === 64 ? "sha256" : "sha1")
        .update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
      return blob?.[1] === hash
        ? { encoding_version: head, fileState: "committed" as const }
        : { fileState: blob ? "modified" as const : "uncommitted" as const };
    } catch (error) {
      return { fileState: "unknown" as const, provenanceError: errorDetails(error) };
    }
  }

  private async git(cwd: string, args: string[], signal?: AbortSignal): Promise<string> {
    this.check(signal);
    const gitDir = await realpath(resolve(cwd, ".git"));
    this.check(signal);
    requireInside(cwd, gitDir);
    const metadata = await stat(gitDir);
    this.check(signal);
    if (!metadata.isDirectory())
      throw new Error("Git metadata must be a directory inside the trusted source directory.");
    const result = await execute("git", ["--no-optional-locks", "--no-replace-objects",
      "-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
      "-C", cwd, `--git-dir=${gitDir}`, `--work-tree=${cwd}`, ...args], {
      signal, shell: false,
      env: {
        PATH: process.env.PATH,
        GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null",
        GIT_OPTIONAL_LOCKS: "0", GIT_LITERAL_PATHSPECS: "1", GIT_NO_LAZY_FETCH: "1",
        GIT_ALLOW_PROTOCOL: "",
      },
    });
    this.check(signal);
    return result.stdout;
  }
}
