"use client";

import { FC } from "react";

const items = [
  { label: "Overview", active: true, href: "#" },
  { label: "Converter", active: false, href: "#" },
  { label: "Charts", active: false, href: "#" },
  { label: "Rate alerts", active: false, href: "#" },
  { label: "News", active: false, href: "#" },
];

export const SubNav: FC = () => {
  return (
    <div className="border-b border-(--color-border) bg-(--color-surface)/50">
      <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 text-sm" aria-label="secondary navigation">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`shrink-0 rounded-md px-3 py-1.5 whitespace-nowrap transition-colors ${
                item.active
                  ? "bg-(--color-brand-soft) text-(--color-brand) ring-1 ring-(--color-brand)/30"
                  : "text-(--color-text-muted) hover:bg-(--color-surface-2) hover:text-(--color-text)"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
