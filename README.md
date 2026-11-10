# Crochet Chaos

A mobile-friendly crochet planning app built with Next.js. The starter includes pattern notes and a checklist tracker, local browser saving, stitch/row and yarn estimates, a sample supplies catalog, light/dark mode, and an optional server-side OpenAI helper.

## Deploy on Vercel

1. Import `tiffany148/CrochetChaos` into Vercel and deploy the `main` branch.
2. The app builds without an OpenAI key; the helper will report that it is unconfigured until a key is set.
3. To enable the helper, add `OPENAI_API_KEY` under Vercel **Project Settings → Environment Variables** for the environments you use, then redeploy. Never commit the secret to GitHub or expose it in a `NEXT_PUBLIC_` variable. OpenAI API billing is separate from ChatGPT subscriptions.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Update the shared content

The website and the book are meant to use the same source files.

- Stitches: edit `content/stitches.json`. Each entry needs `name`, `us`, `uk`, `sym`, `cat`, `h`, `how`, `use`, `tip`, `level`, `mult`, `mistake`, and `fig`. Do not add a second stitch list in code. The dictionary, US/UK calculator, and print sheet all read this file.
- Glossary: edit `content/glossary.json` (`term` and `definition`).
- Size charts: edit `content/size-charts.json`. The size page and the garment calculator read it.
- Book chapters: add a Markdown file in `content/book/chapters/`, then add its filename (without `.md`) to the right part in `content/book/manifest.json`. Parts are listed there in reading order. A chapter can start with front matter:

```markdown
---
title: Chapter title
summary: One sentence for the table of contents.
---
```

Tip boxes:

```markdown
:::wisdom
Granny's Wisdom text.
:::

:::dang
Dang, I Wish I'd Known That text.
:::

:::fix
Fix It text.
:::
```

Photo steps use two cards per row. Each line is `number | image path | caption | loop-count checkpoint`. Image paths must start with `/` and live in `public/`, for example `/images/yarnball-hook.webp`.

```markdown
:::steps
1 | /images/yarnball-hook.webp | Put the loop on the hook. | 1 loop on the hook
2 | /images/hero.webp | Yarn over. | Still 1 loop
:::
```

After changing content, run `npx tsc --noEmit` and `npx next build`.

## Limitations

- Pattern data is stored in this browser only. There are no accounts or cloud sync, so browser data is not shared across devices.
- Pattern lines become simple checklist items; the app does not verify crochet instructions.
- The shop is a sample catalog only; it has no inventory, outbound retailer links, cart, or payment processing.
- Calculators provide rough estimates; gauge, shaping, construction, stitch multiples, and the pattern's turning-chain rules affect actual results.
