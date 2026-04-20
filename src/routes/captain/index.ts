import { Router } from "express";
import authRoutes from "./auth.routes";
import { APP_ROUTES } from "../app-routes";

const router = Router();

router.use(APP_ROUTES.CAPTAIN.AUTH, authRoutes);

export default router;
