import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

/** Include retained rotation files; each trace may begin at a fresh file boundary. */
export async function savedLogText(filePath: string): Promise<string> {
  const directory = dirname(filePath);
  const base = basename(filePath);
  const names = (await readdir(directory)).filter(name => name === base ||
    (name.startsWith(base + ".") && /^\d+$/.test(name.slice(base.length + 1))));
  names.sort((a, b) => Number(b.slice(base.length + 1) || 0) -
    Number(a.slice(base.length + 1) || 0));
  return (await Promise.all(names.map(name => readFile(join(directory, name), "utf8")))).join("");
}

/** Read logical diagnostics from saved JSONL, including the public trace-chunk protocol. */
export function logicalLogRows(text: string): any[] {
  const rows = text.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
  const traces = new Map<string, any[]>();
  for (const row of rows) {
    if (row.event !== "diagnostic.trace_chunk") continue;
    assert.equal(row.trace.version, 1);
    assert.ok(Buffer.byteLength(JSON.stringify(row) + "\n") <= 256 * 1024);
    const parts = traces.get(row.trace.id) ?? [];
    parts.push(row);
    traces.set(row.trace.id, parts);
  }
  const result = rows.filter(row => row.event !== "diagnostic.trace_chunk");
  for (const parts of traces.values()) {
    parts.sort((a, b) => a.trace.index - b.trace.index);
    assert.equal(parts.length, parts[0].trace.total);
    parts.forEach((part, index) => assert.equal(part.trace.index, index));
    const serialized = parts.map(part => part.trace.chunk).join("");
    assert.equal(Buffer.byteLength(serialized), parts[0].trace.bytes);
    const row = JSON.parse(serialized);
    assert.equal(row.event, parts[0].trace.event);
    result.push(row);
  }
  return result;
}
