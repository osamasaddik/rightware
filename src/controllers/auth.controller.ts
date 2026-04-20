import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { success, error } from "../utils/apiResponse";
import { APP_MESSAGES } from "../utils/app-messages";
import { UserRole } from "../utils/constants";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !(await admin.comparePassword(password))) {
      return error(res, APP_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: UserRole.ADMIN },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as any },
    );

    return success(res, {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
