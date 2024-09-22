import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, message, Spin } from "antd";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, deleteHash: string) => void;
  triggerFileUpload: boolean; // Flag to trigger file dialog externally
  resetTrigger: () => void; // Callback to reset the trigger flag
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  triggerFileUpload,
  resetTrigger,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);

      setUploading(true);

      try {
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
        message.error(
          `An error occurred while uploading the image. Try uploading a different photo.`
        );
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  // Handle external trigger for file dialog
  useEffect(() => {
    if (triggerFileUpload) {
      open();
      resetTrigger(); // Reset the trigger after opening the dialog
    }
  }, [triggerFileUpload, open, resetTrigger]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOverWindow(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOverWindow(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOverWindow(false);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Modified condition to show the upload window
  if (!isDraggingOverWindow && !isDragActive && !uploading) {
    return null;
  }

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: "#f97316" }} spin />
  );

  return (
    <div
      {...getRootProps()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 text-center">
        <input {...getInputProps()} />
        {uploading ? (
          <Spin indicator={antIcon} tip="Uploading..." />
        ) : (
          <div>
            <UploadOutlined
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                color: "#f97316",
              }}
            />
            <p className="text-xl mb-4">Drop the image here to upload</p>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            >
              Or Choose File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
