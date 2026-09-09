import { Type } from "typebox";
import type {
  CodeArtifact,
  CodeArtifactInput,
  Document,
  DocumentInput,
  Entity,
  EntityInput,
  EntityRelationshipInput,
  EntityType,
  ForgetfulClient,
  KnowledgeClient,
  Memory,
  MemoryInput,
  Scope,
  StoredFile,
} from "./contracts.ts";
import { hasSensitiveData } from "./privacy.ts";

export interface KnowledgeToolContext {
  cwd: string;
  repoName?: string;
  commit?: string;
  project?: { id: number; name: string };
  scope: Scope;
}

export type ToolText = { type: "text"; text: string };
export type ToolImage = { type: "image"; data: string; mimeType: string };
export interface KnowledgeToolResult {
  content: Array<ToolText | ToolImage>;
  details: Record<string, unknown>;
  file?: StoredFile;
}

const positiveId = Type.Integer({ minimum: 1 });
const operation = Type.Union([
  Type.Literal("list_projects"),
  Type.Literal("search_memories"),
  Type.Literal("get_memory"),
  Type.Literal("search_entities"),
  Type.Literal("get_entity"),
  Type.Literal("get_entity_memories"),
  Type.Literal("get_relationships"),
  Type.Literal("list_documents"),
  Type.Literal("get_document"),
  Type.Literal("list_code_artifacts"),
  Type.Literal("get_code_artifact"),
  Type.Literal("list_files"),
  Type.Literal("get_file"),
]);
const writeOperation = Type.Union([
  Type.Literal("create_memory"),
  Type.Literal("update_memory"),
  Type.Literal("supersede_memory"),
  Type.Literal("link_memories"),
  Type.Literal("create_entity"),
  Type.Literal("update_entity"),
  Type.Literal("link_entity_memory"),
  Type.Literal("create_relationship"),
  Type.Literal("create_document"),
  Type.Literal("update_document"),
  Type.Literal("create_code_artifact"),
  Type.Literal("update_code_artifact"),
]);
const strings = Type.Array(Type.String({ maxLength: 500 }), { maxItems: 10 });
const ids = Type.Array(positiveId, { maxItems: 100 });
const DEFAULT_RECORD_LIMIT = 50;
const MAX_RECORD_LIMIT = 100;
const DEFAULT_CONTENT_LIMIT = 4_000;
const MAX_LIST_RESULT_CHARS = 16_000;

/** Keep this root schema as an object; some providers reject a root anyOf/oneOf. */
export const KNOWLEDGE_READ_PARAMETERS = Type.Object({
  operation,
  repo_name: Type.Optional(Type.String({ maxLength: 300 })),
  query: Type.Optional(Type.String({ minLength: 1, maxLength: 240 })),
  query_context: Type.Optional(Type.String({ maxLength: 500 })),
  project_id: Type.Optional(positiveId),
  memory_id: Type.Optional(positiveId),
  entity_id: Type.Optional(positiveId),
  document_id: Type.Optional(positiveId),
  code_artifact_id: Type.Optional(positiveId),
  file_id: Type.Optional(positiveId),
  k: Type.Optional(Type.Integer({ minimum: 1, maximum: 20 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 5_000 })),
  offset: Type.Optional(Type.Integer({ minimum: 0, maximum: 10_000_000 })),
  include_links: Type.Optional(Type.Boolean()),
});

export const KNOWLEDGE_WRITE_PARAMETERS = Type.Object({
  operation: writeOperation,
  memory_id: Type.Optional(positiveId),
  replacement_memory_id: Type.Optional(positiveId),
  entity_id: Type.Optional(positiveId),
  source_entity_id: Type.Optional(positiveId),
  target_entity_id: Type.Optional(positiveId),
  document_id: Type.Optional(positiveId),
  code_artifact_id: Type.Optional(positiveId),
  related_memory_ids: Type.Optional(ids),
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 500 })),
  content: Type.Optional(Type.String({ minLength: 1, maxLength: 100_000 })),
  context: Type.Optional(Type.String({ minLength: 1, maxLength: 500 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 5_000 })),
  code: Type.Optional(Type.String({ minLength: 1, maxLength: 50_000 })),
  language: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  document_type: Type.Optional(Type.String({ maxLength: 100 })),
  entity_type: Type.Optional(Type.String({ maxLength: 30 })),
  custom_type: Type.Optional(Type.String({ maxLength: 100 })),
  notes: Type.Optional(Type.String({ maxLength: 4_000 })),
  relationship_type: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  reason: Type.Optional(Type.String({ minLength: 1, maxLength: 1_000 })),
  keywords: Type.Optional(strings),
  tags: Type.Optional(strings),
  aka: Type.Optional(strings),
  source_files: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 1_000 }), {
    maxItems: 100,
  })),
  encoding_version: Type.Optional(
    Type.String({ minLength: 7, maxLength: 50, pattern: "^[a-fA-F0-9]+$" }),
  ),
  document_ids: Type.Optional(ids),
  code_artifact_ids: Type.Optional(ids),
  file_ids: Type.Optional(ids),
  importance: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
});

export type KnowledgeReadRequest = Record<string, unknown> & { operation: string };
export type KnowledgeWriteRequest = Record<string, unknown> & { operation: string };

const READ_OPS = new Set([
  "list_projects", "search_memories", "get_memory", "search_entities", "get_entity",
  "get_entity_memories", "get_relationships", "list_documents", "get_document",
  "list_code_artifacts", "get_code_artifact", "list_files", "get_file",
]);
const WRITE_OPS = new Set([
  "create_memory", "update_memory", "supersede_memory", "link_memories", "create_entity",
  "update_entity", "link_entity_memory", "create_relationship", "create_document",
  "update_document", "create_code_artifact", "update_code_artifact",
]);
const ENTITY_TYPES = new Set(["Organization", "Individual", "Team", "Device", "System", "Other"]);

function isEntityType(value: unknown): value is EntityType {
  return typeof value === "string" && ENTITY_TYPES.has(value);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function requiredText(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`${field} is required and bounded.`);
  return value;
}

function optionalText(value: unknown, field: string, max: number): string | undefined {
  return value === undefined ? undefined : requiredText(value, field, max);
}

function requiredId(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 1)
    throw new Error(`${field} must be a positive integer.`);
  return Number(value);
}

function optionalId(value: unknown, field: string): number | undefined {
  return value === undefined ? undefined : requiredId(value, field);
}

function boundedId(value: unknown, field: string, maximum: number): number | undefined {
  const result = optionalId(value, field);
  if (result !== undefined && result > maximum)
    throw new Error(`${field} must be at most ${maximum}.`);
  return result;
}

function requiredIds(value: unknown, field: string): number[] {
  if (!Array.isArray(value) || value.length > 100 || value.length === 0)
    throw new Error(`${field} must contain one to 100 IDs.`);
  return value.map((item) => requiredId(item, field));
}

function optionalIds(value: unknown, field: string): number[] | undefined {
  return value === undefined ? undefined : requiredIds(value, field);
}

function requiredStrings(
  value: unknown,
  field: string,
  maxItems = 100,
  maxLength = 500,
): string[] {
  if (!Array.isArray(value) || value.length > maxItems)
    throw new Error(`${field} must be a bounded string array.`);
  return value.map((item) => requiredText(item, field, maxLength));
}

