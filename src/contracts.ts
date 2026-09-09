export type Scope = "global" | "project";
export type CaptureMode = "auto" | "observe" | "off";

export interface Project {
  id: number;
  name: string;
  repo_name?: string | null;
  description?: string;
}

export interface ProjectInput {
  name: string;
  description: string;
  repo_name: string;
}

export interface MemoryInput {
  title: string;
  content: string;
  context: string;
  keywords: string[];
  tags: string[];
  importance?: number;
  project_ids: number[];
  source_repo?: string;
  source_files?: string[];
  source_url?: string;
  encoding_version?: string;
  document_ids?: number[];
  code_artifact_ids?: number[];
  file_ids?: number[];
}

export interface Provenance {
  source_repo?: string;
  source_files?: string[];
  source_url?: string;
  encoding_version?: string;
}

export type EntityType = "Organization" | "Individual" | "Team" | "Device" | "System" | "Other";

export interface EntityInput extends Provenance {
  name: string;
  entity_type: EntityType;
  custom_type?: string;
  notes?: string;
  tags: string[];
  aka: string[];
  project_ids: number[];
}

export interface Entity extends EntityInput {
  id: number;
  updated_at?: string;
}

export interface EntityRelationshipInput extends Provenance {
  source_entity_id: number;
  target_entity_id: number;
  relationship_type: string;
}

export interface EntityRelationship extends EntityRelationshipInput {
  id: number;
}

export interface DocumentInput extends Provenance {
  title: string;
  description: string;
  content: string;
  document_type?: string;
  tags: string[];
  project_id?: number | null;
}

export interface Document extends DocumentInput {
  id: number;
  updated_at?: string;
}

export type DocumentSummary = Omit<Document, "content">;

export interface CodeArtifactInput extends Provenance {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  project_id?: number | null;
}

export interface CodeArtifact extends CodeArtifactInput {
  id: number;
  updated_at?: string;
}

export type CodeArtifactSummary = Omit<CodeArtifact, "code">;

export interface FileSummary {
  id: number;
  filename: string;
  description: string;
  mime_type: string;
  size_bytes: number;
  tags: string[];
  project_id?: number | null;
}

export interface StoredFile extends FileSummary {
  data: string;
}

/** Rich knowledge is optional for adapters that only support atomic memories. */
export interface KnowledgeClient {
  searchEntities(query: string, limit?: number, signal?: AbortSignal): Promise<Entity[]>;
  getEntity(id: number, signal?: AbortSignal): Promise<Entity>;
  createEntity(input: EntityInput, signal?: AbortSignal): Promise<Entity>;
  updateEntity(id: number, input: Partial<EntityInput>, signal?: AbortSignal): Promise<Entity>;
  getEntityMemories(id: number, signal?: AbortSignal): Promise<{ id: number; title: string }[]>;
  linkEntityMemory(entityId: number, memoryId: number, signal?: AbortSignal): Promise<void>;
  getRelationships(id: number, signal?: AbortSignal): Promise<EntityRelationship[]>;
  createRelationship(
    input: EntityRelationshipInput, signal?: AbortSignal,
  ): Promise<EntityRelationship>;
  listDocuments(projectId?: number, signal?: AbortSignal): Promise<DocumentSummary[]>;
  getDocument(id: number, signal?: AbortSignal): Promise<Document>;
  createDocument(input: DocumentInput, signal?: AbortSignal): Promise<Document>;
  updateDocument(
    id: number, input: Partial<DocumentInput>, signal?: AbortSignal,
  ): Promise<Document>;
  listCodeArtifacts(projectId?: number, signal?: AbortSignal): Promise<CodeArtifactSummary[]>;
  getCodeArtifact(id: number, signal?: AbortSignal): Promise<CodeArtifact>;
  createCodeArtifact(input: CodeArtifactInput, signal?: AbortSignal): Promise<CodeArtifact>;
  updateCodeArtifact(
    id: number, input: Partial<CodeArtifactInput>, signal?: AbortSignal,
  ): Promise<CodeArtifact>;
  listFiles(projectId?: number, signal?: AbortSignal): Promise<FileSummary[]>;
  getFile(id: number, signal?: AbortSignal): Promise<StoredFile>;
  updateMemory(id: number, input: Partial<MemoryInput>, signal?: AbortSignal): Promise<Memory>;
  linkMemories(id: number, relatedIds: number[], signal?: AbortSignal): Promise<void>;
}

export interface Memory extends MemoryInput {
  id: number;
  is_obsolete: boolean;
  superseded_by?: number | null;
  linked_memory_ids?: number[];
  updated_at?: string;
}

export interface SearchRequest {
  query: string;
  query_context: string;
  project_ids?: number[];
  strict_project_filter: boolean;
  k?: number;
  include_links?: boolean;
  max_links?: number;
}

export interface ForgetfulClient {
  knowledge?: KnowledgeClient;
  search(request: SearchRequest, signal?: AbortSignal): Promise<Memory[]>;
  listProjects(repoName?: string, signal?: AbortSignal): Promise<Project[]>;
  createProject(input: ProjectInput, signal?: AbortSignal): Promise<Project>;
  linkProject(
    id: number,
    repoName: string,
    signal?: AbortSignal,
  ): Promise<Project>;
  create(input: MemoryInput, signal?: AbortSignal): Promise<{ id: number }>;
  get(id: number, signal?: AbortSignal): Promise<Memory>;
  supersede(
    id: number,
    replacementId: number,
    reason: string,
    signal?: AbortSignal,
  ): Promise<void>;
}

export interface ModelRequest {
  purpose: "classification" | "capture" | "overlap";
  policy: string;
  input: unknown;
  signal?: AbortSignal;
}

export interface MemoryModelClient {
  complete(request: ModelRequest): Promise<unknown>;
}

export interface WorkContext {
  cwd: string;
  repoName?: string;
  project?: Project;
  sessionId: string;
  branchId: string;
}

export interface EvidenceEntry {
  id: string;
  role: "user" | "assistant" | "toolResult";
  text: string;
  toolName?: string;
}

export interface CaptureSnapshot {
  id: string;
  context: WorkContext;
  instanceId: string;
  entries: EvidenceEntry[];
  finalEntryId: string;
  mode: CaptureMode;
  scope: Scope;
  policy: string;
  modelVersion: string;
  createdAt: string;
}
