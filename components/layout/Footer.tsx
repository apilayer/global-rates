"use client";

import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="relative border-t border-(--color-border) bg-(--color-surface) py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--color-brand)/30 to-transparent" />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 pt-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">Rates</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Live Exchange Rates</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Popular Currency Pairs</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Historical Rates</a></li>
              <li><a href="#news" className="transition-colors hover:text-(--color-brand)">Market News</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">Tools</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="/#converter" className="transition-colors hover:text-(--color-brand)">Currency Converter</a></li>
              <li><a href="/#charts" className="transition-colors hover:text-(--color-brand)">Currency Charts</a></li>
              <li><a href="/compare" className="transition-colors hover:text-(--color-brand)">Rate Comparison</a></li>
              <li><a href="/#faq" className="transition-colors hover:text-(--color-brand)">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">Company</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">About Us</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Help Center</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Legal</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">API</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="https://apilayer.com/marketplace/exchangerates_data-api" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-(--color-brand)">Exchange Rates Data API</a></li>
              <li><a href="https://apilayer.com/marketplace/exchangerates_data-api" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-(--color-brand)">API Documentation</a></li>
              <li><a href="https://apilayer.com/marketplace/exchangerates_data-api" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-(--color-brand)">Get a free API key</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-(--color-border) pt-6 md:flex-row">
          <span className="text-lg font-bold tracking-tight">
            Global<span className="text-(--color-brand)">Rates</span>.io
          </span>
          <small className="text-center text-xs text-(--color-text-dim)">
            © {new Date().getFullYear()} GlobalRates.io — a demo showcasing the Exchange Rates Data API by APILayer
          </small>
        </div>
      </div>
    </footer>
  );
};
