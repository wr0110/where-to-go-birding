import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Upload from "models/Upload";
import Hotspot from "models/Hotspot.mjs";
import admin from "lib/firebaseAdmin";
import { Image } from "lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = req.headers.authorization;

  try {
    await admin.verifyIdToken(token || "");
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { id }: any = req.query;

  try {
    await connect();
    const upload = await Upload.findOne({ _id: id });
    const hotspot = await Hotspot.findOne({ locationId: upload.locationId });
    if (!hotspot) {
      res.status(500).json({ error: "Hotspot not found" });
      return;
    }
    const urls = hotspot.images?.map((image: Image) => image.smUrl) || [];
    if (urls.includes(upload.smUrl)) {
      res.status(200).json({ success: true });
      return;
    }
    let featuredImg = hotspot.featuredImg;
    if (!featuredImg?.smUrl) {
      featuredImg = upload;
    }
    const formattedImage = { ...upload.toObject(), isPublicDomain: true };
    await Hotspot.updateOne({ locationId: upload.locationId }, { featuredImg, $push: { images: formattedImage } });
    await Upload.updateOne({ _id: id }, { status: "approved" });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
