import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { ForgetfulClient, Project, ProjectInput } from "./contracts.ts";
import { sanitizeText } from "./privacy.ts";

/** Messages from this error are safe to display; transport errors are handled separately. */
export class ProjectInitError extends Error {}

export interface AgentProjectInitInput {
  name?: string;
  description?: string;
  projectId?: number;
}

function existingMapping(
  projects: Project[],
  repoName: string,
): Project | undefined {
  const matches = projects.filter((project) => project.repo_name === repoName);
  if (matches.length > 1) {
    throw new ProjectInitError(
      "Multiple Forgetful projects match this repository; fix their links first.",
    );
  }
  return matches[0];
}

function validateAgentProjectDetails(
  repoName: string,
  input: AgentProjectInitInput,
): ProjectInput {
  if (input.projectId !== undefined) {
    if (!Number.isSafeInteger(input.projectId) || input.projectId <= 0) {
      throw new ProjectInitError("The project ID must be a positive integer.");
    }
  }
  const name = input.name?.trim();
  const description = input.description?.trim();
  if (input.projectId !== undefined) {
    return {
      name: name ?? "",
      description: description ?? "",
      repo_name: repoName,
    };
  }
  if (!name || name.length > 500) {
    throw new ProjectInitError(
      "Project name must contain 1–500 characters when creating a project.",
    );
  }
  if (!description || description.length > 5000) {
    throw new ProjectInitError(
      "Project description must contain 1–5000 characters when creating a project.",
    );
  }
  return { name, description, repo_name: repoName };
}

async function promptNewProject(
  ctx: ExtensionContext,
  repoName: string,
): Promise<ProjectInput | undefined> {
  const defaultName = repoName.split("/").at(-1)!;
  const nameInput = await ctx.ui.input(
    "Project name (blank uses repository name)",
    defaultName,
  );
  if (nameInput === undefined) return;
  const name = nameInput === "" ? defaultName : nameInput.trim();
  if (!name || name.length > 500) {
    throw new ProjectInitError("Project name must contain 1–500 characters.");
  }
  const descriptionInput = await ctx.ui.input("Short project description");
  if (descriptionInput === undefined) return;
  const description = descriptionInput.trim();
  if (!description || description.length > 5000) {
    throw new ProjectInitError(
      "Project description must contain 1–5000 characters.",
    );
  }
  const confirmed = await ctx.ui.confirm(
    "Create Forgetful project",
    `${sanitizeText(name)}\n${sanitizeText(description)}\nRepository: ${repoName}`,
  );
  if (confirmed) return { name, description, repo_name: repoName };
}

async function promptExistingProject(
  client: ForgetfulClient,
  ctx: ExtensionContext,
  repoName: string,
): Promise<Project | undefined> {
  let available = (await client.listProjects(undefined, ctx.signal)).filter(
    (project) => !project.repo_name,
  );
  if (available.length === 0) {
    throw new ProjectInitError(
      "No unassigned Forgetful projects found. Run /forgetful project init and create a project.",
    );
  }
  while (available.length > 20) {
    const filter = await ctx.ui.input(
      `${available.length} projects available — narrow by project name`,
    );
    if (filter === undefined) return;
    const query = filter.trim().toLowerCase();
    if (!query) continue;
    const matches = available.filter((project) =>
      project.name.toLowerCase().includes(query),
    );
    if (matches.length === 0) {
      ctx.ui.notify("No projects match that name. Try another search.", "info");
    } else {
      available = matches;
    }
  }
  const labels = available.map(
    (project) => `${sanitizeText(project.name).slice(0, 100)} (#${project.id})`,
  );
  const selected = await ctx.ui.select("Project to link", labels);
  if (selected === undefined) return;
  const project = available[labels.indexOf(selected)];
  if (!project) return;
  const confirmed = await ctx.ui.confirm(
    "Link Forgetful project",
    `Link ${sanitizeText(project.name)} (#${project.id}) to ${repoName}?`,
  );
  if (confirmed) return project;
}

/** Repository onboarding only; recall scope and enablement remain separate controls. */
export async function initialiseProject(
  client: ForgetfulClient,
  ctx: ExtensionContext,
  repoName: string,
  ensureCurrent: () => Promise<void>,
): Promise<Project | undefined> {
  const existing = existingMapping(
    await client.listProjects(repoName, ctx.signal),
    repoName,
  );
  if (existing) return existing;
  const action = await ctx.ui.select(`Forgetful project for ${repoName}`, [
    "Create a project",
    "Link an existing project",
  ]);
  let input: ProjectInput | undefined;
  let selected: Project | undefined;
  if (action === "Create a project") {
    input = await promptNewProject(ctx, repoName);
    if (!input) return;
  } else if (action === "Link an existing project") {
    selected = await promptExistingProject(client, ctx, repoName);
    if (!selected) return;
  } else {
    return;
  }

  // Dialogs can remain open while another session changes the server's projects.
  const projects = await client.listProjects(undefined, ctx.signal);
  await ensureCurrent();
  const mapped = existingMapping(projects, repoName);
  if (mapped) return mapped;
  if (
    selected &&
    !projects.some(
      (project) => project.id === selected.id && !project.repo_name,
    )
  ) {
    throw new ProjectInitError(
      "The selected project's repository changed. Run init again.",
    );
  }
  const result = selected
    ? await client.linkProject(selected.id, repoName, ctx.signal)
    : await client.createProject(input!, ctx.signal);
  if (
    result.repo_name !== repoName ||
    (selected && result.id !== selected.id)
  ) {
    throw new ProjectInitError(
      "Forgetful returned a different project mapping. Run init again.",
    );
  }
  // Verify the public mapping too: the server does not enforce unique repo_name values.
  const verified = existingMapping(
    await client.listProjects(repoName, ctx.signal),
    repoName,
  );
  if (!verified || verified.id !== result.id) {
    throw new ProjectInitError(
      "The project was saved but its repository link could not be verified. " +
        "Run /forgetful project init again.",
    );
  }
  return verified;
}

/** Project onboarding for an already-authorized agent tool call. */
export async function initialiseProjectForAgent(
  client: ForgetfulClient,
  ctx: ExtensionContext,
  repoName: string,
  input: AgentProjectInitInput,
  ensureCurrent: () => Promise<void>,
): Promise<Project> {
  const existing = existingMapping(
    await client.listProjects(repoName, ctx.signal),
    repoName,
  );
  if (existing) return existing;

  const projectInput = validateAgentProjectDetails(repoName, input);
  const projects = await client.listProjects(undefined, ctx.signal);
  await ensureCurrent();
  const mapped = existingMapping(projects, repoName);
  if (mapped) return mapped;

  let result: Project;
  if (input.projectId !== undefined) {
    const selected = projects.find((project) => project.id === input.projectId);
    if (!selected || selected.repo_name) {
      throw new ProjectInitError(
        "The selected project is unavailable or already linked. Run init again.",
      );
    }
    result = await client.linkProject(selected.id, repoName, ctx.signal);
  } else {
    result = await client.createProject(projectInput, ctx.signal);
  }
  await ensureCurrent();
  if (result.repo_name !== repoName) {
    throw new ProjectInitError(
      "Forgetful returned a different project mapping. Run init again.",
    );
  }
  const verified = existingMapping(
    await client.listProjects(repoName, ctx.signal),
    repoName,
  );
  if (!verified || verified.id !== result.id) {
    throw new ProjectInitError(
      "The project was saved but its repository link could not be verified. " +
        "Run project init again.",
    );
  }
  return verified;
}
