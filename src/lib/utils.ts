import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encodingForModel } from "js-tiktoken";

/**
 * Merges Tailwind CSS classes with conditional logic.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to a string with appropriate precision.
 */
export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  const precision = Math.max(0, 3 - Math.floor(Math.log10(Math.abs(num))) - 1);
  return num.toFixed(precision).replace(/\.?0+$/, "");
};

/**
 * Placeholder for OAuth Sign-In buttons.
 */
export const SignInOAuthButtons = () => {
  return null; // Return null as we can't render JSX here
};

/**
 * Calculates the number of tokens in a given text based on a specific model.
 */
export function calculateTokens(text: string): number {
  const enc = encodingForModel("gpt-4o-mini");
  const tokens = enc.encode(text);
  console.log(tokens);
  return tokens.length;
}

/**
 * Parses markdown content into HTML, supporting headers, bold, italics, inline code,
 * code blocks with syntax highlighting, links, nested bullet points, and horizontal rules.
 */
export function parseMarkdown(content: string): string {
  const lines = content.split("\n");
  let html = "";
  const listStack: { type: "ul" | "ol"; indent: number }[] = [];
  let inCodeBlock = false;
  let codeBlockLanguage = "";
  let codeBlockContent = "";

  // Utility function to escape HTML entities
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Function to close lists until the current indentation level is reached
  const closeLists = (currentIndent: number) => {
    while (
      listStack.length > 0 &&
      listStack[listStack.length - 1].indent >= currentIndent
    ) {
      const list = listStack.pop();
      if (list) {
        html += `</${list.type}>`;
      }
    }
  };

  // Function to process inline markdown elements
  const processInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold with **
      .replace(/__(.*?)__/g, "<strong>$1</strong>") // Bold with __
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics with *
      .replace(/_(.*?)_/g, "<em>$1</em>") // Italics with _
      .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline code
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      ); // Links
  };

  // Updated regular expressions to handle leading/trailing whitespace
  const codeBlockStartRegex = /^\s*```(\w+)?\s*$/;
  const codeBlockEndRegex = /^\s*```\s*$/;
  const listItemRegex = /^(\s*)([-*+]|\d+\.)\s+(.*)$/;
  const horizontalRuleRegex = /^\s*---\s*$/; // Regex to detect triple hyphens

  lines.forEach((line) => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    const codeBlockStartMatch = line.match(codeBlockStartRegex);

    if (inCodeBlock) {
      if (codeBlockEndRegex.test(line)) {
        // End of code block
        const escapedCode = escapeHtml(codeBlockContent.trim());
        if (codeBlockLanguage) {
          html += `<div class="code-block"><span class="language-label">${codeBlockLanguage}</span><pre class="language-${codeBlockLanguage}"><code class="language-${codeBlockLanguage}">${escapedCode}</code></pre></div>`;
        } else {
          html += `<pre class="language-plaintext"><code class="language-plaintext">${escapedCode}</code></pre>`;
        }
        inCodeBlock = false;
        codeBlockLanguage = "";
        codeBlockContent = "";
      } else {
        codeBlockContent += line + "\n";
      }
    } else if (headerMatch) {
      // Header
      closeLists(0); // Ensure lists are closed before headers
      const level = headerMatch[1].length;
      const headerContent = processInlineMarkdown(escapeHtml(headerMatch[2]));
      html += `<h${level}>${headerContent}</h${level}>`;
    } else if (codeBlockStartMatch) {
      // Start of code block
      closeLists(0); // Ensure lists are closed before starting a code block
      inCodeBlock = true;
      codeBlockLanguage = codeBlockStartMatch[1] || "plaintext";
    } else if (horizontalRuleRegex.test(line)) {
      // Horizontal Rule
      closeLists(0); // Ensure lists are closed before adding a horizontal rule
      html += `<hr />`;
    } else if (listItemRegex.test(line)) {
      const match = line.match(listItemRegex)!;
      const indent = match[1].length;
      const bullet = match[2];
      const text = match[3];

      const currentIndent = indent;
      const listType: "ul" | "ol" = /^\d+\./.test(bullet) ? "ol" : "ul";

      closeLists(currentIndent);

      if (
        listStack.length === 0 ||
        currentIndent > listStack[listStack.length - 1].indent
      ) {
        html += `<${listType}>`;
        listStack.push({ type: listType, indent: currentIndent });
      }

      html += `<li>${processInlineMarkdown(escapeHtml(text))}</li>`;
    } else {
      closeLists(0);
      if (line.trim() === "") {
        // Optional: add a <br> for empty lines if desired
        html += "<br>";
      } else {
        html += `<p>${processInlineMarkdown(escapeHtml(line))}</p>`;
      }
    }
  });

  // Close any remaining open lists
  closeLists(0);

  // Handle unclosed code blocks at the end of the content
  if (inCodeBlock) {
    const escapedCode = escapeHtml(codeBlockContent.trim());
    if (codeBlockLanguage) {
      html += `<div class="code-block"><span class="language-label">${codeBlockLanguage}</span><pre class="language-${codeBlockLanguage}"><code class="language-${codeBlockLanguage}">${escapedCode}</code></pre></div>`;
    } else {
      html += `<pre class="language-plaintext"><code class="language-plaintext">${escapedCode}</code></pre>`;
    }
  }

  return html.trim();
}
