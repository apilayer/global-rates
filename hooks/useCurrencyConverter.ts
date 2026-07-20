"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IConvertResult } from "@/interfaces/currency.interface";
import { currencyService } from "@/services/currency.service";

interface IUseCurrencyConverterReturn {
  amount: string;
  setAmount: (value: string) => void;
  fromCurrency: string;
  setFromCurrency: (code: string) => void;
  toCurrency: string;
  setToCurrency: (code: string) => void;
  result: number | null;
  rate: number | null;
  loading: boolean;
  error: string | null;
  swapCurrencies: () => void;
}

export function useCurrencyConverter(
  defaultAmount = "1",
  defaultFrom = "USD",
  defaultTo = "GHS"
): IUseCurrencyConverterReturn {
  const [amount, setAmount] = useState(defaultAmount);
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
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

    if (fromCurrency === toCurrency) {
      setResult(Number(amount));
      setRate(1);
      return;
    }

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data: IConvertResult = await currencyService.convert(
        fromCurrency,
        toCurrency,
        amount
      );
      setResult(data.result);
      setRate(data.info.rate);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return; // Ignore aborted requests
      }
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Debounced auto-conversion
  useEffect(() => {
    const timer = setTimeout(convert, 500);
    return () => clearTimeout(timer);
  }, [convert]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    result,
    rate,
    loading,
    error,
    swapCurrencies,
  };
}