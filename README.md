# Pi Forgetful
An extension for the [Pi Coding](https://pi.dev/) agent that enables connects the agent to the
[forgetful](https://github.com/ScottRBK/forgetful)knowledge base and agentic memory layer

Currently WIP. 

However the intended experience requires no memory commands during normal work:

- a separately configured memory model decides whether each prompt needs memory;
- relevant Forgetful context is injected into the same agent turn;
- the main agent receives bounded leads it can explore through a read-only recall tool;
  normal Pi tool-result persistence is accepted and documented;
- durable knowledge is captured quietly after successful work settles through a durable queue;
- debug, scope, capture-mode, model, prompt, and enablement controls remain available on demand.


