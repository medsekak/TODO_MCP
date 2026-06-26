import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";
import { ApiKey, CreatedApiKey } from "../types";

// Normalisation de l'erreur (même logique que useProfile).
const parseError = (err: unknown): string => {
  if (!axios.isAxiosError(err)) return "Une erreur inattendue est survenue";
  const data = err.response?.data;
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors[0]?.message ?? "Une erreur est survenue";
  }
  return data?.message || "Une erreur est survenue";
};

const useApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Chargement initial des clés
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await api.get<ApiKey[]>("/api-keys");
        setKeys(res.data);
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, []);

  // Génère une clé et renvoie la clé en clair (à afficher une seule fois), ou null si échec.
  const generateKey = async (name: string): Promise<string | null> => {
    setGenerating(true);
    try {
      const res = await api.post<CreatedApiKey>("/api-keys", { name });
      const { key, ...meta } = res.data;
      setKeys((prev) => [meta, ...prev]);
      toast.success("Clé API générée");
      return key;
    } catch (err) {
      toast.error(parseError(err));
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const revokeKey = async (id: string) => {
    // Mise à jour optimiste : on retire la clé, on la remet en cas d'échec.
    const previous = keys;
    setKeys((prev) => prev.filter((k) => k.id !== id));
    try {
      await api.delete(`/api-keys/${id}`);
      toast.success("Clé révoquée");
    } catch (err) {
      setKeys(previous);
      toast.error(parseError(err));
    }
  };

  return { keys, loading, generating, generateKey, revokeKey };
};

export default useApiKeys;