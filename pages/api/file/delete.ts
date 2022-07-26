import type { NextApiRequest, NextApiResponse } from "next";
import admin from "lib/firebaseAdmin";
import aws from "aws-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = req.headers.authorization;
  aws.config.update({
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
    region: "us-east-1",
    signatureVersion: "v4",
  });
  const endpoint = new aws.Endpoint("s3.wasabisys.com");
  const s3 = new aws.S3({ endpoint });

  try {
    await admin.verifyIdToken(token || "");
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { fileId }: any = req.query;

  try {
    try {
      await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_small.jpg` }).promise();
    } catch (error) {}
    try {
      await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_large.jpg` }).promise();
    } catch (error) {}
    try {
      await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_original.jpg` }).promise();
    } catch (error) {}

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
