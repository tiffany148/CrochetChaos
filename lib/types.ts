export type Step = {
  id: string;
  text: string;
  done: boolean;
};

export type Pattern = {
  id: string;
  title: string;
  source: string;
  steps: Step[];
  current: number;
  notes: string;
  category?: string;
};
