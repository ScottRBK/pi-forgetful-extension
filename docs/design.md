# Seamless Forgetful memory for Pi

## Decision

Build a Pi extension that makes Forgetful recall and capture automatic by default while
remaining silent, configurable, bounded, and failure-open.

The first vertical slice includes both recall and automatic capture. The extension uses the
existing Forgetful REST API; changes to the Forgetful service are not assumed.

## Review decisions

The following choices are intentional for the first implementation:

- Capture starts in `auto` mode in the first slice, with `off` and `observe` controls retained.
- The `forgetful_recall` tool is enabled, and its normal Pi tool results may persist in session
  history. Compact rendering changes presentation, not persistence.
- Global scope remains the default. Users can opt into strict project scope explicitly; scope
  enforcement in either mode is treated as an existing Forgetful contract rather than a new
  cross-project feature in this extension.
- Query-before-create is the only duplicate boundary. Race and retry risk are accepted for this
  slice; no stronger Forgetful write contract is proposed without explicit approval.
- The planner uses a separately configurable authenticated Pi model, distinct from the active
  main-agent model.
- Repository/project mapping is resolved by the agent from the active project context only when
  project scope is selected; it is not managed through a Forgetful project command. If an
  existing Forgetful project cannot be resolved, project-scoped recall and capture skip and the
  user is given setup guidance.
- The effective scope defaults to global. An explicit scope choice is persisted per repository
  in `.pi/forgetful/settings.json` and is reloaded whenever the project is revisited.
- The planner may request a scope different from the persisted setting, but the extension must
  obtain explicit user authorization before applying that override. Authorization is for the
  current operation unless the user separately changes the persisted setting.
- HTTP is the only Forgetful transport in the MVP. Application services depend on a
  transport-neutral `ForgetfulClient` port so a CLI adapter can be added later without changing
  the core services or policies.
- Any proposal to change Forgetful itself must be escalated to the user with justification.

## User experience

During normal work, the user enters ordinary Pi prompts. They do not invoke memory commands.

The extension:

1. sends each new user prompt to a separately configured authenticated Pi memory model;
2. receives a validated plan stating whether and how to search Forgetful;
3. performs bounded retrieval against a warm Forgetful service;
4. injects the strongest context into the current turn's system prompt;
5. leaves memory IDs, entity names, and topic leads for deeper exploration;
6. exposes one bounded, read-only recall tool to the main agent;
7. evaluates completed work for durable knowledge after `agent_settled`;
8. checks for overlap, then quietly creates only novel, high-confidence memories through the
   existing query-before-create API path.

Memory failure must never block the user's task. A preflight system-prompt injection is
transient; a `forgetful_recall` result follows normal Pi tool-result persistence.

## Pi feasibility

Pi 0.84.1 provides the required extension seams:

- `before_agent_start` can modify the system prompt for the current turn;
- `agent_settled` runs after retries, compaction, and queued continuation have stopped;
- `ctx.modelRegistry` exposes configured models and resolved authentication;
- `ctx.scopedModels` supports a model picker consistent with the user's Pi configuration;
  the extension must persist the selected memory-model ID itself;
- Pi's bundled `complete()` API can make a focused model call without a subagent process;
- an extension can register a bounded recall tool and custom compact rendering;
- `pi.exec` and Node's built-in `fetch` support local process and HTTP integration.

A separate agent subprocess is unnecessary. A focused direct model call is faster and has a
smaller failure surface.

## Recall flow

1. Ignore only process events that are not new user work:
   - Forgetful is explicitly off;
   - the input came from the extension itself;
   - an identical retry already has a cached validated plan.
2. Send every other prompt to the separately configured Pi memory planner model.
3. Validate a bounded response containing:
   - `search`: boolean;
   - one or two topic queries;
   - query intent;
   - zero or more entity names;
   - an optional project/global scope override request and rationale.
4. Resolve the effective scope from the persisted project setting. If the planner requests a
   different scope, ask the user for explicit authorization before applying it. A declined
   request uses the persisted setting, and the planner must never change that setting directly.
5. Search a warm Forgetful HTTP service.
6. Inject only the strongest results and short deeper-search leads.
7. Let the main agent call a read-only `forgetful_recall` tool when it needs more detail. Its
   returned content is ordinary Pi tool-result content and may be stored in session history.

Retrieved memory is untrusted historical context, never executable instruction.

## Scope

Global scope is the default. If `.pi/forgetful/settings.json` contains an explicit scope
override, load and validate it before planning the request. Resolve the canonical repository
identity to an existing numeric Forgetful project ID through explicit setup only when project
scope is selected; never create a project silently.

