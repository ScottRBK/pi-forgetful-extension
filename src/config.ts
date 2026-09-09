import { chmod, mkdir, open, readFile, rename, stat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { CaptureMode, Scope } from "./contracts.ts";

export const DEFAULT_FORGETFUL_BASE_URL = "http://localhost:8020/api/v1";
export const DEFAULT_FORGETFUL_TIMEOUT_MS = 2_000;
export const DEFAULT_FORGETFUL_RECALL_MODEL_TIMEOUT_MS = 1_500;

export type ScopeSource = "default" | "project" | "invalid";
export type PromptName = "classification" | "recall" | "capture";

export interface ModelSelection {
  provider: string;
  id: string;
}

export interface ForgetfulInstanceConfig {
  baseUrl: string;
  token?: string;
  tokenEnv?: string;
  timeoutMs: number;
}

export interface PromptOverlays {
  classification?: string;
  recall?: string;
  capture?: string;
}

export interface ForgetfulConfig {
  enabled: boolean;
  captureMode: CaptureMode;
  debug: boolean;
  scope: Scope;
  scopeSource: ScopeSource;
  instance: ForgetfulInstanceConfig;
  recallModelTimeoutMs: number;
  model?: ModelSelection;
  prompts: PromptOverlays;
  warnings: string[];
  paths: {
    userSettings: string;
    projectSettings: string;
  };
}

export interface LoadConfigOptions {
  agentDir?: string;
  cwd: string;
  trusted: boolean;
  env?: NodeJS.ProcessEnv;
  userSettingsPath?: string;
  projectSettingsPath?: string;
  userPromptDir?: string;
  projectPromptDir?: string;
}

export interface PersistedUserSettings {
  base_url?: unknown;
  token?: unknown;
  token_env?: unknown;
  timeout_ms?: unknown;
  enabled?: unknown;
  capture?: unknown;
  capture_mode?: unknown;
  debug?: unknown;
  recall_model_timeout_ms?: unknown;
  model?: unknown;
}

interface PersistedProjectSettings {
  scope?: unknown;
}

interface JsonReadResult {
  value?: unknown;
  exists: boolean;
  malformed: boolean;
}

const PROMPT_NAMES: PromptName[] = ["classification", "recall", "capture"];
const MAX_CONFIG_FILE_BYTES = 64 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseModel(value: unknown): ModelSelection | undefined {
  if (typeof value === "string") {
    const separator = value.indexOf("/");
    if (separator > 0 && separator < value.length - 1) {
      return {
        provider: value.slice(0, separator),
        id: value.slice(separator + 1),
      };
    }
    return undefined;
  }
  if (
    !isRecord(value) ||
    typeof value.provider !== "string" ||
    typeof value.id !== "string"
  ) {
    return undefined;
  }
  if (value.provider.trim() === "" || value.id.trim() === "") return undefined;
  return { provider: value.provider, id: value.id };
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asPositiveInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : fallback;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

async function readJson(path: string): Promise<JsonReadResult> {
  try {
    const details = await stat(path);
    if (details.size > MAX_CONFIG_FILE_BYTES)
      return { exists: true, malformed: true };
    const text = await readFile(path, "utf8");
    try {
      return { value: JSON.parse(text), exists: true, malformed: false };
    } catch {
      return { exists: true, malformed: true };
    }
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return { exists: false, malformed: false };
    }
    throw error;
  }
}

async function readPromptDirectory(
  path: string,
  trusted: boolean,
  warnings: string[],
): Promise<PromptOverlays> {
  const prompts: PromptOverlays = {};
  if (!trusted) return prompts;
  for (const name of PROMPT_NAMES) {
    try {
      const promptPath = join(path, `${name}.md`);
      const details = await stat(promptPath);
      if (details.size > MAX_CONFIG_FILE_BYTES) {
        warnings.push(`${name} prompt overlay is too large and was ignored.`);
        continue;
      }
      const text = await readFile(promptPath, "utf8");
      if (text.trim() !== "") prompts[name] = text.trim();
    } catch (error) {
      if (
        !(
          error instanceof Error &&
          "code" in error &&
          (error as NodeJS.ErrnoException).code === "ENOENT"
        )
      ) {
        warnings.push(
          `Unable to read ${name} prompt overlay: ${String(error)}`,
        );
      }
    }
  }
  return prompts;
}

function mergePrompts(
  globalPrompts: PromptOverlays,
  projectPrompts: PromptOverlays,
): PromptOverlays {
  const merged: PromptOverlays = { ...globalPrompts };
  for (const name of PROMPT_NAMES) {
    const project = projectPrompts[name];
    if (project)
      merged[name] = merged[name] ? `${merged[name]}\n\n${project}` : project;
  }
  return merged;
}

function resolveCaptureMode(value: unknown, warnings: string[]): CaptureMode {
  if (value === "off" || value === "observe" || value === "auto") return value;
  if (value === undefined) return "auto";
  warnings.push("Invalid capture mode; using off until corrected.");
  return "off";
}

function resolveScope(
  projectData: JsonReadResult,
  projectPath: string,
  trusted: boolean,
  warnings: string[],
): { scope: Scope; scopeSource: ScopeSource } {
  if (!trusted) {
    warnings.push(
      "Project Forgetful settings were ignored because the project is not trusted.",
    );
    return { scope: "global", scopeSource: "default" };
  }
  if (projectData.malformed) {
    warnings.push(
      `Malformed project settings at ${projectPath}; using global scope.`,
    );
    return { scope: "global", scopeSource: "invalid" };
  }
  if (projectData.exists && !isRecord(projectData.value)) {
    warnings.push(
      `Project settings at ${projectPath} must be a JSON object; using global scope.`,
    );
    return { scope: "global", scopeSource: "invalid" };
  }
  if (!isRecord(projectData.value))
    return { scope: "global", scopeSource: "default" };

  const project = projectData.value as PersistedProjectSettings;
  if (project.scope === "global" || project.scope === "project") {
    return { scope: project.scope, scopeSource: "project" };
  }
  if (project.scope !== undefined) {
    warnings.push(
      `Invalid project scope in ${projectPath}; using global scope.`,
    );
    return { scope: "global", scopeSource: "invalid" };
  }
  return { scope: "global", scopeSource: "default" };
}

export function defaultAgentDir(): string {
  return join(homedir(), ".pi", "agent");
}

export function userSettingsPath(agentDir = defaultAgentDir()): string {
  return join(agentDir, "forgetful", "settings.json");
}

export function projectSettingsPath(cwd: string): string {
  return join(cwd, ".pi", "forgetful", "settings.json");
}

export async function loadForgetfulConfig(
  options: LoadConfigOptions,
): Promise<ForgetfulConfig> {
  const warnings: string[] = [];
  const userPath =
    options.userSettingsPath ?? userSettingsPath(options.agentDir);
  const projectPath =
    options.projectSettingsPath ?? projectSettingsPath(options.cwd);
  const userData = await readJson(userPath);
  const projectData = options.trusted
    ? await readJson(projectPath)
    : { exists: false, malformed: false };
  const user = isRecord(userData.value)
    ? (userData.value as PersistedUserSettings)
    : {};

  if (userData.malformed)
    warnings.push(
      `Malformed user settings at ${userPath}; defaults are being used.`,
    );
  if (userData.exists && !isRecord(userData.value))
    warnings.push(`User settings at ${userPath} must be a JSON object.`);

  const rawBaseUrl = asString(user.base_url) ?? DEFAULT_FORGETFUL_BASE_URL;
  const rawTokenEnv = asString(user.token_env);
  const rawToken = asString(user.token);
  const env = options.env ?? process.env;
  const token = rawTokenEnv ? env[rawTokenEnv] : rawToken;

  const captureMode = resolveCaptureMode(
    user.capture_mode ?? user.capture,
    warnings,
  );

  const model = parseModel(user.model);
  if (user.model !== undefined && !model)
    warnings.push("Invalid memory model; use provider/model-id.");

  const { scope, scopeSource } = resolveScope(
    projectData,
    projectPath,
    options.trusted,
    warnings,
  );

  const globalPrompts = await readPromptDirectory(
    options.userPromptDir ?? join(dirname(userPath), "prompts"),
    true,
    warnings,
  );
  const projectPrompts = await readPromptDirectory(
    options.projectPromptDir ?? join(dirname(projectPath), "prompts"),
    options.trusted,
    warnings,
  );

  const tokenEnvMissing = rawTokenEnv !== undefined && !token;
  if (tokenEnvMissing)
    warnings.push(
      `Forgetful token environment variable ${rawTokenEnv} is not set; memory traffic is disabled.`,
    );

  return {
    enabled: asBoolean(user.enabled, true) && !tokenEnvMissing,
    captureMode,
    debug: asBoolean(user.debug, false),
    scope,
    scopeSource,
    recallModelTimeoutMs: asPositiveInteger(
      user.recall_model_timeout_ms,
      DEFAULT_FORGETFUL_RECALL_MODEL_TIMEOUT_MS,
    ),
    instance: {
      baseUrl: rawBaseUrl.replace(/\/$/, ""),
      token,
      tokenEnv: rawTokenEnv,
      timeoutMs: asPositiveInteger(
        user.timeout_ms,
        DEFAULT_FORGETFUL_TIMEOUT_MS,
      ),
    },
    model,
    prompts: mergePrompts(globalPrompts, projectPrompts),
    warnings,
    paths: { userSettings: userPath, projectSettings: projectPath },
  };
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  await chmod(temporary, 0o600);
  await rename(temporary, path);
  await chmod(path, 0o600);
}

export async function writeProjectScope(
  cwd: string,
  scope: Scope,
): Promise<void> {
  await writeJson(projectSettingsPath(cwd), { scope });
}

export async function updateUserSettings(
  path: string,
  update: Partial<
    Pick<
      PersistedUserSettings,
      | "base_url"
      | "token_env"
      | "timeout_ms"
      | "enabled"
      | "capture_mode"
      | "debug"
      | "recall_model_timeout_ms"
      | "model"
    >
  >,
): Promise<void> {
  const current = await readJson(path);
  const settings = isRecord(current.value) ? current.value : {};
  await writeJson(path, { ...settings, ...update });
}

export async function updateForgetfulConnection(
  path: string,
  connection: { baseUrl: string; tokenEnv?: string },
): Promise<void> {
  const current = await readJson(path);
  if (
    current.malformed ||
    (current.exists && !isRecord(current.value))
  ) {
    throw new TypeError("Forgetful user settings must be a valid JSON object");
  }
  const settings = isRecord(current.value) ? { ...current.value } : {};
  settings.base_url = connection.baseUrl;
  delete settings.token;
  if (connection.tokenEnv) settings.token_env = connection.tokenEnv;
  else delete settings.token_env;
  await writeJson(path, settings);
}

export function modelToString(
  model: ModelSelection | undefined,
): string | undefined {
  return model ? `${model.provider}/${model.id}` : undefined;
}
