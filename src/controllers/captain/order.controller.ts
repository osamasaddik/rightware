import { Request, Response } from "express";
import captainOrderService from "../../services/captain/order.service";
import { errorApi, successApi } from "../../utils/apiResponse";

export class CaptainOrderController {
  async getOrders(req: Request, res: Response) {
    try {
      const captainId = (req as any).user.id;
      const { page, limit, sortBy, sortOrder, search, startDate, endDate, ...filters } = req.query;

      const sort: any = {};
      if (sortBy) {
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      // Build filters
      const mongoFilters: any = { captainId, ...filters };
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

      const result = await captainOrderService.getOrders(
        captainId,
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
      const captainId = (req as any).user.id;
      const { id } = req.params;
      const order = await captainOrderService.getOrderById(id as string, captainId);
      return successApi(res, { order });
    } catch (err: any) {
      return errorApi(res, err.message, 404);
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
