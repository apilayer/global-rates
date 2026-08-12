export const APP_NAME = "GlobalRates.io";
export const APP_DESCRIPTION = "Xe currency converter";

export interface ICurrencyMeta {
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Record<string, ICurrencyMeta> = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  CHF: { name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  CNY: { name: "Chinese Yuan Renminbi", symbol: "¥", flag: "🇨🇳" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  MXN: { name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  GHS: { name: "Ghanaian Cedi", symbol: "GH₵", flag: "🇬🇭" },
  NGN: { name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  KES: { name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  AED: { name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  SAR: { name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  SEK: { name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  NOK: { name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  DKK: { name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  PLN: { name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  TRY: { name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  THB: { name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  PHP: { name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  RUB: { name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
};

export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "GHS";
export const DEFAULT_AMOUNT = "1";

/**
 * localStorage key for the user's explicitly-chosen pair. Only written when the
 * user actively changes currencies — never for the geo-detected default — so
 * ipstack detection keeps working until the user makes a choice. (v2 drops any
 * value written by the earlier always-persist logic.)
 */
export const PAIR_STORAGE_KEY = "globalrates-pair-v2";

/**
 * ISO-3166 country code → default currency, limited to the currencies this app
 * supports. Used to pick a sensible default "from" currency from the visitor's
 * ipstack-detected location. Eurozone members all map to EUR.
 */
const EUROZONE = [
  "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR",
];

export const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  JP: "JPY",
  AU: "AUD",
  CA: "CAD",
  CH: "CHF",
  CN: "CNY",
  IN: "INR",
  MX: "MXN",
  BR: "BRL",
  ZA: "ZAR",
  GH: "GHS",
  NG: "NGN",
  KE: "KES",
  AE: "AED",
  SA: "SAR",
  SG: "SGD",
  HK: "HKD",
  NZ: "NZD",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  TR: "TRY",
  KR: "KRW",
  TH: "THB",
  ID: "IDR",
  MY: "MYR",
  PH: "PHP",
  RU: "RUB",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR"])),
};

/** Map an ISO country code to a supported currency, defaulting to USD. */
export function countryToCurrency(countryCode: string | null | undefined): string {
  if (!countryCode) return "USD";
  const cur = COUNTRY_CURRENCY[countryCode.toUpperCase()];
  return cur && CURRENCIES[cur] ? cur : "USD";
}

/**
 * News search terms per currency, most-specific first. Mediastack treats
 * comma-separated keywords as AND (so combining terms returns nothing), so we
 * query ONE term at a time and fall back to the broader term if the specific
 * one returns no articles.
 */
export const NEWS_TERMS: Record<string, string[]> = {
  USD: ["dollar", "US economy"],
  EUR: ["euro", "eurozone"],
  GBP: ["pound sterling", "UK economy"],
  JPY: ["yen", "Japan economy"],
  AUD: ["Australian dollar", "Australia economy"],
  CAD: ["Canadian dollar", "Canada economy"],
  CHF: ["Swiss franc", "Switzerland"],
  CNY: ["yuan", "China economy"],
  INR: ["rupee", "India economy"],
  MXN: ["Mexican peso", "Mexico economy"],
  BRL: ["Brazilian real", "Brazil economy"],
  ZAR: ["rand", "South Africa"],
  GHS: ["cedi", "Ghana"],
  NGN: ["naira", "Nigeria"],
  KES: ["Kenyan shilling", "Kenya"],
  AED: ["dirham", "UAE"],
  SAR: ["riyal", "Saudi Arabia"],
  SGD: ["Singapore dollar", "Singapore"],
  HKD: ["Hong Kong dollar", "Hong Kong"],
  NZD: ["New Zealand dollar", "New Zealand"],
  SEK: ["krona", "Sweden"],
  NOK: ["Norwegian krone", "Norway"],
  DKK: ["Danish krone", "Denmark"],
  PLN: ["zloty", "Poland"],
  TRY: ["lira", "Turkey"],
  KRW: ["won", "South Korea"],
  THB: ["baht", "Thailand"],
  IDR: ["rupiah", "Indonesia"],
  MYR: ["ringgit", "Malaysia"],
  PHP: ["Philippine peso", "Philippines"],
  RUB: ["ruble", "Russia"],
};

/**
 * Pick the more newsworthy side of the pair (the non-USD currency when
 * present) and return its search terms, most-specific first.
 */
export function newsTermsForPair(from: string, to: string): string[] {
  const pick = to !== "USD" ? to : from;
  return (
    NEWS_TERMS[pick] ??
    NEWS_TERMS[to] ??
    NEWS_TERMS[from] ?? ["forex", "exchange rate"]
  );
}

export const CONVERTER_TABLE_AMOUNTS = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

export const POPULAR_PAIRS = [
  { to: "USD", name: "US Dollar" },
  { to: "EUR", name: "Euro" },
  { to: "GBP", name: "British Pound" },
  { to: "JPY", name: "Japanese Yen" },
  { to: "CAD", name: "Canadian Dollar" },
  { to: "AUD", name: "Australian Dollar" },
  { to: "CHF", name: "Swiss Franc" },
  { to: "CNY", name: "Chinese Yuan Renminbi" },
  { to: "ZAR", name: "South African Rand" },
];
