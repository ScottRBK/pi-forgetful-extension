import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  mkdtemp, readFile, readdir, rm, stat, symlink, truncate, writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import { FileLogger } from "../src/logging.ts";

const run = promisify(execFile);
const loggingModule = new URL("../src/logging.ts", import.meta.url).href;

async function workspace(t: TestContext): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "forgetful-log-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function events(file: string) {
  return (await readFile(file, "utf8")).trim().split("\n").map(line => JSON.parse(line));
}

test("off never creates the logging directory", async t => {
  // Arrange.
  const root = await workspace(t);
  const logger = new FileLogger({ directory: join(root, "logs"), sessionId: "s", level: "off" });

  // Act.
  logger.emit("info", "hidden");
  logger.emit("debug", "hidden");
  await logger.flush();

  // Assert.
  assert.deepEqual(await readdir(root), []);
});

test("enabled logging writes ordered JSONL with level filtering and nested data", async t => {
  // Arrange.
  const directory = join(await workspace(t), "logs");
  const logger = new FileLogger({ directory, sessionId: "session-a", level: "info" });

  // Act.
  logger.emit("debug", "filtered");
  logger.emit("info", "started", { count: 2, event: "nested" });
  logger.setLevel("debug");
  logger.emit("debug", "detail", { text: "two\nlines 🌍" });
  await logger.flush();

  // Assert.
  const rows = await events(logger.filePath);
  assert.deepEqual(rows.map(row => row.event), ["started", "detail"]);
  assert.deepEqual(rows.map(row => row.level), ["info", "debug"]);
  assert.deepEqual(rows[0].data, { count: 2, event: "nested" });
  assert.equal(rows[1].data.text, "two\nlines 🌍");
  for (const row of rows) {
    assert.equal(row.sessionId, "session-a");
    assert.equal(new Date(row.timestamp).toISOString(), row.timestamp);
  }
  assert.ok((await readFile(logger.filePath, "utf8")).endsWith("\n"));
});

test("off discards queued events even after re-enabling; flush is the write barrier", async t => {
  // Arrange.
  const root = await workspace(t);
  const logger = new FileLogger({ directory: join(root, "logs"), sessionId: "s", level: "info" });

  // Act.
  logger.emit("info", "discarded");
  logger.setLevel("off");
  await logger.flush();
  const afterOff = await readdir(root);
  logger.setLevel("info");
  logger.emit("info", "also-discarded");
  logger.setLevel("off");
  logger.setLevel("debug");
  logger.emit("debug", "kept");
  await logger.flush();
  logger.setLevel("off");
  logger.emit("info", "hidden");
  await logger.flush();

  // Assert.
  assert.deepEqual(afterOff, []);
  assert.deepEqual((await events(logger.filePath)).map(row => row.event), ["kept"]);
});

test("logs redact secrets and exclude nested authentication and arbitrary headers", async t => {
  // Arrange.
  const directory = await workspace(t);
  const logger = new FileLogger({ directory, sessionId: "s", level: "debug" });
  const data = {
    text: "Bearer synthetic-access-token",
    password: "private-password",
    request: {
      headers: { "x-custom": "private-header" },
      rawHeaders: ["x-custom", "private-raw-header"],
      authentication: { user: "private-user" },
      Authorization: "Basic private-basic",
      auth: "private-auth",
      cookie: "private-cookie",
      nested: [{ response_headers: { custom: "private-response" }, status: 200 }],
    },
    status: "ok",
  };

  // Act.
  logger.emit("debug", "request", data);
  await logger.flush();

  // Assert.
  const text = await readFile(logger.filePath, "utf8");
  assert.ok(!text.includes("private-"));
  assert.ok(!text.includes("synthetic-access-token"));
  const [row] = await events(logger.filePath);
  assert.equal(row.data.status, "ok");
  assert.equal(row.data.request.nested[0].status, 200);
  assert.equal(row.data.password, "[redacted]");
  assert.ok(!("headers" in row.data.request));
  assert.equal(data.request.headers["x-custom"], "private-header");
});

test("disk failure warns once and cannot escape emit, flush, or a throwing callback", async t => {
  // Arrange: a real file blocks directory creation.
  const directory = join(await workspace(t), "blocked");
  await writeFile(directory, "existing file");
  const warnings: unknown[] = [];
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info",
    onError: error => { warnings.push(error); throw new Error("callback failure"); },
  });

  // Act.
  assert.doesNotThrow(() => logger.emit("info", "first"));
  await assert.doesNotReject(logger.flush());
  logger.emit("info", "second");
  await assert.doesNotReject(logger.flush());

  // Assert.
  assert.equal(warnings.length, 1);
  assert.ok(warnings[0] instanceof Error);
  assert.equal(await readFile(directory, "utf8"), "existing file");
});

