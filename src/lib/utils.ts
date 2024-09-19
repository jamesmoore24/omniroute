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
 * Parses markdown content into HTML, supporting bold, italics, inline code,
 * code blocks with syntax highlighting, links, and nested bullet points.
 */
export function parseMarkdown(content: string): string {
  console.log(content);

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
      .replace(/>/g, "&gt;");
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

  lines.forEach((line, index) => {
    const codeBlockStartRegex = /^```(\w+)?$/;
    const codeBlockEndRegex = /^```$/;
    const listItemRegex = /^(\s*)([-*+])\s+(.*)$/;

    if (inCodeBlock) {
      if (codeBlockEndRegex.test(line)) {
        // End of code block
        const escapedCode = escapeHtml(codeBlockContent);
        // Add language label if available
        if (codeBlockLanguage) {
          html += `<div class="code-block"><span class="language-label">${codeBlockLanguage}</span><pre class="language-${codeBlockLanguage}"><code class="language-${codeBlockLanguage}">${escapedCode}</code></pre></div>`;
        } else {
          html += `<pre class="language-plaintext"><code class="language-plaintext">${escapedCode}</code></pre>`;
        }
        // Reset code block state
        inCodeBlock = false;
        codeBlockLanguage = "";
        codeBlockContent = "";
      } else {
        // Accumulate code block content
        codeBlockContent += line + "\n";
      }
    } else {
      const codeBlockStartMatch = line.match(codeBlockStartRegex);
      const listItemMatch = line.match(listItemRegex);

      if (codeBlockStartMatch) {
        // Start of code block
        inCodeBlock = true;
        codeBlockLanguage = codeBlockStartMatch[1] || "plaintext";
        codeBlockContent = "";
      } else if (listItemMatch) {
        const indent = listItemMatch[1].length;
        const bullet = listItemMatch[2];
        const text = listItemMatch[3];

        // Assuming 2 spaces per indentation level
        const currentIndent = indent;

        // Determine the list type (unordered)
        const listType: "ul" | "ol" = "ul"; // Can extend to handle ordered lists

        // Close lists if necessary
        closeLists(currentIndent);

        // If the current indent is greater than the last one, open a new list
        if (
          listStack.length === 0 ||
          currentIndent > listStack[listStack.length - 1].indent
        ) {
          html += `<${listType}>`;
          listStack.push({ type: listType, indent: currentIndent });
        }

        html += `<li>${processInlineMarkdown(escapeHtml(text))}</li>`;
      } else {
        // Close all open lists when encountering a non-list line
        closeLists(0);

        if (line.trim() === "") {
          // Optionally handle paragraph spacing without adding <br />
        } else {
          html += `<p>${processInlineMarkdown(escapeHtml(line))}</p>`;
        }
      }
    }
  });

  // Close any remaining open code blocks
  if (inCodeBlock) {
    const escapedCode = escapeHtml(codeBlockContent);
    if (codeBlockLanguage) {
      html += `<div class="code-block"><span class="language-label">${codeBlockLanguage}</span><pre class="language-${codeBlockLanguage}"><code class="language-${codeBlockLanguage}">${escapedCode}</code></pre></div>`;
    } else {
      html += `<pre class="language-plaintext"><code class="language-plaintext">${escapedCode}</code></pre>`;
    }
  }

  // Close any remaining open lists
  while (listStack.length > 0) {
    const list = listStack.pop();
    if (list) {
      html += `</${list.type}>`;
    }
  }

  // Trim any trailing whitespace or line breaks from the final HTML
  html = html.trim();

  return html;
}
