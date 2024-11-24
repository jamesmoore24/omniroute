"use client";

import React, { useState } from "react";
import { message } from "antd";
import { Header } from "@/components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LLM_PROVIDERS } from "@/data/aiData";
import { formatNumber } from "@/lib/utils";
import { ChatWindowType, Message } from "@/types/chat";
import TopBar from "@/components/Chat/TopBar";
import ChatArea from "@/components/Chat/ChatArea";
import InputArea from "@/components/Chat/InputArea";
import ModalComponent from "@/components/Chat/ModalComponent";
import ImageUpload from "@/components/Chat/ImageUpload";
import { EXPENSIVE_MODEL, CHEAP_MODEL } from "@/data/aiData";

export default function Component() {
  const [query, setQuery] = useState("");
  const [chatWindows, setChatWindows] = useState<ChatWindowType[]>([
    { id: "main", messages: [], selectedProvider: LLM_PROVIDERS[0].name },
  ]);
  const [activeWindow, setActiveWindow] = useState<string>("main");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    LLM_PROVIDERS.map((provider) => provider.name)
  );
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [showMessageStats, setShowMessageStats] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // New state to manage uploaded images before sending
  const [composedImages, setComposedImages] = useState<
    { url: string; deleteHash: string }[]
  >([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddModelComparison = () => {
    if (chatWindows.length < 4) {
      const newWindow: ChatWindowType = {
        id: `window-${Date.now()}`,
        messages: [],
        selectedProvider: LLM_PROVIDERS[0].name,
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
    if (!query.trim() && composedImages.length === 0) return;

    //TODO: Make this dependent on the provider

    //CEREBRAS integration without image support
    const newMessage = {
      role: "user",
      content: query,
    };

    //OPENAI integration with image support
    /* const newMessage: {
      role: string;
      content: { type: string; text?: string; image_url?: { url: string } }[];
    } = {
      role: "user",
      content: [],
    };

    // Add text content if there's a query
    if (query.trim()) {
      newMessage.content.push({ type: "text", text: query });
    }

    // Add image content
    composedImages.forEach((image) => {
      newMessage.content.push({
        type: "image_url",
        image_url: { url: image.url },
      });
    }); */

    // Update chat windows with new message
    setChatWindows((prev) =>
      prev.map((window) => ({
        ...window,
        messages: window.messages.concat({
          id: Date.now(),
          content: query,
          sender: "user",
          images: composedImages.map((image) => image.url),
        }),
      }))
    );

    // Clear the composed images and query after sending
    setComposedImages([]);
    setQuery("");

    // Rest of the function (API call, etc.)
    const sendMessageToWindow = async (
      window: ChatWindowType,
      provider: string
    ) => {
      const newAiMessage: Message = {
        id: Date.now() + 1,
        content: "",
        sender: "ai",
        provider: provider,
        isLoading: true,
        providerRevealed: false,
        type: "text",
      };

      setChatWindows((prev) =>
        prev.map((w) =>
          w.id === window.id
            ? { ...w, messages: [...w.messages, newAiMessage] }
            : w
        )
      );

      const conversationHistory = [...window.messages]
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }))
        .concat(newMessage);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationHistory,
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
        } | null = null;

        let time = 0;

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);

          if (chunk.includes("USAGE_INFO:")) {
            const [content, usageAndTime] = chunk.split("USAGE_INFO:");
            const [usageInfo, timeElapsed] = usageAndTime.split("TIME:");
            time = parseFloat(timeElapsed);
            aiResponseContent += content;
            const usage = JSON.parse(usageInfo);

            mappedUsage = {
              inputTokens: usage.prompt_tokens,
              outputTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
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
        const inputTokens = mappedUsage!.inputTokens ?? 0;
        const outputTokens = mappedUsage!.outputTokens ?? 0;
        const inputCost = inputTokens * usedProvider.inputCostPerToken;
        const outputCost = outputTokens * usedProvider.outputCostPerToken;
        const totalCost = inputCost + outputCost;
        const mostExpensiveProviderInputCost = Math.max(
          ...selectedProviders.map(
            (p) => LLM_PROVIDERS.find((lp) => lp.name === p)!.inputCostPerToken
          )
        );
        const mostExpensiveProviderOutputCost = Math.max(
          ...selectedProviders.map(
            (p) => LLM_PROVIDERS.find((lp) => lp.name === p)!.outputCostPerToken
          )
        );
        const savedCost =
          inputTokens *
            (mostExpensiveProviderInputCost - usedProvider.inputCostPerToken) +
          outputTokens *
            (mostExpensiveProviderOutputCost - usedProvider.outputCostPerToken);

        setTotalTokens((prev) => prev + inputTokens + outputTokens);
        setTotalCost((prev) => prev + totalCost);
        setTotalSavings((prev) => prev + savedCost);

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
                            tokensPerSecond:
                              ((inputTokens + outputTokens) / time) * 1000,
                            latency: time.toFixed(2),
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
    };

    const provider = await fetch("/api/route-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: newMessage.content,
        expensive_model: EXPENSIVE_MODEL,
        cheap_model: CHEAP_MODEL,
      }),
    });

    const { routed_model } = await provider.json();

    await Promise.all(
      chatWindows.map((window) => sendMessageToWindow(window, routed_model))
    );
  };

  // Function to handle image deletion
  const handleDeleteImage = async (image: {
    url: string;
    deleteHash: string;
  }) => {
    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletehash: image.deleteHash }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Image deleted successfully.");
        setComposedImages((prev) =>
          prev.filter((img) => img.deleteHash !== image.deleteHash)
        );
      } else {
        throw new Error(data.error || "Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      message.error("Failed to delete image.");
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

  const handleTopBarClick: (element: string) => void = (element) => {
    let content = "";
    if (element === "tokens") {
      content = `Total Tokens Used: ${formatNumber(totalTokens)}`;
    } else if (element === "cost") {
      content = `Total Cost: $${totalCost.toFixed(3)}`;
    } else if (element === "savings") {
      content = `Total Savings: $${totalSavings.toFixed(3)}`;
    } else if (element === "addWindow") {
      content = "Add a new model comparison window.";
    } else if (element === "help") {
      content =
        "Binary routing model from RouteLLM. Free inference for llama3.1-8b and llama3.1-70b provided by Cerebras.";
    }
    setModalContent(content);
    setIsModalOpen(true);
  };

  const [triggerFileUpload, setTriggerFileUpload] = useState(false);

  const resetTrigger = () => {
    setTriggerFileUpload(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
            <TopBar
              totalTokens={totalTokens}
              totalCost={totalCost}
              totalSavings={totalSavings}
              onAddWindow={handleAddModelComparison}
              onHelp={() => handleTopBarClick("help")}
              onInfoClick={handleTopBarClick}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              showMessageStats={showMessageStats}
              setShowMessageStats={setShowMessageStats}
              onToggleSidebar={toggleSidebar}
            />
            <ChatArea
              setChatWindows={setChatWindows}
              chatWindows={chatWindows}
              showMessageStats={showMessageStats}
              onCloseWindow={handleCloseWindow}
            />
            <div className="chat-bar">
              <ImageUpload
                onUploadSuccess={(url, deleteHash) =>
                  setComposedImages((prev) => [...prev, { url, deleteHash }])
                }
                triggerFileUpload={triggerFileUpload}
                resetTrigger={resetTrigger}
              />
              <InputArea
                query={query}
                setQuery={setQuery}
                onSend={handleSendMessage}
                onKeyDown={handleKeyDown}
                isSignedIn={true}
                uploadedImages={composedImages}
                onDeleteImage={handleDeleteImage}
                onUploadSuccess={(url, deleteHash) =>
                  setComposedImages((prev) => [...prev, { url, deleteHash }])
                }
              />
            </div>
          </div>
        </div>
        <ModalComponent
          isOpen={isModalOpen}
          content={modalContent}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}
