import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";

const useVerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Token manquant");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify?token=${token}`);
        setSuccess(true);
        toast.success("Email vérifié ! Tu peux te connecter.");
        setTimeout(() => navigate("/signin"), 2000); // ← redirige après 2s
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Une erreur est survenue");
          toast.error(err.response?.data?.message || "Token invalide ou expiré");
        } else {
          setError("Une erreur inattendue est survenue");
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []); // ← s'exécute une seule fois au montage du composant

  return { loading, error, success };
};

export default useVerifyEmail;