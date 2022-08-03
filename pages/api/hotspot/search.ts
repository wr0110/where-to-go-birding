import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { q, stateCode }: any = req.query;

  let query: any = {
    name: { $regex: new RegExp(q), $options: "i" },
  };

  if (stateCode) {
    query = { ...query, stateCode };
  }

  try {
    await connect();
    const results = await Hotspot.find(query, ["name"]).limit(15).sort({ name: 1 }).lean().exec();
    const formatted = results?.map((result: any) => ({ label: result.name, value: result._id }));
    res.status(200).json({
      success: true,
      results: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
