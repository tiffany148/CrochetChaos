import type { MetadataRoute } from "next";
import { loadBook } from "../lib/book-load";
import { stitches } from "../lib/stitches";

const base = "https://crochet-chaos.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/stitches", "/glossary", "/calculators", "/calculators/dog-sweater", "/calculators/time", "/sizes", "/reference", "/workspace", "/lessons", "/book"];
  const pages = staticRoutes.map((route) => ({ url: `${base}${route || "/"}`, lastModified: new Date() }));
  const stitchPages = stitches.map((stitch) => ({ url: `${base}/stitches/${stitch.slug}`, lastModified: new Date() }));
  const chapterPages = loadBook().chapters.map((chapter) => ({ url: `${base}/book/${chapter.slug}`, lastModified: new Date() }));
  return [...pages, ...stitchPages, ...chapterPages];
}
