import { NextResponse } from "next/server";
import { rollback, getCurrentTree } from "@/lib/versionStore";

export async function POST(req: Request) {
  const { versionId } = await req.json();

  rollback(versionId);

  return NextResponse.json({
    tree: getCurrentTree(),
  });
}
