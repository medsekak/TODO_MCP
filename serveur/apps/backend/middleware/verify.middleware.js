import JWT from "jsonwebtoken";
import { supabase } from "../../../packages/db/supabase.js";
import { sha256 } from "../utils/fn.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// Authentifie via JWT (session navigateur) OU clé API (préfixe "todo_sk_").
// Utilisé sur les routes consommables par le serveur MCP (tickets).
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  // Clé API : recherche par hash SHA-256, doit exister et ne pas être révoquée.
  if (token.startsWith("todo_sk_")) {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, user_id, revoked")
      .eq("key_hash", sha256(token))
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
    if (!data || data.revoked) {
      return res.status(401).json({ message: "Clé API invalide ou révoquée" });
    }

    req.user = { userId: data.user_id };
    // Trace de dernière utilisation (best-effort, sans bloquer la requête).
    supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id)
      .then(() => {});

    return next();
  }

  // Sinon : JWT classique (session navigateur).
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
