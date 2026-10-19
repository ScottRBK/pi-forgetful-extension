import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { productionRoles } from "./architecture/roles.mjs";
import exceptions from "../.dependency-cruiser-known-violations.json" with { type: "json" };

const repository = resolve(import.meta.dirname, "..");
const root = resolve(process.argv[2] ?? repository);
const sourceExtension = /\.[cm]?[jt]sx?$/;
const rootFiles = (await readdir(root)).filter((name) =>
  sourceExtension.test(name) && name !== ".dependency-cruiser.mjs");
const sourceFiles = (await readdir(resolve(root, "src"), { recursive: true }))
  .filter((name) => sourceExtension.test(name)).map((name) => `src/${name}`);
const result = spawnSync(process.execPath, [
  resolve(repository, "node_modules/dependency-cruiser/bin/dependency-cruiser.mjs"),
  "--config", resolve(repository, ".dependency-cruiser.mjs"),
  "--output-type", "json", ...rootFiles, "src",
], { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
if (result.error || result.status !== 0) {
  console.error(result.error ?? result.stderr);
  process.exit(1);
}
// The upstream JSON reporter always exits zero; its reported errors are authoritative.
const graph = JSON.parse(result.stdout);
// Match exact edges AND import kinds. Upstream baselines only match endpoints for direct edges.
// In particular, an exception for a logger type must not also permit its runtime implementation.
const reviewed = (item) => exceptions.some((exception) =>
  item.type === "dependency" && exception.type === "dependency" &&
  item.rule.name === exception.rule.name && item.from === exception.from &&
  item.to === exception.to &&
  JSON.stringify([...item.dependencyTypes].sort()) ===
    JSON.stringify([...exception.dependencyTypes].sort()));
const errors = graph.summary.violations.filter((item) => item.rule.severity === "error");
const violations = errors.filter((item) => !reviewed(item));
const reviewedCount = errors.length - violations.length;
const modules = new Set(graph.modules.map((item) => item.source));
const inventory = new Set([...rootFiles, ...sourceFiles, ...graph.modules
  .filter((item) => !item.coreModule && !item.source.includes("node_modules/"))
  .map((item) => item.source)]);
for (const source of inventory) {
  const roles = Object.values(productionRoles).filter((pattern) =>
    new RegExp(pattern).test(source));
  if (roles.length !== 1 || !modules.has(source)) {
    violations.push({ rule: { name: "production-role-inventory" }, from: source });
  }
}
for (const violation of violations) {
  const path = violation.via
    ? [violation.from, ...violation.via.map((item) => item.name)]
    : [violation.from, violation.to];
  console.error(`${violation.rule.name}: ${path.filter(Boolean).join(" -> ")}`);
}
console.log(`Architecture: ${violations.length} errors; ${inventory.size} production modules; ` +
  `${reviewedCount} reviewed legacy edges.`);
process.exitCode = violations.length ? 1 : 0;
