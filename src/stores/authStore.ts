import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioAutenticado } from "../services/auth";

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: UsuarioAutenticado) => void;
  actualizarUsuario: (datos: Partial<UsuarioAutenticado>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
      actualizarUsuario: (datos) => set((state) => ({ usuario: state.usuario ? { ...state.usuario, ...datos } : null })),
      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
