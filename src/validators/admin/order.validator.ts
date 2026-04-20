import { body } from "express-validator";

export const createOrderValidator = [
  body("customerName").notEmpty(),
  body("customerPhone").matches(/^\+?[0-9]{7,15}$/),
  body("region").notEmpty(),
  body("fullAddress").notEmpty(),
  body("location.lat").isFloat({ min: -90, max: 90 }),
  body("location.lng").isFloat({ min: -180, max: 180 }),
];
