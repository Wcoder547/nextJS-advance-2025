import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err: unknown) {
      // ✅ Changed from 'any' to 'unknown'
      // Handle quota/rate-limit errors (429)
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("429")) {
        console.warn("Rate limit hit, retrying after delay...");

        // Default retry delay (50s) if not provided
        const retryDelay =
          parseInt(errorMessage.match(/retryDelay":"(\d+)s/)?.[1] || "50", 10) *
          1000;

        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        result = await model.generateContent(prompt);
      } else {
        throw err;
      }
    }

    const text = await result.response.text();

    return NextResponse.json({ content: text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
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
