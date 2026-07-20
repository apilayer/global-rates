import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names using clsx. No twMerge needed with Tailwind v4 (no config conflicts).
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Formats a number with locale-aware separators and fixed decimal places.
 */
export function formatNumber(
  value: number,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
  return value.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}