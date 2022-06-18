import { Schema, model, models } from "mongoose";
import dayjs from "dayjs";

const LinkSchema = new Schema({
	label: String,
	url: String,
});

const HotspotSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	stateCode: {
		type: String,
		required: true
	},
	countyCode:  String,
	multiCounties:  Array,
	lat: Number,
	lng: Number,
	locationId: String,
	slug: {
		type: String,
		unique: true,
		required: true
	},
	about: String,
	tips: String,
	birds: String,
	address: String,
	links: [LinkSchema],
	restrooms: {
		type: String,
		enum: ["Yes", "No", "Unknown"],
		default: "Unknown",
	},
	roadside: {
		type: String,
		enum: ["Yes", "No", "Unknown"],
		default: "Unknown",
	},
	accessible: {
		type: String,
		enum: ["ADA", "Birdability", "No", "Unknown"],
		default: "Unknown",
	},
	dayhike: {
		type: String,
		enum: ["Yes", "No", "Unknown"],
		default: "Unknown",
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: "Hotspot",
		default: null
	},
	iba: {
		value: String,
		label: String,
	},
	images: [{
		smUrl: String,
		lgUrl: String,
		by: String,
		isMap: Boolean,
	}],
	createdAt: {
		type: "string",
		default: dayjs().format("YYYY-MM-DD"),
		required: true
	},
});

const Hotspot = models.Hotspot || model("Hotspot", HotspotSchema);

export default Hotspot;