"use client";

import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "@/lib/constants";

interface LoadingAnalysisProps {
  previewUrl: string;
  fileName: string;
}

export function LoadingAnalysis({ previewUrl, fileName }: LoadingAnalysisProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_MESSAGES.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8 h-32 w-48 overflow-hidden rounded-xl border border-border shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Design preview"
          className="h-full w-full object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <p className="mb-1 text-xs text-muted">{fileName}</p>

      <div className="mt-6 w-full max-w-xs">
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
            style={{
              width: `${((step + 1) / LOADING_MESSAGES.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <p className="mt-6 text-sm font-medium text-foreground transition-opacity duration-300">
        {LOADING_MESSAGES[step]}
      </p>

      <p className="mt-2 text-xs text-muted">Senior-level review in progress</p>
    </div>
  );
}