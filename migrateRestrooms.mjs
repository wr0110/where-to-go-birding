import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

const stateCode = "OH";

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const allHotspots = await Hotspot.find({ state: stateCode }, ["slug", "name", "restrooms", "accessible"]);
console.log(`Fetched ${allHotspots.length} hotspots from DB`);

await Promise.all(allHotspots.map(async ({_id, restrooms, accessible}) => {
		let newRestrooms = null;
		let newAccessible = null;
		if (restrooms === "Yes") {
			newRestrooms = "yes";
		}
		if (restrooms === "No") {
			newRestrooms = "no";
		}
		if (restrooms === "Unknown") {
			newRestrooms = null;
		}
		if (accessible === "Yes") {
			newAccessible = "ada";
		}
		if (accessible === "ADA") {
			newAccessible = "ada";
		}
		if (accessible === "Unknown") {
			newAccessible = null;
		}
		console.log({
			accessible: newAccessible,
			restrooms: newRestrooms,
		});
		/*await Hotspot.updateOne({ _id }, {
			accessible: newAccessible,
			restrooms: newRestrooms,
		});*/
	}
));

mongoose.connection.close();

