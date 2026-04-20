import { body, query } from "express-validator";
import { OrderStatus } from "../../utils/constants";
import {
  mongoIdValidator,
  paginationValidator,
  sortValidator,
  searchValidator,
  dateRangeValidator,
} from "../common.validator";

export const createOrderValidator = [
  body("customerName").notEmpty().withMessage("customerName is required"),
  body("customerPhone")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("customerPhone must be a valid phone number"),
  body("region").notEmpty().withMessage("region is required"),
  body("fullAddress").notEmpty().withMessage("fullAddress is required"),
  body("location.lat").isFloat({ min: -90, max: 90 }).withMessage("location.lat must be between -90 and 90"),
  body("location.lng").isFloat({ min: -180, max: 180 }).withMessage("location.lng must be between -180 and 180"),
  body("externalReference")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("externalReference must be between 1 and 100 characters"),
];

export const getPartnerOrdersValidator = [
  ...paginationValidator,
  ...sortValidator(["createdAt", "updatedAt", "status"]),
  ...searchValidator,
  ...dateRangeValidator,
  query("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage(`status must be one of: ${Object.values(OrderStatus).join(", ")}`),
];

export const getPartnerOrderByIdValidator = mongoIdValidator("id");
