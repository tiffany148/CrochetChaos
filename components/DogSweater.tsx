"use client";

import { useState } from "react";
import { dogSweaterPlan } from "../lib/calculators";

function amount(value: string): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function DogSweater() {
  const [neck, setNeck] = useState("30");
  const [chest, setChest] = useState("50");
  const [back, setBack] = useState("40");
  const [legs, setLegs] = useState("10");
  const [stitches, setStitches] = useState("16");
  const [rows, setRows] = useState("20");
  const [ease, setEase] = useState("2");
  const [collar, setCollar] = useState("5");

  const plan = dogSweaterPlan({
    neckCm: amount(neck),
    chestCm: amount(chest),
    backCm: amount(back),
    legSpacingCm: amount(legs),
    stitchesPer10cm: amount(stitches),
    rowsPer10cm: amount(rows),
    easeCm: amount(ease),
    collarCm: amount(collar),
  });

  return (
    <div>
      <p className="eyebrow">Pets</p>
      <h1>Dog sweater worksheet</h1>
      <p className="lede">A neck-down crochet plan. Measure the dog, not the breed. These counts are a starting worksheet, not a tested garment pattern.</p>
      <section className="panel">
        <h2>Measurements</h2>
        <div className="form-grid">
          <label>Neck circumference (cm)<input inputMode="decimal" value={neck} onChange={(event) => setNeck(event.target.value)} /></label>
          <label>Chest girth behind the front legs (cm)<input inputMode="decimal" value={chest} onChange={(event) => setChest(event.target.value)} /></label>
          <label>Back length, neck to the hem you want (cm)<input inputMode="decimal" value={back} onChange={(event) => setBack(event.target.value)} /></label>
          <label>Space between the front legs (cm)<input inputMode="decimal" value={legs} onChange={(event) => setLegs(event.target.value)} /></label>
          <label>Stitches per 10 cm<input inputMode="decimal" value={stitches} onChange={(event) => setStitches(event.target.value)} /></label>
          <label>Rows per 10 cm<input inputMode="decimal" value={rows} onChange={(event) => setRows(event.target.value)} /></label>
          <label>Ease added to the chest (cm)<input inputMode="decimal" value={ease} onChange={(event) => setEase(event.target.value)} /></label>
          <label>Collar depth (cm)<input inputMode="decimal" value={collar} onChange={(event) => setCollar(event.target.value)} /></label>
        </div>
        {"error" in plan ? <p className="error" role="alert">{plan.error}</p> : (
          <div className="results">
            <p><strong>{plan.neckStitches}</strong><span>collar stitches</span></p>
            <p><strong>{plan.collarRows}</strong><span>collar rows, {plan.collarCm} cm deep</span></p>
            <p><strong>{plan.chestStitches}</strong><span>chest stitches, including {plan.easeCm} cm ease</span></p>
            <p><strong>{plan.increases}</strong><span>stitches to increase from neck to chest</span></p>
            <p><strong>{plan.bridgeStitches}</strong><span>stitches across the chest between the legs</span></p>
            <p><strong>{plan.backStitches}</strong><span>stitches across the back while the legs are open</span></p>
            <p><strong>{plan.bodyRows}</strong><span>rows for the back length</span></p>
          </div>
        )}
        <p className="formula">Stitches = centimetres ÷ 10 × stitches per 10 cm, rounded to the nearest stitch. Rows use the same idea with row gauge. Back stitches = chest stitches − the stitches that span the space between the front legs.</p>
        <p className="hint">Try the sweater on before the leg openings are closed. Leave room to breathe, walk, and lie down, and do not leave it on an unattended dog.</p>
        <button className="secondary no-print" type="button" onClick={() => window.print()}>Print worksheet</button>
      </section>
    </div>
  );
}
