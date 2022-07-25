import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Drive from "models/Drive.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  await connect();
  const drives = await Drive.find({});
  drives.forEach(async (drive) => {
    await Drive.updateOne({ _id: drive._id }, { $set: { countryCode: "US" } });
  });

  res.status(200).json({ success: true });
}