function optionalStrings(
  value: unknown,
  field: string,
  maxItems = 100,
  maxLength = 500,
): string[] | undefined {
  return value === undefined ? undefined : requiredStrings(value, field, maxItems, maxLength);
}

function optionalImportance(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isSafeInteger(value) || Number(value) < 1 || Number(value) > 10)
    throw new Error("importance must be an integer from 1 to 10.");
  return Number(value);
}

function commit(value: unknown): string | undefined {
  const result = optionalText(value, "encoding_version", 50);
  if (result !== undefined && !/^[a-fA-F0-9]{7,50}$/.test(result))
    throw new Error("encoding_version must be a Git commit SHA.");
  return result;
}

function checkOperation(value: unknown, choices: Set<string>): string {
  if (typeof value !== "string" || !choices.has(value))
    throw new Error("Unknown Forgetful knowledge operation.");
  return value;
}

function containsSensitiveData(value: unknown): boolean {
  if (typeof value === "string") return hasSensitiveData(value);
  if (Array.isArray(value)) return value.some(containsSensitiveData);
  if (value && typeof value === "object")
    return Object.values(value).some(containsSensitiveData);
  return false;
}

function rejectSensitiveInput(value: unknown): void {
  if (containsSensitiveData(value))
    throw new Error("Knowledge writes cannot contain sensitive data.");
}

function need(input: Record<string, unknown>, fields: Array<[string, number]>): void {
  for (const [field, max] of fields) requiredText(input[field], field, max);
}

/** Provider validation is intentionally repeated here for callers that bypass Pi's schema. */
export function validateKnowledgeReadRequest(value: unknown): KnowledgeReadRequest {
  const input = record(value, "Knowledge read arguments");
  const op = checkOperation(input.operation, READ_OPS);
  if (op === "list_projects") optionalText(input.repo_name, "repo_name", 300);
  if (op === "search_memories" || op === "search_entities") {
    requiredText(input.query, "query", 240);
    optionalText(input.query_context, "query_context", 500);
    optionalId(input.project_id, "project_id");
    boundedId(input.k, "k", 20);
    boundedId(input.limit, "limit", op === "search_entities" ? 100 : 20);
  }
  if (op === "get_memory") requiredId(input.memory_id, "memory_id");
  if (["get_entity", "get_entity_memories", "get_relationships"].includes(op))
    requiredId(input.entity_id, "entity_id");
  if (op === "get_document") requiredId(input.document_id, "document_id");
  if (op === "get_code_artifact") requiredId(input.code_artifact_id, "code_artifact_id");
  if (op === "get_file") requiredId(input.file_id, "file_id");
  if (["list_documents", "list_code_artifacts", "list_files"].includes(op)) {
    optionalId(input.project_id, "project_id");
    boundedId(input.limit, "limit", 100);
  }
  if (["list_projects", "get_entity_memories", "get_relationships"].includes(op))
    boundedId(input.limit, "limit", 100);
  if (input.offset !== undefined &&
      (!Number.isSafeInteger(input.offset) || Number(input.offset) < 0 ||
        Number(input.offset) > 10_000_000))
    throw new Error("offset must be a non-negative integer.");
  if (input.limit !== undefined &&
      op !== "search_memories" && op !== "search_entities" &&
      !["list_projects", "get_entity_memories", "get_relationships",
        "list_documents", "list_code_artifacts", "list_files"].includes(op))
    boundedId(input.limit, "limit", 5_000);
  return input as KnowledgeReadRequest;
}

export function validateKnowledgeWriteRequest(value: unknown): KnowledgeWriteRequest {
  const input = record(value, "Knowledge write arguments");
  const op = checkOperation(input.operation, WRITE_OPS);
  switch (op) {
    case "create_memory":
      need(input, [["title", 200], ["content", 2_000], ["context", 500]]);
      requiredStrings(input.keywords, "keywords", 10);
      requiredStrings(input.tags, "tags", 10);
      break;
    case "update_memory":
      requiredId(input.memory_id, "memory_id");
      optionalText(input.title, "title", 200);
      optionalText(input.content, "content", 2_000);
      optionalText(input.context, "context", 500);
      optionalImportance(input.importance);
      break;
    case "supersede_memory":
      requiredId(input.memory_id, "memory_id");
      if (input.replacement_memory_id === undefined && input.content === undefined)
        throw new Error("supersede_memory needs replacement_memory_id or content.");
      optionalId(input.replacement_memory_id, "replacement_memory_id");
      requiredText(input.reason, "reason", 1_000);
      optionalText(input.title, "title", 200);
      optionalText(input.content, "content", 2_000);
      optionalText(input.context, "context", 500);
      optionalImportance(input.importance);
      if (requiredStrings(input.source_files, "source_files", 100, 1_000).length === 0)
        throw new Error("source_files is required for supersession.");
      break;
    case "link_memories":
      requiredId(input.memory_id, "memory_id");
      requiredIds(input.related_memory_ids, "related_memory_ids");
      break;
    case "create_entity":
      need(input, [["name", 200], ["entity_type", 30]]);
      if (!isEntityType(input.entity_type)) throw new Error("entity_type is invalid.");
      optionalText(input.custom_type, "custom_type", 100);
      optionalText(input.notes, "notes", 4_000);
      if (input.entity_type === "Other" && input.custom_type === undefined)
        throw new Error("Other entities require custom_type.");
      break;
    case "update_entity":
      requiredId(input.entity_id, "entity_id");
      optionalText(input.name, "name", 200);
      if (input.entity_type !== undefined && !isEntityType(input.entity_type))
        throw new Error("entity_type is invalid.");
      optionalText(input.custom_type, "custom_type", 100);
      optionalText(input.notes, "notes", 4_000);
      break;
    case "link_entity_memory":
      requiredId(input.entity_id, "entity_id");
      requiredId(input.memory_id, "memory_id");
      break;
    case "create_relationship":
      requiredId(input.source_entity_id, "source_entity_id");
      requiredId(input.target_entity_id, "target_entity_id");
      requiredText(input.relationship_type, "relationship_type", 100);
      break;
    case "create_document":
      need(input, [["title", 500], ["description", 5_000], ["content", 100_000]]);
      optionalText(input.document_type, "document_type", 100);
      break;
    case "update_document":
      requiredId(input.document_id, "document_id");
      optionalText(input.title, "title", 500);
      optionalText(input.description, "description", 5_000);
      optionalText(input.content, "content", 100_000);
      optionalText(input.document_type, "document_type", 100);
      break;
    case "create_code_artifact":
      need(input, [["title", 500], ["description", 5_000], ["code", 50_000], ["language", 100]]);
      break;
    case "update_code_artifact":
      requiredId(input.code_artifact_id, "code_artifact_id");
      optionalText(input.title, "title", 500);
      optionalText(input.description, "description", 5_000);
      optionalText(input.code, "code", 50_000);
      optionalText(input.language, "language", 100);
      break;
  }
  optionalStrings(input.source_files, "source_files", 100, 1_000);
  optionalStrings(input.keywords, "keywords", 10);
  optionalStrings(input.tags, "tags", 10);
  optionalStrings(input.aka, "aka", 10);
  optionalIds(input.document_ids, "document_ids");
  optionalIds(input.code_artifact_ids, "code_artifact_ids");
  optionalIds(input.file_ids, "file_ids");
  optionalImportance(input.importance);
  commit(input.encoding_version);
  return input as KnowledgeWriteRequest;
}

