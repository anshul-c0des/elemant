import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { explainerSystemPrompt } from "@/lib/explainerPrompt";
import { getCurrentTree, addVersion } from "@/lib/versionStore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();
    const tree = getCurrentTree();

    if (!tree) {
      return NextResponse.json({ error: "No UI tree available to explain" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent([
      explainerSystemPrompt,
      `User request: ${userInput || ""}`,
      `Generated UI Tree: ${JSON.stringify(tree)}`,
    ]);

    const explanation = result.response.text().trim();

    addVersion(tree, explanation);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Explanation failed" },
      { status: 500 }
    );
  }
}
