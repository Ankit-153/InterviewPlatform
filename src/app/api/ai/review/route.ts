import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Ensure this API route is always dynamic and not pre-rendered
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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    // Instantiate the client lazily to avoid build-time errors
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review in JSON format.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide your analysis in the following JSON format:
{
  "quality": "Brief overall quality assessment",
  "codeQualityScore": <number between 1-10>,
  "bestPractices": ["practice1", "practice2", ...],
  "potentialBugs": ["bug1", "bug2", ...],
  "performanceIssues": ["issue1", "issue2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "summary": "Comprehensive summary of the review"
}

Be specific and constructive in your feedback. If there are no issues in a category, use an empty array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const review = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error calling OpenAI:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to generate review" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate code review" },
      { status: 500 }
    );
  }
}
