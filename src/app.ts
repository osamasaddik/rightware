import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import { APP_MESSAGES } from "./utils/app-messages";
import { APP_ROUTES } from "./routes/app-routes";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // Routes
  app.use(APP_ROUTES.AUTH.BASE, authRoutes);

  // Health check
  app.get(APP_ROUTES.HEALTH, (req, res) => {
    res.status(200).json({ status: APP_MESSAGES.HEALTH.OK });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
