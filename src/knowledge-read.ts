import { sanitizeText } from "./privacy.ts";
import type {
  CodeArtifact,
  Document,
  Entity,
  EntityRelationship,
  FileSummary,
  KnowledgeClient,
  Memory,
  Scope,
} from "./contracts.ts";

const MAX_EXPANSION_ENTITIES = 6;
const MAX_EXPANSION_RELATIONSHIPS = 12;
const MAX_ENTITY_MEMORIES_PER_ENTITY = 4;
const MAX_EXPANSION_MEMORY_LINKS = 12;
const MAX_EXPANSION_ATTACHMENTS = 3;
const MAX_EXPANSION_CHARS = 3_500;
const MAX_ATTACHMENT_CHARS = 1_200;
const DEFAULT_CHUNK_CHARS = 1_200;

export interface KnowledgeExpansionRequest {
  memories: Memory[];
  entityNames: string[];
  scope: Scope;
  projectId?: number;
  signal?: AbortSignal;
}

export interface KnowledgeExpansionResult {
  text: string;
  memoryIds: number[];
  entityIds: number[];
  relationshipIds: number[];
  documentIds: number[];
  codeArtifactIds: number[];
  fileIds: number[];
}

export type MemoryReader = (
  id: number,
  signal?: AbortSignal,
) => Promise<Memory>;

export interface KnowledgeReadServiceOptions {
  readMemory?: MemoryReader;
  maxExpansionChars?: number;
}

function validId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function validEntity(value: unknown): value is Entity {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entity = value as Entity;
  return (
    validId(entity.id) &&
    typeof entity.name === "string" &&
    typeof entity.entity_type === "string" &&
    Array.isArray(entity.project_ids) &&
    entity.project_ids.every(validId)
  );
}

function validRelationship(value: unknown): value is EntityRelationship {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const relationship = value as EntityRelationship;
  return (
    validId(relationship.id) &&
    validId(relationship.source_entity_id) &&
    validId(relationship.target_entity_id) &&
    typeof relationship.relationship_type === "string" &&
    relationship.relationship_type.trim().length > 0
  );
}

function validMemory(value: unknown): value is Memory {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const memory = value as Memory;
  return (
    validId(memory.id) &&
    typeof memory.title === "string" &&
    typeof memory.content === "string" &&
    memory.is_obsolete === false &&
    Array.isArray(memory.project_ids) &&
    memory.project_ids.every(validId)
  );
}

function inEntityScope(entity: Entity, scope: Scope, projectId?: number): boolean {
  return scope === "global" ||
    (validId(projectId) && entity.project_ids.includes(projectId));
}

function inProjectScope(
  resourceProjectId: number | null | undefined,
  scope: Scope,
  projectId?: number,
): boolean {
  return scope === "global" ||
    (validId(projectId) && resourceProjectId === projectId);
}

function clean(value: string, max: number): string {
  const safe = sanitizeText(value.trim());
  return safe.length <= max ? safe : `${safe.slice(0, max - 1)}…`;
}

function appendLine(lines: string[], line: string, maxChars: number): boolean {
  const currentLength = lines.join("\n").length;
  if (currentLength >= maxChars) return false;
  const remaining = maxChars - currentLength - (lines.length > 0 ? 1 : 0);
  if (remaining <= 0) return false;
  lines.push(line.length <= remaining ? line : `${line.slice(0, Math.max(0, remaining - 1))}…`);
  return true;
}

/** Split text at readable boundaries while keeping every chunk bounded. */
export function chunkText(text: string, maxChars = DEFAULT_CHUNK_CHARS): string[] {
  if (!Number.isSafeInteger(maxChars) || maxChars < 1) {
    throw new TypeError("Text chunk size must be a positive integer");
  }
  if (text.length === 0) return [];
  const chunks: string[] = [];
  let offset = 0;
  while (offset < text.length) {
    const end = Math.min(offset + maxChars, text.length);
    if (end === text.length) {
      chunks.push(text.slice(offset));
      break;
    }
    const candidate = text.slice(offset, end);
    const newline = candidate.lastIndexOf("\n");
    const split = newline >= Math.floor(maxChars / 2) ? newline + 1 : maxChars;
    chunks.push(text.slice(offset, offset + split).trimEnd());
    offset += split;
    while (text[offset] === "\n" || text[offset] === " ") offset += 1;
  }
  return chunks;
}

