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

type KnowledgeWriteSave = () => Promise<void>;

interface KnowledgeAttachmentIds {
  documentIds: number[];
  codeArtifactIds: number[];
}

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

function compareCanonicalStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function sortedStrings(values: string[] | undefined): string[] {
  return [...(values ?? [])].map(normalized).sort(compareCanonicalStrings);
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

  private validatePlan(plan: KnowledgeWritePlan): void {
    if (!positiveId(plan.projectId)) {
      throw new Error("Invalid knowledge project ID");
    }
    if (!positiveId(plan.memoryId)) {
      throw new Error("Invalid knowledge memory ID");
    }
    if (!plan.operationId.trim()) {
      throw new Error("Missing knowledge operation ID");
    }
  }

  private async findEntity(
    resource: KnowledgeEntityPlan,
    signal?: AbortSignal,
  ): Promise<Entity | undefined> {
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
    return [...existingMatches.values()][0];
  }

  private async ensureEntityProjects(
    entity: Entity,
    input: EntityInput,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Entity> {
    const projectIds = [
      ...new Set([...entity.project_ids, ...input.project_ids]),
    ];
    if (projectIds.length === entity.project_ids.length) return entity;
    await beforeWrite?.();
    return this.client.updateEntity(entity.id, { project_ids: projectIds }, signal);
  }

  private async writeEntity(
    resource: KnowledgeEntityPlan,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Entity> {
    const existing = await this.findEntity(resource, signal);
    if (existing) {
      return this.ensureEntityProjects(
        existing,
        resource.input,
        signal,
        beforeWrite,
      );
    }
    await beforeWrite?.();
    const created = await this.client.createEntity(resource.input, signal);
    const entity = await this.client.getEntity(created.id, signal);
    return this.ensureEntityProjects(
      entity,
      resource.input,
      signal,
      beforeWrite,
    );
  }

  private async writeEntities(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.entities ?? []) {
      if (positiveId(stateId(state.entities, resource.key))) continue;
      const entity = await this.writeEntity(resource, signal, beforeWrite);
      stateWithNumber(state.entities, resource.key, entity.id);
      await save();
    }
  }

  private async writeDocument(
    resource: KnowledgeDocumentPlan,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Document> {
    const existing = await findDocument(this.client, resource.input, signal);
    if (existing) return existing;
    await beforeWrite?.();
    return this.client.createDocument(resource.input, signal);
  }

  private async writeDocuments(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.documents ?? []) {
      if (positiveId(stateId(state.documents, resource.key))) continue;
      const document = await this.writeDocument(resource, signal, beforeWrite);
      stateWithNumber(state.documents, resource.key, document.id);
      await save();
    }
  }

  private async writeCodeArtifact(
    resource: KnowledgeCodeArtifactPlan,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<CodeArtifact> {
    const existing = await findCodeArtifact(
      this.client,
      resource.input,
      signal,
    );
    if (existing) return existing;
    await beforeWrite?.();
    return this.client.createCodeArtifact(resource.input, signal);
  }

  private async writeCodeArtifacts(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.codeArtifacts ?? []) {
      if (positiveId(stateId(state.codeArtifacts, resource.key))) continue;
      const artifact = await this.writeCodeArtifact(
        resource,
        signal,
        beforeWrite,
      );
      stateWithNumber(state.codeArtifacts, resource.key, artifact.id);
      await save();
    }
  }

  private requestedAttachmentIds(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
  ): KnowledgeAttachmentIds {
    return {
      documentIds: uniqueIds(
        [...(plan.existingDocumentIds ?? []), ...stateIds(state.documents)],
        "document",
      ),
      codeArtifactIds: uniqueIds(
        [
          ...(plan.existingCodeArtifactIds ?? []),
          ...stateIds(state.codeArtifacts),
        ],
        "code artifact",
      ),
    };
  }

  private attachmentIds(
    memory: Memory,
    requested: KnowledgeAttachmentIds,
  ): KnowledgeAttachmentIds {
    return {
      documentIds: uniqueIds(
        [...(memory.document_ids ?? []), ...requested.documentIds],
        "document",
      ),
      codeArtifactIds: uniqueIds(
        [...(memory.code_artifact_ids ?? []), ...requested.codeArtifactIds],
        "code artifact",
      ),
    };
  }

  private attachmentsDiffer(
    memory: Memory,
    ids: KnowledgeAttachmentIds,
  ): boolean {
    return (
      !sameIds(memory.document_ids, ids.documentIds) ||
      !sameIds(memory.code_artifact_ids, ids.codeArtifactIds)
    );
  }

  private ensureMemoryCanReceiveAttachments(memory: Memory): void {
    if (memory.project_ids.length > 1) {
      throw new Error("Shared memories cannot receive rich attachments");
    }
  }

  private attachmentPatch(ids: KnowledgeAttachmentIds): {
    document_ids?: number[];
    code_artifact_ids?: number[];
  } {
    return {
      ...(ids.documentIds.length ? { document_ids: ids.documentIds } : {}),
      ...(ids.codeArtifactIds.length
        ? { code_artifact_ids: ids.codeArtifactIds }
        : {}),
    };
  }

  private async writeAttachments(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    const memory = await this.currentMemory(plan, signal);
    const requested = this.requestedAttachmentIds(plan, state);
    const ids = this.attachmentIds(memory, requested);
    await this.validateAttachments(
      ids.documentIds,
      ids.codeArtifactIds,
      plan.projectId,
      signal,
    );

    let updated = false;
    if (this.attachmentsDiffer(memory, ids)) {
      this.ensureMemoryCanReceiveAttachments(memory);
      const refreshedMemory = await this.currentMemory(plan, signal);
      const refreshedIds = this.attachmentIds(refreshedMemory, requested);
      await this.validateAttachments(
        refreshedIds.documentIds,
        refreshedIds.codeArtifactIds,
        plan.projectId,
        signal,
      );
      this.ensureMemoryCanReceiveAttachments(refreshedMemory);
      if (this.attachmentsDiffer(refreshedMemory, refreshedIds)) {
        await beforeWrite?.();
        await this.client.updateMemory(
          plan.memoryId,
          this.attachmentPatch(refreshedIds),
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

  private async writeRelationship(
    resource: KnowledgeRelationshipPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<EntityRelationship> {
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
    if (existing) return existing;
    if (positiveId(stateId(state.relationships, resource.key))) {
      state.relationships = state.relationships.filter(
        (receipt) => receipt.key !== resource.key,
      );
    }
    await beforeWrite?.();
    return this.client.createRelationship(
      {
        ...resource.input,
        source_entity_id: sourceId,
        target_entity_id: targetId,
      },
      signal,
    );
  }

  private async writeRelationships(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.relationships ?? []) {
      const relationship = await this.writeRelationship(
        resource,
        plan,
        state,
        signal,
        beforeWrite,
      );
      stateWithNumber(state.relationships, resource.key, relationship.id);
      await save();
    }
  }

  private async writeEntityMemoryLink(
    resource: KnowledgeEntityMemoryLinkPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    const entityId = stateId(state.entities, resource.entityKey);
    if (!positiveId(entityId)) {
      throw new Error(
        `Memory link references an unknown entity: ${resource.entityKey}`,
      );
    }
    await this.entityInProject(entityId, plan.projectId, signal);
    const key = `${resource.entityKey}:${plan.memoryId}`;
    const linked = await this.client.getEntityMemories(entityId, signal);
    const alreadyLinked = linked.some((memory) => memory.id === plan.memoryId);
    if (hasValue(state.entityMemoryLinks, key) && alreadyLinked) return;
    if (alreadyLinked) {
      state.entityMemoryLinks.push(key);
      await save();
      return;
    }
    await this.currentMemory(plan, signal);
    await beforeWrite?.();
    await this.client.linkEntityMemory(entityId, plan.memoryId, signal);
    if (!hasValue(state.entityMemoryLinks, key)) {
      state.entityMemoryLinks.push(key);
    }
    await save();
  }

  private async writeEntityMemoryLinks(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.entityMemoryLinks ?? []) {
      await this.writeEntityMemoryLink(
        resource,
        plan,
        state,
        save,
        signal,
        beforeWrite,
      );
    }
  }

  private async writeLinkedMemory(
    linkedMemoryId: number,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
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
    const sourceLinks = () => sourceMemory.linked_memory_ids ?? [];
    if (
      hasValue(state.linkedMemories, key) &&
      sourceLinks().includes(linkedMemoryId)
    ) {
      return;
    }
    if (sourceLinks().includes(linkedMemoryId)) {
      state.linkedMemories.push(key);
      await save();
      return;
    }
    sourceMemory = await this.currentMemory(plan, signal);
    if (sourceLinks().includes(linkedMemoryId)) {
      if (!hasValue(state.linkedMemories, key)) {
        state.linkedMemories.push(key);
      }
      await save();
      return;
    }
    await beforeWrite?.();
    await this.client.linkMemories(plan.memoryId, [linkedMemoryId], signal);
    if (!hasValue(state.linkedMemories, key)) {
      state.linkedMemories.push(key);
    }
    await save();
  }

  private async writeLinkedMemories(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const linkedMemoryId of new Set(plan.linkedMemoryIds ?? [])) {
      await this.writeLinkedMemory(
        linkedMemoryId,
        plan,
        state,
        save,
        signal,
        beforeWrite,
      );
    }
  }

  async execute(
    plan: KnowledgeWritePlan,
    previous: Partial<KnowledgeWriteState> = {},
    checkpoint?: KnowledgeWriteCheckpoint,
    signal?: AbortSignal,
    beforeWrite?: KnowledgeWriteGuard,
  ): Promise<KnowledgeWriteState> {
    this.validatePlan(plan);
    const state = normalizedState(previous);
    await this.currentMemory(plan, signal);
    await this.validateReceipts(state, plan, signal);
    const save = async (): Promise<void> => {
      if (checkpoint) await checkpoint(copyState(state));
    };
    await this.writeEntities(plan, state, save, signal, beforeWrite);
    await this.writeDocuments(plan, state, save, signal, beforeWrite);
    await this.writeCodeArtifacts(plan, state, save, signal, beforeWrite);
    if (plan.attachResources) {
      await this.writeAttachments(plan, state, save, signal, beforeWrite);
    }
    await this.writeRelationships(plan, state, save, signal, beforeWrite);
    await this.writeEntityMemoryLinks(plan, state, save, signal, beforeWrite);
    await this.writeLinkedMemories(plan, state, save, signal, beforeWrite);

    return copyState(state);
  }
}
