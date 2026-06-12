import type { AnalyzeRequest, CritiqueResult } from "@/lib/types";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompt";
import { parseAIResponse } from "./parse";

const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"] as const;

function getApiKey(): string {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    "";
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Get a free key at https://aistudio.google.com/apikey"
    );
  }
  return key;
}

export async function analyzeWithGemini(request: AnalyzeRequest): Promise<CritiqueResult> {
  const apiKey = getApiKey();
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      const result = await callGemini(apiKey, model, request);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Try next model on 404 / unavailable
      if (!lastError.message.includes("404") && !lastError.message.includes("not found")) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error("Gemini analysis failed");
}

async function callGemini(
  apiKey: string,
  model: string,
  request: AnalyzeRequest
): Promise<CritiqueResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: request.mimeType,
              data: request.imageBase64,
            },
          },
          { text: USER_PROMPT(request.fileName) },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw new Error("Invalid GEMINI_API_KEY. Check your API key at https://aistudio.google.com/apikey");
    }
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    const blockReason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Gemini returned empty response${blockReason ? `: ${blockReason}` : ""}`);
  }

  return parseAIResponse(text);
}