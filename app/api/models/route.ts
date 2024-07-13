import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatService } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") as "llm" | "embedding" | undefined;
  const session = await auth();
  try {
    const response = await ChatService.getModelsV1ChatModelsGet({ type: type });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