async function safeCall<T>(
  operation: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T | undefined> {
  if (signal?.aborted) return undefined;
  const operationResult = Promise.resolve().then(operation).catch(() => undefined);
  if (!signal) return operationResult;
  return new Promise<T | undefined>((resolve) => {
    let settled = false;
    const finish = (value: T | undefined) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      resolve(value);
    };
    const onAbort = () => finish(undefined);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) finish(undefined);
    else operationResult.then(finish);
  });
}

/** Read rich Forgetful records without making them a required recall dependency. */
export class KnowledgeReadService {
  private readonly readMemory?: MemoryReader;
  private readonly maxExpansionChars: number;

  constructor(
    private readonly client: KnowledgeClient,
    options: KnowledgeReadServiceOptions | MemoryReader = {},
  ) {
    if (typeof options === "function") this.readMemory = options;
    else this.readMemory = options.readMemory;
    const maxChars = typeof options === "function"
      ? MAX_EXPANSION_CHARS
      : options.maxExpansionChars ?? MAX_EXPANSION_CHARS;
    if (!Number.isSafeInteger(maxChars) || maxChars < 100) {
      throw new TypeError("Knowledge expansion size must be at least 100 characters");
    }
    this.maxExpansionChars = maxChars;
  }

  async expand(request: KnowledgeExpansionRequest): Promise<KnowledgeExpansionResult> {
    const empty = this.emptyExpansion();
    if (request.signal?.aborted) return empty;
    try {
      const entities = await this.findEntities(request);
      const relationships = await this.findRelationships(entities, request);
      const memories = await this.findEntityMemories(entities, request);
      const attachments = await this.findAttachments(request);
      return this.formatExpansion(entities, relationships, memories, attachments);
    } catch {
      return empty;
    }
  }

