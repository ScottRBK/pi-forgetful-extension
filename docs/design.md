# Seamless Forgetful memory for Pi

## Decision

Build a Pi extension that makes Forgetful recall and capture automatic by default while
remaining silent, configurable, bounded, and failure-open.

The first vertical slice includes both recall and automatic capture. The extension uses the
existing Forgetful REST API; changes to the Forgetful service are not assumed.

## Knowledge expansion

The extension also works with entities and their relationships, documents, code artifacts and
stored files. The original memory lifecycle below remains the basis for evidence, project scope,
automatic contradiction resolution and uncertain-conflict escalation.

- Automatic recall uses memories and entities as entry points. It follows a bounded number of
  relevant relationships and document/code references within the existing deadline and context
  budget. Optional record failures preserve candidates for review while time remains. No unreviewed
  candidate is injected if the overall deadline expires.
- `forgetful_knowledge_read` lets the active agent inspect individual records and supporting
  material. Project scope is enforced on each record and both ends of a relationship. Stored
  text and image files can be opened explicitly; file support depends on the server feature flag.
- Automatic capture can store documents and reusable code and link memories to entities and
  relationships. It excludes file uploads. Resource IDs and completed links are checkpointed so
  an interrupted capture can continue. Query-before-create still cannot guarantee atomic
  deduplication across simultaneous sessions or server-side races.
- `forgetful_project_init` exposes repository initialisation to the active agent, with the same
  trusted Git-origin mapping as the interactive wizard. Connection setup remains separate.
- `/forgetful encode` starts a normal active-agent turn with the bundled repository encoding and
  supporting workflows. It surveys source and the current commit, creates or refreshes project
  knowledge, and reports coverage and gaps. It works without the background memory model.
- Foreground knowledge writes are scoped to a verified project and source context. Clear memory
  contradictions preserve old facts through supersession; uncertain cases require clarification
  in the active session. No file-upload tool is exposed in this expansion.

The shared `KnowledgeClient` capability extends the transport-neutral client. Its HTTP adapter
uses the existing entity, document, code-artifact and file routes, preserving authentication,
timeouts and schema validation. Memory links include `document_ids`, `code_artifact_ids` and
`file_ids`. Stored file reads have a separate bounded response allowance for binary payloads;
a configured response limit still applies.

## Architecture

![Pi Forgetful architecture](assets/architecture.png)

The extension boundary owns Pi lifecycle hooks, commands, bounded agent tools, and failure-open
coordination. Recall uses a separately configured Pi model to plan bounded searches and inject
context from the warm Forgetful REST service. Capture snapshots a settled session branch into a
durable queue, then uses the same transport-neutral Forgetful client to create, supersede, or
escalate candidate memories. The HTTP adapter is the MVP; a future CLI adapter can be added
without changing the application services or policy contracts.

The presentation source for this diagram is [architecture.svg](assets/architecture.svg). The
expanded layer-by-layer version remains available in
[code-architecture.excalidraw](code-architecture.excalidraw).

## Review decisions

The following choices are intentional for the first implementation:

- Capture starts in `auto` mode in the first slice, with `off` and `observe` controls retained.
- The `forgetful_recall` tool is enabled, and its normal Pi tool results may persist in session
  history. Compact rendering changes presentation, not persistence.
- Recall defaults to global scope. Users can opt into strict project recall explicitly; scope
  enforcement uses the existing Forgetful search contract.
- Capture associates each new memory with the current project by default. The agent may select
  another existing project when the completed work concerns it, without a separate user prompt.
  This per-candidate destination does not change the repository's persisted recall scope.
- Capture checks both duplication and contradiction against existing memories. A contradiction
  is a distinct outcome with evidence, not an ordinary duplicate to discard. Clear, evidenced
  changes automatically supersede the old memory while preserving its history. Uncertain
  conflicts are escalated to the main model through the bounded handoff described below.
- Query-before-create is the only duplicate boundary. Race and retry risk are accepted for this
  slice; no stronger Forgetful write contract is proposed without explicit approval.
- The planner uses a separately configurable authenticated Pi model, distinct from the active
  main-agent model.
