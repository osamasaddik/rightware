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
];

export const updateOrderValidator = [
  body("customerName").optional().notEmpty().withMessage("customerName cannot be empty"),
  body("customerPhone")
    .optional()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("customerPhone must be a valid phone number"),
  body("region").optional().notEmpty().withMessage("region cannot be empty"),
  body("fullAddress").optional().notEmpty().withMessage("fullAddress cannot be empty"),
  body("location.lat").optional().isFloat({ min: -90, max: 90 }).withMessage("location.lat must be between -90 and 90"),
  body("location.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("location.lng must be between -180 and 180"),
];

export const getOrdersValidator = [
  ...paginationValidator,
  ...sortValidator(["createdAt", "updatedAt", "status", "orderNumber"]),
  ...searchValidator,
  ...dateRangeValidator,
  query("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage(`status must be one of: ${Object.values(OrderStatus).join(", ")}`),
  query("region").optional().isString().trim().withMessage("region must be a string"),
  query("captainId")
    .optional()
    .custom((value) => {
      if (value && !require("mongoose").Types.ObjectId.isValid(value)) {
        throw new Error("captainId must be a valid MongoDB ObjectId");
      }
      return true;
    }),
  query("assigned").optional().isIn(["true", "false"]).withMessage("assigned must be either 'true' or 'false'"),
];

export const getOrderByIdValidator = mongoIdValidator("id");
