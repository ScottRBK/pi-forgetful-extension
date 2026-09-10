import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_FORGETFUL_BASE_URL,
  loadForgetfulConfig,
  writeProjectScope,
  type ForgetfulConfig,
} from "../src/config.ts";

async function tempDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), "pi-forgetful-config-"));
}

test("fresh projects use global scope and the default service endpoint", async () => {
  const root = await tempDirectory();
  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd: join(root, "repo"),
    trusted: true,
  });

  assert.equal(config.scope, "global");
  assert.equal(config.scopeSource, "default");
  assert.equal(config.instance.baseUrl, DEFAULT_FORGETFUL_BASE_URL);
  assert.equal(config.captureMode, "auto");
  assert.equal(config.enabled, true);
  assert.equal(config.model, undefined);
  assert.equal(config.instance.timeoutMs, 5_000);
  assert.equal(config.recallModelTimeoutMs, 5_000);
});

test("trusted project scope stays separate from user settings", async () => {
  const root = await tempDirectory();
  const agentDir = join(root, "agent");
  const cwd = join(root, "repo");
  await mkdir(join(cwd, ".pi", "forgetful"), { recursive: true });
  await mkdir(join(agentDir, "forgetful"), { recursive: true });
  await writeFile(
    join(agentDir, "forgetful", "settings.json"),
    JSON.stringify({
      base_url: "http://memory.test/api/v1",
      token_env: "MEMORY_TOKEN",
      model: "openai/gpt-mini",
    }),
  );
  await writeFile(
    join(cwd, ".pi", "forgetful", "settings.json"),
    JSON.stringify({ scope: "project" }),
  );

  const config = await loadForgetfulConfig({
    agentDir,
    cwd,
    trusted: true,
    env: { MEMORY_TOKEN: "secret" },
  });

  assert.equal(config.scope, "project");
  assert.equal(config.scopeSource, "project");
  assert.deepEqual(config.model, { provider: "openai", id: "gpt-mini" });
  assert.equal(config.instance.baseUrl, "http://memory.test/api/v1");
  assert.equal(config.instance.token, "secret");
});

test("untrusted project settings and overlays cannot change configuration", async () => {
  const root = await tempDirectory();
  const cwd = join(root, "repo");
  await mkdir(join(cwd, ".pi", "forgetful"), { recursive: true });
  await writeFile(
    join(cwd, ".pi", "forgetful", "settings.json"),
    JSON.stringify({ scope: "project" }),
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd,
    trusted: false,
  });

  assert.equal(config.scope, "global");
  assert.equal(config.scopeSource, "default");
  assert.equal(
    config.warnings.some((warning) => warning.includes("trusted")),
    true,
  );
});

test("malformed project scope falls back to global with visible guidance", async () => {
  const root = await tempDirectory();
  const cwd = join(root, "repo");
  await mkdir(join(cwd, ".pi", "forgetful"), { recursive: true });
  await writeFile(
    join(cwd, ".pi", "forgetful", "settings.json"),
    '{"scope":"workspace"}',
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd,
    trusted: true,
  });

  assert.equal(config.scope, "global");
  assert.equal(config.scopeSource, "invalid");
  assert.equal(
    config.warnings.some((warning) => warning.includes("scope")),
    true,
  );
});

test("a configured but missing token environment disables memory traffic", async () => {
  const root = await tempDirectory();
  await mkdir(join(root, "agent", "forgetful"), { recursive: true });
  await writeFile(
    join(root, "agent", "forgetful", "settings.json"),
    JSON.stringify({ token_env: "MISSING_FORGETFUL_TOKEN" }),
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd: join(root, "repo"),
    trusted: true,
    env: {},
  });

  assert.equal(config.enabled, false);
  assert.equal(
    config.warnings.some((warning) =>
      warning.includes("MISSING_FORGETFUL_TOKEN"),
    ),
    true,
  );
  assert.equal(
    config.warnings.filter((warning) =>
      warning.includes("MISSING_FORGETFUL_TOKEN"),
    ).length,
    1,
  );
});

test("an invalid capture mode fails closed until it is corrected", async () => {
  const root = await tempDirectory();
  await mkdir(join(root, "agent", "forgetful"), { recursive: true });
  await writeFile(
    join(root, "agent", "forgetful", "settings.json"),
    JSON.stringify({ capture_mode: "sometimes" }),
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd: join(root, "repo"),
    trusted: true,
  });

  assert.equal(config.captureMode, "off");
  assert.equal(
    config.warnings.some((warning) => warning.includes("capture mode")),
    true,
  );
});

test("writing a scope creates only the project-local settings file", async () => {
  const root = await tempDirectory();
  const agentDir = join(root, "agent");
  const cwd = join(root, "repo");

  await writeProjectScope(cwd, "project");

  const stored = JSON.parse(
    await readFile(join(cwd, ".pi", "forgetful", "settings.json"), "utf8"),
  ) as ForgetfulConfig;
  assert.deepEqual(stored, { scope: "project" });
  await assert.rejects(
    readFile(join(agentDir, "forgetful", "settings.json"), "utf8"),
  );
});

test("recall model timeout is independently configurable from the overall timeout", async () => {
  const root = await tempDirectory();
  await mkdir(join(root, "agent", "forgetful"), { recursive: true });
  await writeFile(
    join(root, "agent", "forgetful", "settings.json"),
    JSON.stringify({ timeout_ms: 2_500, recall_model_timeout_ms: 3_500 }),
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd: join(root, "repo"),
    trusted: true,
  });

  assert.equal(config.instance.timeoutMs, 2_500);
  assert.equal(config.recallModelTimeoutMs, 3_500);
});

test("invalid recall model timeout retains its 5,000 ms default", async () => {
  const root = await tempDirectory();
  await mkdir(join(root, "agent", "forgetful"), { recursive: true });
  await writeFile(
    join(root, "agent", "forgetful", "settings.json"),
    JSON.stringify({ recall_model_timeout_ms: 0 }),
  );

  const config = await loadForgetfulConfig({
    agentDir: join(root, "agent"),
    cwd: join(root, "repo"),
    trusted: true,
  });

  assert.equal(config.recallModelTimeoutMs, 5_000);
});