function rich(client: ForgetfulClient): KnowledgeClient {
  if (!client.knowledge) throw new Error("Rich Forgetful knowledge is unavailable.");
  return client.knowledge;
}

function currentProject(context: KnowledgeToolContext, requested?: number): number {
  if (!context.project) throw new Error("A verified current Forgetful project is required.");
  if (requested !== undefined && requested !== context.project.id)
    throw new Error("Knowledge operations must stay inside the current project.");
  return context.project.id;
}

function inMemoryProject(memory: Memory, projectId: number): boolean {
  return memory.project_ids.includes(projectId);
}

function inEntityProject(entity: Entity, projectId: number): boolean {
  return entity.project_ids.includes(projectId);
}

function json(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? "null";
}

function page(
  value: Document | CodeArtifact,
  field: "content" | "code",
  offset?: number,
  limit?: number,
): unknown {
  const start = offset ?? 0;
  const textValue = field === "content"
    ? (value as Document).content
    : (value as CodeArtifact).code;
  const requested = limit ?? DEFAULT_CONTENT_LIMIT;
  const end = Math.min(textValue.length, start + requested);
  return {
    ...value,
    [field]: textValue.slice(start, end),
    offset: start,
    limit: requested,
    total_length: textValue.length,
    truncated: end < textValue.length,
  };
}

function listPage<T>(
  values: T[],
  offset?: number,
  limit?: number,
): { items: T[]; offset: number; limit: number; total: number; truncated: boolean } {
  const start = offset ?? 0;
  const requested = Math.min(limit ?? DEFAULT_RECORD_LIMIT, MAX_RECORD_LIMIT);
  const items = values.slice(start, start + requested);
  return {
    items,
    offset: start,
    limit: requested,
    total: values.length,
    truncated: start + items.length < values.length,
  };
}

function boundedListPage<T>(
  values: T[],
  offset?: number,
  limit?: number,
): { items: unknown[]; offset: number; limit: number; total: number;
  truncated: boolean; next_offset: number } {
  const result = listPage(values, offset, limit);
  let items = result.items.map((item) => compactWriteValue(item));
  while (items.length > 1 && json({ items }).length > MAX_LIST_RESULT_CHARS)
    items = items.slice(0, -1);
  const nextOffset = result.offset + items.length;
  return {
    ...result,
    items,
    truncated: result.truncated || nextOffset < result.total,
    next_offset: nextOffset,
  };
}

function fileContent(
  file: StoredFile,
  offset?: number,
  limit?: number,
): { content: Array<ToolText | ToolImage>; kind: string } {
  const mime = file.mime_type.toLowerCase();
  const metadata = {
    id: file.id, filename: file.filename, mime_type: file.mime_type,
    size_bytes: file.size_bytes, project_id: file.project_id,
  };
  if (/^image\/(png|jpeg|gif|webp)$/.test(mime)) {
    return {
      kind: "image",
      content: [
        { type: "text", text: json(metadata) },
        { type: "image", data: file.data, mimeType: file.mime_type },
      ],
    };
  }
  if (mime.startsWith("text/") || /json|xml|javascript|typescript|yaml|toml|markdown/.test(mime)) {
    const decoded = Buffer.from(file.data, "base64").toString("utf8");
    const start = offset ?? 0;
    const requested = limit ?? DEFAULT_CONTENT_LIMIT;
    const chunk = decoded.slice(start, start + requested);
    return {
      kind: "text",
      content: [{
        type: "text",
        text: json({ ...metadata, text: chunk, offset: start, limit: requested,
          total_length: decoded.length, truncated: start + chunk.length < decoded.length }),
      }],
    };
  }
  return {
    kind: "binary",
    content: [{ type: "text", text: json({ ...metadata, binary: true }) }],
  };
}

function readResult(value: unknown, details: Record<string, unknown>): KnowledgeToolResult {
  return { content: [{ type: "text", text: json(value) }], details };
}

async function assertReadMemory(
  client: ForgetfulClient,
  id: number,
  context: KnowledgeToolContext,
  signal?: AbortSignal,
): Promise<Memory> {
  const value = await client.get(id, signal);
  if (context.scope === "project" && !inMemoryProject(value, currentProject(context)))
    throw new Error("The memory is outside the current project.");
  return value;
}

async function assertReadEntity(
  knowledge: KnowledgeClient,
  id: number,
  context: KnowledgeToolContext,
  signal?: AbortSignal,
): Promise<Entity> {
  const value = await knowledge.getEntity(id, signal);
  if (context.scope === "project" && !inEntityProject(value, currentProject(context)))
    throw new Error("The entity is outside the current project.");
  return value;
}

interface KnowledgeReadContext {
  client: ForgetfulClient;
  knowledge?: KnowledgeClient;
  request: KnowledgeReadRequest;
  context: KnowledgeToolContext;
  projectId?: number;
  signal?: AbortSignal;
}

function requireReadKnowledge(read: KnowledgeReadContext): KnowledgeClient {
  if (!read.knowledge) throw new Error("Rich Forgetful knowledge is unavailable.");
  return read.knowledge;
}

function requestedReadProject(read: KnowledgeReadContext): number | undefined {
  const requested = read.request.project_id as number | undefined;
  return read.context.scope === "project"
    ? currentProject(read.context, requested)
    : requested;
}

async function readProjects(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const repoName = read.request.repo_name as string | undefined;
  if (read.context.scope === "project" && repoName && repoName !== read.context.repoName)
    throw new Error("Project reads must stay inside the current repository.");
  let projects = await read.client.listProjects(repoName ?? read.context.repoName, read.signal);
  if (read.projectId !== undefined)
    projects = projects.filter((item) => item.id === read.projectId);
  const result = boundedListPage(
    projects,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, count: result.items.length });
}

async function readMemories(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const requestedProject = requestedReadProject(read);
  let values = await read.client.search({
    query: read.request.query as string,
    query_context: (read.request.query_context as string | undefined) ??
      "Foreground knowledge read",
    strict_project_filter: read.context.scope === "project" || requestedProject !== undefined,
    ...(requestedProject === undefined ? {} : { project_ids: [requestedProject] }),
    k: (read.request.k as number | undefined) ?? 10,
    include_links: (read.request.include_links as boolean | undefined) ?? true,
  }, read.signal);
  if (requestedProject !== undefined)
    values = values.filter((item) => inMemoryProject(item, requestedProject));
  return readResult(values, { operation: read.request.operation, count: values.length });
}

async function readMemory(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const value = await assertReadMemory(
    read.client, read.request.memory_id as number, read.context, read.signal,
  );
  return readResult(value, { operation: read.request.operation, id: value.id });
}

