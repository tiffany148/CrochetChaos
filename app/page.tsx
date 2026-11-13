import Link from "next/link";
import { CardPhoto, CraftPhoto, PhotoBanner, PhotoGallery, SectionDivider } from "../components/CraftPhoto";
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
        <div className="hero-copy">
          <p className="eyebrow">Tiffany Stark · The Ultimate Crochet Bible</p>
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
        <div className="hero-aside">
          <div className="hero-photo">
            <CraftPhoto
              shot="hero"
              alt="Pink, teal, purple, and lime balls of yarn with crochet hooks, stitch markers, and granny squares."
              fill
              priority
              sizes="(max-width: 860px) 100vw, 680px"
              className="hero-aside-img"
            />
          </div>
          <p className="hero-badge">
            <strong>{stitches.length} stitches</strong>
            <span>How to make them, what they are for, and how to fix them.</span>
          </p>
        </div>
      </section>

      <PhotoGallery items={["granny", "yarn", "cascade", "hooks"]} />

      <SectionDivider />

      <div className="card-grid">
        <Link className="card card-photo" href="/stitches">
          <CardPhoto shot="squares" />
          <div className="card-copy">
            <p className="eyebrow">Dictionary</p>
            <h2>Stitches</h2>
            <p>Filter by difficulty or category. Open one stitch at a time instead of a wall of tiny symbols.</p>
          </div>
        </Link>
        <Link className="card card-photo" href="/calculators">
          <CardPhoto shot="swatches" />
          <div className="card-copy">
            <p className="eyebrow">Planning</p>
            <h2>Calculators</h2>
            <p>Yardage, foundation chains, hook sizes, US/UK terms, blankets, granny squares, and simple garment math.</p>
          </div>
        </Link>
        <Link className="card card-photo" href="/reference">
          <CardPhoto shot="book" />
          <div className="card-copy">
            <p className="eyebrow">On paper</p>
            <h2>Print sheets</h2>
            <p>Abbreviations, the hook chart, and the stitch list, set in type you can read away from the screen.</p>
          </div>
        </Link>
      </div>

      <PhotoBanner shot="stitch" />
      <h2 className="section-title">Start with the six stitches almost every pattern uses</h2>
      <div className="stitch-grid">
        {featured.map((stitch) => (
          <Link className="stitch-card" data-cat={stitch.cat} data-level={stitch.level} key={stitch.slug} href={`/stitches/${stitch.slug}`}>
            <div className="card-banner">
              <span className="pill" data-level={stitch.level}>{stitch.level}</span>
              <span className="pill" data-cat={stitch.cat}>{stitch.cat}</span>
              <h2>{stitch.name}</h2>
            </div>
            <div className="card-body">
              <p><strong>US</strong> {stitch.us} · <strong>UK</strong> {stitch.uk}</p>
              <p className="muted">{stitch.use}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
