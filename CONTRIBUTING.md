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
  node --import tsx --test test/forgetful-integration.test.ts
```

That checkout needs its development `.venv`, including its test dependencies. The integration test
does not open the production database or write production memories. Deterministic tests verify the
mechanism; real-model recall quality, contradiction judgment, and latency require separate
acceptance checks with the selected model.

## Documentation and architecture

The README hero is rendered from the architecture source at
[`docs/assets/architecture.svg`](docs/assets/architecture.svg) and committed as
[`docs/assets/architecture.png`](docs/assets/architecture.png) at 1536×1024 to stay consistent with
the AgentShell extension. The detailed layer-by-layer source remains
[`docs/code-architecture.excalidraw`](docs/code-architecture.excalidraw).

Update the SVG and regenerate the PNG whenever the architecture changes. Keep the README and
[`docs/design.md`](docs/design.md) descriptions aligned with the implementation and these assets.
