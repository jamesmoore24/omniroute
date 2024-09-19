import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Message } from "@/types/chat";
import { parseMarkdown } from "@/lib/utils";
import Prism from "prismjs";

export const LLMResponse: React.FC<Message> = ({
  provider,
  content,
  isLoading,
  providerRevealed,
  metrics,
  showMessageStats,
}) => {
  const [parsedContent, setParsedContent] = useState<string>("");

  useEffect(() => {
    const parsed = parseMarkdown(content);

    // Highlight all code blocks using Prism
    const highlightCodeBlocks = () => {
      const dummyDiv = document.createElement("div");
      dummyDiv.innerHTML = parsed;

      const codeBlocks = dummyDiv.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        Prism.highlightElement(block as HTMLElement);
      });

      if (metrics) {
        let trimmedHTML = dummyDiv.innerHTML.replace(/(<br\s*\/?>)+$/g, "");
        trimmedHTML = trimmedHTML.replace(/<p>\s*<\/p>$/g, "");
        setParsedContent(trimmedHTML);
      } else {
        setParsedContent(dummyDiv.innerHTML);
      }
    };

    highlightCodeBlocks();
  }, [content]);

  return (
    <div className="p-4 rounded-lg shadow bg-gray-50 w-full">
      {provider && (
        <div className="text-xs text-gray-500 mb-2">
          {providerRevealed ? provider : "Loading..."}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Routing response to the best provider...</span>
        </div>
      ) : (
        <div
          className="text-black text-left whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
      )}
      {metrics && showMessageStats && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
          <span>Input Tokens: {formatNumber(metrics.inputTokens)}</span>
          <span>•</span>
          <span>Output Tokens: {formatNumber(metrics.outputTokens)}</span>
          <span>•</span>
          <span>{formatNumber(metrics.tokensPerSecond)} tokens/sec</span>
          <span>•</span>
          <span>Latency: {formatNumber(parseFloat(metrics.latency))}ms</span>
          <span>•</span>
          <span>Cost: ${formatNumber(parseFloat(metrics.cost))}</span>
          <span>•</span>
          <span>Saved: ${formatNumber(parseFloat(metrics.saved))}</span>
        </div>
      )}
    </div>
  );
};
