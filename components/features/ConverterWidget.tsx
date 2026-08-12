"use client";

import { FC, useEffect, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { CURRENCIES } from "@/lib/constants";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";

interface IConverterWidgetProps {
  from: string;
  to: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onSwap: () => void;
  onRate?: (rate: number | null) => void;
  className?: string;
}

export const ConverterWidget: FC<IConverterWidgetProps> = ({
  from,
  to,
  amount,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
  onRate,
  className,
}) => {
  const { result, rate, loading, error } = useCurrencyConverter(from, to, amount);

  const fromMeta = CURRENCIES[from];
  const toMeta = CURRENCIES[to];

  // Bubble the live rate up so the page (hero meta, tables, chart) can reuse it.
  useEffect(() => {
    if (onRate && rate != null) onRate(rate);
  }, [rate, onRate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onAmountChange(val);
    }
  };

  const displayRate = rate ?? 0;
  const integerPart = Math.floor(displayRate);
  const decimalPart = (displayRate - integerPart).toFixed(6).slice(2);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-2xl shadow-black/20 sm:p-5",
        className
      )}
    >
      {/* Clip the decorative glow without clipping the currency dropdown */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-(--color-brand)/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Amount */}
        <Field
          label="Amount"
          symbol={fromMeta?.symbol}
          value={amount}
          onChange={handleAmountChange}
        >
          <CurrencyPicker value={from} onChange={onFromChange} label="" />
        </Field>

        {/* Connector + swap + live rate */}
        <div className="relative flex items-center gap-3 py-2 pl-4">
          <span
            className="absolute left-[27px] top-0 h-full w-px bg-(--color-border)"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap currencies"
            className="relative z-10 grid size-7 place-items-center rounded-full border border-(--color-border) bg-(--color-surface-2) text-(--color-text-muted) transition-colors hover:border-(--color-brand) hover:text-(--color-brand)"
          >
            <svg className="h-3.5 w-3.5 rotate-90" fill="currentColor" viewBox="0 0 17 17">
              <path
                fillRule="evenodd"
                d="m11.726 1.273 2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-xs font-medium text-(--color-text-muted)">
            {rate !== null ? (
              <>
                1 {from} ={" "}
                <span className="text-(--color-brand)">
                  {integerPart}.<span className="text-(--color-text-dim)">{decimalPart}</span>
                </span>{" "}
                {to}
              </>
            ) : (
              "Fetching mid-market rate…"
            )}
          </span>
        </div>

        {/* Converted to */}
        <Field
          label="Converted to"
          symbol={toMeta?.symbol}
          value={loading ? "" : result != null ? result.toFixed(2) : ""}
          placeholder={loading ? "…" : "0.00"}
          readOnly
        >
          <CurrencyPicker value={to} onChange={onToChange} label="" />
        </Field>

        {/* Summary + timestamp */}
        <div className="mt-4 space-y-1 border-t border-(--color-border) pt-4">
          {error ? (
            <p className="text-sm text-(--color-down)">{error}</p>
          ) : (
            <p className="text-lg font-semibold text-(--color-text)">
              {formatNumber(Number(amount) || 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {from} ={" "}
              {formatNumber(result ?? 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {to}
            </p>
          )}
          <TimestampLine />
        </div>

        {/* Rate-checking actions (not a transfer flow) */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href="#charts"
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-(--color-brand) px-6 text-sm font-semibold text-white shadow-lg shadow-(--color-brand)/20 transition-all hover:bg-(--color-brand-hover)"
          >
            View rate charts
            <span aria-hidden="true">→</span>
          </a>
          <button className="inline-flex h-11 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface-2) px-5 text-sm font-semibold text-(--color-text) transition-colors hover:border-(--color-brand) hover:text-(--color-brand)">
            Set a rate alert
          </button>
        </div>
      </div>
    </div>
  );
};

interface IFieldProps {
  label: string;
  symbol?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  children: React.ReactNode;
}

function Field({
  label,
  symbol,
  value,
  onChange,
  placeholder,
  readOnly,
  children,
}: IFieldProps) {
  return (
    <div className="flex items-stretch rounded-xl border border-(--color-border) bg-(--color-bg) transition-all focus-within:border-(--color-brand) focus-within:ring-1 focus-within:ring-(--color-brand)/30">
      <div className="min-w-0 flex-1 rounded-l-xl px-4 py-3">
        <span className="block whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
          {label}
        </span>
        <div className="mt-1 flex items-center text-2xl font-semibold text-(--color-text)">
          {symbol && <span className="mr-1 shrink-0">{symbol}</span>}
          <input
            className="w-full min-w-0 border-none bg-transparent p-0 text-(--color-text) tabular placeholder:text-(--color-text-dim) focus:outline-none"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label={label}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            readOnly={readOnly}
          />
        </div>
      </div>
      <div className="flex items-center rounded-r-xl border-l border-(--color-border) bg-(--color-surface-2) px-3">
        {children}
      </div>
    </div>
  );
}

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

  return (
    <p className="text-xs text-(--color-text-muted)">
      {time ? `Mid-market rate at ${time} UTC` : "Mid-market rate loading…"}
    </p>
  );
}
