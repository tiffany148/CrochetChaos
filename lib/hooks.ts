/**
 * Regular crochet hooks from the Craft Yarn Council chart.
 * Letter and number labels vary by brand; the millimeter mark is the measurement to trust.
 * Source: https://craftyarncouncil.com/standards/hooks-and-needles (crochet hook table).
 * Steel thread hooks use a separate, reversed numbering system and are not in this table.
 */
export type HookSize = {
  mm: number;
  us: string;
};

export const CROCHET_HOOKS: HookSize[] = [
  { mm: 2.25, us: "B-1" },
  { mm: 2.5, us: "" },
  { mm: 2.75, us: "C-2" },
  { mm: 3.125, us: "D" },
  { mm: 3.25, us: "D-3" },
  { mm: 3.5, us: "E-4" },
  { mm: 3.75, us: "F-5" },
  { mm: 4, us: "G-6" },
  { mm: 4.25, us: "G" },
  { mm: 4.5, us: "7" },
  { mm: 5, us: "H-8" },
  { mm: 5.25, us: "I" },
  { mm: 5.5, us: "I-9" },
  { mm: 5.75, us: "J" },
  { mm: 6, us: "J-10" },
  { mm: 6.5, us: "K-10½" },
  { mm: 7, us: "" },
  { mm: 8, us: "L-11" },
  { mm: 9, us: "M/N-13" },
  { mm: 10, us: "N/P-15" },
  { mm: 11.5, us: "P-16" },
  { mm: 12, us: "" },
  { mm: 15, us: "P/Q" },
  { mm: 15.75, us: "Q" },
  { mm: 16, us: "Q" },
  { mm: 19, us: "S" },
  { mm: 25, us: "T/U/X" },
  { mm: 30, us: "T/X" },
];

export const HOOK_SOURCE = "Craft Yarn Council, Hooks & Needles. US letters differ by manufacturer; use the millimeter size on the hook.";

function normalizeHookQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/½/g, " 1/2")
    .replace(/mm/g, "")
    .replace(/\s+/g, "")
    .replace(/1\/2/g, ".5");
}

export function hooksMatching(query: string): { exact: HookSize[]; nearest: HookSize | null } {
  const normalized = normalizeHookQuery(query);
  if (!normalized) return { exact: [], nearest: null };
  const asNumber = Number(normalized);
  if (Number.isFinite(asNumber) && asNumber > 0) {
    const exact = CROCHET_HOOKS.filter((hook) => Math.abs(hook.mm - asNumber) < 0.001);
    if (exact.length > 0) return { exact, nearest: exact[0] };
    const nearest = CROCHET_HOOKS.reduce((best, hook) => {
      return Math.abs(hook.mm - asNumber) < Math.abs(best.mm - asNumber) ? hook : best;
    });
    return { exact: [], nearest };
  }
  const exact = CROCHET_HOOKS.filter((hook) => normalizeHookQuery(hook.us) === normalized && hook.us !== "");
  return { exact, nearest: exact[0] ?? null };
}
