import type {
  AssistantMessage,
  Context,
  Model,
  SimpleStreamOptions,
  TextContent,
} from "@earendil-works/pi-ai";
import type { MemoryModelClient, ModelRequest } from "./contracts.ts";
import type { ModelSelection } from "./config.ts";
import { sanitizeText, sanitizeValue } from "./privacy.ts";

export interface ModelRegistryPort {
  find(provider: string, modelId: string): Model<any> | undefined;
  complete(
    model: Model<any>,
    context: Context,
    options?: SimpleStreamOptions,
  ): Promise<AssistantMessage>;
}

export interface ModelPickerContext {
  modelRegistry: ModelRegistryPort & {
    getAvailable?: () => Model<any>[];
  };
  scopedModels?: readonly { model: Model<any> }[];
}

const MODEL_OUTPUT_LIMIT = 1_200;
const CAPTURE_OUTPUT_LIMIT = 6_000;
const INPUT_LIMIT = 32_000;
const RESPONSE_LIMIT = 32_000;
const DEFAULT_TIMEOUT_MS = 1_500;
const CAPTURE_TIMEOUT_MS = 15_000;

export interface PiMemoryModelOptions {
  timeoutMs?: number;
}

function textContent(message: AssistantMessage): string {
  return message.content
    .filter((part): part is TextContent => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function trimInput(input: unknown): string {
  let text: string;
  if (typeof input === "string") text = input;
  else {
    try {
      text = JSON.stringify(sanitizeValue(input));
    } catch {
      text = String(input);
    }
  }
  if (typeof input === "string") text = sanitizeText(text);
  if (text.length <= INPUT_LIMIT) return text;
  if (typeof input !== "string")
    throw new Error("Memory model input too large");
  return JSON.stringify({
    truncated: true,
    content: text.slice(0, INPUT_LIMIT - 48),
  });
}

function fencedJson(text: string): string {
  const fence = "```";
  if (!text.startsWith(fence)) return text;

  let contentStart = fence.length;
  if (text.slice(contentStart, contentStart + 4).toLowerCase() === "json") {
    contentStart += 4;
  }
  while (contentStart < text.length && /\s/.test(text[contentStart]!))
    contentStart += 1;

  const closingFence = text.lastIndexOf(fence);
  if (
    closingFence < contentStart ||
    text.slice(closingFence + fence.length).trim() !== ""
  ) {
    return text;
  }
  return text.slice(contentStart, closingFence).trim();
}

function firstJsonDelimiter(text: string): number {
  const objectStart = text.indexOf("{");
  const arrayStart = text.indexOf("[");
  if (objectStart === -1) return arrayStart;
  if (arrayStart === -1) return objectStart;
  return Math.min(objectStart, arrayStart);
}

function parseCompletionResponse(
  response: AssistantMessage,
  request: ModelRequest,
  timedOut: boolean,
): unknown {
  if (request.signal?.aborted || response.stopReason === "aborted") {
    throw new Error("Memory model request aborted");
  }
  if (timedOut) throw new Error("Memory model timeout");
  if (response.stopReason !== "stop")
    throw new Error("Memory model request failed");
  const text = sanitizeText(textContent(response));
  if (Buffer.byteLength(text, "utf8") > RESPONSE_LIMIT) {
    throw new Error("Memory model response too large");
  }
  if (request.signal?.aborted) throw new Error("Memory model request aborted");
  return parseModelResponse(text);
}

export function parseModelResponse(text: string): unknown {
  const candidate = fencedJson(text.trim());
  if (candidate === "") return "";
  try {
    return JSON.parse(candidate) as unknown;
  } catch {
    const objectStart = firstJsonDelimiter(candidate);
    const objectEnd = Math.max(
      candidate.lastIndexOf("}"),
      candidate.lastIndexOf("]"),
    );
    if (objectStart >= 0 && objectEnd > objectStart) {
      try {
        return JSON.parse(
          candidate.slice(objectStart, objectEnd + 1),
        ) as unknown;
      } catch {
        // Keep the model's text when it is not valid structured output.
      }
    }
    return text;
  }
}

export function modelLabel(model: ModelSelection): string {
  return `${model.provider}/${model.id}`;
}

export class PiMemoryModel implements MemoryModelClient {
  readonly version: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly registry: ModelRegistryPort,
    private readonly selection: ModelSelection,
    options: PiMemoryModelOptions = {},
  ) {
    this.version = modelLabel(selection);
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs <= 0) {
      throw new TypeError("Memory model timeoutMs must be positive");
    }
  }

  async complete(request: ModelRequest): Promise<unknown> {
    if (request.signal?.aborted)
      throw new Error("Memory model request aborted");
    const model = this.registry.find(
      this.selection.provider,
      this.selection.id,
    );
    if (!model)
      throw new Error(
        `Memory model ${modelLabel(this.selection)} is not available`,
      );

    const controller = new AbortController();
    const timeoutMs =
      request.purpose === "classification"
        ? this.timeoutMs
        : Math.max(this.timeoutMs, CAPTURE_TIMEOUT_MS);
    const outputLimit =
      request.purpose === "capture" ? CAPTURE_OUTPUT_LIMIT : MODEL_OUTPUT_LIMIT;
    let timedOut = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let onAbort: (() => void) | undefined;
    const callerAbort = new Promise<never>((_, reject) => {
      onAbort = () => {
        controller.abort();
        reject(new Error("Memory model request aborted"));
      };
      if (request.signal?.aborted) onAbort();
      else request.signal?.addEventListener("abort", onAbort, { once: true });
    });
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
        reject(new Error("Memory model timeout"));
      }, timeoutMs);
      timer.unref?.();
    });
    try {
      const response = await Promise.race([
        this.registry.complete(
          model,
          {
            systemPrompt: sanitizeText(request.policy).slice(0, INPUT_LIMIT),
            messages: [
              {
                role: "user",
                content: trimInput(request.input),
                timestamp: Date.now(),
              },
            ],
          },
          {
            signal: controller.signal,
            maxTokens: outputLimit,
            cacheRetention: "none",
            sessionId: `forgetful-${request.purpose}`,
          },
        ),
        callerAbort,
        timeout,
      ]);

      return parseCompletionResponse(response, request, timedOut);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Memory model request aborted"
      )
        throw error;
      if (request.signal?.aborted)
        throw new Error("Memory model request aborted");
      throw new Error("Memory model request failed");
    } finally {
      if (timer) clearTimeout(timer);
      if (onAbort) request.signal?.removeEventListener("abort", onAbort);
    }
  }
}

export function resolveMemoryModel(
  registry: ModelRegistryPort,
  selection: ModelSelection | undefined,
): PiMemoryModel | undefined {
  return selection ? new PiMemoryModel(registry, selection) : undefined;
}

export function modelSelectionFromModel(model: Model<any>): ModelSelection {
  return { provider: model.provider, id: model.id };
}

export function availableMemoryModels(ctx: ModelPickerContext): Model<any>[] {
  const scoped = ctx.scopedModels?.map((entry) => entry.model) ?? [];
  if (scoped.length > 0) return scoped;
  return ctx.modelRegistry.getAvailable?.() ?? [];
}
