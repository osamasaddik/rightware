import { Router } from "express";
import adminCaptainController from "../../controllers/admin/captain.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import {
  createCaptainValidator,
  updateCaptainValidator,
  getCaptainsValidator,
  getCaptainByIdValidator,
  updateCaptainByIdValidator,
  deleteCaptainByIdValidator,
  activateCaptainValidator,
  deactivateCaptainValidator,
} from "../../validators/admin/captain.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post("/", [...createCaptainValidator, validate], adminCaptainController.createCaptain);

router.get("/", [...getCaptainsValidator, validate], adminCaptainController.getCaptains);

router.get("/:id", [...getCaptainByIdValidator, validate], adminCaptainController.getCaptainById);

router.put(
  "/:id",
  [...updateCaptainByIdValidator, ...updateCaptainValidator, validate],
  adminCaptainController.updateCaptain,
);

router.delete("/:id", [...deleteCaptainByIdValidator, validate], adminCaptainController.deleteCaptain);

router.patch("/:id/activate", [...activateCaptainValidator, validate], adminCaptainController.activateCaptain);

router.patch("/:id/deactivate", [...deactivateCaptainValidator, validate], adminCaptainController.deactivateCaptain);

export default router;
