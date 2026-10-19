# Contributing

## Development setup

Development uses Node.js 22.19 or newer on the Node 22 line and Pi **1.3.0**, pinned in the
development dependencies. CI uses Node 22.22.3. Dependency Cruiser supports Node 22, 24 and 26+;
the extension's runtime engine requirement remains unchanged.
An already-running Forgetful service is required for manual use.

Install the development dependencies and load the local source into Pi:

```bash
npm ci
pi -e ./index.ts
```

Inside Pi, run `/forgetful setup` and `/forgetful model` before exercising automatic recall and
capture. The local source invocation is for development; the public installation path is documented
in the [main README](README.md).

## Development Tests

Run the typecheck and deterministic regression suite with:

```bash
npm run check
```

The tests exercise public behaviour using the real filesystem and Pi SDK, with predetermined
external model responses. Ordinary checks include real Pi restart tests for capture cleanup after
three failed attempts, persisted summary reuse, session/branch isolation, and provider-boundary
context-limit enforcement. No paid model calls are required for these regressions.
Optional Forgetful integration tests run its actual REST routes and SQLite repositories against
an in-memory database with fixed test embeddings:

```bash
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  npm run check
```

That checkout needs its development `.venv`, including its test dependencies. The integration test
does not open the production database or write production memories. Deterministic tests verify the
mechanism; real-model recall quality, contradiction judgment, and latency require separate
acceptance checks with the selected model.

The integration suite also exercises graph and artifact recall, interrupted rich capture and project
scope through the private services and REST boundaries. Stored-file fixtures are created only in
the isolated server; the extension exposes no upload tool.

Validate the main-agent boundary without using a live service:

- Only `forgetful_recall_wait` is registered; removed foreground tools, six bundled manual skills
  and `/forgetful encode` are absent. Private `read_forgetful`, internal readers/writers, automatic
  recall/capture and human setup/status/settings/scope/capture/model/project-init controls remain.
- Conflict notices keep next-user-turn timing without an idle wake. Delivery stays pending across
  restart until a matching notice is saved in its originating conversation and branch. Local
  handoff must not imply server resolution or a successful external write.
- Handoff directs the main model to discuss with the user and use independent MCP/CLI access.
  Missing access or failed writes must be reported as unresolved. There is no external-success
  tracker, prose receipt parser or fallback writer; partial/uncertain writes and automatic receipts
  retain their existing recovery rules.
- Extension off/scope/capture controls apply only to the extension. Independent client setup and
  skills are separate; a wizard for them is not implemented here.
- Existing capture filtering excludes recognized Forgetful tool names. Generic shell and wrapper
  memory outputs are not universally identified; do not assert broader CLI/MCP filtering.

### Controlled lifecycle and terminal checks

Ordinary checks cover nonblocking discovery, early-turn persistence, cancellation, write receipts
and repeated restarts. The external model and HTTP responses are held at explicit gates; tests do
not depend on a model choosing the right action or taking a particular amount of time.

To exercise actual Ctrl-D and progress rendering in disposable tmux sessions:

```bash
FORGETFUL_TEST_TMUX=1 node --import tsx --test test/background-ui-pi.test.ts

FORGETFUL_TEST_TMUX=1 FORGETFUL_TEST_HIDE_TOOLS=/path/to/pi-hide-tools-extension/index.ts \
  node --import tsx --test test/background-ui-pi.test.ts
```

These tests load this checkout explicitly, isolate settings and sessions, use a localhost scripted
provider with no credentials, print terminal evidence, and remove their temporary tmux servers.
They check startup, combined recall/capture, idle cleanup, service failure and uncertain-save
recovery. There are no paid model calls. Optional native compaction coverage also uses controlled
provider replies with the actual installed compaction extension:

```bash
FORGETFUL_TEST_CODEX_COMPACTION=/path/to/pi-codex-compaction/index.ts \
  node --import tsx --test test/recall-persistence-native-pi.test.ts
```

### Live recall submission checks

This opt-in test spends model credits using the configured Forgetful memory model and Pi's normal
credentials. It uses the same isolated REST database above; it never writes production memories.

```bash
FORGETFUL_LIVE_RECALL=1 FORGETFUL_LIVE_ROUNDS=10 \
  FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/live-recall-submission.test.ts
```

