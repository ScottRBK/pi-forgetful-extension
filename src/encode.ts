import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const workflows = ["encode-repo", "remember", "entities", "recall", "explore", "files"];

export function bundledSkillPaths(): string[] {
  return workflows.map((name) => fileURLToPath(
    new URL(`../skills/forgetful-${name}/SKILL.md`, import.meta.url),
  ));
}

export async function buildEncodePrompt(
  context: { cwd: string; repoName?: string; project?: { id: number; name: string } },
  direction?: string,
): Promise<string> {
  const skills = await Promise.all(bundledSkillPaths().map(async (path) => {
    const text = await readFile(path, "utf8");
    if (Buffer.byteLength(text) > 64_000) throw new Error("Bundled skill is too large");
    return text;
  }));
  const project = context.project
    ? `${context.project.name} (#${context.project.id})` : "unresolved";
  return [
    "Run the Forgetful repository encoding workflow in this Pi session.",
    `Working directory: ${context.cwd}`,
    `Repository: ${context.repoName ?? "determine from Git origin"}`,
    `Project: ${project}`,
    "Use normal Pi tools to survey the repository and its current commit.",
    "Use forgetful_project_init to resolve or initialise the repository project.",
    "Use forgetful_knowledge_read and forgetful_knowledge_write for Forgetful records.",
    "Query before creating; refresh existing knowledge without duplicating unchanged records.",
    "Resolve clear contradictions automatically through supersede_memory, preserving history.",
    "For uncertainty or shared records, ask for clarification in this session.",
    "Link atomic memories to their documents and entities. Cite source files and the commit.",
    "Do not upload files. Existing stored files may be read and cited.",
    "Finish with a coverage report including created/updated/obsoleted records and gaps.",
    ...(direction?.trim() ? [`Additional user direction: ${direction.trim().slice(0, 2000)}`] : []),
    ...skills,
  ].join("\n\n");
}
