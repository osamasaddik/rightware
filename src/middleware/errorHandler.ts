import { Request, Response, NextFunction } from "express";
import { errorApi } from "../utils/apiResponse";
import { APP_MESSAGES } from "../utils/app-messages";
import config from "../config";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    return errorApi(res, APP_MESSAGES.ERROR.VALIDATION_ERROR, 400, messages);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorApi(res, APP_MESSAGES.ERROR.DUPLICATE_FIELD(field!), 409);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return errorApi(res, APP_MESSAGES.ERROR.TOKEN_INVALID, 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorApi(res, APP_MESSAGES.ERROR.TOKEN_EXPIRED, 401);
  }

  // Default Error
  const statusCode = err.statusCode || 500;
  const message =
    config.NODE_ENV === "production"
      ? APP_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
      : err.message || APP_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;

  return errorApi(res, message, statusCode);
};
