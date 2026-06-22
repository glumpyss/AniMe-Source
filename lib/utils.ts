import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score?: number) {
  if (!score) return "N/A";
  return score.toFixed(1);
}

export function formatNumber(n?: number) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function getScoreColor(score?: number) {
  if (!score) return "text-gray-400";
  if (score >= 8) return "text-green-400";
  if (score >= 7) return "text-yellow-400";
  if (score >= 6) return "text-orange-400";
  return "text-red-400";
}

export const SEASONS = ["winter", "spring", "summer", "fall"] as const;
export const STATUS_OPTIONS = ["airing", "complete", "upcoming"] as const;

export function currentYear() {
  return new Date().getFullYear();
}

export function yearRange(from = 1960) {
  const years: number[] = [];
  for (let y = currentYear() + 1; y >= from; y--) years.push(y);
  return years;
}
