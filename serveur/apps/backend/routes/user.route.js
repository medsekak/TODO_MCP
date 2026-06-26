import { Router } from "express";
import { Validate } from "../middleware/validate.middleware.js";
import { verifyToken } from "../middleware/verify.middleware.js";
import { updateProfileSchema } from "../validator/user.validator.js";
import { GetMe, UpdateMe } from "../controllers/user.controller.js";

const router = Router();

router.use(verifyToken); // Toutes les routes de ce fichier exigent un utilisateur authentifié (JWT navigateur).

router.get("/me", GetMe);
router.patch("/me", Validate(updateProfileSchema), UpdateMe);

export default router;
