# SPCX data sources

Classroom paper-trading lab for NASDAQ: **SPCX** (Space Exploration Technologies Corp.).

## Prices

- **Primary series:** Yahoo Finance chart API, daily OHLCV, `https://query1.finance.yahoo.com/v8/finance/chart/SPCX?interval=1d&range=6mo`
- **Human page:** https://finance.yahoo.com/quote/SPCX/history/
- **Cross-check:** StockAnalysis daily history (S&P Global / Tiingo prints) https://stockanalysis.com/stocks/spcx/history/
- **IPO:** June 12, 2026 listing on Nasdaq; IPO priced at $135 a share the night before. First print in this file: open $150, high $176.52, low $149.34, close $160.95, volume ~519.2 million.

Bundled snapshot in `public/data/spcx-history.json` includes `meta.asOf`, `meta.asOfLabel`, `meta.fetchedAt`, and `meta.source`. Refresh with `python3 scripts/refresh-data.py`.

This is historical market data for education. It is not a live broker feed and not a recommendation to buy or sell SPCX.

## Indicators (computed in-app)

- SMA 20 / SMA 50 on closing prices
- Wilder RSI(14)
- 20-day average volume; a session is a “spike” at ≥ 2× that average
- Support / resistance labels are teaching overlays (IPO $135, round $150, swing lows), not exchange objects
