import { body } from "express-validator";
import { OrderStatus } from "../../utils/constants";

export const updateOrderStatusValidator = [
  body("status").isIn(Object.values(OrderStatus)).withMessage("Invalid status value"),
];
