---
name: forgetful-explore
description: Explore entities and relationships when flat memory search leaves gaps.
license: MIT
---

# Exploring the knowledge graph

Choose a depth: shallow for one fact, medium for a topic and its immediate neighbours, deep for
an investigation spanning connected systems. Track visited memory and entity IDs to stop cycles.
All steps use `forgetful_knowledge_read`; strict project scope applies to every expansion.

1. Search memories with query_context stating the investigation. Use broader k when finding
   entry points, up to 20. Done when: several relevant entry points are identified.
2. Get the strongest memories and follow useful linked IDs. Read supporting documents, code or
   files where they explain the facts. Done when: local clusters are understood.
3. Search obvious actors and entities named by the memories. Done when: relevant systems,
   components, people or organisations have been identified.
4. Get relationships for relevant entities. Follow types that answer the question, such as
   depends_on for impact or part_of for structure. Done when: relevant connections are mapped.
5. Get memories attached to central entities, then get selected memories for their full text.
   Done when: entity-linked knowledge missed by the initial topic search has been considered.

Synthesize a connected answer with memory/entity IDs and any supporting document or artifact
IDs. Describe the traversal path in one line and identify thin coverage. Report the picture and
its gaps, rather than dumping every visited record.
