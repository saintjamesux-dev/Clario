"use client";

import type { CritiqueResult } from "@/lib/types";
import { DISCLAIMER } from "@/lib/constants";
import { Button } from "./ui/Button";
import { ScoreCard } from "./ScoreCard";
import { VerdictBadge } from "./VerdictBadge";

interface ResultsViewProps {
  result: CritiqueResult;
  previewUrl: string;
  fileName: string;
  onReset: () => void;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-pass";
  if (score >= 55) return "text-warn";
  return "text-fail";
}

export function ResultsView({ result, previewUrl, fileName, onReset }: ResultsViewProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-8">
      {/* Summary */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-muted">{fileName}</p>
          <div className="mt-3 flex items-end gap-4">
            <span className={`text-6xl font-semibold tabular-nums tracking-tight ${scoreColor(result.overallScore)}`}>
              {result.overallScore}
            </span>
            <div className="mb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Overall Score
              </p>
              <div className="mt-1">
                <VerdictBadge verdict={result.verdict} />
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-border shadow-subtle sm:h-28 sm:w-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Analyzed design"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* Category scores */}
      <div className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Category Breakdown
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {result.categories.map((cat) => (
            <ScoreCard key={cat.key} category={cat} />
          ))}
        </div>
      </div>

      {/* Strength & weakness */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <InsightBlock title="Biggest Strength" content={result.biggestStrength} tone="positive" />
        <InsightBlock title="Biggest Weakness" content={result.biggestWeakness} tone="negative" />
      </div>

      {/* Improvements */}
      <div className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Three Actionable Improvements
        </h2>
        <ol className="mt-4 space-y-3">
          {result.improvements.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-surface/50 px-5 py-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground">{item}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Senior comment */}
      <div className="mt-12 rounded-xl border border-border bg-surface px-6 py-5">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Final Senior Designer Comment
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{result.seniorComment}</p>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-center text-xs leading-relaxed text-muted">{DISCLAIMER}</p>

      <div className="mt-8 flex justify-center">
        <Button variant="secondary" onClick={onReset}>
          Analyze another design
        </Button>
      </div>
    </div>
  );
}

function InsightBlock({
  title,
  content,
  tone,
}: {
  title: string;
  content: string;
  tone: "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-subtle">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{title}</h2>
      <p
        className={`mt-3 text-sm leading-relaxed ${
          tone === "positive" ? "text-pass" : "text-foreground"
        }`}
      >
        {content}
      </p>
    </div>
  );
}