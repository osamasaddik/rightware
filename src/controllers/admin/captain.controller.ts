import { Request, Response } from "express";
import adminCaptainService from "../../services/admin/captain.service";
import { success, error } from "../../utils/apiResponse";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminCaptainController {
  async createCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.createCaptain(req.body);
      return success(res, result, 201);
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async getCaptains(req: Request, res: Response) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await adminCaptainService.getCaptains(filters, Number(page) || 1, Number(limit) || 20);
      return success(res, result.items, 200, result.meta);
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async getCaptainById(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.getCaptainById(req.params.id as string);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message, 404);
    }
  }

  async updateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.updateCaptain(req.params.id as string, req.body);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async deleteCaptain(req: Request, res: Response) {
    try {
      await adminCaptainService.deleteCaptain(req.params.id as string);
      return success(res, { message: APP_MESSAGES.CAPTAIN.DELETED });
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async activateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.activateCaptain(req.params.id as string);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async deactivateCaptain(req: Request, res: Response) {
    try {
      const result = await adminCaptainService.deactivateCaptain(req.params.id as string);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message);
    }
  }
}

export default new AdminCaptainController();
