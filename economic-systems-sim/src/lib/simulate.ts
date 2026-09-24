import type { Metrics, SimAction, SystemId } from "../types";

export const ROUND_COUNT = 5;

export const GOODS = ["bread", "shoes", "radios"] as const;
export type Good = (typeof GOODS)[number];

/** What households actually want more of. Hidden when there is no market price. */
export const TRUE_NEED: readonly Good[] = ["bread", "shoes", "bread", "radios", "shoes"];

/** Planning report from last month — one step behind the real need. */
export const STALE_REPORT: readonly (Good | "none")[] = ["none", "bread", "shoes", "bread", "radios"];

const PLAN_GOOD: Good = "bread";

export const REFERENCE_ACTIONS: Record<SystemId, readonly SimAction[]> = {
  capitalism: ["follow-price", "follow-price", "innovate", "follow-price", "follow-price"],
  socialism: ["line-bonus", "line-bonus", "line-bonus", "line-bonus", "line-bonus"],
  communism: ["work-extra", "work-extra", "work-extra", "work-extra", "work-extra"],
};

const GOOD_NAME: Record<Good, string> = {
  bread: "bread",
  shoes: "shoes",
  radios: "radios",
};

export function startingMetrics(system: SystemId): Metrics {
  if (system === "capitalism") {
    return {
      output: 100,
      shortage: 30,
      surplusWaste: 14,
      choice: 76,
      innovation: 42,
      freedom: 88,
      living: 64,
      equality: 45,
      personalProfit: 20,
    };
  }
  if (system === "socialism") {
    return {
      output: 100,
      shortage: 38,
      surplusWaste: 22,
      choice: 42,
      innovation: 22,
      freedom: 44,
      living: 50,
      equality: 72,
      personalProfit: 0,
    };
  }
  return {
    output: 100,
    shortage: 46,
    surplusWaste: 24,
    choice: 22,
    innovation: 12,
    freedom: 18,
    living: 44,
    equality: 84,
    personalProfit: 0,
  };
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function shift(m: Metrics, d: Partial<Metrics>): Metrics {
  return {
    output: clamp(m.output + (d.output ?? 0), 40, 180),
    shortage: clamp(m.shortage + (d.shortage ?? 0)),
    surplusWaste: clamp(m.surplusWaste + (d.surplusWaste ?? 0)),
    choice: clamp(m.choice + (d.choice ?? 0)),
    innovation: clamp(m.innovation + (d.innovation ?? 0)),
    freedom: clamp(m.freedom + (d.freedom ?? 0)),
    living: clamp(m.living + (d.living ?? 0)),
    equality: clamp(m.equality + (d.equality ?? 0)),
    personalProfit: clamp(m.personalProfit + (d.personalProfit ?? 0)),
  };
}

export function actionsFor(system: SystemId): readonly SimAction[] {
  if (system === "capitalism") return ["follow-price", "follow-habit", "innovate", "crony"];
  if (system === "socialism") return ["order-bread", "order-shoes", "even-split", "line-bonus"];
  return ["work-extra", "do-minimum", "ask-swap", "send-idea"];
}

export type PriceRow = {
  good: Good;
  name: string;
  level: "high" | "low";
  note: string;
};

export function priceBoard(roundIndex: number): PriceRow[] {
  const need = TRUE_NEED[roundIndex] ?? "bread";
  return GOODS.map((good) => ({
    good,
    name: GOOD_NAME[good],
    level: good === need ? "high" : "low",
    note: good === need ? "Buyers are bidding this up" : "Shelves are loose and the price is soft",
  }));
}

export type Situation = {
  title: string;
  body: string;
};

export function situation(system: SystemId, roundIndex: number): Situation {
  const round = roundIndex + 1;
  const need = TRUE_NEED[roundIndex] ?? "bread";
  if (system === "capitalism") {
    return {
      title: `Round ${round} of ${ROUND_COUNT} · prices posted`,
      body: `Households are bidding the most for ${need}. You own the firm, so the loss or the gain lands in your books. A special license from the town is available — that path is crony privilege, not free enterprise.`,
    };
  }
  if (system === "socialism") {
    const report = STALE_REPORT[roundIndex];
    const reportLine =
      report === "none"
        ? "The capital has no history yet. It cannot tell you what people will want this month."
        : `Last month’s report says the trouble was ${report}. The report is already old. You still have no price for today.`;
    return {
      title: `Round ${round} of ${ROUND_COUNT} · planning board`,
      body: `${reportLine} Major firms are public. You may order bread, order shoes, split the plan evenly, or pay a bonus for whichever line is longest right now.`,
    };
  }
  return {
    title: `Round ${round} of ${ROUND_COUNT} · assigned quota`,
    body: `The plan ordered ${PLAN_GOOD} again. Your ration card matches last month. You may work an extra hour, do the assigned minimum, ask the store for a swap, or send a radio sketch to the ministry. You cannot open your own shop.`,
  };
}

export type ActionChoice = {
  id: SimAction;
  key: string;
  title: string;
  detail: string;
};

export function actionChoices(system: SystemId, roundIndex: number): ActionChoice[] {
  const need = TRUE_NEED[roundIndex] ?? "bread";
  if (system === "capitalism") {
    return [
      {
        id: "follow-price",
        key: "1",
        title: `Make ${need}`,
        detail: "Follow the high price. Buyers are telling you what is scarce.",
      },
      {
        id: "follow-habit",
        key: "2",
        title: "Keep making bread",
        detail: "Ignore the other prices. Bread is what this shop has always made.",
      },
      {
        id: "innovate",
        key: "3",
        title: "Bet on a better radio",
        detail: "Use part of the week on a new product. Output of the old line slows a little.",
      },
      {
        id: "crony",
        key: "4",
        title: "Get a no-rivals license",
        detail: "Crony privilege. Your pocket can gain while the town loses choices.",
      },
    ];
  }
  if (system === "socialism") {
    return [
      {
        id: "order-bread",
        key: "1",
        title: "Order more bread",
        detail: "Put the public factories on bread. You are guessing without today’s price.",
      },
      {
        id: "order-shoes",
        key: "2",
        title: "Order more shoes",
        detail: "Put the public factories on shoes. A stale report is not a live price.",
      },
      {
        id: "even-split",
        key: "3",
        title: "Split the plan evenly",
        detail: "Give every line the same hours. Pay stays flat. Equality of the plan goes up.",
      },
      {
        id: "line-bonus",
        key: "4",
        title: "Bonus for the longest line",
        detail: "Crews can see the line. They still do not own the factory or set a market price.",
      },
    ];
  }
  return [
    {
      id: "work-extra",
      key: "1",
      title: "Work the extra hour",
      detail: `More ${PLAN_GOOD} comes off the assigned line. Your ration barely moves.`,
    },
    {
      id: "do-minimum",
      key: "2",
      title: "Do the assigned minimum",
      detail: "The ration card does not change if you coast. The plan’s output slips.",
    },
    {
      id: "ask-swap",
      key: "3",
      title: "Ask the store for a swap",
      detail: "Request shoes or a radio instead of the listed ration.",
    },
    {
      id: "send-idea",
      key: "4",
      title: "Send the radio sketch upstairs",
      detail: "The ministry can file it. You cannot start a firm or keep a profit.",
    },
  ];
}

export type StepResult = {
  action: SimAction;
  before: Metrics;
  after: Metrics;
  headline: string;
  detail: string;
};

function needMatches(action: SimAction, roundIndex: number): boolean {
  const need = TRUE_NEED[roundIndex] ?? "bread";
  if (action === "order-bread") return need === "bread";
  if (action === "order-shoes") return need === "shoes";
  if (action === "follow-habit") return need === "bread";
  if (action === "work-extra") return need === PLAN_GOOD;
  return false;
}

export function applyAction(system: SystemId, roundIndex: number, metrics: Metrics, action: SimAction): StepResult {
  if (!actionsFor(system).includes(action)) {
    throw new Error(`Action ${action} is not available under ${system}`);
  }
  if (roundIndex < 0 || roundIndex >= ROUND_COUNT) {
    throw new Error(`Round ${roundIndex} is outside 0–${ROUND_COUNT - 1}`);
  }

  const before = metrics;
  let after = metrics;
  let headline = "";
  let detail = "";
  const need = TRUE_NEED[roundIndex] ?? "bread";

  if (action === "follow-price") {
    after = shift(metrics, {
      output: 7,
      shortage: -8,
      surplusWaste: -3,
      choice: 1,
      innovation: 1,
      living: 5,
      equality: -1,
      personalProfit: 6,
    });
    headline = `The high price was ${need}. You made ${need}.`;
    detail =
      "Shelves cleared because the price told you where to aim. Milton Friedman treated a price as a signal, not a decoration. Your profit rose because buyers valued the goods more than the inputs.";
  } else if (action === "follow-habit") {
    if (needMatches(action, roundIndex)) {
      after = shift(metrics, {
        output: 5,
        shortage: -5,
        surplusWaste: -1,
        living: 3,
        personalProfit: 3,
      });
      headline = "Bread was the scarce good this round, so the habit worked.";
      detail =
        "Luck agreed with the price. Next time the scarce good may move. A habit is not a signal. Thomas Sowell’s point stands: you still face a trade-off between comfort and paying attention.";
    } else {
      after = shift(metrics, {
        output: 1,
        shortage: 7,
        surplusWaste: 8,
        choice: -2,
        living: -2,
        personalProfit: -4,
      });
      headline = `You baked bread while people were short of ${need}.`;
      detail =
        "You were free to ignore the price, and the loss showed up in your books. That freedom to fail is part of the market. Unsold bread piled up. The scarce good stayed scarce.";
    }
  } else if (action === "innovate") {
    after = shift(metrics, {
      output: 3,
      shortage: -2,
      surplusWaste: -1,
      choice: 6,
      innovation: 12,
      living: 4,
      personalProfit: 3,
    });
    headline = "A better radio reached the shelf.";
    detail =
      "You gave up some ordinary output to try something new. Buyers could accept or reject it. Profit and loss — not a ministry — decided whether the bet was worth repeating.";
  } else if (action === "crony") {
    after = shift(metrics, {
      output: 2,
      shortage: 6,
      choice: -10,
      innovation: -6,
      freedom: -12,
      living: -4,
      equality: -4,
      personalProfit: 12,
    });
    headline = "Your pocket is fuller. The town is not.";
    detail =
      "A no-rivals license is crony privilege, not free enterprise. Classroom rule: crony is not capitalism. Connected profit rose because rivals were blocked, not because you served buyers better.";
  } else if (action === "order-bread" || action === "order-shoes") {
    const ordered = action === "order-bread" ? "bread" : "shoes";
    if (needMatches(action, roundIndex)) {
      after = shift(metrics, {
        output: 4,
        shortage: -5,
        surplusWaste: -2,
        freedom: -1,
        living: 2,
        equality: 1,
      });
      headline = `The quota matched. People did want ${ordered}.`;
      detail =
        "One good month does not retire the knowledge problem. Thomas Sowell’s warning still applies: the facts that matter are scattered, and they change. You will not get a fresh price tomorrow morning.";
    } else {
      after = shift(metrics, {
        output: 1,
        shortage: 8,
        surplusWaste: 9,
        choice: -2,
        freedom: -1,
        living: -2,
        equality: 1,
      });
      headline = `Warehouses of ${ordered}. Lines for ${need}.`;
      detail =
        "The board used an old report and missed. Output barely rose. Waste and shortages rose together. Without a market price, a careful planner can still aim at the wrong good.";
    }
  } else if (action === "even-split") {
    after = shift(metrics, {
      output: 2,
      shortage: 3,
      surplusWaste: 4,
      choice: -1,
      innovation: -1,
      freedom: -1,
      equality: 6,
    });
    headline = "Shares look even. Shelves do not.";
    detail =
      "Equal hours are not the same as people getting what they need. Sowell: there are trade-offs, not solutions. The equality number rose. Shortages did not vanish.";
  } else if (action === "line-bonus") {
    after = shift(metrics, {
      output: 5,
      shortage: -4,
      surplusWaste: -1,
      choice: 1,
      innovation: 2,
      freedom: 1,
      living: 3,
      equality: -2,
    });
    headline = "A bonus pushed crews toward the long line.";
    detail =
      "Incentives matter. Crews used what they could see. They still spent the public’s materials, not their own, and no price told the town how much of the scarce good was enough. Friedman: nobody spends somebody else’s money as carefully as his own.";
  } else if (action === "work-extra") {
    if (needMatches(action, roundIndex)) {
      after = shift(metrics, {
        output: 4,
        shortage: -3,
        surplusWaste: 2,
        living: 1,
      });
      headline = "The quota was bread, and people did want bread.";
      detail =
        "Extra work raised the planned good. Your ration card moved only a little. No owner kept the value of the extra loaf, so the reward for care stayed thin.";
    } else {
      after = shift(metrics, {
        output: 4,
        shortage: 6,
        surplusWaste: 8,
        choice: -1,
        living: -1,
      });
      headline = `More bread came off the line. Households were short of ${need}.`;
      detail =
        "The plan raised tonnage and still missed the need. That is the knowledge problem: a central office does not hold the local trade-offs people know. Working harder made more of the assigned good.";
    }
  } else if (action === "do-minimum") {
    after = shift(metrics, {
      output: -2,
      shortage: 4,
      living: -1,
    });
    headline = "The ration card did not change.";
    detail =
      "Pay and rations are set by the plan, not by how carefully you work. Friedman’s line applies: when you do not keep the fruit of extra care, the careful hour is harder to sustain. This is an incentive result, not a claim that people are villains.";
  } else if (action === "ask-swap") {
    after = shift(metrics, {});
    headline = "The store cannot make the trade.";
    detail =
      "There is no market price and no shopkeeper ordering for profit. Your request is a form, not a purchase. Consumer choice stays narrow even when the clerk is polite.";
  } else if (action === "send-idea") {
    after = shift(metrics, { innovation: 3 });
    headline = "The ministry filed the radio sketch.";
    detail =
      "An idea without a right to start a firm, buy parts, or keep a gain mostly sits in a pile. Innovation in a market is a bet someone can win or lose. A filing cabinet does not run that bet.";
  }

  return { action, before, after, headline, detail };
}

export function runPath(system: SystemId, actions: readonly SimAction[]): StepResult[] {
  let metrics = startingMetrics(system);
  return actions.map((action, index) => {
    const step = applyAction(system, index, metrics, action);
    metrics = step.after;
    return step;
  });
}

export function finalMetrics(system: SystemId, actions: readonly SimAction[]): Metrics {
  const steps = runPath(system, actions);
  return steps.length > 0 ? steps[steps.length - 1].after : startingMetrics(system);
}

export type Debrief = {
  title: string;
  paragraphs: string[];
  danger: string | null;
};

export function buildDebrief(system: SystemId, actions: readonly SimAction[]): Debrief {
  const start = startingMetrics(system);
  const final = finalMetrics(system, actions);
  const reference = finalMetrics(system, REFERENCE_ACTIONS[system]);
  const market = finalMetrics("capitalism", REFERENCE_ACTIONS.capitalism);
  const livingDelta = final.living - start.living;
  const shortageDelta = final.shortage - start.shortage;
  const usedCrony = actions.includes("crony");

  const livingLine =
    livingDelta > 3
      ? `Living standards rose by ${livingDelta} points.`
      : livingDelta < -1
        ? `Living standards fell by ${Math.abs(livingDelta)} points.`
        : "Living standards barely moved.";
  const shortageLine =
    shortageDelta < -2
      ? `Shortages eased by ${Math.abs(shortageDelta)} points.`
      : shortageDelta > 2
        ? `Shortages grew by ${shortageDelta} points.`
        : "Shortages stayed about the same.";

  const paragraphs = [
    `${livingLine} ${shortageLine} Consumer choice ended at ${final.choice}. Freedom and property ended at ${final.freedom}. Innovation ended at ${final.innovation}. Income equality ended at ${final.equality} — a high equality score is not the same thing as a high living standard.`,
  ];

  if (system === "capitalism") {
    paragraphs.push(
      "Milton Friedman: a price is a signal. When you followed the high price, you did not need a board to announce the shortage. Buyers and sellers cleared it by voluntary exchange. When you ignored the price, the mistake showed up as unsold goods and a thinner profit.",
      "Thomas Sowell: judge outcomes, not only intentions. A kind wish to “just keep making bread” still left people short when the need moved. Trade-offs remain. Markets do not promise equal pockets. They do reward useful risk and punish waste.",
    );
  } else if (system === "socialism") {
    paragraphs.push(
      "Milton Friedman: nobody spends somebody else’s money as carefully as he spends his own. Public factories can be run by serious people and still waste inputs, because the loss does not land on an owner. Empty shelves are what a household feels.",
      `Thomas Sowell: intentions are not outcomes. The equality score ended at ${final.equality} while choice ended at ${final.choice}, freedom and exit at ${final.freedom}, and the living standard at ${final.living}. A bonus used a scrap of local knowledge and still was not a price. When the shortage stays, connections — not the line — decide who carries goods home.`,
      "For a Creekville family, a costly exit means the state is the main employer. Complaining about the empty shelf can cost the paycheck. Favoritism fills the gap a market price would have filled.",
    );
  } else {
    paragraphs.push(
      "Milton Friedman: if no one may own the result, extra care has little reward. Your ration stayed put whether the hour was careful or minimum. The same party holds the job, the shop, the paper, and the police.",
      `Thomas Sowell: intentions are not outcomes. Equality of income ended at ${final.equality}. Living standards ended at ${final.living}, choice at ${final.choice}, freedom and exit at ${final.freedom}. A high equality score beside a thin ration is not a solved problem. Historical command campaigns turned that miss into famine. This town model stops at shortages. The historical cost did not.`,
      "No exit is concrete for a Creekville family. They cannot open a shop, print a complaint, or cross the border. Closed borders, secret police, and camps were how 20th-century party-states enforced that monopoly. The repression is a feature of the system, not a random mood.",
    );
  }

  if (usedCrony) {
    paragraphs.push(
      "You took at least one no-rivals license. Pocket profit can rise that way while shortages and lost choice rise for everyone else. Crony privilege is not free enterprise. Friedman’s case is voluntary cooperation, not a favor that blocks rivals.",
    );
  }

  if (final.living + 2 < reference.living) {
    paragraphs.push(
      `The strongest play available inside this system finished at a living standard of ${reference.living}. Yours finished at ${final.living}. Some of the gap is the choices in this run. The rest is what the system allows.`,
    );
  } else {
    paragraphs.push(
      `This run matched the strongest play this system offers on the town’s living standard (${final.living}). Further gains would require different rules, not tighter clicking.`,
    );
  }

  if (system !== "capitalism") {
    paragraphs.push(
      `A competitive market reference — follow prices, skip crony licenses — finishes near a living standard of ${market.living}, shortages of ${market.shortage}, choice of ${market.choice}, and freedom of ${market.freedom}. Compare that with your board, not as a slogan, but as the score you just watched.`,
    );
  }

  const title =
    system === "capitalism"
      ? "Debrief · prices, profit, and crony favors"
      : system === "socialism"
        ? "Debrief · empty shelves, favoritism, and a costly exit"
        : "Debrief · no exit, and equality that did not feed the house";

  const danger =
    system === "capitalism"
      ? null
      : system === "socialism"
        ? `Freedom and exit ended at ${final.freedom}. Shortages ended at ${final.shortage}. Equality ended at ${final.equality}. A Creekville family still has to eat. Connections, not a price, hand out what is left.`
        : `Freedom and exit ended at ${final.freedom}. The family cannot leave town, change employers, or vote the plan out. Equality at ${final.equality} did not raise the living standard, which ended at ${final.living}.`;

  return { title, paragraphs, danger };
}

export const METRICS: {
  key: keyof Metrics;
  label: string;
  hint: string;
  scale: number;
  good: "high" | "low" | "neutral";
  capitalismOnly?: boolean;
}[] = [
  { key: "output", label: "Output", hint: "How much the town made", scale: 160, good: "high" },
  { key: "living", label: "Living standard", hint: "What households can use", scale: 100, good: "high" },
  { key: "shortage", label: "Shortages", hint: "Empty shelves", scale: 100, good: "low" },
  { key: "surplusWaste", label: "Wasted surplus", hint: "Made and not wanted", scale: 100, good: "low" },
  { key: "choice", label: "Consumer choice", hint: "Real options on the shelf", scale: 100, good: "high" },
  { key: "innovation", label: "Innovation", hint: "New products that get made", scale: 100, good: "high" },
  { key: "freedom", label: "Freedom & exit", hint: "Own, leave, speak, trade", scale: 100, good: "high" },
  { key: "equality", label: "Income equality", hint: "How even pay is", scale: 100, good: "neutral" },
  {
    key: "personalProfit",
    label: "Your profit",
    hint: "Owner’s pocket, not the town",
    scale: 100,
    good: "neutral",
    capitalismOnly: true,
  },
];
