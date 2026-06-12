import type { AnalyzeRequest, CritiqueResult } from "./types";
import { analyzeWithGemini } from "./ai/gemini";
import { mockCritiqueFromRequest } from "./analyze-mock";

/**
 * Primary analysis entry point.
 * Uses Gemini vision when GEMINI_API_KEY is set.
 * Falls back to mock only when CLARIO_ALLOW_MOCK=true (local dev).
 */
export async function analyzeDesign(request: AnalyzeRequest): Promise<CritiqueResult> {
  const hasGeminiKey =
    !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);

  if (hasGeminiKey) {
    return analyzeWithGemini(request);
  }

  if (process.env.CLARIO_ALLOW_MOCK === "true") {
    return mockCritiqueFromRequest(request.fileName, request.imageBase64);
  }

  throw new Error(
    "GEMINI_API_KEY is not configured. Add it to Vercel environment variables or .env.local"
  );
}