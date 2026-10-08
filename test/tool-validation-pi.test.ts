import assert from "node:assert/strict";
import test from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { createToolSession, resultText, type ToolCall } from "./pi-tool-session.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

test("Pi project init reports API validation and accepts a corrected human retry",
  realOptions, async (t) => {
    // Arrange: the real API has a stricter configured limit than the tool's default ceiling.
    const baseUrl = await startForgetful(t, { PROJECT_DESCRIPTION_MAX_LENGTH: "40" });
    const { session } = await createToolSession(t, baseUrl, []);
    const notifications: string[] = [];
    const inputs = ["Validation", "x".repeat(41), "Validation", "Corrected description"];
    await session.bindExtensions({ uiContext: {
      notify: (message: string) => notifications.push(message),
      select: async () => "Create a project",
      input: async () => inputs.shift(),
      confirm: async () => true,
      setWidget: () => undefined,
    } as never });

    // Act: the human sees the service validation before correcting the project details.
    await session.prompt("/forgetful project init");

    // Assert: the actual server limit remains visible, then a corrected command succeeds.
    const rejected = notifications.join("\n");
    assert.match(rejected, /HTTP 400/);
    assert.match(rejected, /description/);
    assert.match(rejected, /40 characters/);
    await session.prompt("/forgetful project init");
    const projects = await new ApiForgetfulClient({ baseUrl }).listProjects("test/validation");
    assert.equal(projects.length, 1);
    const saved = await fetch(`${baseUrl}/projects/${projects[0]!.id}`);
    assert.equal((await saved.json()).description, "Corrected description");
  });

test("Pi recall wait rejects unknown arguments without echoing the submitted values",
  async (t) => {
    // Arrange: typos and invented API fields must not silently disappear.
    const baseUrl = "http://127.0.0.1:1/api/v1";
    const calls: ToolCall[] = [
      { name: "forgetful_recall_wait", arguments: {} },
    ];
    const { session, modelResults } = await createToolSession(t, baseUrl,
      calls.map((call) => ({ ...call, arguments: {
        ...call.arguments, unexpected_argument: "private-submission-canary",
      } })));
    // Act.
    await session.prompt("Check rejected arguments.");
    // Assert: inspect exactly what the model receives, not just the extension callback.
    const results = modelResults.at(-1)!;
    assert.equal(results.length, 1);
    for (const result of results) {
      assert.equal(result.isError, true, result.toolName);
      assert.match(resultText(result), /unexpected_argument|additional propert/i);
      assert.doesNotMatch(resultText(result), /private-submission-canary|Received arguments/);
    }
  });
