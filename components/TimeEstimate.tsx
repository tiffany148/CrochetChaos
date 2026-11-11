"use client";

import { useState } from "react";
import { STITCH_PACE, projectMinutes, stitchesPerMinute } from "../lib/calculators";

function amount(value: string): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMinutes(total: number): string {
  const minutes = Math.round(total);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return `${minutes} min`;
  return `${hours} h ${rest} min`;
}

export function TimeEstimate() {
  const [count, setCount] = useState("1200");
  const [paceId, setPaceId] = useState<string>("sc");
  const [customFactor, setCustomFactor] = useState("1");
  const [timedStitches, setTimedStitches] = useState("20");
  const [timedSeconds, setTimedSeconds] = useState("60");
  const [perMinute, setPerMinute] = useState("20");

  const factor = paceId === "custom" ? amount(customFactor) : STITCH_PACE.find((item) => item.id === paceId)?.factor ?? 1;
  const sampled = stitchesPerMinute(amount(timedStitches), amount(timedSeconds));
  const minutes = projectMinutes(amount(count), amount(perMinute), factor);

  return (
    <div>
      <p className="eyebrow">Planning</p>
      <h1>How long will it take?</h1>
      <p className="lede">Time is stitch count times a height factor, divided by how many of those stitches you make in a minute. Single crochet is the baseline.</p>
      <section className="panel">
        <h2>Your pace</h2>
        <p>Crochet for a short timed stretch in the stitch you will use, then enter what you finished. One minute is enough for a rough rate.</p>
        <div className="form-grid">
          <label>Stitches you completed<input inputMode="decimal" value={timedStitches} onChange={(event) => setTimedStitches(event.target.value)} /></label>
          <label>Seconds you timed<input inputMode="decimal" value={timedSeconds} onChange={(event) => setTimedSeconds(event.target.value)} /></label>
        </div>
        <p><strong>{sampled ? sampled.toFixed(1) : "—"}</strong> stitches per minute from that sample.</p>
        <button className="secondary" type="button" onClick={() => setPerMinute(sampled ? String(Math.round(sampled * 10) / 10) : perMinute)}>Use this rate</button>
      </section>
      <section className="panel">
        <h2>The project</h2>
        <div className="form-grid">
          <label>Stitches in the project<input inputMode="decimal" value={count} onChange={(event) => setCount(event.target.value)} /></label>
          <label>Your stitches per minute<input inputMode="decimal" value={perMinute} onChange={(event) => setPerMinute(event.target.value)} /></label>
          <label>
            Stitch height
            <select value={paceId} onChange={(event) => setPaceId(event.target.value)}>
              {STITCH_PACE.map((item) => <option key={item.id} value={item.id}>{item.label} × {item.factor}</option>)}
              <option value="custom">Custom factor</option>
            </select>
          </label>
          {paceId === "custom" && <label>Custom height factor<input inputMode="decimal" value={customFactor} onChange={(event) => setCustomFactor(event.target.value)} /></label>}
        </div>
        <div className="results">
          <p><strong>{minutes ? formatMinutes(minutes) : "—"}</strong><span>estimated making time</span></p>
        </div>
        <p className="formula">minutes = stitch count × height factor ÷ stitches per minute. Slip stitch is 0.7, single crochet is 1, half double is 1.25, double is 1.6, and treble is 2. Seaming, weaving ends, and breaks are not included.</p>
      </section>
    </div>
  );
}
