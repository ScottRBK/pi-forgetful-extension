import type {
  ForgetfulClient,
  LinkedMemory,
  Memory,
  MemorySearchResult,
  MemoryInput,
  Project,
  ProjectInput,
  SearchRequest,
} from "./contracts.ts";
import { ApiKnowledgeClient, memoryMetadata } from "./http-knowledge.ts";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESPONSE_BYTES = 1_000_000;
const MEMORY_TITLE_MAX = 200;
const MEMORY_CONTENT_MAX = 2_000;
const MEMORY_CONTEXT_MAX = 500;
const MEMORY_LIST_MAX = 10;
const PROJECT_NAME_MAX = 500;
const PROJECT_REPO_MAX = 255;
const PROJECT_DESCRIPTION_MAX = 5_000;

export interface ApiForgetfulClientOptions {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
  maxResponseBytes?: number;
  fetchImpl?: typeof fetch;
}

export class ForgetfulHttpError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ForgetfulHttpError";
    this.status = status;
  }
}

export class ForgetfulSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForgetfulSchemaError";
  }
}

export class ForgetfulTimeoutError extends Error {
  constructor(message = "Forgetful request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export class ForgetfulAbortError extends Error {
  constructor(message = "Forgetful request aborted") {
    super(message);
    this.name = "AbortError";
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be a non-empty string`,
    );
  }
  return value;
}

function projectText(value: string, field: string, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new TypeError(
      `Forgetful project ${field} must contain 1–${max} characters`,
    );
  }
  return value.trim();
}

function projectRepository(value: string): string {
  const repo = projectText(value, "repository", PROJECT_REPO_MAX);
  if (!/^[^/\s]+\/[^/\s]+$/.test(repo)) {
    throw new TypeError(
      "Forgetful project repository must use owner/repo format",
    );
  }
  return repo;
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be a string`,
    );
  }
  return value;
}

function requiredInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be a positive integer`,
    );
  }
  return value;
}

function nonNegativeInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be a non-negative integer`,
    );
  }
  return value;
}

function integerArray(value: unknown, field: string): number[] {
  if (
    !Array.isArray(value) ||
    value.some(
      (item) =>
        typeof item !== "number" || !Number.isSafeInteger(item) || item <= 0,
    )
  ) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be an array of positive integers`,
    );
  }
  return [...value] as number[];
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${field} must be an array of strings`,
    );
  }
  return [...value] as string[];
}

