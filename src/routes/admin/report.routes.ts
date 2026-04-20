import { Router } from "express";
import adminReportController from "../../controllers/admin/report.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { orderVolumeDropValidator } from "../../validators/admin/report.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.get(
  "/captains/order-volume-drop",
  [...orderVolumeDropValidator, validate],
  adminReportController.getOrderVolumeDrop,
);

export default router;
