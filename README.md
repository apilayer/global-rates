# GlobalRates

GlobalRates is a live currency exchange-rate checker — a clean, dark trading-style dashboard for seeing what any currency is really worth at the mid-market rate. It's built as a demo of APILayer's data APIs: the whole experience, from the converter to the charts to the news feed, is driven by real APILayer data.

Open the site and it detects your location and defaults to comparing your local currency against the US Dollar. From there you can convert any amount between 170+ currencies, scan quick-reference rate tables, read a 12-month price chart, browse financial news relevant to the pair you're viewing, and jump between popular pairs — all updating together.

It's a rate-checking tool, not a money-transfer service: the mid-market rate shown is the fair reference rate banks and businesses use, for informational purposes.

## What powers it

Everything runs on APILayer APIs, proxied through server routes in `app/api/` so keys stay off the client:

- **[Exchange Rates Data API](https://exchangeratesapi.io/)** — real-time and historical FX for the converter, the conversion tables, the candlestick chart (via `timeseries`) and the popular-pairs moves (via `fluctuation`).
- **[Mediastack](https://mediastack.com/)** — the financial news section, keyword-filtered to the selected currency pair and cached so it stays within the request quota.
- **[ipstack](https://ipstack.com/)** — geolocates the visitor on first load to choose the default local currency (USD stays the anchor; nothing is hardcoded).

## Getting started

Create a `.env.local` in the project root with your APILayer keys:

```bash
# Exchange Rates Data API
EXCHANGERATES_API_KEY=your_key
EXCHANGERATES_API_BASE_URL=http://api.exchangeratesapi.io/v1

# Mediastack (news)
MEDIASTACK_API_KEY=your_key
MEDIASTACK_API_BASE_URL=http://api.mediastack.com/v1

# ipstack (geo default currency)
IPSTACK_ACCESS_KEY=your_key
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note on local geolocation:** running locally, there's no real visitor IP, so ipstack geolocates the server's outbound IP. In production behind a proxy (with `x-forwarded-for`) it resolves each visitor accurately.

If a key is missing or rate-limited, the affected section degrades gracefully — the converter falls back to a neutral USD/EUR default, news and geo return empty rather than erroring, and cached results are served when the upstream is briefly unavailable.
