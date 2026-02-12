import { applyPlan } from "@/lib/patchEngine";
import {
  addVersion,
  getCurrentTree,
} from "@/lib/versionStore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { explainerSystemPrompt } from "@/lib/explainerPrompt";
import { NextResponse } from "next/server";
import { validateTree } from "@/lib/validateTree";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, userInput } = await req.json();

    const currentTree = getCurrentTree();

    let effectivePlan = plan;

    if (!currentTree && plan.modificationType === "edit") {
      effectivePlan = {
        modificationType: "create",
        root: plan.root || {
          type: "Card",
          props: { title: "Dashboard" },
          children: [],
        },
      } as any;
    }
    
    const updatedTree = applyPlan(currentTree, effectivePlan);
    

    validateTree(updatedTree);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent([
      explainerSystemPrompt,
      `User request: ${userInput}`,
      `Generated UI Tree: ${JSON.stringify(updatedTree)}`,
    ]);

    const explanation = result.response.text().trim();

    const versionId = addVersion(updatedTree, explanation);

    return NextResponse.json({
      versionId,
      tree: updatedTree,
      explanation,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
