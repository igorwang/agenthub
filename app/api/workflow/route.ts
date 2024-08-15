import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatFlowRequestSchema, WorkflowService } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body: ChatFlowRequestSchema = await req.json();
    const response = await WorkflowService.chatWithFlowV1WorkflowChatWithFlowPost({
      requestBody: body,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
