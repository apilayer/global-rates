"use client";

import { FC } from "react";

interface INewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  time: string;
  trending?: boolean;
}

const news: INewsItem[] = [
  {
    id: "1",
    category: "Markets",
    title: "Fed signals slower rate cuts as inflation lingers",
    summary: "The latest FOMC minutes point to a cautious approach, sending the dollar higher against emerging-market currencies.",
    time: "2h ago",
    trending: true,
  },
  {
    id: "2",
    category: "Emerging Markets",
    title: "Cedi steadies after central bank intervention",
    summary: "The Bank of Ghana's FX auction helped calm volatility, with the GHS holding near recent levels against the US dollar.",
    time: "4h ago",
  },
  {
    id: "3",
    category: "Crypto",
    title: "Bitcoin whipsaws around $110k as ETFs see outflows",
    summary: "Digital assets remain correlated with risk sentiment as macro traders reposition for the second half of the year.",
    time: "6h ago",
  },
  {
    id: "4",
    category: "Commodities",
    title: "Gold slips from record highs on profit-taking",
    summary: "Bullion retreats after touching new all-time peaks, while oil prices hold steady ahead of inventory data.",
    time: "8h ago",
  },
  {
    id: "5",
    category: "Policy",
    title: "ECB poised to cut rates as growth slows",
    summary: "Euro-area PMI weakness is fueling expectations for another quarter-point reduction at the next meeting.",
    time: "10h ago",
  },
  {
    id: "6",
    category: "Africa",
    title: "Naira pressures persist despite FX reforms",
    summary: "Nigeria's parallel market remains wide as authorities balance liquidity support with exchange-rate flexibility.",
    time: "12h ago",
  },
];

export const NewsSection: FC = () => {
  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-(--color-text)">Market news</h2>
            <p className="text-sm text-(--color-text-muted)">
              Headlines moving currencies and markets right now.
            </p>
          </div>
          <a href="#" className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-brand)">
            More ›
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Featured story */}
          <a
            href="#"
            className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-(--color-brand)/30 hover:bg-(--color-surface-2) hover:shadow-md hover:shadow-(--color-brand)/5 lg:col-span-2 lg:min-h-[280px]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-(--color-brand)/5 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute right-4 top-4 rounded-full bg-(--color-brand) px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              {featured.category}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-(--color-text) sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-(--color-text-muted)">
                {featured.summary}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-(--color-text-dim)">
                {featured.trending && (
                  <span className="inline-flex items-center gap-1 text-(--color-up)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    Trending
                  </span>
                )}
                <span>{featured.time}</span>
              </div>
            </div>
          </a>

          {/* Side stories */}
          <div className="flex flex-col gap-3">
              {rest.slice(0, 3).map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className="group flex flex-col gap-1 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-(--color-brand)/30 hover:bg-(--color-surface-2) hover:shadow-md hover:shadow-(--color-brand)/5"
                >
                <div className="flex items-center justify-between gap-2">
                  <span className="w-fit rounded-full bg-(--color-brand-soft) px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-(--color-brand)">
                    {item.category}
                  </span>
                  <span className="text-xs text-(--color-text-dim)">{item.time}</span>
                </div>
                <h4 className="text-sm font-semibold text-(--color-text) line-clamp-2">
                  {item.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
