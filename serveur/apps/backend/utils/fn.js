import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import sanitizeHtml from "sanitize-html";

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const signToken = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
  });
};

export const signRefreshToken = (payload) => {
  return JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || "7d",
  });
};

export const verifyRefreshToken = (token) => {
  return JWT.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const REFRESH_COOKIE = "refreshToken";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  path: "/api/v1/auth",
};

export const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE, token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
};

export const expireAt = () => new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

// Hash déterministe (SHA-256) — utilisé pour stocker/retrouver les clés API.
// Pas de bcrypt ici : une clé API est déjà aléatoire (256 bits), pas un mot de passe.
export const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

// Génère une clé API : "todo_sk_<64 hex>" (préfixe reconnaissable + 256 bits d'entropie).
export const generateApiKey = () =>
  "todo_sk_" + crypto.randomBytes(32).toString("hex");

export const sanitizeString = (str) => {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
