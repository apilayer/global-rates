export interface IForexProvider {
  name: string;
  url: string;
  /** Typical FX margin below mid-market (e.g. 0.005 = 0.5%). */
  marginPct: number;
  /** Flat transfer fee, expressed in the send ("from") currency. */
  fee: number;
  transferTime: string;
  tagline: string;
}

/**
 * Curated forex / money-transfer providers. The margin and fee figures are
 * representative estimates used to illustrate how much of the mid-market rate
 * each provider typically passes on — they are NOT live provider quotes.
 * Deterministic (no randomness) so the comparison is stable.
 */
export const FOREX_PROVIDERS: IForexProvider[] = [
  {
    name: "Wise",
    url: "https://wise.com/",
    marginPct: 0.0045,
    fee: 3.2,
    transferTime: "Minutes – hours",
    tagline: "Transparent mid-market pricing",
  },
  {
    name: "Revolut",
    url: "https://www.revolut.com/",
    marginPct: 0.0055,
    fee: 0,
    transferTime: "Instant – 1 day",
    tagline: "Fee-free within plan limits",
  },
  {
    name: "Sendwave",
    url: "https://www.sendwave.com/",
    marginPct: 0.009,
    fee: 0,
    transferTime: "Within minutes",
    tagline: "No transfer fees",
  },
  {
    name: "OFX",
    url: "https://www.ofx.com/",
    marginPct: 0.012,
    fee: 0,
    transferTime: "1 – 2 days",
    tagline: "No fees, good for large amounts",
  },
  {
    name: "Remitly",
    url: "https://www.remitly.com/",
    marginPct: 0.011,
    fee: 1.99,
    transferTime: "Minutes – 3 days",
    tagline: "Express & economy options",
  },
  {
    name: "WorldRemit",
    url: "https://www.worldremit.com/",
    marginPct: 0.013,
    fee: 2.99,
    transferTime: "Minutes – 1 day",
    tagline: "150+ countries",
  },
  {
    name: "Ria Money Transfer",
    url: "https://www.riamoneytransfer.com/",
    marginPct: 0.016,
    fee: 3.5,
    transferTime: "Minutes – 1 day",
    tagline: "Large cash-pickup network",
  },
  {
    name: "Xe",
    url: "https://www.xe.com/",
    marginPct: 0.019,
    fee: 0,
    transferTime: "1 – 4 days",
    tagline: "Rate alerts & market tools",
  },
  {
    name: "Western Union",
    url: "https://www.westernunion.com/",
    marginPct: 0.026,
    fee: 4.9,
    transferTime: "Minutes – days",
    tagline: "Global cash pickup",
  },
];

export interface IProviderQuote extends IForexProvider {
  effectiveRate: number;
  received: number;
  savingsVsWorst: number;
  isBest: boolean;
}

/**
 * Turn the mid-market rate into a comparable quote per provider for a given
 * send amount. Fee is deducted from the send amount, then converted at the
 * provider's effective (margin-adjusted) rate.
 */
export function buildQuotes(
  midRate: number,
  amount: number
): IProviderQuote[] {
  const quotes = FOREX_PROVIDERS.map((p) => {
    const effectiveRate = midRate * (1 - p.marginPct);
    const sendAfterFee = Math.max(0, amount - p.fee);
    const received = sendAfterFee * effectiveRate;
    return { ...p, effectiveRate, received, savingsVsWorst: 0, isBest: false };
  });

  quotes.sort((a, b) => b.received - a.received);
  const worst = quotes[quotes.length - 1]?.received ?? 0;
  quotes.forEach((q, i) => {
    q.isBest = i === 0;
    q.savingsVsWorst = q.received - worst;
  });
  return quotes;
}
