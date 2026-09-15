import { sanitizeText } from "./privacy.ts";

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Only expose the API's public client-error fields, never raw bodies or validator inputs. */
export function apiErrorDetail(body: string, status: number, token?: string): string {
  if (status < 400 || status >= 500) return "";
  let payload: unknown;
  try { payload = JSON.parse(body); } catch { return ""; }
  if (!object(payload)) return "";
  const detail = payload.error ?? payload.detail;
  const clean = (value: string): string => {
    const redacted = token ? value.split(token).join("[redacted]") : value;
    return sanitizeText(redacted).replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 300);
  };
  if (typeof detail === "string") return clean(detail);
  if (!Array.isArray(detail)) return "";
  const issues: string[] = [];
  for (const issue of detail.slice(0, 8)) {
    if (!object(issue) || typeof issue.msg !== "string") continue;
    const path = Array.isArray(issue.loc)
      ? issue.loc.filter((part) => typeof part === "string" || typeof part === "number")
        .map((part) => clean(String(part))).join(".").slice(0, 150)
      : "";
    const prefix = path ? path + ": " : "";
    issues.push(prefix + clean(issue.msg));
  }
  if (detail.length > 8) issues.push("Further validation errors omitted.");
  return issues.join("; ").slice(0, 1800);
}
