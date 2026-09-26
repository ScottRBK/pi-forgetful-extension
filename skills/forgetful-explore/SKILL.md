---
name: forgetful-explore
description: Follow entities and relationships to fill a specific gap left by memory search.
license: MIT
---

# Exploring connected knowledge

Start with the unanswered question, not a traversal depth. All reads use
`forgetful_knowledge_read` and respect the selected recall scope. Project scope confines knowledge
reads to the verified current project. Track visited memory/entity IDs to avoid cycles.

1. Search memories for the missing fact, with `query_context` explaining the gap. Start with the
   strongest result, not every match. Increase `k` (up to 20) only if necessary.
2. Read full memories and relevant supporting documents, code or files. Follow a linked memory
   only when it could clarify the fact, its reason, current state or a real dependency.
3. Search entities named by the evidence. Verify identity and project, then inspect direct
   relationships that bear on the question. Check direction: A depends_on B is not B depends_on A.
4. Use `get_entity_memories` to find knowledge missed by topic search. Read selected memories in
   full: their titles and graph position alone cannot establish their claims.

Follow returned cursors when coverage is incomplete. Stop when the gap is answered or further
expansion is not justified. A link is a route to inspect, not proof of agreement or causality.
State the useful connected facts with source IDs, their scope and any material uncertainty.
Do not narrate every search or dump the visited graph.
