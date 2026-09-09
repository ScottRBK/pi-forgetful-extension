import type {
  Entity, EntityInput, EntityRelationship, EntityRelationshipInput, Provenance,
  Document, DocumentInput, DocumentSummary, CodeArtifact, CodeArtifactInput,
  CodeArtifactSummary, Memory, MemoryInput,
  FileSummary, StoredFile, KnowledgeClient,
} from "./contracts.ts";
import { ForgetfulSchemaError } from "./http.ts";

export type KnowledgeRequest = (
  path: string, method: string, body: Record<string, unknown> | undefined,
  signal: AbortSignal | undefined, statuses: number[],
) => Promise<unknown>;

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ForgetfulSchemaError("Forgetful knowledge record must be an object");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, max: number, empty = false): string {
  if (typeof value !== "string" || (!empty && !value.trim()) || value.length > max) {
    throw new ForgetfulSchemaError("Forgetful knowledge text is invalid or exceeds its limit");
  }
  return value;
}

function id(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new ForgetfulSchemaError("Forgetful knowledge ID must be a positive integer");
  }
  return value;
}

function ids(value: unknown): number[] {
  if (!Array.isArray(value) || value.length > 1000) {
    throw new ForgetfulSchemaError("Forgetful knowledge IDs must be a bounded array");
  }
  return value.map(id);
}

function strings(value: unknown, max = 10, width = 500): string[] {
  if (!Array.isArray(value) || value.length > max) {
    throw new ForgetfulSchemaError("Forgetful knowledge strings must be a bounded array");
  }
  return value.map((item) => text(item, width, true));
}

function records(value: unknown, key: string): unknown[] {
  const items = object(value)[key];
  if (!Array.isArray(items)) {
    throw new ForgetfulSchemaError(`Forgetful knowledge ${key} must be an array`);
  }
  return items;
}

function provenance(value: Record<string, unknown>): Provenance {
  return {
    ...(value.source_repo == null ? {} : { source_repo: text(value.source_repo, 200) }),
    ...(value.source_files == null ? {} : { source_files: strings(value.source_files, 100, 1000) }),
    ...(value.source_url == null ? {} : { source_url: text(value.source_url, 2048) }),
    ...(value.encoding_version == null ? {} : {
      encoding_version: text(value.encoding_version, 50),
    }),
  };
}

const entityTypes = new Set(["Organization", "Individual", "Team", "Device", "System", "Other"]);

function entityBody(input: Partial<EntityInput>, partial = false): Record<string, unknown> {
  const value = object(input);
  const result: Record<string, unknown> = { ...provenance(value) };
  if (!partial || value.name !== undefined) result.name = text(value.name, 200);
  if (!partial || value.entity_type !== undefined) {
    if (!entityTypes.has(value.entity_type as string)) {
      throw new ForgetfulSchemaError("Forgetful entity type is invalid");
    }
    result.entity_type = value.entity_type;
  }
  if (value.custom_type != null) result.custom_type = text(value.custom_type, 100);
  if (value.entity_type === "Other" && !result.custom_type) {
    throw new ForgetfulSchemaError("Other entities require a custom type");
  }
  if (value.notes != null) result.notes = text(value.notes, 4000, true);
  for (const key of ["aka", "tags"] as const) {
    if (!partial || value[key] !== undefined) result[key] = strings(value[key] ?? []);
  }
  if (!partial || value.project_ids !== undefined) {
    result.project_ids = ids(value.project_ids ?? []);
  }
  return result;
}

function entity(value: unknown): Entity {
  const item = object(value);
  return { ...entityBody(item as unknown as EntityInput), id: id(item.id) } as unknown as Entity;
}

function relationshipBody(input: EntityRelationshipInput): Record<string, unknown> {
  return {
    ...provenance(object(input)),
    source_entity_id: id(input.source_entity_id),
    target_entity_id: id(input.target_entity_id),
    relationship_type: text(input.relationship_type, 100),
  };
}

function relationship(value: unknown): EntityRelationship {
  const item = object(value);
  return {
    ...relationshipBody(item as unknown as EntityRelationshipInput), id: id(item.id),
  } as unknown as EntityRelationship;
}

export function memoryMetadata(value: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...provenance(value) };
  for (const key of ["document_ids", "code_artifact_ids", "file_ids"] as const) {
    if (value[key] !== undefined) result[key] = ids(value[key]);
  }
  return result;
}

