export type PatternId =
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "hammer"
  | "hanging-man"
  | "doji"
  | "dragonfly"
  | "gravestone"
  | "shooting-star"
  | "spinning-top"
  | "bullish-marubozu"
  | "bearish-marubozu"
  | "morning-star"
  | "evening-star";

export type Bias = "bullish" | "bearish" | "indecision";

export type PatternInfo = {
  id: PatternId;
  name: string;
  shortName: string;
  family: string;
  /** Projector key. Digits and letters. Null if the pattern is click-only. */
  shortcut: string | null;
  advanced: boolean;
  bias: Bias;
  candleCount: 1 | 2 | 3;
  looksLike: string;
  oftenSignals: string;
  lookNext: string;
  callout: string;
  quizWhy: string;
};

export const SHARED_CAVEAT =
  "A pattern is a clue, not a crystal ball. It does not guarantee what happens next. Always look at the trend before it.";

export const CLASS_LINE = "Battery Creek High School · 10th Grade Economics";

export const PATTERNS: PatternInfo[] = [
  {
    id: "bullish-engulfing",
    name: "Bullish Engulfing",
    shortName: "Bull engulfing",
    family: "Engulfing",
    shortcut: "1",
    advanced: false,
    bias: "bullish",
    candleCount: 2,
    looksLike:
      "Two candles. The first is red, close under the open. The second is green, and its body completely covers the red body. The green candle is the bigger one.",
    oftenSignals:
      "After a drop, buyers had a strong day and erased the prior day's body. That can be a clue the drop is tiring. It is not a promise of a rise.",
    lookNext:
      "Check the days before these two. A bullish engulfing means more after a slide than in the middle of a quiet chart.",
    callout: "The green body swallows the red body.",
    quizWhy:
      "The second candle is green and its body covers the whole red body before it. That is a bullish engulfing: a clue buyers showed up after a drop, not a guarantee.",
  },
  {
    id: "bearish-engulfing",
    name: "Bearish Engulfing",
    shortName: "Bear engulfing",
    family: "Engulfing",
    shortcut: "2",
    advanced: false,
    bias: "bearish",
    candleCount: 2,
    looksLike:
      "Two candles. The first is green. The second is red, and its body completely covers the green body.",
    oftenSignals:
      "After a climb, sellers had a strong day and erased the prior day's body. A clue the climb may be tiring. Not a reason to bet money on it.",
    lookNext: "Look at the rise before these two days. The path into the pattern is part of the lesson.",
    callout: "The red body swallows the green body.",
    quizWhy:
      "The second candle is red and its body covers the whole green body before it. That is a bearish engulfing. Read the climb that came first.",
  },
  {
    id: "hammer",
    name: "Hammer",
    shortName: "Hammer",
    family: "Hammer family",
    shortcut: "3",
    advanced: false,
    bias: "bullish",
    candleCount: 1,
    looksLike:
      "One candle with a small body near the top and a long lower wick, about twice the body or more. Almost no upper wick. Picture a hammer: a small head and a long handle.",
    oftenSignals:
      "After a drop, price was pushed down and then bought back before the close. That can be a clue the selling is slowing. See if the next days agree.",
    lookNext:
      "The same drawing after a rise is a hanging man, not a hammer. Name the trend before you name the candle.",
    callout: "Long lower wick after a drop. The close was bought back up.",
    quizWhy:
      "Small body on top, long wick underneath, and the days before were falling. That is a hammer. The same shape at the top of a rise would be a hanging man.",
  },
  {
    id: "hanging-man",
    name: "Hanging Man",
    shortName: "Hanging man",
    family: "Hammer family",
    shortcut: "4",
    advanced: false,
    bias: "bearish",
    candleCount: 1,
    looksLike:
      "The same drawing as a hammer: small body near the top, long lower wick, tiny upper wick. The difference is the location.",
    oftenSignals:
      "After a rise, the long lower wick shows price sagged during the day. Some readers treat that as a warning the rise is shaky. Many people wait for the next day before they trust it.",
    lookNext: "If this shape sits at the bottom of a drop, call it a hammer. Location changes the name.",
    callout: "Same shape as a hammer, sitting after a rise.",
    quizWhy:
      "The candle looks like a hammer, but the days before were rising. At the top of a climb that shape is a hanging man. Context is the whole point.",
  },
  {
    id: "doji",
    name: "Doji",
    shortName: "Doji",
    family: "Doji family",
    shortcut: "5",
    advanced: false,
    bias: "indecision",
    candleCount: 1,
    looksLike:
      "Open and close are almost the same price, so the body is a thin line. Wicks can stick out above and below.",
    oftenSignals:
      "Buyers and sellers fought to a draw. That is indecision. A doji does not tell you which way the next day will go.",
    lookNext:
      "Ask what happened before it. After a strong run, a doji can mean the move is stalling. In a quiet stretch, it may mean very little.",
    callout: "Open and close nearly match. Neither side won the day.",
    quizWhy:
      "The body is just a line, with wicks on both sides. Open and close are almost equal. That is a standard doji: indecision, not a direction.",
  },
  {
    id: "dragonfly",
    name: "Dragonfly Doji",
    shortName: "Dragonfly",
    family: "Doji family",
    shortcut: "F",
    advanced: false,
    bias: "indecision",
    candleCount: 1,
    looksLike:
      "A doji that looks like the letter T. Open, close, and high are nearly the same. The lower wick is long.",
    oftenSignals:
      "Price was knocked down and came all the way back by the close. After a drop, some readers see a possible bounce clue. It is still just a clue.",
    lookNext:
      "This is part of the doji family. A hammer has a small real body. A gravestone is the upside-down version of this T.",
    callout: "A T shape. Price fell, then closed back at the high.",
    quizWhy:
      "Almost no body, and the wick points down. Open and close sit at the top. That is a dragonfly doji. A hammer still has a visible body, so this is not one.",
  },
  {
    id: "gravestone",
    name: "Gravestone Doji",
    shortName: "Gravestone",
    family: "Doji family",
    shortcut: "G",
    advanced: false,
    bias: "indecision",
    candleCount: 1,
    looksLike:
      "A doji that looks like an upside-down T. Open, close, and low are nearly the same. The upper wick is long.",
    oftenSignals:
      "Price was pushed up and came all the way back. After a rise, some readers see a warning. Not a sure outcome.",
    lookNext:
      "Compare it with a shooting star, which has a small real body and a long upper wick, and with a dragonfly doji.",
    callout: "An upside-down T. Price rose, then closed back at the low.",
    quizWhy:
      "Almost no body, and the wick points up. Open and close sit at the bottom. That is a gravestone doji. A shooting star still has a small body you can see.",
  },
  {
    id: "shooting-star",
    name: "Shooting Star",
    shortName: "Shooting star",
    family: "One-candle clues",
    shortcut: "6",
    advanced: false,
    bias: "bearish",
    candleCount: 1,
    looksLike:
      "A small body near the low of the day and a long upper wick. Almost no lower wick. It shows up after a rise.",
    oftenSignals:
      "Buyers tried to push higher, but the close came back down near the open. A clue the climb is struggling.",
    lookNext:
      "Do not mix it up with a hammer. A hammer's long wick is underneath, and it usually comes after a drop. A gravestone doji is similar but has almost no body.",
    callout: "Long upper wick after a rise. The close gave back the push.",
    quizWhy:
      "Small body, long wick on top, and the days before were rising. That is a shooting star. A hammer's long wick is on the bottom.",
  },
  {
    id: "spinning-top",
    name: "Spinning Top",
    shortName: "Spinning top",
    family: "One-candle clues",
    shortcut: "7",
    advanced: false,
    bias: "indecision",
    candleCount: 1,
    looksLike:
      "A small body with wicks on both sides that are roughly the same length. The body is bigger than a doji, but still small.",
    oftenSignals:
      "A tug-of-war. Neither side got a strong close. Indecision, a step noisier than a doji.",
    lookNext:
      "Set it next to a doji (almost no body) and a marubozu (almost no wick). Those three run from “nobody won” to “one side owned the day.”",
    callout: "Small body, wicks both ways. A tug-of-war.",
    quizWhy:
      "The body is small but real, and both wicks are long. That is a spinning top. A doji would have almost no body at all.",
  },
  {
    id: "bullish-marubozu",
    name: "Bullish Marubozu",
    shortName: "Bull marubozu",
    family: "Marubozu",
    shortcut: "8",
    advanced: false,
    bias: "bullish",
    candleCount: 1,
    looksLike:
      "A tall green body. The open is near the low and the close is near the high. Almost no wicks.",
    oftenSignals:
      "Buyers were in control from the open to the close. That is strong conviction for that one day. Conviction is not a forecast.",
    lookNext: "Check the days before. One strong green day can be the middle of a move or the end of one.",
    callout: "Almost no wicks. Buyers held the day from start to finish.",
    quizWhy:
      "A tall green body with almost no wicks. Open near the low, close near the high. That is a bullish marubozu: one side owned the day.",
  },
  {
    id: "bearish-marubozu",
    name: "Bearish Marubozu",
    shortName: "Bear marubozu",
    family: "Marubozu",
    shortcut: "9",
    advanced: false,
    bias: "bearish",
    candleCount: 1,
    looksLike:
      "A tall red body. The open is near the high and the close is near the low. Almost no wicks.",
    oftenSignals: "Sellers were in control all day. Strong conviction for that day only.",
    lookNext: "Same lesson as the green marubozu, in the other direction. Read the path that led here.",
    callout: "Almost no wicks. Sellers held the day from start to finish.",
    quizWhy:
      "A tall red body with almost no wicks. Open near the high, close near the low. That is a bearish marubozu.",
  },
  {
    id: "morning-star",
    name: "Morning Star",
    shortName: "Morning star",
    family: "Next step · 3 candles",
    shortcut: "M",
    advanced: true,
    bias: "bullish",
    candleCount: 3,
    looksLike:
      "Three candles after a drop. A long red candle, then a small candle (the star), then a long green candle that closes back up into the red candle's body.",
    oftenSignals:
      "Selling paused, then buyers answered. A possible turn up. Learn the one- and two-candle patterns first. This is a next step.",
    lookNext:
      "You need the drop before the three days. Without that drop, they are just three candles. The small middle candle is the pause.",
    callout: "Big red, a small pause, then a strong green close.",
    quizWhy:
      "Three parts after a drop: a long down day, a small star, and a green day that closes well into the first body. That is a morning star. Still a clue, not a promise.",
  },
  {
    id: "evening-star",
    name: "Evening Star",
    shortName: "Evening star",
    family: "Next step · 3 candles",
    shortcut: "E",
    advanced: true,
    bias: "bearish",
    candleCount: 3,
    looksLike:
      "Three candles after a rise. A long green candle, a small star, then a long red candle that closes back down into the green body.",
    oftenSignals:
      "Buying paused, then sellers answered. A possible turn down. Still a clue. This is the mirror of the morning star.",
    lookNext: "Look for the rise before it. Then compare it with a bearish engulfing, which is only two candles.",
    callout: "Big green, a small pause, then a strong red close.",
    quizWhy:
      "Three parts after a rise: a long up day, a small star, and a red day that closes well into the first body. That is an evening star.",
  },
];

