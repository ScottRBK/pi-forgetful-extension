import type { ForgetfulFieldLimits } from "./contracts.ts";

/** Record types that capture writes. Other published types are not shown to the model. */
const CAPTURE_TYPES = ["memory", "entity", "entity_relationship", "document", "code_artifact"];

/**
 * Prompt text that states Forgetful's own published limits. Forgetful remains the validator;
 * without published limits the model gets no numbers.
 */
export function fieldLimitGuidance(limits: ForgetfulFieldLimits | undefined): string {
  const groups = CAPTURE_TYPES.flatMap((type) => {
    const fields = Object.entries(limits?.[type] ?? {}).flatMap(([field, bound]) => {
      if (bound.max_length) return [`${field} ${bound.max_length}`];
      return bound.max_items ? [`${field} ${bound.max_items} items`] : [];
    });
    return fields.length ? [`${type}: ${fields.join(", ")}`] : [];
  });
  if (!groups.length) return "";
  const content = limits?.memory?.content?.max_length;
  const target = content ? ` Write memory content of at most ${content} characters; aim for ` +
    `${Math.floor(content * 0.8)}-${Math.floor(content * 0.9)}, or shorter when sufficient.` : "";
  return ` Forgetful field limits, in characters unless items: ${groups.join("; ")}. ` +
    `Forgetful rejects the whole write when any field is over its limit.${target}`;
}
