import { Request, Response } from "express";
import adminCaptainService from "../../services/admin/captain.service";
import { errorApi, successApi } from "../../utils/apiResponse";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminCaptainController {
  async createCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.createCaptain(req.body);
      return successApi(res, result, 201);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async getCaptains(req: Request, res: Response) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await adminCaptainService.getCaptains(filters, Number(page) || 1, Number(limit) || 20);
      return successApi(res, result.items, 200, result.meta);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async getCaptainById(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.getCaptainById(req.params.id as string);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message, 404);
    }
  }

  async updateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.updateCaptain(req.params.id as string, req.body);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async deleteCaptain(req: Request, res: Response) {
    try {
      await adminCaptainService.deleteCaptain(req.params.id as string);
      return successApi(res, { message: APP_MESSAGES.CAPTAIN.DELETED });
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async activateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.activateCaptain(req.params.id as string);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }

  async deactivateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.deactivateCaptain(req.params.id as string);
      return successApi(res, result);
    } catch (err: any) {
      return errorApi(res, err.message);
    }
  }
}

export default new AdminCaptainController();
