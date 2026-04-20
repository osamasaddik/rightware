import { Router } from "express";
import adminReportController from "../../controllers/admin/report.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { query } from "express-validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.get(
  "/captains/order-volume-drop",
  [
    query("previousFrom").isISO8601().withMessage("previousFrom must be a valid date"),
    query("previousTo").isISO8601().withMessage("previousTo must be a valid date"),
    query("currentFrom").isISO8601().withMessage("currentFrom must be a valid date"),
    query("currentTo").isISO8601().withMessage("currentTo must be a valid date"),
    query("minPreviousOrders")
      .optional()
      .isInt({ min: 1 })
      .withMessage("minPreviousOrders must be at least 1"),
    query("minDropPercentage")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("minDropPercentage must be between 0 and 100"),
    query("sortBy")
      .optional()
      .isIn(["dropPercentage", "dropCount", "previousOrders", "currentOrders"])
      .withMessage("Invalid sortBy field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("sortOrder must be asc or desc"),
    validate,
  ],
  adminReportController.getOrderVolumeDrop
);

export default router;
