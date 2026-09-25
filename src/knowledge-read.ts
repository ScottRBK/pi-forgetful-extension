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

type RelationshipExpansion = {
  relationship: EntityRelationship;
  source: Entity;
  target: Entity;
};

type LinkedMemoryExpansion = { entity: Entity; id: number; title: string };

interface Attachments {
  documents: Document[];
  artifacts: CodeArtifact[];
  files: FileSummary[];
  fileIds: number[];
}

export type MemoryReader = (
  id: number,
  signal?: AbortSignal,
) => Promise<Memory>;

export interface KnowledgeReadServiceOptions {
  readMemory?: MemoryReader;
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

function clean(value: string): string {
  return sanitizeText(value);
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

  constructor(
    private readonly client: KnowledgeClient,
    options: KnowledgeReadServiceOptions | MemoryReader = {},
  ) {
    if (typeof options === "function") this.readMemory = options;
    else this.readMemory = options.readMemory;
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
      if (entity?.id === candidate.id && validEntity(entity) &&
          inEntityScope(entity, request.scope, request.projectId)) return entity;
      return inEntityScope(candidate, request.scope, request.projectId) ? candidate : undefined;
    }).filter((entity): entity is Entity => entity !== undefined);
  }

  private async findRelationships(
    entities: Entity[],
    request: KnowledgeExpansionRequest,
  ): Promise<RelationshipExpansion[]> {
    const relationships = await this.collectRelationships(entities, request.signal);
    const endpoints = await this.resolveRelationshipEndpoints(
      entities,
      relationships,
      request.signal,
    );
    return this.formatRelationships(entities, relationships, endpoints, request);
  }

  private async collectRelationships(
    entities: Entity[],
    signal?: AbortSignal,
  ): Promise<EntityRelationship[]> {
    const relationshipResults = await Promise.all(entities.map((entity) =>
      safeCall(() => this.client.getRelationships(entity.id, signal), signal)));
    const relationships = new Map<number, EntityRelationship>();
    for (const result of relationshipResults) {
      for (const relationship of (result ?? []).slice(0, MAX_EXPANSION_RELATIONSHIPS)) {
        if (validRelationship(relationship)) relationships.set(relationship.id, relationship);
        if (relationships.size >= MAX_EXPANSION_RELATIONSHIPS) break;
      }
      if (relationships.size >= MAX_EXPANSION_RELATIONSHIPS) break;
    }
    return [...relationships.values()].slice(0, MAX_EXPANSION_RELATIONSHIPS);
  }

  private async resolveRelationshipEndpoints(
    entities: Entity[],
    relationships: EntityRelationship[],
    signal?: AbortSignal,
  ): Promise<Map<number, Entity>> {
    const endpoints = new Map(entities.map((entity) => [entity.id, entity]));
    const endpointIds = relationships.flatMap((relationship) => [
      relationship.source_entity_id,
      relationship.target_entity_id,
    ]);
    const missingIds = [...new Set(endpointIds)].filter((id) => !endpoints.has(id));
    const fetched = await Promise.all(missingIds.map((id) =>
      safeCall(() => this.client.getEntity(id, signal), signal)));
    for (let index = 0; index < missingIds.length; index += 1) {
      const entity = fetched[index];
      if (entity?.id === missingIds[index] && validEntity(entity)) {
        endpoints.set(entity.id, entity);
      }
    }
    return endpoints;
  }

  private formatRelationships(
    entities: Entity[],
    relationships: EntityRelationship[],
    endpoints: Map<number, Entity>,
    request: KnowledgeExpansionRequest,
  ): RelationshipExpansion[] {
    const result: RelationshipExpansion[] = [];
    for (const relationship of relationships) {
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
  ): Promise<LinkedMemoryExpansion[]> {
    const linked = await Promise.all(entities.map((entity) =>
      safeCall(() => this.client.getEntityMemories(entity.id, request.signal), request.signal)));
    return this.collectEntityMemories(entities, linked, request);
  }

  private async collectEntityMemories(
    entities: Entity[],
    linked: ({ id: number; title: string }[] | undefined)[],
    request: KnowledgeExpansionRequest,
  ): Promise<LinkedMemoryExpansion[]> {
    const result: LinkedMemoryExpansion[] = [];
    const seen = new Set<number>();
    for (let index = 0; index < linked.length; index += 1) {
      for (const item of (linked[index] ?? []).slice(0, MAX_ENTITY_MEMORIES_PER_ENTITY)) {
        if (!validId(item.id) || typeof item.title !== "string" || seen.has(item.id)) continue;
        if (!await this.isAllowedEntityMemory(item.id, request)) continue;
        seen.add(item.id);
        result.push({ entity: entities[index], id: item.id, title: item.title });
        if (result.length >= MAX_EXPANSION_MEMORY_LINKS) return result;
      }
    }
    return result;
  }

  private async isAllowedEntityMemory(
    id: number,
    request: KnowledgeExpansionRequest,
  ): Promise<boolean> {
    if (!this.readMemory) return request.scope !== "project";
    const memory = await safeCall(
      () => this.readMemory!(id, request.signal),
      request.signal,
    );
    return Boolean(
      memory && validMemory(memory) &&
      (request.scope !== "project" || memory.project_ids.includes(request.projectId!)),
    );
  }

  private async findAttachments(request: KnowledgeExpansionRequest): Promise<Attachments> {
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
    relationships: RelationshipExpansion[],
    linkedMemories: LinkedMemoryExpansion[],
    attachments: Attachments,
  ): KnowledgeExpansionResult {
    const lines: string[] = [];
    const entityIds = entities.map((entity) => entity.id);
    const relationshipIds = relationships.map(({ relationship }) => relationship.id);
    const documentIds = attachments.documents.map((document) => document.id);
    const codeArtifactIds = attachments.artifacts.map((artifact) => artifact.id);
    const fileIds = attachments.fileIds;
    const memoryIds = linkedMemories.map((memory) => memory.id);

    this.appendEntityLines(lines, entities);
    this.appendRelationshipLines(lines, relationships);
    this.appendLinkedMemoryLines(lines, linkedMemories);
    this.appendDocumentLines(lines, attachments.documents);
    this.appendArtifactLines(lines, attachments.artifacts);
    this.appendFileLines(lines, attachments.files, fileIds);

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

  private appendEntityLines(lines: string[], entities: Entity[]): void {
    if (entities.length > 0) lines.push("Entities:");
    for (const entity of entities) {
      lines.push(`- Entity #${entity.id}: ${clean(entity.name)}`);
      lines.push(`  Type: ${clean(entity.entity_type)}`);
      if (entity.notes) {
        lines.push(`  Notes: ${clean(entity.notes)}`);
      }
    }
  }

  private appendRelationshipLines(
    lines: string[],
    relationships: RelationshipExpansion[],
  ): void {
    for (const { relationship, source, target } of relationships) {
      lines.push(
        `- Relationship #${relationship.id}: ${clean(source.name)} ` +
          `-[${clean(relationship.relationship_type)}]-> ${clean(target.name)}`,
      );
    }
  }

  private appendLinkedMemoryLines(
    lines: string[],
    linkedMemories: LinkedMemoryExpansion[],
  ): void {
    for (const linked of linkedMemories) {
      lines.push(
        `- Entity memory #${linked.id} (${clean(linked.entity.name)}): ` +
          clean(linked.title),
      );
    }
  }

  private appendDocumentLines(lines: string[], documents: Document[]): void {
    for (const document of documents) {
      lines.push(`- Document #${document.id}: ${clean(document.title)}`);
      if (document.description) {
        lines.push(`  ${clean(document.description)}`);
      }
      lines.push(`  ${clean(document.content)}`);
    }
  }

  private appendArtifactLines(lines: string[], artifacts: CodeArtifact[]): void {
    for (const artifact of artifacts) {
      lines.push(
        `- Code artifact #${artifact.id}: ${clean(artifact.title)} ` +
          `[${clean(artifact.language)}]`,
      );
      if (artifact.description) {
        lines.push(`  ${clean(artifact.description)}`);
      }
      lines.push(`  ${clean(artifact.code)}`);
    }
  }

  private appendFileLines(
    lines: string[],
    files: FileSummary[],
    fileIds: number[],
  ): void {
    for (const file of files) {
      lines.push(
        `- File #${file.id}: ${clean(file.filename)} ` +
          `(${clean(file.mime_type)}, ${file.size_bytes} bytes; explicit read required)`,
      );
      if (file.description) {
        lines.push(`  ${clean(file.description)}`);
      }
    }
    const summarizedFileIds = new Set(files.map((file) => file.id));
    for (const fileId of fileIds) {
      if (summarizedFileIds.has(fileId)) continue;
      lines.push(`- File #${fileId}: explicit read required`);
    }
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
