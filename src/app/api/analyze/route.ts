import { NextRequest, NextResponse } from "next/server";
import { analyzeDesign } from "@/lib/analyze";
import type { AnalyzeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    if (!body.imageBase64 || !body.mimeType || !body.fileName) {
      return NextResponse.json(
        { error: "Missing required fields: imageBase64, mimeType, fileName" },
        { status: 400 }
      );
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(body.mimeType)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    // Swap analyzeDesign() internals for a real AI provider — contract stays the same
    const result = await analyzeDesign(body);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    const status = message.includes("not configured") || message.includes("API key") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}