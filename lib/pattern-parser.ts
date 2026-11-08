import { Step } from "@/lib/types";

export function parsePatternText(rawText: string): Step[] {
  const lines = rawText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const normalized = lines.flatMap((line) => {
    const splitItems = line
      .split(/(?=(?:Round|Rnd|Row)\s+\d+|(?:Round|Rnd|Row)\s+\d+\s*:|R\d+\s*:)/i)
      .map((part) => part.trim())
      .filter(Boolean);

    return splitItems.length > 1 ? splitItems : [line];
  });

  return normalized.map((text) => ({
    id: crypto.randomUUID(),
    text,
    done: false,
  }));
}
