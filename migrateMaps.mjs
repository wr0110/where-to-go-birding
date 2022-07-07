import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

const stateCode = "AZ";

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const allHotspots = await Hotspot.find({ "images.isMap": false, stateCode }, ["images"]).lean().exec();
console.log(`Fetched ${allHotspots.length} hotspots from DB`);

await Promise.all(allHotspots.map(async ({_id, images}) => {
		if (!images.length) return;
		const newImages = images.map(image => ({...image, isMap: true }));
		console.log(newImages);
		/*await Hotspot.updateOne({ _id }, {
			images: newImages,
		});*/
	}
));

mongoose.connection.close();

