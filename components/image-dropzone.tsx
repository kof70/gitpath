"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export function ImageDropzone() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Handle image processing here
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Convert image to contribution grid format
          // Implementation to be added
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-8
        flex flex-col items-center justify-center
        transition-colors cursor-pointer
        ${isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
        }
      `}
    >
      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
      <p className="text-center text-muted-foreground">
        Drag and drop an image, or click to select
      </p>
      <p className="text-sm text-muted-foreground/70 mt-2">
        Supports PNG, JPG, GIF
      </p>
    </div>
  );
}