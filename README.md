# Pi Forgetful

Automatic persistent memory for the [Pi coding agent](https://pi.dev/), using the existing
[Forgetful REST service](https://github.com/ScottRBK/forgetful).

A separately selected memory model recalls relevant context before normal work and captures
durable, evidenced knowledge after work settles. Clear contradictions automatically supersede
old memories while preserving their history. Uncertain conflicts return to the originating
session for resolution through a bounded tool.

![Pi Forgetful architecture](docs/assets/architecture.png)

## Architecture

Pi sends ordinary prompts and completed work to the extension. Recall asks the separately
configured memory model whether to search, performs a bounded request against a warm Forgetful
HTTP service, and injects only the strongest context into the active turn. Capture snapshots the
settled session branch, persists it in a durable queue, and processes candidates through
query-before-create, supersession, or conflict escalation. Memory failures are failure-open and
must not block the user's task.

HTTP is the MVP transport. The application services depend on a transport-neutral Forgetful client
port, leaving room for a future CLI adapter without changing recall, capture, or scope policy.
Forgetful MCP transport is deliberately not used by this extension.

The visual source is available as [SVG](docs/assets/architecture.svg), and the detailed editable
architecture is available in [Excalidraw](docs/code-architecture.excalidraw).

## Requirements

- Node.js 22.19 or newer
- Pi **0.85.1**
- An already-running Forgetful REST service
- An authenticated Pi model for memory planning and capture
- HTTPS for remote Forgetful services; local HTTP endpoints are supported

## Installation

Once published to npm:

```bash
pi install npm:@scottrbk/pi-forgetful-extension
```

To install the latest source from GitHub instead:

```bash
pi install git:github.com/ScottRBK/pi-forgetful-extension
```

The extension does not start Forgetful or change its API. If you do not have a running endpoint,
ask your coding agent to read the [Forgetful setup skill][forgetful-setup-skill], or follow the
[Docker deployment instructions][forgetful-docker] manually.

## Getting Started

The first time Pi starts with the extension installed, it will register the memory hooks, commands,
and agent tools immediately.

Inside Pi, connect to Forgetful:

```text
/forgetful setup
```

The wizard asks for the REST endpoint and whether it needs a bearer token. Pi has no masked input,
so bearer authentication asks for an environment variable name and never asks for or stores the
token itself. The wizard validates the endpoint and authentication with `GET /projects` before
saving anything.

Then choose an authenticated memory model:

```text
/forgetful model
```

You can also use `/forgetful model provider/model-id`. The memory model is selected separately
from the main agent; memory processing skips with setup guidance until one is configured.

The default endpoint is `http://localhost:8020/api/v1`. The wizard writes connection settings to
`~/.pi/agent/forgetful/settings.json`, or the corresponding directory when Pi uses a custom agent
directory. The effective settings can also be represented as:

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

Omit `token_env` for a local service that does not require authentication. First-time connection
setup does not create, select, or map a Forgetful project; project association remains a
per-repository concern.

Inside each repository, initialise its project:

```text
/forgetful project init
```

The wizard detects the Git `origin` remote and reuses its existing Forgetful project. If none
matches, choose to create a project with a name and description, or link an existing project
that has no repository. Review the link before saving. Large project lists prompt for a name
filter first. Initialisation requires an interactive Pi session, project trust, and an origin
remote that resolves to `owner/repo`.

The link is stored on the project in Forgetful and applies to other checkouts of that repository
using the same Forgetful account. The active session picks it up immediately; future sessions
discover it from the remote. `/forgetful status` shows the project name and ID. Initialisation
does not change recall scope, enable memory, or replay previously queued capture snapshots.
Use `/forgetful scope project` separately if you want recall restricted to this project.

Repeated initialisation reuses the existing link. If a request fails, run init again to check
whether it was saved. Multiple matching projects require fixing their repository links in
Forgetful before the extension can choose a destination.

## Usage

Normal work needs no memory commands. Recall runs before the active turn, and capture runs after a
successful `agent_settled` event. Recall searches globally by default. Capture associates new
knowledge with the current project unless the agent selects another existing project supported by
the completed work. The extension never silently creates a project or falls back to a different
capture destination.

| Command | Effect |
| --- | --- |
| `/forgetful setup` | Connect to and validate a Forgetful REST endpoint. |
| `/forgetful project init` | Create or link this repository's Forgetful project. |
| `/forgetful status` | Show effective settings and memory status. |
| `/forgetful on` / `/forgetful off` | Enable or disable memory processing. |
| `/forgetful capture auto` | Automatically capture evidenced knowledge. |
| `/forgetful capture observe` | Inspect candidates without writing memories. |
| `/forgetful capture off` | Disable extraction, resolution, and capture writes. |
| `/forgetful capture skip` | Skip the active run, or the next run when idle. |
| `/forgetful scope global` / `/forgetful scope project` | Persist the repository's recall scope. |
| `/forgetful scope` | Show recall scope and where it was configured. |
| `/forgetful model` | Select the separate memory model. |
| `/forgetful debug on` / `/forgetful debug off` | Enable or disable diagnostic detail. |

With debug enabled, automated recall shows a bounded notification with the number of memories and
scope used. `/forgetful status` also reports the latest recall result. Automated preflight context
is transient; `forgetful_recall` tool results and conflict messages follow normal Pi session
persistence.

The main model can search further with `forgetful_recall` and resolve an existing pending conflict
with `forgetful_resolve`. These are bounded agent tools, so normal use remains conversational.
Retrieved memories are untrusted historical context, never executable instructions.

### Recall

The memory model returns a validated plan with bounded topic queries, intent, entities, and an
optional scope request. The extension resolves global or strict project scope, searches Forgetful,
and injects the strongest results plus short leads for deeper exploration. A planner-requested
scope change requires explicit approval for that operation and does not change the persisted
preference.

### Capture

After a successful settled run, the extension snapshots stable session and branch entry IDs and
enqueues the bounded evidence. A live worker extracts zero to three candidates, validates evidence
and destinations, checks overlap in the destination project, then creates novel knowledge,
supersedes a clearly outdated memory, or preserves an uncertain conflict for the originating
session. Queue records include per-candidate outcomes so partial writes can be retried safely.

## Configuration

Project scope is stored in `.pi/forgetful/settings.json` and requires Pi project trust. A missing
scope setting means global recall. A malformed scope setting also uses global recall with a
warning. Scope preference is independent of capture destination.

Append policy text through `classification.md`, `recall.md`, and `capture.md` under
`~/.pi/agent/forgetful/prompts/`. Trusted repository overlays use `.pi/forgetful/prompts/`.
Overlays supplement the protected schemas, evidence requirements, and limits; they cannot replace
the extension's safety contracts.

Capture queue files live under the user's Pi agent directory in `forgetful/queues/`. The queue is
durable across normal restarts, but the MVP does not guarantee completion after Pi exits.

## Safety and Limitations

- Memory model and Forgetful failures are bounded and failure-open; they do not block Pi.
- Credentials are referenced through user-owned environment or credential settings and are never
  committed to the project or logged by the extension.
- Remote endpoints must use HTTPS, and Forgetful responses are schema-validated before use.
- Recall scope is strict when project mode is selected; project setup failures do not silently
  fall back to global search.
- Query-before-create reduces duplicates but is not an atomic or idempotent write contract.
- Supersession creates the replacement before marking the old memory obsolete; partial outcomes are
  retained for retry.
- Capture runs in the live Pi process. Pending queue records can recover on a later normal start,
  but post-exit completion and an external worker are outside the MVP.

## Removal

```bash
pi remove git:github.com/ScottRBK/pi-forgetful-extension
```

## Development Tests

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, tests, integration checks, and documentation
updates.

See the [detailed design](docs/design.md) for the reviewed contracts, lifecycle, transport, and
accepted trade-offs.

[forgetful-setup-skill]: https://github.com/ScottRBK/forgetful/tree/main/skills/forgetful-mcp-setup
[forgetful-docker]: https://github.com/ScottRBK/forgetful#option-3-docker-deployment-productionscale
