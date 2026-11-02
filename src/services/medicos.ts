import { api } from "../lib/axios";
import type { RespuestaPaginada } from "../types/api";
import type { MedicoApi } from "../types/medicosApi";

export const medicosService = {
  listarTodos: async (signal?: AbortSignal): Promise<MedicoApi[]> => {
    const limite = 100;

    const primeraRespuesta = await api.get<RespuestaPaginada<MedicoApi>>(
      "/doctors",
      {
        params: { pagina: 1, limite },
        ...(signal ? { signal } : {}),
      },
    );

    const primeraPagina = primeraRespuesta.data;

    if (primeraPagina.totalPaginas <= 1) {
      return primeraPagina.data;
    }

    const paginasRestantes = Array.from(
      { length: primeraPagina.totalPaginas - 1 },
      (_, index) => index + 2,
    );

    const siguientesPaginas = await Promise.all(
      paginasRestantes.map(async (pagina) => {
        const respuesta = await api.get<RespuestaPaginada<MedicoApi>>(
          "/doctors",
          {
            params: { pagina, limite },
            ...(signal ? { signal } : {}),
          },
        );

        return respuesta.data.data;
      }),
    );

    return [...primeraPagina.data, ...siguientesPaginas.flat()];
  },
};
