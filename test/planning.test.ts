import assert from "node:assert/strict";
import { createServer, type ServerResponse } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LocalPlanningPreferences } from "../src/adapters/local/planning-settings.ts";
import test, { type TestContext } from "node:test";
import { PlanningController } from "../src/application/planning.ts";
import { ApiPlanningReader } from "../src/adapters/forgetful/planning.ts";

const project = { id: 3, name: "Repository", repo_name: "owner/repo" };
const plan = { id: 7, title: "Ship viewer", project_id: 3, status: "active", task_count: 6 };
const task = (id: number, state: string, blocked = false, priority = "P2") => ({
  id, title: `Task ${id}`, plan_id: 7, state, blocked, priority, assigned_agent: null,
  version: 1, criteria_met: 0, criteria_total: 0,
});

class TestClock {
  time = 1234;
  callback?: () => void;
  delay?: number;
  now() { return this.time; }
  schedule(callback: () => void, delay: number) {
    this.callback = callback; this.delay = delay;
    return () => { this.callback = undefined; this.delay = undefined; };
  }
  tick() {
    this.time += this.delay ?? 0;
    const callback = this.callback;
    this.callback = undefined;
    callback?.();
  }
}

async function poll(controller: PlanningController, clock: TestClock) {
  const completed = new Promise<void>((resolve) => {
    let started = false;
    const unsubscribe = controller.subscribe((state) => {
      if (state.loading) started = true;
      if (started && !state.loading) { unsubscribe(); resolve(); }
    });
  });
  clock.tick();
  await completed;
}

async function fixture(t: TestContext, prefix = "") {
  const requests: string[] = [];
  const replies = new Map<string, unknown>([
    ["/.well-known", { schema_version: 1, capabilities: { planning: true } }],
    ["/api/v1/projects", { projects: [project], total: 1 }],
    ["/api/v1/plans/7", { ...plan, goal: null, context: null }],
    ["/api/v1/plans?project_id=3&status=active", { plans: [plan], total: 1 }],
    ["/api/v1/tasks?plan_id=7", { tasks: [
      task(1, "done"), task(2, "cancelled", true), task(3, "waiting"),
      task(4, "todo", true, "P0"), task(5, "doing", true), task(6, "doing", false, "P1"),
    ], total: 6 }],
  ]);
  const handlers = new Map<string, (response: ServerResponse) => void>();
  const server = createServer((req, res) => {
    assert.equal(req.method, "GET");
    assert.equal(req.headers.authorization, "Bearer fixture-token");
    requests.push(req.url!);
    const path = req.url!.slice(prefix.length);
    if (handlers.has(path)) return handlers.get(path)!(res);
    res.setHeader("content-type", "application/json");
    if (!replies.has(path)) { res.statusCode = 404; res.end("Not Found"); return; }
    res.end(JSON.stringify(replies.get(path)));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve) => {
    server.closeAllConnections(); server.close(() => resolve());
  }));
  const address = server.address() as { port: number };
  const reader = new ApiPlanningReader({
    baseUrl: `http://127.0.0.1:${address.port}${prefix}/api/v1`, token: "fixture-token",
  });
  const directory = await mkdtemp(join(tmpdir(), "planning-workflow-"));
  t.after(() => rm(directory, { force: true, recursive: true }));
  const preferences = new LocalPlanningPreferences(join(directory, "settings.json"));
  const clock = new TestClock();
  const controller = new PlanningController({
    reader, repoName: "owner/repo", enabled: true, ready: true, initialPreference: false,
    preferences, clock,
  });
  t.after(() => controller.dispose());
  return { reader, controller, requests, replies, handlers, preferences, clock };
}

test("opening a read-only overview shows real active plans and accurate task facts", async (t) => {
  // Arrange: real HTTP adapter; exact repository mapping; no model dependency.
  const { controller, requests } = await fixture(t, "/forgetful");
  const states: boolean[] = [];
  controller.subscribe((state) => states.push(state.loading));
  assert.equal(requests.length, 0);

  // Act.
  await controller.openDetails();

  // Assert: task counts are independent facts; waiting is not locally called blocked.
  const state = controller.state;
  assert.equal(state.availability, "ready");
  assert.equal(state.selectedProjectId, 3);
  assert.equal(state.selectedPlanId, 7);
  assert.deepEqual(state.plans, [plan]);
  assert.deepEqual(state.planTasks[7].counts, { done: 1, cancelled: 1, total: 6 });
  assert.deepEqual(state.planTasks[7].activeTasks.map((item) => item.id), [6, 5, 4]);
  assert.equal(state.planTasks[7].activeTasks[1].blocked, true);
  assert.equal(state.lastRefresh, 1234);
  assert(states.includes(true));
  assert(requests.includes("/forgetful/.well-known"));
  assert(requests.every((path) => !/\/tasks\/\d/.test(path)));
});

