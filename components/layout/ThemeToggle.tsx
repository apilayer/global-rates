"use client";

import { FC, useEffect, useState } from "react";

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The pre-paint script in the document head has already applied the
    // saved preference (defaulting to dark) to <html>. Read it back so the
    // toggle's own state matches what's on screen.
    const applied = document.documentElement.getAttribute("data-theme");
    const initial: "dark" | "light" = applied === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", initial);

    const timeout = setTimeout(() => {
      setTheme(initial);
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("globalrates-theme", next);
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="grid size-9 place-items-center rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text-muted)"
      >
        <div className="h-4 w-4 animate-pulse rounded-full bg-(--color-text-dim)" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid size-9 place-items-center rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text-muted) transition-colors hover:border-(--color-brand) hover:text-(--color-brand)"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
};
