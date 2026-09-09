import type {
  CodeArtifact,
  CodeArtifactInput,
  CodeArtifactSummary,
  Document,
  DocumentInput,
  DocumentSummary,
  Entity,
  EntityInput,
  EntityRelationship,
  EntityRelationshipInput,
  KnowledgeClient,
  Memory,
} from "./contracts.ts";

type WriteClient = Pick<
  KnowledgeClient,
  | "searchEntities"
  | "getEntity"
  | "createEntity"
  | "updateEntity"
  | "getEntityMemories"
  | "listDocuments"
  | "getDocument"
  | "createDocument"
  | "listCodeArtifacts"
  | "getCodeArtifact"
  | "createCodeArtifact"
  | "getRelationships"
  | "createRelationship"
  | "linkEntityMemory"
  | "linkMemories"
  | "updateMemory"
>;

export interface KnowledgeEntityPlan {
  key: string;
  input: EntityInput;
}

export interface KnowledgeDocumentPlan {
  key: string;
  input: DocumentInput;
}

export interface KnowledgeCodeArtifactPlan {
  key: string;
  input: CodeArtifactInput;
}

export interface KnowledgeRelationshipPlan {
  key: string;
  sourceEntityKey: string;
  targetEntityKey: string;
  input: EntityRelationshipInput;
}

export interface KnowledgeEntityMemoryLinkPlan {
  entityKey: string;
}

export interface KnowledgeWritePlan {
  operationId: string;
  projectId: number;
  memoryId: number;
  expectedClaim?: { title: string; content: string };
  attachResources?: boolean;
  existingDocumentIds?: number[];
  existingCodeArtifactIds?: number[];
  entities?: KnowledgeEntityPlan[];
  documents?: KnowledgeDocumentPlan[];
  codeArtifacts?: KnowledgeCodeArtifactPlan[];
  relationships?: KnowledgeRelationshipPlan[];
  entityMemoryLinks?: KnowledgeEntityMemoryLinkPlan[];
  linkedMemoryIds?: number[];
}

export interface KnowledgeWriteReceipt {
  key: string;
  id: number;
}

export interface KnowledgeWriteState {
  entities: KnowledgeWriteReceipt[];
  documents: KnowledgeWriteReceipt[];
  codeArtifacts: KnowledgeWriteReceipt[];
  relationships: KnowledgeWriteReceipt[];
  entityMemoryLinks: string[];
  linkedMemories: string[];
  attachmentsApplied?: boolean;
}

export type KnowledgeWriteCheckpoint = (
  state: KnowledgeWriteState,
) => Promise<void>;

export type KnowledgeWriteGuard = () => Promise<void>;

export type KnowledgeMemoryReader = (
  id: number,
  signal?: AbortSignal,
) => Promise<Memory>;

function copyState(value: KnowledgeWriteState): KnowledgeWriteState {
  return {
    entities: value.entities.map((receipt) => ({ ...receipt })),
    documents: value.documents.map((receipt) => ({ ...receipt })),
    codeArtifacts: value.codeArtifacts.map((receipt) => ({ ...receipt })),
    relationships: value.relationships.map((receipt) => ({ ...receipt })),
    entityMemoryLinks: [...value.entityMemoryLinks],
    linkedMemories: [...value.linkedMemories],
    ...(value.attachmentsApplied === undefined
      ? {}
      : { attachmentsApplied: value.attachmentsApplied }),
  };
}

function positiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function sortedStrings(values: string[] | undefined): string[] {
  return [...(values ?? [])].map(normalized).sort();
}

function provenance(value: {
  source_repo?: string;
  source_files?: string[];
  source_url?: string;
  encoding_version?: string;
}): string {
  return JSON.stringify({
    source_repo: value.source_repo ?? null,
    source_files: sortedStrings(value.source_files),
    source_url: value.source_url ?? null,
  });
}

function documentFingerprint(value: DocumentInput | Document): string {
  return JSON.stringify({
    title: normalized(value.title),
    description: value.description.trim(),
    content: value.content,
    document_type: value.document_type ?? "text",
    tags: sortedStrings(value.tags),
    project_id: value.project_id ?? null,
    provenance: provenance(value),
  });
}

function codeArtifactFingerprint(
  value: CodeArtifactInput | CodeArtifact,
): string {
  return JSON.stringify({
    title: normalized(value.title),
    description: value.description.trim(),
    code: value.code,
    language: normalized(value.language),
    tags: sortedStrings(value.tags),
    project_id: value.project_id ?? null,
    provenance: provenance(value),
  });
}

