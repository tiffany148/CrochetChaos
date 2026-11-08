"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Step = { id: string; text: string; done: boolean };
type Pattern = { id: string; title: string; source: string; steps: Step[]; current: number; notes: string };
const KEY = "crochet-chaos-v1";

function splitSteps(text: string): Step[] {
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean)
    .map((text) => ({ id: crypto.randomUUID(), text, done: false }));
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [activeId, setActiveId] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"patterns" | "tracker" | "calculators">("patterns");
  const [stitchesPer10, setStitchesPer10] = useState(16);
  const [rowsPer10, setRowsPer10] = useState(20);
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(40);
  const [multiple, setMultiple] = useState(1);
  const [swatchMeters, setSwatchMeters] = useState(8);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setPatterns(Array.isArray(data.patterns) ? data.patterns : []);
        setActiveId(data.activeId || "");
        setTheme(data.theme === "dark" ? "dark" : "light");
      }
    } catch { /* Start with an empty workspace if saved data is invalid. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (ready) localStorage.setItem(KEY, JSON.stringify({ patterns, activeId, theme }));
  }, [theme, patterns, activeId, ready]);

  const active = patterns.find((item) => item.id === activeId);
  const stitchEstimate = Math.max(0, Math.ceil((width * stitchesPer10 / 10) / Math.max(1, multiple)) * Math.max(1, multiple));
  const rowEstimate = Math.max(0, Math.round(height * rowsPer10 / 10));
  const yarnEstimate = width > 0 && height > 0 ? Math.ceil(swatchMeters * width * height / 100 * 1.1) : 0;
  const completeCount = useMemo(() => active?.steps.filter((step) => step.done).length ?? 0, [active]);

  function createPattern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const item: Pattern = {
      id: crypto.randomUUID(), title: title.trim(), source: source.trim(),
      steps: splitSteps(text), current: 0, notes: "",
    };
    setPatterns((old) => [item, ...old]);
    setActiveId(item.id);
    setTitle(""); setSource(""); setText(""); setTab("tracker");
  }

  function patchActive(patch: Partial<Pattern>) {
    if (!active) return;
    setPatterns((old) => old.map((item) => item.id === active.id ? { ...item, ...patch } : item));
  }

  function toggleStep(id: string) {
    if (!active) return;
    patchActive({ steps: active.steps.map((step) => step.id === id ? { ...step, done: !step.done } : step) });
  }

  function exportBackup() {
    const file = new Blob([JSON.stringify({ patterns, activeId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a"); link.href = url; link.download = "crochet-chaos-backup.json"; link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={(event) => event.preventDefault()}><span>🧶</span> Crochet <b>Chaos</b></a>
        <nav aria-label="Main navigation" className="nav">
          {(["patterns", "tracker", "calculators"] as const).map((item) => (
            <button key={item} className={tab === item ? "nav-item selected" : "nav-item"} onClick={() => setTab(item)}>{item === "patterns" ? "📚 Patterns" : item === "tracker" ? "🧵 Project tracker" : "✨ Calculators"}</button>
          ))}
        </nav>
        <button className="theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
      </header>

      <section className="hero" id="top">
        <div><p className="eyebrow">A BRIGHT LITTLE MAKER SPACE</p><h1>Make a little <span>crochet magic.</span></h1><p>Save pattern notes, keep your place, and plan your next project—one stitch at a time.</p><button className="primary" onClick={() => setTab("patterns")}>Add a pattern ✦</button></div>
        <div className="hero-ball" aria-label="Yarn ball">🧶<i>✦</i><em>✧</em></div>
      </section>

      <main className="workspace">
        {tab === "patterns" && <>
          <section className="panel">
            <p className="eyebrow">YOUR PATTERN SHELF</p><h2>Add a pattern</h2>
            <form onSubmit={createPattern} className="form-grid">
              <label>Pattern name<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rainbow granny-square blanket" /></label>
              <label>Source link (optional)<input type="url" value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://…" /></label>
              <label className="full">Pattern instructions<textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste notes or instructions. Put each row/round on a separate line for a useful checklist." /></label>
              <p className="hint full">Imported instructions are split into checklist lines, not fully interpreted. Double-check repeats and stitch counts against the original pattern.</p>
              <button className="primary full" type="submit">Save pattern and make checklist</button>
            </form>
          </section>
          <section className="panel"><div className="heading-row"><div><p className="eyebrow">SAVED LOCALLY ON THIS DEVICE</p><h2>Saved patterns</h2></div><button className="secondary" onClick={exportBackup} disabled={!patterns.length}>Export backup</button></div>
            {!patterns.length ? <div className="empty"><span>✨🧶✨</span><h3>Your shelf is ready</h3><p>Add a pattern above to make a row-by-row checklist.</p></div> : <div className="pattern-list">{patterns.map((item) => <article className="pattern-card" key={item.id}><div><h3>{item.title}</h3><p className="muted">{item.steps.length} checklist steps {item.id === activeId ? "· Current project" : ""}</p>{item.source && <a href={item.source} target="_blank" rel="noreferrer">Open source ↗</a>}</div><button className="secondary" onClick={() => { setActiveId(item.id); setTab("tracker"); }}>Open tracker</button></article>)}</div>}
          </section>
        </>}

        {tab === "tracker" && <section className="panel"><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Project tracker</h2>
          {!active ? <div className="empty"><span>🧶</span><h3>No pattern selected</h3><p>Add or open a pattern from your pattern shelf.</p><button className="primary" onClick={() => setTab("patterns")}>Go to patterns</button></div> : <>
            <div className="tracker-head"><div><h3>{active.title}</h3><p className="muted">{completeCount} of {active.steps.length} steps checked</p></div><div className="counter"><button aria-label="Decrease row or round" onClick={() => patchActive({ current: Math.max(0, active.current - 1) })}>−</button><strong>Row / round {active.current}</strong><button aria-label="Increase row or round" onClick={() => patchActive({ current: active.current + 1 })}>+1</button></div></div>
            <label className="field-label">Where I left off / notes<textarea rows={3} value={active.notes} onChange={(e) => patchActive({ notes: e.target.value })} placeholder="e.g. Marker at start of round; next round is an increase." /></label>
            <h3 className="check-title">Smart checklist <span className="muted">(review against the original)</span></h3>
            {!active.steps.length ? <p className="muted">No instructions saved. Add pattern text to create checklist steps.</p> : <div className="checklist">{active.steps.map((step, index) => <label className="check-row" key={step.id}><input type="checkbox" checked={step.done} onChange={() => toggleStep(step.id)} /><span className={step.done ? "done" : ""}><b>{index + 1}.</b> {step.text}</span></label>)}</div>}
          </>}
        </section>}

        {tab === "calculators" && <><section className="panel"><p className="eyebrow">GAUGE + DIMENSIONS</p><h2>Stitch and row planner</h2><p className="muted">Estimates help with planning; shaping and pattern repeats may change the final counts.</p>
          <div className="form-grid two">
            <label>Stitches per 10 cm<input type="number" min="0.1" step="0.1" value={stitchesPer10} onChange={(e) => setStitchesPer10(Number(e.target.value))} /></label>
            <label>Rows per 10 cm<input type="number" min="0.1" step="0.1" value={rowsPer10} onChange={(e) => setRowsPer10(Number(e.target.value))} /></label>
            <label>Width / circumference (cm)<input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
            <label>Height (cm)<input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(Number(e.target.value))} /></label>
            <label>Stitch repeat multiple<input type="number" min="1" value={multiple} onChange={(e) => setMultiple(Math.max(1, Number(e.target.value)))} /></label>
            <label>Construction<select defaultValue="flat"><option value="flat">Flat rows</option><option value="joined">Joined rounds</option><option value="spiral">Continuous / spiral rounds</option></select></label>
            <label className="full">Turning-chain rule<select defaultValue="pattern"><option value="pattern">Follow the pattern</option><option value="counts">Counts as a stitch</option><option value="no-count">Does not count</option></select></label>
          </div>
          <div className="results"><p><strong>{stitchEstimate}</strong><span>estimated starting stitches</span></p><p><strong>{rowEstimate}</strong><span>estimated rows or rounds</span></p></div>
          <p className="lesson"><b>Quick guide:</b> Flat rows usually turn at the end of each row. Joined rounds are joined as directed. Continuous rounds spiral without joining, so a stitch marker helps. Turning-chain rules are pattern-specific.</p>
        </section>
        <section className="panel"><p className="eyebrow">SWATCH-BASED PLANNING</p><h2>Yarn estimate</h2><p className="muted">For a roughly rectangular project with a similar stitch pattern, scale yarn use from a measured swatch and add about 10% extra.</p>
          <div className="form-grid two"><label>Swatch size (10 × 10 cm)<input value="10 × 10 cm" readOnly /></label><label>Yarn used for swatch (meters)<input type="number" min="0" value={swatchMeters} onChange={(e) => setSwatchMeters(Number(e.target.value))} /></label></div>
          <div className="results"><p><strong>About {yarnEstimate} m</strong><span>estimate, including 10% extra</span></p></div>
          <p className="lesson">This is a rough estimate, not a guarantee. Tension, stitch texture, shaping, and project type affect yarn use. Amigurumi and shaped pieces need different calculations.</p>
        </section></>}
      </main>
      <footer className="footer">🧶 Crochet Chaos · Made for makers, one stitch at a time ✦</footer>
    </main>
  );
}
