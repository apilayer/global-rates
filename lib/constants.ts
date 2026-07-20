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
