import type { ExtensionContext } from "@earendil-works/pi-coding-agent";

interface SetupHelp {
  newInstance: boolean;
  route: "CLI" | "MCP";
}

export async function promptSetupHelp(
  ctx: ExtensionContext,
): Promise<SetupHelp | "manual" | undefined> {
  const instance = await ctx.ui.select("Need help setting up a new Forgetful instance?", [
    "Yes, help me set up a new instance",
    "No, I already have an instance",
  ]);
  if (instance === undefined) return undefined;
  const newInstance = instance === "Yes, help me set up a new instance";
  if (!newInstance) {
    const access = await ctx.ui.select("Need help setting up Forgetful access for Pi?", [
      "Yes, help me configure Pi access",
      "No, continue with REST connection",
    ]);
    if (access === undefined) return undefined;
    if (access === "No, continue with REST connection") return "manual";
  }
  const route = await ctx.ui.select("How should your main agent access Forgetful?", [
    "CLI + skills",
    "MCP + skills",
  ]);
  if (route === undefined) return undefined;
  return { newInstance, route: route === "CLI + skills" ? "CLI" : "MCP" };
}

export function buildSetupPrompt(help: SetupHelp, agentDir: string, settingsPath: string): string {
  const skill = `forgetful-${help.route.toLowerCase()}-setup`;
  const source = "https://raw.githubusercontent.com/ScottRBK/forgetful/main";
  return [
    "Help me finish Forgetful setup in this conversation.",
    help.newInstance
      ? `I want help setting up a new Forgetful instance with ${help.route} + skills for Pi.`
      : `I have an existing Forgetful instance; help configure ${help.route} + skills for Pi.`,
    "Read and follow the canonical setup skill:",
    `${source}/skills/${skill}/SKILL.md`,
    "Also consult the current Forgetful README:",
    `${source}/README.md`,
    "Use the installed Pi documentation paths listed in your system prompt for skills and MCP.",
    "If unavailable, use official Pi docs matching pi --version; do not guess commands.",
    "",
    "First inspect existing installations, skills and configuration without exposing secrets.",
    "Reuse working access; ask before replacing configuration or creating another instance.",
    "Perform a supply-chain audit before installing or upgrading any package dependency.",
    "Review skills before installing them; preserve existing user customisations.",
    help.route === "CLI"
      ? "Check whether the Forgetful CLI is installed; install it if missing. " +
        "Configure its intended local database or remote server; do not silently use a local " +
        "database when the user wants an existing server. No Pi MCP connection is needed."
      : "Use native Pi MCP, not a third-party bridge. Follow the installed MCP documentation. " +
        "Inspect existing entries before using pi mcp add; it can replace an entry. " +
        "Configure the chosen HTTP or stdio connection and use pi mcp list to check it.",
    "Read the skills catalog and install the selected setup skill and shared usage skills:",
    `${source}/skills/README.md`,
    "Fetch each referenced SKILL.md as raw content from that repository, " +
      "or use a trusted checkout.",
    `This session's Pi agent directory is ${JSON.stringify(agentDir)}; use its skills directory`,
    "for user-level Pi skills unless the user requests project-local installation. Respect custom",
    "agent directories for MCP configuration too. Do not assume ~/.pi/agent is active.",
    "Skills support deliberate searches, saves, project work and conflict resolution. Routine",
    "automatic recall/capture remains this extension's job; do not add duplicate automatic hooks.",
    "Verify discovery and a read-only operation such as listing projects through the chosen " +
      "client.",
    "Do not create test memories or projects. Connection checks alone do not prove write " +
      "permission.",
    "",
    "Finish the background-memory connection too; do not send me back through /forgetful setup.",
    "Background recall/capture still needs a running HTTP REST service, even with local CLI or",
    "stdio MCP. Agree the deployment and how it stays running; do not leave a temporary " +
      "shell server",
    "and claim setup is complete. See the Forgetful README for Python and Docker deployment " +
      "options.",
    "Main-agent access and background REST are separate: do not require them to use the same " +
      "instance.",
    "Confirm the intended REST endpoint and authentication with me; reuse correct existing " +
      "settings.",
    `The extension settings file is ${JSON.stringify(settingsPath)}.`,
    "Use a REST base_url ending in /api/v1. Require HTTPS except for loopback HTTP; keep " +
      "credentials",
    "out of the URL. Validate GET <REST base_url>/projects with its authentication before saving.",
    "Merge base_url and token_env into that JSON file; preserve unrelated settings.",
    "For bearer authentication, remove a legacy inline token only after its replacement is",
    "durably available to Pi and validated. Otherwise leave authentication settings untouched",
    "and ask. If the user confirms unauthenticated access, validate it before removing token",
    "and token_env.",
    "If the file is malformed, stop and ask rather than replacing it. Keep restrictive permissions",
    "and save atomically. Never print tokens, paste them into chat, or store them in this " +
      "JSON file.",
    "Use environment-variable references or the client's supported secure authentication. A token",
    "exported in a child shell does not reach the running Pi process; explain when a restart " +
      "is needed.",
    "Keep background enablement, scope, capture settings and the separate memory-model " +
      "choice intact.",
    "If no memory model is configured, explain /forgetful model rather than choosing one silently.",
    "Finally ask me to run /reload (or restart for environment changes), then verify skills, " +
      "main-agent",
    "access and /forgetful status. Report what is verified and what still needs " +
      "verification; do not",
    "claim setup is complete before the chosen client and background connection work. Project",
    "initialisation is a separate, optional next step, not an automatic setup write.",
  ].join("\n");
}
