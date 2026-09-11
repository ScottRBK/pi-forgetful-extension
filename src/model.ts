import type {
  AssistantMessage,
  Context,
  Model,
  ModelsSimpleStreamOptions,
  ProviderHeaders,
  TextContent,
  Tool,
  ToolCall,
  ToolResultMessage,
} from "@earendil-works/pi-ai";
import { validateToolCall } from "@earendil-works/pi-ai";
import type { MemoryModelClient, ModelRequest } from "./contracts.ts";
import { ModelSubmissionError, type ModelSubmissionTool } from "./contracts.ts";
import {
  DEFAULT_FORGETFUL_RECALL_MODEL_TIMEOUT_MS,
  type ModelSelection,
} from "./config.ts";
import { sanitizeText, sanitizeValue } from "./privacy.ts";

export interface ModelRegistryPort {
  find(provider: string, modelId: string): Model<any> | undefined;
  complete(
    model: Model<any>,
    context: Context,
    options?: ModelsSimpleStreamOptions,
  ): Promise<AssistantMessage>;
}

export type MemoryModelHeaderTransform = (
  headers: ProviderHeaders,
) => ProviderHeaders | Promise<ProviderHeaders>;

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
const CAPTURE_TIMEOUT_MS = 15_000;
const MAX_SUBMISSION_ATTEMPTS = 3;
const MAX_REJECTION_CHARS = 800;
const MAX_HISTORY_TEXT_CHARS = 2_000;

export interface PiMemoryModelOptions {
  /** Per-call classification/review deadline; capture and overlap retain 15 seconds. */
  classificationTimeoutMs?: number;
  /** Compatibility alias for classificationTimeoutMs. */
  timeoutMs?: number;
  /** The current Pi session ID used for provider session affinity. */
  sessionId?: string;
  /** Public pi-ai header transform for provider-specific background request preparation. */
  transformHeaders?: MemoryModelHeaderTransform;
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
  ensureCompletionFinished(response, request, timedOut, false);
  const text = sanitizeText(textContent(response));
  if (Buffer.byteLength(text, "utf8") > RESPONSE_LIMIT) {
    throw new Error("Memory model response too large");
  }
  if (request.signal?.aborted) throw new Error("Memory model request aborted");
  return parseModelResponse(text);
}

function ensureCompletionFinished(
  response: AssistantMessage,
  request: ModelRequest,
  timedOut: boolean,
  allowToolUse: boolean,
): void {
  if (request.signal?.aborted || response.stopReason === "aborted") {
    throw new Error("Memory model request aborted");
  }
  if (timedOut) throw new Error("Memory model timeout");
  if (response.stopReason === "stop") return;
  if (allowToolUse && response.stopReason === "toolUse") return;
  const detail = sanitizeText(
    response.errorMessage || response.stopReason,
  ).slice(0, 500);
  throw new Error(`Memory model request failed: ${detail}`);
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

function isOpenCodeModel(model: Model<any>): boolean {
  if (model.provider === "opencode" || model.provider === "opencode-go") {
    return true;
  }
  try {
    return new URL(model.baseUrl).hostname === "opencode.ai";
  } catch {
    return false;
  }
}

function openCodeSessionHeaders(
  model: Model<any>,
  sessionId: string | undefined,
): ProviderHeaders | undefined {
  if (!sessionId || !isOpenCodeModel(model)) return undefined;
  return {
    "x-opencode-session": sessionId,
    "x-opencode-client": "pi",
  };
}

function requestTimeout(
  request: ModelRequest,
  classificationTimeoutMs: number,
): number {
  return request.purpose === "classification" || request.purpose === "recall-review"
    ? classificationTimeoutMs
    : CAPTURE_TIMEOUT_MS;
}

function requestOutputLimit(request: ModelRequest): number {
  return request.purpose === "capture"
    ? CAPTURE_OUTPUT_LIMIT
    : MODEL_OUTPUT_LIMIT;
}

function requestOptions(
  model: Model<any>,
  sessionId: string | undefined,
  transformHeaders: MemoryModelHeaderTransform | undefined,
  outputLimit: number,
  signal: AbortSignal,
): ModelsSimpleStreamOptions {
  const sessionHeaders = openCodeSessionHeaders(model, sessionId);
  const headerTransform = sessionHeaders || transformHeaders
    ? async (headers: ProviderHeaders): Promise<ProviderHeaders> => {
        const prepared = sessionHeaders
          ? { ...headers, ...sessionHeaders }
          : headers;
        return transformHeaders ? transformHeaders(prepared) : prepared;
      }
    : undefined;
  return {
    signal,
    maxTokens: outputLimit,
    cacheRetention: "none",
    ...(sessionId ? { sessionId } : {}),
    ...(headerTransform ? { transformHeaders: headerTransform } : {}),
  };
}

function textBlock(text: string): TextContent {
  return { type: "text", text };
}

function submissionTool(submission: ModelSubmissionTool): Tool {
  return {
    name: submission.name,
    description: submission.description,
    parameters: submission.parameters as Tool["parameters"],
  };
}

function toolCalls(message: AssistantMessage): ToolCall[] {
  return message.content.filter((part): part is ToolCall => part.type === "toolCall");
}

function rejectionText(error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);
  return sanitizeText(detail).slice(0, MAX_REJECTION_CHARS);
}

