import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookBody } from "../../components/BookBody";
import { getChapter } from "../../lib/book-load";

export const metadata: Metadata = {
  title: "About Tiffany Stark",
  description: "About the author of The Ultimate Crochet Bible, Tiffany Stark.",
};

export default function AboutPage() {
  const chapter = getChapter("about-the-author");
  if (!chapter) notFound();
  return (
    <article>
      <p className="eyebrow">The Ultimate Crochet Bible</p>
      <h1>{chapter.title}</h1>
      <BookBody blocks={chapter.blocks} />
      <p><Link href="/book/about-the-author">This page in the book</Link></p>
    </article>
  );
}
