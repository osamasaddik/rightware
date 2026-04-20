import { Router } from "express";
import assignmentController from "../../controllers/admin/assignment.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import {
  assignCaptainValidator,
  assignCaptainByIdValidator,
  unassignCaptainByIdValidator,
} from "../../validators/admin/assignment.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post(
  "/:id/assign",
  [...assignCaptainByIdValidator, ...assignCaptainValidator, validate],
  assignmentController.assignCaptain,
);

router.delete("/:id/unassign", [...unassignCaptainByIdValidator, validate], assignmentController.unassignCaptain);

export default router;
