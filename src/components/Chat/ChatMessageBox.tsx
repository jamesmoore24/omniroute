import React, { useState } from "react";
import { Message } from "@/types"; // Adjust the import based on your project structure
import { LLMResponse } from "./LLMResponse";
import Image from "next/image";

interface ChatMessageBoxProps {
  message: Message;
  showMessageStats: boolean;
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  message,
  showMessageStats,
}) => {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mt-6`}
    >
      <div
        className={`flex flex-col ${
          message.sender === "user" ? "items-end" : "items-start"
        } `}
      >
        {message.type !== "image" ? (
          message.sender === "user" ? (
            <div
              className={`p-3 rounded-lg bg-orange-100 transition-transform duration-300`}
            >
              {message.images && message.images.length > 0 && (
                <div className="flex space-x-2 mb-2">
                  {message.images.map((imageUrl, index) => (
                    <Image
                      key={index}
                      src={imageUrl}
                      alt={`uploaded-${index}`}
                      width={40}
                      height={40}
                      className="object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>
              )}
              <p className="text-black whitespace-pre-wrap text-left">
                {Array.isArray(message.content)
                  ? message.content.map((item, index) => (
                      <span key={index}>
                        {item.text}
                        {item.image_url && (
                          <Image
                            src={item.image_url.url}
                            alt="Content"
                            width={40}
                            height={40}
                            className="object-cover rounded border border-gray-300"
                          />
                        )}
                      </span>
                    ))
                  : message.content}
              </p>
            </div>
          ) : (
            <LLMResponse
              id={message.id}
              sender={message.sender}
              provider={message.provider || ""}
              content={message.content}
              isLoading={message.isLoading || false}
              providerRevealed={message.providerRevealed || false}
              metrics={message.metrics}
              showMessageStats={showMessageStats}
            />
          )
        ) : (
          // Handle image messages if necessary
          <div className="p-3 rounded-lg shadow bg-gray-200">
            <Image
              src={message.content as string}
              alt="Chat Image"
              width={200}
              height={200}
              className="object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageBox;
