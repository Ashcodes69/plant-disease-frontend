"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface Props {
  onImageSelect: (file: File, preview: string) => void;
}

export default function ImageUploader({ onImageSelect }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onImageSelect(file, URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
        transition-all duration-300
        ${
          dragging
            ? "border-green-neon bg-green-neon/5"
            : "border-green-mid bg-green-dim/80 hover:border-green-bright hover:bg-green-dim"
        }
      `}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#2d7a2d 1px, transparent 1px), linear-gradient(90deg, #2d7a2d 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10">
        <p className="text-5xl mb-4">🌿</p>
        <p className="font-display text-2xl text-green-neon mb-2">
          Drop your leaf image here
        </p>
        <p className="text-[#7da87d] text-sm">
          or click to browse — JPG, PNG supported
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
