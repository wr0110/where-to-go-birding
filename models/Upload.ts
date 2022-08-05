import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UploadSchema = new Schema({
  locationId: {
    type: String,
    required: true,
  },
  smUrl: String,
  lgUrl: String,
  originalUrl: String,
  by: String,
  email: String,
  width: Number,
  height: Number,
  caption: String,
  countryCode: String,
  stateCode: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = models.Upload || model("Upload", UploadSchema);

export default Upload;