- Repository/project mapping is resolved from the Git remote and the project's `repo_name`.
  `/forgetful project init` explicitly creates a project or links an unassigned existing project
  after user review. It reuses an existing exact match and rejects ambiguous mappings. Connection
  setup remains separate. If a destination cannot be resolved, the affected capture or project
  recall skips with setup guidance. Global recall can still run without a project mapping.
- The effective recall scope defaults to global. An explicit choice is persisted per repository
  in `.pi/forgetful/settings.json` and is reloaded whenever the project is revisited.
- The recall planner may request a scope different from the persisted setting. The extension must
  obtain explicit user authorization before applying that override. Authorization is for the
  current operation unless the user separately changes the persisted setting.
- HTTP is the only Forgetful transport in the MVP. Application services depend on a
  transport-neutral `ForgetfulClient` port so a CLI adapter can be added later without changing
  the core services or policies.
- Any proposal to change Forgetful itself must be escalated to the user with justification.
- Completion of capture after Pi exits is deferred beyond MVP. Keep the durable queue, but do
  not add an external worker, daemon, or shutdown-completion requirement for this slice.

## User experience

During normal work, the user enters ordinary Pi prompts. They do not invoke memory commands.

The extension:

1. sends each new user prompt to a separately configured authenticated Pi memory model;
2. receives a validated plan stating whether and how to search Forgetful;
3. performs bounded retrieval against a warm Forgetful service;
4. asks the memory model to select and summarise results, then injects its reviewed context;
5. leaves memory IDs, entity names, and topic leads for deeper exploration;
6. exposes one bounded, read-only recall tool to the main agent;
7. evaluates completed work for durable knowledge after `agent_settled`;
8. assigns each candidate to its relevant project, checks for duplicates and contradictions, and
   quietly creates novel, high-confidence memories through the existing query-before-create path;
9. automatically supersedes clearly outdated facts and retains uncertain conflicts with memory
   IDs and supporting evidence for escalation.

Memory failure must never block the user's task. A preflight system-prompt injection is
transient; a `forgetful_recall` result follows normal Pi tool-result persistence.

## Pi feasibility

The implementation targets Pi 0.85.1 and uses these extension seams:

- `before_agent_start` can modify the system prompt for the current turn;
- `input` and `context` cover queued prompts that bypass `before_agent_start`, using transient
  context messages without adding recall to stored session history;
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
6. Ask the same memory model to review bounded memory and optional rich results against the question
   and session context. It returns a summary, selected source IDs and a brief selection/rejection
   reason. Validate IDs against sources actually shown to the reviewer. Inject only the summary
   and validated references, never raw results or appended attachments. Nothing relevant means no
   injection. Invalid output or failed/timed-out review injects nothing, without a raw fallback.
7. Let the main agent call a read-only `forgetful_recall` tool when it needs more detail. Its
   returned content is ordinary Pi tool-result content and may be stored in session history.

Retrieved memory is untrusted historical context, never executable instruction.
Review summaries are also untrusted. One planning call and at most one review call share the
overall recall budget with search and optional enrichment. Explicit main-agent read tools retain
their direct results; the main agent reviews those itself. Asynchronous deeper exploration and
later background context injection are deferred, potentially behind a future feature switch.

## Recall scope and capture destination

Global recall is the default. If `.pi/forgetful/settings.json` contains an explicit scope
override, load and validate it before planning the request. Resolve the canonical repository
identity to an existing numeric Forgetful project ID when project recall is selected or capture
needs a destination. Resolve the mapping from the active work context; never create a project
silently. Missing or ambiguous mappings require setup guidance rather than a guessed ID.

For global recall, omit project filtering and send `strict_project_filter: false`. In project
recall, every search request must send the resolved numeric project ID with
`strict_project_filter: true`. Forgetful owns search filtering and the scope of returned
search results; the extension does not revalidate their project IDs. Resolution separately
checks a selected memory's current state before mutation, as described in the adapter contract.

Project-scoped recall is opt-in through the scope command or the persistent per-project setting:

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

If project setup is missing or invalid, project-scoped recall skips and provides setup guidance.
It must never silently fall back to global search. Debug output shows the effective recall scope
and resolved project ID.

