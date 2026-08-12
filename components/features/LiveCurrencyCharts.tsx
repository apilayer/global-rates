"use client";

import { FC, useEffect, useState } from "react";
import { CURRENCIES, POPULAR_PAIRS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

interface ILiveCurrencyChartsProps {
  from: string;
  activeTo?: string;
  onSelectPair?: (from: string, to: string) => void;
}

interface IFluctuation {
  rate: number;
  changePct: number;
  up: boolean;
}

export const LiveCurrencyCharts: FC<ILiveCurrencyChartsProps> = ({
  from,
  activeTo,
  onSelectPair,
}) => {
  const pairs = POPULAR_PAIRS.filter((p) => p.to !== from);
  const [data, setData] = useState<Record<string, IFluctuation>>({});

  // Real mid-market rates + weekly moves from the fluctuation endpoint.
  useEffect(() => {
    let active = true;
    const symbols = pairs.map((p) => p.to).join(",");
    fetch(`/api/fluctuation?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(symbols)}`)
      .then((r) => r.json())
      .then((d: { rates?: Record<string, IFluctuation> }) => {
        if (active && d.rates) setData(d.rates);
      })
      .catch(() => {
        /* leave cards in their loading state */
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-(--color-text)">
              More live {from} currency charts
            </h3>
            <p className="text-sm text-(--color-text-muted)">
              Mid-market rates and weekly moves for popular currency pairs.
            </p>
          </div>
          <a href="#charts" className="hidden text-sm text-(--color-text-muted) transition-colors hover:text-(--color-brand) sm:inline">
            View all ›
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pairs.map((pair) => {
            const meta = CURRENCIES[pair.to];
            const entry = data[pair.to];
            const isActive = activeTo === pair.to;
            return (
              <button
                key={pair.to}
                type="button"
                onClick={() => onSelectPair?.(from, pair.to)}
                aria-pressed={isActive}
                className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-(--color-surface) p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-(--color-brand)/30 hover:bg-(--color-surface-2) hover:shadow-md hover:shadow-(--color-brand)/5 ${
                  isActive
                    ? "border-(--color-brand) ring-1 ring-(--color-brand)/40"
                    : "border-(--color-border)"
                }`}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-(--color-brand)/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta?.flag}</span>
                  <span className="text-sm font-semibold text-(--color-text)">
                    {from}/{pair.to}
                  </span>
                </div>
                <p className="text-sm text-(--color-text-muted)">1 {from} equals</p>
                <p className="text-xl font-semibold text-(--color-text) sm:text-2xl">
                  {entry ? (
                    <>
                      {formatNumber(entry.rate, { minimumFractionDigits: 3, maximumFractionDigits: 6 })} {pair.to}
                    </>
                  ) : (
                    <span className="inline-block h-6 w-24 animate-pulse rounded bg-(--color-surface-2) align-middle" />
                  )}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-(--color-text-muted)">
                    {entry ? (
                      <>
                        <span className={entry.up ? "text-(--color-up)" : "text-(--color-down)"}>
                          {entry.up ? "▲" : "▼"} {Math.abs(entry.changePct).toFixed(2)}%
                        </span>{" "}
                        Weekly
                      </>
                    ) : (
                      <span className="text-(--color-text-dim)">Weekly</span>
                    )}
                  </p>
                  <span className="group flex items-center text-sm font-semibold text-(--color-brand)">
                    Chart
                    <svg
                      className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
