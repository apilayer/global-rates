"use client";

import { FC } from "react";

interface IFaq {
  q: string;
  a: string;
}

const faqs: IFaq[] = [
  {
    q: "What is GlobalRates?",
    a: "GlobalRates is a free currency converter and exchange rate tool for checking current rates between global currencies. You can convert currencies, compare popular currency pairs, and explore exchange rate charts. GlobalRates is powered by Exchangerates API, giving developers access to the exchange rate data behind the tool.",
  },
  {
    q: "What is the data source for GlobalRates?",
    a: "GlobalRates is powered by Exchangerates API from APILayer. The currency converter, exchange rate tables, and charts use exchange rate data provided by the API. Developers can access this data programmatically through Exchangerates API to add currency conversion and foreign exchange data to their own applications.",
  },
  {
    q: "What is a currency exchange rate?",
    a: "A currency exchange rate represents how much one currency is worth in another currency. For example, a USD/EUR exchange rate shows the value of one US dollar in euros. GlobalRates lets you quickly check exchange rates and convert amounts between currencies using the latest available data.",
  },
  {
    q: "What is Exchangerates API?",
    a: "Exchangerates API is a REST API that provides real-time and historical foreign exchange rates and currency conversion data. Developers can use it to access exchange rates for hundreds of currencies and integrate currency data directly into websites, apps, financial platforms, and other software.",
  },
  {
    q: "How can I get exchange rates using an API?",
    a: "You can use Exchangerates API to retrieve exchange rate data programmatically through REST API requests. Depending on your use case and plan, you can access current rates, convert currencies, retrieve historical exchange rates, and work with time-series and currency fluctuation data.",
  },
  {
    q: "Can I get historical exchange rates with Exchangerates API?",
    a: "Yes. Exchangerates API supports historical exchange rate data, allowing developers to retrieve rates for previous dates. Historical FX data can be useful for financial reporting, accounting, analytics, price comparisons, currency trend analysis, and applications that need to understand how exchange rates have changed over time.",
  },
  {
    q: "What can I build with Exchangerates API?",
    a: "Exchangerates API can be used to build currency converters, financial dashboards, international pricing tools, accounting software, travel apps, e-commerce platforms, analytics tools, and other applications that need exchange rate data. It provides structured currency data that developers can integrate directly into their products.",
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
