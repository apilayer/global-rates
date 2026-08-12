"use client";

import { FC } from "react";

interface IFaq {
  q: string;
  a: string;
}

const faqs: IFaq[] = [
  {
    q: "What is the mid-market rate?",
    a: "The mid-market rate (or interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the fairest, most transparent rate to reference — the same one banks and businesses use to trade with each other. It's shown here for informational purposes.",
  },
  {
    q: "Where do the exchange rates come from?",
    a: "Rates are powered by the Exchange Rates Data API by APILayer, which aggregates real-time and historical foreign-exchange data for 170+ world currencies. The converter, the rate tables and the chart all read from the same live source.",
  },
  {
    q: "How often are the rates updated?",
    a: "The mid-market rates refresh in real time as the markets move. Every conversion you run and every pair you open pulls the latest available rate rather than a cached snapshot.",
  },
  {
    q: "How is my starting currency chosen?",
    a: "On your first visit we detect your country from your IP address (via ipstack) and default the comparison to your local currency against the US Dollar. Nothing is hardcoded — and once you pick a currency yourself, we remember your choice instead.",
  },
  {
    q: "Can I use these rates to send money?",
    a: "GlobalRates is a rate-checking tool, not a money-transfer service. The mid-market rate is great for understanding what a currency is really worth, but providers add a margin, so it's not the rate you'd receive when actually sending money.",
  },
  {
    q: "Do you have historical rates and charts?",
    a: "Yes. The chart shows the pair's movement over the past 12 months, and the underlying API also supports historical lookups and fluctuation data for any date range.",
  },
  {
    q: "Is there an API I can build with?",
    a: "Absolutely — this whole site is a demo of the Exchange Rates Data API by APILayer. You can get a free API key and access the same live and historical FX data that powers GlobalRates.",
  },
];

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
          {faqs.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-(--color-text) transition-colors hover:text-(--color-brand) [&::-webkit-details-marker]:hidden">
                {item.q}
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
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
