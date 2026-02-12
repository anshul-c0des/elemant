import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { AllowedComponents } from "@/lib/componentRegistry";
import { getPlannerPrompt } from "@/lib/plannerPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userInput, currentTree } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent([
      getPlannerPrompt(AllowedComponents),
      `Current UI Tree (with IDs): ${JSON.stringify(currentTree)}`,
      `User request: ${userInput}`
    ]);

    const text = result.response.text();

    // Remove accidental markdown wrapping
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.modificationType) {
      throw new Error("Invalid planner output");
    }    

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Planner failed" },
      { status: 500 }
    );
  }
}
