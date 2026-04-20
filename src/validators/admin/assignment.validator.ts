import { body } from "express-validator";

export const assignCaptainValidator = [body("captainId").notEmpty().isMongoId()];
