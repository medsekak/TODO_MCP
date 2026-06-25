import { supabase } from "../../../packages/db/supabase.js";

// GET /tickets — liste les tickets de l'utilisateur connecté (ordre de création).
export const ListTickets = async (req, res) => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", req.user.userId)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(200).json(data);
};

// POST /tickets — crée un ticket pour l'utilisateur connecté.
export const CreateTicket = async (req, res) => {
  const { title, description, status } = req.body;

  const { data, error } = await supabase
    .from("tickets")
    .insert([{ title, description, status, user_id: req.user.userId }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(201).json(data);
};

// PATCH /tickets/:id — édite (titre/description) ou déplace (statut) un ticket.
export const UpdateTicket = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("tickets")
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", req.user.userId)
    .select()
    .single();

  if (error) {
    // Aucune ligne correspondante (mauvais id ou pas le propriétaire)
    if (error.code === "PGRST116") {
      return res.status(404).json({ message: "Ticket introuvable" });
    }
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(200).json(data);
};

// DELETE /tickets/:id — supprime un ticket de l'utilisateur connecté.
export const DeleteTicket = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.userId);

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(204).send();
};
