export type StepPhoto = {
  n: number;
  src: string;
  caption: string;
  checkpoint: string;
};

export type BookBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "wisdom" | "dang" | "fix"; text: string }
  | { type: "steps"; steps: StepPhoto[] };

export type ParsedChapter = {
  title: string;
  summary: string;
  blocks: BookBlock[];
  plainText: string;
};

const TIP_TYPES = new Set(["wisdom", "dang", "fix"]);

function safeImageSrc(value: string): string | null {
  const src = value.trim();
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("..")) return null;
  return src;
}

function parseStepLine(line: string): StepPhoto | null {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length < 4) return null;
  const n = Number(parts[0]);
  const src = safeImageSrc(parts[1]);
  if (!Number.isInteger(n) || n < 1 || !src) return null;
  return { n, src, caption: parts[2], checkpoint: parts.slice(3).join(" | ") };
}

/** Parse one Markdown chapter. Front matter is optional. Custom blocks use :::wisdom, :::dang, :::fix, and :::steps. */
export function parseChapter(markdown: string): ParsedChapter {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  let body = normalized;
  let title = "";
  let summary = "";
  if (normalized.startsWith("---\n")) {
    const end = normalized.indexOf("\n---", 4);
    if (end !== -1) {
      const front = normalized.slice(4, end);
      body = normalized.slice(end + 4).trim();
      for (const line of front.split("\n")) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) continue;
        if (match[1] === "title") title = match[2].trim();
        if (match[1] === "summary") summary = match[2].trim();
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
        const steps = collected.map(parseStepLine).filter((step): step is StepPhoto => step !== null);
        if (steps.length) blocks.push({ type: "steps", steps });
      }
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length === 2 ? 2 : 3, text: heading[2].trim() });
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2).trim());
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }
    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !lines[index].startsWith("#") && !lines[index].startsWith("- ") && !lines[index].trim().startsWith(":::")) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  const plainText = [title, summary, ...blocks.flatMap(blockText)].join("\n");
  return { title, summary, blocks, plainText };
}

function blockText(block: BookBlock): string[] {
  if (block.type === "heading" || block.type === "paragraph") return [block.text];
  if (block.type === "list") return block.items;
  if (block.type === "steps") return block.steps.flatMap((step) => [step.caption, step.checkpoint]);
  return [block.text];
}

export function chapterPlainText(markdown: string): string {
  return parseChapter(markdown).plainText;
}
