/* Part covers are already web-sized JPEGs. */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { BookSearch } from "../../components/BookSearch";
import { PhotoBanner } from "../../components/CraftPhoto";
import { loadBook } from "../../lib/book-load";

export const metadata: Metadata = {
  title: "The book",
  description: "All 15 parts and 84 chapters of The Ultimate Crochet Bible, plus the front matter and abbreviation dictionary.",
};

export default function BookPage() {
  const book = loadBook();
  return (
    <div>
      <PhotoBanner shot="book" priority />
      <p className="eyebrow">Tiffany Stark · The Ultimate Crochet Bible</p>
      <h1>Fifteen parts. Eighty-four chapters.</h1>
      <p className="lede">
        The reader has the front matter, the abbreviation dictionary, {book.parts.length} parts, and {book.chapterCount} chapters, in the manuscript’s order. US terms are used, with UK names beside them. The front matter says what in this working copy has and has not been test-crocheted.
      </p>
      <BookSearch />
      <section className="panel">
        <h2>Openers</h2>
        <ul>
          <li><Link href={`/book/${book.front.slug}`}>{book.front.title}</Link></li>
          <li><Link href={`/book/${book.dictionary.slug}`}>{book.dictionary.title}</Link></li>
        </ul>
      </section>
      {book.parts.map((part) => (
        <section className="panel book-part" key={part.slug} style={{ borderColor: part.color }}>
          <div className="book-part-head">
            <img src={part.cover} alt={`Cover illustration for Part ${part.number}, ${part.title}`} />
            <div>
              <p className="eyebrow">Part {part.number}</p>
              <h2>{part.title}</h2>
              <p>{part.intro.summary}</p>
              <p><Link href={`/book/${part.intro.slug}`}>Read the part introduction</Link></p>
            </div>
          </div>
          <ol className="book-contents">
            {part.chapters.map((chapter) => (
              <li key={chapter.slug}>
                <Link href={`/book/${chapter.slug}`}>{chapter.chapterNumber}. {chapter.title}</Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}