import { Router } from "express";
import { verifyToken } from "../middleware/verify.middleware.js";
import { Validate } from "../middleware/validate.middleware.js";
import { createApiKeySchema } from "../validator/apikey.validator.js";
import {
  ListApiKeys,
  CreateApiKey,
  RevokeApiKey,
} from "../controllers/apikey.controller.js";

const router = Router();

// La gestion des clés se fait depuis le navigateur → JWT uniquement (pas via une clé API).
router.use(verifyToken);

router.get("/", ListApiKeys);
router.post("/", Validate(createApiKeySchema), CreateApiKey);
router.delete("/:id", RevokeApiKey);

export default router;