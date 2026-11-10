"use client";

import { useMemo, useState } from "react";
import { glossary } from "../lib/stitches";

export function GlossaryBrowser() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return glossary;
    return glossary.filter((entry) => `${entry.term} ${entry.definition}`.toLowerCase().includes(needle));
  }, [query]);

  return (
    <div>
      <p className="eyebrow">Glossary</p>
      <h1>Words a pattern assumes you know.</h1>
      <p className="lede">{glossary.length} terms from the shared glossary. Stitch-by-stitch instructions live in the dictionary.</p>
      <label>
        Search the glossary
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ease, frog, or dye lot" />
      </label>
      <p aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? "term" : "terms"}</p>
      <div className="stitch-grid">
        {results.map((entry) => (
          <article className="panel" key={entry.term}>
            <h2>{entry.term}</h2>
            <p>{entry.definition}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