In global mode, omit project filtering and send `strict_project_filter: false`. In project mode,
every search request must send the resolved numeric project ID with
`strict_project_filter: true`. Forgetful owns project filtering and the scope of returned
memories; the extension does not revalidate project IDs in response memories.

Project-scoped recall and capture are opt-in through the scope command or the persistent
per-project setting:

```text
/forgetful scope
/forgetful scope project
/forgetful scope global
```

`/forgetful scope` reports the effective scope and its source. The scope commands update
`.pi/forgetful/settings.json` so the choice is retained when the project is revisited. If the
settings file is absent, global scope is used. If the scope setting is malformed, reject the
override, surface configuration guidance, and use the global default; never interpret malformed
data as project scope. A planner-requested override does not update this file unless the user
explicitly chooses to persist the new scope.

If project setup is missing or invalid, project-scoped recall and capture skip and provide setup
guidance. They must never silently fall back to global search. Debug output always shows the
effective scope and resolved project ID.

Scope enforcement uses the existing Forgetful service contract. The extension adds only local
persistence for the user's per-project scope preference; it does not add a new cross-project API
or memory persistence mechanism.

## Forgetful instance configuration

The MVP connects to a user-configured, already-running Forgetful HTTP service. Instance
connection settings are user-level and live under `~/.pi/agent/forgetful/settings.json` (or the
equivalent user settings mechanism), separate from the project-local scope setting:

- `base_url`, defaulting to `http://localhost:8020/api/v1`;
- the configured authentication reference, resolved from user-owned environment or credential
  settings rather than committed project files;
- the bounded request timeout.

The project-local `.pi/forgetful/settings.json` stores the repository's scope preference only; it
must not select the Forgetful endpoint or contain credentials. The service must be reachable
before recall or capture runs. The extension does not start or manage the Forgetful process in the
MVP.

## Forgetful adapter contract

Application services depend on the transport-neutral `ForgetfulClient` port. The MVP
`ApiForgetfulClient` is the only adapter and is the only code that knows the Forgetful REST
request and response shapes:

- search: `POST /memories/search` with `query`, `query_context`, optional numeric `project_ids`
  when project scope is selected, and the explicit `strict_project_filter` value; Forgetful owns
  project filtering and returned-memory scope validation;
- create: `POST /memories` with the required `title`, `content`, `context`, `keywords`, and
  `tags` fields;
- validate HTTP status codes and response schemas before returning data to recall or capture;
- use configured authentication, never log credentials, and require TLS for non-local endpoints;
- apply bounded per-request timeouts and abort signals to every network call.

The current create route has no idempotency key. Query-before-create is therefore the only
server-side duplicate boundary in the first slice; the adapter must not describe it as atomic or
idempotent. Any proposed Forgetful API or persistence change is escalated rather than hidden in
the extension.

## Capture lifecycle and durability

`agent_settled` is a trigger, not a capture payload. Pi awaits extension handlers for this event,
and the event does not carry the completed conversation delta. The handler must therefore do a
small enqueue-only operation and return; it must not perform model calls or Forgetful writes
before returning.

The extension-owned capture queue must be durable before automatic mode is enabled:

1. Snapshot the completed turn using stable session/branch entry IDs and the final assistant
   status. Do not reread a mutable session later and assume it is the same run.
2. Persist the fixed snapshot, project/scope, capture mode, run identity, and prompt/model
   versions as one queue record.
3. Advance the capture watermark with the durable enqueue. A stable session/branch plus final
   entry identity (and snapshot hash where needed) prevents the same settled turn being queued
   twice after retries, compaction, or restart.
4. Run one locked worker per session/branch. Recover pending records after restart, and retain
   per-candidate outcomes for retry and debug inspection.
5. Remove or mark a queue record complete only after all candidate outcomes are recorded.

The worker is not awaited by `agent_settled`, so automatic capture cannot delay the user's next
turn. An in-memory queue or a timestamp-only watermark is not sufficient. The queue prevents
extension-level replay, but query-before-create remains the only Forgetful duplicate boundary;
it cannot prevent two independent clients from racing to create the same memory.

## Capture flow

Capture is scheduled after Pi emits `agent_settled`. This event means Pi has finished the
agent run and will not automatically continue through retries, compaction retries, or queued
follow-ups. It does not itself mean the work succeeded, so the extension must inspect the final
assistant message and skip capture when its stop reason is error or aborted. The fixed snapshot
is then processed by the durable worker described above.

1. Read only the conversation messages in the fixed snapshot after the last capture watermark.
2. Ask the configured Pi memory model for zero to three atomic, evidenced candidates, using the
   bounded capture call budget.
