import { Request, Response } from "express";
import partnerOrderService from "../../services/partner/order.service";
import { errorApi, successApi } from "../../utils/apiResponse";

export class PartnerOrderController {
  async createOrder(req: Request, res: Response) {
    try {
      // req.partner is populated by partnerAuth middleware
      const partnerId = (req as any).partner.id;
      const result = await partnerOrderService.createPartnerOrder(req.body, partnerId);

      return successApi(res, result.order, result.isNew ? 201 : 200);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const partnerId = (req as any).partner.id;
      const result = await partnerOrderService.getOrders(partnerId);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message, 500);
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const partnerId = (req as any).partner.id;
      const { id } = req.params;
      const order = await partnerOrderService.getOrderById(id as string, partnerId);
      return successApi(res, { order });
    } catch (err: any) {
      return errorApi(res, err.message, 404);
    }
  }
}

export default new PartnerOrderController();
