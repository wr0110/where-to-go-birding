import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot";
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
		const { id, data } = req.body;
    await Hotspot.replaceOne({ _id: id }, data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
}