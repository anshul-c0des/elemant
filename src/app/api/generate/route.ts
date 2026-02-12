import { NextResponse } from "next/server";
import { applyPlan } from "@/lib/patchEngine";
import { versionStore, addVersion, getCurrentTree } from "@/lib/versionStore";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const currentTree = getCurrentTree();

    const updatedTree = applyPlan(currentTree, plan);

    const versionId = addVersion(updatedTree);

    return NextResponse.json({
      versionId,
      tree: updatedTree,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
