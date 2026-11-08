"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Step = { id: string; text: string; done: boolean };
type Pattern = { id: string; title: string; source: string; steps: Step[]; current: number; notes: string };
type Product = { id: string; name: string; category: string; price: number; description: string; url?: string };
type Tab = "patterns" | "tracker" | "calculators" | "shop";
const STORAGE_KEY = "crochet-chaos-v2";

export default function Home() {
  const [tab, setTab] = useState<Tab>("patterns");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [activeId, setActiveId] = useState("");
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [instructions, setInstructions] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [gaugeStitches, setGaugeStitches] = useState(16);
  const [gaugeRows, setGaugeRows] = useState(20);
  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(40);
  const [repeat, setRepeat] = useState(1);
  const [swatchMeters, setSwatchMeters] = useState(8);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.patterns)) setPatterns(data.patterns);
        if (typeof data.activeId === "string") setActiveId(data.activeId);
        if (data.theme === "light" || data.theme === "dark") setTheme(data.theme);
      }
    } catch { /* Start with an empty shelf if browser data is invalid. */ }
    setReady(true);
    fetch("/api/products").then((response) => response.ok ? response.json() : []).then((data) => {
      if (Array.isArray(data)) setProducts(data);
    }).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify({ patterns, activeId, theme }));
  }, [patterns, activeId, theme, ready]);

  const active = useMemo(() => patterns.find((pattern) => pattern.id === activeId), [patterns, activeId]);
  const totalStitches = Math.max(0, Math.ceil((Math.max(0, widthCm) * Math.max(0, gaugeStitches) / 10) / Math.max(1, repeat)) * Math.max(1, repeat));
  const totalRows = Math.max(0, Math.round(Math.max(0, heightCm) * Math.max(0, gaugeRows) / 10));
  const yarnMeters = widthCm > 0 && heightCm > 0 ? Math.ceil(Math.max(0, swatchMeters) * widthCm * heightCm / 100 * 1.1) : 0;

  function addPattern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const steps = instructions.split(/\n+/).map((line) => line.trim()).filter(Boolean)
      .map((text) => ({ id: crypto.randomUUID(), text, done: false }));
    const pattern: Pattern = { id: crypto.randomUUID(), title: cleanTitle, source: source.trim(), steps, current: 0, notes: "" };
    setPatterns((old) => [pattern, ...old]);
    setActiveId(pattern.id);
    setTitle(""); setSource(""); setInstructions(""); setTab("tracker");
  }

  function updateActive(patch: Partial<Pattern>) {
    if (!active) return;
    setPatterns((old) => old.map((pattern) => pattern.id === active.id ? { ...pattern, ...patch } : pattern));
  }

  async function askHelper(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || chatBusy) return;
    setChatBusy(true); setChatError(""); setAnswer("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The crochet helper could not answer right now.");
      setAnswer(data.reply || "No answer was returned.");
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Unable to contact the crochet helper.");
    } finally { setChatBusy(false); }
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ patterns, activeId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "crochet-chaos-backup.json"; link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#home">🧶 Crochet <b>Chaos</b></a>
        <nav className="nav" aria-label="Main navigation">
          {(["patterns", "tracker", "calculators", "shop"] as const).map((item) => <button key={item} className={tab === item ? "nav-item selected" : "nav-item"} onClick={() => setTab(item)}>{item === "patterns" ? "📚 Patterns" : item === "tracker" ? "🧵 Tracker" : item === "calculators" ? "✨ Calculators" : "🛍️ Shop"}</button>)}
        </nav>
        <button className="theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
      </header>

      <section className="hero" id="home">
        <div><p className="eyebrow">A BRIGHT LITTLE MAKER SPACE</p><h1>Make a little <span>crochet magic.</span></h1><p>Keep patterns, track your rows, estimate materials, and get a little help along the way.</p><button className="primary" onClick={() => setTab("patterns")}>Start a project ✦</button></div>
        <div className="hero-ball" aria-hidden="true">🧶<i>✦</i><em>✧</em></div>
      </section>

      <section className="workspace">
        {tab === "patterns" && <>
          <section className="panel"><p className="eyebrow">YOUR PATTERN SHELF</p><h2>Add a pattern</h2>
            <form onSubmit={addPattern} className="form-grid">
              <label>Pattern name<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Rainbow granny-square blanket" /></label>
              <label>Source link (optional)<input type="url" value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://…" /></label>
              <label className="full">Instructions<textarea rows={7} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Put each row or round on its own line to create checklist items." /></label>
              <p className="hint full">Instructions are split into checklist lines, not interpreted. Verify repeats and stitch counts against your pattern.</p>
              <button className="primary full" type="submit">Save pattern and checklist</button>
            </form>
          </section>
          <section className="panel"><div className="heading-row"><div><p className="eyebrow">SAVED IN THIS BROWSER</p><h2>Your patterns</h2></div><button className="secondary" onClick={exportBackup} disabled={!patterns.length}>Export backup</button></div>
            {!patterns.length ? <div className="empty"><span>✨🧶✨</span><h3>Your shelf is ready</h3><p>Add a pattern above to start tracking.</p></div> : <div className="pattern-list">{patterns.map((pattern) => <article className="pattern-card" key={pattern.id}><div><h3>{pattern.title}</h3><p className="muted">{pattern.steps.length} checklist steps{pattern.id === activeId ? " · Current project" : ""}</p>{pattern.source && <a href={pattern.source} target="_blank" rel="noreferrer">Open source ↗</a>}</div><button className="secondary" onClick={() => { setActiveId(pattern.id); setTab("tracker"); }}>Open tracker</button></article>)}</div>}
          </section>
        </>}

        {tab === "tracker" && <section className="panel"><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Project tracker</h2>
          {!active ? <div className="empty"><span>🧶</span><h3>No project selected</h3><p>Add a pattern, then open its tracker.</p><button className="primary" onClick={() => setTab("patterns")}>Go to patterns</button></div> : <>
            <div className="tracker-head"><div><h3>{active.title}</h3><p className="muted">{active.steps.filter((step) => step.done).length} of {active.steps.length} checklist items complete</p></div><div className="counter"><button aria-label="Decrease row or round" onClick={() => updateActive({ current: Math.max(0, active.current - 1) })}>−</button><strong>Row / round {active.current}</strong><button aria-label="Increase row or round" onClick={() => updateActive({ current: active.current + 1 })}>+1</button></div></div>
            <label className="field-label">Project notes<textarea rows={3} value={active.notes} onChange={(e) => updateActive({ notes: e.target.value })} placeholder="Where did you leave off? Note stitch markers or shaping details." /></label>
            <h3 className="check-title">Checklist <span className="muted">(verify against the original)</span></h3>
            {!active.steps.length ? <p className="muted">No instruction lines. Add instructions to the pattern to make checklist items.</p> : <div className="checklist">{active.steps.map((step, index) => <label className="check-row" key={step.id}><input type="checkbox" checked={step.done} onChange={() => updateActive({ steps: active.steps.map((item) => item.id === step.id ? { ...item, done: !item.done } : item) })} /><span className={step.done ? "done" : ""}><b>{index + 1}.</b> {step.text}</span></label>)}</div>}
          </>}
        </section>}

        {tab === "calculators" && <>
          <section className="panel"><p className="eyebrow">GAUGE + DIMENSIONS</p><h2>Stitch and row planner</h2><p className="muted">Estimates only. Pattern shaping and repeats may change the result.</p>
            <div className="form-grid two"><label>Stitches per 10 cm<input type="number" min="0" step="0.1" value={gaugeStitches} onChange={(e) => setGaugeStitches(Number(e.target.value))} /></label><label>Rows per 10 cm<input type="number" min="0" step="0.1" value={gaugeRows} onChange={(e) => setGaugeRows(Number(e.target.value))} /></label><label>Width (cm)<input type="number" min="0" step="0.1" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} /></label><label>Height (cm)<input type="number" min="0" step="0.1" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} /></label><label>Stitch repeat multiple<input type="number" min="1" value={repeat} onChange={(e) => setRepeat(Math.max(1, Number(e.target.value) || 1))} /></label></div>
            <div className="results"><p><strong>{totalStitches}</strong><span>estimated starting stitches</span></p><p><strong>{totalRows}</strong><span>estimated rows or rounds</span></p></div>
          </section>
          <section className="panel"><p className="eyebrow">SWATCH-BASED PLANNING</p><h2>Yarn estimate</h2><p className="muted">Approximation for a rectangular project using a similar stitch pattern; includes about 10% extra.</p><div className="form-grid two"><label>Swatch size<input value="10 × 10 cm" readOnly /></label><label>Yarn used for swatch (meters)<input type="number" min="0" step="0.1" value={swatchMeters} onChange={(e) => setSwatchMeters(Number(e.target.value))} /></label></div><div className="results"><p><strong>About {yarnMeters} m</strong><span>estimated yarn, including extra</span></p></div></section>
        </>}

        {tab === "shop" && <section className="panel"><p className="eyebrow">MAKER FINDS</p><h2>Tools and supplies</h2><p className="muted">Sample listings for planning only; this is not a real shop or checkout.</p><div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><span className="tag">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><strong>${product.price.toFixed(2)}</strong></article>)}</div></section>}

        <section className="panel assistant"><p className="eyebrow">AI CROCHET HELPER</p><h2>Ask a crochet question</h2><p className="muted">Helpful explanations for stitches, gauge, and pattern terminology. Check important instructions against your pattern.</p><form onSubmit={askHelper} className="form-grid"><label className="full">Your question<textarea rows={3} maxLength={2000} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What does ‘2 sc in next stitch’ mean?" /></label><button className="primary" type="submit" disabled={chatBusy || !question.trim()}>{chatBusy ? "Thinking…" : "Ask helper"}</button></form>{chatError && <p className="error" role="alert">{chatError}</p>}{answer && <div className="answer" aria-live="polite">{answer}</div>}</section>
      </section>
      <footer className="footer">🧶 Crochet Chaos · Made for makers, one stitch at a time ✦</footer>
    </main>
  );
}
