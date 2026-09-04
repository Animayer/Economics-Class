#!/usr/bin/env python3
"""Compile classroom dataset JSON from committed public CSVs + documented anchors.

Never invent silent precision: interpolated / CPI-scaled / year-to-date points
are tagged so the UI can label them.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "public" / "data" / "dataset.json"

START, END = 1926, 2026
CPI_BASE = "1982–84 = 100"


def parse_float(value: str) -> float | None:
    value = (value or "").strip()
    if not value or value.lower().startswith("not "):
        return None
    try:
        return float(value)
    except ValueError:
        return None


def read_fred_annual(path: Path) -> dict[int, float]:
    out: dict[int, float] = {}
    with path.open() as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            if len(row) < 2:
                continue
            year = int(row[0][:4])
            val = parse_float(row[1])
            if val is not None:
                out[year] = val
    return out


def read_recent_average(path: Path, year: int) -> float | None:
    vals: list[float] = []
    with path.open() as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            if len(row) < 2 or not row[0].startswith(str(year)):
                continue
            val = parse_float(row[1])
            if val is not None:
                vals.append(val)
    if not vals:
        return None
    return sum(vals) / len(vals)


def read_eia_regular_gas() -> dict[int, float]:
    """Unleaded regular when available, else leaded regular (EIA MER T09.04 annual)."""
    leaded: dict[int, float] = {}
    unleaded: dict[int, float] = {}
    with (RAW / "eia_mer_t09_04.csv").open() as f:
        reader = csv.DictReader(f)
        for row in reader:
            ym = row["YYYYMM"]
            if not ym.endswith("13"):
                continue
            year = int(ym[:4])
            val = parse_float(row["Value"])
            if val is None:
                continue
            if row["MSN"] == "RLUCUUS":
                leaded[year] = val
            elif row["MSN"] == "RUUCUUS":
                unleaded[year] = val
    merged = dict(leaded)
    merged.update(unleaded)
    return merged


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def fill_linear(
    points: dict[int, tuple[float, str]],
    start: int,
    end: int,
) -> list[dict]:
    """Fill missing years by linear interpolation between neighboring official/documented points."""
    known = sorted(points)
    series = []
    for year in range(start, end + 1):
        if year in points:
            price, quality = points[year]
            series.append({"year": year, "price": round(price, 4), "quality": quality})
            continue
        before = [y for y in known if y < year]
        after = [y for y in known if y > year]
        if not before or not after:
            continue
        y0, y1 = before[-1], after[0]
        t = (year - y0) / (y1 - y0)
        price = lerp(points[y0][0], points[y1][0], t)
        series.append({"year": year, "price": round(price, 4), "quality": "interpolated"})
    return series


def main() -> None:
    cpi = read_fred_annual(RAW / "fred_cpiaucns_annual.csv")
    # Official CPI-U annual average for 1925 (same FRED CPIAUCNS series) so 1926 has a YoY rate.
    cpi.setdefault(1925, 17.5)
    cpi_2026 = read_recent_average(RAW / "fred_cpiaucns_monthly_recent.csv", 2026)
    if cpi_2026 is None:
        raise SystemExit("Missing 2026 CPI months")
    cpi[2026] = cpi_2026

    cpi_years = []
    for year in range(START, END + 1):
        index = cpi[year]
        prev = cpi.get(year - 1)
        yoy = None if prev is None else (index / prev - 1) * 100
        cpi_years.append(
            {
                "year": year,
                "index": round(index, 3),
                "yoyPct": None if yoy is None else round(yoy, 2),
                "quality": "ytd" if year == 2026 else "official",
            }
        )

    # --- Gasoline: EIA/DOE 1926-1948 documented; EIA MER 1949-2025; BLS YTD 2026 ---
    gas_points: dict[int, tuple[float, str]] = {
        # EIA / DOE Vehicle Technologies Fact #741 and AER historical retail regular
        1926: (0.23, "documented"),
        1927: (0.21, "documented"),
        1928: (0.21, "documented"),
        1929: (0.21, "documented"),
        1930: (0.20, "documented"),
        1931: (0.17, "documented"),
        1932: (0.18, "documented"),
        1933: (0.18, "documented"),
        1934: (0.19, "documented"),
        1935: (0.19, "documented"),
        1936: (0.19, "documented"),
        1937: (0.20, "documented"),
        1938: (0.20, "documented"),
        1939: (0.19, "documented"),
        1940: (0.18, "documented"),
        1941: (0.19, "documented"),
        1942: (0.20, "documented"),
        1943: (0.21, "documented"),
        1944: (0.21, "documented"),
        1945: (0.21, "documented"),
        1946: (0.21, "documented"),
        1947: (0.23, "documented"),
        1948: (0.26, "documented"),
    }
    for year, price in read_eia_regular_gas().items():
        gas_points[year] = (price, "official")
    gas_2026 = read_recent_average(RAW / "fred_gas_bls_monthly_recent.csv", 2026)
    if gas_2026 is not None:
        gas_points[2026] = (gas_2026, "ytd")

    # --- Bread: BLS historical anchors, then FRED APU0000702111 ---
    bread_points: dict[int, tuple[float, str]] = {
        1926: (0.094, "documented"),
        1930: (0.086, "documented"),
        1935: (0.083, "documented"),
        1940: (0.080, "documented"),
        1945: (0.088, "documented"),
        1947: (0.125, "documented"),
        1950: (0.143, "documented"),
        1955: (0.177, "documented"),
        1960: (0.203, "documented"),
        1965: (0.207, "documented"),
        1970: (0.243, "documented"),
        1975: (0.360, "documented"),
    }
    bread_points.update({y: (p, "official") for y, p in read_fred_annual(RAW / "fred_bread_annual.csv").items()})
    bread_2026 = read_recent_average(RAW / "fred_bread_monthly_recent.csv", 2026)
    if bread_2026 is not None:
        bread_points[2026] = (bread_2026, "ytd")

    # --- Milk: convert historical quart / half-gallon BLS quotes to gallons ---
    milk_points: dict[int, tuple[float, str]] = {
        1926: (0.56, "documented"),  # ~14¢/quart
        1930: (0.564, "documented"),
        1940: (0.52, "documented"),
        1950: (0.82, "documented"),  # 41¢ half-gallon
        1960: (1.04, "documented"),
        1970: (1.32, "documented"),
        1975: (1.57, "documented"),
        1980: (2.10, "documented"),
        1987: (2.18, "documented"),
        1990: (1.42, "documented"),  # USDA gallon
    }
    milk_points.update({y: (p, "official") for y, p in read_fred_annual(RAW / "fred_milk_annual.csv").items()})
    milk_2026 = read_recent_average(RAW / "fred_milk_monthly_recent.csv", 2026)
    if milk_2026 is not None:
        milk_points[2026] = (milk_2026, "ytd")

    # --- Coffee, ground roast, per pound ---
    coffee_points: dict[int, tuple[float, str]] = {
        1926: (0.51, "documented"),
        1930: (0.395, "documented"),
        1940: (0.213, "documented"),
        1950: (0.793, "documented"),
        1960: (0.752, "documented"),
        1970: (0.911, "documented"),
        1976: (1.42, "documented"),
        1977: (3.33, "documented"),  # Brazilian frost spike
        1978: (3.18, "documented"),
        1979: (2.89, "documented"),
    }
    coffee_fred = read_fred_annual(RAW / "fred_coffee_annual.csv")
    coffee_points.update({y: (p, "official") for y, p in coffee_fred.items()})
    # 2008 annual missing in FRED extract — interpolate neighbors later
    coffee_2026 = read_recent_average(RAW / "fred_coffee_monthly_recent.csv", 2026)
    if coffee_2026 is not None:
        coffee_points[2026] = (coffee_2026, "ytd")

    # --- Movie tickets: sparse pre-NATO, NATO/The Numbers from 1948 ---
    movie_points: dict[int, tuple[float, str]] = {
        1926: (0.25, "documented"),
        1929: (0.25, "documented"),
        1933: (0.20, "documented"),
        1939: (0.23, "documented"),
        1945: (0.32, "documented"),
        1948: (0.36, "official"),
        1954: (0.49, "official"),
        1958: (0.68, "official"),
        1963: (0.86, "official"),
        1967: (1.22, "official"),
        1971: (1.65, "official"),
        1974: (1.89, "official"),
        1975: (2.03, "official"),
        1976: (2.13, "official"),
        1977: (2.23, "official"),
        1978: (2.34, "official"),
        1979: (2.47, "official"),
        1980: (2.69, "official"),
        1981: (2.78, "official"),
        1982: (2.94, "official"),
        1983: (3.15, "official"),
        1984: (3.36, "official"),
        1985: (3.55, "official"),
        1986: (3.71, "official"),
        1987: (3.91, "official"),
        1988: (4.11, "official"),
        1989: (3.99, "official"),
        1990: (4.22, "official"),
        1991: (4.21, "official"),
        1992: (4.15, "official"),
        1993: (4.14, "official"),
        1994: (4.08, "official"),
        1995: (4.35, "official"),
        1996: (4.42, "official"),
        1997: (4.59, "official"),
        1998: (4.69, "official"),
        1999: (5.06, "official"),
        2000: (5.39, "official"),
        2001: (5.65, "official"),
        2002: (5.80, "official"),
        2003: (6.03, "official"),
        2004: (6.21, "official"),
        2005: (6.41, "official"),
        2006: (6.55, "official"),
        2007: (6.88, "official"),
        2008: (7.18, "official"),
        2009: (7.50, "official"),
        2010: (7.89, "official"),
        2011: (7.93, "official"),
        2012: (7.96, "official"),
        2013: (8.13, "official"),
        2014: (8.17, "official"),
        2015: (8.43, "official"),
        2016: (8.65, "official"),
        2017: (8.97, "official"),
        2018: (9.11, "official"),
        2019: (9.16, "official"),
        # NATO paused average-price reports during COVID closures
        2022: (10.53, "official"),
        2023: (10.94, "documented"),
        2024: (11.31, "documented"),
    }
    # CPI-scale 2025–2026 from last documented ticket price
    movie_points[2025] = (11.31 * cpi[2025] / cpi[2024], "cpi-scaled")
    movie_points[2026] = (11.31 * cpi[2026] / cpi[2024], "cpi-scaled")

    # --- Pizza: national takeout cheese pie was not a standard staple before ~1950 ---
    pizza_points: dict[int, tuple[float, str]] = {
        1950: (0.80, "documented"),
        1958: (0.95, "documented"),
        1965: (1.50, "documented"),
        1970: (2.00, "documented"),
        1975: (3.00, "documented"),
        1980: (5.00, "documented"),
        1985: (7.00, "documented"),
        1990: (8.50, "documented"),
        1995: (9.50, "documented"),
        2000: (10.50, "documented"),
        2005: (10.75, "documented"),
        2010: (11.00, "documented"),
        2015: (11.50, "documented"),
        2019: (12.50, "documented"),
        2022: (14.75, "documented"),
        2024: (15.50, "documented"),
        2025: (16.00, "documented"),
        2026: (16.25, "documented"),
    }

    # --- New vehicle: BEA / NADA / KBB representative averages ---
    car_points: dict[int, tuple[float, str]] = {
        1926: (850, "documented"),
        1930: (640, "documented"),
        1933: (550, "documented"),
        1940: (850, "documented"),
        1948: (1250, "documented"),
        1950: (1510, "documented"),
        1955: (1900, "documented"),
        1960: (2274, "documented"),
        1965: (2650, "documented"),
        1970: (3542, "documented"),
        1975: (4900, "documented"),
        1980: (7210, "documented"),
        1985: (9061, "documented"),
        1990: (14990, "documented"),
        1995: (17600, "documented"),
        2000: (20886, "documented"),
        2005: (23240, "documented"),
        2010: (28800, "documented"),
        2015: (33560, "documented"),
        2019: (38400, "documented"),
        2020: (38800, "documented"),
        2021: (43000, "documented"),
        2022: (48000, "documented"),
        2023: (48200, "documented"),
        2024: (47200, "documented"),
        2025: (48500, "documented"),
        2026: (48900, "documented"),
    }

    # --- Housing: Census owner-occupied values 1940-1960; MSPUS sales 1963+ ---
    house_points: dict[int, tuple[float, str]] = {
        1940: (2938, "documented"),
        1950: (7354, "documented"),
        1960: (11900, "documented"),
    }
    house_points.update({y: (p, "official") for y, p in read_fred_annual(RAW / "fred_mspus_annual.csv").items()})
    house_2026 = read_recent_average(RAW / "fred_mspus_quarterly_recent.csv", 2026)
    if house_2026 is not None:
        house_points[2026] = (house_2026, "ytd")

    # --- Federal minimum wage ---
    wage_points: dict[int, tuple[float, str]] = {1938: (0.25, "official")}
    wage_points.update({y: (p, "official") for y, p in read_fred_annual(RAW / "fred_minwage_annual.csv").items()})
    wage_points[2026] = (7.25, "official")

    goods = [
        {
            "id": "movie",
            "name": "Movie ticket",
            "unit": "average U.S. admission",
            "shortLabel": "Movie",
            "icon": "film",
            "notes": "NATO / Cinema United / The Numbers average ticket from 1948. Earlier years are theater-history averages. 2020–21 and 2025–26 are filled (COVID reporting gap; latest ticket years CPI-scaled).",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(movie_points, START, END),
        },
        {
            "id": "gas",
            "name": "Gallon of gasoline",
            "unit": "regular retail, including taxes",
            "shortLabel": "Gas",
            "icon": "gas",
            "notes": "EIA / DOE historical regular retail through 1948; EIA Monthly Energy Review T09.04 annual 1949–2025 (unleaded when available, else leaded). 2026 is BLS city-average regular, January–July.",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(gas_points, START, END),
        },
        {
            "id": "bread",
            "name": "Loaf of bread",
            "unit": "white bread, per pound",
            "shortLabel": "Bread",
            "icon": "bread",
            "notes": "BLS historical white-bread prices, then FRED APU0000702111 (1980–2025). A pound of white bread is the long-run BLS unit — roughly one loaf. 2026 is January–July average.",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(bread_points, START, END),
        },
        {
            "id": "pizza",
            "name": "Cheese pizza",
            "unit": "large plain / cheese takeout pie",
            "shortLabel": "Pizza",
            "icon": "pizza",
            "notes": "One consistent product: a large cheese (no extra toppings) takeout pizza. There is no official century-long BLS sticker series. Anchors are industry / menu / survey averages; years between anchors are linear estimates. National averages start in 1950.",
            "availableFrom": 1950,
            "unavailableReason": "Pizza was not yet a typical U.S. national staple — series starts in 1950.",
            "series": fill_linear(pizza_points, 1950, END),
        },
        {
            "id": "milk",
            "name": "Gallon of milk",
            "unit": "fresh whole milk, per gallon",
            "shortLabel": "Milk",
            "icon": "milk",
            "notes": "Earlier BLS quotes were per quart or half-gallon and are converted to a gallon. FRED APU0000709112 from 1996. 2026 is January–July average.",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(milk_points, START, END),
        },
        {
            "id": "coffee",
            "name": "Pound of coffee",
            "unit": "ground roast coffee, per pound (grocery — not a café cup)",
            "shortLabel": "Coffee",
            "icon": "coffee",
            "notes": "BLS grocery ground coffee per pound, not a coffee-shop cup. Historical BLS averages through 1979; FRED APU0000717311 from 1980 (2008 interpolated). 2026 is January–July average.",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(coffee_points, START, END),
        },
        {
            "id": "car",
            "name": "New car",
            "unit": "average / representative U.S. new vehicle",
            "shortLabel": "New car",
            "icon": "car",
            "notes": "Representative average new-vehicle price (BEA expenditure, NADA, and later KBB-style transaction averages). Mix shifts from cars toward light trucks after the 1990s. Interpolated between documented years.",
            "availableFrom": 1926,
            "unavailableReason": None,
            "series": fill_linear(car_points, START, END),
        },
        {
            "id": "house",
            "name": "Median house",
            "unit": "see note — series definition changes in 1963",
            "shortLabel": "House",
            "icon": "house",
            "notes": "1940–1960: Census median value of owner-occupied homes (not sale prices). 1963–2026: FRED MSPUS median sales price of houses sold. These are related but not identical concepts. No national Census median before 1940. 2026 is Q1–Q2 average.",
            "availableFrom": 1940,
            "unavailableReason": "No official national median until the 1940 Census.",
            "series": fill_linear(house_points, 1940, END),
        },
        {
            "id": "wage",
            "name": "Federal minimum wage",
            "unit": "dollars per hour",
            "shortLabel": "Min. wage",
            "icon": "wage",
            "notes": "Fair Labor Standards Act (1938). FRED FEDMINNFRWG annual statutory rate. Context, not a grocery price. Some years are averages of mid-year statutory changes.",
            "availableFrom": 1938,
            "unavailableReason": "No federal minimum wage until the 1938 Fair Labor Standards Act.",
            "series": fill_linear(wage_points, 1938, END),
        },
    ]

    episodes = [
        {
            "id": "depression",
            "label": "Great Depression",
            "start": 1929,
            "end": 1933,
            "headline": "Prices fell — this is deflation",
            "cue": "Watch the year-over-year rate turn negative. A dollar bought more goods, but jobs and incomes collapsed. Ask: is falling prices always good news?",
        },
        {
            "id": "ww2",
            "label": "WWII & postwar",
            "start": 1941,
            "end": 1948,
            "headline": "Wartime demand, then a postwar jump",
            "cue": "Price controls held some stickers down during the war; when controls lifted, the CPI jumped (see 1946–48). Compare a movie ticket and a loaf of bread.",
        },
        {
            "id": "oil",
            "label": "1970s oil shocks",
            "start": 1973,
            "end": 1979,
            "headline": "Energy shocks and double-digit inflation",
            "cue": "Scrub 1973–74 and 1979. Gasoline moves first; then other prices follow. Pause on 1979 and ask what students notice in the basket.",
        },
        {
            "id": "volcker",
            "label": "Early 1980s",
            "start": 1980,
            "end": 1982,
            "headline": "Inflation peaks, then cools",
            "cue": "The CPI rise is still very high in 1980, then slows. This is the Volcker-era disinflation — tight money, painful unemployment, falling inflation. Stay factual; no party framing.",
        },
        {
            "id": "gfc",
            "label": "2008–09",
            "start": 2008,
            "end": 2009,
            "headline": "Crisis, then a rare CPI dip",
            "cue": "2008 energy prices spiked, then 2009 shows a slightly negative year-over-year CPI. House sale prices also fall. Compare gasoline 2008 vs 2009.",
        },
        {
            "id": "pandemic",
            "label": "2021–22",
            "start": 2021,
            "end": 2022,
            "headline": "A fast inflation burst",
            "cue": "After a calm 2010s, 2021–22 CPI jumps. Used cars, energy, and food led headlines. Ask which basket items moved more than the overall CPI.",
        },
    ]

    dataset = {
        "meta": {
            "title": "Inflation Year-over-Year, 1926–2026",
            "class": "Ryan Mayer · 10th-grade Economics · Battery Creek High School, SC",
            "startYear": START,
            "endYear": END,
            "cpiBase": CPI_BASE,
            "cpiSeries": "CPIAUCNS (CPI-U, U.S. city average, all items, not seasonally adjusted)",
            "cpiSource": "FRED / U.S. Bureau of Labor Statistics",
            "latestCompleteYear": 2025,
            "latestThrough": "July 2026",
            "latestNote": "2026 CPI and several sticker prices are January–July averages, not a full calendar year. Labeled YTD in the app.",
            "displayYear": 2026,
            "builtFrom": "scripts/build-data.py",
        },
        "cpi": cpi_years,
        "goods": goods,
        "episodes": episodes,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(dataset, indent=2) + "\n")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"CPI 2025={cpi[2025]:.3f} 2026 YTD={cpi[2026]:.3f}")
    print(f"YoY 2026≈{(cpi[2026]/cpi[2025]-1)*100:.2f}%")


if __name__ == "__main__":
    main()
