#!/usr/bin/env python3
"""Refresh bundled SPCX daily OHLCV from Yahoo Finance (no API key).

Writes public/data/spcx-history.json with a data-as-of stamp.
Classroom app loads this file if a live browser fetch is blocked (CORS).
"""

from __future__ import annotations

import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "data" / "spcx-history.json"
YAHOO = (
    "https://query1.finance.yahoo.com/v8/finance/chart/SPCX"
    "?interval=1d&range=6mo&includePrePost=false"
)
ET = ZoneInfo("America/New_York")


def fetch() -> dict:
    req = urllib.request.Request(
        YAHOO,
        headers={"User-Agent": "Economics-Class-SPCX-sim/1.0 (classroom)"},
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode("utf-8"))


def bars_from_yahoo(payload: dict) -> list[dict]:
    result = payload["chart"]["result"][0]
    ts = result["timestamp"]
    quote = result["indicators"]["quote"][0]
    bars = []
    for i, unix in enumerate(ts):
        o, h, l, c, v = (
            quote["open"][i],
            quote["high"][i],
            quote["low"][i],
            quote["close"][i],
            quote["volume"][i],
        )
        if None in (o, h, l, c, v):
            continue
        day = datetime.fromtimestamp(unix, tz=ET).strftime("%Y-%m-%d")
        bars.append(
            {
                "date": day,
                "open": round(float(o), 2),
                "high": round(float(h), 2),
                "low": round(float(l), 2),
                "close": round(float(c), 2),
                "volume": int(v),
            }
        )
    return bars


def main() -> None:
    payload = fetch()
    bars = bars_from_yahoo(payload)
    if len(bars) < 10:
        raise SystemExit("Yahoo returned too few SPCX bars.")

    existing_levels = []
    if OUT.exists():
        try:
            existing_levels = json.loads(OUT.read_text()).get("levels", [])
        except json.JSONDecodeError:
            existing_levels = []

    levels = existing_levels or [
        {"price": 104.83, "label": "Period low (Aug 3)", "kind": "support"},
        {"price": 130.5, "label": "Aug 11 swing low", "kind": "support"},
        {"price": 135.0, "label": "IPO price $135", "kind": "reference"},
        {"price": 150.0, "label": "Round $150 / IPO open", "kind": "resistance"},
        {"price": 160.95, "label": "IPO-day close", "kind": "reference"},
        {"price": 211.39, "label": "Jun 16 peak close", "kind": "resistance"},
    ]

    last = bars[-1]
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    out = {
        "meta": {
            "symbol": "SPCX",
            "exchange": "NASDAQ",
            "name": "Space Exploration Technologies Corp.",
            "ipoDate": "2026-06-12",
            "ipoPrice": 135,
            "asOf": last["date"],
            "asOfLabel": f"Regular-session close through {last['date']}",
            "timezone": "America/New_York",
            "source": "Yahoo Finance chart API (query1.finance.yahoo.com)",
            "sourceUrl": "https://finance.yahoo.com/quote/SPCX/history/",
            "crossCheck": "Spot-check a few dates against Nasdaq or StockAnalysis before class.",
            "fetchedAt": today,
            "barCount": len(bars),
            "classLine": "Battery Creek High School · 10th-grade Economics · Mayer",
            "title": "SPCX Paper Trading Lab",
            "lessonWindowStart": "2026-08-17",
        },
        "levels": levels,
        "bars": bars,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(f"Wrote {len(bars)} bars to {OUT} (as of {last['date']})")


if __name__ == "__main__":
    main()
