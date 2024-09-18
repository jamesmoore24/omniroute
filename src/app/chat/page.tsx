"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Plus, Menu, HelpCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SidebarContent from "@/components/Chat/ChatSideBar";
import ChatWindow from "@/components/Chat/ChatWindow";
import { LLM_PROVIDERS } from "@/data/aiData";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { ChatWindowType, Message } from "@/types/chat";
import TextArea from "antd/lib/input/TextArea";

export default function Component() {
  const { isSignedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [chatWindows, setChatWindows] = useState<ChatWindowType[]>([
    { id: "main", messages: [], selectedProvider: null },
  ]);
  const [activeWindow, setActiveWindow] = useState<string>("main");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    LLM_PROVIDERS.map((provider) => provider.name)
  );
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [showMessageStats, setShowMessageStats] = useState(true);

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToBottom = (windowId: string) => {
    if (scrollRefs.current[windowId]) {
      scrollRefs.current[windowId]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    chatWindows.forEach((window) => {
      scrollToBottom(window.id);
    });
  }, [chatWindows]);

  const handleAddModelComparison = () => {
    if (chatWindows.length < 4) {
      const newWindow: ChatWindowType = {
        id: `window-${Date.now()}`,
        messages: [],
        selectedProvider: null,
      };
      setChatWindows((prev) => [...prev, newWindow]);
    } else {
      message.error("You can only have up to 4 windows open");
    }
  };

  const handleCloseWindow = (id: string) => {
    setChatWindows((prev) => prev.filter((window) => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow("main");
    }
  };

  const handleSendMessage = async () => {
    const startTime = Date.now();
    if (!isSignedIn || !query.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      content: query,
      sender: "user",
    };

    setChatWindows((prev) =>
      prev.map((window) => ({
        ...window,
        messages: [...window.messages, newUserMessage],
      }))
    );

    setQuery("");

    for (const window of chatWindows) {
      const provider =
        window.selectedProvider ||
        selectedProviders[Math.floor(Math.random() * selectedProviders.length)];
      const newAiMessage: Message = {
        id: Date.now() + 1,
        content: "",
        sender: "ai",
        provider: provider,
        isLoading: true,
        providerRevealed: false,
      };

      setChatWindows((prev) =>
        prev.map((w) =>
          w.id === window.id
            ? { ...w, messages: [...w.messages, newAiMessage] }
            : w
        )
      );

      const conversationHistory = window.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...conversationHistory,
              { role: "user", content: query },
            ],
            provider: newAiMessage.provider,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponseContent = "";
        let mappedUsage: {
          inputTokens: number;
          outputTokens: number;
          totalTokens: number;
          reasoningTokens: number;
        } | null = null;

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);

          if (chunk.includes("USAGE_INFO:")) {
            const [content, usageInfo] = chunk.split("USAGE_INFO:");
            aiResponseContent += content;
            const usage = JSON.parse(usageInfo);

            // Map the values
            mappedUsage = {
              inputTokens: usage.prompt_tokens,
              outputTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
              reasoningTokens: usage.completion_tokens_details.reasoning_tokens,
            };
          } else {
            aiResponseContent += chunk;
          }

          setChatWindows((prev) =>
            prev.map((w) =>
              w.id === window.id
                ? {
                    ...w,
                    messages: w.messages.map((msg) =>
                      msg.id === newAiMessage.id
                        ? {
                            ...msg,
                            content: aiResponseContent,
                            isLoading: false,
                            providerRevealed: true,
                          }
                        : msg
                    ),
                  }
                : w
            )
          );
        }

        const usedProvider = LLM_PROVIDERS.find(
          (p) => p.name === newAiMessage.provider
        )!;
        console.log(mappedUsage);
        const inputTokens = mappedUsage!.inputTokens ?? "N/A";
        const outputTokens = mappedUsage!.outputTokens ?? "N/A";
        const inputCost = inputTokens * usedProvider.inputCostPerToken;
        const outputCost = outputTokens * usedProvider.outputCostPerToken;
        const totalCost = inputCost + outputCost;
        const mostExpensiveProviderInputCost = Math.max(
          ...LLM_PROVIDERS.map((p) => p.inputCostPerToken)
        );
        const mostExpensiveProviderOutputCost = Math.max(
          ...LLM_PROVIDERS.map((p) => p.outputCostPerToken)
        );
        const savedCost =
          inputTokens *
            (mostExpensiveProviderInputCost - usedProvider.inputCostPerToken) +
          outputTokens *
            (mostExpensiveProviderOutputCost - usedProvider.outputCostPerToken);

        // Update total tokens and total savings
        setTotalTokens((prev) => prev + inputTokens + outputTokens);
        setTotalSaved((prev) => prev + savedCost);

        setChatWindows((prev) =>
          prev.map((w) =>
            w.id === window.id
              ? {
                  ...w,
                  messages: w.messages.map((msg) =>
                    msg.id === newAiMessage.id
                      ? {
                          ...msg,
                          metrics: {
                            inputTokens,
                            outputTokens,
                            tokensPerSecond: parseFloat(
                              (
                                ((inputTokens + outputTokens) /
                                  (Date.now() - startTime)) *
                                1000
                              ).toFixed(2)
                            ),
                            latency: (Date.now() - startTime).toFixed(2),
                            cost: totalCost.toFixed(6),
                            saved: savedCost.toFixed(6),
                          },
                        }
                      : msg
                  ),
                }
              : w
          )
        );
      } catch (error) {
        console.error("Error calling API:", error);
        setChatWindows((prev) =>
          prev.map((w) =>
            w.id === window.id
              ? {
                  ...w,
                  messages: w.messages.map((msg) =>
                    msg.id === newAiMessage.id
                      ? {
                          ...msg,
                          content:
                            "Sorry, there was an error generating the response.",
                          isLoading: false,
                        }
                      : msg
                  ),
                }
              : w
          )
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      // ... existing Tab handling code ...
    } else if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    } else if (e.key === " " && e.shiftKey) {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = query.substring(0, start) + "\n" + query.substring(end);
      setQuery(newValue);
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
          start + 1;
      }, 0);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <Sheet>
                <SheetTrigger asChild>
                  <Button type="default" size="small" className="w-8 h-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                  <SidebarContent
                    selectedProviders={selectedProviders}
                    setSelectedProviders={setSelectedProviders}
                    showMessageStats={showMessageStats}
                    setShowMessageStats={setShowMessageStats}
                  />
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Total Tokens: {formatNumber(totalTokens)}
                </div>
                <div className="text-sm text-gray-600">
                  Saved: ${totalSaved.toFixed(6)}
                </div>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      type="default"
                      size="small"
                      onClick={handleAddModelComparison}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-xs">
                      Add a new model comparison window
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      type="default"
                      size="small"
                      onClick={handleAddModelComparison}
                      className="w-8 h-8 p-0"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Model routing automatically selects the{" "}
                      <b>best AI model </b>
                      between the selected providers based on your preferences
                      for cost, quality, and latency. This ensures optimal
                      performance for each query.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="flex h-full">
                {chatWindows.map((window) => (
                  <ChatWindow
                    key={window.id}
                    id={window.id}
                    messages={window.messages}
                    showMessageStats={showMessageStats}
                    onClose={handleCloseWindow}
                    isMain={window.id === "main"}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <TextArea
                  placeholder={
                    isSignedIn ? "Start a message..." : "Sign in to chat"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 mr-2 resize-none"
                  disabled={!isSignedIn}
                  autoSize={{ minRows: 1, maxRows: 6 }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!isSignedIn}
                  className="bg-orange-500 hover:bg-orange-600 border-none"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
