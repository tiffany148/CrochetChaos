import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStitch, relatedStitches, stitches } from "../../../lib/stitches";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return stitches.map((stitch) => ({ slug: stitch.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const stitch = getStitch(params.slug);
  if (!stitch) return { title: "Stitch" };
  return {
    title: stitch.name,
    description: `${stitch.name}: ${stitch.how}`,
  };
}

export default function StitchPage({ params }: PageProps) {
  const stitch = getStitch(params.slug);
  if (!stitch) notFound();
  const related = relatedStitches(stitch);

  return (
    <article className="detail">
      <p className="eyebrow">{stitch.cat} · {stitch.level}</p>
      <h1>{stitch.name}</h1>
      <div className="meta-row">
        <span className="pill">US {stitch.us}</span>
        <span className="pill">UK {stitch.uk}</span>
        <span className="pill">Chart symbol {stitch.sym}</span>
      </div>
      <p className="lede">{stitch.use}</p>

      <section className="panel">
        <h2>How to work it</h2>
        <p>{stitch.how}</p>
        <p><strong>Height.</strong> {stitch.h}</p>
        <p><strong>Multiple.</strong> {stitch.mult}</p>
      </section>

      <section className="panel">
        <h2>What it is for</h2>
        <p>{stitch.use}</p>
        <p className="callout"><strong>Worth knowing. </strong>{stitch.tip}</p>
      </section>

      <section className="panel">
        <h2>When it goes wrong</h2>
        <p>{stitch.mistake}</p>
      </section>

      <p className="hint">Figure {stitch.fig} in the book.</p>
      {related.length > 0 && (
        <section>
          <h2>More {stitch.cat} stitches</h2>
          <div className="stitch-grid">
            {related.map((item) => (
              <Link className="stitch-card" key={item.slug} href={`/stitches/${item.slug}`}>
                <h3>{item.name}</h3>
                <p className="muted">US {item.us} · UK {item.uk}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <p><Link href="/stitches">Back to the dictionary</Link></p>
    </article>
  );
}
