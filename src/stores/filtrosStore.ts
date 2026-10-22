import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { EstadoCita } from "../services/citas";
import type { EstadoPaciente } from "../types/paciente";

interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCita | "Todos";
  estadoPacienteFiltro: EstadoPaciente | "Todos";

  setEstadoPaciente: (estado: EstadoPaciente | "Todos") => void;
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCita | "Todos") => void;
  resetFiltros: () => void;
}

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      queryPacientes: "",
      especialidadFiltro: "Todas",
      estadoCitaFiltro: "Todos",
      estadoPacienteFiltro: "Todos",

      setQueryPacientes: (query) =>
        set({ queryPacientes: query }, undefined, "filtros/setQueryPacientes"),

      setEspecialidad: (especialidad) =>
        set(
          { especialidadFiltro: especialidad },
          undefined,
          "filtros/setEspecialidad",
        ),

      setEstadoCita: (estado) =>
        set({ estadoCitaFiltro: estado }, undefined, "filtros/setEstadoCita"),

      resetFiltros: () =>
        set(
          {
            queryPacientes: "",
            especialidadFiltro: "Todas",
            estadoCitaFiltro: "Todos",
            estadoPacienteFiltro: "Todos",
          },
          undefined,
          "filtros/resetFiltros",
        ),
      setEstadoPaciente: (estado) =>
        set(
          { estadoPacienteFiltro: estado },
          undefined,
          "filtros/setEstadoPaciente",
        ),
    }),
    { name: "FiltrosStore" },
  ),
);
