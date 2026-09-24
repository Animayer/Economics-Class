# Economic Systems

Classroom simulation for **Battery Creek High School** 10th-grade Economics. Students compare **capitalism, socialism, and communism**: who owns production, how prices get set, and what incentives do.

The stance is pro-free-enterprise. Prices, property, and voluntary exchange are treated as the engines of prosperity and freedom, in the spirit of **Milton Friedman** and **Thomas Sowell**. Claims of the other systems are stated fairly. Conclusions favor competitive markets on growth, consumer choice, and political freedom.

Standing rule on every hub visit: **crony privilege is not free enterprise.**

No accounts, no backend, no tracking. Progress (checks, quiz best, recent sim runs) stays in `localStorage` on that device.

## Run locally

```bash
cd economic-systems-sim
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL.

Production-style static build:

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. Paths are relative (`base: './'`), so the folder can live in a subpath or on a thumb drive after the page has loaded (fonts fall back if the network is down).

```bash
npm test
```

## How GitHub Pages serves it

This repo already publishes:

- inflation-sim at the root: `https://animayer.github.io/Economics-Class/`
- constitution-sim: `https://animayer.github.io/Economics-Class/constitution-sim/`
- candlestick-sim: `https://animayer.github.io/Economics-Class/candlestick-sim/`

This app is a fourth folder on that same site:

`https://animayer.github.io/Economics-Class/economic-systems-sim/`

The workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) builds each app and copies this one into `economic-systems-sim/`. The inflation URL does not move.

## One class period

1. Open the class URL. Read the standing rule on the hub (crony ≠ free enterprise).
2. **Learn → Capitalism.** Three facts (ownership, prices, incentives), the Friedman/Sowell cards, then the two-question check.
3. **Compare → Prices**, then **Incentives**. Leave the table up while students argue.
4. **Simulate.** Run capitalism for five rounds: follow the high price most rounds, take one crony license so the pocket-versus-town split is visible. If time, run socialism with “bonus for the longest line,” then open the debrief table.
5. **Examples.** South Korea beside North Korea. Denmark is a high-tax market economy, not command socialism. China after 1978 is a party-state with markets, not either pure label.
6. **Quiz** if minutes remain (15 questions, score on screen, retry). Otherwise assign it for the last ten minutes tomorrow.

Keys: `H` hub, `L` learn, `C` compare, `S` simulate, `E` examples, `Q` quiz. In Learn, `1`–`3` switch an unlocked system. In the sim and the quiz, `1`–`4` pick a choice.

Deep links: `?mode=learn&system=capitalism`, `?mode=compare`, `?mode=simulate&system=socialism`, `?mode=examples&system=communism`, `?mode=quiz`.

Teacher unlock on the hub opens socialism and communism before the checks. It is stored only on that browser.

## Project layout

```
economic-systems-sim/
  src/lib/content.ts    # modules, comparison rows, examples
  src/lib/simulate.ts   # five-round town model
  src/lib/quiz.ts       # self-quiz
  src/components/       # hub, learn, compare, simulate, examples, quiz
  src/test/             # model outcomes, labels, routes
```
