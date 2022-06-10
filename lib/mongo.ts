import mongoose from "mongoose";

const URI = process.env.MONGO_URI;
const connect = async () => URI ? mongoose.connect(URI) : null;

export default connect;