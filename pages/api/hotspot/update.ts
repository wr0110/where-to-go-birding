import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
import admin from "lib/firebaseAdmin";
import { getStorage } from "firebase-admin/storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = req.headers.authorization;

  try {
    await admin.verifyIdToken(token || "");
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await connect();
    const { id, data } = req.body;
    const url = `/hotspot/${data.locationId}/${data.slug}`;
    const oldHotspot = await Hotspot.findById(id);
    const oldImageUrls = oldHotspot.images?.map((image: any) => image.smUrl);
    const newImageUrls = data.images?.map((image: any) => image.smUrl);
    const deletedImageUrls = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
    if (deletedImageUrls) {
      const bucket = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
      deletedImageUrls.forEach(async (imageUrl: string) => {
        const filename = imageUrl.split("/").pop();
        const fileId = filename?.split("_")[0];
        const file1 = bucket.file(`${fileId}_small.jpg`);
        const file2 = bucket.file(`${fileId}_large.jpg`);
        const file3 = bucket.file(`${fileId}_:original.jpg`);
        await file1.delete();
        await file2.delete();
        await file3.delete();
      });
    }
    await Hotspot.replaceOne({ _id: id }, { ...data, url });
    res.status(200).json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
