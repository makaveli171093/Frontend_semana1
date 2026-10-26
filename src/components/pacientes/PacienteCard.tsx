import type { Paciente, EstadoPaciente } from "../../types/paciente";
import { BadgeEstado } from "./BadgeEstado";
import { Link } from "react-router-dom";

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
  onEditar: (paciente: Paciente) => void;
}

export function PacienteCard({
  paciente,
  onCambiarEstado,
  onEliminar,
  onEditar,
}: PacienteCardProps) {
  const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;

  const iniciales = paciente.nombre.charAt(0) + paciente.apellido.charAt(0);

  const fechaFormateada = new Date(
    `${paciente.ultimaCita}T12:00:00`,
  ).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 font-semibold text-cyan-800">
          {iniciales}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{nombreCompleto}</h3>

          <p className="mt-1 break-all text-sm text-slate-500">
            {paciente.email}
          </p>

          <div className="mt-3">
            <BadgeEstado estado={paciente.estado} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-slate-500">Teléfono</span>
          <span className="text-right text-slate-800">{paciente.telefono}</span>
        </div>

        <div className="flex justify-between gap-3 text-sm">
          <span className="text-slate-500">Especialidad</span>
          <span className="text-right text-slate-800">
            {paciente.especialidadAsignada}
          </span>
        </div>

        <div className="flex justify-between gap-3 text-sm">
          <span className="text-slate-500">Última cita</span>
          <span className="text-right text-slate-800">{fechaFormateada}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <label className="mb-2 block text-sm text-slate-600">
          Cambiar estado
        </label>

        <select
          value={paciente.estado}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onCambiarEstado(paciente.id, e.target.value as EstadoPaciente)
          }
          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>

        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="mt-3 w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Eliminar paciente
        </button>
        <button
          type="button"
          onClick={() => onEditar(paciente)}
          className="mt-3 w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Editar
        </button>
        <Link
          to={`/pacientes/${paciente.id}`}
          className="mb-3 block rounded-lg border border-cyan-200 px-4 py-3 text-center text-sm font-medium text-cyan-800 hover:bg-cyan-50"
        >
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
