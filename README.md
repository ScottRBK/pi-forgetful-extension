# Pi Forgetful

Automatic persistent memory for the [Pi coding agent](https://pi.dev/), using the existing
[Forgetful REST service](https://github.com/ScottRBK/forgetful).

A separately selected memory model recalls relevant context before normal work and captures
durable, evidenced knowledge after work settles. Clear contradictions automatically supersede
old memories, preserving their history. Uncertain conflicts go back to the main session for
resolution through a bounded tool.

## Setup

Requires Node.js 22.19 or newer, Pi **0.85.1**, and an already-running Forgetful service.

```sh
npm install
pi -e ./index.ts
```

Inside Pi, connect to Forgetful:

```text
/forgetful setup
```

The wizard asks for the REST endpoint and whether it needs a bearer token. Pi has no masked input,
so bearer authentication asks for an environment variable name and never asks for or stores the
token itself. The wizard checks the endpoint and authentication with `GET /projects` before saving
anything.

If you do not have a running endpoint, ask your coding agent to read the
[Forgetful setup skill][forgetful-setup-skill], or follow the
[Docker deployment instructions][forgetful-docker] manually.

Then choose an authenticated memory model:

```text
/forgetful model
```

You can also use `/forgetful model provider/model-id`. The memory model is selected separately
from the main agent; memory processing skips with setup guidance until one is configured.

The default endpoint is `http://localhost:8020/api/v1`. The wizard writes connection settings to
`~/.pi/agent/forgetful/settings.json`, or the corresponding directory when Pi uses a custom agent
directory. You can also edit that file manually:

```json
{
  "base_url": "http://localhost:8020/api/v1",
  "token_env": "FORGETFUL_TOKEN",
  "timeout_ms": 2000,
  "model": "provider/model-id",
  "enabled": true,
  "capture_mode": "auto"
}
```

Omit `token_env` for a local service that does not require authentication. If it is configured,
the environment variable must be set. Remote services require HTTPS. The extension does not
start Forgetful or change its API. First-time connection setup does not create, select, or map a
Forgetful project; project association remains a per-repository concern.

## Normal use and controls

Recall searches globally by default. Capture files knowledge under the current project, and
the agent can select another existing project when the work concerns it. Missing or ambiguous
capture destinations skip with setup guidance; the extension never silently creates a project.

| Command | Effect |
| --- | --- |
| `/forgetful setup` | Connect to and validate a Forgetful REST endpoint. |
| `/forgetful status` | Show effective settings and memory status. |
| `/forgetful on` / `/forgetful off` | Enable or disable memory processing. |
| `/forgetful capture auto` | Automatically capture evidenced knowledge. |
| `/forgetful capture observe` | Inspect candidates without writing memories. |
| `/forgetful capture off` | Disable extraction and resolution writes. |
| `/forgetful capture skip` | Skip the active run, or the next run when idle. |
| `/forgetful scope global` / `/forgetful scope project` | Persist the repository's recall scope. |
| `/forgetful scope` | Show recall scope and where it was configured. |
| `/forgetful model` | Select the separate memory model. |
| `/forgetful debug on` / `/forgetful debug off` | Enable or disable diagnostic detail. |

Project scope is stored in `.pi/forgetful/settings.json` and requires Pi project trust. A missing
scope setting means global recall. A malformed scope setting also uses global recall with a
warning, as specified in the design. Planner-requested scope changes require explicit approval
for that operation; they do not change the persisted preference.

The main model can search further with `forgetful_recall` and resolve an existing pending
conflict with `forgetful_resolve`. These are agent tools, so normal use needs no memory commands.
Conflicts involving shared or partially changed facts stay pending or can be skipped when the
bounded replacement cannot preserve all of the old memory's meaning.

## Policies and stored data

Append policy text through `classification.md`, `recall.md`, and `capture.md` under
`~/.pi/agent/forgetful/prompts/`. Trusted repository overlays use `.pi/forgetful/prompts/`.
Overlays supplement the protected schemas, evidence requirements, and limits.

Preflight recall is transient. Agent tool results and conflict messages follow normal Pi
session persistence. Capture keeps a bounded, filtered snapshot and durable outcomes in the
user's Forgetful queue directory. Known credential and personal-data patterns are filtered;
this is not a guarantee that every possible private fact can be recognized.

Capture runs in the live Pi process and can recover durable pending work on a later start.
Completion after Pi exits is not guaranteed. Query-before-create reduces duplicates but is
not an atomic write contract. Supersession creates a replacement before obsoleting the old
memory; partial outcomes are recorded so the unfinished step can be retried.

## Development and validation

```sh
npm run check
```

The tests exercise public behaviour using the real filesystem and Pi SDK, with predetermined
external model responses. The optional Forgetful integration tests run its actual REST routes
and SQLite repositories against an in-memory database with fixed test embeddings:

```sh
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/forgetful-integration.test.ts
```

That checkout needs its development `.venv`, including its test dependencies. The integration
test does not open the production database or write production memories. Deterministic tests
verify the mechanism; real-model recall quality, contradiction judgment, and latency require
separate acceptance checks with the selected model.

See [the design](docs/design.md).

[forgetful-setup-skill]:
  https://github.com/ScottRBK/forgetful/tree/main/skills/forgetful-mcp-setup
[forgetful-docker]:
  https://github.com/ScottRBK/forgetful#option-3-docker-deployment-productionscale
