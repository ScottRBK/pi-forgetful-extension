# Memory quality: capture, connections and recall

The goal is a useful handover after the conversation is gone: the relevant fact, its reason,
conditions and current status. Storage volume and valid source IDs are not quality measures.

## Division of responsibility

The model requests explicit operations. Tools check arguments, project access and write enablement,
call Forgetful, and report what happened. Code does not judge whether a correction is a policy
change, choose which references still apply, or substitute another operation.

- Creates request new records. Reuse requires a model-selected existing ID, not name matching.
- The model supplies complete replacement claims and selects applicable references. Empty reference
  selections do not inherit the predecessor's references.
- Foreground updates apply supplied fields. Supplied attachment lists replace those lists; omitted
  fields remain untouched. Supersession is a deliberate choice to retain the earlier record.
- Scope, supplied IDs, evidence roles, field limits and write enablement remain enforced.
- Skills guide the main agent. Automatic capture and recall have separate private prompts.

A valid source ID proves provenance, not that a sentence follows from it. Semantic accuracy still
needs assessment of actual output. Automatic recall accepts memory citations only when full memory
content was supplied. Entity-linked titles are navigation leads, not claim evidence. Repository
selection follows the model's explicit choice; configured recall scope remains authoritative.

## Connected capture and execution

Capture extracts up to three candidates, obtains model overlap decisions, executes them, then asks
about a bounded neighborhood of stored connections. Overlap can select exact existing resources
and earlier equivalent candidates. `skip` does no enrichment unless the model explicitly requests
it. Entity-memory links require selected keys. Code does not turn supersede into escalation
because of a partial flag or changed prose. Unsupported argument combinations return validation
feedback rather than a substituted decision.

Memory links are untyped and bidirectional; entity relationships have a type and direction. Models
can explicitly keep, add or remove supplied in-scope connections. `keep` and `ignore` perform no
mutation. Historical links are not immune to an explicit removal, and an automatic link is not
proof of relevance. Unknown, unavailable and out-of-scope records remain reported as unreviewed.

Both ordinary and partial conflict resolution ask the model for the complete replacement and its
reference selections. There is no blanket copy of predecessor attachments, new arrivals or source
metadata. The service may itself add similarity links when creating a memory; explicit link
additions do not promise an exact final graph or authorize pruning unseen service-created links.

Changed resolution evidence or reason requires a new model decision. It sees the previous accepted
request, actual replacement, completed operations and errors, then chooses whether to update the
replacement or create another. Unchanged requests resume unfinished operations.

Durable receipts record completed operations. They do not mean “enforce this graph forever.” If
someone later changes an edge or attachment, resuming a completed operation does not restore it.
A failed automatic operation is returned to the model before deciding to retry or stop. A revised
connection decision is also made by the model, with the actual failure and completed receipts.
When the remaining budget is exhausted, work remains incomplete; code does not repair the plan.
Unknown create outcomes cannot be reconciled by matching names or silently repeating the create.
An explicit automatic retry can repeat an unknown create; the model is told that the earlier request
may already have succeeded. No duplicate-prevention guarantee follows. Rich-write receipts are
bound to their exact instruction; changed plans must not silently inherit an old completion.
Foreground failures return to the calling model for its next decision.

Limits remain three candidates, four durable model tasks, 15 seconds per task and three submission
attempts sharing that deadline. Correction attempts can make the provider-call count higher than
the task count. No stored field, item, timeout or response limit was changed.

Permission callbacks run before final authorization reads. A synchronous guard checks cancellation
immediately before mutation. Pi supplies live trust, enablement and capture-mode state. Other
callers with async permission callbacks must supply `canWriteNow` or call `stop()` for revocation
within those final reads. Separate REST calls are not atomic, and the service has no create
idempotency key. These are transport limits, not permission to invent a successful outcome.

## Repeatable checks

Normal regression checks make no paid model calls:

```bash
npm run check
```

Real REST integration uses an isolated SQLite fixture in the supplied Forgetful checkout. It does
not connect to the configured live database. Run serially to avoid competing fixture processes:

```bash
FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test --test-concurrency=1 test/*.test.ts
```

Two new opt-in evaluations use the configured Pi cloud memory model and normal authentication.
They install nothing and save evidence outside the repository by default:

```bash
FORGETFUL_LIVE_QUALITY=1 \
  node --import tsx --test test/live-memory-quality.test.ts

FORGETFUL_LIVE_CONNECTED_QUALITY=1 FORGETFUL_TEST_SOURCE=/path/to/forgetful \
  node --import tsx --test test/live-connected-memory-quality.test.ts
```

The recall evaluation exercises planning and review on fixed search results. Its spending cap is
48 provider calls. Optional `FORGETFUL_QUALITY_BASELINE` names a frozen source tree containing
`src/recall.ts`, `src/model.ts` and `src/policies.ts`, with its dependencies resolvable. It compares
that variant with current production wording. `FORGETFUL_QUALITY_VARIANT=baseline` or `current`
selects one variant. `FORGETFUL_QUALITY_REPORT` chooses the output path.

The connected evaluation has a 36-provider-call safety cap. It sends synthetic settled sessions
through actual capture, isolated REST storage and fresh recall without the original conversation.
`FORGETFUL_CONNECTED_QUALITY_REPORT` chooses its output path. Fixed fixture embeddings exercise
storage and model judgments, not production search ranking. A fresh RecallService is not a full Pi
main-agent answer evaluation.