async function readEntities(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const requestedLimit = (read.request.limit as number | undefined) ?? 10;
  const requestedOffset = (read.request.offset as number | undefined) ?? 0;
  const searchLimit = MAX_RECORD_LIMIT;
  const knowledge = requireReadKnowledge(read);
  let values = await knowledge.searchEntities(
    read.request.query as string, searchLimit, read.signal,
  );
  const backendCount = values.length;
  values = await hydrateEntities(knowledge, values.slice(0, searchLimit), read.signal);
  const entityProjectId = requestedReadProject(read);
  if (entityProjectId !== undefined)
    values = values.filter((item) => inEntityProject(item, entityProjectId));
  const result = boundedListPage(values, requestedOffset, requestedLimit);
  const searchWindowComplete = backendCount < searchLimit;
  return readResult({
    ...result,
    search_window: searchLimit,
    search_window_complete: searchWindowComplete,
    has_more: result.truncated || !searchWindowComplete,
  }, {
    operation: read.request.operation,
    count: result.items.length,
    search_window: searchLimit,
    search_window_complete: searchWindowComplete,
  });
}

async function readEntity(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const value = await assertReadEntity(
    requireReadKnowledge(read), read.request.entity_id as number, read.context, read.signal,
  );
  return readResult(value, { operation: read.request.operation, id: value.id });
}

async function readEntityMemories(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const knowledge = requireReadKnowledge(read);
  await assertReadEntity(knowledge, read.request.entity_id as number, read.context, read.signal);
  const linked = await knowledge.getEntityMemories(read.request.entity_id as number, read.signal);
  const linkedPage = listPage(
    linked,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  const checked = await Promise.all(linkedPage.items.map(async (item) => {
    try {
      const memory = await assertReadMemory(read.client, item.id, read.context, read.signal);
      return memory.is_obsolete ? undefined : item;
    } catch {
      return undefined;
    }
  }));
  const values = checked.filter(
    (item): item is { id: number; title: string } => item !== undefined,
  );
  const nextOffset = linkedPage.offset + linkedPage.items.length;
  const hasMore = nextOffset < linked.length;
  return readResult({
    offset: linkedPage.offset,
    limit: linkedPage.limit,
    items: values.map((item) => compactWriteValue(item)),
    next_offset: nextOffset,
    has_more: hasMore,
    truncated: hasMore,
  }, {
    operation: read.request.operation, count: values.length,
  });
}

async function readRelationships(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const knowledge = requireReadKnowledge(read);
  const entity = await assertReadEntity(
    knowledge, read.request.entity_id as number, read.context, read.signal,
  );
  const relationships = await knowledge.getRelationships(entity.id, read.signal);
  const relationshipPage = listPage(
    relationships,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  const endpointIds = [...new Set(relationshipPage.items.flatMap((item) => [
    item.source_entity_id, item.target_entity_id,
  ]))].slice(0, MAX_RECORD_LIMIT * 2);
  const endpoints = await Promise.all(endpointIds.map(async (id) => {
    try {
      return await assertReadEntity(knowledge, id, read.context, read.signal);
    } catch {
      return undefined;
    }
  }));
  const endpointMap = new Map(
    endpoints.filter((item): item is Entity => item !== undefined)
      .map((item) => [item.id, item]),
  );
  const values = relationshipPage.items.filter((item) =>
    endpointMap.has(item.source_entity_id) && endpointMap.has(item.target_entity_id));
  const nextOffset = relationshipPage.offset + relationshipPage.items.length;
  const hasMore = nextOffset < relationships.length;
  return readResult({
    offset: relationshipPage.offset,
    limit: relationshipPage.limit,
    items: values,
    next_offset: nextOffset,
    has_more: hasMore,
    truncated: hasMore,
  }, {
    operation: read.request.operation, count: values.length,
  });
}

async function readDocuments(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  let values = await requireReadKnowledge(read).listDocuments(
    requestedReadProject(read), read.signal,
  );
  if (read.projectId !== undefined)
    values = values.filter((item) => item.project_id === read.projectId);
  const result = boundedListPage(
    values,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, count: result.items.length });
}

async function readDocument(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const value = await requireReadKnowledge(read).getDocument(
    read.request.document_id as number, read.signal,
  );
  if (read.projectId !== undefined && value.project_id !== read.projectId)
    throw new Error("The document is outside the current project.");
  const result = page(
    value,
    "content",
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, id: value.id });
}

async function readCodeArtifacts(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  let values = await requireReadKnowledge(read).listCodeArtifacts(
    requestedReadProject(read), read.signal,
  );
  if (read.projectId !== undefined)
    values = values.filter((item) => item.project_id === read.projectId);
  const result = boundedListPage(
    values,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, count: result.items.length });
}

async function readCodeArtifact(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const value = await requireReadKnowledge(read).getCodeArtifact(
    read.request.code_artifact_id as number, read.signal,
  );
  if (read.projectId !== undefined && value.project_id !== read.projectId)
    throw new Error("The code artifact is outside the current project.");
  const result = page(
    value,
    "code",
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, id: value.id });
}

