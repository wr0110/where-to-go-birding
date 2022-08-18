import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { region, limit, offset }: any = req.query;

  const isCounty = region.split("-").length === 3;

  const query = isCounty
    ? {
        $or: [{ countyCode: region }, { multiCounties: region }],
      }
    : { stateCode: region };

  try {
    await connect();
    const results = await Hotspot.find(query, ["parent", "name", "url", "featuredImg", "locationId", "lat", "lng"])
      .sort({ name: 1 })
      .limit(limit || 15)
      .skip(offset || 0)
      .populate("parent", ["name"])
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
