"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { stitchCategories, stitchLevels, stitches } from "../lib/stitches";

export function StitchBrowser() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("All categories");
  const [level, setLevel] = useState("All levels");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return stitches.filter((stitch) => {
      if (category !== "All categories" && stitch.cat !== category) return false;
      if (level !== "All levels" && stitch.level !== level) return false;
      if (!needle) return true;
      return [stitch.name, stitch.us, stitch.uk].join(" ").toLowerCase().includes(needle);
    });
  }, [query, category, level]);

  return (
    <div>
      <p className="eyebrow">Stitch dictionary</p>
      <h1>140 stitches, one page each.</h1>
      <p className="lede">Search by name or abbreviation, then open a stitch to see how to work it, what it is for, and how to fix it. These entries are the shared stitch source for the site.</p>
      <div className="filters">
        <label>
          Search by name or abbreviation
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try hdc, puff, or back loop" />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All categories</option>
            {stitchCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Difficulty
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option>All levels</option>
            {stitchLevels.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? "stitch" : "stitches"}</p>
      <div className="stitch-grid">
        {results.map((stitch) => (
          <Link className="stitch-card" key={stitch.slug} href={`/stitches/${stitch.slug}`}>
            <small>{stitch.level}</small>
            <small>{stitch.cat}</small>
            <h2>{stitch.name}</h2>
            <p><strong>US</strong> {stitch.us} · <strong>UK</strong> {stitch.uk}</p>
            <p className="muted">{stitch.use}</p>
          </Link>
        ))}
      </div>
      {results.length === 0 && <p>No stitches matched. Clear a filter or try the abbreviation printed in your pattern.</p>}
    </div>
  );
}
