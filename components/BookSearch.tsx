"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchableChapter = {
  slug: string;
  title: string;
  partTitle: string;
  summary: string;
  plainText: string;
};

export function BookSearch({ chapters }: { chapters: SearchableChapter[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return chapters.filter((chapter) => `${chapter.title} ${chapter.summary} ${chapter.plainText}`.toLowerCase().includes(needle));
  }, [chapters, query]);

  return (
    <section className="panel">
      <h2>Search the chapters</h2>
      <label>
        Search titles and chapter text
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try lifeline, foundation, or marker" />
      </label>
      {query.trim() && (
        <div className="stitch-grid" style={{ marginTop: "1rem" }}>
          <p aria-live="polite">{results.length} {results.length === 1 ? "chapter" : "chapters"}</p>
          {results.map((chapter) => (
            <Link className="card" key={chapter.slug} href={`/book/${chapter.slug}`}>
              <p className="eyebrow">{chapter.partTitle}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary}</p>
            </Link>
          ))}
          {results.length === 0 && <p>No chapter text matched. Chapters that are not in the folder yet cannot be searched.</p>}
        </div>
      )}
    </section>
  );
}
