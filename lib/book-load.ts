import fs from "fs";
import path from "path";
import manifestJson from "../content/book/manifest.json";
import { parseChapter, plainTextFrom, type BookBlock } from "./book";

export type BookChapter = {
  slug: string;
  title: string;
  summary: string;
  partSlug: string;
  partTitle: string;
  partNumber: number | null;
  chapterNumber: number | null;
  kind: "front" | "dictionary" | "part" | "chapter" | "about";
  blocks: BookBlock[];
  plainText: string;
};

export type BookPart = {
  slug: string;
  number: number;
  title: string;
  color: string;
  cover: string;
  intro: BookChapter;
  chapters: BookChapter[];
};

type ManifestChapter = {
  part: number;
  part_title: string;
  chapter: number;
  title: string;
  file: string;
};

type Manifest = {
  parts: { n: number; title: string; color: string; cover: string }[];
  chapters: ManifestChapter[];
  front_matter: string;
  about_the_author?: string;
  badges: Record<string, string>;
};

const manifest = manifestJson as Manifest;
const contentRoot = path.join(process.cwd(), "content", "book");

export function resolveBookImage(fromFile: string, src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed || trimmed.includes("\0")) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("..")) return trimmed;
  const absolute = path.normalize(path.join(path.dirname(fromFile), trimmed));
  const relative = path.relative(contentRoot, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  const portable = relative.split(path.sep).join("/");
  if (!portable.startsWith("assets/")) return null;
  const publicRelative = portable.slice("assets/".length);
  const publicFile = path.join(process.cwd(), "public", "book", publicRelative);
  if (!fs.existsSync(publicFile)) return null;
  return `/book/${publicRelative}`;
}

