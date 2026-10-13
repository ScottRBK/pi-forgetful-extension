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
  /** Zero-based occurrence of this model key; absent on legacy/first-slot receipts. */
  occurrence?: number;
}

export interface KnowledgeWriteState {
  /** Latest instruction digest for diagnostics; it does not gate receipt reuse. */
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

type ResourceSlot<T> = T & { occurrence: number };

// Payload corrections keep their slot when duplicate keys retain their relative order.
// Separate occurrence metadata avoids collisions with arbitrary model keys and legacy receipts.
function resourceSlots<T extends { key: string }>(resources: T[] = []): ResourceSlot<T>[] {
  const occurrences = new Map<string, number>();
  return resources.map((resource) => {
    const occurrence = occurrences.get(resource.key) ?? 0;
    occurrences.set(resource.key, occurrence + 1);
    return { ...resource, occurrence };
  });
}

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

function rejectedCreate(error: unknown): boolean {
  if (!(error instanceof Error) || !("status" in error)) return false;
  return error.status === 400 || error.status === 422;
}

function stateWithNumber(
  values: KnowledgeWriteReceipt[],
  key: string,
  id: number,
  occurrence: number,
): void {
  if (!positiveId(id)) throw new Error(`Invalid knowledge ID for ${key}`);
  const index = values.findIndex((receipt) =>
    receipt.key === key && (receipt.occurrence ?? 0) === occurrence);
  const receipt = { key, id, ...(occurrence ? { occurrence } : {}) };
  if (index < 0) values.push(receipt);
  else values[index] = receipt;
}

function stateId(
  values: KnowledgeWriteReceipt[], key: string, occurrence = 0,
): number | undefined {
  return values.find((receipt) =>
    receipt.key === key && (receipt.occurrence ?? 0) === occurrence)?.id;
}

function selectedIds(
  values: KnowledgeWriteReceipt[],
  resources: { key: string }[] = [],
): number[] {
  return resourceSlots(resources).map(({ key, occurrence }) => {
    const id = stateId(values, key, occurrence);
    if (!positiveId(id)) throw new Error(`Missing knowledge receipt for ${key}`);
    return id;
  });
}

function uniqueIds(values: number[]): number[] {
  return [...new Set(values)];
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
  const instruction = Object.fromEntries(
    Object.entries(plan).filter(([key]) => key !== "expectedClaim"),
  );
  const json = JSON.stringify(instruction, (_key, value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    const object = value as Record<string, unknown>;
    // Persisted receipt hashes use UTF-16 key order, independent of the host locale.
    const keys = Object.keys(object).sort((left, right) => {
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    });
    return Object.fromEntries(keys.map((key) => [key, object[key]]));
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

  private async attachmentMemory(
    plan: KnowledgeWritePlan,
    signal?: AbortSignal,
  ): Promise<Memory> {
    if (!this.readMemory) {
      throw new Error("Knowledge attachments require a memory reader");
    }
    return this.readMemory(plan.memoryId, signal);
  }

  private async createOnce<T extends { id: number }>(
    operation: {
      kind: string;
      key: string;
      occurrence: number;
      create: () => Promise<T>;
    },
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<T> {
    const { kind, key, occurrence, create } = operation;
    const attempt = JSON.stringify([plan.operationId, kind, key, occurrence]);
    state.pendingCreates = [...(state.pendingCreates ?? []), attempt];
    await save();
    try {
      await beforeWrite?.();
      this.assertCanWrite?.();
    } catch (error) {
      // No API call was made: this attempt is safe to retry after authorization changes.
      state.pendingCreates = state.pendingCreates.filter((item) => item !== attempt);
      try { await save(); } catch {
        // A failed checkpoint must not replace the original authorization diagnostic.
      }
      throw error;
    }
    let created: T;
    try {
      created = await create();
    } catch (error) {
      if (rejectedCreate(error)) {
        // The service rejected this payload. Keep prior receipts and allow field correction.
        state.pendingCreates = state.pendingCreates.filter((item) => item !== attempt);
        try { await save(); } catch {
          // Preserve the service error; an older durable pending marker still blocks replay.
        }
      }
      // All other failures may have accepted the create and must remain pending.
      throw error;
    }
    if (!positiveId(created.id)) throw new Error(`Invalid knowledge ID for ${key}`);
    state.pendingCreates = state.pendingCreates.filter((item) => item !== attempt);
    return created;
  }

  private async writeEntity(
    resource: ResourceSlot<KnowledgeEntityPlan>,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Entity> {
    if (resource.existingId !== undefined) {
      await beforeWrite?.();
      const selected = await this.client.getEntity(resource.existingId, signal);
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce({ kind: "entity", key: resource.key, occurrence: resource.occurrence,
      create: () => this.client.createEntity(resource.input, signal),
    }, plan, state, save, beforeWrite);
  }

  private async writeEntities(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of resourceSlots(plan.entities)) {
      if (positiveId(stateId(state.entities, resource.key, resource.occurrence))) continue;
      const entity = await this.writeEntity(resource, plan, state, save, signal, beforeWrite);
      stateWithNumber(state.entities, resource.key, entity.id, resource.occurrence);
      await save();
    }
  }

  private async writeDocument(
    resource: ResourceSlot<KnowledgeDocumentPlan>,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<Document> {
    if (resource.existingId !== undefined) {
      await beforeWrite?.();
      const selected = await this.client.getDocument(resource.existingId, signal);
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce({ kind: "document", key: resource.key, occurrence: resource.occurrence,
      create: () => this.client.createDocument(resource.input, signal),
    }, plan, state, save, beforeWrite);
  }

  private async writeDocuments(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of resourceSlots(plan.documents)) {
      if (positiveId(stateId(state.documents, resource.key, resource.occurrence))) continue;
      const document = await this.writeDocument(resource, plan, state, save, signal, beforeWrite);
      stateWithNumber(state.documents, resource.key, document.id, resource.occurrence);
      await save();
    }
  }

  private async writeCodeArtifact(
    resource: ResourceSlot<KnowledgeCodeArtifactPlan>,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<CodeArtifact> {
    if (resource.existingId !== undefined) {
      await beforeWrite?.();
      const selected = await this.client.getCodeArtifact(resource.existingId, signal);
      this.assertCanWrite?.();
      return selected;
    }
    return this.createOnce({ kind: "code artifact", key: resource.key,
      occurrence: resource.occurrence,
      create: () => this.client.createCodeArtifact(resource.input, signal),
    }, plan, state, save, beforeWrite);
  }

  private async writeCodeArtifacts(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of resourceSlots(plan.codeArtifacts)) {
      if (positiveId(stateId(state.codeArtifacts, resource.key, resource.occurrence))) continue;
      const artifact = await this.writeCodeArtifact(
        resource,
        plan,
        state,
        save,
        signal,
        beforeWrite,
      );
      stateWithNumber(state.codeArtifacts, resource.key, artifact.id, resource.occurrence);
      await save();
    }
  }

  private requestedAttachmentIds(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
  ): KnowledgeAttachmentIds {
    return {
      documentIds: uniqueIds([
        ...(plan.existingDocumentIds ?? []), ...selectedIds(state.documents, plan.documents),
      ]),
      codeArtifactIds: uniqueIds([
        ...(plan.existingCodeArtifactIds ?? []),
        ...selectedIds(state.codeArtifacts, plan.codeArtifacts),
      ]),
    };
  }

  private attachmentIds(
    memory: Memory,
    requested: KnowledgeAttachmentIds,
  ): KnowledgeAttachmentIds {
    return {
      documentIds: uniqueIds([...(memory.document_ids ?? []), ...requested.documentIds]),
      codeArtifactIds: uniqueIds([
        ...(memory.code_artifact_ids ?? []), ...requested.codeArtifactIds,
      ]),
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
    const memory = await this.attachmentMemory(plan, signal);
    const requested = this.requestedAttachmentIds(plan, state);
    const ids = this.attachmentIds(memory, requested);
    if (this.attachmentsDiffer(memory, ids)) {
      this.assertCanWrite?.();
      await this.client.updateMemory(plan.memoryId, this.attachmentPatch(ids), signal);
    }
    state.attachmentsApplied = true;
    await save();
  }

  private async writeRelationship(
    resource: ResourceSlot<KnowledgeRelationshipPlan>,
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<EntityRelationship> {
    // Model-key references keep their original first binding, even when that key is duplicated.
    // To address another occurrence, use explicit endpoint IDs without a matching model key.
    const sourceId = stateId(state.entities, resource.sourceEntityKey) ??
      resource.input.source_entity_id;
    const targetId = stateId(state.entities, resource.targetEntityKey) ??
      resource.input.target_entity_id;
    return this.createOnce({ kind: "relationship", key: resource.key,
      occurrence: resource.occurrence,
      create: () => this.client.createRelationship({
        ...resource.input, source_entity_id: sourceId, target_entity_id: targetId,
      }, signal),
    }, plan, state, save, beforeWrite);
  }

  private async writeRelationships(
    plan: KnowledgeWritePlan,
    state: KnowledgeWriteState,
    save: KnowledgeWriteSave,
    signal: AbortSignal | undefined,
    beforeWrite: KnowledgeWriteGuard | undefined,
  ): Promise<void> {
    for (const resource of resourceSlots(plan.relationships)) {
      if (positiveId(stateId(state.relationships, resource.key, resource.occurrence))) continue;
      if (resource.existingId !== undefined) {
        // Reusing a relationship records the model's selection; it performs no server mutation.
        state.relationships.push({ key: resource.key, id: resource.existingId,
          ...(resource.occurrence ? { occurrence: resource.occurrence } : {}) });
        await save();
        continue;
      }
      const relationship = await this.writeRelationship(
        resource,
        plan,
        state,
        save,
        signal,
        beforeWrite,
      );
      stateWithNumber(state.relationships, resource.key, relationship.id, resource.occurrence);
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
    // As with relationship endpoints, a model key names its first resource occurrence.
    const entityId = stateId(state.entities, resource.entityKey);
    await beforeWrite?.();
    this.assertCanWrite?.();
    await this.client.linkEntityMemory(entityId as number, plan.memoryId, signal);
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
    const key = `${plan.memoryId}:${linkedMemoryId}`;
    if (hasValue(state.linkedMemories, key)) return;
    await beforeWrite?.();
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
    const state = normalizedState(previous);
    if (state.pendingCreates?.length) {
      throw new Error("Knowledge create outcome is unknown; automatic retry blocked");
    }
    state.instructionId = instructionId(plan);
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
