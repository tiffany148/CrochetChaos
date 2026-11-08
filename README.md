# Crochet Chaos

A mobile-friendly crochet planner and pattern tracker built with Next.js.

## Features
- Pattern shelf for saved patterns
- Smart checklist for rows and rounds
- Stitch and row estimate calculators
- Yarn estimate calculator
- Shop cards for yarn, hooks, tools, and books
- AI crochet helper using the OpenAI API
- Light/dark mode

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Required environment variable

Create a `.env.local` file and add:

```env
OPENAI_API_KEY=your_key_here
```

The AI helper route uses this key on the server. Do not commit secrets.
