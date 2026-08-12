"use client";

import { FC } from "react";
import { CURRENCIES, CONVERTER_TABLE_AMOUNTS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

interface IConversionTablesProps {
  from: string;
  to: string;
  rate: number;
  /** Load a chosen amount (in the "from" currency) into the converter. */
  onSelectAmount?: (amount: number) => void;
}

export const ConversionTables: FC<IConversionTablesProps> = ({
  from,
  to,
  rate,
  onSelectAmount,
}) => {
  const fromMeta = CURRENCIES[from];
  const toMeta = CURRENCIES[to];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-(--color-text)">
            {from} to {to} exchange rates today
          </h2>
          <p className="text-sm text-(--color-text-muted)">
            Quick reference table for converting between {fromMeta?.name ?? from} and {toMeta?.name ?? to} at the current mid-market rate.
          </p>
        </div>

        <div className="mt-4 grid w-full gap-4 md:grid-cols-2 lg:gap-6">
          <TableBlock
            from={from}
            to={to}
            fromName={fromMeta?.name ?? from}
            toName={toMeta?.name ?? to}
            rate={rate}
            amounts={CONVERTER_TABLE_AMOUNTS}
            onSelectAmount={onSelectAmount}
          />
          <TableBlock
            from={to}
            to={from}
            fromName={toMeta?.name ?? to}
            toName={fromMeta?.name ?? from}
            rate={1 / rate}
            amounts={CONVERTER_TABLE_AMOUNTS}
          />
        </div>
      </div>
    </section>
  );
};

interface ITableBlockProps {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  rate: number;
  amounts: number[];
  onSelectAmount?: (amount: number) => void;
}

const TableBlock: FC<ITableBlockProps> = ({
  from,
  to,
  fromName,
  toName,
  rate,
  amounts,
  onSelectAmount,
}) => {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-3 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-(--color-text-dim) uppercase">
        Convert {fromName} to {toName}
      </h3>
      <div className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-bg)">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Rate information of {from}/{to} currency pair
          </caption>
          <thead className="bg-(--color-surface-2)/70 text-(--color-text-muted)">
            <tr className="border-b border-(--color-border)">
              <th className="px-4 py-2.5 text-left text-xs font-normal uppercase tracking-wider">
                {from}
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-normal uppercase tracking-wider">
                {to}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)/60">
            {amounts.map((amount) => (
              <tr key={amount} className="group transition-colors hover:bg-(--color-surface-2)/50">
                <td className="px-4 py-2.5 text-left">
                  {onSelectAmount ? (
                    <button
                      type="button"
                      onClick={() => onSelectAmount(amount)}
                      className="font-medium text-(--color-brand) hover:underline"
                    >
                      {formatNumber(amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {from}
                    </button>
                  ) : (
                    <span className="font-medium text-(--color-text)">
                      {formatNumber(amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {from}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right tabular font-medium text-(--color-text-muted)">
                  {formatNumber(amount * rate, { minimumFractionDigits: 3, maximumFractionDigits: 6 })} {to}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
