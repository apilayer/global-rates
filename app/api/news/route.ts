import { NextRequest, NextResponse } from "next/server";
import { newsTermsForPair } from "@/lib/constants";

const API_BASE_URL =
  process.env.MEDIASTACK_API_BASE_URL || "http://api.mediastack.com/v1";
const API_KEY = process.env.MEDIASTACK_API_KEY || "";

// Fetch fresh news at most once every 10 hours per keyword to stay within the
// Mediastack quota. We use a module-level cache (not Next's fetch cache) so we
// never persist a rate-limit/error response — and can serve the last good data
// if the API is briefly unavailable.
const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
export const dynamic = "force-dynamic";

const cache = new Map<string, { at: number; articles: INewsArticle[] }>();

export interface INewsArticle {
  id: string;
  category: string;
  source: string;
  title: string;
  summary: string;
  publishedAt: string;
  time: string;
  image: string | null;
  url: string;
}

interface IMediastackArticle {
  title: string | null;
  description: string | null;
  url: string | null;
  source: string | null;
  image: string | null;
  category: string | null;
  published_at: string | null;
}

interface IMediastackResponse {
  data?: IMediastackArticle[];
  error?: { code?: string; message?: string };
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapArticles(articles: IMediastackArticle[], term: string): INewsArticle[] {
  return articles
    .filter((a) => a.title && a.url)
    .map((a, i) => ({
      id: `${term}-${i}-${a.published_at ?? ""}`,
      category: a.category ? titleCase(a.category) : "Business",
      source: a.source ? titleCase(a.source) : "Newswire",
      title: a.title as string,
      summary: a.description?.trim() || "",
      publishedAt: a.published_at ?? "",
      time: relativeTime(a.published_at),
      image: a.image,
      url: a.url as string,
    }))
    .slice(0, 12);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = (searchParams.get("from") || "USD").toUpperCase();
  const to = (searchParams.get("to") || "GHS").toUpperCase();
  const terms = newsTermsForPair(from, to);

  const cacheKey = terms[0];

  if (!API_KEY) {
    return NextResponse.json(
      { articles: [], error: "News API key not configured" },
      { status: 500 }
    );
  }

  // Serve from the 10h cache if it's still fresh.
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < TEN_HOURS_MS) {
    return NextResponse.json({ articles: cached.articles, keyword: cacheKey, cached: true });
  }

  // Try the specific term first, then broader ones, until we get articles.
  let lastError: string | null = null;
  for (const term of terms) {
    const params = new URLSearchParams({
      access_key: API_KEY,
      keywords: term,
      languages: "en",
      sort: "published_desc",
      limit: "20",
    });

    let json: IMediastackResponse;
    try {
      const res = await fetch(`${API_BASE_URL}/news?${params.toString()}`, {
        cache: "no-store",
      });
      json = (await res.json()) as IMediastackResponse;
    } catch {
      lastError = "Could not reach the news service";
      break;
    }

    if (json.error) {
      lastError = json.error.message || json.error.code || "News API error";
      break;
    }

    const articles = mapArticles(json.data ?? [], term);
    if (articles.length > 0) {
      cache.set(cacheKey, { at: Date.now(), articles });
      return NextResponse.json({ articles, keyword: term });
    }
  }

  // On error/empty: serve the last good data if we have any, else report.
  if (cached) {
    return NextResponse.json({ articles: cached.articles, keyword: cacheKey, stale: true });
  }
  return NextResponse.json(
    { articles: [], keyword: cacheKey, error: lastError ?? undefined },
    lastError ? { status: 502 } : undefined
  );
}
