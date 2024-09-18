"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Plus, Loader2, Menu, HelpCircle, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SidebarContent from "@/components/Chat/ChatSideBar";
import { LLM_PROVIDERS } from "@/data/aiData";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

type Message = {
  id: number;
  content: string;
  sender: "user" | "ai";
  provider?: string;
  metrics?: {
    tokens: number;
    tokensPerSecond: number;
    latency: string;
    cost: string;
    saved: string;
  };
  isLoading?: boolean;
  providerRevealed?: boolean;
};

// Helper function to format numbers

type ChatWindow = {
  id: string;
  messages: Message[];
  selectedProvider: string | null;
};

export default function Component() {
  const { isSignedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([
    { id: "main", messages: [], selectedProvider: null },
  ]);
  const [activeWindow, setActiveWindow] = useState<string>("main");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    LLM_PROVIDERS.map((provider) => provider.name)
  );
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [costPreference, setCostPreference] = useState(50);
  const [qualityPreference, setQualityPreference] = useState(50);
  const [latencyPreference, setLatencyPreference] = useState(50);

  const [isAdjustingCost, setIsAdjustingCost] = useState(false);
  const [isAdjustingQuality, setIsAdjustingQuality] = useState(false);
  const [isAdjustingLatency, setIsAdjustingLatency] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

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
      const newWindow: ChatWindow = {
        id: `window-${Date.now()}`,
        messages: [],
        selectedProvider: null,
      };
      setChatWindows((prev) => [...prev, newWindow]);
    } else {
      // Optionally, you can show an alert or a message to the user
      alert("You can only have up to 4 chat windows open.");
    }
  };

  const handleCloseWindow = (id: string) => {
    setChatWindows((prev) => prev.filter((window) => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow("main");
    }
  };

  const handleSendMessage = async () => {
    if (!isSignedIn) {
      message.error("Please sign in to use the chat functionality.");
      return;
    }

    console.log("Hello world");

    if (query.trim() && selectedProviders.length > 0) {
      const newUserMessage: Message = {
        id: Date.now(),
        content: query,
        sender: "user" as const,
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
          selectedProviders[
            Math.floor(Math.random() * selectedProviders.length)
          ];
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

        const startTime = Date.now();

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: newUserMessage.content,
              provider: newAiMessage.provider,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch response");
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let aiResponseContent = "";
          let tokenCount = 0;

          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            const chunk = decoder.decode(value);

            if (chunk.includes("TOKEN_COUNT:")) {
              const [content, count] = chunk.split("TOKEN_COUNT:");
              aiResponseContent += content;
              tokenCount = parseInt(count.trim(), 10);
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

          const endTime = Date.now();
          const latency = endTime - startTime;
          const tokensPerSecond = (tokenCount / latency) * 1000; // Convert to tokens per second

          // Find the most expensive selected provider
          const selectedProvidersCost = selectedProviders.map(
            (name) => LLM_PROVIDERS.find((p) => p.name === name)!.costPerToken
          );
          const mostExpensiveProviderCost = Math.max(...selectedProvidersCost);

          // Update metrics after the full response is received
          const usedProvider = LLM_PROVIDERS.find(
            (p) => p.name === newAiMessage.provider
          )!;
          const cost = tokenCount * usedProvider.costPerToken;
          const savedCost =
            tokenCount *
            (mostExpensiveProviderCost - usedProvider.costPerToken);

          setTotalTokens((prev) => prev + tokenCount);
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
                              tokens: tokenCount,
                              tokensPerSecond: parseFloat(
                                tokensPerSecond.toFixed(2)
                              ),
                              latency: latency.toFixed(2),
                              cost: cost.toFixed(6),
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

      // Scroll to bottom after updating the state
      chatWindows.forEach((window) => {
        scrollToBottom(window.id);
      });
    }
  };

  const handleSliderPointerMove = (
    event: React.PointerEvent<HTMLSpanElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      x: event.clientX - rect.left,
      y: rect.top - 30, // 30px above the slider
    });
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              {/* Sidebar Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button type="default" size="small">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                  <SidebarContent
                    selectedProviders={selectedProviders}
                    setSelectedProviders={setSelectedProviders}
                    totalSaved={totalSaved}
                    totalTokens={totalTokens}
                    costPreference={costPreference}
                    setCostPreference={setCostPreference}
                    qualityPreference={qualityPreference}
                    setQualityPreference={setQualityPreference}
                    latencyPreference={latencyPreference}
                    setLatencyPreference={setLatencyPreference}
                    isAdjustingCost={isAdjustingCost}
                    setIsAdjustingCost={setIsAdjustingCost}
                    isAdjustingQuality={isAdjustingQuality}
                    setIsAdjustingQuality={setIsAdjustingQuality}
                    isAdjustingLatency={isAdjustingLatency}
                    setIsAdjustingLatency={setIsAdjustingLatency}
                    handleSliderPointerMove={handleSliderPointerMove}
                    popoverPosition={popoverPosition}
                  />
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-2">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      type="default"
                      size="small"
                      onClick={handleAddModelComparison}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new model comparison window</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      type="default"
                      size="small"
                      onClick={handleAddModelComparison}
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
                {chatWindows.map((window, index) => (
                  <div
                    key={window.id}
                    className={`flex-1 flex flex-col min-w-[300px] h-full relative ${
                      index > 0 ? "border-l border-gray-250 h-full" : ""
                    }`}
                  >
                    {window.id !== "main" && (
                      <Button
                        type="default"
                        size="small"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => handleCloseWindow(window.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex-1 overflow-y-auto p-4">
                      {window.messages.map((msg, msgIndex) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          } ${msgIndex > 0 ? "mt-6" : ""}`}
                        >
                          <div
                            className={`flex flex-col ${
                              msg.sender === "user"
                                ? "items-end"
                                : "items-start"
                            } ${
                              msg.sender === "user" ? "max-w-[80%]" : "w-full"
                            }`}
                          >
                            <div
                              className={`p-4 rounded-lg shadow ${
                                msg.sender === "user"
                                  ? "bg-orange-100"
                                  : "bg-gray-50"
                              } ${msg.sender === "user" ? "w-full" : "w-full"}`}
                            >
                              {msg.sender === "ai" && msg.provider && (
                                <div className="text-xs text-gray-500 mb-2">
                                  {msg.providerRevealed
                                    ? msg.provider
                                    : "Loading..."}
                                </div>
                              )}
                              {msg.isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>
                                    Routing response to the best provider...
                                  </span>
                                </div>
                              ) : (
                                <p
                                  className={`text-black ${
                                    msg.sender === "user"
                                      ? "text-center"
                                      : "text-left"
                                  }`}
                                >
                                  {msg.content}
                                </p>
                              )}
                              {msg.sender === "ai" && msg.metrics && (
                                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
                                  <span>
                                    Tokens: {formatNumber(msg.metrics.tokens)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {formatNumber(msg.metrics.tokensPerSecond)}{" "}
                                    tokens/sec
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Latency:{" "}
                                    {formatNumber(
                                      parseFloat(msg.metrics.latency)
                                    )}
                                    ms
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Cost: $
                                    {formatNumber(parseFloat(msg.metrics.cost))}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Saved: $
                                    {formatNumber(
                                      parseFloat(msg.metrics.saved)
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        ref={(el) => {
                          scrollRefs.current[window.id] = el;
                        }}
                      />
                    </div>
                  </div>
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
                <Input
                  placeholder={
                    isSignedIn ? "Start a message..." : "Sign in to chat"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onPressEnter={handleSendMessage}
                  className="flex-1 mr-2"
                  disabled={!isSignedIn}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!isSignedIn}
                  className=" bg-orange-500 hover:bg-orange-600 border-none"
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
