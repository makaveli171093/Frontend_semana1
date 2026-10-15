import type { Paciente } from "../../types/paciente";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
}

export function PacienteRow({ paciente }: PacienteRowProps) {
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
        <BadgeEstado estado={paciente.estado} />
      </td>

      {/* Acciones: se implementarán más adelante */}
      <td className="px-5 py-4 text-right">
        <span className="inline-block rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-cyan-800">
          Ver detalle →
        </span>
      </td>
    </tr>
  );
}
