import { Request, Response } from "express";
import adminOrderService from "../../services/admin/order.service";
import { errorApi, successApi } from "../../utils/apiResponse";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminOrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const result = await adminOrderService.createOrder(req.body);
      return successApi(res, result, 201);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder, search, ...filters } = req.query;

      const sort: any = {};
      if (sortBy) {
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      // Advanced filtering for Phase 9
      const mongoFilters: any = { ...filters };
      if (search) {
        mongoFilters.$or = [
          { orderNumber: { $regex: search, $options: "i" } },
          { customerName: { $regex: search, $options: "i" } },
          { customerPhone: { $regex: search, $options: "i" } },
        ];
      }

      if (filters.assigned === "true") {
        mongoFilters.captainId = { $ne: null };
        delete mongoFilters.assigned;
      } else if (filters.assigned === "false") {
        mongoFilters.captainId = null;
        delete mongoFilters.assigned;
      }

      const result = await adminOrderService.getOrders(mongoFilters, sort, Number(page) || 1, Number(limit) || 20);
      return successApi(res, result.items, 200, result.meta);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const result = await adminOrderService.getOrderById(req.params.id as string);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message, 404);
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const result = await adminOrderService.updateOrder(req.params.id as string, req.body);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      await adminOrderService.deleteOrder(req.params.id as string);
      return successApi(res, { message: APP_MESSAGES.ORDER.DELETED });
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }
}

export default new AdminOrderController();
