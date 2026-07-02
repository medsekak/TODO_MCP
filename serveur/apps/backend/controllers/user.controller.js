import { supabase } from "../../../packages/db/supabase.js";

export const GetMe = async (req, res, next) => {
  const {
    data: [user],
    error,
  } = await supabase
    .from("users")
    .select("id, email, username, created_at, is_verified")
    .eq("id", req.user.userId);

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  res.status(200).json(user);
};

export const UpdateMe = async (req, res, next) => {
  const { username, email } = req.body;

  // Unicité de l'email : interdit si déjà pris par un AUTRE utilisateur.
  const { data: emailOwner, error: lookupError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .neq("id", req.user.userId)
    .maybeSingle();

  if (lookupError) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  if (emailOwner) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({ username, email })
    .eq("id", req.user.userId)
    .select("id, email, username, created_at, is_verified")
    .single();

  if (updateError || !updatedUser) {
    return res.status(500).json({
      message:
        updateError?.message || "Erreur lors de la mise à jour du profil",
    });
  }

  res.status(200).json(updatedUser);
};
