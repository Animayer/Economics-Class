export type Mode = "hub" | "learn" | "compare" | "simulate" | "examples" | "quiz";

export type SystemId = "capitalism" | "socialism" | "communism";

export type RouteState = {
  mode: Mode;
  system: SystemId;
};

export type Thinker = "Friedman" | "Sowell";

export type Understanding = {
  thinker: Thinker;
  title: string;
  body: string;
};

export type CheckQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  why: string;
};

export type SystemModule = {
  id: SystemId;
  name: string;
  short: string;
  owns: string;
  prices: string;
  incentives: string;
  definition: string;
  understandings: Understanding[];
  claims: string[];
  tradeoffs: string[];
  checks: CheckQuestion[];
};

export type ExampleCard = {
  era: "Classic" | "Modern";
  title: string;
  body: string;
};

export type Dimension = {
  id: string;
  label: string;
  capitalism: string;
  socialism: string;
  communism: string;
  insight: string;
  thinker: Thinker;
};

export type Metrics = {
  output: number;
  shortage: number;
  surplusWaste: number;
  choice: number;
  innovation: number;
  freedom: number;
  living: number;
  equality: number;
  personalProfit: number;
};

export type SimAction =
  | "follow-price"
  | "follow-habit"
  | "innovate"
  | "crony"
  | "order-bread"
  | "order-shoes"
  | "even-split"
  | "line-bonus"
  | "work-extra"
  | "do-minimum"
  | "ask-swap"
  | "send-idea";

export type QuizQuestion = {
  id: string;
  kind: "mc" | "scenario";
  prompt: string;
  options: string[];
  correctIndex: number;
  why: string;
};
