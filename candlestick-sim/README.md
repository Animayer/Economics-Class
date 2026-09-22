# Candlestick Pattern Board

Projector-ready classroom board for **Battery Creek High School** 10th-grade Economics (MarketWatch / beginning traders).

Students learn how to read one candlestick — open, high, low, close — and how to recognize a short list of beginner patterns. The teacher drives the board. There is no login, no backend, and no live market data. Every price path is made up.

## Run locally

```bash
cd candlestick-sim
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. Full-screen the browser on the board (`F11`).

Production-style static build:

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. Paths are relative (`base: './'`), so the folder can live in a subpath.

```bash
npm test
```

## How GitHub Pages serves it

This repo already publishes two apps on one site:

- inflation-sim at the root: `https://animayer.github.io/Economics-Class/`
- constitution-sim in a folder: `https://animayer.github.io/Economics-Class/constitution-sim/`

This app is a third folder on that same site:

`https://animayer.github.io/Economics-Class/candlestick-sim/`

The workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) builds all three apps, copies `inflation-sim/dist` to the site root, and copies the other two builds into `constitution-sim/` and `candlestick-sim/`. The inflation URL does not move.

## On the board (teacher)

1. Open the class URL full-screen.
2. Start in **Anatomy** if the class has not met a candle yet. Tap a part — body, wick, open, high, low, close — or use the chips. Flip the candle, stretch a wick, or load a shape (hammer, doji, marubozu) and read the plain-English line.
3. **Teach** is the default. Pick a pattern from the rail. The chart starts on the setup. Press **Next candle** so the class sees the pattern print. Hide labels (`L`) before you ask “what is this?” Hide notes (`N`) too, or the script gives the name away.
4. **Compare** puts a pair side by side: bullish vs bearish engulfing, hammer vs hanging man, and the other lookalikes.
5. **Quiz** shows a random unlabeled chart and four names. The class score stays on this screen only. No accounts. Morning star and evening star stay out of the quiz until you check the box.

Companies on the board — MAYER CO, CREEK MFG, CLASS INC, and the others — are **not real stocks**.

## Keyboard

| Key | What it does |
| --- | --- |
| `A` `T` `C` `Q` | Anatomy, Teach, Compare, Quiz |
| `P` | Green/red or teal/coral (coral candles are also striped) |
| `←` `→` or Space | Previous / next candle in Teach and Compare |
| `L` | Show or hide pattern names and the gold highlight |
| `N` | Show or hide the teacher-notes panel (Teach) |
| `R` | Replay the candles from day 1 |
| `V` | Show or hide volume bars |
| `1`–`9` | Jump to a pattern in Teach |
| `F` `G` | Dragonfly and gravestone dojis |
| `M` `E` | Morning star and evening star (next-step, 3 candles) |
| `1`–`6` | Switch comparison pairs |
| `1`–`4` | Answer the quiz, then Space for the next chart |

While names are covered, the rail becomes a number pad. **Hold “peek names”** if you need the list back for a second. The chart title stays covered until you press `L`.

## Patterns

1. **Engulfing** — bullish (`1`) and bearish (`2`)
2. **Hammer** (`3`) and **Hanging Man** (`4`) — same drawing; the trend before it picks the name
3. **Doji** (`5`), plus **Dragonfly** (`F`) and **Gravestone** (`G`)
4. **Shooting Star** (`6`)
5. **Spinning Top** (`7`)
6. **Marubozu** — bullish (`8`) and bearish (`9`)
7. **Morning Star** (`M`) and **Evening Star** (`E`) — labeled “next step” for after the one- and two-candle patterns

Volume is off by default so day 1 stays quiet. Turn it on when you want to mention that the pattern day is often a heavier bar. Heavier volume is still only a clue.

## Projector tips

- Use the classroom display in full screen. Candles are drawn large on purpose.
- Teach mode opens on the **setup**, not the finished pattern. One click of **Next candle** reveals the lesson.
- Hide notes, then hide labels, then ask the class. Press `L` to put the name and the gold bracket back.
- If red and green are hard to tell apart from the back row, press `P` for teal and coral.
- Patterns are **clues**, not guarantees. The notes say that on every pattern. This board is not trading advice and not a homework assignment.

## Project layout

```
candlestick-sim/
  src/lib/candles.ts     # OHLC math and pattern checks (isHammer, isBullishEngulfing, …)
  src/lib/generate.ts    # synthetic daily bars that are built to pass those checks
  src/lib/patterns.ts    # names, shortcuts, and the teaching script
  src/lib/quiz.ts        # four-choice questions
  src/components/        # anatomy, teach, compare, quiz, SVG chart
  src/test/              # detectors must agree with the candles on the board
```
