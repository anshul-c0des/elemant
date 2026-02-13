import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { explainerDiffPrompt, explainerInitialPrompt } from "@/lib/explainerPrompt";
import { addVersion } from "@/lib/versionStore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userInput, prevTree, currentTree } = await req.json();

    if (!currentTree) {
      return NextResponse.json({ error: "No UI tree available to explain" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const isFirstVersion = !prevTree;

const messages = [
  isFirstVersion
    ? explainerInitialPrompt
    : explainerDiffPrompt,
  `User request: ${userInput || ""}`,
  isFirstVersion
    ? `Current UI Tree: ${JSON.stringify(currentTree)}`
    : `Previous UI Tree: ${JSON.stringify(prevTree)}
       Current UI Tree: ${JSON.stringify(currentTree)}`
];

    const result = await model.generateContent(messages);

    const explanation = result.response.text().trim();

    addVersion(currentTree, explanation);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Explanation failed" }, { status: 500 });
  }
}
