import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import admin from "lib/firebaseAdmin";
import Drive from "models/Drive";
import Hotspot from "models/Hotspot.mjs";

type Entry = {
  hotspot: string;
  description: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = req.headers.authorization;
  const { isNew }: any = req.query;

  try {
    await admin.verifyIdToken(token || "");
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await connect();
    const { data, id } = req.body;
    if (isNew === "true") {
      await Drive.create({ ...data, _id: id });
    } else {
      await Drive.replaceOne({ _id: id }, data);
    }

    data?.entries?.forEach(async ({ hotspot: hotspotId }: Entry) => {
      try {
        const hotspot = await Hotspot.findOne({ _id: hotspotId });
        if (
          hotspot?.drive?.slug &&
          hotspot?.drive?.name &&
          hotspot.drive.slug === data.slug &&
          hotspot.drive.name === data.name
        ) {
          return;
        }
        await Hotspot.updateOne({ _id: hotspotId }, { $set: { drive: { slug: data.slug, name: data.name } } });
      } catch (error) {}
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