function sanitizedAssistantForHistory(message: AssistantMessage): AssistantMessage {
  return {
    ...message,
    content: message.content.map((part) => {
      if (part.type === "text") {
        return textBlock(sanitizeText(part.text).slice(0, MAX_HISTORY_TEXT_CHARS));
      }
      if (part.type === "toolCall") {
        return {
          ...part,
          arguments: sanitizeValue(part.arguments) as Record<string, any>,
        };
      }
      return part;
    }),
  };
}

function errorToolResult(call: ToolCall, error: string): ToolResultMessage {
  return {
    role: "toolResult",
    toolCallId: call.id,
    toolName: call.name,
    content: [textBlock(error)],
    isError: true,
    timestamp: Date.now(),
  };
}

interface RequestDeadline {
  controller: AbortController;
  callerAbort: Promise<never>;
  timeout: Promise<never>;
  readonly timedOut: boolean;
  cleanup(): void;
}

function requestDeadline(
  request: ModelRequest,
  timeoutMs: number,
): RequestDeadline {
  const controller = new AbortController();
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
  return {
    controller,
    callerAbort,
    timeout,
    get timedOut() {
      return timedOut;
    },
    cleanup() {
      if (timer) clearTimeout(timer);
      if (onAbort) request.signal?.removeEventListener("abort", onAbort);
    },
  };
}

function throwRequestFailure(error: unknown, request: ModelRequest): never {
  if (error instanceof ModelSubmissionError) throw error;
  if (
    error instanceof Error &&
    error.message === "Memory model request aborted"
  ) {
    throw error;
  }
  if (request.signal?.aborted) {
    throw new Error("Memory model request aborted");
  }
  const detail = error instanceof Error ? error.message : String(error);
  throw new Error("Memory model request failed", {
    cause: new Error(sanitizeText(detail).slice(0, 550)),
  });
}

export class PiMemoryModel implements MemoryModelClient {
  readonly version: string;
  private readonly classificationTimeoutMs: number;
  private readonly sessionId?: string;
  private readonly transformHeaders?: MemoryModelHeaderTransform;

