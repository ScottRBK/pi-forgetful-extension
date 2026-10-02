# Contributing

## Development setup

The extension requires Node.js 22.19 or newer, Pi **0.85.1**, and an already-running Forgetful
service for manual use.

Install the development dependencies and load the local source into Pi:

```bash
npm install
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

The integration suite also covers graph and artifact recall, interrupted rich capture, project
scope, and repeated `/forgetful encode` runs through Pi's real command and tool boundaries.
Stored-file fixtures are created only in the isolated server; the extension exposes no upload tool.

### Native Codex compaction and recall

Point this optional regression at a local `pi-codex-compaction` source entry point:

```bash
FORGETFUL_TEST_CODEX_COMPACTION=/path/to/pi-codex-compaction/index.ts \
  node --import tsx --test test/recall-native-compaction-pi.test.ts
```

It loads both extensions into real Pi sessions and inspects the final Codex request after provider
hooks. It covers bounded waits, late automatic recall, either extension load order, tree navigation,
and a no-checkpoint control that discusses the marker prefix as ordinary chat. The real Codex
converter runs, but the test stops before transport; there are no paid calls or changes to installed
packages, settings, or production data.
The source checkout must resolve the same Pi SDK dependencies as the test runner.

The unpatched compaction plugin rebuilds requests from saved history and loses transient recall
facts. This regression intentionally fails against that version. Existing checkpoints can also
contain old recall lifecycle markers; preserving new context-hook changes does not remove items
already stored inside a checkpoint.

The reviewed plugin fix is saved in
[`patches/pi-codex-compaction-context.patch`](patches/pi-codex-compaction-context.patch).
It was built from upstream `ogulcancelik/pi-extensions` revision `373a8cf` and also applies to the
installed `@ogulcancelik/pi-codex-compaction` 0.1.5 files checked during review.
To reapply it to the plugin package directory, set absolute paths and check before changing files:

```bash
PATCH=/absolute/path/to/pi-forgetful-extension/patches/pi-codex-compaction-context.patch
PLUGIN=/absolute/path/to/pi-codex-compaction
git -C "$PLUGIN" apply --check -p3 "$PATCH"
git -C "$PLUGIN" apply -p3 "$PATCH"
```

For the upstream monorepo, omit `-p3` and set `PLUGIN` to its root. If the check fails, stop: the
plugin may already be patched or its version may differ. Restart or reload Pi after applying it.
An npm update can replace the patched files; keep the patch to reapply after checking compatibility.

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

## Documentation and architecture

The README hero is rendered from the architecture source at
[`docs/assets/architecture.svg`](docs/assets/architecture.svg) and committed as
[`docs/code-architecture.excalidraw`](docs/code-architecture.excalidraw).

Update the SVG and regenerate the PNG whenever the architecture changes. Keep the README and
[`docs/design.md`](docs/design.md) descriptions aligned with the implementation and these assets.
