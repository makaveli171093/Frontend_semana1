import { api } from "../lib/axios";
import type {
  CitaApi,
  EstadoCita,
  NuevoEstadoCita,
  CitaHistorialApi,
} from "../types/citasApi";
import type { CrearCitaDTO } from "../types/dtos";
import type { RespuestaPaginada } from "../types/api";

interface ParametrosHistorial {
  pagina: number;
  limite: number;
  estado: EstadoCita | "TODOS";
  signal?: AbortSignal;
}

export type { CitaApi, EstadoCita, NuevoEstadoCita } from "../types/citasApi";

export type { CrearCitaDTO } from "../types/dtos";

export const citasService = {
  obtenerMiHistorial: async (
    filtros: ParametrosHistorial,
  ): Promise<RespuestaPaginada<CitaHistorialApi>> => {
    const { pagina, limite, estado, signal } = filtros;

    const respuesta = await api.get<RespuestaPaginada<CitaHistorialApi>>(
      "/doctors/me/appointments/history",
      {
        params: { pagina, limite, estado },
        ...(signal ? { signal } : {}),
      },
    );

    return respuesta.data;
  },

  obtenerHistorialMedico: async (
    medicoId: number,
    filtros: ParametrosHistorial,
  ): Promise<RespuestaPaginada<CitaHistorialApi>> => {
    const { pagina, limite, estado, signal } = filtros;

    const respuesta = await api.get<RespuestaPaginada<CitaHistorialApi>>(
      `/doctors/${medicoId}/appointments/history`,
      {
        params: { pagina, limite, estado },
        ...(signal ? { signal } : {}),
      },
    );

    return respuesta.data;
  },

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
