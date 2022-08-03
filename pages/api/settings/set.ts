import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Settings from "models/Settings.mjs";
import admin from "lib/firebaseAdmin";

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
    const { featuredIds } = req.body;
    await Settings.updateOne({ key: "global" }, { $set: { featuredIds } });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
