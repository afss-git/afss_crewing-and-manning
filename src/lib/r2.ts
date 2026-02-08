import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT;
const bucket = process.env.R2_BUCKET;

const s3 = new S3Client({
  endpoint: endpoint,
  region: process.env.R2_REGION || "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_KEY || "",
  },
});

export async function getPresignedUrl(key: string, expiresIn = 300): Promise<string> {
  if (!bucket) throw new Error("R2_BUCKET not configured");
  console.log(`[R2] Generating presigned URL: bucket=${bucket}, key=${key}, expires=${expiresIn}s`);
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signed = await getSignedUrl(s3, cmd, { expiresIn });
  console.log(`[R2] ✅ Presigned URL generated`);
  return signed;
}

export { S3Client };
