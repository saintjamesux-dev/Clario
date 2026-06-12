"use client";

import { useCallback, useRef, useState } from "react";
import { MAX_FILE_SIZE_MB, SUPPORTED_EXTENSIONS, SUPPORTED_FORMATS } from "@/lib/constants";
import { Button } from "./ui/Button";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    if (!SUPPORTED_FORMATS.includes(file.type as (typeof SUPPORTED_FORMATS)[number])) {
      return `Unsupported format. Use ${SUPPORTED_EXTENSIONS.join(", ")}.`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      onUpload(file);
    },
    [onUpload, validate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  return (
    <div className="mx-auto mt-10 w-full max-w-xl">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-colors duration-150 ${
          dragging
            ? "border-foreground bg-surface"
            : "border-border bg-background hover:border-foreground/30 hover:bg-surface/50"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(",")}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border">
          <svg
            className="h-5 w-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <p className="text-sm font-medium text-foreground">
          Drop your design here, or click to browse
        </p>
        <p className="mt-2 text-xs text-muted">
          PNG, JPG, JPEG, WEBP · Max {MAX_FILE_SIZE_MB}MB
        </p>

        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={disabled}
          >
            Upload Design
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-fail" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}