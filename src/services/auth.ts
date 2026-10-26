import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";

export interface UsuarioAutenticado {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  token: string;
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}

export function decodificarToken(token: string): UsuarioAutenticado {
  const partes = token.split(".");

  if (partes.length !== 3) {
    throw new Error("El token JWT no tiene un formato válido.");
  }

  const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");

  const base64ConPadding = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  const bytes = Uint8Array.from(atob(base64ConPadding), (caracter) =>
    caracter.charCodeAt(0),
  );

  const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("id" in payload) ||
    typeof payload.id !== "number" ||
    !("email" in payload) ||
    typeof payload.email !== "string" ||
    !("role" in payload) ||
    typeof payload.role !== "string"
  ) {
    throw new Error("El token no contiene los datos esperados.");
  }

  return payload as UsuarioAutenticado;
}
