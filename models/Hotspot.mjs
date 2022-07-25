//NOTE: .mjs extension and import syntax required for compatibility with fetchTop10.mjs
import mongoose from "mongoose";
import dayjs from "dayjs";
const { Schema, model, models } = mongoose;

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
	countryCode: {
		type: String,
		required: true
	},
	stateCode: {
		type: String,
		required: true
	},
	countyCode:  String,
	multiCounties: Array,
	lat: Number,
	lng: Number,
	zoom: {
		type: Number,
		default: 15,
	},
	locationId: {
		type: String,
		required: true,
		unique: true
	},
	slug: {
		type: String,
		required: true
	},
	oldSlug: String,
	about: String,
	tips: String,
	birds: String,
	hikes: String,
	address: String,
	links: [LinkSchema],
	restrooms: {
		type: String,
		default: null,
	},
	roadside: {
		type: String,
		enum: ["Yes", "No", "Unknown"],
		default: "Unknown",
	},
	accessible: {
		type: Array,
		default: null,
	},
	dayhike: {
		type: String,
		enum: ["Yes", "No"],
		default: "No",
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
	drive: {
		slug: String,
		name: String,
	},
	images: [{
		smUrl: String,
		lgUrl: String,
		by: String,
		isMap: Boolean,
		width: Number,
		height: Number,
		caption: String,
		legacy: Boolean,
	}],
	createdAt: {
		type: "string",
		default: dayjs().format("YYYY-MM-DD"),
		required: true
	},
	isGroup: Boolean,
	migrateParentSlug: String, //TODO remove
	migrateParentGroupSlug: String, //TODO remove
	reviewed: Boolean, //TODO remove
	nameMismatch: Boolean, //TODO remove
});

const Hotspot = models.Hotspot || model("Hotspot", HotspotSchema);

export default Hotspot;