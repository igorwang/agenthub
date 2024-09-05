import { auth } from "@/auth";
import "@/lib/apiClient";
import { CollectionService, LibraryRequest } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: LibraryRequest = await req.json();
    const response = await CollectionService.rebuildLibraryV1CollectionRebuildPost({
      requestBody: body,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
