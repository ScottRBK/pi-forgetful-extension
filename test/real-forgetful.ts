import { spawn } from "node:child_process";
import { once } from "node:events";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { type TestContext } from "node:test";

const source = process.env.FORGETFUL_TEST_SOURCE;

export async function startForgetful(t: TestContext): Promise<string> {
  const child = spawn(
    join(source!, ".venv/bin/python"),
    [resolve("scripts/forgetful-test-server.py"), source!],
    { cwd: "/tmp", stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = once(child, "exit");
  t.after(async () => {
    child.kill("SIGTERM");
    await exited;
  });
  let errors = "";
  child.stderr.on("data", (data) => {
    errors = (errors + data).slice(-4000);
  });
  const lines = createInterface({ input: child.stdout });
  return Promise.race([
    (async () => {
      for await (const line of lines) {
        if (line.startsWith("READY ")) return line.slice(6);
      }
      throw new Error(`Test server exited: ${errors}`);
    })(),
    new Promise<never>((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Server startup: ${errors}`)),
        20_000,
      );
      timer.unref();
      t.after(() => clearTimeout(timer));
    }),
  ]);
}

export const realOptions = {
  skip: !source && "Set FORGETFUL_TEST_SOURCE to a Forgetful checkout",
  timeout: 30_000,
};
