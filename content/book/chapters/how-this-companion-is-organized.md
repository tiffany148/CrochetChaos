---
title: How this companion is organized
summary: How book chapters, tip boxes, and photo steps show up on the site. The rest of the manuscript is added as Markdown files.
---

This page is the first chapter file in `content/book`. It shows the formats the site already knows how to render. The other parts are waiting for their chapter files. They are not written here yet.

## What a chapter can include

- Ordinary paragraphs and lists
- Granny's Wisdom, Dang I Wish I'd Known That, and Fix It boxes
- Photo steps, two across, with a number, a caption, and a loop-count checkpoint

The stitch dictionary, glossary, and size charts stay in their JSON files. A chapter can point readers there. It does not copy those lists.

:::wisdom
Count the stitches you have, not the ones you hoped to have. A marker in the first stitch of the round is cheaper than frogging.
:::

:::dang
When a foundation chain fights you, chain it on a hook one size larger, then switch back. The first row stops pulling in.
:::

:::fix
If a row is short by one, look at the last stitch before the turning chain. It is the stitch most often skipped.
:::

## A photo step

These two pictures are the site's own photos, used here so the step layout can be checked. A later chapter can point at its own images under `public/images`.

:::steps
1 | /images/yarnball-hook.webp | The loop sits on the hook. The stitch marker is only there so you can see the loop. | 1 loop on the hook
2 | /images/hero.webp | Yarn, hooks, and markers ready before the first row. Nothing has been worked yet. | Still 1 loop
:::
