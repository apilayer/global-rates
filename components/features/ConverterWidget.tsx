"use client";

import { FC, useEffect, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { CURRENCIES, DEFAULT_AMOUNT, DEFAULT_FROM, DEFAULT_TO } from "@/lib/constants";
import { IConverterWidgetProps } from "@/interfaces/currency.interface";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";

export const ConverterWidget: FC<IConverterWidgetProps> = ({
  defaultAmount = DEFAULT_AMOUNT,
  defaultFrom = DEFAULT_FROM,
  defaultTo = DEFAULT_TO,
  className,
}) => {
  const {
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
  } = useCurrencyConverter(defaultAmount, defaultFrom, defaultTo);

  const fromMeta = CURRENCIES[fromCurrency];
  const toMeta = CURRENCIES[toCurrency];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const displayRate = rate ?? 0;
  const integerPart = Math.floor(displayRate);
  const decimalPart = (displayRate - integerPart).toFixed(6).slice(2);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm md:p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-(--color-brand)/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-(--color-up)/5 blur-3xl" />
      <form className="relative flex flex-col md:flex-row">
        {/* From fieldset */}
        <fieldset className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-4 transition-all focus-within:border-(--color-brand) focus-within:ring-1 focus-within:ring-(--color-brand)/30 md:mr-1 md:w-[calc(50%-4px)] md:px-6">
          <legend className="ml-2 bg-(--color-surface) px-2 text-left text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
            From
          </legend>
          <div className="h-20 w-full pb-3">
            <div className="flex h-full items-center">
              <div className="h-auto grow self-center overflow-hidden">
                <div className="flex w-full items-center text-2xl font-semibold text-(--color-text)">
                  <span className="sr-only">{amount}</span>
                  <span className="flex items-center whitespace-nowrap">
                    {fromMeta?.symbol}
                    <input
                      className="m-0 w-full self-stretch border-none bg-transparent p-0 text-(--color-text) placeholder:text-(--color-text-dim) focus:outline-none"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      aria-label="Sending amount"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </span>
                </div>
              </div>
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} label="" />
            </div>
          </div>
        </fieldset>

        {/* Swap button */}
        <div className="relative h-0 md:h-auto">
          <button
            type="button"
            onClick={swapCurrencies}
            className="absolute -top-3 left-1/2 z-20 inline-flex -translate-x-1/2 rounded-full border border-(--color-border) bg-(--color-surface) p-3 shadow-sm transition-colors hover:bg-(--color-surface-2) md:top-8"
            aria-label="Swap currencies"
          >
            <svg
              className="h-4 w-4 rotate-90 text-(--color-text-muted) md:rotate-0"
              fill="currentColor"
              viewBox="0 0 17 17"
            >
              <path
                fillRule="evenodd"
                d="m11.726 1.273 2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* To fieldset */}
        <fieldset className="mt-4 w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-4 transition-all focus-within:border-(--color-brand) focus-within:ring-1 focus-within:ring-(--color-brand)/30 md:ml-1 md:mt-0 md:w-[calc(50%-4px)] md:px-6">
          <legend className="ml-2 bg-(--color-surface) px-2 text-left text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
            To
          </legend>
          <div className="h-20 w-full pb-3">
            <div className="flex h-full items-center">
              <div className="h-auto grow self-center overflow-hidden">
                <div className="flex w-full items-center text-2xl font-semibold text-(--color-text)">
                  <span className="sr-only">{result?.toFixed(2)}</span>
                  <span className="flex items-center whitespace-nowrap">
                    {toMeta?.symbol}
                    <input
                      className="m-0 w-full self-stretch border-none bg-transparent p-0 text-(--color-text) focus:outline-none"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      aria-label="Receiving amount"
                      value={loading ? "" : result?.toFixed(2) ?? ""}
                      readOnly
                    />
                  </span>
                </div>
              </div>
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} label="" />
            </div>
          </div>
        </fieldset>
      </form>

      {/* Result row */}
      <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:gap-2">
        <div>
          {loading ? (
            <div className="flex items-center gap-2 text-(--color-text-muted)">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-brand) border-t-transparent" />
              <span>Converting...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-(--color-down)">{error}</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-(--color-text) md:text-2xl">
                {formatNumber(Number(amount), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {" "}
                {fromCurrency} = {formatNumber(result ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {" "}
                {toCurrency}
              </p>
              {rate !== null && (
                <p className="mt-1 text-sm text-(--color-text-muted) md:text-base">
                  1 {fromCurrency} = {integerPart}.
                  <span className="text-(--color-text-dim)">{decimalPart}</span> {toCurrency}
                </p>
              )}
              <TimestampLine />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <button className="inline-flex h-11 items-center justify-center rounded-md border border-(--color-border) bg-(--color-surface-2) px-6 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-surface-3) hover:text-(--color-brand)">
            Track exchange rates
          </button>
          <a
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-md bg-(--color-brand) px-6 text-sm font-semibold text-white shadow-lg shadow-(--color-brand)/20 transition-all hover:bg-(--color-brand-hover) hover:shadow-(--color-brand)/30"
          >
            Send money
          </a>
        </div>
      </div>
    </div>
  );
};

function TimestampLine() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!time) {
    return (
      <p className="mt-1 text-sm text-(--color-text-muted) md:text-base">
        Mid-market rate loading…
      </p>
    );
  }

  return (
    <p className="mt-1 text-sm text-(--color-text-muted) md:text-base">
      Mid-market rate at {time} UTC
    </p>
  );
}
