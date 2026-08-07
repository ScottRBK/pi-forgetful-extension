# Pi Forgetful

A seamless persistent-memory extension for the Pi coding agent.

The intended experience requires no memory commands during normal work:

- a separately configured memory model decides whether each prompt needs memory;
- relevant Forgetful context is injected into the same agent turn;
- the main agent receives bounded leads it can explore through a read-only recall tool;
  normal Pi tool-result persistence is accepted and documented;
- durable knowledge is captured quietly after successful work settles through a durable queue;
- debug, scope, capture-mode, model, prompt, and enablement controls remain available on demand.

See [the approved design](docs/design.md) and the
[visual architecture review](docs/architecture-review.html).

## High-level architecture

The extension keeps Pi lifecycle code separate from memory policy and transport details. The
Forgetful transport is configurable: `api` uses a warm REST service, while `cli` starts the
installed Forgetful CLI on demand. Forgetful MCP transport is deliberately not used by this
extension.

```mermaid
flowchart TB
  subgraph PI["Pi extension boundary"]
    E["ForgetfulExtension\nhooks, commands, tool registration"]
    R["RecallHook\nbefore_agent_start"]
    S["SettledHook\nagent_settled: snapshot and enqueue"]
    T["forgetful_recall\nbounded read-only tool"]
    E --> R
    E --> S
    E --> T
  end

  subgraph CORE["Application services"]
    C["ForgetfulCoordinator\nconfig, limits, failure-open"]
    RS["RecallService\nplan, search, inject"]
    CS["CaptureService\ncandidates, create or skip"]
    SP["ScopePolicy\nproject/global and result validation"]
    PP["PromptPolicy\nschemas and trusted overlays"]
    C --> RS
    C --> CS
    RS --> SP
    RS --> PP
    CS --> SP
    CS --> PP
  end

  subgraph PORTS["Ports / interfaces"]
    MM["MemoryModelClient"]
    FM["ForgetfulClient\nselected transport: api or cli"]
    QS["CaptureQueueStore"]
    SR["SessionSnapshotReader"]
  end

  subgraph ADAPTERS["Adapters"]
    PM["PiModelAdapter\nmodelRegistry.complete() and auth"]
    API["ApiForgetfulClient\nfetch, schemas, timeout"]
    CLI["CliForgetfulClient\nspawn forgetful call --json"]
    DS["DurableQueueStore\nsnapshot, watermark, lock, retry"]
    PS["PiSessionAdapter\nentry IDs and branch identity"]
  end

  R --> C
  S --> C
  T --> RS
  RS --> MM
  RS --> FM
  CS --> MM
  CS --> FM
  CS --> QS
  CS --> SR
  MM --> PM
  FM --> API
  FM --> CLI
  QS --> DS
  SR --> PS
  API --> REST["Forgetful REST service\nwarm process"]
  CLI --> LOCAL["Forgetful local runtime\non demand, no background service"]
```

The CLI path is simpler to operate but normally slower for recall because it starts the
Forgetful runtime for each command. The API path amortises startup cost across prompts. Both
paths must preserve strict project scope, bounded timeouts, schema validation, and fail-open
behaviour.

An editable Excalidraw version of this architecture is available at
[docs/code-architecture.excalidraw](docs/code-architecture.excalidraw).

## Status
Design approved. Implementation has not started.
