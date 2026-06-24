import * as z from "zod"; 
import sanitizeHtml from "sanitize-html";

const sanitizeString = (str) => {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
};


export const registerSchema = z.object({
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

  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .transform((val) => sanitizeString(val.trim())),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide")
    .toLowerCase()
    .transform((val) => sanitizeString(val.trim())),

  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis")
    .transform((val) => sanitizeString(val.trim())),
});

