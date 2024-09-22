import React, { useRef, useEffect } from "react";
import { Button } from "antd";
import { X } from "lucide-react";
import { LLMResponse } from "./LLMResponse";
import { ChatWindowProps } from "@/types";

export default function ChatWindow({
  id,
  messages,
  showMessageStats,
  onClose,
  isMain,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`flex-1 flex flex-col min-w-[300px] h-full relative ${
        !isMain ? "border-l border-gray-250 h-full" : ""
      }`}
    >
      {!isMain && (
        <Button
          type="default"
          size="small"
          className="absolute top-2 right-2 z-10 w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => onClose(id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, msgIndex) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } ${msgIndex > 0 ? "mt-6" : ""}`}
          >
            <div
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              } ${msg.sender === "user" ? "max-w-[80%]" : "w-full"}`}
            >
              {msg.type !== "image" &&
                (msg.sender === "user" ? (
                  <div className="p-3 rounded-lg shadow bg-orange-100 w-full">
                    <p className="text-black whitespace-pre-wrap text-left">
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <LLMResponse
                    id={msg.id}
                    sender={msg.sender}
                    provider={msg.provider || ""}
                    content={msg.content}
                    isLoading={msg.isLoading || false}
                    providerRevealed={msg.providerRevealed || false}
                    metrics={msg.metrics}
                    showMessageStats={showMessageStats}
                  />
                ))}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
