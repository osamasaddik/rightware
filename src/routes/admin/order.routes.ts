import { Router } from "express";
import adminOrderController from "../../controllers/admin/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import {
  createOrderValidator,
  updateOrderValidator,
  getOrdersValidator,
  getOrderByIdValidator,
} from "../../validators/admin/order.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post("/", [...createOrderValidator, validate], adminOrderController.createOrder);

router.get("/", [...getOrdersValidator, validate], adminOrderController.getOrders);

router.get("/:id", [...getOrderByIdValidator, validate], adminOrderController.getOrderById);

router.put("/:id", [...getOrderByIdValidator, ...updateOrderValidator, validate], adminOrderController.updateOrder);

router.delete("/:id", [...getOrderByIdValidator, validate], adminOrderController.deleteOrder);

export default router;
