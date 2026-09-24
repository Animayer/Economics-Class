import type { Dimension, ExampleCard, SystemId, SystemModule } from "../types";

export const CLASS_LINE = "Battery Creek High School · Economics · Mayer";

export const CLASS_RULE =
  "Crony privilege is not free enterprise. A special license, bailout, or rule written to block rivals is a political favor — not a market.";

export const SYSTEM_ORDER: readonly SystemId[] = ["capitalism", "socialism", "communism"];

export const SYSTEMS: readonly SystemModule[] = [
  {
    id: "capitalism",
    name: "Capitalism",
    short: "Private owners, market prices, voluntary exchange",
    owns: "Private people and firms own factories, farms, shops, and ideas. You can sell them, leave a job, or start something new.",
    prices: "Prices come from buyers and sellers. A higher price says a good is scarce relative to what people want. Nobody has to announce that from a capital.",
    incentives: "Profit and loss land on the owner. Make something people value, and you gain. Waste inputs, and the loss is yours. Workers can move toward better offers.",
    definition:
      "Capitalism, in this class, means free enterprise: private property, prices set by voluntary exchange, and the freedom to compete. It is not “business people get a favor from the mayor.” That favor is crony privilege.",
    understandings: [
      {
        thinker: "Friedman",
        title: "Prices are messengers",
        body: "Milton Friedman taught that a price is a signal. Shoes get expensive when buyers want more shoes than shops have. Makers then produce more, or buyers switch. No committee has to know every reason.",
      },
      {
        thinker: "Friedman",
        title: "Freedom and capitalism travel together",
        body: "If you can leave a bad deal — a job, a shop, a town — other people have less power over you. Friedman argued that economic freedom and political freedom support each other. When the state owns the jobs and the press, disagreement gets expensive.",
      },
      {
        thinker: "Friedman",
        title: "Whose money is it?",
        body: "Friedman put it plainly: nobody spends somebody else’s money as carefully as he spends his own. Owners watch costs because the waste is theirs. A grant, a favor, or a public budget does not create that same care.",
      },
      {
        thinker: "Sowell",
        title: "Incentives beat announced intentions",
        body: "Thomas Sowell asks what people do when the reward changes, not what the brochure promises. Profit is evidence that buyers valued the product more than the inputs. It is not a moral medal, and it is not a crime by itself.",
      },
      {
        thinker: "Sowell",
        title: "Trade-offs, not a perfect scoreboard",
        body: "Markets do not promise equal pockets. Sowell’s line is that there are no solutions, only trade-offs. Judge the record on growth, choice, and the freedom to exit — not only on whether the intention sounded generous.",
      },
    ],
    claims: [
      "Advocates say owners who keep the gain will serve customers, cut waste, and try new products.",
      "They say rising living standards in market societies came from trade and innovation, not from a central shopping list.",
      "They say you can have disagreement in politics when your job and your newspaper are not the same office.",
    ],
    tradeoffs: [
      "Incomes are uneven. A new product can make one firm rich while an old skill loses value.",
      "Some people start with very little. A market does not, by itself, write a family’s budget.",
      "Crony deals — licenses, bailouts, rules that block rivals — wear the costume of business and drop the competition. That is the trade-off to refuse, not the definition to defend.",
    ],
    checks: [
      {
        id: "cap-price",
        prompt: "A rise in the price of shoes mainly tells producers what?",
        options: [
          "Shoes are scarce relative to what buyers want",
          "The mayor has banned shoes",
          "Profit is now illegal",
          "Everyone must receive free shoes",
        ],
        correctIndex: 0,
        why: "Friedman: the higher price is a signal of scarcity. It pushes makers to supply more or buyers to economize. It is not a speech from the mayor.",
      },
      {
        id: "cap-crony",
        prompt: "The town gives one bakery a law that bans new bakeries. What is that?",
        options: [
          "Crony privilege, not free enterprise",
          "The definition of capitalism",
          "A market price clearing the bread market",
          "Communism, because a law exists",
        ],
        correctIndex: 0,
        why: "Classroom rule: crony is not free enterprise. Blocking rivals is a political favor. Competitive capitalism is the freedom of other bakers to open.",
      },
    ],
  },
  {
    id: "socialism",
    name: "Socialism",
    short: "Public ownership of major production, political allocation",
    owns: "The public, usually through the state, owns the major means of production — the factories, farms, mines, and big tools. Small personal items may still be private.",
    prices: "Many prices and output targets are set by a plan, a ministry, or a political vote. They do not freely move when local buyers change their minds.",
    incentives: "Pay is often leveled in the name of equality. Managers spend the public’s resources. Gains and losses do not land on a private owner in the same way.",
    definition:
      "Socialism, in this class, means social or state ownership of the major means of production, with output aimed by plan or politics more than by voluntary prices. It is not “a rich country that taxes people and still lets private firms own the factories.” That second thing is a mixed market economy, or a welfare state.",
    understandings: [
      {
        thinker: "Sowell",
        title: "Two visions of what a plan can do",
        body: "Sowell contrasts an unconstrained vision — a smart design can solve the social problem — with a constrained vision: people have limits, selfish streaks, and only pieces of knowledge. Socialism leans on the first vision. He argues the second one fits how economies actually work.",
      },
      {
        thinker: "Friedman",
        title: "No price, no signal",
        body: "Friedman argued that planners lack the price signal that coordinates millions of daily decisions. A memo can say “more shoes.” It cannot cheaply say how many, in which town, instead of which other good, this week.",
      },
      {
        thinker: "Sowell",
        title: "The knowledge is scattered",
        body: "The knowledge problem: the facts needed to run production sit in many heads and go stale fast. A board cannot collect them all in time. Sowell returns to this again and again — intentions at the top are not the same as knowledge on the spot.",
      },
      {
        thinker: "Friedman",
        title: "The state as boss, and as spender",
        body: "Friedman sorted spending into four boxes. The least careful box is spending somebody else’s money on somebody else. A public firm lives in that box. When that same state is the main employer, exit and speech get expensive: the paycheck and the criticism sit in one office. Quitting or publishing a complaint can cost the job.",
      },
      {
        thinker: "Sowell",
        title: "The shortage hits the kitchen",
        body: "A missed plan is not only a chart. It is an empty shelf in an ordinary home — no bread, no shoes, a line before school. Sowell’s rule is that intentions are not outcomes. A speech about fair shares does not cook dinner. When goods are scarce and prices cannot move, connections decide who gets what is left. That is political allocation, not a market.",
      },
    ],
    claims: [
      "Advocates say private profit leaves needs unmet and fortunes too unequal.",
      "They say society should own major industry so production serves use, not only owners.",
      "They say a democratic government can plan fair shares without becoming a police state.",
    ],
    tradeoffs: [
      "Households eat the mistake. A warehouse of the wrong good means a parent comes home with nothing.",
      "Scarce goods go to people with political connections, not to whoever shows a price. Favoritism fills the gap a market price would have filled.",
      "Where a party-state also seized grain and punished farmers who kept food — Soviet Ukraine, 1932–33, the Holodomor — the shortage became a famine. That is a historical command case, taught again under communism. It is not Denmark, and it is not Britain’s elected nationalizations.",
    ],
    checks: [
      {
        id: "soc-own",
        prompt: "In this class definition, who owns the major factories under socialism?",
        options: [
          "The public, usually through the state",
          "Private shareholders competing to buy them",
          "Nobody works, so ownership does not matter",
          "Only foreign companies",
        ],
        correctIndex: 0,
        why: "Socialism here means social ownership of the major means of production. High taxes plus private ownership is a different arrangement — a mixed market economy.",
      },
      {
        id: "soc-knowledge",
        prompt: "A capital office sets Creekville’s shoe output with no local prices. Which idea fits best?",
        options: [
          "Sowell’s knowledge problem",
          "A price signal clearing the market",
          "Crony capitalism as the definition of free enterprise",
          "Friedman claiming planners know every street",
        ],
        correctIndex: 0,
        why: "The facts about fit, weather, and taste are local and changing. Sowell argues a distant plan cannot hold that knowledge. That gap is the knowledge problem.",
      },
    ],
  },
  {
    id: "communism",
    name: "Communism",
    short: "Party-state command in practice; classless ideal on paper",
    owns: "In the ideal Karl Marx described, classes and the state fade, and production is shared. In the states that ruled under that name, the party-state owned almost all production.",
    prices: "A central plan sets quotas. Households meet a ration list more often than a menu of prices that clear. Money may exist, but it does not steer production the way a market price does.",
    incentives: "“From each according to ability, to each according to need” is the slogan. In practice, rations and posts are assigned. Extra care rarely becomes extra property.",
    definition:
      "Say both parts. The idea: a classless society with common ownership and no state forcing people. The historical system: a one-party state that abolished most private business and ran a command economy. This course judges the system people actually lived under, and it still states the idea fairly.",
    understandings: [
      {
        thinker: "Sowell",
        title: "Intentions are not outcomes",
        body: "Ending “exploitation” on a poster did not fill shops or protect speech. Sowell insists on outcomes. Parties promised equality. Households got chronic shortage, and under command campaigns they got famine: the Holodomor in Soviet Ukraine (1932–33) and China’s Great Leap Forward (1958–62). The intention did not keep the farmer’s grain in the house.",
      },
      {
        thinker: "Friedman",
        title: "No owner, thin care",
        body: "If no person may own the factory, no person has both the local knowledge and the personal stake to keep it serving customers. Friedman’s spending line applies with force: the authority is spending everyone’s resources on everyone’s assigned needs.",
      },
      {
        thinker: "Sowell",
        title: "No exit: one party holds the doors",
        body: "The same party holds the job, the shop, the newspaper, and the police. Sowell treats that as a fact about power. A family cannot switch employers, print a rival paper, or vote the plan out. Closed borders make “just leave” a crime. Secret police and prison camps — the Soviet Gulag is the plain example — were how these party-states enforced obedience. That repression is a feature of the system, not a random cruel mood.",
      },
      {
        thinker: "Friedman",
        title: "Innovation is a bet",
        body: "A new product can fail. Bets need someone who gains if the bet is right and loses if it is wrong. A ministry that cannot go bankrupt keeps weak projects alive and can bury odd ones that would have found buyers.",
      },
      {
        thinker: "Sowell",
        title: "Equality of result is a trade-off",
        body: "A command system can compress official incomes. Sowell’s constrained vision asks what else moves: effort, truth-telling, and the goods people can actually get. A high equality score beside empty shelves is not a solved problem.",
      },
    ],
    claims: [
      "Advocates say private property in production divides society into classes and exploits workers.",
      "They say a plan can aim output at need instead of at profit.",
      "They say the end stage is a classless, stateless community. Parties that took power said the state was a temporary tool to get there.",
    ],
    tradeoffs: [
      "The “temporary” party-state did not fade. Speech, the press, leaving the country, and competing for office stayed shut. Secret police made dissent dangerous.",
      "A plan can raise steel tonnage while a family waits for shoes. Official pay looks equal. Party stores and special lists are not.",
      "Command famines were results of policy. Grain seizures and forced collectivization led to the Holodomor. The Great Leap took food for quotas while families starved. State that as history, in plain words. It is not a joke, and it is not a high-tax market economy.",
    ],
    checks: [
      {
        id: "com-practice",
        prompt: "What did countries that called themselves communist in the 20th century usually have?",
        options: [
          "A one-party state and a command economy that abolished most private production",
          "Competitive private firms and open multi-party elections",
          "No government at all, the final stage Marx hoped for",
          "Only high taxes, with private ownership left in place",
        ],
        correctIndex: 0,
        why: "The ideal and the practice differ. Historical communist states were party-states with command economies. High-tax market countries are not that system.",
      },
      {
        id: "com-incentive",
        prompt: "Your crew works carefully or carelessly, and the ration stays the same. Friedman would point to what?",
        options: [
          "Incentives: people do not treat a common pile as carefully as their own",
          "Prices being too free",
          "Too much consumer choice",
          "A crony bakery license",
        ],
        correctIndex: 0,
        why: "Friedman: nobody spends somebody else’s money — or guards a common ration — as carefully as his own. Flat rewards flatten care. That is not the same as calling workers cruel.",
      },
    ],
  },
];

