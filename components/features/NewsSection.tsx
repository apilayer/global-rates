"use client";

import { FC, useEffect, useState } from "react";
import { DEFAULT_FROM, DEFAULT_TO } from "@/lib/constants";

interface INewsArticle {
  id: string;
  category: string;
  source: string;
  title: string;
  summary: string;
  time: string;
  image: string | null;
  url: string;
}

interface INewsSectionProps {
  from?: string;
  to?: string;
}

const THUMB_GRADIENTS: [string, string][] = [
  ["#1e3a8a", "#0ea5e9"],
  ["#166534", "#22c55e"],
  ["#7c2d12", "#f59e0b"],
  ["#713f12", "#eab308"],
  ["#1e40af", "#6366f1"],
  ["#134e4a", "#14b8a6"],
];

/** Article thumbnail: real image when available, finance-motif gradient otherwise. */
function ArticleThumb({
  image,
  index,
  className,
}: {
  image: string | null;
  index: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const colors = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`shrink-0 bg-(--color-surface-2) object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full text-white/25"
        viewBox="0 0 120 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L20 50 L38 56 L56 34 L78 44 L98 22 L120 30"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export const NewsSection: FC<INewsSectionProps> = ({
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
}) => {
  const [articles, setArticles] = useState<INewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(`/api/news?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then((res) => res.json())
      .then((data: { articles?: INewsArticle[]; error?: string }) => {
        if (!active) return;
        setArticles(Array.isArray(data.articles) ? data.articles : []);
        if (data.error) setError(data.error);
      })
      .catch(() => {
        if (active) setError("Could not load news right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [from, to]);

  const featured = articles[0];
  const rest = articles.slice(1, 6);

  return (
    <section id="news" className="w-full scroll-mt-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-(--color-border) pb-3">
          <div>
            <h2 className="text-xl font-semibold text-(--color-text)">
              Financial news
            </h2>
            <p className="text-sm text-(--color-text-muted)">
              Top stories for {from} &amp; {to} — currencies, rates and markets.
            </p>
          </div>
          <a
            href="#news"
            className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-brand)"
          >
            More news ›
          </a>
        </div>

        {loading && articles.length === 0 ? (
          <NewsSkeleton />
        ) : articles.length === 0 ? (
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-12 text-center">
            <p className="text-sm text-(--color-text-muted)">
              {error
                ? "News is briefly unavailable — please check back soon."
                : `No recent stories for ${from}/${to} right now.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Featured lead story */}
            {featured && (
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-sm transition-all hover:border-(--color-brand)/30 hover:bg-(--color-surface-2)"
              >
                <ArticleThumb
                  image={featured.image}
                  index={0}
                  className="h-52 w-full sm:h-64"
                />
                <div className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-(--color-brand)">
                      {featured.source}
                    </span>
                    {featured.time && (
                      <>
                        <span className="text-(--color-text-dim)">·</span>
                        <span className="text-(--color-text-dim)">
                          {featured.time}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-(--color-text) transition-colors group-hover:text-(--color-brand) sm:text-2xl">
                    {featured.title}
                  </h3>
                  {featured.summary && (
                    <p className="line-clamp-3 text-sm text-(--color-text-muted)">
                      {featured.summary}
                    </p>
                  )}
                </div>
              </a>
            )}

            {/* Headline list */}
            <ul className="divide-y divide-(--color-border) overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
              {rest.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 p-3.5 transition-colors hover:bg-(--color-surface-2)"
                  >
                    <ArticleThumb
                      image={item.image}
                      index={i + 1}
                      className="h-16 w-16 rounded-lg sm:h-[72px] sm:w-[72px]"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-(--color-text) transition-colors group-hover:text-(--color-brand)">
                        {item.title}
                      </h4>
                      <div className="mt-1.5 flex items-center gap-2 text-xs">
                        <span className="font-medium text-(--color-text-muted)">
                          {item.source}
                        </span>
                        {item.time && (
                          <>
                            <span className="text-(--color-text-dim)">·</span>
                            <span className="text-(--color-text-dim)">
                              {item.time}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
        <div className="h-52 w-full animate-pulse bg-(--color-surface-2) sm:h-64" />
        <div className="space-y-3 p-5">
          <div className="h-3 w-24 animate-pulse rounded bg-(--color-surface-2)" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-(--color-surface-2)" />
          <div className="h-4 w-full animate-pulse rounded bg-(--color-surface-2)" />
        </div>
      </div>
      <ul className="divide-y divide-(--color-border) overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-start gap-3 p-3.5">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-(--color-surface-2) sm:h-[72px] sm:w-[72px]" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-full animate-pulse rounded bg-(--color-surface-2)" />
              <div className="h-3 w-20 animate-pulse rounded bg-(--color-surface-2)" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
