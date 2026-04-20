import mongoose from "mongoose";
import config from "./index";

export const connectDB = async () => {
  try {
    const mongoURI = config.MONGODB_URI;
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
