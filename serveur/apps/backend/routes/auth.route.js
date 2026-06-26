import { Router } from "express";
import { Validate } from "../middleware/validate.middleware.js";
import { verifyToken } from "../middleware/verify.middleware.js";
import { loginSchema, registerSchema, resendEmailSchema, updateProfileSchema } from "../validator/auth.middleware.js";
import { Login, Register, VerifyEmail, Refresh, Logout, RequestNewVerficationEmail, GetMe, UpdateMe } from "../controllers/auth.controller.js";


const router = Router();
router.post("/login", Validate(loginSchema), Login);
router.post("/register", Validate(registerSchema), Register);
router.get("/verify", VerifyEmail);
router.post("/resend-verification", Validate(resendEmailSchema), RequestNewVerficationEmail);
router.post("/refresh", Refresh);
router.post("/logout", Logout);
router.get("/me", verifyToken, GetMe);
router.patch("/me", verifyToken, Validate(updateProfileSchema), UpdateMe);

export default router;