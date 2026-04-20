import { Router } from "express";
import captainAuthController from "../../controllers/captain/auth.controller";
import { validate } from "../../middleware/validate";
import { loginValidator } from "../../validators/captain/auth.validator";

const router = Router();

router.post("/login", [...loginValidator, validate], captainAuthController.login);

export default router;
