import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_FORGETFUL_BASE_URL,
  loadForgetfulConfig,
  updateUserSettings,
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
  assert.equal(config.instance.timeoutMs, 10_000);
  assert.equal(config.recallModelTimeoutMs, 5_000);
  assert.equal(config.recallConcurrency, 2);
  assert.equal(config.contextLimitTokens, 100_000);
  assert.equal(config.verbosity, "warning");
});

test("private context limit persists in user settings and ignores project overrides", async t => {
  // Arrange.
  const root = await tempDirectory();
  t.after(() => rm(root, { recursive: true, force: true }));
  const settings = join(root, "settings.json");
  await mkdir(join(root, ".pi", "forgetful"), { recursive: true });
  await writeFile(join(root, ".pi", "forgetful", "settings.json"),
    JSON.stringify({ context_limit_tokens: 999_999 }));

  // Act.
  await updateUserSettings(settings, { context_limit_tokens: 48_000 });
  const config = await loadForgetfulConfig({
    cwd: root, trusted: true, userSettingsPath: settings,
  });

  // Assert.
  assert.equal(config.contextLimitTokens, 48_000);
  assert.deepEqual(config.warnings, []);
});

test("invalid private context limits warn and use the 100000 token default", async t => {
  // Arrange.
  const root = await tempDirectory();
  t.after(() => rm(root, { recursive: true, force: true }));
  const settings = join(root, "settings.json");
  for (const value of [0, -1, 1.5, "50000", null, true, {}, 1e20]) {
    await writeFile(settings, JSON.stringify({ context_limit_tokens: value }));

    // Act.
    const config = await loadForgetfulConfig({
      cwd: root, trusted: true, userSettingsPath: settings,
    });

    // Assert.
    assert.equal(config.contextLimitTokens, 100_000);
    assert.match(config.warnings.join("\n"), /context_limit_tokens.*100000/);
  }
});

test("verbosity accepts log levels and takes precedence over legacy debug settings", async () => {
  // Arrange: a user settings file, including old installations using the debug toggle.
  const root = await tempDirectory();
  const settings = join(root, "settings.json");
  const cases = [
    [{ debug: true }, "debug"],
    [{ debug: false }, "warning"],
    [{ verbosity: "debug" }, "debug"],
    [{ verbosity: "info", debug: true }, "info"],
    [{ verbosity: "warning", debug: true }, "warning"],
    [{ verbosity: "error", debug: true }, "error"],
    [{ verbosity: "invalid", debug: true }, "warning"],
  ] as const;
  for (const [value, expected] of cases) {
    await writeFile(settings, JSON.stringify(value));

    // Act.
    const config = await loadForgetfulConfig({
      cwd: root, trusted: true, userSettingsPath: settings,
    });

    // Assert: invalid levels fall back safely and explain the fallback.
    assert.equal(config.verbosity, expected);
    if ("verbosity" in value && value.verbosity === "invalid")
      assert.ok(config.warnings.some((warning) => /Invalid verbosity/.test(warning)));
  }
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

test("user recall concurrency accepts 1 to 8 and ignores project overrides", async (t) => {
  // Arrange: concurrency is a user-controlled service load limit, separate from project scope.
  const root = await tempDirectory();
  t.after(() => rm(root, { recursive: true, force: true }));
  const settings = join(root, "settings.json");
  await mkdir(join(root, ".pi", "forgetful"), { recursive: true });
  await writeFile(join(root, ".pi", "forgetful", "settings.json"),
    JSON.stringify({ recall_concurrency: 8 }));

  for (const limit of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await writeFile(settings, JSON.stringify({ recall_concurrency: limit }));

    // Act.
    const config = await loadForgetfulConfig({
      cwd: root, trusted: true, userSettingsPath: settings,
    });

    // Assert.
    assert.equal(config.recallConcurrency, limit);
    assert.deepEqual(config.warnings, []);
  }
});

test("invalid recall concurrency warns and falls back to two", async (t) => {
  // Arrange: zero is not an unlimited mode, and the hard maximum cannot be bypassed.
  const root = await tempDirectory();
  t.after(() => rm(root, { recursive: true, force: true }));
  const settings = join(root, "settings.json");
  for (const value of [0, -1, 9, 1.5, "2", null, true, {}, 1e20]) {
    await writeFile(settings, JSON.stringify({ recall_concurrency: value }));

    // Act.
    const config = await loadForgetfulConfig({
      cwd: root, trusted: true, userSettingsPath: settings,
    });

    // Assert.
    assert.equal(config.recallConcurrency, 2, JSON.stringify(value));
    assert.match(config.warnings.join("\n"), /recall_concurrency.*1.*8.*2/);
  }
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
