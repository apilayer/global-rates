"use client";

import { FC } from "react";
import { FAQ_DATA } from "@/lib/faq";


export const FAQSection: FC = () => {
  return (
    <section id="faq" className="w-full scroll-mt-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-4 border-b border-(--color-border) pb-3">
          <h2 className="text-xl font-semibold text-(--color-text)">
            Frequently asked questions
          </h2>
          <p className="text-sm text-(--color-text-muted)">
            Everything you need to know about our rates, data and coverage.
          </p>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-(--color-border) overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
          {FAQ_DATA.map((item) => (
            <details key={item.id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-(--color-text) transition-colors hover:text-(--color-brand) [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  className="h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-(--color-text-muted)">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
