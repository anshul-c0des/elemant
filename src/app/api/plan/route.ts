import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { plannerSystemPrompt } from "@/lib/plannerPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent([
      plannerSystemPrompt,
      `User request: ${userInput}`,
    ]);

    const text = result.response.text();

    // Remove accidental markdown wrapping
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Planner failed" },
      { status: 500 }
    );
  }
}
