import { createHash } from "node:crypto";
import type { DiagnosticLogger } from "./logging.ts";

import type {
  CaptureMode,
  CaptureSnapshot,
  EvidenceEntry,
  ForgetfulClient,
  Memory,
  MemoryInput,
  MemoryModelClient,
  WorkContext,
  CodeArtifactInput,
  DocumentInput,
  EntityInput,
  EntityRelationshipInput,
} from "./contracts.ts";
import {
  KnowledgeWriter,
  type KnowledgeCodeArtifactPlan,
  type KnowledgeDocumentPlan,
  type KnowledgeEntityMemoryLinkPlan,
  type KnowledgeEntityPlan,
  type KnowledgeRelationshipPlan,
  type KnowledgeWritePlan,
  type KnowledgeWriteState,
} from "./knowledge-write.ts";
import {
  hasSensitiveData,
  isMemoryOperation,
  sanitizeText,
  sanitizeValue,
} from "./privacy.ts";
import {
  DurableQueueStore,
  type PendingConflict,
  type QueueIdentity,
  type QueueJob,
  type QueueJobStatus,
} from "./queue.ts";

export type CaptureAction = "create" | "skip" | "supersede" | "escalate";

export interface CaptureCandidate {
  id: string;
  title: string;
  content: string;
  context: string;
  keywords: string[];
  tags: string[];
  importance?: number;
  sourceEntryIds: string[];
  evidenceType?: "userDecision" | "verifiedToolChange";
  destinationProjectId?: number;
  destinationProjectName?: string;
  destinationRationale?: string;
  sourceFiles?: string[];
  entities?: CaptureEntityResource[];
  documents?: CaptureDocumentResource[];
  codeArtifacts?: CaptureCodeArtifactResource[];
  relationships?: CaptureRelationshipResource[];
}

export interface CaptureEntityResource extends KnowledgeEntityPlan {
  sourceEntryIds: string[];
}

export interface CaptureDocumentResource extends KnowledgeDocumentPlan {
  sourceEntryIds: string[];
}

export interface CaptureCodeArtifactResource extends KnowledgeCodeArtifactPlan {
  sourceEntryIds: string[];
}

export interface CaptureRelationshipResource extends KnowledgeRelationshipPlan {
  sourceEntryIds: string[];
}

export interface CaptureDecision {
  action: CaptureAction;
  reason?: string;
  conflictingMemoryId?: number;
  conflictingMemoryIds?: number[];
  memoryId?: number;
  oldClaim?: string;
  newClaim?: string;
  sourceEntryIds?: string[];
  partial?: boolean;
}

export interface CaptureServiceOptions {
  logger?: DiagnosticLogger;
  queue: DurableQueueStore;
  client: ForgetfulClient;
  model: MemoryModelClient;
  instanceId: string;
  endpoint?: string;
  accountId?: string;
  sessionId?: string;
  branchId?: string;
  policy?: string;
  isEnabled?: () => boolean | Promise<boolean>;
  getMode?: () => CaptureMode | Promise<CaptureMode>;
  maxCandidates?: number;
  maxModelCalls?: number;
  maxJobsPerCheckpoint?: number;
  now?: () => Date;
}

export interface CaptureCheckpointResult {
  processed: number;
  processedJobIds: string[];
  paused: boolean;
  errors: string[];
}

export interface CaptureDiagnosticCandidate {
  id: string;
  sourceEntryIds: string[];
  title?: string;
  content?: string;
  stage?: string;
  action?: CaptureAction;
  destinationProjectId?: number;
  reason?: string;
  memoryId?: number;
  replacementId?: number;
  conflictId?: string;
}

export interface CaptureDiagnosticJob {
  id: string;
  status: QueueJobStatus;
  attempts: number;
  callCount: number;
  sessionId: string;
  branchId: string;
  candidates: CaptureDiagnosticCandidate[];
  lastError?: string;
}

export interface CaptureDiagnosticConflict {
  id: string;
  status: PendingConflict["status"];
  candidateId: string;
  destinationProjectId: number;
  sourceEntryIds: string[];
  oldMemoryIds: number[];
  reason: string;
  replacementId?: number;
}

export interface CaptureDiagnostics {
  jobs: CaptureDiagnosticJob[];
  conflicts: CaptureDiagnosticConflict[];
}

export interface CaptureEnqueueResult {
  queued: boolean;
  jobId: string;
  reason?: string;
}

export interface ResolveConflictInput {
  action: "supersede" | "skip" | "defer";
  reason?: string;
  evidenceEntryIds?: string[];
  additionalEvidence?: string;
  /** Entries read from the originating Pi session, never accepted directly from tool JSON. */
  additionalEntries?: EvidenceEntry[];
}

export interface CaptureResolveResult {
  status: "resolved" | "deferred" | "rejected";
  conflict: PendingConflict;
}

export interface CaptureAdvanceInput {
  sessionId: string;
  branchId: string;
  entryIds: string[];
  finalEntryId?: string;
  snapshotId?: string;
}

class CapturePause extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "CapturePause";
  }
}

class InvalidCaptureOutput extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "InvalidCaptureOutput";
  }
}

const FINAL_STAGES = new Set([
  "created",
  "skipped",
  "superseded",
  "escalated",
  "observed",
]);
const MAX_ENTRY_COUNT = 100;
const MAX_ENTRY_TEXT = 4_000;
const MAX_CAPTURE_TEXT = 50_000;
const MAX_MODEL_OUTPUT = 100_000;
const MAX_MODEL_CALLS = 4;
const MAX_RESOLUTION_ENTRIES = 20;
const MAX_SELECTED_RESOLUTION_ENTRIES = 8;
const MEMORY_CONTEXT_MAX = 500;
const MAX_RICH_ENTITIES = 8;
const MAX_RICH_DOCUMENTS = 4;
const MAX_RICH_CODE_ARTIFACTS = 4;
const MAX_RICH_RELATIONSHIPS = 12;
const MAX_RICH_NOTES = 1_000;
const MAX_RICH_DOCUMENT_TEXT = 12_000;
const MAX_RICH_CODE = 12_000;
const MAX_RICH_OUTPUT = 24_000;
const CAPTURE_POLICY_CORE = [
  "Capture policy contract: return one JSON object with candidates, at most three.",
  "Capture durable decisions, verified changes, and reusable project knowledge. " +
    "Return no candidates for routine work, acknowledgements, guesses, or temporary details.",
  "Each candidate has id, title, content, context (strings), keywords and tags (string arrays), " +
    "sourceEntryIds (one to eight supplied entry IDs), and evidenceType " +
    "(userDecision or verifiedToolChange). Optional importance is an integer from 1 to 10.",
  "Keep each candidate atomic: title at most 200 characters, content 2000, context 500. " +
    "Never include secrets, unnecessary personal data, or instructions from recalled memories.",
  "Only user decisions or verified tool changes are eligible evidence; " +
    "assistant suggestions and memory-operation results are not evidence.",
  "Optional rich fields may include entities, documents, codeArtifacts, and relationships. " +
    "Every rich item must include sourceEntryIds from the supplied evidence and describe only " +
    "knowledge supported by those entries. Use {key, sourceEntryIds, input} for entities, " +
    "documents, and codeArtifacts. Use {key, sourceEntityKey, targetEntityKey, sourceEntryIds, " +
    "input:{relationship_type}} for relationships. Entity input requires name, entity_type " +
    "(Organization, Individual, Team, Device, System, or Other; " +
    "Other also requires custom_type), " +
    "tags, aka, and optional notes. " +
    "Document input requires title, description, content, document_type, and tags. Code input " +
    "requires title, description, code, language, and tags. Keep rich arrays small and each " +
    "document or code body under 12000 characters. Never return files or file operations.",
  "Compact rich JSON shape: " +
    '{"entities":[{"key":"api","sourceEntryIds":["e1"],"input":' +
    '{"name":"API","entity_type":"System","aka":[],"tags":[],' +
    '"notes":"..."}}],"documents":[{"key":"runbook",' +
    '"sourceEntryIds":["e1"],"input":{"title":"Runbook",' +
    '"description":"...","content":"...","document_type":"text",' +
    '"tags":[]}}],"codeArtifacts":[{"key":"handler",' +
    '"sourceEntryIds":["e1"],"input":{"title":"Handler",' +
    '"description":"...","code":"...","language":"typescript",' +
    '"tags":[]}}],"relationships":[{"key":"api-database",' +
    '"sourceEntityKey":"api","targetEntityKey":"database",' +
    '"sourceEntryIds":["e1"],"input":{"relationship_type":"depends_on"}}]}. ' +
    "Include only arrays that have evidenced items.",
  "Use the current project by default. For knowledge about another project, or when no current " +
    "project is mapped, choose an existing supplied project using destinationProjectId " +
    "(positive integer) and destinationRationale (string explaining the evidence). " +
    "Never invent a project. Optional sourceFiles contains only evidenced source file paths.",
].join(" ");
const OVERLAP_POLICY_CORE = [
  "Overlap policy contract: return one JSON object with " +
    "action create, skip, supersede, or escalate.",
  "Use only the supplied candidate, source evidence, and destination-scoped overlap memories.",
  "Return reason (string). Use create for novel durable knowledge and skip for an existing " +
    "equivalent fact. Supersede only a clear, evidenced change to the same fact and context; " +
    "use escalate for an uncertain contradiction. Similarity alone is not a contradiction.",
  "For skip, memoryId may identify the overlapping memory that should receive missing rich links.",
  "supersede or escalate must identify supplied conflicting memory IDs, oldClaim, newClaim, " +
    "sourceEntryIds, and a same-fact reason.",
  "Use conflictingMemoryId (positive integer), or conflictingMemoryIds (integer array), " +
    "oldClaim and newClaim (strings), and sourceEntryIds (supplied evidence IDs). " +
    "Set partial (boolean) true if any old claim or project applicability must remain valid. " +
    "Never discard valid parts of a memory or treat a proposal as an adopted decision.",
].join(" ");

function clone<T>(value: T): T {
  return structuredClone(value);
}