async function readFiles(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  let values = await requireReadKnowledge(read).listFiles(
    requestedReadProject(read), read.signal,
  );
  if (read.projectId !== undefined)
    values = values.filter((item) => item.project_id === read.projectId);
  const result = boundedListPage(
    values,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return readResult(result, { operation: read.request.operation, count: result.items.length });
}

async function readFile(read: KnowledgeReadContext): Promise<KnowledgeToolResult> {
  const value = await requireReadKnowledge(read).getFile(
    read.request.file_id as number, read.signal,
  );
  if (read.projectId !== undefined && value.project_id !== read.projectId)
    throw new Error("The file is outside the current project.");
  const rendered = fileContent(
    value,
    read.request.offset as number | undefined,
    read.request.limit as number | undefined,
  );
  return {
    content: rendered.content,
    details: { operation: read.request.operation, id: value.id, kind: rendered.kind },
    file: value,
  };
}

export async function executeKnowledgeRead(
  client: ForgetfulClient,
  rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext,
  signal?: AbortSignal,
): Promise<KnowledgeToolResult> {
  const request = validateKnowledgeReadRequest(rawRequest);
  if (signal?.aborted) throw new Error("Knowledge read was cancelled.");
  const read: KnowledgeReadContext = {
    client,
    knowledge: client.knowledge,
    request,
    context,
    projectId: context.scope === "project" ? currentProject(context) : undefined,
    signal,
  };
  switch (request.operation) {
    case "list_projects": return readProjects(read);
    case "search_memories": return readMemories(read);
    case "get_memory": return readMemory(read);
    case "search_entities": return readEntities(read);
    case "get_entity": return readEntity(read);
    case "get_entity_memories": return readEntityMemories(read);
    case "get_relationships": return readRelationships(read);
    case "list_documents": return readDocuments(read);
    case "get_document": return readDocument(read);
    case "list_code_artifacts": return readCodeArtifacts(read);
    case "get_code_artifact": return readCodeArtifact(read);
    case "list_files": return readFiles(read);
    case "get_file": return readFile(read);
  }
  throw new Error("Unsupported Forgetful knowledge read operation.");
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function provenance(
  context: KnowledgeToolContext,
  request: Record<string, unknown>,
): {
  source_repo?: string;
  source_files?: string[];
  encoding_version?: string;
} {
  const sourceFiles = request.source_files as string[] | undefined;
  const version = effectiveCommit(context, request);
  return {
    ...(context.repoName ? { source_repo: context.repoName } : {}),
    ...(sourceFiles ? { source_files: sourceFiles } : {}),
    ...(version ?? context.commit
      ? { encoding_version: version ?? context.commit }
      : {}),
  };
}

function effectiveCommit(
  context: KnowledgeToolContext,
  request: Record<string, unknown>,
): string | undefined {
  const supplied = request.encoding_version as string | undefined;
  const valid = (value: string): boolean => /^[a-fA-F0-9]{7,50}$/.test(value);
  if (context.commit && !valid(context.commit))
    throw new Error("The current repository commit is not supported by Forgetful.");
  if (supplied && !valid(supplied))
    throw new Error("encoding_version must be a Git commit SHA supported by Forgetful.");
  if (supplied && context.commit && supplied !== context.commit)
    throw new Error("encoding_version must match the current repository commit.");
  return context.commit ?? supplied;
}

async function beforeMutation(
  beforeWrite: (() => Promise<void>) | undefined,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) throw new Error("Knowledge write was cancelled.");
  if (beforeWrite) await beforeWrite();
  if (signal?.aborted) throw new Error("Knowledge write was cancelled.");
}

async function memoryInProject(
  client: ForgetfulClient,
  memoryId: number,
  projectId: number,
  signal?: AbortSignal,
  editable = false,
): Promise<Memory> {
  const value = await client.get(memoryId, signal);
  if (!value.project_ids.includes(projectId))
    throw new Error("The memory is outside the current project.");
  if (editable && value.project_ids.length > 1)
    throw new Error("Shared memories cannot be edited from one project.");
  return value;
}

function compareCanonicalStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function sortedCanonicalStrings(values: readonly string[]): string[] {
  return [...values].sort(compareCanonicalStrings);
}

function memoryState(memory: Memory): string {
  return JSON.stringify({
    title: memory.title,
    content: memory.content,
    context: memory.context,
    keywords: sortedCanonicalStrings(memory.keywords),
    tags: sortedCanonicalStrings(memory.tags),
    importance: memory.importance ?? null,
    project_ids: [...memory.project_ids].sort((a, b) => a - b),
    source_repo: memory.source_repo ?? null,
    source_files: sortedCanonicalStrings(memory.source_files ?? []),
    encoding_version: memory.encoding_version ?? null,
    document_ids: [...(memory.document_ids ?? [])].sort((a, b) => a - b),
    code_artifact_ids: [...(memory.code_artifact_ids ?? [])].sort((a, b) => a - b),
    file_ids: [...(memory.file_ids ?? [])].sort((a, b) => a - b),
    is_obsolete: memory.is_obsolete,
    superseded_by: memory.superseded_by ?? null,
  });
}

function sameMemoryState(left: Memory, right: Memory): boolean {
  return memoryState(left) === memoryState(right);
}

async function entityInProject(
  knowledge: KnowledgeClient,
  entityId: number,
  projectId: number,
  signal?: AbortSignal,
  editable = false,
): Promise<Entity> {
  const value = await knowledge.getEntity(entityId, signal);
  if (!value.project_ids.includes(projectId))
    throw new Error("The entity is outside the current project.");
  if (editable && value.project_ids.length > 1)
    throw new Error("Shared entities cannot be edited from one project.");
  return value;
}

async function hydrateEntities(
  knowledge: KnowledgeClient,
  candidates: Entity[],
  signal?: AbortSignal,
): Promise<Entity[]> {
  const bounded = candidates.slice(0, 100);
  return Promise.all(bounded.map(async (candidate) => {
    try {
      return await knowledge.getEntity(candidate.id, signal);
    } catch {
      return candidate;
    }
  }));
}

async function validateAttachments(
  knowledge: KnowledgeClient,
  projectId: number,
  request: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<void> {
  for (const id of (request.document_ids as number[] | undefined) ?? []) {
    const document = await knowledge.getDocument(id, signal);
    if (document.project_id !== projectId)
      throw new Error("A document attachment is outside the current project.");
  }
  for (const id of (request.code_artifact_ids as number[] | undefined) ?? []) {
    const artifact = await knowledge.getCodeArtifact(id, signal);
    if (artifact.project_id !== projectId)
      throw new Error("A code artifact attachment is outside the current project.");
  }
  for (const id of (request.file_ids as number[] | undefined) ?? []) {
    const file = await knowledge.getFile(id, signal);
    if (file.project_id !== projectId)
      throw new Error("A file attachment is outside the current project.");
  }
}

function mergeIds(
  existing: number[] | undefined,
  requested: number[] | undefined,
): number[] | undefined {
  if (requested === undefined) return existing;
  return [...new Set([...(existing ?? []), ...requested])];
}

function sameStrings(left: string[] | undefined, right: string[] | undefined): boolean {
  return JSON.stringify(sortedCanonicalStrings(left ?? [])) ===
    JSON.stringify(sortedCanonicalStrings(right ?? []));
}

function containsAllIds(existing: number[] | undefined, requested: number[] | undefined): boolean {
  const available = new Set(existing ?? []);
  return (requested ?? []).every((id) => available.has(id));
}

function sharedMemoryHasChanges(memory: Memory, input: MemoryInput): boolean {
  return input.context !== memory.context ||
    !sameStrings(input.keywords, memory.keywords) ||
    !sameStrings(input.tags, memory.tags) ||
    (input.importance !== undefined && input.importance !== memory.importance) ||
    !containsAllIds(memory.document_ids, input.document_ids) ||
    !containsAllIds(memory.code_artifact_ids, input.code_artifact_ids) ||
    !containsAllIds(memory.file_ids, input.file_ids) ||
    (input.source_files !== undefined && !sameStrings(input.source_files, memory.source_files)) ||
    (input.encoding_version !== undefined && input.encoding_version !== memory.encoding_version);
}

function compactString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  if (value.length > 500) return `${value.slice(0, 497)}...`;
  return value;
}

function compactObjectEntry(key: string, value: unknown, depth: number): unknown {
  if ((key === "description" || key === "notes") && typeof value === "string") {
    if (value.length > 240) return `${value.slice(0, 237)}...`;
    return value;
  }
  return compactWriteValue(value, depth + 1);
}

function compactWriteValue(value: unknown, depth = 0): unknown {
  if (value === null || typeof value !== "object") {
    return compactString(value);
  }
  if (depth > 3) return undefined;
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => compactWriteValue(item, depth + 1));
  }
  const omitted = new Set(["content", "code", "data"]);
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (omitted.has(key)) continue;
    const compact = compactObjectEntry(key, item, depth);
    if (compact !== undefined) result[key] = compact;
  }
  return result;
}

function writeResult(value: unknown, operation: string): KnowledgeToolResult {
  return {
    content: [{ type: "text", text: json(compactWriteValue(value)) }],
    details: { operation },
  };
}

function isCurrentMemory(memory: Memory, projectId: number): boolean {
  return !memory.is_obsolete && memory.project_ids.includes(projectId);
}

function isExactMemoryMatch(memory: Memory, input: MemoryInput, projectId: number): boolean {
  return isCurrentMemory(memory, projectId) &&
    normalized(memory.title) === normalized(input.title) &&
    memory.content.trim() === input.content.trim();
}

