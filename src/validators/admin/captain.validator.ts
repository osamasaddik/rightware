import { body, query } from "express-validator";
import { APP_MESSAGES } from "../../utils/app-messages";
import { mongoIdValidator, paginationValidator, sortValidator, searchValidator } from "../common.validator";

export const createCaptainValidator = [
  body("name").notEmpty().withMessage(APP_MESSAGES.AUTH.NAME_REQUIRED),
  body("phone")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage(APP_MESSAGES.AUTH.INVALID_PHONE),
  body("vehicleType").isIn(["bike", "car", "van"]).withMessage(APP_MESSAGES.AUTH.INVALID_VEHICLE),
];

export const updateCaptainValidator = [
  body("name").optional().notEmpty().withMessage("name cannot be empty"),
  body("phone")
    .optional()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage(APP_MESSAGES.AUTH.INVALID_PHONE),
  body("vehicleType").optional().isIn(["bike", "car", "van"]).withMessage(APP_MESSAGES.AUTH.INVALID_VEHICLE),
  body("status").optional().isIn(["active", "inactive"]).withMessage("status must be either 'active' or 'inactive'"),
  body("availability")
    .optional()
    .isIn(["online", "offline"])
    .withMessage("availability must be either 'online' or 'offline'"),
];

export const getCaptainsValidator = [
  ...paginationValidator,
  ...sortValidator(["createdAt", "updatedAt", "name", "status"]),
  ...searchValidator,
  query("status").optional().isIn(["active", "inactive"]).withMessage("status must be either 'active' or 'inactive'"),
  query("availability")
    .optional()
    .isIn(["online", "offline"])
    .withMessage("availability must be either 'online' or 'offline'"),
  query("vehicleType")
    .optional()
    .isIn(["bike", "car", "van"])
    .withMessage("vehicleType must be one of: bike, car, van"),
];

export const getCaptainByIdValidator = mongoIdValidator("id");
export const updateCaptainByIdValidator = mongoIdValidator("id");
export const deleteCaptainByIdValidator = mongoIdValidator("id");
export const activateCaptainValidator = mongoIdValidator("id");
export const deactivateCaptainValidator = mongoIdValidator("id");
