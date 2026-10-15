/*
 * Análisis inicial del código generado por v0:
 *
 * 1. Se generó con Next.js, pero el proyecto requiere Vite.
 * 2. BuscadorPacientes no tenía las props value y onChange.
 * 3. El botón "Ver detalle" era visual, sin acción definida.
 *
 * Adaptación: componentes React + TypeScript + Tailwind CSS.
 */

import { pacientesIniciales } from "../data/pacientes";
import { PacienteRow } from "../components/pacientes/PacienteRow";
import { PacienteCard } from "../components/pacientes/PacienteCard";
import { useState } from "react";
import { BuscadorPacientes } from "../components/pacientes/BuscadorPacientes";
import { ResumenPacientes } from "../components/pacientes/ResumenPacientes";
import type { Paciente, EstadoPaciente } from "../types/paciente";
import {
  FormularioPaciente,
  type DatosNuevoPaciente,
} from "../components/pacientes/FormularioPaciente";

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesIniciales);

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

  const agregarPaciente = (datos: DatosNuevoPaciente) => {
    const nuevoPaciente: Paciente = {
      id: crypto.randomUUID(),
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      estado: datos.estado,
      telefono: "No registrado",
      especialidadAsignada: "Sin asignar",
      ultimaCita: new Date().toISOString().slice(0, 10),
    };

    setPacientes((prev) => [...prev, nuevoPaciente]);
  };

  const cambiarEstado = (id: string, nuevoEstado: EstadoPaciente) => {
    setPacientes((prev) =>
      prev.map((paciente) =>
        paciente.id === id ? { ...paciente, estado: nuevoEstado } : paciente,
      ),
    );
  };

  const eliminarPaciente = (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este paciente?",
    );

    if (!confirmar) return;

    setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <FormularioPaciente onAgregar={agregarPaciente} />

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
    </main>
  );
}
