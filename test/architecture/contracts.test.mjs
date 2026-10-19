import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import config from "../../.dependency-cruiser.mjs";
import contracts from "./contracts.json" with { type: "json" };
import allowed from "./allowed.json" with { type: "json" };

const repository = resolve(import.meta.dirname, "../..");
const cruiser = join(repository, "node_modules/dependency-cruiser/bin/dependency-cruiser.mjs");
const checker = join(repository, "scripts/check-architecture.mjs");

async function write(root, name, source) {
  await mkdir(dirname(join(root, name)), { recursive: true });
  await writeFile(join(root, name), source);
}

function cruise(root) {
  const result = spawnSync(process.execPath, [
    cruiser, "--config", ".dependency-cruiser.json", "--output-type", "err-long", "src",
  ], { cwd: root, encoding: "utf8" });
  assert.equal(result.error, undefined);
  assert.equal(result.stderr, "", result.stderr);
  return { status: result.status, output: result.stdout };
}

function importPath(from, to) {
  const path = relative(dirname(from), to);
  return path.startsWith(".") ? path : `./${path}`;
}

function check(root) {
  const result = spawnSync(process.execPath, [checker, root], { encoding: "utf8" });
  assert.equal(result.error, undefined);
  return { status: result.status, output: result.stdout + result.stderr };
}

const importForms = {
  value: (path) => `import { value } from "${path}"; export const result = value;\n`,
  type: (path) => `import type { Value } from "${path}"; export type Result = Value;\n`,
  reexport: (path) => `export * from "${path}";\n`,
  "type-reexport": (path) => `export type { Value } from "${path}";\n`,
  literal: (path) => `export const load = () => import("${path}");\n`,
};

