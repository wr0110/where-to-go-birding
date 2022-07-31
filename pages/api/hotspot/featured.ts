import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
import { getLocationText, getStateByCode } from "lib/localData";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connect();
    const results = await Hotspot.aggregate()
      .match({ featuredImg: { $exists: true } })
      .sample(8)
      .project({ parent: 1, name: 1, url: 1, featuredImg: 1, locationId: 1, countyCode: 1, stateCode: 1 })
      .exec();
    const populated = await Hotspot.populate(results, { path: "parent", select: "name" });
    const formatted = populated.map((hotspot) => {
      const locationLine = hotspot.countyCode
        ? getLocationText(hotspot.countyCode)
        : `${getStateByCode(hotspot.stateCode)?.label}, US`;
      return {
        ...hotspot,
        parent: { name: locationLine },
      };
    });
    res.status(200).json({
      success: true,
      results: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
