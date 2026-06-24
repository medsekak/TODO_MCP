import { Router } from "express";
import { Validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validator/auth.middleware.js";
import { Login, Register, VerifyEmail, Refresh, Logout } from "../controllers/auth.controller.js";


const router = Router();
router.post("/login", Validate(loginSchema), Login);
router.post("/register", Validate(registerSchema), Register);
router.get("/verify", VerifyEmail);
router.post("/refresh", Refresh);
router.post("/logout", Logout);

export default router;