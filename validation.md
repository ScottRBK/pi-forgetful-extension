# Validation review

Pre-change automatic capture/recall rules, grouped to avoid repeating field checks.
The checked boxes record the approved changes; all 49 rules have been reviewed.
C17 and C20 include the safety clarifications agreed before implementation.
`REQUIRE` means reject if false. Limits below are current defaults, not recommendations.
These checks do not prove truth, relevance or whether a reason is convincing.
Scope excludes setup, HTTP response parsing, queue-file integrity and independent CLI/MCP tools.

Remove means let Forgetful validate these fields and return its errors, not accept invalid writes.
Server checks were verified in `~/development/ai/mcp/forgetful` at `65a3e95`, not a live deployment.
Forgetful can convert some types and clean list items; its acceptance is not identical to ours.
Rejected write fields must be correctable using Forgetful's actual error, not retried unchanged.
Completed writes and uncertain outcomes must stay protected across corrections and restarts.

## Both

**B1. Structured answers** — `src/model.ts:629–715`
`REQUIRE the correct submission tool and valid decision/evidence fields; see C3/C4/C9 for writes.`
Forgetful never receives these private submissions or the recall summary.
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

**B2. Submission attempts** — `src/model.ts:664–715`
`REQUIRE final decisions together in one tool call; allow correction; fail after 3 rejections.`
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

**B3. Private data** — `src/privacy.ts:3–61`
`REDACT recognised secret/personal-data patterns in model context and diagnostics.`
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

**B4. Model capacity** — `src/model-context.ts:172–239`
`REQUIRE image support when needed and room for input + reply; try compaction only if enabled.`
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

## Capture: proposed memories

**C1. Eligible conversation** — `src/snapshot.ts:274–337`; `src/queue.ts:975–996`
`SKIP if capture is off, no new completed answer exists, or the saved position is off-branch.`
`SKIP duplicate snapshots already queued/considered for the same session, branch and final entry.`
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

**C2. Candidate count and identity** — `src/capture.ts:505–509, 1378–1449`
`REQUIRE 0–3 proposed memories, each with a nonempty, unique candidate ID.`
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C3. Stored memory fields** — `src/capture.ts:424–450, 831–867`
`REQUIRE title/content/context strings; title/content not empty; max sizes = 200/2000/500.`
Server owns this: `app/models/memory_models.py:20–35`.
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C3b. Extra blank-text rejection** — `src/capture.ts:831–857`
`REJECT whitespace-only title/content/context and empty context.`
Forgetful's create model allows these; this is not a duplicate.
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C4. Stored lists and metadata** — `src/capture.ts:444–490, 882–902, 1345–1355`
`REQUIRE string lists; keywords/tags <= 10 each; importance = integer 1–10.`
`IF supplied: repo <= 200, URL <= 2048, encoding version <= 50 characters.`
Server owns this: `app/models/memory_models.py:37–103, 121–141`.
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C4b. Extra list/provenance restrictions** — `src/capture.ts:480–490, 882–902, 938–954`
`REQUIRE <= 20 file paths and nonblank list items; supplied repo/URL must not be empty.`
`REQUIRE supplied encoding version to be at least 7 hexadecimal characters (a Git commit).`
Forgetful has no file-count cap or commit pattern; it cleans blank list items instead of rejecting.
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C5. Evidence references** — `src/capture.ts:798–805, 838–865`; `src/snapshot.ts:314–316`
`REQUIRE 1–8 saved evidence IDs; exclude assistant text, memory operations and excluded entries.`
Keep [ x ]  Remove [ ]  Change [ ]  Change to:

**C6. Evidence type** — `src/capture.ts:798–819`
`userDecision: user entries only; verifiedToolChange: successful named tool results only.`
`observation: user or named tool entries; errors are allowed as observations.`
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C7. Private data in proposed writes** — `src/capture.ts:1325–1328, 2645–2660`
`REJECT a candidate containing recognised secret/personal-data patterns.`
`IF overlap results contain recognised sensitive data: skip the candidate.`
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C8. Destination project** — `src/capture.ts:2111–2136, 2226–2236`
`REQUIRE a resolved project; switching project also requires an existing project and a reason.`
Keep [ ]  Remove [ ]  Change [x]  Change to: i think we try to find a match and if the memory model
can not find one it just displays a warning to the user that one needs to be created.

