import React, { useState, useRef } from "react";
import { Button, message } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import Image from "next/image";

interface InputAreaProps {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSignedIn: boolean;
  uploadedImages: { url: string; deleteHash: string }[];
  onDeleteImage: (image: { url: string; deleteHash: string }) => Promise<void>;
  onUploadSuccess: (imageUrl: string, deleteHash: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  query,
  setQuery,
  onSend,
  onKeyDown,
  isSignedIn,
  uploadedImages,
  onDeleteImage,
  onUploadSuccess,
}) => {
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteImage = async (image: {
    url: string;
    deleteHash: string;
  }) => {
    setDeletingImages((prev) => new Set(prev).add(image.deleteHash));
    try {
      await onDeleteImage(image);
    } finally {
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(image.deleteHash);
        return newSet;
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url && data.deletehash) {
          onUploadSuccess(data.url, data.deletehash);
          message.success("Image uploaded successfully!");
        } else {
          throw new Error(data.error || "Image upload failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="p-4 border-t">
      {uploadedImages.length > 0 && (
        <div className="flex space-x-2 mb-2">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image.url}
                alt={`uploaded-${index}`}
                width={48} // Assuming 12 * 4 for the width in pixels
                height={48} // Assuming 12 * 4 for the height in pixels
                className="object-cover rounded border border-gray-300 aspect-square"
              />
              <button
                className="absolute -top-2.5 -right-2.5 bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                onClick={() => handleDeleteImage(image)}
                disabled={deletingImages.has(image.deleteHash)}
              >
                {deletingImages.has(image.deleteHash) ? (
                  <LoadingOutlined
                    style={{ fontSize: 10, color: "gray" }}
                    spin
                  />
                ) : (
                  <CloseOutlined style={{ fontSize: 10 }} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      <form
        className="flex items-center"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        {/* <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={handleUploadClick}
          disabled={!isSignedIn || isUploading}
          className="mr-2 resize-none border border-gray-300 bg-white text-gray-700 focus:border-gray-400 focus:ring-gray-400 hover:bg-gray-200 transition-colors duration-200"
        >
          {isUploading ? <LoadingOutlined spin /> : ""}
        </Button> */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <TextArea
          placeholder={isSignedIn ? "Start a message..." : "Sign in to chat"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 mr-2 resize-none focus:border-orange-500 focus:ring-orange-500 hover:border-orange-500 hover:ring-orange-500 text-base"
          disabled={!isSignedIn}
          autoSize={{ minRows: 1, maxRows: 6 }}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSend}
          disabled={!isSignedIn && uploadedImages.length === 0}
          className="bg-orange-500 hover:bg-orange-600 border-none texts-base"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default InputArea;