function entityMatches(input: EntityInput, entity: Entity): boolean {
  const wanted = normalized(input.name);
  const sameName =
    normalized(entity.name) === wanted ||
    entity.aka.some((alias) => normalized(alias) === wanted);
  if (!sameName || entity.entity_type !== input.entity_type) return false;
  if (
    input.entity_type === "Other" &&
    normalized(entity.custom_type ?? "") !== normalized(input.custom_type ?? "")
  ) {
    return false;
  }
  const sharesProject = input.project_ids.some((id) =>
    entity.project_ids.includes(id),
  );
  const sharesSource =
    input.source_repo !== undefined &&
    input.source_repo === entity.source_repo;
  return sharesProject || sharesSource;
}

function sameEntityIdentity(input: EntityInput, entity: Entity): boolean {
  const wanted = normalized(input.name);
  return (
    (normalized(entity.name) === wanted ||
      entity.aka.some((alias) => normalized(alias) === wanted)) &&
    entity.entity_type === input.entity_type &&
    (input.entity_type !== "Other" ||
      normalized(entity.custom_type ?? "") ===
        normalized(input.custom_type ?? ""))
  );
}

function stateWithNumber(
  values: KnowledgeWriteReceipt[],
  key: string,
  id: number,
): void {
  if (!positiveId(id)) throw new Error(`Invalid knowledge ID for ${key}`);
  const index = values.findIndex((receipt) => receipt.key === key);
  const receipt = { key, id };
  if (index < 0) values.push(receipt);
  else values[index] = receipt;
}

function stateId(values: KnowledgeWriteReceipt[], key: string): number | undefined {
  return values.find((receipt) => receipt.key === key)?.id;
}

function stateIds(values: KnowledgeWriteReceipt[]): number[] {
  return values.map((receipt) => receipt.id);
}

function uniqueIds(values: number[], label: string): number[] {
  const ids = [...new Set(values)];
  if (ids.some((id) => !positiveId(id))) {
    throw new Error(`Invalid knowledge ${label} ID`);
  }
  return ids;
}

function sameIds(left: number[] | undefined, right: number[]): boolean {
  const a = [...new Set(left ?? [])].sort((x, y) => x - y);
  const b = [...new Set(right)].sort((x, y) => x - y);
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function receipts(value: unknown): KnowledgeWriteReceipt[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is KnowledgeWriteReceipt =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as KnowledgeWriteReceipt).key === "string" &&
            positiveId((item as KnowledgeWriteReceipt).id),
        ),
    );
  }
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([, id]) => positiveId(id))
    .map(([key, id]) => ({ key, id: id as number }));
}

function normalizedState(previous: Partial<KnowledgeWriteState>): KnowledgeWriteState {
  return {
    entities: receipts(previous.entities),
    documents: receipts(previous.documents),
    codeArtifacts: receipts(previous.codeArtifacts),
    relationships: receipts(previous.relationships),
    entityMemoryLinks: Array.isArray(previous.entityMemoryLinks)
      ? [...previous.entityMemoryLinks]
      : [],
    linkedMemories: Array.isArray(previous.linkedMemories)
      ? [...previous.linkedMemories]
      : [],
    ...(previous.attachmentsApplied === undefined
      ? {}
      : { attachmentsApplied: previous.attachmentsApplied }),
  };
}

function hasValue(values: string[], value: string): boolean {
  return values.includes(value);
}

async function findDocument(
  client: WriteClient,
  input: DocumentInput,
  signal?: AbortSignal,
): Promise<Document | undefined> {
  const summaries = await client.listDocuments(input.project_id ?? undefined, signal);
  const wanted = documentFingerprint(input);
  for (const summary of summaries as DocumentSummary[]) {
    if (
      normalized(summary.title) !== normalized(input.title) ||
      (summary.project_id ?? null) !== (input.project_id ?? null)
    ) {
      continue;
    }
    const document = await client.getDocument(summary.id, signal);
    if (documentFingerprint(document) === wanted) return document;
  }
  return undefined;
}

