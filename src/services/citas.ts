import { api } from "../lib/axios";

export type EstadoCita = "COMPLETADA" | "CANCELADA";

interface CitaApi {
  id: number;
  status: EstadoCita | "PROGRAMADA";
}

export const citasService = {
  actualizarEstado: async (
    id: number,
    estado: EstadoCita,
  ): Promise<CitaApi> => {
    const respuesta = await api.patch<CitaApi>(`/appointments/${id}/status`, {
      status: estado,
    });

    return respuesta.data;
  },
};
