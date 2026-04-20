import { Response } from "express";

export interface ApiResponse {
  success: boolean;
  data?: any;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const successApi = (
  res: Response,
  data: any,
  statusCode: number = 200,
  meta?: ApiResponse["meta"],
  message?: string,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
    message,
  });
};

export const errorApi = (res: Response, message: string, statusCode: number = 400, errors?: ApiResponse["errors"]) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
