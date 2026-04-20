import { Router } from "express";
import adminAuthController from "../../controllers/admin/auth.controller";
import { validate } from "../../middleware/validate";
import { loginValidator } from "../../validators/admin/auth.validator";

const router = Router();

router.post("/login", [...loginValidator, validate], adminAuthController.login);

export default router;
