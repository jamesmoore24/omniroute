import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  const precision = Math.max(0, 3 - Math.floor(Math.log10(Math.abs(num))) - 1);
  return num.toFixed(precision).replace(/\.?0+$/, "");
};