async function findCodeArtifact(
  client: WriteClient,
  input: CodeArtifactInput,
  signal?: AbortSignal,
): Promise<CodeArtifact | undefined> {
  const summaries = await client.listCodeArtifacts(
    input.project_id ?? undefined,
    signal,
  );
  const wanted = codeArtifactFingerprint(input);
  for (const summary of summaries as CodeArtifactSummary[]) {
    if (
      normalized(summary.title) !== normalized(input.title) ||
      (summary.project_id ?? null) !== (input.project_id ?? null)
    ) {
      continue;
    }
    const artifact = await client.getCodeArtifact(summary.id, signal);
    if (codeArtifactFingerprint(artifact) === wanted) return artifact;
  }
  return undefined;
}

/** Writes rich knowledge with a durable receipt after every completed operation. */
export class KnowledgeWriter {
  constructor(
    private readonly client: WriteClient,
    private readonly readMemory?: KnowledgeMemoryReader,
  ) {}

  private async currentMemory(
    plan: KnowledgeWritePlan,
    signal?: AbortSignal,
  ): Promise<Memory> {
    if (!this.readMemory) {
      throw new Error("Knowledge writes require a memory validation reader");
    }
    const memory = await this.readMemory(plan.memoryId, signal);
    if (memory.is_obsolete) {
      throw new Error("Destination memory is obsolete");
    }
    if (!memory.project_ids.includes(plan.projectId)) {
      throw new Error("Destination memory is outside the project");
    }
    if (
      plan.expectedClaim &&
      (memory.title !== plan.expectedClaim.title ||
        memory.content !== plan.expectedClaim.content)
    ) {
      throw new Error("Destination memory claim changed");
    }
    return memory;
  }

  private async entityInProject(
    id: number,
    projectId: number,
    signal?: AbortSignal,
  ): Promise<Entity> {
    const entity = await this.client.getEntity(id, signal);
    if (!entity.project_ids.includes(projectId)) {
      throw new Error("Knowledge entity is outside the destination project");
    }
    return entity;
  }

  private async documentInProject(
    id: number,
    projectId: number,
    signal?: AbortSignal,
  ): Promise<Document> {
    const document = await this.client.getDocument(id, signal);
    if (document.project_id !== projectId) {
      throw new Error("Knowledge document is outside the destination project");
    }
    return document;
  }

  private async codeArtifactInProject(
    id: number,
    projectId: number,
    signal?: AbortSignal,
  ): Promise<CodeArtifact> {
    const artifact = await this.client.getCodeArtifact(id, signal);
    if (artifact.project_id !== projectId) {
      throw new Error(
        "Knowledge code artifact is outside the destination project",
      );
    }
    return artifact;
  }

  private async validateReceipts(
    state: KnowledgeWriteState,
    plan: KnowledgeWritePlan,
    signal?: AbortSignal,
  ): Promise<void> {
    for (const receipt of state.entities) {
      await this.entityInProject(receipt.id, plan.projectId, signal);
    }
    for (const receipt of state.documents) {
      await this.documentInProject(receipt.id, plan.projectId, signal);
    }
    for (const receipt of state.codeArtifacts) {
      await this.codeArtifactInProject(receipt.id, plan.projectId, signal);
    }
  }

  private async validateAttachments(
    documentIds: number[],
    codeArtifactIds: number[],
    projectId: number,
    signal?: AbortSignal,
  ): Promise<void> {
    for (const id of documentIds) {
      await this.documentInProject(id, projectId, signal);
    }
    for (const id of codeArtifactIds) {
      await this.codeArtifactInProject(id, projectId, signal);
    }
  }

