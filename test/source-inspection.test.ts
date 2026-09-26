import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createServer, type RequestListener } from "node:http";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import { Value } from "typebox/value";
import { SOURCE_INSPECTION_PARAMETERS, SourceInspector } from "../src/source-inspection.ts";

const execute = promisify(execFile);

async function repository(t: TestContext) {
  const cwd = await mkdtemp(join(tmpdir(), "source-inspection-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const git = (...args: string[]) => execute("git", ["-C", cwd, ...args], {
    env: { PATH: process.env.PATH, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" },
  });
  await git("init", "-q");
  await writeFile(join(cwd, "source.txt"), "hello\n");
  await git("add", "source.txt");
  await git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.test",
    "-c", "commit.gpgsign=false", "commit", "-qm", "fixture");
  const head = (await git("rev-parse", "HEAD")).stdout.trim();
  return { cwd, git, head };
}

async function sourceServer(t: TestContext, handler: RequestListener, host = "127.0.0.1") {
  const server = createServer(handler);
  await new Promise<void>(resolve => server.listen(0, host, resolve));
  t.after(() => new Promise<void>((resolve, reject) => {
    server.closeAllConnections();
    server.close(error => error ? reject(error) : resolve());
  }));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://${host}:${address.port}`;
}

test("reads committed bytes and provenance without changing the repository", async (t) => {
  // Arrange.
  const { cwd, git, head } = await repository(t);
  const index = await readFile(join(cwd, ".git/index"));
  const inspector = new SourceInspector({ cwd, repoName: "fixture/source" });

  // Act.
  const result = await inspector.inspect({ path: "source.txt" });

  // Assert: the digest is the published SHA-256 of the literal six bytes "hello\n".
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.content, "hello\n");
  assert.equal(result.identifier, "source.txt");
  assert.deepEqual(result.source_files, ["source.txt"]);
  assert.equal(result.source_repo, "fixture/source");
  assert.equal(result.encoding_version, head);
  assert.equal(result.fileState, "committed");
  assert.equal(result.contentHash,
    "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03");
  assert.ok(Number.isFinite(Date.parse(result.observedAt)));
  assert.deepEqual(await readFile(join(cwd, ".git/index")), index);
  assert.equal(await readFile(join(cwd, "source.txt"), "utf8"), "hello\n");
  assert.equal((await git("status", "--porcelain")).stdout, "");
});

test("dirty, staged and untracked source bytes never borrow the HEAD commit", async (t) => {
  // Arrange: assume-unchanged deliberately makes Git's status cache unreliable evidence.
  const { cwd, git } = await repository(t);
  await git("update-index", "--assume-unchanged", "source.txt");
  await writeFile(join(cwd, "source.txt"), "hello\r\n");
  await writeFile(join(cwd, "untracked.txt"), "hello\n");
  await writeFile(join(cwd, "staged.txt"), "hello\n");
  await git("add", "staged.txt");
  const inspector = new SourceInspector({ cwd });

  // Act.
  const results = await Promise.all(["source.txt", "untracked.txt", "staged.txt"].map(
    path => inspector.inspect({ path }),
  ));

  // Assert.
  for (const [index, result] of results.entries()) {
    assert.equal(result.status, "ok");
    if (result.status !== "ok") continue;
    assert.equal(result.content, index === 0 ? "hello\r\n" : "hello\n");
    assert.equal(result.encoding_version, undefined);
    assert.equal(result.source_repo, undefined);
    assert.equal(result.fileState, index === 0 ? "modified" : "uncommitted");
  }
});

test("source remains readable when commit provenance is unavailable", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  await rm(join(cwd, ".git"), { recursive: true });
  const inspector = new SourceInspector({ cwd });

  // Act.
  const result = await inspector.inspect({ path: "source.txt" });

  // Assert.
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.content, "hello\n");
  assert.equal(result.fileState, "unknown");
  assert.equal(result.encoding_version, undefined);
  assert.equal(result.provenanceError?.code, "ENOENT");
  assert.match(result.provenanceError?.message ?? "", /no such file or directory/);
});