test("a real ENOSPC write failure stops the writer and discards later queued events",
  { skip: process.platform !== "linux" }, async t => {
    // Arrange: Linux's full device rejects real writes with ENOSPC.
    const directory = await workspace(t);
    const warnings: unknown[] = [];
    const logger = new FileLogger({
      directory, sessionId: "s", level: "info", onError: error => warnings.push(error),
    });
    await symlink("/dev/full", logger.filePath);

    // Act.
    logger.emit("info", "first");
    logger.emit("info", "queued");
    await assert.doesNotReject(logger.flush());
    await rm(logger.filePath);
    logger.emit("info", "after-failure");
    await logger.flush();

    // Assert.
    assert.equal((warnings[0] as NodeJS.ErrnoException).code, "ENOSPC");
    assert.equal(warnings.length, 1);
    assert.deepEqual(await readdir(directory), []);
  });

test("unserializable diagnostic data cannot interrupt work or poison later events", async t => {
  // Arrange.
  const directory = await workspace(t);
  const warnings: unknown[] = [];
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info", onError: error => warnings.push(error),
  });
  const circular: Record<string, unknown> = {};
  circular.self = circular;
  const throwing = { get value(): string { throw new Error("getter failure"); } };

  // Act.
  assert.doesNotThrow(() => logger.emit("info", "circular", circular));
  assert.doesNotThrow(() => logger.emit("info", "bigint", { value: 1n }));
  assert.doesNotThrow(() => logger.emit("info", "getter", throwing));
  logger.emit("info", "healthy");
  await assert.doesNotReject(logger.flush());

  // Assert.
  assert.equal(warnings.length, 1);
  assert.equal((await events(logger.filePath)).at(-1).event, "healthy");
});

test("oversized Unicode events become marked valid JSONL within the exact byte limit", async t => {
  // Arrange.
  const directory = await workspace(t);
  const logger = new FileLogger({
    directory, sessionId: "s", level: "debug", maxEventBytes: 256,
  });

  // Act.
  logger.emit("debug", "large", { text: "🌍\n\"".repeat(500) });
  logger.emit("info", "🌍".repeat(500), { text: "hello" });
  await logger.flush();

  // Assert.
  const text = await readFile(logger.filePath, "utf8");
  const rows = await events(logger.filePath);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].event, "large");
  for (const row of rows) {
    assert.equal(row.truncated, true);
    assert.equal(row.sessionId, "s");
  }
  for (const line of text.trimEnd().split("\n")) {
    assert.ok(Buffer.byteLength(line + "\n") <= 256);
    assert.ok(!line.includes("�"));
  }
});

test("rotation retains only the newest three files and respects UTF8 file byte limits", async t => {
  // Arrange.
  const directory = await workspace(t);
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info", maxFileBytes: 300,
  });

  // Act: each event fits, but two together exceed the file limit.
  for (let index = 0; index < 10; index++) {
    logger.emit("info", `event-${index}`, { text: "🌍".repeat(25) });
  }
  await logger.flush();

  // Assert.
  const names = await readdir(directory);
  assert.equal(names.length, 3);
  const retained = [];
  for (const name of names) {
    const file = join(directory, name);
    const bytes = await readFile(file);
    assert.ok(bytes.length <= 300);
    assert.ok(!bytes.toString("utf8").includes("�"));
    retained.push(...await events(file));
  }
  assert.deepEqual(retained.map(row => row.event).sort(), ["event-7", "event-8", "event-9"]);
  assert.equal((await events(logger.filePath)).at(-1).event, "event-9");
});

test("burst logging bounds pending bytes and reports dropped events once", async t => {
  // Arrange.
  const directory = await workspace(t);
  const warnings: unknown[] = [];
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info", onError: error => warnings.push(error),
  });

  // Act: one synchronous burst prevents the filesystem from draining the pending queue.
  for (let index = 0; index < 500; index++) {
    logger.emit("info", "burst", { index, text: "x".repeat(12_000) });
  }
  await logger.flush();
  const rows = await events(logger.filePath);
  logger.emit("info", "recovered");
  await logger.flush();

  // Assert: at most 1 MiB is accepted from this burst; later logging still works.
  assert.ok(rows.length > 0 && rows.length < 100);
  assert.equal(warnings.length, 1);
  assert.match(String(warnings[0]), /queue|pending/i);
  assert.equal((await events(logger.filePath)).at(-1).event, "recovered");
  assert.deepEqual(rows.map(row => row.data.index), rows.map((_, index) => index));
});

