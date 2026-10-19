import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { test } from "node:test";

const checker = resolve(import.meta.dirname, "../../scripts/check-architecture.mjs");

for (const source of ["src/utils/hidden.ts", "facade.ts", ".hidden.ts"]) {
  test(`the public check rejects an unclassified orphan: ${source}`, async () => {
    const root = await mkdtemp(join(tmpdir(), "pi-architecture-inventory-"));
    try {
      // Arrange: an ordinary, unimported source file outside the reviewed roles.
      await mkdir(join(root, "src/utils"), { recursive: true });
      await writeFile(join(root, source), "export const value = 1;\n");
      // Act: run the same public command used by npm and CI.
      const result = spawnSync(process.execPath, [checker, root], { encoding: "utf8" });
      // Assert: the inventory rule, not a parse/resolution error, identifies the module.
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.ok(result.stderr.includes(`production-role-inventory: ${source}`), result.stderr);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
