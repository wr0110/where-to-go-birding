import type { NextApiRequest, NextApiResponse } from "next";
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

	const { fileId }: any = req.query;
  
	try {
    const bucket = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
		const file1 = bucket.file(`${fileId}_small.jpg`);
		const file2 = bucket.file(`${fileId}_large.jpg`);
		await file1.delete();
		await file2.delete();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
}