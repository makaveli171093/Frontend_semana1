import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { pacientesService } from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";

import type { Paciente } from "../types/paciente";
import type {
  PacienteApi,
  CrearPacienteDTO,
  ActualizarPacienteDTO,
} from "../types/pacientesApi";

function adaptarPaciente(registro: PacienteApi): Paciente {
  return {
    id: String(registro.id),
    nombre: registro.firstName,
    apellido: registro.lastName,
    email: registro.email,
    telefono: registro.phone,
    especialidadAsignada: "Sin asignar",
    ultimaCita: "Sin información",
    estado: registro.isActive ? "activo" : "inactivo",
  };
}

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;

  cargar: (query?: string) => Promise<void>;
  crear: (datos: CrearPacienteDTO) => Promise<void>;
  actualizar: (id: number, datos: ActualizarPacienteDTO) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set, get) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set(
          { cargando: true, error: null },
          undefined,
          "pacientes/cargar/inicio",
        );

        try {
          const registros = await pacientesService.listar();

          if (!Array.isArray(registros)) {
            throw new Error("Respuesta de pacientes inválida");
          }

          const adaptados = registros.map(adaptarPaciente);

          const filtrados = query
            ? adaptados.filter((p) =>
                `${p.nombre} ${p.apellido}`
                  .toLowerCase()
                  .includes(query.trim().toLowerCase()),
              )
            : adaptados;

          set(
            {
              pacientes: filtrados,
              cargando: false,
              error: null,
            },
            undefined,
            "pacientes/cargar/exito",
          );
        } catch (err: unknown) {
          set(
            {
              cargando: false,
              error: extraerMensajeError(err),
            },
            undefined,
            "pacientes/cargar/error",
          );
        }
      },

      crear: async (datos) => {
        const registro = await pacientesService.crear(datos);
        const nuevoPaciente = adaptarPaciente(registro);

        set(
          (state) => ({
            pacientes: [...state.pacientes, nuevoPaciente],
          }),
          undefined,
          "pacientes/crear",
        );
      },

      actualizar: async (id, datos) => {
        const registro = await pacientesService.actualizar(id, datos);

        const actualizado = adaptarPaciente(registro);

        set(
          (state) => ({
            pacientes: state.pacientes.map((p) =>
              p.id === String(id) ? actualizado : p,
            ),
          }),
          undefined,
          "pacientes/actualizar",
        );
      },

      eliminar: async (id) => {
        await pacientesService.eliminar(id);

        // Recargar respeta los permisos del usuario:
        // GERENCIA puede ver registros inactivos.
        await get().cargar();

        set({}, undefined, "pacientes/eliminar");
      },
    }),
    {
      name: "PacientesStore",
      enabled: import.meta.env.DEV,
    },
  ),
);
