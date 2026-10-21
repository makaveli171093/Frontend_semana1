import { api } from "../lib/axios";

export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA" | "ATENDIDO";

export type NuevoEstadoCita = "COMPLETADA" | "CANCELADA";

export interface CitaApi {
  id: number;
  patientId: number;
  doctorId: number;
  status: EstadoCita;
  scheduledAt: string;
  reason?: string | null;
}

export const citasService = {
  obtenerPorId: async (id: number): Promise<CitaApi> => {
    const respuesta = await api.get<CitaApi>(`/appointments/${id}`);
    return respuesta.data;
  },

  actualizarEstado: async (
    id: number,
    estado: NuevoEstadoCita,
  ): Promise<CitaApi> => {
    const respuesta = await api.patch<CitaApi>(`/appointments/${id}/status`, {
      status: estado,
    });

    return respuesta.data;
  },
};
