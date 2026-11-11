import assert from "node:assert/strict";
import test from "node:test";
import { parseChapter } from "./book";

const sample = `---
title: Sample
summary: A short chapter
---

Hello lifeline.

:::dang
Chain loosely.
:::

:::steps
1 | /images/yarnball-hook.webp | Loop on the hook | 1 loop
2 | https://example.com/nope.jpg | Skip this | 0
:::
`;

test("chapter text, tip boxes, and safe photo steps are parsed", () => {
  const chapter = parseChapter(sample);
  assert.equal(chapter.title, "Sample");
  assert.equal(chapter.blocks[0]?.type, "paragraph");
  assert.equal(chapter.blocks[1]?.type, "dang");
  const steps = chapter.blocks.find((block) => block.type === "steps");
  assert.ok(steps && steps.type === "steps");
  if (steps?.type === "steps") {
    assert.equal(steps.steps.length, 1);
    assert.equal(steps.steps[0]?.checkpoint, "1 loop");
  }
  assert.match(chapter.plainText, /lifeline/);
  assert.match(chapter.plainText, /Chain loosely/);
});
