import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { lat, lng, offset }: any = req.query;

  const query = {
    location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] } } },
  };

  try {
    await connect();
    const results = await Hotspot.find(query, ["parent", "name", "url", "featuredImg", "locationId", "lat", "lng"])
      .limit(15)
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
