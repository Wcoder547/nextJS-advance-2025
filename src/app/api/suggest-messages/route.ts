import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST() {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const { text } = await generateText({
      model: groq("llama-3.2-1b-preview"),
      prompt,
    });

    return NextResponse.json({ content: text });
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
