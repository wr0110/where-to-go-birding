import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const stateCode = "AZ";

const allHotspots = await Hotspot.find({ state: stateCode }, ["slug", "name"]);
console.log(`Fetched ${allHotspots.length} hotspots from DB`);

const needsParent = await Hotspot.find({
	state: stateCode,
	migrateParentSlug: { $ne: null },
}, ["slug", "name", "migrateParentSlug"]).lean().exec();

await Promise.all(needsParent.map(async ({_id, migrateParentSlug, slug, name}) => {
	const parentUrl = migrateParentSlug;
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
		});
	}
));

mongoose.connection.close();

