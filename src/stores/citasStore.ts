import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  citasService,
  type CitaApi,
  type NuevoEstadoCita,
  type CrearCitaDTO,
} from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

interface CitasState {
  citas: CitaApi[];
  citaSeleccionada: CitaApi | null;
  cargando: boolean;
  error: string | null;
  actualizando: boolean;

  cargarPorPaciente: (id: number) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (id: number, estado: NuevoEstadoCita) => Promise<void>;
  agregarCita: (datos: CrearCitaDTO) => Promise<void>;
  cargarPorId: (id: number) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,
      actualizando: false,
      cargarPorPaciente: async (id) => {
        set({ cargando: true, error: null }, undefined, "citas/cargar/inicio");

        try {
          const citas = await citasService.obtenerPorPaciente(id);

          set(
            {
              citas,
              citaSeleccionada: null,
              cargando: false,
            },
            undefined,
            "citas/cargar/exito",
          );
        } catch (err: unknown) {
          set(
            {
              citas: [],
              citaSeleccionada: null,
              cargando: false,
              error: extraerMensajeError(err),
            },
            undefined,
            "citas/cargar/error",
          );
        }
      },

      seleccionar: (id) => {
        const cita = get().citas.find((c) => c.id === id);

        set({ citaSeleccionada: cita ?? null }, undefined, "citas/seleccionar");
      },

      actualizarEstado: async (id, estado) => {
        const anterior =
          get().citas.find((c) => c.id === id) ?? get().citaSeleccionada;

        if (!anterior || anterior.id !== id) {
          throw new Error("Cita no encontrada en el store");
        }

        if (anterior.status !== "PROGRAMADA") {
          throw new Error("La cita no está programada");
        }

        if (get().actualizando) {
          throw new Error("Ya existe una actualización en curso");
        }

        // Mostrar inmediatamente el nuevo estado.
        set(
          (s) => ({
            citas: s.citas.map((c) =>
              c.id === id ? { ...c, status: estado } : c,
            ),
            citaSeleccionada:
              s.citaSeleccionada?.id === id
                ? { ...s.citaSeleccionada, status: estado }
                : s.citaSeleccionada,
            actualizando: true,
          }),
          undefined,
          "citas/actualizar/optimista",
        );

        try {
          const confirmada = await citasService.actualizarEstado(id, estado);

          set(
            (s) => ({
              citas: s.citas.map((c) => (c.id === id ? confirmada : c)),
              citaSeleccionada:
                s.citaSeleccionada?.id === id ? confirmada : s.citaSeleccionada,
            }),
            undefined,
            "citas/actualizar/exito",
          );
        } catch (err: unknown) {
          // Restaurar el estado anterior si Express falla.
          set(
            (s) => ({
              citas: s.citas.map((c) => (c.id === id ? anterior : c)),
              citaSeleccionada:
                s.citaSeleccionada?.id === id ? anterior : s.citaSeleccionada,
            }),
            undefined,
            "citas/actualizar/reversion",
          );

          throw err;
        } finally {
          set({ actualizando: false }, undefined, "citas/actualizar/fin");
        }
      },

      agregarCita: async (datos) => {
        const nueva = await citasService.crear(datos);

        set(
          (s) => ({
            citas: [...s.citas, nueva],
          }),
          undefined,
          "citas/agregar",
        );
      },

      cargarPorId: async (id) => {
        set(
          {
            cargando: true,
            error: null,
            citaSeleccionada: null,
          },
          undefined,
          "citas/cargarPorId/inicio",
        );

        try {
          const cita = await citasService.obtenerPorId(id);

          set(
            (state) => ({
              citas: [...state.citas.filter((c) => c.id !== cita.id), cita],
              citaSeleccionada: cita,
              cargando: false,
            }),
            undefined,
            "citas/cargarPorId/exito",
          );
        } catch (err: unknown) {
          set(
            {
              cargando: false,
              error: extraerMensajeError(err),
            },
            undefined,
            "citas/cargarPorId/error",
          );

          throw err;
        }
      },
    }),
    {
      name: "CitasStore",
      enabled: import.meta.env.DEV,
    },
  ),
);
