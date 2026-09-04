# Sources

Classroom dataset for **Inflation Year-over-Year, 1926–2026**. Raw files live in `data/raw/`. Rebuild `public/data/dataset.json` with:

```bash
python3 scripts/build-data.py
```

Every sticker price in the JSON has a `quality` flag:

| Flag | Meaning |
| --- | --- |
| `official` | Annual figure from the named government / industry series |
| `documented` | Published historical average from a cited source (not always annual) |
| `interpolated` | Linear fill between neighboring documented/official years |
| `cpi-scaled` | `price_year ≈ price_ref × (CPI_year / CPI_ref)` |
| `ytd` | Average of available 2026 months/quarters, **through July 2026** (housing through 2026 Q2) |

We do not invent silent precision. Estimates are labeled in the UI.

## Consumer Price Index

- **Series:** BLS CPI-U, U.S. city average, all items, not seasonally adjusted.
- **FRED ID:** [CPIAUCNS](https://fred.stlouisfed.org/series/CPIAUCNS)
- **Index base:** 1982–84 = 100 (the official CPI-U base used in this app).
- **File:** `data/raw/fred_cpiaucns_annual.csv` (FRED annual average, 1926–2025)
- **2026:** arithmetic mean of monthly CPIAUCNS for January–July 2026 from `fred_cpiaucns_monthly_recent.csv`.
- **1926 year-over-year:** uses the same series’ 1925 annual average (17.5) so the first slider year has a rate.
- CSV graph URL pattern: `https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCNS&fq=Annual&fam=avg`

Purchasing-power math:

```
dollars_in_year_B = dollars_in_year_A × (CPI_B / CPI_A)
```

## Gasoline

- **1926–1948:** EIA / DOE historical regular retail prices (including taxes), as published in DOE Vehicle Technologies [Fact #741](https://www.energy.gov/eere/vehicles/fact-741-august-20-2012-historical-gasoline-prices-1929-2011) and the EIA *Annual Energy Review* historical tables. Leaded regular.
- **1949–2025:** EIA *Monthly Energy Review* Table 9.4, annual (`YYYYMM` ending in `13`). File: `data/raw/eia_mer_t09_04.csv`.  
  Download: `https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T09.04`  
  Uses **unleaded regular** (MSN `RUUCUUS`) when available (1976–); otherwise **leaded regular** (`RLUCUUS`).
- **2026 YTD:** BLS average price, gasoline regular, U.S. city average — FRED [APU000074714](https://fred.stlouisfed.org/series/APU000074714), January–July 2026.

## Bread (white, per pound)

- **1926–1975:** BLS historical average prices for white bread (Handbook / *Monthly Labor Review* snapshots, including [“One hundred years of price change”](https://www.bls.gov/opub/mlr/2014/article/one-hundred-years-of-price-change-the-consumer-price-index-and-the-american-inflation-experience.htm) and [“Average food prices: a snapshot…”](https://www.bls.gov/opub/btn/volume-2/average-food-prices-a-snapshot-of-how-much-has-changed-over-a-century.htm)). Sparse years are interpolated.
- **1980–2025:** FRED [APU0000702111](https://fred.stlouisfed.org/series/APU0000702111) (BLS average price: white bread, per lb.).
- **2026 YTD:** same series, January–July.

A pound of white bread is the long-run BLS unit — treated here as “a loaf.”

## Milk (per gallon)

- **1926–1990:** BLS / USDA historical quotes, often originally per quart or half-gallon, converted to a gallon (×4 or ×2). See BLS food-price articles above and the University of Missouri Libraries [Prices and Wages by Decade](https://libraryguides.missouri.edu/pricesandwages) compilation of BLS/USDA figures.
- **1996–2025:** FRED [APU0000709112](https://fred.stlouisfed.org/series/APU0000709112) (BLS: milk, fresh, whole, fortified, per gallon).
- **2026 YTD:** same series, January–July.

## Coffee (ground, per pound)

Grocery coffee — **not** a café cup.

- **1926–1979:** BLS historical ground-coffee averages (including the 1977 Brazilian-frost spike).
- **1980–2025:** FRED [APU0000717311](https://fred.stlouisfed.org/series/APU0000717311). The 2008 annual observation is missing in the extract and is linearly interpolated.
- **2026 YTD:** same series, January–July.

## Movie ticket

- **1948–2019, 2022:** NATO / Cinema United annual average U.S. ticket price (widely republished; a convenient public table is the Illinois Treasurer classroom PDF compiled from NATO / [The Numbers](https://www.the-numbers.com/market/)).
- **2023–2024:** The Numbers / industry annual averages ($10.94, $11.31).
- **1926–1947:** theater-history typical admissions (nickelodeon / neighborhood house averages). Interpolated between those anchors.
- **2020–2021:** NATO did not publish a standard average during COVID closures — linear interpolation 2019→2022, flagged `interpolated`.
- **2025–2026:** CPI-scaled from the 2024 documented average, flagged `cpi-scaled`.

## Cheese pizza (large, plain / cheese takeout)

There is **no official century-long BLS sticker series** for a restaurant cheese pizza. The app uses one consistent product definition and a reconstructed series of industry / menu / survey anchors from 1950 onward (Pizza Hut’s early 1958 price is a commonly cited starting point). Years between anchors are linear estimates. Before 1950 the card shows “not available.”

Treat pizza as a teaching illustration, not a BLS average price.

## New car / vehicle

Representative U.S. average new-vehicle prices compiled from BEA average expenditure figures, NADA historical averages, and later KBB-style average transaction prices. The product mix shifts from passenger cars toward light trucks after the 1990s — this is a **representative** series, interpolated between documented years, not a single VIN-level sticker.

## Median house (context)

- **1940, 1950, 1960:** Census Bureau median **value** of owner-occupied homes ([Historical Census of Housing Tables](https://www.census.gov/data/tables/time-series/dec/coh-values.html)): $2,938 / $7,354 / $11,900.
- **1963–2025:** FRED [MSPUS](https://fred.stlouisfed.org/series/MSPUS), Median Sales Price of Houses Sold (Census). Annual average of the quarterly series.
- **2026 YTD:** MSPUS 2026 Q1–Q2 average.

These are **related but not identical** concepts. The UI changes the house-card subtitle at 1963. No national Census median exists before 1940.

## Federal minimum wage (context)

- **1938:** Fair Labor Standards Act statutory floor, $0.25/hour.
- **1939–2025:** FRED [FEDMINNFRWG](https://fred.stlouisfed.org/series/FEDMINNFRWG) (DOL). Some calendar years average a mid-year statutory change.
- **2026:** still $7.25 federal (as of the data pull). Many states are higher — this card is the **federal** floor only.
- **1926–1937:** no federal minimum wage.

## Teaching episodes (age-appropriate, nonpartisan)

Episodes are calendar windows for classroom talk, not causal claims:

- Great Depression deflation (1929–33)
- WWII and postwar (1941–48)
- 1970s oil shocks (1973–79)
- Early-1980s disinflation (1980–82)
- 2008–09 crisis and CPI dip
- 2021–22 inflation burst

## Retrieved

Public CSVs in `data/raw/` were downloaded **4 September 2026**. 2026 figures are year-to-date through **July 2026** unless noted.
