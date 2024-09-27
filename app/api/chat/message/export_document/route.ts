import { auth } from "@/auth";
import "@/lib/apiClient";
import {
  ChatService,
  MessageExportDocumentRequestSchema,
  OpenAPI,
} from "@/restful/generated";
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
    const body: MessageExportDocumentRequestSchema = await req.json();
    const response = await ChatService.exportDocumentV1ChatMessageExportDocumentPost({
      requestBody: body,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.error();
  }
}