**C9. Stored resource fields** — `src/capture.ts:383–423, 1015–1270`
`REQUIRE mandatory resource fields and their types; entity type Other needs custom_type.`
`Entity: name <= 200, notes <= 4000, tags/aliases <= 10; REQUIRE an allowed entity type.`
`Custom types and resource type/language labels <= 100; resource tags <= 10.`
`Document/code: title <= 500, description <= 5000, content <= 100000/50000 characters.`
Server owns this: `app/models/entity_models.py:47–155, 403–462`,
`document_models.py:24–113`, `code_artifact_models.py:25–113`.
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C9b. Resource batch limits** — `src/capture.ts:353–356, 492–503`
`REQUIRE <= 8 entities, 4 documents, 4 code artifacts, 12 relationships per candidate.`
These are capture limits, not Forgetful field limits.
Keep [ ]  Remove [ x ]  Change [ ]  Change to:

**C9c. Extra resource-field requirements** — `src/capture.ts:383–414, 1015–1153`
`REQUIRE explicit tags/aliases arrays; reject blank items and blank optional text when supplied.`
Forgetful defaults omitted arrays and cleans blank items; it allows some blank optional text.
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C10. Resource evidence and references** — `src/capture.ts:968–1004, 1238–1270`
`REQUIRE resource evidence to come from its candidate's evidence, with the same role checks.`
`REQUIRE relationships to name submitted entity keys.`
Keep [ ]  Remove [x]  Change [ ]  Change to:

## Capture: deciding what to save

**C11. Overlap decisions** — `src/capture.ts:528–585, 2793–2822`
`REQUIRE create / skip / supersede / escalate; in a batch, one decision per supplied candidate.`
`REJECT duplicate, missing or invented candidate IDs.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**C12. Existing-memory targets** — `src/capture.ts:2263–2317`
`REQUIRE skip targets and conflict IDs to be supplied overlap results.`
`REQUIRE exactly 1 conflict ID for supersede; at least 1 for escalate.`
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C13. Replacement/conflict explanation** — `src/capture.ts:2280–2307`
`REQUIRE old claim, new claim, reason, and nonempty evidence IDs from the candidate.`
`CHECK presence, not whether the claims truly contradict or describe the same fact.`
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C14. Reusing a sibling candidate** — `src/capture.ts:2751–2765, 3095–3112`
`REQUIRE skip + reason + an earlier candidate in the same project, without an existing-memory ID.`
`BEFORE reuse: require that sibling to have a saved memory in that project.`
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C15. Enrichment and resource reuse** — `src/capture.ts:2238–2261`
`REQUIRE enrichment to use skip with an explicit memory/sibling target.`
`REQUIRE selected resource keys to be proposed; reused IDs supplied; reuse keys not duplicated.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Keep the enrichment checks in the first rule.
Remove the resource selection/reuse validation in the second rule.

## Capture: reads and writes

**C16. Evidence history and reads** — `src/capture.ts:3268–3295`; `src/snapshot.ts:238–271`
`REQUIRE a pinned original entry, not a summary; offset >= 0; page size = 1–16000 characters.`
`Compaction requires a nonblank summary, known source boundary and unchanged remaining records.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**C17. Inspecting new sources** — `src/source-inspection.ts:96–150, 155–334`
`REQUIRE exactly one file or URL, valid paging and read permission; return UTF-8 text only.`
`Files must be regular, unchanged during reading and inside the trusted folder.`
`URLs must be HTTP(S), without credentials.`
`BLOCK private/reserved addresses, except explicit same-origin loopback; allow <= 5 redirects.`
`LABEL file bytes committed only if they match HEAD; otherwise modified, uncommitted or unknown.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Retain the read-only source interface and access
protections, including trusted-folder containment, private-network blocking and read permission.
Provenance labels describe observed bytes; candidate provenance restrictions are removed by C4b.

