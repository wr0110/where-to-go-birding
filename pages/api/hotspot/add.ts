import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import admin from "lib/firebaseAdmin";
import Hotspot from "models/Hotspot.mjs";
import { generateRandomId } from "lib/helpers";

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
    const { data } = req.body;
    const locationId = data.locationId || `G${generateRandomId()}`;
    const url = `/hotspot/${locationId}/${data.slug}`;
    await Hotspot.create({ ...data, locationId, url });
    res.status(200).json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
