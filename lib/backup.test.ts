import assert from "node:assert/strict";
import test from "node:test";
import { mergePatterns, parseBackup } from "./backup";

const scarf = { id: "scarf", title: "Scarf", source: "", steps: [{ id: "s", text: "Row 1", done: false }], current: 2, notes: "", category: "Gifts" };
const hat = { id: "hat", title: "Hat", source: "", steps: [], current: 0, notes: "" };

test("a backup preview keeps valid projects and reports junk", () => {
  const preview = parseBackup(JSON.stringify({ patterns: [scarf, { title: "no id" }, scarf], activeId: "scarf" }));
  assert.equal(preview.patterns.length, 1);
  assert.equal(preview.patterns[0]?.category, "Gifts");
  assert.equal(preview.rejected, 2);
  assert.equal(preview.activeId, "scarf");
  assert.deepEqual(preview.errors, []);
});

test("invalid JSON does not invent projects", () => {
  const preview = parseBackup("{");
  assert.equal(preview.patterns.length, 0);
  assert.equal(preview.errors.length, 1);
});

test("merge updates the same id and keeps the other projects", () => {
  const merged = mergePatterns([hat, { ...scarf, title: "Old scarf" }], [{ ...scarf, title: "New scarf" }]);
  assert.deepEqual(merged.map((pattern) => pattern.title), ["New scarf", "Hat"]);
});
