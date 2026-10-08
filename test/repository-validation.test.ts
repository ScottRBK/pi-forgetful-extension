import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { createToolSession } from "./pi-tool-session.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

async function projectSession(t: TestContext, baseUrl: string, remote: string) {
  const { session } = await createToolSession(t, baseUrl, [], remote);
  const notifications: string[] = [];
  const inputs = ["repo", "Test repository"];
  await session.bindExtensions({ uiContext: {
    notify: (message: string) => notifications.push(message),
    select: async () => "Create a project",
    input: async () => inputs.shift(),
    confirm: async () => true,
    setWidget: () => undefined,
  } as never });
  return { session, notifications };
}

for (const remote of ["https://github.com/repo.git", "git@github.com:repo.git"]) {
  test(`Pi rejects an ownerless Git remote: ${remote}`, realOptions, async (t) => {
    // Arrange.
    const baseUrl = await startForgetful(t);
    const { session, notifications } = await projectSession(t, baseUrl, remote);
    // Act.
    await session.prompt("/forgetful project init");
    // Assert: an ordinary display name is valid, but the Git mapping needs an owner.
    assert.match(notifications.join("\n"), /owner\/repo/);
    assert.deepEqual(await new ApiForgetfulClient({ baseUrl }).listProjects(), []);
  });
}

test("repository input errors name the required format and allow a corrected REST retry",
  realOptions, async (t) => {
    // Arrange.
    const client = new ApiForgetfulClient({ baseUrl: await startForgetful(t) });
    const input = { name: "repo", description: "Repository validation", repo_name: "repo" };
    // Act / Assert.
    for (const repo_name of ["repo", "owner/", "/repo", "owner//repo", "owner/repo name"]) {
      await assert.rejects(client.createProject({ ...input, repo_name }), /repo_name.*owner\/repo/);
    }
    const created = await client.createProject({ ...input, repo_name: "owner/repo" });
    await assert.rejects(client.linkProject(created.id, "repo"), /repo_name.*owner\/repo/);
    const linked = await client.linkProject(created.id, "owner/renamed");
    assert.equal(linked.repo_name, "owner/renamed");
    assert.equal((await client.listProjects())[0]!.name, "repo");
  });

for (const [remote, repository] of [
  ["https://gitlab.com/group/subgroup/repo.git", "group/subgroup/repo"],
  ["git@git.example.test:team/repo.git", "git.example.test/team/repo"],
]) {
  test(`Pi preserves qualified repository mapping ${repository}`, realOptions, async (t) => {
    // Arrange.
    const baseUrl = await startForgetful(t);
    const { session, notifications } = await projectSession(t, baseUrl, remote);
    // Act.
    await session.prompt("/forgetful project init");
    // Assert.
    assert.match(notifications.join("\n"), /linked|created/i);
    const projects = await new ApiForgetfulClient({ baseUrl }).listProjects(repository);
    assert.equal(projects.length, 1);
    assert.equal(projects[0]!.repo_name, repository);
  });
}
