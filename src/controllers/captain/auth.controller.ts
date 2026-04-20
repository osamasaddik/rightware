import { Request, Response } from "express";
import captainAuthService from "../../services/captain/auth.service";
import { errorApi, successApi } from "../../utils/apiResponse";

export class CaptainAuthController {
  async login(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      const result = await captainAuthService.login(phone);
      return successApi(res, result);
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("inactive")) {
        return errorApi(res, err.message, 401);
      }
      return errorApi(res, err.message, 500);
    }
  }
}

export default new CaptainAuthController();
