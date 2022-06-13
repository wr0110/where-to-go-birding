import mongoose from "mongoose";
import Hotspot from "models/Hotspot";

const URI = process.env.MONGO_URI;
const connect = async () => URI ? mongoose.connect(URI) : null;
export default connect;

export async function getHotspotsByState(stateCode: string) {
	await connect();
	const result = await Hotspot
		.find({ stateCode: `US-${stateCode}` }, ["-_id", "name", "url", "dayhike", "iba"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getHotspotsByCounty(countyCode: string) {
	await connect();
	const result = await Hotspot
		.find({ countyCode }, ["-_id", "name", "url"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getAccessibleHotspotsByState(stateCode: string) {
	await connect();
	const result = await Hotspot
		.find({
			stateCode: `US-${stateCode}`,
			accessible: { $in: ["ADA", "Birdability"] },
		}, ["-_id", "name", "url", "countyCode"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getHikeHotspotsByState(stateCode: string) {
	await connect();
	const result = await Hotspot
		.find({
			stateCode: `US-${stateCode}`,
			dayhike: "Yes",
		}, ["-_id", "name", "url", "countyCode"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getRoadsideHotspotsByState(stateCode: string) {
	await connect();
	const result = await Hotspot
		.find({
			stateCode: `US-${stateCode}`,
			roadside: "Yes",
		}, ["-_id", "name", "url", "countyCode"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getIBAHotspots(ibaSlug: string) {
	if (!ibaSlug) return [];
	await connect();
	const result = await Hotspot
		.find({
			"iba.value": ibaSlug,
		}, ["-_id", "name", "url", "countyCode", "locationId"])
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getHotspotBySlug(countyCode: string, slug: string) {
	await connect();
	const result = await Hotspot
		.findOne({ countyCode, slug })
		.lean()
		.exec();

	return  result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function getHotspotByLocationId(locationId: string) {
	await connect();
	const result = await Hotspot
		.findOne({ locationId })
		.lean()
		.exec();

	return result ? JSON.parse(JSON.stringify(result)) : null;
}