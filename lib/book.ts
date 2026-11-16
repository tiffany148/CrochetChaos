export type StepPhoto = {
  n: number;
  src: string;
  caption: string;
  checkpoint: string;
  alt?: string;
  embeddedBadge?: boolean;
};

export type CalloutKind = "wisdom" | "dang" | "fix" | "hint" | "safety" | "pattern" | "status" | "try";

export type BookBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "wisdom" | "dang" | "fix"; text: string }
  | { type: "callout"; kind: CalloutKind; title: string; text: string }
  | { type: "steps"; steps: StepPhoto[] }
  | { type: "image"; src: string; alt: string; kind: "symbol" | "figure" | "poster" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "rule" };

export type ParsedChapter = {
  title: string;
  summary: string;
  docType: string;
  part: number | null;
  chapter: number | null;
  status: string;
  blocks: BookBlock[];
  plainText: string;
};

export type ParseOptions = {
  resolveImage?: (src: string) => string | null;
};

const TIP_TYPES = new Set(["wisdom", "dang", "fix"]);

const CALLOUT_KIND: Record<string, CalloutKind> = {
  GRANNY: "wisdom",
  DANG: "dang",
  HINT: "hint",
  FIX: "fix",
  SAFETY: "safety",
  PATTERN: "pattern",
  STATUS: "status",
  TRY: "try",
};

export const CALLOUT_LABEL: Record<CalloutKind, string> = {
  wisdom: "Granny's Wisdom",
  dang: "Dang, I Wish I'd Known That",
  hint: "Hint",
  fix: "Fix It",
  safety: "Safety",
  pattern: "Pattern",
  status: "Testing status",
  try: "Try it",
};

function unquote(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function safeImageSrc(value: string): string | null {
  const src = value.trim();
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("..")) return null;
  return src;
}

function resolveImage(src: string, options?: ParseOptions): string | null {
  if (options?.resolveImage) return options.resolveImage(src);
  return safeImageSrc(src);
}

function parseStepLine(line: string, options?: ParseOptions): StepPhoto | null {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length < 4) return null;
  const n = Number(parts[0]);
  const src = resolveImage(parts[1], options);
  if (!Number.isInteger(n) || n < 1 || !src) return null;
  return { n, src, caption: parts[2], checkpoint: parts.slice(3).join(" | "), embeddedBadge: false };
}

function imageKind(src: string): "symbol" | "figure" | "poster" {
  if (src.includes("/symbols/")) return "symbol";
  if (src.includes("about-the-author")) return "poster";
  return "figure";
}

function parseImageLine(line: string): { alt: string; raw: string } | null {
  const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
  if (!match) return null;
  return { alt: match[1].trim(), raw: match[2].trim() };
}

function isStepAlt(alt: string): boolean {
  return /^step\s+\d+\b/i.test(alt);
}

function quoteParagraphs(lines: string[]): string {
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (current.length) paragraphs.push(current.join(" "));
      current = [];
    } else {
      current.push(line.trim());
    }
  }
  if (current.length) paragraphs.push(current.join(" "));
  return paragraphs.join("\n\n");
}