function resourceBody(
  input: Partial<DocumentInput | CodeArtifactInput>, code: boolean, partial = false,
): Record<string, unknown> {
  const value = object(input);
  const result: Record<string, unknown> = { ...provenance(value) };
  const fields: [string, number][] = [["title", 500], ["description", 5000]];
  if (code) fields.push(["code", 50_000], ["language", 100]);
  else fields.push(["content", 100_000]);
  for (const [key, max] of fields) {
    if (!partial || value[key] !== undefined) result[key] = text(value[key], max);
  }
  if (!partial || value.tags !== undefined) result.tags = strings(value.tags ?? []);
  if (value.project_id !== undefined) {
    result.project_id = value.project_id === null ? null : id(value.project_id);
  }
  if (!code && value.document_type != null) {
    result.document_type = text(value.document_type, 100);
  }
  return result;
}

function document(value: unknown): Document {
  const item = object(value);
  return {
    ...resourceBody(item as unknown as DocumentInput, false), id: id(item.id),
  } as unknown as Document;
}

function artifact(value: unknown): CodeArtifact {
  const item = object(value);
  return {
    ...resourceBody(item as unknown as CodeArtifactInput, true), id: id(item.id),
  } as unknown as CodeArtifact;
}

function summary(value: unknown, code: boolean): DocumentSummary | CodeArtifactSummary {
  const item = object(value);
  const result = {
    ...provenance(item), id: id(item.id), title: text(item.title, 500),
    description: text(item.description, 5000), tags: strings(item.tags),
    project_id: item.project_id == null ? null : id(item.project_id),
  };
  return code ? { ...result, language: text(item.language, 100) } : result;
}

function projectPath(path: string, projectId?: number): string {
  return projectId === undefined ? path : `${path}?project_id=${id(projectId)}`;
}

function fileSummary(value: unknown): FileSummary {
  const item = object(value);
  if (!Number.isSafeInteger(item.size_bytes) || Number(item.size_bytes) < 0) {
    throw new ForgetfulSchemaError("Forgetful file size must be a non-negative integer");
  }
  return {
    id: id(item.id), filename: text(item.filename, 500),
    description: text(item.description, 5000), mime_type: text(item.mime_type, 255),
    size_bytes: Number(item.size_bytes), tags: strings(item.tags),
    project_id: item.project_id == null ? null : id(item.project_id),
  };
}

export class ApiKnowledgeClient implements KnowledgeClient {
  constructor(
    private readonly request: KnowledgeRequest,
    private readonly parseMemory: (value: unknown) => Memory,
  ) {}

