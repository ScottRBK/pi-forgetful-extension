import assert from "node:assert/strict";
import test from "node:test";
import { ApiForgetfulClient } from "../src/http.ts";
import { createToolSession, resultText } from "./pi-tool-session.ts";
import { startForgetful, realOptions } from "./real-forgetful.ts";

for (const remote of ["https://github.com/repo.git", "git@github.com:repo.git"]) {
  test(`Pi rejects an ownerless Git remote: ${remote}`, realOptions, async (t) => {
    // Arrange.
    const baseUrl = await startForgetful(t);
    const { session, modelResults } = await createToolSession(t, baseUrl, [{
      name: "forgetful_project_init", arguments: { name: "repo", description: "Test repository" },
    }], remote);
    // Act.
    await session.prompt("Initialise this repository in Forgetful.");
    // Assert: an ordinary display name is valid, but the Git mapping needs an owner.
    const result = modelResults.at(-1)![0]!;
    assert.equal(result.isError, true);
    assert.match(resultText(result), /owner\/repo/);
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
    const { session, modelResults } = await createToolSession(t, baseUrl, [{
      name: "forgetful_project_init", arguments: { name: "repo", description: "Test repository" },
    }], remote);
    // Act.
    await session.prompt("Initialise this repository in Forgetful.");
    // Assert.
    assert.equal(modelResults.at(-1)![0]!.isError, false);
    const projects = await new ApiForgetfulClient({ baseUrl }).listProjects(repository);
    assert.equal(projects.length, 1);
    assert.equal(projects[0]!.repo_name, repository);
  });
}
