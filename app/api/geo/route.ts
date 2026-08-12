import { NextRequest, NextResponse } from "next/server";
import { countryToCurrency } from "@/lib/constants";

const IPSTACK_BASE = process.env.IPSTACK_BASE_URL || "http://api.ipstack.com";
const API_KEY = process.env.IPSTACK_ACCESS_KEY || "";

export const dynamic = "force-dynamic";

// Cache the lookup per target IP so repeated page loads don't burn the tight
// ipstack rate limit. Successful results are reused for 6h.
const TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; body: unknown }>();

const isPrivate = (ip: string) =>
  ip === "::1" ||
  ip === "127.0.0.1" ||
  ip.startsWith("10.") ||
  ip.startsWith("192.168.") ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  ip.startsWith("fc") ||
  ip.startsWith("fd");

interface IpstackResponse {
  country_code?: string;
  country_name?: string;
  currency?: { code?: string };
  error?: { info?: string };
}

export async function GET(request: NextRequest) {
  // No key configured → let the client fall back to its default pair.
  if (!API_KEY) {
    return NextResponse.json({ currency: null, reason: "no-key" });
  }

  // Prefer the real client IP; fall back to ipstack's "check" (server IP) in
  // local dev where there's no forwarded client address.
  const xff = request.headers.get("x-forwarded-for");
  const candidate = xff?.split(",")[0]?.trim() ?? "";
  const target = candidate && !isPrivate(candidate) ? candidate : "check";

  // Serve a fresh cached result to avoid re-hitting ipstack on every load.
  const cached = cache.get(target);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json(cached.body);
  }

  const endpoint = `${IPSTACK_BASE}/${encodeURIComponent(target)}?access_key=${API_KEY}`;

  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    const data = (await res.json()) as IpstackResponse;

    // Rate-limited or errored → serve last good result if we have one.
    if (data.error || !data.country_code) {
      if (cached) return NextResponse.json(cached.body);
      return NextResponse.json({
        currency: null,
        reason: data.error?.info ? "rate-limited" : "lookup-failed",
      });
    }

    // Use ipstack's own currency when present (paid plans), otherwise map from
    // the country code.
    const currency =
      (data.currency?.code && data.currency.code) ||
      countryToCurrency(data.country_code);

    const body = {
      currency,
      country: data.country_code,
      countryName: data.country_name ?? null,
    };
    cache.set(target, { at: Date.now(), body });
    return NextResponse.json(body);
  } catch {
    if (cached) return NextResponse.json(cached.body);
    return NextResponse.json({ currency: null, reason: "unreachable" });
  }
}
