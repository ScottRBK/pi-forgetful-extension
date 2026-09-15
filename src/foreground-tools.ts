import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { validateToolArguments } from "@earendil-works/pi-ai";
import type { TSchema } from "typebox";
import { sanitizeText } from "./privacy.ts";

/** Pi normally echoes rejected arguments; validate first so tool errors never repeat that data. */
export function registerForegroundTool<T extends TSchema>(
  pi: ExtensionAPI, definition: ToolDefinition<T>,
): void {
  const parameters = { ...definition.parameters, additionalProperties: false };
  pi.registerTool({
    ...definition, parameters,
    prepareArguments(args) {
      if (!args || typeof args !== "object" || Array.isArray(args))
        throw new Error(`${definition.name} arguments must be an object.`);
      try {
        return validateToolArguments({ ...definition, parameters }, {
          type: "toolCall", id: "validation", name: definition.name,
          arguments: args as Record<string, unknown>,
        });
      } catch (error) {
        const message = error instanceof Error
          ? error.message.split("\n\nReceived arguments:")[0]!
          : `Invalid arguments for ${definition.name}.`;
        throw new Error(sanitizeText(message).slice(0, 2000));
      }
    },
  });
}
