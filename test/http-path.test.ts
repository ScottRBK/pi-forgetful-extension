import assert from "node:assert/strict";
import test from "node:test";

import { ApiForgetfulClient } from "../src/http.ts";

test("normalizes a long endpoint path without super-linear work", () => {
  const path = `${"/".repeat(30_000)}x`;
  const started = performance.now();

  new ApiForgetfulClient({
    baseUrl: `http://localhost${path}`,
    fetchImpl: async () => new Response(JSON.stringify({ projects: [] })),
  });

  const elapsed = performance.now() - started;
  assert.ok(elapsed < 200, `path normalization took ${elapsed.toFixed(1)} ms`);
});
