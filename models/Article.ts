import mongoose from "mongoose";
import dayjs from "dayjs";
const { Schema, model, models } = mongoose;

const ArticleSchema = new Schema({
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
  content: String,
  hotspots: [
    {
      type: Schema.Types.ObjectId,
      ref: "Hotspot",
    },
  ],
  images: [
    {
      smUrl: String,
      lgUrl: String,
      originalUrl: String,
      by: String,
      width: Number,
      height: Number,
      caption: String,
    },
  ],
  createdAt: {
    type: "string",
    default: dayjs().format("YYYY-MM-DD"),
    required: true,
  },
});

const Article = models.Article || model("Article", ArticleSchema);

export default Article;
