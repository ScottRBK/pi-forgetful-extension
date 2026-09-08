const REDACTED = "[redacted]";

const credentialPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\bBearer\s+[a-z0-9._~+/-]+=*/gi,
  /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g,
  /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}\b/g,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:]+:[^\s/@]+@[^\s]+/gi,
  new RegExp(
    String.raw`["']?\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|` +
      String.raw`client[_-]?secret|password|passwd)\b["']?\s*[:=]\s*` +
      String.raw`(?:"[^"\n]+"|'[^'\n]+'|[^\s,;]+)`,
    "gi",
  ),
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  /\b\d{3}-\d{2}-\d{4}\b/g,
  new RegExp(
    String.raw`^.*\b(?:payroll|salary|payslip|bank\s*account|social\s*security|` +
      String.raw`national\s*insurance|credit\s*card|iban)\b\s*[:=][^\n]*`,
    "gim",
  ),
];

/** Known-pattern filtering only; this cannot recognize every secret or private fact. */
export function sanitizeText(text: string): string {
  let result = text;
  for (const pattern of credentialPatterns)
    result = result.replace(pattern, REDACTED);
  return result;
}

export function hasSensitiveData(text: string): boolean {
  return sanitizeText(text) !== text;
}

export function isMemoryOperation(toolName: string): boolean {
  return (
    /forgetful/i.test(toolName) ||
    /^(?:query|get|create|update|link|unlink|mark)_memor(?:y|ies)(?:_|$)/.test(
      toolName,
    )
  );
}

/** Filter values before JSON encoding so redaction never breaks the surrounding JSON. */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    const sensitiveKey =
      /password|passwd|secret|token|api.?key|salary|payroll|bank.?account|ssn/i;
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? REDACTED : sanitizeValue(item),
      ]),
    );
  }
  return value;
}
