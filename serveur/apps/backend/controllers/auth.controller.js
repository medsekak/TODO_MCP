import { ApiError } from "../utils/ApiError.js";
import { supabase } from "../../../packages/db/supabase.js";
import { sendVerificationEmail } from "../utils/email.js";
import crypto from "crypto";
import {
  signRefreshToken,
  signToken,
  setRefreshCookie,
  verifyToken,
  comparePassword,
  verifyRefreshToken,
  clearRefreshCookie,
  REFRESH_COOKIE,
  hashPassword,
} from "../utils/fn.js";

export const Login = async (req, res, next) => {
  // verfier si l'utilisateur existe dans la base de donnees
  const {
    data: [user],
    error,
  } = await supabase.from("users").select("*").eq("email", req.body.email);

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  if (!user) {
    return res.status(400).json({ message: "Utilisateur non trouvé" });
  }

  if (!comparePassword(req.body.password, user.password_hash)) {
    return res.status(401).json({ message: "Mot de passe incorrect" });
  }

  if (!user.is_verified) {
    return res
      .status(403)
      .json({ message: "Email non vérifié. Veuillez vérifier votre email." });
  }

  const accessToken = signToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    user: { id: user.id, email: user.email, username: user.username },
    accessToken,
  });
};

export const Register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // 1. Email existe déjà ?
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser)
      return res.status(409).json({ message: "Email déjà utilisé" });

    // 2. Hasher le password
    const hashedPassword = await hashPassword(password);

    // 3. Créer l'utilisateur
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email, username, password_hash: hashedPassword }])
      .select("id, email, username") // ← obligatoire pour récupérer l'id
      .single();

    if (insertError || !newUser)
      return res.status(500).json({
        message:
          insertError?.message || "Erreur lors de la création de l'utilisateur",
      });

    // 4. Générer le token de vérification
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 5. Sauvegarder le token
    const { error: tokenError } = await supabase
      .from("email_verifications")
      .insert([{ user_id: newUser.id, token, expires_at: expiresAt }]);

    if (tokenError)
      return res.status(500).json({
        message:
          tokenError.message ||
          "Erreur lors de la création du token de vérification",
      });

    // 6. Envoyer l'email
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "Compte créé. Vérifie ton email pour activer ton compte.",
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const VerifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token manquant" });

    // 1. Chercher le token
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_verifications")
      .select("user_id, expires_at")
      .eq("token", token)
      .single();

    // 2. Vérifier tokenError ET tokenData séparément
    if (tokenError || !tokenData)
      return res.status(400).json({ message: "Token invalide" });

    // 3. Token expiré → supprimer PUIS throw
    if (new Date(tokenData.expires_at) < new Date()) {
      await supabase.from("email_verifications").delete().eq("token", token);

      return res
        .status(400)
        .json({ message: "Token expiré, demande un nouveau lien" });
    }

    // 4. Activer le compte
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", tokenData.user_id);

    if (updateError)
      return res.status(500).json({
        message: updateError.message || "Erreur lors de l'activation du compte",
      });

    // 5. Supprimer le token — usage unique
    await supabase.from("email_verifications").delete().eq("token", token);

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const Refresh = async (req, res, next) => {
  const token = req.cookies?.[REFRESH_COOKIE];

  if (!token) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    clearRefreshCookie(res);
    return res
      .status(401)
      .json({ message: "Refresh token invalide ou expiré" });
  }

  const {
    data: [user],
    error,
  } = await supabase
    .from("users")
    .select("id, email, username")
    .eq("id", payload.userId);

  if (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  if (!user) {
    clearRefreshCookie(res);
    return res.status(401).json({ message: "Utilisateur introuvable" });
  }

  const accessToken = signToken({ userId: user.id });

  res.status(200).json({ user, accessToken });
};

export const Logout = async (req, res, next) => {
  clearRefreshCookie(res);
  res.status(200).json({ message: "Déconnecté" });
};
