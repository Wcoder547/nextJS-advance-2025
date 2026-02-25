import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST() {
  const prompt = `OUTPUT ONLY: 3 questions separated by "||" and nothing else.

EXACT FORMAT REQUIRED:
"Question 1?||Question 2?||Question 3?"

RULES:
- 3 questions only
- Each ends with "?"
- Separated by "||" only
- NO intro, NO outro, NO explanations
- NO numbering, NO bullets
- Questions about: hobbies, dreams, favorites, experiences, opinions
- Safe for all ages, positive topics only

EXAMPLE OUTPUT:
"What's your favorite movie||If you could visit any country tomorrow, where?||What's a skill you've always wanted to learn?"`;

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    const cleanText = text.trim().replace(/\s+/g, " ").trim();

    return NextResponse.json({ content: cleanText });
  } catch (error: unknown) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      {
        message: "Failed to generate content",
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
      },
      { status: 500 },
    );
  }
}