Capture destination is independent of recall scope. Each candidate defaults to the current
project, even when recall searched globally. The agent can override that destination to another
existing project when supported by the completed work. For example, a fix to Forgetful made while
working on this extension belongs to the Forgetful project. The capture model may use the main
agent's project context as evidence and returns a target project and rationale per candidate.

Resolve and validate the destination before overlap checks. Query for duplicates and
contradictions using that project's ID and `strict_project_filter: true`, then use the same
`project_ids` on create. A validated per-candidate project override needs no additional user
approval and cannot alter persisted recall settings, the service endpoint, or credentials.
If the intended destination cannot be resolved, skip that candidate with setup guidance instead
of silently writing to the current project or without a project. Global recall does not imply
project-free capture; personal facts that do not belong to a project need a separate policy.

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
  for project recall or the capture destination, and the explicit `strict_project_filter` value;
  Forgetful owns search filtering and returned-memory scope validation;
- project lookup: `GET /projects` with `repo_name` when available, resolving an existing numeric
  project ID from the candidate's work context; missing or ambiguous matches do not create one;
- explicit project initialisation: `POST /projects` with name, description, `repo_name`, and
  `project_type: development`, or `PUT /projects/{id}` with only `repo_name` to link an unassigned
  project. Recheck after confirmation and verify the resulting mapping before using it. These
  checks reduce races but are not atomic; the server does not enforce unique repository links;
- create: `POST /memories` with the required `title`, `content`, `context`, `keywords`, and
  `tags` fields, plus the resolved capture destination in `project_ids`;
- read for resolution: `GET /memories/{id}` for an existing conflict's selected memory, checking
  that its content, project associations, and obsolescence state still match the decision;
- supersede: first create the replacement, then `DELETE /memories/{id}` with `reason` and
  `superseded_by` set to the confirmed replacement ID. This route marks the old memory obsolete
  and preserves its history; the operation is not a hard delete;
- validate HTTP status codes and response schemas before returning data to recall or capture;
- use configured authentication, never log credentials, and require TLS for non-local endpoints;
- apply bounded per-request timeouts and abort signals to every network call.

The current create route has no idempotency key. Query-before-create remains the duplicate
boundary in this slice. Create-then-obsolete is also not an atomic transaction, and the read
before resolution is not a compare-and-swap guarantee. The adapter must not claim otherwise.
Any proposed Forgetful API or persistence change is escalated rather than hidden in the extension.

## Capture lifecycle and durability

`agent_settled` is a trigger, not a capture payload. Pi awaits extension handlers for this event,
and the event does not carry the completed conversation delta. The handler must therefore do a
small enqueue-only operation and return; it must not perform model calls or Forgetful writes
before returning.

The extension-owned capture queue must be durable before automatic mode is enabled:

1. Snapshot the completed turn using stable session/branch entry IDs and the final assistant
   status. Do not reread a mutable session later and assume it is the same run.
2. Persist the fixed snapshot, current project context, recall scope, capture mode, run identity,
   and prompt/model versions as one queue record. Record each candidate's resolved destination
   with its outcome before writing, so retries do not reroute it from a changed working directory.
3. Advance the capture watermark with the durable enqueue. A stable session/branch plus final
   entry identity (and snapshot hash where needed) prevents the same settled turn being queued
   twice after retries, compaction, or restart.
4. Run one locked worker per session/branch, with serialized queue-file mutations. Recover
   pending records after restart, and retain per-candidate outcomes for retry and debug inspection.
5. Remove or mark a queue record complete only after all candidate outcomes are recorded.

The worker is not awaited by `agent_settled`, so automatic capture cannot delay the user's next
turn. An in-memory queue or a timestamp-only watermark is not sufficient. The queue prevents
extension-level replay, but query-before-create remains the only Forgetful duplicate boundary;
it cannot prevent two independent clients from racing to create the same memory.

The MVP worker runs inside the live Pi process. Durable pending records can be recovered on a
later normal start, but capture completion after Pi exits is not an MVP guarantee. External
workers and shutdown draining are deferred until MVP usage demonstrates a need; this does not
remove the existing snapshot, watermark, and retry requirements.

Queue files live under the user's Pi agent directory, in `forgetful/queues/`. The directory key
separates repository and service/account identity. Repository-controlled settings cannot redirect
the queue or select service credentials.

