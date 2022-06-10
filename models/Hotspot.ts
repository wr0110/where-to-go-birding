import { Schema, model, models } from "mongoose";

const LinkSchema = new Schema({
	label: String,
	url: String,
});

const HotspotSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	locationId: String,
	slug: {
		type: String,
		unique: true,
		required: true
	},
	tips: {
		text: String,
		source: String,
		link: String,	
	},
	about: {
		text: String,
		source: String,
		link: String,
	},
	address: {
		street: String,
		city: String,
		state: String,
		zip: String,
	},
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
	parentId: String,
	iba: {
		value: String,
		label: String,
	},
});

const Hotspot = models.Hotspot || model("Hotspot", HotspotSchema);

export default Hotspot;