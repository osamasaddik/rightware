import { body } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";

export const loginValidator = [body("phone").notEmpty().withMessage(APP_MESSAGES.AUTH.PHONE_REQUIRED)];
