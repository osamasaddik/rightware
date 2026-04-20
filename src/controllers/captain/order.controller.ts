import { Request, Response } from "express";
import captainOrderService from "../../services/captain/order.service";
import { errorApi, successApi } from "../../utils/apiResponse";

export class CaptainOrderController {
  async getOrders(req: Request, res: Response) {
    try {
      const captainId = (req as any).user.id;
      const result = await captainOrderService.getOrders(captainId);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message, 500);
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const captainId = (req as any).user.id;
      const { id } = req.params;
      const { status } = req.body;

      const result = await captainOrderService.updateOrderStatus(id as string, captainId, status);
      return successApi(res, { order: result });
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("not assigned")) {
        return errorApi(res, err.message, 404);
      }
      if (err.message.includes("Cannot change status")) {
        return errorApi(res, err.message, 400);
      }
      return errorApi(res, err.message, 500);
    }
  }
}

export default new CaptainOrderController();
