"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IConvertResult } from "@/interfaces/currency.interface";
import { currencyService } from "@/services/currency.service";

interface IUseCurrencyConverterReturn {
  result: number | null;
  rate: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Controlled converter: `from`, `to` and `amount` are owned by the caller so
 * the pair can be driven from anywhere on the page (converter pickers, popular
 * pair cards, etc.). Returns the debounced conversion result and rate.
 */
export function useCurrencyConverter(
  from: string,
  to: string,
  amount: string
): IUseCurrencyConverterReturn {
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const convert = useCallback(async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setResult(null);
      setRate(null);
      return;
    }

    if (from === to) {
      setResult(Number(amount));
      setRate(1);
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data: IConvertResult = await currencyService.convert(
        from,
        to,
        amount
      );
      setResult(data.result);
      setRate(data.info.rate);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]);

  // Debounced auto-conversion
  useEffect(() => {
    const timer = setTimeout(convert, 400);
    return () => clearTimeout(timer);
  }, [convert]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { result, rate, loading, error };
}
