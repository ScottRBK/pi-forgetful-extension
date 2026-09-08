import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  DefaultResourceLoader,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";

test("Pi loads the packaged entrypoint and registers the extension", async (t) => {
  // Arrange: load the real file exactly as pi -e ./index.ts does, with isolated user resources.
  const root = await mkdtemp(join(tmpdir(), "pi-forgetful-entry-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const agentDir = join(root, "agent");
  await mkdir(agentDir);
  const settings = SettingsManager.create(root, agentDir);
  settings.setProjectTrusted(true);
  const loader = new DefaultResourceLoader({
    cwd: root,
    agentDir,
    settingsManager: settings,
    noSkills: true,
    noPromptTemplates: true,
    noContextFiles: true,
    noThemes: true,
    additionalExtensionPaths: [resolve("index.ts")],
  });

  // Act.
  await loader.reload();
  const result = loader.getExtensions();
  const names = result.extensions.flatMap((extension) => [
    ...extension.tools.keys(),
  ]);

  // Assert: the actual default export must register tools rather than return another factory.
  assert.deepEqual(result.errors, []);
  assert.ok(names.includes("forgetful_recall"));
  assert.ok(names.includes("forgetful_resolve"));
  assert.ok(
    result.extensions.some((extension) => extension.commands.has("forgetful")),
  );
});
