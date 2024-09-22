import React, { useRef, useEffect } from "react";
import ChatWindow from "@/components/Chat/ChatWindow";
import { ChatWindowType } from "@/types/chat";

interface ChatAreaProps {
  chatWindows: ChatWindowType[];
  showMessageStats: boolean;
  onCloseWindow: (id: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  chatWindows,
  showMessageStats,
  onCloseWindow,
}) => {
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

  return (
    <div className="flex h-full">
      {chatWindows.map((window) => (
        <ChatWindow
          key={window.id}
          id={window.id}
          messages={window.messages}
          showMessageStats={showMessageStats}
          onClose={onCloseWindow}
          isMain={window.id === "main"}
          scrollRef={(el) => (scrollRefs.current[window.id] = el)}
        />
      ))}
    </div>
  );
};

export default ChatArea;
