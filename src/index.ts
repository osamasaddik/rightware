import { createServer } from "http";
import { Server } from "socket.io";
import createApp from "./app";
import { connectDB } from "./config/db";
import { setupLocationSocket } from "./sockets/location.socket";
import config from "./config";

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Create Express App
  const app = createApp();

  // Create HTTP Server
  const httpServer = createServer(app);

  // Set up Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // Initialize Socket Handlers
  setupLocationSocket(io);

  // Start Server
  const PORT = config.PORT;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO is enabled`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
