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
      const { page, limit, sortBy, sortOrder, search, startDate, endDate, ...filters } = req.query;

      const sort: any = {};
      if (sortBy) {
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      // Build filters
      const mongoFilters: any = { partnerId, ...filters };
      if (search) {
        mongoFilters.$or = [
          { orderNumber: { $regex: search, $options: "i" } },
          { customerName: { $regex: search, $options: "i" } },
          { customerPhone: { $regex: search, $options: "i" } },
        ];
      }

      // Date range filter
      if (startDate || endDate) {
        mongoFilters.createdAt = {};
        if (startDate) mongoFilters.createdAt.$gte = new Date(startDate as string);
        if (endDate) mongoFilters.createdAt.$lte = new Date(endDate as string);
      }

      const result = await partnerOrderService.getOrders(
        partnerId,
        mongoFilters,
        sort,
        Number(page) || 1,
        Number(limit) || 20,
      );
      return successApi(res, result.items, 200, result.meta);
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
