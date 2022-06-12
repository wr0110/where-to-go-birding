import mongoose from "mongoose";
import Hotspot from "models/Hotspot";

const URI = process.env.MONGO_URI;
const connect = async () => URI ? mongoose.connect(URI) : null;
export default connect;

export function stringifyId(result: any) {
	return result.map((item: any) => ({ ...item, _id: item?._id.toString() }));
}

export async function getHotspotsByState(stateCode: string, fields: string[]) {
	await connect();
	const result = await Hotspot
		.find({ stateCode: `US-${stateCode}` }, fields)
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}

export async function getHotspotsByCounty(countyCode: string, fields: string[]) {
	await connect();
	const result = await Hotspot
		.find({ countyCode }, fields)
		.sort({ name: 1 })
		.lean()
		.exec();

	return result;
}