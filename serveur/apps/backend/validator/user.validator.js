import * as z from "zod";
import { sanitizeString } from "../utils/fn.js";

export const updateProfileSchema = z.object({
  username: z
    .string({ required_error: "Le nom d'utilisateur est requis" })
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Uniquement lettres, chiffres et underscore")
    .transform((val) => sanitizeString(val.trim())),

  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide")
    .toLowerCase()
    .transform((val) => sanitizeString(val.trim())),
});
