import assert from "node:assert/strict";
import test from "node:test";
import { parseChapter } from "./book";
import { getChapter, loadBook } from "./book-load";

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

const bookSample = `---
title: "Grip, tension and first stitches"
type: chapter
part: 2
chapter: 9
---

A practice row.

**Step by step: Slip knot**

![Step 1: Make a loop.](../../assets/howto/sk-01.jpg)

1. Make a loop.

*Step pictures are generated illustrations, not photographs of a physical sample. Trust the written step and the loop count.*

> [!GRANNY] Granny's Wisdom
> Count the stitches you have.

| US | UK |
|---|---|
| sc | dc |

> [!TRY] Try it
> Make ten chains.
`;

test("book markdown keeps callouts, tables, and step captions", () => {
  const chapter = parseChapter(bookSample, {
    resolveImage: (src) => (src.endsWith("sk-01.jpg") ? "/book/howto/sk-01.jpg" : null),
  });
  const steps = chapter.blocks.find((block) => block.type === "steps");
  assert.ok(steps && steps.type === "steps");
  if (steps?.type === "steps") {
    assert.equal(steps.steps.length, 1);
    assert.equal(steps.steps[0]?.caption, "Make a loop.");
    assert.equal(steps.steps[0]?.embeddedBadge, true);
  }
  assert.ok(chapter.blocks.some((block) => block.type === "callout" && block.kind === "wisdom"));
  assert.ok(chapter.blocks.some((block) => block.type === "callout" && block.kind === "try"));
  assert.ok(chapter.blocks.some((block) => block.type === "table" && block.headers[0] === "US"));
  assert.match(chapter.plainText, /Step pictures are generated illustrations, not photographs of a physical sample/);
});

test("the imported book is 15 parts and 84 chapters", () => {
  const book = loadBook();
  assert.equal(book.parts.length, 15);
  assert.equal(book.chapterCount, 84);
  assert.equal(book.documents.length, 102);
  assert.equal(book.documents.at(-1)?.slug, "about-the-author");
  assert.ok(book.sectionCovers?.dictionary.endsWith("/dictionary.jpg"));
  assert.ok(book.sectionCovers?.index.endsWith("/index.jpg"));
  const grip = getChapter("ch09-grip-tension-and-first-stitches");
  assert.ok(grip);
  assert.match(grip.plainText, /Step pictures are generated illustrations, not photographs of a physical sample/);
  assert.ok(grip.blocks.some((block) => block.type === "steps" && block.steps.length > 1));
  const dictionary = getChapter("abbreviation-dictionary");
  assert.ok(dictionary?.blocks.some((block) => block.type === "table"));
  assert.equal(book.documents.filter((chapter) => chapter.plainText.includes("{ch:")).length, 0);
});
