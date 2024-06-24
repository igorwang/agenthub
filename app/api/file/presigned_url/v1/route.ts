import { auth } from "@/auth";
import s3Client from "@/lib/s3Client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  bucket: z.string(),
  objectName: z.string(),
  contentType: z.string(),
  metadata: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsedBody = bodySchema.parse(body); // Validate the body

    const supportedLocations = ["chat", "nextcloud"];
    if (!supportedLocations.includes(parsedBody.bucket)) {
      return NextResponse.json(
        { error: "Unsupported location to upload" },
        { status: 400 },
      );
    }

    const params = {
      Bucket: parsedBody.bucket,
      Key: parsedBody.objectName,
      Expires: 2 * 60 * 60, // URL expiration time in seconds
      ContentType: parsedBody.contentType,
      Metadata: parsedBody.metadata,
    };

    const presignedPutUrl = await s3Client.getSignedUrlPromise(
      "putObject",
      params,
    );

    return NextResponse.json({
      presignedPutUrl: presignedPutUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Error generating presigned URL" },
      { status: 500 },
    );
  }
}
