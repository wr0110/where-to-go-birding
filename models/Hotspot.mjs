//NOTE: .mjs extension and import syntax required for compatibility with fetchTop10.mjs
import mongoose from "mongoose";
import dayjs from "dayjs";
const { Schema, model, models } = mongoose;

const LinkSchema = new Schema({
	label: String,
	url: String,
});

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
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
	location: PointSchema,
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
	parent: {
		type: Schema.Types.ObjectId,
		ref: "Hotspot",
		default: null
	},
	iba: {
		value: String,
		label: String,
	},
	drives: [{
		slug: String,
		name: String,
		driveId: {
			type: Schema.Types.ObjectId,
			ref: "Drive",
		},
	}],
	images: [{
		smUrl: String,
		lgUrl: String,
		originalUrl: String,
		by: String,
		isMap: Boolean,
		isStreetview: Boolean,
		isPublicDomain: Boolean,
		width: Number,
		height: Number,
		caption: String,
		legacy: Boolean,
		streetviewData: Object,
	}],
	featuredImg: {
		smUrl: String,
		lgUrl: String,
		by: String,
		width: Number,
		height: Number,
		caption: String,
		legacy: Boolean,
		isStreetview: Boolean,
		streetviewData: Object,
	},
	createdAt: {
		type: "string",
		default: dayjs().format("YYYY-MM-DD"),
		required: true
	},
	isGroup: Boolean,
	species: Number,
	migrateParentSlug: String, //TODO remove
	migrateParentGroupSlug: String, //TODO remove
	reviewed: Boolean, //TODO remove
	nameMismatch: Boolean, //TODO remove
});

const Hotspot = models.Hotspot || model("Hotspot", HotspotSchema);

export default Hotspot;