"use client";

import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="relative border-t border-(--color-border) bg-(--color-surface) py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--color-brand)/30 to-transparent" />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 pt-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">Transfer Money</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Send Money Online</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Large Money Transfer</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Transfer Fees</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Security</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-(--color-text)">Tools</p>
            <ul className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Currency Converter</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Currency Charts</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Rate Alerts</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Historical Rates</a></li>
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
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Currency Data API</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Documentation</a></li>
              <li><a href="#" className="transition-colors hover:text-(--color-brand)">Partnerships</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-(--color-border) pt-6 md:flex-row">
          <span className="text-lg font-bold tracking-tight">
            Global<span className="text-(--color-brand)">Rates</span>.io
          </span>
          <small className="text-center text-xs text-(--color-text-dim)">
            © {new Date().getFullYear()} GlobalRates.io — Powered by Exchangerates API
          </small>
        </div>
      </div>
    </footer>
  );
};
