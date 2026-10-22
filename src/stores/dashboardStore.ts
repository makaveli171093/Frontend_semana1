import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";

interface EstadisticasCitas {
  programadas: number;
  completadas: number;
}

interface DashboardState {
  totalPacientes: number;
  totalMedicos: number;
  estadisticasCitas: EstadisticasCitas | null;
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      totalPacientes: 0,
      totalMedicos: 0,
      estadisticasCitas: null,
      cargando: false,
      error: null,

      cargar: async () => {
        set(
          { cargando: true, error: null },
          undefined,
          "dashboard/cargar/inicio",
        );

        try {
          const [pacientes, medicos, citas] = await Promise.all([
            api.get<unknown[]>("/patients"),
            api.get<unknown[]>("/doctors"),
            api.get<EstadisticasCitas>("/reports/appointment-stats"),
          ]);

          if (!Array.isArray(pacientes.data) || !Array.isArray(medicos.data)) {
            throw new Error("Formato de respuesta inválido");
          }

          set(
            {
              totalPacientes: pacientes.data.length,
              totalMedicos: medicos.data.length,
              estadisticasCitas: citas.data,
              cargando: false,
            },
            undefined,
            "dashboard/cargar/exito",
          );
        } catch (err: unknown) {
          set(
            {
              error: extraerMensajeError(err),
              cargando: false,
            },
            undefined,
            "dashboard/cargar/error",
          );
        }
      },
    }),
    {
      name: "DashboardStore",
      enabled: import.meta.env.DEV,
    },
  ),
);