  async execute(
    plan: KnowledgeWritePlan,
    previous: Partial<KnowledgeWriteState> = {},
    checkpoint?: KnowledgeWriteCheckpoint,
    signal?: AbortSignal,
    beforeWrite?: KnowledgeWriteGuard,
  ): Promise<KnowledgeWriteState> {
    if (!positiveId(plan.projectId)) throw new Error("Invalid knowledge project ID");
    if (!positiveId(plan.memoryId)) throw new Error("Invalid knowledge memory ID");
    if (!plan.operationId.trim()) throw new Error("Missing knowledge operation ID");

    const state = normalizedState(previous);
    await this.currentMemory(plan, signal);
    await this.validateReceipts(state, plan, signal);
    const save = async (): Promise<void> => {
      if (checkpoint) await checkpoint(copyState(state));
    };

    for (const resource of plan.entities ?? []) {
      if (positiveId(stateId(state.entities, resource.key))) continue;
      const matches = await this.client.searchEntities(
        resource.input.name,
        100,
        signal,
      );
      const existingMatches = new Map<number, Entity>();
      for (const match of matches) {
        if (!sameEntityIdentity(resource.input, match)) continue;
        const full = await this.client.getEntity(match.id, signal);
        if (entityMatches(resource.input, full)) {
          existingMatches.set(full.id, full);
        }
      }
      if (existingMatches.size > 1) {
        throw new Error(
          `Ambiguous knowledge entity identity for ${resource.key}`,
        );
      }
      const existing = [...existingMatches.values()][0];
      let entity: Entity;
      if (existing) {
        const projectIds = [
          ...new Set([...existing.project_ids, ...resource.input.project_ids]),
        ];
        if (projectIds.length !== existing.project_ids.length) {
          await beforeWrite?.();
          entity = await this.client.updateEntity(
            existing.id,
            { project_ids: projectIds },
            signal,
          );
        } else {
          entity = existing;
        }
      } else {
        await beforeWrite?.();
        const created = await this.client.createEntity(resource.input, signal);
        entity = await this.client.getEntity(created.id, signal);
        const projectIds = [
          ...new Set([...entity.project_ids, ...resource.input.project_ids]),
        ];
        if (projectIds.length !== entity.project_ids.length) {
          await beforeWrite?.();
          entity = await this.client.updateEntity(
            entity.id,
            { project_ids: projectIds },
            signal,
          );
        }
      }
      stateWithNumber(state.entities, resource.key, entity.id);
      await save();
    }

    for (const resource of plan.documents ?? []) {
      if (positiveId(stateId(state.documents, resource.key))) continue;
      const existing = await findDocument(this.client, resource.input, signal);
      if (!existing) await beforeWrite?.();
      const document =
        existing ?? (await this.client.createDocument(resource.input, signal));
      stateWithNumber(state.documents, resource.key, document.id);
      await save();
    }

    for (const resource of plan.codeArtifacts ?? []) {
      if (positiveId(stateId(state.codeArtifacts, resource.key))) continue;
      const existing = await findCodeArtifact(
        this.client,
        resource.input,
        signal,
      );
      if (!existing) await beforeWrite?.();
      const artifact =
        existing ??
        (await this.client.createCodeArtifact(resource.input, signal));
      stateWithNumber(state.codeArtifacts, resource.key, artifact.id);
      await save();
    }

    if (plan.attachResources) {
      let memory = await this.currentMemory(plan, signal);
      const requestedDocumentIds = uniqueIds(
        [...(plan.existingDocumentIds ?? []), ...stateIds(state.documents)],
        "document",
      );
      const requestedCodeArtifactIds = uniqueIds(
        [
          ...(plan.existingCodeArtifactIds ?? []),
          ...stateIds(state.codeArtifacts),
        ],
        "code artifact",
      );
      let documentIds = uniqueIds(
        [...(memory.document_ids ?? []), ...requestedDocumentIds],
        "document",
      );
      let codeArtifactIds = uniqueIds(
        [...(memory.code_artifact_ids ?? []), ...requestedCodeArtifactIds],
        "code artifact",
      );
      await this.validateAttachments(
        documentIds,
        codeArtifactIds,
        plan.projectId,
        signal,
      );

      let updated = false;
      if (
        !sameIds(memory.document_ids, documentIds) ||
        !sameIds(memory.code_artifact_ids, codeArtifactIds)
      ) {
        if (memory.project_ids.length > 1) {
          throw new Error("Shared memories cannot receive rich attachments");
        }
        memory = await this.currentMemory(plan, signal);
        documentIds = uniqueIds(
          [...(memory.document_ids ?? []), ...requestedDocumentIds],
          "document",
        );
        codeArtifactIds = uniqueIds(
          [...(memory.code_artifact_ids ?? []), ...requestedCodeArtifactIds],
          "code artifact",
        );
        await this.validateAttachments(
          documentIds,
          codeArtifactIds,
          plan.projectId,
          signal,
        );
        if (memory.project_ids.length > 1) {
          throw new Error("Shared memories cannot receive rich attachments");
        }
        if (
          !sameIds(memory.document_ids, documentIds) ||
          !sameIds(memory.code_artifact_ids, codeArtifactIds)
        ) {
          await beforeWrite?.();
          await this.client.updateMemory(
            plan.memoryId,
            {
              ...(documentIds.length ? { document_ids: documentIds } : {}),
              ...(codeArtifactIds.length
                ? { code_artifact_ids: codeArtifactIds }
                : {}),
            },
            signal,
          );
          updated = true;
        }
      }
      if (!state.attachmentsApplied || updated) {
        state.attachmentsApplied = true;
        await save();
      }
    }

    for (const resource of plan.relationships ?? []) {
      const sourceId = stateId(state.entities, resource.sourceEntityKey);
      const targetId = stateId(state.entities, resource.targetEntityKey);
      if (!positiveId(sourceId) || !positiveId(targetId)) {
        throw new Error(`Relationship references an unknown entity: ${resource.key}`);
      }
      await this.entityInProject(sourceId, plan.projectId, signal);
      await this.entityInProject(targetId, plan.projectId, signal);
      const relationships = await this.client.getRelationships(sourceId, signal);
      const existing = relationships.find(
        (relationship) =>
          relationship.source_entity_id === sourceId &&
          relationship.target_entity_id === targetId &&
          relationship.relationship_type === resource.input.relationship_type,
      );
      let relationship: EntityRelationship;
      if (existing) {
        relationship = existing;
      } else {
        if (positiveId(stateId(state.relationships, resource.key))) {
          state.relationships = state.relationships.filter(
            (receipt) => receipt.key !== resource.key,
          );
        }
        await beforeWrite?.();
        relationship = await this.client.createRelationship(
          {
            ...resource.input,
            source_entity_id: sourceId,
            target_entity_id: targetId,
          },
          signal,
        );
      }
      stateWithNumber(state.relationships, resource.key, relationship.id);
      await save();
    }

    for (const resource of plan.entityMemoryLinks ?? []) {
      const entityId = stateId(state.entities, resource.entityKey);
      if (!positiveId(entityId)) {
        throw new Error(`Memory link references an unknown entity: ${resource.entityKey}`);
      }
      await this.entityInProject(entityId, plan.projectId, signal);
      const key = `${resource.entityKey}:${plan.memoryId}`;
      const linked = await this.client.getEntityMemories(entityId, signal);
      if (
        hasValue(state.entityMemoryLinks, key) &&
        linked.some((memory) => memory.id === plan.memoryId)
      ) {
        continue;
      }
      if (linked.some((memory) => memory.id === plan.memoryId)) {
        state.entityMemoryLinks.push(key);
        await save();
        continue;
      }
      await this.currentMemory(plan, signal);
      await beforeWrite?.();
      await this.client.linkEntityMemory(entityId, plan.memoryId, signal);
      if (!hasValue(state.entityMemoryLinks, key)) {
        state.entityMemoryLinks.push(key);
      }
      await save();
    }

    for (const linkedMemoryId of new Set(plan.linkedMemoryIds ?? [])) {
      if (!positiveId(linkedMemoryId)) {
        throw new Error("Invalid linked memory ID");
      }
      const key = `${plan.memoryId}:${linkedMemoryId}`;
      if (!this.readMemory) {
        throw new Error("Linked memories require a memory validation reader");
      }
      let sourceMemory = await this.currentMemory(plan, signal);
      const linkedMemory = await this.readMemory(linkedMemoryId, signal);
      if (linkedMemory.is_obsolete) {
        throw new Error("Linked memory is obsolete");
      }
      if (!linkedMemory.project_ids.includes(plan.projectId)) {
        throw new Error("Linked memory is outside the destination project");
      }
      if (
        hasValue(state.linkedMemories, key) &&
        (sourceMemory.linked_memory_ids ?? []).includes(linkedMemoryId)
      ) {
        continue;
      }
      if ((sourceMemory.linked_memory_ids ?? []).includes(linkedMemoryId)) {
        state.linkedMemories.push(key);
        await save();
        continue;
      }
      sourceMemory = await this.currentMemory(plan, signal);
      if ((sourceMemory.linked_memory_ids ?? []).includes(linkedMemoryId)) {
        if (!hasValue(state.linkedMemories, key)) {
          state.linkedMemories.push(key);
        }
        await save();
        continue;
      }
      await beforeWrite?.();
      await this.client.linkMemories(plan.memoryId, [linkedMemoryId], signal);
      if (!hasValue(state.linkedMemories, key)) {
        state.linkedMemories.push(key);
      }
      await save();
    }

    return copyState(state);
  }
}
