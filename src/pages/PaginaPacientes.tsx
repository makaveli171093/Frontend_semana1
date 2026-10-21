/*
 * Análisis inicial del código generado por v0:
 *
 * 1. Se generó con Next.js, pero el proyecto requiere Vite.
 * 2. BuscadorPacientes no tenía las props value y onChange.
 * 3. El botón "Ver detalle" era visual, sin acción definida.
 *
 * Adaptación: componentes React + TypeScript + Tailwind CSS.
 */

import { PacienteRow } from "../components/pacientes/PacienteRow";
import { PacienteCard } from "../components/pacientes/PacienteCard";
import { useState, useEffect } from "react";
import { BuscadorPacientes } from "../components/pacientes/BuscadorPacientes";
import { ResumenPacientes } from "../components/pacientes/ResumenPacientes";
import type { Paciente, EstadoPaciente } from "../types/paciente";
import {
  FormularioPaciente,
  type DatosNuevoPaciente,
} from "../components/pacientes/FormularioPaciente";
import axios from "axios";
import { api } from "../lib/axios";
import type { PacienteApi } from "../types/pacientesApi";
import toast from "react-hot-toast";
import { pacientesService } from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";
import { ModalConfirmacion } from "../components/ui/ModalConfirmacion";

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

export function PaginaPacientes() {
  const [guardando, setGuardando] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(
    null,
  );

  const [eliminando, setEliminando] = useState(false);

  const [busqueda, setBusqueda] = useState<string>("");

  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPaciente | "Todos">(
    "Todos",
  );

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const coincideNombre = `${paciente.nombre} ${paciente.apellido}`
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    const coincideEstado =
      estadoFiltro === "Todos" || paciente.estado === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  const cargarPacientes = async () => {
    setCargando(true);
    setError(false);

    try {
      const respuesta = await api.get<PacienteApi[]>("/patients");

      if (!Array.isArray(respuesta.data)) {
        throw new Error("Formato de pacientes inválido");
      }

      const pacientesAdaptados = respuesta.data.map(adaptarPaciente);

      setPacientes(pacientesAdaptados);
    } catch (error: unknown) {
      if (!axios.isCancel(error)) {
        setError(true);
      }
    } finally {
      setCargando(false);
    }
  };

  const agregarPaciente = async (datos: DatosNuevoPaciente): Promise<void> => {
    setGuardando(true);

    try {
      const nuevoPaciente = await pacientesService.crear({
        firstName: datos.nombre.trim(),
        lastName: datos.apellido.trim(),
        email: datos.email.trim(),
        phone: datos.telefono.trim(),
        gender: datos.genero,
        birthDate: datos.fechaNacimiento,
      });

      setPacientes((anteriores) => [
        ...anteriores,
        adaptarPaciente(nuevoPaciente),
      ]);

      toast.success("Paciente registrado correctamente");
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = (id: string, nuevoEstado: EstadoPaciente) => {
    setPacientes((prev) =>
      prev.map((paciente) =>
        paciente.id === id ? { ...paciente, estado: nuevoEstado } : paciente,
      ),
    );
  };

  const eliminarPaciente = (id: string) => {
    const paciente = pacientes.find((item) => item.id === id);

    if (paciente) {
      setPacienteAEliminar(paciente);
    }
  };

  const confirmarEliminacion = async () => {
    if (!pacienteAEliminar || eliminando) return;

    setEliminando(true);

    try {
      await pacientesService.eliminar(Number(pacienteAEliminar.id));

      setPacientes((anteriores) =>
        anteriores.filter((paciente) => paciente.id !== pacienteAEliminar.id),
      );

      toast.success("Paciente desactivado correctamente");
      setPacienteAEliminar(null);
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    void cargarPacientes();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <FormularioPaciente onAgregar={agregarPaciente} guardando={guardando} />

      <ResumenPacientes pacientes={pacientes} />
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-cyan-800">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Gestión de Pacientes
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta y administración de pacientes registrados.
          </p>
        </header>
        {cargando && (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-6 text-center"
          >
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700" />
            <p className="text-slate-600">Cargando pacientes...</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
          >
            <p className="mb-4 text-red-700">
              No se pudieron obtener los pacientes.
            </p>

            <button
              type="button"
              onClick={() => void cargarPacientes()}
              className="rounded-lg bg-red-700 px-5 py-2 text-white hover:bg-red-800"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <>
            {/* Controles de búsqueda y filtros */}
            {/* Tabla de pacientes */}
            {/* Tarjetas móviles */}
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Listado de pacientes
                </h2>

                <p className="text-sm text-slate-500">
                  {pacientesFiltrados.length} paciente(s) encontrado(s)
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <BuscadorPacientes value={busqueda} onChange={setBusqueda} />

                <select
                  value={estadoFiltro}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEstadoFiltro(e.target.value as EstadoPaciente | "Todos")
                  }
                  aria-label="Filtrar por estado"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-cyan-600"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="en_espera">En espera</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setEstadoFiltro("Todos");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </>
        )}

        {/* Vista de escritorio */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Paciente</th>
                <th className="px-5 py-4">Teléfono</th>
                <th className="px-5 py-4">Especialidad</th>
                <th className="px-5 py-4">Última cita</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pacientesFiltrados.map((paciente) => (
                <PacienteRow
                  key={paciente.id}
                  paciente={paciente}
                  onCambiarEstado={cambiarEstado}
                  onEliminar={eliminarPaciente}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="flex flex-col gap-4 md:hidden">
          {pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onCambiarEstado={cambiarEstado}
              onEliminar={eliminarPaciente}
            />
          ))}
        </div>
      </div>

      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Desactivar paciente"
        mensaje={`¿Estás seguro de que deseas desactivar a ${
          pacienteAEliminar?.nombre ?? ""
        } ${pacienteAEliminar?.apellido ?? ""}?`}
        procesando={eliminando}
        onConfirmar={() => void confirmarEliminacion()}
        onCancelar={() => setPacienteAEliminar(null)}
      />
    </main>
  );
}