3. Apply deterministic structural and sensitive-data validation to its response.
4. Query Forgetful for semantic overlap for each accepted candidate.
5. Give the candidate and overlapping memories to the memory model for `create` or `skip`.
6. Execute the model's validated decision through the existing Forgetful API.
7. Never update or obsolete an existing memory automatically.
8. If the decision is malformed or uncertain, skip the write.

Query-before-create is the only duplicate boundary for this slice. Race and retry risk are
accepted, so the extension must record per-candidate outcomes and must explicitly allow
partial writes when a later candidate or retry fails. No change to the Forgetful service is
assumed.

The first implementation uses automatic capture immediately, as agreed. Debug tooling must
still expose each candidate and create/skip reason.

## Configurable prompts

Memory judgment is split into three prompt slots:

- `classification.md`: whether and how to search, including topics and entities;
- `recall.md`: how retrieved memories and deeper-search leads are presented to the main agent;
- `capture.md`: what completed knowledge deserves durable storage.

Each prompt is composed from:

1. a versioned built-in core contract;
2. an optional global policy under `~/.pi/agent/forgetful/prompts/`;
3. an optional trusted project policy under `.pi/forgetful/prompts/`.

Prompt policy is configured through these settings files, not Forgetful commands. The trusted
project settings file `.pi/forgetful/settings.json` is separate from prompt policy files and
stores only project-local extension preferences such as the effective memory scope. Policy files
append to the built-in contract. They cannot replace protected schemas, safety rules, bounds, or
scope ceilings.

Proposed Forgetful commands:

```text
/forgetful scope
/forgetful scope project
/forgetful scope global
/forgetful capture off
/forgetful capture observe
/forgetful capture auto
/forgetful capture skip
```

`capture auto` is the first-slice default. `off` disables candidate extraction and writes;
`observe` extracts and reports candidates without writing; `skip` is a deterministic opt-out
for the current turn. A user-facing “do not remember” control must map to the same opt-out and
must not depend only on the capture model understanding natural language.

Automatic capture also applies deterministic secret and unnecessary-PII filters before any
model decision or network write. Raw transcripts, routine tool output, credentials, payroll
data, and unverified guesses are never automatic capture candidates. Stored candidates should
carry provenance such as the run and source-entry identity without copying the full transcript.

## Default and debug modes

The default mode is silent:

- no preflight memory message is added to conversation history;
- a `forgetful_recall` tool result may appear in normal Pi session history;
- no success or empty-result popup;
- optional transient footer status only;
- compact rendering for agent-initiated deeper recall.

Debug mode may show:

- selected memory model;
- prompt-policy sources and hashes;
- planner input and validated output;
- effective project/global scope;
- Forgetful queries and timings;
- injected memory IDs and token count;
- capture candidates and create/skip reasons.

Prompt and memory content is not persisted in extension debug logs unless the user explicitly opts
in. This does not override normal Pi persistence of a `forgetful_recall` tool result.

## Latency

Latency is a product acceptance criterion. Measure:

- memory-model time;
- Forgetful search and rerank time;
- total memory preflight time;
- main-agent first-token time with the extension on and off;
- timeout rate and plan-cache hit rate.

Initial SLO candidates to validate:

- warm preflight p50 below 700 ms;
- warm preflight p95 below 1.5 seconds;
- hard fail-open timeout around 2 seconds.

The benchmark matrix covers every supported memory planner model, warm and cold service state,
search false, search hit, search miss, two-query plans, and local versus remote service. Capture
model calls are measured separately because they are not on the recall preflight path. The
implementation also bounds recall to one planner call per prompt and bounds capture extraction
and create/skip decisions with an explicit per-run call budget; debug shows aggregate usage.

## Transport

Use a warm Forgetful HTTP service and its REST search endpoint for the MVP. Transport selection
is not user-configurable in this slice: `ApiForgetfulClient` is selected directly behind the
`ForgetfulClient` port.

The extension should use Node's built-in `fetch`, avoiding a new runtime dependency. Managed
local service startup can be considered separately after the basic HTTP path is proven. The
adapter owns authentication headers, TLS checks for remote endpoints, request timeouts, abort
signals, and response validation.

A future `CliForgetfulClient` can implement the same port by invoking the installed Forgetful
CLI. That adapter is intentionally deferred; adding it should not require changes to the
application services, scope policy, prompt policy, or capture queue.

## Failure behavior

- planner unavailable or timed out: continue without memory;
- Forgetful unavailable or timed out: continue without memory;
- malformed planner output: reject it and continue without memory;
- repeated failures: open a short-lived circuit breaker;
- capture failure: record per-candidate outcomes and retry only on a later safe checkpoint; an
  earlier candidate may already have been written and query-before-create does not eliminate
  race or retry duplicates;
