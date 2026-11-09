import type { Pattern, Step } from "./types";

/** Original browser key used by the first deployed Crochet Chaos app. */
export const STORAGE_KEY_V1 = "crochet-chaos-v1";
/** Current browser key. v1 is read for migration and is never deleted. */
export const STORAGE_KEY_V2 = "crochet-chaos-v2";

export type ThemeName = "light" | "dark";

export type Workspace = {
  patterns: Pattern[];
  activeId: string;
  theme: ThemeName;
  /** Once true, v1 projects are not copied in again (so deletions stay deleted). */
  v1Merged: boolean;
};

type StoredWorkspace = {
  patterns: Pattern[];
  activeId: string;
  theme: ThemeName;
  v1Merged: boolean;
};

function isStep(value: unknown): value is Step {
  if (typeof value !== "object" || value === null) return false;
  const step = value as Record<string, unknown>;
  return typeof step.id === "string" && step.id.length > 0 && typeof step.text === "string" && typeof step.done === "boolean";
}

function toPattern(value: unknown): Pattern | null {
  if (typeof value !== "object" || value === null) return null;
  const pattern = value as Record<string, unknown>;
  if (typeof pattern.id !== "string" || pattern.id.length === 0) return null;
  if (typeof pattern.title !== "string") return null;
  if (!Array.isArray(pattern.steps)) return null;
  const steps = pattern.steps.filter(isStep);
  const current = typeof pattern.current === "number" && Number.isFinite(pattern.current) ? pattern.current : 0;
  return {
    id: pattern.id,
    title: pattern.title,
    source: typeof pattern.source === "string" ? pattern.source : "",
    notes: typeof pattern.notes === "string" ? pattern.notes : "",
    current,
    steps,
  };
}

function parseStored(raw: string | null): StoredWorkspace | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const record = data as Record<string, unknown>;
    const patterns = Array.isArray(record.patterns)
      ? record.patterns.flatMap((item) => {
          const pattern = toPattern(item);
          return pattern ? [pattern] : [];
        })
      : [];
    const activeId = typeof record.activeId === "string" ? record.activeId : "";
    const theme: ThemeName = record.theme === "dark" ? "dark" : "light";
    const legacy = record.legacy;
    const v1Merged =
      typeof legacy === "object" &&
      legacy !== null &&
      (legacy as Record<string, unknown>).v1Merged === true;
    return { patterns, activeId, theme, v1Merged };
  } catch {
    return null;
  }
}

function resolveActive(patterns: Pattern[], activeId: string): string {
  return patterns.some((pattern) => pattern.id === activeId) ? activeId : "";
}

/**
 * Load the workspace from the current key, copying projects forward from
 * crochet-chaos-v1 when they have not already been merged.
 * The v1 value itself is left untouched.
 */
export function loadWorkspace(v2Raw: string | null, v1Raw: string | null): Workspace {
  const v2 = parseStored(v2Raw);
  const v1 = parseStored(v1Raw);

  if (v2?.v1Merged) {
    return {
      patterns: v2.patterns,
      activeId: resolveActive(v2.patterns, v2.activeId),
      theme: v2.theme,
      v1Merged: true,
    };
  }

  const v2Patterns = v2?.patterns ?? [];
  const v1Patterns = v1?.patterns ?? [];
  const seen = new Set(v2Patterns.map((pattern) => pattern.id));
  const patterns = [...v2Patterns, ...v1Patterns.filter((pattern) => !seen.has(pattern.id))];
  const activeId =
    (v2 ? resolveActive(patterns, v2.activeId) : "") || resolveActive(patterns, v1?.activeId ?? "");
  const theme: ThemeName =
    v2Patterns.length > 0
      ? (v2?.theme ?? "light")
      : v2?.theme === "dark"
        ? "dark"
        : (v1?.theme ?? v2?.theme ?? "light");

  return { patterns, activeId, theme, v1Merged: true };
}

/** Serialize the current key. Does not include or erase the v1 payload. */
export function serializeWorkspace(workspace: Pick<Workspace, "patterns" | "activeId" | "theme">): string {
  return JSON.stringify({
    patterns: workspace.patterns,
    activeId: workspace.activeId,
    theme: workspace.theme,
    legacy: { v1Merged: true },
  });
}