**C18. Write permission and scope** — `src/capture.ts:2026–2051`; `src/knowledge-write.ts:245–311`
`BEFORE writes: require capture enabled, auto mode and current write permission.`
`Resource writes require destination membership and a nonobsolete memory target.`
`DO NOT change document/code attachment lists on shared memories (knowledge-write.ts:550–556).`
Keep [ ]  Remove [ ]  Change [x]  Change to: Keep capture enablement, auto mode and write
permission.
Remove destination-membership and nonobsolete-target checks, and the shared-memory attachment block.

**C19. Resource write identity** — `src/knowledge-write.ts:314–345, 603–620, 755–768`
`REQUIRE valid project/memory IDs, operation ID and unique resource keys.`
`REQUIRE reused relationships to match both entity endpoints; saved receipts must match the plan.`
Keep [ ]  Remove [x]  Change [ ]  Change to:

**C20. Mutation retry safety** — `src/capture.ts:3470–3509, 3777–3782`
`DO NOT automatically repeat an uncertain write or a completed operation.`
`AFTER memory/resource failure: require an explicit retry/stop decision with a reason.`
`AFTER link failure: require a new link review; do not blindly repeat the failed operation.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Keep completed/uncertain-write duplicate protection.
Remove the extra retry/stop decision gate. Allow correction of rejected fields using the actual
Forgetful error, preserving completed receipts. Keep L7's link retry/deletion protections.

**C21. Capture retry budget** — `src/capture.ts:1846–1850, 2026–2030, 3899–3908`
`STOP at 4 charged model tasks; discard after 3 failed/permission-paused job attempts.`
`Preparation-only progress and ordinary cancellation do not spend those job attempts.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Keep the limits, but reset the model-task count to zero
on each job retry, giving it four tasks again. Keep the three-attempt limit and existing exemptions.

**C22. Conflict handoff** — `src/capture.ts:4225–4257`; `src/extension.ts:1405–1455`
`REQUIRE the conflict to belong to the active conversation branch before handing it to the agent.`
`ONLY mark handed_off after its notice is saved; this does not mean the conflict is resolved.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

## Capture: link reviews

**L1. Eligible links** — `src/capture-links.ts:129–164`
`SELECT <= 8 other full memory records; exclude shared, obsolete, sensitive and wrong-project ones.`
`RECORD missing (404), excluded and excess links as unreviewed; other read failures still fail.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**L2. Review identity and limits** — `src/capture-links.ts:62–79, 212–231`
`REQUIRE <= 3 reviews, unique known candidate IDs and <= 8 decisions per review.`
`Actions: keep / ignore / add / reject (remove link) / unresolved.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**L3. Complete coverage** — `src/capture-links.ts:167–187, 231`
`REQUIRE a review for every pending candidate and a decision for every selected memory.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**L4. Targets and reasons** — `src/capture-links.ts:170–176`
`REQUIRE unique target IDs from supplied full records, with nonblank, non-sensitive reasons.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Keep unique targets per review and nonblank,
non-sensitive reasons. Remove the requirement that targets come from supplied full records.

**L5. Conflicting commands** — `src/capture-links.ts:179–184`
`REJECT add(A,B) together with remove(B,A); these address the same bidirectional link.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**L6. Replacement attachments** — `src/capture-links.ts:190–209, 372–414`
`REQUIRE a preservation decision only when replacing; IDs must be unique and from supplied records.`
`LIMIT to 4 documents, 4 code artifacts, 8 entities; require a nonblank, non-sensitive reason.`
`IF preservation is unresolved: stop; BEFORE writes: recheck resource and memory scope.`
`Incomplete old-attachment coverage does not itself block replacement (lines 330–414).`
Keep [ ]  Remove [x]  Change [ ]  Change to:

