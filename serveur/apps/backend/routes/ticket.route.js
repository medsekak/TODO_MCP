import { Router } from "express";
import { verifyToken } from "../middleware/verify.middleware.js";
import { Validate } from "../middleware/validate.middleware.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../validator/ticket.validator.js";
import {
  ListTickets,
  CreateTicket,
  UpdateTicket,
  DeleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();

// Toutes les routes tickets exigent un utilisateur authentifié.
router.use(verifyToken);

router.get("/", ListTickets);
router.post("/", Validate(createTicketSchema), CreateTicket);
router.patch("/:id", Validate(updateTicketSchema), UpdateTicket);
router.delete("/:id", DeleteTicket);

export default router;
