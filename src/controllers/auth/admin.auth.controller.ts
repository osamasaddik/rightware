import { Request, Response } from "express";
import adminAuthService from "../../services/auth/admin.auth.service";
import { success, error } from "../../utils/apiResponse";

export class AdminAuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await adminAuthService.login(email, password);
      return success(res, result);
    } catch (err: any) {
      if (err.message.includes("credentials")) {
        return error(res, err.message, 401);
      }
      return error(res, err.message, 500);
    }
  }
}

export default new AdminAuthController();
