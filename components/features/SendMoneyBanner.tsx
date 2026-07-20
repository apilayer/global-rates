"use client";

import { FC } from "react";

export const SendMoneyBanner: FC = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <a
          href="#"
          className="group relative block w-full overflow-hidden rounded-xl border border-(--color-brand)/20 bg-(--color-bg) shadow-2xl shadow-(--color-brand)/5 transition select-none hover:border-(--color-brand)/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-(--color-brand)/20 via-(--color-surface) to-(--color-brand)/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand)/10,_transparent_50%)]" />
          <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-(--color-brand) uppercase">
                Global money transfers
              </p>
              <h3 className="max-w-xl text-xl leading-tight font-extrabold tracking-tight text-(--color-text) sm:text-2xl">
                Send money abroad with the real exchange rate.
              </h3>
              <p className="max-w-md font-sans text-xs text-(--color-text-muted)">
                Fast, secure international transfers to 170+ countries. No hidden fees, no surprises.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-(--color-brand) px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-(--color-brand)/25 transition group-hover:bg-(--color-brand-hover)">
                Send money now
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
              <span className="font-sans text-[10px] text-(--color-text-dim)">No transfer fees on your first send</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
