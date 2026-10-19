// Every flat legacy production module has a reviewed role, including mixed modules.
export const legacy = {
  core: ["contracts", "policies", "repository", "concurrency", "privacy", "memory-context"],
  application: [
    "recall", "capture", "capture-feedback", "capture-links", "capture-merge",
    "knowledge-read", "knowledge-write", "knowledge-tools",
  ],
  pi: [
    "activity", "foreground-tools", "setup", "model", "model-context", "snapshot", "project-init",
  ],
  forgetful: ["http", "http-knowledge"],
  local: ["queue", "source-inspection", "config", "logging"],
};

export const exact = (paths) => `^(?:${paths.map((path) =>
  path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`;
export const legacyPaths = (...roles) => roles.flatMap((role) =>
  legacy[role].map((name) => `src/${name}.ts`));
export const legacyPattern = (...roles) => exact(legacyPaths(...roles));

export const productionRoles = {
  ...Object.fromEntries(Object.keys(legacy).map((role) => [
    `legacy-${role}`, legacyPattern(role),
  ])),
  domain: "^src/domain/",
  ports: "^src/application/ports/",
  application: "^src/application/(?!ports/)",
  pi: "^src/adapters/pi/",
  forgetful: "^src/adapters/forgetful/",
  local: "^src/adapters/local/",
  composition: "^(?:index\\.ts$|src/extension\\.ts$|src/bootstrap/)",
};
