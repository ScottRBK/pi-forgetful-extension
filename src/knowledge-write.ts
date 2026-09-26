import { createHash } from "node:crypto";

import type {
  CodeArtifact,
  CodeArtifactInput,
  Document,
  DocumentInput,
  Entity,
  EntityInput,
  EntityRelationship,
  EntityRelationshipInput,
  KnowledgeClient,
  Memory,
} from "./contracts.ts";

type WriteClient = Pick<
  KnowledgeClient,
  | "getEntity"
  | "createEntity"
  | "getDocument"
  | "createDocument"
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
  existingId?: number;
  input: EntityInput;
}

export interface KnowledgeDocumentPlan {
  key: string;
  existingId?: number;
  input: DocumentInput;
}

export interface KnowledgeCodeArtifactPlan {
  key: string;
  existingId?: number;
  input: CodeArtifactInput;
}

export interface KnowledgeRelationshipPlan {
  key: string;
  existingId?: number;
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
  /** @deprecated Relevance is decided by the model, not by claim equality. */
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
  /** Exact instruction digest; omitted only by legacy or empty initial state. */
  instructionId?: string;
  entities: KnowledgeWriteReceipt[];
  documents: KnowledgeWriteReceipt[];
  codeArtifacts: KnowledgeWriteReceipt[];
  relationships: KnowledgeWriteReceipt[];
  entityMemoryLinks: string[];
  linkedMemories: string[];
  attachmentsApplied?: boolean;
  /** Write-ahead create attempts without a confirmed resource ID. */
  pendingCreates?: string[];
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
    ...(value.instructionId === undefined ? {} : { instructionId: value.instructionId }),
    ...(value.pendingCreates?.length ? { pendingCreates: [...value.pendingCreates] } : {}),
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

function selectedIds(
  values: KnowledgeWriteReceipt[],
  resources: { key: string }[] = [],
): number[] {
  return resources.map(({ key }) => {
    const id = stateId(values, key);
    if (!positiveId(id)) throw new Error(`Missing knowledge receipt for ${key}`);
    return id;
  });
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
    ...(previous.instructionId === undefined ? {} : { instructionId: previous.instructionId }),
    ...(previous.pendingCreates?.length
      ? { pendingCreates: [...previous.pendingCreates] } : {}),
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

function instructionId(plan: KnowledgeWritePlan): string {
  const { expectedClaim: _deprecated, ...instruction } = plan;
  const json = JSON.stringify(instruction, (_key, value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    const object = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
  });
  return createHash("sha256").update(json).digest("hex");
}

/** Writes rich knowledge with a durable receipt after every completed operation. */
export class KnowledgeWriter {
  constructor(
    private readonly client: WriteClient,
    private readonly readMemory?: KnowledgeMemoryReader,
    private readonly assertCanWrite?: () => void,
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
    const groups = [plan.entities, plan.documents, plan.codeArtifacts, plan.relationships];
    for (const resources of groups) {
      const keys = new Set<string>();
      for (const resource of resources ?? []) {
        if (keys.has(resource.key)) throw new Error(`Duplicate knowledge key: ${resource.key}`);
        keys.add(resource.key);
      }
    }
    for (const resource of plan.entities ?? []) {
      if (resource.existingId === undefined &&
          (!resource.input.project_ids.length ||
            resource.input.project_ids.some((id) => id !== plan.projectId))) {
        throw new Error("Knowledge entity create is outside the destination project");
      }
    }
    for (const resource of [...(plan.documents ?? []), ...(plan.codeArtifacts ?? [])]) {
      if (resource.existingId === undefined && resource.input.project_id !== plan.projectId) {
        throw new Error("Knowledge resource create is outside the destination project");
      }
    }
  }

  private async createOnce<T extends { id: number }>(
    kind: string,
    key: string,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
    create: () => Promise<T>,
    authorize?: () => Promise<void>,
  ): Promise<T> {
    const attempt = JSON.stringify([plan.operationId, kind, key]);
    if (state.pendingCreates?.includes(attempt)) {
      throw new Error(
        `Knowledge create outcome is unknown for ${kind} ${key}; model decision required`,
      );
    }
    state.pendingCreates = [...(state.pendingCreates ?? []), attempt];
    await save();
    try {
      await beforeWrite?.();
      await this.currentMemory(plan, signal);
      await authorize?.();
      this.assertCanWrite?.();
    } catch (error) {
      // No API call was made: this attempt is safe to retry after authorization changes.
      state.pendingCreates = state.pendingCreates.filter((item) => item !== attempt);
      try { await save(); } finally { throw error; }
    }
    // Leave the attempt pending on failure. Preserve the original error without repair.
    const created = await create();
    if (!positiveId(created.id)) throw new Error(`Invalid knowledge ID for ${key}`);
    state.pendingCreates = state.pendingCreates.filter((item) => item !== attempt);
    return created;
  }

  private async writeEntity(
    resource: KnowledgeEntityPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Entity> {
    if (resource.existingId !== undefined) {
      if (!positiveId(resource.existingId)) throw new Error("Invalid existing knowledge ID");
      await beforeWrite?.();
      await this.currentMemory(plan, signal);
      const selected = await this.entityInProject(resource.existingId, plan.projectId, signal);
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce("entity", resource.key, plan, state, save, signal, beforeWrite,
      () => this.client.createEntity(resource.input, signal));
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
      const entity = await this.writeEntity(resource, plan, state, save, signal, beforeWrite);
      stateWithNumber(state.entities, resource.key, entity.id);
      await save();
    }
  }

  private async writeDocument(
    resource: KnowledgeDocumentPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Document> {
    if (resource.existingId !== undefined) {
      if (!positiveId(resource.existingId)) throw new Error("Invalid existing knowledge ID");
      await beforeWrite?.();
      await this.currentMemory(plan, signal);
      const selected = await this.documentInProject(resource.existingId, plan.projectId, signal);
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce("document", resource.key, plan, state, save, signal, beforeWrite,
      () => this.client.createDocument(resource.input, signal));
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
      const document = await this.writeDocument(resource, plan, state, save, signal, beforeWrite);
      stateWithNumber(state.documents, resource.key, document.id);
      await save();
    }
  }

  private async writeCodeArtifact(
    resource: KnowledgeCodeArtifactPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<CodeArtifact> {
    if (resource.existingId !== undefined) {
      if (!positiveId(resource.existingId)) throw new Error("Invalid existing knowledge ID");
      await beforeWrite?.();
      await this.currentMemory(plan, signal);
      const selected = await this.codeArtifactInProject(
        resource.existingId, plan.projectId, signal,
      );
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce("code artifact", resource.key, plan, state, save, signal, beforeWrite,
      () => this.client.createCodeArtifact(resource.input, signal));
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
        plan,
        state,
        save,
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
        [...(plan.existingDocumentIds ?? []), ...selectedIds(state.documents, plan.documents)],
        "document",
      ),
      codeArtifactIds: uniqueIds(
        [
          ...(plan.existingCodeArtifactIds ?? []),
          ...selectedIds(state.codeArtifacts, plan.codeArtifacts),
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
    if (state.attachmentsApplied) return;
    await beforeWrite?.();
    const memory = await this.currentMemory(plan, signal);
    const requested = this.requestedAttachmentIds(plan, state);
    await this.validateAttachments(
      requested.documentIds, requested.codeArtifactIds, plan.projectId, signal,
    );
    const ids = this.attachmentIds(memory, requested);
    if (this.attachmentsDiffer(memory, ids)) {
      this.ensureMemoryCanReceiveAttachments(memory);
      this.assertCanWrite?.();
      await this.client.updateMemory(plan.memoryId, this.attachmentPatch(ids), signal);
    }
    state.attachmentsApplied = true;
    await save();
  }

  private async writeRelationship(
    resource: KnowledgeRelationshipPlan,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<EntityRelationship> {
    const sourceId = stateId(state.entities, resource.sourceEntityKey);
    const targetId = stateId(state.entities, resource.targetEntityKey);
    if (!positiveId(sourceId) || !positiveId(targetId)) {
      throw new Error(`Relationship references an unknown entity: ${resource.key}`);
    }
    const authorize = async () => {
      await this.entityInProject(sourceId, plan.projectId, signal);
      await this.entityInProject(targetId, plan.projectId, signal);
    };
    if (resource.existingId !== undefined) {
      if (!positiveId(resource.existingId)) throw new Error("Invalid existing knowledge ID");
      await beforeWrite?.();
      await this.currentMemory(plan, signal);
      await authorize();
      const relationships = await this.client.getRelationships(sourceId, signal);
      const selected = relationships.find((item) => item.id === resource.existingId);
      if (!selected || selected.source_entity_id !== sourceId ||
          selected.target_entity_id !== targetId) {
        throw new Error("Selected relationship does not connect the requested entities");
      }
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce("relationship", resource.key, plan, state, save, signal,
      beforeWrite, () => this.client.createRelationship({
        ...resource.input, source_entity_id: sourceId, target_entity_id: targetId,
      }, signal), authorize);
  }

  private async writeRelationships(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of plan.relationships ?? []) {
      if (positiveId(stateId(state.relationships, resource.key))) continue;
      const relationship = await this.writeRelationship(
        resource,
        plan,
        state,
        save,
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
    const key = `${resource.entityKey}:${plan.memoryId}`;
    if (hasValue(state.entityMemoryLinks, key)) return;
    const entityId = stateId(state.entities, resource.entityKey);
    if (!positiveId(entityId)) {
      throw new Error(
        `Memory link references an unknown entity: ${resource.entityKey}`,
      );
    }
    await beforeWrite?.();
    await this.entityInProject(entityId, plan.projectId, signal);
    await this.currentMemory(plan, signal);
    this.assertCanWrite?.();
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
    if (hasValue(state.linkedMemories, key)) return;
    if (!this.readMemory) {
      throw new Error("Linked memories require a memory validation reader");
    }
    await beforeWrite?.();
    await this.currentMemory(plan, signal);
    const target = await this.readMemory(linkedMemoryId, signal);
    if (target.is_obsolete || !target.project_ids.includes(plan.projectId))
      throw new Error("Linked memory changed or is outside the destination project");
    this.assertCanWrite?.();
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
    if (state.instructionId === undefined &&
        (state.entities.length || state.documents.length || state.codeArtifacts.length ||
          state.relationships.length || state.entityMemoryLinks.length ||
          state.linkedMemories.length || state.attachmentsApplied ||
          state.pendingCreates?.length)) {
      throw new Error(
        "Legacy knowledge receipts have no instruction identity; explicit review required",
      );
    }
    const identity = instructionId(plan);
    if (state.instructionId !== undefined && state.instructionId !== identity) {
      throw new Error("Knowledge receipt instruction mismatch; use fresh state for a new plan");
    }
    state.instructionId = identity;
    await this.currentMemory(plan, signal);
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
