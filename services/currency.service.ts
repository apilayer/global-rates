import {
  IConvertResult,
  IApiError,
  ICurrencyInfo,
} from "@/interfaces/currency.interface";

class CurrencyService {
  private readonly basePath = "/api";

  async convert(
    from: string,
    to: string,
    amount: string,
    date?: string
  ): Promise<IConvertResult> {
    const params = new URLSearchParams({ from, to, amount });
    if (date) {
      params.append("date", date);
    }

    const res = await fetch(`${this.basePath}/convert?${params.toString()}`);

    if (!res.ok) {
      const errorData = (await res.json()) as IApiError;
      throw new Error(errorData.error || "Failed to convert currency");
    }

    return res.json() as Promise<IConvertResult>;
  }

  async getSymbols(): Promise<ICurrencyInfo[]> {
    const res = await fetch(`${this.basePath}/symbols`);

    if (!res.ok) {
      const errorData = (await res.json()) as IApiError;
      throw new Error(errorData.error || "Failed to fetch currencies");
    }

    const data = (await res.json()) as { symbols: Record<string, string> };

    return Object.entries(data.symbols).map(([code, name]) => ({
      code,
      name,
    }));
  }
}

export const currencyService = new CurrencyService();