These call caps bound test spending; they do not change production budgets. Neither harness sends
its assessment rubric to the model. Both retain actual output for human assessment. A harness pass
checks mechanics and selected sources, not every claim's truth or usefulness.

## Assessment

Review each delivered claim against the supplied evidence and current conversation:

- Did it preserve the useful fact, reason, conditions and actual adoption/verification status?
- Did it import an unrelated rule, infer missing history, or repeat already-known information?
- Did an unchanged fact create a duplicate? Were useful connections kept without inventing edges?
- After an interruption, do stored records and review receipts agree?
- Did useful context actually arrive within existing deadlines?

Use different subjects, preferences, investigations, decisions, history transitions and irrelevant
near matches. Include partially useful evidence and supported cross-project dependencies, so
selectivity does not become silence. Keep semantic judgment tests separate from deliberately broken
submission/retry tests. Re-run representative cases when changing model, provider or SDK.

## Findings from this review

The first broader recall baseline missed a conditional preference and repeated known token facts.
Expanded reviewer wording recovered the preference but produced more rejection commentary and source
inventories. Those expanded prompts were rejected. The retained reviewer keeps the existing contract
with a narrow change to omit already-known facts; the planner asks for the missing historical gap.
No scenario-specific classifier or summary-cleanup regex was added. Neither production model
selection nor user configuration was changed.

In one 12-case run, the retained version delivered the required sources and passed the explicit
fixture checks, including known-context omission, partial history and stored directives. Some
outputs still contained redundant qualifications, and “no verified fix” became “no known fix.”
This is not a claim that context noise or semantic mistakes have been eliminated.

The final seven-case connected retest used 26 provider calls, stored nine memories and delivered
all six attempted fresh recalls. A routine request correctly produced no capture. The model
correctly distinguished a corrected stock-count assertion from a genuine payment-alert decision
change. These two added cases were revision checks, not blind heldouts.

Manual review found two fidelity/provenance failures, two qualified results and two noisy passes,
plus the correct no-capture case. Assistant-only warmup-disabling and implementation-status details
still entered stored content and recall. Unsupported absence claims and broadened preference scope
remain. Required core facts and source-ID checks passed; that does not make extra claims accurate.

One new memory had a complete connection review; eight retained an out-of-scope automatic link
explicitly marked unreviewed. The payment-alert decision and pending deployment were stored
separately and both reached recall. They were not linked to each other, and the decision memory
alone omitted its pending-deployment qualification. Successful delivery in this one run does not
establish reliable history reconstruction or lower noise. No timeouts or correction retries were
observed; execution-retry behavior was tested separately with scripted provider responses.

Capture still sees successful edit/write result text without the corresponding tool arguments.
An acknowledgement alone cannot establish implementation details. Better wording cannot recover
missing evidence; changing admitted evidence needs a separate, scoped design and evaluation.

Earlier cloud screening found no alternative that demonstrated faster, reliable delivery on the
copied real corpus. Keep the configured model as a baseline; do not switch based on a fast synthetic
case alone. Single runs and small screens do not establish reliability, causal latency improvements
or production percentiles. Qualify capture, overlap, connections and delivered recall together.

The next acceptance gate is claim fidelity, not another instruction rewrite justified only by
schema passes. Compare supported facts and useful omissions across new subjects before promoting
this checkout to daily use. A connected graph cannot compensate for an inaccurate stored claim.

## Validation of this change

- Frozen execution-boundary run: `npm run check` passed with 383 tests and 219 opt-in skips.
- Complete serial isolated REST run: 624 passed, four paid-model opt-ins skipped, zero failures
  or cancellations. Nine core source hashes matched before and after both runs.
- The earlier full run exposed one obsolete Pi trust-test timing trigger: it waited for a second
  authorization read removed with graph repair. The fixture now revokes trust in the actual final
  endpoint read, retaining the zero-unauthorized-writes assertion. The complete repeat passed.
- A later lifecycle probe reproduced a separate foreground write during shutdown/navigation drain.
  The final synchronous check now rejects a stopping runtime, even while other accepted work is
  still draining. After this one-condition change, both new regressions passed; `npm run check`
  passed with 385 tests and 219 skips; six affected Pi integration files passed all 34 tests with
  isolated REST enabled. The complete 624-pass REST run above predates this final guard change.
- Local TUI smoke loaded this checkout explicitly in Pi 0.87.1 and displayed the disabled status.
  It used no credentials, model prompts or service traffic; its tmux session and workspace were
  removed.

The real Pi fixtures exercise batch and link submissions, stored-record readback, foreground
resolution and shutdown. Accepted capture/resolution work is drained before cleanup, so receipts
cannot arrive after the queue directory is removed. Teardown tests keep their original deadlines;
held external responses are released before awaiting the drain.

Tests establish argument/access checks and execution behavior, not model judgment quality. The
seven-case paid-model result above is assessed separately. Separate REST operations remain
non-atomic, and a lost creation response remains ambiguous. Nonempty legacy rich-write receipts
without an instruction identity are retained for explicit review, not silently rebound or replayed.
