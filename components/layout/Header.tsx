"use client";

import { FC } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ApiLayerLogo } from "@/components/ui/ApiLayerLogo";

const navItems: { label: string; href: string; external?: boolean }[] = [
  { label: "Converter", href: "#converter" },
  { label: "Charts", href: "#charts" },
  { label: "News", href: "#news" },
  {
    label: "API",
    href: "https://apilayer.com/marketplace/exchangerates_data-api",
    external: true,
  },
];

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-bg)/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="group text-(--color-text)" aria-label="GlobalRates home">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="transition-colors group-hover:text-(--color-brand)">
                <rect x="1.3" y="1.3" width="29.4" height="29.4" rx="8" stroke="currentColor" strokeWidth="2.1" />
                <path d="M7 21 L13 15 L18 18 L25 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5 9 L25 9 L25 13.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="flex flex-col leading-none">
              <Link href="/" className="text-lg font-bold tracking-tight text-(--color-text)">
                Global<span className="text-(--color-brand)">Rates</span>
              </Link>
              <a
                href="https://apilayer.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit APILayer"
                className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-(--color-text-muted) transition-opacity hover:opacity-80"
              >
                <span>by</span>
                <ApiLayerLogo size={12} />
              </a>
            </div>
          </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="relative rounded-md px-3 py-1.5 text-(--color-text) transition-colors hover:text-(--color-brand)"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search currencies"
            className="hidden items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-sm text-(--color-text-muted) transition-colors hover:border-(--color-brand) hover:text-(--color-text) sm:flex sm:w-64"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 text-left">Search currency (e.g. USD)</span>
            <span className="rounded border border-(--color-border-strong) px-1.5 text-[11px] text-(--color-text-dim)">/</span>
          </button>

          <button
            type="button"
            aria-label="Search currencies"
            className="grid size-9 place-items-center rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text-muted) transition-colors hover:text-(--color-text) sm:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <a
            href="http://exchangeratesapi.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md bg-(--color-brand) px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-hover) sm:inline-block"
          >
            Get API key
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