  constructor(
    private readonly registry: ModelRegistryPort,
    private readonly selection: ModelSelection,
    options: PiMemoryModelOptions = {},
  ) {
    this.version = modelLabel(selection);
    this.classificationTimeoutMs =
      options.classificationTimeoutMs ??
      options.timeoutMs ??
      DEFAULT_FORGETFUL_RECALL_MODEL_TIMEOUT_MS;
    this.sessionId = options.sessionId || undefined;
    this.transformHeaders = options.transformHeaders;
    if (
      !Number.isFinite(this.classificationTimeoutMs) ||
      this.classificationTimeoutMs <= 0
    ) {
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

    const deadline = requestDeadline(
      request,
      requestTimeout(request, this.classificationTimeoutMs),
    );
    try {
      const context: Context = {
        systemPrompt: sanitizeText(request.policy).slice(0, INPUT_LIMIT),
        messages: [
          {
            role: "user",
            content: trimInput(request.input),
            timestamp: Date.now(),
          },
        ],
        ...(request.submission
          ? { tools: [submissionTool(request.submission)] }
          : {}),
      };
      const options = requestOptions(
        model,
        this.sessionId,
        this.transformHeaders,
        requestOutputLimit(request),
        deadline.controller.signal,
      );
      if (request.submission) {
        return await this.completeWithSubmission(
          model,
          context,
          options,
          request,
          deadline,
        );
      }
      const response = await Promise.race([
        this.registry.complete(model, context, options),
        deadline.callerAbort,
        deadline.timeout,
      ]);

      return parseCompletionResponse(response, request, deadline.timedOut);
    } catch (error) {
      throwRequestFailure(error, request);
    } finally {
      deadline.cleanup();
    }
  }

  private async completeWithSubmission(
    model: Model<any>,
    context: Context,
    options: ModelsSimpleStreamOptions,
    request: ModelRequest,
    deadline: RequestDeadline,
  ): Promise<unknown> {
    const submission = request.submission!;
    const tool = submissionTool(submission);
    const rejections: string[] = [];
    const recordRejection = (reason: string, input?: unknown): void => {
      const bounded = rejectionText(reason);
      rejections.push(bounded);
      submission.onRejection?.(bounded, input);
    };
    for (let attempt = 1; attempt <= MAX_SUBMISSION_ATTEMPTS; attempt++) {
      const response = await Promise.race([
        this.registry.complete(model, context, options),
        deadline.callerAbort,
        deadline.timeout,
      ]);
      ensureCompletionFinished(response, request, deadline.timedOut, true);
      // Bound the whole response before validating or retaining any provider-generated history.
      if (Buffer.byteLength(JSON.stringify(response.content), "utf8") > RESPONSE_LIMIT) {
        throw new Error("Memory model response too large");
      }

      const calls = toolCalls(response);
      if (calls.length !== 1) {
        const base = `Call ${submission.name} exactly one time; received ` +
          `${calls.length} tool calls.`;
        recordRejection(base);
        if (calls.length > 0) {
          context.messages.push(sanitizedAssistantForHistory(response));
          for (const call of calls) {
            const reason = call.name === submission.name
              ? base
              : `${base} Tool "${sanitizeText(call.name)}" not found.`;
            context.messages.push(errorToolResult(call, rejectionText(reason)));
          }
        } else {
          context.messages.push({
            role: "user",
            content: `Call ${submission.name} exactly once with the review result. ` +
              "Do not answer with JSON text.",
            timestamp: Date.now(),
          });
        }
        continue;
      }

      const call = calls[0]!;
      try {
        validateToolCall([tool], call);
        // Pi may coerce types or remove optional nulls. Domain rules validate the original input.
        return submission.validate(call.arguments);
      } catch (error) {
        const reason = rejectionText(error);
        recordRejection(reason, call.arguments);
        context.messages.push(sanitizedAssistantForHistory(response));
        context.messages.push(errorToolResult(call, reason));
      }
    }
    throw new ModelSubmissionError(
      "Memory model submission failed",
      rejections.slice(-MAX_SUBMISSION_ATTEMPTS),
    );
  }
}

export function resolveMemoryModel(
  registry: ModelRegistryPort,
  selection: ModelSelection | undefined,
  options: PiMemoryModelOptions = {},
): PiMemoryModel | undefined {
  return selection ? new PiMemoryModel(registry, selection, options) : undefined;
}

export function modelSelectionFromModel(model: Model<any>): ModelSelection {
  return { provider: model.provider, id: model.id };
}

export function availableMemoryModels(ctx: ModelPickerContext): Model<any>[] {
  const scoped = ctx.scopedModels?.map((entry) => entry.model) ?? [];
  if (scoped.length > 0) return scoped;
  return ctx.modelRegistry.getAvailable?.() ?? [];
}