**L7. Link mutation safety** — `src/capture-links.ts:239–294`
`BEFORE add/remove: recheck both memories are active and exclusive to the destination project.`
`SKIP completed operations; block uncertain receipts; skip DELETE if a fresh read proves no link.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Remove project exclusivity; allow shared memories that
include the destination project. Keep the active-memory check and all retry/deletion checks.

## Recall

**R1. Search plan** — `src/recall.ts:54–61, 407–455, 730–774`
`SKIP blank user prompts or search=false; otherwise REQUIRE 1–2 nonblank queries and an intent.`
`REQUIRE <= 10 nonblank entity names; optional project ID positive; repository flag boolean.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R2. Project selection** — `src/recall.ts:1205–1248, 1319–1367`
`USE configured scope; in project mode REQUIRE a valid, unambiguous mapping or supplied selection.`
`IF switching from the current project: REQUIRE approval; global scope stays global.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R3. Initial record filtering** — `src/recall.ts:460–489, 805–808`; `src/knowledge-read.ts:65–113`
`DISCARD malformed memories/entities/relationships; REQUIRE valid IDs/types and selected scope.`
`Initial memory retrieval excludes obsolete records; explicit reviewer reads may return them.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R4. Following links** — `src/knowledge-read.ts:248–477`; `src/knowledge-tools.ts:649–957`
`RECHECK fetched records stay in scope; relationships require permitted endpoints.`
`SKIP unavailable optional enrichment rather than failing the whole recall.`
`CAP: 6 entities, 12 relationships, 3 attachments/type; 4 memory leads/entity, 12 leads total.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R5. Memory-search fields** — `src/knowledge-tools.ts:318–328`
`REQUIRE query/intent strings with length >= 1; k = 1–20; links per result = 0–10.`
Server owns this: `app/models/memory_models.py:370–405`.
Keep [ ]  Remove [x]  Change [ ]  Change to:

**R5b. Local read controls** — `src/knowledge-tools.ts:318–371`; `src/recall.ts:885–933`
`ALLOW stored Forgetful reads only; REQUIRE operation-specific IDs and nonblank search text.`
`REQUIRE boolean include_links; memory search uses k, not limit/offset.`
`Local pages: lists <= 100, offsets = 0–10000000, text <= 5000 characters.`
Local paging is not the server's paging; server include_links is an integer, not our boolean.
Keep [ ]  Remove [ ]  Change [x]  Change to: Remove checks already enforced by Forgetful.
Keep only extension-specific checks, including read-only tool access and local paging.
Return Forgetful's validation errors to the model.

**R6. Citation eligibility** — `src/recall.ts:822–823, 903–933, 1140–1155`
`ADD IDs from delivered records/pages; memory titles alone do not qualify.`
`EXCEPTION: automatic file metadata can qualify; explicit image/binary reads add no new file IDs.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R7. Summary and reason sizes** — `src/recall.ts:622–626`
`REQUIRE summary text <= 3000 characters and a nonblank reason <= 500 characters.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R8. Citation references** — `src/recall.ts:627–640`
`REQUIRE unique integer IDs from currently available sources, in the correct source category.`
`memoryIds must be an array; omitted optional source arrays mean empty, not null.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R9. Summary/source agreement** — `src/recall.ts:641–643`
`REQUIRE a nonempty summary to have sources; an empty summary must have no sources.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R10. Failed review** — `src/recall.ts:940–1022`
`IF planning/review fails: inject no retrieved facts; never substitute raw search results.`
Keep [x]  Remove [ ]  Change [ ]  Change to:

**R11. Deadline and repeated failures** — `src/recall.ts:719–736, 1385–1402`
`STOP on cancellation/deadline (default 10 seconds); after 3 failures, pause recall for 5 seconds.`
Keep [ ]  Remove [ ]  Change [x]  Change to: Set the overall recall deadline to 30 seconds by
default.
Keep cancellation and the five-second pause after three failures unchanged.
