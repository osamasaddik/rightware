import { Router } from "express";
import adminAuthController from "../../controllers/auth/admin.auth.controller";
import { validate } from "../../middleware/validate";
import { body } from "express-validator";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  adminAuthController.login
);

export default router;
