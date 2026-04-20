import { Request, Response } from "express";
import captainAuthService from "../../services/captain/auth.service";
import { success, error } from "../../utils/apiResponse";

export class CaptainAuthController {
  async login(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      const result = await captainAuthService.login(phone);
      return success(res, result);
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("inactive")) {
        return error(res, err.message, 401);
      }
      return error(res, err.message, 500);
    }
  }
}

export default new CaptainAuthController();