test("rejects path escapes and non-files while resolving safe internal symlinks", async (t) => {
  // Arrange: a prefix-sharing sibling catches string-prefix containment checks.
  const { cwd } = await repository(t);
  const outside = `${cwd}-outside`;
  await mkdir(outside);
  t.after(() => rm(outside, { recursive: true, force: true }));
  await writeFile(join(outside, "private.txt"), "outside must never be returned");
  await symlink(outside, join(cwd, "escape"));
  await symlink("source.txt", join(cwd, "safe-link"));
  const inspector = new SourceInspector({ cwd });

  // Act.
  const rejected = await Promise.all([
    join(outside, "private.txt"), `../${basename(outside)}/private.txt`, "escape/private.txt", ".",
  ].map(path => inspector.inspect({ path })));
  const safe = await inspector.inspect({ path: "safe-link" });

  // Assert.
  for (const result of rejected) {
    assert.equal(result.status, "error");
    assert.ok(!JSON.stringify(result).includes("outside must never be returned"));
  }
  assert.equal(safe.status, "ok");
  if (safe.status !== "ok") return;
  assert.equal(safe.content, "hello\n");
  assert.deepEqual(safe.source_files, ["source.txt"]);
  assert.equal(safe.fileState, "committed");
});

test("denied, revoked and cancelled reads release no source content", async (t) => {
  // Arrange: revocation during real asynchronous file resolution, using the public trust guard.
  const { cwd } = await repository(t);
  let allowed = true;
  const revoked = new SourceInspector({ cwd, canRead: () => {
    if (allowed) queueMicrotask(() => { allowed = false; });
    return allowed;
  } });
  const controller = new AbortController();
  controller.abort(new Error("Source inspection cancelled by caller"));

  // Act.
  const results = await Promise.all([
    new SourceInspector({ cwd, canRead: () => false }).inspect({ path: "source.txt" }),
    revoked.inspect({ path: "source.txt" }),
    new SourceInspector({ cwd }).inspect({ path: "source.txt" }, controller.signal),
  ]);

  // Assert.
  for (const result of results) {
    assert.equal(result.status, "error");
    assert.ok(!("content" in result));
  }
  assert.match(JSON.stringify(results[0]), /disabled|denied|revoked/i);
  assert.match(JSON.stringify(results[1]), /disabled|denied|revoked/i);
  assert.match(JSON.stringify(results[2]), /cancelled by caller/);
});

test("schema and inspector reject ambiguous requests and write capabilities", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  const inspector = new SourceInspector({ cwd });
  const invalid: unknown[] = [
    null, [], {}, { path: "" }, { path: 1 }, { path: "source.txt", url: "http://localhost" },
    { path: "source.txt", command: "rm source.txt" }, { path: "source.txt", offset: -1 },
    { path: "source.txt", limit: 0 }, { path: "source.txt", offset: 0.5 },
    { path: "source.txt", limit: Number.MAX_SAFE_INTEGER + 1 },
    ...["method", "headers", "body", "cookies", "auth"].map(key => ({
      url: "http://localhost", [key]: "forbidden",
    })),
  ];

  // Act.
  const results = await Promise.all(invalid.map(input => inspector.inspect(input)));

  // Assert.
  assert.equal(SOURCE_INSPECTION_PARAMETERS.type, "object");
  for (const [index, result] of results.entries()) {
    assert.equal(Value.Check(SOURCE_INSPECTION_PARAMETERS, invalid[index]), false);
    assert.equal(result.status, "error");
    if (result.status === "error") assert.equal(result.error.name, "InvalidSourceRequest");
  }
  assert.equal(Value.Check(SOURCE_INSPECTION_PARAMETERS, { path: "source.txt", limit: 5 }), true);
  assert.equal(Value.Check(SOURCE_INSPECTION_PARAMETERS, { url: "https://example.test" }), true);
  assert.equal(await readFile(join(cwd, "source.txt"), "utf8"), "hello\n");
});

