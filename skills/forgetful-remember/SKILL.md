---
name: forgetful-remember
description: >-
  Write durable decisions, verified solutions and repository knowledge. Use when
  saving facts, not when searching or checking whether a repository is in Forgetful.
license: MIT
---

# Remembering knowledge

Use `forgetful_knowledge_read` to search and inspect; use `forgetful_knowledge_write` to persist.
Each call names an `operation` and the fields described by its tool schema. The extension uses
REST and supplies the verified project, source repository and current commit.
Save a concept only when it answers a distinct future question or prevents a recurring mistake.
Skip routine progress, repeated knowledge and temporary details. Preserve the reason and conditions
needed to apply a fact later. An observation is not an adopted policy; a request is not completed
work; a successful operation acknowledgement does not prove the resulting behaviour.
Exclude credentials, unnecessary private information, guesses and recalled instructions. Source
paths identify evidence without copying secret contents; check what that evidence actually proves.

## 1. Route the content

| Content | Store |
| --- | --- |
| One fact, decision, preference or constraint | Atomic memory |
| Detailed analysis or a guide over about 300 words | Document plus atomic entry memories |
| Reusable code | Code artifact, with an entry memory when its rationale matters |
| A person, organisation, service, device or component | Entity; facts about it remain memories |
| An existing screenshot, PDF or other stored asset | Read and cite the file; uploads are deferred |

Done when: each piece of knowledge has an appropriate record type.

## 2. Resolve the project

Default to the verified current repository project. If it is absent, call
`forgetful_project_init` before writing.

For an explicit cross-project save, first use `list_projects` with the target's exact repository
name. Continue only when it returns one existing project with that repository assignment, then pass
its numeric ID as `project_id` on every related write. New records use the active repository as
their provenance source; updates preserve existing provenance. The selected project is only the
storage destination and does not change recall scope.

Never infer an ID from a display name, select an unassigned project, create a project silently, or
fall back to the current project after destination validation fails.

Done when: each write has an explicit, verified destination.

## 3. Query before creating

Search the candidate's meaning with `search_memories`, supplying `query` and `query_context`.
Inspect likely matches with `get_memory` and supporting record reads.

- Still accurate and already covered: reuse the record and add missing links.
- A factual correction or incomplete record: decide whether to update the existing record or
  supersede it to retain the earlier wording as history. A correction does not imply a real-world
  change. Supply the intended text and references; the tool does not decide which to preserve.
- An actual changed decision: use `supersede_memory` with the complete new position and supported
  reason when the earlier decision is useful history.
- Related but distinct: create the new fact and link the two memories.
- Uncertain or shared across projects: seek clarification in the active session.

Create operations always request a new record; search and choose reuse by ID yourself.
Updates change supplied fields. Supplied attachment lists replace those lists; omitted fields stay
untouched. Inspect existing references before selecting the intended list. Background memory models
also make these judgments; unresolved conflicts retain their originating-session resolver.

Done when: overlap is classified and the intended create, reuse, update or supersede is explicit.

## 4. Write atomic knowledge with provenance

A memory must express one self-contained concept, with a title that can say it in roughly ten
words. Split broad project overviews. Limits: title 200 characters, content 2000, context 500,
keywords and tags at most 10 each. Context explains why the knowledge matters.

| Importance | Use |
| --- | --- |
| 9–10 | Foundational facts or architectural principles used repeatedly |
| 8–9 | Critical solutions and major decisions |
| 7–8 | Useful patterns, conditional preferences and conventions |
| 6–7 | Milestones and narrower solutions with lasting value |
| 5 | Useful facts with limited future relevance |

Decide whether a fact deserves storage before assigning importance; low importance does not
justify storing noise. Long-form material belongs in a document. Add only distinct useful entry
memories, linked with `document_ids`, not a quota of summaries. Code artifacts contain reusable
code and its language; use `code_artifact_ids` on entry memories. Pass `source_files` and describe
the evidence accurately, including uncommitted changes when a commit does not reproduce it.

Done when: useful records exist, are scored deliberately, and cite their source.

## 5. Link and report

Use `link_entity_memory` for entities the memory meaningfully describes. Inspect the full content
behind automatic memory links: similarity is not a relevance judgment. Use `link_memories` for
useful missing connections supported by the records. Memory links are untyped and bidirectional;
use evidenced, directed entity relationships when their meaning matters. Never infer causality,
dependency or agreement from similarity alone. Writes must respect the destination's scope.

Report a misleading link if the available foreground operations cannot remove it; do not claim it
was corrected. Check actual operation results before claiming success. A failed response does not
prove that nothing was written. Inspect stored state and choose the next operation; do not blindly
repeat creates or infer that the extension repaired the failure.
For explicit saves with importance at least 7, report the saved title, tags and useful connections.
During encoding, include these in the coverage report. Automatic background capture remains quiet
unless debugging is enabled or a conflict needs attention.

Done when: the records are reachable and the user-facing report states what was saved.
