import { Router } from "express";
import captainOrderController from "../../controllers/captain/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import {
  updateOrderStatusValidator,
  getCaptainOrdersValidator,
  getCaptainOrderByIdValidator,
  updateOrderStatusByIdValidator,
} from "../../validators/captain/order.validator";

const router = Router();

router.use(protectedRoute([UserRole.CAPTAIN]));

router.get("/", [...getCaptainOrdersValidator, validate], captainOrderController.getOrders);

router.get("/:id", [...getCaptainOrderByIdValidator, validate], captainOrderController.getOrderById);

router.patch(
  "/:id/status",
  [...updateOrderStatusByIdValidator, ...updateOrderStatusValidator, validate],
  captainOrderController.updateOrderStatus,
);

export default router;
