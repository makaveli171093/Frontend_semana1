import { api } from "../lib/axios";

import type { CitaApi, NuevoEstadoCita } from "../types/citasApi";

import type { CrearCitaDTO } from "../types/dtos";

// Mantenemos estas exportaciones para no romper los imports existentes.
export type { CitaApi, EstadoCita, NuevoEstadoCita } from "../types/citasApi";

export type { CrearCitaDTO } from "../types/dtos";

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

  obtenerPorPaciente: async (id: number): Promise<CitaApi[]> => {
    const respuesta = await api.get<{ appointments: CitaApi[] }>(
      `/patients/${id}`,
    );
    return respuesta.data.appointments;
  },

  crear: async (datos: CrearCitaDTO): Promise<CitaApi> => {
    const respuesta = await api.post<CitaApi>("/appointments", datos);
    return respuesta.data;
  },
};