test("capability fallback, disabled service and original errors remain distinct", async (t) => {
  const { controller, replies, requests, handlers } = await fixture(t);
  replies.delete("/.well-known");
  replies.set("/api/v1/plans?project_id=3&status=active", { plans: [], total: 0 });
  await controller.openDetails();
  assert.equal(controller.state.availability, "ready");
  assert.deepEqual(controller.state.plans, []);

  replies.set("/.well-known", { schema_version: 1, capabilities: { planning: false } });
  requests.length = 0;
  await controller.refresh();
  assert.equal(controller.state.availability, "disabled");
  assert.deepEqual(requests, ["/.well-known"]);

  handlers.set("/.well-known", (res) => { res.statusCode = 503; res.end("database unavailable"); });
  requests.length = 0;
  await controller.refresh();
  assert.equal(controller.state.error?.kind, "transient");
  assert.equal(controller.state.error?.status, 503);
  assert.equal(controller.state.error?.responseBody, "database unavailable");
  assert.equal(controller.state.stale, false); // There is no retained data to call stale.
  assert.deepEqual(requests, ["/.well-known"]);
});

test("closing during a read cancels loading and ignores its late result", async (t) => {
  const { controller, handlers } = await fixture(t);
  let started!: () => void;
  const reading = new Promise<void>((resolve) => { started = resolve; });
  handlers.set("/api/v1/tasks?plan_id=7", () => started());
  const opening = controller.openDetails();
  await reading;
  await controller.closeDetails();
  await opening;
  assert.equal(controller.state.detailsOpen, false);
  assert.equal(controller.state.loading, false);
  assert.equal(controller.state.availability, "idle");
  assert.deepEqual(controller.state.planTasks, {});
});


test("persistent panel polls only visible plans and pauses while hidden or disabled", async (t) => {
  // Arrange: three plans; compact view must read only the first two.
  const { controller, replies, requests, preferences, clock } = await fixture(t);
  replies.set("/api/v1/plans?project_id=3&status=active", { plans: [
    plan, { ...plan, id: 8, title: "Second" }, { ...plan, id: 9, title: "Third" },
  ], total: 3 });
  replies.set("/api/v1/tasks?plan_id=8", { tasks: [], total: 0 });
  await controller.setPanel(true);
  assert.equal(await preferences.read(), true);
  assert.equal(requests.length, 0);

  // Act: expose the panel, poll, then hide it.
  await controller.setPanelVisible(true);
  assert.equal(controller.state.plans.length, 3);
  assert.deepEqual(Object.keys(controller.state.planTasks), ["7", "8"]);
  assert.equal(clock.delay, 10_000);
  requests.length = 0;
  await poll(controller, clock);
  assert(!requests.includes("/.well-known"));
  assert(!requests.includes("/api/v1/tasks?plan_id=9"));
  await controller.setPanelVisible(false);
  requests.length = 0;
  clock.tick();
  await controller.refresh();
  assert.equal(requests.length, 0);
  assert.equal(clock.callback, undefined);

  // Assert: off blocks reads without rewriting preference; on and resize refresh again.
  await controller.setConnection({ enabled: false, ready: true, repoName: "owner/repo" });
  await controller.setPanelVisible(true);
  await controller.openDetails();
  assert.equal(requests.length, 0);
  assert.equal(controller.state.detailsOpen, false);
  assert.equal(controller.state.availability, "off");
  assert.equal(await preferences.read(), true);
  await controller.setConnection({ enabled: true, ready: true, repoName: "owner/repo" });
  assert(requests.includes("/.well-known"));
  requests.length = 0;
  await controller.setConnection({ enabled: true, ready: false, repoName: "owner/repo" });
  await controller.refresh();
  assert.equal(requests.length, 0);
  assert.equal(controller.state.availability, "not-ready");
});

