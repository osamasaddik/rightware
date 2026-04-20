import { Router } from "express";
import adminOrderController from "../../controllers/admin/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { createOrderValidator } from "../../validators/admin/order.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post("/", [...createOrderValidator, validate], adminOrderController.createOrder);

router.get("/", adminOrderController.getOrders);

router.get("/:id", adminOrderController.getOrderById);

router.put("/:id", adminOrderController.updateOrder);

router.delete("/:id", adminOrderController.deleteOrder);

export default router;
