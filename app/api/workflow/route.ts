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
    if (error instanceof Error && "status" in error && "statusText" in error) {
      return NextResponse.json(
        { error: error.statusText },
        { status: (error.status as number) || 500 },
      );
    }
    console.error("Error in workflow:", error);

    return NextResponse.json({ error: `Error in workflow` }, { status: 500 });
  }
}
