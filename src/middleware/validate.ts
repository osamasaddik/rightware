import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { errorApi } from "../utils/apiResponse";
import { APP_MESSAGES } from "../utils/app-messages";

// @ts-ignore
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err: any) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return errorApi(res, APP_MESSAGES.ERROR.VALIDATION_ERROR, 400, formattedErrors);
  }
  next();
};
