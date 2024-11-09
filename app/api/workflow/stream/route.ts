import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatFlowRequestSchema, OpenAPI } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  OpenAPI.HEADERS = {
    Authorization: `Bearer ${session.access_token}`,
  };
  try {
    const body: ChatFlowRequestSchema = await req.json();

    // SSE API serveice wapper not working
    // use fetch directly
    const response = await fetch(`${OpenAPI.BASE}/v1/workflow/chat_with_flow_stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Get the response as a stream directly
    const stream = response.body;
    if (!stream) {
      throw new Error("No stream in response");
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache no-transform",
        "Content-Encoding": "none",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof Error && "status" in error && "statusText" in error) {
      return NextResponse.json(
        { error: error.statusText },
        { status: (error.status as number) || 500 },
      );
    }
    console.error("Error in workflow:", error);
    return NextResponse.json({ error: "Error in workflow" }, { status: 500 });
  }
}
