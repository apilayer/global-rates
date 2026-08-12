"use client";

import { FC } from "react";
import { ApiLayerLogo } from "@/components/ui/ApiLayerLogo";

/** Inline product wordmark for the Exchange Rates Data API, in white. */
function ExchangeRatesApiWordmark() {
  return (
    <span className="inline-flex items-center gap-1.5 leading-none text-white">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 8h13l-3-3" />
        <path d="M20 16H7l3 3" />
      </svg>
      <span className="text-sm font-bold tracking-tight">exchangeratesapi</span>
    </span>
  );
}

export const ApiBanner: FC = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <a
          href="http://exchangeratesapi.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full select-none overflow-hidden rounded-xl border border-(--color-brand)/30 shadow-2xl transition hover:border-(--color-brand)/70"
        >
          {/* Dimmed markets photo backdrop (falls back to the gradient if it fails to load) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c44]/92 via-[#070b18]/88 to-(--color-brand)/30" />
          <svg
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-2/3 text-(--color-brand)/25"
            viewBox="0 0 400 160"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 120 L60 100 L110 115 L160 70 L220 90 L280 40 L340 55 L400 20"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExchangeRatesApiWordmark />
                <span className="h-4 w-px bg-white/25" />
                <ApiLayerLogo size={16} invert />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6AA0FF]">
                Real-time &amp; historical FX rates API
              </p>
              <h3 className="max-w-xl text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                Live &amp; historical exchange rates,
                <br className="hidden sm:block" /> straight from the source.
              </h3>
              <p className="max-w-md font-sans text-xs text-white/60">
                170+ world currencies · 25 years of history · the same APILayer
                API that powers this converter.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-(--color-brand) px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-(--color-brand)/25 transition group-hover:bg-(--color-brand-hover)">
                Get Your API Key
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
              <span className="font-sans text-[10px] text-white/50">
                exchangeratesapi, powered by APILayer
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