  private async findEntities(request: KnowledgeExpansionRequest): Promise<Entity[]> {
    const names = [...new Set(request.entityNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0))]
      .slice(0, MAX_EXPANSION_ENTITIES);
    const searched = await Promise.all(names.map((name) =>
      safeCall(() => this.client.searchEntities(name, 6, request.signal), request.signal)));
    const candidates = new Map<number, Entity>();
    for (const result of searched) {
      for (const entity of result ?? []) {
        if (!validEntity(entity)) continue;
        const hasScopeHint = entity.project_ids.length > 0;
        if (request.scope === "project" && hasScopeHint &&
            !inEntityScope(entity, request.scope, request.projectId)) continue;
        candidates.set(entity.id, entity);
      }
    }
    const selected = [...candidates.values()].slice(0, MAX_EXPANSION_ENTITIES);
    const hydrated = await Promise.all(selected.map((candidate) =>
      safeCall(() => this.client.getEntity(candidate.id, request.signal), request.signal)));
    return selected.map((candidate, index) => {
      const entity = hydrated[index];
      if (entity && entity.id === candidate.id && validEntity(entity) &&
          inEntityScope(entity, request.scope, request.projectId)) return entity;
      return inEntityScope(candidate, request.scope, request.projectId) ? candidate : undefined;
    }).filter((entity): entity is Entity => entity !== undefined);
  }

  private async findRelationships(
    entities: Entity[],
    request: KnowledgeExpansionRequest,
  ): Promise<{ relationship: EntityRelationship; source: Entity; target: Entity }[]> {
    const relationshipResults = await Promise.all(entities.map((entity) =>
      safeCall(() => this.client.getRelationships(entity.id, request.signal), request.signal)));
    const relationships = new Map<number, EntityRelationship>();
    for (const result of relationshipResults) {
      for (const relationship of (result ?? []).slice(0, MAX_EXPANSION_RELATIONSHIPS)) {
        if (validRelationship(relationship)) relationships.set(relationship.id, relationship);
        if (relationships.size >= MAX_EXPANSION_RELATIONSHIPS) break;
      }
      if (relationships.size >= MAX_EXPANSION_RELATIONSHIPS) break;
    }
    const endpoints = new Map(entities.map((entity) => [entity.id, entity]));
    const endpointIds = [...relationships.values()].flatMap((relationship) => [
      relationship.source_entity_id,
      relationship.target_entity_id,
    ]);
    const missingIds = [...new Set(endpointIds)].filter((id) => !endpoints.has(id));
    const fetched = await Promise.all(missingIds.map((id) =>
      safeCall(() => this.client.getEntity(id, request.signal), request.signal)));
    for (let index = 0; index < missingIds.length; index += 1) {
      const entity = fetched[index];
      if (entity && entity.id === missingIds[index] && validEntity(entity)) {
        endpoints.set(entity.id, entity);
      }
    }
    const result: { relationship: EntityRelationship; source: Entity; target: Entity }[] = [];
    for (const relationship of [...relationships.values()].slice(0, MAX_EXPANSION_RELATIONSHIPS)) {
      const source = endpoints.get(relationship.source_entity_id);
      const target = endpoints.get(relationship.target_entity_id);
      if (!source || !target) continue;
      if (!inEntityScope(source, request.scope, request.projectId) ||
          !inEntityScope(target, request.scope, request.projectId)) continue;
      if (!entities.some((entity) => entity.id === source.id || entity.id === target.id)) continue;
      result.push({ relationship, source, target });
    }
    return result;
  }

  private async findEntityMemories(
    entities: Entity[],
    request: KnowledgeExpansionRequest,
  ): Promise<{ entity: Entity; id: number; title: string }[]> {
    const linked = await Promise.all(entities.map((entity) =>
      safeCall(() => this.client.getEntityMemories(entity.id, request.signal), request.signal)));
    const result: { entity: Entity; id: number; title: string }[] = [];
    const seen = new Set<number>();
    for (let index = 0; index < linked.length; index += 1) {
      for (const item of (linked[index] ?? []).slice(0, MAX_ENTITY_MEMORIES_PER_ENTITY)) {
        if (!validId(item.id) || typeof item.title !== "string" || seen.has(item.id)) continue;
        if (this.readMemory) {
          const memory = await safeCall(
            () => this.readMemory!(item.id, request.signal),
            request.signal,
          );
          if (!memory || !validMemory(memory) ||
              (request.scope === "project" && !memory.project_ids.includes(request.projectId!))) {
            continue;
          }
        } else if (request.scope === "project") {
          continue;
        }
        seen.add(item.id);
        result.push({ entity: entities[index], id: item.id, title: item.title });
        if (result.length >= MAX_EXPANSION_MEMORY_LINKS) return result;
      }
    }
    return result;
  }

  private async findAttachments(request: KnowledgeExpansionRequest): Promise<{
    documents: Document[];
    artifacts: CodeArtifact[];
    files: FileSummary[];
    fileIds: number[];
  }> {
    const documentIds = [
      ...new Set(request.memories.flatMap((memory) => memory.document_ids ?? [])),
    ]
      .filter(validId).slice(0, MAX_EXPANSION_ATTACHMENTS);
    const artifactIds = [
      ...new Set(request.memories.flatMap((memory) => memory.code_artifact_ids ?? [])),
    ]
      .filter(validId).slice(0, MAX_EXPANSION_ATTACHMENTS);
    const fileIds = [...new Set(request.memories.flatMap((memory) => memory.file_ids ?? []))]
      .filter(validId).slice(0, MAX_EXPANSION_ATTACHMENTS);
    const [documents, artifacts] = await Promise.all([
      Promise.all(documentIds.map((id) =>
        safeCall(() => this.client.getDocument(id, request.signal), request.signal))),
      Promise.all(artifactIds.map((id) =>
        safeCall(() => this.client.getCodeArtifact(id, request.signal), request.signal))),
    ]);
    let files: FileSummary[] = [];
    if (fileIds.length > 0 && request.scope === "project" && validId(request.projectId)) {
      const summaries = await safeCall(
        () => this.client.listFiles(request.projectId, request.signal),
        request.signal,
      );
      files = (summaries ?? []).filter((file) =>
        fileIds.includes(file.id) &&
        inProjectScope(file.project_id, request.scope, request.projectId));
    }
    return {
      documents: documents.filter((document): document is Document =>
        document !== undefined && inProjectScope(
          document.project_id,
          request.scope,
          request.projectId,
        )),
      artifacts: artifacts.filter((artifact): artifact is CodeArtifact =>
        artifact !== undefined && inProjectScope(
          artifact.project_id,
          request.scope,
          request.projectId,
        )),
      files,
      fileIds: request.scope === "global" ? fileIds : files.map((file) => file.id),
    };
  }

  private formatExpansion(
    entities: Entity[],
    relationships: { relationship: EntityRelationship; source: Entity; target: Entity }[],
    linkedMemories: { entity: Entity; id: number; title: string }[],
    attachments: {
      documents: Document[];
      artifacts: CodeArtifact[];
      files: FileSummary[];
      fileIds: number[];
    },
  ): KnowledgeExpansionResult {
    const lines: string[] = [];
    const entityIds = entities.map((entity) => entity.id);
    const relationshipIds = relationships.map(({ relationship }) => relationship.id);
    const documentIds = attachments.documents.map((document) => document.id);
    const codeArtifactIds = attachments.artifacts.map((artifact) => artifact.id);
    const fileIds = attachments.fileIds;
    const memoryIds = linkedMemories.map((memory) => memory.id);
    if (entities.length > 0) appendLine(lines, "Entities:", this.maxExpansionChars);
    for (const entity of entities) {
      if (!appendLine(
        lines,
        `- Entity #${entity.id}: ${clean(entity.name, 200)}`,
        this.maxExpansionChars,
      )) break;
      appendLine(
        lines,
        `  Type: ${clean(entity.entity_type, 80)}`,
        this.maxExpansionChars,
      );
      if (entity.notes) {
        appendLine(
          lines,
          `  Notes: ${clean(entity.notes, 400)}`,
          this.maxExpansionChars,
        );
      }
    }
    for (const { relationship, source, target } of relationships) {
      if (!appendLine(
        lines,
        `- Relationship #${relationship.id}: ${clean(source.name, 120)} ` +
          `-[${clean(relationship.relationship_type, 120)}]-> ` +
          clean(target.name, 120),
        this.maxExpansionChars,
      )) break;
    }
    for (const linked of linkedMemories) {
      if (!appendLine(
        lines,
        `- Entity memory #${linked.id} (${clean(linked.entity.name, 120)}): ` +
          clean(linked.title, 240),
        this.maxExpansionChars,
      )) break;
    }
    for (const document of attachments.documents) {
      if (!appendLine(
        lines,
        `- Document #${document.id}: ${clean(document.title, 200)}`,
        this.maxExpansionChars,
      )) break;
      if (document.description) {
        appendLine(
          lines,
          `  ${clean(document.description, 300)}`,
          this.maxExpansionChars,
        );
      }
      for (const chunk of chunkText(document.content, MAX_ATTACHMENT_CHARS).slice(0, 2)) {
        if (!appendLine(
          lines,
          `  ${clean(chunk, MAX_ATTACHMENT_CHARS)}`,
          this.maxExpansionChars,
        )) break;
      }
    }
    for (const artifact of attachments.artifacts) {
      if (!appendLine(
        lines,
        `- Code artifact #${artifact.id}: ${clean(artifact.title, 200)} ` +
          `[${clean(artifact.language, 80)}]`,
        this.maxExpansionChars,
      )) break;
      if (artifact.description) {
        appendLine(
          lines,
          `  ${clean(artifact.description, 300)}`,
          this.maxExpansionChars,
        );
      }
      for (const chunk of chunkText(artifact.code, MAX_ATTACHMENT_CHARS).slice(0, 2)) {
        if (!appendLine(
          lines,
          `  ${clean(chunk, MAX_ATTACHMENT_CHARS)}`,
          this.maxExpansionChars,
        )) break;
      }
    }
    for (const file of attachments.files) {
      if (!appendLine(
        lines,
        `- File #${file.id}: ${clean(file.filename, 200)} ` +
          `(${clean(file.mime_type, 100)}, ${file.size_bytes} bytes; explicit read required)`,
        this.maxExpansionChars,
      )) break;
      if (file.description) {
        appendLine(
          lines,
          `  ${clean(file.description, 300)}`,
          this.maxExpansionChars,
        );
      }
    }
    const summarizedFileIds = new Set(attachments.files.map((file) => file.id));
    for (const fileId of fileIds) {
      if (summarizedFileIds.has(fileId)) continue;
      appendLine(
        lines,
        `- File #${fileId}: explicit read required`,
        this.maxExpansionChars,
      );
    }
    return {
      text: lines.join("\n"),
      memoryIds,
      entityIds,
      relationshipIds,
      documentIds,
      codeArtifactIds,
      fileIds,
    };
  }

  private emptyExpansion(): KnowledgeExpansionResult {
    return {
      text: "",
      memoryIds: [],
      entityIds: [],
      relationshipIds: [],
      documentIds: [],
      codeArtifactIds: [],
      fileIds: [],
    };
  }
}
