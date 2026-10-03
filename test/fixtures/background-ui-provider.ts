import {
  createAssistantMessageEventStream, getCurrentTools, type AssistantMessage,
} from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { ForgetfulActivity } from "../../src/activity.ts";

/** Script only the external provider boundary; all Pi lifecycle/UI code remains real. */
export default function controlledProvider(pi: ExtensionAPI): void {
  let activity: ForgetfulActivity | undefined;
  pi.registerCommand("ui-test-stale-activity", {
    description: "Exercise activity ownership using real terminal components",
    handler: async (_args, ctx) => {
      const stale = new ForgetfulActivity(ctx);
      activity = new ForgetfulActivity(ctx);
      activity.set("startup", "starting…");
      stale.close();
    },
  });
  pi.on("session_shutdown", () => activity?.close());
  const endpoint = process.env.FORGETFUL_TEST_PROVIDER_URL;
  if (!endpoint || new URL(endpoint).hostname !== "127.0.0.1") {
    throw new Error("The controlled UI provider requires a localhost test server");
  }
  pi.registerProvider("ui-test", {
    api: "ui-test", apiKey: "unused-test-key", baseUrl: endpoint,
    models: ["main", "memory"].map((id) => ({
      id, name: `Controlled ${id}`, reasoning: false, input: ["text"],
      contextWindow: 128_000, maxTokens: 4096,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    })),
    streamSimple(model, context, options) {
      const stream = createAssistantMessageEventStream();
      const message: AssistantMessage = {
        role: "assistant", api: "ui-test", provider: "ui-test", model: model.id,
        content: [], stopReason: "stop", timestamp: Date.now(),
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      };
      void (async () => {
        try {
          const response = await fetch(endpoint, {
            method: "POST", headers: { "content-type": "application/json" },
            body: JSON.stringify({ model: model.id, messages: context.messages,
              tools: getCurrentTools(context.messages) }), signal: options?.signal,
          });
          if (!response.ok) throw new Error(await response.text());
          const reply = await response.json() as Pick<AssistantMessage, "content" | "stopReason">;
          Object.assign(message, reply);
          stream.push({ type: "start", partial: message });
          if (message.stopReason !== "stop" && message.stopReason !== "toolUse") {
            throw new Error("Unexpected controlled provider stop reason");
          }
          stream.push({ type: "done", reason: message.stopReason, message });
          stream.end(message);
        } catch (error) {
          message.stopReason = options?.signal?.aborted ? "aborted" : "error";
          message.errorMessage = String(error);
          stream.push({ type: "error", reason: message.stopReason, error: message });
          stream.end(message);
        }
      })();
      return stream;
    },
  });
}
