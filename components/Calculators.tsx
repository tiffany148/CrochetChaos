"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BLANKET_SIZES,
  amigurumiSphere,
  countForLength,
  evenIncreases,
  foundationChains,
  grannySquare,
  parseInchMeasurement,
  rowsForHeight,
  skeinsNeeded,
  stitchesForWidth,
  yarnForRectangle,
} from "../lib/calculators";
import { CROCHET_HOOKS, HOOK_SOURCE, hooksMatching } from "../lib/hooks";
import { CraftPhoto, yarnAlt } from "./CraftPhoto";
import { matchTerms, sizeCharts, sizeChartGroups } from "../lib/stitches";

function numberValue(value: string): number {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function Calculators() {
  const [swatchYarn, setSwatchYarn] = useState("8");
  const [widthCm, setWidthCm] = useState("30");
  const [heightCm, setHeightCm] = useState("40");
  const [skeinYarn, setSkeinYarn] = useState("100");
  const [stitchesPer10, setStitchesPer10] = useState("16");
  const [rowsPer10, setRowsPer10] = useState("20");
  const [multiple, setMultiple] = useState("6");
  const [extra, setExtra] = useState("2");
  const [repeats, setRepeats] = useState("8");
  const [hookQuery, setHookQuery] = useState("5");
  const [termQuery, setTermQuery] = useState("hdc");
  const [blanketId, setBlanketId] = useState<string>(BLANKET_SIZES[1].id);
  const [blanketWidth, setBlanketWidth] = useState("30");
  const [blanketLength, setBlanketLength] = useState("36");
  const [per4, setPer4] = useState("14");
  const [rowsPer4, setRowsPer4] = useState("8");
  const [grannyRounds, setGrannyRounds] = useState("6");
  const [cluster, setCluster] = useState("3");
  const [cmPerRound, setCmPerRound] = useState("2.5");
  const [sphereStart, setSphereStart] = useState("6");
  const [sphereIncrease, setSphereIncrease] = useState("6");
  const [sphereEven, setSphereEven] = useState("4");
  const [haveStitches, setHaveStitches] = useState("24");
  const [addIncreases, setAddIncreases] = useState("6");
  const [chartGroup, setChartGroup] = useState(sizeChartGroups[3] ?? sizeChartGroups[0]);
  const [chartSize, setChartSize] = useState(0);
  const [chartRow, setChartRow] = useState(0);
  const [easeIn, setEaseIn] = useState("2");
  const [garmentGauge, setGarmentGauge] = useState("16");

  const yarn = yarnForRectangle(numberValue(swatchYarn), numberValue(widthCm), numberValue(heightCm));
  const skeins = skeinsNeeded(yarn, numberValue(skeinYarn));
  const fittedStitches = stitchesForWidth(numberValue(widthCm), numberValue(stitchesPer10), numberValue(multiple));
  const fittedRows = rowsForHeight(numberValue(heightCm), numberValue(rowsPer10));
  const chains = foundationChains(numberValue(repeats), numberValue(multiple), numberValue(extra));
  const hook = hooksMatching(hookQuery);
  const terms = matchTerms(termQuery);
  const granny = grannySquare(numberValue(grannyRounds), numberValue(cluster));
  const grannySide = granny.rounds > 0 && numberValue(cmPerRound) > 0 ? granny.rounds * numberValue(cmPerRound) : 0;
  const sphere = amigurumiSphere(numberValue(sphereStart), numberValue(sphereIncrease), numberValue(sphereEven));
  const increases = evenIncreases(numberValue(haveStitches), numberValue(addIncreases));
  const blanketStitches = countForLength(numberValue(blanketWidth), numberValue(per4));
  const blanketRows = countForLength(numberValue(blanketLength), numberValue(rowsPer4));

  const chart = sizeCharts.charts[chartGroup];
  const measurement = chart?.values[chartRow]?.[chartSize] ?? "";
  const parsed = parseInchMeasurement(measurement);
  const finishedInches = parsed ? parsed.mid + numberValue(easeIn) : 0;
  const garmentStitches = countForLength(finishedInches, numberValue(garmentGauge));

  const chartSizes = useMemo(() => chart?.sizes ?? [], [chart]);

  return (
    <div>
      <div className="with-portrait">
        <CraftPhoto shot="yarn" alt={yarnAlt} className="portrait-sm" sizes="112px" />
        <div>
          <p className="eyebrow">Planning math</p>
          <h1>Calculators that show their work.</h1>
        </div>
      </div>
      <p className="lede">Estimates for crochet, not knitting. A swatch in your stitch, yarn, and hook is still the check that matters.</p>
      <nav className="anchor-nav" aria-label="Calculators">
        <a href="#yarn">Yarn</a>
        <a href="#chains">Chains and repeats</a>
        <a href="#hooks">Hooks</a>
        <a href="#terms">US / UK</a>
        <a href="#blanket">Blankets</a>
        <a href="#granny">Granny squares</a>
        <a href="#sphere">Amigurumi</a>
        <a href="#increases">Increases</a>
        <a href="#garment">Garment stitches</a>
        <Link href="/calculators/dog-sweater">Dog sweater</Link>
        <Link href="/calculators/time">Time</Link>
      </nav>

      <section className="panel" id="yarn">
        <h2>Yarn for a rectangle</h2>
        <p>Make a 10 cm × 10 cm swatch in the same stitch. Yarn needed is the swatch yarn times the project area, plus 10 percent for joining and tension changes.</p>
        <p className="formula">yarn = swatch yarn × (width × height ÷ 100) × 1.10, rounded up.</p>
        <div className="form-grid">
          <label>Yarn used in the 10 cm swatch<input inputMode="decimal" value={swatchYarn} onChange={(event) => setSwatchYarn(event.target.value)} /></label>
          <label>Yarn in one skein, same unit<input inputMode="decimal" value={skeinYarn} onChange={(event) => setSkeinYarn(event.target.value)} /></label>
          <label>Width (cm)<input inputMode="decimal" value={widthCm} onChange={(event) => setWidthCm(event.target.value)} /></label>
          <label>Height (cm)<input inputMode="decimal" value={heightCm} onChange={(event) => setHeightCm(event.target.value)} /></label>
        </div>
        <div className="results">
          <p><strong>{yarn}</strong><span>yarn in the swatch’s unit, including 10%</span></p>
          <p><strong>{skeins || "—"}</strong><span>skeins, rounded up</span></p>
        </div>
      </section>

      <section className="panel" id="chains">
        <h2>Starting chains and repeats</h2>
        <p>When a pattern says “chain a multiple of 6 + 2,” the 6 is the repeat and the +2 is the extra the pattern already counted. It is not another repeat.</p>
        <p className="formula">chains = repeats × multiple + extra. Stitches across a width are rounded up to the next multiple: ceil((cm × stitches per 10 cm ÷ 10) ÷ multiple) × multiple.</p>
        <div className="form-grid">
          <label>Repeats<input inputMode="numeric" value={repeats} onChange={(event) => setRepeats(event.target.value)} /></label>
          <label>Multiple<input inputMode="numeric" value={multiple} onChange={(event) => setMultiple(event.target.value)} /></label>
          <label>Extra chains from the pattern<input inputMode="numeric" value={extra} onChange={(event) => setExtra(event.target.value)} /></label>
          <label>Stitches per 10 cm<input inputMode="decimal" value={stitchesPer10} onChange={(event) => setStitchesPer10(event.target.value)} /></label>
          <label>Rows per 10 cm<input inputMode="decimal" value={rowsPer10} onChange={(event) => setRowsPer10(event.target.value)} /></label>
        </div>
        <div className="results">
          <p><strong>{chains}</strong><span>foundation chains</span></p>
          <p><strong>{fittedStitches}</strong><span>stitches to cover the yarn width above</span></p>
          <p><strong>{fittedRows}</strong><span>rows to cover the yarn height above</span></p>
        </div>
      </section>

      <section className="panel" id="hooks">
        <h2>Hook size conversion</h2>
        <p>{HOOK_SOURCE} Steel thread hooks are numbered in reverse and are not converted here.</p>
        <label>Millimeters or US size<input value={hookQuery} onChange={(event) => setHookQuery(event.target.value)} placeholder="5 or H-8" /></label>
        {hook.exact.length > 0 ? (
          <div className="results">
            {hook.exact.map((item) => (
              <p key={`${item.mm}-${item.us}`}><strong>{item.mm} mm</strong><span>{item.us || "No US letter on the CYC chart"}</span></p>
            ))}
          </div>
        ) : hook.nearest ? (
          <p>No exact chart row for that size. The nearest listed hook is <strong>{hook.nearest.mm} mm</strong>{hook.nearest.us ? ` (${hook.nearest.us})` : ""}. Use the millimeter mark on the hook.</p>
        ) : (
          <p>Enter a millimeter size or a US label such as H-8.</p>
        )}
        <div className="table-wrap" style={{ marginTop: "1rem" }}>
          <table>
            <caption>Regular crochet hooks</caption>
            <thead><tr><th>mm</th><th>US</th></tr></thead>
            <tbody>
              {CROCHET_HOOKS.map((item) => (
                <tr key={item.mm}><td>{item.mm}</td><td>{item.us || "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" id="terms">
        <h2>US and UK terms</h2>
        <p>The dictionary is the conversion list. US single crochet is UK double crochet; the taller stitches shift up by one name. Search the abbreviation exactly when you can.</p>
        <label>Stitch name or abbreviation<input value={termQuery} onChange={(event) => setTermQuery(event.target.value)} placeholder="sc, dc, or half treble" /></label>
        <div className="stitch-grid" style={{ marginTop: "1rem" }}>
          {terms.slice(0, 8).map((stitch) => (
            <article className="panel" key={stitch.slug}>
              <h3>{stitch.name}</h3>
              <p><strong>US</strong> {stitch.us}</p>
              <p><strong>UK</strong> {stitch.uk}</p>
            </article>
          ))}
        </div>
        {termQuery.trim() && terms.length === 0 && <p>No stitch entry uses that name or abbreviation.</p>}
      </section>

      <section className="panel" id="blanket">
        <h2>Blanket size</h2>
        <p>These are common planning sizes, not a bedding standard. Stitches and rows are rounded up so the fabric is at least the measurement: ceil(inches ÷ 4 × gauge).</p>
        <div className="form-grid">
          <label>
            Starting size
            <select
              value={blanketId}
              onChange={(event) => {
                const next = BLANKET_SIZES.find((item) => item.id === event.target.value);
                setBlanketId(event.target.value);
                if (next) {
                  setBlanketWidth(String(next.widthIn));
                  setBlanketLength(String(next.lengthIn));
                }
              }}
            >
              {BLANKET_SIZES.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.widthIn} × {item.lengthIn} in</option>)}
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>Stitches per 4 in<input inputMode="decimal" value={per4} onChange={(event) => setPer4(event.target.value)} /></label>
          <label>Width (inches)<input inputMode="decimal" value={blanketWidth} onChange={(event) => { setBlanketWidth(event.target.value); setBlanketId("custom"); }} /></label>
          <label>Length (inches)<input inputMode="decimal" value={blanketLength} onChange={(event) => { setBlanketLength(event.target.value); setBlanketId("custom"); }} /></label>
          <label>Rows per 4 in<input inputMode="decimal" value={rowsPer4} onChange={(event) => setRowsPer4(event.target.value)} /></label>
        </div>
        <div className="results">
          <p><strong>{blanketStitches}</strong><span>stitches across the width</span></p>
          <p><strong>{blanketRows}</strong><span>rows for the length</span></p>
        </div>
        <p className="hint">Adjust the stitch count to your pattern multiple before you chain.</p>
      </section>

      <section className="panel" id="granny">
        <h2>Granny square growth</h2>
        <p>This is a classic granny with four corners and the same cluster on every side, not a solid square. Chains in the corners and gaps are not included. Round r has 4 × r × cluster stitches. The total through round r is 2 × cluster × r × (r + 1).</p>
        <div className="form-grid">
          <label>Rounds<input inputMode="numeric" value={grannyRounds} onChange={(event) => setGrannyRounds(event.target.value)} /></label>
          <label>Stitches in each cluster<input inputMode="numeric" value={cluster} onChange={(event) => setCluster(event.target.value)} /></label>
          <label>Centimeters one round adds to the side<input inputMode="decimal" value={cmPerRound} onChange={(event) => setCmPerRound(event.target.value)} /></label>
        </div>
        <div className="results">
          <p><strong>{granny.groupsOnSide}</strong><span>groups along one side, counting one corner</span></p>
          <p><strong>{granny.stitchesThisRound}</strong><span>cluster stitches in the last round</span></p>
          <p><strong>{granny.stitchesTotal}</strong><span>cluster stitches in the whole square</span></p>
          <p><strong>{grannySide ? grannySide.toFixed(1) : "—"} cm</strong><span>side, if every round adds the same amount</span></p>
        </div>
      </section>

      <section className="panel" id="sphere">
        <h2>Amigurumi sphere</h2>
        <p>Continuous single crochet rounds. US single crochet is UK double crochet. A usual start is 6 stitches in a magic ring. Each increase round adds that same number of stitches. Decreases mirror the increases back to the starting count. Stuff as you close, and gather the last stitches.</p>
        <div className="form-grid">
          <label>Starting stitches<input inputMode="numeric" value={sphereStart} onChange={(event) => setSphereStart(event.target.value)} /></label>
          <label>Increase rounds<input inputMode="numeric" value={sphereIncrease} onChange={(event) => setSphereIncrease(event.target.value)} /></label>
          <label>Even rounds at the widest point<input inputMode="numeric" value={sphereEven} onChange={(event) => setSphereEven(event.target.value)} /></label>
        </div>
        <ol className="round-list">
          {sphere.map((round) => <li key={round.round}><strong>Round {round.round}.</strong> {round.instruction}</li>)}
        </ol>
      </section>

      <section className="panel" id="increases">
        <h2>Even increases</h2>
        <p>To add the same increase in every part of a round, the increase count has to divide the current stitch count. Otherwise the repeat would be uneven, and this calculator will say so instead of guessing.</p>
        <div className="form-grid">
          <label>Stitches you have now<input inputMode="numeric" value={haveStitches} onChange={(event) => setHaveStitches(event.target.value)} /></label>
          <label>Increases to add<input inputMode="numeric" value={addIncreases} onChange={(event) => setAddIncreases(event.target.value)} /></label>
        </div>
        {increases ? (
          <p>{increases.plain === 0 ? `Increase in every stitch, ${increases.repeats} times.` : `(${increases.plain} sc, inc) × ${increases.repeats}.`} The round ends with <strong>{increases.result}</strong> stitches. Use the decrease that matches your stitch when you are shaping the other way.</p>
        ) : (
          <p>Those increases do not divide the round evenly. Change one of the numbers, or space the extras by hand.</p>
        )}
      </section>

      <section className="panel" id="garment">
        <h2>Garment stitches from a body measurement</h2>
        <p>Body numbers are {sizeCharts.source}. A range uses the midpoint. Ease is added in inches, then stitches are rounded up: ceil((body + ease) ÷ 4 × stitches per 4 inches). This is a stitch count for that one measurement, not a full graded pattern.</p>
        <div className="form-grid">
          <label>
            Chart
            <select value={chartGroup} onChange={(event) => { setChartGroup(event.target.value); setChartSize(0); }}>
              {sizeChartGroups.map((group) => <option key={group}>{group}</option>)}
            </select>
          </label>
          <label>
            Size
            <select value={chartSize} onChange={(event) => setChartSize(Number(event.target.value))}>
              {chartSizes.map((size, index) => <option key={size} value={index}>{size}</option>)}
            </select>
          </label>
          <label>
            Measurement
            <select value={chartRow} onChange={(event) => setChartRow(Number(event.target.value))}>
              {sizeCharts.rows.map((row, index) => <option key={row} value={index}>{row}</option>)}
            </select>
          </label>
          <label>Ease to add (inches)<input inputMode="decimal" value={easeIn} onChange={(event) => setEaseIn(event.target.value)} /></label>
          <label>Stitches per 4 inches<input inputMode="decimal" value={garmentGauge} onChange={(event) => setGarmentGauge(event.target.value)} /></label>
        </div>
        <div className="results">
          <p><strong>{measurement || "—"}</strong><span>chart measurement in inches{parsed ? ` · midpoint ${parsed.mid}` : ""}</span></p>
          <p><strong>{finishedInches ? finishedInches.toFixed(2) : "—"}</strong><span>finished inches after ease</span></p>
          <p><strong>{garmentStitches || "—"}</strong><span>stitches for that measurement</span></p>
        </div>
        <h3>Ease, in plain language</h3>
        <ul>
          {sizeCharts.ease.map((item) => <li key={item[0]}><strong>{item[0]}.</strong> {item[1]}</li>)}
        </ul>
      </section>
    </div>
  );
}
