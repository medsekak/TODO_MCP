import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";

interface IAuth {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setAccessToken: (token: string) => void;
    setUser: (user: User) => void;
}

const useAuthStore = create<IAuth>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      // on ne persiste QUE le user, jamais le token brut
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
