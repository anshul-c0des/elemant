import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { explainerSystemPrompt } from "@/lib/explainerPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userInput, tree } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent([
      explainerSystemPrompt,
      `User request: ${userInput}`,
      `Generated UI Tree: ${JSON.stringify(tree)}`,
    ]);

    const explanation = result.response.text().trim();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Explanation failed" },
      { status: 500 }
    );
  }
}
