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
}

export default new PartnerOrderController();
