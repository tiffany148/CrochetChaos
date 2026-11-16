import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookBody } from "../../../components/BookBody";
import { chapterNeighbors, getChapter, loadBook } from "../../../lib/book-load";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return loadBook().documents.map((chapter) => ({ slug: chapter.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const chapter = getChapter(params.slug);
  if (!chapter) return { title: "Chapter" };
  return { title: chapter.title, description: chapter.summary || chapter.title };
}

export default function ChapterPage({ params }: PageProps) {
  const chapter = getChapter(params.slug);
  if (!chapter) notFound();
  const { prev, next } = chapterNeighbors(chapter.slug);
  const eyebrow = chapter.chapterNumber ? `${chapter.partTitle} · Chapter ${chapter.chapterNumber}` : chapter.partTitle;
  return (
    <article>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{chapter.title}</h1>
      <BookBody blocks={chapter.blocks} />
      <nav className="button-row chapter-nav" aria-label="Chapters">
        {prev ? <Link className="secondary" href={`/book/${prev.slug}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link className="secondary" href={`/book/${next.slug}`}>Next: {next.title}</Link> : <span />}
        <Link className="secondary" href="/book">All chapters</Link>
      </nav>
    </article>
  );
}
