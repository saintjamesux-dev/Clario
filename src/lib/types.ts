export type Verdict = "PASS" | "NEEDS WORK" | "FAIL";

export type CategoryKey =
  | "visualHierarchy"
  | "typography"
  | "colorSystem"
  | "spacingLayout"
  | "consistency"
  | "accessibility"
  | "ux"
  | "conversionPotential";

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  score: number;
  explanation: string;
  reasoning: string;
}

export interface CritiqueResult {
  overallScore: number;
  verdict: Verdict;
  categories: CategoryScore[];
  biggestStrength: string;
  biggestWeakness: string;
  improvements: [string, string, string];
  seniorComment: string;
  analyzedAt: string;
}

export interface AnalyzeRequest {
  imageBase64: string;
  mimeType: string;
  fileName: string;
}

export type AppStep = "landing" | "loading" | "results";