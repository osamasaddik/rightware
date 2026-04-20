import { Router } from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { APP_MESSAGES } from "../utils/app-messages";
import { APP_ROUTES } from "./app-routes";

const router = Router();

router.post(
  APP_ROUTES.AUTH.LOGIN,
  [
    body("email").isEmail().withMessage(APP_MESSAGES.AUTH.PROVIDE_VALID_EMAIL).normalizeEmail(),
    body("password").notEmpty().withMessage(APP_MESSAGES.AUTH.PASSWORD_REQUIRED),
    validate,
  ],
  login,
);

export default router;