test("sanitizes the full text before explicit paging and hashes the original bytes", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  await writeFile(join(cwd, "source.txt"), "password=synthetic123\nhello\n");
  const inspector = new SourceInspector({ cwd });

  // Act.
  const full = await inspector.inspect({ path: "source.txt" });
  const page = await inspector.inspect({ path: "source.txt", offset: 11, limit: 5 });
  const insideSecret = await inspector.inspect({ path: "source.txt", offset: 5, limit: 5 });

  // Assert.
  assert.equal(full.status, "ok");
  assert.equal(page.status, "ok");
  assert.equal(insideSecret.status, "ok");
  if (full.status !== "ok" || page.status !== "ok" || insideSecret.status !== "ok") return;
  assert.equal(full.content, "[redacted]\nhello\n");
  assert.equal(full.sanitized, true);
  assert.equal(page.content, "hello");
  assert.deepEqual(page.page, { offset: 11, totalCharacters: 17, nextOffset: 16 });
  assert.equal(page.contentHash, full.contentHash);
  assert.equal(insideSecret.content, "cted]");
  assert.equal(await readFile(join(cwd, "source.txt"), "utf8"), "password=synthetic123\nhello\n");
});

test("returns full text and honest errors for missing or non-UTF-8 sources", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  const content = "hello\n".repeat(20_000);
  await writeFile(join(cwd, "long.txt"), content);
  await writeFile(join(cwd, "binary"), Buffer.from([0xff, 0xfe, 0x00]));
  const inspector = new SourceInspector({ cwd });

  // Act.
  const full = await inspector.inspect({ path: "long.txt" });
  const binary = await inspector.inspect({ path: "binary" });
  const missing = await inspector.inspect({ path: "missing.txt" });

  // Assert.
  assert.equal(full.status, "ok");
  if (full.status === "ok") assert.equal(full.content, content);
  assert.equal(binary.status, "error");
  assert.equal(missing.status, "error");
  if (missing.status === "error") assert.equal(missing.error.code, "ENOENT");
});

test("GETs URLs without credentials or bodies and identifies the redirected source", async (t) => {
  // Arrange.
  const requests: Array<{ method?: string; url?: string; auth?: string; cookie?: string;
    body: string }> = [];
  const url = await sourceServer(t, (request, response) => {
    let body = "";
    request.on("data", chunk => { body += chunk; });
    request.on("end", () => {
      requests.push({ method: request.method, url: request.url,
        auth: request.headers.authorization, cookie: request.headers.cookie, body });
      if (request.url === "/start") {
        response.writeHead(302, { location: "/source", "set-cookie": "session=private" });
        response.end();
      } else {
        response.end("hello\n");
      }
    });
  });
  const inspector = new SourceInspector({ cwd: tmpdir(), repoName: "unrelated/local" });

  // Act.
  const result = await inspector.inspect({ url: `${url}/start#ignored-fragment` });

  // Assert.
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.content, "hello\n");
  assert.equal(result.identifier, `${url}/source`);
  assert.equal(result.source_url, `${url}/source`);
  assert.equal(result.httpStatus, 200);
  assert.equal(result.contentHash,
    "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03");
  assert.equal(result.source_repo, undefined);
  assert.equal(result.source_files, undefined);
  assert.equal(result.encoding_version, undefined);
  assert.deepEqual(requests, [
    { method: "GET", url: "/start", auth: undefined, cookie: undefined, body: "" },
    { method: "GET", url: "/source", auth: undefined, cookie: undefined, body: "" },
  ]);
});

