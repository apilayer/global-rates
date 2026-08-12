"use client";

import { FC, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CURRENCIES, ICurrencyMeta } from "@/lib/constants";

interface ICurrencyPickerProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
  className?: string;
}

export const CurrencyPicker: FC<ICurrencyPickerProps> = ({
  value,
  onChange,
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const filtered = Object.entries(CURRENCIES).filter(
    ([code, meta]) =>
      code.toLowerCase().includes(search.toLowerCase()) ||
      meta.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = CURRENCIES[value] ?? ({ name: value, symbol: "", flag: "🏳️" } as ICurrencyMeta);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-(--color-text-muted)">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={selected.name}
        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-base font-semibold text-(--color-text) md:text-lg"
      >
        <span className="text-lg">{selected.flag}</span>
        <span>{value}</span>
        <svg
          className={cn(
            "h-4 min-w-4 w-4 text-(--color-text-muted) transition-transform",
            isOpen && "rotate-180"
          )}
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-(--color-border-strong) bg-(--color-surface-2) shadow-2xl shadow-black/30">
          <div className="border-b border-(--color-border) p-2">
            <input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-dim) focus:border-(--color-brand) focus:outline-none"
              autoFocus
            />
          </div>
          <div className="custom-scrollbar max-h-60 overflow-y-auto">
            {filtered.map(([code, meta]) => (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-3)",
                  code === value
                    ? "bg-(--color-brand-soft) font-semibold text-(--color-brand)"
                    : "text-(--color-text)"
                )}
              >
                <span className="text-lg">{meta.flag}</span>
                <span className="w-10 font-mono text-xs text-(--color-text-muted)">
                  {code}
                </span>
                <span className="truncate">{meta.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-center text-sm text-(--color-text-muted)">
                No currency found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
