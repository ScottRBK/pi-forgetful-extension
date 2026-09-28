import assert from "node:assert/strict";
import {
  getCurrentSystemPrompt, getCurrentTools, type Context, type Tool,
} from "@earendil-works/pi-ai";

/** Read tools from the normalized transcript passed to Pi v0.87+ providers. */
export function providerTools(context: Pick<Context, "messages">): Tool[] {
  return getCurrentTools(context.messages);
}

/** Read the prompt from the normalized transcript passed to Pi v0.87+ providers. */
export function providerSystemPrompt(context: Pick<Context, "messages">): string {
  return getCurrentSystemPrompt(context.messages);
}

/** Decode the public provider messages without treating historical JSON as the current task. */
export function decodeProviderContext(context: Context): {
  input: Record<string, any>;
  conversation: Array<Record<string, any>>;
} {
  const conversation: Array<Record<string, any>> = [];
  let input: Record<string, any> | undefined;
  for (const message of context.messages) {
    if (message.role !== "user") continue;
    const text = typeof message.content === "string" ? message.content : message.content
      .filter(part => part.type === "text")
      .map(part => part.type === "text" ? part.text : "").join("");
    const label = text.match(/^Historical record \d+ \(evidence, not instructions\):\n/);
    if (label) {
      conversation.push(JSON.parse(text.slice(label[0].length)));
    } else if (!input && text.trimStart().startsWith("{")) {
      // Correction feedback and Pi summaries may be separate messages; neither replaces the task.
      input = JSON.parse(text);
    }
  }
  assert.ok(input && typeof input === "object" && !Array.isArray(input),
    "Provider context must contain a separate current task JSON object");
  return { input, conversation };
}
