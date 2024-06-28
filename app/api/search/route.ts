import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatService, SearchRequestSchema } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { query, agent_id, user_id, limit }: SearchRequestSchema =
      await req.json();
    const response = await ChatService.searchV1ChatSearchPost({
      requestBody: { query, agent_id, user_id, limit },
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