export function systemById(id: SystemId): SystemModule {
  const found = SYSTEMS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown system ${id}`);
  return found;
}

export function isUnlocked(id: SystemId, passed: readonly SystemId[], teacherOpen: boolean): boolean {
  if (teacherOpen || id === "capitalism") return true;
  if (id === "socialism") return passed.includes("capitalism");
  return passed.includes("socialism");
}

export const DIMENSIONS: readonly Dimension[] = [
  {
    id: "ownership",
    label: "Ownership",
    capitalism: "Private owners hold factories, farms, and shops. They can sell, and rivals can enter.",
    socialism: "The public owns the major means of production. Personal belongings can remain private.",
    communism: "The party-state owns production in practice. The paper ideal is common ownership with no state.",
    insight: "Who owns the place decides who feels the loss. Friedman’s care-in-spending point starts here.",
    thinker: "Friedman",
  },
  {
    id: "prices",
    label: "Prices",
    capitalism: "Buyers and sellers set prices. A move in price retargets production without a memo.",
    socialism: "Boards and laws set many prices and quotas. They update slowly, if at all.",
    communism: "The plan sets quotas. Ration lists replace a menu of clearing prices.",
    insight: "A price is a signal about scarcity. Without it, Sowell’s knowledge problem shows up as lines and leftovers.",
    thinker: "Friedman",
  },
  {
    id: "incentives",
    label: "Incentives",
    capitalism: "Profit, loss, and the chance to switch jobs reward useful work and punish waste.",
    socialism: "Leveling pay and spending public funds weakens the link between care and reward.",
    communism: "The ration often stays put whether the extra hour was careful. Assigned posts limit exit.",
    insight: "Sowell: incentives change what people do. Intentions in the speech do not replace that.",
    thinker: "Sowell",
  },
  {
    id: "innovation",
    label: "Innovation",
    capitalism: "Someone can fund a bet, keep the gain, or eat the loss. Failed bets stop.",
    socialism: "A public lab can invent. Turning the invention into a product people may reject is harder.",
    communism: "Ideas go up to a ministry. There is no private firm to try an odd product and go broke.",
    insight: "Friedman treated innovation as a bet that needs an upside and a downside, not only a filing cabinet.",
    thinker: "Friedman",
  },
  {
    id: "power",
    label: "Political power",
    capitalism: "Economic power is split across owners. You can often work, buy, and publish outside one office.",
    socialism: "Major production sits with the state. A democracy can still vote the government out; the bottleneck is real.",
    communism: "One party holds the plan, the job, the paper, and the police. Exit is the thing people lack.",
    insight: "Sowell: putting economic power and political power in the same hands removes an ordinary person’s exit.",
    thinker: "Sowell",
  },
  {
    id: "inequality",
    label: "Inequality claims",
    capitalism: "Advocates admit incomes spread out. They point to higher typical living standards over time.",
    socialism: "Advocates promise a fairer share by owning industry together. The trade-off is weaker production signals.",
    communism: "Official pay can look very equal. Goods, apartments, and party access often are not.",
    insight: "Sowell: equality of result is a trade-off, not a free upgrade. Ask what happens to output and freedom.",
    thinker: "Sowell",
  },
  {
    id: "outcomes",
    label: "Historical outcomes",
    capitalism: "Market societies — West Germany after 1948, South Korea, Hong Kong — posted large gains in living standards and choices.",
    socialism: "Price controls and takeovers, as in Venezuela, emptied household shelves. Connections, not prices, decided who got what was left.",
    communism: "Soviet and Maoist party-states used closed borders, secret police, camps, and famines under command campaigns. Market reforms later raised living standards where they were allowed.",
    insight: "Judge outcomes beside intentions. Friedman and Sowell both ask you to look at shelves, exit, and growth — not only at the label on the poster.",
    thinker: "Sowell",
  },
];

export const EXAMPLES: Record<SystemId, readonly ExampleCard[]> = {
  capitalism: [
    {
      era: "Classic",
      title: "West Germany, 1948",
      body: "After the war, price controls left shops empty. Ludwig Erhard let prices move and stabilized the currency. Goods came back to the shelves quickly. Milton Friedman often used this as a picture of prices doing the coordinating work a board had failed to do.",
    },
    {
      era: "Classic",
      title: "Hong Kong in the mid-20th century",
      body: "A small port with little land and few natural resources grew rich through trade, private firms, and light regulation. Friedman treated it as evidence that rules of free enterprise matter more than a treasure chest of resources.",
    },
    {
      era: "Modern",
      title: "United States, Singapore, Switzerland",
      body: "Private ownership and market prices do most of the work of deciding output. All three tax, regulate, and fund some public services. They are market economies with government, not socialist ownership of industry, and not a crony-free fairy tale either.",
    },
    {
      era: "Modern",
      title: "South Korea beside North Korea",
      body: "Same peninsula, split systems. The South used private firms, trade, and prices and became a high-income society. The North stayed a command party-state and stayed poor. The pair is the cleanest modern comparison this course uses.",
    },
  ],
  socialism: [
    {
      era: "Classic",
      title: "Britain’s nationalizations, 1945–1951",
      body: "A democratic government took coal, rail, the Bank of England, and other industries into public ownership. It was not a police state. Later governments sold many of those industries. The experiment is real socialism in the ownership sense, inside a free election system, with a mixed record.",
    },
    {
      era: "Classic",
      title: "Yugoslavia’s worker self-management",
      body: "Firms were socially owned, with workers’ councils and some market exchange between them. Consumer goods beat the Soviet pattern for a while. Political monopoly and weak property rights remained. The system ended in crisis, debt, and breakup.",
    },
    {
      era: "Modern",
      title: "Venezuela’s Bolivarian project",
      body: "Leaders called the project socialist: nationalizations, especially in oil, and widespread price controls. Shelves emptied, real incomes fell, and millions left. Oil prices moved, and policy still explains the shortages — a lower oil price does not by itself forbid a shop from changing a price. Why this is dangerous: empty shelves hit ordinary kitchens, and scarce goods and jobs tracked political loyalty.",
    },
    {
      era: "Modern",
      title: "Do not file the Nordics under socialism",
      body: "Sweden, Denmark, and Norway have private companies, market prices, and open trade, plus high taxes and large welfare states. They got rich as market economies. Universal health care does not make a country Soviet. Sowell and Friedman both warned against that mix-up. Label them mixed, or social-democratic welfare states — not command socialism.",
    },
  ],
  communism: [
    {
      era: "Classic",
      title: "The Soviet Union after 1928",
      body: "Five-year plans and collectivization put output under the party. Heavy industry grew. Consumer goods stayed short. The famine in Ukraine in 1932–33, the Holodomor, followed grain seizures and forced collectivization and killed millions. The Gulag — a system of prison camps — and the secret police were how the one party kept power. Why this is dangerous: the same office owned the job, the food, and the right to leave.",
    },
    {
      era: "Classic",
      title: "China before the market reforms",
      body: "The Great Leap Forward (1958–1962) was a command campaign for steel and grain. Local officials reported fake harvests. Quotas still took the food. Famine killed tens of millions of people in their own villages. The Cultural Revolution added political terror. Why this is dangerous: Sowell’s line lands here — the intention was catching up and equality, and the outcome was starvation.",
    },
    {
      era: "Modern",
      title: "North Korea and Cuba",
      body: "North Korea is a hereditary party-state with a command economy, closed borders, and political prison camps. Living standards stay far below South Korea, which uses markets and private firms. Cuba is a one-party state: most major production is still state-directed, with a long rationing system and punishment for independent politics. Why this is dangerous: a family cannot freely leave, and the party holds the job, the shop, and the police.",
    },
    {
      era: "Modern",
      title: "China and Vietnam after they allowed markets",
      body: "After 1978 in China, and Đổi Mới in Vietnam (1986), communist parties kept political control but allowed private business and market prices. Living standards rose with those reforms. Today’s China is a party-state with a large market sector — state-directed and mixed — not textbook communism and not free-enterprise capitalism. Refrigerators arrived. Open political competition did not.",
    },
  ],
};

export const MIXED_NOTE =
  "Most real countries are mixed. Use the ownership test: if private people own the factories and prices move with buyers, you are looking at a market economy even when taxes are high. If a party-state owns production and issues quotas, you are looking at command communism. Crony capitalism is a third miss — private labels, public favors.";
