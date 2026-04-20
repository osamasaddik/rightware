import { Router } from "express";
import authRoutes from "./auth.routes";
import orderRoutes from "./order.routes";
import { APP_ROUTES } from "../app-routes";

const router = Router();

router.use(APP_ROUTES.CAPTAIN.AUTH, authRoutes);
router.use(APP_ROUTES.CAPTAIN.ORDERS, orderRoutes);

export default router;
