import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import JWT from "jsonwebtoken";
import { supabase } from "../../../packages/db/supabase.js";
import random from 'js-crypto-random';
import { sendVerificationEmail } from "../utils/email.js";

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const signToken = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
};

export const Login = async (req, res, next) => {
  // verfier si l'utilisateur existe dans la base de donnees
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", req.body.email);
  if (error) {
    throw new ApiError(500, "Internal server error");
  }

  if (data.length === 0) {
    throw new ApiError(404, "User not found");
  }
  if (!comparePassword(req.body.password, data[0].password)) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = signToken({ userId: user.id });
  res.status(200).json({
    user: { id: user.id, email: user.email, username: user.username },
    accessToken,
  });
};



export const Register = async (req, res, next) => {

  const { email, password, username } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);
  if (error) {
    throw new ApiError(500, "Internal server error");
  }

  if (data.length > 0) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = hashPassword(password);
  const token = random.getRandomAsciiString(32);

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email, username, password_hash: hashedPassword, token }])
    .select("*")
    .single();

  if (insertError) {
    throw new ApiError(500, insertError.message || "Internal server error");
  }

  // send verification email
  await sendVerificationEmail(newUser.email, token);

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
  });


}
