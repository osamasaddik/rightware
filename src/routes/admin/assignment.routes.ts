import { Router } from "express";
import assignmentController from "../../controllers/admin/assignment.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post(
  "/:id/assign",
  [
    body("captainId").notEmpty().isMongoId(),
    validate,
  ],
  assignmentController.assignCaptain
);

router.delete("/:id/unassign", assignmentController.unassignCaptain);

export default router;
