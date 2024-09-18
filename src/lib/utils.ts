import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encodingForModel } from "js-tiktoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  const precision = Math.max(0, 3 - Math.floor(Math.log10(Math.abs(num))) - 1);
  return num.toFixed(precision).replace(/\.?0+$/, "");
};

export const SignInOAuthButtons = () => {
  return null; // Return null as we can't render JSX here
};

export function calculateTokens(text: string): number {
  const enc = encodingForModel("gpt-4o-mini");
  const tokens = enc.encode(text);
  console.log(tokens);
  return tokens.length;
}
