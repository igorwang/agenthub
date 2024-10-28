import { auth } from "@/auth";
import s3Client from "@/lib/s3Client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { uuid } from "uuidv4";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const fileName = searchParams.get("fileName");
  const fileType = searchParams.get("fileType");
  const location = searchParams.get("location");
  const agentId = searchParams.get("agentId");

  if (!fileName || !fileType || !location) {
    return NextResponse.json(
      { error: "fileName and fileType are required" },
      { status: 400 },
    );
  }
  const userId = session?.user?.id;

  const supportedLocations = ["chat", "nextcloud"];
  if (!supportedLocations.includes(location)) {
    return NextResponse.json(
      { error: "Unsupported location to upload" },
      { status: 400 },
    );
  }
  const bucket = location;

  // object name
  const ext = path.extname(fileName);
  const uuidFileName = `${uuid()}${ext}`;
  const s3Key = agentId
    ? `${userId}/${agentId}/${uuidFileName}`
    : `${userId}/${uuidFileName}`;

  const params = {
    Bucket: bucket,
    Key: s3Key,
    ContentType: fileType,
    Metadata: {
      fileName: fileName,
      creatorId: userId || "",
    },
  };

  try {
    const putCommand = new PutObjectCommand(params);
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    });

    const presignedPutUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 2 * 60 * 60,
    });
    const presignedGetUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 2 * 60 * 60,
    });

    return NextResponse.json({
      url: presignedPutUrl,
      previewUrl: presignedGetUrl,
      bucket: bucket,
      fileKey: s3Key,
    });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Error generating presigned URL" },
      { status: 500 },
    );
  }
}
