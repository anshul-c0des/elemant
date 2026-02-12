import { NextResponse } from "next/server";
import { versionStore } from "@/lib/versionStore";

export async function GET() {
  return NextResponse.json({
    versions: versionStore.versions,
    currentVersionId: versionStore.currentVersionId,
  });
}
