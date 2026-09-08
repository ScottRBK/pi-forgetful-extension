import assert from "node:assert/strict";
import test from "node:test";
import {
  hasSensitiveData,
  isMemoryOperation,
  sanitizeText,
  sanitizeValue,
} from "../src/privacy.ts";

test("known credential material is removed before memory processing", () => {
  // Arrange: synthetic credentials in the forms commonly seen in tools and prompts.
  const secrets = [
    "Authorization: Bearer synthetic-access-token-123",
    "Authorization: Bearer SYNTHETIC.ACCESS/TOKEN-123=",
    "api_key = 'synthetic-private-key'",
    "postgres://admin:secret@localhost/db",
    "-----BEGIN PRIVATE KEY-----\nsynthetic\n-----END PRIVATE KEY-----",
    `ghp_${"A".repeat(36)}`,
    `sk-proj-${"b".repeat(45)}`,
  ];

  // Act and assert: retained text contains no original credential.
  for (const secret of secrets) {
    assert.equal(hasSensitiveData(secret), true);
    assert.notEqual(sanitizeText(secret), secret);
    assert.equal(hasSensitiveData(sanitizeText(secret)), false);
  }
});

test("personal identifiers and payroll lines are removed while ordinary decisions survive", () => {
  // Arrange.
  const input =
    "Use SQLite.\nPayroll: Scott salary 80000\nEmail: person@example.test\n" +
    "SSN: 123-45-6789\nBank account: 1234567890\nKeep migration history.";

  // Act.
  const safe = sanitizeText(input);

  // Assert.
  assert.ok(safe.includes("Use SQLite."));
  assert.ok(safe.includes("Keep migration history."));
  assert.ok(!safe.includes("80000"));
  assert.ok(!safe.includes("person@example.test"));
  assert.ok(!safe.includes("123-45-6789"));
  assert.ok(!safe.includes("1234567890"));
  assert.equal(hasSensitiveData("We selected SQLite for this project."), false);
});

test("memory tools cannot become independent evidence through connector wrappers", () => {
  // Arrange and act.
  const memoryTools = [
    "forgetful_recall",
    "forgetful_resolve",
    "create_memory",
    "mcp__codex_apps__forgetful_execute_forgetful_tool",
  ];

  // Assert.
  for (const name of memoryTools) assert.equal(isMemoryOperation(name), true);
  assert.equal(isMemoryOperation("edit"), false);
  assert.equal(isMemoryOperation("bash"), false);
});

test("structured model inputs remain valid JSON while sensitive fields are removed", () => {
  // Arrange.
  const input = {
    prompt: "Use SQLite",
    account: { password: "private", salary: 80000 },
    entries: [{ id: "user-1", text: "Contact person@example.test" }],
  };

  // Act.
  const safe = sanitizeValue(input);
  const encoded = JSON.stringify(safe);

  // Assert.
  assert.equal((JSON.parse(encoded) as typeof input).prompt, "Use SQLite");
  assert.ok(!encoded.includes("private"));
  assert.ok(!encoded.includes("80000"));
  assert.ok(!encoded.includes("person@example.test"));
  assert.equal(input.account.password, "private");
});
