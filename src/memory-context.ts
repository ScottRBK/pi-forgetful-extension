import type { MemoryInput } from "./contracts.ts";
import { sanitizeText } from "./privacy.ts";

const LEGACY_CONTEXT_PROVENANCE =
  /\nSession: [^;\n]+; Branch: [^;\n]+; Evidence entries: [^\n]+$/u;

export function storedMemoryContext(context: string): string {
  return sanitizeText(context);
}

export function replacementMemoryContext(context: string): string {
  return storedMemoryContext(context).replace(LEGACY_CONTEXT_PROVENANCE, "").trim();
}

export function replacementMemoryInput(input: MemoryInput): MemoryInput {
  const context = replacementMemoryContext(input.context);
  return context === input.context ? input : { ...input, context };
}
