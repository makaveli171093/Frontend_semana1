import { api } from "../lib/axios";

import type {
  PacienteApi,
  CrearPacienteDTO,
  ActualizarPacienteDTO,
} from "../types/pacientesApi";

export const pacientesService = {
  listar: async (): Promise<PacienteApi[]> => {
    const respuesta = await api.get<PacienteApi[]>("/patients");
    return respuesta.data;
  },

  crear: async (datos: CrearPacienteDTO): Promise<PacienteApi> => {
    const respuesta = await api.post<PacienteApi>("/patients", datos);
    return respuesta.data;
  },

  actualizar: async (
    id: number,
    datos: ActualizarPacienteDTO,
  ): Promise<PacienteApi> => {
    const respuesta = await api.put<PacienteApi>(`/patients/${id}`, datos);

    return respuesta.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};
