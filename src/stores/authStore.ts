import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioAutenticado } from "../services/auth";

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: UsuarioAutenticado) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
