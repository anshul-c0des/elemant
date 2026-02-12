import { applyPlan } from "@/lib/patchEngine";
import {
  addVersion,
  getCurrentTree,
} from "@/lib/versionStore";
import { NextResponse } from "next/server";
import { validateTree } from "@/lib/validateTree";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

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

    const versionId = addVersion(updatedTree, "Pending explanation");

    return NextResponse.json({
      versionId,
      tree: updatedTree,
      explanation: null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
