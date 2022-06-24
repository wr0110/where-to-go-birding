import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { q }: any = req.query;

  let query: any = {
    name: { $regex: new RegExp(q), $options: "i" },
  };

  try {
    await connect();
    const results = await Hotspot.find(query, ["name", "url"]).limit(20).lean().exec();
    const formatted = results?.map((result: any) => ({ label: result.name, value: result.url }));
    res.status(200).json({
      success: true,
      results: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
