import { body } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";

export const loginValidator = [
  body("email").isEmail().withMessage(APP_MESSAGES.AUTH.PROVIDE_VALID_EMAIL),
  body("password").notEmpty().withMessage(APP_MESSAGES.AUTH.PASSWORD_REQUIRED),
];
