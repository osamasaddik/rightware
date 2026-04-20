import { Request, Response } from "express";
import assignmentService from "../../services/admin/assignment.service";
import { success, error } from "../../utils/apiResponse";

export class AssignmentController {
  async assignCaptain(req: Request, res: Response) {
    try {
      const { captainId } = req.body;
      const result = await assignmentService.assignCaptain(req.params.id as string, captainId);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message);
    }
  }

  async unassignCaptain(req: Request, res: Response) {
    try {
      const result = await assignmentService.unassignCaptain(req.params.id as string);
      return success(res, result);
    } catch (err: any) {
      return error(res, err.message);
    }
  }
}

export default new AssignmentController();
