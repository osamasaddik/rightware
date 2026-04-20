import { body, query } from "express-validator";
import { OrderStatus } from "../../utils/constants";
import {
  mongoIdValidator,
  paginationValidator,
  sortValidator,
  searchValidator,
  dateRangeValidator,
} from "../common.validator";

export const updateOrderStatusValidator = [
  body("status")
    .isIn(Object.values(OrderStatus))
    .withMessage(`status must be one of: ${Object.values(OrderStatus).join(", ")}`),
];

export const getCaptainOrdersValidator = [
  ...paginationValidator,
  ...sortValidator(["createdAt", "updatedAt", "status"]),
  ...searchValidator,
  ...dateRangeValidator,
  query("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage(`status must be one of: ${Object.values(OrderStatus).join(", ")}`),
];

export const getCaptainOrderByIdValidator = mongoIdValidator("id");
export const updateOrderStatusByIdValidator = mongoIdValidator("id");
