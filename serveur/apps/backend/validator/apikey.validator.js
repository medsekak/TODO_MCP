import * as z from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeString = (str) => {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

export const createApiKeySchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .transform((val) => sanitizeString(val.trim())),
});