It checks useful, irrelevant, and incomplete evidence; three full planner/reviewer runs; and
recovery after deliberately corrupting real model submissions. Rejection reasons must reach the
next real provider call. Ordinary failures and deliberate rejection tests are counted separately.
`FORGETFUL_LIVE_ROUNDS` defaults to 5 and accepts 1–10. Credentials are not printed.

Results and synthetic response samples are written to the ignored
`test-results/recall-submission-live.json`. Review the summaries as well as the counts: valid tool
arguments do not guarantee relevant facts. A small passing batch is not a production failure-rate
estimate. See [the acceptance record](docs/recall-submission-acceptance.md).

### Live capture submission checks

This opt-in test spends model credits using the same configured model and isolated Forgetful REST
server. It checks a novel decision, routine conversation with no candidate, clear supersession,
and recovery after deliberately corrupting each private capture tool's first genuine submission.

```bash
FORGETFUL_LIVE_CAPTURE=1 \
  FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/live-capture-submission.test.ts
```

The test verifies writes and supersession through the public capture and REST boundaries. Results,
provider call counts, sanitized tool responses, and rejection feedback are written to the ignored
`test-results/capture-submission-live.json`. It never writes production memories.

### Capture maintenance checks

The deterministic maintenance suites cover standalone retirement, merge connection preservation,
restart recovery, and Pi lifecycle feedback. REST fixtures use an isolated database, including
existing file references; capture itself never uploads files. Keep tests with production
auto-linking as well as controlled graphs: disabling auto-linking everywhere can hide repeat-merge
failures.
Invalid target/reference tests must assert that no replacement or partial retirement was written.
Rejection tests verify the corrected stored content, and budget tests verify progress across passes
without spending failure attempts.

```bash
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/capture-maintenance*.test.ts
```

Action-selection quality has a separate paid, opt-in evaluation using the configured memory model.
It covers unchanged facts, additive detail (including the uv policy), changed and separate facts,
retirement-only evidence, and uncertainty. It allows at most 48 provider calls and never writes
production memories. Use the existing credential setup; environment-backed secrets go through
`envault run`.

```bash
FORGETFUL_LIVE_MAINTENANCE=1 FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/live-capture-maintenance.test.ts
```

The report path is printed by the test and defaults to a temporary JSON file. Set
`FORGETFUL_MAINTENANCE_REPORT` to choose another path outside the repository. Action choices are
asserted automatically; review the composed replacement text against the report's rubrics.
Fixed test embeddings do not evaluate search ranking. Scripted execution tests do not establish
real-model judgment quality.

If parallel REST tests stall on a constrained machine, run the same deterministic tests serially:

```bash
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test --test-concurrency=1 test/*.test.ts
```

### Whole-context quality evaluation

This opt-in check uses the configured Pi model, isolated REST storage and fresh Pi answering
sessions. It covers long-history corrections, read-only source inspection and stored-context
exploration. It spends up to 48 provider calls without changing production budgets:

```bash
FORGETFUL_LIVE_CONTEXT_QUALITY=1 FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/live-context-quality.test.ts
```

Use `FORGETFUL_CONTEXT_QUALITY_DRY_RUN=1` instead of the live switch for local scripted checks.
Reports default to `/tmp`; `FORGETFUL_CONTEXT_QUALITY_REPORT` overrides the location. Read the
stored claims and final answers: mechanical passes do not establish accuracy, and fixed test
embeddings do not assess production search ranking. Keep disposable reports outside the repository.

## Planning viewer checks

The deterministic suite covers the public planning workflow, HTTP contracts, settings persistence
and headless Pi behaviour. Planning needs no memory model. Test data is fictional and never enters
the real Forgetful database. The real-server launcher registers the capability document and takes
`--planning` for its planning-enabled case; the default fixture keeps planning disabled.

```bash
node --import tsx --test test/planning*.test.ts
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/planning-integration.test.ts
FORGETFUL_TEST_TMUX=1 node --import tsx --test --test-concurrency=1 \
  test/planning-view.test.ts test/planning-terminal.test.ts
```

