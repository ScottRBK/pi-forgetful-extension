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
import type { CompactionSettings } from "@earendil-works/pi-coding-agent";
import { Value } from "typebox/value";
import type { TSchema } from "typebox";
import {
  ModelSubmissionError,
  type MemoryModelClient,
  type ModelRequest,
  type ModelSubmissionTool,
  type ModelReadTool,
} from "./contracts.ts";
import {
  DEFAULT_FORGETFUL_RECALL_MODEL_TIMEOUT_MS,
  isRecallConcurrency,
  type ModelSelection,
} from "./config.ts";
import { sanitizeText, sanitizeValue } from "./privacy.ts";
import type { DiagnosticLogger } from "./logging.ts";
import { evidenceMessage, MemoryTaskContext } from "./model-context.ts";
import { mapConcurrent } from "./concurrency.ts";

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

const CAPTURE_TIMEOUT_MS = 180_000;
const MAX_SUBMISSION_ATTEMPTS = 3;

export interface PiMemoryModelOptions {
  logger?: DiagnosticLogger;
  /** Per-call classification/review deadline; capture and overlap retain three minutes. */
  classificationTimeoutMs?: number;
  /** Compatibility alias for classificationTimeoutMs. */
  timeoutMs?: number;
  /** The current Pi session ID used for provider session affinity. */
  sessionId?: string;
  /** Public pi-ai header transform for provider-specific background request preparation. */
  transformHeaders?: MemoryModelHeaderTransform;
  /** Persisted Pi settings; unsaved host settings are not exposed through ExtensionContext. */
  compactionSettings?: CompactionSettings;
  /** Total private context budget, including system, tools and maximum output. */
  contextLimitTokens?: number;
}

function serializeInput(input: unknown): string {
  let text: string;
  if (typeof input === "string") text = input;
  else {
    try {
      text = JSON.stringify(sanitizeValue(input));
    } catch {
      text = String(input);
    }
  }
  return typeof input === "string" ? sanitizeText(text) : text;
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

function requestOptions(
  model: Model<any>,
  sessionId: string | undefined,
  transformHeaders: MemoryModelHeaderTransform | undefined,
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
    // Registry.complete uses the raw provider path, which needs Pi's configured allowance.
    maxTokens: model.maxTokens,
    cacheRetention: "none",
    ...(sessionId ? { sessionId } : {}),
    ...(headerTransform ? { transformHeaders: headerTransform } : {}),
  };
}

function textBlock(text: string): TextContent {
  return { type: "text", text };
}

function submissionTool(submission: ModelSubmissionTool | ModelReadTool): Tool {
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
  return sanitizeText(detail);
}

