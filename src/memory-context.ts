import type { MemoryInput } from "./contracts.ts";
import { sanitizeText } from "./privacy.ts";

const LEGACY_CONTEXT_PROVENANCE =
  /\nSession: [^;\n]+; Branch: [^;\n]+; Evidence entries: [^\n]+$/u;

export function storedMemoryContext(context: string): string {
  return sanitizeText(context);
}

export function replacementMemoryContext(context: string): string {
  return context.replace(LEGACY_CONTEXT_PROVENANCE, "");
}

export function replacementMemoryInput(input: MemoryInput): MemoryInput {
  if (typeof input.context !== "string") return input;
  const context = replacementMemoryContext(input.context);
  return context === input.context ? input : { ...input, context };
}
