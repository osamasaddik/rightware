import { body } from "express-validator";
import { mongoIdValidator } from "../common.validator";

export const assignCaptainValidator = [
  body("captainId")
    .notEmpty()
    .withMessage("captainId is required")
    .isMongoId()
    .withMessage("captainId must be a valid MongoDB ObjectId"),
];

export const assignCaptainByIdValidator = mongoIdValidator("id");
export const unassignCaptainByIdValidator = mongoIdValidator("id");