## Capture flow

Capture is scheduled after Pi emits `agent_settled`. This event means Pi has finished the
agent run and will not automatically continue through retries, compaction retries, or queued
follow-ups. It does not itself mean the work succeeded, so the extension must inspect the final
assistant message and skip capture when its stop reason is error or aborted. The fixed snapshot
is then processed by the durable worker described above.

1. Read only the conversation messages in the fixed snapshot after the last capture watermark.
2. Ask the configured Pi memory model for zero to three atomic, evidenced candidates, each with
   a target project and rationale, using the bounded capture call budget.
3. Apply deterministic structural and sensitive-data validation and resolve each destination.
4. Query Forgetful for semantic overlap in each accepted candidate's destination project.
5. Give the candidate, its evidence, and overlapping memories to the memory model for a bounded
   `create`, `skip`, `supersede`, or `escalate` decision. This extends the existing overlap
   judgment; it does not require a separate contradiction service or an extra model call per
   candidate. Use `supersede` for a clearly evidenced change and `escalate` for unresolved conflict.
6. Validate the decision. A contradiction must identify conflicting memories from that query,
   the incompatible claims, source entries in the eligible snapshot, and why they concern the
   same fact.
7. Execute `create` or automatic `supersede` through the existing Forgetful API using the shared
   resolution path below. Record `skip` and `escalate` distinctly; an unresolved conflict is
   neither an ordinary duplicate nor permission to create a competing fact.
8. If a decision is malformed, reject the write and record the reason. Retain a valid uncertain
   conflict for escalation. An arbitrary confidence score alone does not authorize supersession.

A contradiction means incompatible claims about the same subject and applicable context.
Different projects using different databases is not a contradiction. A current user decision
or evidenced change can challenge an old memory; an assistant suggestion or repetition of
recalled text alone is not independent evidence. Similarity alone does not establish conflict.

Automatic resolution is agreed for clear changes. For example, an explicit decision that the
project has switched to SQLite can supersede the old PostgreSQL decision; a suggestion to
consider SQLite cannot. Retain the superseded memory as history, linked to its replacement.

The capture service applies supersession in this order:

1. Re-read the selected old memory and validate the recorded content and project associations.
   If it changed or was already superseded, refresh the decision instead of applying a stale one.
2. Create the validated replacement and durably record its returned ID before obsoleting the
   old memory. Preserve applicable project associations and provenance. If the proposed change
   invalidates only part of a shared memory, escalate rather than discard still-valid claims.
3. Mark the old memory obsolete with the reason and replacement ID, then record completion.
   Retry a failed obsolescence step using the recorded replacement, not another create.

If creation fails or its outcome is unknown, do not obsolete the old memory. If obsolescence
fails, the replacement may already exist alongside it; preserve that partial outcome for retry.
Other clients can still race between validation and mutation because the existing API has no
conditional write contract. This limitation remains explicit; no service change is assumed.

### Escalation to the active session

The main model can resolve a pending conflict through an extension tool. The current
`forgetful_recall` tool remains read-only; a separate, bounded `forgetful_resolve` tool accepts
a pending conflict ID, a decision, and evidence entry IDs or a reason. The extension reads the
actual session evidence. The tool cannot name arbitrary memories or supply an unvalidated
replacement. Conflicts involving partial or shared claims remain deferred or can be skipped
when the bounded replacement cannot safely preserve the old memory's remaining meaning.

1. Persist a pending conflict with its originating session/branch, destination project, old
   claim, proposed replacement, memory IDs, and source evidence in the existing queue store.
2. Deliver a bounded custom message to that same live session using `pi.sendMessage()` with
   `deliverAs: "nextTurn"`. The main model sees it with the next user prompt; this handoff
   does not interrupt current work or start an extra model turn. A compact status can show
   that a conflict is pending. The durable record, not Pi's in-memory delivery queue, owns it.
3. The main model uses the session context to resolve the conflict. If the missing information
   is a user preference or an unconfirmed fact, it asks the user normally. It can then call
   `forgetful_resolve` to supersede the old fact, retain it and reject the candidate, or defer.
