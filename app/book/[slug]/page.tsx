import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookBody } from "../../../components/BookBody";
import { chapterNeighbors, getChapter, loadBook } from "../../../lib/book-load";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return loadBook().chapters.map((chapter) => ({ slug: chapter.slug }));
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
  return (
    <article>
      <p className="eyebrow">{chapter.partTitle}</p>
      <h1>{chapter.title}</h1>
      {chapter.summary && <p className="lede">{chapter.summary}</p>}
      <BookBody blocks={chapter.blocks} />
      <nav className="button-row" aria-label="Chapters">
        {prev ? <Link className="secondary" href={`/book/${prev.slug}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link className="secondary" href={`/book/${next.slug}`}>Next: {next.title}</Link> : <span />}
        <Link className="secondary" href="/book">All chapters</Link>
      </nav>
    </article>
  );
}
