import { query } from "express-validator";

export const orderVolumeDropValidator = [
  query("previousFrom").isISO8601().withMessage("previousFrom must be a valid date"),
  query("previousTo").isISO8601().withMessage("previousTo must be a valid date"),
  query("currentFrom").isISO8601().withMessage("currentFrom must be a valid date"),
  query("currentTo").isISO8601().withMessage("currentTo must be a valid date"),
  query("minPreviousOrders").optional().isInt({ min: 1 }).withMessage("minPreviousOrders must be at least 1"),
  query("minDropPercentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("minDropPercentage must be between 0 and 100"),
  query("sortBy")
    .optional()
    .isIn(["dropPercentage", "dropCount", "previousOrders", "currentOrders"])
    .withMessage("Invalid sortBy field"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("sortOrder must be asc or desc"),
];
