import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/admin";
import partnerRoutes from "./routes/partner";
import captainRoutes from "./routes/captain";
import { APP_MESSAGES } from "./utils/app-messages";
import { APP_ROUTES } from "./routes/app-routes";
import { errorApi, successApi } from "./utils/apiResponse";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // Routes
  app.use(APP_ROUTES.ADMIN.BASE, adminRoutes);
  app.use(APP_ROUTES.PARTNER.BASE, partnerRoutes);
  app.use(APP_ROUTES.CAPTAIN.BASE, captainRoutes);

  // Health check
  app.get(APP_ROUTES.HEALTH, (req, res) => {
    return successApi(res, { status: APP_MESSAGES.HEALTH.OK });
  });

  // 404 Handler - must be after all routes
  app.use((req, res) => {
    return errorApi(res, APP_MESSAGES.ERROR.ROUTE_NOT_FOUND(req.method, req.originalUrl), 404);
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
