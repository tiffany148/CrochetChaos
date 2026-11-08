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

## Limitations

- Pattern data is stored in this browser only. There are no accounts or cloud sync, so browser data is not shared across devices.
- Pattern lines become simple checklist items; the app does not verify crochet instructions.
- The shop is a sample catalog only; it has no inventory, outbound retailer links, cart, or payment processing.
- Calculators provide rough estimates; gauge, shaping, construction, stitch multiples, and the pattern's turning-chain rules affect actual results.
