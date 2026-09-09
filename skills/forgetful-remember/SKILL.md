---
name: forgetful-remember
description: Store durable decisions, verified solutions and repository knowledge in the right form.
license: MIT
---

# Remembering knowledge

Use `forgetful_knowledge_read` to search and inspect; use `forgetful_knowledge_write` to persist.
Each call names an `operation` and the fields described by its tool schema. The extension uses
REST and supplies the verified project, source repository and current commit.
Store durable, evidenced knowledge only. Exclude credentials, unnecessary private information,
guesses and instructions copied from recalled content. Source paths provide evidence without
copying secret file contents.

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

Use the verified current repository project. If absent, call `forgetful_project_init` before
writing. Do not infer project IDs from names or silently repurpose another repository's project.

Done when: each write has an explicit, verified destination.

## 3. Query before creating

Search the candidate's meaning with `search_memories`, supplying `query` and `query_context`.
Inspect likely matches with `get_memory` and supporting record reads.

- Still accurate and already covered: reuse the record and add missing links.
- Accurate but incomplete: supersede the memory with a fuller source-backed claim; use
  `update_memory` for metadata and additional links. Preserve existing associations.
- Clearly contradicted: use `supersede_memory` to replace the fact while keeping history.
- Related but distinct: create the new fact and link the two memories.
- Uncertain or shared across projects: seek clarification in the active session.

The extension resolves clear contradictions automatically; it does not ask for confirmation
on every supersession. Automatic background conflicts retain their originating-session resolver.

Done when: overlap is classified and the intended create, reuse, update or supersede is explicit.

## 4. Write atomic knowledge with provenance

A memory must express one self-contained concept, with a title that can say it in roughly ten
words. Split broad project overviews. Limits: title 200 characters, content 2000, context 500,
keywords and tags at most 10 each. Context explains why the knowledge matters.

| Importance | Use |
| --- | --- |
| 9–10 | Foundational facts or architectural principles used repeatedly |
| 8–9 | Critical solutions and major decisions |
| 7–8 | Useful patterns, preferences and conventions; most records belong here |
| 6–7 | Milestones and narrower solutions |
| 5 | Low-signal bulk capture, kept out of ordinary recall where possible |

Long-form material becomes a document with typically 3–7 distinct atomic entry memories, each
linked with `document_ids`. Code artifacts contain reusable code and its language; use
`code_artifact_ids` on entry memories. Pass `source_files` and describe the evidence accurately.

Done when: useful records exist, are scored deliberately, and cite their source.

## 5. Link and report

Use `link_entity_memory` for each entity the memory describes. Inspect automatic memory links;
use `link_memories` for useful prerequisites, cross-domain connections, contrasts and evolution
that semantic similarity misses. Links must respect the current operation's project scope.

For explicit saves with importance at least 7, report the saved title, tags and related records.
During repository encoding, include these results in the final coverage report. Automatic
background capture remains quiet unless debugging is enabled or a conflict needs attention.

Done when: the records are reachable and the user-facing report states what was saved.
