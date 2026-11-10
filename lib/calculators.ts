/** Common finished blanket sizes used for planning. They are not a bedding-industry standard. */
export const BLANKET_SIZES = [
  { id: "lovey", name: "Lovey", widthIn: 18, lengthIn: 18 },
  { id: "baby", name: "Baby", widthIn: 30, lengthIn: 36 },
  { id: "lap", name: "Lap", widthIn: 36, lengthIn: 48 },
  { id: "throw", name: "Throw", widthIn: 50, lengthIn: 60 },
  { id: "twin", name: "Twin", widthIn: 66, lengthIn: 90 },
  { id: "full", name: "Full", widthIn: 80, lengthIn: 90 },
  { id: "queen", name: "Queen", widthIn: 90, lengthIn: 100 },
  { id: "king", name: "King", widthIn: 108, lengthIn: 100 },
] as const;

export function foundationChains(repeats: number, multiple: number, extra: number): number {
  const safeRepeats = Math.max(0, Math.floor(repeats));
  const safeMultiple = Math.max(1, Math.floor(multiple));
  const safeExtra = Math.max(0, Math.floor(extra));
  return safeRepeats * safeMultiple + safeExtra;
}

/**
 * Stitches across a width, rounded up to the next multiple.
 * This matches the original planner: ceil((widthCm × stitchesPer10cm / 10) / multiple) × multiple.
 */
export function stitchesForWidth(widthCm: number, stitchesPer10cm: number, multiple: number): number {
  const width = Math.max(0, widthCm);
  const gauge = Math.max(0, stitchesPer10cm);
  const repeat = Math.max(1, multiple);
  if (width === 0 || gauge === 0) return 0;
  return Math.ceil((width * gauge) / 10 / repeat) * repeat;
}

export function rowsForHeight(heightCm: number, rowsPer10cm: number): number {
  const height = Math.max(0, heightCm);
  const gauge = Math.max(0, rowsPer10cm);
  if (height === 0 || gauge === 0) return 0;
  return Math.round((height * gauge) / 10);
}

/**
 * Yarn for a rectangle scaled from a swatch.
 * Default swatch area is 10 cm × 10 cm and the default extra is 10 percent,
 * matching the original planner.
 */
export function yarnForRectangle(
  swatchYarn: number,
  width: number,
  height: number,
  swatchArea = 100,
  waste = 0.1,
): number {
  if (!(swatchYarn > 0) || !(width > 0) || !(height > 0) || !(swatchArea > 0) || waste < 0) return 0;
  return Math.ceil((swatchYarn * width * height) / swatchArea * (1 + waste));
}

export function skeinsNeeded(totalYarn: number, yarnPerSkein: number): number {
  if (!(totalYarn > 0) || !(yarnPerSkein > 0)) return 0;
  return Math.ceil(totalYarn / yarnPerSkein);
}

/** Count at least enough stitches to cover a length. Gauge is stitches (or rows) per 4 inches. */
export function countForLength(lengthInches: number, per4Inches: number): number {
  if (!(lengthInches > 0) || !(per4Inches > 0)) return 0;
  return Math.ceil((lengthInches / 4) * per4Inches);
}

export type GrannyPlan = {
  rounds: number;
  cluster: number;
  groupsOnSide: number;
  stitchesThisRound: number;
  stitchesTotal: number;
};

/**
 * Classic granny square: one increase at each of 4 corners, clusters of `cluster` stitches
 * (3 for a traditional US double-crochet granny). Chains in the corners and gaps are not counted.
 * Round r contains 4 × r × cluster stitches. The running total is 2 × cluster × r × (r + 1).
 */
export function grannySquare(rounds: number, cluster = 3): GrannyPlan {
  const safeRounds = Math.max(0, Math.floor(rounds));
  const safeCluster = Math.max(1, Math.floor(cluster));
  return {
    rounds: safeRounds,
    cluster: safeCluster,
    groupsOnSide: safeRounds,
    stitchesThisRound: safeRounds === 0 ? 0 : 4 * safeRounds * safeCluster,
    stitchesTotal: 2 * safeCluster * safeRounds * (safeRounds + 1),
  };
}

export type SphereRound = {
  round: number;
  stitches: number;
  instruction: string;
  phase: "increase" | "even" | "decrease";
};

/**
 * Single-crochet sphere in continuous rounds, starting with `start` stitches in a ring
 * (6 is the usual magic-ring start). Increases add `start` stitches each round.
 * Decreases mirror them back down to `start` stitches.
 */
export function amigurumiSphere(start: number, increaseRounds: number, evenRounds: number): SphereRound[] {
  const group = Math.max(3, Math.floor(start));
  const increases = Math.max(1, Math.floor(increaseRounds));
  const evens = Math.max(0, Math.floor(evenRounds));
  const rounds: SphereRound[] = [];

  for (let round = 1; round <= increases; round += 1) {
    const stitches = group * round;
    let instruction = `${group} sc in a magic ring (${stitches})`;
    if (round === 2) instruction = `inc in each stitch around (${stitches})`;
    if (round > 2) instruction = `(${round - 2} sc, inc) × ${group} (${stitches})`;
    rounds.push({ round: rounds.length + 1, stitches, instruction, phase: "increase" });
  }

  const widest = group * increases;
  for (let index = 0; index < evens; index += 1) {
    rounds.push({
      round: rounds.length + 1,
      stitches: widest,
      instruction: `sc in each stitch around (${widest})`,
      phase: "even",
    });
  }

  for (let step = 1; step <= increases - 1; step += 1) {
    const stitches = group * (increases - step);
    const singles = increases - step - 1;
    const instruction = singles <= 0 ? `dec in each stitch around (${stitches})` : `(${singles} sc, dec) × ${group} (${stitches})`;
    rounds.push({ round: rounds.length + 1, stitches, instruction, phase: "decrease" });
  }

  return rounds;
}

/**
 * Place the same number of increases in every part of a round.
 * Returns null when the increases do not divide the current stitch count evenly.
 * plain is the number of unchanged stitches before each increase (0 means increase in every stitch).
 */
export function evenIncreases(current: number, increases: number): { plain: number; repeats: number; result: number } | null {
  const stitches = Math.floor(current);
  const added = Math.floor(increases);
  if (stitches <= 0 || added <= 0) return null;
  if (stitches % added !== 0) return null;
  return { plain: stitches / added - 1, repeats: added, result: stitches + added };
}

export function parseInchMeasurement(value: string): { low: number; high: number; mid: number } | null {
  const parts = value
    .split(/[–-]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const numbers = parts.map(parseInchToken).filter((item): item is number => item !== null);
  if (numbers.length === 0) return null;
  const low = numbers[0];
  const high = numbers[numbers.length - 1];
  return { low, high, mid: (low + high) / 2 };
}

function parseInchToken(value: string): number | null {
  const normalized = value.trim().replace(/½/g, ".5").replace(/¼/g, ".25").replace(/¾/g, ".75");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}
