import mongoose from "mongoose";
import dayjs from "dayjs";
const { Schema, model, models } = mongoose;

const DriveSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  stateCode: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: String,
  mapId: String,
  counties: Array,
  entries: [
    {
      hotspot: {
        type: Schema.Types.ObjectId,
        ref: "Hotspot",
      },
      description: String,
    },
  ],
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
    required: true,
  },
});

const Drive = models.Drive || model("Drive", DriveSchema);

export default Drive;
