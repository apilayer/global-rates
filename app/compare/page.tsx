"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TickerTape } from "@/components/layout/TickerTape";
import { Footer } from "@/components/layout/Footer";
import { ApiBanner } from "@/components/features/ApiBanner";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";
import { currencyService } from "@/services/currency.service";
import { CURRENCIES } from "@/lib/constants";
import { buildQuotes } from "@/lib/providers";
import { formatNumber } from "@/lib/utils";

export default function ComparePage() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("GHS");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (from === to) {
      setRate(1);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await currencyService.convert(from, to, "1");
        if (active) setRate(data.info.rate);
      } catch {
        if (active) setRate(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [from, to]);

  const numericAmount = Number(amount) || 0;
  const quotes = rate ? buildQuotes(rate, numericAmount) : [];
  const midReceived = rate ? numericAmount * rate : 0;
  const fromMeta = CURRENCIES[from];
  const toMeta = CURRENCIES[to];

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TickerTape />

      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6">
          {/* Hero */}
          <section className="relative -mx-4 overflow-hidden border-b border-(--color-border) px-8 pb-8 pt-4 sm:-mx-6 sm:rounded-2xl sm:border sm:px-12 sm:pb-9 sm:pt-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-brand)/16,_transparent_55%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-(--color-brand)">
                Forex comparison
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-(--color-text) sm:text-4xl">
                Compare forex &amp; money-transfer rates
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-(--color-text-muted) sm:text-base">
                Enter a pair and amount to see the live mid-market rate, then
                compare what leading forex and remittance providers would give
                you — and jump straight to their site.
              </p>

              {/* Input card */}
              <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-xl shadow-black/20 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-[1.4fr_auto_1fr_auto_1fr]">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
                      You send
                    </span>
                    <div className="flex items-center gap-1 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-2xl font-semibold text-(--color-text) focus-within:border-(--color-brand)">
                      <span className="shrink-0 text-(--color-text-muted)">
                        {fromMeta?.symbol}
                      </span>
                      <input
                        value={amount}
                        onChange={handleAmount}
                        inputMode="decimal"
                        aria-label="Amount to send"
                        className="w-full min-w-0 bg-transparent tabular focus:outline-none"
                      />
                    </div>
                  </label>

                  <div className="flex items-end justify-center pb-1">
                    <CurrencyPicker value={from} onChange={setFrom} label="From" />
                  </div>

                  <div className="flex items-end justify-center pb-3">
                    <button
                      type="button"
                      onClick={swap}
                      aria-label="Swap currencies"
                      className="grid size-9 place-items-center rounded-full border border-(--color-border) bg-(--color-surface-2) text-(--color-text-muted) transition-colors hover:border-(--color-brand) hover:text-(--color-brand)"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 17 17">
                        <path
                          fillRule="evenodd"
                          d="m11.726 1.273 2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-end pb-1">
                    <CurrencyPicker value={to} onChange={setTo} label="To" />
                  </div>
                </div>

                {/* Mid-market reference */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-(--color-border) pt-4 text-sm">
                  <span className="text-(--color-text-muted)">
                    Mid-market rate{" "}
                    <span className="font-semibold text-(--color-text)">
                      {rate
                        ? `1 ${from} = ${formatNumber(rate, { maximumFractionDigits: 6 })} ${to}`
                        : loading
                        ? "loading…"
                        : "unavailable"}
                    </span>
                  </span>
                  {rate && (
                    <span className="text-(--color-text-muted)">
                      At mid-market you&apos;d get{" "}
                      <span className="font-semibold text-(--color-up)">
                        {formatNumber(midReceived, { maximumFractionDigits: 2 })} {to}
                      </span>{" "}
                      <span className="text-(--color-text-dim)">(reference only)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-(--color-text)">
                  Provider comparison
                </h2>
                <p className="text-sm text-(--color-text-muted)">
                  What you&apos;d receive sending{" "}
                  {formatNumber(numericAmount, { maximumFractionDigits: 2 })} {from} to{" "}
                  {toMeta?.name ?? to}, ranked best first.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-(--color-border) bg-(--color-surface)">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-(--color-surface-2)/70 text-(--color-text-muted)">
                  <tr className="border-b border-(--color-border)">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Their rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Transfer time</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">You receive</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">vs lowest</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border)/60">
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-(--color-text-muted)">
                        {loading ? "Fetching live rate…" : "Enter an amount and pair to compare."}
                      </td>
                    </tr>
                  )}
                  {quotes.map((q) => (
                    <tr
                      key={q.name}
                      className={`transition-colors hover:bg-(--color-surface-2)/50 ${
                        q.isBest ? "bg-(--color-up)/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-(--color-text)">{q.name}</span>
                          {q.isBest && (
                            <span className="rounded bg-(--color-up)/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-(--color-up)">
                              Best
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-(--color-text-dim)">{q.tagline}</span>
                      </td>
                      <td className="px-4 py-3 text-right tabular text-(--color-text-muted)">
                        {formatNumber(q.effectiveRate, { maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-4 py-3 text-right tabular text-(--color-text-muted)">
                        {q.fee === 0 ? (
                          <span className="text-(--color-up)">Free</span>
                        ) : (
                          `${formatNumber(q.fee, { maximumFractionDigits: 2 })} ${from}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-left text-(--color-text-muted)">{q.transferTime}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular text-(--color-text)">
                        {formatNumber(q.received, { maximumFractionDigits: 2 })} {to}
                      </td>
                      <td className="px-4 py-3 text-right tabular">
                        {q.savingsVsWorst > 0 ? (
                          <span className="text-(--color-up)">
                            +{formatNumber(q.savingsVsWorst, { maximumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-(--color-text-dim)">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-colors hover:border-(--color-brand) hover:text-(--color-brand)"
                        >
                          Visit
                          <span aria-hidden="true">↗</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-(--color-text-dim)">
              Mid-market rate is live via the Exchange Rates Data API. Provider
              rates and fees are representative estimates for comparison, not
              live quotes — always confirm the final rate on the provider&apos;s
              own site.
            </p>
          </section>

          <ApiBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