function sanitizedAssistantForHistory(message: AssistantMessage): AssistantMessage {
  return {
    ...message,
    content: message.content.map((part) => {
      if (part.type === "text") {
        return textBlock(sanitizeText(part.text));
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

function appendCallCountCorrection(
  context: Context,
  response: AssistantMessage,
  calls: ToolCall[],
  submissionName: string,
  base: string,
): void {
  if (calls.length === 0) {
    context.messages.push({
      role: "user",
      content: `Call ${submissionName} exactly once. Do not answer with JSON text.`,
      timestamp: Date.now(),
    });
    return;
  }
  context.messages.push(sanitizedAssistantForHistory(response));
  for (const call of calls) {
    const reason = call.name === submissionName
      ? base
      : `${base} Tool "${sanitizeText(call.name)}" not found.`;
    context.messages.push(errorToolResult(call, rejectionText(reason)));
  }
}

interface RequestDeadline {
  controller: AbortController;
  callerAbort: Promise<never>;
  timeout: Promise<never>;
  readonly timedOut: boolean;
  providerCalls: number;
  compactionCalls: number;
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
    providerCalls: 0,
    compactionCalls: 0,
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
  private readonly logger?: DiagnosticLogger;
  private readonly compactionSettings?: CompactionSettings;
  private readonly contextLimitTokens?: number;

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
    this.logger = options.logger;
    this.compactionSettings = options.compactionSettings;
    this.contextLimitTokens = options.contextLimitTokens;
    if (
      !Number.isFinite(this.classificationTimeoutMs) ||
      this.classificationTimeoutMs <= 0
    ) {
      throw new TypeError("Memory model timeoutMs must be positive");
    }
  }

  async complete(request: ModelRequest): Promise<unknown> {
    const started = performance.now();
    this.emit("info", "model.started", request);
    try {
      const result = await this.completeRequest(request);
      this.emit("debug", "model.parsed", request, { result });
      this.emit("info", "model.completed", request, { elapsedMs: performance.now() - started });
      return result;
    } catch (error) {
      this.emit("info", "model.error", request, {
        elapsedMs: performance.now() - started,
        status: request.signal?.aborted ? "aborted" : "failed",
      });
      this.emit("debug", "model.error_detail", request, {
        error: rejectionText(error),
        cause: error instanceof Error && error.cause ? rejectionText(error.cause) : undefined,
      });
      throw error;
    }
  }

  async prepareCapture(request: ModelRequest): Promise<"ready" | "progress"> {
    if (request.purpose !== "capture") {
      throw new TypeError("Capture preparation requires a capture request");
    }
    const started = performance.now();
    this.emit("info", "model.preparation_started", request);
    try {
      const result = await this.completeRequest(request, true);
      if (result !== "ready" && result !== "progress") {
        throw new Error("Invalid capture preparation result");
      }
      this.emit("info", "model.preparation_completed", request, {
        elapsedMs: performance.now() - started, status: result,
      });
      return result;
    } catch (error) {
      this.emit("info", "model.preparation_error", request, {
        elapsedMs: performance.now() - started,
        status: request.signal?.aborted ? "aborted" : "failed",
      });
      this.emit("debug", "model.error_detail", request, {
        error: rejectionText(error),
        cause: error instanceof Error && error.cause ? rejectionText(error.cause) : undefined,
      });
      throw error;
    }
  }

  private emit(
    level: "info" | "debug",
    event: string,
    request: ModelRequest,
    data: Record<string, unknown> = {},
  ): void {
    try {
      if (!this.logger) return;
      const safe = sanitizeValue({
        sessionId: this.sessionId,
        ...request.diagnosticContext,
        purpose: request.purpose,
        model: this.version,
        ...data,
      }) as Record<string, unknown>;
      // Keep correlation when the shared file logger's event limit would drop the whole payload.
      for (const key of ["context", "response", "result", "input"]) {
        const json = JSON.stringify(safe[key]);
        if (!json || Buffer.byteLength(json) <= 60_000) continue;
        let preview = json;
        do {
          preview = preview.slice(0, Math.floor(preview.length * 0.75));
        } while (Buffer.byteLength(JSON.stringify(preview)) > 59_900);
        safe[key] = { truncated: true, preview };
      }
      this.logger.emit(level, event, safe);
    } catch {
      // Diagnostics must never change model execution or retry behaviour.
    }
  }

  private async completeRequest(
    request: ModelRequest, preparationOnly = false,
  ): Promise<unknown> {
    if (request.signal?.aborted)
      throw new Error("Memory model request aborted");
    if (!isRecallConcurrency(request.readConcurrency ?? 1)) {
      throw new TypeError("Memory model readConcurrency must be an integer from 1 to 8");
    }
    if (!request.submission) {
      throw new TypeError("Memory model submission tool is required");
    }
    if (typeof request.submission.validate !== "function") {
      throw new TypeError("Memory model submission tool validator is required");
    }
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
      const historyMessages = (request.conversation ?? []).map((record, index) =>
        evidenceMessage(record, `Historical record ${index + 1}`, Date.now()));
      const context: Context = {
        systemPrompt: sanitizeText(request.policy),
        messages: [
          ...historyMessages,
          {
            role: "user",
            content: serializeInput(request.input),
            timestamp: Date.now(),
          },
        ],
        tools: [submissionTool(request.submission),
          ...(request.readTools ?? []).map(submissionTool)],
      };
      const options = requestOptions(
        model,
        this.sessionId,
        this.transformHeaders,
        deadline.controller.signal,
      );
      const leading = request.conversation?.[0] as
        { type?: unknown; summary?: unknown; throughEntryId?: unknown } | undefined;
      const initialHistory = leading?.type === "capture_history_summary" &&
        typeof leading.throughEntryId === "string" && typeof leading.summary === "string"
        ? { summary: sanitizeText(leading.summary), summaryMessage: historyMessages[0]!,
          retainedMessages: historyMessages.slice(1) } : undefined;
      const taskContext = new MemoryTaskContext(
        model, context.messages.at(-1)!, this.compactionSettings, this.contextLimitTokens,
        initialHistory,
      );
      let initialPreparation = true;
      const persistHistory = async (compacted: {
        summary: string; retainedMessages: Context["messages"];
      }): Promise<void> => {
        if (!request.onConversationCompacted) {
          if (preparationOnly) throw new Error("Capture preparation requires durable progress");
          return;
        }
        const cut = historyMessages.length - compacted.retainedMessages.length;
        const boundary = request.conversation?.[cut - 1] as
          { id?: unknown; type?: unknown; throughEntryId?: unknown } | undefined;
        const throughEntryId = boundary?.type === "capture_history_summary"
          ? boundary.throughEntryId : boundary?.id;
        if (cut <= 0 || boundary?.type === "capture_history_summary" ||
            typeof throughEntryId !== "string" ||
            !compacted.retainedMessages.every((message, index) =>
              message === historyMessages[cut + index])) {
          throw new Error("Compacted history has no stable source boundary or unchanged tail");
        }
        await Promise.race([request.onConversationCompacted({ summary: compacted.summary,
          summarizedThroughEntryId: throughEntryId,
          retainedConversation: request.conversation!.slice(cut) }),
        deadline.callerAbort, deadline.timeout]);
      };
      const summarize = async (
        summaryContext: Context, summaryOptions: ModelsSimpleStreamOptions,
      ): Promise<AssistantMessage> => {
        if (preparationOnly && !request.onConversationCompacted) {
          throw new Error("Capture preparation requires durable progress");
        }
        const response = await this.completeAttempt(model, summaryContext,
          { ...options, maxTokens: summaryOptions.maxTokens },
          request, deadline, deadline.compactionCalls + 1, "compaction");
        ensureCompletionFinished(response, request, deadline.timedOut, false);
        return response;
      };
      if (preparationOnly) {
        return await taskContext.prepareCapture(context, deadline.controller.signal,
          this.sessionId, summarize, persistHistory);
      }
      const prepare = async (): Promise<number> => {
        const maxTokens = await taskContext.prepare(
          context, deadline.controller.signal, this.sessionId,
          summarize,
          initialPreparation ? persistHistory : undefined,
        );
        // Persist only initial source history, never private task replies or read continuations.
        if (!initialPreparation) return maxTokens;
        initialPreparation = false;
        return maxTokens;
      };
      return await this.completeWithSubmission(
        model,
        context,
        options,
        request,
        deadline,
        prepare,
      );
    } catch (error) {
      throwRequestFailure(error, request);
    } finally {
      this.emit("info", "model.calls", request, {
        providerCalls: deadline.providerCalls, compactionCalls: deadline.compactionCalls,
      });
      deadline.cleanup();
    }
  }

  private async completeAttempt(
    model: Model<any>,
    context: Context,
    options: ModelsSimpleStreamOptions,
    request: ModelRequest,
    deadline: RequestDeadline,
    attempt: number,
    kind: "task" | "compaction" = "task",
  ): Promise<AssistantMessage> {
    if (deadline.controller.signal.aborted) throw new Error("Memory model request aborted");
    const started = performance.now();
    const call = ++deadline.providerCalls;
    if (kind === "compaction") deadline.compactionCalls++;
    this.emit("info", "model.attempt", request, { attempt, call, kind });
    this.emit("debug", "model.request", request, { attempt, call, kind, context });
    let response: AssistantMessage;
    try {
      response = await Promise.race([
        this.registry.complete(model, context, options),
        deadline.callerAbort,
        deadline.timeout,
      ]);
    } catch (error) {
      this.emit("info", "model.attempt_error", request, {
        attempt, call, kind, elapsedMs: performance.now() - started,
      });
      this.emit("debug", "model.attempt_error_detail", request, {
        attempt, call, kind, error: rejectionText(error),
      });
      throw error;
    }
    // Preserve provider output before parsing or submission validation can reject it.
    this.emit("debug", "model.response", request, { attempt, call, kind, response });
    this.emit("info", "model.attempt_completed", request, {
      attempt, call, kind, elapsedMs: performance.now() - started,
    });
    return response;
  }

  private async executeRead(
    read: ModelReadTool,
    call: ToolCall,
    request: ModelRequest,
    deadline: RequestDeadline,
  ): Promise<ToolResultMessage> {
    try {
      if (deadline.controller.signal.aborted) throw new Error("Memory model request aborted");
      validateToolCall([submissionTool(read)], call);
      // The SDK validator may coerce values. Only original arguments authorize execution.
      const schema = read.parameters as TSchema;
      if (!Value.Check(schema, call.arguments)) {
        throw new Error(JSON.stringify([...Value.Errors(schema, call.arguments)]));
      }
      const value = await Promise.race([
        read.execute(call.arguments, deadline.controller.signal),
        deadline.callerAbort,
        deadline.timeout,
      ]);
      return {
        role: "toolResult", toolCallId: call.id, toolName: call.name,
        content: [textBlock(serializeInput(value))], isError: false, timestamp: Date.now(),
      };
    } catch (error) {
      if (request.signal?.aborted || deadline.timedOut) throw error;
      return errorToolResult(call, rejectionText(error));
    }
  }

  private validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall): unknown {
    validateToolCall([tool], call);
    // Pi may coerce values. Both schema and domain checks apply to the original input.
    const schema = submission.parameters as TSchema;
    const schemaError = Value.Check(schema, call.arguments) ? undefined :
      new Error(JSON.stringify([...Value.Errors(schema, call.arguments)]));
    // Keep actionable domain diagnostics. A corrected return value (or mutation) cannot
    // override the schema result captured from the original arguments before validation.
    const result = submission.validate(call.arguments);
    if (schemaError) throw schemaError;
    return result;
  }

  private async completeWithSubmission(
    model: Model<any>,
    context: Context,
    options: ModelsSimpleStreamOptions,
    request: ModelRequest,
    deadline: RequestDeadline,
    prepare: () => Promise<number>,
  ): Promise<unknown> {
    const submission = request.submission!;
    const tool = submissionTool(submission);
    const rejections: string[] = [];
    const recordRejection = (attempt: number, reason: string, input?: unknown): void => {
      const safeReason = rejectionText(reason);
      this.emit("info", "model.submission_rejected", request, { attempt });
      this.emit("debug", "model.submission_rejection", request, {
        attempt, reason: safeReason, input,
      });
      rejections.push(safeReason);
      submission.onRejection?.(safeReason, input);
    };
    let rejected = 0;
    let attempt = 0;
    while (rejected < MAX_SUBMISSION_ATTEMPTS) {
      attempt++;
      const maxTokens = await prepare();
      const response = await this.completeAttempt(
        model, context, { ...options, maxTokens }, request, deadline, attempt,
      );
      ensureCompletionFinished(response, request, deadline.timedOut, true);
      const calls = toolCalls(response);
      const reads = request.readTools ?? [];
      if (calls.length > 0 && calls.every((call) =>
        reads.some((read) => read.name === call.name))) {
        context.messages.push(sanitizedAssistantForHistory(response));
        const results = await mapConcurrent(calls, request.readConcurrency ?? 1, (call) => {
          const read = reads.find((item) => item.name === call.name)!;
          return this.executeRead(read, call, request, deadline);
        });
        ensureCompletionFinished(response, request, deadline.timedOut, true);
        context.messages.push(...results);
        if (request.readBatchContext) context.messages.push({
          role: "user", content: serializeInput(request.readBatchContext()), timestamp: Date.now(),
        });
        continue;
      }
      if (calls.length !== 1) {
        const base = `Call ${submission.name} exactly one time; received ` +
          `${calls.length} tool calls.`;
        rejected++;
        recordRejection(attempt, base);
        appendCallCountCorrection(context, response, calls, submission.name, base);
        continue;
      }

      const call = calls[0]!;
      try {
        return this.validateSubmission(submission, tool, call);
      } catch (error) {
        const reason = rejectionText(error);
        // Recovery may retain independently valid batch items. Wrong-tool arguments must never
        // reach that path; the original provider response remains available in private diagnostics.
        rejected++;
        recordRejection(attempt, reason,
          call.name === submission.name ? call.arguments : undefined);
        context.messages.push(
          sanitizedAssistantForHistory(response),
          errorToolResult(call, reason),
        );
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
