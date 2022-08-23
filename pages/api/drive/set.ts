import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import admin from "lib/firebaseAdmin";
import Drive from "models/Drive";
import Hotspot from "models/Hotspot.mjs";
import { HotspotDrive } from "lib/types";

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
    let driveId = id;
    if (isNew === "true") {
      const newDrive = await Drive.create(data);
      driveId = newDrive._id;
    } else {
      await Drive.replaceOne({ _id: id }, data);
    }

    const hotspotIds = data.entries.map((entry: any) => entry.hotspot._id);

    data?.entries?.forEach(async ({ hotspot: hotspotEntry }: Entry) => {
      const hotspot = await Hotspot.findOne({ _id: hotspotEntry });
      let exists = false;
      await Promise.all(
        hotspot.drives?.map(async (drive: HotspotDrive) => {
          if (drive.driveId.toString() === driveId) {
            exists = true;
            drive.name = data.name;
            drive.slug = data.slug;
          }
        })
      );
      if (!exists) {
        await hotspot.drives.push({
          name: data.name,
          slug: data.slug,
          driveId,
        });
      }
      await hotspot.save();
    });

    await Hotspot.updateMany(
      { drives: { $elemMatch: { driveId } }, _id: { $nin: hotspotIds } },
      // @ts-ignore
      { $pull: { drives: { driveId } } }
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
