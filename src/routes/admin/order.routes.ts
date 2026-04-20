import { Router } from "express";
import adminOrderController from "../../controllers/admin/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post(
  "/",
  [
    body("customerName").notEmpty(),
    body("customerPhone").matches(/^\+?[0-9]{7,15}$/),
    body("region").notEmpty(),
    body("fullAddress").notEmpty(),
    body("location.lat").isFloat({ min: -90, max: 90 }),
    body("location.lng").isFloat({ min: -180, max: 180 }),
    validate,
  ],
  adminOrderController.createOrder
);

router.get("/", adminOrderController.getOrders);

router.get("/:id", adminOrderController.getOrderById);

router.put("/:id", adminOrderController.updateOrder);

router.delete("/:id", adminOrderController.deleteOrder);

export default router;
