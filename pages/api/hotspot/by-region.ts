import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
import { getCountyByCode, getStateByCode } from "lib/localData";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { region, limit, offset }: any = req.query;
  const isCounty = region.split("-").length === 3;
  const regionName = isCounty ? `${getCountyByCode(region)?.name} County` : getStateByCode(region.split("-")[1])?.label;
  console.log(regionName);

  const query = isCounty
    ? {
        $or: [{ countyCode: region }, { multiCounties: region }],
      }
    : { stateCode: region.split("-")[1] };

  try {
    await connect();
    const results = await Hotspot.find(query, ["parent", "name", "url", "featuredImg", "lat", "lng", "species"])
      .sort({ species: -1 })
      .limit(limit || 15)
      .skip(offset || 0)
      .populate("parent", ["name"])
      .lean()
      .exec();

    const count = await Hotspot.count(query);
    res.status(200).json({
      success: true,
      results,
      count,
      regionName,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
