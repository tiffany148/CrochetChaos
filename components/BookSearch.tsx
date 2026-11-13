"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SearchHit = { slug: string; title: string; partTitle: string; excerpt: string };

export function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const needle = query.trim();
    if (needle.length < 2) {
      setResults([]);
      setTotal(0);
      setBusy(false);
      return;
    }
    const handle = window.setTimeout(() => {
      setBusy(true);
      fetch(`/api/book-search?q=${encodeURIComponent(needle)}`)
        .then((response) => (response.ok ? response.json() : { results: [], total: 0 }))
        .then((data: { results?: SearchHit[]; total?: number }) => {
          setResults(Array.isArray(data.results) ? data.results : []);
          setTotal(typeof data.total === "number" ? data.total : 0);
        })
        .catch(() => {
          setResults([]);
          setTotal(0);
        })
        .finally(() => setBusy(false));
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query]);

  return (
    <section className="panel">
      <h2>Search the chapters</h2>
      <label>
        Search titles and chapter text
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try slip knot, granny, or blocking" />
      </label>
      {query.trim().length >= 2 && (
        <div className="stitch-grid" style={{ marginTop: "1rem" }}>
          <p aria-live="polite">{busy ? "Searching…" : `${total} ${total === 1 ? "chapter" : "chapters"}`}</p>
          {results.map((chapter) => (
            <Link className="card" key={chapter.slug} href={`/book/${chapter.slug}`}>
              <p className="eyebrow">{chapter.partTitle}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.excerpt}</p>
            </Link>
          ))}
          {!busy && total === 0 && <p>No chapter text matched.</p>}
          {!busy && total > results.length && <p>Showing the first {results.length} matches. Add another word to narrow them.</p>}
        </div>
      )}
    </section>
  );
}
