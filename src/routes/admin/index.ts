import { Router } from "express";
import authRoutes from "./auth.routes";
import captainRoutes from "./captain.routes";
import orderRoutes from "./order.routes";
import assignmentRoutes from "./assignment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/captains", captainRoutes);
router.use("/orders", orderRoutes);
router.use("/orders", assignmentRoutes); // Both use /orders/:id...

export default router;
