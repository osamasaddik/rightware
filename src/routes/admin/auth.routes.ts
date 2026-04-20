import { Router } from "express";
import adminAuthController from "../../controllers/admin/auth.controller";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage(APP_MESSAGES.AUTH.PROVIDE_VALID_EMAIL),
    body("password").notEmpty().withMessage(APP_MESSAGES.AUTH.PASSWORD_REQUIRED),
    validate,
  ],
  adminAuthController.login,
);

export default router;
