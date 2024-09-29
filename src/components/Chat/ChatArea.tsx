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

  const handlePreferenceToggle = (
    window: ChatWindowType,
    preference: string
  ) => {
    setChatWindows((prev) =>
      prev.map((w) =>
        w.id === window.id
          ? {
              ...w,
              messages: w.messages.map((msg) =>
                msg.id === preference ? { ...msg, preferred: true } : msg
              ),
            }
          : w
      )
    );
  };

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
    <div className="flex-1 overflow-auto">
      <div className="flex h-full">
        {chatWindows.map((window) => (
          <ChatWindow
            key={window.id}
            id={window.id}
            messages={window.messages}
            showMessageStats={showMessageStats}
            onClose={onCloseWindow}
            onPreferenceToggle={handlePreferenceToggle}
            isMain={window.id === "main"}
            scrollRef={(el) =>
              (scrollRefs.current[window.id] = el as HTMLDivElement)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ChatArea;
