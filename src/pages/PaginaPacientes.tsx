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

export function PaginaPacientes() {
  const [busqueda, setBusqueda] = useState("");
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <ResumenPacientes pacientes={pacientesIniciales} />
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
              {pacientesIniciales.length} pacientes registrados
            </p>
          </div>

          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
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
              {pacientesIniciales.map((paciente) => (
                <PacienteRow key={paciente.id} paciente={paciente} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="flex flex-col gap-4 md:hidden">
          {pacientesIniciales.map((paciente) => (
            <PacienteCard key={paciente.id} paciente={paciente} />
          ))}
        </div>
      </div>
    </main>
  );
}
