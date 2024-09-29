import React, { useRef, useEffect } from "react";
import { ChatWindowProps } from "@/types";
import ChatMessageBox from "./ChatMessageBox";

export default function ChatWindow({
  messages,
  showMessageStats,
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
      className={`flex-1 flex flex-col h-full relative ${
        !isMain ? "border-l border-gray-250 h-full" : ""
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessageBox
            key={msg.id}
            message={msg}
            showMessageStats={showMessageStats}
          />
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
