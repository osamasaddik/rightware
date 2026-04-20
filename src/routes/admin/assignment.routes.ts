import { Router } from "express";
import assignmentController from "../../controllers/admin/assignment.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { assignCaptainValidator } from "../../validators/admin/assignment.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post("/:id/assign", [...assignCaptainValidator, validate], assignmentController.assignCaptain);

router.delete("/:id/unassign", assignmentController.unassignCaptain);

export default router;
