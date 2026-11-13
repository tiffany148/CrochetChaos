/* Book figures are already web-sized, and the step diagrams include SVG. */
/* eslint-disable @next/next/no-img-element */
import { CALLOUT_LABEL, type BookBlock, type CalloutKind } from "../lib/book";

const BADGES: Partial<Record<CalloutKind, string>> = {
  wisdom: "/book/art/badges/granny.png",
  dang: "/book/art/badges/dang.png",
  hint: "/book/art/badges/hint.png",
  fix: "/book/art/badges/fix.png",
};

function inline(text: string, keyPrefix: string) {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const pieces: Array<string | { em: string } | { strong: string } | { code: string } | { href: string; label: string }> = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) pieces.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith("**")) pieces.push({ strong: token.slice(2, -2) });
    else if (token.startsWith("`")) pieces.push({ code: token.slice(1, -1) });
    else if (token.startsWith("*")) pieces.push({ em: token.slice(1, -1) });
    else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && (link[2].startsWith("/") || link[2].startsWith("https://") || link[2].startsWith("http://"))) {
        pieces.push({ href: link[2], label: link[1] });
      } else pieces.push(token);
    }
    last = index + token.length;
  }
  if (last < text.length) pieces.push(text.slice(last));
  return pieces.map((piece, index) => {
    const key = `${keyPrefix}-${index}`;
    if (typeof piece === "string") return <span key={key}>{piece}</span>;
    if ("strong" in piece) return <strong key={key}>{piece.strong}</strong>;
    if ("em" in piece) return <em key={key}>{piece.em}</em>;
    if ("code" in piece) return <code key={key}>{piece.code}</code>;
    const external = piece.href.startsWith("http");
    return (
      <a key={key} href={piece.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {piece.label}
      </a>
    );
  });
}

function paragraphs(text: string, keyPrefix: string) {
  return text.split(/\n\n+/).filter(Boolean).map((paragraph, index) => (
    <p key={`${keyPrefix}-${index}`}>{inline(paragraph, `${keyPrefix}-${index}`)}</p>
  ));
}

function Callout({ kind, title, text, index }: { kind: CalloutKind; title: string; text: string; index: number }) {
  const badge = BADGES[kind];
  return (
    <aside className={`tip tip-${kind}`}>
      <strong className="tip-title">
        {badge ? <img src={badge} alt="" width={48} height={48} /> : null}
        {title}
      </strong>
      {paragraphs(text, `tip${index}`)}
    </aside>
  );
}

export function BookBody({ blocks }: { blocks: BookBlock[] }) {
  return (
    <div className="book-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 2) return <h2 key={index}>{inline(block.text, `h${index}`)}</h2>;
          if (block.level === 3) return <h3 key={index}>{inline(block.text, `h${index}`)}</h3>;
          return <h4 key={index}>{inline(block.text, `h${index}`)}</h4>;
        }
        if (block.type === "paragraph") return <p key={index}>{inline(block.text, `p${index}`)}</p>;
        if (block.type === "quote") return <blockquote className="book-quote" key={index}>{paragraphs(block.text, `q${index}`)}</blockquote>;
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={index}>
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item, `li${index}-${itemIndex}`)}</li>)}
            </Tag>
          );
        }
        if (block.type === "image") {
          return (
            <figure className={`book-figure ${block.kind}`} key={index}>
              <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
            </figure>
          );
        }
        if (block.type === "table") {
          return (
            <div className="table-wrap book-table" key={index}>
              <table>
                {block.headers.length > 0 && (
                  <thead>
                    <tr>{block.headers.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell, `th${index}-${cellIndex}`)}</th>)}</tr>
                  </thead>
                )}
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell, `td${index}-${rowIndex}-${cellIndex}`)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "rule") return <hr key={index} />;
        if (block.type === "steps") {
          return (
            <div className="step-grid" key={index}>
              {block.steps.map((step) => (
                <article className="step-card" key={`${step.n}-${step.src}`}>
                  <div className="step-photo">
                    <img src={step.src} alt={step.alt || step.caption} loading="lazy" decoding="async" />
                    {!step.embeddedBadge && <span className="step-num">{step.n}</span>}
                  </div>
                  <div className="step-copy">
                    <p>{inline(step.caption, `step${index}-${step.n}`)}</p>
                    {step.checkpoint ? <p className="checkpoint">Checkpoint: {step.checkpoint}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          );
        }
        if (block.type === "callout") return <Callout key={index} kind={block.kind} title={block.title} text={block.text} index={index} />;
        return <Callout key={index} kind={block.type} title={CALLOUT_LABEL[block.type]} text={block.text} index={index} />;
      })}
    </div>
  );
}
