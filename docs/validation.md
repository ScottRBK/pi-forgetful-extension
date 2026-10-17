# Automatic memory validation

Current capture and recall checks. Original rule IDs are kept for reference.
`REQUIRE` means reject if false. Limits are defaults. These checks cannot prove truth or relevance.
Forgetful validates stored fields and server-owned search fields; its errors return to the model
for correction. Setup, HTTP response parsing, queue-file integrity and independent CLI/MCP access
are outside this list.

## Both

**B1. Structured answers** (`src/model.ts:629-639`)
`REQUIRE the correct submission tool and valid private decision/evidence fields.`
`DO NOT parse JSON text as a fallback submission.`

**B2. Submission attempts** (`src/model.ts:664-715`)
`REQUIRE one final submission tool call per model task; fail after 3 rejected submissions.`
`ALLOW separate read-only tool calls without spending that correction allowance.`

**B3. Private data** (`src/privacy.ts:3-61`)
`REDACT recognised secret/personal-data patterns in model context and diagnostics.`

**B4. Model capacity** (`src/model-context.ts:172-239`)
`REQUIRE image support when needed and room for input + reply; compact only if enabled.`

## Capture: proposed memories

**C1. Eligible conversation** (`src/snapshot.ts:274-337`; `src/queue.ts:972-995`)
`SKIP if capture is off, no new completed answer exists, or the saved position is off-branch.`
`SKIP duplicate snapshots for the same session, branch and final entry.`

**C5. Evidence references** (`src/capture.ts:579-595`; `src/snapshot.ts:314-316`)
`REQUIRE 1-8 saved evidence IDs; exclude assistant text, memory operations and excluded entries.`

**C8. Destination project** (`src/capture.ts:1359-1371`; `src/extension.ts:2465-2481`)
`USE the current project unless the model selects another matching existing project ID/name.`
`IF no project matches: skip the candidate and warn that a project needs creating.`

## Capture: deciding what to save

**C11. Overlap decisions** (`src/capture.ts:801-815, 1955-1980`)
`REQUIRE create / skip / supersede / escalate; in a batch, one decision per supplied candidate.`
`REJECT duplicate, missing or invented candidate IDs.`

**C15. Enrichment** (`src/capture.ts:1472-1480`)
`REQUIRE enrichment to use skip with an explicit memory or sibling-candidate target.`

## Capture: reads and writes

**C16. Evidence history and reads** (`src/capture.ts:2428-2455`; `src/snapshot.ts:238-271`)
`REQUIRE a pinned original entry, not a summary; offset >= 0; page size = 1-16000 characters.`
`Compaction requires a nonblank summary, known source boundary and unchanged remaining records.`

**C17. Inspecting new sources** (`src/source-inspection.ts:96-334`)
`REQUIRE exactly one file or URL, valid paging and read permission; return UTF-8 text only.`
`Files must be regular, unchanged during reading and inside the trusted folder.`
`URLs must be HTTP(S), without credentials; validate addresses and redirects.`
`BLOCK private/reserved addresses except explicit same-origin loopback; allow <= 5 redirects.`
`LABEL file bytes committed only if they match HEAD; otherwise modified, uncommitted or unknown.`

**C18. Write permission** (`src/capture.ts:1268-1293`)
`BEFORE writes: require capture enabled, saved and current auto mode, and live write permission.`

**C20. Mutation retry safety** (`src/capture.ts:1490-1530, 2627-2694`)
`SKIP completed writes; block replay when a dispatched write's outcome is uncertain.`
`ALLOW correction of definite HTTP 400/422 rejections using the actual Forgetful error.`
`KEEP completed receipts across correction/restart; do not retarget protected writes.`
`A permission pause before dispatch can retry; it is not an uncertain write.`

**C21. Capture retry budget** (`src/capture.ts:1274-1278`; `src/queue.ts:1263-1268, 1305-1347`)
`ALLOW 4 charged model tasks per attempt; reset that count when retrying a failed job.`
`DISCARD after 3 failed/permission-paused attempts.`
`Preparation yields and ordinary cancellation spend no job attempt and do not reset task counts.`

**C22. Conflict handoff** (`src/extension.ts:1405-1455`)
`REQUIRE the conflict to belong to the active conversation branch before handing it to the agent.`
`ONLY mark handed_off after its notice is saved; this does not mean the conflict is resolved.`

## Capture: link reviews

