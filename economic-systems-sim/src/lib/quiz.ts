import type { QuizQuestion } from "../types";

export const QUIZ: readonly QuizQuestion[] = [
  {
    id: "define-cap",
    kind: "mc",
    prompt: "Which line matches this class definition of capitalism?",
    options: [
      "Private owners and voluntary prices decide most production",
      "The state owns major industry and sets quotas",
      "A one-party plan assigns every job and ration",
      "Any country with a sales tax",
    ],
    correctIndex: 0,
    why: "Capitalism here means private property plus prices from voluntary exchange. Taxes exist in market countries. Ownership and prices are the test.",
  },
  {
    id: "define-soc",
    kind: "mc",
    prompt: "Socialism, as this course uses the word, mainly means what?",
    options: [
      "Society or the state owns the major means of production",
      "Private firms compete and the government runs a fire department",
      "No laws exist at all",
      "Only workers may buy groceries",
    ],
    correctIndex: 0,
    why: "The ownership test matters. Public clinics plus private factories is a mixed market economy, not socialism in this definition.",
  },
  {
    id: "define-com",
    kind: "mc",
    prompt: "How should you describe communist states of the 20th century?",
    options: [
      "One-party command economies, not the stateless ideal on the poster",
      "Multi-party democracies with private heavy industry",
      "Places with no government, as the final slogan hoped",
      "High-tax countries that left factories in private hands",
    ],
    correctIndex: 0,
    why: "State the ideal and the record separately. People lived under party-states and command plans. That is the system to judge.",
  },
  {
    id: "price-signal",
    kind: "mc",
    prompt: "Friedman would read a rising bread price as what?",
    options: [
      "A signal that bread is scarce relative to what buyers want",
      "Proof that bakers are cronies by definition",
      "An order to freeze the price forever",
      "Evidence that property rights should be abolished",
    ],
    correctIndex: 0,
    why: "A price communicates scarcity. Makers and buyers can respond without a central list of reasons.",
  },
  {
    id: "spend-care",
    kind: "scenario",
    prompt:
      "A family repairs its own roof and shops three quotes. A town board spends a grant on a roof for a building none of the members own. Friedman’s best line is:",
    options: [
      "Nobody spends somebody else’s money as carefully as he spends his own",
      "There are no prices, so the grant is always wiser",
      "Equal roofs require a command quota for shingles",
      "The family is practicing cronyism by comparing quotes",
    ],
    correctIndex: 0,
    why: "The family feels the cost. The board spends someone else’s money on someone else’s building — Friedman’s least careful box.",
  },
  {
    id: "tradeoff",
    kind: "scenario",
    prompt:
      "A candidate promises equal pay for every job and no drop in output, choice, or freedom. Sowell would answer:",
    options: [
      "There are trade-offs, not a solution that hits every goal at once",
      "Intentions guarantee the outcome",
      "Prices are decorations and can be ignored",
      "Crony licenses are the same thing as competition",
    ],
    correctIndex: 0,
    why: "Sowell: there are no solutions, only trade-offs. Flattening pay changes incentives. Name the cost instead of wishing it away.",
  },
  {
    id: "knowledge",
    kind: "scenario",
    prompt:
      "A national office sets next month’s shoe output for Creekville. It does not know which sizes sold out after a flood. Which idea names the miss?",
    options: [
      "The knowledge problem — needed facts are local and already changing",
      "Free enterprise, because an office exists",
      "A market price that just cleared",
      "Income equality as a living standard",
    ],
    correctIndex: 0,
    why: "Sowell presses the knowledge problem: planners cannot gather scattered, perishable facts in time. A local price would have moved when sizes ran out.",
  },
  {
    id: "crony",
    kind: "scenario",
    prompt:
      "A connected firm gets an exclusive license so no rival may sell the same phones. Prices and profits for that firm rise. What is the honest label?",
    options: [
      "Crony privilege, not competitive free enterprise",
      "The textbook case for capitalism",
      "Communism, because the government printed a form",
      "A shortage caused by too much consumer choice",
    ],
    correctIndex: 0,
    why: "Classroom rule: crony is not free enterprise. Blocking rivals is a political favor. Friedman’s case is voluntary exchange, not a protected monopoly.",
  },
  {
    id: "flat-pay",
    kind: "mc",
    prompt: "If every worker is paid the same no matter the quality, what should you expect?",
    options: [
      "Less careful work over time, because the reward for care fell",
      "Automatically better quality, because fairness inspires everyone equally",
      "Market prices to become more accurate",
      "Private property to expand",
    ],
    correctIndex: 0,
    why: "Incentives matter. Sowell’s point is behavioral, not a slur. People respond when extra care stops paying.",
  },
  {
    id: "denmark",
    kind: "mc",
    prompt: "Which description of Denmark fits this course?",
    options: [
      "A high-tax market economy with private ownership — not Soviet socialism",
      "A command communist state with ration cards",
      "A place with no private companies",
      "Crony capitalism by definition because it has taxes",
    ],
    correctIndex: 0,
    why: "Nordic countries kept private firms and market prices and added large welfare states. Do not call that cartoon socialism. Do not call a welfare state a command economy.",
  },
  {
    id: "korea",
    kind: "scenario",
    prompt: "North and South Korea share a people and a peninsula. The South’s living standards pulled far ahead. The best classroom explanation is:",
    options: [
      "The South used markets and private enterprise; the North stayed a command party-state",
      "The South adopted Soviet planning in 1953",
      "Climate made the North unable to farm anything",
      "Denmark’s tax rate was copied only in the North",
    ],
    correctIndex: 0,
    why: "The pair holds culture and geography much closer than most comparisons. Systems diverged: markets and private firms in the South, command rule in the North.",
  },
  {
    id: "china-now",
    kind: "mc",
    prompt: "What is an accurate label for China today?",
    options: [
      "A communist party-state that allowed a large market sector after 1978",
      "Textbook communism with no private business",
      "A free-enterprise republic with open political competition",
      "The same system as Denmark’s welfare state",
    ],
    correctIndex: 0,
    why: "Living standards rose after market reforms. The party kept political control. That is mixed and state-directed — not pure communism, and not the free-enterprise benchmark.",
  },
];

export function quizScore(answers: readonly (number | null)[]): { correct: number; total: number } {
  const correct = QUIZ.reduce((sum, question, index) => {
    return sum + (answers[index] === question.correctIndex ? 1 : 0);
  }, 0);
  return { correct, total: QUIZ.length };
}
