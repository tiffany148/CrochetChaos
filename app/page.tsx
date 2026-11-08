"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { parsePatternText } from "@/lib/pattern-parser";
import { Product, PatternItem } from "@/lib/types";

type Tab = "patterns" | "tracker" | "calculators" | "shop";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("patterns");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [activePatternId, setActivePatternId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [patternText, setPatternText] = useState("");
  const [suppliesText, setSuppliesText] = useState("");

  const [gaugeStitches, setGaugeStitches] = useState(16);
  const [gaugeRows, setGaugeRows] = useState(20);
  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(40);
  const [stitchMultiple, setStitchMultiple] = useState(1);

  const [swatchWidth, setSwatchWidth] = useState(10);
  const [swatchHeight, setSwatchHeight] = useState(10);
  const [swatchYarnMeters, setSwatchYarnMeters] = useState(8);

  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("crochet-chaos-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const savedPatterns = localStorage.getItem("crochet-chaos-patterns");
    if (savedPatterns) {
      try {
        setPatterns(JSON.parse(savedPatterns));
      } catch {}
    }

    const savedCart = localStorage.getItem("crochet-chaos-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {}
    }

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("crochet-chaos-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("crochet-chaos-patterns", JSON.stringify(patterns));
  }, [patterns]);

  useEffect(() => {
    localStorage.setItem("crochet-chaos-cart", JSON.stringify(cart));
  }, [cart]);

  const activePattern = useMemo(
    () => patterns.find((pattern) => pattern.id === activePatternId) || null,
    [patterns, activePatternId]
  );

  const estimatedStitches = Math.max(
    1,
    Math.round(((widthCm * gaugeStitches) / 10) / stitchMultiple) * stitchMultiple
  );

  const estimatedRows = Math.max(1, Math.round((heightCm * gaugeRows) / 10));

  const yarnEstimate =
    swatchWidth > 0 && swatchHeight > 0
      ? Math.ceil(
          ((swatchYarnMeters * widthCm * heightCm) / (swatchWidth * swatchHeight)) * 1.1
        )
      : 0;

  const addPattern = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !patternText.trim()) return;

    const newPattern: PatternItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      sourceUrl: sourceUrl.trim() || undefined,
      sourceText: patternText,
      steps: parsePatternText(patternText),
      supplies: suppliesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      notes: "",
    };

    setPatterns((current) => [newPattern, ...current]);
    setActivePatternId(newPattern.id);
    setTitle("");
    setSourceUrl("");
    setPatternText("");
    setSuppliesText("");
    setTab("tracker");
  };

  const toggleStep = (patternId: string, stepId: string) => {
    setPatterns((current) =>
      current.map((pattern) =>
        pattern.id === patternId
          ? {
              ...pattern,
              steps: pattern.steps.map((step) =>
                step.id === stepId ? { ...step, done: !step.done } : step
              ),
            }
          : pattern
      )
    );
  };

  const updatePatternNote = (value: string) => {
    if (!activePattern) return;
    setPatterns((current) =>
      current.map((pattern) =>
        pattern.id === activePattern.id ? { ...pattern, notes: value } : pattern
      )
    );
  };

  const updateCurrentRow = (change: number) => {
    if (!activePattern) return;
    setPatterns((current) =>
      current.map((pattern) =>
        pattern.id === activePattern.id
          ? { ...pattern, currentRow: Math.max(0, pattern.currentRow + change) }
          : pattern
      )
    );
  };

  const addToCart = (productId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  };

  const totalCart = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const askAssistant = async () => {
    if (!assistantQuestion.trim()) return;
    setAssistantLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: assistantQuestion }),
      });

      const data = await response.json();
      setAssistantAnswer(
        data.reply || "I couldn’t generate a helpful answer right now."
      );
    } catch {
      setAssistantAnswer(
        "The crochet helper is not configured yet. Add OPENAI_API_KEY to your environment and restart the app."
      );
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">🧶 Stitch <span>Spark</span></div>

        <nav className="nav" aria-label="Main navigation">
          {(["patterns", "tracker", "calculators", "shop"] as const).map((item) => (
            <button
              key={item}
              className={tab === item ? "nav-button active" : "nav-button"}
              onClick={() => setTab(item)}
            >
              {item === "patterns" && "Patterns"}
              {item === "tracker" && "Tracker"}
              {item === "calculators" && "Calculators"}
              {item === "shop" && "Shop"}
            </button>
          ))}
        </nav>

        <button
          className="theme-button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">YOUR CROCHET WORKSHOP</p>
          <h1>Plan it. Track it. <span>Love it.</span></h1>
          <p>
            Keep patterns, yarn notes, row counts, and project progress in one bright,
            maker-friendly place.
          </p>
          <div className="button-row">
            <button className="primary-button" onClick={() => setTab("patterns")}>Add pattern</button>
            <button className="secondary-button" onClick={() => setTab("tracker")}>Tracker</button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">🧶</div>
      </section>

      {tab === "patterns" && (
        <section className="panel-grid">
          <div className="panel">
            <p className="eyebrow">IMPORT</p>
            <h2>Pattern library</h2>

            <form onSubmit={addPattern} className="field-grid">
              <label>
                Pattern title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summer scarf"
                />
              </label>

              <label>
                Source URL
                <input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </label>

              <label className="full">
                Pattern text
                <textarea
                  rows={10}
                  value={patternText}
                  onChange={(e) => setPatternText(e.target.value)}
                  placeholder="Paste pattern rows or rounds here. Put each row on a separate line if possible."
                />
              </label>

              <label className="full">
                Supplies / links
                <textarea
                  rows={4}
                  value={suppliesText}
                  onChange={(e) => setSuppliesText(e.target.value)}
                  placeholder={"Worsted yarn | https://example.com\n5mm hook | https://example.com"}
                />
              </label>

              <button className="primary-button full" type="submit">Save pattern</button>
            </form>
          </div>

          <div className="panel">
            <p className="eyebrow">SHELF</p>
            <h2>Saved patterns</h2>

            {patterns.length === 0 ? (
              <div className="empty-box">
                <span>✨</span>
                <p>No saved patterns yet.</p>
              </div>
            ) : (
              <div className="pattern-list">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="pattern-card">
                    <div className="pattern-header">
                      <h3>{pattern.title}</h3>
                      <button className="small-button" onClick={() => setActivePatternId(pattern.id)}>
                        Open
                      </button>
                    </div>
                    <p>{pattern.steps.length} checklist steps</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "tracker" && (
        <section className="panel">
          <p className="eyebrow">TRACKER</p>
          <h2>Project tracker</h2>

          {!activePattern ? (
            <div className="empty-box">
              <span>🧶</span>
              <p>Select a pattern to begin tracking.</p>
            </div>
          ) : (
            <>
              <div className="tracker-header">
                <div>
                  <h3>{activePattern.title}</h3>
                  <p className="muted">Current row/round: {activePattern.currentRow}</p>
                </div>

                <div className="counter-box">
                  <button className="secondary-button" onClick={() => updateCurrentRow(-1)}>-</button>
                  <button className="primary-button" onClick={() => updateCurrentRow(1)}>+1</button>
                </div>
              </div>

              <label className="field-label">
                Notes
                <textarea
                  rows={3}
                  value={activePattern.notes}
                  onChange={(e) => updatePatternNote(e.target.value)}
                  placeholder="Where did I leave off? any stitch markers or shape notes?"
                />
              </label>

              <div className="checklist">
                {activePattern.steps.map((step, index) => (
                  <label className="check-item" key={step.id}>
                    <input
                      type="checkbox"
                      checked={step.done}
                      onChange={() => toggleStep(activePattern.id, step.id)}
                    />
                    <span className={step.done ? "done" : ""}>
                      {index + 1}. {step.text}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {tab === "calculators" && (
        <section className="panel">
          <p className="eyebrow">PLANNER</p>
          <h2>Crochet calculators</h2>

          <div className="calculator-grid">
            <div className="calc-card">
              <h3>Stitches & rows</h3>

              <div className="field-grid small">
                <label>
                  Stitches per 10 cm
                  <input
                    type="number"
                    value={gaugeStitches}
                    onChange={(e) => setGaugeStitches(Number(e.target.value))}
                  />
                </label>
                <label>
                  Rows per 10 cm
                  <input
                    type="number"
                    value={gaugeRows}
                    onChange={(e) => setGaugeRows(Number(e.target.value))}
                  />
                </label>
                <label>
                  Width (cm)
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                  />
                </label>
                <label>
                  Height (cm)
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                  />
                </label>
                <label>
                  Stitch multiple
                  <input
                    type="number"
                    min={1}
                    value={stitchMultiple}
                    onChange={(e) => setStitchMultiple(Math.max(1, Number(e.target.value)))}
                  />
                </label>
              </div>

              <div className="result-box">
                <p>Estimated stitches: <strong>{estimatedStitches}</strong></p>
                <p>Estimated rows/rounds: <strong>{estimatedRows}</strong></p>
              </div>
            </div>

            <div className="calc-card">
              <h3>Yarn estimate</h3>

              <div className="field-grid small">
                <label>
                  Swatch width (cm)
                  <input
                    type="number"
                    value={swatchWidth}
                    onChange={(e) => setSwatchWidth(Number(e.target.value))}
                  />
                </label>
                <label>
                  Swatch height (cm)
                  <input
                    type="number"
                    value={swatchHeight}
                    onChange={(e) => setSwatchHeight(Number(e.target.value))}
                  />
                </label>
                <label>
                  Yarn used for swatch (m)
                  <input
                    type="number"
                    value={swatchYarnMeters}
                    onChange={(e) => setSwatchYarnMeters(Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="result-box">
                <p>Estimated yarn: <strong>{yarnEstimate} m</strong></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "shop" && (
        <section className="panel">
          <p className="eyebrow">SHOP</p>
          <h2>Yarn, hooks, and tools</h2>

          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-tag">{product.category}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <strong>${product.price.toFixed(2)}</strong>
                  <button className="small-button" onClick={() => addToCart(product.id)}>Add</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-box">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => {
                  const product = products.find((entry) => entry.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="cart-item">
                      <span>{product.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  );
                })}
                <div className="cart-total"><strong>Total: ${totalCart.toFixed(2)}</strong></div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="assistant-panel">
        <p className="eyebrow">AI CROCHET HELPER</p>
        <h2>Ask a question</h2>
        <textarea
          rows={5}
          value={assistantQuestion}
          onChange={(e) => setAssistantQuestion(e.target.value)}
          placeholder="Ask about increasing, gauge, turning chains, or yarn substitutions..."
        />
        <div className="button-row">
          <button className="primary-button" onClick={askAssistant} disabled={assistantLoading}>
            {assistantLoading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {assistantAnswer && (
          <div className="assistant-answer">
            {assistantAnswer}
          </div>
        )}
      </section>

      <footer className="footer">
        🧶 Crochet Chaos · made for makers, one stitch at a time.
      </footer>
    </main>
  );
}