for (const [name, from, to, reachable] of contracts) {
  test(`${name}: forbidden paths fail only when enforced`, async () => {
    const root = await mkdtemp(join(tmpdir(), "pi-architecture-proof-"));
    try {
      // Arrange: real, resolvable modules, with the bridge outside both endpoint areas.
      await symlink(join(repository, "node_modules"), join(root, "node_modules"), "dir");
      await write(root, "package.json", '{"type":"module"}');
      await write(root, to, "export const value = 1; export type Value = number;\n");
      const bridge = "src/proof-bridge.ts";
      for (const [form, source] of Object.entries(importForms)) {
        if (!reachable && form !== "reexport") continue;
        for (const indirect of reachable ? [false, true] : [false]) {
          const target = indirect ? bridge : to;
          await write(root, bridge, `export * from "${importPath(bridge, to)}";\n`);
          await write(root, from, source(importPath(from, target)));
          const rule = config.forbidden.find((candidate) => candidate.name === name);
          // Act/assert: baseline with the target rule absent must accept the violation.
          await write(root, ".dependency-cruiser.json", JSON.stringify({
            options: config.options, forbidden: [],
          }));
          assert.equal(cruise(root).status, 0);
          // Isolate the target rule; overlapping contracts must not stand in for it.
          await write(root, ".dependency-cruiser.json", JSON.stringify({
            options: config.options, forbidden: rule ? [rule] : [],
          }));
          const rejected = cruise(root);
          assert.notEqual(rejected.status, 0, `${name}: forbidden dependency was accepted`);
          assert.ok(rejected.output.includes(name), rejected.output);
          for (const path of indirect ? [from, bridge, to] : [from, to]) {
            assert.ok(rejected.output.includes(path), rejected.output);
          }
          if (indirect) {
            // The reporter's via list starts after the origin; require the connected tail.
            assert.ok(rejected.output.replace(/\s+/g, " ").includes(`${bridge} → ${to}`),
              rejected.output);
          }
          // Remove the violation: the same contract must accept the clean graph again.
          await write(root, from, "export const value = 1;\n");
          assert.equal(cruise(root).status, 0);
        }
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}

test("reviewed legacy edges pass, while a new caller or destination is rejected", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-exceptions-"));
  try {
    // Arrange: concrete queue use is reviewed only for the legacy capture service.
    await write(root, "src/queue.ts", "export const value = 1;\n");
    await write(root, "src/http.ts", "export const value = 1;\n");
    await write(root, ".dependency-cruiser.json", JSON.stringify(config));
    await write(root, "src/capture.ts", importForms.value("./queue.ts"));
    // Act/assert: the exact exception passes with all production rules enabled.
    const accepted = check(root);
    assert.equal(accepted.status, 0, accepted.output);
    for (const [source, target] of [
      ["src/capture.ts", "src/http.ts"], ["src/knowledge-read.ts", "src/queue.ts"],
      ["src/application/workflow.ts", "src/queue.ts"],
    ]) {
      await write(root, source, `export * from "${importPath(source, target)}";\n`);
      const rejected = check(root);
      assert.notEqual(rejected.status, 0);
      assert.ok(rejected.output.includes(source), rejected.output);
      assert.ok(rejected.output.includes(target), rejected.output);
      await write(root, source, "export const value = 1;\n");
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("a reviewed type-only legacy edge does not allow a runtime import", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-import-kind-"));
  try {
    // Arrange: the reviewed capture -> logger edge is a contract-only dependency.
    await write(root, "src/logging.ts", "export type Value = number; export const value = 1;\n");
    await write(root, "src/capture.ts", importForms.type("./logging.ts"));
    const accepted = check(root);
    assert.equal(accepted.status, 0, accepted.output);
    // Act: change only that import from a type to runtime code.
    await write(root, "src/capture.ts", importForms.value("./logging.ts"));
    const rejected = check(root);
    // Assert: the same endpoints must now fail the legacy application contract.
    assert.equal(rejected.status, 1, rejected.output);
    assert.match(rejected.output, /legacy-application-direction/);
    assert.match(rejected.output, /src\/capture\.ts -> src\/logging\.ts/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("unresolved modules fail by name rather than silently dropping an edge", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-resolution-"));
  try {
    // Arrange: a missing target in an otherwise permitted domain import.
    await write(root, "src/domain/record.ts", 'export * from "./missing.ts";\n');
    const rule = config.forbidden.find((item) => item.name === "no-unresolved");
    await write(root, ".dependency-cruiser.json", JSON.stringify({
      options: config.options, forbidden: [],
    }));
    assert.equal(cruise(root).status, 0);
    // Act/assert: resolution itself must have a named, failing contract.
    await write(root, ".dependency-cruiser.json", JSON.stringify({
      options: config.options, forbidden: rule ? [rule] : [],
    }));
    const rejected = cruise(root);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.output, /no-unresolved/);
    assert.match(rejected.output, /src\/domain\/record\.ts/);
    assert.match(rejected.output, /missing\.ts/);
    await write(root, "src/domain/missing.ts", "export const value = 1;\n");
    assert.equal(cruise(root).status, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("ports, pure node utilities, reviewed adapters and composition remain permitted", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-allowed-"));
  try {
    // Arrange: a complete permitted path through the same roles as production.
    await symlink(join(repository, "node_modules"), join(root, "node_modules"), "dir");
    for (const [name, lines] of Object.entries(allowed)) {
      await write(root, name, lines.join("\n") + "\n");
    }
    await write(root, ".dependency-cruiser.json", JSON.stringify(config));
    // Act/assert: all contracts apply, including both composition entry points.
    const result = check(root);
    assert.equal(result.status, 0, result.output);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("computed imports are invisible; literal dynamic imports enforce the boundary", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-dynamic-"));
  try {
    // Arrange: identical destination, with only the expression shape changing.
    await write(root, "src/adapters/pi/view.ts", "export const value = 1;\n");
    await write(root, ".dependency-cruiser.json", JSON.stringify(config));
    const source = "src/domain/record.ts";
    const destination = "../adapters/pi/view.ts";
    // Act/assert: document the real static-analysis limit; this is not permission to use it.
    await write(root, source,
      `const path = "${destination}"; export const load = () => import(path);\n`);
    const computed = cruise(root);
    assert.equal(computed.status, 0, computed.output);
    assert.match(computed.output, /0 dependencies cruised/);
    await write(root, source, importForms.literal(destination));
    const literal = cruise(root);
    assert.notEqual(literal.status, 0);
    assert.match(literal.output, /domain-dependencies/);
    assert.match(literal.output, /src\/adapters\/pi\/view\.ts/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("new core cannot borrow a legacy helper, including type-only re-export chains", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-architecture-core-legacy-"));
  try {
    // Arrange: an otherwise pure legacy helper, shared by the reviewed adapters.
    await write(root, "src/privacy.ts", "export type Value = string;\n");
    await write(root, "src/proof-bridge.ts", 'export type { Value } from "./privacy.ts";\n');
    for (const [name, from] of [
      ["domain-dependencies", "src/domain/record.ts"],
      ["ports-dependencies", "src/application/ports/reader.ts"],
      ["application-dependencies", "src/application/workflow.ts"],
    ]) {
      for (const target of ["src/privacy.ts", "src/proof-bridge.ts"]) {
        await write(root, from, importForms["type-reexport"](importPath(from, target)));
        await write(root, ".dependency-cruiser.json", JSON.stringify({
          options: config.options, forbidden: [],
        }));
        assert.equal(cruise(root).status, 0);
        // Act/assert: isolate the intended core rule even though other rules overlap.
        await write(root, ".dependency-cruiser.json", JSON.stringify({
          options: config.options,
          forbidden: config.forbidden.filter((rule) => rule.name === name),
        }));
        const rejected = cruise(root);
        assert.notEqual(rejected.status, 0);
        assert.ok(rejected.output.includes(`${name}: ${from} → src/privacy.ts`), rejected.output);
        if (target.includes("bridge")) {
          assert.ok(rejected.output.replace(/\s+/g, " ")
            .includes("src/proof-bridge.ts → src/privacy.ts"), rejected.output);
        }
        await write(root, from, "export type Value = string;\n");
        assert.equal(cruise(root).status, 0);
      }
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
