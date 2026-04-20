import { Router } from "express";
import captainOrderController from "../../controllers/captain/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole, OrderStatus } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";

const router = Router();

router.use(protectedRoute([UserRole.CAPTAIN]));

router.get("/", captainOrderController.getOrders);

router.get("/:id", captainOrderController.getOrderById);

router.patch(
  "/:id/status",
  [body("status").isIn(Object.values(OrderStatus)).withMessage("Invalid status value"), validate],
  captainOrderController.updateOrderStatus,
);

export default router;