function publicAsset(assetPath: string): string {
  const portable = assetPath.replace(/^assets\//, "");
  return `/book/${portable}`;
}

function excerpt(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 180) return clean;
  const cut = clean.slice(0, 180);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).trim()}…`;
}

function readDocument(fileRel: string, meta: Omit<BookChapter, "blocks" | "plainText" | "summary" | "title"> & { title?: string }): BookChapter {
  const full = path.join(contentRoot, fileRel);
  const parsed = parseChapter(fs.readFileSync(full, "utf8"), {
    resolveImage: (src) => resolveBookImage(full, src),
  });
  const title = meta.title || parsed.title || meta.slug;
  const blocks = !meta.title && parsed.blocks[0]?.type === "heading" && parsed.blocks[0].text === title
    ? parsed.blocks.slice(1)
    : parsed.blocks;
  const firstParagraph = blocks.find((block) => block.type === "paragraph");
  const summary = parsed.summary || (firstParagraph && firstParagraph.type === "paragraph" ? excerpt(firstParagraph.text) : "");
  return {
    ...meta,
    title,
    summary,
    blocks,
    plainText: "",
  };
}

function chapterForKey(chapters: BookChapter[], key: string): BookChapter | undefined {
  const numbered = chapters.filter((chapter) => chapter.kind === "chapter");
  const direct = numbered.filter((chapter) => chapter.slug.includes(key));
  if (direct.length === 1) return direct[0];
  const parts = key.split("-").filter((part) => part.length > 3);
  const loose = numbered.filter((chapter) => parts.length > 0 && parts.every((part) => chapter.slug.includes(part)));
  return loose.length === 1 ? loose[0] : undefined;
}

function walkText(value: string, chapters: BookChapter[]): string {
  return value.replace(/\{ch:([a-z0-9-]+)\}/gi, (token, key: string) => {
    const match = chapterForKey(chapters, key);
    if (!match) return token;
    return `[${match.title}](/book/${match.slug})`;
  });
}

function linkChapters(chapters: BookChapter[]): void {
  for (const chapter of chapters) {
    chapter.blocks = chapter.blocks.map((block) => {
      if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") {
        return { ...block, text: walkText(block.text, chapters) };
      }
      if (block.type === "list") return { ...block, items: block.items.map((item) => walkText(item, chapters)) };
      if (block.type === "callout" || block.type === "wisdom" || block.type === "dang" || block.type === "fix") {
        return { ...block, text: walkText(block.text, chapters), ...(block.type === "callout" ? { title: walkText(block.title, chapters) } : {}) };
      }
      if (block.type === "table") {
        return {
          ...block,
          headers: block.headers.map((cell) => walkText(cell, chapters)),
          rows: block.rows.map((row) => row.map((cell) => walkText(cell, chapters))),
        };
      }
      if (block.type === "steps") {
        return {
          ...block,
          steps: block.steps.map((step) => ({ ...step, caption: walkText(step.caption, chapters), alt: step.alt ? walkText(step.alt, chapters) : step.alt })),
        };
      }
      if (block.type === "image") return { ...block, alt: walkText(block.alt, chapters) };
      return block;
    });
    chapter.plainText = plainTextFrom(chapter.title, chapter.summary, chapter.blocks);
  }
}

function loadBookUncached(): { parts: BookPart[]; chapters: BookChapter[]; documents: BookChapter[]; front: BookChapter; dictionary: BookChapter; about: BookChapter | null; chapterCount: number } {
  const front = readDocument(manifest.front_matter, {
    slug: "front-matter",
    partSlug: "front-matter",
    partTitle: "Front matter",
    partNumber: null,
    chapterNumber: null,
    kind: "front",
  });
  const dictionary = readDocument("chapters/abbreviation-dictionary.md", {
    slug: "abbreviation-dictionary",
    title: "Abbreviation dictionary",
    partSlug: "abbreviation-dictionary",
    partTitle: "Abbreviation dictionary",
    partNumber: null,
    chapterNumber: null,
    kind: "dictionary",
  });

  const parts = manifest.parts.map((part) => {
    const folder = fs.readdirSync(path.join(contentRoot, "chapters")).find((name) => name.startsWith(`part-${String(part.n).padStart(2, "0")}-`));
    if (!folder) throw new Error(`Missing chapter folder for part ${part.n}`);
    const intro = readDocument(`chapters/${folder}/_part.md`, {
      slug: folder,
      title: part.title,
      partSlug: folder,
      partTitle: part.title,
      partNumber: part.n,
      chapterNumber: null,
      kind: "part",
    });
    const chapters = manifest.chapters
      .filter((chapter) => chapter.part === part.n)
      .map((chapter) => readDocument(chapter.file, {
        slug: path.basename(chapter.file, ".md"),
        title: chapter.title,
        partSlug: folder,
        partTitle: chapter.part_title,
        partNumber: chapter.part,
        chapterNumber: chapter.chapter,
        kind: "chapter",
      }));
    return {
      slug: folder,
      number: part.n,
      title: part.title,
      color: part.color,
      cover: publicAsset(part.cover),
      intro,
      chapters,
    };
  });

  const about = manifest.about_the_author
    ? readDocument(manifest.about_the_author, {
      slug: path.basename(manifest.about_the_author, ".md"),
      partSlug: "about",
      partTitle: "About the author",
      partNumber: null,
      chapterNumber: null,
      kind: "about",
    })
    : null;

  const documents = [front, dictionary, ...parts.flatMap((part) => [part.intro, ...part.chapters]), ...(about ? [about] : [])];
  linkChapters(documents);
  const chapters = documents.filter((document) => document.kind === "chapter");
  return { parts, chapters, documents, front, dictionary, about, chapterCount: chapters.length };
}

let cached: ReturnType<typeof loadBookUncached> | null = null;

export function loadBook(): ReturnType<typeof loadBookUncached> {
  if (!cached) cached = loadBookUncached();
  return cached;
}

export function getChapter(slug: string): BookChapter | undefined {
  return loadBook().documents.find((chapter) => chapter.slug === slug);
}

export function chapterNeighbors(slug: string): { prev?: BookChapter; next?: BookChapter } {
  const documents = loadBook().documents;
  const index = documents.findIndex((chapter) => chapter.slug === slug);
  if (index < 0) return {};
  return {
    prev: index > 0 ? documents[index - 1] : undefined,
    next: index < documents.length - 1 ? documents[index + 1] : undefined,
  };
}

export function searchChapters(query: string): { total: number; results: { slug: string; title: string; partTitle: string; excerpt: string }[] } {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return { total: 0, results: [] };
  const matches = loadBook().documents.filter((chapter) => `${chapter.title} ${chapter.summary} ${chapter.plainText}`.toLowerCase().includes(needle));
  return {
    total: matches.length,
    results: matches.slice(0, 20).map((chapter) => {
      const haystack = chapter.plainText.replace(/\s+/g, " ");
      const at = haystack.toLowerCase().indexOf(needle);
      const start = Math.max(0, at - 70);
      const excerpt = `${start > 0 ? "…" : ""}${haystack.slice(start, start + needle.length + 140).trim()}${start + needle.length + 140 < haystack.length ? "…" : ""}`;
      return { slug: chapter.slug, title: chapter.title, partTitle: chapter.partTitle, excerpt };
    }),
  };
}