test("partial outages keep honest counts, bounded backoff and clear denied data", async (t) => {
  // Arrange: a visible summary has one successful plan and one failed plan.
  const { controller, replies, requests, handlers, clock } = await fixture(t);
  replies.set("/api/v1/plans?project_id=3&status=active", { plans: [
    plan, { ...plan, id: 8, title: "Second" },
  ], total: 2 });
  handlers.set("/api/v1/tasks?plan_id=8", (res) => {
    res.statusCode = 503; res.end("retry later");
  });
  await controller.setPanel(true);
  await controller.setPanelVisible(true);

  // Assert: unknown counts are not zero; the successful plan remains usable.
  assert.equal(controller.state.planTasks[7].counts?.total, 6);
  assert.equal(controller.state.planTasks[8].counts, undefined);
  assert.equal(controller.state.planTasks[8].error?.responseBody, "retry later");
  assert.equal(controller.state.stale, true);
  assert.equal(clock.delay, 10_000);
  replies.set("/api/v1/tasks?plan_id=8", { tasks: [], total: 0 });
  handlers.delete("/api/v1/tasks?plan_id=8");
  await poll(controller, clock);
  const lastSuccess = controller.state.lastRefresh;
  assert.equal(controller.state.stale, false);

  // Act: outage keeps the last successful data, without multiplying overlapping requests.
  handlers.set("/api/v1/plans?project_id=3&status=active", (res) => {
    res.statusCode = 503; res.end("original outage fixture-token\\u001b");
  });
  requests.length = 0;
  await Promise.all([controller.refresh(), controller.refresh(), controller.refresh()]);
  assert.equal(requests.filter((path) => path.includes("/plans?")).length, 1);
  assert.equal(controller.state.lastRefresh, lastSuccess);
  assert.equal(controller.state.planTasks[7].counts?.total, 6);
  assert.equal(controller.state.stale, true);
  assert(!controller.state.error?.message.includes("fixture-token"));
  await poll(controller, clock);
  assert.equal(clock.delay, 20_000);
  for (let i = 0; i < 4; i++) await poll(controller, clock);
  assert.equal(clock.delay, 60_000);

  // Assert: denial clears account data and stops automatic retry; manual retry is available.
  handlers.set("/api/v1/plans?project_id=3&status=active", (res) => {
    res.statusCode = 403; res.end("permission revoked");
  });
  await poll(controller, clock);
  assert.equal(controller.state.availability, "denied");
  assert.deepEqual(controller.state.projects, []);
  assert.deepEqual(controller.state.plans, []);
  assert.deepEqual(controller.state.planTasks, {});
  assert.equal(clock.callback, undefined);
  handlers.clear();
  await controller.refresh();
  assert.equal(controller.state.availability, "ready");
});

test("details navigate all projects and inspect tasks while preserving selection on live edits",
  async (t) => {
    // Arrange: a picker larger than the capture prompt's 100-project limit.
    const { controller, requests, replies, clock } = await fixture(t);
    const projects = [project, ...Array.from({ length: 101 }, (_, i) => ({
      id: 100 + i, name: `Other ${i}`, repo_name: `other/${i}`,
    }))];
    replies.set("/api/v1/projects", { projects, total: 102 });
    replies.set("/api/v1/plans/7", { ...plan, goal: "Ship read-only", context: "Human viewer" });
    replies.set("/api/v1/tasks/5", { ...task(5, "doing", true), description: "Inspect this",
      criteria: [{ id: 91, task_id: 5, description: "Works", met: false, met_at: null }],
      dependency_ids: [1, 999] });
    const otherPlan = { ...plan, id: 20, project_id: 200 };
    replies.set("/api/v1/plans?project_id=200&status=active", { plans: [otherPlan], total: 1 });
    replies.set("/api/v1/plans/20", { ...otherPlan, goal: null, context: null });
    replies.set("/api/v1/tasks?plan_id=20", { tasks: [], total: 0 });

    // Act: selection reads summaries; inspection alone loads the full record.
    await controller.openDetails();
    assert.equal(controller.state.projects.length, 102);
    assert.equal(controller.state.planDetail?.goal, "Ship read-only");
    const beforeSelection = requests.length;
    await controller.selectTask(5);
    assert.equal(requests.length, beforeSelection);
    assert(!requests.includes("/api/v1/tasks/5"));
    await controller.inspectTask();
    assert.equal(controller.state.taskDetail?.criteria[0].met, false);
    assert.deepEqual(controller.state.taskDetail?.dependency_ids, [1, 999]);
    replies.set("/api/v1/tasks/5", { ...task(5, "doing", true), description: "Inspect this",
      criteria: [{ id: 91, task_id: 5, description: "Works", met: true, met_at: null }],
      dependency_ids: [999] });
    await poll(controller, clock);

    // Assert: edits without a version change are visible and selection remains stable.
    assert.equal(controller.state.selectedTaskId, 5);
    assert.equal(controller.state.taskDetail?.version, 1);
    assert.equal(controller.state.taskDetail?.criteria[0].met, true);
    assert.deepEqual(controller.state.taskDetail?.dependency_ids, [999]);
    await controller.closeTask();
    assert.equal(controller.state.taskDetail, undefined);
    requests.length = 0;
    await controller.selectProject(200);
    assert.equal(controller.state.selectedProjectId, 200);
    assert(!requests.includes("/api/v1/tasks?plan_id=7"));
    assert.equal(controller.state.selectedTaskId, undefined);
    await controller.setPanel(true);
    await controller.setPanelVisible(true);
    await controller.closeDetails();
    assert.equal(controller.state.selectedProjectId, 3);
    assert.equal(controller.state.planDetail, undefined);
    assert.equal(controller.state.taskDetail, undefined);
  });

