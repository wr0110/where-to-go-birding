import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Upload from "models/Upload";
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
    await Upload.updateOne({ _id: id }, { status: "rejected" });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
