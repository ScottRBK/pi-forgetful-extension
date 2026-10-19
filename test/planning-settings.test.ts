import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadForgetfulConfig } from "../src/config.ts";
import { LocalPlanningPreferences } from "../src/adapters/local/planning-settings.ts";

test("planning preference defaults off and persists independently of other settings", async (t) => {
  // Arrange.
  const directory = await mkdtemp(join(tmpdir(), "planning-settings-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "settings.json");
  const preferences = new LocalPlanningPreferences(path);
  const config = () => loadForgetfulConfig({ cwd: directory, trusted: false,
    userSettingsPath: path, env: {} });
  assert.equal(await preferences.read(), false);
  assert.equal((await config()).planningPanel, false);
  await writeFile(path, JSON.stringify({ capture_mode: "off", planning_panel: "true" }));
  assert.equal(await preferences.read(), false);
  assert.equal((await config()).planningPanel, false);

  // Act.
  await preferences.write(true);

  // Assert.
  assert.equal((await config()).planningPanel, true);
  assert.equal(await new LocalPlanningPreferences(path).read(), true);
  assert.deepEqual(JSON.parse(await readFile(path, "utf8")),
    { capture_mode: "off", planning_panel: true });
});
