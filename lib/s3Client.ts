import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

// Validate required environment variables
function validateEnvVariables() {
  const required = ["MINIO_ENDPOINT", "MINIO_ACCESS_KEY", "MINIO_SECRET_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// Create S3 client configuration
function createS3Config(): S3ClientConfig {
  validateEnvVariables();

  const isSecure = process.env.MINIO_SECURE === "true";
  const protocol = isSecure ? "https://" : "http://";
  const endpoint = `${protocol}${process.env.MINIO_ENDPOINT}`;

  return {
    endpoint,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
    region: process.env.MINIO_REGION ?? "us-east-1",
  };
}

// Create singleton instance
const s3Client = new S3Client(createS3Config());

export default s3Client;
