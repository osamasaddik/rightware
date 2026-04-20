import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorApi } from "../utils/apiResponse";
import Admin from "../models/Admin";
import Partner from "../models/Partner";
import Captain from "../models/Captain";
import { TokenPayload } from "../types";
import { APP_MESSAGES } from "../utils/app-messages";
import { UserRole } from "../utils/constants";
import config from "../config";

type AuthType = "jwt" | "apiKey";

interface AuthCredentials {
  type: AuthType;
  token?: string;
  apiKey?: string;
}

const extractAuthCredentials = (req: Request): AuthCredentials | null => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers["x-api-key"] as string;

  if (authHeader?.startsWith("Bearer ")) {
    return {
      type: "jwt",
      token: authHeader.split(" ")[1]!,
    };
  }

  if (apiKey) {
    return {
      type: "apiKey",
      apiKey,
    };
  }

  return null;
};

const authenticateJWT = async (token: string, req: Request): Promise<void> => {
  const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;

  switch (decoded.role) {
    case UserRole.ADMIN: {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        throw new Error(APP_MESSAGES.AUTH.INVALID_TOKEN);
      }
      req.admin = admin;
      req.user = admin;
      req.role = UserRole.ADMIN;
      break;
    }

    case UserRole.CAPTAIN: {
      const captain = await Captain.findById(decoded.id);
      if (!captain) {
        throw new Error(APP_MESSAGES.AUTH.INVALID_TOKEN);
      }
      req.captain = captain;
      req.user = captain;
      req.role = UserRole.CAPTAIN;
      break;
    }

    default:
      throw new Error(APP_MESSAGES.AUTH.INVALID_ROLE);
  }
};

const authenticateApiKey = async (apiKey: string, req: Request): Promise<void> => {
  const partner = await Partner.findByRawApiKey(apiKey);
  if (!partner) {
    throw new Error(APP_MESSAGES.AUTH.INVALID_API_KEY);
  }
  req.partner = partner;
  req.user = partner;
  req.role = UserRole.PARTNER;
};

export const protectedRoute = (roles: UserRole[] = []) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const credentials = extractAuthCredentials(req);

      if (!credentials) {
        return errorApi(res, APP_MESSAGES.AUTH.NOT_AUTHORIZED, 401);
      }

      if (credentials.type === "jwt" && credentials.token) {
        await authenticateJWT(credentials.token, req);
      } else if (credentials.type === "apiKey" && credentials.apiKey) {
        await authenticateApiKey(credentials.apiKey, req);
      }

      if (roles.length > 0 && !roles.includes(req.role as UserRole)) {
        return errorApi(res, APP_MESSAGES.AUTH.ROLE_NOT_AUTHORIZED(req.role as string), 403);
      }

      next();
    } catch (err: any) {
      if (err.name === "JsonWebTokenError") {
        return errorApi(res, APP_MESSAGES.AUTH.INVALID_TOKEN, 401);
      }
      if (err.name === "TokenExpiredError") {
        return errorApi(res, APP_MESSAGES.AUTH.TOKEN_EXPIRED, 401);
      }
      if (err.message && Object.values(APP_MESSAGES.AUTH).includes(err.message)) {
        return errorApi(res, err.message, 401);
      }
      next(err);
    }
  };
};
