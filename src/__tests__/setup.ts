import mongoose from "mongoose";
import config from "../config";

beforeAll(async () => {
  // Only connect if not already connected
  if (mongoose.connection.readyState === 0) {
    const url = config.MONGODB_URI;
    await mongoose.connect(url);
  }
});

afterAll(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});
