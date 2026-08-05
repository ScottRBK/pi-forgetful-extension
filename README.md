# Pi Forgetful

A seamless persistent-memory extension for the Pi coding agent.

The intended experience requires no memory commands during normal work:

- a user-selected Pi model decides whether each prompt needs memory;
- relevant Forgetful context is injected into the same agent turn;
- the main agent receives bounded leads it can explore through a read-only recall tool;
- durable knowledge is captured quietly after successful work settles;
- debug, scope, model, prompt, and enablement controls remain available on demand.

See [the approved design](docs/design.md) and the
[visual architecture review](docs/architecture-review.html).

## Status

Design approved. Implementation has not started.
