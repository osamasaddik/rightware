import { body } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";

export const createCaptainValidator = [
  body("name").notEmpty().withMessage(APP_MESSAGES.AUTH.NAME_REQUIRED),
  body("phone")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage(APP_MESSAGES.AUTH.INVALID_PHONE),
  body("vehicleType").isIn(["bike", "car", "van"]).withMessage(APP_MESSAGES.AUTH.INVALID_VEHICLE),
];

export const updateCaptainValidator = [
  body("name").optional().notEmpty(),
  body("phone")
    .optional()
    .matches(/^\+?[0-9]{7,15}$/),
  body("vehicleType").optional().isIn(["bike", "car", "van"]),
];
