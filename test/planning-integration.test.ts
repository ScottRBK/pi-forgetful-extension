import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import test, { type TestContext } from "node:test";
import { ApiPlanningReader } from "../src/adapters/forgetful/planning.ts";
import { PlanningController } from "../src/application/planning.ts";

const source = process.env.FORGETFUL_TEST_SOURCE;
async function server(t: TestContext, enabled: boolean): Promise<string> {
  const child = spawn(join(source!, ".venv/bin/python"),
    [resolve("scripts/forgetful-test-server.py"), source!, ...(enabled ? ["--planning"] : [])],
    { cwd: "/tmp", stdio: ["ignore", "pipe", "pipe"] });
  const exited = once(child, "exit");
  t.after(async () => { child.kill("SIGTERM"); await exited; });
  let errors = "";
  child.stderr.on("data", (data) => { errors = (errors + data).slice(-4000); });
  const lines = createInterface({ input: child.stdout });
  for await (const line of lines) if (line.startsWith("READY ")) return line.slice(6);
  throw new Error(`Isolated server exited: ${errors}`);
}

for (const enabled of [true, false]) {
  test(`real throwaway Forgetful planning ${enabled ? "enabled" : "disabled"}`,
    { skip: !source, timeout: 30_000 }, async (t) => {
      // Arrange: this fixture creates its own SQLite database in memory.
      const baseUrl = await server(t, enabled);
      const create = async (path: string, body: object) => {
        const response = await fetch(baseUrl + path, { method: "POST",
          headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
        assert.equal(response.status, 201, await response.clone().text());
        return await response.json() as { id: number };
      };
      const reader = new ApiPlanningReader({ baseUrl, timeoutMs: 3000 });
      // Act and assert the real public discovery contract, including disabled planning.
      assert.deepEqual(await reader.capabilities(), { ok: true,
        value: enabled ? "enabled" : "disabled" });
      if (!enabled) {
        const plans = await reader.plans(1);
        assert.equal(plans.ok, false);
        if (!plans.ok) assert.equal(plans.error.kind, "unavailable");
        return;
      }
      const project = await create("/projects", {
        name: "Planning contract", description: "Isolated fixture", repo_name: "test/planning",
        project_type: "development",
      });
      const plan = await create("/plans", {
        title: "Release viewer", project_id: project.id, status: "active", goal: "Read safely",
      });
      const task = await create("/tasks", { title: "Verify routes", plan_id: plan.id,
        criteria: [{ description: "Read-only requests" }] });
      const controller = new PlanningController({ reader, repoName: "test/planning",
        enabled: true, ready: true, initialPreference: false,
        preferences: { read: async () => false, write: async () => {} },
        clock: { now: () => 5, schedule: () => () => {} } });
      t.after(() => controller.dispose());
      await controller.openDetails();
      assert.equal(controller.state.availability, "ready");
      assert.equal(controller.state.plans[0].title, "Release viewer");
      assert.deepEqual(controller.state.planTasks[plan.id].counts,
        { total: 1, done: 0, cancelled: 0 });
      await controller.inspectTask();
      assert.equal(controller.state.taskDetail?.id, task.id);
      assert.equal(controller.state.taskDetail?.criteria[0].met, false);
      const version = controller.state.taskDetail?.version;
      const criterionId = controller.state.taskDetail!.criteria[0].id;
      const edited = await fetch(`${baseUrl}/criteria/${criterionId}`, {
        method: "PUT", headers: { "content-type": "application/json" },
        body: JSON.stringify({ met: true }),
      });
      assert.equal(edited.status, 200);
      await controller.refresh();
      assert.equal(controller.state.taskDetail?.version, version);
      assert.equal(controller.state.taskDetail?.criteria[0].met, true);
    });
}
