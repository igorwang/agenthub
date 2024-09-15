import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatService } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await ChatService.decodeShareLinkV1ChatAgentShareKeyGet({
      key: params.key,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
