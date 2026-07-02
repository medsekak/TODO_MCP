import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";

const useResendVerification = () => {
  const [loading, setLoading] = useState(false);

  const resend = async (email: string) => {
    if (!email) {
      toast.error("Veuillez saisir votre adresse email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email });
      toast.success(
        res.data?.message || "Un nouveau lien de vérification a été envoyé.",
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Une erreur est survenue lors de l'envoi.",
        );
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading };
};

export default useResendVerification;