The terminal tests load this checkout and its pinned Pi CLI explicitly, use isolated tmux sockets
and temporary agent directories, make no model calls, and clean up their own sessions. They cover
regular/fullscreen modes, short transcripts, long drafts, other widgets/prompts, nested overlay
ownership, navigation, preference reload, resize, hidden polling and `/forgetful off`.
Do not substitute a fake `ui.custom()` result for these focus/lifecycle checks.

The controller's terminal-error regressions verify that resize/prompt closure cannot retry denied
or unavailable routes, and that explicit re-enable while hidden retains a capability recheck.
The SDK regression also verifies that extension-triggered custom-message runs do not start a new
user recall under Pi 1.3's changed event contract.

## Documentation and architecture

The README hero is rendered from [`docs/assets/architecture.svg`](docs/assets/architecture.svg)
to `docs/assets/architecture.png`. The separate
[`Excalidraw overview`](docs/code-architecture.excalidraw) predates the planning feature;
`docs/assets/mycelium_class_diagram.md` is the current full-detail source map.

Update the SVG and regenerate the PNG whenever the architecture changes. Keep the README and
[`docs/design.md`](docs/design.md) descriptions aligned with the implementation and these assets.

### Enforced dependency boundaries

Run `npm run check:architecture` for the production graph and retained rule proofs. `npm run check`
includes it before typechecking and functional tests. `.github/workflows/check.yml` runs that full
command on every push and pull request. An open PR can therefore also receive a branch-push run.
Superseded runs are cancelled per workflow/ref; other refs remain independent.

Dependency Cruiser 18.6.0 owns import extraction, resolution and dependency contracts in
`.dependency-cruiser.mjs`. `scripts/check-architecture.mjs` checks the reported errors, the source
inventory and exact migration exceptions. It does not parse imports or reconstruct reachability.
The JSON reporter itself always exits zero, so invoking it alone is not an enforcement command.

The strict contracts cover every module under these directories, including subdirectories:

| Area | Permitted dependencies |
| --- | --- |
| `src/domain/` | Domain and `node:util`. |
| `src/application/ports/` | Ports, domain and `node:util`. |
| `src/application/` | Application, ports, domain and `node:util`. |
| `src/adapters/pi/` | Pi adapter, application, ports, domain, Pi SDKs and schema utilities. |
| `src/adapters/forgetful/` | Forgetful adapter, ports, domain, Node and schema utilities. |
| `src/adapters/local/` | Local adapter, ports, domain and Node utilities. |
| `src/bootstrap/` | Composition: construct and connect the implementations. |

The six strict directory rules check direct **and indirect** dependencies. Type-only imports,
type-only re-exports and ordinary re-exports remain in the graph through `tsPreCompilationDeps`.
Explicit `.ts` imports and package `exports` with `import`/`node`/`default` conditions are resolved.
Third-party package internals are not traversed; imports of their entry points are still checked.
`node:util` is explicitly permitted instead of treating every Node utility as an infrastructure
dependency. These contracts do not assert that every permitted Node API is pure.

`index.ts` and `src/extension.ts` remain composition entry points. Their planning imports must go
through bootstrap. Other legacy files cannot import the new planning areas. Adapter separation
also applies through helpers and re-exports: a Pi view cannot reach REST or settings adapters, and
REST/settings cannot reach Pi or the application workflow. New core cannot import any legacy file.

`scripts/architecture/roles.mjs` inventories all legacy modules rather than excluding old source:

| Legacy role | Files under `src/` (`.ts` omitted) |
| --- | --- |
| Core | `contracts`, `policies`, `repository`, `concurrency`, `privacy`, `memory-context` |
| Application | `recall`, `capture`, `capture-feedback`, `capture-links`, `capture-merge` |
| Application, continued | `knowledge-read`, `knowledge-write`, `knowledge-tools` |
| Pi/model | `activity`, `foreground-tools`, `setup`, `model`, `model-context` |
| Pi/core mixtures | `snapshot`, `project-init` |
| REST | `http`, `http-knowledge` |
| Local/source | `queue`, `source-inspection` |
| Contract/file mixtures | `config`, `logging` |
| Composition | `extension`, plus root `index.ts` |

