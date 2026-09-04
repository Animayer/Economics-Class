export type Mode = "branches" | "rights" | "scenarios";

export type BranchId = "legislative" | "executive" | "judicial";

export type ArrowId = "leg-exec" | "exec-jud" | "leg-jud";

export type CheckId =
  | "veto"
  | "override"
  | "appointments"
  | "review"
  | "impeach"
  | "purse"
  | "war"
  | "treaties";

export type ScenarioKind = "amendment" | "choice";

export interface Branch {
  id: BranchId;
  article: string;
  name: string;
  shortName: string;
  who: string;
  whoDetail: string[];
  powers: string[];
  checks: string[];
}

export interface CheckAction {
  id: CheckId;
  label: string;
  summary: string;
  from: BranchId[];
  toward: BranchId[];
  arrows: ArrowId[];
}

export interface Amendment {
  number: number;
  roman: string;
  title: string;
  subtitle: string;
  gist: string;
  protects: string[];
  doesNot: string[];
  whyItMattered: string;
}

export interface ChoiceScenario {
  id: string;
  kind: "choice";
  prompt: string;
  choices: string[];
  answer: string;
  explain: string;
  topic: string;
}

export interface AmendmentScenario {
  id: string;
  kind: "amendment";
  prompt: string;
  answer: number;
  explain: string;
  topic: string;
}

export type Scenario = ChoiceScenario | AmendmentScenario;

export interface RouteState {
  mode: Mode;
  branch: BranchId | null;
  check: CheckId | null;
  amendment: number | null;
  scenario: number;
}