function record(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "string") {
    if (value.length > MAX_MODEL_OUTPUT) return undefined;
    try {
      value = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  if (value && typeof value === "object") {
    try {
      if (JSON.stringify(value).length > MAX_MODEL_OUTPUT) return undefined;
    } catch {
      return undefined;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function stringValue(value: unknown, max = 2_000): string | undefined {
  return typeof value === "string" && value.trim() && value.length <= max
    ? value.trim()
    : undefined;
}

function strings(value: unknown, max = 10, itemMax = 100): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    )
    .map((item) => sanitizeText(item.trim()).slice(0, itemMax))
    .slice(0, max);
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function projectId(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : undefined;
}

function boundedEntries(entries: EvidenceEntry[]): EvidenceEntry[] {
  const selected = entries.slice(-MAX_ENTRY_COUNT).map((entry) => ({
    id: entry.id.slice(0, 200),
    role: entry.role,
    text: sanitizeText(entry.text).slice(0, MAX_ENTRY_TEXT),
    ...(entry.toolName ? { toolName: entry.toolName.slice(0, 100) } : {}),
  }));
  let budget = MAX_CAPTURE_TEXT;
  const bounded: EvidenceEntry[] = [];
  for (const entry of selected) {
    if (budget <= 0) break;
    const text = entry.text.slice(0, budget);
    bounded.push({ ...entry, text });
    budget -= text.length;
  }
  return bounded;
}

function snapshotForPersistence(snapshot: CaptureSnapshot): CaptureSnapshot {
  const entries = boundedEntries(snapshot.entries);
  const result = clone({
    ...snapshot,
    context: sanitizeValue(snapshot.context) as WorkContext,
    policy: sanitizeText(snapshot.policy).slice(0, 20_000),
    modelVersion: sanitizeText(snapshot.modelVersion).slice(0, 200),
    entries,
  });
  if (!result.entries.some((entry) => entry.id === result.finalEntryId)) {
    result.entries.push({
      id: result.finalEntryId,
      role: "assistant",
      text: "[final entry omitted]",
    });
  }
  return result;
}

function sourceEvidence(
  candidate: CaptureCandidate,
  snapshot: CaptureSnapshot,
): EvidenceEntry[] {
  const entries = new Map(snapshot.entries.map((entry) => [entry.id, entry]));
  return candidate.sourceEntryIds
    .map((id) => entries.get(id))
    .filter((entry): entry is EvidenceEntry => Boolean(entry));
}

function evidenceType(value: unknown): CaptureCandidate["evidenceType"] {
  if (value === "verifiedToolChange" || value === "verified_tool_change")
    return "verifiedToolChange";
  if (value === "userDecision" || value === "user_decision")
    return "userDecision";
  return undefined;
}

interface CandidateFields {
  title: string;
  content: string;
  context: string;
  sourceEntryIds: string[];
  kind: CaptureCandidate["evidenceType"];
}

type CandidateValidation<T> =
  | { valid: true; value: T }
  | { valid: false; reason: string };

function invalidCandidate<T>(reason: string): CandidateValidation<T> {
  return { valid: false, reason };
}

function validCandidate<T>(value: T): CandidateValidation<T> {
  return { valid: true, value };
}

function candidateEvidenceIneligibilityReason(
  source: EvidenceEntry[],
  kind: CaptureCandidate["evidenceType"],
): string | undefined {
  if (source.some((entry) => entry.role === "assistant"))
    return "assistant messages are not eligible evidence";
  if (source.some((entry) => isMemoryOperation(entry.toolName ?? "")))
    return "memory operations are not eligible evidence";
  if (
    source.some(
      (entry) =>
        entry.role === "toolResult" &&
        (!kind || kind !== "verifiedToolChange" || !entry.toolName),
    )
  ) {
    return "tool results require evidenceType verifiedToolChange and a named tool";
  }
  if (
    kind === "verifiedToolChange" &&
    source.some((entry) => entry.role !== "toolResult")
  ) {
    return "verified tool changes require only tool result evidence";
  }
  return undefined;
}

function candidateEvidenceIsEligible(
  source: EvidenceEntry[],
  kind: CaptureCandidate["evidenceType"],
): boolean {
  return candidateEvidenceIneligibilityReason(source, kind) === undefined;
}

function candidateFields(
  item: Record<string, unknown>,
  snapshot: CaptureSnapshot,
): CandidateValidation<CandidateFields> {
  const title = stringValue(item.title, 200);
  const content = stringValue(item.content, 2_000);
  const context = stringValue(item.context, 500);
  const sourceEntryIds = strings(
    item.sourceEntryIds ?? item.source_entry_ids,
    8,
    200,
  );
  if (!title)
    return invalidCandidate("title is missing, empty, or longer than 200 characters");
  if (!content) {
    return invalidCandidate(
      "content is missing, empty, or longer than 2000 characters",
    );
  }
  if (!context) {
    return invalidCandidate(
      "context is missing, empty, or longer than 500 characters",
    );
  }
  if (sourceEntryIds.length === 0)
    return invalidCandidate("sourceEntryIds has no valid evidence entry IDs");
  const source = sourceEvidence(
    { id: "", title, content, context, keywords: [], tags: [], sourceEntryIds },
    snapshot,
  );
  if (source.length !== sourceEntryIds.length)
    return invalidCandidate("sourceEntryIds references unknown evidence");
  const kind = evidenceType(item.evidenceType ?? item.evidence_type);
  const evidenceReason = candidateEvidenceIneligibilityReason(source, kind);
  if (evidenceReason) return invalidCandidate(evidenceReason);
  if (
    hasSensitiveData(title) ||
    hasSensitiveData(content) ||
    hasSensitiveData(context)
  ) {
    return invalidCandidate("candidate contains sensitive data");
  }
  return validCandidate({ title, content, context, sourceEntryIds, kind });
}

interface CandidateDestination {
  projectId?: number;
  projectName?: string;
  rationale?: string;
}

function candidateDestination(
  item: Record<string, unknown>,
): CandidateValidation<CandidateDestination> {
  const destination = record(item.destination);
  const projectIdValue = projectId(
    item.destinationProjectId ??
      item.targetProjectId ??
      destination?.projectId ??
      destination?.id,
  );
  const projectName = stringValue(
    item.destinationProjectName ??
      item.targetProjectName ??
      destination?.projectName ??
      destination?.name,
    200,
  );
  const rationale = stringValue(
    item.destinationRationale ??
      item.targetProjectRationale ??
      destination?.rationale,
    500,
  );
  const hasDestinationInput = [
    "destinationProjectId",
    "targetProjectId",
    "destinationProjectName",
    "targetProjectName",
    "destination",
  ].some((key) => key in item);
  if (hasDestinationInput && projectIdValue === undefined && !projectName) {
    return invalidCandidate(
      "destination project requires a positive ID or non-empty name",
    );
  }
  return validCandidate({
    ...(projectIdValue === undefined ? {} : { projectId: projectIdValue }),
    ...(projectName ? { projectName: sanitizeText(projectName) } : {}),
    ...(rationale ? { rationale: sanitizeText(rationale) } : {}),
  });
}

function resourceInput(item: Record<string, unknown>): Record<string, unknown> {
  return record(item.input) ?? item;
}

function resourceEvidence(
  item: Record<string, unknown>,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): string[] | undefined {
  const ids = strings(item.sourceEntryIds ?? item.source_entry_ids, 8, 200);
  if (
    ids.length === 0 ||
    ids.some((id) => !sourceIds.includes(id))
  ) {
    return undefined;
  }
  const source = sourceEvidence(
    {
      id: "resource",
      title: "resource",
      content: "resource",
      context: "resource",
      keywords: [],
      tags: [],
      sourceEntryIds: ids,
    },
    snapshot,
  );
  return candidateEvidenceIsEligible(source, kind) ? ids : undefined;
}

function resourceKey(
  item: Record<string, unknown>,
  fallback: string,
): string | undefined {
  const key = stringValue(item.key ?? item.id, 100) ?? fallback;
  return key.length > 0 ? sanitizeText(key) : undefined;
}

function entityResource(
  item: Record<string, unknown>,
  index: number,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): CaptureEntityResource | undefined {
  const evidence = resourceEvidence(item, sourceIds, snapshot, kind);
  const input = resourceInput(item);
  const name = stringValue(input.name, 200);
  const entityType = input.entity_type;
  if (
    !evidence ||
    !name ||
    (entityType !== "Organization" &&
      entityType !== "Individual" &&
      entityType !== "Team" &&
      entityType !== "Device" &&
      entityType !== "System" &&
      entityType !== "Other")
  ) {
    return undefined;
  }
  const customType = stringValue(input.custom_type, 100);
  if (entityType === "Other" && !customType) return undefined;
  const key = resourceKey(item, `entity-${index + 1}`);
  if (!key) return undefined;
  const entity: EntityInput = {
    name: sanitizeText(name),
    entity_type: entityType,
    tags: strings(input.tags, 10, 100),
    aka: strings(input.aka, 10, 100),
    project_ids: [],
    ...(customType ? { custom_type: sanitizeText(customType) } : {}),
    ...(stringValue(input.notes, MAX_RICH_NOTES)
      ? { notes: sanitizeText(stringValue(input.notes, MAX_RICH_NOTES)!) }
      : {}),
  };
  return { key, input: entity, sourceEntryIds: evidence };
}

function documentResource(
  item: Record<string, unknown>,
  index: number,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): CaptureDocumentResource | undefined {
  const evidence = resourceEvidence(item, sourceIds, snapshot, kind);
  const input = resourceInput(item);
  const title = stringValue(input.title, 200);
  const content = stringValue(input.content, MAX_RICH_DOCUMENT_TEXT);
  if (!evidence || !title || !content) return undefined;
  const key = resourceKey(item, `document-${index + 1}`);
  if (!key) return undefined;
  const document: DocumentInput = {
    title: sanitizeText(title),
    description: sanitizeText(
      stringValue(input.description, 2_000) ?? title,
    ),
    content: sanitizeText(content),
    tags: strings(input.tags, 10, 100),
    ...(stringValue(input.document_type, 100)
      ? { document_type: sanitizeText(stringValue(input.document_type, 100)!) }
      : {}),
    project_id: null,
  };
  return { key, input: document, sourceEntryIds: evidence };
}

function codeArtifactResource(
  item: Record<string, unknown>,
  index: number,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): CaptureCodeArtifactResource | undefined {
  const evidence = resourceEvidence(item, sourceIds, snapshot, kind);
  const input = resourceInput(item);
  const title = stringValue(input.title, 200);
  const code = stringValue(input.code, MAX_RICH_CODE);
  const language = stringValue(input.language, 100);
  if (!evidence || !title || !code || !language) return undefined;
  const key = resourceKey(item, `code-artifact-${index + 1}`);
  if (!key) return undefined;
  const artifact: CodeArtifactInput = {
    title: sanitizeText(title),
    description: sanitizeText(
      stringValue(input.description, 2_000) ?? title,
    ),
    code: sanitizeText(code),
    language: sanitizeText(language),
    tags: strings(input.tags, 10, 100),
    project_id: null,
  };
  return { key, input: artifact, sourceEntryIds: evidence };
}

function relationshipResource(
  item: Record<string, unknown>,
  index: number,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): CaptureRelationshipResource | undefined {
  const evidence = resourceEvidence(item, sourceIds, snapshot, kind);
  const input = resourceInput(item);
  const sourceEntityKey = stringValue(item.sourceEntityKey ?? input.sourceEntityKey, 100);
  const targetEntityKey = stringValue(item.targetEntityKey ?? input.targetEntityKey, 100);
  const relationshipType = stringValue(input.relationship_type, 100);
  if (!evidence || !sourceEntityKey || !targetEntityKey || !relationshipType)
    return undefined;
  const key = resourceKey(item, `relationship-${index + 1}`);
  if (!key) return undefined;
  const relationship: EntityRelationshipInput = {
    source_entity_id: 0,
    target_entity_id: 0,
    relationship_type: sanitizeText(relationshipType),
  };
  return {
    key,
    sourceEntityKey: sanitizeText(sourceEntityKey),
    targetEntityKey: sanitizeText(targetEntityKey),
    input: relationship,
    sourceEntryIds: evidence,
  };
}

function boundedResources<T>(values: T[], budget: { remaining: number }): T[] {
  const result: T[] = [];
  for (const value of values) {
    const size = Buffer.byteLength(JSON.stringify(value), "utf8");
    if (size > budget.remaining) continue;
    budget.remaining -= size;
    result.push(value);
  }
  return result;
}

function richResources(
  item: Record<string, unknown>,
  sourceIds: string[],
  snapshot: CaptureSnapshot,
  kind: CaptureCandidate["evidenceType"],
): Pick<
  CaptureCandidate,
  "entities" | "documents" | "codeArtifacts" | "relationships"
> {
  const rawEntities = Array.isArray(item.entities) ? item.entities : [];
  const rawDocuments = Array.isArray(item.documents) ? item.documents : [];
  const rawArtifacts = Array.isArray(item.codeArtifacts ?? item.code_artifacts)
    ? (item.codeArtifacts ?? item.code_artifacts) as unknown[]
    : [];
  const rawRelationships = Array.isArray(item.relationships)
    ? item.relationships
    : [];
  const entities = rawEntities
    .slice(0, MAX_RICH_ENTITIES)
    .map((raw, index) => {
      const value = record(raw);
      return value
        ? entityResource(value, index, sourceIds, snapshot, kind)
        : undefined;
    })
    .filter((value): value is CaptureEntityResource => Boolean(value));
  const documents = rawDocuments
    .slice(0, MAX_RICH_DOCUMENTS)
    .map((raw, index) => {
      const value = record(raw);
      return value
        ? documentResource(value, index, sourceIds, snapshot, kind)
        : undefined;
    })
    .filter((value): value is CaptureDocumentResource => Boolean(value));
  const codeArtifacts = rawArtifacts
    .slice(0, MAX_RICH_CODE_ARTIFACTS)
    .map((raw, index) => {
      const value = record(raw);
      return value
        ? codeArtifactResource(value, index, sourceIds, snapshot, kind)
        : undefined;
    })
    .filter((value): value is CaptureCodeArtifactResource => Boolean(value));
  let relationships = rawRelationships
    .slice(0, MAX_RICH_RELATIONSHIPS)
    .map((raw, index) => {
      const value = record(raw);
      return value
        ? relationshipResource(value, index, sourceIds, snapshot, kind)
        : undefined;
    })
    .filter((value): value is CaptureRelationshipResource => Boolean(value))
    .filter((value) => {
      const keys = new Set(entities.map((entity) => entity.key));
      return keys.has(value.sourceEntityKey) && keys.has(value.targetEntityKey);
    });
  const budget = { remaining: MAX_RICH_OUTPUT };
  const boundedEntities = boundedResources(entities, budget);
  const boundedDocuments = boundedResources(documents, budget);
  const boundedCodeArtifacts = boundedResources(codeArtifacts, budget);
  const boundedKeys = new Set(boundedEntities.map((entity) => entity.key));
  relationships = boundedResources(
    relationships.filter(
      (relationship) =>
        boundedKeys.has(relationship.sourceEntityKey) &&
        boundedKeys.has(relationship.targetEntityKey),
    ),
    budget,
  );
  return {
    ...(boundedEntities.length ? { entities: boundedEntities } : {}),
    ...(boundedDocuments.length ? { documents: boundedDocuments } : {}),
    ...(boundedCodeArtifacts.length
      ? { codeArtifacts: boundedCodeArtifacts }
      : {}),
    ...(relationships.length ? { relationships } : {}),
  };
}

function buildCandidate(
  item: Record<string, unknown>,
  index: number,
  fields: CandidateFields,
  destination: CandidateDestination,
  snapshot: CaptureSnapshot,
): CaptureCandidate | undefined {
  const importance = numberValue(item.importance);
  const candidate: CaptureCandidate = {
    id: stringValue(item.id, 100) ?? `candidate-${index + 1}`,
    title: sanitizeText(fields.title),
    content: sanitizeText(fields.content),
    context: sanitizeText(fields.context),
    keywords: strings(item.keywords),
    tags: strings(item.tags),
    sourceEntryIds: fields.sourceEntryIds,
    sourceFiles: strings(item.sourceFiles ?? item.source_files, 20, 200),
  };
  if (importance !== undefined) {
    candidate.importance = Math.max(1, Math.min(10, Math.round(importance)));
  }
  if (fields.kind) candidate.evidenceType = fields.kind;
  if (destination.projectId !== undefined)
    candidate.destinationProjectId = destination.projectId;
  if (destination.projectName)
    candidate.destinationProjectName = destination.projectName;
  if (destination.rationale)
    candidate.destinationRationale = destination.rationale;
  Object.assign(
    candidate,
    richResources(item, fields.sourceEntryIds, snapshot, fields.kind),
  );
  if (hasSensitiveData(JSON.stringify(candidate))) return undefined;
  return candidate;
}

function eligibleCandidate(
  value: unknown,
  snapshot: CaptureSnapshot,
  index: number,
): CandidateValidation<CaptureCandidate> {
  const item = record(value);
  if (!item) return invalidCandidate("candidate must be a JSON object");
  if (hasSensitiveData(JSON.stringify(item)))
    return invalidCandidate("candidate contains sensitive data");
  const fields = candidateFields(item, snapshot);
  if (!fields.valid) return fields;
  const destination = candidateDestination(item);
  if (!destination.valid) return destination;
  const candidate = buildCandidate(
    item,
    index,
    fields.value,
    destination.value,
    snapshot,
  );
  return candidate
    ? validCandidate(candidate)
    : invalidCandidate("candidate contains sensitive data after normalization");
}

interface CandidateExtraction {
  candidates: CaptureCandidate[];
  skipped: Array<{ id: string; reason: string }>;
}

function parseCandidates(
  value: unknown,
  snapshot: CaptureSnapshot,
  maxCandidates: number,
  onCandidate?: (id: string, raw: unknown, reason?: string) => void,
): CandidateExtraction {
  const response = record(value);
  if (!response || !Array.isArray(response.candidates))
    throw new InvalidCaptureOutput("capture model did not return candidates");
  const candidates: CaptureCandidate[] = [];
  const skipped: Array<{ id: string; reason: string }> = [];
  const seenIds = new Set<string>();
  for (const [index, raw] of response.candidates
    .slice(0, maxCandidates)
    .entries()) {
    const rawRecord = record(raw);
    const id = stringValue(rawRecord?.id, 100) ?? `candidate-${index + 1}`;
    if (seenIds.has(id)) {
      onCandidate?.(id, raw, "duplicate candidate ID");
      skipped.push({ id, reason: "duplicate candidate ID" });
      continue;
    }
    seenIds.add(id);
    const validation = eligibleCandidate(raw, snapshot, index);
    onCandidate?.(id, raw, validation.valid ? undefined : validation.reason);
    if (validation.valid) candidates.push(validation.value);
    else skipped.push({ id, reason: validation.reason });
  }
  return { candidates, skipped };
}

function decisionMemoryId(
  response: Record<string, unknown>,
): number | undefined {
  if (
    "conflictingMemoryId" in response &&
    projectId(response.conflictingMemoryId) === undefined
  ) {
    throw new InvalidCaptureOutput(
      "overlap model returned an invalid conflicting memory ID",
    );
  }
  return projectId(response.conflictingMemoryId);
}

function decisionTargetMemoryId(
  response: Record<string, unknown>,
): number | undefined {
  if ("memoryId" in response && projectId(response.memoryId) === undefined) {
    throw new InvalidCaptureOutput(
      "overlap model returned an invalid target memory ID",
    );
  }
  return projectId(response.memoryId);
}

function decisionMemoryIds(
  response: Record<string, unknown>,
): number[] | undefined {
  if (!("conflictingMemoryIds" in response)) return undefined;
  const value = response.conflictingMemoryIds;
  if (
    !Array.isArray(value) ||
    value.length > 8 ||
    value.some((id) => projectId(id) === undefined)
  ) {
    throw new InvalidCaptureOutput(
      "overlap model returned invalid conflicting memory IDs",
    );
  }
  return value.map((id) => projectId(id)!);
}

function decisionEvidenceIds(
  response: Record<string, unknown>,
): string[] | undefined {
  if (!("sourceEntryIds" in response)) return undefined;
  const value = response.sourceEntryIds;
  if (
    !Array.isArray(value) ||
    value.length > 8 ||
    value.some((id) => typeof id !== "string" || !id.trim() || id.length > 200)
  ) {
    throw new InvalidCaptureOutput(
      "overlap model returned invalid evidence IDs",
    );
  }
  return value.map((id) => sanitizeText(id.trim()));
}

function decisionPartial(response: Record<string, unknown>): boolean {
  if ("partial" in response && typeof response.partial !== "boolean") {
    throw new InvalidCaptureOutput(
      "overlap model returned an invalid partial flag",
    );
  }
  return response.partial === true;
}

function parseDecision(value: unknown): CaptureDecision {
  const response = record(value);
  if (!response)
    throw new InvalidCaptureOutput(
      "overlap model did not return a decision object",
    );
  const action = response.action ?? response.decision;
  if (
    action !== "create" &&
    action !== "skip" &&
    action !== "supersede" &&
    action !== "escalate"
  ) {
    throw new InvalidCaptureOutput("overlap model returned an unknown action");
  }
  const conflictingMemoryId = decisionMemoryId(response);
  const memoryId = decisionTargetMemoryId(response);
  const conflictingMemoryIds = decisionMemoryIds(response);
  const sourceEntryIds = decisionEvidenceIds(response);
  const partial = decisionPartial(response);
  const decision: CaptureDecision = { action };
  const reason = stringValue(response.reason, 500);
  const oldClaim = stringValue(response.oldClaim, 1_000);
  const newClaim = stringValue(response.newClaim, 1_000);
  if (reason) decision.reason = reason;
  if (conflictingMemoryId !== undefined)
    decision.conflictingMemoryId = conflictingMemoryId;
  if (memoryId !== undefined) decision.memoryId = memoryId;
  if (conflictingMemoryIds?.length)
    decision.conflictingMemoryIds = conflictingMemoryIds;
  if (oldClaim) decision.oldClaim = oldClaim;
  if (newClaim) decision.newClaim = newClaim;
  if (sourceEntryIds) decision.sourceEntryIds = sourceEntryIds;
  if (partial) decision.partial = true;
  return decision;
}

function decisionConflictIds(decision: CaptureDecision): number[] {
  if (decision.conflictingMemoryIds?.length)
    return decision.conflictingMemoryIds;
  if (decision.conflictingMemoryId === undefined) return [];
  return [decision.conflictingMemoryId];
}

function firstConflictId(decision: CaptureDecision): number | undefined {
  return decision.conflictingMemoryId ?? decision.conflictingMemoryIds?.[0];
}

function currentProjectId(context: WorkContext): number | undefined {
  return projectId(context.project?.id);
}

function memoryInput(
  candidate: CaptureCandidate,
  projectIds: number[],
  context: WorkContext,
): MemoryInput {
  const provenance = sanitizeText(
    [
      `Session: ${context.sessionId.slice(0, 60)}`,
      `Branch: ${context.branchId.slice(0, 60)}`,
      `Evidence entries: ${candidate.sourceEntryIds
        .slice(0, 8)
        .map((id) => sanitizeText(id).slice(0, 32))
        .join(", ")}`,
    ].join("; "),
  ).slice(0, 320);
  const contextBudget = Math.max(0, MEMORY_CONTEXT_MAX - provenance.length - 1);
  const explanation = sanitizeText(candidate.context).slice(0, contextBudget);
  return {
    title: candidate.title,
    content: candidate.content,
    context: explanation ? `${explanation}\n${provenance}` : provenance,
    keywords: candidate.keywords,
    tags: candidate.tags,
    ...(candidate.importance === undefined
      ? {}
      : { importance: candidate.importance }),
    project_ids: projectIds,
    ...(context.repoName ? { source_repo: context.repoName } : {}),
    ...(candidate.sourceFiles?.length
      ? { source_files: candidate.sourceFiles }
      : {}),
  };
}

function captureKnowledgePlan(
  candidate: CaptureCandidate,
  destination: number,
  memoryId: number,
  context: WorkContext,
  existingMemory?: Memory,
  operationId = "capture",
): KnowledgeWritePlan | undefined {
  const hasResources = Boolean(
    candidate.entities?.length ||
      candidate.documents?.length ||
      candidate.codeArtifacts?.length ||
      candidate.relationships?.length,
  );
  if (!hasResources) return undefined;
  const provenance = {
    ...(context.repoName ? { source_repo: context.repoName } : {}),
    ...(candidate.sourceFiles?.length
      ? { source_files: candidate.sourceFiles }
      : {}),
  };
  const entities = candidate.entities?.map((resource) => ({
    key: resource.key,
    input: {
      ...resource.input,
      ...provenance,
      project_ids: [destination],
    },
  }));
  const documents = candidate.documents?.map((resource) => ({
    key: resource.key,
    input: { ...resource.input, ...provenance, project_id: destination },
  }));
  const codeArtifacts = candidate.codeArtifacts?.map((resource) => ({
    key: resource.key,
    input: { ...resource.input, ...provenance, project_id: destination },
  }));
  const relationships = candidate.relationships?.map((resource) => ({
    key: resource.key,
    sourceEntityKey: resource.sourceEntityKey,
    targetEntityKey: resource.targetEntityKey,
    input: resource.input,
  }));
  const entityMemoryLinks: KnowledgeEntityMemoryLinkPlan[] = (entities ?? []).map(
    (entity) => ({ entityKey: entity.key }),
  );
  return {
    operationId,
    projectId: destination,
    memoryId,
    expectedClaim: {
      title: existingMemory?.title ?? candidate.title,
      content: existingMemory?.content ?? candidate.content,
    },
    attachResources: Boolean(documents?.length || codeArtifacts?.length),
    ...(existingMemory?.document_ids
      ? { existingDocumentIds: existingMemory.document_ids }
      : {}),
    ...(existingMemory?.code_artifact_ids
      ? { existingCodeArtifactIds: existingMemory.code_artifact_ids }
      : {}),
    ...(entities?.length ? { entities } : {}),
    ...(documents?.length ? { documents } : {}),
    ...(codeArtifacts?.length ? { codeArtifacts } : {}),
    ...(relationships?.length ? { relationships } : {}),
    ...(entityMemoryLinks.length ? { entityMemoryLinks } : {}),
  };
}

function candidateHasKnowledge(candidate: CaptureCandidate): boolean {
  return Boolean(
    candidate.entities?.length ||
      candidate.documents?.length ||
      candidate.codeArtifacts?.length ||
      candidate.relationships?.length,
  );
}

function overlapCandidate(candidate: CaptureCandidate): Record<string, unknown> {
  return {
    id: candidate.id,
    title: candidate.title,
    content: candidate.content,
    context: candidate.context,
    keywords: candidate.keywords,
    tags: candidate.tags,
    sourceEntryIds: candidate.sourceEntryIds,
    ...(candidate.evidenceType ? { evidenceType: candidate.evidenceType } : {}),
    ...(candidate.entities?.length
      ? {
          entities: candidate.entities.map((resource) => ({
            key: resource.key,
            sourceEntryIds: resource.sourceEntryIds,
            input: {
              name: resource.input.name,
              entity_type: resource.input.entity_type,
              tags: resource.input.tags,
              aka: resource.input.aka,
            },
          })),
        }
      : {}),
    ...(candidate.documents?.length
      ? {
          documents: candidate.documents.map((resource) => ({
            key: resource.key,
            sourceEntryIds: resource.sourceEntryIds,
            input: {
              title: resource.input.title,
              description: resource.input.description,
              document_type: resource.input.document_type ?? "text",
              tags: resource.input.tags,
            },
          })),
        }
      : {}),
    ...(candidate.codeArtifacts?.length
      ? {
          codeArtifacts: candidate.codeArtifacts.map((resource) => ({
            key: resource.key,
            sourceEntryIds: resource.sourceEntryIds,
            input: {
              title: resource.input.title,
              description: resource.input.description,
              language: resource.input.language,
              tags: resource.input.tags,
            },
          })),
        }
      : {}),
    ...(candidate.relationships?.length
      ? {
          relationships: candidate.relationships.map((resource) => ({
            key: resource.key,
            sourceEntityKey: resource.sourceEntityKey,
            targetEntityKey: resource.targetEntityKey,
            sourceEntryIds: resource.sourceEntryIds,
            input: { relationship_type: resource.input.relationship_type },
          })),
        }
      : {}),
  };
}

function sameMemory(left: Memory, right: Memory): boolean {
  const projects = (value: Memory) =>
    [...value.project_ids].sort((a, b) => a - b);
  const attachments = (value: Memory) => ({
    documents: [...(value.document_ids ?? [])].sort((a, b) => a - b),
    codeArtifacts: [...(value.code_artifact_ids ?? [])].sort((a, b) => a - b),
  });
  return (
    left.id === right.id &&
    left.title === right.title &&
    left.content === right.content &&
    left.context === right.context &&
    JSON.stringify(projects(left)) === JSON.stringify(projects(right)) &&
    JSON.stringify(attachments(left)) === JSON.stringify(attachments(right)) &&
    left.is_obsolete === right.is_obsolete &&
    (left.superseded_by ?? null) === (right.superseded_by ?? null)
  );
}

function scrubError(error: unknown): string {
  return sanitizeText(
    error instanceof Error ? error.message : String(error),
  ).slice(0, 1_000);
}

function isFinalOutcome(outcome: unknown): boolean {
  const stage = record(outcome)?.stage;
  return typeof stage === "string" && FINAL_STAGES.has(stage);
}

function trustedAdditionalEntries(value: unknown): EvidenceEntry[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_RESOLUTION_ENTRIES) {
    throw new Error(
      `Additional resolution evidence must contain at most ${MAX_RESOLUTION_ENTRIES} entries`,
    );
  }
  return value.map((item) => {
    const entry = record(item);
    const id = stringValue(entry?.id, 200);
    const text = stringValue(entry?.text, MAX_ENTRY_TEXT);
    const role = entry?.role;
    if (!id || !text || (role !== "user" && role !== "toolResult")) {
      throw new Error(
        "Additional resolution evidence must be a user or verified tool entry",
      );
    }
    if (hasSensitiveData(text))
      throw new Error("Additional resolution evidence contains sensitive data");
    if (role === "toolResult") {
      const toolName = stringValue(entry?.toolName, 100);
      if (!toolName || isMemoryOperation(toolName)) {
        throw new Error(
          "Additional tool evidence is not an eligible verified change",
        );
      }
      return { id, role, text: sanitizeText(text), toolName };
    }
    return { id, role, text: sanitizeText(text) };
  });
}

export class CaptureService {
  private readonly queue: DurableQueueStore;
  private readonly client: ForgetfulClient;
  private readonly model: MemoryModelClient;
  private readonly identity: QueueIdentity;
  private readonly sessionId?: string;
  private readonly branchId?: string;
  private readonly policy: string;
  private readonly isEnabled: () => boolean | Promise<boolean>;
  private readonly getMode: () => CaptureMode | Promise<CaptureMode>;
  private readonly maxCandidates: number;
  private readonly maxModelCalls: number;
  private readonly maxJobsPerCheckpoint: number;
  private readonly now: () => Date;
  private readonly knowledgeWriter?: KnowledgeWriter;
  private readonly logger?: DiagnosticLogger;
  private stopped = false;

  constructor(options: CaptureServiceOptions) {
    this.logger = options.logger;
    this.queue = options.queue;
    this.client = options.client;
    this.knowledgeWriter = options.client.knowledge
      ? new KnowledgeWriter(
          options.client.knowledge,
          (id, signal) => options.client.get(id, signal),
        )
      : undefined;
    this.model = options.model;
    this.identity = {
      instanceId: options.instanceId,
      endpoint: options.endpoint,
      accountId: options.accountId,
    };
    this.sessionId = options.sessionId;
    this.branchId = options.branchId;
    this.policy =
      options.policy ??
      "Capture atomic, evidenced project knowledge; never capture secrets or unsupported claims.";
    this.isEnabled = options.isEnabled ?? (() => true);
    this.getMode = options.getMode ?? (() => "auto");
    this.maxCandidates = Math.max(1, Math.min(3, options.maxCandidates ?? 3));
    this.maxModelCalls = Math.max(
      1,
      Math.min(MAX_MODEL_CALLS, options.maxModelCalls ?? MAX_MODEL_CALLS),
    );
    this.maxJobsPerCheckpoint = Math.max(1, options.maxJobsPerCheckpoint ?? 8);
    this.now = options.now ?? (() => new Date());
  }

  private correlation(job: QueueJob, candidateId?: string) {
    return {
      sessionId: job.snapshot.context.sessionId,
      branchId: job.snapshot.context.branchId,
      jobId: job.id,
      ...(candidateId ? { candidateId } : {}),
    };
  }

  private emit(
    level: "info" | "debug", event: string, data: Record<string, unknown>,
  ): void {
    try {
      if (!this.logger) return;
      const safe = sanitizeValue(data) as Record<string, unknown>;
      const keys = ["entries", "candidate", "outcome", "response", "decision"]
        .filter((key) => safe[key] !== undefined);
      const limit = Math.floor(60_000 / Math.max(1, keys.length));
      // Bound content separately so truncation preserves correlation and exact rejection reasons.
      for (const key of keys) {
        const json = JSON.stringify(safe[key]);
        if (Buffer.byteLength(json) <= limit) continue;
        let preview = json;
        do {
          preview = preview.slice(0, Math.floor(preview.length * 0.75));
        } while (Buffer.byteLength(JSON.stringify(preview)) > limit - 100);
        safe[key] = { truncated: true, preview };
      }
      this.logger.emit(level, `capture.${event}`, safe);
    } catch {
      // Diagnostics are optional and must never change capture or its durable checkpoints.
    }
  }

  private async enabled(mode?: CaptureMode): Promise<boolean> {
    if (this.stopped || !(await this.isEnabled())) return false;
    const liveMode = await this.getMode();
    return liveMode !== "off" && (mode ?? liveMode) !== "off";
  }

  private async ensureModelCallAllowed(job: QueueJob): Promise<void> {
    if (!(await this.enabled(job.snapshot.mode)))
      throw new CapturePause("capture is disabled");
    if (job.callCount >= this.maxModelCalls)
      throw new CapturePause("capture model call budget reached");
  }

  private async ensureWriteAllowed(jobMode: CaptureMode): Promise<void> {
    if (!(await this.enabled(jobMode)))
      throw new CapturePause("capture is disabled");
    if (jobMode !== "auto" || (await this.getMode()) !== "auto") {
      throw new CapturePause("capture writes are disabled in observe mode");
    }
  }

  private policyFor(
    snapshot: CaptureSnapshot,
    purpose: "capture" | "overlap",
  ): string {
    const core =
      purpose === "capture" ? CAPTURE_POLICY_CORE : OVERLAP_POLICY_CORE;
    return `${core}\nTrusted capture overlay:\n${snapshot.policy || this.policy}`;
  }

  async enqueue(snapshot: CaptureSnapshot): Promise<CaptureEnqueueResult> {
    const correlation = {
      sessionId: snapshot.context.sessionId, branchId: snapshot.context.branchId,
      jobId: snapshot.id,
    };
    try {
      const result = await this.enqueueSnapshot(snapshot);
      this.emit("info", result.queued ? "queued" : "skipped", {
        ...correlation, jobId: result.jobId, reason: result.reason,
      });
      return result;
    } catch (error) {
      this.emit("info", "error", { ...correlation, operation: "enqueue" });
      this.emit("debug", "error_detail", { ...correlation, error: scrubError(error) });
      throw error;
    }
  }

  private async enqueueSnapshot(snapshot: CaptureSnapshot): Promise<CaptureEnqueueResult> {
    const status =
      (snapshot as CaptureSnapshot & { finalStatus?: string; status?: string })
        .finalStatus ??
      (snapshot as CaptureSnapshot & { status?: string }).status;
    const mode = await this.getMode();
    if (
      status &&
      ["error", "aborted", "cancelled"].includes(status.toLowerCase())
    ) {
      await this.queue.advanceWatermark(snapshot);
      return {
        queued: false,
        jobId: snapshot.id,
        reason: "final run did not complete",
      };
    }
    if (
      mode === "off" ||
      snapshot.mode === "off" ||
      !(await this.isEnabled())
    ) {
      await this.queue.advanceWatermark(snapshot);
      return { queued: false, jobId: snapshot.id, reason: "capture is off" };
    }
    const safeSnapshot = snapshotForPersistence(snapshot);
    return this.queue.enqueue(safeSnapshot);
  }

  private async resolveDestination(
    candidate: CaptureCandidate,
    context: WorkContext,
  ): Promise<number | undefined> {
    const current = currentProjectId(context);
    const requested = candidate.destinationProjectId;
    if (requested === undefined && !candidate.destinationProjectName)
      return current;
    if (requested === undefined && candidate.destinationProjectName) {
      const projects = (await this.client.listProjects()).slice(0, 100);
      const resolved = projects.find(
        (project) => project.name === candidate.destinationProjectName,
      );
      const resolvedId = projectId(resolved?.id);
      if (
        resolvedId === undefined ||
        (resolvedId !== current && !candidate.destinationRationale)
      )
        return undefined;
      return resolvedId;
    }
    if (requested === current) return current;
    if (!candidate.destinationRationale) return undefined;
    const projects = (await this.client.listProjects()).slice(0, 100);
    const resolved = projects.find((project) => project.id === requested);
    return projectId(resolved?.id);
  }

  private async addConflict(
    job: QueueJob,
    candidate: CaptureCandidate,
    destinationProjectId: number,
    decision: CaptureDecision,
    reason: string,
    oldMemory?: Memory,
    replacementId?: number,
  ): Promise<PendingConflict> {
    const evidence = sourceEvidence(candidate, job.snapshot)
      .map((entry) => `${entry.id}: ${entry.text}`)
      .slice(0, 8);
    const selectedMemoryId =
      decision.conflictingMemoryId ??
      (decision.conflictingMemoryIds?.length === 1
        ? decision.conflictingMemoryIds[0]
        : undefined);
    const conflict: PendingConflict = {
      id:
        "conflict-" +
        createHash("sha256")
          .update(`${job.id}\u0000${candidate.id}`)
          .digest("hex")
          .slice(0, 24),
      jobId: job.id,
      candidateId: candidate.id,
      binding: clone(this.identity),
      sessionId: job.snapshot.context.sessionId,
      branchId: job.snapshot.context.branchId,
      destinationProjectId,
      context: sanitizeValue(job.snapshot.context) as WorkContext,
      ...(selectedMemoryId === undefined
        ? {}
        : { oldMemoryId: selectedMemoryId }),
      ...(decision.conflictingMemoryIds?.length
        ? { oldMemoryIds: decision.conflictingMemoryIds }
        : {}),
      ...(decision.oldClaim ? { oldClaim: decision.oldClaim } : {}),
      ...(decision.newClaim ? { newClaim: decision.newClaim } : {}),
      ...(oldMemory ? { oldMemory: sanitizeValue(oldMemory) } : {}),
      ...(replacementId === undefined ? {} : { replacementId }),
      candidate: clone(candidate),
      sourceEntryIds: candidate.sourceEntryIds,
      evidence,
      ...(decision.partial ? { partial: true } : {}),
      reason: sanitizeText(reason),
      status: "pending",
      createdAt: this.now().toISOString(),
      updatedAt: this.now().toISOString(),
    };
    return this.queue.addConflict(conflict);
  }

  private async checkpointOutcome(
    job: QueueJob,
    candidateId: string,
    outcome: unknown,
  ): Promise<QueueJob> {
    const updated = await this.queue.checkpoint(job.id, candidateId, clone(outcome));
    const value = record(outcome);
    const previous = record(job.candidateOutcomes[candidateId]);
    this.emit("info", value?.stage === "skipped" ? "skipped" : "candidate_progress", {
      ...this.correlation(job, candidateId), stage: value?.stage, action: value?.action,
      destinationProjectId: value?.destinationProjectId ?? previous?.destinationProjectId,
      memoryId: value?.memoryId, oldMemoryId: value?.oldMemoryId,
      replacementId: value?.replacementId, conflictId: value?.conflictId,
    });
    this.emit("debug", "candidate_outcome", {
      ...this.correlation(job, candidateId), outcome,
    });
    return updated;
  }

  private async destinationProjects(
    candidate: CaptureCandidate,
    context: WorkContext,
  ): Promise<number[]> {
    const destination = await this.resolveDestination(candidate, context);
    if (destination === undefined)
      throw new InvalidCaptureOutput(
        "capture destination could not be resolved",
      );
    return [destination];
  }

  private async validateDecision(
    decision: CaptureDecision,
    candidate: CaptureCandidate,
    overlaps: Memory[],
  ): Promise<void> {
    const overlapIds = new Set(overlaps.map((memory) => memory.id));
    if (decision.action === "supersede" || decision.action === "escalate") {
      const ids = decisionConflictIds(decision);
      if (ids.length === 0 || ids.some((id) => !overlapIds.has(id))) {
        throw new InvalidCaptureOutput(
          "conflict references a memory outside the overlap search",
        );
      }
      if (
        !decision.sourceEntryIds?.length ||
        decision.sourceEntryIds.some(
          (id) => !candidate.sourceEntryIds.includes(id),
        )
      ) {
        throw new InvalidCaptureOutput(
          "conflict evidence is outside the candidate evidence",
        );
      }
    }
    if (
      decision.action === "supersede" &&
      (!decision.reason || !decision.oldClaim || !decision.newClaim)
    ) {
      throw new InvalidCaptureOutput(
        "supersession requires both claims and a same-fact rationale",
      );
    }
    if (
      decision.action === "escalate" &&
      (!decision.reason || !decision.oldClaim || !decision.newClaim)
    ) {
      throw new InvalidCaptureOutput(
        "escalation requires both claims and a reason",
      );
    }
    if (
      decision.action === "skip" &&
      decision.memoryId !== undefined &&
      !overlapIds.has(decision.memoryId)
    ) {
      throw new InvalidCaptureOutput(
        "skip references a memory outside the overlap search",
      );
    }
  }

  private async createMemory(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    projectIds = [destination],
  ): Promise<number> {
    await this.ensureWriteAllowed(job.snapshot.mode);
    const input = memoryInput(candidate, projectIds, job.snapshot.context);
    const result = await this.client.create(input);
    if (!projectId(result.id))
      throw new Error("Forgetful returned an invalid memory ID");
    this.emit("info", "write_completed", {
      ...this.correlation(job, candidate.id), operation: "create", memoryId: result.id,
      destinationProjectId: destination, projectIds,
    });
    return result.id;
  }

  private async writeKnowledge(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    memoryId: number,
    baseOutcome: Record<string, unknown>,
    finalStage: "created" | "skipped" | "replacement-created",
    existingMemory?: Memory,
  ): Promise<QueueJob> {
    const plan = captureKnowledgePlan(
      candidate,
      destination,
      memoryId,
      job.snapshot.context,
      existingMemory,
      `${job.id}/${candidate.id}`,
    );
    if (!plan || !this.knowledgeWriter) {
      return this.checkpointOutcome(job, candidate.id, {
        ...baseOutcome,
        stage: finalStage,
        knowledgeComplete: true,
      });
    }
    let currentJob = job;
    const previous = record(baseOutcome.knowledgeState) as
      | Partial<KnowledgeWriteState>
      | undefined;
    const state = await this.knowledgeWriter.execute(
      plan,
      previous,
      async (checkpoint) => {
        currentJob = await this.checkpointOutcome(currentJob, candidate.id, {
          ...baseOutcome,
          stage: "knowledge-partial",
          memoryId,
          destinationProjectId: destination,
          knowledgeState: sanitizeValue(checkpoint),
        });
      },
      undefined,
      async () => this.ensureWriteAllowed(job.snapshot.mode),
    );
    return this.checkpointOutcome(currentJob, candidate.id, {
      ...baseOutcome,
      stage: finalStage,
      memoryId,
      destinationProjectId: destination,
      knowledgeComplete: true,
      knowledgeState: sanitizeValue(state),
    });
  }

  private async applySupersession(
    job: QueueJob,
    oldMemory: Memory,
    replacementId: number,
    reason: string,
  ): Promise<"applied" | "already" | "stale"> {
    await this.ensureWriteAllowed(job.snapshot.mode);
    const current = await this.client.get(oldMemory.id);
    if (current.is_obsolete && current.superseded_by === replacementId)
      return "already";
    if (current.is_obsolete) return "stale";
    if (!sameMemory(current, oldMemory)) return "stale";
    await this.ensureWriteAllowed(job.snapshot.mode);
    await this.client.supersede(oldMemory.id, replacementId, reason);
    return "applied";
  }

  private async finishSupersession(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    oldMemory: Memory,
    replacementId: number,
    reason: string,
    decision?: CaptureDecision,
  ): Promise<QueueJob> {
    const result = await this.applySupersession(
      job,
      oldMemory,
      replacementId,
      reason,
    );
    if (result === "already" || result === "applied") {
      return this.checkpointOutcome(job, candidate.id, {
        stage: "superseded",
        action: "supersede",
        oldMemoryId: oldMemory.id,
        replacementId,
        reason,
      });
    }
    if (result === "stale") {
      const current = await this.client.get(oldMemory.id);
      const conflict = await this.addConflict(
        job,
        candidate,
        destination,
        decision ?? { action: "supersede", conflictingMemoryId: oldMemory.id },
        "The selected memory changed before obsolescence could be applied.",
        current,
        replacementId,
      );
      return this.checkpointOutcome(job, candidate.id, {
        stage: "escalated",
        action: "escalate",
        conflictId: conflict.id,
        reason: "stale selected memory",
      });
    }
    throw new Error("supersession did not complete");
  }

  private async processReplacementCheckpoint(
    job: QueueJob,
    candidate: CaptureCandidate,
    outcome: Record<string, unknown>,
  ): Promise<QueueJob> {
    const replacementId = projectId(outcome.replacementId);
    const oldMemoryId = projectId(outcome.oldMemoryId);
    const destination = projectId(outcome.destinationProjectId);
    const oldMemory = record(outcome.oldMemory) as Memory | undefined;
    if (!replacementId || !oldMemoryId || !destination || !oldMemory) {
      throw new InvalidCaptureOutput("incomplete supersession checkpoint");
    }
    if (outcome.knowledgeComplete === true) {
      return this.finishSupersession(
        job,
        candidate,
        destination,
        oldMemory,
        replacementId,
        stringValue(outcome.reason, 500) ?? "Evidenced project change",
        record(outcome.decision) as CaptureDecision | undefined,
      );
    }
    const written = await this.writeKnowledge(
      job,
      candidate,
      destination,
      replacementId,
      outcome,
      "replacement-created",
    );
    return this.finishSupersession(
      written,
      candidate,
      destination,
      oldMemory,
      replacementId,
      stringValue(outcome.reason, 500) ?? "Evidenced project change",
      record(outcome.decision) as CaptureDecision | undefined,
    );
  }

  private async processKnowledgeCheckpoint(
    job: QueueJob,
    candidate: CaptureCandidate,
    outcome: Record<string, unknown>,
  ): Promise<QueueJob> {
    const memoryId = projectId(outcome.memoryId);
    const destination = projectId(outcome.destinationProjectId);
    if (!memoryId || !destination) {
      throw new InvalidCaptureOutput("incomplete knowledge checkpoint");
    }
    const action = outcome.action;
    const oldMemory = (record(outcome.existingMemory) ??
      record(outcome.oldMemory)) as Memory | undefined;
    let finalStage: "created" | "skipped" | "replacement-created" = "created";
    if (action === "skip") finalStage = "skipped";
    if (action === "supersede") finalStage = "replacement-created";
    const written = await this.writeKnowledge(
      job,
      candidate,
      destination,
      memoryId,
      outcome,
      finalStage,
      action === "skip" ? oldMemory : undefined,
    );
    if (action !== "supersede") return written;
    const writtenOutcome = record(written.candidateOutcomes[candidate.id]);
    const replacementOldMemory = (record(writtenOutcome?.oldMemory) ??
      oldMemory) as Memory | undefined;
    const replacementId = projectId(
      writtenOutcome?.replacementId ?? writtenOutcome?.memoryId,
    );
    if (!replacementId || !replacementOldMemory) {
      throw new InvalidCaptureOutput("incomplete supersession checkpoint");
    }
    return this.finishSupersession(
      written,
      candidate,
      destination,
      replacementOldMemory,
      replacementId,
      stringValue(outcome.reason, 500) ?? "Evidenced project change",
      record(outcome.decision) as CaptureDecision | undefined,
    );
  }

  private async prepareDestination(
    job: QueueJob,
    candidate: CaptureCandidate,
  ): Promise<{ job: QueueJob; destination?: number }> {
    try {
      const [destination] = await this.destinationProjects(
        candidate,
        job.snapshot.context,
      );
      return { job, destination };
    } catch (error) {
      if (!(error instanceof InvalidCaptureOutput)) throw error;
      const skipped = await this.checkpointOutcome(job, candidate.id, {
        stage: "skipped",
        action: "skip",
        reason: error.message,
        destinationProjectId: candidate.destinationProjectId,
      });
      return { job: skipped };
    }
  }

  private async loadOverlaps(
    job: QueueJob,
    candidate: CaptureCandidate,
    outcome: Record<string, unknown> | undefined,
    destination: number,
  ): Promise<
    | {
        status: "ready";
        job: QueueJob;
        outcome: Record<string, unknown> | undefined;
        overlaps: Memory[];
      }
    | { status: "skipped"; job: QueueJob }
  > {
    if (Array.isArray(outcome?.overlaps)) {
      return {
        status: "ready",
        job,
        outcome,
        overlaps: outcome.overlaps as Memory[],
      };
    }
    if (!(await this.enabled(job.snapshot.mode)))
      throw new CapturePause("capture is disabled");
    const overlaps = await this.client.search({
      query: `${candidate.title}\n${candidate.content}`.slice(0, 2_000),
      query_context: `${candidate.context} Project ${destination}`.slice(
        0,
        2_000,
      ),
      project_ids: [destination],
      strict_project_filter: true,
      k: 8,
    });
    if (hasSensitiveData(JSON.stringify(overlaps))) {
      const skipped = await this.checkpointOutcome(job, candidate.id, {
        stage: "skipped",
        action: "skip",
        reason: "overlap contained sensitive data",
        destinationProjectId: destination,
      });
      return { status: "skipped", job: skipped };
    }
    const currentJob = await this.checkpointOutcome(job, candidate.id, {
      stage: "overlaps",
      candidate,
      destinationProjectId: destination,
      overlaps: sanitizeValue(overlaps),
    });
    return {
      status: "ready",
      job: currentJob,
      outcome: record(currentJob.candidateOutcomes[candidate.id]),
      overlaps,
    };
  }

  private async decideOverlap(
    job: QueueJob,
    candidate: CaptureCandidate,
    outcome: Record<string, unknown> | undefined,
    overlaps: Memory[],
    destination: number,
  ): Promise<
    | { status: "ready"; job: QueueJob; decision: CaptureDecision }
    | { status: "skipped"; job: QueueJob }
  > {
    if (outcome?.stage === "decided") {
      return {
        status: "ready",
        job,
        decision: outcome.decision as CaptureDecision,
      };
    }
    await this.ensureModelCallAllowed(job);
    const currentJob = await this.queue.checkpoint(job.id, {
      callCount: job.callCount + 1,
    });
    const response = await this.model.complete({
      purpose: "overlap",
      diagnosticContext: this.correlation(currentJob, candidate.id),
      policy: this.policyFor(currentJob.snapshot, "overlap"),
      input: {
        candidate: overlapCandidate(candidate),
        destinationProjectId: destination,
        overlaps: sanitizeValue(overlaps),
        evidenceEntries: sourceEvidence(candidate, currentJob.snapshot).map(
          (entry) => ({
            id: entry.id,
            role: entry.role,
            text: entry.text,
            ...(entry.toolName ? { toolName: entry.toolName } : {}),
          }),
        ),
        modelVersion: currentJob.snapshot.modelVersion,
      },
    });
    let decision: CaptureDecision;
    try {
      decision = parseDecision(response);
      await this.validateDecision(decision, candidate, overlaps);
    } catch (error) {
      if (!(error instanceof InvalidCaptureOutput)) throw error;
      this.emit("debug", "overlap_rejected", {
        ...this.correlation(job, candidate.id), response, reason: error.message,
        destinationProjectId: destination, memoryIds: overlaps.map((memory) => memory.id),
      });
      const skipped = await this.checkpointOutcome(currentJob, candidate.id, {
        stage: "skipped",
        action: "skip",
        reason: error.message,
        destinationProjectId: destination,
      });
      return { status: "skipped", job: skipped };
    }
    this.emit("info", "overlap", {
      ...this.correlation(job, candidate.id), action: decision.action,
      destinationProjectId: destination, memoryIds: overlaps.map((memory) => memory.id),
      memoryId: decision.memoryId, conflictingMemoryIds: decisionConflictIds(decision),
    });
    this.emit("debug", "overlap_decision", {
      ...this.correlation(job, candidate.id), decision, destinationProjectId: destination,
    });
    const decidedJob = await this.checkpointOutcome(currentJob, candidate.id, {
      stage: "decided",
      candidate,
      destinationProjectId: destination,
      overlaps: sanitizeValue(overlaps),
      decision,
    });
    return { status: "ready", job: decidedJob, decision };
  }

  private async recordEscalation(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    decision: CaptureDecision,
    reason: string,
    oldMemory?: Memory,
    outcomeReason?: string,
  ): Promise<QueueJob> {
    const conflict = await this.addConflict(
      job,
      candidate,
      destination,
      decision,
      reason,
      oldMemory,
    );
    return this.checkpointOutcome(job, candidate.id, {
      stage: "escalated",
      action: "escalate",
      conflictId: conflict.id,
      reason: outcomeReason ?? conflict.reason,
    });
  }

  private async supersedeCandidate(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    overlaps: Memory[],
    decision: CaptureDecision,
  ): Promise<QueueJob> {
    const conflictingMemoryId = firstConflictId(decision);
    if (!conflictingMemoryId)
      throw new InvalidCaptureOutput("supersession has no selected memory");
    const selected = overlaps.find(
      (memory) => memory.id === conflictingMemoryId,
    );
    if (!selected) {
      throw new InvalidCaptureOutput(
        "supersession selected memory is outside overlap results",
      );
    }
    await this.ensureWriteAllowed(job.snapshot.mode);
    const current = await this.client.get(selected.id);
    if (!sameMemory(current, selected)) {
      return this.recordEscalation(
        job,
        candidate,
        destination,
        decision,
        "The selected memory changed before the supersession decision was applied.",
        current,
        "stale selected memory",
      );
    }
    if (current.is_obsolete) {
      return this.recordEscalation(
        job,
        candidate,
        destination,
        decision,
        "The selected memory is already obsolete and needs renewed judgment.",
        current,
      );
    }
    if (current.project_ids.some((project) => project !== destination)) {
      return this.recordEscalation(
        job,
        candidate,
        destination,
        decision,
        "The selected memory is shared with another project and needs a full replacement decision.",
        current,
      );
    }
    const projectIds = [...new Set([destination, ...current.project_ids])];
    const replacementId = await this.createMemory(
      job,
      candidate,
      destination,
      projectIds,
    );
    const replacementJob = await this.checkpointOutcome(job, candidate.id, {
      stage: "replacement-created",
      action: "supersede",
      oldMemoryId: current.id,
      oldMemory: sanitizeValue(current),
      replacementId,
      destinationProjectId: destination,
      reason: decision.reason,
      decision,
    });
    const enrichedReplacement = await this.writeKnowledge(
      replacementJob,
      candidate,
      destination,
      replacementId,
      {
        stage: "replacement-created",
        action: "supersede",
        oldMemoryId: current.id,
        oldMemory: sanitizeValue(current),
        replacementId,
        destinationProjectId: destination,
        reason: decision.reason,
        decision,
      },
      "replacement-created",
    );
    return this.finishSupersession(
      enrichedReplacement,
      candidate,
      destination,
      current,
      replacementId,
      decision.reason ?? "Evidenced project change",
      decision,
    );
  }

  private async applyDecision(
    job: QueueJob,
    candidate: CaptureCandidate,
    destination: number,
    overlaps: Memory[],
    decision: CaptureDecision,
  ): Promise<QueueJob> {
    if (decision.action === "skip") {
      const selectedId = decision.memoryId ?? firstConflictId(decision);
      const selected = overlaps.find((memory) => memory.id === selectedId);
      if (selectedId && selected && candidateHasKnowledge(candidate)) {
        const selectedJob = await this.checkpointOutcome(job, candidate.id, {
          stage: "memory-created",
          action: "skip",
          reason: decision.reason ?? "overlap is already known",
          memoryId: selected.id,
          existingMemory: sanitizeValue(selected),
          destinationProjectId: destination,
        });
        return this.writeKnowledge(
          selectedJob,
          candidate,
          destination,
          selected.id,
          {
            stage: "memory-created",
            action: "skip",
            reason: decision.reason ?? "overlap is already known",
            memoryId: selected.id,
            existingMemory: sanitizeValue(selected),
            destinationProjectId: destination,
          },
          "skipped",
          selected,
        );
      }
      return this.checkpointOutcome(job, candidate.id, {
        stage: "skipped",
        action: "skip",
        reason: decision.reason ?? "overlap is already known",
        ...(selectedId ? { memoryId: selectedId } : {}),
        destinationProjectId: destination,
      });
    }
    const conflictingMemoryId = firstConflictId(decision);
    if (decision.action === "escalate") {
      const oldMemory = overlaps.find(
        (memory) => memory.id === conflictingMemoryId,
      );
      return this.recordEscalation(
        job,
        candidate,
        destination,
        decision,
        decision.reason ?? "Uncertain contradiction",
        oldMemory,
      );
    }
    const conflictingIds = decisionConflictIds(decision);
    if (
      decision.action === "supersede" &&
      (decision.partial || conflictingIds.length > 1)
    ) {
      const oldMemory = overlaps.find(
        (memory) => memory.id === conflictingMemoryId,
      );
      const reason = decision.partial
        ? "The candidate changes only part of a shared memory."
        : "The candidate conflicts with multiple memories and needs a bounded resolution.";
      return this.recordEscalation(
        job,
        candidate,
        destination,
        decision,
        reason,
        oldMemory,
      );
    }
    if (decision.action === "create") {
      const id = await this.createMemory(job, candidate, destination);
      const memoryJob = await this.checkpointOutcome(job, candidate.id, {
        stage: "memory-created",
        action: "create",
        memoryId: id,
        destinationProjectId: destination,
      });
      return this.writeKnowledge(
        memoryJob,
        candidate,
        destination,
        id,
        {
          stage: "memory-created",
          action: "create",
          memoryId: id,
          destinationProjectId: destination,
        },
        "created",
      );
    }
    return this.supersedeCandidate(
      job,
      candidate,
      destination,
      overlaps,
      decision,
    );
  }

  private async processCandidate(
    job: QueueJob,
    candidate: CaptureCandidate,
    outcome: unknown,
  ): Promise<QueueJob> {
    const existing = record(outcome);
    if (existing?.stage === "replacement-created") {
      return this.processReplacementCheckpoint(job, candidate, existing);
    }
    if (
      existing?.stage === "knowledge-partial" ||
      existing?.stage === "memory-created"
    ) {
      return this.processKnowledgeCheckpoint(job, candidate, existing);
    }
    if (isFinalOutcome(outcome)) return job;
    if (!(await this.enabled(job.snapshot.mode)))
      throw new CapturePause("capture is disabled");
    const destinationResult = await this.prepareDestination(job, candidate);
    if (destinationResult.destination === undefined)
      return destinationResult.job;
    const destination = destinationResult.destination;
    const currentMode = await this.getMode();
    if (job.snapshot.mode === "observe" || currentMode === "observe") {
      return this.checkpointOutcome(job, candidate.id, {
        stage: "observed",
        destinationProjectId: destination,
      });
    }
    const overlapsResult = await this.loadOverlaps(
      job,
      candidate,
      record(outcome),
      destination,
    );
    if (overlapsResult.status === "skipped") return overlapsResult.job;
    const decisionResult = await this.decideOverlap(
      overlapsResult.job,
      candidate,
      overlapsResult.outcome,
      overlapsResult.overlaps,
      destination,
    );
    if (decisionResult.status === "skipped") return decisionResult.job;
    return this.applyDecision(
      decisionResult.job,
      candidate,
      destination,
      overlapsResult.overlaps,
      decisionResult.decision,
    );
  }

  private async loadCandidates(
    job: QueueJob,
  ): Promise<{ job: QueueJob; candidates: CaptureCandidate[] }> {
    if (Array.isArray(job.extractedCandidates)) {
      return { job, candidates: job.extractedCandidates as CaptureCandidate[] };
    }
    await this.ensureModelCallAllowed(job);
    const currentJob = await this.queue.checkpoint(job.id, {
      callCount: job.callCount + 1,
    });
    const response = await this.model.complete({
      purpose: "capture",
      diagnosticContext: this.correlation(currentJob),
      policy: this.policyFor(currentJob.snapshot, "capture"),
      input: {
        context: {
          cwd: sanitizeText(currentJob.snapshot.context.cwd).slice(0, 500),
          repoName: currentJob.snapshot.context.repoName,
          project: currentJob.snapshot.context.project,
          sessionId: currentJob.snapshot.context.sessionId,
          branchId: currentJob.snapshot.context.branchId,
        },
        projects: (
          currentJob.snapshot.context as WorkContext & { projects?: unknown[] }
        ).projects?.slice(0, 100),
        entries: currentJob.snapshot.entries,
        modelVersion: currentJob.snapshot.modelVersion,
      },
    });
    const extraction = parseCandidates(
      response,
      currentJob.snapshot,
      this.maxCandidates,
      (candidateId, raw, reason) => {
        const item = record(raw);
        const ids = strings(item?.sourceEntryIds ?? item?.source_entry_ids, 8, 200);
        this.emit("debug", reason ? "candidate_rejected" : "candidate_accepted", {
          ...this.correlation(currentJob, candidateId), reason,
          entries: ids.map((id) => {
            const entry = currentJob.snapshot.entries.find((value) => value.id === id);
            return entry
              ? { ...entry, text: entry.text.slice(0, 256), truncated: entry.text.length > 256 }
              : { id, missing: true };
          }),
          candidate: raw,
        });
        this.emit("info", reason ? "skipped" : "candidate_validated", {
          ...this.correlation(currentJob, candidateId),
          stage: reason ? "rejected" : "accepted", sourceEntryIds: ids,
        });
      },
    );
    const extractedJob = await this.queue.checkpoint(currentJob.id, {
      extractedCandidates: extraction.candidates,
      candidateOutcomes: Object.fromEntries([
        ...extraction.candidates.map(
          (candidate) => [candidate.id, { stage: "extracted" }] as const,
        ),
        ...extraction.skipped.map(
          (item) =>
            [item.id, { stage: "skipped", reason: item.reason }] as const,
        ),
      ]),
    });
    return { job: extractedJob, candidates: extraction.candidates };
  }

  private async processCandidates(
    job: QueueJob,
    candidates: CaptureCandidate[],
  ): Promise<{ job: QueueJob; stopped: boolean }> {
    let currentJob = job;
    for (const candidate of candidates) {
      const outcome = currentJob.candidateOutcomes[candidate.id];
      if (isFinalOutcome(outcome)) continue;
      try {
        currentJob = await this.processCandidate(
          currentJob,
          candidate,
          outcome,
        );
      } catch (error) {
        this.emit("info", error instanceof CapturePause ? "paused" : "error", {
          ...this.correlation(currentJob, candidate.id),
        });
        this.emit("debug", "error_detail", {
          ...this.correlation(currentJob, candidate.id), error: scrubError(error),
        });
        if (error instanceof CapturePause) {
          await this.queue.checkpoint(currentJob.id, {
            status: "paused",
            lastError: error.message,
          });
          return { job: currentJob, stopped: true };
        }
        const message = scrubError(error);
        const latest = await this.queue.getJob(currentJob.id);
        const status: QueueJobStatus =
          latest && latest.attempts >= 3 ? "failed" : "pending";
        await this.queue.checkpoint(currentJob.id, {
          status,
          lastError: message,
        });
        return { job: currentJob, stopped: true };
      }
    }
    return { job: currentJob, stopped: false };
  }

  private async processJob(job: QueueJob): Promise<void> {
    if (!(await this.enabled(job.snapshot.mode))) {
      await this.queue.checkpoint(job.id, {
        status: "paused",
        lastError: "capture is disabled",
      });
      return;
    }
    const loaded = await this.loadCandidates(job);
    let currentJob = loaded.job;
    const candidates = loaded.candidates;
    if (candidates.length === 0) {
      await this.queue.complete(currentJob.id);
      return;
    }
    const processed = await this.processCandidates(currentJob, candidates);
    if (processed.stopped) return;
    currentJob = processed.job;
    const latest = await this.queue.getJob(currentJob.id);
    if (
      latest &&
      candidates.every((candidate) =>
        isFinalOutcome(latest.candidateOutcomes[candidate.id]),
      )
    ) {
      await this.queue.complete(currentJob.id);
    } else {
      await this.queue.checkpoint(currentJob.id, { status: "pending" });
    }
  }

  private async runBranchWorker(
    branch: { sessionId: string; branchId: string },
    budget: number,
    result: CaptureCheckpointResult,
  ): Promise<void> {
    for (let count = 0; count < budget; count += 1) {
      if (!(await this.enabled())) {
        result.paused = true;
        break;
      }
      const job = await this.queue.claimNext(this.identity, branch);
      if (!job) break;
      result.processed += 1;
      result.processedJobIds.push(job.id);
      if (!(await this.processBranchJob(job, result))) break;
    }
  }

  private async processBranchJob(
    job: QueueJob,
    result: CaptureCheckpointResult,
  ): Promise<boolean> {
    const started = performance.now();
    this.emit("info", job.attempts > 1 ? "retry" : "started", {
      ...this.correlation(job), attempt: job.attempts,
    });
    this.emit("debug", "snapshot", {
      ...this.correlation(job), entries: job.snapshot.entries,
      finalEntryId: job.snapshot.finalEntryId,
    });
    try {
      await this.processJob(job);
      const after = await this.queue.getJob(job.id);
      this.emit("info", after?.status === "complete" ? "completed" : "job_progress", {
        ...this.correlation(job), status: after?.status,
        elapsedMs: performance.now() - started,
      });
      return after?.status !== "pending" && after?.status !== "paused";
    } catch (error) {
      this.emit("info", "error", {
        ...this.correlation(job), elapsedMs: performance.now() - started,
      });
      this.emit("debug", "error_detail", { ...this.correlation(job), error: scrubError(error) });
      result.errors.push(scrubError(error));
      const latest = await this.queue.getJob(job.id);
      if (latest) {
        await this.queue.checkpoint(job.id, {
          status: latest.attempts >= 3 ? "failed" : "pending",
          lastError: scrubError(error),
        });
      }
      return false;
    }
  }

  private async checkpointBranch(
    branch: { sessionId: string; branchId: string },
    budget: number,
  ): Promise<CaptureCheckpointResult> {
    const result: CaptureCheckpointResult = {
      processed: 0,
      processedJobIds: [],
      paused: false,
      errors: [],
    };
    const workerResult = await this.queue.withWorkerLock(
      this.identity,
      branch,
      () => this.runBranchWorker(branch, budget, result),
    );
    if (workerResult === undefined) result.paused = true;
    return result;
  }

  /** Run a bounded worker checkpoint. `agent_settled` should call this without awaiting it. */
  async checkpoint(
    options?: CaptureSnapshot | { sessionId?: string; branchId?: string },
  ): Promise<CaptureCheckpointResult> {
    if (this.stopped || !(await this.isEnabled()))
      return { processed: 0, processedJobIds: [], paused: true, errors: [] };
    const requestedSessionId =
      options && "context" in options
        ? options.context.sessionId
        : options?.sessionId;
    const requestedBranchId =
      options && "context" in options
        ? options.context.branchId
        : options?.branchId;
    let requestedBranch: { sessionId: string; branchId: string } | undefined;
    if (requestedSessionId && requestedBranchId) {
      requestedBranch = {
        sessionId: requestedSessionId,
        branchId: requestedBranchId,
      };
    } else if (this.sessionId && this.branchId) {
      requestedBranch = { sessionId: this.sessionId, branchId: this.branchId };
    }
    const jobs = await this.queue.listPending(this.identity);
    const allBranches = [
      ...new Map(
        jobs.map((job) => [
          `${job.snapshot.context.sessionId}\u0000${job.snapshot.context.branchId}`,
          {
            sessionId: job.snapshot.context.sessionId,
            branchId: job.snapshot.context.branchId,
          },
        ]),
      ).values(),
    ];
    const branches = requestedBranch
      ? [
          requestedBranch,
          ...allBranches.filter(
            (branch) =>
              branch.sessionId !== requestedBranch.sessionId ||
              branch.branchId !== requestedBranch.branchId,
          ),
        ]
      : allBranches;
    const total: CaptureCheckpointResult = {
      processed: 0,
      processedJobIds: [],
      paused: false,
      errors: [],
    };
    let remaining = this.maxJobsPerCheckpoint;
    for (const branch of branches) {
      if (remaining <= 0) break;
      const result = await this.checkpointBranch(branch, remaining);
      total.processed += result.processed;
      total.processedJobIds.push(...result.processedJobIds);
      total.paused ||= result.paused;
      total.errors.push(...result.errors);
      remaining -= result.processed;
    }
    return total;
  }

  async processPending(options?: {
    sessionId?: string;
    branchId?: string;
  }): Promise<CaptureCheckpointResult> {
    return this.checkpoint(options);
  }

  async diagnostics(options?: {
    sessionId?: string;
    branchId?: string;
    jobId?: string;
    limit?: number;
  }): Promise<CaptureDiagnostics> {
    const limit = Math.max(1, Math.min(20, options?.limit ?? 20));
    const jobs = (await this.queue.listJobs(this.identity))
      .filter(
        (job) =>
          (!options?.sessionId ||
            job.snapshot.context.sessionId === options.sessionId) &&
          (!options?.branchId ||
            job.snapshot.context.branchId === options.branchId) &&
          (!options?.jobId || job.id === options.jobId),
      )
      .slice(-limit);
    const diagnosticJobs = jobs.map((job): CaptureDiagnosticJob => {
      const extracted = Array.isArray(job.extractedCandidates)
        ? job.extractedCandidates
            .map(record)
            .filter((candidate): candidate is Record<string, unknown> =>
              Boolean(candidate),
            )
        : [];
      const byId = new Map(
        extracted.map((candidate) => [
          stringValue(candidate.id, 100) ?? "",
          candidate,
        ]),
      );
      const candidateIds = [
        ...new Set([
          ...extracted
            .map((candidate) => stringValue(candidate.id, 100))
            .filter((id): id is string => Boolean(id)),
          ...Object.keys(job.candidateOutcomes),
        ]),
      ].slice(0, 4);
      const candidates = candidateIds.map((id): CaptureDiagnosticCandidate => {
        const candidate = byId.get(id);
        const outcome = record(job.candidateOutcomes[id]);
        const decision = record(outcome?.decision);
        const sourceEntryIds = strings(
          outcome?.sourceEntryIds ?? candidate?.sourceEntryIds,
          8,
          200,
        );
        const stage = stringValue(outcome?.stage, 50);
        const actionValue = outcome?.action ?? decision?.action;
        const action =
          actionValue === "create" ||
          actionValue === "skip" ||
          actionValue === "supersede" ||
          actionValue === "escalate"
            ? actionValue
            : undefined;
        return {
          id,
          sourceEntryIds,
          ...(stringValue(candidate?.title, 200)
            ? {
                title: sanitizeText(stringValue(candidate?.title, 200)!).slice(
                  0,
                  200,
                ),
              }
            : {}),
          ...(stringValue(candidate?.content, 2_000)
            ? {
                content: sanitizeText(
                  stringValue(candidate?.content, 2_000)!,
                ).slice(0, 2_000),
              }
            : {}),
          ...(stage ? { stage } : {}),
          ...(action ? { action } : {}),
          ...((projectId(outcome?.destinationProjectId) ??
            projectId(candidate?.destinationProjectId)) === undefined
            ? {}
            : {
                destinationProjectId:
                  projectId(outcome?.destinationProjectId) ??
                  projectId(candidate?.destinationProjectId),
              }),
          ...(stringValue(outcome?.reason, 500)
            ? { reason: stringValue(outcome?.reason, 500) }
            : {}),
          ...(projectId(outcome?.memoryId) === undefined
            ? {}
            : { memoryId: projectId(outcome?.memoryId) }),
          ...(projectId(outcome?.replacementId) === undefined
            ? {}
            : { replacementId: projectId(outcome?.replacementId) }),
          ...(stringValue(outcome?.conflictId, 100)
            ? { conflictId: stringValue(outcome?.conflictId, 100) }
            : {}),
        };
      });
      return {
        id: job.id,
        status: job.status,
        attempts: job.attempts,
        callCount: job.callCount,
        sessionId: job.snapshot.context.sessionId,
        branchId: job.snapshot.context.branchId,
        candidates,
        ...(job.lastError ? { lastError: scrubError(job.lastError) } : {}),
      };
    });
    const conflicts = (
      await this.queue.pendingConflicts(
        this.identity,
        options?.sessionId,
        options?.branchId,
      )
    )
      .slice(-limit)
      .map(
        (conflict): CaptureDiagnosticConflict => ({
          id: conflict.id,
          status: conflict.status,
          candidateId: conflict.candidateId,
          destinationProjectId: conflict.destinationProjectId,
          sourceEntryIds: conflict.sourceEntryIds
            .slice(0, 8)
            .map((id) => sanitizeText(id).slice(0, 200)),
          oldMemoryIds: [
            ...new Set([
              ...(conflict.oldMemoryId ? [conflict.oldMemoryId] : []),
              ...(conflict.oldMemoryIds ?? []),
            ]),
          ].slice(0, 8),
          reason: sanitizeText(conflict.reason).slice(0, 500),
          ...(conflict.replacementId === undefined
            ? {}
            : { replacementId: conflict.replacementId }),
        }),
      );
    return { jobs: diagnosticJobs, conflicts };
  }

  async pendingConflicts(options?: {
    sessionId?: string;
    branchId?: string;
  }): Promise<PendingConflict[]>;
  async pendingConflicts(
    sessionId: string,
    branchId: string,
  ): Promise<PendingConflict[]>;
  async pendingConflicts(
    optionsOrSession?: { sessionId?: string; branchId?: string } | string,
    branchId?: string,
  ): Promise<PendingConflict[]> {
    const sessionId =
      typeof optionsOrSession === "string"
        ? optionsOrSession
        : (optionsOrSession?.sessionId ?? this.sessionId);
    const selectedBranch =
      typeof optionsOrSession === "string"
        ? branchId
        : (optionsOrSession?.branchId ?? this.branchId);
    return this.queue.pendingConflicts(
      this.identity,
      sessionId,
      selectedBranch,
    );
  }

  private async ownedConflict(conflictId: string): Promise<PendingConflict> {
    const conflict = await this.queue.getConflict(conflictId);
    if (
      conflict?.status !== "pending" ||
      !conflict.binding?.instanceId ||
      conflict.binding.instanceId !== this.identity.instanceId ||
      conflict.binding.endpoint !== this.identity.endpoint ||
      conflict.binding.accountId !== this.identity.accountId ||
      (this.sessionId && conflict.sessionId !== this.sessionId) ||
      (this.branchId && conflict.branchId !== this.branchId)
    ) {
      throw new Error(
        "Pending conflict does not belong to this capture session",
      );
    }
    return conflict;
  }

  private async rejectConflict(
    conflict: PendingConflict,
    input: ResolveConflictInput,
  ): Promise<CaptureResolveResult> {
    const resolved = await this.queue.updateConflict(conflict.id, {
      status: "rejected",
      resolution: {
        action: "skip",
        reason: sanitizeText(input.reason ?? "Rejected"),
      },
    });
    return { status: "resolved", conflict: resolved };
  }

  private selectResolutionEvidence(
    conflict: PendingConflict,
    input: ResolveConflictInput,
    additionalIds: string[],
  ): string[] {
    if (
      input.evidenceEntryIds !== undefined &&
      !Array.isArray(input.evidenceEntryIds)
    ) {
      throw new Error("Resolution evidence IDs must be an array");
    }
    const allowedEvidenceIds = new Set([
      ...conflict.sourceEntryIds,
      ...additionalIds,
    ]);
    const defaultAdditionalIds = additionalIds.slice(
      -MAX_SELECTED_RESOLUTION_ENTRIES,
    );
    const evidenceEntryIds =
      input.evidenceEntryIds ??
      [...new Set([...defaultAdditionalIds, ...conflict.sourceEntryIds])].slice(
        0,
        MAX_SELECTED_RESOLUTION_ENTRIES,
      );
    if (evidenceEntryIds.length > MAX_SELECTED_RESOLUTION_ENTRIES) {
      throw new Error(
        `Resolution evidence must contain at most ${MAX_SELECTED_RESOLUTION_ENTRIES} entries`,
      );
    }
    if (
      evidenceEntryIds.length === 0 ||
      evidenceEntryIds.some(
        (id) => typeof id !== "string" || !allowedEvidenceIds.has(id),
      )
    ) {
      throw new Error(
        "Resolution evidence must reference the pending conflict or trusted later evidence",
      );
    }
    return evidenceEntryIds;
  }

  private validateResolutionEvidence(
    conflict: PendingConflict,
    input: ResolveConflictInput,
  ): {
    evidenceEntryIds: string[];
    selectedAdditionalEntries: EvidenceEntry[];
    reason?: string;
    additionalEvidence?: string;
  } {
    const additionalEntries = trustedAdditionalEntries(input.additionalEntries);
    const additionalIds = additionalEntries.map((entry) => entry.id);
    if (new Set(additionalIds).size !== additionalIds.length) {
      throw new Error("Additional resolution evidence IDs must be unique");
    }
    const evidenceEntryIds = this.selectResolutionEvidence(
      conflict,
      input,
      additionalIds,
    );
    const selectedAdditionalEntries = additionalEntries.filter((entry) =>
      evidenceEntryIds.includes(entry.id),
    );
    const reason = stringValue(input.reason, 500);
    if (!reason && selectedAdditionalEntries.length === 0) {
      throw new Error(
        "Supersession resolution requires a reason or user clarification",
      );
    }
    if (
      input.additionalEvidence !== undefined &&
      typeof input.additionalEvidence !== "string"
    ) {
      throw new Error("Additional resolution evidence must be text");
    }
    const additionalEvidence = stringValue(
      input.additionalEvidence,
      MAX_ENTRY_TEXT,
    );
    if (input.additionalEvidence !== undefined && !additionalEvidence) {
      throw new Error(
        "Additional resolution evidence must be selected trusted evidence",
      );
    }
    if (
      additionalEvidence &&
      !selectedAdditionalEntries.some(
        (entry) => entry.text === additionalEvidence,
      )
    ) {
      throw new Error(
        "Additional resolution evidence must match selected trusted evidence",
      );
    }
    return {
      evidenceEntryIds,
      selectedAdditionalEntries,
      ...(reason ? { reason } : {}),
      ...(additionalEvidence ? { additionalEvidence } : {}),
    };
  }

  private resolutionTarget(conflict: PendingConflict): {
    oldMemory: Memory;
    candidate: CaptureCandidate;
    fakeJob: QueueJob;
  } {
    if (conflict.partial || (conflict.oldMemoryIds?.length ?? 0) > 1) {
      throw new Error(
        "Partial or multi-memory conflicts require a new validated candidate",
      );
    }
    if (!conflict.oldMemoryId || !record(conflict.oldMemory)) {
      throw new Error("Pending conflict has no selected memory");
    }
    const context: WorkContext = conflict.context ?? {
      cwd: "",
      sessionId: conflict.sessionId,
      branchId: conflict.branchId,
    };
    const fakeJob = {
      id: conflict.jobId ?? `resolution-${conflict.id}`,
      snapshot: { context, mode: "auto" } as CaptureSnapshot,
      callCount: 0,
      attempts: 1,
    } as QueueJob;
    return {
      oldMemory: conflict.oldMemory as Memory,
      candidate: conflict.candidate as CaptureCandidate,
      fakeJob,
    };
  }

  private async markConflictResolved(
    conflictId: string,
    resolution: unknown,
  ): Promise<CaptureResolveResult> {
    const resolved = await this.queue.updateConflict(conflictId, {
      status: "resolved",
      resolution,
    });
    return { status: "resolved", conflict: resolved };
  }

  private async applyConflictResolution(
    conflict: PendingConflict,
    evidence: {
      evidenceEntryIds: string[];
      selectedAdditionalEntries: EvidenceEntry[];
      reason?: string;
      additionalEvidence?: string;
    },
    target: {
      oldMemory: Memory;
      candidate: CaptureCandidate;
      fakeJob: QueueJob;
    },
  ): Promise<CaptureResolveResult> {
    await this.ensureWriteAllowed("auto");
    const current = await this.client.get(conflict.oldMemoryId!);
    if (
      conflict.replacementId &&
      current.is_obsolete &&
      current.superseded_by === conflict.replacementId
    ) {
      const resolution = {
        action: "supersede" as const,
        replacementId: conflict.replacementId,
        evidenceEntryIds: evidence.evidenceEntryIds,
        ...(evidence.additionalEvidence
          ? { additionalEvidence: evidence.additionalEvidence }
          : {}),
        ...(evidence.selectedAdditionalEntries.length
          ? { additionalEntries: evidence.selectedAdditionalEntries }
          : {}),
      };
      return this.markConflictResolved(conflict.id, resolution);
    }
    if (current.is_obsolete) {
      throw new Error(
        "Selected memory is already obsolete; conflict needs fresh evidence",
      );
    }
    if (!sameMemory(current, target.oldMemory)) {
      throw new Error("Selected memory changed; conflict needs fresh evidence");
    }
    if (
      current.project_ids.some(
        (project) => project !== conflict.destinationProjectId,
      )
    ) {
      throw new Error(
        "Selected memory is shared with another project; conflict needs a full replacement",
      );
    }
    const replacementId =
      conflict.replacementId ??
      (await this.createMemory(
        target.fakeJob,
        target.candidate,
        conflict.destinationProjectId,
        [...new Set([conflict.destinationProjectId, ...current.project_ids])],
      ));
    const resolution = {
      action: "supersede" as const,
      reason: sanitizeText(evidence.reason ?? "User-confirmed project change"),
      evidenceEntryIds: evidence.evidenceEntryIds,
      ...(evidence.additionalEvidence
        ? { additionalEvidence: evidence.additionalEvidence }
        : {}),
      ...(evidence.selectedAdditionalEntries.length
        ? { additionalEntries: evidence.selectedAdditionalEntries }
        : {}),
    };
    await this.queue.updateConflict(conflict.id, { replacementId, resolution });
    const sourceJob = conflict.jobId
      ? await this.queue.getJob(conflict.jobId)
      : undefined;
    const writeJob = sourceJob ?? target.fakeJob;
    const persistedOutcome = sourceJob
      ? record(sourceJob.candidateOutcomes[target.candidate.id])
      : undefined;
    const knowledgeOutcome = {
      ...persistedOutcome,
      stage: "replacement-created",
      action: "supersede",
      oldMemoryId: target.oldMemory.id,
      oldMemory: sanitizeValue(target.oldMemory),
      replacementId,
      destinationProjectId: conflict.destinationProjectId,
      reason: resolution.reason,
    };
    const knowledgeJob = await this.writeKnowledge(
      writeJob,
      target.candidate,
      conflict.destinationProjectId,
      replacementId,
      knowledgeOutcome,
      "replacement-created",
    );
    const applied = await this.applySupersession(
      knowledgeJob,
      target.oldMemory,
      replacementId,
      resolution.reason,
    );
    if (applied === "stale") {
      throw new Error(
        "Selected memory changed after replacement creation; conflict remains pending",
      );
    }
    return this.markConflictResolved(conflict.id, resolution);
  }

  private async resolveConflictOwned(
    conflictId: string,
    input: ResolveConflictInput,
  ): Promise<CaptureResolveResult> {
    const conflict = await this.ownedConflict(conflictId);
    if (
      input.action !== "defer" &&
      input.action !== "skip" &&
      input.action !== "supersede"
    ) {
      throw new Error("Unknown conflict resolution action");
    }
    if (input.action === "defer") return { status: "deferred", conflict };
    if (!(await this.enabled())) throw new Error("Capture is disabled");
    if (input.action === "skip") return this.rejectConflict(conflict, input);
    const evidence = this.validateResolutionEvidence(conflict, input);
    const target = this.resolutionTarget(conflict);
    return this.applyConflictResolution(conflict, evidence, target);
  }

  async resolveConflict(
    conflictId: string,
    input: ResolveConflictInput,
  ): Promise<CaptureResolveResult> {
    const conflict = await this.queue.getConflict(conflictId);
    if (!conflict) throw new Error("Unknown pending conflict");
    const result = await this.queue.withWorkerLock(
      this.identity,
      {
        sessionId: conflict.sessionId,
        branchId: conflict.branchId,
      },
      () => this.resolveConflictOwned(conflictId, input),
    );
    if (result === undefined)
      throw new Error("Capture worker is busy for this session");
    return result;
  }

  async resolve(
    conflictId: string,
    input: ResolveConflictInput,
  ): Promise<CaptureResolveResult> {
    return this.resolveConflict(conflictId, input);
  }

  async advance(input: CaptureAdvanceInput | CaptureSnapshot): Promise<void> {
    await this.queue.advanceWatermark(input);
  }

  async advanceWatermark(
    input: CaptureAdvanceInput | CaptureSnapshot,
  ): Promise<void> {
    return this.advance(input);
  }

  async watermark(context: Pick<WorkContext, "sessionId" | "branchId">) {
    return this.queue.getWatermark(context.sessionId, context.branchId);
  }

  stop(_sessionId?: string, _branchId?: string): void {
    this.stopped = true;
  }
}
