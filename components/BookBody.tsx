import Image from "next/image";
import type { BookBlock } from "../lib/book";

const TIP_LABEL = {
  wisdom: "Granny's Wisdom",
  dang: "Dang, I Wish I'd Known That",
  fix: "Fix It",
} as const;

function inline(text: string, keyPrefix: string) {
  const pieces: Array<string | { href: string; label: string } | { strong: string }> = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) pieces.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith("**")) pieces.push({ strong: token.slice(2, -2) });
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
    if (typeof piece === "string") return <span key={`${keyPrefix}-${index}`}>{piece}</span>;
    if ("strong" in piece) return <strong key={`${keyPrefix}-${index}`}>{piece.strong}</strong>;
    const external = piece.href.startsWith("http");
    return (
      <a key={`${keyPrefix}-${index}`} href={piece.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {piece.label}
      </a>
    );
  });
}

export function BookBody({ blocks }: { blocks: BookBlock[] }) {
  return (
    <div className="book-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return block.level === 2 ? <h2 key={index}>{block.text}</h2> : <h3 key={index}>{block.text}</h3>;
        }
        if (block.type === "paragraph") return <p key={index}>{inline(block.text, `p${index}`)}</p>;
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item) => <li key={item}>{inline(item, item)}</li>)}
            </ul>
          );
        }
        if (block.type === "steps") {
          return (
            <div className="step-grid" key={index}>
              {block.steps.map((step) => (
                <article className="step-card" key={`${step.n}-${step.src}`}>
                  <div className="step-photo">
                    <Image src={step.src} alt={step.caption} fill sizes="(max-width: 860px) 100vw, 480px" />
                    <span className="step-num">{step.n}</span>
                  </div>
                  <div className="step-copy">
                    <p>{step.caption}</p>
                    <p className="checkpoint">Checkpoint: {step.checkpoint}</p>
                  </div>
                </article>
              ))}
            </div>
          );
        }
        return (
          <aside className={`tip tip-${block.type}`} key={index}>
            <strong>{TIP_LABEL[block.type]}</strong>
            <p>{block.text}</p>
          </aside>
        );
      })}
    </div>
  );
}
