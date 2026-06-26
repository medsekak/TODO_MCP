import { Router } from "express";
import { Validate } from "../middleware/validate.middleware.js";
import { verifyToken } from "../middleware/verify.middleware.js";
import { loginSchema, registerSchema, resendEmailSchema } from "../validator/auth.middleware.js";
import { Login, Register, VerifyEmail, Refresh, Logout, RequestNewVerficationEmail } from "../controllers/auth.controller.js";


const router = Router();
router.post("/login", Validate(loginSchema), Login);
router.post("/register", Validate(registerSchema), Register);
router.get("/verify", VerifyEmail);
router.post("/resend-verification", Validate(resendEmailSchema), RequestNewVerficationEmail);
router.post("/refresh", Refresh);
router.post("/logout", Logout);

export default router;