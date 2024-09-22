import { auth } from "@/auth";
import "@/lib/apiClient";
import { CollectionService, FileChunkRequest } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body: FileChunkRequest = await req.json();
    const response = await CollectionService.getChunksOfFileV1CollectionChunksPost({
      requestBody: body,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching chunks:", error);
    return NextResponse.error();
  }
}
