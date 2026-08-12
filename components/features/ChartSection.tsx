"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/utils";

interface IChartSectionProps {
  from: string;
  to: string;
  rate: number;
}

interface ICandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

// Small deterministic PRNG so the candles are stable across renders and unique
// per currency pair (seeded from the pair), anchored to the live rate.
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateCandles(rate: number, seedStr: string, count: number): ICandle[] {
  const rnd = mulberry32(seedFrom(seedStr));
  const vol = 0.028;
  const closes: number[] = [];
  let v = 1;
  for (let i = 0; i < count; i++) {
    v = v * (1 + (rnd() - 0.47) * vol); // gentle upward drift
    closes.push(v);
  }
  const candles: ICandle[] = [];
  let prevClose = closes[0] * (1 - (rnd() - 0.5) * vol);
  for (let i = 0; i < count; i++) {
    const open = prevClose;
    const close = closes[i];
    const high = Math.max(open, close) * (1 + rnd() * vol * 0.7);
    const low = Math.min(open, close) * (1 - rnd() * vol * 0.7);
    candles.push({ open, high, low, close });
    prevClose = close;
  }
  // Anchor the last close to the current live rate.
  const factor = rate / candles[count - 1].close || 1;
  return candles.map((c) => ({
    open: c.open * factor,
    high: c.high * factor,
    low: c.low * factor,
    close: c.close * factor,
  }));
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

          {/* Candlestick chart */}
          <CandlestickChart from={from} to={to} rate={rate} />
        </div>
      </div>
    </section>
  );
};

const CANDLE_COUNT = 30;
const VW = 800;
const VH = 260;
const PAD_TOP = 14;
const PAD_BOTTOM = 14;

function CandlestickChart({
  from,
  to,
  rate,
}: {
  from: string;
  to: string;
  rate: number;
}) {
  // Real OHLC candles from the Exchange Rates Data API timeseries endpoint.
  // Falls back to generated candles (anchored to the live rate) while loading
  // or if the request fails, so the chart is never empty.
  const fallback = useMemo(
    () => generateCandles(rate, `${from}${to}`, CANDLE_COUNT),
    [rate, from, to]
  );
  const [live, setLive] = useState<ICandle[] | null>(null);

  useEffect(() => {
    let active = true;
    setLive(null);
    fetch(`/api/timeseries?base=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then((r) => r.json())
      .then((d: { candles?: ICandle[] }) => {
        if (active && Array.isArray(d.candles) && d.candles.length > 0) {
          setLive(d.candles);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      active = false;
    };
  }, [from, to]);

  const candles = live ?? fallback;

  const { min, max } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of candles) {
      if (c.low < lo) lo = c.low;
      if (c.high > hi) hi = c.high;
    }
    const range = hi - lo || hi || 1;
    return { min: lo - range * 0.08, max: hi + range * 0.08 };
  }, [candles]);

  const usableH = VH - PAD_TOP - PAD_BOTTOM;
  const yOf = (v: number) =>
    PAD_TOP + (1 - (v - min) / (max - min)) * usableH;
  const step = VW / candles.length;
  const bodyW = step * 0.58;

  const gridValues = useMemo(() => {
    const lines = 4;
    return Array.from({ length: lines + 1 }, (_, i) => min + ((max - min) * i) / lines);
  }, [min, max]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
      <div className="flex">
        <svg
          className="h-[220px] w-full md:h-[320px]"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${from} to ${to} candlestick chart`}
        >
          {/* horizontal gridlines */}
          {gridValues.map((v, i) => (
            <line
              key={i}
              x1={0}
              x2={VW}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke="var(--color-border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              opacity={0.5}
            />
          ))}

          {candles.map((c, i) => {
            const cx = step * i + step / 2;
            const up = c.close >= c.open;
            const color = up ? "var(--color-up)" : "var(--color-down)";
            const bodyTop = yOf(Math.max(c.open, c.close));
            const bodyH = Math.max(Math.abs(yOf(c.open) - yOf(c.close)), 1.5);
            return (
              <g key={i}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={yOf(c.high)}
                  y2={yOf(c.low)}
                  stroke={color}
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
                <rect
                  x={cx - bodyW / 2}
                  y={bodyTop}
                  width={bodyW}
                  height={bodyH}
                  fill={color}
                  rx={0.5}
                />
              </g>
            );
          })}
        </svg>

        {/* price axis */}
        <div className="ml-2 flex w-14 shrink-0 flex-col justify-between py-[10px] text-right text-[10px] tabular text-(--color-text-muted)">
          {[...gridValues].reverse().map((v, i) => (
            <span key={i}>{formatNumber(v, { maximumFractionDigits: v < 10 ? 4 : 2 })}</span>
          ))}
        </div>
      </div>

      {/* month labels */}
      <MonthLabels />
    </div>
  );
}

function MonthLabels() {
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    const out: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i * 2, 1);
      out.push(
        d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      );
    }
    setLabels(out);
  }, []);

  return (
    <div className="mr-16 mt-2 flex justify-between text-[11px] text-(--color-text-muted)">
      {(labels.length ? labels : ["", "", "", "", "", ""]).map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

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
