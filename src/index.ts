import dotenv from "dotenv";
import createApp from "./app";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Create App
  const app = createApp();

  // Start Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
