import { auth } from "@/auth";
import "@/lib/apiClient";
import { ChatService } from "@/restful/generated";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  try {
    const response = await ChatService.getModelsV1ChatModelsGet();
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.error();
  }
}
