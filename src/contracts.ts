export type Scope = "global" | "project";
export type CaptureMode = "auto" | "observe" | "off";

export interface Project {
  id: number;
  name: string;
  repo_name?: string | null;
  description?: string;
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
  search(request: SearchRequest, signal?: AbortSignal): Promise<Memory[]>;
  listProjects(repoName?: string, signal?: AbortSignal): Promise<Project[]>;
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
