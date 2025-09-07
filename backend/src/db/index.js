import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`MongoDB connected: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`);
    // console.log(connectionInstance);
  } catch (error) {
    console.log("MongoDB Connection Failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
