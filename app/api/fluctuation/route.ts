import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.EXCHANGERATES_API_BASE_URL || "http://api.exchangeratesapi.io/v1";
const API_KEY = process.env.EXCHANGERATES_API_KEY || "";

export const dynamic = "force-dynamic";

const TTL_MS = 60 * 60 * 1000; // 1h

export interface IFluctuationEntry {
  rate: number;
  changePct: number;
  up: boolean;
}

const cache = new Map<string, { at: number; rates: Record<string, IFluctuationEntry> }>();

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") || "USD").toUpperCase();
  const symbols = (searchParams.get("symbols") || "")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s !== base);

  if (symbols.length === 0) {
    return NextResponse.json({ rates: {} });
  }
  if (!API_KEY) {
    return NextResponse.json({ rates: {}, error: "No API key" }, { status: 500 });
  }

  const key = `${base}:${symbols.slice().sort().join(",")}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json({ rates: cached.rates, cached: true });
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const params = new URLSearchParams({
    access_key: API_KEY,
    base,
    symbols: symbols.join(","),
    start_date: fmt(start),
    end_date: fmt(end),
  });

  try {
    const res = await fetch(`${API_BASE_URL}/fluctuation?${params.toString()}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as {
      success?: boolean;
      rates?: Record<string, { end_rate?: number; change?: number; change_pct?: number }>;
      error?: { message?: string; info?: string };
    };

    if (!data.success || !data.rates) {
      if (cached) return NextResponse.json({ rates: cached.rates, stale: true });
      return NextResponse.json(
        { rates: {}, error: data.error?.info || data.error?.message || "Fluctuation failed" },
        { status: 502 }
      );
    }

    const rates: Record<string, IFluctuationEntry> = {};
    for (const [sym, v] of Object.entries(data.rates)) {
      if (typeof v.end_rate === "number") {
        rates[sym] = {
          rate: v.end_rate,
          changePct: v.change_pct ?? 0,
          up: (v.change ?? 0) >= 0,
        };
      }
    }

    cache.set(key, { at: Date.now(), rates });
    return NextResponse.json({ rates });
  } catch {
    if (cached) return NextResponse.json({ rates: cached.rates, stale: true });
    return NextResponse.json({ rates: {}, error: "unreachable" }, { status: 502 });
  }
}
