import { api } from "../lib/axios";

export interface PerfilMedico {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  foto?: string | null;
  especialidad?: string | null;
}

export async function obtenerPerfil(): Promise<PerfilMedico> {
  const { data } = await api.get<PerfilMedico>("/auth/perfil");
  return data;
}

export async function actualizarPerfil(
  formulario: FormData,
): Promise<PerfilMedico> {
  const { data } = await api.put<PerfilMedico>(
    "/auth/perfil",
    formulario,
  );
  return data;
}
