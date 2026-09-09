---
name: forgetful-entities
description: Model people, organisations, systems and components and the relationships between them.
license: MIT
---

# Modelling entities

Entities are the things knowledge describes. Facts about them remain memories linked to them.
Use `forgetful_knowledge_read` and `forgetful_knowledge_write` with the operations below.

## 1. Identify and deduplicate

Search likely names with `search_entities`; aliases in `aka` also matter. Inspect likely hits
with `get_entity`. Match identity and project context, not just a common name like API or Database.
Reuse a deliberate shared entity without overwriting another project's notes or associations.

Done when: the thing exists once in the intended project context, or is confirmed new.

## 2. Create consistently

Use `create_entity` with name, entity_type, notes where useful, tags and aka. Types are
Organization, Individual, Team, Device, System and Other. Other requires `custom_type`.
Match the type vocabulary already used for similar things. The extension associates the current
project and source provenance.

Done when: the entity has a consistent type and useful aliases.

## 3. Attach knowledge

Use `link_entity_memory` when a memory describes the entity. `get_entity_memories` provides the
reverse lookup; read the selected memory for full content and supporting references.

Done when: knowledge is reachable from the thing it describes.

## 4. Record useful relationships

Inspect `get_relationships` before `create_relationship`. Keep types consistent: `owns`,
`depends_on`, `part_of`, `uses`, `created_by`. Direction matters: A depends_on B differs from
B depends_on A. Record structure that answers real questions about impact or responsibility.
Flag stale or uncertain relationships in the coverage report if the available operations cannot
correct them; never report an incomplete graph refresh as complete.

Done when: relevant, evidenced connections are recorded without duplicate edges.
