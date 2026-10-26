import { api } from "../lib/axios";

import type {
  CitasPorEspecialidadApi,
  CorteDiarioApi,
  HorariosOcupadosApi,
} from "../types/reportesApi";

export const reportesService = {
  obtenerCitasPorEspecialidad: async (): Promise<CitasPorEspecialidadApi[]> => {
    const respuesta = await api.get<CitasPorEspecialidadApi[]>(
      "/reports/appointments-by-specialty",
    );

    return respuesta.data;
  },

  obtenerCorteDiario: async (date: string): Promise<CorteDiarioApi> => {
    const respuesta = await api.get<CorteDiarioApi>("/reports/daily-cutoff", {
      params: { date },
    });

    return respuesta.data;
  },

  obtenerHorariosOcupados: async (
    date: string,
  ): Promise<HorariosOcupadosApi> => {
    const respuesta = await api.get<HorariosOcupadosApi>(
      "/reports/booked-schedule",
      { params: { date } },
    );

    return respuesta.data;
  },
};
