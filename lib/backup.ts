import type { Pattern } from "./types";

export type BackupPreview = {
  patterns: Pattern[];
  activeId: string;
  rejected: number;
  errors: string[];
};

function isStep(value: unknown): value is { id: string; text: string; done: boolean } {
  if (typeof value !== "object" || value === null) return false;
  const step = value as Record<string, unknown>;
  return typeof step.id === "string" && step.id.length > 0 && typeof step.text === "string" && typeof step.done === "boolean";
}

function toPattern(value: unknown): Pattern | null {
  if (typeof value !== "object" || value === null) return null;
  const pattern = value as Record<string, unknown>;
  if (typeof pattern.id !== "string" || pattern.id.length === 0) return null;
  if (typeof pattern.title !== "string" || pattern.title.trim().length === 0) return null;
  if (!Array.isArray(pattern.steps)) return null;
  const steps = pattern.steps.filter(isStep);
  const current = typeof pattern.current === "number" && Number.isFinite(pattern.current) ? pattern.current : 0;
  const category = typeof pattern.category === "string" ? pattern.category.trim() : "";
  return {
    id: pattern.id,
    title: pattern.title.trim(),
    source: typeof pattern.source === "string" ? pattern.source : "",
    notes: typeof pattern.notes === "string" ? pattern.notes : "",
    current,
    steps,
    ...(category ? { category } : {}),
  };
}

/** Read a backup file. This function never writes storage and never touches crochet-chaos-v1. */
export function parseBackup(raw: string): BackupPreview {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { patterns: [], activeId: "", rejected: 0, errors: ["The file is not valid JSON."] };
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { patterns: [], activeId: "", rejected: 0, errors: ["The backup must be a JSON object with a patterns list."] };
  }
  const record = data as Record<string, unknown>;
  if (!Array.isArray(record.patterns)) {
    return { patterns: [], activeId: "", rejected: 0, errors: ["The backup has no patterns list."] };
  }
  const patterns: Pattern[] = [];
  let rejected = 0;
  const seen = new Set<string>();
  for (const item of record.patterns) {
    const pattern = toPattern(item);
    if (!pattern || seen.has(pattern.id)) {
      rejected += 1;
      continue;
    }
    seen.add(pattern.id);
    patterns.push(pattern);
  }
  const activeId = typeof record.activeId === "string" ? record.activeId : "";
  const errors = patterns.length === 0 ? ["No usable patterns were found in that file."] : [];
  return { patterns, activeId, rejected, errors };
}

/** Keep current projects and add or update incoming ones with the same id. */
export function mergePatterns(current: Pattern[], incoming: Pattern[]): Pattern[] {
  const incomingIds = new Set(incoming.map((pattern) => pattern.id));
  const kept = current.filter((pattern) => !incomingIds.has(pattern.id));
  return [...incoming, ...kept];
}