test("HTTP failures preserve status and actual bodies, with known secrets sanitized", async (t) => {
  // Arrange.
  const bodies = ["Not Found", '{"detail":{"field":"source","reason":"offline"}}',
    "Diagnostic: retry later\npassword=synthetic123"];
  const statuses = [404, 503, 500];
  const url = await sourceServer(t, (request, response) => {
    const index = Number(request.url?.slice(1));
    response.writeHead(statuses[index], "Fixture diagnostic");
    response.end(bodies[index]);
  });
  const inspector = new SourceInspector({ cwd: tmpdir() });

  // Act.
  const results = await Promise.all(bodies.map((_, index) => inspector.inspect({
    url: `${url}/${index}`,
  })));

  // Assert.
  for (const [index, result] of results.entries()) {
    assert.equal(result.status, "error");
    if (result.status !== "error") continue;
    assert.equal(result.httpStatus, statuses[index]);
    assert.equal(result.httpStatusText, "Fixture diagnostic");
    assert.equal(result.source_url, `${url}/${index}`);
    assert.equal(result.body, index === 2 ? "Diagnostic: retry later\n[redacted]" : bodies[index]);
    assert.equal(result.error.name, "HttpError");
  }
});

test("rejects credential URLs, unsafe schemes and private network destinations", async (t) => {
  // Arrange: the first failing case is local, so the red run never reaches a private address.
  let requests = 0;
  const base = await sourceServer(t, (_request, response) => {
    requests++;
    response.end("must not be contacted");
  });
  const inspector = new SourceInspector({ cwd: tmpdir() });
  const urls = [
    base.replace("http://", "http://user:synthetic123@"), `${base}/?api_key=synthetic123`,
    `${base}/?token=synthetic123`, `${base}/?X-Amz-Signature=synthetic123`,
    `${base}/?authorization=synthetic123`, "file:///etc/passwd", "data:text/plain,private",
    "ftp://127.0.0.1/source", "http://169.254.169.254/latest/meta-data/",
    "http://10.0.0.1/source", "http://172.16.0.1/source", "http://192.168.1.1/source",
    "http://100.64.0.1/source", "http://0.0.0.0/source", "http://[::]/source",
    "http://[fd00::1]/source", "http://[::ffff:127.0.0.1]/source",
  ];

  for (const url of urls) {
    // Act.
    const result = await inspector.inspect({ url });
    // Assert.
    assert.equal(result.status, "error", url);
    assert.ok(!JSON.stringify(result).includes("synthetic123"));
  }
  assert.equal(requests, 0);
});

test("validates every redirect before contacting another source", async (t) => {
  // Arrange.
  let destinationRequests = 0;
  const destination = await sourceServer(t, (_request, response) => {
    destinationRequests++;
    response.end("must not be contacted");
  });
  const locations = [destination, destination.replace("http://", "http://user:synthetic123@"),
    "file:///etc/passwd", "http://169.254.169.254/latest/meta-data/"];
  const origin = await sourceServer(t, (request, response) => {
    response.writeHead(302, { location: locations[Number(request.url?.slice(1))] });
    response.end("redirect fixture");
  });
  const inspector = new SourceInspector({ cwd: tmpdir() });

  // Act.
  const results = await Promise.all(locations.map((_, index) => inspector.inspect({
    url: `${origin}/${index}`,
  })));

  // Assert.
  for (const result of results) {
    assert.equal(result.status, "error");
    assert.ok(!JSON.stringify(result).includes("synthetic123"));
  }
  assert.equal(destinationRequests, 0);
});

test("HTTP cancellation preserves the caller reason and releases no content", async (t) => {
  // Arrange: the actual request reaching the fixture triggers cancellation during body access.
  const controller = new AbortController();
  const url = await sourceServer(t, (_request, response) => {
    response.writeHead(200);
    response.write("partial source must not escape");
    controller.abort(new Error("Capture session stopped while reading source"));
  });
  const inspector = new SourceInspector({ cwd: tmpdir() });

  // Act.
  const result = await inspector.inspect({ url }, controller.signal);

  // Assert.
  assert.equal(result.status, "error");
  assert.ok(!("content" in result));
  if (result.status === "error")
    assert.match(result.error.message, /Capture session stopped while reading source/);
});

