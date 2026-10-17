import { errorMessage } from "./privacy.ts";
import { CaptureSelectionError } from "./capture-feedback.ts";
import type { ForgetfulClient, Memory, Scope } from "./contracts.ts";

export interface MergeConnections {
  memoryIds: number[];
  entityIds: number[];
  documentIds: number[];
  codeArtifactIds: number[];
  fileIds: number[];
  receipts: Record<string, {
    status: "started" | "completed" | "rejected"; error?: string; input?: unknown;
  }>;
}

export class MergeWriteUncertain extends Error {}

const union = (...lists: (number[] | undefined)[]): number[] => [...new Set(lists.flatMap(
  (list) => list ?? []))];

/** Unlike optional link review, merge must carry every inherited reference without selection. */
export async function collectMergeConnections(
  client: ForgetfulClient, memories: Memory[], previous?: MergeConnections,
): Promise<MergeConnections> {
  if (!client.knowledge || !client.getMemoryEntityIds)
    throw new Error("Cannot preserve all merge connections: client lacks knowledge/graph reads");
  const entityIds: number[] = [];
  for (const memory of memories) entityIds.push(...await client.getMemoryEntityIds(memory.id));
  const predecessors = new Set(memories.map((memory) => memory.id));
  return {
    memoryIds: union(previous?.memoryIds, ...memories.map((m) => m.linked_memory_ids))
      .filter((id) => !predecessors.has(id)),
    entityIds: union(previous?.entityIds, entityIds),
    documentIds: union(previous?.documentIds, ...memories.map((m) => m.document_ids)),
    codeArtifactIds: union(previous?.codeArtifactIds, ...memories.map((m) => m.code_artifact_ids)),
    fileIds: union(previous?.fileIds, ...memories.map((m) => m.file_ids)),
    receipts: previous?.receipts ?? {},
  };
}

export interface MergeAccess {
  destination: number;
  scope: Scope;
  beforeRead: () => Promise<void>;
}

interface MergeExecution extends MergeAccess {
  save: () => Promise<void>;
  assertCanWrite: () => void;
}

function requireResourceScope(
  id: number, projectId: number | null | undefined, kind: string, access: MergeAccess,
): void {
  if (access.scope === "project" && projectId !== access.destination)
    throw new CaptureSelectionError(
      `Cannot preserve merge ${kind} ${id}: outside configured scope`);
}

async function checkMergeEntity(
  client: ForgetfulClient, id: number, access: MergeAccess,
): Promise<void> {
  await access.beforeRead();
  const entity = await client.knowledge!.getEntity(id);
  if (access.scope === "project" && !entity.project_ids.includes(access.destination))
    throw new CaptureSelectionError(`Cannot preserve merge entity ${id}: outside configured scope`);
}

async function checkMergeAttachments(
  client: ForgetfulClient, plan: Pick<MergeConnections, "documentIds" | "codeArtifactIds" |
    "fileIds">, access: MergeAccess,
): Promise<void> {
  const knowledge = client.knowledge!;
  for (const id of plan.documentIds) {
    await access.beforeRead();
    requireResourceScope(id, (await knowledge.getDocument(id)).project_id, "document", access);
  }
  for (const id of plan.codeArtifactIds) {
    await access.beforeRead();
    requireResourceScope(id, (await knowledge.getCodeArtifact(id)).project_id,
      "code artifact", access);
  }
  for (const id of plan.fileIds) {
    await access.beforeRead();
    requireResourceScope(id, (await knowledge.getFile(id)).project_id, "file", access);
  }
}

/** Check every inherited reference before create, retaining obsolete links only in history. */
export async function preflightMergeConnections(
  client: ForgetfulClient, plan: MergeConnections, access: MergeAccess,
): Promise<void> {
  const activeIds: number[] = [];
  for (const id of plan.memoryIds) {
    await access.beforeRead();
    const memory = await client.get(id);
    if (memory.is_obsolete) continue;
    if (access.scope === "project" && !memory.project_ids.includes(access.destination))
      throw new CaptureSelectionError(
        `Cannot preserve merge connection to memory ${id}: outside configured scope`);
    activeIds.push(id);
  }
  for (const id of plan.entityIds) await checkMergeEntity(client, id, access);
  await checkMergeAttachments(client, plan, access);
  plan.memoryIds = activeIds;
}