test("concurrent sessions and processes rotate independently, including repeated session IDs",
  async t => {
    // Arrange.
    const directory = await workspace(t);
    const loggers = ["shared", "shared", "other"].map(sessionId => new FileLogger({
      directory, sessionId, level: "info", maxFileBytes: 300,
    }));
    const script = `
      import { FileLogger } from ${JSON.stringify(loggingModule)};
      const logger = new FileLogger({
        directory: process.argv[1], sessionId: "shared", level: "info", maxFileBytes: 300,
      });
      for (let i = 0; i < 10; i++) logger.emit("info", "event-" + i, { text: "x".repeat(100) });
      await logger.flush();
      console.log(logger.filePath);
    `;

    // Act.
    const children = [0, 1].map(() => run(process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval", script, directory]));
    for (const logger of loggers) {
      for (let i = 0; i < 10; i++) {
        logger.emit("info", `event-${i}`, { text: "x".repeat(100) });
      }
    }
    await Promise.all(loggers.map(logger => logger.flush()));
    const results = await Promise.all(children);

    // Assert.
    const paths = [...loggers.map(logger => logger.filePath),
      ...results.map(result => result.stdout.trim())];
    assert.equal(new Set(paths).size, 5);
    assert.equal((await readdir(directory)).length, 15);
    for (const path of paths) {
      assert.equal((await events(path))[0].event, "event-9");
      assert.equal((await events(`${path}.1`))[0].event, "event-8");
      assert.equal((await events(`${path}.2`))[0].event, "event-7");
    }
    assert.equal((await events(loggers[2].filePath))[0].sessionId, "other");
  });

test("directory retention removes exited writers while preserving live writers and unrelated files",
  async t => {
    // Arrange: create actual logs in a process which then exits.
    const directory = await workspace(t);
    const active = new FileLogger({ directory, sessionId: "active", level: "info" });
    active.emit("info", "before-cleanup");
    await active.flush();
    await writeFile(join(directory, "keep.txt"), "unrelated");
    const script = `
      import { FileLogger } from ${JSON.stringify(loggingModule)};
      for (let i = 0; i < 65; i++) {
        const logger = new FileLogger({
          directory: process.argv[1], sessionId: "retired-" + i, level: "info",
        });
        logger.emit("info", "old");
        await logger.flush();
      }
    `;
    await run(process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval", script, directory]);
    const logger = new FileLogger({ directory, sessionId: "new", level: "info" });

    // Act.
    logger.emit("info", "cleanup");
    await logger.flush();
    active.emit("info", "after-cleanup");
    await active.flush();

    // Assert.
    const names = await readdir(directory);
    assert.ok(names.length <= 61);
    assert.equal(await readFile(join(directory, "keep.txt"), "utf8"), "unrelated");
    assert.deepEqual((await events(active.filePath)).map(row => row.event),
      ["before-cleanup", "after-cleanup"]);
    assert.equal((await events(logger.filePath))[0].event, "cleanup");
  });


test("directory retention also bounds bytes when fewer than sixty old files exist", async t => {
  // Arrange: sparse files exercise disk retention without allocating large test buffers.
  const directory = await workspace(t);
  const script = `
    import { FileLogger } from ${JSON.stringify(loggingModule)};
    const logger = new FileLogger({
      directory: process.argv[1], sessionId: "retired", level: "info",
    });
    logger.emit("info", "old");
    await logger.flush();
    console.log(logger.filePath);
  `;
  const { stdout } = await run(process.execPath,
    ["--import", "tsx", "--input-type=module", "--eval", script, directory]);
  await truncate(stdout.trim(), 101 * 1024 * 1024);
  const logger = new FileLogger({ directory, sessionId: "new", level: "info" });

  // Act.
  logger.emit("info", "cleanup");
  await logger.flush();

  // Assert.
  let bytes = 0;
  for (const name of await readdir(directory)) bytes += (await stat(join(directory, name))).size;
  assert.ok(bytes <= 100 * 1024 * 1024);
  assert.equal((await events(logger.filePath))[0].event, "cleanup");
});

test("custom JSON conversion cannot bypass privacy filtering", async t => {
  // Arrange.
  const directory = await workspace(t);
  const logger = new FileLogger({ directory, sessionId: "s", level: "debug" });
  const data = {
    status: "ok",
    toJSON: () => ({ headers: { custom: "private-header" }, password: "private-password" }),
  };

  // Act.
  logger.emit("debug", "request", data);
  await logger.flush();

  // Assert.
  assert.ok(!(await readFile(logger.filePath, "utf8")).includes("private-"));
  assert.equal((await events(logger.filePath))[0].data.status, "ok");
});

test("single-file rotation keeps the last event and caps oversized events", async t => {
  // Arrange.
  const directory = await workspace(t);
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info", maxFileBytes: 256, maxFiles: 1,
  });

  // Act.
  logger.emit("info", "old", { text: "x".repeat(100) });
  logger.emit("info", "new", { text: "🌍".repeat(500) });
  await logger.flush();

  // Assert.
  assert.equal((await readdir(directory)).length, 1);
  assert.ok((await readFile(logger.filePath)).length <= 256);
  const rows = await events(logger.filePath);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].event, "new");
  assert.equal(rows[0].truncated, true);
});

