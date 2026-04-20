import { Router } from "express";
import adminCaptainController from "../../controllers/admin/captain.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { createCaptainValidator, updateCaptainValidator } from "../../validators/admin/captain.validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post("/", [...createCaptainValidator, validate], adminCaptainController.createCaptain);

router.get("/", adminCaptainController.getCaptains);

router.get("/:id", adminCaptainController.getCaptainById);

router.put("/:id", [...updateCaptainValidator, validate], adminCaptainController.updateCaptain);

router.delete("/:id", adminCaptainController.deleteCaptain);

router.patch("/:id/activate", adminCaptainController.activateCaptain);

router.patch("/:id/deactivate", adminCaptainController.deactivateCaptain);

export default router;
