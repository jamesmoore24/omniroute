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
  return null;
};

export function calculateTokens(text: string): number {
  const enc = encodingForModel("gpt-4o-mini");
  const tokens = enc.encode(text);
  console.log(tokens);
  return tokens.length;
}

export function parseMarkdown(content: string): string {
  console.log(content);

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold with **
    .replace(/__(.*?)__/g, "<strong>$1</strong>") // Bold with __
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics with *
    .replace(/_(.*?)_/g, "<em>$1</em>") // Italics with _
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const languageClass = lang ? `language-${lang}` : "language-plaintext";
      const escapedCode = escapeHtml(code);
      return `<pre class="${languageClass}"><code class="${languageClass}">${escapedCode}</code></pre>`;
    }) // Code blocks with language support
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    ) // Links
    .replace(/(?:^|\n)(?:[-*+]\s+.+)+/g, (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => {
          const content = line.replace(/^[-*+]\s+/, "");
          return `<li>${content}</li>`;
        })
        .join("");
      return `<ul>${items}</ul>`;
    }) // Bullet points and sub-bullet points
    .replace(/\n\n/g, "<br /><br />") // Double line breaks
    .replace(/\n/g, " "); // Single line breaks replaced with space
}
