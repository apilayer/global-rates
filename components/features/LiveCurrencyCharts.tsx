"use client";

import { FC } from "react";
import { CURRENCIES, POPULAR_PAIRS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

interface ILiveCurrencyChartsProps {
  from: string;
}

const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.8764,
  GBP: 0.7451,
  JPY: 162.56,
  CAD: 1.406,
  AUD: 1.428,
  CHF: 0.8102,
  CNY: 6.7717,
  ZAR: 16.515,
};

const mockChanges: Record<string, { value: number; pct: number; up: boolean }> = {
  EUR: { value: -0.0005, pct: 0.06, up: false },
  GBP: { value: -0.0022, pct: 0.29, up: false },
  JPY: { value: 0.2485, pct: 0.15, up: true },
  CAD: { value: -0.0081, pct: 0.57, up: false },
  AUD: { value: -0.0141, pct: 0.98, up: false },
  CHF: { value: -0.002, pct: 0.25, up: false },
  CNY: { value: -0.0081, pct: 0.12, up: false },
  ZAR: { value: 0.1165, pct: 0.71, up: true },
};

export const LiveCurrencyCharts: FC<ILiveCurrencyChartsProps> = ({ from }) => {
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
          <a href="#" className="hidden text-sm text-(--color-text-muted) transition-colors hover:text-(--color-brand) sm:inline">
            View all ›
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {POPULAR_PAIRS.filter((p) => p.to !== from).map((pair) => {
            const meta = CURRENCIES[pair.to];
            const rate = mockRates[pair.to] ?? 0;
            const change = mockChanges[pair.to] ?? { value: 0, pct: 0, up: true };
            return (
              <a
                key={pair.to}
                href="#"
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-(--color-brand)/30 hover:bg-(--color-surface-2) hover:shadow-md hover:shadow-(--color-brand)/5"
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
                  {formatNumber(rate, { minimumFractionDigits: 3, maximumFractionDigits: 6 })} {pair.to}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-(--color-text-muted)">
                    <span className={change.up ? "text-(--color-up)" : "text-(--color-down)"}>
                      {change.up ? "▲" : "▼"} {Math.abs(change.pct).toFixed(2)}%
                    </span>{" "}
                    Weekly
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
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
