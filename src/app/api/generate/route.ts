import { applyPlan } from "@/lib/patchEngine";
import { addVersion, getCurrentTree } from "@/lib/versionStore";
import { NextResponse } from "next/server";
import { validateTree } from "@/lib/validateTree";

export async function POST(req: Request) {   // generates the tree
  try {
    const { plan } = await req.json();

    const currentTree = getCurrentTree();   // gets current tree from versionStore

    let effectivePlan = plan;

    if (!currentTree && plan.modificationType === "edit") {   // if it is not an edit, create a new tree
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

    validateTree(updatedTree);   // validate generated tree as per rules

    const versionId = addVersion(updatedTree, "Pending explanation");   // add version

    return NextResponse.json({
      versionId,
      tree: updatedTree,
      explanation: null,   // explanation called seperately
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
