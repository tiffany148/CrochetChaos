import glossaryJson from "../content/glossary.json";
import sizeChartsJson from "../content/size-charts.json";
import stitchesJson from "../content/stitches.json";

export type Stitch = {
  name: string;
  us: string;
  uk: string;
  sym: string;
  cat: string;
  h: string;
  how: string;
  use: string;
  tip: string;
  level: string;
  mult: string;
  mistake: string;
  fig: string;
};

export type StitchEntry = Stitch & { slug: string };

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type SizeChart = {
  sizes: string[];
  values: string[][];
};

export type SizeChartsFile = {
  source: string;
  rows: string[];
  charts: Record<string, SizeChart>;
  ease: string[][];
};

export function stitchSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const stitches: StitchEntry[] = (stitchesJson as Stitch[]).map((stitch) => ({
  ...stitch,
  slug: stitchSlug(stitch.name),
}));

export const stitchCategories: string[] = Array.from(new Set(stitches.map((stitch) => stitch.cat)));

export const stitchLevels = ["Beginner", "Easy", "Intermediate", "Experienced"] as const;

const stitchesBySlug = new Map(stitches.map((stitch) => [stitch.slug, stitch]));

export function getStitch(slug: string): StitchEntry | undefined {
  return stitchesBySlug.get(slug);
}

export function relatedStitches(stitch: StitchEntry, limit = 4): StitchEntry[] {
  return stitches.filter((item) => item.cat === stitch.cat && item.slug !== stitch.slug).slice(0, limit);
}

/** Exact abbreviation or name matches first, then a broader text match. */
export function matchTerms(query: string): StitchEntry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const exact = stitches.filter((stitch) => {
    return stitch.us.toLowerCase() === needle || stitch.uk.toLowerCase() === needle || stitch.name.toLowerCase() === needle;
  });
  if (exact.length > 0) return exact;
  return stitches.filter((stitch) => {
    return [stitch.name, stitch.us, stitch.uk].some((field) => field.toLowerCase().includes(needle));
  });
}

export const glossary: GlossaryEntry[] = (glossaryJson as GlossaryEntry[])
  .slice()
  .sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

export const sizeCharts = sizeChartsJson as SizeChartsFile;

export const sizeChartGroups: string[] = Object.keys(sizeCharts.charts);
