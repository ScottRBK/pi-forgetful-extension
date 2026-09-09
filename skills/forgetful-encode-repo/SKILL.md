---
name: forgetful-encode-repo
description: Encode a repository into Forgetful or refresh its existing knowledge.
disable-model-invocation: true
license: MIT
---

# Encoding a repository

Build a knowledge base a future session can use: entities describe the system, atomic memories
record decisions and conventions, and documents hold long-form understanding. A second encoding
is an update pass, not a second copy. Follow the bundled remember and entities workflows.

## 1. Resolve the project

Inspect Git origin. Call `forgetful_project_init` with a useful name and description; it reuses
an existing exact repository mapping or creates the missing project. A supplied `project_id`
can link an existing unassigned project. Ambiguous mappings require clarification.

Done when: a verified project ID exists and the run is identified as initial encoding or refresh.

## 2. Survey the sources

Read README, docs, contributor and agent guides, manifests, entry points, configuration, CI and
deployment information before surveying implementation. Record the current Git commit and an
ordered source list. Use Pi's normal repository tools. Cite relative source paths in each write;
the extension stamps the current repository and commit. Mention uncommitted changes in provenance
text when they inform a write, since the commit alone does not reproduce them.

Exclude credentials, private data and secret configuration values. Describe configuration keys
and their purpose when useful. Skip generated output and dependency copies unless they provide
unique evidence that the project's maintained sources cannot supply.

Done when: the important source areas and their evidence are identified.

## 3. Model the system

Use the entities workflow for the system and important services, packages, databases and external
dependencies. Choose `System` for these components. Record `part_of` for composition and
`depends_on` for coupling. Search names and aliases first; keep project-specific components
separate from similarly named components in unrelated repositories.

Done when: relevant system structure can be explored through entities and relationships.

## 4. Store the knowledge

Use `forgetful_knowledge_write` for documents describing architecture, subsystems and design
analysis. Store atomic entry memories for decisions, conventions, patterns and constraints.
Link each entry memory through `document_ids` and through a separate `link_entity_memory`
operation. Reusable implementation examples belong in code artifacts, linked through
`code_artifact_ids`. The remember workflow supplies atomicity and importance rules.

On refresh, search each source area first. Reuse unchanged records, update complete source-backed
documents or artifacts when they drift, and use `supersede_memory` for a clearly contradicted
memory. Preserve its historical predecessor. Shared or uncertain claims need clarification in
this session. An unsuccessful write is an uncovered area, not a completed encode.

Done when: every surveyed area has useful linked knowledge or an explicit reason for exclusion.

## 5. Report coverage

Report the project ID; entities created, updated or reused; relationships; memories created,
updated or obsoleted; documents and code artifacts written; skipped source areas and reasons;
and thin coverage. Include repository gaps such as missing documentation, tests or CI.
Deliver this coverage report to the user. Do not store the report itself in Forgetful.

Done when: the user can identify both coverage and omissions from the report.
