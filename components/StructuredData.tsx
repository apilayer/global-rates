import { FAQ_DATA } from "@/lib/faq";
import { SITE, SITE_URL } from "@/lib/site";

/** One JSON-LD `@graph`, so a parser sees one connected description. */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE.origin}/#org` },
        featureList: [
          "Convert between 170+ world currencies at live rates",
          "Historical exchange rate charts",
          "Currency fluctuation over a date range",
          "Side-by-side comparison of money transfer payouts",
          "Precious metals pricing",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${SITE.origin}/#org` },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${SITE.origin}/#org`,
        name: "APILayer",
        url: "https://apilayer.com/",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ_DATA.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/#howto`,
        name: "How to convert one currency into another",
        description:
          "Convert an amount between two currencies at the live mid-market rate.",
        totalTime: "PT10S",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter the amount",
            text: "Type the amount you want to convert.",
          },
          {
            "@type": "HowToStep",
            name: "Pick both currencies",
            text: "Choose the currency you are converting from and the one you are converting to. Your home currency is detected automatically.",
          },
          {
            "@type": "HowToStep",
            name: "Read the rate, then the payout",
            text: "The converted amount uses the mid-market rate. Compare that against what transfer providers actually pay out, which is usually lower.",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
