import { supabase } from "../../../packages/db/supabase.js";
import { generateApiKey, sha256 } from "../utils/fn.js";

// GET /api-keys — liste les clés de l'utilisateur connecté (jamais la clé en clair).
export const ListApiKeys = async (req, res) => {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at, revoked")
    .eq("user_id", req.user.userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(200).json(data);
};

// POST /api-keys — génère une nouvelle clé. La clé en clair n'est renvoyée qu'ici, une seule fois.
export const CreateApiKey = async (req, res) => {
  const { name } = req.body;

  const rawKey = generateApiKey();
  const key_prefix = rawKey.slice(0, 16) + "…";
  const key_hash = sha256(rawKey);

  const { data, error } = await supabase
    .from("api_keys")
    .insert([{ user_id: req.user.userId, name, key_prefix, key_hash }])
    .select("id, name, key_prefix, created_at, last_used_at, revoked")
    .single();

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  // On renvoie la clé en clair UNE SEULE FOIS — elle n'est jamais stockée ni re-renvoyée.
  res.status(201).json({ ...data, key: rawKey });
};

// DELETE /api-keys/:id — révoque (supprime) une clé de l'utilisateur connecté.
export const RevokeApiKey = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.userId);

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  res.status(204).send();
};