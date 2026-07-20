"use client";

import { FC, useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

interface IChartSectionProps {
  from: string;
  to: string;
  rate: number;
}

export const ChartSection: FC<IChartSectionProps> = ({ from, to, rate }) => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm md:p-6">
          <div className="mb-4 flex flex-col justify-between gap-2 md:mb-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-(--color-text) md:text-xl">
                {from} to {to} chart
              </h3>
              <p className="text-sm text-(--color-text-muted)">
                12 months of real-time, mid-market rates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md bg-(--color-brand) px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-(--color-brand)/20 transition-colors hover:bg-(--color-brand-hover)">
                Track rate
              </button>
              <a
                href="#"
                className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-colors hover:bg-(--color-surface-3) hover:text-(--color-brand)"
              >
                View full chart
              </a>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 md:gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-up) opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full live-sheen" />
            </span>
            <p className="text-lg font-semibold text-(--color-text) md:text-2xl">
              1 {from} = {formatNumber(rate, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {to}
            </p>
            <ChartTimestamp />
          </div>

          {/* Placeholder chart */}
          <div className="relative min-h-[260px] w-full overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg) p-4 md:min-h-[360px]">
            <svg
              className="h-full w-full"
              viewBox="0 0 800 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,200 C60,190 120,150 180,140 C240,130 300,80 360,70 C420,60 480,90 540,100 C600,110 660,60 720,50 C760,43 800,45 800,45 L800,240 L0,240 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,200 C60,190 120,150 180,140 C240,130 300,80 360,70 C420,60 480,90 540,100 C600,110 660,60 720,50 C760,43 800,45 800,45"
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="2"
              />
              {["Aug 2025", "Oct 2025", "Dec 2025", "Feb 2026", "Apr 2026", "Jul 2026"].map(
                (label, i) => (
                  <text
                    key={label}
                    x={i * 160}
                    y="235"
                    className="text-xs fill-(--color-text-muted)"
                  >
                    {label}
                  </text>
                )
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

function ChartTimestamp() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimestamp(
        `${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} at ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} UTC`
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!timestamp) {
    return (
      <p className="text-sm text-(--color-text-muted)">
        Loading timestamp…
      </p>
    );
  }

  return <p className="text-sm text-(--color-text-muted)">{timestamp}</p>;
}
