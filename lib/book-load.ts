import fs from "fs";
import path from "path";
import manifestJson from "../content/book/manifest.json";
import { parseChapter, type BookBlock } from "./book";

export type ManifestPart = { slug: string; title: string; chapters: string[] };

export type BookChapter = {
  slug: string;
  title: string;
  summary: string;
  partSlug: string;
  partTitle: string;
  blocks: BookBlock[];
  plainText: string;
};

export type BookPart = {
  slug: string;
  title: string;
  chapters: BookChapter[];
};

type Manifest = { parts: ManifestPart[] };

const manifest = manifestJson as Manifest;

function readChapter(slug: string, part: ManifestPart): BookChapter {
  const file = path.join(process.cwd(), "content", "book", "chapters", `${slug}.md`);
  const markdown = fs.readFileSync(file, "utf8");
  const parsed = parseChapter(markdown);
  return {
    slug,
    title: parsed.title || slug,
    summary: parsed.summary,
    partSlug: part.slug,
    partTitle: part.title,
    blocks: parsed.blocks,
    plainText: parsed.plainText,
  };
}

export function loadBook(): { parts: BookPart[]; chapters: BookChapter[] } {
  const parts = manifest.parts.map((part) => ({
    slug: part.slug,
    title: part.title,
    chapters: part.chapters.map((slug) => readChapter(slug, part)),
  }));
  const chapters = parts.flatMap((part) => part.chapters);
  return { parts, chapters };
}

export function getChapter(slug: string): BookChapter | undefined {
  return loadBook().chapters.find((chapter) => chapter.slug === slug);
}

export function chapterNeighbors(slug: string): { prev?: BookChapter; next?: BookChapter } {
  const chapters = loadBook().chapters;
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  if (index < 0) return {};
  return {
    prev: index > 0 ? chapters[index - 1] : undefined,
    next: index < chapters.length - 1 ? chapters[index + 1] : undefined,
  };
}