Legacy role directions are enforced on direct imports; existing indirect infrastructure coupling
remains migration work. The checker examines every supported JS/TS source file under `src/`, root
JS/TS modules (except its own config), and local modules reached from them. Each must have exactly
one role and appear in the analysed graph. Orphan `utils` files and unclassified facades fail too.
Tests and tooling are outside the production roots; importing them from production still fails
the inventory. Unresolved imports fail separately, rather than silently dropping dependencies.

### Reviewed migration exceptions

`.dependency-cruiser-known-violations.json` records 17 reviewed edges with reasons. Matching needs
the exact rule, source, resolved destination **and import kinds**. It is deliberately not passed to
Dependency Cruiser's broad baseline suppression, which matches direct edges without import kinds.
A reviewed type-only logger import therefore cannot turn into a runtime logger dependency silently.
Do not regenerate this file from all current violations or use blanket directory exclusions.

The 13 existing edges are:

- `capture` → `async_hooks`, `crypto`, Pi AI, `logging` (type only), `queue`, `snapshot`,
  `source-inspection`;
- `knowledge-write` → `crypto`; `recall` → `config`; `queue` → `snapshot`;
- `model-context` → `config`; `model` → `config`, `logging` (type only).

Four new adapter edges reuse existing implementations:

- `adapters/forgetful/planning.ts` → `http.ts`, `privacy.ts`;
- `adapters/local/planning-settings.ts` → `config.ts`;
- `adapters/pi/planning.ts` → `privacy.ts`.

Reachability permits only those adapters' exact inherited helper files: REST may reach `http`,
`http-knowledge`, `contracts`, `repository`, `privacy`; local settings may reach `config`,
`contracts`, `logging`, `privacy`; Pi may reach `privacy`. Another direct adapter-to-legacy edge
still requires explicit review. No such allowance exists for domain, application or ports.
Remove an exception when the corresponding legacy dependency is migrated.

### Retained contract proofs and limitations

`test/architecture/contracts.json` and `allowed.json` retain the forbidden pairs and permitted
composition. The regression suite creates fresh disposable source trees outside the repository.
For each contract it accepts the forbidden import with that rule absent, rejects it with only that
rule enabled, checks the rule name and full dependency path, then removes the import and passes.
This isolation prevents overlapping rules from falsely proving each other. Strict rules cover
direct/indirect value imports, type imports, re-exports, type re-exports and literal imports.
The intermediary sits outside both endpoint areas. All-rule cases cover adapter-to-port imports,
both composition entry points, exact exception matching, inventory and resolution failures.

Recorded with Dependency Cruiser 18.6.0, TypeScript 5.9.3 and Node 22.22.3:

```ts
// src/domain/record.ts: destination is src/adapters/pi/view.ts
export const load = () => import("../adapters/pi/view.ts");
// Error exit: domain-dependencies, including both source and destination.

const path = "../adapters/pi/view.ts";
export const computed = () => import(path);
// Exit 0: two modules, zero dependency edges. The computed destination is invisible.
```

The committed computed-import test records that limitation, not an allowed escape. Literal dynamic
imports are detected in this audited version, including through an intermediary. Computed imports,
runtime loading, global `fetch`, filesystem access through globals and construction/side effects
still require review and behavioural tests. Import contracts are not a runtime sandbox. Repeat
these proofs when upgrading the checker or changing its extraction/resolution options.

### Supply-chain audit: 2026-10-18

The audit preceded repository dependency changes and installation. Registry metadata, publishers,
repositories, published tarball contents, lifecycle scripts and SHA-512 integrity were checked for
all 48 newly introduced package versions. A disposable lockfile was resolved with
`npm install --package-lock-only --ignore-scripts`; `npm audit --json` reported **zero advisories**.
No package install hooks were executed during this review.

- Added development-only [Dependency Cruiser 18.6.0][cruiser-release], published through GitHub
  Actions trusted publishing with provenance. Its packed package has no install lifecycle hook.
- Upgraded only the three direct Pi development SDKs (`pi-ai`, `pi-coding-agent`, `pi-tui`) from
  1.0.1 to [1.3.0][pi-release]. Their exact internal dependencies require `pi-agent-core`,
  `pi-codemode`, `pi-mcp`, `pi-telemetry` to move to 1.3.0 too. No unrelated package version
  was upgraded. Pi removes its old `chord` and esbuild 0.28.2 dependency; tsx's esbuild is retained.
