import React from "react";
import api from "../lib/api";
import { LoginResponse } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

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

const useSignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      await api.post<LoginResponse>("/auth/register", {
        username,
        email,
        password,
      });
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/signin"); // Rediriger vers la page de connexion après l'inscription réussie
    } catch (err: Error | any) {
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

  return { register, loading, error };
};

export default useSignUp;