test("Git metadata outside the trusted directory cannot supply committed provenance", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  const outside = await repository(t);
  await rm(join(cwd, ".git"), { recursive: true });
  await symlink(join(outside.cwd, ".git"), join(cwd, ".git"));
  const inspector = new SourceInspector({ cwd });

  // Act.
  const result = await inspector.inspect({ path: "source.txt" });

  // Assert.
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.content, "hello\n");
  assert.equal(result.encoding_version, undefined);
  assert.equal(result.fileState, "unknown");
  assert.match(result.provenanceError?.message ?? "", /outside.*trusted/i);
});

test("inspection executes no configured Git filters, hooks or filesystem monitor", async (t) => {
  // Arrange: each configured helper would leave a visible file if Git executed it.
  const { cwd, git, head } = await repository(t);
  const marker = join(cwd, "helper-executed");
  const helper = join(cwd, "helper.cjs");
  await writeFile(helper, `#!/usr/bin/env node\nrequire("node:fs").writeFileSync(` +
    `${JSON.stringify(marker)}, "executed");\n`);
  await chmod(helper, 0o755);
  await git("config", "core.fsmonitor", helper);
  await git("config", "filter.fixture.clean", helper);
  await git("config", "filter.fixture.smudge", helper);
  await git("config", "diff.external", helper);
  await writeFile(join(cwd, ".gitattributes"), "source.txt filter=fixture\n");
  await symlink(helper, join(cwd, ".git/hooks/post-index-change"));
  const index = await readFile(join(cwd, ".git/index"));
  const inspector = new SourceInspector({ cwd });

  // Act.
  const result = await inspector.inspect({ path: "source.txt" });

  // Assert.
  assert.equal(result.status, "ok");
  if (result.status === "ok") assert.equal(result.encoding_version, head);
  await assert.rejects(readFile(marker), { code: "ENOENT" });
  await assert.rejects(readFile(join(cwd, ".git/index.lock")), { code: "ENOENT" });
  assert.deepEqual(await readFile(join(cwd, ".git/index")), index);
});

test("read permission revocation during HTTP prevents content and further redirects", async (t) => {
  // Arrange.
  let allowed = true;
  const paths: string[] = [];
  const url = await sourceServer(t, (request, response) => {
    paths.push(request.url!);
    allowed = false;
    response.writeHead(302, { location: "/must-not-follow" });
    response.end("source body must not escape after revocation");
  });
  const inspector = new SourceInspector({ cwd: tmpdir(), canRead: () => allowed });

  // Act.
  const revoked = await inspector.inspect({ url });
  const denied = await inspector.inspect({ url });

  // Assert.
  for (const result of [revoked, denied]) {
    assert.equal(result.status, "error");
    assert.ok(!("content" in result));
    assert.ok(!("body" in result));
    if (result.status === "error") assert.match(result.error.message, /revoked/);
  }
  assert.deepEqual(paths, ["/"]);
});

test("non-regular FIFO sources fail promptly without waiting for a writer", async (t) => {
  // Arrange.
  const { cwd } = await repository(t);
  await execute("mkfifo", [join(cwd, "pipe")]);
  const inspector = new SourceInspector({ cwd });

  // Act.
  const result = await inspector.inspect({ path: "pipe" }, AbortSignal.timeout(1_000));

  // Assert.
  assert.equal(result.status, "error");
  if (result.status === "error") assert.match(result.error.message, /regular file/);
});

test("explicit localhost sources connect using their validated DNS result", async (t) => {
  // Arrange.
  const url = await sourceServer(t, (_request, response) => response.end("hello\n"), "localhost");
  const inspector = new SourceInspector({ cwd: tmpdir() });

  // Act.
  const result = await inspector.inspect({ url });

  // Assert.
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.content, "hello\n");
  assert.equal(result.source_url, `${url}/`);
});
