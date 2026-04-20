import { Router } from "express";
import adminCaptainController from "../../controllers/admin/captain.controller";
import { protectedRoute } from "../../middleware/protected";
import { UserRole } from "../../utils/constants";
import { validate } from "../../middleware/validate";
import { body, query } from "express-validator";

const router = Router();

router.use(protectedRoute([UserRole.ADMIN]));

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").matches(/^\+?[0-9]{7,15}$/).withMessage("Invalid phone number"),
    body("vehicleType").isIn(["bike", "car", "van"]).withMessage("Invalid vehicle type"),
    validate,
  ],
  adminCaptainController.createCaptain
);

router.get("/", adminCaptainController.getCaptains);

router.get("/:id", adminCaptainController.getCaptainById);

router.put(
  "/:id",
  [
    body("name").optional().notEmpty(),
    body("phone").optional().matches(/^\+?[0-9]{7,15}$/),
    body("vehicleType").optional().isIn(["bike", "car", "van"]),
    validate,
  ],
  adminCaptainController.updateCaptain
);

router.delete("/:id", adminCaptainController.deleteCaptain);

router.patch("/:id/activate", adminCaptainController.activateCaptain);

router.patch("/:id/deactivate", adminCaptainController.deactivateCaptain);

export default router;
