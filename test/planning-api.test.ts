import assert from "node:assert/strict";
import { createServer, type ServerResponse } from "node:http";
import test, { type TestContext } from "node:test";
import { ApiPlanningReader } from "../src/adapters/forgetful/planning.ts";

async function endpoint(t: TestContext) {
  const requests: string[] = [];
  let respond = (_res: ServerResponse) => {};
  const server = createServer((req, res) => {
    assert.equal(req.method, "GET");
    assert.equal(req.headers.authorization, "Bearer fixture-token");
    requests.push(req.url!);
    respond(res);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve) => {
    server.closeAllConnections(); server.close(() => resolve());
  }));
  const baseUrl = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/v1`;
  return {
    requests, baseUrl,
    reply(body: unknown, status = 200) {
      respond = (res) => {
        res.statusCode = status;
        res.end(typeof body === "string" ? body : JSON.stringify(body));
      };
    },
    handler(callback: (res: ServerResponse) => void) { respond = callback; },
    reader: new ApiPlanningReader({ baseUrl, token: "fixture-token", secrets: ["custom-secret"] }),
  };
}

test("REST text and original diagnostics are sanitized before entering UI state", async (t) => {
  const { reader, reply } = await endpoint(t);
  reply({ plans: [{ id: 7, project_id: 3, status: "active", task_count: 0,
    title: "\u001b[31mPlan\u001b[0m fixture-\u001b[32mtoken custom-secret\r\b\u0007",
  }], total: 1 });
  const plans = await reader.plans(3);
  assert.equal(plans.ok, true);
  if (plans.ok) assert.equal(plans.value[0].title, "Plan [redacted] [redacted]");
  reply("\u001b[31mNot Found\u001b[0m fixture-token custom-secret", 404);
  const result = await reader.plan(7, 3);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.kind, "missing");
    assert.equal(result.error.status, 404);
    assert.equal(result.error.responseBody, "Not Found [redacted] [redacted]");
    assert.match(result.error.message, /Not Found/);
  }
});

test("REST rejects wrong parents, incomplete lists and malformed detail records", async (t) => {
  const { reader, reply } = await endpoint(t);
  const plan = { id: 7, title: "Plan", project_id: 3, status: "active", task_count: 0 };
  const task = { id: 9, plan_id: 7, title: "Task", state: "doing", priority: "P1",
    assigned_agent: null, version: 1, blocked: true, criteria_met: 0, criteria_total: 1 };
  const invalid = async (result: Awaited<ReturnType<typeof reader.projects>>) => {
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.kind, "invalid");
  };
  // The public result union is shared by all routes, regardless of returned value type.
  const cases: [unknown, () => Promise<{ ok: boolean; error?: { kind: string } }>][] = [
    [{ plans: [{ ...plan, project_id: 4 }], total: 1 }, () => reader.plans(3)],
    [{ plans: [plan], total: 2 }, () => reader.plans(3)],
    [{ plans: [plan, plan], total: 2 }, () => reader.plans(3)],
    [{ tasks: [{ ...task, plan_id: 8 }], total: 1 }, () => reader.tasks(7)],
    [{ tasks: [{ ...task, blocked: "true" }], total: 1 }, () => reader.tasks(7)],
    [{ tasks: [{ ...task, criteria_met: 2 }], total: 1 }, () => reader.tasks(7)],
    [{ ...plan, project_id: 4, goal: null, context: null }, () => reader.plan(7, 3)],
    [{ ...task, id: 10, description: null, criteria: [], dependency_ids: [] },
      () => reader.task(9, 7)],
    [{ ...task, description: null, criteria: [{ id: 2, task_id: 10, description: "Rule",
      met: false, met_at: null }], dependency_ids: [] }, () => reader.task(9, 7)],
    [{ ...task, description: null, criteria: [], dependency_ids: [9] }, () => reader.task(9, 7)],
  ];
  for (const [body, read] of cases) {
    reply(body);
    const result = await read();
    assert.equal(result.ok, false, JSON.stringify(body));
    assert.equal(result.error?.kind, "invalid");
  }
  reply("{bad json");
  await invalid(await reader.projects());
  reply({ projects: [], total: 0 });
  assert.deepEqual(await reader.projects(), { ok: true, value: [] });
});

test("capability fallback preserves authentication and service errors", async (t) => {
  const { reader, reply, requests } = await endpoint(t);
  for (const body of [{ schema_version: 2, capabilities: { planning: true } },
    { schema_version: 1, capabilities: {} }]) {
    reply(body);
    assert.deepEqual(await reader.capabilities(), { ok: true, value: "unknown" });
  }
  for (const status of [404, 405]) {
    reply("Not Found", status);
    assert.deepEqual(await reader.capabilities(), { ok: true, value: "unknown" });
  }
  for (const status of [401, 403, 429, 500]) {
    reply("original service diagnostic", status);
    const result = await reader.capabilities();
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.kind, status < 429 ? "denied" : "transient");
      assert.equal(result.error.responseBody, "original service diagnostic");
    }
  }
  assert(requests.every((path) => path === "/.well-known"));
});

test("planning uses the shared size, timeout, cancellation, TLS and redirect protections",
  async (t) => {
    const { reader, reply, handler, baseUrl } = await endpoint(t);
    reply({ projects: [{ id: 3, name: "x".repeat(1000), repo_name: null }], total: 1 });
    const limited = new ApiPlanningReader({
      baseUrl, token: "fixture-token", maxResponseBytes: 100,
    });
    const tooLarge = await limited.projects();
    assert.equal(tooLarge.ok, false);
    if (!tooLarge.ok) assert.match(tooLarge.error.message, /size limit/);
    handler((res) => { res.writeHead(200); res.write("{"); });
    const slow = new ApiPlanningReader({ baseUrl, token: "fixture-token", timeoutMs: 10 });
    const timeout = await slow.projects();
    assert.equal(timeout.ok, false);
    if (!timeout.ok) assert.match(timeout.error.message, /timed out/);
    const cancelled = new AbortController();
    const pending = reader.projects(cancelled.signal);
    cancelled.abort();
    const aborted = await pending;
    assert.equal(aborted.ok, false);
    if (!aborted.ok) assert.equal(aborted.error.kind, "cancelled");
    handler((res) => { res.writeHead(302, { location: "https://elsewhere.invalid" }); res.end(); });
    assert.equal((await reader.projects()).ok, false);
    assert.throws(() => new ApiPlanningReader({ baseUrl: "http://example.com/api/v1" }), /TLS/);
  });
