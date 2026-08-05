# Seamless Forgetful memory for Pi

## Decision

Build a Pi extension that makes Forgetful recall and capture automatic by default while
remaining silent, configurable, bounded, and failure-open.

The first vertical slice includes both recall and conservative automatic capture.

## User experience

During normal work, the user enters ordinary Pi prompts. They do not invoke memory commands.

The extension:

1. sends each new user prompt to a user-selected existing Pi model;
2. receives a validated plan stating whether and how to search Forgetful;
3. performs bounded retrieval against a warm Forgetful service;
4. injects the strongest context into the current turn's system prompt;
5. leaves memory IDs, entity names, and topic leads for deeper exploration;
6. exposes one bounded, read-only recall tool to the main agent;
7. evaluates completed work for durable knowledge after `agent_settled`;
8. checks for overlap, then quietly creates only novel, high-confidence memories.

Memory failure must never block the user's task.

## Pi feasibility

Pi 0.83.0 provides the required extension seams:

- `before_agent_start` can modify the system prompt for the current turn;
- `agent_settled` runs after retries, compaction, and queued continuation have stopped;
- `ctx.modelRegistry` exposes configured models and resolved authentication;
- `ctx.scopedModels` supports a model picker consistent with the user's Pi configuration;
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
2. Send every other prompt to the configured Pi planner model.
3. Validate a bounded response containing:
   - `search`: boolean;
   - one or two topic queries;
   - query intent;
   - zero or more entity names;
   - a project/global scope hint.
4. Enforce the user's configured scope ceiling.
5. Search a warm Forgetful HTTP service.
6. Inject only the strongest results and short deeper-search leads.
7. Let the main agent call a read-only `forgetful_recall` tool when it needs more detail.

Retrieved memory is untrusted historical context, never executable instruction.

## Scope

Strict repository project scope is the default. Cross-project recall and capture must be easy
to enable for the current session or persistently:

```text
/forgetful scope project
/forgetful scope global
```

Debug output always shows the effective scope.

## Capture flow

Capture is scheduled after Pi emits `agent_settled`. This event means Pi has finished the
agent run and will not automatically continue through retries, compaction retries, or queued
follow-ups. It does not itself mean the work succeeded, so the extension must inspect the final
assistant message and skip capture when its stop reason is error or aborted.

1. Read only conversation messages added since the last capture watermark.
2. Ask the selected Pi model for zero to three atomic, evidenced candidates.
3. Apply deterministic structural and sensitive-data validation to its response.
4. Query Forgetful for overlap for each accepted candidate.
5. Give the candidate and overlapping memories to the selected model for `create` or `skip`.
6. Execute the model's validated decision through the Forgetful API.
7. Never update or obsolete an existing memory automatically.
8. If the decision is malformed or uncertain, skip the write.

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

Policy files append to the built-in contract. They cannot replace protected schemas, safety
rules, bounds, or scope ceilings.

Proposed management commands:

```text
/forgetful prompts
/forgetful prompt edit classification
/forgetful prompt edit recall
/forgetful prompt edit capture
/forgetful prompt test classification
```

## Default and debug modes

The default mode is silent:

- no memory messages in conversation history;
- no success or empty-result popup;
- optional transient footer status only;
- compact rendering for agent-initiated deeper recall.

Debug mode may show:

- selected planner model;
- prompt-policy sources and hashes;
- planner input and validated output;
- effective project/global scope;
- Forgetful queries and timings;
- injected memory IDs and token count;
- capture candidates and create/skip reasons.

Prompt and memory content is not persisted in logs unless the user explicitly opts in.

## Latency

Latency is a product acceptance criterion. Measure:

- planner model time;
- Forgetful search and rerank time;
- total memory preflight time;
- main-agent first-token time with the extension on and off;
- timeout rate and plan-cache hit rate.

Initial SLO candidates to validate:

- warm preflight p50 below 700 ms;
- warm preflight p95 below 1.5 seconds;
- hard fail-open timeout around 2 seconds.

The benchmark matrix covers every supported planner model, warm and cold service state,
search false, search hit, search miss, two-query plans, and local versus remote service.

## Transport

Use a warm Forgetful HTTP service and its REST search endpoint. Calling the local CLI for every
prompt rebuilds the Python runtime and embedding model, which is unsuitable for this latency
budget.

The extension should use Node's built-in `fetch`, avoiding a new runtime dependency. Managed
local service startup can be considered separately after the basic HTTP path is proven.

## Failure behavior

- planner unavailable or timed out: continue without memory;
- Forgetful unavailable or timed out: continue without memory;
- malformed planner output: reject it and continue without memory;
- repeated failures: open a short-lived circuit breaker;
- capture failure: retain no partial write and retry only on a later safe checkpoint;
- project cannot be resolved in project mode: skip rather than search globally.

## Delivery slices

1. Model planner, silent recall injection, and agent-followable recall tool.
2. Conservative automatic capture with overlap checking.
3. Global and trusted-project prompt policy overlays.
4. Debug, model, enablement, and scope controls.
5. Real-provider latency and capture-quality tuning.

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
6. **Configuration seam**: toggles, model selection, prompt overlays, and scope take effect.
7. **Failure seam**: timeout, malformed output, and service failure do not block Pi.
8. **Privacy seam**: temporary context is not added as a visible or persistent session message.
9. **Latency seam**: first-token overhead and stage timings meet the agreed SLO.

A black-box test can use Pi's faux model to supply predetermined decisions and a real throwaway
Forgetful SQLite service. This tests the complete mechanism without pretending to test model
intelligence. For example:

- seed a memory, return a planner decision that queries it, and assert the main model receives
  that memory in its temporary system prompt;
- return a capture candidate and `create`, then assert the expected memory exists through the
  Forgetful API;
- pre-seed an overlapping memory, return `skip`, and assert the memory count is unchanged;
- emit the same settled turn twice and assert the capture watermark prevents repeat work.

Semantic classification, semantic atomicity, and novelty quality remain model behavior. They
can be explored with real-model evaluation scenarios, but are not deterministic regression
claims.
