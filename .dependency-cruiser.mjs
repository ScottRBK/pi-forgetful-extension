import { builtinModules } from "node:module";
import { exact, legacy, legacyPattern } from "./scripts/architecture/roles.mjs";

const pure = "^(?:node:)?util$";
const builtins = exact(builtinModules.flatMap((name) => [name, `node:${name}`]));
const pi = "(?:^|/)node_modules/@earendil-works/pi-(?:ai|coding-agent|tui)/";
const schema = "(?:^|/)node_modules/typebox/";
const old = legacyPattern(...Object.keys(legacy));
const core = legacyPattern("core");
const application = legacyPattern("core", "application");

function boundary(name, from, allowed, reachable = true) {
  return {
    name,
    severity: "error",
    from: { path: from },
    to: { path: ".*", pathNot: allowed.join("|"), ...(reachable ? { reachable: true } : {}) },
  };
}

export default {
  forbidden: [
    {
      name: "no-unresolved", severity: "error", from: {}, to: { couldNotResolve: true },
    },
    boundary("domain-dependencies", "^src/domain/", ["^src/domain/", pure]),
    boundary("ports-dependencies", "^src/application/ports/",
      ["^src/(?:domain/|application/ports/)", pure]),
    boundary("application-dependencies", "^src/application/",
      ["^src/(?:domain|application)/", pure]),
    boundary("pi-adapter-dependencies", "^src/adapters/pi/", [
      "^src/(?:domain/|application/|adapters/pi/)", exact(["src/privacy.ts"]), pi, pure, schema,
    ]),
    boundary("forgetful-adapter-dependencies", "^src/adapters/forgetful/", [
      "^src/(?:domain/|application/ports/|adapters/forgetful/)", builtins, schema,
      exact(["src/http.ts", "src/http-knowledge.ts", "src/contracts.ts",
        "src/repository.ts", "src/privacy.ts"]),
    ]),
    boundary("local-adapter-dependencies", "^src/adapters/local/", [
      "^src/(?:domain/|application/ports/|adapters/local/)", builtins,
      exact(["src/config.ts", "src/contracts.ts", "src/logging.ts", "src/privacy.ts"]),
    ]),
    {
      name: "composition-through-bootstrap", severity: "error",
      from: { path: "^(?:index\\.ts|src/extension\\.ts)$" },
      to: { path: "^src/(?:domain|application|adapters)/" },
    },
    {
      name: "legacy-does-not-enter-planning", severity: "error", from: { path: old },
      to: { path: "^src/(?:domain|application|adapters|bootstrap)/" },
    },
    {
      name: "planning-adapter-legacy-edges", severity: "error",
      from: { path: "^src/adapters/" }, to: { path: old },
    },
    boundary("legacy-core-direction", core, [core, pure, schema], false),
    boundary("legacy-application-direction", legacyPattern("application"),
      [application, pure, schema], false),
    boundary("legacy-pi-direction", legacyPattern("pi"),
      [application, legacyPattern("pi"), pure, "^(?:node:)?crypto$", pi, schema], false),
    boundary("legacy-forgetful-direction", legacyPattern("forgetful"),
      [core, legacyPattern("forgetful"), builtins, schema], false),
    boundary("legacy-local-direction", legacyPattern("local"),
      [core, legacyPattern("local"), builtins, schema], false),
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "node", "default"],
    },
  },
};
