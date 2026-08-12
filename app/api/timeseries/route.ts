import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.EXCHANGERATES_API_BASE_URL || "http://api.exchangeratesapi.io/v1";
const API_KEY = process.env.EXCHANGERATES_API_KEY || "";

export const dynamic = "force-dynamic";

// ~12 months of daily rates, grouped into this many OHLC candles.
const DAYS = 360;
const CANDLES = 30;
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

export interface ICandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

const cache = new Map<string, { at: number; candles: ICandle[] }>();

const fmt = (d: Date) => d.toISOString().slice(0, 10);

function buildCandles(series: { date: string; rate: number }[]): ICandle[] {
  series.sort((a, b) => a.date.localeCompare(b.date));
  if (series.length === 0) return [];
  const bucketSize = Math.max(1, Math.ceil(series.length / CANDLES));
  const candles: ICandle[] = [];
  for (let i = 0; i < series.length; i += bucketSize) {
    const chunk = series.slice(i, i + bucketSize);
    const rates = chunk.map((p) => p.rate);
    candles.push({
      open: chunk[0].rate,
      close: chunk[chunk.length - 1].rate,
      high: Math.max(...rates),
      low: Math.min(...rates),
    });
  }
  return candles;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") || "USD").toUpperCase();
  const symbol = (searchParams.get("to") || "EUR").toUpperCase();

  if (base === symbol) {
    return NextResponse.json({ candles: [] });
  }
  if (!API_KEY) {
    return NextResponse.json({ candles: [], error: "No API key" }, { status: 500 });
  }

  const key = `${base}_${symbol}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json({ candles: cached.candles, cached: true });
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - DAYS);

  const params = new URLSearchParams({
    access_key: API_KEY,
    base,
    symbols: symbol,
    start_date: fmt(start),
    end_date: fmt(end),
  });

  try {
    const res = await fetch(`${API_BASE_URL}/timeseries?${params.toString()}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as {
      success?: boolean;
      rates?: Record<string, Record<string, number>>;
      error?: { message?: string; info?: string };
    };

    if (!data.success || !data.rates) {
      return NextResponse.json(
        { candles: [], error: data.error?.info || data.error?.message || "Timeseries failed" },
        { status: 502 }
      );
    }

    const series = Object.entries(data.rates)
      .map(([date, r]) => ({ date, rate: r[symbol] }))
      .filter((p) => typeof p.rate === "number");

    const candles = buildCandles(series);
    if (candles.length > 0) {
      cache.set(key, { at: Date.now(), candles });
    }
    return NextResponse.json({ candles });
  } catch {
    // Serve stale if we have it, else signal failure.
    if (cached) return NextResponse.json({ candles: cached.candles, stale: true });
    return NextResponse.json({ candles: [], error: "unreachable" }, { status: 502 });
  }
}
