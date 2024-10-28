import { auth } from "@/auth";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  bucket: z.string(),
  objectName: z.string(),
  contentType: z.string(),
  metadata: z.record(z.string()).optional(),
  size: z
    .number()
    .min(1)
    .max(100 * 1024 * 1024) // Max 100MB
    .optional(), // Make size optional for backward compatibility
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsedBody = bodySchema.parse(body);

    const supportedLocations = ["chat", "nextcloud", "public", "tmp"];
    if (!supportedLocations.includes(parsedBody.bucket)) {
      return NextResponse.json(
        { error: "Unsupported location to upload" },
        { status: 400 },
      );
    }

    const params = {
      Bucket: parsedBody.bucket,
      Key: parsedBody.objectName,
      ContentType: parsedBody.contentType,
      Metadata: {
        ...parsedBody.metadata,
        userId: session.user.id ?? "",
      },
    };

    const command = new PutObjectCommand(params);
    const presignedPutUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 2 * 60 * 60, // 2 hours in seconds
    });

    return NextResponse.json({
      presignedPutUrl: presignedPutUrl,
    });
  } catch (error) {
    console.log("s3 error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Error generating presigned URL" },
      { status: 500 },
    );
  }
}
