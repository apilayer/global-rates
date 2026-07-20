"use client";

import { FC } from "react";
import { formatNumber } from "@/lib/utils";

interface ITickerItem {
  pair: string;
  rate: number;
  change: number;
}

const items: ITickerItem[] = [
  { pair: "EUR/USD", rate: 1.0841, change: 0.12 },
  { pair: "GBP/USD", rate: 1.2743, change: -0.08 },
  { pair: "USD/JPY", rate: 161.55, change: 0.34 },
  { pair: "USD/CAD", rate: 1.3842, change: -0.15 },
  { pair: "AUD/USD", rate: 0.6641, change: 0.21 },
  { pair: "USD/CHF", rate: 0.9012, change: -0.04 },
  { pair: "USD/CNY", rate: 7.2451, change: 0.05 },
  { pair: "USD/ZAR", rate: 18.324, change: -0.42 },
  { pair: "USD/GHS", rate: 15.45, change: 0.18 },
  { pair: "USD/NGN", rate: 1595.0, change: -1.2 },
];

function TickerPill({ item }: { item: ITickerItem }) {
  const up = item.change >= 0;
  return (
    <a
      href="#"
      className="group flex shrink-0 items-center gap-2 text-xs transition-opacity hover:opacity-80"
    >
      <span className="font-semibold text-(--color-text)">{item.pair}</span>
      <span className="tabular text-(--color-text-muted)">
        {formatNumber(item.rate, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
      </span>
      <span className={`tabular font-medium ${up ? "text-(--color-up)" : "text-(--color-down)"}`}>
        {up ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
      </span>
    </a>
  );
}

export const TickerTape: FC = () => {
  const track = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-(--color-border) bg-(--color-surface) py-1">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-(--color-surface) to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-(--color-surface) to-transparent" />
      <div className="marquee-track flex w-max gap-6 py-1.5 px-4">
        {track.map((item, i) => (
          <TickerPill key={`${item.pair}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
};