test("limits too small for an envelope drop events without creating files", async t => {
  // Arrange.
  const root = await workspace(t);
  const warnings: unknown[] = [];
  const logger = new FileLogger({
    directory: join(root, "logs"), sessionId: "s", level: "info", maxEventBytes: 1,
    onError: error => warnings.push(error),
  });

  // Act.
  logger.emit("info", "first");
  logger.emit("info", "second");
  await logger.flush();

  // Assert.
  assert.deepEqual(await readdir(root), []);
  assert.equal(warnings.length, 1);
});

test("an asynchronous warning callback cannot cause an unhandled rejection", async t => {
  // Arrange.
  const directory = join(await workspace(t), "blocked");
  await writeFile(directory, "existing file");
  const logger = new FileLogger({
    directory, sessionId: "s", level: "info",
    onError: async () => { throw new Error("async callback failure"); },
  });

  // Act.
  logger.emit("info", "failure");
  await logger.flush();
  await new Promise<void>(resolve => setImmediate(resolve));

  // Assert: Node's test runner also fails on unhandled promise rejection.
  assert.equal(await readFile(directory, "utf8"), "existing file");
});

test("stalled filesystem writes cannot hold flush indefinitely",
  { skip: process.platform !== "linux", timeout: 5_000 }, async t => {
    // Arrange: a real FIFO blocks appendFile until a reader appears.
    const directory = await workspace(t);
    const warnings: unknown[] = [];
    const logger = new FileLogger({
      directory, sessionId: "stalled", level: "info", onError: error => warnings.push(error),
    });
    await run("mkfifo", [logger.filePath]);
    const released = new Promise<string>((resolve, reject) => {
      setTimeout(() => readFile(logger.filePath, "utf8").then(resolve, reject), 1_500);
    });
    try {
      // Act.
      logger.emit("info", "started");
      const started = performance.now();
      await logger.flush();

      // Assert: logging gives up before the blocked write is released.
      assert.ok(performance.now() - started < 1_000, "flush waited for the blocked filesystem");
      assert.equal(warnings.length, 1);
      assert.match(String(warnings[0]), /timed out/i);
    } finally {
      // Release the real filesystem operation so the test leaves no blocked worker behind.
      await released;
      await logger.flush();
    }
  });

test("retired writers are pruned in the same process without deleting active logs", async t => {
  // Arrange: one live writer must survive many session replacements in the same process.
  const directory = await workspace(t);
  const active = new FileLogger({ directory, sessionId: "active", level: "info" });
  active.emit("info", "active-session");
  await active.flush();

  // Act: each retired writer represents a session/reset that has finished flushing.
  let last: FileLogger | undefined;
  for (let index = 0; index < 65; index++) {
    const logger = new FileLogger({ directory, sessionId: `session-${index}`, level: "info" });
    logger.emit("info", "session-event");
    await logger.close();
    last = logger;
  }

  // Assert: soft retention now includes known retired writers, but not the active writer.
  assert.ok((await readdir(directory)).length <= 60);
  assert.equal((await events(active.filePath))[0].event, "active-session");
  const before = await readFile(last!.filePath, "utf8");
  last!.setLevel("debug");
  last!.emit("debug", "must-not-reopen");
  await last!.flush();
  assert.equal(await readFile(last!.filePath, "utf8"), before);
  await active.close();
});
