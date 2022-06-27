import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

const stateCode = "OH";

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const allHotspots = await Hotspot.find({ state: stateCode }, ["slug", "name"]);
console.log(`Fetched ${allHotspots.length} hotspots from DB`);

const hotspots = await Hotspot.find({
	state: stateCode,
	$or: [{ migrateParentSlug: { $ne: null }}, { migrateParentGroupSlug: { $ne: null }}],
}, ["slug", "name", "migrateParentSlug", "migrateParentGroupSlug"]).lean().exec();

await Promise.all(hotspots.map(async ({_id, migrateParentSlug, migrateParentGroupSlug, slug, name}) => {
	const parentUrl = migrateParentSlug || migrateParentGroupSlug;
	const parentSlug = parentUrl?.replace(/\/$/, "")?.split("/")?.pop()
	if (slug === parentSlug) {
		throw new Error(`${slug} can't be its own parent`);
	}
	if (!parentSlug) {
		throw new Error(`No parent slug for ${name}`);
	}
	const parentId = allHotspots.find(it => it.slug === parentSlug)?._id;
	if (!parentId) {
		throw new Error(`Can't find parent for ${name}`);
	}
		console.log(`Saving ${name}`);
		await Hotspot.updateOne({ _id }, {
			parent: parentId,
			migrateParentSlug: null,
			migrateParentGroupSlug: null,
		});
	}
));

mongoose.connection.close();