function splitCells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function isSeparatorRow(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function nextContent(lines: string[], index: number): number {
  let cursor = index;
  while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
  return cursor;
}

/** Parse one Markdown chapter. Supports the book package and the older ::: tip blocks. */
export function parseChapter(markdown: string, options?: ParseOptions): ParsedChapter {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  let body = normalized;
  let title = "";
  let summary = "";
  let docType = "";
  let part: number | null = null;
  let chapter: number | null = null;
  let status = "";
  if (normalized.startsWith("---\n")) {
    const end = normalized.indexOf("\n---", 4);
    if (end !== -1) {
      const front = normalized.slice(4, end);
      body = normalized.slice(end + 4).trim();
      for (const line of front.split("\n")) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) continue;
        const value = unquote(match[2]);
        if (match[1] === "title") title = value;
        if (match[1] === "summary") summary = value;
        if (match[1] === "type") docType = value;
        if (match[1] === "status") status = value;
        if (match[1] === "part" && Number.isInteger(Number(value))) part = Number(value);
        if (match[1] === "chapter" && Number.isInteger(Number(value))) chapter = Number(value);
      }
    }
  }

  const blocks: BookBlock[] = [];
  const lines = body.split("\n");
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.trim().match(/^:::(\w+)\s*$/);
    if (fence) {
      const kind = fence[1];
      const collected: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") {
        collected.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      if (TIP_TYPES.has(kind)) {
        const text = collected.join("\n").trim();
        if (text) blocks.push({ type: kind as "wisdom" | "dang" | "fix", text });
      } else if (kind === "steps") {
        const steps = collected.map((item) => parseStepLine(item, options)).filter((step): step is StepPhoto => step !== null);
        if (steps.length) blocks.push({ type: "steps", steps });
      }
      continue;
    }

    const callout = line.match(/^>\s*\[!([A-Za-z]+)\]\s*(.*)$/);
    if (callout) {
      const kind = CALLOUT_KIND[callout[1].toUpperCase()];
      const sourceTitle = callout[2].trim();
      const bodyLines: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].startsWith(">")) {
        bodyLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      if (kind) {
        blocks.push({
          type: "callout",
          kind,
          title: sourceTitle || CALLOUT_LABEL[kind],
          text: quoteParagraphs(bodyLines),
        });
      }
      continue;
    }

    if (line.startsWith(">")) {
      const bodyLines: string[] = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        bodyLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      const text = quoteParagraphs(bodyLines);
      if (text) blocks.push({ type: "quote", text });
      continue;
    }

    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      if (tableLines.length >= 2 && isSeparatorRow(tableLines[1])) {
        blocks.push({
          type: "table",
          headers: splitCells(tableLines[0]),
          rows: tableLines.slice(2).map(splitCells),
        });
      } else {
        blocks.push({ type: "table", headers: [], rows: tableLines.map(splitCells) });
      }
      continue;
    }

    if (/^(---|\*\*\*|___)\s*$/.test(line.trim())) {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    const image = parseImageLine(line);
    if (image) {
      const following = nextContent(lines, index + 1);
      const stepLine = following < lines.length ? lines[following].match(/^(\d+)\.\s+(.+)$/) : null;
      if (isStepAlt(image.alt) && stepLine) {
        const steps: StepPhoto[] = [];
        while (index < lines.length) {
          const current = parseImageLine(lines[index].trim() ? lines[index] : "");
          if (!current || !isStepAlt(current.alt)) break;
          const numberIndex = nextContent(lines, index + 1);
          const numbered = numberIndex < lines.length ? lines[numberIndex].match(/^(\d+)\.\s+(.+)$/) : null;
          if (!numbered) break;
          const src = resolveImage(current.raw, options);
          if (src) {
            steps.push({
              n: Number(numbered[1]),
              src,
              caption: numbered[2].trim(),
              checkpoint: "",
              alt: current.alt,
              embeddedBadge: true,
            });
          }
          index = numberIndex + 1;
          const ahead = nextContent(lines, index);
          if (ahead < lines.length && parseImageLine(lines[ahead]) && isStepAlt(parseImageLine(lines[ahead])?.alt ?? "")) {
            index = ahead;
          } else {
            break;
          }
        }
        if (steps.length) blocks.push({ type: "steps", steps });
        continue;
      }
      const src = resolveImage(image.raw, options);
      index += 1;
      if (src) blocks.push({ type: "image", src, alt: image.alt, kind: imageKind(src) });
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4;
      blocks.push({ type: "heading", level, text: heading[2].trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2).trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, "").trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  if (!title) {
    const heading = blocks.find((block) => block.type === "heading");
    if (heading && heading.type === "heading") title = heading.text;
  }

  return { title, summary, docType, part, chapter, status, blocks, plainText: plainTextFrom(title, summary, blocks) };
}

function startsBlock(line: string): boolean {
  return (
    line.startsWith("#")
    || line.startsWith("- ")
    || line.startsWith(">")
    || line.startsWith("|")
    || line.trim().startsWith(":::")
    || /^!\[/.test(line.trim())
    || /^\d+\.\s+/.test(line)
    || /^(---|\*\*\*|___)\s*$/.test(line.trim())
  );
}

export function plainTextFrom(title: string, summary: string, blocks: BookBlock[]): string {
  return [title, summary, ...blocks.flatMap(blockText)].filter(Boolean).join("\n");
}

function blockText(block: BookBlock): string[] {
  if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") return [block.text];
  if (block.type === "list") return block.items;
  if (block.type === "steps") return block.steps.flatMap((step) => [step.alt ?? "", step.caption, step.checkpoint]);
  if (block.type === "image") return [block.alt];
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "callout") return [block.title, block.text];
  if (block.type === "rule") return [];
  return [block.text];
}

export function chapterPlainText(markdown: string): string {
  return parseChapter(markdown).plainText;
}
