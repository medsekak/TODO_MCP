import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";
import useAuthStore from "../store/authStore";
import { Profile } from "../types";

// ─── Type pour les deux cas d'erreur ───
interface FieldError {
  field: string;
  message: string;
}

type AuthError = string | FieldError[];

// ─── Normalisation de l'erreur (même logique que useSignIn) ───
const parseError = (err: unknown): AuthError => {
  if (!axios.isAxiosError(err)) return "Une erreur inattendue est survenue";

  const data = err.response?.data;

  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors as FieldError[];
  }

  return data?.message || "Une erreur est survenue";
};

const notifyError = (parsed: AuthError) => {
  if (typeof parsed === "string") {
    toast.error(parsed);
  } else {
    for (const fieldError of parsed) {
      toast.error(`${fieldError.field}: ${fieldError.message}`);
    }
  }
};

const useProfile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Chargement initial du profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<Profile>("/auth/me");
        setProfile(res.data);
      } catch (err) {
        notifyError(parseError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (username: string, email: string) => {
    setSaving(true);
    try {
      const res = await api.patch<Profile>("/auth/me", { username, email });
      setProfile(res.data);

      // Met à jour le store pour rafraîchir l'avatar / la Navbar
      if (user) {
        setUser({ ...user, username: res.data.username, email: res.data.email });
      }

      toast.success("Profil mis à jour");
      return true;
    } catch (err) {
      notifyError(parseError(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, updateProfile };
};

export default useProfile;
