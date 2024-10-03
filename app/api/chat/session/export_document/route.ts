import { auth } from "@/auth";
import "@/lib/apiClient";
import {
  ChatService,
  OpenAPI,
  SessionExportDocumentRequestSchema,
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
    const body: SessionExportDocumentRequestSchema = await req.json();
    const response =
      await ChatService.exportSessionDocumentV1ChatSessionExportDocumentPost({
        requestBody: body,
      });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.error();
  }
}
