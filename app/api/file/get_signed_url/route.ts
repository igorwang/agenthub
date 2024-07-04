import { auth } from "@/auth";
import s3Client from "@/lib/s3Client";
import { NextRequest, NextResponse } from "next/server";

interface NextRequestBody{
    bucket:string;    
    key:string
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json()  as NextRequestBody;
    const presignedGetUrl = await s3Client.getSignedUrlPromise("getObject", {
        Bucket: body?.bucket,
        Key: body?.key,
        Expires: 2 * 60 * 60,
      });
    return NextResponse.json({
      url: presignedGetUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Error generating presigned URL" },
      { status: 500 },
    );
  }
}
