import AWS from "aws-sdk";

const s3Client = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true, // needed for minio
  signatureVersion: "v4",
  sslEnabled: process.env.MINIO_SECURE === "true", // Enable SSL if MINIO_SECURE is true
});

export default s3Client;
