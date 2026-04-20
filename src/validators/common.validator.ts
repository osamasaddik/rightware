import { query, param } from "express-validator";
import mongoose from "mongoose";

// MongoDB ObjectId validator
export const mongoIdValidator = (field: string = "id") => [
  param(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${field} format`);
      }
      return true;
    }),
];

// Pagination validators
export const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100").toInt(),
];

// Sort validators
export const sortValidator = (allowedFields: string[]) => [
  query("sortBy")
    .optional()
    .isString()
    .isIn(allowedFields)
    .withMessage(`sortBy must be one of: ${allowedFields.join(", ")}`),
  query("sortOrder")
    .optional()
    .isString()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be either 'asc' or 'desc'"),
];

// Search validator
export const searchValidator = [
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("search must be between 1 and 100 characters"),
];

// Date range validators
export const dateRangeValidator = [
  query("startDate").optional().isISO8601().withMessage("startDate must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date")
    .custom((endDate, { req }) => {
      if (req.query?.startDate && endDate) {
        const start = new Date(req.query.startDate as string);
        const end = new Date(endDate);
        if (end < start) {
          throw new Error("endDate must be after startDate");
        }
      }
      return true;
    }),
];
