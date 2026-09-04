# Inflation Year-over-Year, 1926–2026

Interactive classroom simulation for **Ryan Mayer’s 10th-grade Economics** class at Battery Creek High School (SC). Students scrub one century of U.S. prices and see what inflation does to a dollar, a paycheck, and everyday goods.

No login. No backend. One URL on a Chromebook, phone, or projector.

## Run locally

```bash
cd inflation-sim
npm install
python3 scripts/build-data.py   # optional; dataset.json is already committed
npm run dev
```

Then open the printed `http://localhost:5173` URL.

Production-style static build:

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. Copy that folder to any static host (GitHub Pages, Google Drive / a shared classroom folder, a thumb drive + local server). Paths are relative (`base: './'`), so the folder can live in a subpath.

```bash
npm test
```

## Projector / Chromebook

1. Open the site full-screen (`F11` on a Chromebook, or the browser’s full-screen control).
2. Use the **Class** play speed. The year is large enough to read from the back row.
3. Keyboard: **Space** play/pause, **← / →** one year, **Page Up / Down** a decade, **Home / End** to 1926 / 2026.
4. Tick marks on the slider jump to major inflation episodes.
5. If the room’s projector washes out color, the type is high-contrast on cream; avoid extra lights on the board.

Google Fonts load when the network allows; the page still works with system fonts if they are blocked.

## Teacher script (one paragraph)

Press **Play** from 1926 and ask students to watch the year-over-year rate, not just the stickers. Pause on **1932**: prices are falling — is that “good inflation news,” or is something else going on? Jump to **1946–48** after wartime controls. At **1974** and especially **1979**, ask what they notice first (gasoline usually leads). Compare a frozen **1970 $1.60/hour** paycheck in the table: how many gallons of gas did that hour buy in 1970 versus 1979 versus 2022? Skip to **1980–82** and watch inflation cool. Tap **2008–09** for the rare CPI dip and falling house prices. Finish on **2021–22**: which basket items moved more than the overall CPI? Remind them that 2026 numbers are **through July**, not a finished year.

## What’s on the screen

- Year slider + play/pause, 1926–2026 inclusive
- Basket: movie ticket, gasoline, bread, cheese pizza, milk, grocery coffee (per pound), new car, plus median house and federal minimum wage as labeled context
- Purchasing power: $1 then in 2026 dollars, how much then-money equals $100 today, YoY inflation, CPI (official base **1982–84 = 100**)
- Fixed-paycheck mode: freeze a 1926 / 1950 / 1970 / 1980 wage (or a custom amount) and see what it buys each decade
- Teaching cues for Depression deflation, WWII/postwar, 1970s oil shocks, early-1980s disinflation, 2008–09, and 2021–22

## Data caveats (short)

Full citations: [SOURCES.md](./SOURCES.md).

- CPI is BLS CPI-U via FRED `CPIAUCNS`, annual averages. **2026 is January–July**, labeled YTD.
- Historical stickers use official series when they exist (EIA gas, BLS average prices, NATO tickets, Census/FRED house prices, DOL minimum wage). Gaps are **interpolated or CPI-scaled and labeled**.
- Pizza is a reconstructed large cheese takeout series (no official century-long BLS sticker). It starts in 1950.
- House prices change definition in 1963 (Census owner-occupied *value* → median *sales* price).
- Federal minimum wage did not exist before 1938; many states now pay more than $7.25.

## Project layout

```
inflation-sim/
  public/data/dataset.json   # what the app loads
  data/raw/                  # committed public CSVs
  scripts/build-data.py
  src/                       # Vite + React + TypeScript
```