test("live removals close details and missing mapping never leaks another project's records",
  async (t) => {
    const { controller, replies, clock } = await fixture(t);
    replies.set("/api/v1/tasks/5", { ...task(5, "doing"), description: null,
      criteria: [], dependency_ids: [] });
    await controller.openDetails();
    await controller.selectTask(5);
    await controller.inspectTask();
    assert.equal(controller.state.taskDetail?.id, 5);
    // A successful list no longer includes the selected task.
    replies.set("/api/v1/tasks?plan_id=7", { tasks: [task(6, "todo")], total: 1 });
    await poll(controller, clock);
    assert.equal(controller.state.selectedTaskId, 6);
    assert.equal(controller.state.inspectingTask, false);
    assert.equal(controller.state.taskDetail, undefined);
    // Duplicate mapping must clear the old records, including detail records.
    replies.set("/api/v1/projects", { projects: [project, { ...project, id: 4 }], total: 2 });
    await poll(controller, clock);
    assert.equal(controller.state.availability, "no-project");
    assert.deepEqual(controller.state.plans, []);
    assert.equal(controller.state.planDetail, undefined);
    assert.equal(controller.state.selectedPlanId, undefined);
  });

test("turning the panel off cancels an in-flight enable without waiting for HTTP", async (t) => {
  const { controller, handlers, preferences } = await fixture(t);
  let started!: () => void;
  const reading = new Promise<void>((resolve) => { started = resolve; });
  handlers.set("/api/v1/tasks?plan_id=7", () => started());
  await controller.setPanelVisible(true);
  const enabling = controller.setPanel(true);
  await reading;
  await Promise.race([
    controller.setPanel(false),
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error("toggle waited for HTTP")), 200);
      timer.unref(); t.after(() => clearTimeout(timer));
    }),
  ]);
  await enabling;
  assert.equal(await preferences.read(), false);
  assert.equal(controller.state.loading, false);
  handlers.clear();
  await controller.setPanelVisible(false);
  await Promise.all([controller.togglePanel(), controller.togglePanel()]);
  assert.equal(await preferences.read(), false);
});

test("missing detail records close inspection without stopping visible summary refreshes",
  async (t) => {
    const { controller, clock } = await fixture(t);
    await controller.openDetails();
    await controller.inspectTask(); // Fixture has no full task route: a real HTTP 404.
    assert.equal(controller.state.inspectingTask, false);
    assert.equal(controller.state.taskDetail, undefined);
    assert.equal(controller.state.detailError?.kind, "missing");
    assert.equal(clock.delay, 10_000);
    await poll(controller, clock);
    assert.equal(controller.state.detailError, undefined);
    assert.equal(controller.state.availability, "ready");
  });

test("exact mapping never treats terminal-normalized repository names as an exact match",
  async (t) => {
    const { controller, replies, requests } = await fixture(t);
    replies.set("/api/v1/projects", { projects: [
      { ...project, repo_name: "owner/\u001b[31mrepo" },
    ], total: 1 });
    await controller.openDetails();
    assert.equal(controller.state.availability, "no-project");
    assert(!requests.some((path) => path.includes("/plans?")));
    assert(!JSON.stringify(controller.state).includes("\\u001b"));
  });

test("opening before local discovery preserves intent without making unready reads", async (t) => {
  const { controller, requests } = await fixture(t);
  await controller.setConnection({ enabled: true, ready: false });
  await controller.openDetails();
  assert.equal(controller.state.detailsOpen, true);
  assert.equal(controller.state.availability, "not-ready");
  assert.equal(requests.length, 0);
  await controller.setConnection({ enabled: true, ready: true, repoName: "owner/repo" });
  assert.equal(controller.state.detailsOpen, true);
  assert.equal(controller.state.selectedProjectId, 3);
  assert.equal(controller.state.availability, "ready");
});

