import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
import States from "data/states.json";

const getHotspotsForRegion = async (region: string) => {
  console.log(`Fetching eBird hotspots for ${region}`);
  const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/${region}?fmt=json`);
  const json = await response.json();

  if ("errors" in json) {
    throw "Error fetching eBird photos";
  }

  return json.map((hotspot: any) => ({
    id: hotspot.locId,
    name: hotspot.locName.trim(),
    lat: hotspot.lat,
    lng: hotspot.lng,
    total: hotspot.numSpeciesAllTime || 0,
  }));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { key }: any = req.query;
  if (process.env.CRON_KEY && key !== process.env.CRON_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await connect();
  try {
    const activeStates = States.filter((state) => state.active);
    await Promise.all(
      activeStates.map(async (state) => {
        console.log(`Syncing ${state.code}`);
        const hotspots = await getHotspotsForRegion(`US-${state.code}`);
        const dbHotspots = await Hotspot.find({ isGroup: { $ne: true }, stateCode: state.code }, [
          "locationId",
          "name",
          "lat",
          "lng",
          "species",
        ])
          .lean()
          .exec();

        await Promise.all(
          dbHotspots.map(async (dbHotspot) => {
            const ebird = hotspots.find((it: any) => it.id === dbHotspot.locationId);
            if (!ebird) return;
            const { name, lat, lng, total } = ebird;
            if (
              name !== dbHotspot.name ||
              lat !== dbHotspot.lat ||
              lng !== dbHotspot.lng ||
              total !== dbHotspot.species
            ) {
              let location = null;
              if (lat && lng) {
                location = {
                  type: "Point",
                  coordinates: [lng, lat],
                };
              }
              console.log(`Updating hotspot ${dbHotspot.locationId}`);
              await Hotspot.updateOne(
                { _id: dbHotspot._id },
                {
                  $set: {
                    name,
                    lat,
                    lng,
                    species: total,
                    location,
                  },
                }
              );
            }
          })
        );
      })
    );
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
