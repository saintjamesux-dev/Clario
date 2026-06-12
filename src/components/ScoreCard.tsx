import type { CategoryScore } from "@/lib/types";

interface ScoreCardProps {
  category: CategoryScore;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-pass";
  if (score >= 55) return "text-warn";
  return "text-fail";
}

function barColor(score: number): string {
  if (score >= 75) return "bg-pass";
  if (score >= 55) return "bg-warn";
  return "bg-fail";
}

export function ScoreCard({ category }: ScoreCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-subtle transition-shadow duration-150 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{category.label}</h3>
          <p className="mt-1 text-xs text-muted">{category.explanation}</p>
        </div>
        <span className={`text-2xl font-semibold tabular-nums ${scoreColor(category.score)}`}>
          {category.score}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(category.score)}`}
          style={{ width: `${category.score}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{category.reasoning}</p>
    </div>
  );
}