import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { error } from "../utils/apiResponse";
import Admin from "../models/Admin";
import Partner from "../models/Partner";
import Captain from "../models/Captain";
import { TokenPayload } from "../types";
import { APP_MESSAGES } from "../utils/app-messages";
import { UserRole } from "../utils/constants";
import config from "../config";

export const protectedRoute = (roles: UserRole[] = []) => {
  // @ts-ignore
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let authType: "jwt" | "apiKey" | null = null;
      let token: string | null | undefined = null;
      let apiKey: string | null = null;

      // 1. Check for Authorization header (JWT)
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        authType = "jwt";
        token = req.headers.authorization.split(" ")[1];
      }
      // 2. Check for x-api-key header (API Key for Partners)
      else if (req.headers["x-api-key"]) {
        authType = "apiKey";
        apiKey = req.headers["x-api-key"] as string;
      }

      if (!authType) {
        return error(res, APP_MESSAGES.AUTH.NOT_AUTHORIZED, 401);
      }

      if (authType === "jwt") {
        const decoded = jwt.verify(token!, config.JWT_SECRET) as TokenPayload;

        if (decoded.role === UserRole.ADMIN) {
          const admin = await Admin.findById(decoded.id).select("-password");
          if (!admin) {
            return error(res, APP_MESSAGES.AUTH.ADMIN_NOT_FOUND, 401);
          }
          req.admin = admin;
          req.user = admin;
          req.role = UserRole.ADMIN;
        } else if (decoded.role === UserRole.CAPTAIN) {
          const captain = await Captain.findById(decoded.id);
          if (!captain) {
            return error(res, APP_MESSAGES.AUTH.CAPTAIN_NOT_FOUND, 401);
          }
          req.captain = captain;
          req.user = captain;
          req.role = UserRole.CAPTAIN;
        } else {
          return error(res, APP_MESSAGES.AUTH.INVALID_ROLE, 401);
        }
      } else if (authType === "apiKey") {
        const partner = await Partner.findByRawApiKey(apiKey!);
        if (!partner) {
          return error(res, APP_MESSAGES.AUTH.INVALID_API_KEY, 401);
        }
        req.partner = partner;
        req.user = partner;
        req.role = UserRole.PARTNER;
      }

      // 3. Check roles if provided
      if (roles.length > 0 && !roles.includes(req.role as UserRole)) {
        return error(res, APP_MESSAGES.AUTH.ROLE_NOT_AUTHORIZED(req.role as string), 403);
      }

      next();
    } catch (err: any) {
      if (err.name === "JsonWebTokenError") {
        return error(res, APP_MESSAGES.AUTH.INVALID_TOKEN, 401);
      }
      if (err.name === "TokenExpiredError") {
        return error(res, APP_MESSAGES.AUTH.TOKEN_EXPIRED, 401);
      }
      next(err);
    }
  };
};