- project cannot be resolved in project mode: skip rather than search globally.
- persisted scope setting is absent: use global scope;
- persisted scope setting is malformed: reject the override, surface configuration guidance, and
  use global scope.
- planner requests a scope override: ask for authorization; if declined, continue with the
  persisted scope without changing it.

## Delivery slices

1. Separately configurable memory model, global-by-default scope with optional project setup,
   silent recall injection, persisted agent-followable recall tool, and automatic capture.
2. Global and trusted-project prompt policy overlays.
3. Debug, capture mode, enablement, and scope controls.
4. Real-provider latency and capture-quality tuning.

Each slice remains vertically usable and covered by regression tests.

## Confirmed test seams

The automated boundary starts after a model has made a structured decision. Tests do not claim
to prove that a real model classifies, splits, or judges novelty correctly.

1. **Planner input seam**: the planner receives the expected user prompt, session context,
   project identity, scope, and composed classification policy.
2. **Recall mechanism seam**: given a structured search decision and seeded Forgetful data,
   the correct bounded context and leads reach the same main-agent turn.
3. **Agent tool seam**: given a deeper recall request, the read-only tool returns correctly
   scoped Forgetful data to the main agent.
4. **Capture input seam**: the capture model receives only the completed turn delta and the
   composed capture policy.
5. **Capture mechanism seam**: given structured candidate and create/skip decisions, the
   extension performs the expected Forgetful search and write, with correct fields and scope.
6. **Scope seam**: a fresh project uses global scope without project filtering; persisted global
   and project choices are loaded per repository; planner-requested overrides require explicit
   authorization; project requests set `strict_project_filter: true` and use the resolved
   numeric project ID, while returned-memory filtering remains a Forgetful responsibility.
7. **Capture lifecycle seam**: `agent_settled` snapshots and durably enqueues quickly; watermark,
   locking, restart recovery, compaction, fork, retry, and queued-follow-up behaviour are
   covered without duplicate extension work.
8. **Configuration seam**: memory-model selection, Forgetful instance settings, toggles, prompt
   overlays, project setup, and scope take effect; instance settings remain user-level while
   scope persists under `.pi/forgetful/settings.json`.
9. **Failure seam**: timeout, malformed output, and service failure do not block Pi.
10. **Privacy seam**: preflight context is not added as a custom visible session message; normal
    `forgetful_recall` tool results are explicitly allowed to persist in Pi session history.
11. **Latency seam**: first-token overhead and stage timings meet the agreed SLO.

A black-box test can use Pi's faux model to supply predetermined decisions and a real throwaway
Forgetful SQLite service. This tests the complete mechanism without pretending to test model
intelligence. For example:

- seed a memory, return a planner decision that queries it, and assert the main model receives
  that memory in its temporary system prompt;
- invoke `forgetful_recall` and assert the returned result is rendered compactly while remaining
  an expected normal Pi tool result;
- return a capture candidate and `create`, then assert the expected memory exists through the
  existing Forgetful API;
- pre-seed an overlapping memory, return `skip`, and assert the memory count is unchanged;
- emit the same settled turn twice and assert the durable capture watermark prevents repeat work;
- restart with a pending capture record and assert recovery processes the fixed snapshot once;
- open a fresh repository and assert global scope is used, then change the scope and revisit the
  repository to assert `.pi/forgetful/settings.json` restores the choice;
- request a scope override, assert authorization is required, and verify a declined request
  leaves the persisted scope unchanged;
- document, rather than deny, the accepted race/retry behaviour of query-before-create.

Semantic classification, semantic atomicity, novelty quality, and duplicate prevention remain
model or service behaviour. They can be explored with real-model evaluation scenarios, but are
not deterministic regression claims.

## Accepted trade-offs

- No Forgetful service change is part of this implementation. Any proposal to change its API or
  persistence behaviour must be escalated and justified first.
- HTTP is the only MVP transport. The transport-neutral client port leaves room for a future CLI
  adapter without committing the first slice to CLI startup and runtime costs.
- Query-before-create reduces obvious duplicates but does not provide atomic or idempotent
  writes. Automatic capture accepts that limitation and records outcomes rather than promising
  all-or-nothing behaviour.
- Deep recall is intentionally useful to the main agent even though its normal Pi tool result
  may be persisted in session history.
- Global scope is the default; project scope remains strict when explicitly selected. Scope
  enforcement and returned-memory project filtering are treated as the existing Forgetful
  service contract rather than an extension-owned validation subsystem.
