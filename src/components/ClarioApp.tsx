"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppStep, CritiqueResult } from "@/lib/types";
import { FREE_CRITIQUES_PER_DAY, LOADING_MESSAGES } from "@/lib/constants";
import { canCritique, getRemainingCritiques, recordCritique } from "@/lib/usage";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { UploadZone } from "./UploadZone";
import { LoadingAnalysis } from "./LoadingAnalysis";
import { ResultsView } from "./ResultsView";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ClarioApp() {
  const [step, setStep] = useState<AppStep>("landing");
  const [remaining, setRemaining] = useState(FREE_CRITIQUES_PER_DAY);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRemaining(getRemainingCritiques());
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    if (!canCritique()) {
      setError("You've used all free critiques for today. Come back tomorrow.");
      return;
    }

    setError(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("loading");

    try {
      const imageBase64 = await fileToBase64(file);

      // Minimum loading duration for sequential messages
      const minLoad = LOADING_MESSAGES.length * 700;
      const [response] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64,
            mimeType: file.type,
            fileName: file.name,
          }),
        }),
        new Promise((r) => setTimeout(r, minLoad)),
      ]);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      const data: CritiqueResult = await response.json();
      recordCritique();
      setRemaining(getRemainingCritiques());
      setResult(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("landing");
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName("");
    setResult(null);
    setError(null);
    setStep("landing");
  }, [previewUrl]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        {step === "landing" && (
          <div className="px-6 pb-20 pt-20 sm:pt-28">
            <Hero remaining={remaining} />
            <UploadZone onUpload={handleUpload} disabled={remaining === 0} />
            {error && (
              <p className="mx-auto mt-4 max-w-xl text-center text-sm text-fail" role="alert">
                {error}
              </p>
            )}
            {remaining === 0 && (
              <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted">
                Daily limit reached. Resets at midnight.
              </p>
            )}
          </div>
        )}

        {step === "loading" && previewUrl && (
          <div className="pt-20">
            <LoadingAnalysis previewUrl={previewUrl} fileName={fileName} />
          </div>
        )}

        {step === "results" && result && previewUrl && (
          <ResultsView
            result={result}
            previewUrl={previewUrl}
            fileName={fileName}
            onReset={handleReset}
          />
        )}
      </main>
    </>
  );
}