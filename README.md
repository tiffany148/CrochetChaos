# Crochet Chaos

A mobile-friendly crochet planning starter built with Next.js. Features include a pattern shelf, row/round checklist tracker, project notes, gauge-based stitch and row estimates, yarn estimate, and light/dark mode.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current limitations

- Pattern and project data is saved in this browser only; there are no accounts or cloud sync yet.
- Pattern instructions are split into checklist lines, not verified or fully interpreted. Review them against the original pattern.
- AI, PDF/OCR import, Supabase cloud storage, and payment checkout are not included in this initial version.
- Calculator outputs are estimates; gauge, shaping, construction, stitch multiples, and the pattern’s turning-chain rules matter.

## Use with GitHub Mobile

GitHub Mobile can view the files and review pull requests, but it does not run a Next.js development server. To preview the site, use a computer or a cloud development/deployment environment such as GitHub Codespaces or Vercel.
