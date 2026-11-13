import type { Metadata } from "next";
import Link from "next/link";
import { BookSearch } from "../../components/BookSearch";
import { PhotoBanner } from "../../components/CraftPhoto";
import { loadBook } from "../../lib/book-load";

export const metadata: Metadata = {
  title: "The book",
  description: "Chapters from The Ultimate Crochet Bible, read on Crochet Chaos.",
};

export default function BookPage() {
  const { parts, chapters } = loadBook();
  const published = chapters.length;
  return (
    <div>
      <PhotoBanner shot="book" priority />
      <p className="eyebrow">The Ultimate Crochet Bible</p>
      <h1>Read a chapter.</h1>
      <p className="lede">
        {published} {published === 1 ? "chapter is" : "chapters are"} in the site so far. The rest of the manuscript is added as Markdown files in <code>content/book</code>. The stitch dictionary is separate and already complete.
      </p>
      <BookSearch chapters={chapters.map((chapter) => ({ slug: chapter.slug, title: chapter.title, partTitle: chapter.partTitle, summary: chapter.summary, plainText: chapter.plainText }))} />
      {parts.map((part) => (
        <section key={part.slug} className="panel">
          <h2>{part.title}</h2>
          {part.chapters.length === 0 ? (
            <p className="muted">No chapters in this part yet.</p>
          ) : (
            <ul>
              {part.chapters.map((chapter) => (
                <li key={chapter.slug}>
                  <Link href={`/book/${chapter.slug}`}>{chapter.title}</Link>
                  {chapter.summary && <p className="muted">{chapter.summary}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
