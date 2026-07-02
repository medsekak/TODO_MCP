import axios, { AxiosError, AxiosRequestConfig } from "axios";
import useAuthStore from "../store/authStore";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // envoie/reçoit le cookie httpOnly du refresh token
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Rafraîchissement automatique de l'access token sur 401 ───
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await api.post("/auth/refresh");
    const { user, accessToken } = res.data;
    useAuthStore.getState().login(user, accessToken);
    return accessToken as string;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean; url?: string })
      | undefined;

    const isRefreshCall = original?.url?.includes("/auth/refresh");
    const isLoginCall = original?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isRefreshCall &&
      !isLoginCall
    ) {
      original._retry = true;

      // une seule requête de refresh partagée par tous les appels concurrents
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      if (newToken) {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      }

      // refresh échoué → on retourne à la page de connexion
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);

// Déconnexion initiée par l'utilisateur : on efface le cookie côté serveur puis l'état local.
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // on déconnecte localement même si l'appel serveur échoue
  } finally {
    useAuthStore.getState().logout();
  }
};

export default api;
