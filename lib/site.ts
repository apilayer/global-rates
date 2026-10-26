/**
 * Canonical facts about this site, deliberately decoupled from routing.
 * NEXT_PUBLIC_BASE_PATH says where Next serves the app from; these say what a
 * crawler should be told about it.
 */
const DEFAULT_ORIGIN = "https://apilayer.com";
const DEFAULT_PATH = "/devtools/globalrates";

export const SITE = {
  name: "GlobalRates",
  origin: (process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, ""),
  publicPath: (process.env.NEXT_PUBLIC_SITE_PATH ?? DEFAULT_PATH).replace(/\/$/, ""),
  tagline: "What is the exchange rate today?",
  description:
    "Convert any amount between 170+ world currencies at live mid-market rates, see how the rate has moved over time, and compare what money transfer providers actually pay out. Free, no sign-up, powered by the Exchangerates API.",
  locale: "en_US",
} as const;

export const SITE_URL = `${SITE.origin}${SITE.publicPath}`;
