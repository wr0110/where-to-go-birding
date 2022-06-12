import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
    await connect();
    const { data } = req.body;
    await Hotspot.create(data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
}