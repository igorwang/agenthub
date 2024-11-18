import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatService, OpenAPI, ReplicationAgentRequestSchema } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  OpenAPI.HEADERS = {
    Authorization: `Bearer ${session.access_token}`,
  };

  try {
    const body: ReplicationAgentRequestSchema = await req.json();
    const response = await ChatService.replicationAgentV1ChatReplicationAgentPost({
      requestBody: body,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error replicating agent:", error);
    return NextResponse.error();
  }
}
