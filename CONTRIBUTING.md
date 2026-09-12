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
external model responses. Optional Forgetful integration tests run its actual REST routes and
SQLite repositories against an in-memory database with fixed test embeddings:

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

## Documentation and architecture

The README hero is rendered from the architecture source at
[`docs/assets/architecture.svg`](docs/assets/architecture.svg) and committed as
[`docs/assets/architecture.png`](docs/assets/architecture.png) at 1536×1024 to stay consistent with
the AgentShell extension. The detailed layer-by-layer source remains
[`docs/code-architecture.excalidraw`](docs/code-architecture.excalidraw).

Update the SVG and regenerate the PNG whenever the architecture changes. Keep the README and
[`docs/design.md`](docs/design.md) descriptions aligned with the implementation and these assets.