/** Reads/permission guards precede dispatch. Accepted writes always retain durable receipts. */
export async function preserveMergeConnections(
  client: ForgetfulClient, replacementId: number, plan: MergeConnections,
  options: MergeExecution,
): Promise<void> {
  const { destination, scope, save, beforeRead: beforeWrite, assertCanWrite } = options;
  await preflightMergeConnections(client, plan, options);
  const knowledge = client.knowledge!;
  const authorizeMemory = async (id: number, saved = false): Promise<Memory> => {
    const memory = await client.get(id);
    if (memory.is_obsolete || ((saved || scope === "project") &&
        !memory.project_ids.includes(destination)))
      throw new CaptureSelectionError(`Cannot preserve merge connection to memory ${id}: ` +
        "obsolete or outside scope");
    return memory;
  };
  const execute = async (
    key: string, input: unknown, read: () => Promise<void>, write: () => Promise<unknown>,
  ) => {
    const receipt = plan.receipts[key];
    if (receipt?.status === "started")
      throw new MergeWriteUncertain(receipt.error ?? `Merge connection ${key} outcome is unknown`);
    await beforeWrite();
    await authorizeMemory(replacementId, true);
    await read();
    if (receipt?.status === "completed") return;
    assertCanWrite();
    plan.receipts[key] = { status: "started", input };
    await save();
    let dispatched = false;
    try {
      assertCanWrite();
      dispatched = true;
      await write();
    } catch (error) {
      const message = errorMessage(error);
      if (!dispatched) {
        delete plan.receipts[key];
        await save();
        throw error;
      }
      const rejected = error instanceof Error && "status" in error &&
        (error.status === 400 || error.status === 422);
      plan.receipts[key] = { status: rejected ? "rejected" : "started", input, error: message };
      await save();
      if (!rejected) throw new MergeWriteUncertain(message, { cause: error });
      throw error;
    }
    plan.receipts[key] = { status: "completed", input };
    await save();
  };
  // New requested resources have already been written. Preserve their union with inherited IDs.
  const stored = await authorizeMemory(replacementId, true);
  const attachments = {
    document_ids: union(plan.documentIds, stored.document_ids),
    code_artifact_ids: union(plan.codeArtifactIds, stored.code_artifact_ids),
    file_ids: union(plan.fileIds, stored.file_ids),
  };
  if (Object.values(attachments).some((ids) => ids.length)) {
    let needsUpdate = true;
    await execute(`attachments:${JSON.stringify(attachments)}`, attachments, async () => {
      await checkMergeAttachments(client, { documentIds: attachments.document_ids,
        codeArtifactIds: attachments.code_artifact_ids, fileIds: attachments.file_ids }, options);
      const latest = await authorizeMemory(replacementId, true);
      needsUpdate = attachments.document_ids.some((id) => !latest.document_ids?.includes(id)) ||
        attachments.code_artifact_ids.some((id) => !latest.code_artifact_ids?.includes(id)) ||
        attachments.file_ids.some((id) => !latest.file_ids?.includes(id));
    }, () => needsUpdate ? knowledge.updateMemory(replacementId, attachments) : Promise.resolve());
  }
  for (const id of plan.memoryIds.filter((id) => id !== replacementId)) {
    await execute(`memory:${id}`, { related_ids: [id] },
      async () => { await authorizeMemory(id); },
      () => knowledge.linkMemories(replacementId, [id]));
  }
  for (const id of plan.entityIds) {
    await execute(`entity:${id}`, { memory_id: replacementId }, async () => {
      await checkMergeEntity(client, id, options);
    }, () => knowledge.linkEntityMemory(id, replacementId));
  }
  // A completed receipt is never permission to replay. Surface lost connections explicitly.
  const current = await authorizeMemory(replacementId, true);
  const entityIds = await client.getMemoryEntityIds!(replacementId);
  const checks: Array<[string, number[], number[]]> = [
    ["memory", plan.memoryIds.filter((id) => id !== replacementId),
      current.linked_memory_ids ?? []],
    ["entity", plan.entityIds, entityIds],
    ["document", attachments.document_ids, current.document_ids ?? []],
    ["code artifact", attachments.code_artifact_ids, current.code_artifact_ids ?? []],
    ["file", attachments.file_ids, current.file_ids ?? []],
  ];
  for (const [kind, required, actual] of checks) {
    const missing = required.filter((id) => !actual.includes(id));
    if (missing.length) throw new Error(`Cannot complete merge: missing ${kind} refs ${missing}`);
  }
}
