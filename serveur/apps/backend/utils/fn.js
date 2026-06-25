import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

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

export const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
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

export const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    path: "/api/v1/auth",
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
};
