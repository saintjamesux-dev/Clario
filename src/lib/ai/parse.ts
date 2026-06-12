import { CATEGORY_LABELS } from "@/lib/constants";
import type { CategoryKey, CategoryScore, CritiqueResult, Verdict } from "@/lib/types";

const CATEGORY_KEYS: CategoryKey[] = [
  "visualHierarchy",
  "typography",
  "colorSystem",
  "spacingLayout",
  "consistency",
  "accessibility",
  "ux",
  "conversionPotential",
];

const CATEGORY_EXPLANATIONS: Record<CategoryKey, string> = {
  visualHierarchy: "How clearly the eye is guided through the interface.",
  typography: "Type scale, readability, and font pairing quality.",
  colorSystem: "Palette cohesion, contrast, and semantic color usage.",
  spacingLayout: "Grid discipline, whitespace, and alignment consistency.",
  consistency: "Component patterns and visual language uniformity.",
  accessibility: "Contrast ratios, touch targets, and inclusive patterns.",
  ux: "Clarity of actions, flow, and cognitive load.",
  conversionPotential: "CTA prominence, trust signals, and friction reduction.",
};

interface RawCategory {
  key: string;
  score: number;
  reasoning: string;
}

interface RawCritique {
  overallScore: number;
  verdict: string;
  categories: RawCategory[];
  biggestStrength: string;
  biggestWeakness: string;
  improvements: string[];
  seniorComment: string;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeVerdict(score: number, verdict: string): Verdict {
  const v = verdict?.toUpperCase().replace(/_/g, " ");
  if (v === "PASS" || v === "NEEDS WORK" || v === "FAIL") return v as Verdict;
  if (score >= 75) return "PASS";
  if (score >= 55) return "NEEDS WORK";
  return "FAIL";
}

export function parseAIResponse(text: string): CritiqueResult {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let raw: RawCritique;
  try {
    raw = JSON.parse(cleaned) as RawCritique;
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (!raw.categories || !Array.isArray(raw.categories)) {
    throw new Error("AI response missing categories");
  }

  const categoryMap = new Map<string, RawCategory>();
  for (const cat of raw.categories) {
    if (cat.key) categoryMap.set(cat.key, cat);
  }

  const categories: CategoryScore[] = CATEGORY_KEYS.map((key) => {
    const found = categoryMap.get(key);
    return {
      key,
      label: CATEGORY_LABELS[key],
      score: clampScore(found?.score ?? 50),
      explanation: CATEGORY_EXPLANATIONS[key],
      reasoning: found?.reasoning?.trim() || "Unable to assess this category from the provided image.",
    };
  });

  const overallScore = clampScore(
    raw.overallScore ??
      Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)
  );

  const improvements = (raw.improvements ?? [])
    .filter((s) => typeof s === "string" && s.trim())
    .slice(0, 3);

  while (improvements.length < 3) {
    improvements.push("Review spacing consistency and align elements to a clear grid system.");
  }

  return {
    overallScore,
    verdict: normalizeVerdict(overallScore, raw.verdict),
    categories,
    biggestStrength: raw.biggestStrength?.trim() || "Shows intentional design effort.",
    biggestWeakness: raw.biggestWeakness?.trim() || "Some areas need refinement before ship.",
    improvements: improvements as [string, string, string],
    seniorComment:
      raw.seniorComment?.trim() ||
      "Run a usability test with 5 users before shipping. This critique is a starting point, not a final verdict.",
    analyzedAt: new Date().toISOString(),
  };
}