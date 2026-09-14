# SPCX Paper Trading Lab

Interactive classroom simulation for **Ryan Mayer’s 10th-grade Economics** at Battery Creek High School (SC). Students paper-trade **NASDAQ: SPCX** (Space Exploration Technologies Corp. / SpaceX) using real daily prices from the June 12, 2026 IPO through the latest bundled close.

No login. No brokerage. No student PII. Fake cash only.

**Live class URL:** https://animayer.github.io/Economics-Class/spacex-sim/

## Teacher how-to (today)

Open the live URL full-screen on the board (`F11`). Leave **Board mode** on. Start on the intro slide (IPO vs secondary market, what a share is, paper-only disclaimer), then hit **Start the lesson**. Default timeline is the August turn through the latest close (the bounce, failed bounce, and breakout); play it day-by-day and pause on the gold markers. Ask a volunteer to **Buy** a fractional slice (default spend $2,500 of $10,000) at a close they can defend, then keep walking. At the next signal card, ask whether a cautious swing trader would **enter / wait / take profit / stop** — turn **Answer key** on only after students talk. Finish on **Compare paths**: their book vs buy-and-hold from the window start vs the documented rules robot. Students fill the **decision journal** (thesis, invalidation, metric, emotion) and print or download `.txt` before they leave. **Reset all** between sections. This is education, not advice; past ≠ future.

## Run locally

```bash
cd spacex-sim
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL.

Production-style static build:

```bash
npm test
npm run build
npm run preview
```

`npm run build` writes `dist/`. Paths are relative (`base: './'`), so the folder can live under GitHub Pages as `/spacex-sim/`.

## How GitHub Pages serves it

This repo already publishes **inflation-sim at the Pages root**:

`https://animayer.github.io/Economics-Class/`

This lab is a **sibling folder**, same pattern as constitution-sim:

`https://animayer.github.io/Economics-Class/spacex-sim/`

The workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) builds all three apps and publishes the assembled `site/` folder to `gh-pages`.

## Refresh the price history

The app **always runs from bundled JSON** (`public/data/spcx-history.json`) so a Chromebook with a flaky network still works. It also *tries* a live Yahoo Finance fetch; browsers usually block that (CORS), so the stamp on screen will say bundled.

On a teacher laptop with internet:

```bash
cd spacex-sim
python3 scripts/refresh-data.py
```

That overwrites the JSON with a new `asOf` / `fetchedAt` stamp. Commit it if you want class to see a newer week. Spot-check a couple of dates against [Yahoo SPCX history](https://finance.yahoo.com/quote/SPCX/history/) or Nasdaq before you project.

Do **not** swap in TSLA or any other ticker. The lesson is locked to **SPCX**.

## On the board

1. Intro slide, then the August turn (Aug 4 → latest). Switch to **Since IPO** if you want the June pop and July slide.
2. Gold ticks = annotated TA moments (RSI oversold, volume breakout, support tag, golden-cross risk, etc.).
3. Keyboard: **← / →** one session, **Space** play/pause, **Home / End** window ends, **Page Up / Down** five days. Chart is focusable too.
4. Overlays: candlesticks (or close line), volume, SMA 20, SMA 50, RSI(14), labeled support/resistance, volume-spike highlight.
5. Hide teacher notes if students are on laptops. Answer key is for you.

## What’s on the screen

- Paper sandbox: starting cash (default $10,000), optional fees in basis points (0 for class), BUY / SELL / HOLD at the scrubbed close, fractional shares, avg cost, unrealized vs realized P&L
- Signal cards with a cautious-trader move (enter / wait / take profit / stop)
- Compare paths A/B/C and the robot’s rules in a disclosure panel
- Decision journal + print / `.txt` export (stays in the browser)

## Data caveats

Full citations: [SOURCES.md](./SOURCES.md).

- Daily OHLCV from Yahoo Finance’s public chart API; IPO priced at **$135** on **June 12, 2026**.
- SMA 50 does not exist until 50 closes (August 24, 2026). RSI is Wilder RSI(14).
- Fills use **that day’s close** — the same print that created the signal. Real orders would not reliably get that price.
- Past path ≠ future path. Paper P&L is not a taxable capital gain.

## Project layout

```
spacex-sim/
  public/data/spcx-history.json   # bundled OHLCV + as-of stamp
  scripts/refresh-data.py
  src/lib/ta.ts                   # SMA, RSI, spikes
  src/lib/trading.ts              # paper book
  src/lib/paths.ts                # buy-and-hold + rules robot
  src/lib/signals.ts              # annotated classroom cards
```
