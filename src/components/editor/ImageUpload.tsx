"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * Reusable image upload input.
 * Local files are stored as data URLs so the Remotion Player can preview them
 * without a page reload or server upload.
 */
export function ImageUpload({
  label,
  value,
  onChange,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      return;
    }

    setReading(true);
    setFileError(null);

    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result ?? ""));
      setReading(false);
    };
    reader.onerror = () => {
      setFileError("Could not read the file. Please try again.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  };

  const displayError = error ?? fileError;
  const urlValue = value?.startsWith("data:") ? "" : (value ?? "");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground leading-none">
          {label}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={reading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
          >
            {reading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImagePlus className="w-3.5 h-3.5" />
            )}
            Upload
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {value && (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border bg-muted/40",
            displayError ? "border-destructive" : "border-border"
          )}
        >
          {/* Next.js form preview (not a Remotion composition), so a native
              <img> is intentional here. */}
          {/* eslint-disable-next-line @remotion/warn-native-media-tag */}
          <img
            src={value}
            alt={`${label} preview`}
            className="h-28 w-full object-contain bg-slate-950/5"
          />
        </div>
      )}

      <input
        type="url"
        placeholder="…or paste an image URL"
        value={urlValue}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          displayError ? "border-destructive" : "border-input"
        )}
      />
      {displayError && (
        <p className="text-xs text-destructive font-medium">{displayError}</p>
      )}
    </div>
  );
}
