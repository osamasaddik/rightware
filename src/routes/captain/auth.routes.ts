import { Router } from "express";
import captainAuthController from "../../controllers/captain/auth.controller";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";

const router = Router();

router.post(
  "/login",
  [body("phone").notEmpty().withMessage(APP_MESSAGES.AUTH.PHONE_REQUIRED), validate],
  captainAuthController.login,
);

export default router;