**L1. Automatic read bounds** (`src/capture-links.ts:134-170, 321-376`)
`SELECT <= 8 other full memory records; exclude obsolete and sensitive ones.`
`GLOBAL scope allows cross-project/shared endpoints; PROJECT selects destination-exclusive records.`
`RECORD missing (404), excluded and excess links as unreviewed; other read failures still fail.`
`READ <= 4 documents, 4 code artifacts and 8 entities for predecessor context; flag gaps.`
These read bounds do not limit the model's attachment selections.

**L2. Review identity and limits** (`src/capture-links.ts:67-85, 199-220`)
`REQUIRE <= 3 reviews per submission, unique known candidate IDs and <= 8 decisions per review.`
`Actions: keep / ignore / add / reject (remove link) / unresolved.`

**L3. Complete coverage** (`src/capture-links.ts:194-219`)
`REQUIRE a review for every candidate in the task and a decision for every selected memory.`

**L4. Targets and reasons** (`src/capture-links.ts:67-72, 173-185`)
`REQUIRE positive integer target IDs, unique per review, with nonblank, non-sensitive reasons.`
`ALLOW additional targets that were not in the supplied full records.`

**L5. Conflicting commands** (`src/capture-links.ts:186-191`; `src/capture.ts:2922-2935`)
`REJECT add(A,B) together with remove(B,A), including across review chunks.`
These commands address the same bidirectional link.

**L7. Link mutation safety** (`src/capture-links.ts:227-305`)
`BEFORE add/remove: recheck both memories are active; saved memory must include its destination.`
`PROJECT also requires target membership in the destination; GLOBAL allows cross-project links.`
`USE queued snapshot scope; allow shared explicit targets.`
`SKIP completed operations and block uncertain receipts.`
`SKIP DELETE if a fresh read proves the link is absent; do not hide server failures.`

## Recall

**R1. Search plan** (`src/recall.ts:54-61, 408-458, 720-775`)
`SKIP blank user prompts or search=false; otherwise REQUIRE 1-2 nonblank queries and an intent.`
`REQUIRE <= 10 nonblank entity names; optional project ID positive; repository flag boolean.`

**R2. Project selection** (`src/recall.ts:1210-1243, 1320-1369`)
`USE configured scope; in project mode REQUIRE a valid, unambiguous mapping or supplied selection.`
`IF switching from the current project: REQUIRE approval; global scope stays global.`
`IF no project match exists in project mode: skip recall, never fall back to global search.`

**R3. Initial record filtering** (`src/recall.ts:461-490`; `src/knowledge-read.ts:65-113`)
`DISCARD malformed memories/entities/relationships; REQUIRE valid IDs/types and selected scope.`
`Initial memory retrieval excludes obsolete records; explicit reviewer reads may return them.`

**R4. Following links** (`src/knowledge-read.ts:248-477`; `src/knowledge-tools.ts:620-919`)
`RECHECK fetched records stay in scope; relationships require permitted endpoints.`
`SKIP unavailable optional enrichment rather than failing the whole recall.`
`CAP: 6 entities, 12 relationships, 3 attachments/type; 4 memory leads/entity, 12 leads total.`

**R5b. Local read controls** (`src/knowledge-tools.ts:293-327`)
`ALLOW stored Forgetful reads only; keep configured scope.`
`REQUIRE boolean include_links; memory search uses k, not limit/offset.`
`Local pages: lists <= 100, offsets = 0-10000000, text <= 5000 characters.`

**R6. Citation eligibility** (`src/recall.ts:824-826, 904-938, 1145-1161`)
`ADD IDs from delivered records/pages; memory titles alone do not qualify.`
`EXCEPTION: automatic file metadata can qualify; explicit image/binary reads add no new file IDs.`

**R7. Summary and reason sizes** (`src/recall.ts:624-627`)
`REQUIRE summary text <= 3000 characters and a nonblank reason <= 500 characters.`

**R8. Citation references** (`src/recall.ts:628-640`)
`REQUIRE unique integer IDs from currently available sources, in the correct source category.`
`memoryIds must be an array; omitted optional source arrays mean empty, not null.`

**R9. Summary/source agreement** (`src/recall.ts:642-644`)
`REQUIRE a nonempty summary to have sources; an empty summary must have no sources.`

**R10. Failed review** (`src/recall.ts:943-1023`)
`IF planning/review fails: inject no retrieved facts; never substitute raw search results.`

**R11. Deadline and repeated failures** (`src/config.ts:9-10, 392-406`; `src/recall.ts:1386-1401`)
`STOP on cancellation/deadline; overall recall and recall wait default to 30 seconds.`
`AFTER 3 failures: pause recall for 5 seconds.`
HTTP requests default to 10 seconds; explicit `timeout_ms` overrides both HTTP and overall recall.
