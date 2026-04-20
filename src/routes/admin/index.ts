import { Router } from "express";
import authRoutes from "./auth.routes";
import captainRoutes from "./captain.routes";
import orderRoutes from "./order.routes";
import assignmentRoutes from "./assignment.routes";
import reportRoutes from "./report.routes";
import { APP_ROUTES } from "../app-routes";

const router = Router();

router.use(APP_ROUTES.ADMIN.AUTH, authRoutes);
router.use(APP_ROUTES.ADMIN.CAPTAINS, captainRoutes);
router.use(APP_ROUTES.ADMIN.ORDERS, orderRoutes);
router.use(APP_ROUTES.ADMIN.ORDERS, assignmentRoutes); // Both use /orders/:id...
router.use(APP_ROUTES.ADMIN.REPORTS, reportRoutes);

export default router;
