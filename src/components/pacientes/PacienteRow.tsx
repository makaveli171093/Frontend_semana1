import type { Paciente, EstadoPaciente } from "../../types/paciente";
import { BadgeEstado } from "./BadgeEstado";
import { Link } from "react-router-dom";

interface PacienteRowProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
  onEditar: (paciente: Paciente) => void;
}

export function PacienteRow({
  paciente,
  onCambiarEstado,
  onEliminar,
  onEditar,
}: PacienteRowProps) {
  const iniciales = paciente.nombre.charAt(0) + paciente.apellido.charAt(0);

  const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;

  const fechaFormateada = new Date(
    `${paciente.ultimaCita}T12:00:00`,
  ).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      {/* Nombre e identificación */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-800 text-sm font-semibold shrink-0">
            {iniciales}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{nombreCompleto}</p>

            <p className="text-sm text-slate-500 break-all">{paciente.email}</p>
          </div>
        </div>
      </td>

      {/* Teléfono */}
      <td className="px-5 py-4 text-sm text-slate-700">{paciente.telefono}</td>

      {/* Especialidad */}
      <td className="px-5 py-4 text-sm text-slate-700">
        {paciente.especialidadAsignada}
      </td>

      {/* Última cita */}
      <td className="px-5 py-4 text-sm text-slate-500">{fechaFormateada}</td>

      {/* Estado */}

      <td className="px-5 py-4">
        <div className="flex flex-col items-start gap-2">
          <BadgeEstado estado={paciente.estado} />

          <select
            value={paciente.estado}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onCambiarEstado(paciente.id, e.target.value as EstadoPaciente)
            }
            aria-label={`Cambiar estado de ${nombreCompleto}`}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </div>
      </td>

      {/* Acciones: se implementarán más adelante */}
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          Eliminar
        </button>
        <button
          type="button"
          onClick={() => onEditar(paciente)}
          className="mr-2 inline-block rounded-lg border border-cyan-200 px-3 py-2 text-xs font-medium text-cyan-800 hover:bg-cyan-50"
        >
          Editar
        </button>
        <Link
          to={`/pacientes/${paciente.id}`}
          className="mr-2 inline-block rounded-lg border border-cyan-200 px-3 py-2 text-xs font-medium text-cyan-800 hover:bg-cyan-50"
        >
          Ver detalle →
        </Link>
      </td>
    </tr>
  );
}
