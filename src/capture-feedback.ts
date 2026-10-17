import { Type } from "typebox";
import { ModelReadErrorResult, type ModelReadTool } from "./contracts.ts";
import { sanitizeValue } from "./privacy.ts";

/** A reserved execution survives task-budget yields without spending another attempt. */
export interface CaptureCorrectionCycle {
  cycle: number;
  attempts: number;
  phase: "ready" | "needs-review" | "exhausted";
  failureKind?: "correctable" | "retry";
  failure?: unknown;
}

/** A deterministic local selection failure, never an infrastructure or provider fault. */
export class CaptureSelectionError extends Error {}

/** Call only after dispatch receipts have ruled out an uncertain mutation. */
export function correctableCaptureError(error: unknown): boolean {
  return error instanceof CaptureSelectionError || (error instanceof Error && "status" in error &&
    [400, 422, 404].includes(error.status as number));
}

export const initialCorrectionCycle = (): CaptureCorrectionCycle => ({
  cycle: 1, attempts: 1, phase: "ready",
});

/** This tool reports saved history; it never dispatches or authorizes a mutation. */
export function captureFailureReport(failure: unknown): {
  tool: ModelReadTool; requireObserved: () => void;
} {
  let observed = false;
  const saved = sanitizeValue(failure);
  return {
    tool: {
      name: "report_capture_execution_failure",
      description: "Read the saved PREVIOUS capture execution failure as an error result. " +
        "Performs no operation. Call before submitting a correction; " +
        "receipts remain authoritative.",
      parameters: Type.Object({}, { additionalProperties: false }),
      async execute() {
        observed = true;
        return new ModelReadErrorResult(saved);
      },
    },
    requireObserved() {
      if (!observed) throw new Error(
        "Call report_capture_execution_failure before submitting the correction.");
    },
  };
}