function memoryUpdates(memory: Memory, input: MemoryInput): Partial<MemoryInput> {
  const updates: Partial<MemoryInput> = {};
  const documentIds = mergeIds(memory.document_ids, input.document_ids);
  const codeIds = mergeIds(memory.code_artifact_ids, input.code_artifact_ids);
  const fileIds = mergeIds(memory.file_ids, input.file_ids);
  if (JSON.stringify(documentIds) !== JSON.stringify(memory.document_ids) && documentIds)
    updates.document_ids = documentIds;
  if (JSON.stringify(codeIds) !== JSON.stringify(memory.code_artifact_ids) && codeIds)
    updates.code_artifact_ids = codeIds;
  if (JSON.stringify(fileIds) !== JSON.stringify(memory.file_ids) && fileIds)
    updates.file_ids = fileIds;
  if (
    input.source_files &&
    JSON.stringify(input.source_files) !== JSON.stringify(memory.source_files)
  )
    updates.source_files = input.source_files;
  if (input.encoding_version && input.encoding_version !== memory.encoding_version)
    updates.encoding_version = input.encoding_version;
  return updates;
}

async function existingMemoryResult(
  knowledge: KnowledgeClient,
  memory: Memory,
  input: MemoryInput,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<KnowledgeToolResult> {
  if (memory.project_ids.length > 1) {
    if (sharedMemoryHasChanges(memory, input)) {
      return writeResult({ status: "needs_review", existing_memory_id: memory.id,
        reason: "A shared memory has requested changes; choose an explicit project-safe edit." },
      "create_memory");
    }
    return writeResult({ status: "existing", memory }, "create_memory");
  }
  const updates = memoryUpdates(memory, input);
  if (Object.keys(updates).length === 0)
    return writeResult({ status: "existing", memory }, "create_memory");
  await beforeMutation(beforeWrite, signal);
  const updated = await knowledge.updateMemory(memory.id, updates, signal);
  return writeResult({ status: "existing", memory: updated }, "create_memory");
}

async function createMemory(
  client: ForgetfulClient,
  request: Record<string, unknown>,
  context: KnowledgeToolContext,
  projectId: number,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<KnowledgeToolResult> {
  const knowledge = rich(client);
  await validateAttachments(knowledge, projectId, request, signal);
  const input: MemoryInput = {
    title: request.title as string,
    content: request.content as string,
    context: request.context as string,
    keywords: request.keywords as string[],
    tags: request.tags as string[],
    project_ids: [projectId],
    ...(request.importance === undefined ? {} : { importance: request.importance as number }),
    ...(request.document_ids === undefined
      ? {}
      : { document_ids: request.document_ids as number[] }),
    ...(request.code_artifact_ids === undefined
      ? {}
      : { code_artifact_ids: request.code_artifact_ids as number[] }),
    ...(request.file_ids === undefined ? {} : { file_ids: request.file_ids as number[] }),
    ...provenance(context, request),
  };
  const matches = await client.search({
    query: `${input.title}\n${input.content}`,
    query_context: "Checking an exact repository encoding before creating knowledge",
    project_ids: [projectId], strict_project_filter: true, k: 20, include_links: false,
  }, signal);
  const exact = matches.find((item) => isExactMemoryMatch(item, input, projectId));
  if (exact) return existingMemoryResult(knowledge, exact, input, signal, beforeWrite);
  const sameTitle = matches.find((item) =>
    isCurrentMemory(item, projectId) && normalized(item.title) === normalized(input.title));
  if (sameTitle) {
    return writeResult({ status: "needs_review", existing_memory_id: sameTitle.id,
      reason: "A changed claim needs explicit supersede_memory." }, "create_memory");
  }
  await beforeMutation(beforeWrite, signal);
  const created = await client.create(input, signal);
  return writeResult({ status: "created", memory: created }, "create_memory");
}

async function createEntity(
  knowledge: KnowledgeClient,
  request: Record<string, unknown>,
  context: KnowledgeToolContext,
  projectId: number,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<KnowledgeToolResult> {
  const candidates = await knowledge.searchEntities(request.name as string, 100, signal);
  const matches = (await hydrateEntities(knowledge, candidates, signal))
    .filter((item) => item.project_ids.includes(projectId) && (
      normalized(item.name) === normalized(request.name as string) ||
      item.aka.some((alias) => normalized(alias) === normalized(request.name as string))) &&
      item.entity_type === request.entity_type &&
      (item.entity_type !== "Other" ||
        normalized(item.custom_type ?? "") === normalized(request.custom_type as string)));
  if (matches.length > 1)
    throw new Error("Entity name matches multiple current-project entities; choose an ID.");
  if (matches[0]) return writeResult({ status: "existing", entity: matches[0] }, "create_entity");
  const input: EntityInput = {
    name: request.name as string,
    entity_type: request.entity_type as EntityType,
    project_ids: [projectId],
    tags: (request.tags as string[] | undefined) ?? [],
    aka: (request.aka as string[] | undefined) ?? [],
    ...(request.custom_type === undefined ? {} : { custom_type: request.custom_type as string }),
    ...(request.notes === undefined ? {} : { notes: request.notes as string }),
    ...provenance(context, request),
  };
  await beforeMutation(beforeWrite, signal);
  return writeResult(
    { status: "created", entity: await knowledge.createEntity(input, signal) },
    "create_entity",
  );
}

async function createDocument(
  knowledge: KnowledgeClient,
  request: Record<string, unknown>,
  context: KnowledgeToolContext,
  projectId: number,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<KnowledgeToolResult> {
  const input: DocumentInput = {
    title: request.title as string,
    description: request.description as string,
    content: request.content as string,
    document_type: request.document_type as string | undefined,
    tags: (request.tags as string[] | undefined) ?? [],
    project_id: projectId,
    ...provenance(context, request),
  };
  const matches = (await knowledge.listDocuments(projectId, signal)).filter((item) =>
    normalized(item.title) === normalized(input.title));
  if (matches.length > 1)
    throw new Error("Document title matches multiple current-project documents; choose an ID.");
  if (matches[0]) {
    const existing = await knowledge.getDocument(matches[0].id, signal);
    if (existing.content === input.content && existing.description === input.description)
      return writeResult({ status: "existing", document: existing }, "create_document");
    return writeResult({ status: "needs_review", existing_document_id: existing.id,
      reason: "A changed document needs explicit update_document." }, "create_document");
  }
  await beforeMutation(beforeWrite, signal);
  return writeResult(
    { status: "created", document: await knowledge.createDocument(input, signal) },
    "create_document",
  );
}

async function createCodeArtifact(
  knowledge: KnowledgeClient,
  request: Record<string, unknown>,
  context: KnowledgeToolContext,
  projectId: number,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<KnowledgeToolResult> {
  const input: CodeArtifactInput = {
    title: request.title as string,
    description: request.description as string,
    code: request.code as string,
    language: request.language as string,
    tags: (request.tags as string[] | undefined) ?? [],
    project_id: projectId,
    ...provenance(context, request),
  };
  const matches = (await knowledge.listCodeArtifacts(projectId, signal)).filter((item) =>
    normalized(item.title) === normalized(input.title));
  if (matches.length > 1)
    throw new Error(
      "Code artifact title matches multiple current-project artifacts; choose an ID.",
    );
  if (matches[0]) {
    const existing = await knowledge.getCodeArtifact(matches[0].id, signal);
    if (existing.code === input.code && existing.description === input.description &&
        normalized(existing.language) === normalized(input.language))
      return writeResult({ status: "existing", code_artifact: existing }, "create_code_artifact");
    return writeResult({ status: "needs_review", existing_code_artifact_id: existing.id,
      reason: "A changed artifact needs explicit update_code_artifact." }, "create_code_artifact");
  }
  await beforeMutation(beforeWrite, signal);
  return writeResult(
    { status: "created", code_artifact: await knowledge.createCodeArtifact(input, signal) },
    "create_code_artifact",
  );
}

async function replacementMemory(
  client: ForgetfulClient,
  knowledge: KnowledgeClient,
  request: Record<string, unknown>,
  context: KnowledgeToolContext,
  projectId: number,
  signal: AbortSignal | undefined,
  beforeWrite: (() => Promise<void>) | undefined,
): Promise<Memory> {
  const replacementId = request.replacement_memory_id as number | undefined;
  if (replacementId !== undefined) {
    const replacement = await memoryInProject(client, replacementId, projectId, signal, true);
    if (replacement.is_obsolete) throw new Error("The replacement memory is obsolete.");
    return replacement;
  }
  await validateAttachments(knowledge, projectId, request, signal);
  const input: MemoryInput = {
    title: (request.title as string | undefined) ?? "Updated repository knowledge",
    content: request.content as string,
    context: (request.context as string | undefined) ?? "Repository encoding supersession",
    keywords: (request.keywords as string[] | undefined) ?? [],
    tags: (request.tags as string[] | undefined) ?? [],
    project_ids: [projectId],
    ...(request.importance === undefined ? {} : { importance: request.importance as number }),
    ...(request.document_ids === undefined
      ? {}
      : { document_ids: request.document_ids as number[] }),
    ...(request.code_artifact_ids === undefined
      ? {}
      : { code_artifact_ids: request.code_artifact_ids as number[] }),
    ...(request.file_ids === undefined ? {} : { file_ids: request.file_ids as number[] }),
    ...provenance(context, request),
  };
  const matches = await client.search({
    query: `${input.title}\n${input.content}`,
    query_context: "Checking a source-backed repository supersession",
    project_ids: [projectId], strict_project_filter: true, k: 20, include_links: false,
  }, signal);
  const exact = matches.find((item) =>
    !item.is_obsolete && item.project_ids.includes(projectId) &&
    normalized(item.title) === normalized(input.title) &&
    item.content.trim() === input.content.trim());
  if (exact) return exact;
  await beforeMutation(beforeWrite, signal);
  const created = await client.create(input, signal);
  return client.get(created.id, signal);
}

interface KnowledgeWriteContext {
  client: ForgetfulClient;
  knowledge: KnowledgeClient;
  request: KnowledgeWriteRequest;
  context: KnowledgeToolContext;
  projectId: number;
  signal?: AbortSignal;
  beforeWrite?: () => Promise<void>;
}

async function updateMemory(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { client, knowledge, request, context, projectId, signal, beforeWrite } = write;
  const memory = await memoryInProject(
    client, request.memory_id as number, projectId, signal, true,
  );
  const textFields = ["title", "content", "context"] as const;
  for (const field of textFields) {
    if (request[field] !== undefined && request[field] !== memory[field]) {
      return writeResult({ status: "needs_review", memory_id: memory.id,
        reason: "Changed memory claims require supersede_memory to preserve history." },
      request.operation);
    }
  }
  await validateAttachments(knowledge, projectId, request, signal);
  const input: Partial<MemoryInput> = {
    ...(request.title === undefined ? {} : { title: request.title as string }),
    ...(request.content === undefined ? {} : { content: request.content as string }),
    ...(request.context === undefined ? {} : { context: request.context as string }),
    ...(request.keywords === undefined ? {} : { keywords: request.keywords as string[] }),
    ...(request.tags === undefined ? {} : { tags: request.tags as string[] }),
    ...(request.importance === undefined ? {} : { importance: request.importance as number }),
    project_ids: [...memory.project_ids],
    document_ids: mergeIds(memory.document_ids, request.document_ids as number[] | undefined),
    code_artifact_ids: mergeIds(
      memory.code_artifact_ids, request.code_artifact_ids as number[] | undefined,
    ),
    file_ids: mergeIds(
      memory.file_ids, request.file_ids as number[] | undefined,
    ),
    source_repo: memory.source_repo ?? context.repoName,
    source_files: request.source_files === undefined
      ? memory.source_files : request.source_files as string[],
    encoding_version: effectiveCommit(context, request) ?? memory.encoding_version,
  };
  await beforeMutation(beforeWrite, signal);
  return writeResult({ status: "updated", memory: await knowledge.updateMemory(
    memory.id, input, signal,
  ) }, request.operation);
}

async function supersedeMemory(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { client, knowledge, request, context, projectId, signal, beforeWrite } = write;
  const oldMemory = await memoryInProject(
    client, request.memory_id as number, projectId, signal, true,
  );
  const requestedReplacement = request.replacement_memory_id as number | undefined;
  if (oldMemory.is_obsolete) {
    if (requestedReplacement !== undefined && oldMemory.superseded_by === requestedReplacement) {
      return writeResult({ status: "already", old_memory_id: oldMemory.id,
        replacement_memory_id: requestedReplacement }, request.operation);
    }
    throw new Error("The selected memory is already obsolete or was superseded differently.");
  }
  const replacement = await replacementMemory(
    client, knowledge, request, context, projectId, signal, beforeWrite,
  );
  if (replacement.id === oldMemory.id) throw new Error("A memory cannot supersede itself.");
  const replacementSnapshot = await memoryInProject(
    client, replacement.id, projectId, signal, true,
  );
  await beforeMutation(beforeWrite, signal);
  const currentOld = await client.get(oldMemory.id, signal);
  const currentReplacement = await client.get(replacement.id, signal);
  if (currentOld.is_obsolete && currentOld.superseded_by === replacement.id) {
    return writeResult({ status: "already", old_memory_id: oldMemory.id,
      replacement_memory_id: replacement.id }, request.operation);
  }
  if (currentOld.is_obsolete || !sameMemoryState(currentOld, oldMemory)) {
    throw new Error(
      "The old memory changed while preparing supersession; retry with fresh evidence.",
    );
  }
  if (!sameMemoryState(currentReplacement, replacementSnapshot))
    throw new Error("The replacement memory changed while preparing supersession; retry.");
  await beforeMutation(beforeWrite, signal);
  await client.supersede(oldMemory.id, replacement.id, request.reason as string, signal);
  return writeResult({ status: "superseded", old_memory_id: oldMemory.id,
    replacement_memory_id: replacement.id }, request.operation);
}

async function linkMemories(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { client, knowledge, request, projectId, signal, beforeWrite } = write;
  await memoryInProject(client, request.memory_id as number, projectId, signal);
  for (const id of request.related_memory_ids as number[])
    await memoryInProject(client, id, projectId, signal);
  await beforeMutation(beforeWrite, signal);
  await knowledge.linkMemories(
    request.memory_id as number, request.related_memory_ids as number[], signal,
  );
  return writeResult({ status: "linked", memory_id: request.memory_id }, request.operation);
}

async function updateEntity(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { knowledge, request, context, projectId, signal, beforeWrite } = write;
  const entity = await entityInProject(
    knowledge, request.entity_id as number, projectId, signal, true,
  );
  await beforeMutation(beforeWrite, signal);
  const input: Partial<EntityInput> = {
    ...(request.name === undefined ? {} : { name: request.name as string }),
    ...(request.entity_type === undefined
      ? {}
      : { entity_type: request.entity_type as EntityType }),
    ...(request.custom_type === undefined ? {} : { custom_type: request.custom_type as string }),
    ...(request.notes === undefined ? {} : { notes: request.notes as string }),
    ...(request.tags === undefined ? {} : { tags: request.tags as string[] }),
    ...(request.aka === undefined ? {} : { aka: request.aka as string[] }),
    project_ids: [...entity.project_ids],
    source_repo: entity.source_repo ?? context.repoName,
    source_files: request.source_files === undefined
      ? entity.source_files : request.source_files as string[],
    encoding_version: effectiveCommit(context, request) ?? entity.encoding_version,
  };
  return writeResult({ status: "updated", entity: await knowledge.updateEntity(
    entity.id, input, signal,
  ) }, request.operation);
}

async function linkEntityMemory(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { client, knowledge, request, projectId, signal, beforeWrite } = write;
  await entityInProject(knowledge, request.entity_id as number, projectId, signal);
  await memoryInProject(client, request.memory_id as number, projectId, signal);
  await beforeMutation(beforeWrite, signal);
  await knowledge.linkEntityMemory(
    request.entity_id as number, request.memory_id as number, signal,
  );
  return writeResult(
    { status: "linked", entity_id: request.entity_id, memory_id: request.memory_id },
    request.operation,
  );
}

async function createRelationship(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { knowledge, request, context, projectId, signal, beforeWrite } = write;
  await entityInProject(knowledge, request.source_entity_id as number, projectId, signal);
  await entityInProject(knowledge, request.target_entity_id as number, projectId, signal);
  const sourceRelationships = await knowledge.getRelationships(
    request.source_entity_id as number, signal,
  );
  const targetRelationships = request.target_entity_id === request.source_entity_id
    ? sourceRelationships
    : await knowledge.getRelationships(request.target_entity_id as number, signal);
  const existing = [...sourceRelationships, ...targetRelationships].find((item) =>
    item.source_entity_id === request.source_entity_id &&
    item.target_entity_id === request.target_entity_id &&
    item.relationship_type === request.relationship_type);
  if (existing) {
    return writeResult({ status: "existing", relationship: existing }, request.operation);
  }
  await beforeMutation(beforeWrite, signal);
  const input: EntityRelationshipInput = {
    source_entity_id: request.source_entity_id as number,
    target_entity_id: request.target_entity_id as number,
    relationship_type: request.relationship_type as string,
    ...provenance(context, request),
  };
  return writeResult({ status: "created", relationship: await knowledge.createRelationship(
    input, signal,
  ) }, request.operation);
}

async function updateDocument(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { knowledge, request, context, projectId, signal, beforeWrite } = write;
  const document = await knowledge.getDocument(request.document_id as number, signal);
  if (document.project_id !== projectId)
    throw new Error("The document is outside the current project.");
  await beforeMutation(beforeWrite, signal);
  const input: Partial<DocumentInput> = {
    ...(request.title === undefined ? {} : { title: request.title as string }),
    ...(request.description === undefined ? {} : { description: request.description as string }),
    ...(request.content === undefined ? {} : { content: request.content as string }),
    ...(request.document_type === undefined
      ? {}
      : { document_type: request.document_type as string }),
    ...(request.tags === undefined ? {} : { tags: request.tags as string[] }),
    project_id: document.project_id,
    source_repo: document.source_repo ?? context.repoName,
    source_files: request.source_files === undefined
      ? document.source_files : request.source_files as string[],
    encoding_version: effectiveCommit(context, request) ?? document.encoding_version,
  };
  return writeResult({ status: "updated", document: await knowledge.updateDocument(
    document.id, input, signal,
  ) }, request.operation);
}

async function updateCodeArtifact(write: KnowledgeWriteContext): Promise<KnowledgeToolResult> {
  const { knowledge, request, context, projectId, signal, beforeWrite } = write;
  const artifact = await knowledge.getCodeArtifact(request.code_artifact_id as number, signal);
  if (artifact.project_id !== projectId)
    throw new Error("The code artifact is outside the current project.");
  await beforeMutation(beforeWrite, signal);
  const input: Partial<CodeArtifactInput> = {
    ...(request.title === undefined ? {} : { title: request.title as string }),
    ...(request.description === undefined ? {} : { description: request.description as string }),
    ...(request.code === undefined ? {} : { code: request.code as string }),
    ...(request.language === undefined ? {} : { language: request.language as string }),
    ...(request.tags === undefined ? {} : { tags: request.tags as string[] }),
    project_id: artifact.project_id,
    source_repo: artifact.source_repo ?? context.repoName,
    source_files: request.source_files === undefined
      ? artifact.source_files : request.source_files as string[],
    encoding_version: effectiveCommit(context, request) ?? artifact.encoding_version,
  };
  return writeResult({ status: "updated", code_artifact: await knowledge.updateCodeArtifact(
    artifact.id, input, signal,
  ) }, request.operation);
}

export async function executeKnowledgeWrite(
  client: ForgetfulClient,
  rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext,
  signal?: AbortSignal,
  beforeWrite?: () => Promise<void>,
): Promise<KnowledgeToolResult> {
  rejectSensitiveInput(rawRequest);
  const request = validateKnowledgeWriteRequest(rawRequest);
  if (signal?.aborted) throw new Error("Knowledge write was cancelled.");
  effectiveCommit(context, request);
  const projectId = currentProject(context);
  const knowledge = rich(client);
  const write: KnowledgeWriteContext = {
    client, knowledge, request, context, projectId, signal, beforeWrite,
  };
  switch (request.operation) {
    case "create_memory":
      return createMemory(client, request, context, projectId, signal, beforeWrite);
    case "create_entity":
      return createEntity(knowledge, request, context, projectId, signal, beforeWrite);
    case "create_document":
      return createDocument(knowledge, request, context, projectId, signal, beforeWrite);
    case "create_code_artifact":
      return createCodeArtifact(knowledge, request, context, projectId, signal, beforeWrite);
    case "update_memory": return updateMemory(write);
    case "supersede_memory": return supersedeMemory(write);
    case "link_memories": return linkMemories(write);
    case "update_entity": return updateEntity(write);
    case "link_entity_memory": return linkEntityMemory(write);
    case "create_relationship": return createRelationship(write);
    case "update_document": return updateDocument(write);
    case "update_code_artifact": return updateCodeArtifact(write);
  }
  throw new Error("Unsupported Forgetful knowledge write operation.");
}