  async searchEntities(query: string, limit = 10, signal?: AbortSignal): Promise<Entity[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new TypeError("Entity search limit must be between 1 and 100");
    }
    const result = await this.request("/entities/search", "POST", {
      query: text(query, 240), limit,
    }, signal, [200]);
    return records(result, "entities").map(entity);
  }

  async getEntity(entityId: number, signal?: AbortSignal): Promise<Entity> {
    return entity(await this.request(`/entities/${id(entityId)}`, "GET", undefined, signal, [200]));
  }

  async createEntity(input: EntityInput, signal?: AbortSignal): Promise<Entity> {
    return entity(await this.request("/entities", "POST", entityBody(input), signal, [201]));
  }

  async updateEntity(entityId: number, input: Partial<EntityInput>, signal?: AbortSignal) {
    return entity(await this.request(
      `/entities/${id(entityId)}`, "PUT", entityBody(input, true), signal, [200],
    ));
  }

  async getEntityMemories(entityId: number, signal?: AbortSignal) {
    const result = await this.request(`/entities/${id(entityId)}/memories`, "GET",
      undefined, signal, [200]);
    return records(result, "memories").map((raw) => {
      const item = object(raw);
      return { id: id(item.id), title: text(item.title, 200) };
    });
  }

  async linkEntityMemory(entityId: number, memoryId: number, signal?: AbortSignal): Promise<void> {
    const result = object(await this.request(`/entities/${id(entityId)}/memories`, "POST",
      { memory_id: id(memoryId) }, signal, [200]));
    if (result.success !== true) throw new ForgetfulSchemaError("Entity memory link failed");
  }

  async getRelationships(entityId: number, signal?: AbortSignal): Promise<EntityRelationship[]> {
    const result = await this.request(`/entities/${id(entityId)}/relationships`, "GET",
      undefined, signal, [200]);
    return records(result, "relationships").map(relationship);
  }

  async createRelationship(input: EntityRelationshipInput, signal?: AbortSignal) {
    return relationship(await this.request(`/entities/${id(input.source_entity_id)}/relationships`,
      "POST", relationshipBody(input), signal, [201]));
  }

  async listDocuments(projectId?: number, signal?: AbortSignal): Promise<DocumentSummary[]> {
    const result = await this.request(projectPath("/documents", projectId), "GET",
      undefined, signal, [200]);
    return records(result, "documents").map((item) => summary(item, false));
  }

  async getDocument(documentId: number, signal?: AbortSignal): Promise<Document> {
    return document(await this.request(`/documents/${id(documentId)}`, "GET",
      undefined, signal, [200]));
  }

  async createDocument(input: DocumentInput, signal?: AbortSignal): Promise<Document> {
    return document(await this.request("/documents", "POST", resourceBody(input, false),
      signal, [201]));
  }

  async updateDocument(documentId: number, input: Partial<DocumentInput>, signal?: AbortSignal) {
    return document(await this.request(`/documents/${id(documentId)}`, "PUT",
      resourceBody(input, false, true), signal, [200]));
  }

  async listCodeArtifacts(
    projectId?: number, signal?: AbortSignal,
  ): Promise<CodeArtifactSummary[]> {
    const result = await this.request(projectPath("/code-artifacts", projectId), "GET",
      undefined, signal, [200]);
    return records(result, "code_artifacts").map((item) =>
      summary(item, true) as CodeArtifactSummary);
  }

  async getCodeArtifact(artifactId: number, signal?: AbortSignal): Promise<CodeArtifact> {
    return artifact(await this.request(`/code-artifacts/${id(artifactId)}`, "GET",
      undefined, signal, [200]));
  }

  async createCodeArtifact(input: CodeArtifactInput, signal?: AbortSignal): Promise<CodeArtifact> {
    return artifact(await this.request("/code-artifacts", "POST", resourceBody(input, true),
      signal, [201]));
  }

  async updateCodeArtifact(
    artifactId: number, input: Partial<CodeArtifactInput>, signal?: AbortSignal,
  ) {
    return artifact(await this.request(`/code-artifacts/${id(artifactId)}`, "PUT",
      resourceBody(input, true, true), signal, [200]));
  }

  async updateMemory(memoryId: number, input: Partial<MemoryInput>, signal?: AbortSignal) {
    const value = object(input);
    const body = memoryMetadata(value);
    for (const [key, max] of [["title", 200], ["content", 2000], ["context", 500]] as const) {
      if (value[key] !== undefined) body[key] = text(value[key], max, key === "context");
    }
    for (const key of ["keywords", "tags"] as const) {
      if (value[key] !== undefined) body[key] = strings(value[key]);
    }
    if (value.project_ids !== undefined) body.project_ids = ids(value.project_ids);
    if (value.importance !== undefined) {
      if (!Number.isInteger(value.importance) || Number(value.importance) < 1 ||
          Number(value.importance) > 10) throw new TypeError("Importance must be between 1 and 10");
      body.importance = value.importance;
    }
    return this.parseMemory(await this.request(`/memories/${id(memoryId)}`, "PUT", body,
      signal, [200]));
  }

  async linkMemories(memoryId: number, relatedIds: number[], signal?: AbortSignal): Promise<void> {
    const expected = ids(relatedIds);
    const result = object(await this.request(`/memories/${id(memoryId)}/links`, "POST",
      { related_ids: expected }, signal, [200]));
    const newlyLinked = ids(result.linked_ids);
    if (expected.some((item) => !newlyLinked.includes(item))) {
      const current = this.parseMemory(await this.request(`/memories/${id(memoryId)}`, "GET",
        undefined, signal, [200]));
      if (expected.some((item) => !current.linked_memory_ids?.includes(item))) {
        throw new ForgetfulSchemaError("Forgetful did not confirm all requested memory links");
      }
    }
  }

  async listFiles(projectId?: number, signal?: AbortSignal): Promise<FileSummary[]> {
    const result = await this.request(projectPath("/files", projectId), "GET",
      undefined, signal, [200]);
    return records(result, "files").map(fileSummary);
  }

  async getFile(fileId: number, signal?: AbortSignal): Promise<StoredFile> {
    const result = object(await this.request(`/files/${id(fileId)}`, "GET",
      undefined, signal, [200]));
    const summary = fileSummary(result);
    const data = text(result.data, 14_000_000);
    const decoded = Buffer.from(data, "base64");
    if (decoded.toString("base64") !== data || decoded.length !== summary.size_bytes) {
      throw new ForgetfulSchemaError(
        "Forgetful file data does not match its base64 encoding or size",
      );
    }
    return { ...summary, data };
  }
}
