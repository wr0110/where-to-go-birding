import mongoose from "mongoose";
import Hotspot from "models/Hotspot.mjs";
import Drive from "models/Drive";
import Article from "models/Article";
import Settings from "models/Settings.mjs";
import Upload from "models/Upload";

const URI = process.env.MONGO_URI;
const connect = async () => (URI ? mongoose.connect(URI) : null);
export default connect;

export async function getHotspotsByState(stateCode: string) {
  await connect();
  const result = await Hotspot.find({ stateCode }, ["-_id", "name", "url", "iba", "reviewed"])
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getHotspotsByCounty(countyCode: string) {
  await connect();
  const result = await Hotspot.find(
    {
      $or: [{ countyCode }, { multiCounties: countyCode }],
    },
    ["-_id", "name", "url", "iba", "drive"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getAccessibleHotspotsByState(stateCode: string) {
  await connect();
  const result = await Hotspot.find(
    {
      stateCode,
      accessible: { $ne: null },
    },
    ["-_id", "name", "url", "countyCode", "multiCounties"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getRoadsideHotspotsByState(stateCode: string) {
  await connect();
  const result = await Hotspot.find(
    {
      stateCode,
      roadside: "Yes",
    },
    ["-_id", "name", "url", "countyCode", "multiCounties"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getLatestHotspots() {
  await connect();
  const result = await Hotspot.find({}, [
    "-_id",
    "name",
    "url",
    "countyCode",
    "multiCounties",
    "stateCode",
    "createdAt",
  ])
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
    .exec();

  return result;
}

export async function getIBAHotspots(ibaSlug: string) {
  if (!ibaSlug) return [];
  await connect();
  const result = await Hotspot.find(
    {
      "iba.value": ibaSlug,
    },
    ["-_id", "name", "url", "countyCode", "multiCounties", "locationId"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getChildHotspots(id: string) {
  await connect();
  const result = await Hotspot.find({ parent: id }, ["-_id", "name", "url", "locationId", "lat", "lng", "countyCode"])
    .sort({ name: 1 })
    .lean()
    .exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getHotspotByLocationId(locationId: string, populate?: boolean) {
  await connect();
  const result = populate
    ? await Hotspot.findOne({ locationId }).populate("parent").lean().exec()
    : await Hotspot.findOne({ locationId }).lean().exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getHotspotById(id: string, fields?: string[]) {
  //Try/catch in case the id can't be converted to objectId
  try {
    await connect();
    const result = await Hotspot.findOne({ _id: id }, fields).lean().exec();
    return result ? JSON.parse(JSON.stringify(result)) : null;
  } catch (error) {
    return null;
  }
}

export async function getDrivesByState(stateCode: string) {
  await connect();
  const result = await Drive.find(
    {
      stateCode,
    },
    ["-_id", "name", "slug", "counties"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getDriveBySlug(stateCode: string, slug: string) {
  await connect();
  const result = await Drive.findOne({ stateCode, slug })
    .populate("entries.hotspot", ["url", "name", "address"])
    .lean()
    .exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getDriveById(_id: string) {
  await connect();
  const result = await Drive.findOne({ _id }).populate("entries.hotspot", ["url", "name", "address"]).lean().exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getArticlesByState(stateCode: string) {
  await connect();
  const result = await Article.find(
    {
      stateCode,
    },
    ["-_id", "name", "slug"]
  )
    .sort({ name: 1 })
    .lean()
    .exec();

  return result;
}

export async function getArticleBySlug(stateCode: string, slug: string) {
  await connect();
  const result = await Article.findOne({ stateCode, slug })
    .populate("hotspots", ["url", "name", "countyCode", "multiCounties"])
    .lean()
    .exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getArticleById(_id: string) {
  await connect();
  const result = await Article.findOne({ _id })
    .populate("hotspots", ["url", "name", "countyCode", "multiCounties"])
    .lean()
    .exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getSettings() {
  await connect();
  const result = await Settings.findOne({ key: "global" }).lean().exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getUploads() {
  await connect();
  const result = await Upload.find({ status: "pending" }).sort({ name: 1 }).lean().exec();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}
