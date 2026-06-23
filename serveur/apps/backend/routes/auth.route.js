import { Router } from "express";
import { Validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validator/auth.middleware.js";
import { Login, Register } from "../controllers/auth.controller.js";


const router = Router();
router.post("/auth/login", Validate(loginSchema), Login);
router.post("/auth/register", Validate(registerSchema), Register);

export default router;