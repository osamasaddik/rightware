import { Request, Response } from "express";
import reportService from "../../services/admin/report.service";
import { errorApi, successApi } from "../../utils/apiResponse";

export class AdminReportController {
  async getOrderVolumeDrop(req: Request, res: Response) {
    try {
      const result = await reportService.getOrderVolumeDrop(req.query);
      return successApi(res, result.items, 200, result.meta);
    } catch (e: any) {
      return errorApi(res, e.message || "Error fetching report");
    }
  }
}

export default new AdminReportController();
