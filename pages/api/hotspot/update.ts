import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
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

  try {
    await connect();
    const { id, data } = req.body;
    const url = `/hotspot/${data.locationId}`;
    const oldHotspot = await Hotspot.findById(id);
    const legacyUrls = oldHotspot.images?.filter((image: any) => !!image.legacy).map((image: any) => image.smUrl);
    const oldImageUrls = oldHotspot.images?.map((image: any) => image.smUrl);
    const newImageUrls = data.images?.map((image: any) => image.smUrl);
    const deletedImageUrls = oldImageUrls.filter(
      (url: string) => !newImageUrls.includes(url) && !legacyUrls.includes(url)
    );
    console.log("deletedImageUrls", deletedImageUrls);
    console.log("legacyUrls", legacyUrls);
    await Hotspot.replaceOne({ _id: id }, { ...data, url });
    if (deletedImageUrls) {
      deletedImageUrls.forEach(async (imageUrl: string) => {
        const filename = imageUrl.split("/").pop();
        const fileId = filename?.split("_")[0];
        console.log("deleting", `${fileId}_small.jpg`);
        await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_small.jpg` }).promise();
        console.log("deleting", `${fileId}_large.jpg`);
        await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_large.jpg` }).promise();
        console.log("deleting", `${fileId}_original.jpg`);
        await s3.deleteObject({ Bucket: "birdinghotspots", Key: `${fileId}_original.jpg` }).promise();
      });
    }
    res.status(200).json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
