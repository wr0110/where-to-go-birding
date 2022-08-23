import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Drive from "models/Drive";
import Hotspot from "models/Hotspot.mjs";
import admin from "lib/firebaseAdmin";

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
    await Drive.deleteOne({ _id: id });
    await Hotspot.updateMany(
      { drives: { $elemMatch: { driveId: id } } },
      // @ts-ignore
      { $pull: { drives: { driveId: id } } }
    );
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
