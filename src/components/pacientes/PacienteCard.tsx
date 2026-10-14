import type { Paciente } from "../../types/paciente";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
}

export function PacienteCard({ paciente }: PacienteCardProps) {
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
        <span className="block rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-cyan-800">
          Ver detalle →
        </span>
      </div>
    </article>
  );
}
