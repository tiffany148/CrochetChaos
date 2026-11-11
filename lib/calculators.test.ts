import assert from "node:assert/strict";
import test from "node:test";
import { amigurumiSphere, countForLength, dogSweaterPlan, evenIncreases, foundationChains, grannySquare, parseInchMeasurement, projectMinutes, rowsForHeight, skeinsNeeded, stitchesForWidth, stitchesPerMinute, yarnForRectangle } from "./calculators";
import { hooksMatching } from "./hooks";
import { glossary, matchTerms, sizeChartGroups, stitches } from "./stitches";

test("the imported encyclopedia is the 140-stitch source, with unique pages", () => {
  assert.equal(stitches.length, 140);
  assert.equal(new Set(stitches.map((stitch) => stitch.slug)).size, 140);
  assert.equal(glossary.length, 84);
  assert.ok(sizeChartGroups.length >= 7);
  assert.equal(stitches[0]?.name, "Chain");
  assert.equal(stitches.find((stitch) => stitch.slug === "single-crochet")?.uk, "double crochet (dc)");
});

test("foundation chains follow multiple plus extra", () => {
  assert.equal(foundationChains(8, 6, 2), 50);
  assert.equal(foundationChains(0, 6, 1), 1);
});

test("width and yarn formulas keep the original planner math", () => {
  assert.equal(stitchesForWidth(30, 16, 1), 48);
  assert.equal(stitchesForWidth(30, 16, 6), 48);
  assert.equal(stitchesForWidth(31, 16, 6), 54);
  assert.equal(rowsForHeight(40, 20), 80);
  assert.equal(yarnForRectangle(8, 30, 40), 106);
  assert.equal(skeinsNeeded(106, 100), 2);
});

test("granny square stitch counts follow four corner increases", () => {
  assert.deepEqual(grannySquare(1), { rounds: 1, cluster: 3, groupsOnSide: 1, stitchesThisRound: 12, stitchesTotal: 12 });
  assert.deepEqual(grannySquare(3), { rounds: 3, cluster: 3, groupsOnSide: 3, stitchesThisRound: 36, stitchesTotal: 72 });
  assert.equal(grannySquare(2, 4).stitchesTotal, 48);
});

test("a 6-stitch amigurumi sphere mirrors the standard increase and decrease", () => {
  const rounds = amigurumiSphere(6, 4, 1);
  assert.deepEqual(
    rounds.map((round) => round.stitches),
    [6, 12, 18, 24, 24, 18, 12, 6],
  );
  assert.equal(rounds[3]?.instruction, "(2 sc, inc) × 6 (24)");
  assert.equal(rounds[5]?.instruction, "(2 sc, dec) × 6 (18)");
  assert.equal(rounds[7]?.instruction, "dec in each stitch around (6)");
});

test("even increases only when they divide the round", () => {
  assert.deepEqual(evenIncreases(12, 6), { plain: 1, repeats: 6, result: 18 });
  assert.deepEqual(evenIncreases(6, 6), { plain: 0, repeats: 6, result: 12 });
  assert.equal(evenIncreases(10, 3), null);
});

test("blanket and garment counts cover the measurement", () => {
  assert.equal(countForLength(40, 16), 160);
  assert.equal(countForLength(0, 16), 0);
});

test("body-measurement strings from the size chart parse", () => {
  assert.deepEqual(parseInchMeasurement("16"), { low: 16, high: 16, mid: 16 });
  assert.deepEqual(parseInchMeasurement("34–36"), { low: 34, high: 36, mid: 35 });
  assert.deepEqual(parseInchMeasurement("10½"), { low: 10.5, high: 10.5, mid: 10.5 });
  assert.deepEqual(parseInchMeasurement("8¾"), { low: 8.75, high: 8.75, mid: 8.75 });
});

test("hook conversion uses the Craft Yarn Council millimeter chart", () => {
  assert.equal(hooksMatching("5").exact[0]?.us, "H-8");
  assert.equal(hooksMatching("H-8").exact[0]?.mm, 5);
  assert.equal(hooksMatching("7").exact[0]?.us, "");
  assert.equal(hooksMatching("4.6").exact.length, 0);
  assert.equal(hooksMatching("4.6").nearest?.mm, 4.5);
  assert.equal(hooksMatching("k-10 1/2").exact[0]?.mm, 6.5);
});

test("a dog sweater worksheet turns measurements into section counts", () => {
  const plan = dogSweaterPlan({ neckCm: 30, chestCm: 50, backCm: 40, legSpacingCm: 10, stitchesPer10cm: 16, rowsPer10cm: 20, easeCm: 0, collarCm: 5 });
  assert.ok(!("error" in plan));
  if ("error" in plan) return;
  assert.equal(plan.neckStitches, 48);
  assert.equal(plan.chestStitches, 80);
  assert.equal(plan.increases, 32);
  assert.equal(plan.bridgeStitches, 16);
  assert.equal(plan.backStitches, 64);
  assert.equal(plan.bodyRows, 80);
  assert.equal(plan.collarRows, 10);
  assert.equal("error" in dogSweaterPlan({ neckCm: 20, chestCm: 30, backCm: 20, legSpacingCm: 40, stitchesPer10cm: 10, rowsPer10cm: 10, easeCm: 0 }), true);
});

test("project time uses stitches per minute and a height factor", () => {
  assert.equal(stitchesPerMinute(10, 30), 20);
  assert.equal(projectMinutes(600, 20, 1), 30);
  assert.equal(projectMinutes(600, 20, 1.6), 48);
  assert.equal(projectMinutes(0, 20, 1), 0);
});

test("US and UK abbreviations resolve to the stitch entries", () => {
  assert.equal(matchTerms("sc")[0]?.name, "Single crochet");
  assert.equal(matchTerms("double crochet (dc)")[0]?.name, "Single crochet");
  assert.equal(matchTerms("dc")[0]?.name, "Double crochet");
});