4. The tool validates the conflict identity, current enablement, project, evidence, and observed
   memory state, then delegates to the same capture-service write path used automatically.
   A later user clarification can supply new evidence; repeating the escalation alone cannot.

Escalation messages and resolution tool results follow normal Pi session persistence. Exclude
these messages, memory-operation results, and mere acknowledgements from new capture evidence
to avoid repeated conflict loops. Do not deliver a worker's conflict into a replacement session
or another branch. Pending conflicts remain available for later recovery, subject to the
existing MVP boundary on exit. `capture off` blocks resolution writes as well as new capture.

The MVP handoff does not request `triggerTurn` or launch a separate conversation. A user
clarification stays in the existing session and can support a later resolution call.

Query-before-create is the only duplicate boundary for this slice. Race and retry risk are
accepted, so the extension must record per-candidate outcomes and must explicitly allow
partial writes when a later candidate or retry fails. No change to the Forgetful service is
assumed.

The first implementation uses automatic capture immediately, as agreed. Debug tooling must
still expose each candidate's destination, decision, and contradiction evidence or skip reason.

## Configurable prompts

Memory judgment is split into three prompt slots:

- `classification.md`: whether and how to search, including topics and entities;
- `recall.md`: how retrieved memories and deeper-search leads are presented to the main agent;
- `capture.md`: what completed knowledge deserves durable storage, its destination project, and
  how existing memories should be checked for duplication and contradiction.

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

## Output verbosity

The default verbosity is `warning`, showing warnings and errors:

- no preflight memory message is added to conversation history;
- a `forgetful_recall` tool result may appear in normal Pi session history;
- no success or empty-result popup;
- optional transient footer status only;
- compact rendering for agent-initiated deeper recall.

`/forgetful verbosity debug|info|warning|error` persists a user-level setting without resetting
session memory work. Each level includes more severe messages. `info` adds brief recall counts
and scope; `debug` adds queries and intent, bounded retrieved candidates, selected/rejected source
IDs, the review reason and final injected summary, total duration and redacted failures. Recoverable
recall failures are warnings; invalid endpoint configuration and capture enqueue failures are
errors. Explicit command responses and normal tool results remain visible at every level.

The old `debug on/off` commands map to `debug`/`warning`; legacy `debug: true` settings remain
supported unless an explicit `verbosity` is present. `/forgetful status` shows the current level
and, at debug level, bounded capture candidates, outcomes and pending escalations.

Debug details use user-only UI notifications and are not added to model context or extension log
files. Known secrets are redacted. This does not override normal Pi persistence of tool results.

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
- hard fail-open timeout of 10 seconds by default (configurable);
- each classification/review request defaults to 5 seconds, independently configurable from the
  overall deadline.

The benchmark matrix covers every supported memory planner model, warm and cold service state,
search false, search hit, search miss, two-query plans, and local versus remote service. Capture
model calls are measured separately because they are not on the recall preflight path. The
implementation bounds recall to one planner call and at most one review call per prompt. Capture
extraction and overlap decisions, including contradiction detection, have a per-run call budget;
debug shows aggregate usage.

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
- capture destination cannot be resolved: skip that candidate with setup guidance; global recall
  remains usable, and a failed override never falls back to another write destination;
- clear contradiction: automatically supersede with a recorded replacement and reason;
- uncertain contradiction or changed source memory: retain for escalation or renewed judgment;
- partial supersession: preserve the replacement ID and retry only the unfinished step;
- Pi exits with capture pending: preserve durable work for later recovery; post-exit completion
  is deferred beyond MVP;
- persisted scope setting is absent: use global scope;
- persisted scope setting is malformed: reject the override, surface configuration guidance, and
  use global scope.
- planner requests a scope override: ask for authorization; if declined, continue with the
  persisted scope without changing it.

## Delivery slices

1. Separately configurable memory model, global-by-default recall with optional project scope,
   silent recall injection, persisted agent-followable recall tool, and automatic capture with
   project association, agent-selected destinations, and automatic contradiction resolution.
2. Global and trusted-project prompt policy overlays.
3. Debug, capture mode, enablement, and scope controls.
4. Real-provider latency and capture-quality tuning.

Each slice remains vertically usable and covered by regression tests.

