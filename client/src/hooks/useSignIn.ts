import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";
import useAuthStore from "../store/authStore";
import { LoginResponse } from "../types";

// ─── Type pour les deux cas d'erreur ───
interface FieldError {
  field: string;
  message: string;
}

type AuthError = string | FieldError[];

// ─── Fonction qui normalise l'erreur ───
const parseError = (err: unknown): AuthError => {
  if (!axios.isAxiosError(err)) return "Une erreur inattendue est survenue";

  const data = err.response?.data;

  // Cas Zod → tableau d'erreurs par champ
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors as FieldError[];
  }

  // Cas erreur simple → string
  return data?.message || "Une erreur est survenue";
};

const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      toast.success("Connexion réussie !");
      navigate("/");
    } catch (err) {
      const parsed = parseError(err);
      setError(parsed);

      // Toast — message simple ou premier champ invalide
      if (typeof parsed === "string") {
        toast.error(parsed);
      } else {
        for (const fieldError of parsed) {
          toast.error(`${fieldError.field}: ${fieldError.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useSignIn;