test("explicitly disabled planning discards details and stops polling without changing preference",
  async (t) => {
    const { controller, replies, clock, preferences } = await fixture(t);
    replies.set("/api/v1/tasks/1", { ...task(1, "done"), description: null,
      criteria: [], dependency_ids: [] });
    await controller.setPanel(true);
    await controller.openDetails();
    await controller.inspectTask();
    assert.equal(controller.state.taskDetail?.id, 1);
    replies.set("/.well-known", { schema_version: 1, capabilities: { planning: false } });
    await controller.refresh();
    assert.equal(controller.state.availability, "disabled");
    assert.equal(controller.state.planDetail, undefined);
    assert.equal(controller.state.taskDetail, undefined);
    assert.equal(controller.state.selectedPlanId, undefined);
    assert.equal(clock.callback, undefined);
    assert.equal(await preferences.read(), true);
  });

test("changed mapping clears previous data before reading the new project", async (t) => {
  const { controller, replies, handlers } = await fixture(t);
  await controller.openDetails();
  let started!: () => void;
  const reading = new Promise<void>((resolve) => { started = resolve; });
  replies.set("/api/v1/projects", { projects: [{ ...project, id: 4 }], total: 1 });
  handlers.set("/api/v1/plans?project_id=4&status=active", () => started());
  const refreshing = controller.refresh();
  await reading;
  assert.equal(controller.state.selectedProjectId, 4);
  assert.deepEqual(controller.state.plans, []);
  assert.deepEqual(controller.state.planTasks, {});
  assert.equal(controller.state.planDetail, undefined);
  await controller.closeDetails();
  await refreshing;
});

test("cursor movement during a delayed poll remains selected without extra reads", async (t) => {
  const { controller, handlers, requests } = await fixture(t);
  await controller.openDetails();
  let respond!: () => void;
  let started!: () => void;
  const reading = new Promise<void>((resolve) => { started = resolve; });
  handlers.set("/api/v1/plans/7", (res) => {
    respond = () => res.end(JSON.stringify({ ...plan, goal: null, context: null }));
    started();
  });
  const refreshing = controller.refresh();
  await reading;
  const beforeSelection = requests.length;
  await controller.selectTask(6);
  respond();
  await refreshing;
  assert.equal(controller.state.selectedTaskId, 6);
  assert.equal(requests.length, beforeSelection);
});

for (const status of [401, 403, 404, 405]) {
  test(`passive visibility cannot retry a terminal plans rejection (${status})`, async (t) => {
    // Arrange: the external service rejects a visible planning list.
    const { controller, handlers, requests } = await fixture(t);
    handlers.set("/api/v1/plans?project_id=3&status=active", (response) => {
      response.statusCode = status;
      response.end("Deliberate terminal rejection");
    });
    await controller.setPanel(true);
    await controller.setPanelVisible(true);
    const before = requests.length;

    // Act: a resize or unrelated prompt hides then reveals the existing panel.
    await controller.setPanelVisible(false);
    await controller.setPanelVisible(true);

    // Assert: only an explicit refresh retries, including capability discovery.
    assert.equal(requests.length, before);
    handlers.clear();
    await controller.refresh();
    assert.equal(controller.state.availability, "ready");
    assert.equal(requests.filter((path) => path === "/.well-known").length, 2);
  });
}

test("re-enabling while hidden retains the capability recheck until visible", async (t) => {
  // Arrange: a previously disabled service and a panel hidden by terminal dimensions.
  const { controller, replies, requests } = await fixture(t);
  replies.set("/.well-known", { schema_version: 1, capabilities: { planning: false } });
  await controller.setPanel(true);
  await controller.setPanelVisible(true);
  assert.equal(controller.state.availability, "disabled");
  await controller.setPanelVisible(false);
  replies.set("/.well-known", { schema_version: 1, capabilities: { planning: true } });

  // Act: explicitly re-enable while hidden, then restore enough terminal space.
  await controller.setPanel(false);
  await controller.setPanel(true);
  assert.equal(requests.length, 1, "Hidden re-enable still must not dispatch reads");
  await controller.setPanelVisible(true);

  // Assert: discovery is retried, rather than retaining a disabled cache forever.
  assert.equal(controller.state.availability, "ready");
  assert.equal(requests.filter((path) => path === "/.well-known").length, 2);
});
