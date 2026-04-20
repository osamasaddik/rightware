import jwt from "jsonwebtoken";
import config from "../config";
import { UserRole } from "./constants";
import { APP_MESSAGES } from "./app-messages";

export interface TokenPayload {
  id: string;
  role: UserRole;
  [key: string]: any;
}

export interface ValidationError {
  message: string;
  success: false;
}

export const validateToken = (token: any): { valid: boolean; error?: ValidationError; decoded?: TokenPayload } => {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return {
      valid: false,
      error: {
        message: "Token is required and must be a valid string",
        success: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;

    if (!decoded.id || !decoded.role) {
      return {
        valid: false,
        error: {
          message: "Invalid token payload",
          success: false,
        },
      };
    }

    return { valid: true, decoded };
  } catch (err: any) {
    const errorMessage =
      err.name === "JsonWebTokenError"
        ? "Invalid token format"
        : err.name === "TokenExpiredError"
          ? "Token has expired"
          : APP_MESSAGES.AUTH.INVALID_TOKEN;

    return {
      valid: false,
      error: {
        message: errorMessage,
        success: false,
      },
    };
  }
};

export const validateRole = (role: UserRole, expectedRole: UserRole): { valid: boolean; error?: ValidationError } => {
  if (role !== expectedRole) {
    return {
      valid: false,
      error: {
        message: APP_MESSAGES.AUTH.INVALID_ROLE,
        success: false,
      },
    };
  }
  return { valid: true };
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
