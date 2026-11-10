"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Encyclopedia from "../app/encyclopedia";
import { loadWorkspace, serializeWorkspace, STORAGE_KEY_V1, STORAGE_KEY_V2 } from "../lib/storage";
import type { Pattern } from "../lib/types";
import { useTheme } from "./ThemeProvider";

type Product = { id: string; name: string; category: string; price: number; description: string; url?: string };
type Tab = "patterns" | "tracker" | "lessons" | "shop";

export function Workspace() {
  const { theme, hydrated } = useTheme();
  const [tab, setTab] = useState<Tab>("patterns");
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

  useEffect(() => {
    try {
      const workspace = loadWorkspace(localStorage.getItem(STORAGE_KEY_V2), localStorage.getItem(STORAGE_KEY_V1));
      setPatterns(workspace.patterns);
      setActiveId(workspace.activeId);
    } catch {
      /* Start with an empty shelf if browser data is invalid. */
    }
    setReady(true);
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!ready || !hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_V2, serializeWorkspace({ patterns, activeId, theme }));
    } catch {
      /* Keep the session usable if browser storage is unavailable. */
    }
  }, [patterns, activeId, theme, ready, hydrated]);

  const active = useMemo(() => patterns.find((pattern) => pattern.id === activeId), [patterns, activeId]);

  function addPattern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const steps = instructions
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({ id: crypto.randomUUID(), text, done: false }));
    const pattern: Pattern = { id: crypto.randomUUID(), title: cleanTitle, source: source.trim(), steps, current: 0, notes: "" };
    setPatterns((old) => [pattern, ...old]);
    setActiveId(pattern.id);
    setTitle("");
    setSource("");
    setInstructions("");
    setTab("tracker");
  }

  function updateActive(patch: Partial<Pattern>) {
    if (!active) return;
    setPatterns((old) => old.map((pattern) => (pattern.id === active.id ? { ...pattern, ...patch } : pattern)));
  }

  async function askHelper(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || chatBusy) return;
    setChatBusy(true);
    setChatError("");
    setAnswer("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The crochet helper could not answer right now.");
      setAnswer(data.reply || "No answer was returned.");
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Unable to contact the crochet helper.");
    } finally {
      setChatBusy(false);
    }
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ patterns, activeId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "crochet-chaos-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <p className="eyebrow">Project workspace</p>
      <h1>Keep your place.</h1>
      <p className="lede">Patterns, checklists, and the row counter stay in this browser under the same crochet-chaos keys. Planning math lives with the calculators.</p>
      <div className="anchor-nav" aria-label="Workspace sections">
        {([
          ["patterns", "Patterns"],
          ["tracker", "Tracker"],
          ["lessons", "Lesson notes"],
          ["shop", "Sample shop"],
        ] as const).map(([id, label]) => (
          <button key={id} className={tab === id ? "secondary" : "secondary"} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
        <Link className="secondary" href="/calculators">Open calculators</Link>
      </div>

      {tab === "patterns" && (
        <div className="calc-layout">
          <section className="panel">
            <h2>Add a pattern</h2>
            <form onSubmit={addPattern} className="form-grid">
              <label>
                Pattern name
                <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Rainbow granny-square blanket" />
              </label>
              <label>
                Source link (optional)
                <input type="url" value={source} onChange={(event) => setSource(event.target.value)} placeholder="https://" />
              </label>
              <label className="full">
                Instructions
                <textarea rows={7} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Put each row or round on its own line to create checklist items." />
              </label>
              <p className="hint full">Instructions are split into checklist lines, not interpreted. Verify repeats and stitch counts against your pattern.</p>
              <button className="primary full" type="submit">Save pattern and checklist</button>
            </form>
          </section>
          <section className="panel">
            <div className="heading-row">
              <h2>Your patterns</h2>
              <button className="secondary" type="button" onClick={exportBackup} disabled={!patterns.length}>Export backup</button>
            </div>
            {!patterns.length ? (
              <div className="empty">
                <h3>Your shelf is ready</h3>
                <p>Add a pattern to start tracking. Older projects saved as crochet-chaos-v1 are copied forward the first time this page loads.</p>
              </div>
            ) : (
              <div className="pattern-list">
                {patterns.map((pattern) => (
                  <article className="pattern-card" key={pattern.id}>
                    <div>
                      <h3>{pattern.title}</h3>
                      <p className="muted">{pattern.steps.length} checklist steps{pattern.id === activeId ? " · Current project" : ""}</p>
                      {pattern.source && <a href={pattern.source} target="_blank" rel="noreferrer">Open source</a>}
                    </div>
                    <button className="secondary" type="button" onClick={() => { setActiveId(pattern.id); setTab("tracker"); }}>Open tracker</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "tracker" && (
        <section className="panel">
          <h2>Project tracker</h2>
          {!active ? (
            <div className="empty">
              <h3>No project selected</h3>
              <p>Add a pattern, then open its tracker.</p>
              <button className="primary" type="button" onClick={() => setTab("patterns")}>Go to patterns</button>
            </div>
          ) : (
            <>
              <div className="tracker-head">
                <div>
                  <h3>{active.title}</h3>
                  <p className="muted">{active.steps.filter((step) => step.done).length} of {active.steps.length} checklist items complete</p>
                </div>
                <div className="counter">
                  <button type="button" aria-label="Decrease row or round" onClick={() => updateActive({ current: Math.max(0, active.current - 1) })}>−</button>
                  <strong>Row / round {active.current}</strong>
                  <button type="button" aria-label="Increase row or round" onClick={() => updateActive({ current: active.current + 1 })}>+1</button>
                </div>
              </div>
              <label className="field-label">
                Project notes
                <textarea rows={3} value={active.notes} onChange={(event) => updateActive({ notes: event.target.value })} placeholder="Where did you leave off? Note stitch markers or shaping details." />
              </label>
              <h3>Checklist <span className="muted">(verify against the original)</span></h3>
              {!active.steps.length ? <p className="muted">No instruction lines. Add instructions to the pattern to make checklist items.</p> : (
                <div className="checklist">
                  {active.steps.map((step, index) => (
                    <label className="check-row" key={step.id}>
                      <input
                        type="checkbox"
                        checked={step.done}
                        onChange={() => updateActive({ steps: active.steps.map((item) => (item.id === step.id ? { ...item, done: !item.done } : item)) })}
                      />
                      <span className={step.done ? "done" : ""}><b>{index + 1}.</b> {step.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {tab === "lessons" && <Encyclopedia />}
      {tab === "shop" && (
        <section className="panel">
          <h2>Tools and supplies</h2>
          <p className="muted">Sample listings for planning only. This is not a shop or a checkout.</p>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <span className="pill">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>${product.price.toFixed(2)}</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="panel" style={{ marginTop: "1rem" }}>
        <h2>Ask a crochet question</h2>
        <p className="muted">Helpful explanations for stitches, gauge, and pattern terminology. Check important instructions against your pattern.</p>
        <form onSubmit={askHelper} className="form-grid">
          <label className="full">
            Your question
            <textarea rows={3} maxLength={2000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What does 2 sc in the next stitch mean?" />
          </label>
          <button className="primary" type="submit" disabled={chatBusy || !question.trim()}>{chatBusy ? "Thinking…" : "Ask helper"}</button>
        </form>
        {chatError && <p className="error" role="alert">{chatError}</p>}
        {answer && <div className="answer" aria-live="polite">{answer}</div>}
      </section>
    </div>
  );
}
