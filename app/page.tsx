"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TickerTape } from "@/components/layout/TickerTape";
import { SubNav } from "@/components/layout/SubNav";
import { Footer } from "@/components/layout/Footer";
import { ConverterWidget } from "@/components/features/ConverterWidget";
import { ApiBanner } from "@/components/features/ApiBanner";
import { ConversionTables } from "@/components/features/ConversionTables";
import { ChartSection } from "@/components/features/ChartSection";
import { LiveCurrencyCharts } from "@/components/features/LiveCurrencyCharts";
import { NewsSection } from "@/components/features/NewsSection";
import { FAQSection } from "@/components/features/FAQSection";
import { currencyService } from "@/services/currency.service";
import { PAIR_STORAGE_KEY, CURRENCIES } from "@/lib/constants";

// USD is the fixed anchor; the counterpart currency comes from the visitor's
// ipstack location (see the geo effect below). EUR is only a neutral pre-geo /
// US-visitor fallback — the local currency is never hardcoded.
const DEFAULT_FROM = "USD";
const DEFAULT_TO = "EUR";

export default function Home() {
  // The selected pair is owned here so the converter, tables, chart, hero and
  // news all stay in sync — and clicking a popular-pair card drives everything.
  const [pair, setPair] = useState<{ from: string; to: string }>({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });
  const [rate, setRate] = useState<number>(1);
  const [amount, setAmount] = useState<string>("1");

  const { from, to } = pair;

  const scrollToId = (id: string) => {
    if (typeof document !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const selectAmount = (value: number) => {
    setAmount(String(value));
    scrollToId("converter");
  };

  // On first load, restore the saved pair — or, if there's none, default the
  // "from" currency to the visitor's location (via ipstack).
  useEffect(() => {
    let active = true;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(PAIR_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (stored) {
      const [f, t] = stored.split("_");
      if (f && t) setPair({ from: f, to: t });
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/geo");
        const data = (await res.json()) as { currency?: string | null };
        // Check the visitor's local currency against USD. USD stays the base;
        // the counterpart is whatever ipstack resolves (never hardcoded).
        if (
          active &&
          data.currency &&
          CURRENCIES[data.currency] &&
          data.currency !== "USD"
        ) {
          setPair({ from: "USD", to: data.currency });
        }
      } catch {
        // keep the default pair
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Refresh the mid-market rate whenever the pair changes.
  useEffect(() => {
    if (from === to) {
      setRate(1);
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await currencyService.convert(from, to, "1");
        if (active) setRate(data.info.rate);
      } catch {
        // keep previous rate
      }
    })();
    return () => {
      active = false;
    };
  }, [from, to]);

  // Apply a pair the USER explicitly chose (and remember it). The geo default
  // deliberately does NOT persist, so detection keeps working on later visits.
  const applyUserPair = (next: { from: string; to: string }) => {
    setPair(next);
    try {
      localStorage.setItem(PAIR_STORAGE_KEY, `${next.from}_${next.to}`);
    } catch {
      // ignore
    }
  };
  const setFrom = (code: string) => applyUserPair({ from: code, to });
  const setTo = (code: string) => applyUserPair({ from, to: code });
  const swap = () => applyUserPair({ from: to, to: from });
  const selectPair = (nextFrom: string, nextTo: string) => {
    applyUserPair({ from: nextFrom, to: nextTo });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TickerTape />
      <SubNav />

      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-8 space-y-8">
          {/* Hero — WorldRemit-style converter lead */}
          <section id="top" className="relative -mx-4 scroll-mt-28 overflow-hidden rounded-none border-b border-(--color-border) px-8 pb-8 pt-4 sm:-mx-6 sm:rounded-2xl sm:border sm:px-12 sm:pb-9 sm:pt-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-brand)/16,_transparent_55%)]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-(--color-brand)/10 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_minmax(380px,440px)] lg:gap-12">
              {/* Left — heading + copy */}
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-(--color-text-muted)">
                  <span>Currency converter</span>
                  <span className="text-(--color-text-dim)">/</span>
                  <span className="text-(--color-text)">{from} → {to}</span>
                </div>

                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-(--color-text) sm:text-4xl lg:text-5xl">
                  Convert {CURRENCIES[from]?.name ?? from} to{" "}
                  {CURRENCIES[to]?.name ?? to}
                </h1>
                <p className="mt-3 max-w-md text-sm text-(--color-text-muted) sm:text-base">
                  Convert {CURRENCIES[from]?.name ?? from} to{" "}
                  {CURRENCIES[to]?.name ?? to} with the GlobalRates currency
                  converter and check the latest {from} to {to} exchange rates
                  for free.
                </p>

                <div className="mt-5">
                  <PageMeta from={from} to={to} rate={rate} />
                </div>

                <p className="mt-4 flex max-w-md items-start gap-1.5 text-xs text-(--color-text-muted)">
                  <svg
                    className="mt-px h-3.5 w-3.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                  </svg>
                  <span>
                    We use the mid-market rate for informational purposes. It
                    updates in real time as markets move.{" "}
                    <span className="underline">Learn how rates are set</span>
                  </span>
                </p>
              </div>

              {/* Right — converter card */}
              <div id="converter" className="scroll-mt-28">
                <ConverterWidget
                  from={from}
                  to={to}
                  amount={amount}
                  onAmountChange={setAmount}
                  onFromChange={setFrom}
                  onToChange={setTo}
                  onSwap={swap}
                />
              </div>
            </div>
          </section>

          <ApiBanner />
          <ConversionTables
            from={from}
            to={to}
            rate={rate}
            onSelectAmount={selectAmount}
          />
          {/* News sits directly under the conversion-rate tables */}
          <NewsSection from={from} to={to} />
          <div id="charts" className="scroll-mt-24">
            <ChartSection from={from} to={to} rate={rate} />
          </div>
          <LiveCurrencyCharts from={from} activeTo={to} onSelectPair={selectPair} />
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PageMeta({ from, to, rate }: { from: string; to: string; rate: number }) {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDate(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-(--color-text-muted)">
      <span>
        Mid-market rate{" "}
        <span className="font-medium text-(--color-text)">1 {from} = {rate.toFixed(4)} {to}</span>
      </span>
      {date && (
        <span>
          As of{" "}
          <span className="text-(--color-text) tabular">{date}</span>
        </span>
      )}
    </div>
  );
}