## Confirmed test seams

The automated boundary starts after a model has made a structured decision. Tests do not claim
to prove that a real model classifies, splits, or judges novelty correctly.

1. **Planner input seam**: the planner receives the expected user prompt, session context,
   project identity, scope, and composed classification policy.
2. **Recall mechanism seam**: given search and review decisions and seeded Forgetful data,
   only the selected summary and validated source IDs reach the same main-agent turn, including
   queued prompts. Empty decisions inject nothing; invalid output and timeouts fail open. Debug
   shows bounded candidates and decisions without leaking them into the main-agent context.
3. **Agent tool seam**: given a deeper recall request, the read-only tool returns correctly
   scoped Forgetful data to the main agent.
4. **Capture input seam**: the capture model receives only the completed turn delta and the
   composed capture policy, including the current project and evidence for another destination.
5. **Capture mechanism seam**: given structured create/skip/supersede/escalate decisions, the
   extension searches the destination project, applies validated creates or ordered supersession,
   and retains uncertain conflicts. A stale decision never knowingly changes a newer memory.
6. **Scope seam**: a fresh project uses global scope without project filtering; persisted global
   and project choices are loaded per repository; planner-requested overrides require explicit
   authorization; project requests set `strict_project_filter: true` and use the resolved
   numeric project ID, while returned-memory filtering remains a Forgetful responsibility.
   Capture defaults to the current project independently of recall scope; an agent-selected
   existing destination needs no separate approval and does not change persisted recall scope.
7. **Capture lifecycle seam**: `agent_settled` snapshots and durably enqueues quickly; watermark,
   locking, restart recovery, compaction, fork, retry, and queued-follow-up behaviour are
   covered without duplicate extension work. Completion after process exit is not an MVP claim.
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
- pre-seed an incompatible decision, return `supersede` with valid source identities, and assert
  the replacement is created before the old memory is marked obsolete and linked to it;
- return `escalate` and assert the conflicting IDs and evidence persist without a write;
- reject a resolution referencing memory IDs outside the candidate's overlap results;
- fail replacement creation and assert the old memory remains active; fail obsolescence after
  creation and assert retry uses the recorded replacement ID without creating another memory;
- change the old memory before resolution and assert the stale decision is rejected;
- with global recall enabled, create a candidate without an override and assert it belongs to
  the current project;
- while working in this extension, return an evidenced Forgetful-project destination and assert
  overlap search and create both use Forgetful's project ID, without a permission prompt or a
  change to persisted recall scope;
- return an unknown target project and assert no write occurs in either project;
- emit the same settled turn twice and assert the durable capture watermark prevents repeat work;
- restart with a pending capture record and assert recovery processes the fixed snapshot once;
- open a fresh repository and assert global scope is used, then change the scope and revisit the
  repository to assert `.pi/forgetful/settings.json` restores the choice;
- request a scope override, assert authorization is required, and verify a declined request
  leaves the persisted scope unchanged;
- document, rather than deny, the accepted race/retry behaviour of query-before-create.

For the session handoff, verify that an escalation reaches the originating session at
the next user prompt without starting a turn itself; resolving a pending conflict uses the same
validated write path; unrelated conflict IDs and writes while capture is off are rejected; and
resolution messages do not recursively become new capture candidates.

Semantic classification, recall relevance, summary accuracy, semantic atomicity, novelty quality,
contradiction accuracy, project assignment quality, and duplicate prevention remain model or service
behaviour. Real-model evaluations can explore these; they are not deterministic regression claims.

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
- Global recall is the default; project recall remains strict when explicitly selected. Scope
  enforcement and returned-memory project filtering are treated as the existing Forgetful
  service contract rather than an extension-owned validation subsystem.
- Capture destinations default to the current project and may be changed per candidate by the
  agent based on the work; global recall does not make captured knowledge project-free.
- Clear, evidenced contradictions are resolved automatically by supersession. Uncertain cases
  use the main-model handoff and bounded resolver tool described above.
- Supersession preserves history but is a multi-step operation on the existing REST API.
  Partial outcomes and the remaining concurrent-write risk must stay visible in recorded state.
- Post-exit capture completion is deferred beyond MVP; the durable queue remains in scope.