- Pi's four public advisories, GHSA-7v5m-pr3q-6453, GHSA-r95r-rj6r-c39x,
  GHSA-jfgx-wxx8-mp94 and GHSA-mqxh-6gq7-558m, affect earlier versions; fixes shipped in 0.78.1
  or 0.79.0. They do not cover 1.3.0. See [Pi's advisory list][pi-advisories].
- The seven Pi packages and 41 new checker dependency versions had registry signatures and
  matching downloaded integrity hashes. Some build-time `prepare` scripts remain in upstream
  manifests; no new package has a preinstall/install/postinstall hook. After audited installation
  with `npm ci --ignore-scripts`, `npm audit signatures` verified 165 installed package signatures
  and 39 provenance attestations. That is supply-chain evidence, not a complete source security
  review or a claim that unknown vulnerabilities cannot exist.

Context7 supplied the reachability, pre-compilation and official action usage documentation.
Versioned upstream documentation and executable fixtures confirmed the installed behaviour.

The official CI actions were separately audited before adding the workflow. Their current major
tags resolved as follows; the major tags intentionally remain movable under the CI policy:

| Action | Reviewed release | Resolved commit |
| --- | --- | --- |
| `actions/checkout@v7` | [v7.0.1][checkout-release] | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node@v7` | [v7.1.0][node-release] | `949feb2413d6458794dcd2491c4babbbce0c15c1` |

Reviewed their release metadata, action definitions, source entry points, published bundles,
public advisory endpoints and runtime lockfile audits (`npm audit --omit=dev --json`). Both
repository advisory endpoints returned no advisories, but the dependency audits found:

- **Checkout:** Undici 6.27.0 has six advisories: high-severity WebSocket denial of service
  [GHSA-rfgv-xxqx-mfg5][undici-websocket], moderate WebSocket decompression
  [GHSA-3wwx-pv8p-q78v][undici-deflate], response desynchronisation
  [GHSA-8xcm-r25x-g524][undici-desync], blob content-type CRLF injection
  [GHSA-m8rv-5g2x-5cg5][undici-blob], cookie attribute injection
  [GHSA-v3r7-h72x-cjcm][undici-cookie], and low-severity response splitting
  [GHSA-r53p-7pc4-xj5r][undici-split]. The audited release retains this upstream debt. This
  workflow uses normal Git checkout and trusted GitHub endpoints; it does not configure WebSocket,
  retry-interceptor, blob-body or cookie operations. That narrows exposure, not proof of immunity.
- **Setup Node:** smol-toml 1.7.1 has moderate parser denial of service
  [GHSA-r4xh-jqrq-34v2][toml-advisory]. The explicit `node-version` avoids the TOML version-file
  parsing path. The action's Undici 6.29.0 has no reported advisory in this audit.

The workflow uses `contents: read`, `persist-credentials: false`, no cache, no secrets, ordinary
`push`/`pull_request` events and script-disabled dependency installation. The official major tags
may receive future code outside this point-in-time audit; reassess new findings when upgrading.
Workflow YAML was parsed locally and its commands were exercised locally. No commit or push was
made for this work, so there is no hosted CI success claim for these changes.

[cruiser-release]: https://github.com/sverweij/dependency-cruiser/releases/tag/v18.6.0
[pi-release]: https://github.com/earendil-works/pi/releases/tag/v1.3.0
[pi-advisories]: https://github.com/earendil-works/pi/security/advisories
[checkout-release]: https://github.com/actions/checkout/releases/tag/v7.0.1
[node-release]: https://github.com/actions/setup-node/releases/tag/v7.1.0
[undici-websocket]: https://github.com/advisories/GHSA-rfgv-xxqx-mfg5
[undici-deflate]: https://github.com/advisories/GHSA-3wwx-pv8p-q78v
[undici-desync]: https://github.com/advisories/GHSA-8xcm-r25x-g524
[undici-blob]: https://github.com/advisories/GHSA-m8rv-5g2x-5cg5
[undici-cookie]: https://github.com/advisories/GHSA-v3r7-h72x-cjcm
[undici-split]: https://github.com/advisories/GHSA-r53p-7pc4-xj5r
[toml-advisory]: https://github.com/advisories/GHSA-r4xh-jqrq-34v2
