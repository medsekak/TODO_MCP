import * as z from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeString = (str) => {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const STATUSES = ["todo", "in_progress", "done"];

export const createTicketSchema = z.object({
  title: z
    .string({ required_error: "Le titre est requis" })
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas dépasser 200 caractères")
    .transform((val) => sanitizeString(val.trim())),

  description: z
    .string()
    .max(2000, "La description ne peut pas dépasser 2000 caractères")
    .optional()
    .default("")
    .transform((val) => sanitizeString(val.trim())),

  status: z
    .enum(STATUSES, { message: "Statut invalide" })
    .optional()
    .default("todo"),
});

export const updateTicketSchema = z
  .object({
    title: z
      .string()
      .min(1, "Le titre est requis")
      .max(200, "Le titre ne peut pas dépasser 200 caractères")
      .transform((val) => sanitizeString(val.trim()))
      .optional(),

    description: z
      .string()
      .max(2000, "La description ne peut pas dépasser 2000 caractères")
      .transform((val) => sanitizeString(val.trim()))
      .optional(),

    status: z.enum(STATUSES, { message: "Statut invalide" }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Aucun champ à mettre à jour",
  });