export const PATTERN_GROUPS: { label: string; hint: string; ids: PatternId[] }[] = [
  {
    label: "Engulfing",
    hint: "Two candles. The second body covers the first.",
    ids: ["bullish-engulfing", "bearish-engulfing"],
  },
  {
    label: "Hammer family",
    hint: "Same drawing. The trend picks the name.",
    ids: ["hammer", "hanging-man"],
  },
  {
    label: "Doji family",
    hint: "Open and close almost match.",
    ids: ["doji", "dragonfly", "gravestone"],
  },
  {
    label: "More one-candle clues",
    hint: "Star, tug-of-war, and full-body days.",
    ids: ["shooting-star", "spinning-top", "bullish-marubozu", "bearish-marubozu"],
  },
  {
    label: "Next step · 3 candles",
    hint: "Advanced for beginners. Learn these after the pairs.",
    ids: ["morning-star", "evening-star"],
  },
];

export type ComparePair = {
  id: string;
  title: string;
  prompt: string;
  coveredPrompt: string;
  left: PatternId;
  right: PatternId;
  advanced?: boolean;
};

export const COMPARE_PAIRS: ComparePair[] = [
  {
    id: "engulfing",
    title: "Engulfing",
    prompt: "Same idea, opposite direction. The second body swallows the first.",
    coveredPrompt: "Which side is the bullish engulfing?",
    left: "bullish-engulfing",
    right: "bearish-engulfing",
  },
  {
    id: "hammer-hanging",
    title: "Hammer vs Hanging Man",
    prompt: "Same shape. The trend before it changes the name.",
    coveredPrompt: "Which side is the hammer, and which is the hanging man?",
    left: "hammer",
    right: "hanging-man",
  },
  {
    id: "marubozu",
    title: "Marubozu",
    prompt: "Almost no wicks. The body shows who controlled the whole day.",
    coveredPrompt: "Which side did buyers control, and which side did sellers control?",
    left: "bullish-marubozu",
    right: "bearish-marubozu",
  },
  {
    id: "doji-ends",
    title: "Dragonfly vs Gravestone",
    prompt: "Both are dojis. One wick points down. One wick points up.",
    coveredPrompt: "Which doji is the dragonfly, and which is the gravestone?",
    left: "dragonfly",
    right: "gravestone",
  },
  {
    id: "wick-ends",
    title: "Hammer vs Shooting Star",
    prompt: "Small body, one long wick. The wick is on opposite ends, and the trend is too.",
    coveredPrompt: "Which candle has the long wick underneath?",
    left: "hammer",
    right: "shooting-star",
  },
  {
    id: "stars",
    title: "Morning Star vs Evening Star",
    prompt: "Three candles. A push, a pause, then a turn the other way. Next-step patterns.",
    coveredPrompt: "Which three-candle pattern comes after a drop?",
    left: "morning-star",
    right: "evening-star",
    advanced: true,
  },
];

export function getPattern(id: PatternId): PatternInfo {
  const found = PATTERNS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown pattern: ${id}`);
  return found;
}

export function patternByShortcut(key: string): PatternInfo | undefined {
  const normalized = key.length === 1 ? key.toUpperCase() : key;
  return PATTERNS.find((p) => p.shortcut === normalized);
}

export function teachingBullets(pattern: PatternInfo): { label: string; text: string }[] {
  return [
    { label: "What it looks like", text: pattern.looksLike },
    { label: "What it often signals", text: pattern.oftenSignals },
    { label: "What to look at next", text: pattern.lookNext },
    { label: "Keep it honest", text: SHARED_CAVEAT },
  ];
}
