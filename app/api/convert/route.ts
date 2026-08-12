import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.EXCHANGERATES_API_BASE_URL || "http://api.exchangeratesapi.io/v1";
const API_KEY = process.env.EXCHANGERATES_API_KEY || "";

// The exchangeratesapi.io free plan doesn't allow the /convert endpoint or a
// non-EUR base, so we fetch the EUR-based rate table from /latest and compute
// every cross-rate locally. The table is cached in-memory so many conversions
// (every keystroke, popular pairs, etc.) cost at most one upstream call per
// refresh window — important given the tight free-tier rate limit.
const RATES_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface IRateTable {
  at: number;
  timestamp: number;
  rates: Record<string, number>; // EUR-based
}

let cache: IRateTable | null = null;
let inflight: Promise<IRateTable | null> | null = null;

async function fetchEurRates(): Promise<IRateTable | null> {
  const params = new URLSearchParams({ access_key: API_KEY });
  const res = await fetch(`${API_BASE_URL}/latest?${params.toString()}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as {
    success?: boolean;
    rates?: Record<string, number>;
    timestamp?: number;
    error?: { code?: string; message?: string };
  };
  if (!data.success || !data.rates) {
    return null;
  }
  return {
    at: Date.now(),
    timestamp: data.timestamp ?? Math.floor(Date.now() / 1000),
    rates: { ...data.rates, EUR: 1 },
  };
}

async function getRates(): Promise<IRateTable | null> {
  if (cache && Date.now() - cache.at < RATES_TTL_MS) return cache;
  // De-dupe concurrent refreshes.
  if (!inflight) {
    inflight = fetchEurRates()
      .then((fresh) => {
        if (fresh) cache = fresh;
        return cache;
      })
      .catch(() => cache)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();
  const amountStr = searchParams.get("amount");

  if (!from || !to || !amountStr) {
    return NextResponse.json(
      { error: "Missing required parameters: from, to, amount" },
      { status: 400 }
    );
  }

  const amount = Number(amountStr);
  if (Number.isNaN(amount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const table = await getRates();
  if (!table) {
    return NextResponse.json(
      { error: "Exchange rates are temporarily unavailable" },
      { status: 502 }
    );
  }

  const fromRate = from === "EUR" ? 1 : table.rates[from];
  const toRate = to === "EUR" ? 1 : table.rates[to];

  if (!fromRate || !toRate) {
    const missing = !fromRate ? from : to;
    return NextResponse.json(
      { error: `Unsupported currency: ${missing}` },
      { status: 400 }
    );
  }

  const rate = toRate / fromRate;
  const result = amount * rate;

  return NextResponse.json({
    success: true,
    query: { from, to, amount },
    info: { rate, timestamp: table.timestamp },
    result,
    date: new Date(table.timestamp * 1000).toISOString().slice(0, 10),
  });
}
