# Recall submission acceptance — 2026-09-11

## Scope

Tested this checkout against Pi 0.85.1 and the configured memory model,
`opencode-go/deepseek-v4.1-flash`. Both configured deadlines were 20,000 ms.
No dependencies were installed or upgraded. No production memories were written.

The live harness uses real provider requests and real Forgetful REST routes against an isolated
SQLite database. Embeddings are fixed test vectors, so this tests review and submission behaviour,
not production search ranking. Fixtures cover useful facts mixed with unrelated results, no useful
results, and useful but incomplete evidence. The private review conversation is not Pi history.

## Final live batch

- 33 ordinary runs requested: 32 reached review and all 32 submitted successfully on the first try.
- One full-flow case returned `search:false` from the planner. Its assertion failed before review
  ran. This is a recorded acceptance limitation, not a submission failure or a passing test.
- 3 deliberate unknown-ID submissions: all corrected on the second attempt.
- 2 deliberate non-empty no-results summaries without sources: both corrected to empty context on
  the second attempt, rather than citing an irrelevant memory to satisfy validation.
- 1 deliberate text-only response: corrected to a proper tool submission on the second attempt.
- 47 genuine provider calls, including three full-flow planning calls and six correction calls.
- Ordinary review-only elapsed time: 1,478–3,940 ms; median 2,095 ms.
- No spontaneous tool rejections, review timeouts, or checked quality failures in this batch.

Deliberate faults are applied after a genuine model response. The following genuine provider call
must receive the rejection reason and produce a valid correction. Invalid calls receive tool errors;
text-only replies receive a correction message. These are not counted as spontaneous failures.
The assertions check selected IDs, key facts, empty results, and exclusion of unrelated fixture
details; they do not prove every semantic nuance of a summary.

These are small, repeated synthetic cases on one model. They are not a production failure-rate
estimate or a claim that other providers are validated. Full-flow cases use a short classification
policy in the harness, not the complete extension policy. The planner no-search result does not
by itself establish a production planner regression. Classification remains outside this change.

## Earlier failures and changes

The initial 18 ordinary runs had five summary-quality failures, one timeout, and two planner
no-search decisions. There was one natural summary/source mismatch; its retry incorrectly cited
an irrelevant source to preserve a no-results sentence. All three deliberate bad-ID cases recovered.

The tool protocol alone did not fix relevance. Field descriptions and examples now explicitly put
no-results explanations in `reason`, leave `summary` empty, and forbid adding irrelevant IDs to
satisfy validation. The full-planner question was clarified to ask about a prior decision.
A subsequent 18-run ordinary batch passed, followed by a 33-run ordinary batch with five recovered
faults (46 provider calls). The final follow-up batch above also exercised text-only correction.

Parent regression checks exposed hidden adapter-level rejections in debug output, a missing
response-size bound, and loss of rejected arguments from correction history. Tests reproduced each
before correction. Schema errors now retain bounded redacted debug evidence too. Domain validation
checks original tool arguments so Pi's optional-null/type coercion cannot bypass existing rules.

## Grok review

Grok's re-review reported no must-fix bugs against the hardened implementation. It verified private
tool visibility, no JSON-text fallback, bounded retries, returned rejection reasons, scope checks,
debug counts, response bounds and redacted correction history.

Two suggestions were considered:

- Keep strict original ID validation, but clarify malformed-array errors. Implemented and tested:
  ID fields must be integer arrays, not null or strings; use `[]` for no sources.
- Add an assistant placeholder between user messages on text-only retries. Not adopted: Context7's
  official Anthropic SDK documentation says consecutive user/assistant turns are combined. The
  suggested Anthropic 400 error was not established. The final live text-only correction succeeded
  on the configured OpenCode model; no live Anthropic compatibility claim is made.

No SonarQube scan was requested or run for this change.

## Pi TUI and regression checks

The isolated tmux run loaded this checkout explicitly, used synthetic memories, and disabled
capture. It displayed `Review attempts: 1`, the relevant facts, and `PI_REVIEW_TOOL_OK`.
Automatic recall took 4,042 ms in the final TUI run. Temporary sessions and servers were removed.
An earlier TUI attempt stopped at a legitimate scope-override approval dialog; the rerun explicitly
requested global, cross-project recall rather than bypassing approval.

- `npm run check`: 265 passed, 31 skipped (30 optional REST tests and the paid live test).
- Serial suite with `FORGETFUL_TEST_SOURCE`: 295 passed, only the paid live test skipped.
- Paid final batch: 38 scenario subtests passed; one failed at planning, also failing its parent.
- Real Pi SDK HTTP test confirms tool schemas and matching error tool-call IDs reach the provider.
- Privacy integration checks keep correction evidence out of main-model context and session
  history, while allowing redacted evidence in the private review retry conversation.

An earlier parallel full REST suite stalled and was stopped after 210 seconds. The same complete
suite passed serially; the normal non-REST `npm run check` also passed. No claim is made that the
parallel REST stall was diagnosed or fixed.

## Reproduce and inspect

See [live check instructions](../CONTRIBUTING.md#live-recall-submission-checks).
Local artifacts, deliberately ignored by Git:

- `test-results/recall-submission-live.json`: final counts, responses, feedback and traces.
- `test-results/recall-submission-live-before-refinement.json`: initial failures.
- `test-results/recall-submission-live-refined-first-batch.json`: first refined batch.
- `test-results/recall-submission-pre-review-batch.log`: the passing 33-run ordinary batch.
- `test-results/recall-submission-tui.txt`: final TUI capture.
- `test-results/recall-submission-tui-scope-dialog.txt`: initial approval-dialog run.
- `test-results/grok-recall-submission-review.md`: Grok's full review.
