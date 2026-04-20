import { Router } from "express";
import partnerOrderController from "../../controllers/partner/order.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

const router = Router();

const partnerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.use(partnerRateLimiter);
router.use(protectedRoute([UserRole.PARTNER]));

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
  partnerOrderController.createOrder
);

export default router;
