import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(ENV_VARS.MONGOOSE_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};

export default connectDB;
