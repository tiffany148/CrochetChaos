export type Step = {
  id: string;
  text: string;
  done: boolean;
};

export type PatternItem = {
  id: string;
  title: string;
  sourceUrl?: string;
  sourceText: string;
  steps: Step[];
  supplies: string[];
  notes: string;
  currentRow: number;
};

export type Product = {
  id: string;
  name: string;
  category: "yarn" | "hook" | "tool" | "book";
  price: number;
  description: string;
};
