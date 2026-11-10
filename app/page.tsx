import Link from "next/link";
import { getStitch, stitches } from "../lib/stitches";

const featuredSlugs = ["chain", "slip-stitch", "single-crochet", "half-double-crochet", "double-crochet", "treble-crochet"];

export default function HomePage() {
  const featured = featuredSlugs.flatMap((slug) => {
    const stitch = getStitch(slug);
    return stitch ? [stitch] : [];
  });

  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">Tiffany Brooke · The Ultimate Crochet Bible</p>
          <h1>Learn the stitch before the pattern rushes you.</h1>
          <p className="lede">Crochet Chaos is the companion site: {stitches.length} stitches with US and UK names, a glossary, planning calculators, and a project workspace that stays in this browser.</p>
          <form action="/stitches" style={{ marginTop: "1.2rem", maxWidth: "36rem" }}>
            <label>
              Search the dictionary
              <input type="search" name="q" placeholder="magic ring, hdc, puff…" />
            </label>
            <div className="hero-actions">
              <button className="primary" type="submit">Search stitches</button>
            </div>
          </form>
          <div className="hero-actions">
            <Link className="secondary" href="/calculators">Plan yarn and chains</Link>
            <Link className="secondary" href="/reference">Print a reference sheet</Link>
            <Link className="secondary" href="/workspace">Open your projects</Link>
          </div>
        </div>
        <div className="hero-card">
          <strong>{stitches.length}</strong>
          <span>stitch entries, each with how to make it, what it is for, and the mistake that usually causes trouble.</span>
        </div>
      </section>

      <div className="card-grid">
        <Link className="card" href="/stitches">
          <p className="eyebrow">Dictionary</p>
          <h2>Stitches</h2>
          <p>Filter by difficulty or category. Open one stitch at a time instead of a wall of tiny symbols.</p>
        </Link>
        <Link className="card" href="/calculators">
          <p className="eyebrow">Planning</p>
          <h2>Calculators</h2>
          <p>Yardage, foundation chains, hook sizes, US/UK terms, blankets, granny squares, and simple garment math.</p>
        </Link>
        <Link className="card" href="/reference">
          <p className="eyebrow">On paper</p>
          <h2>Print sheets</h2>
          <p>Abbreviations, the hook chart, and the stitch list, set in type you can read away from the screen.</p>
        </Link>
      </div>

      <h2 className="section-title">Start with the six stitches almost every pattern uses</h2>
      <div className="stitch-grid">
        {featured.map((stitch) => (
          <Link className="stitch-card" key={stitch.slug} href={`/stitches/${stitch.slug}`}>
            <small>{stitch.level}</small>
            <h3>{stitch.name}</h3>
            <p><strong>US</strong> {stitch.us} · <strong>UK</strong> {stitch.uk}</p>
            <p className="muted">{stitch.use}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
