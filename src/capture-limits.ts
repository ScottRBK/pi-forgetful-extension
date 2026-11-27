import type { ForgetfulFieldLimits } from "./contracts.ts";

/** Record types that capture writes. Other published types are not shown to the model. */
const CAPTURE_TYPES = ["memory", "entity", "entity_relationship", "document", "code_artifact"];
/** Keeps the prompt small if a server publishes many fields. Forgetful has fewer per type. */
const MAX_FIELDS_PER_TYPE = 16;

/**
 * Prompt text that states Forgetful's own published limits. Forgetful remains the validator;
 * without published limits the model gets no numbers.
 */
export function fieldLimitGuidance(limits: ForgetfulFieldLimits | undefined): string {
  const groups = CAPTURE_TYPES.flatMap((type) => {
    const fields = Object.entries(limits?.[type] ?? {}).flatMap(([field, bound]) => {
      if (bound.max_length !== undefined) return [`${field} ${bound.max_length}`];
      return bound.max_items !== undefined ? [`${field} ${bound.max_items} items`] : [];
    }).slice(0, MAX_FIELDS_PER_TYPE);
    return fields.length ? [`${type}: ${fields.join(", ")}`] : [];
  });
  if (!groups.length) return "";
  const content = limits?.memory?.content?.max_length;
  const low = Math.floor((content ?? 0) * 0.8);
  const high = Math.floor((content ?? 0) * 0.9);
  // A target is useful only when it is a real range below the limit.
  const target = low < high ? ` Write memory content of at most ${content} characters; ` +
    `aim for ${low}-${high}, or shorter when sufficient.` : "";
  return ` Forgetful field limits, in characters unless items: ${groups.join("; ")}. ` +
    `Forgetful rejects the whole write when any field is over its limit.${target}`;
}
