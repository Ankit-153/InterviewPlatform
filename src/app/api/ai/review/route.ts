import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure route is always dynamic
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // SDK automatically reads GEMINI_API_KEY from environment
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({});

    const prompt = `
You are an expert code reviewer.

Analyze the following ${language} code and return ONLY valid JSON.

Code:
\`\`\`${language}
${code}
\`\`\`

JSON format:
{
  "quality": "Brief overall quality assessment",
  "codeQualityScore": 1-10,
  "bestPractices": [],
  "potentialBugs": [],
  "performanceIssues": [],
  "suggestions": [],
  "summary": "Comprehensive summary"
}

Rules:
- Return valid JSON only
- No markdown
- No explanations outside JSON
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    let review;
    try {
      review = JSON.parse(text);
    } catch {
      throw new Error("Gemini response is not valid JSON");
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate code review",
      },
      { status: 500 }
    );
  }
}
