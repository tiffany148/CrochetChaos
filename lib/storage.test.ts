import assert from "node:assert/strict";
import test from "node:test";
import { loadWorkspace, patchStoredTheme, serializeWorkspace } from "./storage";

const scarf = {
  id: "scarf",
  title: "Scarf",
  source: "https://example.com/scarf",
  steps: [{ id: "s1", text: "Chain 20", done: false }],
  current: 4,
  notes: "Stopped at the stripe",
};

const hat = {
  id: "hat",
  title: "Hat",
  source: "",
  steps: [{ id: "h1", text: "Round 1", done: true }],
  current: 1,
  notes: "",
};

test("restores a v1-only shelf without requiring the v2 key", () => {
  const loaded = loadWorkspace(null, JSON.stringify({ patterns: [scarf], activeId: "scarf", theme: "dark" }));
  assert.deepEqual(loaded.patterns, [scarf]);
  assert.equal(loaded.activeId, "scarf");
  assert.equal(loaded.theme, "dark");
  assert.equal(loaded.v1Merged, true);
});

test("keeps v2 projects and appends v1 projects that are not already there", () => {
  const loaded = loadWorkspace(
    JSON.stringify({ patterns: [hat], activeId: "hat", theme: "light" }),
    JSON.stringify({ patterns: [scarf, hat], activeId: "scarf", theme: "dark" }),
  );
  assert.deepEqual(loaded.patterns.map((pattern) => pattern.id), ["hat", "scarf"]);
  assert.equal(loaded.activeId, "hat");
  assert.equal(loaded.theme, "light");
});

test("an empty v2 shell written by the key rename still recovers v1 projects and theme", () => {
  const loaded = loadWorkspace(
    JSON.stringify({ patterns: [], activeId: "", theme: "light" }),
    JSON.stringify({ patterns: [scarf], activeId: "scarf", theme: "dark" }),
  );
  assert.deepEqual(loaded.patterns, [scarf]);
  assert.equal(loaded.activeId, "scarf");
  assert.equal(loaded.theme, "dark");
});

test("a dark theme chosen on an otherwise empty v2 shelf is kept", () => {
  const loaded = loadWorkspace(
    JSON.stringify({ patterns: [], activeId: "", theme: "dark" }),
    JSON.stringify({ patterns: [scarf], activeId: "scarf", theme: "light" }),
  );
  assert.equal(loaded.theme, "dark");
  assert.equal(loaded.patterns[0]?.id, "scarf");
});

test("does not copy v1 projects back after they have been merged", () => {
  const loaded = loadWorkspace(
    JSON.stringify({ patterns: [], activeId: "", theme: "light", legacy: { v1Merged: true } }),
    JSON.stringify({ patterns: [scarf], activeId: "scarf", theme: "dark" }),
  );
  assert.deepEqual(loaded.patterns, []);
  assert.equal(loaded.theme, "light");
  assert.equal(loaded.activeId, "");
});

test("drops malformed records and ignores invalid JSON", () => {
  const loaded = loadWorkspace(
    "{",
    JSON.stringify({
      patterns: [{ id: "ok", title: "Ok", steps: [{ id: "", text: "skip", done: false }, { id: "a", text: "keep", done: false }] }, { title: "missing id" }],
      activeId: "missing",
      theme: "nope",
    }),
  );
  assert.equal(loaded.patterns.length, 1);
  assert.equal(loaded.patterns[0]?.id, "ok");
  assert.deepEqual(loaded.patterns[0]?.steps, [{ id: "a", text: "keep", done: false }]);
  assert.equal(loaded.activeId, "");
  assert.equal(loaded.theme, "light");
  assert.equal(loaded.patterns[0]?.source, "");
  assert.equal(loaded.patterns[0]?.notes, "");
  assert.equal(loaded.patterns[0]?.current, 0);
});

test("a theme-only write does not erase saved projects or the v1 merge flag", () => {
  const saved = serializeWorkspace({ patterns: [scarf], activeId: "scarf", theme: "light" });
  const patched = patchStoredTheme(saved, "dark");
  const loaded = loadWorkspace(patched, JSON.stringify({ patterns: [hat], activeId: "hat", theme: "light" }));
  assert.deepEqual(loaded.patterns, [scarf]);
  assert.equal(loaded.theme, "dark");
  assert.equal(loaded.v1Merged, true);
});

test("a theme-only write before any v2 record stays eligible for v1 migration", () => {
  const patched = patchStoredTheme(null, "dark");
  const loaded = loadWorkspace(patched, JSON.stringify({ patterns: [scarf], activeId: "scarf", theme: "light" }));
  assert.equal(loaded.patterns[0]?.id, "scarf");
  assert.equal(loaded.theme, "dark");
});

test("saved v2 payload is readable and does not clear the migration flag", () => {
  const saved = serializeWorkspace({ patterns: [scarf], activeId: "scarf", theme: "dark" });
  const loaded = loadWorkspace(saved, JSON.stringify({ patterns: [hat], activeId: "hat", theme: "light" }));
  assert.deepEqual(loaded.patterns, [scarf]);
  assert.equal(loaded.activeId, "scarf");
  assert.equal(loaded.theme, "dark");
  assert.equal(JSON.parse(saved).legacy.v1Merged, true);
});