function parseMemory(value: unknown, where: string): Memory {
  if (!isObject(value))
    throw new ForgetfulSchemaError(`${where} must be an object`);

  const id = requiredInteger(value.id, `${where}.id`);
  const title = requiredString(value.title, `${where}.title`);
  const content = requiredString(value.content, `${where}.content`);
  const context = requiredString(value.context, `${where}.context`);
  const keywords = stringArray(value.keywords, `${where}.keywords`);
  const tags = stringArray(value.tags, `${where}.tags`);
  if (
    title.length > MEMORY_TITLE_MAX ||
    content.length > MEMORY_CONTENT_MAX ||
    context.length > MEMORY_CONTEXT_MAX
  ) {
    throw new ForgetfulSchemaError(
      `${where} contains an overlong memory field`,
    );
  }
  if (keywords.length > MEMORY_LIST_MAX || tags.length > MEMORY_LIST_MAX) {
    throw new ForgetfulSchemaError(
      `${where} contains too many keywords or tags`,
    );
  }
  const projectIds = integerArray(value.project_ids, `${where}.project_ids`);
  if (typeof value.is_obsolete !== "boolean") {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${where}.is_obsolete must be boolean`,
    );
  }

  if (value.linked_memory_ids !== undefined) {
    integerArray(value.linked_memory_ids, `${where}.linked_memory_ids`);
  }
  if (value.superseded_by !== undefined && value.superseded_by !== null) {
    requiredInteger(value.superseded_by, `${where}.superseded_by`);
  }
  if (value.access_count !== undefined) {
    nonNegativeInteger(value.access_count, `${where}.access_count`);
  }
  if (value.last_accessed_at !== undefined && value.last_accessed_at !== null) {
    optionalString(value.last_accessed_at, `${where}.last_accessed_at`);
  }
  optionalString(value.updated_at, `${where}.updated_at`);
  memoryMetadata(value);

  return {
    ...value,
    id,
    title,
    content,
    context,
    keywords,
    tags,
    project_ids: projectIds,
    is_obsolete: value.is_obsolete,
  } as Memory;
}

function parseProject(value: unknown, where: string): Project {
  if (!isObject(value))
    throw new ForgetfulSchemaError(`${where} must be an object`);
  const project: Project = {
    id: requiredInteger(value.id, `${where}.id`),
    name: requiredString(value.name, `${where}.name`),
  };
  if (project.name.length > PROJECT_NAME_MAX) {
    throw new ForgetfulSchemaError(
      `Forgetful response field ${where}.name is too long`,
    );
  }
  if (value.repo_name !== undefined && value.repo_name !== null) {
    project.repo_name = optionalString(value.repo_name, `${where}.repo_name`);
    if (project.repo_name && project.repo_name.length > PROJECT_REPO_MAX) {
      throw new ForgetfulSchemaError(
        `Forgetful response field ${where}.repo_name is too long`,
      );
    }
  }
  if (value.description !== undefined && value.description !== null) {
    project.description = optionalString(
      value.description,
      `${where}.description`,
    );
    if (
      project.description &&
      project.description.length > PROJECT_DESCRIPTION_MAX
    ) {
      throw new ForgetfulSchemaError(
        `Forgetful response field ${where}.description is too long`,
      );
    }
  }
  return project;
}

function parseJson(text: string, where: string): unknown {
  if (text.length === 0) {
    throw new ForgetfulSchemaError(`Forgetful response for ${where} was empty`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ForgetfulSchemaError(
      `Forgetful response for ${where} was not valid JSON`,
    );
  }
}

function localHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[(.*)\]$/, "$1");
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "0.0.0.0"
  );
}

function trimTrailingSlashes(pathname: string): string {
  let end = pathname.length;
  while (end > 0 && pathname[end - 1] === "/") end -= 1;
  return pathname.slice(0, end);
}

function makeAbortError(): ForgetfulAbortError {
  return new ForgetfulAbortError();
}

function validatedSearchOptions(request: SearchRequest): {
  k: number;
  maxLinks: number;
} {
  if (typeof request.query !== "string" || request.query.length === 0) {
    throw new TypeError("Forgetful search query must be a non-empty string");
  }
  if (
    typeof request.query_context !== "string" ||
    request.query_context.length === 0
  ) {
    throw new TypeError(
      "Forgetful search query_context must be a non-empty string",
    );
  }
  if (typeof request.strict_project_filter !== "boolean") {
    throw new TypeError(
      "Forgetful search strict_project_filter must be boolean",
    );
  }
  const k = request.k ?? 3;
  if (!Number.isSafeInteger(k) || k < 1 || k > 20) {
    throw new TypeError("Forgetful search k must be an integer from 1 to 20");
  }
  const requestedMaxLinks = request.max_links_per_primary ?? request.max_links;
  const maxLinks = requestedMaxLinks ?? 0;
  if (!Number.isSafeInteger(maxLinks) || maxLinks < 0 || maxLinks > 10) {
    throw new TypeError(
      "Forgetful search max_links_per_primary must be an integer from 0 to 10",
    );
  }
  return { k, maxLinks };
}

function addSearchProjectFilter(
  body: Record<string, unknown>,
  request: SearchRequest,
): void {
  if (request.project_ids === undefined) return;
  if (
    !Array.isArray(request.project_ids) ||
    request.project_ids.length === 0 ||
    request.project_ids.length > 20 ||
    request.project_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
  ) {
    throw new TypeError(
      "Forgetful search project_ids must be a bounded array of positive integers",
    );
  }
  body.project_ids = request.project_ids;
}

function searchBody(request: SearchRequest): Record<string, unknown> {
  const { k, maxLinks } = validatedSearchOptions(request);
  const body: Record<string, unknown> = {
    query: request.query,
    query_context: request.query_context,
    strict_project_filter: request.strict_project_filter,
    k,
    include_links: request.include_links ? 1 : 0,
    max_links_per_primary: maxLinks,
  };
  addSearchProjectFilter(body, request);
  if (request.strict_project_filter && request.project_ids === undefined) {
    throw new TypeError("Forgetful strict project search requires project_ids");
  }
  return body;
}

function uniqueMemories(memories: Memory[]): Memory[] {
  const unique = new Map<number, Memory>();
  for (const memory of memories) unique.set(memory.id, memory);
  return [...unique.values()];
}

function parseLinkedMemories(value: unknown): LinkedMemory[] {
  const linkedMemories: LinkedMemory[] = [];
  if (value !== undefined && !Array.isArray(value)) {
    throw new ForgetfulSchemaError(
      "Forgetful search response.linked_memories must be an array",
    );
  }
  const rawLinked: unknown[] = Array.isArray(value)
    ? value
    : [];
  for (let index = 0; index < rawLinked.length; index += 1) {
    const link = rawLinked[index];
    if (!isObject(link) || !isObject(link.memory)) {
      throw new ForgetfulSchemaError(
        `search.linked_memories[${index}] must contain a memory object`,
      );
    }
    linkedMemories.push({
      memory: parseMemory(link.memory, `search.linked_memories[${index}].memory`),
      link_source_id: requiredInteger(
        link.link_source_id,
        `search.linked_memories[${index}].link_source_id`,
      ),
    });
  }
  return linkedMemories;
}

function parseSearchPayload(
  payload: unknown,
  fallbackQuery?: string,
  requireMetadata = false,
): MemorySearchResult {
  if (!isObject(payload) || !Array.isArray(payload.primary_memories)) {
    throw new ForgetfulSchemaError(
      "Forgetful search response.primary_memories must be an array",
    );
  }
  const primaryMemories = payload.primary_memories.map((item, index) =>
    parseMemory(item, `search.primary_memories[${index}]`),
  );
  const linkedMemories = parseLinkedMemories(payload.linked_memories);
  if (requireMetadata && payload.query === undefined)
    throw new ForgetfulSchemaError("Forgetful search response.query is required");
  if (requireMetadata && payload.total_count === undefined)
    throw new ForgetfulSchemaError("Forgetful search response.total_count is required");
  if (requireMetadata && payload.token_count === undefined)
    throw new ForgetfulSchemaError("Forgetful search response.token_count is required");
  if (requireMetadata && payload.truncated === undefined)
    throw new ForgetfulSchemaError("Forgetful search response.truncated is required");
  const query = payload.query === undefined
    ? (fallbackQuery ?? "")
    : requiredString(payload.query, "search.query");
  const totalCount = payload.total_count === undefined
    ? primaryMemories.length + linkedMemories.length
    : nonNegativeInteger(payload.total_count, "search.total_count");
  const tokenCount = payload.token_count === undefined
    ? 0
    : nonNegativeInteger(payload.token_count, "search.token_count");
  const truncated = payload.truncated === undefined ? false : payload.truncated;
  if (typeof truncated !== "boolean") {
    throw new ForgetfulSchemaError("Forgetful response field search.truncated must be boolean");
  }
  return {
    query,
    primary_memories: primaryMemories,
    linked_memories: linkedMemories,
    total_count: totalCount,
    token_count: tokenCount,
    truncated,
  };
}

function flattenSearchResult(result: MemorySearchResult): Memory[] {
  const memories = [
    ...result.primary_memories,
    ...result.linked_memories.map((item) => item.memory),
  ];
  return uniqueMemories(memories);
}

/** The sole HTTP-aware adapter for the transport-neutral ForgetfulClient port. */
export class ApiForgetfulClient implements ForgetfulClient {
  readonly knowledge = new ApiKnowledgeClient(
    (...args) => this.request(...args),
    (value) => parseMemory(value, "updateMemory"),
  );
  private readonly baseUrl: URL;
  private readonly token?: string;
  private readonly timeoutMs: number;
  private readonly maxResponseBytes: number;
  private readonly maxFileResponseBytes: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiForgetfulClientOptions) {
    let url: URL;
    try {
      url = new URL(options.baseUrl);
    } catch {
      throw new TypeError("Forgetful baseUrl must be an absolute URL");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new TypeError("Forgetful baseUrl must use http or https");
    }
    if (url.username || url.password) {
      throw new TypeError("Forgetful baseUrl must not contain credentials");
    }
    if (url.search || url.hash) {
      throw new TypeError(
        "Forgetful baseUrl must not contain a query or fragment",
      );
    }
    if (url.protocol === "http:" && !localHost(url.hostname)) {
      throw new TypeError("TLS is required for a non-local Forgetful endpoint");
    }
    if (
      options.timeoutMs !== undefined &&
      (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)
    ) {
      throw new TypeError("Forgetful timeoutMs must be a positive number");
    }
    if (
      options.maxResponseBytes !== undefined &&
      (!Number.isSafeInteger(options.maxResponseBytes) ||
        options.maxResponseBytes <= 0)
    ) {
      throw new TypeError(
        "Forgetful maxResponseBytes must be a positive integer",
      );
    }

    url.pathname = trimTrailingSlashes(url.pathname);
    this.baseUrl = url;
    this.token = options.token;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxResponseBytes =
      options.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
    this.maxFileResponseBytes = options.maxResponseBytes ?? 14_000_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async search(
    request: SearchRequest,
    signal?: AbortSignal,
  ): Promise<Memory[]> {
    const payload = await this.request(
      "/memories/search",
      "POST",
      searchBody(request),
      signal,
      [200],
    );
    return flattenSearchResult(parseSearchPayload(payload, request.query));
  }

  async queryMemory(
    request: SearchRequest,
    signal?: AbortSignal,
  ): Promise<MemorySearchResult> {
    const payload = await this.request(
      "/memories/search",
      "POST",
      searchBody({
        ...request,
        k: request.k ?? 3,
        include_links: request.include_links ?? true,
        max_links_per_primary: request.max_links_per_primary ?? request.max_links ?? 5,
      }),
      signal,
      [200],
    );
    return parseSearchPayload(payload, request.query, true);
  }

  async listProjects(
    repoName?: string,
    signal?: AbortSignal,
  ): Promise<Project[]> {
    const path = new URL(this.endpoint("/projects"));
    if (repoName !== undefined) path.searchParams.set("repo_name", repoName);
    const payload = await this.request(path, "GET", undefined, signal, [200]);
    if (!isObject(payload) || !Array.isArray(payload.projects)) {
      throw new ForgetfulSchemaError(
        "Forgetful projects response.projects must be an array",
      );
    }
    return payload.projects.map((item, index) =>
      parseProject(item, `projects[${index}]`),
    );
  }

  async createProject(
    input: ProjectInput,
    signal?: AbortSignal,
  ): Promise<Project> {
    const body = {
      name: projectText(input.name, "name", PROJECT_NAME_MAX),
      description: projectText(
        input.description,
        "description",
        PROJECT_DESCRIPTION_MAX,
      ),
      repo_name: projectRepository(input.repo_name),
      project_type: "development",
    };
    const payload = await this.request(
      "/projects",
      "POST",
      body,
      signal,
      [201],
    );
    return parseProject(payload, "createProject");
  }

  async linkProject(
    id: number,
    repoName: string,
    signal?: AbortSignal,
  ): Promise<Project> {
    const payload = await this.request(
      `/projects/${this.validId(id)}`,
      "PUT",
      { repo_name: projectRepository(repoName) },
      signal,
      [200],
    );
    return parseProject(payload, "linkProject");
  }

  async create(
    input: MemoryInput,
    signal?: AbortSignal,
  ): Promise<{ id: number }> {
    const payload = await this.request(
      "/memories",
      "POST",
      this.createBody(input),
      signal,
      [200, 201],
    );
    if (!isObject(payload)) {
      throw new ForgetfulSchemaError(
        "Forgetful create response must be an object",
      );
    }
    return { id: requiredInteger(payload.id, "create.id") };
  }

  async get(id: number, signal?: AbortSignal): Promise<Memory> {
    const memoryId = this.validId(id);
    const payload = await this.request(
      `/memories/${memoryId}`,
      "GET",
      undefined,
      signal,
      [200],
    );
    return parseMemory(payload, "get");
  }

  async supersede(
    id: number,
    replacementId: number,
    reason: string,
    signal?: AbortSignal,
  ): Promise<void> {
    const memoryId = this.validId(id);
    const replacement = this.validId(replacementId);
    if (typeof reason !== "string" || reason.trim().length === 0) {
      throw new TypeError(
        "Forgetful supersede reason must be a non-empty string",
      );
    }
    const payload = await this.request(
      `/memories/${memoryId}`,
      "DELETE",
      { reason, superseded_by: replacement },
      signal,
      [200],
    );
    if (!isObject(payload) || payload.success !== true) {
      throw new ForgetfulSchemaError(
        "Forgetful supersede response.success must be true",
      );
    }
  }

  private createBody(input: MemoryInput): Record<string, unknown> {
    if (!input || typeof input !== "object") {
      throw new TypeError("Forgetful memory input must be an object");
    }
    if (typeof input.title !== "string" || input.title.length === 0) {
      throw new TypeError("Memory title is required");
    }
    if (input.title.length > MEMORY_TITLE_MAX) {
      throw new TypeError("Memory title is too long");
    }
    if (typeof input.content !== "string" || input.content.length === 0) {
      throw new TypeError("Memory content is required");
    }
    if (input.content.length > MEMORY_CONTENT_MAX) {
      throw new TypeError("Memory content is too long");
    }
    if (typeof input.context !== "string") {
      throw new TypeError("Memory context is required");
    }
    if (input.context.length > MEMORY_CONTEXT_MAX) {
      throw new TypeError("Memory context is too long");
    }
    if (
      !Array.isArray(input.keywords) ||
      !Array.isArray(input.tags) ||
      input.keywords.length > MEMORY_LIST_MAX ||
      input.tags.length > MEMORY_LIST_MAX ||
      input.keywords.some((item) => typeof item !== "string") ||
      input.tags.some((item) => typeof item !== "string")
    ) {
      throw new TypeError(
        "Memory keywords and tags must be bounded string arrays",
      );
    }
    if (
      !Array.isArray(input.project_ids) ||
      input.project_ids.length === 0 ||
      input.project_ids.length > 20 ||
      input.project_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
    ) {
      throw new TypeError(
        "Memory project_ids must be a bounded array of positive integers",
      );
    }
    const body: Record<string, unknown> = {
      ...memoryMetadata(input as unknown as Record<string, unknown>),
      title: input.title,
      content: input.content,
      context: input.context,
      keywords: input.keywords,
      tags: input.tags,
      project_ids: input.project_ids,
    };
    if (input.importance !== undefined) {
      if (!Number.isInteger(input.importance) || input.importance < 1 || input.importance > 10)
        throw new TypeError("Memory importance must be an integer from 1 to 10");
      body.importance = input.importance;
    }
    return body;
  }

  private validId(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new TypeError("Forgetful memory id must be a positive integer");
    }
    return id;
  }

  private endpoint(path: string): string {
    return `${this.baseUrl.toString().replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  private responseByteLimit(method: string, url: URL): number {
    return method === "GET" && /\/files\/[1-9]\d*$/.test(url.pathname)
      ? this.maxFileResponseBytes : this.maxResponseBytes;
  }

  private async request(
    pathOrUrl: string | URL,
    method: string,
    body: Record<string, unknown> | undefined,
    callerSignal: AbortSignal | undefined,
    expectedStatuses: number[],
  ): Promise<unknown> {
    const url =
      typeof pathOrUrl === "string"
        ? new URL(this.endpoint(pathOrUrl))
        : pathOrUrl;
    const controller = new AbortController();
    let timedOut = false;
    let callerAborted = false;
    const onAbort = () => {
      callerAborted = true;
      controller.abort();
    };
    if (callerSignal?.aborted) throw makeAbortError();
    callerSignal?.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeoutMs);

    try {
      const headers: Record<string, string> = { accept: "application/json" };
      if (body !== undefined) headers["content-type"] = "application/json";
      if (this.token) headers.authorization = `Bearer ${this.token}`;
      const response = await this.fetchImpl(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
        redirect: "error",
      });
      const maxBytes = this.responseByteLimit(method, url);
      const text = await this.readResponse(response, controller.signal, maxBytes);
      if (!expectedStatuses.includes(response.status)) {
        throw new ForgetfulHttpError(
          `Forgetful ${method} ${url.pathname} returned HTTP ${response.status}`,
          response.status,
        );
      }
      if (callerAborted || callerSignal?.aborted) throw makeAbortError();
      if (timedOut) throw new ForgetfulTimeoutError();
      return parseJson(text, `${method} ${url.pathname}`);
    } catch (error) {
      if (timedOut) throw new ForgetfulTimeoutError();
      if (callerAborted || callerSignal?.aborted) throw makeAbortError();
      if (
        error instanceof ForgetfulHttpError ||
        error instanceof ForgetfulSchemaError ||
        error instanceof ForgetfulTimeoutError ||
        error instanceof ForgetfulAbortError
      ) {
        throw error;
      }
      throw new ForgetfulHttpError(`Forgetful ${method} request failed`);
    } finally {
      clearTimeout(timer);
      callerSignal?.removeEventListener("abort", onAbort);
    }
  }

  private async readResponse(
    response: Response,
    signal: AbortSignal,
    maxBytes: number,
  ): Promise<string> {
    const contentLength = response.headers.get("content-length");
    if (
      contentLength !== null &&
      Number(contentLength) > maxBytes
    ) {
      throw new ForgetfulSchemaError(
        "Forgetful response exceeded the configured size limit",
      );
    }
    if (!response.body) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > maxBytes) {
        throw new ForgetfulSchemaError(
          "Forgetful response exceeded the configured size limit",
        );
      }
      return new TextDecoder().decode(bytes);
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          throw new ForgetfulSchemaError(
            "Forgetful response exceeded the configured size limit",
          );
        }
        chunks.push(next.value);
      }
    } catch (error) {
      if (signal.aborted) throw error;
      throw error;
    }
    const merged = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return new TextDecoder().decode(merged);
  }
}
