"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Plus, Send, DollarSign, Hash, Loader2, Menu } from "lucide-react";
import { Header } from "@/components/Header";
import { Combobox } from "@/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSpring, animated, SpringValue } from "react-spring";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

const LLM_PROVIDERS = [
  { name: "GPT-4o-mini", avatar: "G", costPerToken: 0.00001 },
  { name: "sonnet-3.5-turbo", avatar: "C", costPerToken: 0.000008 },
  { name: "llama-3.1-405b-versatile", avatar: "P", costPerToken: 0.000006 },
  { name: "gemini-1.5-flash", avatar: "L", costPerToken: 0.000004 },
  { name: "mistral-large-16k", avatar: "C", costPerToken: 0.000005 },
  { name: "deepseek-coder", avatar: "A", costPerToken: 0.000009 },
];

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  const precision = Math.max(0, 3 - Math.floor(Math.log10(Math.abs(num))) - 1);
  return num.toFixed(precision).replace(/\.?0+$/, "");
};

export default function Component() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessageCompleted, setNewMessageCompleted] = useState(false);

  const savedSpring = useSpring({
    scale: newMessageCompleted ? 1.1 : 1,
    color: newMessageCompleted ? "#10B981" : "#000000",
    config: { tension: 300, friction: 10 },
  });

  const tokensSpring = useSpring({
    scale: newMessageCompleted ? 1.1 : 1,
    color: newMessageCompleted ? "#10B981" : "#000000",
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    if (newMessageCompleted) {
      const timer = setTimeout(() => {
        setNewMessageCompleted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessageCompleted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedProviders.length > 0) {
      const newUserMessage: Message = {
        id: Date.now(),
        content: message,
        sender: "user" as const,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setMessage("");

      const newAiMessage: Message = {
        id: Date.now() + 1,
        content: "",
        sender: "ai",
        provider:
          selectedProviders[
            Math.floor(Math.random() * selectedProviders.length)
          ],
        isLoading: true,
        providerRevealed: false,
      };
      setMessages((prev) => [...prev, newAiMessage]);

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

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);
          aiResponseContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newAiMessage.id
                ? {
                    ...msg,
                    content: aiResponseContent,
                    isLoading: false,
                    providerRevealed: true,
                  }
                : msg
            )
          );
        }

        // Update metrics after the full response is received
        const responseTokens = 100;
        const provider = LLM_PROVIDERS.find(
          (p) => p.name === newAiMessage.provider
        )!;
        const cost = responseTokens * provider.costPerToken;
        const savedCost =
          responseTokens *
          (LLM_PROVIDERS[0].costPerToken - provider.costPerToken);

        setTotalTokens((prev) => prev + responseTokens);
        setTotalSaved((prev) => prev + savedCost);
        setNewMessageCompleted(true);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newAiMessage.id
              ? {
                  ...msg,
                  metrics: {
                    tokens: responseTokens,
                    tokensPerSecond: Math.round((responseTokens / 1000) * 1000), // Assuming 1 second for simplicity
                    latency: "1000.00",
                    cost: cost.toFixed(6),
                    saved: savedCost.toFixed(6),
                  },
                }
              : msg
          )
        );
      } catch (error) {
        console.error("Error calling API:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newAiMessage.id
              ? {
                  ...msg,
                  content: "Sorry, there was an error generating the response.",
                  isLoading: false,
                }
              : msg
          )
        );
      }
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
    <div className="flex flex-col h-screen bg-gray-100 text-black">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-white flex-col overflow-hidden border-r">
          <SidebarContent
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
            savedSpring={savedSpring}
            tokensSpring={tokensSpring}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
          <div className="bg-gray-50 p-4 border-b flex items-center space-x-4 relative z-10">
            {/* Mobile Sidebar Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white">
                <SidebarContent
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
                  savedSpring={savedSpring}
                  tokensSpring={tokensSpring}
                />
              </SheetContent>
            </Sheet>

            <Combobox
              providers={LLM_PROVIDERS}
              onSelectedValuesChange={(values) => setSelectedProviders(values)}
              initialSelectedValues={selectedProviders}
            />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      } ${msg.sender === "user" ? "max-w-[80%]" : "w-full"}`}
                    >
                      <div
                        className={`p-4 rounded-lg shadow ${
                          msg.sender === "user" ? "bg-orange-100" : "bg-gray-50"
                        } ${msg.sender === "user" ? "w-full" : "w-full"}`}
                      >
                        {msg.sender === "ai" && msg.provider && (
                          <div className="text-xs text-gray-500 mb-2">
                            {msg.providerRevealed ? msg.provider : "Loading..."}
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
                              {formatNumber(parseFloat(msg.metrics.latency))}ms
                            </span>
                            <span>•</span>
                            <span>
                              Cost: $
                              {formatNumber(parseFloat(msg.metrics.cost))}
                            </span>
                            <span>•</span>
                            <span>
                              Saved: $
                              {formatNumber(parseFloat(msg.metrics.saved))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />{" "}
              </div>
            </ScrollArea>
            <div className="p-4 bg-gray-50 border-t">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  placeholder="Start a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 mr-2 text-black"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  totalSaved,
  totalTokens,
  costPreference,
  setCostPreference,
  qualityPreference,
  setQualityPreference,
  latencyPreference,
  setLatencyPreference,
  isAdjustingCost,
  setIsAdjustingCost,
  isAdjustingQuality,
  setIsAdjustingQuality,
  isAdjustingLatency,
  setIsAdjustingLatency,
  handleSliderPointerMove,
  popoverPosition,
  savedSpring,
  tokensSpring,
}: {
  totalSaved: number;
  totalTokens: number;
  costPreference: number;
  setCostPreference: React.Dispatch<React.SetStateAction<number>>;
  qualityPreference: number;
  setQualityPreference: React.Dispatch<React.SetStateAction<number>>;
  latencyPreference: number;
  setLatencyPreference: React.Dispatch<React.SetStateAction<number>>;
  isAdjustingCost: boolean;
  setIsAdjustingCost: React.Dispatch<React.SetStateAction<boolean>>;
  isAdjustingQuality: boolean;
  setIsAdjustingQuality: React.Dispatch<React.SetStateAction<boolean>>;
  isAdjustingLatency: boolean;
  setIsAdjustingLatency: React.Dispatch<React.SetStateAction<boolean>>;
  handleSliderPointerMove: (event: React.PointerEvent<HTMLSpanElement>) => void;
  popoverPosition: { x: number; y: number };
  savedSpring: SpringValue<{ scale: number; color: string }>;
  tokensSpring: SpringValue<{ scale: number; color: string }>;
}): JSX.Element {
  return (
    <>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start mb-4 text-black"
          >
            <Plus className="mr-2 h-4 w-4" /> New Room
          </Button>
          {[
            "how to download goo...",
            "how to look at error lo...",
            "what does cohere do ...",
          ].map((room, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start mb-2 text-left text-black"
            >
              {room}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
          <animated.span style={savedSpring} className="text-sm font-medium">
            ${formatNumber(totalSaved)} saved
          </animated.span>
        </div>
        <div className="flex items-center mb-4">
          <Hash className="w-4 h-4 mr-2 text-blue-500" />
          <animated.span style={tokensSpring} className="text-sm font-medium">
            {totalTokens} tokens
          </animated.span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Cost
            </label>
            <Popover open={isAdjustingCost}>
              <PopoverTrigger asChild>
                <Slider
                  value={[costPreference]}
                  onValueChange={(value) => setCostPreference(value[0])}
                  onValueCommit={() => setIsAdjustingCost(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingCost(true)}
                  onPointerUp={() => setIsAdjustingCost(false)}
                  onPointerMove={handleSliderPointerMove}
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {costPreference}
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Quality
            </label>
            <Popover open={isAdjustingQuality}>
              <PopoverTrigger asChild>
                <Slider
                  value={[qualityPreference]}
                  onValueChange={(value) => setQualityPreference(value[0])}
                  onValueCommit={() => setIsAdjustingQuality(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingQuality(true)}
                  onPointerUp={() => setIsAdjustingQuality(false)}
                  onPointerMove={handleSliderPointerMove}
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {qualityPreference}
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Latency
            </label>
            <Popover open={isAdjustingLatency}>
              <PopoverTrigger asChild>
                <Slider
                  value={[latencyPreference]}
                  onValueChange={(value) => setLatencyPreference(value[0])}
                  onValueCommit={() => setIsAdjustingLatency(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingLatency(true)}
                  onPointerUp={() => setIsAdjustingLatency(false)}
                  onPointerMove={handleSliderPointerMove}
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {latencyPreference}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
